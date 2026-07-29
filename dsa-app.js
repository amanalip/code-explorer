/**
 * Code Explorer Data Structures and Algorithms workspace controller.
 *
 * Chunk 7 completes Tier A with 535 reviewed programs, the shared
 * bounded Python worker, trace playback, eighteen evidence-aware learning
 * views, prepared input, and non-destructive study comments. All persistence is
 * same-origin browser storage. No learner source or derived trace leaves the
 * browser through application code.
 */

import { createPythonEditor, EDITOR_FONT_SIZES } from "./shared-editor.js?v=20260728-35";
import { applyTheme, preferredTheme, readLocalText, toggleTheme, writeLocalText } from "./shared-ui.js?v=20260728-35";
import { catalogSearchText, matchesCatalogSearch } from "./catalog-search.js?v=20260728-35";
import {
  DSA_AREAS,
  DSA_EVIDENCE_LABELS,
  DSA_VIEWS,
} from "./dsa-contracts.js?v=20260728-35";
import {
  DSA_CHUNK_ONE_PROGRAMS,
  DSA_CHUNK_ONE_SECTIONS,
} from "./dsa-curriculum.js?v=20260728-35";
import {
  DSA_CHUNK_TWO_PROGRAMS,
  DSA_CHUNK_TWO_SECTIONS,
} from "./dsa-curriculum-chunk2.js?v=20260728-35";
import {
  DSA_CHUNK_THREE_PROGRAMS,
  DSA_CHUNK_THREE_SECTIONS,
} from "./dsa-curriculum-chunk3.js?v=20260728-35";
import {
  DSA_CHUNK_FOUR_PROGRAMS,
  DSA_CHUNK_FOUR_SECTIONS,
} from "./dsa-curriculum-chunk4.js?v=20260728-35";
import {
  DSA_CHUNK_FIVE_PROGRAMS,
  DSA_CHUNK_FIVE_SECTIONS,
} from "./dsa-curriculum-chunk5.js?v=20260728-35";
import {
  DSA_CHUNK_SIX_PROGRAMS,
  DSA_CHUNK_SIX_SECTIONS,
} from "./dsa-curriculum-chunk6.js?v=20260728-35";
import {
  DSA_CHUNK_SEVEN_PROGRAMS,
  DSA_CHUNK_SEVEN_SECTIONS,
} from "./dsa-curriculum-chunk7.js?v=20260728-35";
import {
  DSA_COMMENT_PREFIX,
  buildDsaCommentedSource,
  classifyDsaEvent,
  nearestCondition,
  observedConditionOutcome,
  serializedLabel,
  structureCandidate,
  variableChanges,
  variableComparisons,
  variablesForStep,
} from "./dsa-runtime.js?v=20260728-35";

/** Implemented sections remain in teaching order across committed chunks. */
const DSA_IMPLEMENTED_SECTIONS = Object.freeze([
  ...DSA_CHUNK_ONE_SECTIONS,
  ...DSA_CHUNK_TWO_SECTIONS,
  ...DSA_CHUNK_THREE_SECTIONS,
  ...DSA_CHUNK_FOUR_SECTIONS,
  ...DSA_CHUNK_FIVE_SECTIONS,
  ...DSA_CHUNK_SIX_SECTIONS,
  ...DSA_CHUNK_SEVEN_SECTIONS,
]);

/** One immutable catalog supports matching, filtering, comparison, and counts. */
const DSA_IMPLEMENTED_PROGRAMS = Object.freeze([
  ...DSA_CHUNK_ONE_PROGRAMS,
  ...DSA_CHUNK_TWO_PROGRAMS,
  ...DSA_CHUNK_THREE_PROGRAMS,
  ...DSA_CHUNK_FOUR_PROGRAMS,
  ...DSA_CHUNK_FIVE_PROGRAMS,
  ...DSA_CHUNK_SIX_PROGRAMS,
  ...DSA_CHUNK_SEVEN_PROGRAMS,
]);

/**
 * Prepared text indexes every reviewed field once instead of flattening 535
 * complete records after every keystroke. The index and query stay in memory.
 */
const DSA_PROGRAM_SEARCH_INDEX = new Map(
  DSA_IMPLEMENTED_PROGRAMS.map((program) => [program, catalogSearchText(program)]),
);

/** The first reviewed program is the safe source for a learner's first visit. */
const DEFAULT_DSA_CODE = DSA_IMPLEMENTED_PROGRAMS[0].code;

/** Same-origin keys remain separate from the original Python workspace. */
const STORAGE_KEYS = Object.freeze({
  source: "code-explorer-dsa-source",
  editorPreferences: "code-explorer-dsa-editor-preferences",
  activeView: "code-explorer-dsa-active-view",
  preparedInputs: "code-explorer-dsa-prepared-inputs",
  selectedProgram: "code-explorer-dsa-selected-program",
});

/** Bounded limits protect browser responsiveness and readable displays. */
const LIMITS = Object.freeze({
  executionTimeoutMs: 30_000,
  structureCells: 30,
  watches: 12,
  referenceGraphElements: 90,
  operationJourneyRows: 30,
  algorithmPathSteps: 80,
  stepTableRows: 120,
  preparedInputCharacters: 20_000,
  preparedInputPreviewRows: 30,
  comparisonRuns: 2,
  comparisonOutputCharacters: 800,
  playbackMinimumMs: 100,
});

/** Safe defaults mirror the proven Python editor presentation. */
const DEFAULT_EDITOR_PREFERENCES = Object.freeze({ wrap: true, fontSize: 14 });

/** Cached elements make event wiring and renderer ownership auditable. */
const els = Object.fromEntries(
  [
    "runtimeStatus", "runtimeLabel", "themeButton", "themeLabel", "dsaExamplesButton",
    "dsaLearningCommentsButton", "dsaRunButton", "dsaEditorPanel", "dsaEditor", "dsaEditorShell",
    "dsaSelectedProgramQuestion", "dsaSelectedProgramQuestionTitle",
    "dsaSelectedProgramQuestionDescription",
    "dsaWrapButton", "dsaAutomaticCommentsButton", "dsaAutomaticPreview",
    "dsaAutomaticPreviewDocument", "dsaAutomaticLineCount",
    "dsaFontSizeSelect", "dsaCopyButton", "dsaPasteButton", "dsaCodeStats",
    "dsaAreaNav", "dsaViewTabs", "dsaViewStage", "dsaStepCount",
    "dsaPreviousButton", "dsaPlayButton", "dsaNextButton", "dsaRestartButton",
    "dsaTimeline", "dsaProgressLabel", "dsaSpeedSelect", "dsaClearOutputButton",
    "dsaConsoleOutput", "dsaExamplesDialog",
    "dsaCloseExamplesButton", "dsaExampleBrowserBody", "dsaExampleSearchInput",
    "dsaExampleFilters", "dsaExampleCount", "dsaExampleGrid", "dsaExamplePreview",
    "dsaCommentsDialog", "dsaCloseCommentsButton",
    "dsaCommentDetail", "dsaCommentsSummary", "dsaCommentPreview",
    "dsaCommentLineCount", "dsaCopyCommentsButton",
    "dsaReplaceCommentsButton", "toast",
  ].map((id) => [id, document.getElementById(id)]),
);

/**
 * Workspace state separates persistent presentation and source from session-only
 * trace evidence. Comparisons never survive a reload or identify a learner.
 */
const state = {
  code: readLocalText(STORAGE_KEYS.source) ?? DEFAULT_DSA_CODE,
  editor: null,
  editorPreferences: loadEditorPreferences(),
  activeView: loadActiveView(),
  activeFilter: "All programs",
  searchQuery: "",
  // Preview selection is temporary catalog navigation, not learner progress.
  previewProgramId: "",
  activeProgram: null,
  preparedInputs: loadPreparedInputs(),
  worker: null,
  workerReadyPromise: null,
  workerReadyResolve: null,
  workerReadyReject: null,
  runId: 0,
  runTimer: null,
  running: false,
  trace: [],
  loops: [],
  conditions: [],
  error: null,
  output: "",
  inputLog: [],
  learningComments: [],
  currentStep: 0,
  playbackTimer: null,
  automaticCommentsVisible: false,
  comparisonRuns: [],
  // The exact queue sent to the current worker run supports honest run comparison.
  activeRunInputs: "",
  toastTimer: null,
  suppressEditorInvalidation: false,
  // The optional Data reference graph exists only while its view is mounted.
  referenceGraphLibrary: null,
  referenceGraph: null,
  referenceGraphRenderId: 0,
  // Algorithm Path uses a separate Cytoscape instance and the same audited library.
  algorithmPathGraph: null,
  algorithmPathGraphRenderId: 0,
  // A reviewed origin identifies the learner's selected question, not progress.
  selectedProgramId: readLocalText(STORAGE_KEYS.selectedProgram) || "",
};

/**
 * Restores validated editor preferences so malformed storage cannot break setup.
 *
 * @returns {{wrap: boolean, fontSize: number}} Safe presentation choices.
 */
function loadEditorPreferences() {
  try {
    const stored = JSON.parse(readLocalText(STORAGE_KEYS.editorPreferences) || "null");
    return {
      wrap: typeof stored?.wrap === "boolean" ? stored.wrap : DEFAULT_EDITOR_PREFERENCES.wrap,
      fontSize: EDITOR_FONT_SIZES.includes(Number(stored?.fontSize))
        ? Number(stored.fontSize)
        : DEFAULT_EDITOR_PREFERENCES.fontSize,
    };
  } catch (error) {
    console.warn("Code Explorer could not parse DSA editor preferences.", error);
    return { ...DEFAULT_EDITOR_PREFERENCES };
  }
}

/** Saves only wrapping and font size to same-origin storage. */
function saveEditorPreferences() {
  writeLocalText(STORAGE_KEYS.editorPreferences, JSON.stringify(state.editorPreferences));
}

/**
 * Restores one approved view id or falls back to Algorithm Story.
 *
 * @returns {string} Valid view id.
 */
function loadActiveView() {
  const stored = readLocalText(STORAGE_KEYS.activeView);
  return DSA_VIEWS.some((view) => view.id === stored) ? stored : DSA_VIEWS[0].id;
}

/**
 * Restores prepared input as bounded plain text.
 *
 * @returns {string} Locally saved input lines.
 */
function loadPreparedInputs() {
  return (readLocalText(STORAGE_KEYS.preparedInputs) || "").slice(0, LIMITS.preparedInputCharacters);
}

/**
 * Creates one element without interpreting learner text as HTML.
 *
 * @param {string} tag HTML tag name.
 * @param {string} className Optional CSS classes.
 * @param {string} text Optional plain text.
 * @returns {HTMLElement} New detached element.
 */
function makeElement(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

/** Shows a temporary accessible status without stealing keyboard focus. */
function showToast(message, isError = false) {
  window.clearTimeout(state.toastTimer);
  els.toast.textContent = message;
  els.toast.classList.toggle("error", isError);
  els.toast.classList.add("visible");
  state.toastTimer = window.setTimeout(() => els.toast.classList.remove("visible"), 4500);
}

/**
 * Updates visible runtime text and non-color readiness state together.
 *
 * @param {string} text Learner-facing state.
 * @param {"idle"|"ready"|"running"|"error"} mode Styling state.
 */
function setRuntimeStatus(text, mode = "idle") {
  els.runtimeLabel.textContent = text;
  els.runtimeStatus.classList.toggle("ready", mode === "ready");
  els.runtimeStatus.classList.toggle("running", mode === "running");
  els.runtimeStatus.classList.toggle("error", mode === "error");
}

/** Finds a reviewed record only when the complete source matches exactly. */
function matchingProgram(code = state.editor?.getCode() ?? state.code) {
  return DSA_IMPLEMENTED_PROGRAMS.find((program) => program.code === code) || null;
}

/** Returns the locally remembered reviewed question origin when it remains valid. */
function selectedQuestionProgram() {
  return DSA_IMPLEMENTED_PROGRAMS.find((program) => program.id === state.selectedProgramId) || null;
}

/**
 * Shows the reviewed title and objective above the editor.
 *
 * The origin survives ordinary edits so the learner does not lose the
 * exercise prompt while solving it. Paste and full-document transformations
 * clear the origin before this renderer runs.
 */
function renderSelectedProgramQuestion() {
  const program = selectedQuestionProgram();
  const visible = Boolean(program);
  els.dsaSelectedProgramQuestion.classList.toggle("hidden", !visible);
  els.dsaEditorPanel.classList.toggle("has-selected-question", visible);
  if (!program) {
    els.dsaSelectedProgramQuestionTitle.textContent = "";
    els.dsaSelectedProgramQuestionDescription.textContent = "";
    return;
  }
  els.dsaSelectedProgramQuestionTitle.textContent = program.title;
  els.dsaSelectedProgramQuestionDescription.textContent = program.objective;
}

/** Updates line and character counts from original editable source only. */
function updateCodeStats() {
  const code = state.editor?.getCode() ?? state.code;
  const lines = code ? code.split("\n").length : 0;
  els.dsaCodeStats.textContent = `${lines} line${lines === 1 ? "" : "s"} · ${code.length} chars`;
}

/** Applies wrapping and font size without changing source or trace evidence. */
function applyEditorPreferences() {
  els.dsaWrapButton.textContent = state.editorPreferences.wrap ? "Wrap on" : "Wrap off";
  els.dsaWrapButton.setAttribute("aria-pressed", String(state.editorPreferences.wrap));
  els.dsaWrapButton.title = state.editorPreferences.wrap
    ? "Turn editor text wrapping off"
    : "Turn editor text wrapping on";
  els.dsaFontSizeSelect.value = String(state.editorPreferences.fontSize);
  state.editor?.applyPreferences(state.editorPreferences);
}

/** Toggles editor wrapping and persists the presentation choice locally. */
function toggleEditorWrapping() {
  state.editorPreferences.wrap = !state.editorPreferences.wrap;
  saveEditorPreferences();
  applyEditorPreferences();
}

/** Applies only one font size exposed by the toolbar. */
function changeEditorFontSize(requestedSize) {
  const fontSize = Number(requestedSize);
  if (!EDITOR_FONT_SIZES.includes(fontSize)) return;
  state.editorPreferences.fontSize = fontSize;
  saveEditorPreferences();
  applyEditorPreferences();
}

/**
 * Copies text with a selection fallback when modern clipboard writing is absent.
 *
 * @param {string} text Complete text requested by the learner.
 * @returns {boolean} Whether the browser reported success.
 */
function copyTextFallback(text) {
  const previousFocus = document.activeElement;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("aria-hidden", "true");
  textarea.tabIndex = -1;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    console.warn("Code Explorer DSA clipboard fallback failed.", error);
  }
  textarea.remove();
  previousFocus?.focus?.({ preventScroll: true });
  return copied;
}

/** Writes requested text after an explicit learner action. */
async function copyText(text, successMessage) {
  try {
    if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(text);
    else if (!copyTextFallback(text)) throw new Error("Clipboard writing is unavailable.");
    showToast(successMessage);
  } catch (error) {
    if (copyTextFallback(text)) {
      showToast(successMessage);
      return;
    }
    console.warn("Code Explorer could not copy DSA text.", error);
    showToast("Copy was blocked. Select the text and use Ctrl+C instead.", true);
  }
}

/** Copies the complete original editor source even when study comments are visible. */
async function copyCompleteEditor() {
  const code = state.editor.getCode();
  if (!code) {
    showToast("The editor is empty. There is nothing to copy.");
    return;
  }
  await copyText(code, `Copied the complete program (${code.split("\n").length} lines).`);
}

/** Replaces the document after the learner deliberately presses Paste. */
async function pasteCompleteEditor() {
  try {
    if (!navigator.clipboard?.readText) throw new Error("Clipboard reading is unavailable.");
    const clipboardText = await navigator.clipboard.readText();
    if (!clipboardText) {
      showToast("The clipboard contains no text to paste.");
      return;
    }
    replaceEditorSource(clipboardText);
    state.editor.focus();
    showToast(`Pasted a complete program (${clipboardText.split("\n").length} lines).`);
  } catch (error) {
    console.warn("Code Explorer could not read DSA clipboard text.", error);
    window.alert(
      "Clipboard permission is blocked.\n\nAllow clipboard access for this site and try Paste again. You can also focus the editor and press Ctrl+V.",
    );
    showToast("Paste permission was blocked. Focus the editor and use Ctrl+V instead.", true);
  }
}

/**
 * Stops playback without changing the selected trace step.
 *
 * Cytoscape graphs intentionally remain still during automatic playback. A
 * deliberate pause or natural completion refreshes the active graph once,
 * while source invalidation and new runs suppress the unnecessary refresh.
 *
 * @param {boolean} [refreshGraphView] Whether a paused graph view should rebuild.
 */
function stopPlayback(refreshGraphView = true) {
  const wasPlaying = Boolean(state.playbackTimer);
  if (state.playbackTimer) window.clearInterval(state.playbackTimer);
  state.playbackTimer = null;
  els.dsaPlayButton.textContent = "▶";
  els.dsaPlayButton.setAttribute("aria-label", "Play DSA trace");
  const graphViews = ["references", "algorithm-path"];
  if (wasPlaying && refreshGraphView && graphViews.includes(state.activeView) && state.trace.length) {
    window.requestAnimationFrame(() => {
      if (!state.playbackTimer && graphViews.includes(state.activeView) && state.trace.length) renderActiveView();
    });
  }
}

/** Clears trace evidence whenever visible source no longer matches the recording. */
function invalidateTrace() {
  stopPlayback(false);
  state.trace = [];
  state.loops = [];
  state.conditions = [];
  state.error = null;
  state.output = "";
  state.inputLog = [];
  state.learningComments = [];
  state.currentStep = 0;
  state.automaticCommentsVisible = false;
  renderAutomaticComments();
  updatePlaybackControls();
  renderActiveView();
  resetViewStageScroll();
  renderConsole();
}

/** Handles an actual document change from CodeMirror or the fallback editor. */
function handleSourceChange(code) {
  state.code = code;
  writeLocalText(STORAGE_KEYS.source, code);
  state.activeProgram = matchingProgram(code);
  updateCodeStats();
  if (!state.suppressEditorInvalidation) invalidateTrace();
}

/**
 * Replaces source for an explicit catalog, paste, or study-copy action.
 *
 * @param {string} code Complete replacement source.
 * @param {object|null} program Reviewed catalog origin, or null for custom source.
 */
function replaceEditorSource(code, program = null) {
  state.suppressEditorInvalidation = true;
  state.editor.setCode(code);
  state.suppressEditorInvalidation = false;
  state.code = code;
  writeLocalText(STORAGE_KEYS.source, code);
  state.activeProgram = matchingProgram(code);
  state.selectedProgramId = program?.id || "";
  writeLocalText(STORAGE_KEYS.selectedProgram, state.selectedProgramId);
  renderSelectedProgramQuestion();
  invalidateTrace();
  updateCodeStats();
}

/** Returns the active approved view contract. */
function activeView() {
  return DSA_VIEWS.find((view) => view.id === state.activeView) || DSA_VIEWS[0];
}

/**
 * Returns a newly selected or newly populated view to its orientation header.
 *
 * Playback deliberately does not call this helper because a learner comparing
 * long state cards should not lose their reading position on every step.
 */
function resetViewStageScroll() {
  els.dsaViewStage.scrollTop = 0;
  els.dsaViewStage.scrollLeft = 0;
}

/** Selects one approved view and preserves only its id locally. */
function selectView(viewId) {
  if (!DSA_VIEWS.some((view) => view.id === viewId)) return;
  state.activeView = viewId;
  writeLocalText(STORAGE_KEYS.activeView, viewId);
  renderAreaNavigation();
  renderViewTabs();
  renderActiveView();
  resetViewStageScroll();
}

/** Renders the four stable areas and their pressed state. */
function renderAreaNavigation() {
  const currentArea = activeView().area;
  els.dsaAreaNav.replaceChildren(
    ...DSA_AREAS.map((area) => {
      const button = makeElement("button", `learning-mode ${area.id === currentArea ? "active" : ""}`, area.label);
      button.type = "button";
      button.title = area.question;
      button.setAttribute("aria-pressed", String(area.id === currentArea));
      button.addEventListener("click", () => {
        const firstView = DSA_VIEWS.find((view) => view.area === area.id);
        selectView(firstView.id);
      });
      return button;
    }),
  );
}

/** Renders only views belonging to the selected learning area. */
function renderViewTabs() {
  const current = activeView();
  const tabs = DSA_VIEWS.filter((view) => view.area === current.area).map((view) => {
    const button = makeElement("button", `panel-tab ${view.id === current.id ? "active" : ""}`, view.label);
    button.type = "button";
    button.id = `dsa-tab-${view.id}`;
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(view.id === current.id));
    button.addEventListener("click", () => selectView(view.id));
    return button;
  });
  els.dsaViewTabs.replaceChildren(...tabs);
  els.dsaViewStage.setAttribute("aria-labelledby", `dsa-tab-${current.id}`);
}

/** Creates an evidence badge whose text makes color-independent status clear. */
function evidenceBadge(labelKey) {
  const label = DSA_EVIDENCE_LABELS[labelKey];
  return makeElement("span", `evidence-badge ${labelKey}`, label);
}

/** Shows a stable empty state for a view without sufficient evidence. */
function renderUnavailable(title, text) {
  const article = makeElement("article", "dsa-view-preview");
  article.append(evidenceBadge("unavailable"));
  article.append(makeElement("h2", "", title));
  article.append(makeElement("p", "", text));
  els.dsaViewStage.replaceChildren(article);
}

/** Returns the selected step or null when no runtime snapshot exists. */
function selectedStep() {
  return state.trace[state.currentStep] || null;
}

/**
 * Returns the safest learner-facing program name for a Trace view.
 *
 * Exact reviewed context is intentionally required before a catalog title can
 * appear inside a runtime explanation. The separately persisted selected
 * question may survive edits for orientation, but it must not restore reviewed
 * evidence after the source changes.
 *
 * @returns {string} Exact reviewed title or an honest custom-source label.
 */
