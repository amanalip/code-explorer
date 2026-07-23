/**
 * Code Explorer Data Structures and Algorithms foundation controller.
 *
 * Chunk 0 owns editor presentation, local persistence, clipboard actions,
 * theme behavior, and the honest preview of eighteen approved learning views.
 * It deliberately does not execute Python or fabricate DSA results. Later
 * chunks will connect reviewed curriculum and normalized events to this shell.
 */

import { createPythonEditor, EDITOR_FONT_SIZES } from "./shared-editor.js?v=20260723-1";
import { applyTheme, preferredTheme, readLocalText, toggleTheme, writeLocalText } from "./shared-ui.js?v=20260723-1";
import {
  DSA_AREAS,
  DSA_CATALOG_TARGET,
  DSA_EVIDENCE_LABELS,
  DSA_EVENT_TYPES,
  DSA_STRUCTURE_TYPES,
  DSA_VIEWS,
} from "./dsa-contracts.js?v=20260723-1";

/**
 * A small editable search program gives the foundation editor realistic Python
 * without claiming to be one of the future reviewed curriculum programs.
 */
const DEFAULT_DSA_CODE = `values = [7, 3, 9, 1, 5]
target = 9
found_index = -1

for index, value in enumerate(values):
    if value == target:
        found_index = index
        break

print("Found index:", found_index)`;

/** DSA source remains separate from the original Python workspace document. */
const DSA_SOURCE_STORAGE_KEY = "code-explorer-dsa-source";

/** Editor presentation can evolve separately while sharing validated choices. */
const DSA_EDITOR_PREFERENCES_STORAGE_KEY = "code-explorer-dsa-editor-preferences";

/** The selected learning view is presentation state that is safe to restore locally. */
const DSA_ACTIVE_VIEW_STORAGE_KEY = "code-explorer-dsa-active-view";

/** Safe defaults match the proven Python editor presentation. */
const DEFAULT_EDITOR_PREFERENCES = Object.freeze({ wrap: true, fontSize: 14 });

/** Cached elements keep event and rendering code readable and easy to audit. */
const els = Object.fromEntries(
  [
    "runtimeStatus", "runtimeLabel", "themeButton", "themeLabel", "dsaEditor", "dsaEditorShell",
    "dsaWrapButton", "dsaAutomaticCommentsButton", "dsaFontSizeSelect", "dsaCopyButton",
    "dsaPasteButton", "dsaCodeStats", "dsaAreaNav", "dsaViewTabs", "dsaViewStage",
    "dsaViewCount", "dsaEventCount", "dsaStructureCount", "dsaCatalogTarget", "toast",
  ].map((id) => [id, document.getElementById(id)]),
);

/**
 * Mutable Chunk 0 state contains only local presentation and source values.
 * No learner behavior, progress, trace, or analytics data is recorded.
 */
const state = {
  code: readLocalText(DSA_SOURCE_STORAGE_KEY) ?? DEFAULT_DSA_CODE,
  editor: null,
  editorPreferences: loadEditorPreferences(),
  activeView: loadActiveView(),
  toastTimer: null,
};

/**
 * Restores validated DSA editor preferences.
 * @returns {{wrap: boolean, fontSize: number}} Safe local presentation choices.
 */
