/**
 * Code Explorer browser application
 *
 * This module owns the visible application state and presentation logic. It
 * initializes the editor, sends source code to the isolated Python worker,
 * converts trace snapshots into beginner-friendly descriptions, and updates
 * the workspace without a framework. Keeping these responsibilities in one
 * module makes the MVP easy for a new contributor to follow from top to bottom.
 */

/**
 * The initial program shown in the editor.
 *
 * It deliberately demonstrates assignment, a for loop, mutation through an
 * augmented assignment, and console output so every major MVP panel has data.
 */
const DEFAULT_CODE = `total = 0

for number in range(1, 4):
    total += number
    print("Added", number)

print("Total:", total)`;

/**
 * The browser-storage key used for the learner's latest Python source.
 * A project-specific prefix prevents collisions with unrelated pages on the same origin.
 */
const SOURCE_STORAGE_KEY = "code-explorer-source";

/**
 * The browser-storage key for editor-only display preferences.
 * Keeping it separate from source code lets either value evolve independently.
 */
const EDITOR_PREFERENCES_STORAGE_KEY = "code-explorer-editor-preferences";

/**
 * The browser-storage key for independently remembered graph magnifications.
 * A separate key keeps graph presentation unrelated to editor preferences.
 */
const GRAPH_ZOOM_STORAGE_KEY = "code-explorer-graph-zoom";

/**
 * Safe defaults closely match the original editor presentation.
 * Wrapping starts enabled for beginner-friendly viewing, and fourteen pixels
 * preserves the previous visual size while remaining a clear numeric choice.
 */
const DEFAULT_EDITOR_PREFERENCES = Object.freeze({ wrap: true, fontSize: 14 });

/**
 * Maximum wall-clock time allowed for one Python execution in the worker.
 * Thirty seconds supports larger learning programs without leaving runaway code active indefinitely.
 */
const EXECUTION_TIMEOUT_MS = 30_000;

/**
 * Reads the last saved program while safely handling browsers that block storage.
 * The bundled starter remains the fallback for first visits and restricted environments.
 * @returns {string} Saved Python source or the default learning example.
 */
function loadSavedCode() {
  try {
    return localStorage.getItem(SOURCE_STORAGE_KEY) ?? DEFAULT_CODE;
  } catch (error) {
    console.warn("Code Explorer could not read saved source.", error);
    return DEFAULT_CODE;
  }
}

/**
 * Saves the current program after every edit so a page reload cannot erase it.
 * Storage failures are non-fatal because the editor must remain usable in privacy modes.
 * @param {string} code Complete Python source currently owned by the editor.
 */
function saveCode(code) {
  try {
    localStorage.setItem(SOURCE_STORAGE_KEY, code);
  } catch (error) {
    console.warn("Code Explorer could not save the current source.", error);
  }
}

/**
 * Restores validated editor display preferences from browser storage.
 * Unknown font sizes are rejected so edited storage cannot produce an unusable editor.
 * @returns {{wrap: boolean, fontSize: number}} Safe wrapping and font-size settings.
 */
function loadEditorPreferences() {
  try {
    // Parse the stored object only when the key exists.
    const stored = JSON.parse(localStorage.getItem(EDITOR_PREFERENCES_STORAGE_KEY) || "null");
    // The allowed list exactly mirrors the options presented in workspace.html.
    const allowedFontSizes = [12, 14, 16, 18, 20, 22];
    // Accept only an explicit boolean so strings such as "false" are not misread as true.
    const wrap = typeof stored?.wrap === "boolean" ? stored.wrap : DEFAULT_EDITOR_PREFERENCES.wrap;
    // Convert a valid stored number while falling back safely for missing or modified data.
    const fontSize = allowedFontSizes.includes(Number(stored?.fontSize))
      ? Number(stored.fontSize)
      : DEFAULT_EDITOR_PREFERENCES.fontSize;
    return { wrap, fontSize };
  } catch (error) {
    // Storage or JSON failures must never prevent the editor from loading.
    console.warn("Code Explorer could not read editor preferences.", error);
    return { ...DEFAULT_EDITOR_PREFERENCES };
  }
}

/**
 * Persists the current editor presentation without touching the learner's code.
 * Storage failures remain non-fatal for privacy-focused browser configurations.
 */
function saveEditorPreferences() {
  try {
    localStorage.setItem(EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify(state.editorPreferences));
  } catch (error) {
    console.warn("Code Explorer could not save editor preferences.", error);
  }
}

/**
 * Restores user-selected zoom percentages for both graph modes.
 * Null means the graph should keep Cytoscape's automatic fitted scale until
 * the learner deliberately uses a zoom control.
 * @returns {{references: number|null, flow: number|null}} Valid saved percentages.
 */
function loadGraphZoomPreferences() {
  try {
    // Missing storage produces null so first-time graph layout remains content-aware.
    const stored = JSON.parse(localStorage.getItem(GRAPH_ZOOM_STORAGE_KEY) || "null");
    // Accept only finite percentages inside the same limits exposed by the sliders.
    const validZoom = (value) => Number.isFinite(Number(value)) && Number(value) >= 40 && Number(value) <= 200
      ? Number(value)
      : null;
    return {
      references: validZoom(stored?.references),
      flow: validZoom(stored?.flow),
    };
  } catch (error) {
    // Invalid JSON or restricted storage should never block graph rendering.
    console.warn("Code Explorer could not read graph zoom preferences.", error);
    return { references: null, flow: null };
  }
}

/**
 * Saves the two graph zoom percentages after an intentional zoom interaction.
 * @param {{references: number|null, flow: number|null}} preferences Current graph zoom state.
 */
function saveGraphZoomPreferences(preferences) {
  try {
    localStorage.setItem(GRAPH_ZOOM_STORAGE_KEY, JSON.stringify(preferences));
  } catch (error) {
    console.warn("Code Explorer could not save graph zoom preferences.", error);
  }
}

/**
 * Curated programs displayed by the Examples dialog.
 *
 * Each object contains presentation metadata plus the exact Python source to
 * place in the editor. Keeping the examples as data avoids duplicating dialog
 * markup and makes a new example a small, reviewable addition.
 */
const EXAMPLES = [
  {
    topic: "Variables",
    title: "A tiny calculation",
    description: "Watch names appear and values move through an expression.",
    code: `price = 8
quantity = 3
total = price * quantity
print("Total:", total)`,
  },
  {
    topic: "For loop",
    title: "Running total",
    description: "See an accumulator change during each loop iteration.",
    code: DEFAULT_CODE,
  },
  {
    topic: "While loop",
    title: "Countdown",
    description: "Follow a condition and changing counter until the loop ends.",
    code: `count = 3

while count > 0:
    print(count)
    count -= 1

print("Lift off!")`,
  },
  {
    topic: "Conditions",
    title: "Pass or try again",
    description: "See which path Python chooses after checking a condition.",
    code: `score = 72

if score >= 50:
    result = "Pass"
else:
    result = "Try again"

print(result)`,
  },
  {
    topic: "Functions",
    title: "A function call",
    description: "Watch a local frame appear, calculate, and return a value.",
    code: `def double(number):
    result = number * 2
    return result

answer = double(4)
print(answer)`,
  },
  {
    topic: "Lists",
    title: "Growing a list",
    description: "Observe a list as values are appended inside a loop.",
    code: `squares = []

for number in range(1, 4):
    squares.append(number * number)

print(squares)`,
  },
];

/**
 * Cached references to every interactive or dynamically updated DOM element.
 *
 * Looking up each id once is both faster and easier to audit than scattering
 * document.getElementById calls throughout rendering functions. The resulting
 * object uses the id as its property name, such as els.runButton.
 */
const els = Object.fromEntries(
  [
    "runtimeStatus", "runtimeLabel", "themeButton", "themeIcon", "welcomeScreen", "workspace",
    "heroExampleButton", "backButton", "examplesButton", "runButton", "stopButton",
    "editor", "editorShell", "editorWrapButton", "editorFontSizeSelect", "editorCopyButton", "editorPasteButton",
    "codeStats", "storyTab", "variablesTab", "referencesTab", "flowTab",
    "loopTab", "loopBadge", "storyView", "variablesView", "referencesView", "flowView", "loopView",
    "emptyStory", "traceContent", "traceKicker", "executedCode", "explanation", "changeList",
    "stepOutputSection", "stepOutput", "variablesGrid", "callStackSection", "callStack",
    "emptyVariables", "variablesContent", "scopeBrowser", "variableInspector", "emptyReferences",
    "referencesContent", "referencesGraph", "referencesZoomSlider", "referencesZoomValue",
    "decreaseReferencesZoomButton", "increaseReferencesZoomButton", "fitReferencesButton",
    "emptyFlow", "flowContent", "flowGraph", "flowZoomSlider", "flowZoomValue",
    "decreaseFlowZoomButton", "increaseFlowZoomButton", "fitFlowButton", "emptyLoop", "loopContent", "loopType",
    "iterationCount", "loopSource", "loopMeter", "iterationList", "stepCount", "previousButton",
    "playButton", "nextButton", "restartButton", "stepSlider", "progressPercent", "speedSelect",
    "consoleOutput", "clearOutputButton", "examplesDialog", "closeExamplesButton", "exampleGrid", "toast",
  ].map((id) => [id, document.getElementById(id)]),
);

/**
 * Mutable application state shared by the small controller functions below.
 *
 * UI state, worker state, trace data, and timer handles live together so every
 * transition can be understood without a framework-specific state container.
 */
const state = {
  // Holds the enhanced CodeMirror instance when its CDN modules load successfully.
  editorView: null,
  // Holds the native textarea used when CodeMirror cannot be downloaded.
  fallbackEditor: null,
  // Restores saved source before either editor implementation is mounted.
  code: loadSavedCode(),
  // Restores wrapping and font size independently from the saved Python source.
  editorPreferences: loadEditorPreferences(),
  // Holds CodeMirror's dynamic wrapping compartment after its modules load.
  editorConfiguration: null,
  // References the Web Worker that owns Pyodide and runs untrusted learner code.
  worker: null,
  // Resolves only after Pyodide reports that the Python runtime is usable.
  workerReady: null,
  // These callbacks settle workerReady from asynchronous worker events.
  resolveWorkerReady: null,
  rejectWorkerReady: null,
  // Prevents duplicate runs and controls the Run and Stop button states.
  running: false,
  // Distinguishes fresh worker responses from results belonging to an older run.
  runId: 0,
  // Cancels code that exceeds the outer wall-clock safety limit.
  runTimeout: null,
  // Stores the ordered execution snapshots returned by the Python tracer.
  trace: [],
  // Stores static metadata for each for or while loop found in the source AST.
  loops: [],
  // Stores if-branch boundaries used to explain observed true and false paths.
  conditions: [],
  // Retains the most recent syntax or runtime error for final-step rendering.
  error: null,
  // Identifies the trace snapshot currently displayed to the learner.
  currentStep: 0,
  // Indicates whether automatic playback is advancing through the trace.
  playing: false,
  // Holds the playback timer so pause and speed changes can cancel it safely.
  playTimer: null,
  // Records which explanatory tab is visible without changing trace state.
  activePanel: "story",
  // Remembers the variable selected in the detailed inspector across trace steps.
  selectedVariable: null,
  // Holds the lazily loaded Cytoscape constructor used by both graph views.
  graphLibrary: null,
  // Reuses one graph instance for the active reference map instead of leaking canvases.
  referencesGraph: null,
  // Reuses one graph instance for the observed execution-flow visualization.
  flowGraph: null,
  // Remembers deliberate magnifications separately while allowing automatic first-use fitting.
  graphZoom: loadGraphZoomPreferences(),
  // Stores the CodeMirror effect and field helpers used to paint executed lines.
  heatmap: null,
  // Holds the dismissal timer for the temporary toast notification.
  toastTimer: null,
};

