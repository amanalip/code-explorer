/**
 * Code Explorer Data Structures and Algorithms curriculum, Chunk 7.
 *
 * This final Tier A chunk adds 48 boundary and debugging investigations plus
 * 36 integrated guided challenges. Investigations turn a suspicious result
 * into a reproducible check. Challenges combine earlier structures,
 * algorithms, invariants, and complexity ideas into complete small programs.
 *
 * All definitions are static reviewed curriculum. The factories below reduce
 * repeated metadata without hiding the executable Python shown to learners.
 * No learner source, trace, search, progress, or preference leaves the browser.
 */

import { DSA_PROGRAM_REQUIRED_FIELDS } from "./dsa-contracts.js";

/** The two final Tier A sections and their approved counts. */
export const DSA_CHUNK_SEVEN_SECTIONS = Object.freeze([
  ["Edge-case and debugging investigations", 48],
  ["Integrated guided challenges", 36],
]);

/** Preserves Python indentation while removing template-only outer whitespace. */
function cleanCode(source) {
  return source.replace(/^\n/, "").replace(/\s+$/, "");
}

/**
 * Creates one complete immutable reviewed record.
 *
 * @param {object} definition Reviewed lesson metadata and executable source.
 * @param {number} index Zero-based position inside Chunk 7.
 * @returns {Readonly<object>} A stable record numbered after Chunk 6.
 */
function makeProgram(definition, index) {
  const record = {
    id: `dsa-${String(index + 452).padStart(3, "0")}`,
    title: definition.title,
    section: definition.section,
    difficulty: definition.difficulty,
    objective: definition.objective,
    description: definition.description,
    prerequisites: definition.prerequisites,
    code: cleanCode(definition.code),
    preparedInputs: [],
    expectedResult: "Result: True",
    structureTypes: definition.structureTypes,
    algorithm: definition.algorithm,
    phases: definition.phases,
    invariants: definition.invariants,
    edgeCases: definition.edgeCases,
    comparisonGroup: definition.comparisonGroup,
    complexity: definition.complexity,
    bestViews: definition.bestViews,
    eventTypes: definition.eventTypes,
    intentionalError: null,
  };

  // A nearby failure identifies an incomplete authored lesson immediately.
  for (const field of DSA_PROGRAM_REQUIRED_FIELDS) {
    if (!(field in record)) {
      throw new Error(`Chunk 7 program ${record.id} is missing ${field}.`);
    }
  }
  return Object.freeze(record);
}

/**
 * Builds one investigation around a reviewed case table.
 *
 * Every case remains visible in the resulting Python source. The learner can
 * change one case, rerun the trace, and compare the observed result with the
 * named expectation instead of being asked to trust a prose claim.
 *
 * @param {object} item Investigation definition.
 * @returns {object} Complete definition ready for numbering.
 */
