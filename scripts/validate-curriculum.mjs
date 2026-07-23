/**
 * Code Explorer curriculum validator
 *
 * This read-only development script checks the complete catalog without opening
 * a browser. It combines the original examples embedded in app.js with the new
 * curriculum module and validates catalog invariants. An optional export path
 * produces detached JSON for the companion Python execution validator.
 *
 * Browser tests remain necessary for navigation and Pyodide integration. This
 * script provides a fast first line of defence against duplicate titles,
 * incorrect counts and incomplete metadata before deeper execution tests.
 */

// Node's strict assertion helpers produce readable failures and a nonzero exit code.
import assert from "node:assert/strict";
// The file API reads source only. The validator never rewrites application files.
import fs from "node:fs";
// A small VM context evaluates only the two data literals extracted from app.js.
import vm from "node:vm";
// URL conversion finds repository files reliably regardless of the caller's directory.
import { fileURLToPath } from "node:url";

// The module URL points to scripts/, so one parent URL resolves the repository root.
const repositoryRoot = fileURLToPath(new URL("../", import.meta.url));
// app.js contains the preserved original corpus and the starter source constant it references.
const applicationSource = fs.readFileSync(`${repositoryRoot}app.js`, "utf8");

/**
 * Extracts one JavaScript source fragment or stops with a useful validator error.
 * @param {RegExp} pattern Pattern containing the desired source as capture group one.
 * @param {string} label Beginner-readable name used in the failure message.
 * @returns {string} Captured JavaScript source.
 */
function requiredMatch(pattern, label) {
  const match = applicationSource.match(pattern);
  assert.ok(match, `Could not locate ${label} in app.js.`);
  return match[1];
}

// DEFAULT_CODE is evaluated with the base array because one original record references it.
const defaultDeclaration = requiredMatch(/(const DEFAULT_CODE = `[\s\S]*?`;)/, "DEFAULT_CODE");
// The following documentation comment is a stable boundary after the complete base array.
const baseLiteral = requiredMatch(
  /const BASE_EXAMPLES = (\[[\s\S]*?\n\]);\n\n\/\*\*\n \* The complete curriculum/,
  "BASE_EXAMPLES",
);
// The context contains no browser APIs, network APIs, or project state.
const dataContext = {};
vm.runInNewContext(`${defaultDeclaration}\nBASE_EXAMPLES = ${baseLiteral}`, dataContext);

// The new records are ordinary frozen data and can be imported directly in Node.
const { ADDITIONAL_EXAMPLES } = await import(new URL("../curriculum.js", import.meta.url));
// The production matcher is tested against real reviewed records, not a mock schema.
const { catalogSearchText, matchesCatalogSearch } = await import(new URL("../catalog-search.js", import.meta.url));
// A fresh array mirrors the merge performed by app.js without mutating either source collection.
const examples = [...dataContext.BASE_EXAMPLES, ...ADDITIONAL_EXAMPLES];

// These values are the approved curriculum table and should change only with a reviewed release.
const expectedCounts = Object.freeze({
  "First Steps": 10,
  "Variables and Types": 10,
  "Operators and Expressions": 10,
  Strings: 8,
  Decisions: 12,
  Loops: 16,
  "Functions and Scope": 16,
  Collections: 16,
  "References and Mutation": 8,
  "Input, Errors and Debugging": 8,
  "Classes and Objects": 8,
  "Guided Mini Programs": 12,
});

// The combined catalog must match the public total before deeper validation begins.
assert.equal(examples.length, 134, "The curriculum must contain exactly 134 programs.");
assert.equal(dataContext.BASE_EXAMPLES.length, 54, "The preserved base corpus must contain 54 programs.");
assert.equal(ADDITIONAL_EXAMPLES.length, 80, "The expanded module must contain 80 new programs.");

// Titles are learner-facing identifiers, so duplicates would make cards and documentation ambiguous.
const titles = examples.map((example) => example.title);
assert.equal(new Set(titles).size, titles.length, "Every curriculum title must be unique.");

// Validate every record before counting so a malformed object cannot hide inside a correct total.
for (const [index, example] of examples.entries()) {
  const position = index + 1;
  assert.ok(expectedCounts[example.category], `Program ${position} has an unknown category: ${example.category}`);
  assert.ok(["Beginner", "Developing", "Guided Challenge"].includes(example.level), `${example.title} has an unknown level.`);
  assert.ok(typeof example.topic === "string" && example.topic.trim(), `${example.title} needs a topic.`);
  assert.ok(typeof example.description === "string" && example.description.trim(), `${example.title} needs a description.`);
  assert.ok(Array.isArray(example.views) && example.views.length >= 3, `${example.title} needs at least three recommended views.`);
  assert.ok(typeof example.code === "string" && example.code.trim(), `${example.title} needs Python source.`);
  if (example.category === "Guided Mini Programs") {
    assert.ok(Array.isArray(example.prerequisites) && example.prerequisites.length >= 3, `${example.title} needs prerequisites.`);
    assert.ok(expectedCounts[example.checkpointAfter], `${example.title} needs a valid checkpoint placement.`);
  }
}

// Compute actual bucket totals and compare each approved category independently.
const actualCounts = Object.fromEntries(Object.keys(expectedCounts).map((category) => [
  category,
  examples.filter((example) => example.category === category).length,
]));
assert.deepEqual(actualCounts, expectedCounts, "Curriculum bucket totals do not match the approved table.");

// Three preserved examples intentionally stop so Error Coach can teach a specific exception.
const intentionalErrors = examples.filter((example) => example.expectedError);
assert.equal(intentionalErrors.length, 3, "Exactly three programs should intentionally raise an error.");

/*
 * Search regression checks prove that displayed information, hidden metadata,
 * source text, AND terms, and an empty query follow the public catalog contract.
 */
const indexedExamples = examples.map((example) => ({
  example,
  searchText: catalogSearchText(example),
}));
const searchExamples = (query) => indexedExamples
  .filter(({ searchText }) => matchesCatalogSearch(searchText, query))
  .map(({ example }) => example);
assert.equal(
  searchExamples("Intentional KeyError").length,
  1,
  "Python search should find exactly one intentional KeyError program.",
);
assert.equal(
  searchExamples("Intentional KeyError")[0].title,
  "A key to investigate",
  "Python hidden error metadata should find the dictionary-key investigation.",
);
assert.ok(
  searchExamples("class pet feed").some((example) => example.title === "Object-Oriented Pet Care Tracker"),
  "Python search should match source-code terms inside the pet checkpoint.",
);
assert.equal(searchExamples("").length, examples.length, "An empty Python search should match all programs.");

// A caller may request a temporary detached catalog for the Python validator.
// The export is explicit so ordinary validation remains read-only.
const exportFlagIndex = process.argv.indexOf("--export");
if (exportFlagIndex !== -1) {
  const exportPath = process.argv[exportFlagIndex + 1];
  assert.ok(exportPath, "--export requires a destination path.");
  fs.writeFileSync(exportPath, JSON.stringify(examples), "utf8");
}

// The concise success report is suitable for local checks and future continuous integration.
console.log(`Validated catalog: 54 preserved + 80 new = ${examples.length} programs.`);
console.log(Object.entries(actualCounts).map(([category, count]) => `${category}: ${count}`).join("\n"));
if (exportFlagIndex !== -1) console.log(`Exported detached curriculum JSON to ${process.argv[exportFlagIndex + 1]}.`);
