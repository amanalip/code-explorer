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

// Read shipped pages as text so routing checks stay dependency-free and fast.
const [landingHtml, pythonHtml, dsaHtml] = await Promise.all([
  readFile(new URL("../index.html", import.meta.url), "utf8"),
  readFile(new URL("../workspace.html", import.meta.url), "utf8"),
  readFile(new URL("../data-structures.html", import.meta.url), "utf8"),
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
  "dsaExamplesDialog", "dsaExampleFilters", "dsaExampleCount", "dsaExampleGrid",
  "dsaCommentsDialog", "dsaCommentPreview", "dsaAutomaticPreview", "toast",
];
for (const id of requiredDsaIds) {
  expect(dsaHtml.includes(`id="${id}"`), `data-structures.html is missing #${id}.`);
}

if (failures.length) {
  console.error(`DSA foundation validation failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log("DSA foundation validation passed.");
  console.log(`Validated ${DSA_VIEWS.length} views, ${DSA_EVENT_TYPES.length} events, ${DSA_STRUCTURE_TYPES.length} structures, and the ${DSA_CATALOG_TARGET}-program target.`);
}
