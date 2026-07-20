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

/** Browser storage key for learner-selected watch names and prepared stdin values. */
const LEARNING_PREFERENCES_STORAGE_KEY = "code-explorer-learning-preferences";

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
 * Restores the small pieces of learner-authored workspace state that remain useful across reloads.
 * Trace bookmarks are intentionally excluded because they belong to one specific execution.
 * @returns {{watches: string[], inputs: string}} Valid local learning preferences.
 */
function loadLearningPreferences() {
  try {
    const stored = JSON.parse(localStorage.getItem(LEARNING_PREFERENCES_STORAGE_KEY) || "null");
    const watches = Array.isArray(stored?.watches)
      ? stored.watches.filter((name) => typeof name === "string" && /^[A-Za-z_]\w*$/.test(name)).slice(0, 12)
      : [];
    return { watches, inputs: typeof stored?.inputs === "string" ? stored.inputs : "" };
  } catch (error) {
    console.warn("Code Explorer could not read learning preferences.", error);
    return { watches: [], inputs: "" };
  }
}

/** Saves watches and prepared input without coupling them to the Python source document. */
function saveLearningPreferences() {
  try {
    localStorage.setItem(LEARNING_PREFERENCES_STORAGE_KEY, JSON.stringify({
      watches: [...state.watches],
      inputs: els.programInputs?.value || "",
    }));
  } catch (error) {
    console.warn("Code Explorer could not save learning preferences.", error);
  }
}

/**
 * Prepares the sample responses bundled with an input-focused starter program.
 * The value is written both to the open workspace and browser storage so a
 * selection made on the landing page is ready after navigation.
 * @param {string} inputs Newline-separated responses consumed by input().
 */
function prepareExampleInputs(inputs) {
  if (els.programInputs) {
    els.programInputs.value = inputs;
    renderInputStatus();
  }
  try {
    localStorage.setItem(LEARNING_PREFERENCES_STORAGE_KEY, JSON.stringify({
      watches: [...state.watches],
      inputs,
    }));
  } catch (error) {
    console.warn("Code Explorer could not save the example inputs.", error);
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
    category: "Basics",
    topic: "Variables",
    level: "Beginner",
    title: "A tiny calculation",
    description: "Watch names appear and values move through an expression.",
    views: ["Story", "Before and After", "Variables"],
    code: `price = 8
quantity = 3
total = price * quantity
print("Total:", total)`,
  },
  {
    category: "Basics",
    topic: "Strings",
    level: "Beginner",
    title: "Building a message",
    description: "Combine text values and inspect the new string at each step.",
    views: ["Story", "Before and After", "Structures"],
    code: `language = "Python"
adjective = "visual"
message = language + " is " + adjective
print(message)`,
  },
  {
    category: "Decisions",
    topic: "Conditions",
    level: "Beginner",
    title: "Pass or try again",
    description: "See which path Python chooses after checking a condition.",
    views: ["Conditions", "Coverage", "Story"],
    code: `score = 72

if score >= 50:
    result = "Pass"
else:
    result = "Try again"

print(result)`,
  },
  {
    category: "Decisions",
    topic: "Boolean logic",
    level: "Intermediate",
    title: "Checking multiple conditions",
    description: "Break an and expression into the two facts Python checks.",
    views: ["Conditions", "Before and After", "Coverage"],
    code: `age = 20
has_ticket = True

if age >= 18 and has_ticket:
    result = "Enter"
else:
    result = "Wait"

print(result)`,
  },
  {
    category: "Decisions",
    topic: "Input and branches",
    level: "Beginner",
    title: "Different inputs, different paths",
    description: "Change one prepared score and compare the branch and output.",
    views: ["Input Playground", "Compare Runs", "Conditions"],
    inputs: "72",
    code: `score = int(input("Score: "))

if score >= 50:
    message = "Pass"
else:
    message = "Try again"

print(message)`,
  },
  {
    category: "Loops",
    topic: "For loop",
    level: "Beginner",
    title: "Running total",
    description: "See an accumulator change during each loop iteration.",
    views: ["Loop Table", "Loop Lab", "Coverage"],
    code: DEFAULT_CODE,
  },
  {
    category: "Loops",
    topic: "While loop",
    level: "Beginner",
    title: "Countdown",
    description: "Follow a condition and changing counter until the loop ends.",
    views: ["Conditions", "Execution Path", "Loop Lab"],
    code: `count = 3

while count > 0:
    print(count)
    count -= 1

print("Lift off!")`,
  },
  {
    category: "Loops",
    topic: "Break",
    level: "Intermediate",
    title: "Find the first match",
    description: "Watch break end a search as soon as the target is found.",
    views: ["Execution Path", "Coverage", "Loop Table"],
    code: `numbers = [4, 7, 12, 15]
target = 12
found_at = -1

for index in range(len(numbers)):
    if numbers[index] == target:
        found_at = index
        break

print("Found at:", found_at)`,
  },
  {
    category: "Loops",
    topic: "Continue",
    level: "Intermediate",
    title: "Skip unwanted values",
    description: "See continue skip even values while the loop keeps moving.",
    views: ["Execution Path", "Coverage", "Loop Table"],
    code: `kept = []

for number in range(1, 7):
    if number % 2 == 0:
        continue
    kept.append(number)

print(kept)`,
  },
  {
    category: "Functions",
    topic: "Functions",
    level: "Beginner",
    title: "A function call",
    description: "Watch a local frame appear, calculate, and return a value.",
    views: ["Function Journey", "Story", "Variables"],
    code: `def double(number):
    result = number * 2
    return result

answer = double(4)
print(answer)`,
  },
  {
    category: "Functions",
    topic: "Nested calls",
    level: "Intermediate",
    title: "One function calling another",
    description: "Follow two function frames as a value moves down and back up.",
    views: ["Function Journey", "Story", "Variables"],
    code: `def add_tax(price):
    return price * 1.10

def final_price(price, discount):
    reduced = price - discount
    return add_tax(reduced)

total = final_price(50, 5)
print(round(total, 2))`,
  },
  {
    category: "Collections",
    topic: "Lists",
    level: "Beginner",
    title: "Growing a list",
    description: "Observe a list as values are appended inside a loop.",
    views: ["Structures", "Mutation Explorer", "Loop Table"],
    code: `squares = []

for number in range(1, 4):
    squares.append(number * number)

print(squares)`,
  },
  {
    category: "Collections",
    topic: "Aliases",
    level: "Intermediate",
    title: "Two names sharing one list",
    description: "See how mutation through one name appears through the other.",
    views: ["References", "Mutation Explorer", "Variables"],
    code: `first = [1, 2]
second = first
second.append(3)

print("first:", first)
print("second:", second)`,
  },
  {
    category: "Collections",
    topic: "Object identity",
    level: "Intermediate",
    title: "Mutate or replace a list",
    description: "Compare changing Object A with assigning a new Object B.",
    views: ["Mutation Explorer", "References", "Before and After"],
    code: `items = []
original = items

items.append("book")
items = ["new"]

print("original:", original)
print("items:", items)`,
  },
  {
    category: "Collections",
    topic: "Nested data",
    level: "Intermediate",
    title: "Nested student data",
    description: "Open a dictionary containing a list and follow a nested update.",
    views: ["Variables", "Structures", "References"],
    code: `student = {
    "name": "Aman",
    "scores": [72, 84]
}

student["scores"].append(91)
average = sum(student["scores"]) / len(student["scores"])

print(student["name"], round(average, 1))`,
  },
  {
    category: "Collections",
    topic: "Dictionaries",
    level: "Intermediate",
    title: "Counting words",
    description: "Watch dictionary keys appear and counts change inside a loop.",
    views: ["Structures", "Mutation Explorer", "Loop Table"],
    code: `words = ["code", "learn", "code", "trace"]
counts = {}

for word in words:
    counts[word] = counts.get(word, 0) + 1

print(counts)`,
  },
  {
    category: "Input and Errors",
    topic: "Input",
    level: "Beginner",
    title: "A personalized greeting",
    description: "Prepare two input values and watch Python consume them in order.",
    views: ["Input Playground", "Conditions", "Compare Runs"],
    inputs: "Aman\n25",
    code: `name = input("Your name: ")
age = int(input("Your age: "))

if age >= 18 and name:
    message = "Welcome, " + name
else:
    message = "Keep learning, " + name

print(message)`,
  },
  {
    category: "Input and Errors",
    topic: "Errors",
    level: "Beginner",
    title: "An index to investigate",
    description: "Stop at an IndexError and inspect the state that explains it.",
    views: ["Error Coach", "Variables", "Structures"],
    code: `colors = ["mint", "purple"]
requested_index = 2
print(colors[requested_index])`,
  },
];

