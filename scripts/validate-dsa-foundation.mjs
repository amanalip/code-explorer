/**
 * Structural validator for shared DSA contracts, routing, and mount points.
 *
 * Curriculum behavior has its own validators. This script protects the stable
 * page routes, view contracts, and DOM ids that both implemented and later
 * chunks depend on.
 */

import { readFile } from "node:fs/promises";
import {
  DSA_AREAS,
  DSA_CATALOG_SECTIONS,
  DSA_CATALOG_TARGET,
  DSA_EVENT_TYPES,
  DSA_PROGRAM_REQUIRED_FIELDS,
  DSA_STRUCTURE_TYPES,
  DSA_VIEWS,
} from "../dsa-contracts.js";
import { buildDsaCommentedSource, variableComparisons } from "../dsa-runtime.js";

/** Collects all failures so a contributor can correct one coherent batch. */
const failures = [];

/**
 * Records one failed expectation without stopping later independent checks.
 * @param {boolean} condition Whether the expected contract is satisfied.
 * @param {string} message Beginner-readable failure description.
 */
function expect(condition, message) {
  if (!condition) failures.push(message);
}

/**
 * Confirms that a list of contract values contains no duplicates.
 * @param {string[]} values Values that must remain unique.
 * @param {string} label Human-readable contract name.
 */
function expectUnique(values, label) {
  expect(new Set(values).size === values.length, `${label} contains a duplicate value.`);
}

// Every DSA chunk keeps four bounded areas and the final eighteen approved views.
expect(DSA_AREAS.length === 4, `Expected 4 DSA areas, received ${DSA_AREAS.length}.`);
expect(DSA_VIEWS.length === 18, `Expected 18 DSA views, received ${DSA_VIEWS.length}.`);
expectUnique(DSA_AREAS.map((area) => area.id), "DSA area ids");
expectUnique(DSA_VIEWS.map((view) => view.id), "DSA view ids");

// Every view must belong to one approved area, and no area may render empty.
const areaIds = new Set(DSA_AREAS.map((area) => area.id));
for (const view of DSA_VIEWS) {
  expect(areaIds.has(view.area), `View "${view.id}" references unknown area "${view.area}".`);
  expect(Boolean(view.label.trim()), `View "${view.id}" has no visible label.`);
  expect(Boolean(view.purpose.trim()), `View "${view.id}" has no learner purpose.`);
}
for (const area of DSA_AREAS) {
  expect(DSA_VIEWS.some((view) => view.area === area.id), `Area "${area.id}" has no views.`);
}

// Normalized names must be stable before later trace and renderer code depends on them.
expectUnique([...DSA_EVENT_TYPES], "DSA event types");
expectUnique([...DSA_STRUCTURE_TYPES], "DSA structure types");
expectUnique([...DSA_PROGRAM_REQUIRED_FIELDS], "DSA program metadata fields");
expectUnique(DSA_CATALOG_SECTIONS.map((section) => section[0]), "DSA catalog section names");

// The section arithmetic must continue to match the approved Tier A contract.
const calculatedTarget = DSA_CATALOG_SECTIONS.reduce((total, section) => total + section[1], 0);
expect(calculatedTarget === 535, `Tier A section totals add to ${calculatedTarget}, not 535.`);
expect(DSA_CATALOG_TARGET === 535, `Exported DSA catalog target is ${DSA_CATALOG_TARGET}, not 535.`);

/*
 * The DSA study-copy density contract is tested without a browser. Curriculum
 * context remains available at every density, while worker notes respect their
 * Essential, Guided, or Detailed levels.
 */