function traceProgramLabel() {
  return state.activeProgram?.title || "Edited or pasted program";
}

/**
 * Builds the shared orientation header used by all five redesigned Trace views.
 *
 * This helper owns only presentation. Callers still decide which evidence may
 * be shown. The returned body remains empty so each view can use a visual
 * grammar appropriate to its own teaching question.
 *
 * @param {object} options Trace-view presentation options.
 * @param {string} options.viewId Stable view identifier used by scoped CSS.
 * @param {string} options.title Learner-facing view title.
 * @param {string} options.question Short question the view helps answer.
 * @param {object|null} [options.step] Recorded step represented by the view.
 * @param {number} [options.stepIndex] Zero-based index for the represented step.
 * @param {string} [options.eventLabel] Optional normalized event or state.
 * @param {"observed"|"curriculum"|"unavailable"} [options.evidence] Evidence badge.
 * @returns {{article: HTMLElement, body: HTMLElement}} View shell and content mount.
 */
function createTraceViewShell({
  viewId,
  title,
  question,
  step = selectedStep(),
  stepIndex = state.currentStep,
  eventLabel = "",
  evidence = "observed",
}) {
  const article = makeElement("article", `dsa-runtime-view dsa-trace-view dsa-trace-${viewId}`);
  const hero = makeElement("header", "dsa-trace-hero");
  const identity = makeElement("div", "dsa-trace-identity");
  const eyebrow = makeElement("div", "dsa-trace-eyebrow");
  eyebrow.append(evidenceBadge(evidence));
  eyebrow.append(makeElement("span", "", `TRACE / ${title.toUpperCase()}`));
  identity.append(eyebrow);
  identity.append(makeElement("h2", "", title));
  identity.append(makeElement("p", "", question));
  hero.append(identity);

  if (step) {
    const context = makeElement("section", "dsa-trace-context");
    const contextFacts = [
      ["Program", traceProgramLabel()],
      ["Recorded step", `${stepIndex + 1} of ${state.trace.length}`],
      ["Source line", String(step.line)],
    ];
    if (eventLabel) contextFacts.push(["Event", eventLabel]);
    contextFacts.forEach(([label, value]) => {
      const fact = makeElement("div", "dsa-trace-context-fact");
      fact.append(makeElement("span", "", label));
      fact.append(makeElement("strong", "", value));
      context.append(fact);
    });
    hero.append(context);
    hero.append(makeElement("code", "dsa-trace-source", step.source.trim()));
  }

  const body = makeElement("div", "dsa-trace-body");
  article.append(hero, body);
  return { article, body };
}

/**
 * Renders a designed pre-run or unavailable state for one Trace view.
 *
 * @param {object} options Empty-state content.
 * @param {string} options.viewId Stable view identifier.
 * @param {string} options.glyph Compact technical symbol hidden from assistive technology.
 * @param {string} options.title View title.
 * @param {string} options.question Question the view will answer after a run.
 * @param {string} options.reason Honest reason evidence is unavailable.
 * @param {Array<string>} options.steps Safe learner actions.
 */