/** Ordered filters keep the larger example library easy to scan without hiding its complete size. */
const EXAMPLE_CATEGORIES = Object.freeze([
  "All",
  "Basics",
  "Decisions",
  "Loops",
  "Functions",
  "Collections",
  "Input and Errors",
]);

/**
 * Cached references to every interactive or dynamically updated DOM element.
 *
 * Looking up each id once is both faster and easier to audit than scattering
 * document.getElementById calls throughout rendering functions. The resulting
 * object uses the id as its property name, such as els.runButton.
 */
const els = Object.fromEntries(
  [
    "runtimeStatus", "runtimeLabel", "themeButton", "themeLabel", "welcomeScreen", "workspace",
    "heroExampleButton", "backButton", "examplesButton", "runButton", "stopButton",
    "editor", "editorShell", "editorWrapButton", "editorFontSizeSelect", "editorCopyButton", "editorPasteButton",
    "codeStats", "storyTab", "beforeAfterTab", "conditionsTab", "functionsTab", "errorTab",
    "variablesTab", "watchesTab", "structuresTab", "referencesTab", "mutationTab", "flowTab",
    "coverageTab", "loopTableTab", "loopTab", "inputTab", "compareTab", "bookmarksTab",
    "loopBadge", "watchBadge", "bookmarkBadge", "storyView", "beforeAfterView", "conditionsView", "functionsView",
    "errorView", "variablesView", "watchesView", "structuresView", "referencesView", "mutationView", "flowView",
    "coverageView", "loopTableView", "loopView", "inputView", "compareView", "bookmarksView",
    "emptyStory", "traceContent", "traceKicker", "executedCode", "explanation", "changeList",
    "emptyBeforeAfter", "beforeAfterContent", "beforeAfterGrid", "changeSummary",
    "emptyErrorCoach", "errorContent", "errorCoach", "errorCoachTitle", "errorCoachMeaning", "errorCoachTip",
    "stepOutputSection", "stepOutput", "variablesGrid", "callStackSection", "callStack",
    "emptyConditions", "conditionsContent", "emptyFunctions", "functionsContent",
    "emptyVariables", "variablesContent", "scopeBrowser", "variableInspector", "emptyReferences",
    "referencesContent", "referencesGraph", "referencesZoomSlider", "referencesZoomValue",
    "decreaseReferencesZoomButton", "increaseReferencesZoomButton", "fitReferencesButton",
    "emptyWatches", "watchesContent", "emptyStructures", "structuresContent", "emptyMutation", "mutationContent",
    "emptyFlow", "flowContent", "flowGraph", "flowZoomSlider", "flowZoomValue",
    "decreaseFlowZoomButton", "increaseFlowZoomButton", "fitFlowButton", "emptyLoop", "loopContent", "loopType",
    "emptyCoverage", "coverageContent", "emptyLoopTable", "loopTableContent", "iterationCount", "loopSource", "loopMeter", "iterationList", "loopTable",
    "programInputs", "inputStatus", "captureRunAButton", "captureRunBButton", "clearComparisonsButton", "comparisonResult",
    "emptyBookmarks", "bookmarksContent", "stepCount", "previousButton",
    "playButton", "nextButton", "restartButton", "bookmarkButton", "stepSlider", "progressPercent", "speedSelect",
    "consoleOutput", "clearOutputButton", "examplesDialog", "closeExamplesButton", "exampleFilters", "exampleCount", "exampleGrid", "toast",
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
  // The primary learning area filters secondary tabs so the growing workspace remains scannable.
  activeMode: "trace",
  // Remembers the variable selected in the detailed inspector across trace steps.
  selectedVariable: null,
  // Learner-selected watch names remain visible regardless of the active detail view.
  watches: new Set(loadLearningPreferences().watches),
  // Breakpoints are source-line markers that pause trace replay before the selected line advances.
  breakpoints: new Set(),
  // Bookmarks belong to the current execution and form a learner-authored trace index.
  bookmarks: new Set(),
  // Two bounded snapshots support scenario comparison without retaining unlimited traces.
  comparisonRuns: { a: null, b: null },
  // The worker reports every controlled input exchange so the Scenario Lab can confirm consumption.
  inputLog: [],
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
  // Keeps the selected example category stable while cards are rerendered.
  activeExampleCategory: "All",
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
 * The data attribute lets CSS variables swap the whole palette, while the visible button text names the available action.
 * @param {"light"|"dark"} theme The theme that should become active.
 */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("code-explorer-theme", theme);
  // The control describes the theme the user can switch to, rather than merely reporting the active theme.
  const nextThemeLabel = theme === "dark" ? "Light mode" : "Dark mode";
  // Visible text helps every user understand the control, including people unfamiliar with theme glyphs.
  if (els.themeLabel) els.themeLabel.textContent = nextThemeLabel;
  // The accessible name adds the action verb while matching the same destination theme.
  els.themeButton?.setAttribute("aria-label", `Switch to ${nextThemeLabel.toLowerCase()}`);
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
    // Every nonempty line is one deterministic response returned by Python's input().
    const preparedInputText = els.programInputs?.value || "";
    const inputs = preparedInputText === "" ? [] : preparedInputText.split("\n");
    state.worker.postMessage({ type: "run", runId: state.runId, source, inputs });
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
  state.inputLog = result.inputLog || [];
  state.currentStep = 0;
  state.selectedVariable = null;
  state.bookmarks.clear();
  updateBookmarkControls();
  renderInputStatus();
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
  els.bookmarkButton.disabled = false;
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
  state.inputLog = [];
  state.currentStep = 0;
  state.selectedVariable = null;
  state.bookmarks.clear();
  state.referencesGraph?.destroy();
  state.referencesGraph = null;
  state.flowGraph?.destroy();
  state.flowGraph = null;
  els.emptyVariables.classList.remove("hidden");
  els.variablesContent.classList.add("hidden");
  els.emptyBeforeAfter.classList.remove("hidden");
  els.beforeAfterContent.classList.add("hidden");
  els.emptyErrorCoach.classList.remove("hidden");
  els.errorContent.classList.add("hidden");
  els.emptyReferences.classList.remove("hidden");
  els.referencesContent.classList.add("hidden");
  els.emptyFlow.classList.remove("hidden");
  els.flowContent.classList.add("hidden");
  els.emptyStory.classList.remove("hidden");
  els.traceContent.classList.add("hidden");
  els.emptyLoop.classList.remove("hidden");
  els.loopContent.classList.add("hidden");
  els.emptyLoopTable.classList.remove("hidden");
  els.loopTableContent.classList.add("hidden");
  els.emptyMutation.classList.remove("hidden");
  els.mutationContent.classList.add("hidden");
  els.loopBadge.textContent = "0";
  updateBookmarkControls();
  renderInputStatus();
  els.stepCount.textContent = "STEP 00 / 00";
  setConsole("// Output will appear here", "muted");
  renderEditorHeatmap();
  renderWatches();
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
  if (els.bookmarkButton) els.bookmarkButton.disabled = true;
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

/** Returns the previous visible value map used by side-by-side state explanations. */
function previousVariables(index) {
  return index > 0 ? variablesForStep(state.trace[index - 1]) : {};
}

/**
 * Renders a compact before-and-after table for every value affected by the current instruction.
 * Creation and removal use plain phrases so a beginner never has to interpret an empty cell.
 */
function renderBeforeAfter(index) {
  const hasTrace = state.trace.length > 0;
  els.emptyBeforeAfter.classList.toggle("hidden", hasTrace);
  els.beforeAfterContent.classList.toggle("hidden", !hasTrace);
  if (!hasTrace) return;
  const current = variablesForStep(state.trace[index]);
  const previous = previousVariables(index);
  const changes = changesAt(index);
  els.changeSummary.textContent = changes.length
    ? `${changes.length} change${changes.length === 1 ? "" : "s"}`
    : "No visible change";
  els.beforeAfterGrid.replaceChildren();
  const names = changes.length ? changes.map((change) => change.name) : Object.keys(current).slice(0, 4);
  if (!names.length) {
    const empty = document.createElement("p");
    empty.className = "learning-empty-copy";
    empty.textContent = "No visible variables exist at this step.";
    els.beforeAfterGrid.append(empty);
    return;
  }
  names.slice(0, 8).forEach((name) => {
    const row = document.createElement("div");
    row.className = `state-comparison-row ${changes.some((change) => change.name === name) ? "changed" : ""}`;
    const label = document.createElement("strong");
    label.textContent = name;
    const before = document.createElement("code");
    before.dataset.label = "Before";
    before.textContent = previous[name]?.display ?? "not created";
    const arrow = document.createElement("span");
    arrow.className = "comparison-arrow";
    arrow.textContent = "→";
    const after = document.createElement("code");
    after.dataset.label = "After";
    after.textContent = current[name]?.display ?? "out of scope";
    row.append(label, before, arrow, after);
    els.beforeAfterGrid.append(row);
  });
}

/** Beginner-safe explanations for the most common Python runtime and syntax failures. */
const ERROR_GUIDANCE = Object.freeze({
  SyntaxError: ["Python could not understand the program's grammar.", "Check punctuation, brackets, colons, and the highlighted line."],
  IndentationError: ["A block is not indented in the structure Python expects.", "Use consistent spaces and align statements that belong to the same block."],
  NameError: ["Python tried to use a name that does not exist in the current scope.", "Check spelling and make sure the variable is created before this line."],
  TypeError: ["The operation does not support the type of value it received.", "Inspect the visible value types and convert them only when that matches your intention."],
  ValueError: ["The value has the right general type but an unacceptable value.", "Inspect the exact input and the conversion or operation performed here."],
  IndexError: ["The program requested a sequence position that does not exist.", "Remember that the first index is 0 and the final index is length minus 1."],
  KeyError: ["The requested dictionary key is not present.", "Inspect the dictionary keys or use get() when a missing key is expected."],
  ZeroDivisionError: ["The program attempted to divide by zero.", "Check the divisor before performing the calculation."],
  AttributeError: ["This value does not provide the requested attribute or method.", "Inspect its type and check the method name for spelling."],
  EOFError: ["The program requested an input value that was not prepared.", "Add another line in Input Playground and run the trace again."],
});

/** Shows rule-based error guidance only at the failing step or terminal trace position. */
function renderErrorCoach(step, index) {
  const detail = step.event === "exception" ? step.detail : index === state.trace.length - 1 ? state.error : null;
  els.emptyErrorCoach.classList.toggle("hidden", Boolean(detail));
  els.errorContent.classList.toggle("hidden", !detail);
  if (!detail) return;
  const [meaning, tip] = ERROR_GUIDANCE[detail.type] || [
    "Python stopped because this instruction raised an exception.",
    "Inspect the state immediately before this step and read the original message carefully.",
  ];
  els.errorCoachTitle.textContent = `${detail.type}: ${detail.message}`;
  els.errorCoachMeaning.textContent = meaning;
  els.errorCoachTip.textContent = `Try this: ${tip}`;
}

/** Finds the most recently reached condition so the investigator remains useful after a branch line. */
function conditionNearStep(index) {
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    const step = state.trace[cursor];
    const metadata = state.conditions.find((item) => item.line === step.line)
      || state.loops.find((item) => item.type === "while" && item.line === step.line);
    if (metadata) return { metadata, step, index: cursor };
  }
  return null;
}

/** Converts a supported serialized primitive into its real JavaScript value for display-only condition reasoning. */
function conditionOperand(token, variables) {
  const text = token.trim();
  if (Object.hasOwn(variables, text) && ["NoneType", "bool", "int", "float", "str"].includes(variables[text].type)) {
    return { supported: true, value: variables[text].value };
  }
  const lengthMatch = text.match(/^len\(([A-Za-z_]\w*)\)$/);
  if (lengthMatch && Number.isFinite(variables[lengthMatch[1]]?.length)) {
    return { supported: true, value: variables[lengthMatch[1]].length };
  }
  if (/^-?\d+(?:\.\d+)?$/.test(text)) return { supported: true, value: Number(text) };
  if (text === "True") return { supported: true, value: true };
  if (text === "False") return { supported: true, value: false };
  if (text === "None") return { supported: true, value: null };
  if ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'"))) {
    return { supported: true, value: text.slice(1, -1) };
  }
  return { supported: false, value: undefined };
}