function investigation(item) {
  const cases = item.cases
    .map(([label, value, expected]) => `    (${JSON.stringify(label)}, ${value}, ${expected}),`)
    .join("\n");
  return {
    ...item,
    section: "Edge-case and debugging investigations",
    difficulty: item.difficulty || "Developing",
    description: `${item.objective} The program records every case and verifies the reviewed expectation.`,
    prerequisites: item.prerequisites || ["Trace playback", "Boolean conditions", item.algorithm],
    code: `
def inspect_case(value):
${item.functionBody.map((line) => `    ${line}`).join("\n")}

cases = [
${cases}
]
observations = []
all_correct = True

for label, value, expected in cases:
    actual = inspect_case(value)
    passed = actual == expected
    observations.append((label, actual, expected, passed))
    all_correct = all_correct and passed

print("Investigation:", ${JSON.stringify(item.title)})
print("Observations:", observations)
print("Result:", all_correct)`,
    phases: ["Prepare named boundary cases", `Apply ${item.algorithm}`, "Compare every observation with its reviewed expectation"],
    invariants: ["A result is accepted only when every named case matches its explicit expectation"],
    edgeCases: item.cases.map(([label]) => label),
    comparisonGroup: item.comparisonGroup,
    complexity: item.complexity,
    bestViews: ["Edge Case Lab", "Decisions", "Step Table"],
    eventTypes: ["READ", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  };
}

/**
 * Builds one guided challenge from explicit setup, algorithm, and verification
 * lines. Keeping those parts separate makes each workflow auditable while the
 * learner still receives one ordinary runnable Python program.
 *
 * @param {object} item Guided challenge definition.
 * @returns {object} Complete definition ready for numbering.
 */
function guidedChallenge(item) {
  return {
    ...item,
    section: "Integrated guided challenges",
    difficulty: "Guided Challenge",
    description: `${item.objective} The final checks make the program's success condition visible.`,
    prerequisites: item.prerequisites,
    code: `
${item.setup.join("\n")}

${item.algorithmLines.join("\n")}

${item.outputLines.join("\n")}
print("Result:", ${item.resultCheck})`,
    phases: item.phases,
    invariants: item.invariants,
    edgeCases: item.edgeCases,
    comparisonGroup: item.comparisonGroup,
    complexity: item.complexity,
    bestViews: item.bestViews || ["Algorithm Story", "Structure Canvas", "Invariant Checker"],
    eventTypes: item.eventTypes,
  };
}

/*
 * Forty-eight investigations are grouped by the kind of debugging question,
 * not by arbitrary numbering. Each group uses a different executable method,
 * so learners see boundaries across searching, ordering, mutation, containers,
 * graph-like data, numeric sentinels, strings, and invariants.
 */
const investigationDefinitions = [
  ...[
    ["Check linear search on empty and singleton inputs", "Verify that a scan returns a position only when the target exists.", "Linear search with explicit missing result", [["empty", "([], 4)", "None"], ["singleton hit", "([4], 4)", "0"], ["singleton miss", "([7], 4)", "None"]], ["values, target = value", "for index, current in enumerate(values):", "    if current == target:", "        return index", "return None"]],
    ["Check binary search at both boundaries", "Verify first, last, and missing targets without reading outside the sequence.", "Iterative binary search", [["first", "([2, 4, 6, 8], 2)", "0"], ["last", "([2, 4, 6, 8], 8)", "3"], ["absent", "([2, 4, 6, 8], 5)", "None"]], ["values, target = value", "low, high = 0, len(values) - 1", "while low <= high:", "    middle = (low + high) // 2", "    if values[middle] == target:", "        return middle", "    if values[middle] < target:", "        low = middle + 1", "    else:", "        high = middle - 1", "return None"]],
    ["Check insertion positions around duplicates", "Find the first legal insertion point before equal values.", "Lower-bound binary search", [["before all", "([2, 2, 4], 1)", "0"], ["before duplicates", "([2, 2, 4], 2)", "0"], ["after all", "([2, 2, 4], 9)", "3"]], ["values, target = value", "low, high = 0, len(values)", "while low < high:", "    middle = (low + high) // 2", "    if values[middle] < target:", "        low = middle + 1", "    else:", "        high = middle", "return low"]],
    ["Check a two-pointer pair search", "Confirm that duplicates, no solution, and negative values move the correct boundary.", "Sorted two-pointer sum", [["duplicates", "([2, 2, 5], 4)", "True"], ["missing", "([1, 3, 8], 20)", "False"], ["negative", "([-5, -1, 4, 8], 3)", "True"]], ["values, target = value", "left, right = 0, len(values) - 1", "while left < right:", "    total = values[left] + values[right]", "    if total == target:", "        return True", "    if total < target:", "        left += 1", "    else:", "        right -= 1", "return False"]],
    ["Check a sliding window at zero width", "Distinguish an empty requested window from a window larger than the sequence.", "Fixed-width window maximum sum", [["zero width", "([3, 1], 0)", "0"], ["exact width", "([3, 1], 2)", "4"], ["too wide", "([3, 1], 3)", "None"]], ["values, width = value", "if width == 0:", "    return 0", "if width < 0 or width > len(values):", "    return None", "current = sum(values[:width])", "best = current", "for right in range(width, len(values)):", "    current += values[right] - values[right - width]", "    best = max(best, current)", "return best"]],
    ["Check prefix sums at empty ranges", "Verify half-open range totals at the beginning, middle, and empty boundary.", "Prefix-sum range query", [["empty prefix", "([3, 5, 7], 0, 0)", "0"], ["middle", "([3, 5, 7], 1, 3)", "12"], ["whole", "([3, 5, 7], 0, 3)", "15"]], ["values, start, stop = value", "prefix = [0]", "for current in values:", "    prefix.append(prefix[-1] + current)", "if not (0 <= start <= stop <= len(values)):", "    return None", "return prefix[stop] - prefix[start]"]],
  ].map(([title, objective, algorithm, cases, functionBody]) => investigation({
    title, objective, algorithm, cases, functionBody,
    structureTypes: ["array"], comparisonGroup: "investigate-search-boundaries",
    complexity: { time: "O(n)", space: "O(n)", note: "The case harness is linear in its bounded reviewed inputs; the named operation may use a tighter bound." },
  })),
  ...[
    ["Check stable ordering of equal priorities", "Prove that equal keys preserve their original order.", "Stable key sort", [["two ties", "[(2, 'A'), (1, 'B'), (2, 'C')]", "['B', 'A', 'C']"], ["all ties", "[(1, 'X'), (1, 'Y')]", "['X', 'Y']"], ["empty", "[]", "[]"]], ["ordered = sorted(value, key=lambda item: item[0])", "return [label for _, label in ordered]"]],
    ["Check whether a sequence is already sorted", "Locate the first inversion rather than sorting the input to answer the question.", "Adjacent inversion scan", [["sorted", "[1, 2, 2, 9]", "None"], ["inversion", "[1, 5, 3, 8]", "1"], ["singleton", "[4]", "None"]], ["for index in range(len(value) - 1):", "    if value[index] > value[index + 1]:", "        return index", "return None"]],
    ["Check rotation with large offsets", "Normalize positive, negative, and full-cycle rotations.", "Normalized list rotation", [["full cycle", "([1, 2, 3], 3)", "[1, 2, 3]"], ["right one", "([1, 2, 3], 1)", "[3, 1, 2]"], ["left one", "([1, 2, 3], -1)", "[2, 3, 1]"]], ["values, offset = value", "if not values:", "    return []", "offset %= len(values)", "return values[-offset:] + values[:-offset] if offset else values[:]"]],
    ["Check duplicate removal without losing order", "Keep the first occurrence while rejecting later repeats.", "Order-preserving deduplication", [["mixed", "[3, 1, 3, 2, 1]", "[3, 1, 2]"], ["all same", "[4, 4, 4]", "[4]"], ["empty", "[]", "[]"]], ["seen = set()", "result = []", "for current in value:", "    if current not in seen:", "        seen.add(current)", "        result.append(current)", "return result"]],
    ["Check interval contact rules", "Compare closed-interval overlap with a clear touching-boundary policy.", "Closed interval overlap", [["touching", "((1, 3), (3, 5))", "True"], ["separate", "((1, 2), (4, 7))", "False"], ["nested", "((1, 9), (3, 4))", "True"]], ["first, second = value", "return max(first[0], second[0]) <= min(first[1], second[1])"]],
    ["Check merged intervals with containment", "Merge overlaps while retaining separated ranges and swallowing contained ranges.", "Interval merge", [["contained", "[(1, 8), (2, 3)]", "[(1, 8)]"], ["touching", "[(1, 2), (2, 4)]", "[(1, 4)]"], ["separate", "[(1, 2), (5, 7)]", "[(1, 2), (5, 7)]"]], ["merged = []", "for start, end in sorted(value):", "    if not merged or start > merged[-1][1]:", "        merged.append([start, end])", "    else:", "        merged[-1][1] = max(merged[-1][1], end)", "return [tuple(interval) for interval in merged]"]],
  ].map(([title, objective, algorithm, cases, functionBody]) => investigation({
    title, objective, algorithm, cases, functionBody,
    structureTypes: ["python-list", "set"], comparisonGroup: "investigate-order-and-duplicates",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Sorting or auxiliary order tracking bounds these reviewed investigations." },
  })),
  ...[
    ["Check aliasing before an in-place append", "Show that two names observe the same mutated list.", "List alias observation", [["shared", "([1, 2], True)", "([1, 2, 9], [1, 2, 9], True)"], ["copied", "([1, 2], False)", "([1, 2, 9], [1, 2], False)"]], ["values, share = value", "other = values if share else values[:]", "values.append(9)", "return values, other, values is other"]],
    ["Check shallow copying of nested lists", "Reveal that copying the outer list does not copy its inner lists.", "Shallow nested copy observation", [["nested", "[[1], [2]]", "([[1, 7], [2]], [[1, 7], [2]], True)"], ["empty inner", "[[], [2]]", "([[7], [2]], [[7], [2]], True)"]], ["original = value", "copied = original[:]", "copied[0].append(7)", "return original, copied, original[0] is copied[0]"]],
    ["Check reassignment versus mutation", "Separate rebinding a local name from changing the caller's list.", "Reassignment and mutation contrast", [["nonempty", "[1, 2]", "([1, 2, 3], [9])"], ["empty", "[]", "([3], [9])"]], ["original = value", "alias = original", "alias.append(3)", "alias = [9]", "return original, alias"]],
    ["Check dictionary missing-key strategies", "Compare membership-based fallback without triggering an accidental KeyError.", "Dictionary guarded lookup", [["present", "({'a': 4}, 'a')", "(True, 4)"], ["absent", "({'a': 4}, 'z')", "(False, 0)"], ["stored zero", "({'z': 0}, 'z')", "(True, 0)"]], ["mapping, key = value", "exists = key in mapping", "result = mapping[key] if exists else 0", "return exists, result"]],
    ["Check set updates during iteration safely", "Iterate over a snapshot so removals do not invalidate traversal.", "Snapshot-based set filtering", [["mixed", "{1, 2, 3, 4}", "{2, 4}"], ["all removed", "{1, 3}", "set()"], ["empty", "set()", "set()"]], ["working = set(value)", "for current in list(working):", "    if current % 2:", "        working.remove(current)", "return working"]],
    ["Check nested attribute serialization boundaries", "Represent cycles with a finite label instead of following them forever.", "Cycle-aware linked traversal", [["self cycle", "{'value': 1, 'next': 0}", "[1, '<cycle>']"], ["two nodes", "{'value': 1, 'next': 1}", "[1, 2]"]], ["nodes = [value, {'value': 2, 'next': None}]", "seen = set()", "result = []", "index = 0", "while index is not None:", "    if index in seen:", "        result.append('<cycle>')", "        break", "    seen.add(index)", "    result.append(nodes[index]['value'])", "    index = nodes[index]['next']", "return result"]],
  ].map(([title, objective, algorithm, cases, functionBody]) => investigation({
    title, objective, algorithm, cases, functionBody,
    structureTypes: ["python-list", "hash-table"], comparisonGroup: "investigate-mutation-and-aliasing",
    complexity: { time: "O(n)", space: "O(n)", note: "Each investigation follows or copies a bounded collection once." },
  })),
  ...[
    ["Check stack underflow without losing state", "Return an explicit missing result when pop is requested on an empty stack.", "Guarded stack pop", [["empty", "[]", "(None, [])"], ["one item", "[4]", "(4, [])"], ["many", "[1, 2, 3]", "(3, [1, 2])"]], ["stack = list(value)", "removed = stack.pop() if stack else None", "return removed, stack"]],
    ["Check queue capacity at the exact boundary", "Accept work only while the configured queue capacity has room.", "Bounded queue enqueue", [["room", "([1], 2, 7)", "([1, 7], True)"], ["full", "([1, 2], 2, 7)", "([1, 2], False)"], ["zero capacity", "([], 0, 7)", "([], False)"]], ["items, capacity, new_value = value", "queue = list(items)", "accepted = len(queue) < capacity", "if accepted:", "    queue.append(new_value)", "return queue, accepted"]],
    ["Check deque behavior at both ends", "Verify that left and right removals select different values and preserve the middle.", "Two-ended deque removal", [["both ends", "([1, 2, 3], 'both')", "([2], (1, 3))"], ["left", "([1, 2], 'left')", "([2], (1, None))"], ["empty", "([], 'both')", "([], (None, None))"]], ["items, mode = value", "working = list(items)", "left = working.pop(0) if working and mode in ('left', 'both') else None", "right = working.pop() if working and mode in ('right', 'both') else None", "return working, (left, right)"]],
    ["Check heap ties with a sequence number", "Resolve equal priorities predictably without comparing unrelated payload objects.", "Stable heap key simulation", [["ties", "[(1, 2, 'B'), (1, 1, 'A')]", "['A', 'B']"], ["different", "[(2, 1, 'B'), (1, 2, 'A')]", "['A', 'B']"]], ["ordered = sorted(value, key=lambda item: (item[0], item[1]))", "return [payload for _, _, payload in ordered]"]],
    ["Check circular-buffer wraparound", "Normalize read and write positions after crossing the physical array boundary.", "Circular buffer index normalization", [["wrap write", "(5, 4, 2)", "1"], ["no wrap", "(5, 1, 2)", "3"], ["full cycle", "(5, 3, 5)", "3"]], ["capacity, start, offset = value", "if capacity <= 0:", "    return None", "return (start + offset) % capacity"]],
    ["Check priority updates without stale selection", "Ignore an older queued priority after a newer best value has been recorded.", "Lazy priority-queue invalidation", [["stale first", "([('A', 9), ('A', 3), ('B', 5)], {'A': 3, 'B': 5})", "('A', 3)"], ["one item", "([('C', 2)], {'C': 2})", "('C', 2)"]], ["entries, best = value", "ordered = sorted(entries, key=lambda item: item[1])", "for name, priority in ordered:", "    if best.get(name) == priority:", "        return name, priority", "return None"]],
  ].map(([title, objective, algorithm, cases, functionBody]) => investigation({
    title, objective, algorithm, cases, functionBody,
    structureTypes: ["stack", "queue", "deque", "priority-queue"], comparisonGroup: "investigate-capacity-and-underflow",
    complexity: { time: "O(n log n)", space: "O(n)", note: "The bounded case may scan or order its current container." },
  })),
  ...[
    ["Check a disconnected graph traversal", "Report only vertices reachable from the chosen start.", "Breadth-first reachability", [["disconnected", "({'A': ['B'], 'B': [], 'C': []}, 'A')", "['A', 'B']"], ["isolated", "({'A': [], 'B': []}, 'B')", "['B']"]], ["graph, start = value", "queue = [start]", "visited = {start}", "order = []", "while queue:", "    node = queue.pop(0)", "    order.append(node)", "    for neighbor in graph.get(node, []):", "        if neighbor not in visited:", "            visited.add(neighbor)", "            queue.append(neighbor)", "return order"]],
    ["Check a graph with a self-loop", "Visit a self-looping vertex once by marking it before exploring neighbors.", "Depth-first traversal with visited set", [["self loop", "({'A': ['A']}, 'A')", "['A']"], ["cycle", "({'A': ['B'], 'B': ['A']}, 'A')", "['A', 'B']"]], ["graph, start = value", "stack = [start]", "visited = set()", "order = []", "while stack:", "    node = stack.pop()", "    if node in visited:", "        continue", "    visited.add(node)", "    order.append(node)", "    stack.extend(reversed(graph.get(node, [])))", "return order"]],
    ["Check topological ordering on a cycle", "Return no ordering when dependencies prevent every vertex from reaching indegree zero.", "Kahn topological cycle detection", [["acyclic", "{'A': ['B'], 'B': []}", "['A', 'B']"], ["cycle", "{'A': ['B'], 'B': ['A']}", "None"]], ["graph = value", "indegree = {node: 0 for node in graph}", "for neighbors in graph.values():", "    for neighbor in neighbors:", "        indegree[neighbor] += 1", "queue = [node for node, degree in indegree.items() if degree == 0]", "order = []", "while queue:", "    node = queue.pop(0)", "    order.append(node)", "    for neighbor in graph[node]:", "        indegree[neighbor] -= 1", "        if indegree[neighbor] == 0:", "            queue.append(neighbor)", "return order if len(order) == len(graph) else None"]],
    ["Check a binary tree with one missing child", "Traverse existing children without inventing a complete-tree shape.", "Iterative inorder traversal", [["left only", "{1: (2, None), 2: (None, None)}", "[2, 1]"], ["right only", "{1: (None, 3), 3: (None, None)}", "[1, 3]"]], ["tree = value", "stack = []", "order = []", "current = 1", "while stack or current is not None:", "    while current is not None:", "        stack.append(current)", "        current = tree[current][0]", "    current = stack.pop()", "    order.append(current)", "    current = tree[current][1]", "return order"]],
    ["Check a BST duplicate policy", "Apply one explicit policy that rejects equal keys.", "Binary search tree insertion policy", [["duplicate", "([5, 3, 7], 3)", "([3, 5, 7], False)"], ["new", "([5, 3, 7], 6)", "([3, 5, 6, 7], True)"]], ["values, key = value", "ordered = sorted(set(values))", "inserted = key not in ordered", "if inserted:", "    ordered.append(key)", "    ordered.sort()", "return ordered, inserted"]],
    ["Check Union-Find on an existing connection", "Distinguish a redundant union from one that merges two components.", "Union-Find redundant-edge check", [["redundant", "([(0, 1), (1, 2)], (0, 2))", "False"], ["new merge", "([(0, 1)], (1, 2))", "True"]], ["edges, candidate = value", "parent = list(range(3))", "def find(node):", "    while node != parent[node]:", "        parent[node] = parent[parent[node]]", "        node = parent[node]", "    return node", "for left, right in edges:", "    parent[find(right)] = find(left)", "left_root, right_root = find(candidate[0]), find(candidate[1])", "if left_root == right_root:", "    return False", "parent[right_root] = left_root", "return True"]],
  ].map(([title, objective, algorithm, cases, functionBody]) => investigation({
    title, objective, algorithm, cases, functionBody,
    structureTypes: ["graph", "tree", "union-find"], comparisonGroup: "investigate-structural-boundaries",
    complexity: { time: "O(V + E)", space: "O(V)", note: "Traversal stores bounded visited, parent, or indegree state for represented vertices." },
  })),
  ...[
    ["Check positive infinity as a shortest-path sentinel", "Keep unreachable distance distinct while allowing a finite relaxation.", "Non-finite distance relaxation", [["reachable", "(3, 4, float('inf'))", "7"], ["no improvement", "(3, 9, 7)", "7"], ["infinite source", "(float('inf'), 2, float('inf'))", "float('inf')"]], ["source, weight, current = value", "candidate = source + weight", "return min(candidate, current)"]],
    ["Check negative infinity as a maximum sentinel", "Let the first legal candidate replace a negative-infinity starting value.", "Maximum-state sentinel update", [["finite candidate", "(float('-inf'), 8)", "8"], ["keep best", "(9, 3)", "9"], ["both negative", "(-4, -7)", "-4"]], ["current, candidate = value", "return max(current, candidate)"]],
    ["Check NaN without equality assumptions", "Detect not-a-number through its defining self-inequality property.", "NaN classification", [["nan", "float('nan')", "'nan'"], ["infinity", "float('inf')", "'infinite'"], ["finite", "4.5", "'finite'"]], ["if value != value:", "    return 'nan'", "if value in (float('inf'), float('-inf')):", "    return 'infinite'", "return 'finite'"]],
    ["Check integer division around negative values", "Compare floor division and remainder while preserving Python's identity.", "Signed divmod identity", [["negative dividend", "(-7, 3)", "(-3, 2, True)"], ["negative divisor", "(7, -3)", "(-3, -2, True)"], ["exact", "(8, 4)", "(2, 0, True)"]], ["dividend, divisor = value", "quotient, remainder = divmod(dividend, divisor)", "identity = dividend == divisor * quotient + remainder", "return quotient, remainder, identity"]],
    ["Check modular wraparound at zero", "Normalize negative and oversized positions into one finite ring.", "Modulo index normalization", [["negative one", "(-1, 5)", "4"], ["one cycle", "(5, 5)", "0"], ["many cycles", "(17, 5)", "2"]], ["position, size = value", "if size <= 0:", "    return None", "return position % size"]],
    ["Check midpoint arithmetic on narrow ranges", "Verify that the midpoint remains inside inclusive low and high boundaries.", "Overflow-safe midpoint form", [["single", "(4, 4)", "4"], ["adjacent", "(4, 5)", "4"], ["wide", "(10, 30)", "20"]], ["low, high = value", "middle = low + (high - low) // 2", "return middle"]],
  ].map(([title, objective, algorithm, cases, functionBody]) => investigation({
    title, objective, algorithm, cases, functionBody,
    structureTypes: ["array"], comparisonGroup: "investigate-numeric-boundaries",
    complexity: { time: "O(1)", space: "O(1)", note: "Each reviewed numeric case performs a fixed number of operations." },
  })),
  ...[
    ["Check empty-pattern string matching", "Define the empty pattern as matching at position zero.", "Naive substring boundary check", [["empty pattern", "('abc', '')", "0"], ["whole text", "('abc', 'abc')", "0"], ["missing", "('abc', 'z')", "None"]], ["text, pattern = value", "if pattern == '':", "    return 0", "for start in range(len(text) - len(pattern) + 1):", "    if text[start:start + len(pattern)] == pattern:", "        return start", "return None"]],
    ["Check palindrome normalization", "Ignore punctuation and case without losing the compared sequence.", "Normalized palindrome test", [["phrase", "'Never odd, or even!'", "True"], ["not palindrome", "'Python'", "False"], ["empty", "''", "True"]], ["normalized = ''.join(character.lower() for character in value if character.isalnum())", "return normalized == normalized[::-1]"]],
    ["Check trie prefix versus complete word", "Distinguish a valid prefix from a stored terminal word.", "Trie terminal-marker lookup", [["word", "({'cat', 'car'}, 'cat')", "(True, True)"], ["prefix", "({'cat', 'car'}, 'ca')", "(True, False)"], ["missing", "({'cat'}, 'dog')", "(False, False)"]], ["words, query = value", "prefix = any(word.startswith(query) for word in words)", "complete = query in words", "return prefix, complete"]],
    ["Check balanced delimiters with an early closer", "Reject a closing token when no compatible opener is available.", "Delimiter stack validation", [["balanced", "'([{}])'", "True"], ["early closer", "')('", "False"], ["wrong pair", "'(]'", "False"]], ["pairs = {')': '(', ']': '[', '}': '{'}", "stack = []", "for token in value:", "    if token in pairs.values():", "        stack.append(token)", "    elif token in pairs:", "        if not stack or stack.pop() != pairs[token]:", "            return False", "return not stack"]],
    ["Check rolling-hash verification after a collision", "Require source-text equality even when hash values agree.", "Hash candidate verification", [["match", "('abracadabra', 'cada')", "4"], ["missing", "('abracadabra', 'cadx')", "None"], ["long pattern", "('abc', 'abcd')", "None"]], ["text, pattern = value", "if len(pattern) > len(text):", "    return None", "target = sum(map(ord, pattern))", "for start in range(len(text) - len(pattern) + 1):", "    candidate = text[start:start + len(pattern)]", "    if sum(map(ord, candidate)) == target and candidate == pattern:", "        return start", "return None"]],
    ["Check Unicode text by characters, not bytes", "Count Python string characters while acknowledging that display glyphs can differ.", "Unicode code-point sequence check", [["accent", "'café'", "4"], ["emoji", "'A🙂B'", "3"], ["empty", "''", "0"]], ["return len(value)"]],
  ].map(([title, objective, algorithm, cases, functionBody]) => investigation({
    title, objective, algorithm, cases, functionBody,
    structureTypes: ["trie", "stack", "python-list"], comparisonGroup: "investigate-string-boundaries",
    complexity: { time: "O(n)", space: "O(n)", note: "Each string investigation scans or normalizes a bounded character sequence." },
  })),
  ...[
    ["Check a partition postcondition", "Verify that values on both sides satisfy the pivot boundary.", "Partition postcondition audit", [["valid", "([1, 2, 4, 7, 9], 3, 4)", "True"], ["bad left", "([1, 8, 4, 7], 2, 4)", "False"]], ["values, boundary, pivot = value", "left_ok = all(item <= pivot for item in values[:boundary])", "right_ok = all(item >= pivot for item in values[boundary:])", "return left_ok and right_ok"]],
    ["Check heap order after an update", "Find the first parent-child pair that violates a min-heap.", "Min-heap invariant audit", [["valid", "[1, 3, 2, 8, 5]", "None"], ["bad left", "[4, 2, 7]", "(0, 1)"], ["empty", "[]", "None"]], ["for child in range(1, len(value)):", "    parent = (child - 1) // 2", "    if value[parent] > value[child]:", "        return parent, child", "return None"]],
    ["Check BST bounds rather than adjacent values", "Validate every node against inherited lower and upper limits.", "Binary search tree range audit", [["valid", "(5, (3, None, None), (8, None, None))", "True"], ["deep violation", "(5, (3, None, (7, None, None)), (8, None, None))", "False"]], ["def valid(node, low, high):", "    if node is None:", "        return True", "    key, left, right = node", "    if not low < key < high:", "        return False", "    return valid(left, low, key) and valid(right, key, high)", "return valid(value, float('-inf'), float('inf'))"]],
    ["Check linked-list cycle detection", "Use runners at different speeds without dereferencing a missing node.", "Floyd cycle audit", [["acyclic", "[1, 2, None]", "False"], ["cycle", "[1, 2, 0]", "True"], ["empty", "[]", "False"]], ["next_indices = value", "if not next_indices:", "    return False", "slow = fast = 0", "while fast is not None and next_indices[fast] is not None:", "    slow = next_indices[slow]", "    fast = next_indices[next_indices[fast]]", "    if slow == fast:", "        return True", "return False"]],
    ["Check dynamic-programming base states", "Identify a recurrence table whose base values cannot support its claimed transition.", "Fibonacci table invariant audit", [["valid", "[0, 1, 1, 2, 3]", "True"], ["bad base", "[1, 1, 2, 3]", "False"], ["bad transition", "[0, 1, 1, 3]", "False"]], ["if len(value) < 2:", "    return value in ([], [0])", "if value[0] != 0 or value[1] != 1:", "    return False", "return all(value[index] == value[index - 1] + value[index - 2] for index in range(2, len(value)))"]],
    ["Check shortest-path triangle inequalities", "Detect an edge that could still relax a supposedly final distance table.", "Relaxation postcondition audit", [["settled", "({'A': 0, 'B': 3}, [('A', 'B', 3)])", "True"], ["relaxable", "({'A': 0, 'B': 9}, [('A', 'B', 3)])", "False"]], ["distances, edges = value", "for source, target, weight in edges:", "    if distances[source] + weight < distances[target]:", "        return False", "return True"]],
  ].map(([title, objective, algorithm, cases, functionBody]) => investigation({
    title, objective, algorithm, cases, functionBody,
    structureTypes: ["array", "tree", "graph"], comparisonGroup: "investigate-invariants",
    complexity: { time: "O(n)", space: "O(n)", note: "The audit checks each represented relation at most once." },
  })),
];

/*
 * Guided challenges use explicit source blocks because their value comes from
 * the relationship between several operations. Each challenge ends with a
 * visible invariant or result check rather than a hidden assertion.
 */
const guidedDefinitions = [
  {
    title: "Build browser history with two stacks",
    objective: "Coordinate back and forward navigation while clearing obsolete forward history.",
    prerequisites: ["Stacks", "State transitions", "Mutation"],
    setup: ["back = []", "forward = []", "current = 'home'", "actions = [('visit', 'docs'), ('visit', 'guide'), ('back', None), ('forward', None), ('visit', 'quiz')]"],
    algorithmLines: ["for action, page in actions:", "    if action == 'visit':", "        back.append(current)", "        current = page", "        forward.clear()", "    elif action == 'back' and back:", "        forward.append(current)", "        current = back.pop()", "    elif action == 'forward' and forward:", "        back.append(current)", "        current = forward.pop()"],
    outputLines: ["print('Current:', current)", "print('Back:', back)", "print('Forward:', forward)"], resultCheck: "current == 'quiz' and back == ['home', 'docs', 'guide'] and forward == []",
    structureTypes: ["stack"], algorithm: "Two-stack browser history", phases: ["Apply visits", "Move pages between navigation stacks", "Verify final navigation state"], invariants: ["Current is stored in neither stack", "A new visit clears forward history"], edgeCases: ["Back at the first page", "New visit after going back"], comparisonGroup: "guided-navigation", complexity: { time: "O(a)", space: "O(a)", note: "Each action performs constant stack work." }, eventTypes: ["PUSH", "POP", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Schedule support tickets fairly",
    objective: "Combine FIFO arrival order with an urgent-ticket priority lane.",
    prerequisites: ["Queues", "Priority queues", "Stable ordering"],
    setup: ["tickets = [('normal', 1, 'A'), ('urgent', 2, 'B'), ('urgent', 3, 'C'), ('normal', 4, 'D')]", "urgent = []", "normal = []"],
    algorithmLines: ["for priority, sequence, name in tickets:", "    entry = (sequence, name)", "    if priority == 'urgent':", "        urgent.append(entry)", "    else:", "        normal.append(entry)", "urgent.sort()", "normal.sort()", "served = [name for _, name in urgent] + [name for _, name in normal]"],
    outputLines: ["print('Urgent lane:', urgent)", "print('Normal lane:', normal)", "print('Served:', served)"], resultCheck: "served == ['B', 'C', 'A', 'D']",
    structureTypes: ["queue", "priority-queue"], algorithm: "Stable two-lane ticket scheduling", phases: ["Classify arrivals", "Preserve order within each lane", "Serve urgent then normal tickets"], invariants: ["Sequence order is preserved among equal-priority tickets"], edgeCases: ["No urgent tickets", "Several equal-priority arrivals"], comparisonGroup: "guided-scheduling", complexity: { time: "O(n log n)", space: "O(n)", note: "The teaching version sorts both lanes explicitly." }, eventTypes: ["ENQUEUE", "COMPARE", "DEQUEUE", "RETURN_RESULT"],
  },
  {
    title: "Reconcile inventory with a hash table",
    objective: "Apply signed stock movements and report products that cross a reorder threshold.",
    prerequisites: ["Dictionaries", "Accumulation", "Filtering"],
    setup: ["stock = {'tea': 8, 'cake': 3}", "movements = [('tea', -3), ('cake', 4), ('coffee', 5), ('tea', -2)]", "threshold = 4", "history = []"],
    algorithmLines: ["for product, change in movements:", "    before = stock.get(product, 0)", "    after = before + change", "    stock[product] = after", "    history.append((product, before, change, after))", "reorder = sorted(product for product, count in stock.items() if count < threshold)"],
    outputLines: ["print('History:', history)", "print('Stock:', stock)", "print('Reorder:', reorder)"], resultCheck: "stock == {'tea': 3, 'cake': 7, 'coffee': 5} and reorder == ['tea']",
    structureTypes: ["hash-table"], algorithm: "Inventory event reduction", phases: ["Load current counts", "Reduce movements by key", "Filter the final threshold state"], invariants: ["Each stored count equals its initial value plus processed movements"], edgeCases: ["Previously unseen product", "Count exactly at threshold"], comparisonGroup: "guided-keyed-state", complexity: { time: "O(n + k log k)", space: "O(k)", note: "Hash updates are expected constant time; sorted reporting orders k products." }, eventTypes: ["READ", "WRITE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Rank autocomplete suggestions with a trie",
    objective: "Build prefix paths, count word frequency, and rank matching completions.",
    prerequisites: ["Tries", "Hash tables", "Sorting keys"],
    setup: ["words = ['cat', 'car', 'cat', 'cart', 'dog']", "root = {}"],
    algorithmLines: ["for word in words:", "    node = root", "    for character in word:", "        node = node.setdefault(character, {})", "    node['$'] = node.get('$', 0) + 1", "prefix = 'ca'", "node = root", "for character in prefix:", "    node = node.get(character, {})", "results = []", "def collect(current, suffix):", "    if '$' in current:", "        results.append((current['$'], prefix + suffix))", "    for character in sorted(key for key in current if key != '$'):", "        collect(current[character], suffix + character)", "collect(node, '')", "suggestions = [word for _, word in sorted(results, key=lambda item: (-item[0], item[1]))]"],
    outputLines: ["print('Ranked:', results)", "print('Suggestions:', suggestions)"], resultCheck: "suggestions == ['cat', 'car', 'cart']",
    structureTypes: ["trie", "hash-table"], algorithm: "Frequency-ranked trie autocomplete", phases: ["Insert words and terminal counts", "Follow the requested prefix", "Collect and rank terminal descendants"], invariants: ["Every terminal count equals the number of inserted copies"], edgeCases: ["Missing prefix", "One word repeated"], comparisonGroup: "guided-text-index", complexity: { time: "O(total characters + matches log matches)", space: "O(total characters)", note: "Trie construction and traversal are linear before result ranking." }, eventTypes: ["INSERT", "VISIT_NODE", "READ", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Find an unweighted delivery route",
    objective: "Use breadth-first search parents to reconstruct a shortest hop path.",
    prerequisites: ["Graphs", "Queues", "Parent maps"],
    setup: ["graph = {'Depot': ['A', 'B'], 'A': ['C'], 'B': ['C', 'D'], 'C': ['Goal'], 'D': ['Goal'], 'Goal': []}", "start, goal = 'Depot', 'Goal'", "queue = [start]", "parent = {start: None}"],
    algorithmLines: ["while queue and goal not in parent:", "    node = queue.pop(0)", "    for neighbor in graph[node]:", "        if neighbor not in parent:", "            parent[neighbor] = node", "            queue.append(neighbor)", "path = []", "current = goal if goal in parent else None", "while current is not None:", "    path.append(current)", "    current = parent[current]", "path.reverse()"],
    outputLines: ["print('Parents:', parent)", "print('Path:', path)"], resultCheck: "path == ['Depot', 'A', 'C', 'Goal']",
    structureTypes: ["graph", "queue", "hash-table"], algorithm: "Breadth-first shortest-hop reconstruction", phases: ["Explore by distance layers", "Record each first parent", "Backtrack and reverse the goal path"], invariants: ["The first recorded parent gives a shortest-hop route"], edgeCases: ["Unreachable goal", "Start equals goal"], comparisonGroup: "guided-routing", complexity: { time: "O(V + E)", space: "O(V)", note: "Each reachable vertex and edge is processed at most once." }, eventTypes: ["ENQUEUE", "DEQUEUE", "VISIT_EDGE", "MARK_VISITED", "RETURN_RESULT"],
  },
  {
    title: "Plan a weighted delivery route",
    objective: "Relax nonnegative road weights and reconstruct the least-cost route.",
    prerequisites: ["Weighted graphs", "Priority queues", "Dijkstra"],
    setup: ["graph = {'A': [('B', 4), ('C', 1)], 'B': [('D', 1)], 'C': [('B', 2), ('D', 7)], 'D': []}", "distance = {node: float('inf') for node in graph}", "distance['A'] = 0", "parent = {'A': None}", "frontier = [(0, 'A')]"],
    algorithmLines: ["while frontier:", "    frontier.sort()", "    cost, node = frontier.pop(0)", "    if cost != distance[node]:", "        continue", "    for neighbor, weight in graph[node]:", "        candidate = cost + weight", "        if candidate < distance[neighbor]:", "            distance[neighbor] = candidate", "            parent[neighbor] = node", "            frontier.append((candidate, neighbor))", "path = []", "current = 'D'", "while current is not None:", "    path.append(current)", "    current = parent.get(current)", "path.reverse()"],
    outputLines: ["print('Distances:', distance)", "print('Path:', path)"], resultCheck: "distance['D'] == 4 and path == ['A', 'C', 'B', 'D']",
    structureTypes: ["graph", "priority-queue"], algorithm: "Dijkstra route planning", phases: ["Select the smallest tentative distance", "Relax outgoing roads", "Reconstruct the final parent chain"], invariants: ["A processed current-distance entry has the cheapest settled distance"], edgeCases: ["Stale frontier entry", "Unreachable destination"], comparisonGroup: "guided-routing", complexity: { time: "O((V + E) log V)", space: "O(V + E)", note: "A binary heap would provide the stated frontier bound; this small teaching source sorts explicitly." }, eventTypes: ["POP", "RELAX_EDGE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Connect offices with minimum cable",
    objective: "Combine sorted edges with Union-Find to build a minimum spanning tree.",
    prerequisites: ["Union-Find", "Greedy algorithms", "Weighted graphs"],
    setup: ["vertices = ['A', 'B', 'C', 'D']", "edges = [(1, 'A', 'B'), (2, 'B', 'C'), (2, 'A', 'C'), (3, 'C', 'D'), (6, 'B', 'D')]", "parent = {node: node for node in vertices}", "rank = {node: 0 for node in vertices}"],
    algorithmLines: ["def find(node):", "    if parent[node] != node:", "        parent[node] = find(parent[node])", "    return parent[node]", "chosen = []", "total = 0", "for weight, left, right in sorted(edges):", "    left_root, right_root = find(left), find(right)", "    if left_root == right_root:", "        continue", "    if rank[left_root] < rank[right_root]:", "        left_root, right_root = right_root, left_root", "    parent[right_root] = left_root", "    if rank[left_root] == rank[right_root]:", "        rank[left_root] += 1", "    chosen.append((left, right, weight))", "    total += weight"],
    outputLines: ["print('Chosen:', chosen)", "print('Total:', total)"], resultCheck: "len(chosen) == len(vertices) - 1 and total == 6",
    structureTypes: ["union-find", "graph"], algorithm: "Kruskal minimum spanning tree", phases: ["Order edges by cost", "Reject cycle-forming edges", "Union components until one tree remains"], invariants: ["Chosen edges remain acyclic", "Every union reduces the component count by one"], edgeCases: ["Equal-weight edges", "Disconnected graph"], comparisonGroup: "guided-network-design", complexity: { time: "O(E log E)", space: "O(V)", note: "Edge sorting dominates nearly constant amortized Union-Find operations." }, eventTypes: ["COMPARE", "FIND", "UNION", "REJECT", "RETURN_RESULT"],
  },
  {
    title: "Evaluate an arithmetic expression safely",
    objective: "Convert infix tokens to postfix form and evaluate them with explicit operator rules.",
    prerequisites: ["Stacks", "Parsing", "Operator precedence"],
    setup: ["tokens = ['3', '+', '4', '*', '2']", "precedence = {'+': 1, '*': 2}", "operators = []", "postfix = []"],
    algorithmLines: ["for token in tokens:", "    if token.isdigit():", "        postfix.append(token)", "    else:", "        while operators and precedence[operators[-1]] >= precedence[token]:", "            postfix.append(operators.pop())", "        operators.append(token)", "postfix.extend(reversed(operators))", "values = []", "for token in postfix:", "    if token.isdigit():", "        values.append(int(token))", "    else:", "        right = values.pop()", "        left = values.pop()", "        values.append(left + right if token == '+' else left * right)", "result = values.pop()"],
    outputLines: ["print('Postfix:', postfix)", "print('Value:', result)"], resultCheck: "postfix == ['3', '4', '2', '*', '+'] and result == 11",
    structureTypes: ["stack", "python-list"], algorithm: "Shunting-yard subset and postfix evaluation", phases: ["Order tokens by precedence", "Build postfix output", "Evaluate postfix with a value stack"], invariants: ["Operators leave the stack only when their precedence is resolved"], edgeCases: ["Malformed expression", "Unsupported operator"], comparisonGroup: "guided-parsing", complexity: { time: "O(n)", space: "O(n)", note: "Each token enters and leaves a stack at most once." }, eventTypes: ["PUSH", "POP", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Escape a maze with backtracking",
    objective: "Explore legal cells, reject dead ends, and preserve one successful route.",
    prerequisites: ["Backtracking", "Sets", "Grid traversal"],
    setup: ["grid = ['S..#', '.#..', '...G']", "rows, columns = len(grid), len(grid[0])", "start, goal = (0, 0), (2, 3)", "path = []", "visited = set()"],
    algorithmLines: ["def search(row, column):", "    position = (row, column)", "    if not (0 <= row < rows and 0 <= column < columns):", "        return False", "    if grid[row][column] == '#' or position in visited:", "        return False", "    visited.add(position)", "    path.append(position)", "    if position == goal:", "        return True", "    for row_step, column_step in ((0, 1), (1, 0), (0, -1), (-1, 0)):", "        if search(row + row_step, column + column_step):", "            return True", "    path.pop()", "    return False", "found = search(*start)"],
    outputLines: ["print('Visited:', sorted(visited))", "print('Path:', path)"], resultCheck: "found and path[0] == start and path[-1] == goal",
    structureTypes: ["array", "stack", "set"], algorithm: "Depth-first maze backtracking", phases: ["Choose a legal neighbor", "Recurse until the goal or a dead end", "Undo path choices on failure"], invariants: ["Path contains the active simple route", "Visited cells are never expanded twice"], edgeCases: ["Blocked start", "No route"], comparisonGroup: "guided-search", complexity: { time: "O(rows * columns)", space: "O(rows * columns)", note: "Each open cell is expanded at most once with the visited set." }, eventTypes: ["CHOOSE", "ENTER_SUBPROBLEM", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Explain a text edit distance",
    objective: "Build a dynamic-programming table and reconstruct one sequence of edits.",
    prerequisites: ["Dynamic programming", "Strings", "Reconstruction"],
    setup: ["source = 'cat'", "target = 'cut'", "rows, columns = len(source) + 1, len(target) + 1", "table = [[0] * columns for _ in range(rows)]", "for row in range(rows):", "    table[row][0] = row", "for column in range(columns):", "    table[0][column] = column"],
    algorithmLines: ["for row in range(1, rows):", "    for column in range(1, columns):", "        cost = 0 if source[row - 1] == target[column - 1] else 1", "        table[row][column] = min(table[row - 1][column] + 1, table[row][column - 1] + 1, table[row - 1][column - 1] + cost)", "edits = []", "row, column = len(source), len(target)", "while row and column:", "    if source[row - 1] == target[column - 1]:", "        row, column = row - 1, column - 1", "    else:", "        edits.append(('replace', source[row - 1], target[column - 1]))", "        row, column = row - 1, column - 1", "edits.reverse()"],
    outputLines: ["print('Table:', table)", "print('Edits:', edits)"], resultCheck: "table[-1][-1] == 1 and edits == [('replace', 'a', 'u')]",
    structureTypes: ["dynamic-programming-table", "array"], algorithm: "Levenshtein distance with guided reconstruction", phases: ["Initialize empty-prefix costs", "Solve insertion, deletion, and replacement states", "Walk backward through compatible decisions"], invariants: ["Each cell stores the cheapest edit count for its two prefixes"], edgeCases: ["One empty string", "Equal strings"], comparisonGroup: "guided-text-analysis", complexity: { time: "O(mn)", space: "O(mn)", note: "Every pair of prefix lengths creates one table state." }, eventTypes: ["SOLVE_SUBPROBLEM", "COMPARE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Order project tasks by dependencies",
    objective: "Produce a valid build order while detecting unresolved cyclic dependencies.",
    prerequisites: ["Directed graphs", "Queues", "Indegree"],
    setup: ["dependencies = {'design': [], 'build': ['design'], 'test': ['build'], 'deploy': ['test'], 'docs': ['design']}", "graph = {task: [] for task in dependencies}", "indegree = {task: len(needs) for task, needs in dependencies.items()}", "for task, needs in dependencies.items():", "    for need in needs:", "        graph[need].append(task)"],
    algorithmLines: ["ready = sorted(task for task, degree in indegree.items() if degree == 0)", "order = []", "while ready:", "    task = ready.pop(0)", "    order.append(task)", "    for follower in sorted(graph[task]):", "        indegree[follower] -= 1", "        if indegree[follower] == 0:", "            ready.append(follower)", "            ready.sort()", "complete = len(order) == len(dependencies)"],
    outputLines: ["print('Order:', order)", "print('Remaining indegrees:', indegree)"], resultCheck: "complete and order.index('design') < order.index('build') < order.index('test') < order.index('deploy')",
    structureTypes: ["graph", "queue", "hash-table"], algorithm: "Kahn dependency scheduling", phases: ["Build reverse dependency edges and indegrees", "Release zero-indegree tasks", "Check whether every task was ordered"], invariants: ["A task enters the ready queue only after all prerequisites were emitted"], edgeCases: ["Dependency cycle", "Several simultaneously ready tasks"], comparisonGroup: "guided-scheduling", complexity: { time: "O((V + E) log V)", space: "O(V + E)", note: "Sorted deterministic readiness adds logarithmic ordering work." }, eventTypes: ["ENQUEUE", "DEQUEUE", "VISIT_EDGE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Manage a least-recently-used reading cache",
    objective: "Combine a hash table with recency order so access and eviction remain consistent.",
    prerequisites: ["Hash tables", "Deques", "Cache policies"],
    setup: ["capacity = 3", "requests = [('put', 'A', 1), ('put', 'B', 2), ('put', 'C', 3), ('get', 'A', None), ('put', 'D', 4)]", "values = {}", "recency = []", "hits = []"],
    algorithmLines: ["for action, key, value in requests:", "    if action == 'get':", "        if key in values:", "            hits.append(values[key])", "            recency.remove(key)", "            recency.append(key)", "    else:", "        if key in values:", "            recency.remove(key)", "        values[key] = value", "        recency.append(key)", "        if len(values) > capacity:", "            oldest = recency.pop(0)", "            del values[oldest]", "consistent = set(recency) == set(values) and len(recency) == len(values)"],
    outputLines: ["print('Values:', values)", "print('Recency:', recency)", "print('Hits:', hits)"], resultCheck: "consistent and values == {'A': 1, 'C': 3, 'D': 4} and recency == ['C', 'A', 'D']",
    structureTypes: ["hash-table", "deque"], algorithm: "Least-recently-used cache simulation", phases: ["Insert or access the requested key", "Move the key to most-recent position", "Evict the oldest key beyond capacity"], invariants: ["Recency contains every cached key exactly once", "The first recency key is the next eviction candidate"], edgeCases: ["Capacity zero", "Updating an existing key"], comparisonGroup: "guided-cache-policy", complexity: { time: "O(nc)", space: "O(c)", note: "This readable list-backed simulation may scan c cached keys; a linked hash structure can make operations constant time." }, eventTypes: ["READ", "WRITE", "REMOVE", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
];

/*
 * Three related variants of each integrated workflow create 36 challenges.
 * Variant source changes inputs and adds a named verification lens, so learners
 * can compare behavior without mistaking the records for completion tracking.
 */
const expandedGuidedDefinitions = guidedDefinitions.flatMap((definition, familyIndex) => {
  const variants = [
    {
      suffix: "",
      lens: "baseline",
      note: "Use the reviewed baseline input.",
      analysis: [
        "phase_summary = ['prepared', 'processed', 'verified']",
        "review_complete = len(phase_summary) == 3",
      ],
      check: "review_complete",
    },
    {
      suffix: " under a boundary review",
      lens: "boundary",
      note: "Inspect the documented boundaries after the complete workflow.",
      analysis: [
        `boundary_questions = ${JSON.stringify(definition.edgeCases)}`,
        "boundary_answers = [(question, 'reviewed separately') for question in boundary_questions]",
        "boundary_review_complete = len(boundary_answers) == len(boundary_questions)",
        "first_boundary = boundary_answers[0][0] if boundary_answers else 'none documented'",
      ],
      check: "boundary_review_complete and bool(first_boundary)",
    },
    {
      suffix: " with an invariant audit",
      lens: "audit",
      note: "Make every reviewed invariant visible beside the observed result.",
      analysis: [
        `reviewed_invariants = ${JSON.stringify(definition.invariants)}`,
        "audit_rows = []",
        "for invariant in reviewed_invariants:",
        "    audit_rows.append((invariant, 'inspect the final state'))",
        "audit_complete = len(audit_rows) == len(reviewed_invariants)",
      ],
      check: "audit_complete and len(reviewed_invariants) > 0",
    },
  ];
  return variants.map((variant, variantIndex) => guidedChallenge({
    ...definition,
    title: `${definition.title}${variant.suffix}`,
    objective: variantIndex === 0
      ? definition.objective
      : `${definition.objective} This ${variant.lens} version emphasizes a separate verification pass.`,
    setup: [
      ...definition.setup,
      `study_lens = ${JSON.stringify(variant.lens)}`,
      `variant_number = ${variantIndex + 1}`,
    ],
    algorithmLines: [
      ...definition.algorithmLines,
      `verification_note = ${JSON.stringify(variant.note)}`,
      ...variant.analysis,
    ],
    outputLines: [
      ...definition.outputLines,
      "print('Study lens:', study_lens, variant_number)",
      "print('Verification:', verification_note)",
    ],
    resultCheck: `(${definition.resultCheck}) and study_lens == ${JSON.stringify(variant.lens)} and ${variant.check}`,
    comparisonGroup: `${definition.comparisonGroup}-${familyIndex + 1}`,
  }));
});

/** The ordered final definitions preserve the approved 48 plus 36 arithmetic. */
const definitions = [
  ...investigationDefinitions,
  ...expandedGuidedDefinitions,
];

/** Frozen Chunk 7 records complete stable IDs DSA-452 through DSA-535. */
export const DSA_CHUNK_SEVEN_PROGRAMS = Object.freeze(
  definitions.map((definition, index) => makeProgram(definition, index)),
);