function loadEditorPreferences() {
  try {
    const stored = JSON.parse(readLocalText(DSA_EDITOR_PREFERENCES_STORAGE_KEY) || "null");
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

/** Saves only editor presentation choices to same-origin browser storage. */
function saveEditorPreferences() {
  writeLocalText(DSA_EDITOR_PREFERENCES_STORAGE_KEY, JSON.stringify(state.editorPreferences));
}

/**
 * Restores only a known view id so modified storage cannot create a blank panel.
 * @returns {string} Valid approved DSA view id.
 */
function loadActiveView() {
  const stored = readLocalText(DSA_ACTIVE_VIEW_STORAGE_KEY);
  return DSA_VIEWS.some((view) => view.id === stored) ? stored : DSA_VIEWS[0].id;
}

/**
 * Shows a temporary accessible message without moving keyboard focus.
 * @param {string} message Learner-facing status or recovery instruction.
 * @param {boolean} isError Whether error coloring should accompany the text.
 */
function showToast(message, isError = false) {
  window.clearTimeout(state.toastTimer);
  els.toast.textContent = message;
  els.toast.classList.toggle("error", isError);
  els.toast.classList.add("visible");
  state.toastTimer = window.setTimeout(() => els.toast.classList.remove("visible"), 4000);
}

/** Updates the footer from the original editor document only. */
function updateCodeStats() {
  const code = state.editor?.getCode() ?? state.code;
  const lines = code ? code.split("\n").length : 0;
  els.dsaCodeStats.textContent = `${lines} line${lines === 1 ? "" : "s"} · ${code.length} chars`;
}

/**
 * Synchronizes the editor toolbar and mounted editor with validated preferences.
 */
function applyEditorPreferences() {
  els.dsaWrapButton.textContent = state.editorPreferences.wrap ? "Wrap on" : "Wrap off";
  els.dsaWrapButton.setAttribute("aria-pressed", String(state.editorPreferences.wrap));
  els.dsaWrapButton.title = state.editorPreferences.wrap
    ? "Turn editor text wrapping off"
    : "Turn editor text wrapping on";
  els.dsaFontSizeSelect.value = String(state.editorPreferences.fontSize);
  state.editor?.applyPreferences(state.editorPreferences);
}

/** Flips wrapping without inserting or removing Python characters. */
function toggleEditorWrapping() {
  state.editorPreferences.wrap = !state.editorPreferences.wrap;
  saveEditorPreferences();
  applyEditorPreferences();
}

/**
 * Applies only a font size exposed by the toolbar.
 * @param {string} requestedSize Candidate option value.
 */
function changeEditorFontSize(requestedSize) {
  const fontSize = Number(requestedSize);
  if (!EDITOR_FONT_SIZES.includes(fontSize)) return;
  state.editorPreferences.fontSize = fontSize;
  saveEditorPreferences();
  applyEditorPreferences();
}

/**
 * Copies text using the browser's older selection API when modern clipboard
 * writing is unavailable.
 * @param {string} text Complete Python document.
 * @returns {boolean} Whether the browser reported success.
 */
function copyTextWithNativeFallback(text) {
  const previousFocus = document.activeElement;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("aria-hidden", "true");
  textarea.tabIndex = -1;
  textarea.style.position = "fixed";
  textarea.style.inset = "0 auto auto 0";
  textarea.style.width = "1px";
  textarea.style.height = "1px";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.focus();
  textarea.select();
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    console.warn("Code Explorer DSA copy fallback failed.", error);
  }
  textarea.remove();
  previousFocus?.focus?.({ preventScroll: true });
  return copied;
}

/** Copies the complete DSA editor document after a direct learner action. */
async function copyCompleteEditor() {
  const code = state.editor.getCode();
  if (!code) {
    showToast("The editor is empty. There is nothing to copy.");
    return;
  }
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(code);
    } else if (!copyTextWithNativeFallback(code)) {
      throw new Error("No clipboard writing method is available.");
    }
    const lineCount = code.split("\n").length;
    showToast(`Copied the complete program (${lineCount} line${lineCount === 1 ? "" : "s"}).`);
  } catch (error) {
    if (copyTextWithNativeFallback(code)) {
      showToast("Copied the complete program.");
      return;
    }
    console.warn("Code Explorer could not copy DSA editor source.", error);
    showToast("Copy was blocked. Select the editor and use Ctrl+C instead.", true);
  }
}

/**
 * Replaces the complete editor document only because the learner deliberately
 * pressed the dedicated Paste control.
 */
async function pasteCompleteEditor() {
  try {
    if (!navigator.clipboard?.readText) {
      throw new Error("Clipboard reading is unavailable in this browser context.");
    }
    const clipboardText = await navigator.clipboard.readText();
    if (!clipboardText) {
      showToast("The clipboard contains no text to paste.");
      return;
    }
    state.editor.setCode(clipboardText);
    state.editor.focus();
    const lineCount = clipboardText.split("\n").length;
    showToast(`Pasted a complete program (${lineCount} line${lineCount === 1 ? "" : "s"}).`);
  } catch (error) {
    console.warn("Code Explorer could not read clipboard text.", error);
    window.alert(
      "Clipboard permission is blocked.\n\nAllow clipboard access for this site and try Paste again. You can also focus the editor and press Ctrl+V.",
    );
    showToast("Paste permission was blocked. Focus the editor and use Ctrl+V instead.", true);
  }
}

/**
 * Returns the approved view currently represented by state.
 * @returns {{id: string, area: string, label: string, purpose: string}} View contract.
 */
function activeView() {
  return DSA_VIEWS.find((view) => view.id === state.activeView) ?? DSA_VIEWS[0];
}

/**
 * Renders the four stable areas and selects their first view when activated.
 */