function renderTraceUnavailable({ viewId, glyph, title, question, reason, steps }) {
  const { article, body } = createTraceViewShell({
    viewId,
    title,
    question,
    step: null,
    evidence: "unavailable",
  });
  const empty = makeElement("section", "dsa-trace-empty-state");
  const mark = makeElement("span", "dsa-trace-empty-glyph", glyph);
  mark.setAttribute("aria-hidden", "true");
  empty.append(mark);
  empty.append(makeElement("h3", "", reason));
  const list = makeElement("ol", "dsa-trace-next-steps");
  steps.forEach((step) => list.append(makeElement("li", "", step)));
  empty.append(list);
  body.append(empty);
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Classifies a trace step using only the adjacent recorded snapshot.
 *
 * @param {number} index Zero-based trace index.
 * @returns {{changes: Array<object>, event: {type: string, explanation: string}}} Evidence pair.
 */
function storyEvidenceAt(index) {
  const current = state.trace[index];
  const previous = state.trace[index - 1] || null;
  const changes = variableChanges(previous, current);
  return { changes, event: classifyDsaEvent(current, changes) };
}

/** Renders Algorithm Story as a navigable recorded timeline plus reviewed map. */
function renderAlgorithmStory() {
  const step = selectedStep();
  if (!step) {
    renderTraceUnavailable({
      viewId: "story",
      glyph: "01",
      title: "Algorithm Story",
      question: "What did Python do, and where are we in the recorded journey?",
      reason: "Run a trace to turn executed lines into a visual story.",
      steps: [
        "Choose a reviewed example or keep your own source.",
        "Run the program locally in the browser.",
        "Use playback to move through the recorded story.",
      ],
    });
    return;
  }

  const { changes, event } = storyEvidenceAt(state.currentStep);
  const { article, body } = createTraceViewShell({
    viewId: "story",
    title: "Algorithm Story",
    question: "What did Python do, and where are we in the recorded journey?",
    eventLabel: event.type,
  });

  /*
    Five entries provide immediate chronological context without rendering the
    complete trace. Later entries are already recorded evidence, but their
    labels avoid implying that Python has not executed them yet.
  */
  const storyStart = Math.max(0, state.currentStep - 2);
  const storyEnd = Math.min(state.trace.length, state.currentStep + 3);
  const timeline = makeElement("ol", "dsa-story-timeline");
  for (let index = storyStart; index < storyEnd; index += 1) {
    const timelineStep = state.trace[index];
    const timelineEvidence = storyEvidenceAt(index);
    const item = makeElement("li", `dsa-story-entry ${index === state.currentStep ? "current" : ""}`);
    const jump = makeElement("button", "", "");
    jump.type = "button";
    if (index === state.currentStep) jump.setAttribute("aria-current", "step");
    jump.setAttribute("aria-label", `Go to recorded step ${index + 1}, line ${timelineStep.line}`);
    const marker = makeElement("span", "dsa-story-marker", String(index + 1).padStart(2, "0"));
    const copy = makeElement("span", "dsa-story-entry-copy");
    copy.append(makeElement("strong", "", timelineEvidence.event.type.replaceAll("_", " ")));
    copy.append(makeElement("code", "", timelineStep.source.trim()));
    const position = index < state.currentStep
      ? "Earlier recorded step"
      : index > state.currentStep
        ? "Later recorded step"
        : "Selected step";
    copy.append(makeElement("span", "", `Line ${timelineStep.line} · ${position}`));
    jump.append(marker, copy);
    jump.addEventListener("click", () => selectStep(index));
    item.append(jump);
    timeline.append(item);
  }

  const observed = makeElement("section", "dsa-story-observation");
  const observationHeading = makeElement("div", "dsa-trace-section-heading");
  observationHeading.append(makeElement("span", "", "CURRENT OBSERVATION"));
  observationHeading.append(makeElement("strong", "", event.type.replaceAll("_", " ")));
  observed.append(observationHeading);
  observed.append(makeElement("p", "", event.explanation));
  if (changes.length) {
    const changeList = makeElement("div", "dsa-story-change-list");
    changes.forEach((change) => {
      const changeItem = makeElement("div", `dsa-story-change ${change.kind}`);
      changeItem.append(makeElement("span", "", change.kind));
      changeItem.append(makeElement("strong", "", change.name));
      changeItem.append(makeElement(
        "code",
        "",
        `${serializedLabel(change.before)} → ${serializedLabel(change.after)}`,
      ));
      changeList.append(changeItem);
    });
    observed.append(changeList);
  } else {
    observed.append(makeElement("p", "dsa-trace-quiet-note", "No visible serialized value changed after this line."));
  }
  const observedGrid = makeElement("div", "dsa-story-grid");
  observedGrid.append(timeline, observed);
  body.append(observedGrid);

  if (state.activeProgram) {
    const context = makeElement("section", "dsa-story-curriculum");
    const curriculumHeading = makeElement("div", "dsa-trace-section-heading");
    curriculumHeading.append(evidenceBadge("curriculum"));
    curriculumHeading.append(makeElement("strong", "", state.activeProgram.algorithm));
    context.append(curriculumHeading);
    context.append(makeElement("p", "", state.activeProgram.objective));
    const phases = makeElement("ol", "dsa-story-phase-map");
    state.activeProgram.phases.forEach((phase, index) => {
      const phaseItem = makeElement("li", "");
      phaseItem.append(makeElement("span", "", String(index + 1).padStart(2, "0")));
      phaseItem.append(makeElement("p", "", phase));
      phases.append(phaseItem);
    });
    context.append(phases);
    context.append(makeElement("p", "dsa-trace-boundary", "This is the reviewed full-program map. Code Explorer does not guess which named phase owns the selected line."));
    body.append(context);
  } else {
    const boundary = makeElement("section", "dsa-trace-boundary-card");
    boundary.append(evidenceBadge("unavailable"));
    boundary.append(makeElement("strong", "", "Named algorithm unavailable"));
    boundary.append(makeElement("p", "", "The executed line and value changes are observed. A reviewed algorithm name and phase are unavailable because this source is not an unchanged catalog program."));
    body.append(boundary);
  }
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Renders the complete visible variable state around the selected trace step.
 *
 * The list is intentionally cumulative rather than limited to values changed by
 * one line. As playback advances, names enter or leave the vertical list when
 * they enter or leave the recorded scope. This mirrors the state-reading model
 * in the Python workspace and lets a learner keep positional context between
 * steps. The change classification still comes only from adjacent snapshots.
 */
function renderBeforeAfter() {
  const step = selectedStep();
  if (!step) {
    renderTraceUnavailable({
      viewId: "before-after",
      glyph: "↕",
      title: "Before and After",
      question: "Which visible values existed before this line, and what was recorded after it?",
      reason: "Run a trace to compare adjacent recorded states.",
      steps: [
        "Run a program that creates or changes a value.",
        "Move one step at a time with playback.",
        "Read each variable from Before down to After.",
      ],
    });
    return;
  }
  const previous = state.trace[state.currentStep - 1] || null;
  const comparisons = variableComparisons(previous, step);
  const { article, body } = createTraceViewShell({
    viewId: "before-after",
    title: "Before and After",
    question: "Which visible values existed before this line, and what was recorded after it?",
    eventLabel: "STATE COMPARISON",
  });

  const kinds = ["created", "changed", "removed", "unchanged"];
  const summary = makeElement("section", "dsa-state-summary");
  kinds.forEach((kind) => {
    const metric = makeElement("div", `dsa-state-metric ${kind}`);
    metric.append(makeElement("strong", "", String(comparisons.filter((item) => item.kind === kind).length)));
    metric.append(makeElement("span", "", kind));
    summary.append(metric);
  });
  body.append(summary);

  if (!comparisons.length) {
    const empty = makeElement("section", "dsa-trace-inline-empty");
    empty.append(makeElement("strong", "", "No visible variables at this step"));
    empty.append(makeElement("p", "", "The line executed, but no serialized learner variable is visible in the recorded scopes."));
    body.append(empty);
  } else {
    const grid = makeElement("div", "dsa-change-grid");
    comparisons.forEach((change) => {
      // The pure helper retains unchanged values so playback keeps positional context.
      const card = makeElement("section", `dsa-change-card ${change.kind}`);
      const header = makeElement("div", "dsa-change-card-header");
      header.append(makeElement("strong", "", change.name));
      header.append(makeElement("span", "dsa-change-kind", change.kind));

      const before = makeElement("div", "dsa-change-state before");
      before.append(makeElement("span", "", "Before"));
      before.append(makeElement("code", "", serializedLabel(change.before)));

      const direction = makeElement("span", "dsa-change-direction", "↓");
      direction.setAttribute("aria-hidden", "true");

      const after = makeElement("div", "dsa-change-state after");
      after.append(makeElement("span", "", "After"));
      after.append(makeElement("code", "", serializedLabel(change.after)));

      card.append(header, before, direction, after);
      const visibleType = change.after?.type || change.before?.type;
      if (visibleType) card.append(makeElement("span", "dsa-change-type", `Recorded type: ${visibleType}`));
      grid.append(card);
    });
    body.append(grid);
  }
  els.dsaViewStage.replaceChildren(article);
}

/** Renders the nearest observed branch route without reevaluating its expression. */
function renderDecisions() {
  if (!state.trace.length) {
    renderTraceUnavailable({
      viewId: "decisions",
      glyph: "?",
      title: "Decisions",
      question: "Which recorded route followed a condition or while check?",
      reason: "Run a condition or while loop to reveal an observed route.",
      steps: [
        "Run a program containing if, elif, or while.",
        "Move playback beyond the condition.",
        "Inspect the result and next recorded source line.",
      ],
    });
    return;
  }
  const found = nearestCondition(state.trace, state.currentStep, state.conditions, state.loops);
  if (!found) {
    renderTraceUnavailable({
      viewId: "decisions",
      glyph: "?",
      title: "Decisions",
      question: "Which recorded route followed a condition or while check?",
      reason: "No condition has been reached by the selected step.",
      steps: [
        "Continue playback until Python reaches a condition.",
        "Look for an if, elif, or while line in the editor.",
        "Return here when the selected trace prefix includes that line.",
      ],
    });
    return;
  }
  const outcome = observedConditionOutcome(found.step, state.conditions, state.loops);
  const decisionIndex = state.trace.lastIndexOf(found.step);
  const conditionSource = found.metadata.source || found.step.source.trim();
  const resultLabel = outcome === null ? "Result unavailable" : outcome ? "True" : "False";
  const nextLine = found.step.nextLine || null;
  const nextSource = nextLine ? state.code.split("\n")[nextLine - 1]?.trim() : "";
  const { article, body } = createTraceViewShell({
    viewId: "decisions",
    title: "Decisions",
    question: "Which recorded route followed a condition or while check?",
    step: found.step,
    stepIndex: decisionIndex,
    eventLabel: "CONDITION CHECK",
  });

  const route = makeElement("section", "dsa-decision-route");
  const conditionNode = makeElement("div", "dsa-decision-node condition");
  conditionNode.append(makeElement("span", "", "CONDITION"));
  conditionNode.append(makeElement("code", "", conditionSource));
  const connectorOne = makeElement("div", "dsa-decision-connector", "↓");
  connectorOne.setAttribute("aria-hidden", "true");
  const resultNode = makeElement(
    "div",
    `dsa-decision-node result ${outcome === true ? "true" : outcome === false ? "false" : "unknown"}`,
  );
  resultNode.append(makeElement("span", "", "OBSERVED RESULT"));
  resultNode.append(makeElement("strong", "", resultLabel));
  const connectorTwo = makeElement("div", "dsa-decision-connector", "↓");
  connectorTwo.setAttribute("aria-hidden", "true");
  const destination = makeElement("div", "dsa-decision-node destination");
  destination.append(makeElement("span", "", "NEXT RECORDED LINE"));
  destination.append(makeElement("strong", "", nextLine ? `Line ${nextLine}` : "Could not isolate safely"));
  if (nextSource) destination.append(makeElement("code", "", nextSource));
  route.append(conditionNode, connectorOne, resultNode, connectorTwo, destination);
  body.append(route);

  const visibleValues = Object.entries(variablesForStep(found.step))
    .filter(([, value]) => !["function", "module", "type"].includes(value?.type))
    .slice(0, 6);
  const evidence = makeElement("section", "dsa-decision-evidence");
  const evidenceHeading = makeElement("div", "dsa-trace-section-heading");
  evidenceHeading.append(makeElement("span", "", "VISIBLE VALUES AT THE CHECK"));
  evidenceHeading.append(makeElement("strong", "", `${visibleValues.length} shown`));
  evidence.append(evidenceHeading);
  if (visibleValues.length) {
    const values = makeElement("div", "dsa-decision-values");
    visibleValues.forEach(([name, value]) => {
      const item = makeElement("div", "");
      item.append(makeElement("span", "", name));
      item.append(makeElement("code", "", serializedLabel(value)));
      values.append(item);
    });
    evidence.append(values);
  } else {
    evidence.append(makeElement("p", "dsa-trace-quiet-note", "No serialized learner value was visible at this check."));
  }
  evidence.append(makeElement("p", "dsa-trace-boundary", "These values were visible in scope. Code Explorer does not claim that every value shown was an operand in the condition."));
  body.append(evidence);
  els.dsaViewStage.replaceChildren(article);
}

/** Renders the recorded user-code frame stack and return evidence. */
function renderCalls() {
  const step = selectedStep();
  if (!step) {
    renderTraceUnavailable({
      viewId: "calls",
      glyph: "ƒ",
      title: "Calls and Recursion",
      question: "Which function frames exist, and which frame is active now?",
      reason: "Run a program with a function to reveal its recorded call stack.",
      steps: [
        "Choose a function or recursion example.",
        "Run the trace and move into the function body.",
        "Watch frames appear and disappear as playback moves.",
      ],
    });
    return;
  }
  const frames = step.frames || [];
  const activeFrame = frames.at(-1) || null;
  const { article, body } = createTraceViewShell({
    viewId: "calls",
    title: "Calls and Recursion",
    question: "Which function frames exist, and which frame is active now?",
    eventLabel: step.event === "return" ? "RETURN" : "FRAME SNAPSHOT",
  });

  const metrics = makeElement("section", "dsa-call-metrics");
  const depthMetric = makeElement("div", "");
  depthMetric.append(makeElement("strong", "", String(Math.max(0, frames.length - 1))));
  depthMetric.append(makeElement("span", "", "function depth"));
  const activeMetric = makeElement("div", "");
  activeMetric.append(makeElement("strong", "", activeFrame?.name === "<module>" ? "global" : activeFrame?.name || "none"));
  activeMetric.append(makeElement("span", "", "active frame"));
  metrics.append(depthMetric, activeMetric);
  body.append(metrics);

  const stack = makeElement("ol", "dsa-call-stack");
  frames.forEach((frame, index) => {
    const active = index === frames.length - 1;
    const item = makeElement("li", `dsa-call-frame ${active ? "active" : "suspended"}`);
    if (active) item.setAttribute("aria-current", "true");
    const header = makeElement("div", "dsa-call-frame-header");
    const identity = makeElement("div", "");
    identity.append(makeElement("span", "", index === 0 ? "GLOBAL SCOPE" : `DEPTH ${index}`));
    identity.append(makeElement("strong", "", frame.name === "<module>" ? "global frame" : `${frame.name}()`));
    header.append(identity);
    header.append(makeElement("span", "dsa-call-frame-state", active ? "ACTIVE" : "WAITING"));
    item.append(header);
    item.append(makeElement("code", "dsa-call-frame-line", `line ${frame.line}`));

    const visibleLocals = Object.entries(frame.locals || {})
      .filter(([, value]) => !["function", "module", "type"].includes(value?.type))
      .slice(0, 6);
    const locals = makeElement("div", "dsa-call-locals");
    if (visibleLocals.length) {
      visibleLocals.forEach(([name, value]) => {
        const local = makeElement("div", "");
        local.append(makeElement("span", "", name));
        local.append(makeElement("code", "", serializedLabel(value)));
        locals.append(local);
      });
    } else {
      locals.append(makeElement("p", "dsa-trace-quiet-note", "No visible learner locals in this frame."));
    }
    item.append(locals);
    stack.append(item);
  });
  body.append(stack);

  if (step.event === "return") {
    const returned = makeElement("section", "dsa-return-banner");
    returned.append(makeElement("span", "", "RETURN RECORDED"));
    returned.append(makeElement("strong", "", serializedLabel(step.detail)));
    body.append(returned);
  }
  if (state.activeProgram) {
    const curriculum = makeElement("section", "dsa-call-curriculum");
    curriculum.append(evidenceBadge("curriculum"));
    curriculum.append(makeElement("strong", "", state.activeProgram.algorithm));
    curriculum.append(makeElement("p", "", state.activeProgram.objective));
    curriculum.append(makeElement("p", "dsa-trace-boundary", "The frame stack is observed. The algorithm name and objective come from the unchanged reviewed program."));
    body.append(curriculum);
  }
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Returns type-specific learning guidance without claiming a guaranteed repair.
 *
 * @param {string} errorType Python exception class name.
 * @returns {{meaning: string, experiment: string}} Conservative explanation.
 */
function errorCoachGuidance(errorType) {
  const guidance = {
    SyntaxError: {
      meaning: "Python could not parse the program into a valid statement structure.",
      experiment: "Inspect punctuation and indentation on the reported line and the line immediately before it.",
    },
    IndentationError: {
      meaning: "Python found indentation that does not match the surrounding block structure.",
      experiment: "Compare the leading spaces with nearby lines in the same function, loop, or condition.",
    },
    NameError: {
      meaning: "The program tried to use a name that was not available in the current scope.",
      experiment: "Check spelling, assignment order, and whether the name belongs to another function scope.",
    },
    TypeError: {
      meaning: "An operation received a kind of value it does not support in that position.",
      experiment: "Inspect the recorded types and values supplied to the failing operation.",
    },
    IndexError: {
      meaning: "A sequence position was requested outside the available index range.",
      experiment: "Compare the requested index with the sequence length immediately before the failure.",
    },
    KeyError: {
      meaning: "A mapping lookup requested a key that was not present.",
      experiment: "Inspect the recorded keys and the exact lookup value before the failure.",
    },
    ZeroDivisionError: {
      meaning: "The program attempted division or remainder with a zero divisor.",
      experiment: "Inspect how the divisor became zero and test the boundary before the operation.",
    },
    ValueError: {
      meaning: "A value had an acceptable general type but an unsupported content or shape.",
      experiment: "Inspect the exact input or conversion value and try a smaller valid example.",
    },
    AttributeError: {
      meaning: "The program requested an attribute or method that the recorded object type does not provide.",
      experiment: "Inspect the object type and verify the attribute spelling and ownership.",
    },
    RecursionError: {
      meaning: "Recursive calls continued without reaching a stopping condition soon enough.",
      experiment: "Inspect the base case and confirm that every recursive argument moves toward it.",
    },
  };
  return guidance[errorType] || {
    meaning: "Python stopped because an exception was raised during this local run.",
    experiment: "Inspect the reported line and the most recent recorded values used around it.",
  };
}

/** Renders syntax or runtime errors as a conservative IDE-style diagnostic journey. */
function renderErrorCoach() {
  const detail = selectedStep()?.event === "exception" ? selectedStep().detail : state.error;
  if (!detail) {
    renderTraceUnavailable({
      viewId: "error",
      glyph: "!",
      title: "Error Coach",
      question: "Where did Python stop, what does the error mean, and what should I inspect next?",
      reason: "No syntax or runtime error is recorded for the current run.",
      steps: [
        "Use this view after Python reports an error.",
        "Keep the source unchanged while inspecting its trace evidence.",
        "Try one small correction at a time, then run again.",
      ],
    });
    return;
  }
  const errorStep = selectedStep()?.event === "exception" ? selectedStep() : null;
  const errorLine = detail.line || errorStep?.line || null;
  const errorSource = errorLine ? state.code.split("\n")[errorLine - 1]?.trim() : "";
  const guidance = errorCoachGuidance(detail.type);
  const { article, body } = createTraceViewShell({
    viewId: "error",
    title: "Error Coach",
    question: "Where did Python stop, what does the error mean, and what should I inspect next?",
    step: errorStep,
    stepIndex: errorStep ? state.trace.lastIndexOf(errorStep) : state.currentStep,
    eventLabel: detail.type,
  });

  const diagnostic = makeElement("section", "dsa-error-diagnostic");
  const diagnosticHeader = makeElement("div", "dsa-error-title");
  diagnosticHeader.append(makeElement("span", "", detail.type || "Python error"));
  diagnosticHeader.append(makeElement("strong", "", detail.message || "Python stopped this run."));
  diagnostic.append(diagnosticHeader);
  const location = makeElement("div", "dsa-error-location");
  location.append(makeElement("span", "", "REPORTED LOCATION"));
  location.append(makeElement("strong", "", errorLine ? `Learner line ${errorLine}` : "No traceable learner line"));
  if (errorSource) location.append(makeElement("code", "", errorSource));
  diagnostic.append(location);
  body.append(diagnostic);

  const coaching = makeElement("section", "dsa-error-coaching-grid");
  const meaning = makeElement("div", "");
  meaning.append(makeElement("span", "", "WHAT IT MEANS"));
  meaning.append(makeElement("p", "", guidance.meaning));
  const experiment = makeElement("div", "");
  experiment.append(makeElement("span", "", "SAFE NEXT EXPERIMENT"));
  experiment.append(makeElement("p", "", guidance.experiment));
  coaching.append(meaning, experiment);
  body.append(coaching);

  const boundary = makeElement("section", "dsa-error-boundary");
  boundary.append(evidenceBadge("unavailable"));
  boundary.append(makeElement("strong", "", "A guaranteed repair is unavailable"));
  boundary.append(makeElement("p", "", "The error type, message, location, and recorded values are evidence. Several different source changes might repair the program, so Code Explorer does not choose one without proof."));
  body.append(boundary);
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Builds the shared orientation header for all six Data views.
 *
 * Data views answer what exists at one recorded moment. The header therefore
 * establishes the learner question, evidence source, program, step, and source
 * line before any value, structure, or relationship detail appears.
 *
 * @param {object} options Data-view presentation options.
 * @param {string} options.viewId Stable view identifier used by scoped CSS.
 * @param {string} options.title Learner-facing view title.
 * @param {string} options.question One plain-language question answered by the view.
 * @param {object|null} [options.step] Recorded snapshot represented by the view.
 * @param {Array<string>} [options.evidenceKeys] Evidence badges shown in order.
 * @param {Array<Array<string>>} [options.extraFacts] Additional label and value pairs.
 * @returns {{article: HTMLElement, body: HTMLElement}} View shell and empty content mount.
 */
function createDataViewShell({
  viewId,
  title,
  question,
  step = selectedStep(),
  evidenceKeys = ["observed"],
  extraFacts = [],
}) {
  const article = makeElement("article", `dsa-runtime-view dsa-data-view dsa-data-${viewId}`);
  const hero = makeElement("header", "dsa-data-hero");
  const identity = makeElement("div", "dsa-data-identity");
  const eyebrow = makeElement("div", "dsa-data-eyebrow");
  evidenceKeys.forEach((key) => eyebrow.append(evidenceBadge(key)));
  eyebrow.append(makeElement("span", "", `DATA / ${title.toUpperCase()}`));
  identity.append(eyebrow);
  identity.append(makeElement("h2", "", title));
  identity.append(makeElement("p", "", question));
  hero.append(identity);

  const context = makeElement("section", "dsa-data-context");
  const facts = [["Program", traceProgramLabel()]];
  if (step) {
    facts.push(
      ["Recorded step", `${state.currentStep + 1} of ${state.trace.length}`],
      ["Source line", String(step.line)],
    );
  }
  facts.push(...extraFacts);
  facts.forEach(([label, value]) => {
    const fact = makeElement("div", "dsa-data-context-fact");
    fact.append(makeElement("span", "", label));
    fact.append(makeElement("strong", "", value));
    context.append(fact);
  });
  hero.append(context);
  if (step) hero.append(makeElement("code", "dsa-data-source", step.source.trim()));

  const body = makeElement("div", "dsa-data-body");
  article.append(hero, body);
  return { article, body };
}

/**
 * Renders a purposeful Data-view state when recorded evidence is not available.
 *
 * @param {object} options Empty-state content.
 * @param {string} options.viewId Stable view identifier.
 * @param {string} options.glyph Compact visual marker hidden from assistive technology.
 * @param {string} options.title View title.
 * @param {string} options.question Question the view will answer.
 * @param {string} options.reason Honest reason evidence is unavailable.
 * @param {Array<string>} options.steps Three useful learner actions.
 */
function renderDataUnavailable({ viewId, glyph, title, question, reason, steps }) {
  const { article, body } = createDataViewShell({
    viewId,
    title,
    question,
    step: null,
    evidenceKeys: ["unavailable"],
  });
  const empty = makeElement("section", "dsa-data-empty-state");
  const mark = makeElement("span", "dsa-data-empty-glyph", glyph);
  mark.setAttribute("aria-hidden", "true");
  empty.append(mark);
  empty.append(makeElement("h3", "", reason));
  const list = makeElement("ol", "dsa-data-next-steps");
  steps.forEach((step) => list.append(makeElement("li", "", step)));
  empty.append(list);
  body.append(empty);
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Classifies one scope value against the adjacent snapshot.
 *
 * @param {object|undefined} before Earlier serialized value.
 * @param {object|undefined} after Current serialized value.
 * @returns {"created"|"changed"|"removed"|"unchanged"} Recorded change class.
 */
function dataValueChangeKind(before, after) {
  if (!before && after) return "created";
  if (before && !after) return "removed";
  return JSON.stringify(before) === JSON.stringify(after) ? "unchanged" : "changed";
}

/**
 * Returns global and active-local scope records without merging shadowed names.
 *
 * @param {object} step Current recorded snapshot.
 * @param {object|null} previousStep Adjacent earlier snapshot.
 * @returns {Array<object>} Scope groups with bounded serialized records.
 */
function dataScopeGroups(step, previousStep) {
  const activeFrame = step.frames?.at(-1);
  const scopes = [{
    id: "global",
    label: "Global scope",
    description: "Names available to the program module.",
    current: step.globals || {},
    previous: previousStep?.globals || {},
  }];

  // At module level, Python reports the same namespace through both globals
  // and locals. Showing both would falsely suggest that one name exists in two
  // distinct scopes. A separate local group is therefore added only while an
  // actual function frame is active.
  const globalsAndLocalsMatch = JSON.stringify(step.globals || {}) === JSON.stringify(step.locals || {});
  if (activeFrame?.name && activeFrame.name !== "<module>" && !globalsAndLocalsMatch) {
    scopes.push({
      id: "local",
      label: `${activeFrame.name}() local scope`,
      description: "Names closest to the currently executing function line.",
      current: step.locals || {},
      previous: previousStep?.locals || {},
    });
  }

  return scopes.map((scope) => ({
    ...scope,
    records: [...new Set([...Object.keys(scope.previous), ...Object.keys(scope.current)])]
      .sort((left, right) => left.localeCompare(right))
      .map((name) => ({
        name,
        before: scope.previous[name],
        value: scope.current[name],
        kind: dataValueChangeKind(scope.previous[name], scope.current[name]),
      })),
  }));
}

/** Renders every current global and active-local value as a scope-aware dashboard. */
function renderVariables() {
  const step = selectedStep();
  if (!step) {
    renderDataUnavailable({
      viewId: "variables",
      glyph: "x=",
      title: "Variables",
      question: "Which names and values are visible at this recorded step?",
      reason: "Run a program to reveal its recorded variable scopes.",
      steps: [
        "Run a program that creates at least one variable.",
        "Move playback to the line you want to inspect.",
        "Compare Global scope with the active function scope.",
      ],
    });
    return;
  }

  const previous = state.trace[state.currentStep - 1] || null;
  const groups = dataScopeGroups(step, previous);
  const currentRecords = groups.flatMap((group) => group.records).filter((record) => record.value);
  const changedCount = currentRecords.filter((record) => record.kind !== "unchanged").length;
  const { article, body } = createDataViewShell({
    viewId: "variables",
    title: "Variables",
    question: "Which names and values are visible at this recorded step?",
    extraFacts: [
      ["Visible names", String(currentRecords.length)],
      ["Changed now", String(changedCount)],
    ],
  });

  const overview = makeElement("section", "dsa-data-overview");
  overview.append(makeElement("strong", "", `${currentRecords.length} visible name${currentRecords.length === 1 ? "" : "s"}`));
  overview.append(makeElement("p", "", changedCount
    ? `${changedCount} visible name${changedCount === 1 ? "" : "s"} changed at this step.`
    : "No currently visible name changed at this step."));
  body.append(overview);

  groups.forEach((group) => {
    const visible = group.records.filter((record) => record.value);
    if (!visible.length) return;
    const section = makeElement("section", "dsa-variable-scope");
    const heading = makeElement("div", "dsa-data-section-heading");
    const headingCopy = makeElement("div", "");
    headingCopy.append(makeElement("span", "", group.label));
    headingCopy.append(makeElement("p", "", group.description));
    heading.append(headingCopy);
    heading.append(makeElement("strong", "", `${visible.length} visible`));
    section.append(heading);

    const grid = makeElement("div", "dsa-variable-dashboard");
    visible.forEach((record) => {
      const card = makeElement("section", `dsa-variable-tile ${record.kind}`);
      const cardHeading = makeElement("div", "dsa-variable-tile-heading");
      cardHeading.append(makeElement("strong", "", record.name));
      cardHeading.append(makeElement("span", "", record.kind));
      card.append(cardHeading);
      card.append(makeElement("code", "dsa-variable-current", serializedLabel(record.value)));
      const metadata = makeElement("div", "dsa-variable-meta");
      metadata.append(makeElement("span", "", record.value.type || "unknown type"));
      metadata.append(makeElement("span", "", group.label));
      card.append(metadata);
      if (record.kind === "changed") {
        const previousValue = makeElement("div", "dsa-variable-previous");
        previousValue.append(makeElement("span", "", "Previous"));
        previousValue.append(makeElement("code", "", serializedLabel(record.before)));
        card.append(previousValue);
      }
      grid.append(card);
    });
    section.append(grid);
    body.append(section);
  });

  if (!currentRecords.length) {
    body.append(makeElement("p", "dsa-data-inline-empty", "The line executed, but no bounded learner variable is visible in the recorded scopes."));
  }
  els.dsaViewStage.replaceChildren(article);
}

/** Renders likely control names as a bounded live dashboard with honest suggestion labels. */
function renderWatches() {
  const step = selectedStep();
  if (!step) {
    renderDataUnavailable({
      viewId: "watches",
      glyph: "◎",
      title: "Watches",
      question: "Which changing names may help me follow this algorithm?",
      reason: "Run a program to generate local watch suggestions.",
      steps: [
        "Run a loop, search, or accumulator example.",
        "Look for indices, boundaries, counters, and totals.",
        "Advance one step and compare each watch state.",
      ],
    });
    return;
  }

  const previous = state.trace[state.currentStep - 1] || null;
  const comparisons = new Map(
    variableComparisons(previous, step).map((record) => [record.name, record]),
  );
  const variables = variablesForStep(step);
  const preferred = /(index|left|right|low|high|middle|count|total|sum|size|front|rear|pivot|boundary|write|read|target)/i;
  const names = Object.keys(variables)
    .sort((left, right) => Number(preferred.test(right)) - Number(preferred.test(left)) || left.localeCompare(right))
    .slice(0, LIMITS.watches);
  const changedCount = names.filter((name) => comparisons.get(name)?.kind !== "unchanged").length;
  const { article, body } = createDataViewShell({
    viewId: "watches",
    title: "Watches",
    question: "Which changing names may help me follow this algorithm?",
    extraFacts: [
      ["Suggested", String(names.length)],
      ["Changed now", String(changedCount)],
    ],
  });

  const explanation = makeElement("section", "dsa-watch-explanation");
  explanation.append(makeElement("strong", "", "Local suggestions, not learner tracking"));
  explanation.append(makeElement("p", "", "Names are ranked from the current recorded scope. Code Explorer does not save watch choices, record progress, or claim that every suggestion controls the algorithm."));
  body.append(explanation);

  if (!names.length) {
    body.append(makeElement("p", "dsa-data-inline-empty", "No serialized learner name is available to suggest at this step."));
  } else {
    const dashboard = makeElement("div", "dsa-watch-dashboard");
    names.forEach((name, index) => {
      const comparison = comparisons.get(name);
      const kind = comparison?.kind || "unchanged";
      const card = makeElement("section", `dsa-watch-tile ${kind}`);
      const order = makeElement("span", "dsa-watch-order", String(index + 1).padStart(2, "0"));
      const copy = makeElement("div", "dsa-watch-copy");
      const heading = makeElement("div", "");
      heading.append(makeElement("strong", "", name));
      heading.append(makeElement("span", "", preferred.test(name) ? "control-name match" : "visible name"));
      copy.append(heading);
      copy.append(makeElement("code", "", serializedLabel(variables[name])));
      const stateLabel = makeElement("span", `dsa-watch-state ${kind}`, kind);
      card.append(order, copy, stateLabel);
      dashboard.append(card);
    });
    body.append(dashboard);
  }

  if (Object.keys(variables).length > LIMITS.watches) {
    body.append(makeElement("p", "dsa-data-boundary", `Watches shows at most ${LIMITS.watches} names. Additional variables remain available in Variables.`));
  }
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Selects one reviewed visual role for an exact catalog program.
 *
 * Runtime snapshots describe Python values, while this optional role explains
 * how the reviewed lesson uses those values as a stack, queue, linked chain,
 * hash table, tree, heap, trie, or ordinary sequence.
 *
 * @returns {string} Stable CSS role or an empty string for pasted source.
 */
function reviewedStructureRole() {
  if (!state.activeProgram) return "";
  const roles = [
    "stack", "queue", "deque", "singly-linked-list", "doubly-linked-list",
    "circular-linked-list", "hash-table", "set", "tree", "binary-tree",
    "binary-search-tree", "heap", "priority-queue", "trie", "union-find", "graph",
  ];
  return state.activeProgram.structureTypes.find((type) => roles.includes(type)) || "";
}

/** Returns a position label that teaches the reviewed structure orientation. */
function structurePositionLabel(role, index, count) {
  if (role === "stack") return index === count - 1 ? "TOP" : index === 0 ? "BASE" : String(index);
  if (role === "queue" || role === "deque") return index === 0 ? "FRONT" : index === count - 1 ? "REAR" : String(index);
  if (role.includes("linked-list")) return index === 0 ? "HEAD" : index === count - 1 ? "TAIL" : String(index);
  if (role === "hash-table") return `ENTRY ${index}`;
  if (role === "set") return "MEMBER";
  if (role === "heap" || role === "priority-queue") {
    if (index === 0) return "ROOT";
    return index * 2 + 1 >= count ? `LEAF ${index}` : `NODE ${index}`;
  }
  if (role === "tree" || role === "binary-tree" || role === "binary-search-tree") {
    return index === 0 ? "ROOT FIELD" : `FIELD ${index}`;
  }
  if (role === "trie") return index === 0 ? "ROOT EDGE" : `EDGE ${index}`;
  if (role === "union-find") return index === 0 ? "REPRESENTATIVE" : `PARENT ${index}`;
  if (role === "graph") return `GRAPH ENTRY ${index + 1}`;
  return String(index);
}

/**
 * Chooses the observed value that best matches an exact reviewed structure.
 *
 * A trie program can expose both its source word list and the nested trie.
 * Generic "largest container" selection would then place trie labels on the
 * word list. Exact curriculum roles may prefer a semantically named compatible
 * variable, while edited and pasted source continue using the generic helper.
 *
 * @param {object|null} step Selected recorded snapshot.
 * @param {string} role Exact reviewed structure role or an empty string.
 * @returns {{name: string, value: object}|null} Best bounded value candidate.
 */
function reviewedStructureCandidate(step, role) {
  if (!role) {
    const candidate = structureCandidate(step);
    return candidate ? { ...candidate, reviewedRole: "" } : null;
  }
  const variables = variablesForStep(step);
  const entries = Object.entries(variables);
  const rolePreferences = {
    stack: { names: /(?:stack|history|undo|operand|operator)/i, shape: (value) => Array.isArray(value?.items) },
    queue: { names: /(?:queue|frontier|waiting|buffer|line)/i, shape: (value) => Array.isArray(value?.items) },
    deque: { names: /(?:deque|queue|frontier|window)/i, shape: (value) => Array.isArray(value?.items) },
    "singly-linked-list": { names: /(?:head|tail|node|linked|chain)/i, shape: (value) => Array.isArray(value?.entries) || Array.isArray(value?.items) },
    "doubly-linked-list": { names: /(?:head|tail|node|linked|chain)/i, shape: (value) => Array.isArray(value?.entries) || Array.isArray(value?.items) },
    "circular-linked-list": { names: /(?:head|tail|node|linked|cycle|ring)/i, shape: (value) => Array.isArray(value?.entries) || Array.isArray(value?.items) },
    "hash-table": { names: /(?:table|map|lookup|index|bucket|count|frequency)/i, shape: (value) => Array.isArray(value?.entries) },
    set: { names: /(?:set|seen|visited|member|unique)/i, shape: (value) => Array.isArray(value?.entries) || Array.isArray(value?.items) },
    tree: { names: /(?:tree|root|node)/i, shape: (value) => Array.isArray(value?.entries) },
    "binary-tree": { names: /(?:tree|root|node)/i, shape: (value) => Array.isArray(value?.entries) },
    "binary-search-tree": { names: /(?:tree|root|node)/i, shape: (value) => Array.isArray(value?.entries) },
    heap: { names: /(?:heap|frontier|leaders|waiting|jobs|available)/i, shape: (value) => Array.isArray(value?.items) },
    "priority-queue": { names: /(?:heap|queue|frontier|leaders|waiting|jobs|available)/i, shape: (value) => Array.isArray(value?.items) },
    trie: { names: /(?:trie|root|node)/i, shape: (value) => Array.isArray(value?.entries) },
    "union-find": { names: /(?:parent|representative|component|rank|size)/i, shape: (value) => Array.isArray(value?.entries) || Array.isArray(value?.items) },
    graph: { names: /(?:graph|adjacency|matrix|edges|vertices|forest|tree)/i, shape: (value) => Array.isArray(value?.entries) || Array.isArray(value?.items) },
  };
  const preference = rolePreferences[role];
  if (!preference) {
    const candidate = structureCandidate(step);
    return candidate ? { ...candidate, reviewedRole: "" } : null;
  }
  const named = entries.find(([name, value]) => preference.names.test(name) && preference.shape(value));
  if (named) return { name: named[0], value: named[1], reviewedRole: role };
  const candidate = structureCandidate(step);
  return candidate ? { ...candidate, reviewedRole: "" } : null;
}

/**
 * Explains how to read one reviewed structure without implying hidden edges.
 *
 * @param {string} role Exact reviewed role or an empty string.
 * @param {string} type Recorded Python type.
 * @returns {string} Short orientation guide.
 */
function structureReadingGuide(role, type) {
  const guides = {
    stack: "Read from BASE upward to TOP. Push and pop affect the TOP end.",
    queue: "Read from FRONT toward REAR. Removal begins at FRONT and insertion ends at REAR.",
    deque: "A deque can add or remove values at both FRONT and REAR.",
    "singly-linked-list": "HEAD begins the reviewed chain. Arrows are conceptual links, not RAM addresses.",
    "doubly-linked-list": "HEAD and TAIL bound a reviewed chain with conceptual movement in both directions.",
    "circular-linked-list": "The final reviewed position conceptually returns toward HEAD.",
    "hash-table": "Each card is one observed key and value entry. Python's hidden bucket array is not exposed.",
    set: "Every pill is an observed member. Position does not imply a meaningful index.",
    tree: "The root-oriented labels come from reviewed curriculum context. Flattened cells do not invent child edges.",
    "binary-tree": "The root-oriented labels come from reviewed curriculum context. Flattened cells do not invent child edges.",
    "binary-search-tree": "The root-oriented labels come from reviewed curriculum context. Flattened cells do not prove ordering by themselves.",
    heap: "ROOT marks the first serialized heap position. Parent and child meaning follows the reviewed representation.",
    "priority-queue": "ROOT is the next priority candidate in the reviewed representation, not necessarily the smallest displayed text.",
    trie: "Each observed entry is presented as a reviewed character-edge field. Missing nested edges are not guessed.",
    "union-find": "Entries orient parent or representative data. The display does not claim a complete forest edge unless recorded.",
    graph: "Each card is an observed adjacency or graph entry. Structure Canvas does not parse display text into invented edges.",
  };
  return guides[role] || `Read the bounded ${type || "container"} values in their recorded serialized order.`;
}

/** Renders one bounded container with a representation guide and optional reviewed orientation. */
function renderStructureCanvas() {
  const candidate = reviewedStructureCandidate(selectedStep(), reviewedStructureRole());
  if (!candidate) {
    renderDataUnavailable({
      viewId: "structure",
      glyph: "[]",
      title: "Structure Canvas",
      question: "How is one visible container organized at this step?",
      reason: "No supported serialized structure is visible at this step.",
      steps: [
        "Run a program that creates a list, tuple, set, deque, or dictionary.",
        "Advance to a step after the structure is created.",
        "Return here to inspect its bounded representation.",
      ],
    });
    return;
  }
  const { name, value, reviewedRole: role } = candidate;
  const entries = Array.isArray(value.entries)
    ? value.entries.map((entry) => `${serializedLabel(entry.key)}: ${serializedLabel(entry.value)}`)
    : (value.items || []).map(serializedLabel);
  const recordedLength = Number.isInteger(value.length) ? value.length : entries.length;
  const shortened = recordedLength > entries.length || entries.length > LIMITS.structureCells;
  const evidenceKeys = ["observed"];
  if (role) evidenceKeys.push("curriculum");
  if (shortened) evidenceKeys.push("shortened");
  const { article, body } = createDataViewShell({
    viewId: "structure",
    title: "Structure Canvas",
    question: "How is one visible container organized at this step?",
    evidenceKeys,
    extraFacts: [
      ["Selected name", name],
      ["Recorded type", value.type || "unknown"],
      ["Recorded length", String(recordedLength)],
    ],
  });

  const orientation = makeElement("section", "dsa-structure-orientation");
  const orientationCopy = makeElement("div", "");
  orientationCopy.append(makeElement("span", "", role ? "REVIEWED READING GUIDE" : "OBSERVED READING GUIDE"));
  orientationCopy.append(makeElement("strong", "", role ? role.replaceAll("-", " ") : `${value.type || "container"} values`));
  orientationCopy.append(makeElement("p", "", structureReadingGuide(role, value.type)));
  orientation.append(orientationCopy);
  const size = makeElement("div", "dsa-structure-size");
  size.append(makeElement("strong", "", String(Math.min(entries.length, LIMITS.structureCells))));
  size.append(makeElement("span", "", `of ${recordedLength} shown`));
  orientation.append(size);
  body.append(orientation);

  const cells = makeElement("div", `dsa-structure-cells ${role ? `role-${role}` : ""}`.trim());
  entries.slice(0, LIMITS.structureCells).forEach((label, index) => {
    const cell = makeElement("div", "dsa-structure-cell");
    cell.append(makeElement("span", "", structurePositionLabel(role, index, Math.min(entries.length, LIMITS.structureCells))));
    cell.append(makeElement("code", "", label));
    cells.append(cell);
  });
  body.append(cells);
  if (shortened) {
    body.append(makeElement("p", "dsa-data-boundary", `Structure Canvas shows at most ${LIMITS.structureCells} entries. The recorded length remains ${recordedLength}, and the trace is still available.`));
  }
  if (["tree", "binary-tree", "binary-search-tree", "trie", "union-find", "graph"].includes(role)) {
    body.append(makeElement("p", "dsa-data-boundary", "This snapshot does not expose enough structured edge evidence for a trustworthy node-and-edge diagram. Code Explorer keeps the observed cells instead of parsing display text and guessing relationships."));
  }
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Destroys the optional reference graph and invalidates any pending import.
 *
 * The semantic HTML map is owned by ordinary DOM replacement. Cytoscape owns a
 * canvas and listeners, so it needs an explicit lifecycle.
 */
function disposeReferenceGraph() {
  state.referenceGraphRenderId += 1;
  state.referenceGraph?.destroy();
  state.referenceGraph = null;
}

/**
 * Loads the same pinned Cytoscape version already approved by Code Explorer.
 *
 * The import sends no learner source, values, trace, or identifiers. If the
 * asset host is unavailable, the complete semantic HTML map remains visible.
 *
 * @returns {Promise<Function|null>} Cytoscape constructor or null.
 */
async function loadDsaReferenceGraphLibrary() {
  if (state.referenceGraphLibrary) return state.referenceGraphLibrary;
  try {
    const module = await import("https://esm.sh/cytoscape@3.31.0");
    state.referenceGraphLibrary = module.default;
    return state.referenceGraphLibrary;
  } catch (error) {
    console.warn("Code Explorer could not load the optional DSA reference graph.", error);
    return null;
  }
}

/**
 * Resolves current theme tokens for the optional Cytoscape canvas.
 *
 * @returns {Record<string, string>} Named graph colors and font.
 */
function dsaReferenceGraphPalette() {
  const style = getComputedStyle(document.documentElement);
  const token = (name) => style.getPropertyValue(name).trim();
  return {
    text: token("--text"),
    soft: token("--text-soft"),
    panel: token("--bg-raised"),
    line: token("--line-bright"),
    mint: token("--mint"),
    purple: token("--purple"),
    cyan: token("--cyan"),
    mono: token("--mono"),
  };
}

/**
 * Groups names by worker-issued object token while retaining their scope.
 *
 * @param {object|null} step Recorded snapshot.
 * @returns {Array<object>} Conceptual object groups.
 */
function referenceGroupsForStep(step) {
  if (!step) return [];
  const groups = new Map();
  dataScopeGroups(step, null).forEach((scope) => {
    scope.records.filter((record) => record.value?.objectId).forEach((record) => {
      const token = record.value.objectId;
      if (!groups.has(token)) groups.set(token, { value: record.value, names: [] });
      groups.get(token).names.push({
        name: record.name,
        scopeId: scope.id,
        scopeLabel: scope.label,
      });
    });
  });
  return [...groups.values()];
}

/**
 * Converts conceptual groups into a bounded scope-to-name-to-object graph.
 *
 * @param {Array<object>} groups Conceptual reference groups.
 * @returns {{elements: Array<object>, shortened: boolean}} Safe graph data.
 */
function dsaReferenceGraphElements(groups) {
  const elements = [];
  const scopeIds = new Set();
  let shortened = false;

  groups.forEach((group, groupIndex) => {
    if (shortened) return;
    const neededScopes = [...new Map(
      group.names
        .filter((item) => !scopeIds.has(item.scopeId))
        .map((item) => [item.scopeId, item]),
    ).values()];
    const required = neededScopes.length + 1 + (group.names.length * 3);
    if (elements.length + required > LIMITS.referenceGraphElements) {
      shortened = true;
      return;
    }
    neededScopes.forEach((item) => {
      scopeIds.add(item.scopeId);
      elements.push({
        data: { id: `scope-${item.scopeId}`, label: item.scopeLabel.toUpperCase(), kind: "scope" },
      });
    });
    const objectId = `object-${groupIndex}`;
    elements.push({
      data: {
        id: objectId,
        label: `${group.value.type || "object"}\n${serializedLabel(group.value)}`,
        kind: "object",
      },
    });
    group.names.forEach((item, nameIndex) => {
      const nameId = `name-${groupIndex}-${nameIndex}`;
      elements.push({ data: { id: nameId, label: item.name, kind: "name" } });
      elements.push({
        data: {
          id: `scope-edge-${groupIndex}-${nameIndex}`,
          source: `scope-${item.scopeId}`,
          target: nameId,
          label: "contains",
        },
      });
      elements.push({
        data: {
          id: `reference-edge-${groupIndex}-${nameIndex}`,
          source: nameId,
          target: objectId,
          label: "references",
        },
      });
    });
  });
  return { elements, shortened };
}

/**
 * Enhances the already-visible HTML reference map with a pannable graph.
 *
 * @param {HTMLElement} canvas Mounted graph container.
 * @param {Array<object>} groups Conceptual reference groups.
 * @param {object} controls Fit, zoom, output, and status elements.
 * @returns {Promise<void>} Resolves after enhancement or safe fallback.
 */
async function enhanceDsaReferenceMap(canvas, groups, controls) {
  const renderId = ++state.referenceGraphRenderId;
  controls.status.textContent = "Loading optional interactive map";
  const cytoscape = await loadDsaReferenceGraphLibrary();
  if (
    !cytoscape
    || renderId !== state.referenceGraphRenderId
    || state.activeView !== "references"
    || !canvas.isConnected
  ) {
    if (canvas.isConnected && renderId === state.referenceGraphRenderId) {
      controls.status.textContent = "Interactive map unavailable. The complete text map remains below.";
      canvas.classList.add("unavailable");
      canvas.dataset.message = "Interactive map unavailable";
    }
    return;
  }

  const { elements, shortened } = dsaReferenceGraphElements(groups);
  const colors = dsaReferenceGraphPalette();
  state.referenceGraph?.destroy();
  state.referenceGraph = cytoscape({
    container: canvas,
    elements,
    pixelRatio: Math.min(3, Math.max(2, window.devicePixelRatio || 1)),
    minZoom: 0.5,
    maxZoom: 1.6,
    layout: {
      name: "breadthfirst",
      directed: true,
      padding: 26,
      spacingFactor: 1.15,
      animate: false,
    },
    style: [
      {
        selector: "node",
        style: {
          label: "data(label)",
          color: colors.text,
          "background-color": colors.panel,
          "border-color": colors.line,
          "border-width": 1.5,
          "font-family": colors.mono,
          "font-size": 12,
          "font-weight": 600,
          "text-wrap": "wrap",
          "text-max-width": 150,
          "text-valign": "center",
          "text-halign": "center",
          shape: "round-rectangle",
          width: 142,
          height: 58,
        },
      },
      {
        selector: 'node[kind = "scope"]',
        style: {
          "background-color": colors.purple,
          color: colors.panel,
          width: 150,
          height: 44,
          "font-weight": 700,
        },
      },
      {
        selector: 'node[kind = "name"]',
        style: {
          "border-color": colors.cyan,
          "border-width": 2.5,
          color: colors.cyan,
          width: 116,
          height: 42,
        },
      },
      {
        selector: 'node[kind = "object"]',
        style: {
          "border-color": colors.mint,
          "border-width": 2.5,
        },
      },
      {
        selector: "node:selected",
        style: {
          "border-color": colors.mint,
          "border-width": 4,
          "background-color": colors.panel,
        },
      },
      {
        selector: "edge",
        style: {
          label: "data(label)",
          width: 1.7,
          "line-color": colors.line,
          "target-arrow-color": colors.mint,
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          color: colors.soft,
          "font-family": colors.mono,
          "font-size": 10,
          "font-weight": 600,
          "text-background-color": colors.panel,
          "text-background-opacity": 1,
          "text-background-padding": 3,
        },
      },
    ],
  });

  const syncZoom = () => {
    const percent = Math.round(state.referenceGraph.zoom() * 100);
    controls.slider.value = String(percent);
    controls.output.value = `${percent}%`;
  };
  const setZoom = (requested) => {
    const percent = Math.min(160, Math.max(50, Number(requested) || 100));
    state.referenceGraph.zoom({
      level: percent / 100,
      renderedPosition: {
        x: canvas.clientWidth / 2,
        y: canvas.clientHeight / 2,
      },
    });
    syncZoom();
  };
  controls.slider.disabled = false;
  controls.fit.disabled = false;
  controls.slider.addEventListener("input", () => setZoom(controls.slider.value));
  controls.fit.addEventListener("click", () => {
    state.referenceGraph.fit(undefined, 26);
    syncZoom();
  });
  state.referenceGraph.on("zoom", syncZoom);
  state.referenceGraph.fit(undefined, 26);
  syncZoom();
  controls.status.textContent = shortened
    ? `Interactive map ready. It shows the first ${LIMITS.referenceGraphElements} graph elements.`
    : "Interactive map ready. Select a node, pan, zoom, or use Fit.";
  canvas.classList.remove("loading", "unavailable");
  delete canvas.dataset.message;
}

/** Renders an observed name-to-object map with a complete semantic fallback. */
function renderReferences() {
  disposeReferenceGraph();
  const step = selectedStep();
  const groups = referenceGroupsForStep(step);
  if (!groups.length) {
    renderDataUnavailable({
      viewId: "references",
      glyph: "→",
      title: "References",
      question: "Which names point to the same conceptual Python object?",
      reason: "No serialized non-primitive object reference is visible at this step.",
      steps: [
        "Run a program that stores a list, dictionary, set, or object.",
        "Assign the same object to another name.",
        "Advance to that line and compare the shared object group.",
      ],
    });
    return;
  }

  const aliasCount = groups.filter((group) => group.names.length > 1).length;
  const { article, body } = createDataViewShell({
    viewId: "references",
    title: "References",
    question: "Which names point to the same conceptual Python object?",
    extraFacts: [
      ["Object groups", String(groups.length)],
      ["Shared groups", String(aliasCount)],
    ],
  });

  const boundary = makeElement("section", "dsa-reference-boundary");
  boundary.append(makeElement("strong", "", "Conceptual references, not physical RAM addresses"));
  boundary.append(makeElement("p", "", "Worker identity tokens group names that reference the same serialized object during this local run. The tokens are temporary teaching evidence and are never displayed as memory addresses."));
  body.append(boundary);

  const interactive = makeElement("section", "dsa-reference-interactive");
  const controls = makeElement("div", "dsa-reference-controls");
  const status = makeElement("p", "dsa-reference-status", state.playbackTimer
    ? "Playback is running. The interactive map will refresh once playback pauses."
    : "Preparing optional interactive map");
  const fit = makeElement("button", "secondary-button", "Fit");
  fit.type = "button";
  fit.disabled = true;
  const zoomLabel = makeElement("label", "dsa-reference-zoom");
  zoomLabel.append(makeElement("span", "", "Zoom"));
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "50";
  slider.max = "160";
  slider.step = "5";
  slider.value = "100";
  slider.disabled = true;
  slider.setAttribute("aria-label", "Reference map zoom");
  const output = document.createElement("output");
  output.value = "100%";
  zoomLabel.append(slider, output);
  controls.append(status, fit, zoomLabel);
  const canvas = makeElement("div", "dsa-reference-canvas loading");
  canvas.dataset.message = state.playbackTimer ? "Map waits while playback runs" : "Building the reference map";
  canvas.setAttribute("aria-label", "Interactive conceptual reference map");
  interactive.append(controls, canvas);
  body.append(interactive);

  const fallback = makeElement("section", "dsa-reference-fallback");
  const fallbackHeading = makeElement("div", "dsa-data-section-heading");
  const fallbackCopy = makeElement("div", "");
  fallbackCopy.append(makeElement("span", "", "TEXT MAP"));
  fallbackCopy.append(makeElement("p", "", "This complete readable map remains available even if the optional graph cannot load."));
  fallbackHeading.append(fallbackCopy);
  fallbackHeading.append(makeElement("strong", "", `${groups.length} object group${groups.length === 1 ? "" : "s"}`));
  fallback.append(fallbackHeading);

  const list = makeElement("div", "dsa-reference-map-list");
  groups.forEach((group, index) => {
    const card = makeElement("section", `dsa-reference-group ${group.names.length > 1 ? "shared" : "single"}`);
    const cardHeader = makeElement("div", "dsa-reference-group-heading");
    cardHeader.append(makeElement("span", "", `OBJECT ${String(index + 1).padStart(2, "0")}`));
    cardHeader.append(makeElement("strong", "", group.names.length > 1 ? "Shared reference" : "One visible name"));
    card.append(cardHeader);
    const path = makeElement("div", "dsa-reference-path");
    const names = makeElement("div", "dsa-reference-names");
    group.names.forEach((item) => {
      const pill = makeElement("span", "");
      pill.append(makeElement("small", "", item.scopeLabel));
      pill.append(makeElement("strong", "", item.name));
      names.append(pill);
    });
    const arrow = makeElement("span", "dsa-reference-arrow", "→");
    arrow.setAttribute("aria-hidden", "true");
    const object = makeElement("div", "dsa-reference-object");
    object.append(makeElement("span", "", group.value.type || "object"));
    object.append(makeElement("code", "", serializedLabel(group.value)));
    path.append(names, arrow, object);
    card.append(path);
    list.append(card);
  });
  fallback.append(list);
  body.append(fallback);
  els.dsaViewStage.replaceChildren(article);

  if (!state.playbackTimer) {
    enhanceDsaReferenceMap(canvas, groups, { fit, slider, output, status });
  }
}

/**
 * Returns current names that share one worker-issued conceptual object token.
 *
 * @param {string|undefined} objectId Temporary object token.
 * @param {object|null} step Recorded snapshot.
 * @returns {Array<string>} Sorted visible alias names.
 */
function aliasesForObject(objectId, step) {
  if (!objectId || !step) return [];
  return Object.entries(variablesForStep(step))
    .filter(([, value]) => value?.objectId === objectId)
    .map(([name]) => name)
    .sort((left, right) => left.localeCompare(right));
}

/**
 * Collapses alias-level reports of one in-place object mutation into one event.
 *
 * The worker records values by visible name, so two aliases of the same list
 * can both report the same before-to-after mutation. A learner should see one
 * changed object with two affected names, not two apparently separate object
 * mutations.
 *
 * @param {Array<object>} changes Name-level object changes.
 * @returns {Array<object>} Unique object events with their affected names.
 */
function groupedObjectChanges(changes) {
  const grouped = new Map();
  changes.forEach((change) => {
    const sameObject = change.before?.objectId && change.before.objectId === change.after?.objectId;
    const key = sameObject
      ? `mutation:${change.before.objectId}:${serializedLabel(change.before)}:${serializedLabel(change.after)}`
      : `reference:${change.name}`;
    if (!grouped.has(key)) {
      grouped.set(key, { ...change, names: [] });
    }
    grouped.get(key).names.push(change.name);
  });
  return [...grouped.values()].map((change) => ({
    ...change,
    names: [...new Set(change.names)].sort((left, right) => left.localeCompare(right)),
  }));
}

/** Distinguishes same-object mutation from reassignment through an operation journey. */
function renderMutationExplorer() {
  const step = selectedStep();
  if (!step) {
    renderDataUnavailable({
      viewId: "mutation",
      glyph: "Δ",
      title: "Mutation Explorer",
      question: "Did an object change in place, or did a name point somewhere new?",
      reason: "Run a program to compare adjacent object snapshots.",
      steps: [
        "Run a program that changes a list, dictionary, set, or object.",
        "Move playback to an append, update, removal, or assignment.",
        "Compare the object token and before-to-after values.",
      ],
    });
    return;
  }
  const changes = variableChanges(state.trace[state.currentStep - 1] || null, step);
  const objectChanges = groupedObjectChanges(
    changes.filter((change) => change.before?.objectId || change.after?.objectId),
  );
  const mutationCount = objectChanges.filter(
    (change) => change.before?.objectId && change.before.objectId === change.after?.objectId,
  ).length;
  const { article, body } = createDataViewShell({
    viewId: "mutation",
    title: "Mutation Explorer",
    question: "Did an object change in place, or did a name point somewhere new?",
    extraFacts: [
      ["Object changes", String(objectChanges.length)],
      ["In-place changes", String(mutationCount)],
    ],
  });

  const legend = makeElement("section", "dsa-mutation-legend");
  const same = makeElement("div", "");
  same.append(makeElement("strong", "", "Same object changed"));
  same.append(makeElement("p", "", "The temporary object token stayed the same while its recorded value changed."));
  const reassigned = makeElement("div", "");
  reassigned.append(makeElement("strong", "", "Name reassigned"));
  reassigned.append(makeElement("p", "", "The name was created, removed, or now points to a different conceptual object token."));
  legend.append(same, reassigned);
  body.append(legend);

  if (!objectChanges.length) {
    const empty = makeElement("section", "dsa-mutation-empty");
    empty.append(makeElement("strong", "", "No visible object change at this step"));
    empty.append(makeElement("p", "", "The line may have read a value, changed only a primitive, or completed without changing a bounded object snapshot."));
    empty.append(makeElement("p", "dsa-data-boundary", "Move one step forward or backward. Mutation Explorer follows the selected recorded line rather than summarizing the complete run."));
    body.append(empty);
  } else {
    const list = makeElement("div", "dsa-mutation-timeline");
    objectChanges.forEach((change) => {
      const sameObject = change.before?.objectId && change.before.objectId === change.after?.objectId;
      const card = makeElement("section", `dsa-mutation-card ${sameObject ? "mutated" : "reassigned"}`);
      const heading = makeElement("div", "dsa-mutation-heading");
      const headingCopy = makeElement("div", "");
      headingCopy.append(makeElement("span", "", sameObject ? "IN-PLACE MUTATION" : "REFERENCE CHANGE"));
      headingCopy.append(makeElement(
        "strong",
        "",
        change.names.length === 1 ? change.names[0] : `${change.names.length} affected names`,
      ));
      heading.append(headingCopy);
      heading.append(makeElement("span", "dsa-mutation-kind", sameObject ? "same object changed" : "name reassigned"));
      card.append(heading);

      const journey = makeElement("div", "dsa-mutation-journey");
      const before = makeElement("div", "dsa-mutation-value before");
      before.append(makeElement("span", "", "BEFORE"));
      before.append(makeElement("code", "", serializedLabel(change.before)));
      const operation = makeElement("div", "dsa-mutation-operation");
      operation.append(makeElement("span", "", "EXECUTED"));
      operation.append(makeElement("code", "", step.source.trim()));
      const after = makeElement("div", "dsa-mutation-value after");
      after.append(makeElement("span", "", "AFTER"));
      after.append(makeElement("code", "", serializedLabel(change.after)));
      journey.append(before, operation, after);
      card.append(journey);

      const aliases = aliasesForObject(change.after?.objectId, step);
      const aliasRow = makeElement("div", "dsa-mutation-aliases");
      aliasRow.append(makeElement("span", "", sameObject
        ? "Affected names sharing this object"
        : "Names sharing the resulting object"));
      if (aliases.length) {
        const pills = makeElement("div", "");
        aliases.forEach((alias) => pills.append(makeElement("span", "", alias)));
        aliasRow.append(pills);
      } else {
        aliasRow.append(makeElement("strong", "", "No visible alias"));
      }
      card.append(aliasRow);
      list.append(card);
    });
    body.append(list);
  }
  els.dsaViewStage.replaceChildren(article);
}

/** Shows reviewed invariant statements without pretending they were proven automatically. */
function renderInvariantChecker() {
  if (!state.activeProgram) {
    renderDataUnavailable({
      viewId: "invariant",
      glyph: "✓?",
      title: "Invariant Checker",
      question: "Which reviewed rule should remain true, and what evidence can I inspect?",
      reason: "Reviewed invariant statements require an unchanged catalog program.",
      steps: [
        "Choose a reviewed example from the DSA catalog.",
        "Run it without changing the source.",
        "Use the listed rule as a question, not an automatic proof.",
      ],
    });
    return;
  }
  const step = selectedStep();
  const { article, body } = createDataViewShell({
    viewId: "invariant",
    title: "Invariant Checker",
    question: "Which reviewed rule should remain true, and what evidence can I inspect?",
    step,
    evidenceKeys: ["curriculum"],
    extraFacts: [["Reviewed rules", String(state.activeProgram.invariants.length)]],
  });

  const explanation = makeElement("section", "dsa-invariant-explanation");
  explanation.append(makeElement("strong", "", "An invariant is a rule expected to remain true at defined points in an algorithm."));
  explanation.append(makeElement("p", "", "The statements below are reviewed curriculum context. Code Explorer does not automatically call a rule satisfied or violated unless the trace contains a dedicated verified check."));
  body.append(explanation);

  if (!state.activeProgram.invariants.length) {
    const empty = makeElement("section", "dsa-invariant-empty");
    empty.append(evidenceBadge("unavailable"));
    empty.append(makeElement("strong", "", "No separate invariant is documented for this focused lesson"));
    empty.append(makeElement("p", "", "Use Algorithm Story, Variables, or Before and After for its recorded evidence."));
    body.append(empty);
  } else {
    const list = makeElement("ol", "dsa-invariant-checklist");
    state.activeProgram.invariants.forEach((invariant, index) => {
      const item = makeElement("li", "dsa-invariant-card unavailable");
      const number = makeElement("span", "dsa-invariant-number", String(index + 1).padStart(2, "0"));
      const copy = makeElement("div", "dsa-invariant-copy");
      copy.append(makeElement("span", "", "REVIEWED RULE"));
      copy.append(makeElement("strong", "", invariant));
      const evidence = makeElement("div", "dsa-invariant-evidence");
      evidence.append(evidenceBadge("unavailable"));
      evidence.append(makeElement("p", "", step
        ? `Current observed line: ${step.source.trim()}`
        : "Run the program to place this rule beside an observed source line."));
      evidence.append(makeElement("p", "", "Automatic satisfied or violated verdict unavailable."));
      copy.append(evidence);
      item.append(number, copy);
      list.append(item);
    });
    body.append(list);
  }
  body.append(makeElement("p", "dsa-data-boundary", "A printed Result marker checks the reviewed program's expected output. It does not prove every invariant at every recorded step."));
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Builds normalized events for the complete recorded trace.
 *
 * Playback selects a position inside an already completed recording. Keeping
 * all event indexes lets Flow views show earlier and later recorded context
 * without implying that later rows have not executed.
 *
 * @returns {Array<object>} Complete ordered event records.
 */
function observedEventsForTrace() {
  return state.trace.map((step, index) => {
    const changes = variableChanges(state.trace[index - 1] || null, step);
    return { step, changes, event: classifyDsaEvent(step, changes), index };
  });
}

/**
 * Selects a bounded window that always contains the active playback position.
 *
 * @param {Array<object>} entries Complete ordered entries.
 * @param {number} activeIndex Absolute selected index.
 * @param {number} limit Maximum entries shown.
 * @returns {{entries: Array<object>, start: number, shortened: boolean}} Window metadata.
 */
function boundedFlowWindow(entries, activeIndex, limit) {
  if (entries.length <= limit) return { entries, start: 0, shortened: false };
  const half = Math.floor(limit / 2);
  const start = Math.max(0, Math.min(activeIndex - half, entries.length - limit));
  return { entries: entries.slice(start, start + limit), start, shortened: true };
}

/**
 * Builds the common orientation header for all four Flow views.
 *
 * Flow views explain ordered movement rather than only one snapshot. Their
 * header therefore names the selected boundary and keeps the executed source
 * line visible before the learner reads a timeline, graph, table, or metric.
 *
 * @param {object} options Flow-view presentation options.
 * @param {string} options.viewId Stable view id used by scoped CSS.
 * @param {string} options.title Learner-facing title.
 * @param {string} options.question Plain-language question answered by the view.
 * @param {object|null} [options.step] Selected recorded step.
 * @param {Array<string>} [options.evidenceKeys] Evidence badges shown in order.
 * @param {Array<Array<string>>} [options.extraFacts] Additional context facts.
 * @returns {{article: HTMLElement, body: HTMLElement}} Shell and empty content mount.
 */
function createFlowViewShell({
  viewId,
  title,
  question,
  step = selectedStep(),
  evidenceKeys = ["observed"],
  extraFacts = [],
}) {
  const article = makeElement("article", `dsa-runtime-view dsa-flow-view dsa-flow-${viewId}`);
  const hero = makeElement("header", "dsa-flow-hero");
  const identity = makeElement("div", "dsa-flow-identity");
  const eyebrow = makeElement("div", "dsa-flow-eyebrow");
  evidenceKeys.forEach((key) => eyebrow.append(evidenceBadge(key)));
  eyebrow.append(makeElement("span", "", `FLOW / ${title.toUpperCase()}`));
  identity.append(eyebrow);
  identity.append(makeElement("h2", "", title));
  identity.append(makeElement("p", "", question));
  hero.append(identity);

  const context = makeElement("section", "dsa-flow-context");
  const facts = [["Program", traceProgramLabel()]];
  if (step) {
    facts.push(
      ["Selected boundary", `${state.currentStep + 1} of ${state.trace.length}`],
      ["Source line", String(step.line)],
    );
  }
  facts.push(...extraFacts);
  facts.forEach(([label, value]) => {
    const fact = makeElement("div", "dsa-flow-context-fact");
    fact.append(makeElement("span", "", label));
    fact.append(makeElement("strong", "", value));
    context.append(fact);
  });
  hero.append(context);
  if (step) hero.append(makeElement("code", "dsa-flow-source", step.source.trim()));

  const body = makeElement("div", "dsa-flow-body");
  article.append(hero, body);
  return { article, body };
}

/**
 * Renders a purposeful pre-run state for one Flow view.
 *
 * @param {object} options Empty-state content.
 * @param {string} options.viewId Stable view id.
 * @param {string} options.glyph Compact visual mark.
 * @param {string} options.title Learner-facing title.
 * @param {string} options.question Question answered after a run.
 * @param {string} options.reason Honest reason evidence is unavailable.
 * @param {Array<string>} options.steps Safe learner actions.
 */
function renderFlowUnavailable({ viewId, glyph, title, question, reason, steps }) {
  const { article, body } = createFlowViewShell({
    viewId,
    title,
    question,
    step: null,
    evidenceKeys: ["unavailable"],
  });
  const empty = makeElement("section", "dsa-flow-empty-state");
  const mark = makeElement("span", "dsa-flow-empty-glyph", glyph);
  mark.setAttribute("aria-hidden", "true");
  empty.append(mark);
  empty.append(makeElement("h3", "", reason));
  const list = makeElement("ol", "dsa-flow-next-steps");
  steps.forEach((step) => list.append(makeElement("li", "", step)));
  empty.append(list);
  body.append(empty);
  els.dsaViewStage.replaceChildren(article);
}

/** Renders the selected operation inside a bounded chronological spine. */
function renderOperationJourney() {
  const events = observedEventsForTrace();
  if (!events.length) {
    renderFlowUnavailable({
      viewId: "operations",
      glyph: "→",
      title: "Operation Journey",
      question: "Which operation is selected, and what happened around it?",
      reason: "Run a trace to build an ordered journey of observed operations.",
      steps: [
        "Choose a reviewed example or keep your own Python.",
        "Run the program locally in this browser.",
        "Move playback to follow the active operation.",
      ],
    });
    return;
  }
  const windowed = boundedFlowWindow(events, state.currentStep, LIMITS.operationJourneyRows);
  const evidenceKeys = ["observed"];
  if (windowed.shortened) evidenceKeys.push("shortened");
  const current = events[state.currentStep];
  const { article, body } = createFlowViewShell({
    viewId: "operations",
    title: "Operation Journey",
    question: "Which operation is selected, and what happened around it?",
    evidenceKeys,
    extraFacts: [
      ["Observed event", current.event.type.replaceAll("_", " ")],
      ["Window", `${windowed.entries.length} of ${events.length} operations`],
    ],
  });

  const active = makeElement("section", "dsa-flow-current-operation");
  active.append(makeElement("span", "", "SELECTED OPERATION"));
  active.append(makeElement("strong", "", current.event.type.replaceAll("_", " ")));
  active.append(makeElement("p", "", current.event.explanation));
  body.append(active);

  const list = makeElement("ol", "dsa-flow-operation-spine");
  windowed.entries.forEach(({ step, event, changes, index }) => {
    const position = index < state.currentStep ? "earlier" : index > state.currentStep ? "later" : "current";
    const item = makeElement("li", `dsa-flow-operation ${position}`);
    const jump = makeElement("button", "", "");
    jump.type = "button";
    jump.setAttribute("aria-label", `Go to recorded step ${index + 1}, line ${step.line}`);
    if (position === "current") jump.setAttribute("aria-current", "step");
    const marker = makeElement("span", "dsa-flow-operation-marker", String(index + 1).padStart(2, "0"));
    const copy = makeElement("span", "dsa-flow-operation-copy");
    copy.append(makeElement("strong", "", event.type.replaceAll("_", " ")));
    copy.append(makeElement("code", "", step.source.trim()));
    copy.append(makeElement(
      "span",
      "",
      `${position === "current" ? "Selected" : `${position[0].toUpperCase()}${position.slice(1)}`} recorded step · ${changes.length} changed ${changes.length === 1 ? "name" : "names"}`,
    ));
    jump.append(marker, copy);
    jump.addEventListener("click", () => selectStep(index));
    item.append(jump);
    list.append(item);
  });
  body.append(list);
  if (windowed.shortened) {
    body.append(makeElement("p", "dsa-flow-boundary", `Operation Journey keeps the selected step inside a ${LIMITS.operationJourneyRows}-event window. The full recorded trace remains available through playback and Step Table.`));
  }
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Destroys the optional Algorithm Path graph and invalidates pending imports.
 */
function disposeAlgorithmPathGraph() {
  state.algorithmPathGraphRenderId += 1;
  state.algorithmPathGraph?.destroy();
  state.algorithmPathGraph = null;
}

/**
 * Builds unique line nodes and counted transitions from an exact step window.
 *
 * The accompanying semantic transition list retains chronological order. The
 * graph groups repeated transitions only to reduce visual clutter.
 *
 * @param {Array<object>} entries Bounded ordered trace entries.
 * @returns {Array<object>} Cytoscape nodes and edges.
 */
function algorithmPathGraphElements(entries) {
  const nodes = new Map();
  const edges = new Map();
  entries.forEach(({ step, index }, entryIndex) => {
    const nodeId = `line-${step.line}`;
    if (!nodes.has(nodeId)) {
      nodes.set(nodeId, {
        data: {
          id: nodeId,
          label: `LINE ${step.line}\n${step.source.trim()}`,
          kind: index === state.currentStep ? "current" : "line",
        },
      });
    } else if (index === state.currentStep) {
      nodes.get(nodeId).data.kind = "current";
    }
    if (entryIndex === 0) return;
    const previous = entries[entryIndex - 1];
    const edgeId = `edge-${previous.step.line}-${step.line}`;
    if (!edges.has(edgeId)) {
      edges.set(edgeId, {
        data: {
          id: edgeId,
          source: `line-${previous.step.line}`,
          target: nodeId,
          count: 0,
          kind: "transition",
        },
      });
    }
    const edge = edges.get(edgeId);
    edge.data.count += 1;
    edge.data.label = `${edge.data.count}x`;
    if (index === state.currentStep) edge.data.kind = "current";
  });
  return [...nodes.values(), ...edges.values()];
}

/**
 * Enhances the complete HTML transition list with an optional path graph.
 *
 * @param {HTMLElement} canvas Mounted graph container.
 * @param {Array<object>} entries Bounded exact trace entries.
 * @param {object} controls Fit, zoom, output, and status elements.
 * @returns {Promise<void>} Resolves after enhancement or safe fallback.
 */
async function enhanceAlgorithmPathGraph(canvas, entries, controls) {
  const renderId = ++state.algorithmPathGraphRenderId;
  controls.status.textContent = "Loading optional path graph";
  const cytoscape = await loadDsaReferenceGraphLibrary();
  if (
    !cytoscape
    || renderId !== state.algorithmPathGraphRenderId
    || state.activeView !== "algorithm-path"
    || !canvas.isConnected
  ) {
    if (canvas.isConnected && renderId === state.algorithmPathGraphRenderId) {
      controls.status.textContent = "Interactive graph unavailable. The complete ordered transition list remains below.";
      canvas.classList.add("unavailable");
      canvas.dataset.message = "Interactive path graph unavailable";
    }
    return;
  }

  const colors = dsaReferenceGraphPalette();
  state.algorithmPathGraph?.destroy();
  state.algorithmPathGraph = cytoscape({
    container: canvas,
    elements: algorithmPathGraphElements(entries),
    pixelRatio: Math.min(3, Math.max(2, window.devicePixelRatio || 1)),
    minZoom: 0.5,
    maxZoom: 1.6,
    layout: {
      name: "breadthfirst",
      directed: true,
      padding: 28,
      spacingFactor: 1.18,
      animate: false,
    },
    style: [
      {
        selector: "node",
        style: {
          label: "data(label)",
          color: colors.text,
          "background-color": colors.panel,
          "border-color": colors.line,
          "border-width": 1.5,
          "font-family": colors.mono,
          "font-size": 11,
          "font-weight": 600,
          "text-wrap": "wrap",
          "text-max-width": 160,
          "text-valign": "center",
          "text-halign": "center",
          shape: "round-rectangle",
          width: 170,
          height: 64,
        },
      },
      {
        selector: 'node[kind = "current"]',
        style: {
          "border-color": colors.mint,
          "border-width": 4,
          "background-color": colors.panel,
        },
      },
      {
        selector: "edge",
        style: {
          label: "data(label)",
          width: 1.8,
          "line-color": colors.line,
          "target-arrow-color": colors.line,
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          color: colors.soft,
          "font-family": colors.mono,
          "font-size": 10,
          "text-background-color": colors.panel,
          "text-background-opacity": 1,
          "text-background-padding": 3,
        },
      },
      {
        selector: 'edge[kind = "current"]',
        style: {
          width: 4,
          "line-color": colors.mint,
          "target-arrow-color": colors.mint,
        },
      },
      {
        selector: "node:selected",
        style: {
          "border-color": colors.purple,
          "border-width": 4,
        },
      },
    ],
  });

  const syncZoom = () => {
    const percent = Math.round(state.algorithmPathGraph.zoom() * 100);
    controls.slider.value = String(percent);
    controls.output.value = `${percent}%`;
  };
  const setZoom = (requested) => {
    const percent = Math.min(160, Math.max(50, Number(requested) || 100));
    state.algorithmPathGraph.zoom({
      level: percent / 100,
      renderedPosition: { x: canvas.clientWidth / 2, y: canvas.clientHeight / 2 },
    });
    syncZoom();
  };
  controls.slider.disabled = false;
  controls.fit.disabled = false;
  controls.slider.addEventListener("input", () => setZoom(controls.slider.value));
  controls.fit.addEventListener("click", () => {
    state.algorithmPathGraph.fit(undefined, 28);
    syncZoom();
  });
  state.algorithmPathGraph.on("zoom", syncZoom);
  state.algorithmPathGraph.fit(undefined, 28);
  syncZoom();
  controls.status.textContent = "Interactive path ready. Select a line, pan, zoom, or use Fit.";
  canvas.classList.remove("loading", "unavailable");
  delete canvas.dataset.message;
}

/** Renders exact executed transitions with an optional readable graph. */
function renderAlgorithmPath() {
  disposeAlgorithmPathGraph();
  if (!state.trace.length) {
    renderFlowUnavailable({
      viewId: "path",
      glyph: "↳",
      title: "Algorithm Path",
      question: "Which source-line transition is selected, and how often was each route recorded?",
      reason: "Run a trace to map the source lines Python actually reached.",
      steps: [
        "Run a reviewed or pasted Python program.",
        "Use playback to select one transition boundary.",
        "Read the ordered list even if the optional graph is unavailable.",
      ],
    });
    return;
  }
  const allEntries = state.trace.map((step, index) => ({ step, index }));
  const windowed = boundedFlowWindow(allEntries, state.currentStep, LIMITS.algorithmPathSteps);
  const prefix = state.trace.slice(0, state.currentStep + 1);
  const counts = new Map();
  prefix.forEach((step) => counts.set(step.line, (counts.get(step.line) || 0) + 1));
  const evidenceKeys = ["observed"];
  if (windowed.shortened) evidenceKeys.push("shortened");
  const previous = state.trace[state.currentStep - 1] || null;
  const transition = previous ? `Line ${previous.line} to line ${selectedStep().line}` : `Start at line ${selectedStep().line}`;
  const { article, body } = createFlowViewShell({
    viewId: "path",
    title: "Algorithm Path",
    question: "Which source-line transition is selected, and how often was each route recorded?",
    evidenceKeys,
    extraFacts: [
      ["Selected transition", transition],
      ["Window", `${windowed.entries.length} of ${state.trace.length} steps`],
    ],
  });

  const boundary = makeElement("section", "dsa-flow-path-boundary");
  boundary.append(makeElement("span", "", "SELECTED TRANSITION BOUNDARY"));
  boundary.append(makeElement("strong", "", transition));
  boundary.append(makeElement("p", "", "The graph groups repeated line-to-line transitions for readability. The ordered list below preserves every displayed transition in recorded order."));
  body.append(boundary);

  const graphPanel = makeElement("section", "dsa-flow-path-graph");
  const toolbar = makeElement("div", "dsa-flow-path-toolbar");
  const status = makeElement("p", "dsa-flow-path-status", state.playbackTimer
    ? "Playback is running. The path graph will refresh once playback pauses."
    : "Preparing the optional path graph");
  status.setAttribute("role", "status");
  const controls = makeElement("div", "dsa-flow-path-controls");
  const fit = makeElement("button", "", "Fit");
  fit.type = "button";
  fit.disabled = true;
  const sliderLabel = makeElement("label", "");
  sliderLabel.append(makeElement("span", "", "Zoom"));
  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = "50";
  slider.max = "160";
  slider.step = "5";
  slider.value = "100";
  slider.disabled = true;
  slider.setAttribute("aria-label", "Algorithm Path graph zoom");
  const output = document.createElement("output");
  output.value = "100%";
  sliderLabel.append(slider, output);
  controls.append(fit, sliderLabel);
  toolbar.append(status, controls);
  const canvas = makeElement("div", "dsa-flow-path-canvas loading");
  canvas.dataset.message = state.playbackTimer ? "Graph waits while playback runs" : "Building the path graph";
  canvas.setAttribute("aria-label", "Interactive observed source-line path");
  graphPanel.append(toolbar, canvas);
  body.append(graphPanel);

  const ordered = makeElement("ol", "dsa-flow-transition-list");
  windowed.entries.forEach(({ step, index }, entryIndex) => {
    const from = entryIndex > 0 ? windowed.entries[entryIndex - 1].step : null;
    const item = makeElement("li", index === state.currentStep ? "current" : "");
    if (index === state.currentStep) item.setAttribute("aria-current", "step");
    const stepLabel = makeElement("span", "dsa-flow-transition-step", String(index + 1).padStart(2, "0"));
    const copy = makeElement("div", "dsa-flow-transition-copy");
    copy.append(makeElement("strong", "", from ? `Line ${from.line} → line ${step.line}` : `Window starts at line ${step.line}`));
    copy.append(makeElement("code", "", step.source.trim()));
    item.append(stepLabel, copy);
    ordered.append(item);
  });
  body.append(ordered);

  const summary = makeElement("section", "dsa-flow-line-frequency");
  summary.append(makeElement("h3", "", "Visits through the selected boundary"));
  const chips = makeElement("div", "dsa-line-counts");
  [...counts.entries()].sort((left, right) => left[0] - right[0]).forEach(([line, count]) => {
    chips.append(makeElement("span", "", `Line ${line}: ${count}`));
  });
  summary.append(chips);
  body.append(summary);
  if (windowed.shortened) {
    body.append(makeElement("p", "dsa-flow-boundary", `Algorithm Path shows at most ${LIMITS.algorithmPathSteps} recorded steps around the selected boundary. This display limit does not delete the trace.`));
  }
  els.dsaViewStage.replaceChildren(article);
  if (!state.playbackTimer && windowed.entries.length > 1) {
    enhanceAlgorithmPathGraph(canvas, windowed.entries, { fit, slider, output, status });
  }
}

/** Renders a debugger-style table whose active row follows playback. */
function renderStepTable() {
  const events = observedEventsForTrace();
  if (!events.length) {
    renderFlowUnavailable({
      viewId: "table",
      glyph: "▦",
      title: "Step Table",
      question: "What evidence belongs to each recorded step?",
      reason: "Run a trace to compare lines, events, and changed names in one debugger table.",
      steps: [
        "Run a program to record steps.",
        "Move playback or use the timeline.",
        "Find the row marked Current step.",
      ],
    });
    return;
  }
  const windowed = boundedFlowWindow(events, state.currentStep, LIMITS.stepTableRows);
  const evidenceKeys = ["observed"];
  if (windowed.shortened) evidenceKeys.push("shortened");
  const current = events[state.currentStep];
  const { article, body: flowBody } = createFlowViewShell({
    viewId: "table",
    title: "Step Table",
    question: "What evidence belongs to each recorded step?",
    evidenceKeys,
    extraFacts: [
      ["Current event", current.event.type.replaceAll("_", " ")],
      ["Rows shown", `${windowed.entries.length} of ${events.length}`],
    ],
  });

  const tableIntro = makeElement("section", "dsa-flow-table-intro");
  tableIntro.append(makeElement("strong", "", "The highlighted row is controlled by playback."));
  tableIntro.append(makeElement("p", "", "Use Previous, Next, Play, Restart, or the timeline. The table keeps the current row inside the bounded window."));
  flowBody.append(tableIntro);

  const tableWrap = makeElement("div", "dsa-table-wrap");
  const table = document.createElement("table");
  table.className = "dsa-step-table";
  table.setAttribute("aria-label", "Recorded DSA execution steps");
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["Step", "Line", "Event cue", "Changed names", "Executed source"].forEach((label) => {
    const heading = makeElement("th", "", label);
    heading.scope = "col";
    headRow.append(heading);
  });
  head.append(headRow);
  const body = document.createElement("tbody");
  windowed.entries.forEach(({ step, event, changes, index }) => {
    const row = document.createElement("tr");
    const isCurrent = index === state.currentStep;
    if (isCurrent) {
      row.className = "current";
      row.setAttribute("aria-current", "true");
    }
    /*
      The visible label keeps the selected row understandable without relying
      on its mint border or background. Other cells retain the existing table contract.
    */
    const stepCell = makeElement("td", "dsa-step-number", String(index + 1));
    if (isCurrent) {
      stepCell.append(makeElement("span", "dsa-current-step-label", "Current step"));
    }
    row.append(stepCell);
    [step.line, event.type.replaceAll("_", " "), changes.map((change) => change.name).join(", ") || "none"]
      .forEach((value) => row.append(makeElement("td", "", String(value))));
    row.append(makeElement("td", "dsa-step-source", step.source.trim()));
    body.append(row);
  });
  table.append(head, body);
  tableWrap.append(table);
  flowBody.append(tableWrap);
  if (windowed.shortened) {
    flowBody.append(makeElement("p", "dsa-flow-boundary", `Step Table shows at most ${LIMITS.stepTableRows} rows while keeping the selected row visible. Playback still reaches every recorded step.`));
  }
  els.dsaViewStage.replaceChildren(article);
  window.requestAnimationFrame(() => {
    const currentRow = tableWrap.querySelector('tr[aria-current="true"]');
    currentRow?.scrollIntoView({ block: "nearest", inline: "nearest" });
  });
}

/** Separates one-run measurements from reviewed asymptotic growth context. */
function renderComplexityLab() {
  if (!state.trace.length) {
    renderFlowUnavailable({
      viewId: "complexity",
      glyph: "O",
      title: "Complexity Lab",
      question: "What happened in this run, and what does the reviewed Big O claim mean?",
      reason: "Run a trace to count observed events without pretending one run proves Big O.",
      steps: [
        "Run a reviewed example for observed counts and reviewed context.",
        "Move playback to see counts accumulate through the selected step.",
        "Change the source to confirm reviewed Big O disappears.",
      ],
    });
    return;
  }
  const prefix = state.trace.slice(0, state.currentStep + 1);
  const events = prefix.map((step, index) => classifyDsaEvent(step, variableChanges(prefix[index - 1] || null, step)));
  const counts = new Map();
  events.forEach((event) => counts.set(event.type, (counts.get(event.type) || 0) + 1));
  const evidenceKeys = ["observed"];
  if (state.activeProgram) evidenceKeys.push("curriculum");
  else evidenceKeys.push("unavailable");
  const { article, body } = createFlowViewShell({
    viewId: "complexity",
    title: "Complexity Lab",
    question: "What happened in this run, and what does the reviewed Big O claim mean?",
    evidenceKeys,
    extraFacts: [["Measured range", `Steps 1 through ${state.currentStep + 1}`]],
  });

  const observed = makeElement("section", "dsa-flow-complexity-panel observed");
  observed.append(evidenceBadge("observed"));
  observed.append(makeElement("h3", "", "Observed through this playback step"));
  const metrics = makeElement("div", "dsa-flow-metric-grid");
  [
    [String(prefix.length), "recorded steps"],
    [String(new Set(prefix.map((step) => step.line)).size), "reached source lines"],
    [String(counts.size), "event cue types"],
  ].forEach(([value, label]) => {
    const metric = makeElement("div", "dsa-flow-metric");
    metric.append(makeElement("strong", "", value));
    metric.append(makeElement("span", "", label));
    metrics.append(metric);
  });
  observed.append(metrics);

  const bars = makeElement("div", "dsa-flow-event-bars");
  const sortedCounts = [...counts.entries()].sort((left, right) => right[1] - left[1]);
  const maximum = Math.max(...sortedCounts.map((entry) => entry[1]), 1);
  sortedCounts.forEach(([name, count]) => {
    const row = makeElement("div", "dsa-flow-event-bar");
    const label = makeElement("span", "", name.replaceAll("_", " "));
    const track = makeElement("span", "dsa-flow-event-track");
    const fill = makeElement("span", "dsa-flow-event-fill");
    fill.style.setProperty("--event-share", `${(count / maximum) * 100}%`);
    track.append(fill);
    const value = makeElement("strong", "", String(count));
    row.setAttribute(
      "aria-label",
      `${name.replaceAll("_", " ")} observed ${count} ${count === 1 ? "time" : "times"} through selected step`,
    );
    row.append(label, track, value);
    bars.append(row);
  });
  observed.append(bars);
  observed.append(makeElement("p", "dsa-flow-boundary", "These counts describe one recorded run and one playback prefix. They are not wall-clock timings and do not prove an asymptotic growth class."));
  body.append(observed);

  if (state.activeProgram) {
    const context = makeElement("section", "dsa-flow-complexity-panel curriculum");
    context.append(evidenceBadge("curriculum"));
    context.append(makeElement("h3", "", "Reviewed growth context"));
    const formulas = makeElement("div", "dsa-flow-complexity-formulas");
    [
      ["TIME", state.activeProgram.complexity.time, "How the reviewed work grows as input size grows."],
      ["SPACE", state.activeProgram.complexity.space, "How the reviewed extra storage grows as input size grows."],
    ].forEach(([label, formula, explanation]) => {
      const card = makeElement("div", "dsa-flow-complexity-formula");
      card.append(makeElement("span", "", label));
      card.append(makeElement("strong", "", formula));
      card.append(makeElement("p", "", explanation));
      formulas.append(card);
    });
    context.append(formulas);
    context.append(makeElement("p", "dsa-honesty-note", state.activeProgram.complexity.note));
    context.append(makeElement("p", "dsa-flow-boundary", "This Big O statement belongs to the exact unchanged reviewed program. It is curriculum context, not a measurement produced from the event bars."));
    body.append(context);
  } else {
    const unavailable = makeElement("section", "dsa-flow-complexity-panel unavailable");
    unavailable.append(evidenceBadge("unavailable"));
    unavailable.append(makeElement("h3", "", "Reviewed Big O unavailable"));
    unavailable.append(makeElement("p", "", "A Big O classification is unavailable for arbitrary pasted code. One recorded run cannot prove a general growth class."));
    body.append(unavailable);
  }
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Builds the common experiment-notebook header for the three Labs views.
 *
 * Labs help a learner change one controlled condition and inspect the next
 * run. Their orientation therefore names the experiment and its local state
 * without pretending that configuration data is observed runtime evidence.
 *
 * @param {object} options Labs-view presentation options.
 * @param {string} options.viewId Stable view id used by scoped CSS.
 * @param {string} options.title Learner-facing view title.
 * @param {string} options.question Plain-language experiment question.
 * @param {string} options.description Short explanation of the workflow.
 * @param {Array<string>} [options.evidenceKeys] Honest evidence badges.
 * @param {Array<Array<string>>} [options.facts] Bounded context facts.
 * @returns {{article: HTMLElement, body: HTMLElement}} Shell and content mount.
 */
function createLabsViewShell({
  viewId,
  title,
  question,
  description,
  evidenceKeys = [],
  facts = [],
}) {
  const article = makeElement("article", `dsa-runtime-view dsa-labs-view dsa-labs-${viewId}`);
  const hero = makeElement("header", "dsa-labs-hero");
  const identity = makeElement("div", "dsa-labs-identity");
  const eyebrow = makeElement("div", "dsa-labs-eyebrow");
  evidenceKeys.forEach((key) => eyebrow.append(evidenceBadge(key)));
  eyebrow.append(makeElement("span", "", `LABS / ${title.toUpperCase()}`));
  identity.append(eyebrow);
  identity.append(makeElement("h2", "", title));
  identity.append(makeElement("p", "dsa-labs-question", question));
  identity.append(makeElement("p", "dsa-labs-description", description));
  hero.append(identity);

  const context = makeElement("section", "dsa-labs-context");
  [["Program", traceProgramLabel()], ...facts].forEach(([label, value]) => {
    const fact = makeElement("div", "dsa-labs-context-fact");
    fact.append(makeElement("span", "", label));
    fact.append(makeElement("strong", "", value));
    context.append(fact);
  });
  hero.append(context);

  const body = makeElement("div", "dsa-labs-body");
  article.append(hero, body);
  return { article, body };
}

/**
 * Renders a designed Labs state when reviewed or observed evidence is absent.
 *
 * @param {object} options Empty-state content.
 * @param {string} options.viewId Stable view id.
 * @param {string} options.glyph Compact visual mark hidden from screen readers.
 * @param {string} options.title Learner-facing view title.
 * @param {string} options.question Question the view normally answers.
 * @param {string} options.description Brief view purpose.
 * @param {string} options.reason Honest reason the experiment cannot continue.
 * @param {Array<string>} options.steps Safe next actions.
 * @param {{label: string, action: Function}|null} [options.action] Optional contextual action.
 */
function renderLabsUnavailable({
  viewId,
  glyph,
  title,
  question,
  description,
  reason,
  steps,
  action = null,
}) {
  const { article, body } = createLabsViewShell({
    viewId,
    title,
    question,
    description,
    evidenceKeys: ["unavailable"],
  });
  const empty = makeElement("section", "dsa-labs-empty-state");
  const mark = makeElement("span", "dsa-labs-empty-glyph", glyph);
  mark.setAttribute("aria-hidden", "true");
  empty.append(mark);
  empty.append(makeElement("h3", "", reason));
  const list = makeElement("ol", "dsa-labs-next-steps");
  steps.forEach((step) => list.append(makeElement("li", "", step)));
  empty.append(list);
  if (action) {
    const button = makeElement("button", "secondary-button compact", action.label);
    button.type = "button";
    button.addEventListener("click", action.action);
    empty.append(button);
  }
  body.append(empty);
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Converts the stored prepared-input document into its exact response queue.
 *
 * An entirely empty document means that no responses are prepared. Blank lines
 * inside a nonempty document remain real blank responses, so their exact queue
 * positions still reach Python without being filtered or reordered.
 *
 * @param {string} text Complete prepared-input document.
 * @returns {string[]} Exact ordered responses sent to the worker.
 */
function preparedInputQueue(text) {
  const documentText = String(text);
  return documentText === "" ? [] : documentText.split("\n");
}

/**
 * Renders the bounded visual queue without changing the underlying textarea.
 *
 * @param {HTMLElement} mount Queue destination.
 * @param {HTMLElement} summary Live queue summary.
 * @param {string} text Complete prepared-input document.
 */
function renderPreparedInputQueue(mount, summary, text) {
  const values = preparedInputQueue(text);
  const displayed = values.slice(0, LIMITS.preparedInputPreviewRows);
  const list = makeElement("ol", "dsa-input-queue");
  displayed.forEach((value, index) => {
    const item = makeElement("li", "dsa-input-queue-item");
    item.append(makeElement("span", "dsa-input-queue-number", String(index + 1).padStart(2, "0")));
    const copy = makeElement("span", "dsa-input-queue-copy");
    copy.append(makeElement("strong", "", `Response ${index + 1}`));
    copy.append(makeElement("code", "", value || "(blank response)"));
    item.append(copy);
    list.append(item);
  });
  mount.replaceChildren(list);
  if (values.length > displayed.length) {
    mount.append(makeElement(
      "p",
      "dsa-labs-boundary",
      `The queue preview shows the first ${LIMITS.preparedInputPreviewRows} of ${values.length} responses. The complete local queue is still sent to Python in order.`,
    ));
  }
  summary.textContent = `${values.length} ${values.length === 1 ? "response" : "responses"} · ${text.length.toLocaleString()} of ${LIMITS.preparedInputCharacters.toLocaleString()} characters`;
}

/** Renders an ordered local response queue and maps observed input calls to it. */
function renderInputPlayground() {
  const consumed = state.inputLog.length;
  const queueLength = preparedInputQueue(state.preparedInputs).length;
  const evidenceKeys = consumed ? ["observed"] : ["unavailable"];
  const { article, body } = createLabsViewShell({
    viewId: "input",
    title: "Input Playground",
    question: "What will each input() call receive, and in what order?",
    description: "Prepare one response per line, run locally, then compare the queue with prompts Python actually recorded.",
    evidenceKeys,
    facts: [
      ["Prepared queue", `${queueLength} ${queueLength === 1 ? "response" : "responses"}`],
      ["Consumed this run", consumed ? `${consumed} recorded` : "Not recorded yet"],
      ["Persistence", "This browser only"],
    ],
  });

  const workspace = makeElement("div", "dsa-input-workspace");
  const composer = makeElement("section", "dsa-input-composer");
  const composerHeading = makeElement("div", "dsa-labs-section-heading");
  composerHeading.append(makeElement("span", "", "01 / PREPARE"));
  composerHeading.append(makeElement("h3", "", "Write the response queue"));
  composerHeading.append(makeElement("p", "", "Line 1 is returned to the first input() call, line 2 to the second, and so on."));
  composer.append(composerHeading);

  const textareaLabel = makeElement("label", "dsa-input-label");
  textareaLabel.append(makeElement("span", "", "One response per line"));
  const textarea = document.createElement("textarea");
  textarea.className = "dsa-input-textarea";
  textarea.value = state.preparedInputs;
  textarea.placeholder = "first response\nsecond response";
  textarea.maxLength = LIMITS.preparedInputCharacters;
  textarea.setAttribute("aria-describedby", "dsaInputQueueSummary");
  textareaLabel.append(textarea);
  composer.append(textareaLabel);
  const queueSummary = makeElement("p", "dsa-input-queue-summary");
  queueSummary.id = "dsaInputQueueSummary";
  queueSummary.setAttribute("aria-live", "polite");
  composer.append(queueSummary);
  const run = makeElement("button", "primary-button compact", "Run with this exact queue");
  run.type = "button";
  run.disabled = state.running;
  run.addEventListener("click", runCode);
  composer.append(run);
  composer.append(makeElement(
    "p",
    "dsa-labs-privacy-note",
    "Prepared responses are saved only in this browser. They are sent to the local Python worker, not to Code Explorer or an analytics service.",
  ));

  const queuePanel = makeElement("section", "dsa-input-preview-panel");
  const queueHeading = makeElement("div", "dsa-labs-section-heading");
  queueHeading.append(makeElement("span", "", "02 / ORDER"));
  queueHeading.append(makeElement("h3", "", "Response queue"));
  queueHeading.append(makeElement("p", "", "This numbered preview shows the exact order without adding numbers to the values Python receives."));
  queuePanel.append(queueHeading);
  const queueMount = makeElement("div", "dsa-input-queue-mount");
  queuePanel.append(queueMount);
  renderPreparedInputQueue(queueMount, queueSummary, state.preparedInputs);
  const runQueueStatus = makeElement("p", "dsa-input-run-queue-status");
  const updateRunQueueStatus = () => {
    if (!state.trace.length && !state.error) {
      runQueueStatus.textContent = "No latest run exists to compare with this queue.";
      runQueueStatus.className = "dsa-input-run-queue-status unavailable";
    } else if (state.activeRunInputs === state.preparedInputs) {
      runQueueStatus.textContent = "This prepared queue matches the queue sent to the latest run.";
      runQueueStatus.className = "dsa-input-run-queue-status matching";
    } else {
      runQueueStatus.textContent = "The prepared queue changed after the latest run. Run again before treating the prompt map as evidence for these values.";
      runQueueStatus.className = "dsa-input-run-queue-status changed";
    }
  };
  updateRunQueueStatus();
  queuePanel.append(runQueueStatus);

  textarea.addEventListener("input", () => {
    const bounded = textarea.value.slice(0, LIMITS.preparedInputCharacters);
    if (textarea.value !== bounded) textarea.value = bounded;
    state.preparedInputs = bounded;
    writeLocalText(STORAGE_KEYS.preparedInputs, state.preparedInputs);
    renderPreparedInputQueue(queueMount, queueSummary, state.preparedInputs);
    updateRunQueueStatus();
  });
  workspace.append(composer, queuePanel);
  body.append(workspace);

  const observed = makeElement("section", "dsa-input-observed");
  const observedHeading = makeElement("div", "dsa-labs-section-heading");
  observedHeading.append(makeElement("span", "", "03 / OBSERVE"));
  observedHeading.append(makeElement("h3", "", "Prompts consumed in the latest run"));
  observed.append(observedHeading);
  if (state.inputLog.length) {
    const log = makeElement("ol", "dsa-input-consumption-list");
    state.inputLog.forEach((entry, index) => {
      const item = makeElement("li", "dsa-input-consumption");
      item.append(makeElement("span", "dsa-input-consumption-number", String(index + 1).padStart(2, "0")));
      const prompt = makeElement("div", "dsa-input-consumption-copy");
      prompt.append(makeElement("span", "", "PYTHON PROMPT"));
      prompt.append(makeElement("strong", "", entry.prompt || "(input() used no prompt text)"));
      prompt.append(makeElement("span", "", "RETURNED RESPONSE"));
      prompt.append(makeElement("code", "", entry.value || "(blank response)"));
      item.append(prompt);
      log.append(item);
    });
    observed.append(log);
  } else {
    observed.append(makeElement(
      "p",
      "dsa-labs-empty-inline",
      state.trace.length || state.error
        ? "The latest run recorded no successful input() consumption. A missing response can still appear as EOFError in Error Coach."
        : "No run evidence exists yet. Run a program that calls input() to connect its prompts to this queue.",
    ));
  }
  observed.append(makeElement(
    "p",
    "dsa-labs-boundary",
    "Only successful input() calls appear here. Code Explorer does not infer future prompts, and changing the queue does not rewrite the Python source.",
  ));
  body.append(observed);
  els.dsaViewStage.replaceChildren(article);
}

/**
 * Creates a bounded slot for one session-only compatible run summary.
 *
 * @param {object|null} run Captured compatible run or null placeholder.
 * @param {number} index Zero-based comparison slot.
 * @returns {HTMLElement} Run card.
 */
function comparisonRunCard(run, index) {
  const card = makeElement("section", `dsa-comparison-slot ${run ? "filled" : "empty"}`);
  const heading = makeElement("div", "dsa-comparison-slot-heading");
  heading.append(makeElement("span", "", `RUN ${index === 0 ? "A" : "B"}`));
  heading.append(makeElement("strong", "", run?.title || "Waiting for a compatible run"));
  card.append(heading);
  if (!run) {
    card.append(makeElement("p", "", "Load a related reviewed program and run its unchanged source. This slot stays only until the page reloads."));
    return card;
  }
  const metrics = makeElement("div", "dsa-comparison-metrics");
  [
    [String(run.steps), "recorded steps"],
    [String(run.reachedLines), "reached lines"],
    [String(run.consumedInputs), "consumed inputs"],
  ].forEach(([value, label]) => {
    const metric = makeElement("div", "");
    metric.append(makeElement("strong", "", value));
    metric.append(makeElement("span", "", label));
    metrics.append(metric);
  });
  card.append(metrics);
  const details = makeElement("dl", "dsa-comparison-details");
  [
    ["Algorithm", run.algorithm],
    ["Result", run.error || "Completed without a recorded error"],
    ["Prepared queue", `${run.preparedResponses} ${run.preparedResponses === 1 ? "response" : "responses"}`],
  ].forEach(([label, value]) => {
    details.append(makeElement("dt", "", label));
    details.append(makeElement("dd", "", value));
  });
  card.append(details);
  const output = makeElement("div", "dsa-comparison-output");
  output.append(makeElement("span", "", "OBSERVED OUTPUT PREVIEW"));
  output.append(makeElement("pre", "", run.output || "(no output recorded)"));
  card.append(output);
  return card;
}

/** Renders a two-slot comparison desk for exact reviewed compatible programs. */
function renderCompareAlgorithms() {
  if (!state.activeProgram?.comparisonGroup) {
    renderLabsUnavailable({
      viewId: "compare",
      glyph: "A:B",
      title: "Compare Algorithms",
      question: "What changes when two compatible reviewed programs run?",
      description: "Keep two local run summaries side by side without turning one trace count into a universal speed claim.",
      reason: "The current source has no exact reviewed comparison group.",
      steps: [
        "Open the reviewed DSA catalog.",
        "Choose a program whose card recommends Compare Algorithms.",
        "Run two related programs one at a time.",
      ],
      action: { label: "Browse reviewed programs", action: openCatalog },
    });
    return;
  }

  const group = state.activeProgram.comparisonGroup;
  const related = DSA_IMPLEMENTED_PROGRAMS.filter((program) => program.comparisonGroup === group);
  if (related.length < 2) {
    renderLabsUnavailable({
      viewId: "compare",
      glyph: "A:B",
      title: "Compare Algorithms",
      question: "What changes when two compatible reviewed programs run?",
      description: "Keep two local run summaries side by side without turning one trace count into a universal speed claim.",
      reason: "This reviewed group currently contains only one program, so a compatible pair is unavailable.",
      steps: [
        "Open the reviewed DSA catalog.",
        "Search for Compare Algorithms.",
        "Choose a program from a reviewed group with at least two members.",
      ],
      action: { label: "Browse comparison programs", action: openCatalog },
    });
    return;
  }
  const compatibleRuns = state.comparisonRuns.filter((run) => run.group === group);
  const { article, body } = createLabsViewShell({
    viewId: "compare",
    title: "Compare Algorithms",
    question: "What changes when two compatible reviewed programs run?",
    description: "Run related reviewed programs, compare their local evidence, and keep theoretical claims separate from one-session observations.",
    evidenceKeys: ["curriculum", ...(compatibleRuns.length ? ["observed"] : ["unavailable"])],
    facts: [
      ["Reviewed group", group],
      ["Related programs", String(related.length)],
      ["Session slots", `${compatibleRuns.length} of ${LIMITS.comparisonRuns}`],
    ],
  });

  const route = makeElement("section", "dsa-comparison-route");
  const routeHeading = makeElement("div", "dsa-labs-section-heading");
  routeHeading.append(makeElement("span", "", "01 / CHOOSE"));
  routeHeading.append(makeElement("h3", "", "Compatible reviewed programs"));
  routeHeading.append(makeElement("p", "", "Loading a program replaces the complete editor with that reviewed source after your deliberate click."));
  route.append(routeHeading);
  const programs = makeElement("div", "dsa-related-programs dsa-comparison-programs");
  related.forEach((program) => {
    const button = makeElement("button", program.id === state.activeProgram.id ? "active" : "");
    button.type = "button";
    const label = makeElement("span", "");
    label.append(makeElement("small", "", program.id.toUpperCase()));
    label.append(makeElement("strong", "", program.title));
    label.append(makeElement("span", "", `${program.complexity.time} time · ${program.complexity.space} space`));
    button.append(label);
    if (program.id === state.activeProgram.id) {
      button.append(makeElement("em", "", "CURRENT SOURCE"));
    } else {
      button.append(makeElement("em", "", "LOAD PROGRAM"));
    }
    button.addEventListener("click", () => loadProgram(program));
    programs.append(button);
  });
  route.append(programs);
  body.append(route);

  const desk = makeElement("section", "dsa-comparison-desk");
  const deskHeading = makeElement("div", "dsa-labs-section-heading");
  deskHeading.append(makeElement("span", "", "02 / COMPARE"));
  deskHeading.append(makeElement("h3", "", "Two session-only run slots"));
  deskHeading.append(makeElement("p", "", "The newest two compatible runs appear here. Reloading the page clears them."));
  desk.append(deskHeading);
  const slots = makeElement("div", "dsa-comparison-slots");
  [0, 1].forEach((index) => slots.append(comparisonRunCard(compatibleRuns[index] || null, index)));
  desk.append(slots);

  if (compatibleRuns.length === LIMITS.comparisonRuns) {
    const [runA, runB] = compatibleRuns;
    const assessment = makeElement("div", "dsa-comparison-assessment");
    assessment.append(makeElement("span", "", "FAIRNESS CHECK"));
    assessment.append(makeElement(
      "strong",
      "",
      runA.preparedInputText === runB.preparedInputText
        ? "Prepared response text matches"
        : "Prepared response text differs",
    ));
    assessment.append(makeElement(
      "p",
      "",
      runA.preparedInputText === runB.preparedInputText
        ? "The prepared queue matches, but either program may still define different data directly in its source."
        : "Different prepared queues make the observed step totals unsuitable for a like-for-like comparison.",
    ));
    const difference = Math.abs(runA.steps - runB.steps);
    assessment.append(makeElement("p", "", `Observed trace-step difference: ${difference}. This is a recording comparison, not elapsed time and not proof that one algorithm is universally faster.`));
    desk.append(assessment);
  } else {
    desk.append(makeElement("p", "dsa-labs-empty-inline", "Run the current exact reviewed source, then load and run a related program to fill both slots."));
  }
  desk.append(makeElement(
    "p",
    "dsa-labs-boundary",
    `Only ${LIMITS.comparisonRuns} summaries are retained in memory. They are not written to local storage, uploaded, or treated as learner progress.`,
  ));
  body.append(desk);
  els.dsaViewStage.replaceChildren(article);
}

/** Renders reviewed edge cases as prediction-first experiments, never tasks. */
function renderEdgeCaseLab() {
  if (!state.activeProgram) {
    renderLabsUnavailable({
      viewId: "edge",
      glyph: "±",
      title: "Edge Case Lab",
      question: "What boundary could challenge this reviewed program?",
      description: "Predict first, change one condition, run again, and inspect evidence without recorded completion tracking.",
      reason: "Reviewed edge-case context is unavailable for edited or pasted source.",
      steps: [
        "Open the reviewed DSA catalog.",
        "Choose the original program you want to investigate.",
        "Read its boundary questions before changing the source.",
      ],
      action: { label: "Browse reviewed programs", action: openCatalog },
    });
    return;
  }

  const cases = state.activeProgram.edgeCases.length
    ? state.activeProgram.edgeCases
    : ["Use the smallest meaningful input and predict whether the documented result still holds."];
  const { article, body } = createLabsViewShell({
    viewId: "edge",
    title: "Edge Case Lab",
    question: "What boundary could challenge this reviewed program?",
    description: "Use reviewed questions as experiment prompts. Code Explorer supplies a method, not a hidden answer or progress score.",
    evidenceKeys: ["curriculum"],
    facts: [
      ["Reviewed cases", String(cases.length)],
      ["Recommended views", state.activeProgram.bestViews.slice(0, 3).join(", ")],
      ["Attempt tracking", "None"],
    ],
  });

  const method = makeElement("section", "dsa-edge-method");
  const methodHeading = makeElement("div", "dsa-labs-section-heading");
  methodHeading.append(makeElement("span", "", "EXPERIMENT METHOD"));
  methodHeading.append(makeElement("h3", "", "Change one thing at a time"));
  methodHeading.append(makeElement("p", "", "A small controlled change makes the cause of a different trace easier to understand."));
  method.append(methodHeading);
  const methodSteps = makeElement("ol", "dsa-edge-method-steps");
  [
    ["Predict", "Say what output, path, or invariant you expect before editing."],
    ["Change", "Modify the smallest input value or source constant related to the case."],
    ["Run", "Record a fresh trace. The earlier trace is invalid once source changes."],
    ["Inspect", `Start with ${state.activeProgram.bestViews.slice(0, 3).join(", ")}.`],
  ].forEach(([label, text]) => {
    const item = makeElement("li", "");
    item.append(makeElement("strong", "", label));
    item.append(makeElement("span", "", text));
    methodSteps.append(item);
  });
  method.append(methodSteps);
  const focus = makeElement("button", "secondary-button compact", "Focus the source editor");
  focus.type = "button";
  focus.addEventListener("click", () => state.editor.focus());
  method.append(focus);
  body.append(method);

  const experiments = makeElement("section", "dsa-edge-experiments");
  const experimentsHeading = makeElement("div", "dsa-labs-section-heading");
  experimentsHeading.append(makeElement("span", "", "REVIEWED QUESTIONS"));
  experimentsHeading.append(makeElement("h3", "", "Choose one boundary to investigate"));
  experiments.append(experimentsHeading);
  const cards = makeElement("ol", "dsa-edge-card-list");
  cases.forEach((edgeCase, index) => {
    const item = makeElement("li", "dsa-edge-experiment-card");
    const number = makeElement("span", "dsa-edge-experiment-number", String(index + 1).padStart(2, "0"));
    const copy = makeElement("div", "dsa-edge-experiment-copy");
    copy.append(makeElement("span", "", "PREDICT BEFORE RUNNING"));
    copy.append(makeElement("strong", "", edgeCase));
    copy.append(makeElement("p", "", "Write your prediction somewhere you control, then make one focused change in the editor."));
    item.append(number, copy);
    cards.append(item);
  });
  experiments.append(cards);
  experiments.append(makeElement(
    "p",
    "dsa-labs-boundary",
    "These are reviewed investigation prompts, not automatic tests. Code Explorer does not record which prompt you attempted, whether you finished it, or whether your prediction was correct.",
  ));
  body.append(experiments);
  els.dsaViewStage.replaceChildren(article);
}

/** Routes the active view id to one bounded renderer. */
function renderActiveView() {
  // Cytoscape owns canvas resources, so leaving either graph view releases its instance.
  if (state.activeView !== "references" && state.referenceGraph) disposeReferenceGraph();
  if (state.activeView !== "algorithm-path" && state.algorithmPathGraph) disposeAlgorithmPathGraph();
  const renderers = {
    "algorithm-story": renderAlgorithmStory,
    "before-after": renderBeforeAfter,
    decisions: renderDecisions,
    "calls-recursion": renderCalls,
    "error-coach": renderErrorCoach,
    variables: renderVariables,
    watches: renderWatches,
    "structure-canvas": renderStructureCanvas,
    references: renderReferences,
    "mutation-explorer": renderMutationExplorer,
    "invariant-checker": renderInvariantChecker,
    "operation-journey": renderOperationJourney,
    "algorithm-path": renderAlgorithmPath,
    "step-table": renderStepTable,
    "complexity-lab": renderComplexityLab,
    "input-playground": renderInputPlayground,
    "compare-algorithms": renderCompareAlgorithms,
    "edge-case-lab": renderEdgeCaseLab,
  };
  renderers[state.activeView]();
}

/** Updates selected-step controls and rerenders all step-dependent surfaces. */
function selectStep(index) {
  if (!state.trace.length) return;
  state.currentStep = Math.max(0, Math.min(Number(index), state.trace.length - 1));
  updatePlaybackControls();
  renderActiveView();
  renderConsole();
}

/** Synchronizes playback buttons, range, percentage, and step label. */
function updatePlaybackControls() {
  const hasTrace = state.trace.length > 0;
  const max = Math.max(0, state.trace.length - 1);
  els.dsaPreviousButton.disabled = !hasTrace || state.currentStep === 0;
  els.dsaNextButton.disabled = !hasTrace || state.currentStep >= max;
  els.dsaRestartButton.disabled = !hasTrace;
  els.dsaPlayButton.disabled = !hasTrace || state.trace.length < 2;
  els.dsaTimeline.disabled = !hasTrace;
  els.dsaTimeline.max = String(max);
  els.dsaTimeline.value = String(hasTrace ? state.currentStep : 0);
  const progress = hasTrace && max ? Math.round((state.currentStep / max) * 100) : 0;
  els.dsaProgressLabel.textContent = `${progress}%`;
  els.dsaStepCount.textContent = hasTrace
    ? `STEP ${String(state.currentStep + 1).padStart(2, "0")} / ${String(state.trace.length).padStart(2, "0")}`
    : "STEP 00 / 00";
}

/** Reconstructs console output exactly as captured at the selected step. */
function renderConsole() {
  const step = selectedStep();
  const output = step?.output || (state.error && !state.trace.length ? state.output : "");
  els.dsaConsoleOutput.textContent = output || "// No output yet";
}

/** Advances through the existing recording at the selected playback speed. */
function togglePlayback() {
  if (state.playbackTimer) {
    stopPlayback();
    return;
  }
  if (state.currentStep >= state.trace.length - 1) selectStep(0);
  const interval = Math.max(LIMITS.playbackMinimumMs, Number(els.dsaSpeedSelect.value) || 520);
  els.dsaPlayButton.textContent = "Ⅱ";
  els.dsaPlayButton.setAttribute("aria-label", "Pause DSA trace");
  state.playbackTimer = window.setInterval(() => {
    if (state.currentStep >= state.trace.length - 1) {
      stopPlayback();
      return;
    }
    selectStep(state.currentStep + 1);
  }, interval);
}

/** Maps the shared learner-facing detail names to worker note levels. */
const DSA_COMMENT_LEVELS = Object.freeze({
  essential: 1,
  guided: 2,
  detailed: 3,
});

/**
 * Returns the selected safe DSA comment density.
 *
 * @returns {"essential"|"guided"|"detailed"} Validated detail name.
 */
function selectedDsaCommentDetail() {
  const detail = els.dsaCommentDetail?.value;
  return Object.hasOwn(DSA_COMMENT_LEVELS, detail) ? detail : "guided";
}

/** Builds the complete generated study copy for the current source and evidence. */
function currentCommentedSource() {
  const detail = selectedDsaCommentDetail();
  return buildDsaCommentedSource(
    state.editor.getCode(),
    state.learningComments,
    state.activeProgram,
    DSA_COMMENT_LEVELS[detail],
  );
}

/** Python keywords receive a familiar IDE color in both DSA study surfaces. */
const DSA_PREVIEW_KEYWORDS = new Set([
  "and", "as", "assert", "async", "await", "break", "class", "continue", "def", "del",
  "elif", "else", "except", "finally", "for", "from", "global", "if", "import", "in",
  "is", "lambda", "nonlocal", "not", "or", "pass", "raise", "return", "try", "while",
  "with", "yield",
]);

/** Common Python constants remain visually distinct from ordinary variable names. */
const DSA_PREVIEW_CONSTANTS = new Set(["True", "False", "None"]);

/**
 * Appends safe, presentation-only syntax spans for one exact Python line.
 *
 * This conservative tokenizer improves scanning but does not parse, validate,
 * execute, copy, or transform Python. Unmatched characters remain text nodes.
 *
 * @param {HTMLElement} container Code row receiving safe text and token spans.
 * @param {string} line Exact generated document line.
 * @returns {void}
 */
function appendDsaPreviewTokens(container, line) {
  const tokenPattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#[^\n]*|\b[A-Za-z_]\w*\b|\b\d+(?:\.\d+)?\b|(?:\*\*|\/\/|==|!=|<=|>=|:=|->|[+\-*/%=<>!&|^~:]))/g;
  let cursor = 0;
  for (const match of line.matchAll(tokenPattern)) {
    const token = match[0];
    const start = match.index || 0;
    if (start > cursor) container.append(document.createTextNode(line.slice(cursor, start)));
    const span = document.createElement("span");
    const followingText = line.slice(start + token.length);
    if (token.startsWith("#")) span.className = "learning-token-comment";
    else if (token.startsWith("\"") || token.startsWith("'")) span.className = "learning-token-string";
    else if (/^\d/.test(token)) span.className = "learning-token-number";
    else if (DSA_PREVIEW_KEYWORDS.has(token)) span.className = "learning-token-keyword";
    else if (DSA_PREVIEW_CONSTANTS.has(token)) span.className = "learning-token-constant";
    else if (/^\s*\(/.test(followingText)) span.className = "learning-token-function";
    else if (/^(?:\*\*|\/\/|==|!=|<=|>=|:=|->|[+\-*/%=<>!&|^~:])$/.test(token)) span.className = "learning-token-operator";
    else span.className = "learning-token-name";
    span.textContent = token;
    container.append(span);
    cursor = start + token.length;
    if (token.startsWith("#")) break;
  }
  if (cursor < line.length) container.append(document.createTextNode(line.slice(cursor)));
  if (!line.length) container.append(document.createTextNode(" "));
}

/**
 * Renders one generated DSA study document as a safe, line-numbered IDE view.
 *
 * Visual chrome and syntax spans remain outside `currentCommentedSource()`.
 * Copy and Replace therefore continue using the exact plain generated document.
 *
 * @param {string} source Complete generated study source.
 * @param {HTMLElement|null} target Scrollable preview document.
 * @param {HTMLElement|null} lineCountTarget Presentation-only line counter.
 * @returns {void}
 */
function renderDsaStudyPreview(source, target, lineCountTarget) {
  if (!target) return;
  const fragment = document.createDocumentFragment();
  const lines = source.split("\n");
  lines.forEach((line, index) => {
    const row = document.createElement("div");
    row.className = "learning-preview-row";
    row.style.setProperty("--learning-preview-line", `"${index + 1}"`);
    row.setAttribute("aria-label", `Line ${index + 1}: ${line || "blank"}`);
    const content = document.createElement("code");
    content.className = "learning-preview-code";
    const trimmed = line.trimStart();
    if (trimmed.startsWith(DSA_COMMENT_PREFIX)) {
      row.classList.add("trace-note");
      content.append(document.createTextNode(line.slice(0, line.length - trimmed.length)));
      const prefix = document.createElement("span");
      prefix.className = "learning-preview-note-prefix";
      prefix.textContent = DSA_COMMENT_PREFIX;
      const message = document.createElement("span");
      message.className = "learning-preview-note-message";
      const noteMessage = trimmed.slice(DSA_COMMENT_PREFIX.length).trimStart();
      /*
        Only the three generated preamble labels are reviewed curriculum context.
        Runtime and syntax notes retain the ordinary evidence style.
      */
      if (/^(Reviewed program:|Objective:|Reviewed time:)/.test(noteMessage)) {
        row.classList.add("curriculum-note");
      }
      message.textContent = noteMessage;
      content.append(prefix, message);
    } else {
      appendDsaPreviewTokens(content, line);
    }
    row.append(content);
    fragment.append(row);
  });
  target.replaceChildren(fragment);
  if (lineCountTarget) {
    lineCountTarget.textContent = `${lines.length} line${lines.length === 1 ? "" : "s"}`;
  }
}

/**
 * Refreshes the DSA evidence summary for the selected detail level.
 *
 * The summary says exactly when reviewed context is available. Edited or pasted
 * code never inherits a catalog algorithm claim from a formerly selected card.
 *
 * @returns {void}
 */
function renderDsaCommentsSummary() {
  if (!els.dsaCommentsSummary) return;
  const detail = selectedDsaCommentDetail();
  const maximumLevel = DSA_COMMENT_LEVELS[detail];
  const noteCount = state.learningComments.filter((note) => (
    Number.isInteger(note.level) && note.level <= maximumLevel
  )).length;
  const noteLabel = `${noteCount} ${detail} Python note${noteCount === 1 ? "" : "s"}`;
  els.dsaCommentsSummary.textContent = state.activeProgram
    ? `${noteLabel} plus 3 exact reviewed curriculum notes.`
    : `${noteLabel}. Curriculum context is unavailable for edited or pasted code.`;
}

/** Shows or hides the read-only automatic-comment surface. */
function renderAutomaticComments() {
  const available = state.learningComments.length > 0;
  if (!available) state.automaticCommentsVisible = false;
  els.dsaAutomaticCommentsButton.disabled = !available;
  els.dsaLearningCommentsButton.disabled = !available;
  els.dsaAutomaticCommentsButton.textContent = state.automaticCommentsVisible
    ? "Automatic comments on"
    : "Automatic comments off";
  els.dsaAutomaticCommentsButton.setAttribute("aria-pressed", String(state.automaticCommentsVisible));
  els.dsaAutomaticPreview.classList.toggle("hidden", !state.automaticCommentsVisible);
  els.dsaEditor.classList.toggle("hidden", state.automaticCommentsVisible);
  if (state.automaticCommentsVisible) {
    renderDsaStudyPreview(
      currentCommentedSource(),
      els.dsaAutomaticPreviewDocument,
      els.dsaAutomaticLineCount,
    );
  } else {
    els.dsaAutomaticPreviewDocument.replaceChildren();
    els.dsaAutomaticLineCount.textContent = "0 lines";
  }
  renderDsaCommentsSummary();
}

/** Toggles visual study comments without changing the editor document. */
function toggleAutomaticComments() {
  if (!state.learningComments.length) return;
  state.automaticCommentsVisible = !state.automaticCommentsVisible;
  renderAutomaticComments();
}

/** Opens the read-only study-copy dialog from current evidence. */
function openCommentsDialog() {
  if (!state.learningComments.length) return;
  renderDsaCommentsSummary();
  renderDsaStudyPreview(
    currentCommentedSource(),
    els.dsaCommentPreview,
    els.dsaCommentLineCount,
  );
  els.dsaCommentsDialog.showModal();
}

/** Copies the generated complete document after a direct click. */
async function copyCommentedSource() {
  await copyText(currentCommentedSource(), "Copied the complete commented study program.");
}

/** Replaces source only after a separate explicit confirmation. */
function replaceWithCommentedSource() {
  const confirmed = window.confirm(
    "Replace the complete editor with the generated commented study copy?\n\nYour current source is locally saved, but this action changes the editor document and clears the old trace.",
  );
  if (!confirmed) return;
  replaceEditorSource(currentCommentedSource());
  els.dsaCommentsDialog.close();
  showToast("The editor now contains the commented study copy.");
}

/** Renders vertical section filters with exact counts. */
function renderCatalogFilters() {
  const filters = [
    ["All programs", DSA_IMPLEMENTED_PROGRAMS.filter(programMatchesSearch).length],
    ...DSA_IMPLEMENTED_SECTIONS.map(([name]) => [
      name,
      DSA_IMPLEMENTED_PROGRAMS.filter((program) => (
        program.section === name && programMatchesSearch(program)
      )).length,
    ]),
  ];
  els.dsaExampleFilters.replaceChildren(
    ...filters.map(([name, count], index) => {
      const button = makeElement("button", `example-filter ${state.activeFilter === name ? "active" : ""}`);
      button.type = "button";
      button.setAttribute("aria-pressed", String(state.activeFilter === name));
      button.setAttribute("aria-label", `${name}, ${count} program${count === 1 ? "" : "s"}`);
      const label = makeElement("span", "", name === "All programs" ? name : `${String(index).padStart(2, "0")} ${name}`);
      const badge = makeElement("span", "example-filter-count", String(count));
      button.append(label, badge);
      button.addEventListener("click", () => {
        state.activeFilter = name;
        state.previewProgramId = "";
        els.dsaExampleBrowserBody.classList.remove("mobile-preview-open");
        renderCatalogFilters();
        renderCatalogPrograms();
        els.dsaExampleGrid.scrollTop = 0;
      });
      return button;
    }),
  );
}

/**
 * Tests a reviewed DSA record against every word in the temporary search.
 *
 * @param {object} program Immutable program from the implemented DSA catalog.
 * @returns {boolean} Whether its complete reviewed record matches the query.
 */
function programMatchesSearch(program) {
  return matchesCatalogSearch(
    DSA_PROGRAM_SEARCH_INDEX.get(program) || "",
    state.searchQuery,
  );
}

/**
 * Creates a clear, recoverable result instead of presenting an empty card grid.
 *
 * @returns {HTMLElement} Accessible empty-result panel with a local reset action.
 */
function createCatalogSearchEmptyState() {
  const empty = makeElement("section", "example-search-empty");
  empty.append(makeElement("h3", "", "No programs matched"));
  empty.append(makeElement(
    "p",
    "",
    "Try fewer words or search another concept. The current section and search are applied together.",
  ));
  const clear = makeElement("button", "secondary-button compact", "Clear search");
  clear.type = "button";
  clear.addEventListener("click", () => {
    state.searchQuery = "";
    els.dsaExampleSearchInput.value = "";
    renderCatalogFilters();
    renderCatalogPrograms();
    els.dsaExampleSearchInput.focus();
  });
  empty.append(clear);
  return empty;
}

/**
 * Adds one reviewed metadata group to the DSA program preview.
 *
 * @param {HTMLElement} mount Preview destination.
 * @param {string} label Visible group heading.
 * @param {string[]} values Reviewed values.
 */
function appendDsaPreviewGroup(mount, label, values) {
  if (!values.length) return;
  const group = makeElement("section", "example-preview-group");
  group.append(makeElement("h4", "", label));
  const list = makeElement("ul", "");
  values.forEach((value) => list.append(makeElement("li", "", value)));
  group.append(list);
  mount.append(group);
}

/**
 * Builds a read-only IDE presentation for exact reviewed DSA Python source.
 *
 * The preview reuses the safe conservative syntax tokenizer from Learning
 * comments. Visual line numbers and chrome remain separate from `program.code`,
 * which is the only string the explicit Open action can place in the editor.
 *
 * @param {string} source Exact immutable curriculum source.
 * @returns {HTMLElement} Theme-aware, line-numbered source preview.
 */
function createDsaExampleSourceEditor(source) {
  const editor = makeElement("div", "example-source-editor");
  editor.setAttribute("role", "region");
  editor.setAttribute("aria-label", "Read-only DSA Python source preview");

  const chrome = makeElement("div", "learning-comments-editor-chrome");
  chrome.setAttribute("aria-hidden", "true");
  const lights = makeElement("span", "learning-editor-lights");
  lights.append(makeElement("i", ""), makeElement("i", ""), makeElement("i", ""));
  const tab = makeElement("span", "learning-editor-tab");
  tab.append(
    makeElement("b", "", "PY"),
    document.createTextNode(" main.py "),
    makeElement("em", "", "reviewed DSA source"),
  );
  chrome.append(lights, tab, makeElement("span", "learning-editor-mode", "Read only"));

  const documentView = makeElement("div", "learning-comments-preview example-source-document");
  documentView.tabIndex = 0;
  const lines = source.split("\n");
  // The IDE surface grows with useful source depth and stops before a long
  // algorithm can push the remaining curriculum context out of reach.
  editor.style.height = `${Math.min(420, Math.max(180, 102 + (lines.length * 27)))}px`;
  lines.forEach((line, index) => {
    const row = makeElement("div", "learning-preview-row");
    row.style.setProperty("--learning-preview-line", `"${index + 1}"`);
    row.setAttribute("aria-label", `Line ${index + 1}: ${line || "blank"}`);
    const content = makeElement("code", "learning-preview-code");
    appendDsaPreviewTokens(content, line);
    // Source rows retain height through CSS, so the generated-comment
    // tokenizer's blank-line placeholder is unnecessary and is removed here.
    if (!line.length) content.replaceChildren();
    row.append(content);
    documentView.append(row);
  });

  const status = makeElement("div", "learning-comments-status example-source-status");
  status.setAttribute("aria-hidden", "true");
  ["Python 3", `${lines.length} line${lines.length === 1 ? "" : "s"}`, "UTF-8", "LF", "Preview"].forEach((value) => {
    status.append(makeElement("span", "", value));
  });
  editor.append(chrome, documentView, status);
  return editor;
}

/**
 * Renders one complete reviewed DSA record without changing editor source.
 *
 * @param {object} program Selected immutable curriculum record.
 * @param {number} routePosition One-based position in the complete catalog.
 */
function renderDsaProgramPreview(program, routePosition) {
  const preview = makeElement("article", "example-preview-document");
  const back = makeElement("button", "example-preview-back", "← Back to program list");
  back.type = "button";
  back.addEventListener("click", () => {
    els.dsaExampleBrowserBody.classList.remove("mobile-preview-open");
    els.dsaExampleGrid.querySelector(".example-card.active")?.focus();
  });
  preview.append(back);
  preview.append(makeElement(
    "span",
    "example-preview-eyebrow",
    `${program.id.toUpperCase()} · Program ${String(routePosition).padStart(3, "0")} · ${program.algorithm}`,
  ));
  preview.append(makeElement("h3", "", program.title));
  preview.append(makeElement("p", "example-preview-description", program.objective));

  const lineCount = program.code.split("\n").length;
  const facts = makeElement("dl", "example-preview-facts");
  [
    ["Difficulty", program.difficulty],
    ["Section", program.section],
    ["Source", `${lineCount} lines`],
    ["Reviewed context", "Exact catalog source"],
  ].forEach(([label, value]) => {
    const fact = makeElement("div", "");
    fact.append(makeElement("dt", "", label));
    fact.append(makeElement("dd", "", value));
    facts.append(fact);
  });
  preview.append(facts);

  const complexity = makeElement("section", "example-preview-complexity");
  complexity.append(makeElement("h4", "", "Reviewed complexity"));
  const formulas = makeElement("div", "example-preview-complexity-values");
  formulas.append(makeElement("span", "", `Time ${program.complexity.time}`));
  formulas.append(makeElement("span", "", `Space ${program.complexity.space}`));
  complexity.append(formulas);
  complexity.append(makeElement("p", "", program.complexity.note));
  preview.append(complexity);

  appendDsaPreviewGroup(preview, "Recommended before starting", program.prerequisites || []);
  appendDsaPreviewGroup(preview, "Algorithm phases", program.phases || []);
  appendDsaPreviewGroup(preview, "Invariants to question", program.invariants || []);
  appendDsaPreviewGroup(preview, "Edge cases to investigate", program.edgeCases || []);
  appendDsaPreviewGroup(preview, "Structures represented", program.structureTypes || []);
  appendDsaPreviewGroup(preview, "Best learning views", program.bestViews || []);
  if (program.comparisonGroup) {
    appendDsaPreviewGroup(preview, "Comparison group", [program.comparisonGroup]);
  }

  const expected = makeElement("section", "example-preview-expected");
  expected.append(makeElement("h4", "", program.intentionalError ? "Intentional error" : "Expected result marker"));
  expected.append(makeElement(
    "code",
    "",
    program.intentionalError?.type || program.expectedResult || "No separate result marker stored",
  ));
  expected.append(makeElement(
    "p",
    "",
    program.intentionalError
      ? "This reviewed investigation is designed to stop with the named error so Error Coach can explain it."
      : "The complete catalog validator checks this marker against local program output.",
  ));
  preview.append(expected);

  const sourceSection = makeElement("section", "example-preview-source");
  sourceSection.append(makeElement("h4", "", "Read-only source preview"));
  sourceSection.append(makeElement("p", "", "Inspect the complete reviewed program before deliberately loading it."));
  sourceSection.append(createDsaExampleSourceEditor(program.code));
  preview.append(sourceSection);

  const boundary = makeElement(
    "p",
    "example-preview-boundary",
    "Complexity, phases, invariants, and edge cases belong to this exact reviewed source. Editing after loading removes those curriculum claims from runtime views.",
  );
  preview.append(boundary);
  const action = makeElement("button", "primary-button example-preview-open", "Open in DSA workspace");
  action.type = "button";
  action.addEventListener("click", () => loadProgram(program));
  preview.append(action);
  els.dsaExamplePreview.replaceChildren(preview);
  // A program selection is a new reading task, so reset only the preview pane
  // instead of carrying a previous lesson's scroll position into this one.
  els.dsaExamplePreview.scrollTop = 0;
}

/**
 * Selects one DSA record for preview without changing learner source.
 *
 * @param {object} program Reviewed curriculum record.
 * @param {number} routePosition One-based full-catalog position.
 * @param {HTMLButtonElement} card Selected program-list button.
 */
function selectDsaProgramPreview(program, routePosition, card) {
  state.previewProgramId = program.id;
  els.dsaExampleGrid.querySelectorAll(".example-card").forEach((candidate) => {
    const selected = candidate === card;
    candidate.classList.toggle("active", selected);
    candidate.setAttribute("aria-pressed", String(selected));
  });
  renderDsaProgramPreview(program, routePosition);
  els.dsaExampleBrowserBody.classList.add("mobile-preview-open");
}

/**
 * Creates one readable DSA program-list row using reviewed metadata only.
 *
 * @param {object} program Reviewed curriculum record.
 * @param {boolean} selected Whether this row owns the visible preview.
 * @returns {HTMLButtonElement} Non-destructive selection control.
 */
function programCard(program, selected) {
  const button = makeElement("button", `example-card dsa-program-card ${selected ? "active" : ""}`);
  button.type = "button";
  const lineCount = program.code.split("\n").length;
  const routePosition = DSA_IMPLEMENTED_PROGRAMS.indexOf(program) + 1;
  button.setAttribute("aria-pressed", String(selected));
  button.append(makeElement("span", "example-list-sequence", String(routePosition).padStart(3, "0")));
  const copy = makeElement("span", "example-list-copy");
  copy.append(makeElement("span", "example-topic", `${program.id.toUpperCase()} · ${program.algorithm}`));
  copy.append(makeElement("strong", "", program.title));
  copy.append(makeElement("span", "example-list-summary", program.objective));
  button.append(copy);
  button.append(makeElement("span", "example-level", `${program.difficulty} · ${lineCount} lines`));
  button.addEventListener("click", () => selectDsaProgramPreview(program, routePosition, button));
  return button;
}

/** Renders filtered program cards and an accurate visible count. */
function renderCatalogPrograms() {
  const sectionPrograms = state.activeFilter === "All programs"
    ? DSA_IMPLEMENTED_PROGRAMS
    : DSA_IMPLEMENTED_PROGRAMS.filter((program) => program.section === state.activeFilter);
  const visible = sectionPrograms.filter(programMatchesSearch);
  if (!visible.length) {
    state.previewProgramId = "";
    els.dsaExampleGrid.replaceChildren(createCatalogSearchEmptyState());
    els.dsaExamplePreview.replaceChildren();
    els.dsaExampleBrowserBody.classList.remove("mobile-preview-open");
  } else {
    const selected = visible.find((program) => program.id === state.previewProgramId) || visible[0];
    state.previewProgramId = selected.id;
    els.dsaExampleGrid.replaceChildren(...visible.map((program) => programCard(program, program === selected)));
    renderDsaProgramPreview(selected, DSA_IMPLEMENTED_PROGRAMS.indexOf(selected) + 1);
  }
  els.dsaExampleCount.textContent = `Showing ${visible.length} of ${DSA_IMPLEMENTED_PROGRAMS.length}`;
}

/** Opens the implemented catalog without changing source. */
function openCatalog() {
  els.dsaExampleBrowserBody.classList.remove("mobile-preview-open");
  renderCatalogFilters();
  renderCatalogPrograms();
  els.dsaExamplesDialog.showModal();
}

/** Loads one reviewed program and its prepared input after a catalog click. */
function loadProgram(program) {
  state.preparedInputs = (program.preparedInputs || []).join("\n");
  writeLocalText(STORAGE_KEYS.preparedInputs, state.preparedInputs);
  replaceEditorSource(program.code, program);
  state.activeProgram = program;
  if (els.dsaExamplesDialog.open) els.dsaExamplesDialog.close();
  showToast(`Loaded ${program.title}. Run the trace when you are ready.`);
  state.editor.focus();
}

/**
 * Lazily creates the shared bounded Pyodide worker and readiness promise.
 *
 * @returns {Promise<void>} Resolves when the worker reports ready.
 */
function ensureWorker() {
  if (state.worker && state.workerReadyPromise) return state.workerReadyPromise;
  setRuntimeStatus("Loading Python locally", "running");
  state.worker = new Worker("py-worker.js?v=20260728-35", { type: "module" });
  state.workerReadyPromise = new Promise((resolve, reject) => {
    state.workerReadyResolve = resolve;
    state.workerReadyReject = reject;
  });
  state.worker.addEventListener("message", handleWorkerMessage);
  state.worker.addEventListener("error", (event) => {
    state.workerReadyReject?.(new Error(event.message || "Worker failed to initialize."));
    finishRunWithInfrastructureError(event.message || "The Python worker stopped unexpectedly.");
  });
  return state.workerReadyPromise;
}

/** Terminates and forgets a worker after timeout or infrastructure failure. */
function resetWorker() {
  state.worker?.terminate();
  state.worker = null;
  state.workerReadyPromise = null;
  state.workerReadyResolve = null;
  state.workerReadyReject = null;
}

/** Clears the active outer timeout. */
function clearRunTimer() {
  if (state.runTimer) window.clearTimeout(state.runTimer);
  state.runTimer = null;
}

/** Restores controls after any completed or failed run. */
function finishRunningState() {
  clearRunTimer();
  state.running = false;
  els.dsaRunButton.disabled = false;
  els.dsaRunButton.textContent = "Run trace";
}

/** Reports infrastructure failure without discarding the learner source. */
function finishRunWithInfrastructureError(message) {
  finishRunningState();
  resetWorker();
  setRuntimeStatus("Python unavailable", "error");
  showToast(message, true);
}

/** Receives typed worker readiness, result, and failure messages. */
function handleWorkerMessage(event) {
  const message = event.data || {};
  if (message.type === "ready") {
    state.workerReadyResolve?.();
    setRuntimeStatus("Python ready", "ready");
    return;
  }
  if (message.type === "init-error") {
    state.workerReadyReject?.(new Error(message.error));
    finishRunWithInfrastructureError(`Python could not start: ${message.error}`);
    return;
  }
  if (message.runId !== state.runId) return;
  if (message.type === "result") {
    loadRunResult(message.result);
  } else if (message.type === "run-error") {
    finishRunWithInfrastructureError(`Python could not run this program: ${message.error}`);
  }
}

/** Starts one bounded local trace from the complete current document. */
async function runCode() {
  if (state.running) return;
  const source = state.editor.getCode();
  if (!source.trim()) {
    showToast("Add a Python program before running a trace.", true);
    return;
  }

  stopPlayback(false);
  state.running = true;
  state.runId += 1;
  state.activeProgram = matchingProgram(source);
  /*
   * Capture the exact prepared-input document before asynchronous worker work
   * begins. A learner may edit the Input Playground while Python is running;
   * the later comparison summary must describe the queue actually sent.
   */
  state.activeRunInputs = state.preparedInputs;
  state.automaticCommentsVisible = false;
  renderAutomaticComments();
  els.dsaRunButton.disabled = true;
  els.dsaRunButton.textContent = "Running locally";
  setRuntimeStatus("Running locally", "running");

  try {
    await ensureWorker();
  } catch (error) {
    finishRunWithInfrastructureError(`Python could not start: ${error.message}`);
    return;
  }

  const currentRunId = state.runId;
  state.runTimer = window.setTimeout(() => {
    if (!state.running || currentRunId !== state.runId) return;
    finishRunningState();
    resetWorker();
    setRuntimeStatus("30-second limit reached", "error");
    showToast("Execution stopped after 30 seconds. Your source is safe. Reduce the input size or loop work and try again.", true);
  }, LIMITS.executionTimeoutMs);

  state.worker.postMessage({
    type: "run",
    runId: currentRunId,
    source,
    inputs: preparedInputQueue(state.activeRunInputs),
  });
}

/** Loads one complete worker result and initializes replayable evidence. */
function loadRunResult(result) {
  finishRunningState();
  state.trace = result.steps || [];
  state.loops = result.loops || [];
  state.conditions = result.conditions || [];
  state.error = result.error || null;
  state.output = result.output || "";
  state.inputLog = result.inputLog || [];
  state.learningComments = result.learningComments || [];
  state.currentStep = 0;
  setRuntimeStatus("Python ready", "ready");

  if (state.activeProgram?.comparisonGroup) {
    /*
     * Comparison records are bounded, same-session observations. Output is
     * clipped for display safety, and only the exact queue sent to this run is
     * retained so the fairness note can distinguish matching prepared text.
     */
    state.comparisonRuns.push({
      group: state.activeProgram.comparisonGroup,
      title: state.activeProgram.title,
      algorithm: state.activeProgram.algorithm,
      steps: state.trace.length,
      reachedLines: new Set(state.trace.map((step) => step.line)).size,
      consumedInputs: state.inputLog.length,
      preparedResponses: preparedInputQueue(state.activeRunInputs).length,
      preparedInputText: state.activeRunInputs,
      output: state.output.slice(0, LIMITS.comparisonOutputCharacters),
      error: state.error?.type || "",
    });
    state.comparisonRuns = state.comparisonRuns.slice(-LIMITS.comparisonRuns);
  }

  if (state.error && !state.trace.length) selectView("error-coach");
  else {
    renderActiveView();
    resetViewStageScroll();
  }
  updatePlaybackControls();
  renderConsole();
  renderAutomaticComments();

  const message = state.error
    ? `${state.error.type} recorded with ${state.trace.length} trace steps.`
    : `Trace ready with ${state.trace.length} steps.`;
  showToast(message, Boolean(state.error));
}

/** Binds all implemented DSA controls in one auditable location. */
function bindEvents() {
  const themeControls = { button: els.themeButton, label: els.themeLabel };
  els.themeButton.addEventListener("click", () => {
    toggleTheme(themeControls);
    // A live canvas cannot inherit CSS variables, so rebuild the active graph once.
    if (["references", "algorithm-path"].includes(state.activeView) && !state.playbackTimer) {
      renderActiveView();
    }
  });
  els.dsaExamplesButton.addEventListener("click", openCatalog);
  els.dsaCloseExamplesButton.addEventListener("click", () => els.dsaExamplesDialog.close());
  els.dsaLearningCommentsButton.addEventListener("click", openCommentsDialog);
  els.dsaCloseCommentsButton.addEventListener("click", () => els.dsaCommentsDialog.close());
  els.dsaCopyCommentsButton.addEventListener("click", copyCommentedSource);
  els.dsaReplaceCommentsButton.addEventListener("click", replaceWithCommentedSource);
  els.dsaRunButton.addEventListener("click", runCode);
  els.dsaWrapButton.addEventListener("click", toggleEditorWrapping);
  els.dsaAutomaticCommentsButton.addEventListener("click", toggleAutomaticComments);
  els.dsaFontSizeSelect.addEventListener("change", (event) => changeEditorFontSize(event.target.value));
  els.dsaCopyButton.addEventListener("click", copyCompleteEditor);
  els.dsaPasteButton.addEventListener("click", pasteCompleteEditor);
  /*
    Detail changes update both read-only DSA comment surfaces immediately.
    They do not rerun Python, edit source, or change reviewed-context matching.
  */
  els.dsaCommentDetail.addEventListener("change", () => {
    renderAutomaticComments();
    if (els.dsaCommentsDialog.open) {
      renderDsaStudyPreview(
        currentCommentedSource(),
        els.dsaCommentPreview,
        els.dsaCommentLineCount,
      );
    }
  });
  // Search remains local, unsaved, and composed with the active DSA section.
  els.dsaExampleSearchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value;
    state.previewProgramId = "";
    els.dsaExampleBrowserBody.classList.remove("mobile-preview-open");
    renderCatalogFilters();
    renderCatalogPrograms();
    els.dsaExampleGrid.scrollTop = 0;
  });
  els.dsaPreviousButton.addEventListener("click", () => selectStep(state.currentStep - 1));
  els.dsaNextButton.addEventListener("click", () => selectStep(state.currentStep + 1));
  els.dsaRestartButton.addEventListener("click", () => selectStep(0));
  els.dsaPlayButton.addEventListener("click", togglePlayback);
  els.dsaTimeline.addEventListener("input", (event) => selectStep(event.target.value));
  els.dsaClearOutputButton.addEventListener("click", () => {
    els.dsaConsoleOutput.textContent = "// Output view cleared. The recorded trace is unchanged.";
  });

  // Clicking a dialog backdrop closes it while clicks on dialog content do not.
  [els.dsaExamplesDialog, els.dsaCommentsDialog].forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });
  });
}

/**
 * Starts the verified DSA workspace and mounts CodeMirror or its fallback.
 *
 * @returns {Promise<void>} Resolves after the editor and interface are ready.
 */
async function initialize() {
  const themeControls = { button: els.themeButton, label: els.themeLabel };
  applyTheme(preferredTheme(), themeControls);
  bindEvents();
  // Match the Python workspace by loading the local runtime during startup.
  ensureWorker();

  state.editor = await createPythonEditor({
    mount: els.dsaEditor,
    shell: els.dsaEditorShell,
    initialCode: state.code,
    preferences: state.editorPreferences,
    onChange: handleSourceChange,
    onFallback: () => showToast("The enhanced editor could not load. The basic editor is ready instead."),
  });

  state.activeProgram = matchingProgram(state.code);
  els.dsaCopyButton.disabled = false;
  els.dsaPasteButton.disabled = false;
  // Event handlers are bound before the asynchronous editor finishes loading.
  // Enable Run only now so a fast click can never read a missing editor object.
  els.dsaRunButton.disabled = false;
  applyEditorPreferences();
  updateCodeStats();
  renderAreaNavigation();
  renderViewTabs();
  updatePlaybackControls();
  renderConsole();
  renderAutomaticComments();
  renderActiveView();
  renderSelectedProgramQuestion();
}

initialize();