const commentSource = "value = 1\nprint(value)";
const commentNotes = [
  { line: 1, level: 1, text: "Essential note." },
  { line: 2, level: 2, text: "Guided note." },
  { line: 2, level: 3, text: "Detailed note." },
];
const commentProgram = {
  title: "Comment contract",
  objective: "Keep reviewed context separate.",
  complexity: { time: "O(1)", space: "O(1)" },
};
const essentialComments = buildDsaCommentedSource(commentSource, commentNotes, commentProgram, 1);
const guidedComments = buildDsaCommentedSource(commentSource, commentNotes, commentProgram, 2);
const detailedComments = buildDsaCommentedSource(commentSource, commentNotes, commentProgram, 3);
expect(essentialComments.includes("Essential note."), "Essential DSA comments lost an Essential note.");
expect(!essentialComments.includes("Guided note."), "Essential DSA comments included a Guided note.");
expect(guidedComments.includes("Guided note."), "Guided DSA comments lost a Guided note.");
expect(!guidedComments.includes("Detailed note."), "Guided DSA comments included a Detailed note.");
expect(detailedComments.includes("Detailed note."), "Detailed DSA comments lost a Detailed note.");
expect(
  essentialComments.includes("Reviewed program: Comment contract."),
  "DSA detail filtering removed exact reviewed curriculum context.",
);

/*
 * The vertical state list must grow with new variables and shrink after a
 * removed local has received its final comparison. Serialized test values keep
 * this contract independent from Pyodide and browser layout.
 */
const stateA = { globals: { outer: { type: "int", display: "1" } }, locals: {} };
const stateAB = {
  globals: { outer: { type: "int", display: "1" } },
  locals: { inner: { type: "int", display: "2" } },
};
const stateAAfterScope = { globals: { outer: { type: "int", display: "1" } }, locals: {} };
expect(
  variableComparisons(null, stateA).length === 1,
  "Before and After did not begin with one visible variable.",
);
expect(
  variableComparisons(stateA, stateAB).length === 2,
  "Before and After did not grow when a local variable became visible.",
);
expect(
  variableComparisons(stateAB, stateAAfterScope).some(
    (comparison) => comparison.name === "inner" && comparison.kind === "removed",
  ),
  "Before and After did not retain a removed local for its final comparison.",
);
expect(
  variableComparisons(stateAAfterScope, stateA).length === 1,
  "Before and After did not shrink after a removed local left both snapshots.",
);

// Read shipped pages and runtime sources as text so routing, visual-state, and
// strict transport contracts stay dependency-free and fast.
const [landingHtml, pythonHtml, dsaHtml, pythonAppSource, dsaAppSource, stylesSource, workerSource] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../workspace.html", import.meta.url), "utf8"),
  readFile(new URL("../data-structures.html", import.meta.url), "utf8"),
  readFile(new URL("../app.js", import.meta.url), "utf8"),
  readFile(new URL("../dsa-app.js", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
  readFile(new URL("../py-worker.js", import.meta.url), "utf8"),
]);

// The landing page chooses a path but owns neither workspace-specific guide.
expect(landingHtml.includes("Start exploring Python"), "Landing page is missing the Python learning path.");
expect(
  landingHtml.includes("Python Data Structures and Algorithms"),
  "Landing page is missing the complete DSA learning-path label.",
);
// Both routes must remain first-class primary actions with the same arrow cue.
expect(
  /<a class="primary-button" href="workspace\.html">[\s\S]*?Start exploring Python[\s\S]*?→[\s\S]*?<\/a>/.test(landingHtml),
  "Python learning path is not using the expected primary-button structure and arrow.",
);
expect(
  /<a class="primary-button" href="data-structures\.html">[\s\S]*?Python Data Structures and Algorithms[\s\S]*?→[\s\S]*?<\/a>/.test(landingHtml),
  "DSA learning path is not using the expected primary-button structure and arrow.",
);
expect(!landingHtml.includes("Tool Guide"), "Landing page must not contain an ambiguous Tool Guide.");
expect(!landingHtml.includes("examplesDialog"), "Landing page must not own a workspace example dialog.");