function renderAreaNavigation() {
  const currentArea = activeView().area;
  els.dsaAreaNav.replaceChildren(
    ...DSA_AREAS.map((area) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `learning-mode ${area.id === currentArea ? "active" : ""}`;
      button.textContent = area.label;
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

/** Renders only the view tabs belonging to the active learning area. */
function renderViewTabs() {
  const current = activeView();
  const areaViews = DSA_VIEWS.filter((view) => view.area === current.area);
  els.dsaViewTabs.replaceChildren(
    ...areaViews.map((view) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `panel-tab ${view.id === current.id ? "active" : ""}`;
      button.id = `dsa-tab-${view.id}`;
      button.textContent = view.label;
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(view.id === current.id));
      button.addEventListener("click", () => selectView(view.id));
      return button;
    }),
  );
}

/**
 * Builds one honest Chunk 0 preview from static contract text.
 * No learner source is interpreted and no algorithm result is inferred.
 */
function renderViewStage() {
  const view = activeView();
  const area = DSA_AREAS.find((candidate) => candidate.id === view.area);
  const article = document.createElement("article");
  article.className = "dsa-view-preview";

  const evidence = document.createElement("span");
  evidence.className = "evidence-badge unavailable";
  evidence.textContent = DSA_EVIDENCE_LABELS.unavailable;

  const eyebrow = document.createElement("span");
  eyebrow.className = "dsa-view-area";
  eyebrow.textContent = `${area.label} view · Chunk 0 contract`;

  const title = document.createElement("h2");
  title.textContent = view.label;

  const purpose = document.createElement("p");
  purpose.textContent = view.purpose;

  const boundary = document.createElement("div");
  boundary.className = "dsa-boundary-note";
  const boundaryTitle = document.createElement("strong");
  boundaryTitle.textContent = "No runtime evidence yet";
  const boundaryText = document.createElement("p");
  boundaryText.textContent = "This foundation preview defines the learner question and navigation position. DSA results become available only after a later verified curriculum chunk connects recorded events to this view.";
  boundary.append(boundaryTitle, boundaryText);

  article.append(evidence, eyebrow, title, purpose, boundary);
  els.dsaViewStage.replaceChildren(article);
  els.dsaViewStage.setAttribute("aria-labelledby", `dsa-tab-${view.id}`);
}

/**
 * Changes one view, saves only its id locally, and refreshes bounded navigation.
 * @param {string} viewId Approved DSA view id.
 */
function selectView(viewId) {
  if (!DSA_VIEWS.some((view) => view.id === viewId)) return;
  state.activeView = viewId;
  writeLocalText(DSA_ACTIVE_VIEW_STORAGE_KEY, viewId);
  renderAreaNavigation();
  renderViewTabs();
  renderViewStage();
}

/** Connects the small set of controls implemented in Chunk 0. */
function bindEvents() {
  const themeControls = { button: els.themeButton, label: els.themeLabel };
  els.themeButton.addEventListener("click", () => toggleTheme(themeControls));
  els.dsaWrapButton.addEventListener("click", toggleEditorWrapping);
  els.dsaFontSizeSelect.addEventListener("change", (event) => changeEditorFontSize(event.target.value));
  els.dsaCopyButton.addEventListener("click", copyCompleteEditor);
  els.dsaPasteButton.addEventListener("click", pasteCompleteEditor);
}

/**
 * Starts the DSA foundation without loading Pyodide or creating a worker.
 * @returns {Promise<void>} Resolves after CodeMirror or its fallback is ready.
 */
async function initialize() {
  const themeControls = { button: els.themeButton, label: els.themeLabel };
  applyTheme(preferredTheme(), themeControls);
  bindEvents();

  state.editor = await createPythonEditor({
    mount: els.dsaEditor,
    shell: els.dsaEditorShell,
    initialCode: state.code,
    preferences: state.editorPreferences,
    onChange: (code) => {
      state.code = code;
      writeLocalText(DSA_SOURCE_STORAGE_KEY, code);
      updateCodeStats();
    },
    onFallback: () => showToast("The enhanced editor could not load. The basic editor is ready instead."),
  });

  // Clipboard handlers can now read and replace a real enhanced or fallback document.
  els.dsaCopyButton.disabled = false;
  els.dsaPasteButton.disabled = false;
  applyEditorPreferences();
  updateCodeStats();
  renderAreaNavigation();
  renderViewTabs();
  renderViewStage();

  // Visible counts prove that the shipped shell and imported contracts agree.
  els.dsaViewCount.textContent = String(DSA_VIEWS.length);
  els.dsaEventCount.textContent = String(DSA_EVENT_TYPES.length);
  els.dsaStructureCount.textContent = String(DSA_STRUCTURE_TYPES.length);
  els.dsaCatalogTarget.textContent = String(DSA_CATALOG_TARGET);
  els.runtimeStatus.classList.add("ready");
  els.runtimeLabel.textContent = "DSA foundation ready";
}

initialize();