/**
 * Explains only simple, side-effect-free Boolean terms from captured values.
 * Unsupported calls or compound syntax return null instead of being executed or guessed.
 */
function evaluateSimpleConditionTerm(term, variables) {
  const text = term.trim();
  const negated = text.startsWith("not ");
  const candidate = negated ? text.slice(4).trim() : text;
  const comparison = candidate.match(/^(.+?)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
  let result;
  if (comparison) {
    const left = conditionOperand(comparison[1], variables);
    const right = conditionOperand(comparison[3], variables);
    if (!left.supported || !right.supported) return null;
    // Python treats bool as a numeric subtype for equality, unlike JavaScript's strict equality.
    const bothNumeric = [left.value, right.value].every((value) => typeof value === "number" || typeof value === "boolean");
    const equal = bothNumeric ? Number(left.value) === Number(right.value) : left.value === right.value;
    const operations = {
      "==": () => equal,
      "!=": () => !equal,
      ">=": () => left.value >= right.value,
      "<=": () => left.value <= right.value,
      ">": () => left.value > right.value,
      "<": () => left.value < right.value,
    };
    result = operations[comparison[2]]();
  } else {
    const operand = conditionOperand(candidate, variables);
    if (!operand.supported) return null;
    result = Boolean(operand.value);
  }
  return negated ? !result : result;
}

/** Renders the observed condition result and a readable decomposition without reevaluating user code. */
function renderConditionInvestigator() {
  const found = state.trace.length ? conditionNearStep(state.currentStep) : null;
  els.emptyConditions.classList.toggle("hidden", Boolean(found));
  els.conditionsContent.classList.toggle("hidden", !found);
  if (!found) return;
  const source = found.metadata.source || found.step.source.trim();
  const expression = source.replace(/^(?:if|elif|while)\s+/, "").replace(/:\s*$/, "");
  const outcome = conditionOutcome(found.step);
  const operators = expression.split(/\s+(and|or)\s+/);
  els.conditionsContent.replaceChildren();
  const header = document.createElement("section");
  header.className = "learning-card condition-result-card";
  header.innerHTML = '<div class="section-label">OBSERVED CONDITION</div>';
  const code = document.createElement("code");
  code.className = "condition-code";
  code.textContent = expression;
  const result = document.createElement("div");
  result.className = `condition-outcome ${outcome === true ? "true" : outcome === false ? "false" : "unknown"}`;
  result.textContent = outcome === null ? "Result could not be isolated safely" : `${outcome ? "True" : "False"} path observed`;
  header.append(code, result);
  if (operators.length > 1) {
    const pieces = document.createElement("div");
    pieces.className = "condition-pieces";
    const variables = variablesForStep(found.step);
    const booleanOperators = operators.filter((_, pieceIndex) => pieceIndex % 2 === 1);
    const uniformOperator = booleanOperators.every((operator) => operator === booleanOperators[0]);
    let shortCircuited = false;
    let previousResult = null;
    operators.forEach((piece, pieceIndex) => {
      const token = document.createElement(pieceIndex % 2 ? "span" : "code");
      token.className = pieceIndex % 2 ? "boolean-operator" : "condition-piece";
      if (pieceIndex % 2) {
        token.textContent = piece;
      } else {
        const priorOperator = pieceIndex > 0 ? operators[pieceIndex - 1] : null;
        if (uniformOperator && ((priorOperator === "and" && previousResult === false) || (priorOperator === "or" && previousResult === true))) {
          shortCircuited = true;
        }
        const termResult = shortCircuited ? null : evaluateSimpleConditionTerm(piece, variables);
        token.textContent = shortCircuited
          ? `${piece} · not evaluated`
          : termResult === null
            ? piece
            : `${piece} · ${termResult ? "True" : "False"}`;
        if (termResult !== null) previousResult = termResult;
      }
      pieces.append(token);
    });
    header.append(pieces);
  }
  const note = document.createElement("p");
  note.className = "safety-note";
  note.textContent = "Code Explorer reports the path Python actually took. It does not run the expression a second time.";
  header.append(note);
  els.conditionsContent.append(header);
}

/** Renders caller, active function frame, visible locals, and the latest observed return value. */
function renderFunctionJourney() {
  if (!state.trace.length) return;
  const step = state.trace[state.currentStep];
  let journeyIndex = state.currentStep;
  while (journeyIndex >= 0 && (state.trace[journeyIndex].frames?.length || 0) < 2) journeyIndex -= 1;
  const journeyStep = journeyIndex >= 0 ? state.trace[journeyIndex] : null;
  const frames = journeyStep?.frames || [];
  const hasJourney = frames.length > 1;
  els.emptyFunctions.classList.toggle("hidden", hasJourney);
  els.functionsContent.classList.toggle("hidden", !hasJourney);
  if (!hasJourney) return;
  const caller = frames.at(-2);
  const active = frames.at(-1);
  const returnStep = state.trace.slice(journeyIndex).find((candidate) => candidate.event === "return" && candidate.source.trim().startsWith("return"));
  els.functionsContent.replaceChildren();
  const journey = document.createElement("div");
  journey.className = "function-journey";
  const stages = [
    ["CALLER", caller.name === "<module>" ? "global frame" : `${caller.name}()`],
    ["FUNCTION", `${active.name}()`],
    ["LOCAL VALUES", Object.entries(active.locals || {}).filter(([, value]) => !["function", "module"].includes(value.type)).map(([name, value]) => `${name} = ${value.display}`).join("\n") || "No visible locals"],
    ["RETURN", returnStep?.detail?.display ?? "Not returned yet"],
  ];
  stages.forEach(([label, value], index) => {
    const stage = document.createElement("section");
    stage.className = "journey-stage";
    const kicker = document.createElement("span");
    kicker.textContent = label;
    const content = document.createElement("code");
    content.textContent = value;
    stage.append(kicker, content);
    journey.append(stage);
    if (index < stages.length - 1) {
      const connector = document.createElement("div");
      connector.className = "journey-connector";
      connector.textContent = "↓";
      journey.append(connector);
    }
  });
  els.functionsContent.append(journey);
}

/** Updates all derived learning panels that follow the current trace position. */
function renderLearningPanels(step, index) {
  renderBeforeAfter(index);
  renderErrorCoach(step, index);
  renderConditionInvestigator();
  renderFunctionJourney();
  renderWatches();
  renderStructures();
  renderMutationExplorer();
  renderCoverage();
  renderBookmarks();
  updateBookmarkControls();
}

/**
 * Renders the complete workspace for the currently selected trace snapshot.
 * This coordinator updates progress, explanation, variables, call stack, Loop Lab, editor focus, and synchronized console output together.
 */
function renderStep() {
  if (!state.trace.length) return;
  const index = Math.max(0, Math.min(state.currentStep, state.trace.length - 1));
  state.currentStep = index;
  const recordedStep = state.trace[index];
  // Python can emit a final return event while unwinding after an exception; the terminal view should still teach the real failure.
  const step = state.error && index === state.trace.length - 1 && state.error.line === recordedStep.line
    ? { ...recordedStep, event: "exception", detail: state.error }
    : recordedStep;
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
  renderLearningPanels(step, index);
  renderEditorHeatmap();
  renderBreakpointGutter();
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
  const watchButton = document.createElement("button");
  watchButton.type = "button";
  watchButton.className = `small-action ${state.watches.has(name) ? "active" : ""}`;
  watchButton.textContent = state.watches.has(name) ? "Watching" : "Watch";
  watchButton.addEventListener("click", () => toggleWatch(name));
  heading.append(title, typeBadge, watchButton);

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

  const watches = document.createElement("section");
  watches.className = "watch-strip";
  const watchLabel = document.createElement("span");
  watchLabel.className = "section-label";
  watchLabel.textContent = "WATCHES";
  watches.append(watchLabel);
  if (!state.watches.size) {
    const empty = document.createElement("span");
    empty.textContent = "Select a variable and choose Watch.";
    watches.append(empty);
  } else {
    [...state.watches].forEach((watchName) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "watch-chip";
      chip.textContent = `${watchName} = ${variables[watchName]?.display ?? "not in scope"}`;
      chip.addEventListener("click", () => {
        if (variables[watchName]) state.selectedVariable = watchName;
        renderVariableExplorer();
      });
      watches.append(chip);
    });
  }
  els.variableInspector.append(watches, heading, metadata, contentsLabel, tree, historyLabel, historyTable);
}