// Each workspace must keep its own contextual public guide.
expect(
  pythonHtml.includes("blob/main/README.md"),
  "Python workspace does not link to README.md.",
);
expect(
  dsaHtml.includes("blob/main/README_DSA.md"),
  "DSA workspace does not link to README_DSA.md.",
);
expect(
  /id="dsaViewStage"[\s\S]*?role="tabpanel"[\s\S]*?tabindex="0"[\s\S]*?aria-label="Selected DSA learning view"/.test(dsaHtml),
  "DSA view stage is missing its focusable keyboard-scrolling contract.",
);
expect(
  dsaHtml.includes("Explore 535 reviewed programs"),
  "The DSA catalog heading does not show the complete implemented count.",
);
expect(
  /id="dsaRunButton"[^>]*disabled/.test(dsaHtml)
    && dsaAppSource.includes("els.dsaRunButton.disabled = false;"),
  "The DSA Run control is not gated until the asynchronous editor has mounted.",
);
expect(
  !dsaHtml.includes("CHUNK STATUS")
    && !dsaHtml.includes("foundation-status-badge")
    && !dsaHtml.includes("dsa-heading-label"),
  "Learner-facing release-management labels remain in the DSA interface.",
);
expect(
  dsaHtml.includes('id="dsaSelectedProgramQuestion"')
    && pythonHtml.includes('id="selectedProgramQuestion"'),
  "One or both workspaces are missing the selected reviewed question region.",
);
expect(
  dsaHtml.includes('id="dsaExampleBrowserBody"')
    && dsaHtml.includes('id="dsaExamplePreview"')
    && pythonHtml.includes('id="exampleBrowserBody"')
    && pythonHtml.includes('id="examplePreview"'),
  "One or both curriculum dialogs are missing the independent navigation, list, and preview contract.",
);
expect(
  pythonAppSource.includes("code-explorer-selected-example")
    && pythonAppSource.includes("renderSelectedProgramQuestion()")
    && pythonAppSource.includes("setCode(example.code, example)"),
  "The Python selected-question origin is not persisted and rendered through the catalog path.",
);
expect(
  dsaAppSource.includes("code-explorer-dsa-selected-program")
    && dsaAppSource.includes("renderSelectedProgramQuestion()")
    && dsaAppSource.includes("replaceEditorSource(program.code, program)"),
  "The DSA selected-question origin is not persisted and rendered through the catalog path.",
);
expect(
  pythonAppSource.includes("selectExamplePreview(")
    && pythonAppSource.includes("openExampleFromPreview(")
    && pythonAppSource.includes('"Open in Python workspace"'),
  "The Python curriculum explorer is missing non-destructive selection or its explicit open action.",
);
expect(
  dsaAppSource.includes("selectDsaProgramPreview(")
    && dsaAppSource.includes('"Open in DSA workspace"')
    && dsaAppSource.includes("renderDsaProgramPreview("),
  "The DSA curriculum explorer is missing non-destructive selection or its explicit open action.",
);
expect(
  dsaAppSource.includes('setRuntimeStatus("Python ready", "ready")')
    && !dsaAppSource.includes('setRuntimeStatus("Tier A ready"'),
  "The DSA header does not use the Python runtime status contract.",
);
expect(
  dsaAppSource.includes("DSA_CHUNK_SEVEN_PROGRAMS")
    && dsaAppSource.includes("DSA_CHUNK_SEVEN_SECTIONS"),
  "DSA controller is not integrating both Chunk 7 program and section contracts.",
);
expect(
  dsaAppSource.includes("reviewedStructureCandidate(selectedStep(), reviewedStructureRole())")
    && dsaAppSource.includes('"union-find": { names: /(?:parent|representative|component|rank|size)/i')
    && dsaAppSource.includes("graph: { names: /(?:graph|adjacency|matrix|edges|vertices|forest|tree)/i")
    && dsaAppSource.includes('reviewedRole: ""'),
  "Chunk 4 structure roles are not selecting compatible Union-Find and graph variables.",
);
expect(
  workerSource.includes("isinstance(value, float) and not math.isfinite(value)")
    && workerSource.includes('"nonFinite": True')
    && workerSource.includes("allow_nan=False"),
  "The worker is not preserving non-finite Python floats through strict JSON.",
);

