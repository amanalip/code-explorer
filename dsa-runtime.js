/**
 * Pure evidence helpers for the Data Structures and Algorithms workspace.
 *
 * These functions never execute learner code and never read browser state.
 * They transform already recorded Python snapshots into conservative changes,
 * operation cues, condition outcomes, structure candidates, and study text.
 */

/** Generated comments use one exact prefix so later runs can replace only their own notes. */
export const DSA_COMMENT_PREFIX = "# Code Explorer DSA:";

/**
 * Combines visible globals and active locals for one recorded snapshot.
 * Local values intentionally win because they are closest to the active line.
 *
 * @param {object|null} step Recorded Python snapshot.
 * @returns {Record<string, object>} Serialized visible variables.
 */
export function variablesForStep(step) {
  if (!step) return {};
  return { ...(step.globals || {}), ...(step.locals || {}) };
}

/**
 * Compares serialized display values without claiming the snapshots are live
 * Python objects.
 *
 * @param {object|null} previousStep Earlier recorded snapshot.
 * @param {object|null} currentStep Current recorded snapshot.
 * @returns {Array<object>} Created, removed, or changed name records.
 */
export function variableChanges(previousStep, currentStep) {
  const previous = variablesForStep(previousStep);
  const current = variablesForStep(currentStep);
  const names = [...new Set([...Object.keys(previous), ...Object.keys(current)])].sort();
  const changes = [];

  for (const name of names) {
    const before = previous[name];
    const after = current[name];
    const beforeKey = before ? JSON.stringify(before) : null;
    const afterKey = after ? JSON.stringify(after) : null;
    if (beforeKey === afterKey) continue;
    changes.push({
      name,
      kind: !before ? "created" : !after ? "removed" : "changed",
      before,
      after,
    });
  }
  return changes;
}

/**
 * Builds the complete ordered state comparison used by Before and After.
 *
 * Unlike variableChanges(), this helper retains unchanged names. A removed name
 * remains for its final before-to-after comparison, then disappears on the next
 * pair of snapshots when neither side contains it. Keeping this transformation
 * pure makes playback growth and scope-exit behavior testable without a browser.
 *
 * @param {object|null} previousStep Earlier recorded snapshot.
 * @param {object|null} currentStep Selected recorded snapshot.
 * @returns {Array<object>} Created, changed, removed, or unchanged comparisons.
 */
export function variableComparisons(previousStep, currentStep) {
  const previous = variablesForStep(previousStep);
  const current = variablesForStep(currentStep);
  const changesByName = new Map(
    variableChanges(previousStep, currentStep).map((change) => [change.name, change]),
  );
  const names = [...new Set([...Object.keys(previous), ...Object.keys(current)])].sort();

  return names.map((name) => changesByName.get(name) || {
    name,
    kind: "unchanged",
    before: previous[name],
    after: current[name],
  });
}

/**
 * Maps an executed Python line to one normalized DSA event only when its source
 * and recorded changes provide a direct cue. Unknown lines remain neutral.
 *
 * @param {object} step Recorded Python snapshot.
 * @param {Array<object>} changes Changes caused by the completed line.
 * @returns {{type: string, explanation: string}} Conservative observed event.
 */
