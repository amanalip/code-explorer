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
    "startButton", "heroExampleButton", "backButton", "examplesButton", "runButton", "stopButton",
    "editor", "editorShell", "codeStats", "storyTab", "loopTab", "loopBadge", "storyView", "loopView",
    "emptyStory", "traceContent", "traceKicker", "executedCode", "explanation", "changeList",
    "variablesGrid", "callStackSection", "callStack", "emptyLoop", "loopContent", "loopType",
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
    ] = await Promise.all([
      // The dependency query pins shared language and tag modules. Highlight
      // tags rely on object identity, so all packages must receive one copy.
      import("https://esm.sh/codemirror@6.0.2?deps=@codemirror/language@6.11.3,@lezer/highlight@1.2.1"),
      import("https://esm.sh/@codemirror/lang-python@6.2.1?deps=@codemirror/language@6.11.3,@lezer/highlight@1.2.1"),
      import("https://esm.sh/@codemirror/language@6.11.3?deps=@lezer/highlight@1.2.1"),
      import("https://esm.sh/@lezer/highlight@1.2.1"),
    ]);

    state.editorView = new EditorView({
      doc: state.code,
      extensions: [
        basicSetup,
        python(),
        // classHighlighter adds stable tok-* classes that our theme-aware CSS controls.
        syntaxHighlighting(classHighlighter),
        EditorView.lineWrapping,
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
  } catch (error) {
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
    showToast("The enhanced editor could not load. The basic editor is ready instead.");
  }
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
 * Moves the CodeMirror cursor to the line represented by the active trace step.
 * The requested number is clamped to the document so malformed error metadata cannot create an invalid selection.
 * @param {number} lineNumber One-based Python source line number.
 */
function focusLine(lineNumber) {
  if (!state.editorView || !lineNumber) return;
  const safeLine = Math.max(1, Math.min(lineNumber, state.editorView.state.doc.lines));
  const line = state.editorView.state.doc.line(safeLine);
  state.editorView.dispatch({
    selection: { anchor: line.from },
    scrollIntoView: true,
  });
}

/**
 * Navigates from the landing page to the dedicated execution workspace document.
 * A normal page URL makes the workspace bookmarkable and keeps it active after reloads.
 */
function showWorkspace() {
  window.location.assign("workspace.html");
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
      stopExecution("The program ran for too long and was stopped. It may contain an infinite loop.");
    }, 8000);
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
  state.error = result.error || null;
  state.currentStep = 0;
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
  state.error = null;
  state.currentStep = 0;
  els.emptyStory.classList.remove("hidden");
  els.traceContent.classList.add("hidden");
  els.emptyLoop.classList.remove("hidden");
  els.loopContent.classList.add("hidden");
  els.loopBadge.textContent = "0";
  els.stepCount.textContent = "STEP 00 / 00";
  setConsole("// Output will appear here", "muted");
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
  if (event === "return" || /^return\b/.test(line)) return "RETURN";
  if (step && isLoopExitStep(step)) return "LOOP COMPLETE";
  if (/^for\b/.test(line)) return "FOR LOOP";
  if (/^while\b/.test(line)) return "WHILE LOOP";
  if (/^(if|elif)\b/.test(line)) return "CONDITION";
  if (/^else\s*:/.test(line)) return "ELSE BRANCH";
  if (/^def\b/.test(line)) return "FUNCTION";
  if (/^print\s*\(/.test(line)) return "OUTPUT";
  if (/^[A-Za-z_]\w*\s*(\+=|-=|\*=|\/=|\/\/=|%=)/.test(line)) return "UPDATE";
  if (/^[A-Za-z_]\w*\s*=/.test(line)) return "ASSIGNMENT";
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
    return `Python checked whether ${condition} is true before continuing the loop.`;
  }
  if (/^(if|elif)\s+(.+):$/.test(line)) {
    const condition = line.match(/^(?:if|elif)\s+(.+):$/)?.[1];
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
  renderLoopLab(index);
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
      const card = document.createElement("div");
      card.className = "variable-card";
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
      return card;
    }),
  );
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
      item.innerHTML = `<span></span><span></span>`;
      item.children[0].textContent = name;
      item.children[1].textContent = `${Object.keys(frame.locals || {}).length} local${Object.keys(frame.locals || {}).length === 1 ? "" : "s"}`;
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
 * Switches the explanatory panel between Execution Story and Loop Lab.
 * ARIA selection values and hidden classes are updated together for visual and assistive-technology consistency.
 * @param {"story"|"loop"} panel Panel that should become visible.
 */
function switchPanel(panel) {
  state.activePanel = panel;
  const storyActive = panel === "story";
  els.storyTab.classList.toggle("active", storyActive);
  els.loopTab.classList.toggle("active", !storyActive);
  els.storyTab.setAttribute("aria-selected", String(storyActive));
  els.loopTab.setAttribute("aria-selected", String(!storyActive));
  els.storyView.classList.toggle("hidden", !storyActive);
  els.loopView.classList.toggle("hidden", storyActive);
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
 * Each card saves source, closes the dialog, and either updates the open workspace or navigates there.
 * Text nodes use textContent so example metadata remains safe by default.
 */
function renderExamples() {
  els.exampleGrid.replaceChildren(
    ...EXAMPLES.map((example) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "example-card";
      button.innerHTML = `
        <span class="example-topic"></span>
        <h3></h3>
        <p></p>`;
      button.querySelector(".example-topic").textContent = example.topic;
      button.querySelector("h3").textContent = example.title;
      button.querySelector("p").textContent = example.description;
      button.addEventListener("click", () => {
        setCode(example.code);
        els.examplesDialog.close();
        if (els.workspace) {
          showToast(`${example.title} loaded. Press Run trace when you are ready.`);
        } else {
          showWorkspace();
        }
      });
      return button;
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
  els.startButton?.addEventListener("click", showWorkspace);
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
  els.loopTab?.addEventListener("click", () => switchPanel("loop"));
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