// Every id read by the DSA controller must exist in the dedicated document.
const requiredDsaIds = [
  "runtimeStatus", "runtimeLabel", "themeButton", "themeLabel", "dsaEditorPanel", "dsaEditor",
  "dsaEditorShell", "dsaWrapButton", "dsaAutomaticCommentsButton",
  "dsaSelectedProgramQuestion", "dsaSelectedProgramQuestionTitle",
  "dsaSelectedProgramQuestionDescription",
  "dsaFontSizeSelect", "dsaCopyButton", "dsaPasteButton", "dsaCodeStats",
  "dsaAreaNav", "dsaViewTabs", "dsaViewStage", "dsaStepCount",
  "dsaExamplesButton", "dsaLearningCommentsButton", "dsaRunButton",
  "dsaPreviousButton", "dsaPlayButton", "dsaNextButton", "dsaRestartButton",
  "dsaTimeline", "dsaProgressLabel", "dsaSpeedSelect", "dsaConsoleOutput",
  "dsaExamplesDialog", "dsaExampleBrowserBody", "dsaExampleSearchInput",
  "dsaExampleFilters", "dsaExampleCount", "dsaExampleGrid", "dsaExamplePreview",
  "dsaCommentsDialog", "dsaCommentDetail", "dsaCommentsSummary",
  "dsaCommentPreview", "dsaCopyCommentsButton", "dsaAutomaticPreview", "toast",
];
for (const id of requiredDsaIds) {
  expect(dsaHtml.includes(`id="${id}"`), `data-structures.html is missing #${id}.`);
}

/*
 * Protect the teaching contract for the two playback-dependent state views.
 * These focused source checks complement browser testing without pretending to
 * prove layout geometry or runtime behavior.
 */