export function classifyDsaEvent(step, changes) {
  const source = String(step?.source || "").trim();
  const rules = [
    [/\b(?:append|extend|insert|add|setdefault)\s*\(/, "INSERT", "A container insertion call completed on this line."],
    [/\b(?:pop|popleft|remove|discard|clear)\s*\(/, "REMOVE", "A container removal call completed on this line."],
    [/\bappendleft\s*\(/, "ENQUEUE", "A value was added at the left end of a deque."],
    [/\brotate\s*\(/, "ROTATE", "A deque rotation completed on this line."],
    [/\bheapq\.heappop\s*\(/, "POP", "The heap removed its current root value."],
    [/\bheapq\.(?:heappush|heapify)\s*\(/, "PUSH", "A heap construction or insertion operation completed."],
    [/\b(?:left|right|low|high|middle|boundary|front|rear|write)\s*(?:\+=|-=|=)/, "UPDATE_BOUNDARY", "An index or boundary name changed."],
    [/\[[^\]]+\]\s*,\s*[^=]+=\s*[^,]+,/, "SWAP", "Python completed a multiple assignment that exchanges positions."],
    [/\b(?:if|elif|while)\b.*(?:==|!=|<=|>=|<|>|\bin\b)/, "COMPARE", "Python evaluated a condition containing a comparison."],
    [/^for\b/, "VISIT_INDEX", "Python advanced a recorded loop iteration."],
    [/^return\b/, "RETURN_RESULT", "A function returned a recorded result."],
    [/^print\s*\(/, "RETURN_RESULT", "The program reported a result to console output."],
  ];

  for (const [pattern, type, explanation] of rules) {
    if (pattern.test(source)) return { type, explanation };
  }
  if (changes.some((change) => change.kind === "changed")) {
    return { type: "WRITE", explanation: "At least one recorded name or value changed after this line." };
  }
  if (changes.some((change) => change.kind === "created")) {
    return { type: "WRITE", explanation: "Python created at least one recorded name after this line." };
  }
  return { type: "READ", explanation: "Python completed this line without a recorded visible value change." };
}

/**
 * Infers only the branch Python actually took from the next recorded line.
 *
 * @param {object} step Condition-line snapshot.
 * @param {Array<object>} conditions Static if-statement boundaries.
 * @param {Array<object>} loops Static loop boundaries.
 * @returns {boolean|null} Observed true or false route, or null if ambiguous.
 */
export function observedConditionOutcome(step, conditions, loops) {
  const condition = conditions.find((item) => item.line === step?.line);
  if (condition) {
    if (step.nextLine === condition.bodyLine) return true;
    if (step.nextLine === condition.elseLine || step.nextLine > condition.endLine) return false;
  }
  const loop = loops.find((item) => item.type === "while" && item.line === step?.line);
  if (loop) {
    if (step.nextLine === loop.bodyLine) return true;
    if (step.nextLine && (step.nextLine <= loop.line || step.nextLine > loop.endLine)) return false;
  }
  return null;
}

/**
 * Finds the nearest earlier snapshot that executed a known condition.
 *
 * @param {Array<object>} trace Complete trace.
 * @param {number} index Current trace index.
 * @param {Array<object>} conditions Static conditions.
 * @param {Array<object>} loops Static loops.
 * @returns {{step: object, metadata: object}|null} Nearest recorded condition.
 */
export function nearestCondition(trace, index, conditions, loops) {
  for (let cursor = index; cursor >= 0; cursor -= 1) {
    const step = trace[cursor];
    const metadata = conditions.find((item) => item.line === step.line)
      || loops.find((item) => item.type === "while" && item.line === step.line);
    if (metadata) return { step, metadata };
  }
  return null;
}

/**
 * Chooses the richest serialized container visible in one snapshot.
 *
 * @param {object|null} step Recorded snapshot.
 * @returns {{name: string, value: object}|null} Container candidate.
 */
export function structureCandidate(step) {
  const variables = variablesForStep(step);
  const candidates = Object.entries(variables)
    .filter(([, value]) => Array.isArray(value?.items) || Array.isArray(value?.entries))
    .sort((left, right) => (right[1].length || 0) - (left[1].length || 0));
  return candidates.length ? { name: candidates[0][0], value: candidates[0][1] } : null;
}

/**
 * Converts one serialized value into a bounded readable label.
 *
 * @param {object|null|undefined} value Serialized worker value.
 * @returns {string} Safe display text.
 */
export function serializedLabel(value) {
  if (!value) return "not set";
  return String(value.display ?? value.value ?? value.type ?? "value");
}

/**
 * Builds a portable commented document from worker notes and reviewed catalog
 * context while preserving learner comments, blank lines, and indentation.
 *
 * @param {string} source Original Python source.
 * @param {Array<object>} learningComments Syntax and trace-backed worker notes.
 * @param {object|null} program Matching reviewed curriculum record, if any.
 * @param {number} maximumLevel Highest worker detail level to include.
 * @returns {string} Complete generated study copy.
 */
export function buildDsaCommentedSource(source, learningComments, program, maximumLevel = 3) {
  const sourceLines = source
    .split("\n")
    .filter((line) => !line.trimStart().startsWith(DSA_COMMENT_PREFIX));
  const notesByLine = new Map();

  for (const note of learningComments || []) {
    if (!Number.isInteger(note.line) || note.line < 1 || !note.text) continue;
    // Missing or malformed levels are omitted instead of bypassing the selected detail boundary.
    if (!Number.isInteger(note.level) || note.level > maximumLevel) continue;
    if (!notesByLine.has(note.line)) notesByLine.set(note.line, []);
    notesByLine.get(note.line).push(note.text);
  }

  const output = [];
  if (program) {
    output.push(`${DSA_COMMENT_PREFIX} Reviewed program: ${program.title}.`);
    output.push(`${DSA_COMMENT_PREFIX} Objective: ${program.objective}`);
    output.push(`${DSA_COMMENT_PREFIX} Reviewed time: ${program.complexity.time}; space: ${program.complexity.space}.`);
    output.push("");
  }

  sourceLines.forEach((line, index) => {
    const oneBasedLine = index + 1;
    const indentation = line.match(/^\s*/)?.[0] || "";
    for (const noteText of notesByLine.get(oneBasedLine) || []) {
      output.push(`${indentation}${DSA_COMMENT_PREFIX} ${noteText}`);
    }
    output.push(line);
  });
  return output.join("\n");
}