/** Adds or removes one safe identifier from the persistent watch collection. */
function toggleWatch(name) {
  if (state.watches.has(name)) state.watches.delete(name);
  else if (state.watches.size < 12) state.watches.add(name);
  else {
    showToast("Watch up to 12 variables at a time.", true);
    return;
  }
  saveLearningPreferences();
  renderVariableExplorer();
  renderWatches();
  showToast(state.watches.has(name) ? `${name} added to Watches.` : `${name} removed from Watches.`);
}

/** Renders persistent watched names as a dedicated dashboard with value, type, and lifetime context. */
function renderWatches() {
  const names = [...state.watches];
  els.watchBadge.textContent = String(names.length);
  els.emptyWatches.classList.toggle("hidden", names.length > 0);
  els.watchesContent.classList.toggle("hidden", names.length === 0);
  if (!names.length) return;
  const variables = state.trace.length ? variablesForStep(state.trace[state.currentStep]) : {};
  els.watchesContent.replaceChildren();
  const heading = document.createElement("div");
  heading.className = "watch-dashboard-heading";
  const title = document.createElement("div");
  title.className = "section-label";
  title.textContent = "WATCHED VARIABLES";
  const count = document.createElement("span");
  count.className = "context-badge";
  count.textContent = `${names.length} pinned`;
  heading.append(title, count);
  const grid = document.createElement("div");
  grid.className = "watch-dashboard-grid";
  names.forEach((name) => {
    const value = variables[name];
    const card = document.createElement("article");
    card.className = `watch-dashboard-card ${value ? "in-scope" : "out-of-scope"}`;
    const cardHeading = document.createElement("div");
    const variableName = document.createElement("h3");
    variableName.textContent = name;
    const type = document.createElement("span");
    type.className = "inspector-type";
    type.textContent = value?.type || "not in scope";
    cardHeading.append(variableName, type);
    const display = document.createElement("code");
    display.textContent = value?.display ?? "This name has not been created at the selected step.";
    const actions = document.createElement("div");
    actions.className = "watch-dashboard-actions";
    const inspect = document.createElement("button");
    inspect.type = "button";
    inspect.className = "small-action";
    inspect.textContent = "Inspect";
    inspect.disabled = !value;
    inspect.addEventListener("click", () => {
      state.selectedVariable = name;
      switchPanel("variables");
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "small-action";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => toggleWatch(name));
    actions.append(inspect, remove);
    card.append(cardHeading, display, actions);
    grid.append(card);
  });
  els.watchesContent.append(heading, grid);
}

/** Selects a container-like value and renders its indexes, keys, contents, and identity behavior. */
function renderStructures() {
  if (!state.trace.length) return;
  const variables = variablesForStep(state.trace[state.currentStep]);
  const supported = Object.entries(variables).filter(([, value]) =>
    ["list", "tuple", "dict", "set", "frozenset", "str"].includes(value.type));
  els.emptyStructures.classList.toggle("hidden", supported.length > 0);
  els.structuresContent.classList.toggle("hidden", supported.length === 0);
  if (!supported.length) return;
  let [name, value] = supported.find(([candidate]) => candidate === state.selectedVariable) || supported[0];
  state.selectedVariable = name;
  const history = variableHistory(name).filter((entry) => entry.index <= state.currentStep);
  const latest = history.at(-1);
  const mutationText = latest?.kind === "mutated"
    ? "The same object changed its contents."
    : latest?.kind === "changed"
      ? "The name now references a different value or object."
      : "This value has not changed since it was created.";
  els.structuresContent.replaceChildren();
  const picker = document.createElement("div");
  picker.className = "structure-picker";
  supported.forEach(([candidate, candidateValue]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `structure-choice ${candidate === name ? "active" : ""}`;
    button.textContent = `${candidate} · ${candidateValue.type}`;
    button.addEventListener("click", () => {
      state.selectedVariable = candidate;
      renderStructures();
    });
    picker.append(button);
  });
  const card = document.createElement("section");
  card.className = "learning-card structure-card";
  const header = document.createElement("div");
  header.className = "structure-heading";
  const title = document.createElement("h3");
  title.textContent = name;
  const badge = document.createElement("span");
  badge.className = "inspector-type";
  badge.textContent = `${value.type}${Number.isFinite(value.length) ? ` · ${value.length} item${value.length === 1 ? "" : "s"}` : ""}`;
  header.append(title, badge);
  const cells = document.createElement("div");
  cells.className = "structure-cells";
  if (value.type === "str") {
    [...(value.value || "")].slice(0, 30).forEach((character, index) => cells.append(createStructureCell(index, character)));
  } else if (Array.isArray(value.items)) {
    value.items.forEach((item, index) => cells.append(createStructureCell(index, item.display)));
  } else if (Array.isArray(value.entries)) {
    value.entries.forEach((entry) => cells.append(createStructureCell(entry.key?.display ?? "?", entry.value?.display ?? "?")));
  }
  const behavior = document.createElement("div");
  behavior.className = `mutation-note ${latest?.kind || "created"}`;
  behavior.textContent = mutationText;
  card.append(header, cells, behavior);
  els.structuresContent.append(picker, card);
}

/** Creates one index or key cell without using learner text as HTML. */
function createStructureCell(label, display) {
  const cell = document.createElement("div");
  cell.className = "structure-cell";
  const index = document.createElement("span");
  index.textContent = String(label);
  const value = document.createElement("code");
  value.textContent = String(display);
  cell.append(index, value);
  return cell;
}

/**
 * Renders a complete object-identity lesson for the selected mutable variable.
 * The view distinguishes creation, in-place mutation, and reassignment using captured object ids and value history.
 */
function renderMutationExplorer() {
  if (!state.trace.length) {
    els.emptyMutation.classList.remove("hidden");
    els.mutationContent.classList.add("hidden");
    return;
  }
  const variables = variablesForStep(state.trace[state.currentStep]);
  const mutableEntries = Object.entries(variables).filter(([, value]) => ["list", "dict", "set"].includes(value.type));
  els.emptyMutation.classList.toggle("hidden", mutableEntries.length > 0);
  els.mutationContent.classList.toggle("hidden", mutableEntries.length === 0);
  if (!mutableEntries.length) return;
  const [name, value] = mutableEntries.find(([candidate]) => candidate === state.selectedVariable) || mutableEntries[0];
  state.selectedVariable = name;
  const history = variableHistory(name).filter((entry) => entry.index <= state.currentStep);
  const event = history.at(-1);
  const before = event?.index > 0 ? variablesForStep(state.trace[event.index - 1])[name] : null;
  const sameObject = Boolean(before?.objectId && value.objectId && before.objectId === value.objectId);
  const kind = event?.kind === "mutated" || (before && sameObject && valueSignature(before) !== valueSignature(value))
    ? "mutation"
    : before && !sameObject
      ? "reassignment"
      : event?.kind === "created"
        ? "creation"
        : "unchanged";
  const aliases = Object.entries(variables)
    .filter(([otherName, otherValue]) => otherName !== name && value.objectId && otherValue.objectId === value.objectId)
    .map(([otherName]) => otherName);

  els.mutationContent.replaceChildren();
  const picker = document.createElement("div");
  picker.className = "structure-picker";
  mutableEntries.forEach(([candidate, candidateValue]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `structure-choice ${candidate === name ? "active" : ""}`;
    button.textContent = `${candidate} · ${candidateValue.type}`;
    button.addEventListener("click", () => {
      state.selectedVariable = candidate;
      renderMutationExplorer();
    });
    picker.append(button);
  });

  const lesson = document.createElement("section");
  lesson.className = `learning-card mutation-explorer-card ${kind}`;
  const heading = document.createElement("div");
  heading.className = "learning-card-heading";
  const label = document.createElement("span");
  label.className = "section-label";
  label.textContent = "OBJECT CHANGE";
  const badge = document.createElement("span");
  badge.className = `mutation-kind ${kind}`;
  badge.textContent = kind;
  heading.append(label, badge);

  const diagram = document.createElement("div");
  diagram.className = "mutation-diagram";
  const beforeStage = createMutationStage("BEFORE", name, before, kind === "creation" ? "Name did not exist" : "Object A");
  const connector = document.createElement("div");
  connector.className = "mutation-connector";
  connector.innerHTML = `<span>${kind === "mutation" ? "same object" : kind === "reassignment" ? "new object" : "observed state"}</span><strong>→</strong>`;
  const afterStage = createMutationStage("AFTER", name, value, kind === "reassignment" ? "Object B" : "Object A");
  diagram.append(beforeStage, connector, afterStage);

  const explanation = document.createElement("p");
  explanation.className = "mutation-explanation";
  const messages = {
    mutation: `${name} still references the same ${value.type} object, but that object's contents changed.`,
    reassignment: `${name} stopped referencing the earlier object and now references a different ${value.type} object.`,
    creation: `${name} was created and connected to this ${value.type} object.`,
    unchanged: `${name} still references the same object and its visible contents have not changed since the latest recorded event.`,
  };
  explanation.textContent = messages[kind];
  const aliasNote = document.createElement("p");
  aliasNote.className = "alias-note";
  aliasNote.textContent = aliases.length
    ? `Shared reference: ${aliases.join(", ")} ${aliases.length === 1 ? "points" : "point"} to the same object.`
    : "No other visible name references this object at the selected step.";
  lesson.append(heading, diagram, explanation, aliasNote);
  els.mutationContent.append(picker, lesson);
}

/** Creates one side of the Mutation Explorer reference diagram using safe text nodes. */
function createMutationStage(label, name, value, objectLabel) {
  const stage = document.createElement("div");
  stage.className = "mutation-stage";
  const kicker = document.createElement("span");
  kicker.textContent = label;
  const reference = document.createElement("div");
  reference.className = "mutation-reference";
  const variable = document.createElement("strong");
  variable.textContent = name;
  const arrow = document.createElement("span");
  arrow.textContent = "→";
  const object = document.createElement("div");
  object.className = "mutation-object";
  const objectName = document.createElement("small");
  objectName.textContent = objectLabel;
  const objectValue = document.createElement("code");
  objectValue.textContent = value?.display ?? "not created";
  object.append(objectName, objectValue);
  reference.append(variable, arrow, object);
  stage.append(kicker, reference);
  return stage;
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
    els.emptyLoopTable.classList.remove("hidden");
    els.loopTableContent.classList.add("hidden");
    return;
  }

  const loopsReached = state.loops.filter((loop) => loopOccurrences(loop, stepIndex).length > 0);
  const activeLoop = loopsReached.at(-1) || state.loops[0];
  const allOccurrences = loopOccurrences(activeLoop);
  const reached = loopOccurrences(activeLoop, stepIndex);
  const currentIteration = reached.length;

  els.emptyLoop.classList.add("hidden");
  els.loopContent.classList.remove("hidden");
  els.emptyLoopTable.classList.add("hidden");
  els.loopTableContent.classList.remove("hidden");
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

  // A real table makes changing loop values easier to compare than an animation alone.
  const variableNames = [...new Set(allOccurrences.flatMap((occurrence) => Object.keys(occurrence.variables)))].slice(0, 5);
  els.loopTable.replaceChildren();
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["Iteration", ...variableNames].forEach((label) => {
    const cell = document.createElement("th");
    cell.scope = "col";
    cell.textContent = label;
    headRow.append(cell);
  });
  head.append(headRow);
  const body = document.createElement("tbody");
  allOccurrences.slice(0, 100).forEach((occurrence, index) => {
    const row = document.createElement("tr");
    if (occurrence.index <= stepIndex) row.classList.add("reached");
    const iterationCell = document.createElement("th");
    iterationCell.scope = "row";
    const jump = document.createElement("button");
    jump.type = "button";
    jump.textContent = String(index + 1);
    jump.addEventListener("click", () => goToStep(occurrence.index));
    iterationCell.append(jump);
    row.append(iterationCell);
    variableNames.forEach((name) => {
      const cell = document.createElement("td");
      cell.textContent = occurrence.variables[name]?.display ?? "not set";
      row.append(cell);
    });
    body.append(row);
  });
  els.loopTable.append(head, body);
}