/**
 * Chooses the theme used during startup.
 * A saved explicit choice wins over the operating-system preference so returning learners see a stable interface.
 * @returns {"light"|"dark"} The theme name that should be applied.
 */
function preferredTheme() {
  const saved = localStorage.getItem("code-explorer-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/**
 * Applies and persists one of the two supported color themes.
 * The data attribute lets CSS variables swap the whole palette, while the button label and glyph are updated for accessibility.
 * @param {"light"|"dark"} theme The theme that should become active.
 */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("code-explorer-theme", theme);
  if (els.themeIcon) els.themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  els.themeButton?.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
}

/**
 * Switches between light and dark themes.
 * This is intentionally a tiny adapter so the click handler does not need to know how theme persistence works.
 */
function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
  // Rebuilding only the visible graph refreshes its palette without doing hidden work.
  if (state.activePanel === "references") renderReferenceMap();
  if (state.activePanel === "flow") renderFlowMap();
}

/**
 * Recalculates the line and character counts displayed below the editor.
 * The function reads through getCode so it works for both CodeMirror and the native textarea fallback.
 */
function updateCodeStats() {
  if (!els.codeStats) return;
  const code = getCode();
  const lines = code ? code.split("\n").length : 0;
  els.codeStats.textContent = `${lines} line${lines === 1 ? "" : "s"} · ${code.length} chars`;
}

/**
 * Applies editor preferences to the controls, CodeMirror, and textarea fallback.
 * A CodeMirror compartment changes wrapping without rebuilding the editor or losing selection.
 * @param {boolean} reconfigure Whether an existing CodeMirror instance should receive a new wrapping extension.
 */
function applyEditorPreferences(reconfigure = true) {
  // A CSS custom property updates CodeMirror and the fallback editor together.
  els.editorShell?.style.setProperty("--editor-font-size", `${state.editorPreferences.fontSize}px`);
  // The button's label gives sighted users immediate confirmation of the active state.
  if (els.editorWrapButton) {
    els.editorWrapButton.textContent = state.editorPreferences.wrap ? "Wrap on" : "Wrap off";
    els.editorWrapButton.setAttribute("aria-pressed", String(state.editorPreferences.wrap));
    els.editorWrapButton.title = state.editorPreferences.wrap
      ? "Turn editor text wrapping off"
      : "Turn editor text wrapping on";
  }
  // Synchronizing the select also handles preferences restored before event binding.
  if (els.editorFontSizeSelect) {
    els.editorFontSizeSelect.value = String(state.editorPreferences.fontSize);
  }
  // The native textarea uses its wrap attribute plus white-space rules to match CodeMirror.
  if (state.fallbackEditor) {
    state.fallbackEditor.wrap = state.editorPreferences.wrap ? "soft" : "off";
    state.fallbackEditor.classList.toggle("wrap-disabled", !state.editorPreferences.wrap);
  }
  // Reconfigure only after CodeMirror has supplied both the compartment and extension.
  if (reconfigure && state.editorView && state.editorConfiguration) {
    const wrappingExtension = state.editorPreferences.wrap
      ? state.editorConfiguration.lineWrapping
      : [];
    state.editorView.dispatch({
      effects: state.editorConfiguration.wrapCompartment.reconfigure(wrappingExtension),
    });
  }
  // Font metrics affect line widths and gutter geometry, so ask CodeMirror to
  // measure again after the CSS variable changes instead of waiting for resize.
  state.editorView?.requestMeasure();
}

/**
 * Flips editor wrapping, saves the choice, and updates the mounted editor in place.
 */
function toggleEditorWrapping() {
  state.editorPreferences.wrap = !state.editorPreferences.wrap;
  saveEditorPreferences();
  applyEditorPreferences();
}

/**
 * Validates and applies a font size selected from the editor toolbar.
 * @param {string|number} requestedSize Candidate pixel size from the native select.
 */
function changeEditorFontSize(requestedSize) {
  // Reusing the same allow-list as loading protects calls made outside the select element.
  const allowedFontSizes = [12, 14, 16, 18, 20, 22];
  const fontSize = Number(requestedSize);
  if (!allowedFontSizes.includes(fontSize)) return;
  state.editorPreferences.fontSize = fontSize;
  saveEditorPreferences();
  // Font size is CSS-driven, but the shared application function also keeps controls synchronized.
  applyEditorPreferences(false);
}

/**
 * Loads CodeMirror from the CDN and mounts the Python editor.
 * If any module fails to load, the catch branch creates a fully usable textarea so a network problem never blocks the core experience.
 * @returns {Promise<void>} Resolves after either editor implementation is ready.
 */
async function initializeEditor() {
  try {
    // CodeMirror is modular, so the editor, Python grammar, highlighting bridge,
    // and stable token-class mapping are downloaded together before mounting.
    const [
      { basicSetup, EditorView },
      { python },
      { syntaxHighlighting },
      { classHighlighter },
      { Decoration },
      { Compartment, StateEffect, StateField },
    ] = await Promise.all([
      // The dependency query pins shared language and tag modules. Highlight
      // tags rely on object identity, so all packages must receive one copy.
      import("https://esm.sh/codemirror@6.0.2?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.6,@codemirror/language@6.12.4,@lezer/highlight@1.2.3"),
      import("https://esm.sh/@codemirror/lang-python@6.2.1?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.6,@codemirror/language@6.12.4,@lezer/highlight@1.2.3"),
      import("https://esm.sh/@codemirror/language@6.12.4?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.6,@lezer/highlight@1.2.3"),
      import("https://esm.sh/@lezer/highlight@1.2.3"),
      import("https://esm.sh/@codemirror/view@6.43.6?deps=@codemirror/state@6.7.1"),
      import("https://esm.sh/@codemirror/state@6.7.1"),
    ]);

    // This state effect replaces all execution-line decorations in one transaction.
    const setHeatmapEffect = StateEffect.define();
    // The field retains decorations while ordinary editor transactions map their positions.
    const heatmapField = StateField.define({
      create: () => Decoration.none,
      update: (decorations, transaction) => {
        let next = decorations.map(transaction.changes);
        transaction.effects.forEach((effect) => {
          if (effect.is(setHeatmapEffect)) next = effect.value;
        });
        return next;
      },
      provide: (field) => EditorView.decorations.from(field),
    });
    // Rendering code stores the constructors without coupling the rest of the app to imports.
    state.heatmap = { Decoration, setHeatmapEffect };
    // A compartment makes line wrapping replaceable after the editor is mounted.
    const wrapCompartment = new Compartment();
    // Store the imported extension so ordinary preference handlers stay library-agnostic.
    state.editorConfiguration = { wrapCompartment, lineWrapping: EditorView.lineWrapping };

    state.editorView = new EditorView({
      doc: state.code,
      extensions: [
        basicSetup,
        python(),
        // classHighlighter adds stable tok-* classes that our theme-aware CSS controls.
        syntaxHighlighting(classHighlighter),
        // The heatmap field paints executed, repeated, and currently selected lines.
        heatmapField,
        // Start with the restored wrapping choice without creating a second editor instance.
        wrapCompartment.of(state.editorPreferences.wrap ? EditorView.lineWrapping : []),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            state.code = update.state.doc.toString();
            saveCode(state.code);
            updateCodeStats();
            if (state.trace.length) clearTrace();
          }
        }),
      ],
      parent: els.editor,
    });
    renderEditorHeatmap();
  } catch (error) {
    // Preserve the underlying module or extension error for contributors debugging CDN changes.
    console.error("Code Explorer enhanced editor initialization failed.", error);
    const textarea = document.createElement("textarea");
    textarea.className = "fallback-editor";
    textarea.value = state.code;
    textarea.spellcheck = false;
    textarea.setAttribute("aria-label", "Python code editor");
    textarea.addEventListener("input", () => {
      state.code = textarea.value;
      saveCode(state.code);
      updateCodeStats();
      if (state.trace.length) clearTrace();
    });
    els.editor.replaceChildren(textarea);
    state.fallbackEditor = textarea;
    // Apply wrapping to the newly mounted fallback before it becomes interactive.
    applyEditorPreferences(false);
    showToast("The enhanced editor could not load. The basic editor is ready instead.");
  }
  // Synchronize CSS sizing and toolbar state after either editor implementation mounts.
  applyEditorPreferences(false);
  updateCodeStats();
}

/**
 * Returns the latest Python source from whichever editor is active.
 * The state copy is used only during the short period before an editor has mounted.
 * @returns {string} The complete source currently visible to the learner.
 */
function getCode() {
  if (state.editorView) return state.editorView.state.doc.toString();
  if (state.fallbackEditor) return state.fallbackEditor.value;
  return state.code;
}

/**
 * Replaces all editor content with a selected example or supplied program.
 * The operation updates CodeMirror through a transaction, synchronizes statistics, and clears any trace that belongs to older source.
 * @param {string} code The Python source that should replace the current document.
 */
function setCode(code) {
  state.code = code;
  saveCode(code);
  if (state.editorView) {
    state.editorView.dispatch({
      changes: { from: 0, to: state.editorView.state.doc.length, insert: code },
      selection: { anchor: 0 },
    });
  } else if (state.fallbackEditor) {
    state.fallbackEditor.value = code;
  }
  updateCodeStats();
  if (els.workspace) clearTrace();
}

/**
 * Copies text through a temporary native textarea when the modern Clipboard API is unavailable.
 * This legacy path mainly supports local file previews and older browser configurations.
 * @param {string} text Complete Python source that should reach the system clipboard.
 * @returns {boolean} Whether the browser reported a successful copy operation.
 */
function copyTextWithNativeFallback(text) {
  // Preserve the control that held focus before creating the hidden copy surface.
  const previouslyFocused = document.activeElement;
  // The temporary control must be part of the document for selection-based copy to work.
  const textarea = document.createElement("textarea");
  // Assigning through value preserves source whitespace without interpreting markup.
  textarea.value = text;
  // Remove the control from visual layout and accessibility navigation while it exists.
  textarea.setAttribute("aria-hidden", "true");
  textarea.tabIndex = -1;
  // Fixed positioning prevents the browser from scrolling to the temporary selection.
  textarea.style.position = "fixed";
  textarea.style.inset = "0 auto auto 0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  // Selection occurs synchronously inside the original button activation.
  textarea.focus();
  textarea.select();
  let copied = false;
  try {
    // execCommand is retained only as a compatibility fallback for clipboard writing.
    copied = document.execCommand("copy");
  } catch (error) {
    console.warn("Code Explorer native copy fallback failed.", error);
  }
  // Removing the temporary element returns focus handling to the visible interface.
  textarea.remove();
  // Restore focus without scrolling so fallback copying feels identical to modern copying.
  previouslyFocused?.focus?.({ preventScroll: true });
  return copied;
}

/**
 * Copies the complete editor document rather than only the current selection.
 * A native fallback keeps Copy useful in some local or older browser contexts.
 * @returns {Promise<void>} Resolves after success or a visible failure message.
 */
