/**
 * Code Explorer Data Structures and Algorithms workspace controller.
 *
 * Chunk 7 completes Tier A with 535 reviewed programs, the shared
 * bounded Python worker, trace playback, eighteen evidence-aware learning
 * views, prepared input, and non-destructive study comments. All persistence is
 * same-origin browser storage. No learner source or derived trace leaves the
 * browser through application code.
 */

import { createPythonEditor, EDITOR_FONT_SIZES } from "./shared-editor.js?v=20260728-22";
import { applyTheme, preferredTheme, readLocalText, toggleTheme, writeLocalText } from "./shared-ui.js?v=20260728-22";
import { catalogSearchText, matchesCatalogSearch } from "./catalog-search.js?v=20260728-22";
import {
  DSA_AREAS,
  DSA_EVIDENCE_LABELS,
  DSA_VIEWS,
} from "./dsa-contracts.js?v=20260728-22";
import {
  DSA_CHUNK_ONE_PROGRAMS,
  DSA_CHUNK_ONE_SECTIONS,
} from "./dsa-curriculum.js?v=20260728-22";
import {
  DSA_CHUNK_TWO_PROGRAMS,
  DSA_CHUNK_TWO_SECTIONS,
} from "./dsa-curriculum-chunk2.js?v=20260728-22";
import {
  DSA_CHUNK_THREE_PROGRAMS,
  DSA_CHUNK_THREE_SECTIONS,
} from "./dsa-curriculum-chunk3.js?v=20260728-22";
import {
  DSA_CHUNK_FOUR_PROGRAMS,
  DSA_CHUNK_FOUR_SECTIONS,
} from "./dsa-curriculum-chunk4.js?v=20260728-22";
import {
  DSA_CHUNK_FIVE_PROGRAMS,
  DSA_CHUNK_FIVE_SECTIONS,
} from "./dsa-curriculum-chunk5.js?v=20260728-22";
import {
  DSA_CHUNK_SIX_PROGRAMS,
  DSA_CHUNK_SIX_SECTIONS,
} from "./dsa-curriculum-chunk6.js?v=20260728-22";
import {
  DSA_CHUNK_SEVEN_PROGRAMS,
  DSA_CHUNK_SEVEN_SECTIONS,
} from "./dsa-curriculum-chunk7.js?v=20260728-22";
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
} from "./dsa-runtime.js?v=20260728-22";

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
  operationJourneyRows: 30,
  algorithmPathSteps: 80,
  stepTableRows: 120,
  comparisonRuns: 2,
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
    "dsaCloseExamplesButton", "dsaExampleSearchInput", "dsaExampleFilters", "dsaExampleCount",
    "dsaExampleGrid", "dsaCommentsDialog", "dsaCloseCommentsButton",
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
  toastTimer: null,
  suppressEditorInvalidation: false,
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
  return (readLocalText(STORAGE_KEYS.preparedInputs) || "").slice(0, 20_000);
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

/** Stops playback without changing the selected trace step. */
function stopPlayback() {
  if (state.playbackTimer) window.clearInterval(state.playbackTimer);
  state.playbackTimer = null;
  els.dsaPlayButton.textContent = "▶";
  els.dsaPlayButton.setAttribute("aria-label", "Play DSA trace");
}