/** Returns source lines that are likely executable while excluding blank lines and comments. */
function executableSourceLines() {
  return getCode().split("\n").map((source, index) => ({ line: index + 1, source }))
    .filter(({ source }) => source.trim() && !source.trim().startsWith("#"));
}

/** Renders actual execution counts and clearly separates missed source from reached source. */
function renderCoverage() {
  const lines = executableSourceLines();
  const counts = new Map();
  state.trace.forEach((step) => counts.set(step.line, (counts.get(step.line) || 0) + 1));
  const hasCoverage = state.trace.length > 0;
  els.emptyCoverage.classList.toggle("hidden", hasCoverage);
  els.coverageContent.classList.toggle("hidden", !hasCoverage);
  if (!hasCoverage) return;
  const reached = lines.filter(({ line }) => counts.has(line)).length;
  els.coverageContent.replaceChildren();
  const summary = document.createElement("section");
  summary.className = "coverage-summary learning-card";
  const percent = lines.length ? Math.round((reached / lines.length) * 100) : 100;
  const number = document.createElement("strong");
  number.textContent = `${percent}%`;
  const copy = document.createElement("span");
  copy.textContent = `${reached} of ${lines.length} source lines reached`;
  summary.append(number, copy);
  const list = document.createElement("div");
  list.className = "coverage-list";
  lines.forEach(({ line, source }) => {
    const count = counts.get(line) || 0;
    const item = document.createElement("button");
    item.type = "button";
    item.className = `coverage-line ${count ? count > 1 ? "repeated" : "reached" : "missed"}`;
    const status = document.createElement("span");
    status.textContent = count ? (count > 1 ? `${count}x` : "✓") : "○";
    const number = document.createElement("span");
    number.textContent = String(line);
    const code = document.createElement("code");
    code.textContent = source.trim();
    item.append(status, number, code);
    item.addEventListener("click", () => {
      const traceIndex = state.trace.findIndex((step) => step.line === line);
      if (traceIndex >= 0) goToStep(traceIndex);
      else focusLine(line);
    });
    list.append(item);
  });
  els.coverageContent.append(summary, list);
}

