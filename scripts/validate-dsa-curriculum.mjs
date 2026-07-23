/**
 * Structural and teaching-metadata validator for the Chunk 1 DSA curriculum.
 *
 * This dependency-free script proves exact counts, schema completeness,
 * contract references, source uniqueness, useful source depth, and documented
 * expected-result fields before exporting detached programs for Python checks.
 */

import { writeFile } from "node:fs/promises";
import {
  DSA_EVENT_TYPES,
  DSA_PROGRAM_REQUIRED_FIELDS,
  DSA_STRUCTURE_TYPES,
  DSA_VIEWS,
} from "../dsa-contracts.js";
import {
  DSA_CHUNK_ONE_PROGRAMS,
  DSA_CHUNK_ONE_SECTIONS,
  DSA_DIFFICULTIES,
} from "../dsa-curriculum.js";

/** Throws a readable release-blocking error when one contract is false. */
function expect(condition, message) {
  if (!condition) throw new Error(message);
}

/** Returns nonblank source lines because blank formatting is not lesson depth. */
function sourceLines(program) {
  return program.code.split("\n").filter((line) => line.trim()).length;
}

/** Normalizes only formatting so genuinely identical programs cannot hide. */
function normalizedSource(program) {
  return program.code.replace(/\s+/g, " ").trim();
}

/** Measures shared nonblank lines for a conservative near-duplicate report. */
function lineSimilarity(leftProgram, rightProgram) {
  const left = new Set(leftProgram.code.split("\n").map((line) => line.trim()).filter(Boolean));
  const right = new Set(rightProgram.code.split("\n").map((line) => line.trim()).filter(Boolean));
  const shared = [...left].filter((line) => right.has(line)).length;
  const union = new Set([...left, ...right]).size;
  return union ? shared / union : 0;
}

const sectionNames = new Set(DSA_CHUNK_ONE_SECTIONS.map(([name]) => name));
const structureNames = new Set(DSA_STRUCTURE_TYPES);
const eventNames = new Set(DSA_EVENT_TYPES);
const viewNames = new Set(DSA_VIEWS.map((view) => view.label));
const difficultyNames = new Set(DSA_DIFFICULTIES);

expect(DSA_CHUNK_ONE_PROGRAMS.length === 131, `Chunk 1 has ${DSA_CHUNK_ONE_PROGRAMS.length} programs, not 131.`);

const uniqueIds = new Set();
const uniqueTitles = new Set();
const uniqueObjectives = new Set();
const uniqueSources = new Set();

for (const program of DSA_CHUNK_ONE_PROGRAMS) {
  for (const field of DSA_PROGRAM_REQUIRED_FIELDS) {
    expect(field in program, `${program.id} is missing required field ${field}.`);
  }

  expect(!uniqueIds.has(program.id), `Duplicate program id: ${program.id}.`);
  expect(!uniqueTitles.has(program.title), `Duplicate program title: ${program.title}.`);
  expect(!uniqueObjectives.has(program.objective), `Duplicate objective: ${program.objective}.`);
  expect(!uniqueSources.has(normalizedSource(program)), `Duplicate source: ${program.title}.`);
  uniqueIds.add(program.id);
  uniqueTitles.add(program.title);
  uniqueObjectives.add(program.objective);
  uniqueSources.add(normalizedSource(program));

  expect(sectionNames.has(program.section), `${program.id} uses unknown section ${program.section}.`);
  expect(difficultyNames.has(program.difficulty), `${program.id} uses unknown difficulty ${program.difficulty}.`);
  expect(sourceLines(program) >= 7, `${program.id} has fewer than 7 meaningful source lines.`);
  expect(program.expectedResult.length > 0, `${program.id} has no expected result.`);
  expect(program.algorithm.length > 0, `${program.id} has no algorithm label.`);
  expect(program.phases.length >= 3, `${program.id} needs at least three reviewed phases.`);
  expect(program.bestViews.length >= 3, `${program.id} needs at least three recommended views.`);
  expect(program.eventTypes.length >= 2, `${program.id} needs at least two expected event types.`);
  expect(typeof program.complexity?.time === "string", `${program.id} has no time-complexity context.`);
  expect(typeof program.complexity?.space === "string", `${program.id} has no space-complexity context.`);
  expect(typeof program.complexity?.note === "string", `${program.id} has no complexity evidence note.`);

  for (const structure of program.structureTypes) {
    expect(structureNames.has(structure), `${program.id} uses unknown structure ${structure}.`);
  }
  for (const eventType of program.eventTypes) {
    expect(eventNames.has(eventType), `${program.id} uses unknown event ${eventType}.`);
  }
  for (const viewName of program.bestViews) {
    expect(viewNames.has(viewName), `${program.id} recommends unknown view ${viewName}.`);
  }
}

for (const [section, expectedCount] of DSA_CHUNK_ONE_SECTIONS) {
  const actualCount = DSA_CHUNK_ONE_PROGRAMS.filter((program) => program.section === section).length;
  expect(actualCount === expectedCount, `${section} has ${actualCount} programs, not ${expectedCount}.`);
}

// Similarity above this conservative threshold blocks obvious copy variants.
const nearDuplicates = [];
for (let left = 0; left < DSA_CHUNK_ONE_PROGRAMS.length; left += 1) {
  for (let right = left + 1; right < DSA_CHUNK_ONE_PROGRAMS.length; right += 1) {
    const similarity = lineSimilarity(DSA_CHUNK_ONE_PROGRAMS[left], DSA_CHUNK_ONE_PROGRAMS[right]);
    if (similarity >= 0.9) {
      nearDuplicates.push({
        left: DSA_CHUNK_ONE_PROGRAMS[left].id,
        right: DSA_CHUNK_ONE_PROGRAMS[right].id,
        similarity,
      });
    }
  }
}
expect(nearDuplicates.length === 0, `Near-duplicate sources found: ${JSON.stringify(nearDuplicates)}.`);

const lineCounts = DSA_CHUNK_ONE_PROGRAMS.map(sourceLines).sort((left, right) => left - right);
const longPrograms = lineCounts.filter((count) => count >= 15).length;
expect(longPrograms >= 25, `Only ${longPrograms} Chunk 1 programs have at least 15 meaningful lines.`);

const sectionReport = Object.fromEntries(
  DSA_CHUNK_ONE_SECTIONS.map(([section]) => {
    const counts = DSA_CHUNK_ONE_PROGRAMS
      .filter((program) => program.section === section)
      .map(sourceLines)
      .sort((left, right) => left - right);
    return [section, {
      count: counts.length,
      minimum: counts[0],
      median: counts[Math.floor(counts.length / 2)],
      maximum: counts.at(-1),
    }];
  }),
);

const exportFlag = process.argv.indexOf("--export");
if (exportFlag !== -1) {
  const exportPath = process.argv[exportFlag + 1];
  expect(exportPath, "--export requires a destination path.");
  await writeFile(exportPath, JSON.stringify(DSA_CHUNK_ONE_PROGRAMS, null, 2));
  console.log(`Exported ${DSA_CHUNK_ONE_PROGRAMS.length} detached DSA programs to ${exportPath}.`);
}

console.log("Chunk 1 DSA curriculum validation passed.");
console.log(JSON.stringify(sectionReport, null, 2));
console.log(`${longPrograms} programs contain at least 15 meaningful source lines.`);