/** Clears trace evidence whenever visible source no longer matches the recording. */
function invalidateTrace() {
  stopPlayback();
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

/** Renders all bounded serialized names in the selected scope. */
function renderVariables() {
  const step = selectedStep();
  if (!step) {
    renderUnavailable("No variables recorded", "Run a program to inspect serialized names and values.");
    return;
  }
  const variables = variablesForStep(step);
  const article = makeElement("article", "dsa-runtime-view");
  article.append(evidenceBadge("observed"));
  article.append(makeElement("h2", "", "Variables at this step"));
  const grid = makeElement("div", "dsa-variable-grid");
  Object.entries(variables).sort(([left], [right]) => left.localeCompare(right)).forEach(([name, value]) => {
    const card = makeElement("section", "dsa-variable-card");
    card.append(makeElement("strong", "", name));
    card.append(makeElement("span", "", value.type || "unknown type"));
    card.append(makeElement("code", "", serializedLabel(value)));
    grid.append(card);
  });
  article.append(grid);
  els.dsaViewStage.replaceChildren(article);
}

/** Renders likely algorithm-control names without pretending they were user-selected. */
function renderWatches() {
  const step = selectedStep();
  if (!step) {
    renderUnavailable("No watch values", "Run a program to see likely indices, boundaries, counters, and accumulators.");
    return;
  }
  const variables = variablesForStep(step);
  const preferred = /(index|left|right|low|high|middle|count|total|sum|size|front|rear|pivot|boundary|write|read|target)/i;
  const names = Object.keys(variables).sort((left, right) => Number(preferred.test(right)) - Number(preferred.test(left))).slice(0, 12);
  const article = makeElement("article", "dsa-runtime-view");
  article.append(evidenceBadge("observed"));
  article.append(makeElement("h2", "", "Suggested watches"));
  article.append(makeElement("p", "dsa-honesty-note", "Code Explorer suggests up to 12 visible names. It does not record progress or claim that every suggested name controls the algorithm."));
  const list = makeElement("div", "dsa-watch-list");
  names.forEach((name) => {
    const row = makeElement("div", "dsa-watch-row");
    row.append(makeElement("strong", "", name));
    row.append(makeElement("code", "", serializedLabel(variables[name])));
    list.append(row);
  });
  article.append(list);
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

/** Renders one bounded container using observed values and optional reviewed orientation. */
function renderStructureCanvas() {
  const candidate = reviewedStructureCandidate(selectedStep(), reviewedStructureRole());
  if (!candidate) {
    renderUnavailable("No supported structure visible", "Run a step that exposes a serialized list, tuple, set, deque, or dictionary.");
    return;
  }
  const { name, value, reviewedRole: role } = candidate;
  const article = makeElement("article", "dsa-runtime-view");
  article.append(evidenceBadge("observed"));
  article.append(makeElement("h2", "", `${name} · ${value.type}`));
  if (role) {
    article.append(evidenceBadge("curriculum"));
    article.append(makeElement("p", "dsa-honesty-note", `Reviewed representation: ${role}. The cells below are observed serialized Python values, not physical memory slots.`));
  }
  const cells = makeElement("div", `dsa-structure-cells ${role ? `role-${role}` : ""}`.trim());
  const entries = Array.isArray(value.entries)
    ? value.entries.map((entry) => `${serializedLabel(entry.key)}: ${serializedLabel(entry.value)}`)
    : (value.items || []).map(serializedLabel);
  entries.slice(0, LIMITS.structureCells).forEach((label, index) => {
    const cell = makeElement("div", "dsa-structure-cell");
    cell.append(makeElement("span", "", structurePositionLabel(role, index, Math.min(entries.length, LIMITS.structureCells))));
    cell.append(makeElement("code", "", label));
    cells.append(cell);
  });
  article.append(cells);
  if ((value.length || entries.length) > entries.length || entries.length > LIMITS.structureCells) {
    article.prepend(evidenceBadge("shortened"));
    article.append(makeElement("p", "dsa-honesty-note", `The display is bounded to ${LIMITS.structureCells} cells. The recorded length remains ${value.length}.`));
  }
  els.dsaViewStage.replaceChildren(article);
}

/** Renders conceptual alias groups from worker identity tokens. */
function renderReferences() {
  const variables = variablesForStep(selectedStep());
  const groups = new Map();
  Object.entries(variables).forEach(([name, value]) => {
    if (!value?.objectId) return;
    if (!groups.has(value.objectId)) groups.set(value.objectId, []);
    groups.get(value.objectId).push({ name, value });
  });
  if (!groups.size) {
    renderUnavailable("No conceptual references visible", "The selected step exposes no serialized non-primitive objects with identity tokens.");
    return;
  }
  const article = makeElement("article", "dsa-runtime-view");
  article.append(evidenceBadge("observed"));
  article.append(makeElement("h2", "", "Conceptual name-to-object groups"));
  article.append(makeElement("p", "dsa-honesty-note", "Object tokens group shared references inside this run. They are not physical RAM addresses."));
  const list = makeElement("div", "dsa-reference-list");
  [...groups.values()].forEach((group, index) => {
    const row = makeElement("section", "dsa-reference-row");
    row.append(makeElement("strong", "", `Object ${index + 1}`));
    row.append(makeElement("span", "", group.map((item) => item.name).join(", ")));
    row.append(makeElement("code", "", serializedLabel(group[0].value)));
    list.append(row);
  });
  article.append(list);
  els.dsaViewStage.replaceChildren(article);
}

/** Distinguishes same-object mutation from reassignment using adjacent tokens. */
function renderMutationExplorer() {
  const step = selectedStep();
  if (!step) {
    renderUnavailable("No mutation evidence", "Run a program and select a step that changes a structure.");
    return;
  }
  const changes = variableChanges(state.trace[state.currentStep - 1] || null, step);
  const objectChanges = changes.filter((change) => change.before?.objectId || change.after?.objectId);
  const article = makeElement("article", "dsa-runtime-view");
  article.append(evidenceBadge("observed"));
  article.append(makeElement("h2", "", "Mutation and reassignment"));
  if (!objectChanges.length) {
    article.append(makeElement("p", "", "No visible non-primitive name changed at this step."));
  } else {
    const list = makeElement("div", "dsa-mutation-list");
    objectChanges.forEach((change) => {
      const sameObject = change.before?.objectId && change.before.objectId === change.after?.objectId;
      const row = makeElement("section", "dsa-mutation-row");
      row.append(makeElement("strong", "", change.name));
      row.append(makeElement("span", "", sameObject ? "same object changed" : "name now references a different object"));
      row.append(makeElement("code", "", `${serializedLabel(change.before)} → ${serializedLabel(change.after)}`));
      list.append(row);
    });
    article.append(list);
  }
  els.dsaViewStage.replaceChildren(article);
}

/** Shows reviewed invariant statements without pretending they were proven automatically. */
function renderInvariantChecker() {
  if (!state.activeProgram) {
    renderUnavailable("Reviewed invariants unavailable", "Observed values still work for pasted code, but invariant statements require an unchanged reviewed catalog program.");
    return;
  }
  const article = makeElement("article", "dsa-runtime-view");
  article.append(evidenceBadge("curriculum"));
  article.append(makeElement("h2", "", "Reviewed rules to test"));
  if (!state.activeProgram.invariants.length) {
    article.append(makeElement("p", "", "This focused lesson has no separate invariant statement."));
  } else {
    const list = makeElement("ul", "dsa-invariant-list");
    state.activeProgram.invariants.forEach((invariant) => list.append(makeElement("li", "", invariant)));
    article.append(list);
  }
  article.append(makeElement("p", "dsa-honesty-note", "Code Explorer presents these rules as reviewed curriculum context. It does not label them passed unless a program explicitly prints or records its own check."));
  els.dsaViewStage.replaceChildren(article);
}

/** Builds a bounded history of observed normalized events through the current step. */
function observedEventsThroughCurrent() {
  return state.trace.slice(0, state.currentStep + 1).map((step, index) => {
    const changes = variableChanges(state.trace[index - 1] || null, step);
    return { step, changes, event: classifyDsaEvent(step, changes), index };
  });
}

/** Renders recent operations as an ordered journey. */
function renderOperationJourney() {
  const events = observedEventsThroughCurrent();
  if (!events.length) {
    renderUnavailable("No operation journey", "Run a program to build a recorded sequence of operation cues.");
    return;
  }
  const visible = events.slice(-LIMITS.operationJourneyRows);
  const article = makeElement("article", "dsa-runtime-view");
  if (visible.length < events.length) article.append(evidenceBadge("shortened"));
  article.append(evidenceBadge("observed"));
  article.append(makeElement("h2", "", "Observed operation journey"));
  const list = makeElement("ol", "dsa-operation-list");
  visible.forEach(({ step, event, index }) => {
    const item = makeElement("li", index === state.currentStep ? "current" : "");
    item.append(makeElement("strong", "", `${event.type} · line ${step.line}`));
    item.append(makeElement("code", "", step.source.trim()));
    list.append(item);
  });
  article.append(list);
  els.dsaViewStage.replaceChildren(article);
}

/** Renders visited source lines and counts as an honest bounded path. */
function renderAlgorithmPath() {
  if (!state.trace.length) {
    renderUnavailable("No execution path", "Run a program to see the source lines Python actually reached.");
    return;
  }
  const prefix = state.trace.slice(0, state.currentStep + 1);
  const counts = new Map();
  prefix.forEach((step) => counts.set(step.line, (counts.get(step.line) || 0) + 1));
  const visible = prefix.slice(-LIMITS.algorithmPathSteps);
  const article = makeElement("article", "dsa-runtime-view");
  if (visible.length < prefix.length) article.append(evidenceBadge("shortened"));
  article.append(evidenceBadge("observed"));
  article.append(makeElement("h2", "", "Executed source path"));
  const path = makeElement("div", "dsa-path-strip");
  visible.forEach((step, index) => {
    path.append(makeElement("span", index === visible.length - 1 ? "current" : "", `L${step.line}`));
  });
  article.append(path);
  const summary = makeElement("div", "dsa-line-counts");
  [...counts.entries()].sort((left, right) => left[0] - right[0]).forEach(([line, count]) => {
    summary.append(makeElement("span", "", `Line ${line}: ${count}`));
  });
  article.append(summary);
  els.dsaViewStage.replaceChildren(article);
}

/** Renders a bounded table of steps, event cues, and changed names. */
function renderStepTable() {
  const events = observedEventsThroughCurrent();
  if (!events.length) {
    renderUnavailable("No step table", "Run a program to compare recorded operations across steps.");
    return;
  }
  const visible = events.slice(-LIMITS.stepTableRows);
  const article = makeElement("article", "dsa-runtime-view");
  if (visible.length < events.length) article.append(evidenceBadge("shortened"));
  article.append(evidenceBadge("observed"));
  article.append(makeElement("h2", "", "Recorded step table"));
  const tableWrap = makeElement("div", "dsa-table-wrap");
  const table = document.createElement("table");
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  ["Step", "Line", "Event cue", "Changed names"].forEach((label) => headRow.append(makeElement("th", "", label)));
  head.append(headRow);
  const body = document.createElement("tbody");
  visible.forEach(({ step, event, changes, index }) => {
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
    [step.line, event.type, changes.map((change) => change.name).join(", ") || "none"]
      .forEach((value) => row.append(makeElement("td", "", String(value))));
    body.append(row);
  });
  table.append(head, body);
  tableWrap.append(table);
  article.append(tableWrap);
  els.dsaViewStage.replaceChildren(article);
}

/** Separates measured counts from reviewed complexity claims. */
function renderComplexityLab() {
  if (!state.trace.length) {
    renderUnavailable("No observed counts", "Run a program to measure one bounded execution.");
    return;
  }
  const events = state.trace.map((step, index) => classifyDsaEvent(step, variableChanges(state.trace[index - 1] || null, step)));
  const counts = new Map();
  events.forEach((event) => counts.set(event.type, (counts.get(event.type) || 0) + 1));
  const article = makeElement("article", "dsa-runtime-view");
  const observed = makeElement("section", "dsa-evidence-card observed-card");
  observed.append(evidenceBadge("observed"));
  observed.append(makeElement("h2", "", "This run"));
  observed.append(makeElement("p", "", `${state.trace.length} recorded steps · ${new Set(state.trace.map((step) => step.line)).size} reached source lines`));
  const list = makeElement("div", "dsa-complexity-counts");
  [...counts.entries()].sort((left, right) => right[1] - left[1]).forEach(([name, count]) => list.append(makeElement("span", "", `${name}: ${count}`)));
  observed.append(list);
  article.append(observed);

  if (state.activeProgram) {
    const context = makeElement("section", "dsa-evidence-card curriculum-card");
    context.append(evidenceBadge("curriculum"));
    context.append(makeElement("h2", "", "Reviewed growth context"));
    context.append(makeElement("p", "", `Time: ${state.activeProgram.complexity.time}`));
    context.append(makeElement("p", "", `Space: ${state.activeProgram.complexity.space}`));
    context.append(makeElement("p", "dsa-honesty-note", state.activeProgram.complexity.note));
    article.append(context);
  } else {
    const unavailable = makeElement("section", "dsa-evidence-card unavailable-card");
    unavailable.append(evidenceBadge("unavailable"));
    unavailable.append(makeElement("p", "", "A Big O classification is unavailable for arbitrary pasted code. One recorded run cannot prove a general growth class."));
    article.append(unavailable);
  }
  els.dsaViewStage.replaceChildren(article);
}

/** Renders locally prepared input and a contextual run action. */
function renderInputPlayground() {
  const article = makeElement("article", "dsa-runtime-view");
  article.append(evidenceBadge("observed"));
  article.append(makeElement("h2", "", "Prepared input"));
  article.append(makeElement("p", "", "Enter one response per line. Values stay in this browser and are returned to Python input() calls in order."));
  const textarea = document.createElement("textarea");
  textarea.className = "dsa-input-textarea";
  textarea.value = state.preparedInputs;
  textarea.placeholder = "first response\nsecond response";
  textarea.setAttribute("aria-label", "Prepared DSA input values");
  textarea.addEventListener("input", () => {
    state.preparedInputs = textarea.value.slice(0, 20_000);
    writeLocalText(STORAGE_KEYS.preparedInputs, state.preparedInputs);
  });
  const run = makeElement("button", "primary-button compact", "Run with these inputs");
  run.type = "button";
  run.addEventListener("click", runCode);
  article.append(textarea, run);
  if (state.inputLog.length) {
    const log = makeElement("div", "dsa-input-log");
    state.inputLog.forEach((entry, index) => log.append(makeElement("p", "", `${index + 1}. ${entry.prompt || "input"} → ${entry.value}`)));
    article.append(log);
  }
  els.dsaViewStage.replaceChildren(article);
}

/** Renders bounded same-session summaries and related reviewed programs. */
function renderCompareAlgorithms() {
  const article = makeElement("article", "dsa-runtime-view");
  article.append(evidenceBadge("curriculum"));
  article.append(makeElement("h2", "", "Compare compatible programs"));
  if (!state.activeProgram?.comparisonGroup) {
    article.append(makeElement("p", "dsa-honesty-note", "This source has no reviewed comparison group. Choose a catalog program with a named comparison relationship."));
    els.dsaViewStage.replaceChildren(article);
    return;
  }
  const related = DSA_IMPLEMENTED_PROGRAMS.filter((program) => program.comparisonGroup === state.activeProgram.comparisonGroup);
  article.append(makeElement("p", "", `Reviewed group: ${state.activeProgram.comparisonGroup}. Run related programs one at a time with equivalent inputs.`));
  const programs = makeElement("div", "dsa-related-programs");
  related.forEach((program) => {
    const button = makeElement("button", program.id === state.activeProgram.id ? "active" : "", program.title);
    button.type = "button";
    button.addEventListener("click", () => loadProgram(program));
    programs.append(button);
  });
  article.append(programs);

  const compatibleRuns = state.comparisonRuns.filter((run) => run.group === state.activeProgram.comparisonGroup);
  if (compatibleRuns.length) {
    const table = makeElement("div", "dsa-comparison-run-list");
    compatibleRuns.forEach((run) => table.append(makeElement("p", "", `${run.title}: ${run.steps} recorded steps, result evidence ${run.error ? run.error : "completed"}`)));
    article.append(table);
  }
  article.append(makeElement("p", "dsa-honesty-note", "Recorded step totals depend on tracing details and input. They are observations, not formal proof that one algorithm is universally faster."));
  els.dsaViewStage.replaceChildren(article);
}

/** Renders reviewed boundary cases as experiments to try, not tracked tasks. */
function renderEdgeCaseLab() {
  if (!state.activeProgram) {
    renderUnavailable("Reviewed edge cases unavailable", "Select an unchanged catalog program to see its reviewed boundary questions.");
    return;
  }
  const article = makeElement("article", "dsa-runtime-view");
  article.append(evidenceBadge("curriculum"));
  article.append(makeElement("h2", "", "Edge cases to investigate"));
  if (!state.activeProgram.edgeCases.length) {
    article.append(makeElement("p", "", "This focused lesson has no separate edge-case note. Try a smaller input and predict the result before running."));
  } else {
    const list = makeElement("ul", "dsa-edge-list");
    state.activeProgram.edgeCases.forEach((edgeCase) => list.append(makeElement("li", "", edgeCase)));
    article.append(list);
  }
  article.append(makeElement("p", "dsa-honesty-note", "Code Explorer does not record which suggestions you tried. Edit a copy, run it, and use observed views to inspect the result."));
  els.dsaViewStage.replaceChildren(article);
}

/** Routes the active view id to one bounded renderer. */
function renderActiveView() {
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

/** Creates one richly labeled catalog card using reviewed metadata only. */
function programCard(program) {
  const button = makeElement("button", "example-card dsa-program-card");
  button.type = "button";
  const lineCount = program.code.split("\n").length;
  const header = makeElement("div", "example-card-meta");
  header.append(makeElement("span", "example-topic", `${program.id.toUpperCase()} · ${program.algorithm}`));
  header.append(makeElement("span", "example-level", `${program.difficulty} · ${lineCount} lines`));
  button.append(header);
  button.append(makeElement("strong", "", program.title));
  button.append(makeElement("p", "", program.objective));
  const meta = makeElement("div", "dsa-program-meta");
  meta.append(makeElement("span", "", `Time ${program.complexity.time}`));
  meta.append(makeElement("span", "", `Space ${program.complexity.space}`));
  button.append(meta);
  const best = makeElement("div", "example-views");
  best.append(makeElement("span", "", "BEST VIEWS"));
  best.append(makeElement("strong", "", program.bestViews.join(" · ")));
  button.append(best);
  button.addEventListener("click", () => loadProgram(program));
  return button;
}

/** Renders filtered program cards and an accurate visible count. */
function renderCatalogPrograms() {
  const sectionPrograms = state.activeFilter === "All programs"
    ? DSA_IMPLEMENTED_PROGRAMS
    : DSA_IMPLEMENTED_PROGRAMS.filter((program) => program.section === state.activeFilter);
  const visible = sectionPrograms.filter(programMatchesSearch);
  if (!visible.length) {
    els.dsaExampleGrid.replaceChildren(createCatalogSearchEmptyState());
  } else {
    els.dsaExampleGrid.replaceChildren(...visible.map(programCard));
  }
  els.dsaExampleCount.textContent = `Showing ${visible.length} of ${DSA_IMPLEMENTED_PROGRAMS.length} programs`;
}

/** Opens the implemented catalog without changing source. */
function openCatalog() {
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
  state.worker = new Worker("py-worker.js?v=20260728-22", { type: "module" });
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

  stopPlayback();
  state.running = true;
  state.runId += 1;
  state.activeProgram = matchingProgram(source);
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
    inputs: state.preparedInputs.split("\n"),
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
    state.comparisonRuns.push({
      group: state.activeProgram.comparisonGroup,
      title: state.activeProgram.title,
      steps: state.trace.length,
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
  els.themeButton.addEventListener("click", () => toggleTheme(themeControls));
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