/** Synchronizes the bookmark star, count badge, and accessible pressed state. */
function updateBookmarkControls() {
  if (!els.bookmarkButton) return;
  const active = state.bookmarks.has(state.currentStep);
  els.bookmarkButton.textContent = active ? "★" : "☆";
  els.bookmarkButton.setAttribute("aria-pressed", String(active));
  els.bookmarkBadge.textContent = String(state.bookmarks.size);
}

/** Adds or removes the current trace position from the temporary bookmark collection. */
function toggleBookmark() {
  if (!state.trace.length) return;
  if (state.bookmarks.has(state.currentStep)) state.bookmarks.delete(state.currentStep);
  else state.bookmarks.add(state.currentStep);
  updateBookmarkControls();
  renderBookmarks();
  showToast(state.bookmarks.has(state.currentStep) ? "Trace step bookmarked." : "Bookmark removed.");
}

/** Builds a chronological, clickable table of contents for learner-selected trace moments. */
function renderBookmarks() {
  const indexes = [...state.bookmarks].sort((first, second) => first - second);
  els.emptyBookmarks.classList.toggle("hidden", indexes.length > 0);
  els.bookmarksContent.classList.toggle("hidden", indexes.length === 0);
  if (!indexes.length) return;
  els.bookmarksContent.replaceChildren();
  indexes.forEach((index) => {
    const step = state.trace[index];
    if (!step) return;
    const row = document.createElement("div");
    row.className = `bookmark-row ${index === state.currentStep ? "active" : ""}`;
    const jump = document.createElement("button");
    jump.type = "button";
    jump.className = "bookmark-jump";
    const label = document.createElement("strong");
    label.textContent = `Step ${index + 1} · Line ${step.line}`;
    const code = document.createElement("code");
    code.textContent = step.source.trim();
    jump.append(label, code);
    jump.addEventListener("click", () => goToStep(index));
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "bookmark-remove";
    remove.setAttribute("aria-label", `Remove bookmark at step ${index + 1}`);
    remove.textContent = "×";
    remove.addEventListener("click", () => {
      state.bookmarks.delete(index);
      updateBookmarkControls();
      renderBookmarks();
    });
    row.append(jump, remove);
    els.bookmarksContent.append(row);
  });
}