async function copyCompleteEditor() {
  const code = getCode();
  // Avoid silently clearing an existing clipboard when the editor has no content.
  if (!code) {
    showToast("The editor is empty. There is nothing to copy.");
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      // Modern clipboard writing is asynchronous and requires a trusted button action.
      await navigator.clipboard.writeText(code);
    } else if (!copyTextWithNativeFallback(code)) {
      // A false result indicates that neither available copy mechanism succeeded.
      throw new Error("No clipboard writing method is available.");
    }
    const lineCount = code.split("\n").length;
    showToast(`Copied the complete program (${lineCount} line${lineCount === 1 ? "" : "s"}).`);
  } catch (error) {
    // Some browsers reject the modern API but still permit selection-based copying.
    if (copyTextWithNativeFallback(code)) {
      showToast("Copied the complete program.");
      return;
    }
    console.warn("Code Explorer could not copy editor source.", error);
    showToast("Copy was blocked. Select the editor and use Ctrl+C instead.", true);
  }
}

/**
 * Reads plain text from the system clipboard and replaces the complete editor document.
 * setCode preserves autosave, source statistics, undo history, and stale-trace cleanup.
 * @returns {Promise<void>} Resolves after paste or a visible permission message.
 */
async function pasteCompleteEditor() {
  try {
    // Reading is intentionally called directly from the button event for transient activation.
    if (!navigator.clipboard?.readText) {
      throw new Error("Clipboard reading is unavailable in this browser context.");
    }
    const clipboardText = await navigator.clipboard.readText();
    // An empty clipboard should not unexpectedly erase a learner's current program.
    if (!clipboardText) {
      showToast("The clipboard contains no text to paste.");
      return;
    }
    // The shared replacement path works for CodeMirror and its native fallback editor.
    setCode(clipboardText);
    const lineCount = clipboardText.split("\n").length;
    showToast(`Pasted a complete program (${lineCount} line${lineCount === 1 ? "" : "s"}).`);
    // Returning focus lets the learner continue typing or immediately undo the paste.
    state.editorView?.focus();
    state.fallbackEditor?.focus();
  } catch (error) {
    console.warn("Code Explorer could not read clipboard text.", error);
    // A modal alert guarantees that a blocked clipboard permission cannot be
    // missed while the learner is concentrating on the editor or another panel.
    window.alert(
      "Clipboard permission is blocked.\n\nAllow clipboard access for this site and try Paste again. You can also focus the editor and press Ctrl+V.",
    );
    // Keep the non-modal toast after dismissal so the recovery instruction
    // remains visible while the learner changes browser permissions or pastes manually.
    showToast("Paste permission was blocked. Focus the editor and use Ctrl+V instead.", true);
  }
}

/**
 * Moves the CodeMirror cursor to the line represented by the active trace step.
 * The requested number is clamped to the document so malformed error metadata cannot create an invalid selection.
 * @param {number} lineNumber One-based Python source line number.
 */
function focusLine(lineNumber) {
  if (!state.editorView || !lineNumber) return;
  const safeLine = Math.max(1, Math.min(lineNumber, state.editorView.state.doc.lines));
  const line = state.editorView.state.doc.line(safeLine);
  // Updating the selection without CodeMirror's scrollIntoView flag prevents
  // the editor from scrolling the surrounding browser page. This is essential
  // when a learner is watching a graph positioned below the editor.
  state.editorView.dispatch({
    selection: { anchor: line.from },
  });
  // Scroll only CodeMirror's dedicated viewport, using an immediate movement
  // so the code follows execution without animating the rest of the workspace.
  const lineBlock = state.editorView.lineBlockAt(line.from);
  const editorScroller = state.editorView.scrollDOM;
  const centeredTop = Math.max(0, lineBlock.top - ((editorScroller.clientHeight - lineBlock.height) / 2));
  editorScroller.scrollTo({ top: centeredTop, behavior: "auto" });
}

/**
 * Paints executed source lines with intensity based on visit count and marks the active line.
 * Decorations are derived from the complete trace, so loops become visible without changing editor text.
 */
function renderEditorHeatmap() {
  if (!state.editorView || !state.heatmap) return;
  const counts = new Map();
  state.trace.forEach((step) => counts.set(step.line, (counts.get(step.line) || 0) + 1));
  const maximum = Math.max(1, ...counts.values());
  const currentLine = state.trace[state.currentStep]?.line;
  const ranges = [];
  counts.forEach((count, lineNumber) => {
    if (lineNumber < 1 || lineNumber > state.editorView.state.doc.lines) return;
    const line = state.editorView.state.doc.line(lineNumber);
    const intensity = Math.max(1, Math.min(3, Math.ceil((count / maximum) * 3)));
    const activeClass = lineNumber === currentLine ? " cm-trace-current" : "";
    ranges.push(state.heatmap.Decoration.line({
      attributes: {
        class: `cm-trace-line cm-trace-intensity-${intensity}${activeClass}`,
        title: `Executed ${count} time${count === 1 ? "" : "s"}`,
      },
    }).range(line.from));
  });
  ranges.sort((first, second) => first.from - second.from);
  const decorationSet = state.heatmap.Decoration.set(ranges, true);
  state.editorView.dispatch({ effects: state.heatmap.setHeatmapEffect.of(decorationSet) });
}

/**
 * Returns to the dedicated landing page without discarding saved source.
 * Automatic playback is paused before navigation so no timer survives the transition.
 */
function showWelcome() {
  pausePlayback();
  window.location.assign("index.html");
}

/**
 * Updates the shared runtime indicator in the site header.
 * Both the modifier class and readable label change so state is conveyed by more than color alone.
 * @param {string} status CSS state name such as loading, ready, or error.
 * @param {string} label Human-readable runtime status.
 */
function setRuntimeStatus(status, label) {
  if (!els.runtimeStatus || !els.runtimeLabel) return;
  els.runtimeStatus.className = `runtime-status ${status}`;
  els.runtimeLabel.textContent = label;
}

/**
 * Creates the Python Web Worker once and returns its readiness promise.
 * Message and error listeners connect the isolated runtime to this UI controller. Later callers reuse the same worker until it is intentionally destroyed.
 * @returns {Promise<void>} Resolves when Pyodide has finished loading.
 */
function ensureWorker() {
  if (state.worker) return state.workerReady;

  setRuntimeStatus("loading", "Loading Python");
  state.workerReady = new Promise((resolve, reject) => {
    state.resolveWorkerReady = resolve;
    state.rejectWorkerReady = reject;
  });

  state.worker = new Worker("py-worker.js", { type: "module" });
  state.worker.addEventListener("message", handleWorkerMessage);
  state.worker.addEventListener("error", (event) => {
    const message = event.message || "Python worker failed to load.";
    state.rejectWorkerReady?.(new Error(message));
    setRuntimeStatus("error", "Runtime error");
    finishRunning();
    showError(message);
  });
  return state.workerReady;
}

/**
 * Terminates the current Python worker and clears every related handle.
 * A later run can call ensureWorker to create a clean runtime after cancellation or failure.
 */
function destroyWorker() {
  if (state.worker) state.worker.terminate();
  state.worker = null;
  state.workerReady = null;
  state.resolveWorkerReady = null;
  state.rejectWorkerReady = null;
  window.clearTimeout(state.runTimeout);
}

/**
 * Routes typed messages received from the Python worker.
 * Readiness messages settle startup, result messages populate the visualizer, and stale run identifiers are ignored.
 * @param {MessageEvent} event Browser event containing the worker message payload.
 */
function handleWorkerMessage(event) {
  const message = event.data;
  if (message.type === "ready") {
    setRuntimeStatus("ready", "Python ready");
    state.resolveWorkerReady?.();
    return;
  }
  if (message.type === "init-error") {
    setRuntimeStatus("error", "Runtime unavailable");
    state.rejectWorkerReady?.(new Error(message.error));
    showError(`Python could not load. ${message.error}`);
    return;
  }
  if (message.runId !== state.runId) return;
  if (message.type === "result") {
    window.clearTimeout(state.runTimeout);
    finishRunning();
    loadResult(message.result);
  } else if (message.type === "run-error") {
    window.clearTimeout(state.runTimeout);
    finishRunning();
    showError(message.error);
  }
}

/**
 * Validates the editor source and starts a traced Python execution.
 * The function waits for Pyodide, switches the controls into a running state, sends a unique run id, and establishes an outer timeout.
 * @returns {Promise<void>} Resolves after the run request is sent or startup fails.
 */
async function runCode() {
  const source = getCode().trimEnd();
  if (!source.trim()) {
    showToast("Add some Python code first.", true);
    return;
  }

  pausePlayback();
  state.running = true;
  state.runId += 1;
  els.runButton.disabled = true;
  els.runButton.querySelector(".button-ready").classList.add("hidden");
  els.runButton.querySelector(".button-loading").classList.remove("hidden");
  els.stopButton.classList.remove("hidden");
  setConsole("// Preparing a safe Python trace...", "muted");

  try {
    await ensureWorker();
    state.worker.postMessage({ type: "run", runId: state.runId, source });
    state.runTimeout = window.setTimeout(() => {
      stopExecution("Execution time limit reached: the program was stopped after 30 seconds. Check for an infinite loop or reduce the amount of work.");
    }, EXECUTION_TIMEOUT_MS);
  } catch (error) {
    finishRunning();
    showError(`Python could not start. ${error.message}`);
  }
}

/**
 * Restores the Run controls after any successful, failed, or cancelled execution.
 * Keeping this transition centralized prevents the loading and stop buttons from becoming inconsistent.
 */
function finishRunning() {
  state.running = false;
  els.runButton.disabled = false;
  els.runButton.querySelector(".button-ready").classList.remove("hidden");
  els.runButton.querySelector(".button-loading").classList.add("hidden");
  els.stopButton.classList.add("hidden");
}

/**
 * Cancels execution by terminating the entire worker.
 * Worker termination is reliable even when learner code is trapped in a synchronous infinite loop.
 * @param {string} reason Explanation displayed in both the console and toast.
 */
function stopExecution(reason = "Execution stopped.") {
  state.runId += 1;
  destroyWorker();
  finishRunning();
  setRuntimeStatus("", "Runtime offline");
  showError(reason);
  showToast(reason, true);
}

/**
 * Loads a completed worker result into application state and enables playback.
 * Syntax-only failures use the error path, while successful traces initialize the slider, tabs, and first visual snapshot.
 * @param {object} result Serialized trace, loop metadata, output, and optional error.
 */
function loadResult(result) {
  state.trace = result.steps || [];
  state.loops = result.loops || [];
  state.conditions = result.conditions || [];
  state.error = result.error || null;
  state.currentStep = 0;
  state.selectedVariable = null;
  els.loopBadge.textContent = String(state.loops.length);

  if (!state.trace.length) {
    clearPlaybackControls();
    if (state.error) {
      showTraceError(state.error);
    } else {
      setConsole("// Program finished without executing a traceable line.", "muted");
      showToast("Nothing to trace in this program.");
    }
    return;
  }

  els.emptyStory.classList.add("hidden");
  els.traceContent.classList.remove("hidden");
  els.stepSlider.max = String(state.trace.length - 1);
  els.stepSlider.disabled = false;
  els.previousButton.disabled = false;
  els.playButton.disabled = false;
  els.nextButton.disabled = false;
  els.restartButton.disabled = false;
  renderStep();

  if (state.error) {
    showToast(`${state.error.type}: ${state.error.message}`, true);
  } else {
    showToast(`Trace ready with ${state.trace.length} steps.`);
  }
}

/**
 * Removes all visualization data that no longer matches the editor source.
 * The editor itself is preserved while placeholders, counters, controls, and output return to their initial state.
 */
