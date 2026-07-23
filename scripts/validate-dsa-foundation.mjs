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

// Read shipped pages and the two view sources as text so routing and visual-state contracts stay dependency-free and fast.
const [landingHtml, pythonHtml, dsaHtml, dsaAppSource, stylesSource] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../workspace.html", import.meta.url), "utf8"),
  readFile(new URL("../data-structures.html", import.meta.url), "utf8"),
  readFile(new URL("../dsa-app.js", import.meta.url), "utf8"),
  readFile(new URL("../styles.css", import.meta.url), "utf8"),
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

// Every id read by the DSA controller must exist in the dedicated document.
const requiredDsaIds = [
  "runtimeStatus", "runtimeLabel", "themeButton", "themeLabel", "dsaEditor",
  "dsaEditorShell", "dsaWrapButton", "dsaAutomaticCommentsButton",
  "dsaFontSizeSelect", "dsaCopyButton", "dsaPasteButton", "dsaCodeStats",
  "dsaAreaNav", "dsaViewTabs", "dsaViewStage", "dsaStepCount",
  "dsaImplementedCount", "dsaSectionCount", "dsaStructureCount", "dsaCatalogTarget",
  "dsaExamplesButton", "dsaLearningCommentsButton", "dsaRunButton",
  "dsaPreviousButton", "dsaPlayButton", "dsaNextButton", "dsaRestartButton",
  "dsaTimeline", "dsaProgressLabel", "dsaSpeedSelect", "dsaConsoleOutput",
  "dsaExamplesDialog", "dsaExampleSearchInput", "dsaExampleFilters", "dsaExampleCount", "dsaExampleGrid",
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
  dsaAppSource.includes("Visible variable state at this step"),
  "Before and After is missing its complete visible-state heading.",
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
expect(
  /\.dsa-workspace-grid\s*>\s*\.editor-panel,\s*[\s\S]*?\.dsa-learning-panel\s*\{[\s\S]*?height:\s*690px/.test(stylesSource),
  "DSA desktop panels are missing their explicit 690-pixel height boundary.",
);
expect(
  /\.dsa-view-stage\s*\{[\s\S]*?overflow:\s*auto[\s\S]*?overscroll-behavior:\s*contain[\s\S]*?scrollbar-gutter:\s*stable/.test(stylesSource),
  "DSA view stage is missing its bounded internal scrolling contract.",
);

if (failures.length) {
  console.error(`DSA foundation validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("DSA foundation validation passed.");
  console.log(`Validated ${DSA_VIEWS.length} views, ${DSA_EVENT_TYPES.length} events, ${DSA_STRUCTURE_TYPES.length} structures, and the ${DSA_CATALOG_TARGET}-program target.`);
}