/** Reports prepared and consumed stdin values without exposing a modal prompt during execution. */
function renderInputStatus() {
  if (!els.inputStatus) return;
  const prepared = (els.programInputs.value || "").split("\n").filter((value) => value.length > 0).length;
  const consumed = state.inputLog.length;
  els.inputStatus.textContent = consumed
    ? `${consumed} prepared value${consumed === 1 ? "" : "s"} consumed by the latest run.`
    : prepared
      ? `${prepared} input value${prepared === 1 ? "" : "s"} prepared.`
      : "No input values prepared.";
}

/** Creates a bounded, detached comparison snapshot from the latest result. */
function currentRunSummary() {
  if (!state.trace.length) return null;
  return {
    source: getCode(),
    // Comparison reports only values the program actually consumed, not unrelated prepared leftovers.
    inputs: state.inputLog.map((entry) => entry.value).join("\n"),
    // Visible variable signatures let comparison detect different state even when both runs print the same text.
    steps: state.trace.map((step) => ({
      line: step.line,
      source: step.source,
      output: step.output,
      variables: Object.fromEntries(Object.entries(variablesForStep(step)).map(([name, value]) => [name, valueSignature(value)])),
    })),
    output: state.trace.at(-1)?.output || "",
    error: state.error ? { ...state.error } : null,
  };
}

/** Captures the current trace in one of two fixed comparison slots. */
function captureComparison(slot) {
  const summary = currentRunSummary();
  if (!summary) {
    showToast("Run a trace before capturing it for comparison.", true);
    return;
  }
  state.comparisonRuns[slot] = summary;
  renderComparison();
  showToast(`Run ${slot.toUpperCase()} captured.`);
}

/** Finds and explains the earliest behavioral difference between the two captured runs. */
function renderComparison() {
  const { a, b } = state.comparisonRuns;
  els.comparisonResult.replaceChildren();
  if (!a || !b) {
    els.comparisonResult.textContent = `${a ? "Run A captured" : "Run A waiting"} · ${b ? "Run B captured" : "Run B waiting"}`;
    return;
  }
  const limit = Math.max(a.steps.length, b.steps.length);
  let firstDifference = -1;
  for (let index = 0; index < limit; index += 1) {
    const first = a.steps[index];
    const second = b.steps[index];
    if (!first || !second || first.line !== second.line || first.output !== second.output
      || JSON.stringify(first.variables) !== JSON.stringify(second.variables)) {
      firstDifference = index;
      break;
    }
  }
  const grid = document.createElement("div");
  grid.className = "run-comparison-grid";
  [["RUN A", a], ["RUN B", b]].forEach(([label, run]) => {
    const card = document.createElement("div");
    const heading = document.createElement("strong");
    heading.textContent = label;
    const inputs = document.createElement("code");
    inputs.textContent = run.inputs || "No prepared input";
    const output = document.createElement("pre");
    output.textContent = run.output || "No output";
    const steps = document.createElement("span");
    steps.textContent = `${run.steps.length} trace steps${run.error ? ` · ${run.error.type}` : ""}`;
    card.append(heading, inputs, output, steps);
    grid.append(card);
  });
  const conclusion = document.createElement("p");
  conclusion.className = "comparison-conclusion";
  conclusion.textContent = firstDifference < 0
    ? "Both runs followed the same recorded path and produced the same output."
    : `The first observed difference occurs around trace step ${firstDifference + 1}.`;
  els.comparisonResult.append(grid, conclusion);
}

/** Clears both bounded comparison slots without affecting the current trace. */
function clearComparisons() {
  state.comparisonRuns = { a: null, b: null };
  renderComparison();
  showToast("Run comparison cleared.");
}

/** Adds or removes a source-line breakpoint when the learner clicks the CodeMirror number gutter. */
function toggleBreakpoint(line) {
  if (!Number.isInteger(line) || line < 1) return;
  if (state.breakpoints.has(line)) state.breakpoints.delete(line);
  else state.breakpoints.add(line);
  renderBreakpointGutter();
  showToast(state.breakpoints.has(line) ? `Breakpoint added at line ${line}.` : `Breakpoint removed from line ${line}.`);
}

/** Applies breakpoint styling to CodeMirror's rendered gutter without rebuilding the editor. */
function renderBreakpointGutter() {
  window.requestAnimationFrame(() => {
    els.editorShell?.querySelectorAll(".cm-lineNumbers .cm-gutterElement").forEach((element) => {
      const line = Number(element.textContent);
      element.classList.toggle("cm-breakpoint-gutter", state.breakpoints.has(line));
      if (line) element.title = state.breakpoints.has(line) ? "Remove breakpoint" : "Add breakpoint";
    });
  });
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
    // A replay breakpoint pauses on arrival, preserving the fully captured and deterministic trace.
    if (state.breakpoints.has(state.trace[state.currentStep].line)) {
      pausePlayback();
      showToast(`Paused at breakpoint on line ${state.trace[state.currentStep].line}.`);
      return;
    }
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
 * Switches among every secondary learning view while preserving one visible panel at a time.
 * ARIA selection and hidden states are updated from one mapping to prevent tab inconsistencies.
 * @param {string} panel Panel that should become visible.
 */
function switchPanel(panel) {
  state.activePanel = panel;
  const views = [
    ["story", els.storyTab, els.storyView],
    ["beforeAfter", els.beforeAfterTab, els.beforeAfterView],
    ["conditions", els.conditionsTab, els.conditionsView],
    ["functions", els.functionsTab, els.functionsView],
    ["error", els.errorTab, els.errorView],
    ["variables", els.variablesTab, els.variablesView],
    ["watches", els.watchesTab, els.watchesView],
    ["structures", els.structuresTab, els.structuresView],
    ["references", els.referencesTab, els.referencesView],
    ["mutation", els.mutationTab, els.mutationView],
    ["flow", els.flowTab, els.flowView],
    ["coverage", els.coverageTab, els.coverageView],
    ["loopTable", els.loopTableTab, els.loopTableView],
    ["loop", els.loopTab, els.loopView],
    ["input", els.inputTab, els.inputView],
    ["compare", els.compareTab, els.compareView],
    ["bookmarks", els.bookmarksTab, els.bookmarksView],
  ];
  views.forEach(([name, tab, view]) => {
    const active = panel === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    view.classList.toggle("hidden", !active);
  });
  if (panel === "variables") renderVariableExplorer();
  if (panel === "beforeAfter" && state.trace.length) renderBeforeAfter(state.currentStep);
  if (panel === "conditions") renderConditionInvestigator();
  if (panel === "functions") renderFunctionJourney();
  if (panel === "error" && state.trace.length) renderErrorCoach(state.trace[state.currentStep], state.currentStep);
  if (panel === "watches") renderWatches();
  if (panel === "structures") renderStructures();
  if (panel === "mutation") renderMutationExplorer();
  if (panel === "references") renderReferenceMap();
  if (panel === "flow") renderFlowMap();
  if (panel === "coverage") renderCoverage();
  if (panel === "loopTable" && state.trace.length) renderLoopLab(state.currentStep);
  if (panel === "bookmarks") renderBookmarks();
  if (panel === "compare") renderComparison();
}

/**
 * Changes the primary learning area, filters its secondary tabs, and opens the area's remembered default.
 * @param {"trace"|"data"|"flow"|"labs"} mode Learning area to reveal.
 */
function switchLearningMode(mode) {
  state.activeMode = mode;
  document.querySelectorAll(".learning-mode").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });
  document.querySelectorAll(".panel-tab[data-mode]").forEach((tab) => {
    tab.classList.toggle("mode-hidden", tab.dataset.mode !== mode);
  });
  const defaults = { trace: "story", data: "variables", flow: "flow", labs: "input" };
  switchPanel(defaults[mode]);
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
  // Syntax failures have no trace snapshots, so the Story panel becomes a dedicated error lesson.
  els.emptyStory.classList.add("hidden");
  els.traceContent.classList.remove("hidden");
  els.traceKicker.textContent = `${error.line ? `LINE ${String(error.line).padStart(2, "0")} // ` : ""}ERROR`;
  els.executedCode.textContent = error.source || "Python could not compile this program.";
  els.explanation.textContent = "Python stopped before execution because the program could not be parsed.";
  els.beforeAfterGrid.replaceChildren();
  els.changeSummary.textContent = "Execution did not start";
  els.stepOutputSection.classList.add("hidden");
  els.changeList.innerHTML = '<div class="no-changes">Fix the syntax error, then run the trace again.</div>';
  els.variablesGrid.innerHTML = '<div class="no-changes">No variables were created.</div>';
  els.callStackSection.classList.add("hidden");
  const [meaning, tip] = ERROR_GUIDANCE[error.type] || ERROR_GUIDANCE.SyntaxError;
  els.emptyErrorCoach.classList.add("hidden");
  els.errorContent.classList.remove("hidden");
  els.errorCoachTitle.textContent = `${error.type}: ${error.message}`;
  els.errorCoachMeaning.textContent = meaning;
  els.errorCoachTip.textContent = `Try this: ${tip}`;
  if (error.line) focusLine(error.line);
  // Compilation failures have no playable Story step, so open the dedicated coach automatically.
  switchLearningMode("trace");
  switchPanel("error");
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
 * Creates category filters and example cards from the shared EXAMPLES data.
 * Landing cards are native links to the workspace, while workspace cards are
 * buttons that update the open editor. Text nodes keep all metadata safe.
 */