function clearTrace() {
  pausePlayback();
  state.trace = [];
  state.loops = [];
  state.conditions = [];
  state.error = null;
  state.currentStep = 0;
  state.selectedVariable = null;
  state.referencesGraph?.destroy();
  state.referencesGraph = null;
  state.flowGraph?.destroy();
  state.flowGraph = null;
  els.emptyVariables.classList.remove("hidden");
  els.variablesContent.classList.add("hidden");
  els.emptyReferences.classList.remove("hidden");
  els.referencesContent.classList.add("hidden");
  els.emptyFlow.classList.remove("hidden");
  els.flowContent.classList.add("hidden");
  els.emptyStory.classList.remove("hidden");
  els.traceContent.classList.add("hidden");
  els.emptyLoop.classList.remove("hidden");
  els.loopContent.classList.add("hidden");
  els.loopBadge.textContent = "0";
  els.stepCount.textContent = "STEP 00 / 00";
  setConsole("// Output will appear here", "muted");
  renderEditorHeatmap();
  clearPlaybackControls();
}

/**
 * Disables and resets every playback control.
 * This helper is shared by source edits and executions that produced no traceable steps.
 */
function clearPlaybackControls() {
  els.stepSlider.min = "0";
  els.stepSlider.max = "0";
  els.stepSlider.value = "0";
  els.stepSlider.disabled = true;
  els.previousButton.disabled = true;
  els.playButton.disabled = true;
  els.nextButton.disabled = true;
  els.restartButton.disabled = true;
  els.progressPercent.textContent = "0%";
}

/**
 * Builds the variable dictionary shown for one trace snapshot.
 * Globals are combined with the active frame's locals, and implementation-only callable or module values are filtered from the beginner view.
 * @param {object} step Serialized Python trace snapshot.
 * @returns {Record<string, object>} Visible variable names mapped to serialized values.
 */
function variablesForStep(step) {
  const values = { ...step.globals };
  if (step.frames?.length) Object.assign(values, step.frames.at(-1).locals);
  return Object.fromEntries(
    Object.entries(values).filter(([name, value]) => {
      if (name.startsWith("__")) return false;
      return !["function", "module", "type"].includes(value?.type);
    }),
  );
}

/**
 * Creates a stable comparison string for a serialized Python value.
 * Only educational content is included, so changing object identifiers alone does not look like a variable mutation.
 * @param {object|undefined} value Serialized value from the worker.
 * @returns {string} JSON signature suitable for equality comparison.
 */
function valueSignature(value) {
  if (!value) return "";
  return JSON.stringify({
    type: value.type,
    display: value.display,
    items: value.items,
    entries: value.entries,
  });
}

/**
 * Computes the visible variable difference between one snapshot and its predecessor.
 * Every name is classified as created, removed, changed, or omitted when unchanged.
 * @param {number} index Zero-based trace index.
 * @returns {Array<object>} Ordered descriptions consumed by the change-card renderer.
 */
function changesAt(index) {
  const current = variablesForStep(state.trace[index]);
  const previous = index > 0 ? variablesForStep(state.trace[index - 1]) : {};
  const names = new Set([...Object.keys(previous), ...Object.keys(current)]);
  const changes = [];

  for (const name of names) {
    if (!(name in previous)) {
      changes.push({ name, kind: "created", oldValue: "not set", newValue: current[name]?.display ?? "?" });
    } else if (!(name in current)) {
      changes.push({ name, kind: "removed", oldValue: previous[name]?.display ?? "?", newValue: "removed" });
    } else if (valueSignature(previous[name]) !== valueSignature(current[name])) {
      changes.push({
        name,
        kind: "changed",
        oldValue: previous[name]?.display ?? "?",
        newValue: current[name]?.display ?? "?",
      });
    }
  }
  return changes;
}

/**
 * Finds static loop metadata for the source line executed by a trace step.
 * @param {object} step Active trace snapshot.
 * @returns {object|undefined} Matching for or while loop metadata.
 */
function loopForStep(step) {
  return state.loops.find((loop) => loop.line === step.line);
}

/**
 * Distinguishes a real loop iteration from Python's final loop-line event.
 * The tracer records the next line, allowing the UI to recognize when control moved outside the loop body.
 * @param {object} step Trace snapshot being inspected.
 * @returns {boolean} True when this step represents leaving the loop.
 */
function isLoopExitStep(step) {
  const loop = loopForStep(step);
  return Boolean(loop && step.nextLine && (step.nextLine <= loop.line || step.nextLine > loop.endLine));
}

/**
 * Infers the observed Boolean outcome of an if or while condition from its next executed line.
 * The result describes only the path that actually ran and never predicts an unexecuted branch.
 * @param {object} step Active trace snapshot.
 * @returns {boolean|null} True, false, or null when the outcome cannot be determined safely.
 */
function conditionOutcome(step) {
  const condition = state.conditions.find((item) => item.line === step.line);
  if (condition) {
    if (step.nextLine === condition.bodyLine) return true;
    if (step.nextLine === condition.elseLine || step.nextLine > condition.endLine) return false;
  }
  const loop = state.loops.find((item) => item.type === "while" && item.line === step.line);
  if (loop) {
    if (step.nextLine === loop.bodyLine) return true;
    if (isLoopExitStep(step)) return false;
  }
  return null;
}

/**
 * Classifies a source line into a short beginner-friendly category.
 * The category is displayed beside the line number and is based on trace events plus deliberately small syntax patterns.
 * @param {string} source Source text for the executed line.
 * @param {string} event Python trace event name.
 * @param {object} step Full step used for loop-exit detection.
 * @returns {string} Uppercase category label.
 */
