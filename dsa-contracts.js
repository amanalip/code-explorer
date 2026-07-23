/**
 * Data Structures and Algorithms shared contracts.
 *
 * Chunk 0 defined stable names and relationships. Chunk 1 connects the first
 * six curriculum sections to bounded execution and evidence-aware views.
 * Remaining catalog sections are still planning contracts, not implementation
 * claims.
 */

/** Four bounded navigation areas keep eighteen views approachable. */
export const DSA_AREAS = Object.freeze([
  { id: "trace", label: "Trace", question: "What is the algorithm doing?" },
  { id: "data", label: "Data", question: "What values and structures exist?" },
  { id: "flow", label: "Flow", question: "Where did the algorithm travel?" },
  { id: "labs", label: "Labs", question: "What changes when I experiment?" },
]);

/**
 * Final approved DSA view inventory.
 *
 * Purpose text describes the intended learner question. Chunk 1 renderers use
 * observed trace evidence, reviewed curriculum context, or an explicit
 * unavailable state according to the source and selected view.
 */
export const DSA_VIEWS = Object.freeze([
  { id: "algorithm-story", area: "trace", label: "Algorithm Story", purpose: "Connect the selected Python step to a reviewed algorithm action when evidence supports it." },
  { id: "before-after", area: "trace", label: "Before and After", purpose: "Compare adjacent states and identify exactly what changed." },
  { id: "decisions", area: "trace", label: "Decisions", purpose: "Explain observed comparisons and the path selected by a condition." },
  { id: "calls-recursion", area: "trace", label: "Calls and Recursion", purpose: "Follow calls, active frames, base cases, recursive depth, and returns." },
  { id: "error-coach", area: "trace", label: "Error Coach", purpose: "Explain a recorded failure and suggest the first safe evidence to inspect." },
  { id: "variables", area: "data", label: "Variables", purpose: "Inspect scope-aware names, values, types, and histories." },
  { id: "watches", area: "data", label: "Watches", purpose: "Follow selected indices, boundaries, counters, pointers, and accumulators." },
  { id: "structure-canvas", area: "data", label: "Structure Canvas", purpose: "Draw a supported structure with a renderer that matches its representation." },
  { id: "references", area: "data", label: "References", purpose: "Map conceptual name, node, and object relationships without claiming physical RAM addresses." },
  { id: "mutation-explorer", area: "data", label: "Mutation Explorer", purpose: "Separate in-place structure changes from name reassignment." },
  { id: "invariant-checker", area: "data", label: "Invariant Checker", purpose: "Evaluate reviewed structure and algorithm rules against recorded evidence." },
  { id: "operation-journey", area: "flow", label: "Operation Journey", purpose: "Place the current event inside a complete insert, remove, search, traversal, or update operation." },
  { id: "algorithm-path", area: "flow", label: "Algorithm Path", purpose: "Show visited indices, nodes, edges, states, or subproblems and an optional source-coverage layer." },
  { id: "step-table", area: "flow", label: "Step Table", purpose: "Compare values and structure actions across iterations or algorithm phases." },
  { id: "complexity-lab", area: "flow", label: "Complexity Lab", purpose: "Keep observed operation counts separate from reviewed theoretical complexity." },
  { id: "input-playground", area: "labs", label: "Input Playground", purpose: "Prepare controlled input values without uploading them or changing source." },
  { id: "compare-algorithms", area: "labs", label: "Compare Algorithms", purpose: "Compare compatible reviewed programs or runs using equivalent inputs and counters." },
  { id: "edge-case-lab", area: "labs", label: "Edge Case Lab", purpose: "Study reviewed empty, minimal, duplicate, missing, sorted, reversed, and boundary cases." },
]);

/** Evidence labels prevent a polished interface from hiding uncertainty. */
export const DSA_EVIDENCE_LABELS = Object.freeze({
  observed: "Observed",
  curriculum: "Curriculum context",
  unavailable: "Unavailable",
  shortened: "Shortened",
});

/**
 * Normalized runtime vocabulary used by Chunk 1 cues and reserved for later
 * structure-specific instrumentation. Events remain neutral facts; renderers
 * add meaning only after checking trace evidence and curriculum metadata.
 */
export const DSA_EVENT_TYPES = Object.freeze([
  "COMPARE", "READ", "WRITE", "SWAP", "VISIT_INDEX", "VISIT_NODE", "VISIT_EDGE",
  "INSERT", "REMOVE", "PUSH", "POP", "ENQUEUE", "DEQUEUE", "PEEK", "LINK",
  "UNLINK", "ROTATE", "PARTITION", "MERGE", "RELAX_EDGE", "UNION", "FIND",
  "MARK_VISITED", "UPDATE_BOUNDARY", "ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM",
  "CHOOSE", "REJECT", "BACKTRACK", "CHECK_INVARIANT", "RETURN_RESULT",
]);

/** Supported representation names guide current and later bounded renderers. */
export const DSA_STRUCTURE_TYPES = Object.freeze([
  "python-list", "array", "stack", "queue", "deque", "priority-queue", "singly-linked-list",
  "doubly-linked-list", "circular-linked-list", "hash-table", "set", "tree",
  "binary-tree", "binary-search-tree", "heap", "trie", "graph", "union-find",
  "dynamic-programming-table", "bit-set",
]);

/** Approved Tier A section totals preserved independently from program data. */
export const DSA_CATALOG_SECTIONS = Object.freeze([
  ["Algorithm and complexity foundations", 24],
  ["Abstract data types and representations", 12],
  ["Python-native containers", 42],
  ["Arrays and sequence techniques", 20],
  ["Searching", 9],
  ["Sorting and sorting properties", 24],
  ["Stacks, queues, and deques", 22],
  ["Linked structures", 20],
  ["Hash tables and set algorithms", 24],
  ["Trees and binary search trees", 30],
  ["Heaps and priority queues", 18],
  ["Tries and string algorithms", 24],
  ["Union-Find", 10],
  ["Graph structures and vocabulary", 24],
  ["Graph traversal and connectivity", 20],
  ["Shortest paths and spanning trees", 14],
  ["Recursion", 18],
  ["Backtracking", 16],
  ["Divide and conquer", 10],
  ["Greedy algorithms", 16],
  ["Dynamic programming", 24],
  ["Bit manipulation", 16],
  ["Elementary mathematical algorithms", 14],
  ["Edge-case and debugging investigations", 48],
  ["Integrated guided challenges", 36],
]);

/** Required metadata fields enforced by the current DSA curriculum validator. */
export const DSA_PROGRAM_REQUIRED_FIELDS = Object.freeze([
  "id", "title", "section", "difficulty", "objective", "prerequisites", "code",
  "preparedInputs", "expectedResult", "structureTypes", "algorithm", "phases",
  "invariants", "edgeCases", "comparisonGroup", "complexity", "bestViews",
  "intentionalError",
]);

/** Exact approved Tier A program total derived from the section contract. */
export const DSA_CATALOG_TARGET = DSA_CATALOG_SECTIONS.reduce((total, section) => total + section[1], 0);