function renderExamples() {
  // The workspace marker determines whether a card should navigate or update in place.
  const isWorkspace = Boolean(els.workspace);
  // Reject an obsolete category value instead of rendering an unexplained empty dialog.
  if (!EXAMPLE_CATEGORIES.includes(state.activeExampleCategory)) state.activeExampleCategory = "All";
  // Recreate the compact filter row so pressed states always match the visible cards.
  els.exampleFilters.replaceChildren(
    ...EXAMPLE_CATEGORIES.map((category) => {
      const filter = document.createElement("button");
      filter.type = "button";
      filter.className = `example-filter ${category === state.activeExampleCategory ? "active" : ""}`;
      filter.textContent = category;
      filter.setAttribute("aria-pressed", String(category === state.activeExampleCategory));
      filter.addEventListener("click", () => {
        state.activeExampleCategory = category;
        renderExamples();
      });
      return filter;
    }),
  );
  // All remains the complete library, while other filters expose one teaching family.
  const visibleExamples = state.activeExampleCategory === "All"
    ? EXAMPLES
    : EXAMPLES.filter((example) => example.category === state.activeExampleCategory);
  els.exampleCount.textContent = `Showing ${visibleExamples.length} of ${EXAMPLES.length} programs`;
  els.exampleGrid.replaceChildren(
    ...visibleExamples.map((example) => {
      // Native links make landing-page navigation reliable for file URLs and hosted URLs.
      const card = document.createElement(isWorkspace ? "button" : "a");
      if (isWorkspace) {
        card.type = "button";
      } else {
        card.href = "workspace.html";
      }
      card.className = "example-card";
      card.innerHTML = `
        <span class="example-card-meta">
          <span class="example-topic"></span>
          <span class="example-level"></span>
        </span>
        <h3></h3>
        <p></p>
        <span class="example-views">
          <span>BEST VIEWS</span>
          <strong></strong>
        </span>`;
      card.querySelector(".example-topic").textContent = example.topic;
      const level = card.querySelector(".example-level");
      level.textContent = example.level;
      level.classList.add(example.level.toLowerCase());
      card.querySelector("h3").textContent = example.title;
      card.querySelector("p").textContent = example.description;
      card.querySelector(".example-views strong").textContent = example.views.join(" · ");
      card.addEventListener("click", () => {
        // Save before navigation so the chosen example is waiting in the new editor.
        setCode(example.code);
        // Input examples include safe starter responses so they can run immediately.
        if (typeof example.inputs === "string") prepareExampleInputs(example.inputs);
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
  els.beforeAfterTab?.addEventListener("click", () => switchPanel("beforeAfter"));
  els.conditionsTab?.addEventListener("click", () => switchPanel("conditions"));
  els.functionsTab?.addEventListener("click", () => switchPanel("functions"));
  els.errorTab?.addEventListener("click", () => switchPanel("error"));
  els.variablesTab?.addEventListener("click", () => switchPanel("variables"));
  els.watchesTab?.addEventListener("click", () => switchPanel("watches"));
  els.structuresTab?.addEventListener("click", () => switchPanel("structures"));
  els.referencesTab?.addEventListener("click", () => switchPanel("references"));
  els.mutationTab?.addEventListener("click", () => switchPanel("mutation"));
  els.flowTab?.addEventListener("click", () => switchPanel("flow"));
  els.coverageTab?.addEventListener("click", () => switchPanel("coverage"));
  els.loopTableTab?.addEventListener("click", () => switchPanel("loopTable"));
  els.loopTab?.addEventListener("click", () => switchPanel("loop"));
  els.inputTab?.addEventListener("click", () => switchPanel("input"));
  els.compareTab?.addEventListener("click", () => switchPanel("compare"));
  els.bookmarksTab?.addEventListener("click", () => switchPanel("bookmarks"));
  // Primary navigation filters secondary views instead of exposing an unmanageable tab collection.
  document.querySelectorAll(".learning-mode").forEach((button) => {
    button.addEventListener("click", () => switchLearningMode(button.dataset.mode));
  });
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
  els.bookmarkButton?.addEventListener("click", toggleBookmark);
  els.stepSlider?.addEventListener("input", (event) => goToStep(event.target.value));
  els.speedSelect?.addEventListener("change", () => {
    if (state.playing) scheduleNextStep();
  });
  els.clearOutputButton?.addEventListener("click", () => setConsole("// Output cleared", "muted"));
  // Scenario controls are local-only and never send data anywhere except the isolated worker.
  els.programInputs?.addEventListener("input", () => {
    saveLearningPreferences();
    renderInputStatus();
  });
  els.captureRunAButton?.addEventListener("click", () => captureComparison("a"));
  els.captureRunBButton?.addEventListener("click", () => captureComparison("b"));
  els.clearComparisonsButton?.addEventListener("click", clearComparisons);
  // A click on a rendered line number toggles a replay breakpoint for that source line.
  els.editorShell?.addEventListener("click", (event) => {
    const gutter = event.target.closest(".cm-lineNumbers .cm-gutterElement");
    if (gutter) toggleBreakpoint(Number(gutter.textContent));
  });
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
    // Restore prepared stdin before the first status render so reloads preserve learning scenarios.
    const learningPreferences = loadLearningPreferences();
    els.programInputs.value = learningPreferences.inputs;
    renderInputStatus();
    renderComparison();
    renderWatches();
    // Begin downloading Python while CodeMirror initializes to reduce perceived waiting time.
    ensureWorker();
    // Awaiting initialization guarantees either CodeMirror or its fallback is mounted.
    await initializeEditor();
  }
}

// Start the application after the module script is parsed at the end of document body.
initialize();