function statementKind(source, event, step) {
  const line = source.trim();
  if (event === "exception") return "ERROR";
  if (/^return\b/.test(line)) return "RETURN";
  if (step && isLoopExitStep(step)) return "LOOP COMPLETE";
  if (/^for\b/.test(line)) return "FOR LOOP";
  if (/^while\b/.test(line)) return "WHILE LOOP";
  if (/^(if|elif)\b/.test(line)) return "CONDITION";
  if (/^else\s*:/.test(line)) return "ELSE BRANCH";
  if (/^def\b/.test(line)) return "FUNCTION";
  if (/^print\s*\(/.test(line)) return "OUTPUT";
  if (/^[A-Za-z_]\w*\s*(\+=|-=|\*=|\/=|\/\/=|%=)/.test(line)) return "UPDATE";
  if (/^[A-Za-z_]\w*\s*=/.test(line)) return "ASSIGNMENT";
  if (event === "return") return "FUNCTION COMPLETE";
  return "STATEMENT";
}

/**
 * Generates the natural-language explanation for the active trace step.
 * Specific cases cover errors, returns, function entry, loops, branches, definitions, output, and variable diffs before falling back to a neutral statement.
 * @param {object} step Active trace snapshot.
 * @param {Array<object>} changes Variable differences calculated for this snapshot.
 * @returns {string} Explanation written for a beginning Python learner.
 */
function explainStep(step, changes) {
  const line = step.source.trim();
  const previousStep = state.currentStep > 0 ? state.trace[state.currentStep - 1] : null;
  const enteredFrame = previousStep && (step.frames?.length || 0) > (previousStep.frames?.length || 0);
  if (step.event === "exception") {
    return `Python stopped here because ${step.detail?.type || "an error"} occurred: ${step.detail?.message || "unknown error"}.`;
  }
  if (step.event === "return") {
    const value = step.detail?.display;
    if (/^return\b/.test(line)) return `The function finished and returned ${value ?? "a value"}.`;
    if (step.frames?.length > 1) return `Python finished this function step and prepared to return ${value ?? "its result"}.`;
  }
  if (isLoopExitStep(step)) return "The loop has no more iterations, so Python continued with the code below it.";
  if (enteredFrame) {
    const frame = step.frames.at(-1);
    const assignedName = line.match(/^([A-Za-z_]\w*)\s*=/)?.[1];
    const argumentsList = changes
      .filter((change) => change.kind === "created" && change.name !== assignedName)
      .map((change) => `${change.name} set to ${change.newValue}`)
      .join(", ");
    const assignment = changes.find((change) => change.name === assignedName);
    const enteredText = argumentsList ? ` with ${argumentsList}` : "";
    const assignmentText = assignment
      ? `, then created ${assignment.name} with the value ${assignment.newValue}`
      : "";
    return `Python entered ${frame.name}()${enteredText}${assignmentText}.`;
  }
  if (/^for\s+(.+?)\s+in\s+(.+):$/.test(line)) {
    const match = line.match(/^for\s+(.+?)\s+in\s+(.+):$/);
    return `Python took the next value from ${match[2]} and stored it in ${match[1]}.`;
  }
  if (/^while\s+(.+):$/.test(line)) {
    const condition = line.match(/^while\s+(.+):$/)?.[1];
    const outcome = conditionOutcome(step);
    if (outcome !== null) {
      return `Python checked ${condition}. The result was ${outcome ? "True, so the loop continued" : "False, so the loop ended"}.`;
    }
    return `Python checked whether ${condition} is true before continuing the loop.`;
  }
  if (/^(if|elif)\s+(.+):$/.test(line)) {
    const condition = line.match(/^(?:if|elif)\s+(.+):$/)?.[1];
    const outcome = conditionOutcome(step);
    if (outcome !== null) {
      return `Python checked ${condition}. The result was ${outcome ? "True, so Python entered this branch" : "False, so Python skipped this branch"}.`;
    }
    return `Python checked the condition ${condition} and chose which path to follow.`;
  }
  if (/^else\s*:/.test(line)) return "Python entered the alternative path because the earlier condition was false.";
  if (/^def\s+(\w+)/.test(line)) {
    const name = line.match(/^def\s+(\w+)/)?.[1];
    return `Python created the function ${name}. Its body will run when the function is called.`;
  }
  if (/^print\s*\(/.test(line)) return "Python sent this value to the program output.";
  if (/^return\b/.test(line)) return "Python sent this value back to the code that called the function.";

  if (changes.length === 1) {
    const change = changes[0];
    if (change.kind === "created") return `Python created ${change.name} and gave it the value ${change.newValue}.`;
    if (change.kind === "removed") return `Python removed the name ${change.name} from the current scope.`;
    return `Python updated ${change.name} from ${change.oldValue} to ${change.newValue}.`;
  }
  if (changes.length > 1) {
    return `Python completed this instruction and changed ${changes.map((change) => change.name).join(", ")}.`;
  }
  return "Python completed this instruction without changing a visible variable.";
}

/**
 * Renders the complete workspace for the currently selected trace snapshot.
 * This coordinator updates progress, explanation, variables, call stack, Loop Lab, editor focus, and synchronized console output together.
 */
function renderStep() {
  if (!state.trace.length) return;
  const index = Math.max(0, Math.min(state.currentStep, state.trace.length - 1));
  state.currentStep = index;
  const step = state.trace[index];
  const changes = changesAt(index);
  const percent = state.trace.length <= 1 ? 100 : Math.round((index / (state.trace.length - 1)) * 100);

  els.stepCount.textContent = `STEP ${String(index + 1).padStart(2, "0")} / ${String(state.trace.length).padStart(2, "0")}`;
  els.traceKicker.textContent = `LINE ${String(step.line).padStart(2, "0")} // ${statementKind(step.source, step.event, step)}`;
  els.executedCode.textContent = step.source.trimEnd();
  els.explanation.textContent = explainStep(step, changes);
  els.stepSlider.value = String(index);
  els.progressPercent.textContent = `${percent}%`;
  els.previousButton.disabled = index === 0;
  els.nextButton.disabled = index === state.trace.length - 1;
  els.playButton.textContent = state.playing ? "Ⅱ" : "▶";

  renderChanges(changes);
  renderVariables(variablesForStep(step));
  renderCallStack(step.frames || []);
  renderStepOutput(index);
  renderVariableExplorer();
  renderLoopLab(index);
  renderEditorHeatmap();
  updateFlowSelection();
  // Manual stepping should update the reference map immediately. Automatic
  // playback defers that work until pausePlayback so the canvas remains still.
  if (state.activePanel === "references" && !state.playing) renderReferenceMap();
  if (state.activePanel === "flow" && !state.flowGraph) renderFlowMap();
  focusLine(step.line);

  if (step.output) {
    setConsole(step.output);
  } else if (step.event === "exception") {
    setConsole(`${step.detail?.type || "Error"}: ${step.detail?.message || "Program stopped"}`, "error");
  } else {
    setConsole("// No output yet", "muted");
  }

  if (index === state.trace.length - 1 && state.error) {
    appendConsoleError(state.error);
  }
}

/**
 * Renders variable-difference cards for the active step.
 * Text is assigned with textContent after structural markup is created so values originating in learner code cannot inject HTML.
 * @param {Array<object>} changes Created, updated, and removed variable descriptions.
 */
function renderChanges(changes) {
  if (!changes.length) {
    els.changeList.innerHTML = '<div class="no-changes">No visible variable changed in this step.</div>';
    return;
  }
  els.changeList.replaceChildren(
    ...changes.map((change) => {
      const item = document.createElement("div");
      item.className = `change-item ${change.kind}`;
      item.innerHTML = `
        <span class="change-name"></span>
        <span class="old-value"></span>
        <span class="arrow">→</span>
        <span class="new-value"></span>`;
      item.querySelector(".change-name").textContent = change.name;
      item.querySelector(".old-value").textContent = change.oldValue;
      item.querySelector(".new-value").textContent = change.newValue;
      return item;
    }),
  );
}

/**
 * Renders every visible variable as a name, value, and Python type card.
 * Long representations remain available in the title tooltip even when CSS truncates the card.
 * @param {Record<string, object>} variables Serialized variables for the active scope.
 */
function renderVariables(variables) {
  const entries = Object.entries(variables);
  if (!entries.length) {
    els.variablesGrid.innerHTML = '<div class="no-changes">No visible variables are in scope yet.</div>';
    return;
  }
  els.variablesGrid.replaceChildren(
    ...entries.map(([name, value]) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "variable-card";
      card.setAttribute("aria-label", `Inspect ${name}`);
      const nameNode = document.createElement("span");
      nameNode.className = "variable-name";
      nameNode.textContent = name;
      const valueNode = document.createElement("span");
      valueNode.className = "variable-value";
      valueNode.textContent = value.display;
      valueNode.title = value.display;
      const typeNode = document.createElement("span");
      typeNode.className = "variable-type";
      typeNode.textContent = value.type;
      card.append(nameNode, valueNode, typeNode);
      card.addEventListener("click", () => {
        state.selectedVariable = name;
        switchPanel("variables");
      });
      return card;
    }),
  );
}

/**
 * Returns visible names separated into the global scope and the active local frame.
 * A local name hides an equal global name in normal Python lookup, but both remain available for teaching.
 * @param {object} step Trace snapshot whose scopes should be inspected.
 * @returns {{globals: Record<string, object>, locals: Record<string, object>, localName: string}}
 */
function scopesForStep(step) {
  const visible = (mapping = {}) => Object.fromEntries(
    Object.entries(mapping).filter(([, value]) => !["function", "module", "type"].includes(value?.type)),
  );
  const activeFrame = step.frames?.at(-1);
  return {
    globals: visible(step.globals),
    locals: activeFrame?.name === "<module>" ? {} : visible(activeFrame?.locals),
    localName: activeFrame?.name && activeFrame.name !== "<module>" ? `${activeFrame.name}()` : "local scope",
  };
}

/**
 * Collects the meaningful lifetime events for one visible variable.
 * Only creation and value changes become rows, which keeps a 3,000-step trace readable.
 * @param {string} name Variable name to follow through the complete trace.
 * @returns {Array<{index: number, value: object, kind: string}>} Ordered variable events.
 */
function variableHistory(name) {
  const history = [];
  let previous;
  let present = false;
  state.trace.forEach((step, index) => {
    const values = variablesForStep(step);
    const current = values[name];
    if (!current) {
      if (present) history.push({ index, value: previous, kind: "left scope" });
      present = false;
      previous = undefined;
      return;
    }
    if (!present) {
      history.push({ index, value: current, kind: "created" });
    } else if (valueSignature(previous) !== valueSignature(current)) {
      const sameObject = previous?.objectId && previous.objectId === current.objectId;
      history.push({ index, value: current, kind: sameObject ? "mutated" : "changed" });
    }
    present = true;
    previous = current;
  });
  return history;
}

/**
 * Builds an expandable, safe DOM representation for a serialized Python value.
 * Lists use numeric indexes, dictionaries preserve key labels, and recursion stops at the worker's finite snapshot boundary.
 * @param {object} value Serialized Python value.
 * @param {string} label Human-readable index, key, or field label.
 * @returns {HTMLElement} One tree row or expandable branch.
 */
function createValueTree(value, label = "value") {
  const hasItems = Array.isArray(value?.items) && value.items.length > 0;
  const hasEntries = Array.isArray(value?.entries) && value.entries.length > 0;
  if (!hasItems && !hasEntries) {
    const leaf = document.createElement("div");
    leaf.className = "value-tree-leaf";
    const name = document.createElement("span");
    name.textContent = label;
    const display = document.createElement("code");
    display.textContent = value?.display ?? "unknown";
    const type = document.createElement("small");
    type.textContent = value?.type ?? "unknown";
    leaf.append(name, display, type);
    return leaf;
  }

  const branch = document.createElement("details");
  branch.className = "value-tree-branch";
  branch.open = true;
  const summary = document.createElement("summary");
  const summaryName = document.createElement("span");
  summaryName.textContent = label;
  const summaryValue = document.createElement("code");
  summaryValue.textContent = `${value.type}(${value.length ?? 0})`;
  summary.append(summaryName, summaryValue);
  branch.append(summary);

  const children = document.createElement("div");
  children.className = "value-tree-children";
  if (hasItems) {
    value.items.forEach((item, index) => children.append(createValueTree(item, `[${index}]`)));
  }
  if (hasEntries) {
    value.entries.forEach((entry) => children.append(
      createValueTree(entry.value, `[${entry.key?.display ?? "?"}]`),
    ));
  }
  if ((value.length ?? 0) > (value.items?.length ?? value.entries?.length ?? 0)) {
    const omitted = document.createElement("div");
    omitted.className = "value-tree-omitted";
    omitted.textContent = `${value.length - (value.items?.length ?? value.entries?.length ?? 0)} more item(s) omitted`;
    children.append(omitted);
  }
  branch.append(children);
  return branch;
}

/**
 * Renders the current global and local scope buttons used to choose a variable.
 * @param {{globals: Record<string, object>, locals: Record<string, object>, localName: string}} scopes Current scope data.
 */
function renderScopeBrowser(scopes) {
  els.scopeBrowser.replaceChildren();
  const groups = [
    ["GLOBAL SCOPE", scopes.globals],
    [scopes.localName.toUpperCase(), scopes.locals],
  ];
  groups.forEach(([title, variables]) => {
    const entries = Object.entries(variables);
    if (!entries.length) return;
    const section = document.createElement("section");
    section.className = "scope-group";
    const heading = document.createElement("h3");
    heading.textContent = title;
    section.append(heading);
    entries.forEach(([name, value]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `scope-variable ${state.selectedVariable === name ? "active" : ""}`;
      const nameNode = document.createElement("strong");
      nameNode.textContent = name;
      const valueNode = document.createElement("code");
      valueNode.textContent = value.display;
      const typeNode = document.createElement("small");
      typeNode.textContent = value.type;
      button.append(nameNode, valueNode, typeNode);
      button.addEventListener("click", () => {
        state.selectedVariable = name;
        renderVariableExplorer();
      });
      section.append(button);
    });
    els.scopeBrowser.append(section);
  });
}

/**
 * Renders metadata, nested contents, aliases, and change history for the selected variable.
 * The view is derived entirely from detached trace snapshots, so inspection never mutates learner code.
 */
function renderVariableExplorer() {
  if (!state.trace.length) {
    els.emptyVariables.classList.remove("hidden");
    els.variablesContent.classList.add("hidden");
    return;
  }
  const step = state.trace[state.currentStep];
  const variables = variablesForStep(step);
  const names = Object.keys(variables);
  if (!names.length) {
    els.emptyVariables.classList.remove("hidden");
    els.variablesContent.classList.add("hidden");
    return;
  }
  if (!state.selectedVariable || !variables[state.selectedVariable]) {
    state.selectedVariable = changesAt(state.currentStep).find((change) => variables[change.name])?.name || names[0];
  }

  els.emptyVariables.classList.add("hidden");
  els.variablesContent.classList.remove("hidden");
  const scopes = scopesForStep(step);
  renderScopeBrowser(scopes);

  const name = state.selectedVariable;
  const value = variables[name];
  const history = variableHistory(name);
  const visibleHistory = history.filter((entry) => entry.index <= state.currentStep);
  const created = history[0];
  const lastChanged = visibleHistory.at(-1);
  const scope = Object.hasOwn(scopes.locals, name) ? scopes.localName : "global";
  const mutable = ["list", "dict", "set"].includes(value.type);
  const aliases = Object.entries(variables)
    .filter(([otherName, otherValue]) => otherName !== name && value.objectId && otherValue.objectId === value.objectId)
    .map(([otherName]) => otherName);

  els.variableInspector.replaceChildren();
  const heading = document.createElement("div");
  heading.className = "inspector-heading";
  const title = document.createElement("div");
  const kicker = document.createElement("span");
  kicker.textContent = scope.toUpperCase();
  const nameNode = document.createElement("h3");
  nameNode.textContent = name;
  title.append(kicker, nameNode);
  const typeBadge = document.createElement("span");
  typeBadge.className = "inspector-type";
  typeBadge.textContent = value.type;
  heading.append(title, typeBadge);

  const metadata = document.createElement("div");
  metadata.className = "inspector-metadata";
  const facts = [
    ["Current value", value.display],
    ["Created", created ? `step ${created.index + 1}` : "unknown"],
    ["Last change", lastChanged ? `step ${lastChanged.index + 1}` : "not changed"],
    ["Behavior", mutable ? "mutable object" : "immutable value"],
  ];
  if (Number.isFinite(value.length)) facts.splice(1, 0, ["Length", String(value.length)]);
  if (aliases.length) facts.push(["Shared with", aliases.join(", ")]);
  facts.forEach(([label, factValue]) => {
    const fact = document.createElement("div");
    const factLabel = document.createElement("span");
    factLabel.textContent = label;
    const factText = document.createElement("code");
    factText.textContent = factValue;
    fact.append(factLabel, factText);
    metadata.append(fact);
  });

  const contentsLabel = document.createElement("div");
  contentsLabel.className = "section-label";
  contentsLabel.textContent = "CONTENTS";
  const tree = createValueTree(value, name);

  const historyLabel = document.createElement("div");
  historyLabel.className = "section-label inspector-history-label";
  historyLabel.textContent = "VALUE HISTORY";
  const historyTable = document.createElement("div");
  historyTable.className = "variable-history";
  history.slice(0, 200).forEach((entry) => {
    const row = document.createElement("button");
    row.type = "button";
    row.className = `history-row ${entry.index === state.currentStep ? "active" : ""}`;
    const stepNode = document.createElement("span");
    stepNode.textContent = `Step ${entry.index + 1}`;
    const eventNode = document.createElement("span");
    eventNode.textContent = entry.kind;
    const historyValue = document.createElement("code");
    historyValue.textContent = entry.value?.display ?? "out of scope";
    row.append(stepNode, eventNode, historyValue);
    row.addEventListener("click", () => goToStep(entry.index));
    historyTable.append(row);
  });

  els.variableInspector.append(heading, metadata, contentsLabel, tree, historyLabel, historyTable);
}

/**
 * Shows only the console text appended by the active execution step.
 * Cumulative output remains in the main console, while this smaller card explains causality.
 * @param {number} index Active zero-based trace index.
 */
function renderStepOutput(index) {
  const current = state.trace[index]?.output || "";
  const previous = index > 0 ? state.trace[index - 1]?.output || "" : "";
  const delta = current.startsWith(previous) ? current.slice(previous.length) : current;
  els.stepOutputSection.classList.toggle("hidden", !delta);
  els.stepOutput.textContent = delta.trimEnd();
}

/**
 * Renders user-code frames from global scope through the active function.
 * The active frame receives a modifier class, and the visual order is reversed with CSS to resemble a stack.
 * @param {Array<object>} frames Serialized Python frames.
 */
function renderCallStack(frames) {
  if (!frames.length) {
    els.callStackSection.classList.add("hidden");
    return;
  }
  els.callStackSection.classList.remove("hidden");
  els.callStack.replaceChildren(
    ...frames.map((frame, index) => {
      const item = document.createElement("div");
      item.className = `stack-frame ${index === frames.length - 1 ? "active" : ""}`;
      const name = frame.name === "<module>" ? "global frame" : `${frame.name}()`;
      const header = document.createElement("div");
      header.className = "stack-frame-header";
      const nameNode = document.createElement("strong");
      nameNode.textContent = name;
      const countNode = document.createElement("span");
      const localCount = Object.keys(frame.locals || {}).length;
      countNode.textContent = `${localCount} local${localCount === 1 ? "" : "s"}`;
      header.append(nameNode, countNode);

      const locals = document.createElement("div");
      locals.className = "stack-frame-locals";
      const visibleLocals = Object.entries(frame.locals || {})
        .filter(([, value]) => !["function", "module", "type"].includes(value?.type))
        .slice(0, 6);
      if (!visibleLocals.length) {
        const empty = document.createElement("span");
        empty.className = "stack-local-empty";
        empty.textContent = "No visible locals";
        locals.append(empty);
      } else {
        visibleLocals.forEach(([localName, value]) => {
          const row = document.createElement("div");
          row.className = "stack-local-row";
          const label = document.createElement("span");
          label.textContent = localName;
          const localValue = document.createElement("code");
          localValue.textContent = value.display;
          row.append(label, localValue);
          locals.append(row);
        });
      }
      item.append(header, locals);
      return item;
    }),
  );
}

/**
 * Collects genuine iteration-entry steps for one loop.
 * Exit checks are excluded so a three-item range produces exactly three visible iterations.
 * @param {object} loop Static loop metadata.
 * @param {number} throughIndex Last trace index to inspect.
 * @returns {Array<object>} Occurrence indices plus variables and loop-target values.
 */
function loopOccurrences(loop, throughIndex = state.trace.length - 1) {
  const occurrences = [];
  for (let index = 0; index <= throughIndex; index += 1) {
    const step = state.trace[index];
    if (step.line !== loop.line || isLoopExitStep(step)) continue;
    const variables = variablesForStep(step);
    const keyValue = loop.target ? variables[loop.target]?.display : undefined;
    occurrences.push({ index, variables, keyValue });
  }
  return occurrences;
}

/**
 * Builds the loop-focused explanation for the currently selected trace position.
 * It selects the most recently reached loop, calculates progress, and marks completed, current, and waiting iterations.
 * @param {number} stepIndex Zero-based active trace position.
 */
function renderLoopLab(stepIndex) {
  if (!state.loops.length) {
    els.emptyLoop.classList.remove("hidden");
    els.loopContent.classList.add("hidden");
    return;
  }

  const loopsReached = state.loops.filter((loop) => loopOccurrences(loop, stepIndex).length > 0);
  const activeLoop = loopsReached.at(-1) || state.loops[0];
  const allOccurrences = loopOccurrences(activeLoop);
  const reached = loopOccurrences(activeLoop, stepIndex);
  const currentIteration = reached.length;

  els.emptyLoop.classList.add("hidden");
  els.loopContent.classList.remove("hidden");
  els.loopType.textContent = `${activeLoop.type.toUpperCase()} LOOP`;
  els.iterationCount.textContent = currentIteration
    ? `ITERATION ${String(currentIteration).padStart(2, "0")}`
    : "WAITING TO ENTER";
  els.loopSource.textContent = activeLoop.source;
  els.loopMeter.style.width = `${Math.min(100, (currentIteration / Math.max(1, allOccurrences.length)) * 100)}%`;

  els.iterationList.replaceChildren(
    ...allOccurrences.slice(0, 40).map((occurrence, index) => {
      const item = document.createElement("div");
      const isReached = occurrence.index <= stepIndex;
      const isCurrent = index === reached.length - 1;
      item.className = `iteration-item ${isCurrent ? "current" : ""}`;
      const summary = activeLoop.target && occurrence.keyValue !== undefined
        ? `${activeLoop.target} = ${occurrence.keyValue}`
        : activeLoop.condition
          ? `check: ${activeLoop.condition}`
          : "loop check";
      item.innerHTML = `
        <span class="iteration-number"></span>
        <span class="iteration-summary"></span>
        <span class="iteration-values"></span>`;
      item.querySelector(".iteration-number").textContent = isReached ? (isCurrent ? "●" : "✓") : String(index + 1);
      item.querySelector(".iteration-summary").textContent = `Iteration ${index + 1}`;
      item.querySelector(".iteration-values").textContent = isReached ? summary : "waiting";
      return item;
    }),
  );
}

/**
 * Moves directly to a requested trace snapshot after pausing playback.
 * @param {number|string} index Target zero-based trace index.
 */
function goToStep(index) {
  pausePlayback();
  state.currentStep = Number(index);
  renderStep();
}

/**
 * Moves one snapshot backward when an earlier step exists.
 */
function previousStep() {
  if (state.currentStep > 0) goToStep(state.currentStep - 1);
}

/**
 * Moves one snapshot forward when a later step exists.
 */
function nextStep() {
  if (state.currentStep < state.trace.length - 1) goToStep(state.currentStep + 1);
}

/**
 * Starts or pauses automatic trace playback.
 * Restarting from the end begins at step zero so the Play button always has a useful result.
 */
function togglePlayback() {
  if (state.playing) {
    pausePlayback();
    // A learner-requested pause is the right moment to synchronize a reference
    // map that intentionally remained still during automatic playback.
    if (state.activePanel === "references") renderReferenceMap();
    return;
  }
  if (!state.trace.length) return;
  if (state.currentStep >= state.trace.length - 1) state.currentStep = 0;
  state.playing = true;
  els.playButton.textContent = "Ⅱ";
  scheduleNextStep();
}

/**
 * Schedules one automatic playback advance using the selected speed.
 * Each call replaces the prior timer, which makes speed changes safe while playback is active.
 */
function scheduleNextStep() {
  window.clearTimeout(state.playTimer);
  state.playTimer = window.setTimeout(() => {
    if (!state.playing) return;
    if (state.currentStep >= state.trace.length - 1) {
      pausePlayback();
      // Refresh once at natural completion so the final reference state is
      // accurate without any intermediate canvas rebuilding.
      if (state.activePanel === "references") renderReferenceMap();
      return;
    }
    state.currentStep += 1;
    renderStep();
    scheduleNextStep();
  }, Number(els.speedSelect.value));
}

/**
 * Stops automatic playback and restores the Play icon.
 * The function is safe to call even when playback is already stopped.
 */
function pausePlayback() {
  state.playing = false;
  window.clearTimeout(state.playTimer);
  if (els.playButton) els.playButton.textContent = "▶";
}

/**
 * Returns playback to the first recorded snapshot.
 */
function restartTrace() {
  goToStep(0);
}

/**
 * Loads Cytoscape only when a learner opens a graph view.
 * Deferring this dependency keeps the landing page and ordinary story playback lightweight.
 * @returns {Promise<Function|null>} Cytoscape constructor or null when the CDN is unavailable.
 */
async function loadGraphLibrary() {
  if (state.graphLibrary) return state.graphLibrary;
  try {
    const module = await import("https://esm.sh/cytoscape@3.31.0");
    state.graphLibrary = module.default;
    return state.graphLibrary;
  } catch (error) {
    console.warn("Code Explorer could not load its graph renderer.", error);
    showToast("The graph renderer could not load. Story and variable views remain available.", true);
    return null;
  }
}

/**
 * Reads the active theme tokens so Cytoscape matches the hand-authored interface.
 * @returns {Record<string, string>} Named colors consumed by graph style declarations.
 */
function graphPalette() {
  const style = getComputedStyle(document.documentElement);
  const token = (name) => style.getPropertyValue(name).trim();
  return {
    text: token("--text"),
    soft: token("--text-soft"),
    dim: token("--text-dim"),
    panel: token("--bg-raised"),
    line: token("--line-bright"),
    mint: token("--mint"),
    purple: token("--purple"),
    cyan: token("--cyan"),
    // Cytoscape draws text onto canvas, so it needs the resolved project font
    // instead of inheriting the surrounding HTML element's font declaration.
    mono: token("--mono"),
  };
}

/**
 * Chooses a crisp but memory-conscious backing resolution for graph canvases.
 * Cytoscape normally follows the browser device ratio, which is often 1 on
 * desktop Linux. A minimum ratio of 2 gives small canvas labels enough pixels
 * to render cleanly, while the upper cap prevents excessive GPU memory usage.
 * @returns {number} Canvas pixels to render for each CSS pixel.
 */
function graphPixelRatio() {
  return Math.min(3, Math.max(2, window.devicePixelRatio || 1));
}

/**
 * Returns the live graph instance associated with one educational graph mode.
 * @param {"references"|"flow"} kind Graph mode requested by a control.
 * @returns {object|null} Cytoscape instance or null before that graph is mounted.
 */
function graphForKind(kind) {
  return kind === "references" ? state.referencesGraph : state.flowGraph;
}

/**
 * Returns the slider and output paired with one graph mode.
 * @param {"references"|"flow"} kind Graph mode whose controls should update.
 * @returns {{slider: HTMLInputElement|null, output: HTMLOutputElement|null}} Matching controls.
 */
function graphZoomControls(kind) {
  return kind === "references"
    ? { slider: els.referencesZoomSlider, output: els.referencesZoomValue }
    : { slider: els.flowZoomSlider, output: els.flowZoomValue };
}

/**
 * Clamps a requested graph percentage to the public slider range.
 * @param {string|number} requestedZoom Candidate percentage from any input method.
 * @returns {number} A finite percentage between forty and two hundred.
 */
function clampGraphZoom(requestedZoom) {
  const numericZoom = Number(requestedZoom);
  if (!Number.isFinite(numericZoom)) return 100;
  return Math.min(200, Math.max(40, numericZoom));
}

/**
 * Mirrors a Cytoscape zoom level into its range input and percentage output.
 * Wheel and trackpad events pass through here, keeping every control truthful.
 * @param {"references"|"flow"} kind Graph mode being synchronized.
 * @param {boolean} persist Whether this zoom should be remembered after reload.
 */
function synchronizeGraphZoom(kind, persist = false) {
  const graph = graphForKind(kind);
  if (!graph) return;
  // Cytoscape stores zoom as a multiplier, while the interface communicates percentages.
  const percentage = Math.round(clampGraphZoom(graph.zoom() * 100));
  const { slider, output } = graphZoomControls(kind);
  if (slider) slider.value = String(percentage);
  if (output) output.value = `${percentage}%`;
  if (persist) {
    state.graphZoom[kind] = percentage;
    saveGraphZoomPreferences(state.graphZoom);
  }
}

/**
 * Applies a percentage around the visible canvas center instead of jumping its pan position.
 * @param {"references"|"flow"} kind Graph mode being changed.
 * @param {string|number} requestedZoom Percentage requested by a slider or button.
 */
function setGraphZoom(kind, requestedZoom) {
  const graph = graphForKind(kind);
  if (!graph) return;
  const percentage = clampGraphZoom(requestedZoom);
  const container = graph.container();
  // renderedPosition makes zooming feel anchored to what the learner is currently viewing.
  graph.zoom({
    level: percentage / 100,
    renderedPosition: { x: container.clientWidth / 2, y: container.clientHeight / 2 },
  });
  synchronizeGraphZoom(kind, true);
}

/**
 * Advances one graph by a fixed five-percent step used by both plus and minus buttons.
 * @param {"references"|"flow"} kind Graph mode being changed.
 * @param {number} direction Positive one zooms in and negative one zooms out.
 */
function stepGraphZoom(kind, direction) {
  const graph = graphForKind(kind);
  if (!graph) return;
  setGraphZoom(kind, Math.round(graph.zoom() * 100) + (direction * 5));
}

/**
 * Fits all graph elements inside the viewport and synchronizes the resulting percentage.
 * @param {"references"|"flow"} kind Graph mode that should return to its fitted view.
 */
function fitGraph(kind) {
  const graph = graphForKind(kind);
  if (!graph) return;
  graph.fit(undefined, 28);
  synchronizeGraphZoom(kind, true);
}

/**
 * Connects a newly created Cytoscape instance to its persistent zoom controls.
 * @param {"references"|"flow"} kind Graph mode being mounted.
 * @param {object} graph Newly constructed Cytoscape instance.
 */
function connectGraphZoom(kind, graph) {
  // Apply a saved scale only after layout has selected positions for every node.
  if (state.graphZoom[kind] !== null) {
    setGraphZoom(kind, state.graphZoom[kind]);
  } else {
    // First use displays Cytoscape's automatic fitted percentage without saving it.
    synchronizeGraphZoom(kind, false);
  }
  // Native canvas gestures update the range and save the learner's latest scale.
  graph.on("zoom", () => synchronizeGraphZoom(kind, true));
}

/**
 * Converts the active snapshot into scope, variable, object, and reference graph elements.
 * Complex object ids merge aliases into one object node, while primitives receive clear value nodes.
 * @param {object} step Active trace snapshot.
 * @returns {Array<object>} Cytoscape-compatible node and edge definitions.
 */
function referenceElements(step) {
  const elements = [];
  const nodeIds = new Set();
  const edgeIds = new Set();
  const changedNames = new Set(changesAt(state.currentStep).map((change) => change.name));
  const addNode = (id, label, kind, extra = {}) => {
    if (nodeIds.has(id)) return;
    nodeIds.add(id);
    elements.push({ data: { id, label, kind, ...extra }, classes: extra.changed ? "changed" : "" });
  };
  const addEdge = (id, source, target, label = "") => {
    if (edgeIds.has(id)) return;
    edgeIds.add(id);
    elements.push({ data: { id, source, target, label } });
  };

  const addValue = (value, ownerId, label, path, depth = 0) => {
    const objectId = value?.objectId ? `object-${value.objectId}` : `value-${path}`;
    const summary = value?.objectId
      ? `${value.type}\n${value.display}`
      : `${value?.type ?? "value"}\n${value?.display ?? "unknown"}`;
    addNode(objectId, summary, value?.objectId ? "object" : "value", { changed: changedNames.has(label) });
    addEdge(`ref-${ownerId}-${objectId}-${path}`, ownerId, objectId, label);
    if (depth >= 2 || !value) return;
    (value.items || []).slice(0, 12).forEach((item, index) => {
      const childLabel = `[${index}]`;
      addValue(item, objectId, childLabel, `${path}-item-${index}`, depth + 1);
    });
    (value.entries || []).slice(0, 12).forEach((entry, index) => {
      const childLabel = `[${entry.key?.display ?? index}]`;
      addValue(entry.value, objectId, childLabel, `${path}-entry-${index}`, depth + 1);
    });
  };

  const scopes = scopesForStep(step);
  const scopeGroups = [
    ["scope-global", "GLOBAL SCOPE", scopes.globals],
    ["scope-local", scopes.localName.toUpperCase(), scopes.locals],
  ];
  scopeGroups.forEach(([scopeId, scopeLabel, variables]) => {
    if (!Object.keys(variables).length) return;
    addNode(scopeId, scopeLabel, "scope");
    Object.entries(variables).slice(0, 30).forEach(([name, value]) => {
      const variableId = `${scopeId}-name-${name}`;
      addNode(variableId, name, "name", { changed: changedNames.has(name) });
      addEdge(`owns-${scopeId}-${name}`, scopeId, variableId);
      addValue(value, variableId, "references", `${scopeId}-${name}`);
    });
  });
  return elements.slice(0, 180);
}

/**
 * Renders the active snapshot as a conceptual Python reference map.
 * The canvas is rebuilt per selected step because object contents and active scopes can change.
 * @returns {Promise<void>} Resolves after the optional graph dependency is ready.
 */
async function renderReferenceMap() {
  if (!state.trace.length || !els.referencesGraph) {
    els.emptyReferences?.classList.remove("hidden");
    els.referencesContent?.classList.add("hidden");
    return;
  }
  // Reveal the content area immediately so its dimensions remain stable.
  els.emptyReferences.classList.add("hidden");
  els.referencesContent.classList.remove("hidden");
  els.referencesGraph.classList.remove("failed");
  // The loading overlay is needed only for the first network import. Showing
  // it during ordinary step changes would produce an unnecessary flash.
  if (!state.graphLibrary) {
    els.referencesGraph.classList.add("loading");
    els.referencesGraph.dataset.message = "Building the reference map...";
  }
  const cytoscape = await loadGraphLibrary();
  if (!cytoscape) {
    // An inline failure state keeps the explanation visible and gives learners
    // a useful next action instead of leaving behind an empty canvas.
    els.referencesGraph.classList.remove("loading");
    els.referencesGraph.classList.add("failed");
    els.referencesGraph.dataset.message = "Graph renderer unavailable. Check the connection and reopen this tab.";
    return;
  }
  if (state.activePanel !== "references") return;
  state.referencesGraph?.destroy();
  const colors = graphPalette();
  state.referencesGraph = cytoscape({
    container: els.referencesGraph,
    elements: referenceElements(state.trace[state.currentStep]),
    // A denser backing canvas removes the fuzzy edges seen on standard-density
    // Linux displays without changing the graph's physical dimensions.
    pixelRatio: graphPixelRatio(),
    // Stop very large maps from shrinking labels below a usable reading size.
    // Learners can pan the canvas when a program contains many objects.
    minZoom: 0.4,
    // A moderate upper limit prevents accidental extreme zooming on trackpads.
    maxZoom: 2,
    layout: { name: "breadthfirst", directed: true, padding: 28, spacingFactor: 1.25 },
    style: [
      // Graph text is deliberately larger than decorative UI text because
      // learners must be able to read values without zooming the whole page.
      { selector: "node", style: { "background-color": colors.panel, "border-color": colors.line, "border-width": 1.5, color: colors.text, label: "data(label)", "font-family": colors.mono, "font-size": 12, "font-weight": 500, "line-height": 1.25, "text-wrap": "wrap", "text-max-width": 132, "text-valign": "center", "text-halign": "center", width: 124, height: 58 } },
      // Scope headings receive extra weight and room so uppercase letters do
      // not crowd together on the colored background.
      { selector: 'node[kind = "scope"]', style: { "background-color": colors.purple, color: colors.panel, shape: "round-rectangle", width: 142, height: 44, "font-size": 13, "font-weight": 700 } },
      // Variable names are slightly wider than before, preventing common
      // beginner-friendly identifiers from wrapping unnecessarily.
      { selector: 'node[kind = "name"]', style: { "border-color": colors.cyan, "border-width": 2, color: colors.cyan, shape: "round-rectangle", width: 108, height: 42, "font-weight": 600 } },
      { selector: 'node[kind = "object"]', style: { "border-color": colors.mint, shape: "round-rectangle" } },
      { selector: "node.changed", style: { "border-color": colors.mint, "border-width": 3, "background-color": colors.panel } },
      // Edge captions now use a readable ten-pixel minimum, a solid label
      // backing, and the same project font as their connected nodes.
      { selector: "edge", style: { width: 1.6, "line-color": colors.line, "target-arrow-color": colors.mint, "target-arrow-shape": "triangle", "curve-style": "bezier", label: "data(label)", color: colors.dim, "font-family": colors.mono, "font-size": 10, "font-weight": 600, "text-background-color": colors.panel, "text-background-opacity": 1, "text-background-padding": 3 } },
    ],
  });
  // Restore and connect the controls after the reference layout is complete.
  connectGraphZoom("references", state.referencesGraph);
  // Remove the temporary overlay only after Cytoscape owns the canvas.
  els.referencesGraph.classList.remove("loading", "failed");
  delete els.referencesGraph.dataset.message;
}

/**
 * Builds a compact graph of source lines and transitions observed in the completed trace.
 * Repeated transitions become one edge with a count, making loops visible without inventing untaken paths.
 * @returns {Array<object>} Cytoscape-compatible flow elements.
 */
function flowElements() {
  const nodes = new Map();
  const edges = new Map();
  state.trace.forEach((step, index) => {
    const id = `line-${step.line}`;
    const existing = nodes.get(id) || { line: step.line, source: step.source.trim(), visits: 0 };
    existing.visits += 1;
    nodes.set(id, existing);
    if (index === 0) return;
    const previous = state.trace[index - 1];
    const edgeId = `transition-${previous.line}-${step.line}`;
    const edge = edges.get(edgeId) || { source: `line-${previous.line}`, target: id, count: 0 };
    edge.count += 1;
    edges.set(edgeId, edge);
  });
  return [
    ...[...nodes.entries()].map(([id, node]) => ({
      data: { id, label: `${node.line}: ${node.source}\n${node.visits} visit${node.visits === 1 ? "" : "s"}`, line: node.line },
    })),
    ...[...edges.entries()].map(([id, edge]) => ({
      data: { id, source: edge.source, target: edge.target, label: edge.count > 1 ? `${edge.count}x` : "" },
      classes: edge.source === edge.target || Number(edge.target.slice(5)) <= Number(edge.source.slice(5)) ? "loop-edge" : "",
    })),
  ];
}

/**
 * Renders the observed execution path and connects node clicks back to trace playback.
 * @returns {Promise<void>} Resolves after Cytoscape and the flow graph are ready.
 */
async function renderFlowMap() {
  if (!state.trace.length || !els.flowGraph) {
    els.emptyFlow?.classList.remove("hidden");
    els.flowContent?.classList.add("hidden");
    return;
  }
  // Match the reference view with stable dimensions during initial loading.
  els.emptyFlow.classList.add("hidden");
  els.flowContent.classList.remove("hidden");
  els.flowGraph.classList.remove("failed");
  // Avoid replaying the loading overlay when the already-loaded renderer is
  // merely rebuilding colors after a deliberate theme change.
  if (!state.graphLibrary) {
    els.flowGraph.classList.add("loading");
    els.flowGraph.dataset.message = "Building the executed path...";
  }
  const cytoscape = await loadGraphLibrary();
  if (!cytoscape) {
    // Keep a visible explanation in place if the optional renderer cannot load.
    els.flowGraph.classList.remove("loading");
    els.flowGraph.classList.add("failed");
    els.flowGraph.dataset.message = "Graph renderer unavailable. Check the connection and reopen this tab.";
    return;
  }
  if (state.activePanel !== "flow") return;
  state.flowGraph?.destroy();
  const colors = graphPalette();
  state.flowGraph = cytoscape({
    container: els.flowGraph,
    elements: flowElements(),
    // Match the reference map's high-resolution canvas so both graph modes
    // have equally crisp labels in light and dark themes.
    pixelRatio: graphPixelRatio(),
    // Preserve a readable floor for larger traces. Overflow remains pannable
    // inside the canvas instead of compressing every label into tiny pixels.
    minZoom: 0.4,
    // Keep trackpad and mouse-wheel zooming within a predictable teaching view.
    maxZoom: 2,
    // A compact spacing factor lets typical beginner programs fit near their
    // natural label size instead of being reduced to roughly half scale.
    layout: { name: "breadthfirst", directed: true, padding: 24, spacingFactor: 0.78 },
    style: [
      // Flow nodes contain source plus visit counts, so they need more width,
      // height, and line spacing than a single compact interface label.
      { selector: "node", style: { "background-color": colors.panel, "border-color": colors.line, "border-width": 1.5, color: colors.text, label: "data(label)", shape: "round-rectangle", width: 176, height: 66, "font-family": colors.mono, "font-size": 11.5, "font-weight": 500, "line-height": 1.25, "text-wrap": "wrap", "text-max-width": 158, "text-valign": "center", "text-halign": "center" } },
      { selector: "node.current", style: { "background-color": colors.mint, "border-color": colors.mint, color: colors.panel, "border-width": 3 } },
      // Loop counts are meaningful data rather than decoration, so their
      // labels use stronger weight, contrast, and an opaque background.
      { selector: "edge", style: { width: 1.6, "line-color": colors.line, "target-arrow-color": colors.mint, "target-arrow-shape": "triangle", "curve-style": "bezier", label: "data(label)", color: colors.purple, "font-family": colors.mono, "font-size": 10.5, "font-weight": 700, "text-background-color": colors.panel, "text-background-opacity": 1, "text-background-padding": 3 } },
      { selector: "edge.loop-edge", style: { "line-color": colors.purple, "target-arrow-color": colors.purple, "line-style": "dashed" } },
    ],
  });
  // Restore and connect the controls before node-selection behavior is attached.
  connectGraphZoom("flow", state.flowGraph);
  state.flowGraph.on("tap", "node", (event) => {
    const line = Number(event.target.data("line"));
    const stepIndex = state.trace.findIndex((step) => step.line === line);
    if (stepIndex >= 0) goToStep(stepIndex);
  });
  // Reveal the completed canvas after listeners and styles have been attached.
  els.flowGraph.classList.remove("loading", "failed");
  delete els.flowGraph.dataset.message;
  updateFlowSelection();
}

/**
 * Moves the flow graph's active styling without recalculating its layout.
 */
function updateFlowSelection() {
  if (!state.flowGraph || !state.trace.length) return;
  state.flowGraph.nodes().removeClass("current");
  state.flowGraph.getElementById(`line-${state.trace[state.currentStep].line}`).addClass("current");
}

/**
 * Switches among Story, Variables, References, Flow, and Loop Lab views.
 * ARIA selection and hidden states are updated from one mapping to prevent tab inconsistencies.
 * @param {"story"|"variables"|"references"|"flow"|"loop"} panel Panel that should become visible.
 */
function switchPanel(panel) {
  state.activePanel = panel;
  const views = [
    ["story", els.storyTab, els.storyView],
    ["variables", els.variablesTab, els.variablesView],
    ["references", els.referencesTab, els.referencesView],
    ["flow", els.flowTab, els.flowView],
    ["loop", els.loopTab, els.loopView],
  ];
  views.forEach(([name, tab, view]) => {
    const active = panel === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    view.classList.toggle("hidden", !active);
  });
  if (panel === "variables") renderVariableExplorer();
  if (panel === "references") renderReferenceMap();
  if (panel === "flow") renderFlowMap();
}

/**
 * Replaces console content with safely escaped text and an optional visual state.
 * @param {string} text Output or message to display.
 * @param {"normal"|"muted"|"error"} kind Presentation style.
 */
function setConsole(text, kind = "normal") {
  els.consoleOutput.replaceChildren();
  const span = document.createElement("span");
  span.textContent = text;
  if (kind === "muted") span.className = "console-muted";
  if (kind === "error") span.className = "console-error";
  els.consoleOutput.append(span);
}

/**
 * Appends a formatted runtime error after any output already produced.
 * @param {object} error Serialized Python error with type, message, and optional line.
 */
function appendConsoleError(error) {
  const separator = els.consoleOutput.textContent?.trim() ? "\n\n" : "";
  const span = document.createElement("span");
  span.className = "console-error";
  const location = error.line ? ` at line ${error.line}` : "";
  span.textContent = `${separator}${error.type}${location}: ${error.message}`;
  els.consoleOutput.append(span);
}

/**
 * Presents a syntax or runtime error when no playable trace exists.
 * The editor is focused on the reported line and a toast repeats the problem for immediate feedback.
 * @param {object} error Serialized worker error.
 */
function showTraceError(error) {
  const location = error.line ? `Line ${error.line}\n` : "";
  setConsole(`${location}${error.type}: ${error.message}`, "error");
  if (error.line) focusLine(error.line);
  showToast(`${error.type}: ${error.message}`, true);
}

/**
 * Displays an infrastructure or cancellation message in the console.
 * @param {string} message Human-readable problem description.
 */
function showError(message) {
  setConsole(message, "error");
}

/**
 * Shows a temporary polite live-region notification.
 * The previous dismissal timer is cancelled so rapid messages do not hide a newer notification early.
 * @param {string} message Notification text.
 * @param {boolean} isError Whether to apply error styling.
 */
function showToast(message, isError = false) {
  window.clearTimeout(state.toastTimer);
  els.toast.textContent = message;
  els.toast.classList.toggle("error", isError);
  els.toast.classList.add("visible");
  state.toastTimer = window.setTimeout(() => els.toast.classList.remove("visible"), 4000);
}

/**
 * Creates example cards from the shared EXAMPLES data.
 * Landing cards are native links to the workspace, while workspace cards are buttons that update the open editor.
 * Text nodes use textContent so example metadata remains safe by default.
 */
function renderExamples() {
  // The workspace marker determines whether a card should navigate or update in place.
  const isWorkspace = Boolean(els.workspace);
  els.exampleGrid.replaceChildren(
    ...EXAMPLES.map((example) => {
      // Native links make landing-page navigation reliable for file URLs and hosted URLs.
      const card = document.createElement(isWorkspace ? "button" : "a");
      if (isWorkspace) {
        card.type = "button";
      } else {
        card.href = "workspace.html";
      }
      card.className = "example-card";
      card.innerHTML = `
        <span class="example-topic"></span>
        <h3></h3>
        <p></p>`;
      card.querySelector(".example-topic").textContent = example.topic;
      card.querySelector("h3").textContent = example.title;
      card.querySelector("p").textContent = example.description;
      card.addEventListener("click", () => {
        // Save before navigation so the chosen example is waiting in the new editor.
        setCode(example.code);
        els.examplesDialog.close();
        if (isWorkspace) {
          showToast(`${example.title} loaded. Press Run trace when you are ready.`);
        }
      });
      return card;
    }),
  );
}

/**
 * Opens the native examples dialog only when it is not already open.
 */
function openExamples() {
  if (!els.examplesDialog.open) els.examplesDialog.showModal();
}

/**
 * Connects every static control to its controller function.
 * The handlers cover navigation, dialogs, execution, playback, tabs, output, speed changes, and the Ctrl or Command plus Enter shortcut.
 */
function bindEvents() {
  els.themeButton?.addEventListener("click", toggleTheme);
  // Editor display controls update presentation without altering or retracing source code.
  els.editorWrapButton?.addEventListener("click", toggleEditorWrapping);
  els.editorFontSizeSelect?.addEventListener("change", (event) => changeEditorFontSize(event.target.value));
  // Clipboard buttons operate on the complete document for fast program transfer.
  els.editorCopyButton?.addEventListener("click", copyCompleteEditor);
  els.editorPasteButton?.addEventListener("click", pasteCompleteEditor);
  els.heroExampleButton?.addEventListener("click", openExamples);
  els.backButton?.addEventListener("click", (event) => {
    event.preventDefault();
    showWelcome();
  });
  els.examplesButton?.addEventListener("click", openExamples);
  els.closeExamplesButton?.addEventListener("click", () => els.examplesDialog.close());
  els.examplesDialog?.addEventListener("click", (event) => {
    if (event.target === els.examplesDialog) els.examplesDialog.close();
  });
  els.runButton?.addEventListener("click", runCode);
  els.stopButton?.addEventListener("click", () => stopExecution("Execution stopped by you."));
  els.storyTab?.addEventListener("click", () => switchPanel("story"));
  els.variablesTab?.addEventListener("click", () => switchPanel("variables"));
  els.referencesTab?.addEventListener("click", () => switchPanel("references"));
  els.flowTab?.addEventListener("click", () => switchPanel("flow"));
  els.loopTab?.addEventListener("click", () => switchPanel("loop"));
  // Reference controls share one controller so slider, buttons, gestures, and Fit stay synchronized.
  els.referencesZoomSlider?.addEventListener("input", (event) => setGraphZoom("references", event.target.value));
  els.decreaseReferencesZoomButton?.addEventListener("click", () => stepGraphZoom("references", -1));
  els.increaseReferencesZoomButton?.addEventListener("click", () => stepGraphZoom("references", 1));
  els.fitReferencesButton?.addEventListener("click", () => fitGraph("references"));
  // Flow receives identical interaction behavior while retaining its own saved percentage.
  els.flowZoomSlider?.addEventListener("input", (event) => setGraphZoom("flow", event.target.value));
  els.decreaseFlowZoomButton?.addEventListener("click", () => stepGraphZoom("flow", -1));
  els.increaseFlowZoomButton?.addEventListener("click", () => stepGraphZoom("flow", 1));
  els.fitFlowButton?.addEventListener("click", () => fitGraph("flow"));
  els.previousButton?.addEventListener("click", previousStep);
  els.nextButton?.addEventListener("click", nextStep);
  els.playButton?.addEventListener("click", togglePlayback);
  els.restartButton?.addEventListener("click", restartTrace);
  els.stepSlider?.addEventListener("input", (event) => goToStep(event.target.value));
  els.speedSelect?.addEventListener("change", () => {
    if (state.playing) scheduleNextStep();
  });
  els.clearOutputButton?.addEventListener("click", () => setConsole("// Output cleared", "muted"));
  window.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      if (els.workspace && !state.running) runCode();
    }
  });
}

/**
 * Performs the one-time application startup sequence.
 * Theme and shared event wiring happen on both pages, while editor and Python startup run only on the workspace page.
 * @returns {Promise<void>} Resolves after any page-specific startup work finishes.
 */
async function initialize() {
  // Apply colors before async work so the page does not flash the wrong theme.
  applyTheme(preferredTheme());
  // Render data-driven cards and connect controls while the editor modules download.
  renderExamples();
  bindEvents();
  // The landing page has no editor, so expensive workspace dependencies stay unloaded there.
  if (els.editor) {
    // Begin downloading Python while CodeMirror initializes to reduce perceived waiting time.
    ensureWorker();
    // Awaiting initialization guarantees either CodeMirror or its fallback is mounted.
    await initializeEditor();
  }
}

// Start the application after the module script is parsed at the end of document body.
initialize();