expect(
  dsaAppSource.includes('title: "Before and After"')
    && dsaAppSource.includes('"dsa-state-summary"'),
  "Before and After is missing its redesigned state context or summary.",
);
expect(
  dsaAppSource.includes("variableComparisons(previous, step)"),
  "Before and After is not using the tested complete-state comparison helper.",
);
expect(
  dsaAppSource.includes('"dsa-change-state before"')
    && dsaAppSource.includes('"dsa-change-state after"'),
  "Before and After is missing its explicit vertical state regions.",
);
expect(
  dsaAppSource.includes('row.setAttribute("aria-current", "true")')
    && dsaAppSource.includes('"dsa-current-step-label", "Current step"'),
  "Step Table is missing its accessible current-row contract.",
);
expect(
  /\.dsa-change-grid\s*\{[\s\S]*?grid-template-columns:\s*minmax\(0,\s*1fr\)/.test(stylesSource),
  "Before and After does not retain one full-width card column.",
);
/*
 * Chunk 1 replaces the five generic Trace articles with purpose-specific
 * teaching visuals. These source assertions protect the shared orientation,
 * chronology, decision route, frame stack, and diagnostic contracts without
 * pretending that a text scan proves final browser appearance.
 */
expect(
  dsaAppSource.includes("createTraceViewShell")
    && dsaAppSource.includes("renderTraceUnavailable")
    && stylesSource.includes(".dsa-trace-hero")
    && stylesSource.includes(".dsa-trace-body"),
  "The shared Trace teaching shell is incomplete.",
);
expect(
  dsaAppSource.includes('"dsa-story-timeline"')
    && dsaAppSource.includes('"dsa-story-observation"')
    && dsaAppSource.includes('"dsa-story-phase-map"'),
  "Algorithm Story is missing chronology, current observation, or reviewed phase presentation.",
);
expect(
  dsaAppSource.includes('"dsa-decision-route"')
    && dsaAppSource.includes("VISIBLE VALUES AT THE CHECK")
    && dsaAppSource.includes("does not claim that every value shown was an operand"),
  "Decisions is missing its route or conservative visible-value boundary.",
);
expect(
  dsaAppSource.includes('"dsa-call-stack"')
    && dsaAppSource.includes("dsa-call-frame ${")
    && dsaAppSource.includes("function depth"),
  "Calls and Recursion is missing its ordered frame stack or depth context.",
);
expect(
  dsaAppSource.includes("errorCoachGuidance")
    && dsaAppSource.includes('"dsa-error-diagnostic"')
    && dsaAppSource.includes("A guaranteed repair is unavailable"),
  "Error Coach is missing its diagnostic journey or conservative repair boundary.",
);
expect(
  /\.dsa-workspace-grid\s*>\s*\.editor-panel,\s*[\s\S]*?\.dsa-learning-panel\s*\{[\s\S]*?height:\s*690px/.test(stylesSource),
  "DSA desktop panels are missing their explicit 690-pixel height boundary.",
);
expect(
  /\.dsa-view-stage\s*\{[\s\S]*?overflow:\s*auto[\s\S]*?overscroll-behavior:\s*contain[\s\S]*?scrollbar-gutter:\s*stable/.test(stylesSource),
  "DSA view stage is missing its bounded internal scrolling contract.",
);
/*
 * Chunk 2 gives all six Data views one scope-aware and evidence-aware teaching
 * language. Static checks protect the critical contracts that browser tests
 * then exercise with real traces, themes, scrolling, and graph lifecycle.
 */
expect(
  dsaAppSource.includes("createDataViewShell")
    && dsaAppSource.includes("renderDataUnavailable")
    && stylesSource.includes(".dsa-data-hero")
    && stylesSource.includes(".dsa-data-body"),
  "The shared Data teaching shell is incomplete.",
);
expect(
  dsaAppSource.includes("dataScopeGroups")
    && dsaAppSource.includes("globalsAndLocalsMatch")
    && dsaAppSource.includes('"dsa-variable-current"')
    && dsaAppSource.includes('"dsa-variable-previous"'),
  "Variables is missing scope separation, module deduplication, or adjacent values.",
);
expect(
  dsaAppSource.includes("LIMITS.watches")
    && dsaAppSource.includes("Local suggestions, not learner tracking")
    && dsaAppSource.includes("dsa-watch-state"),
  "Watches is missing its bound, privacy boundary, or visible change state.",
);
expect(
  dsaAppSource.includes("reviewedStructureCandidate")
    && dsaAppSource.includes("structureReadingGuide")
    && dsaAppSource.includes("Flattened cells do not invent child edges")
    && dsaAppSource.includes("LIMITS.structureCells"),
  "Structure Canvas is missing reviewed selection, reading guidance, honesty, or its display bound.",
);
expect(
  dsaAppSource.includes("loadDsaReferenceGraphLibrary")
    && dsaAppSource.includes("https://esm.sh/cytoscape@3.31.0")
    && dsaAppSource.includes("Playback is running. The interactive map will refresh once playback pauses.")
    && dsaAppSource.includes("The complete text map remains below.")
    && dsaAppSource.includes("LIMITS.referenceGraphElements"),
  "References is missing its optional graph, playback stability, fallback, or element bound.",
);
expect(
  dsaAppSource.includes("groupedObjectChanges")
    && dsaAppSource.includes("Affected names sharing this object")
    && dsaAppSource.includes('"dsa-mutation-journey"'),
  "Mutation Explorer is missing alias deduplication or its before-operation-after journey.",
);
expect(
  dsaAppSource.includes("Automatic satisfied or violated verdict unavailable.")
    && dsaAppSource.includes("A printed Result marker checks the reviewed program")
    && stylesSource.includes(".dsa-invariant-checklist"),
  "Invariant Checker is missing its conservative verdict boundary or reviewed checklist.",
);
/*
 * Chunk 3 gives every Flow view one ordered, playback-aware visual language.
 * These checks protect the window bounds, graph fallback, debugger row, and
 * observed-versus-reviewed complexity separation before browser verification.
 */
expect(
  dsaAppSource.includes("createFlowViewShell")
    && dsaAppSource.includes("renderFlowUnavailable")
    && dsaAppSource.includes("boundedFlowWindow")
    && stylesSource.includes(".dsa-flow-hero")
    && stylesSource.includes(".dsa-flow-body"),
  "The shared Flow teaching shell or bounded-window contract is incomplete.",
);
expect(
  dsaAppSource.includes('"dsa-flow-current-operation"')
    && dsaAppSource.includes('"dsa-flow-operation-spine"')
    && dsaAppSource.includes("LIMITS.operationJourneyRows"),
  "Operation Journey is missing its selected summary, ordered spine, or event bound.",
);
expect(
  dsaAppSource.includes("enhanceAlgorithmPathGraph")
    && dsaAppSource.includes("disposeAlgorithmPathGraph")
    && dsaAppSource.includes("The complete ordered transition list remains below.")
    && dsaAppSource.includes("LIMITS.algorithmPathSteps")
    && stylesSource.includes(".dsa-flow-transition-list"),
  "Algorithm Path is missing its optional graph, complete fallback, lifecycle, or step bound.",
);
expect(
  dsaAppSource.includes('table.setAttribute("aria-label", "Recorded DSA execution steps")')
    && dsaAppSource.includes('"dsa-step-source"')
    && dsaAppSource.includes("LIMITS.stepTableRows")
    && stylesSource.includes(".dsa-step-table thead"),
  "Step Table is missing its debugger context, executed source, row bound, or sticky header.",
);
expect(
  dsaAppSource.includes('"dsa-flow-event-bars"')
    && dsaAppSource.includes("These counts describe one recorded run and one playback prefix.")
    && dsaAppSource.includes("This Big O statement belongs to the exact unchanged reviewed program.")
    && stylesSource.includes(".dsa-flow-complexity-formulas"),
  "Complexity Lab is missing measured bars, evidence honesty, or reviewed formula separation.",
);
/*
 * Chunk 4 turns all three Labs views into explicit local experiments. These
 * checks protect exact input order, session-only comparison bounds, reviewed
 * edge-case honesty, and the shared beginner orientation before browser tests.
 */
expect(
  dsaAppSource.includes("createLabsViewShell")
    && dsaAppSource.includes("renderLabsUnavailable")
    && stylesSource.includes(".dsa-labs-hero")
    && stylesSource.includes(".dsa-labs-body"),
  "The shared Labs experiment shell or designed unavailable state is incomplete.",
);
expect(
  dsaAppSource.includes("preparedInputQueue")
    && dsaAppSource.includes("LIMITS.preparedInputCharacters")
    && dsaAppSource.includes("LIMITS.preparedInputPreviewRows")
    && dsaAppSource.includes('"dsa-input-consumption-list"')
    && dsaAppSource.includes("The prepared queue changed after the latest run."),
  "Input Playground is missing exact queue order, display bounds, observed prompt mapping, or stale-run guidance.",
);
expect(
  dsaAppSource.includes("comparisonRunCard")
    && dsaAppSource.includes("LIMITS.comparisonRuns")
    && dsaAppSource.includes("state.activeRunInputs")
    && dsaAppSource.includes('"dsa-comparison-assessment"')
    && dsaAppSource.includes("not proof that one algorithm is universally faster"),
  "Compare Algorithms is missing two bounded slots, exact run inputs, its fairness check, or evidence honesty.",
);
expect(
  dsaAppSource.includes('"dsa-edge-method-steps"')
    && dsaAppSource.includes('"dsa-edge-card-list"')
    && dsaAppSource.includes("Code Explorer does not record which prompt you attempted")
    && !dsaAppSource.includes("edgeCaseCompleted"),
  "Edge Case Lab is missing its prediction workflow or contains a learner-progress contract.",
);
expect(
  stylesSource.includes(".dsa-input-workspace")
    && stylesSource.includes(".dsa-comparison-slots")
    && stylesSource.includes(".dsa-edge-experiment-card"),
  "The three Labs views are missing purpose-specific visual systems.",
);

if (failures.length) {
  console.error(`DSA foundation validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("DSA foundation validation passed.");
  console.log(`Validated ${DSA_VIEWS.length} views, ${DSA_EVENT_TYPES.length} events, ${DSA_STRUCTURE_TYPES.length} structures, and the ${DSA_CATALOG_TARGET}-program target.`);
}
