/**
 * Code Explorer Data Structures and Algorithms curriculum, Chunk 5.
 *
 * This module adds 60 reviewed programs for recursion, backtracking,
 * divide-and-conquer techniques, and greedy algorithms. Every program is an
 * independent Python lesson with exact-source curriculum context and a
 * learner-visible result checked by the detached release validator.
 *
 * The records contain no learner data and perform no network activity.
 */

import { DSA_PROGRAM_REQUIRED_FIELDS } from "./dsa-contracts.js";

/** The four Chunk 5 sections and their approved Tier A counts. */
export const DSA_CHUNK_FIVE_SECTIONS = Object.freeze([
  ["Recursion", 18],
  ["Backtracking", 16],
  ["Divide and conquer", 10],
  ["Greedy algorithms", 16],
]);

/** Removes only outer template whitespace while preserving Python indentation. */
function cleanCode(source) {
  return source.replace(/^\n/, "").replace(/\s+$/, "");
}

/**
 * Builds one immutable record using the complete shared curriculum schema.
 *
 * @param {object} definition Reviewed metadata and executable Python source.
 * @param {number} index Zero-based index inside Chunk 5.
 * @returns {Readonly<object>} Complete record numbered after Chunk 4.
 */
function makeProgram(definition, index) {
  const record = {
    id: `dsa-${String(index + 338).padStart(3, "0")}`,
    title: definition.title,
    section: definition.section,
    difficulty: definition.difficulty || "Developing",
    objective: definition.objective,
    description: definition.description || definition.objective,
    prerequisites: definition.prerequisites || [],
    code: cleanCode(definition.code),
    preparedInputs: definition.preparedInputs || [],
    expectedResult: definition.expectedResult,
    structureTypes: definition.structureTypes,
    algorithm: definition.algorithm,
    phases: definition.phases,
    invariants: definition.invariants || [],
    edgeCases: definition.edgeCases || [],
    comparisonGroup: definition.comparisonGroup || "",
    complexity: definition.complexity,
    bestViews: definition.bestViews || ["Calls and Recursion", "Operation Journey", "Variables"],
    eventTypes: definition.eventTypes,
    intentionalError: null,
  };
  for (const field of DSA_PROGRAM_REQUIRED_FIELDS) {
    if (!(field in record)) throw new Error(`Chunk 5 program ${record.id} is missing ${field}.`);
  }
  return Object.freeze(record);
}

/** Recursion lessons progress from base cases to recursive structures and tradeoffs. */
const recursionPrograms = [
  {
    title: "Count down through recursive calls",
    objective: "Separate the base case from the shrinking recursive case in a visible countdown.",
    difficulty: "Beginner",
    code: `
visited = []

def countdown(number):
    visited.append(number)
    if number == 0:
        return "Lift off"
    return countdown(number - 1)

message = countdown(4)
print("Visited:", visited)
print("Message:", message)
print("Result:", visited == [4, 3, 2, 1, 0] and message == "Lift off")`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list"],
    algorithm: "Recursive countdown",
    phases: ["Record the current number", "Stop at zero", "Return through the waiting calls"],
    invariants: ["Every recursive argument is one smaller than the previous argument"],
    edgeCases: ["Zero enters the base case immediately"],
    comparisonGroup: "recursion-foundations",
    complexity: { time: "O(n)", space: "O(n)", note: "The function makes n plus one calls and keeps one active frame per unfinished call." },
    bestViews: ["Calls and Recursion", "Algorithm Path", "Step Table"],
    eventTypes: ["ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Build factorial while calls return",
    objective: "Observe how recursive results are combined during the return phase.",
    difficulty: "Beginner",
    code: `
returns = []

def factorial(number):
    if number <= 1:
        returns.append((number, 1))
        return 1
    result = number * factorial(number - 1)
    returns.append((number, result))
    return result

answer = factorial(5)
print("Returns:", returns)
print("Factorial:", answer)
print("Result:", answer == 120 and returns[-1] == (5, 120))`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list"],
    algorithm: "Recursive factorial",
    phases: ["Descend toward one", "Return one from the base case", "Multiply while unwinding"],
    invariants: ["factorial(n) equals n times factorial(n - 1) for n above one"],
    edgeCases: ["Zero factorial is one"],
    comparisonGroup: "factorial-forms",
    complexity: { time: "O(n)", space: "O(n)", note: "Each positive integer contributes one call and one multiplication." },
    bestViews: ["Calls and Recursion", "Before and After", "Operation Journey"],
    eventTypes: ["ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Sum a sequence by shrinking its boundary",
    objective: "Use an index boundary instead of slicing to recursively total a list.",
    difficulty: "Beginner",
    code: `
values = [7, 3, 5, 2]
visited = []

def recursive_sum(items, index):
    if index == len(items):
        return 0
    visited.append(index)
    subtotal = recursive_sum(items, index + 1)
    return items[index] + subtotal

total = recursive_sum(values, 0)
print("Visited indices:", visited)
print("Total:", total)
print("Result:", total == 17 and visited == [0, 1, 2, 3])`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack"],
    algorithm: "Recursive sequence sum",
    phases: ["Check the right boundary", "Solve the remaining suffix", "Add the current value"],
    invariants: ["The index identifies the first value not yet included"],
    edgeCases: ["An empty list returns zero"],
    comparisonGroup: "recursive-sequence-reductions",
    complexity: { time: "O(n)", space: "O(n)", note: "The index visits each value once without creating list slices." },
    bestViews: ["Calls and Recursion", "Watches", "Step Table"],
    eventTypes: ["VISIT_INDEX", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Find a maximum recursively",
    objective: "Compare one item with the maximum returned by the remaining suffix.",
    code: `
values = [-8, 4, 11, 3, 9]
comparisons = []

def recursive_max(items, index):
    if index == len(items) - 1:
        return items[index]
    suffix_max = recursive_max(items, index + 1)
    comparisons.append((items[index], suffix_max))
    return items[index] if items[index] > suffix_max else suffix_max

maximum = recursive_max(values, 0)
print("Comparisons:", comparisons)
print("Maximum:", maximum)
print("Result:", maximum == 11 and len(comparisons) == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack"],
    algorithm: "Recursive maximum",
    phases: ["Reach the final value", "Return a suffix maximum", "Keep the larger candidate"],
    invariants: ["Every returned value is the maximum of its suffix"],
    edgeCases: ["A one-item list returns that item without comparison"],
    comparisonGroup: "recursive-sequence-reductions",
    complexity: { time: "O(n)", space: "O(n)", note: "The recurrence compares each value once and uses linear call depth." },
    bestViews: ["Calls and Recursion", "Decisions", "Operation Journey"],
    eventTypes: ["COMPARE", "ENTER_SUBPROBLEM", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Reverse text without slicing",
    objective: "Build a reversed string from a recursive index walk.",
    difficulty: "Beginner",
    code: `
text = "trace"
pieces = []

def reverse_from(value, index):
    if index < 0:
        return ""
    pieces.append(value[index])
    return value[index] + reverse_from(value, index - 1)

reversed_text = reverse_from(text, len(text) - 1)
print("Pieces:", pieces)
print("Reversed:", reversed_text)
print("Result:", reversed_text == "ecart" and "".join(pieces) == reversed_text)`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list"],
    algorithm: "Recursive string reversal",
    phases: ["Start at the final character", "Move the index left", "Concatenate visited characters"],
    invariants: ["The result prefix equals the characters visited from right to left"],
    edgeCases: ["An empty string begins below index zero"],
    comparisonGroup: "recursive-string-processing",
    complexity: { time: "O(n^2) in Python string building", space: "O(n)", note: "There are n calls, while repeated immutable-string concatenation can copy growing prefixes." },
    bestViews: ["Calls and Recursion", "Watches", "Complexity Lab"],
    eventTypes: ["READ", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Check a palindrome from both ends",
    objective: "Move two recursive boundaries inward while preserving a palindrome claim.",
    difficulty: "Beginner",
    code: `
text = "racecar"
checks = []

def is_palindrome(value, left, right):
    if left >= right:
        return True
    checks.append((left, right, value[left], value[right]))
    if value[left] != value[right]:
        return False
    return is_palindrome(value, left + 1, right - 1)

answer = is_palindrome(text, 0, len(text) - 1)
print("Checks:", checks)
print("Palindrome:", answer)
print("Result:", answer and len(checks) == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack"],
    algorithm: "Recursive palindrome check",
    phases: ["Compare boundary characters", "Reject a mismatch", "Move both boundaries inward"],
    invariants: ["All character pairs outside the current boundaries already match"],
    edgeCases: ["Empty and one-character strings are palindromes"],
    comparisonGroup: "recursive-string-processing",
    complexity: { time: "O(n)", space: "O(n)", note: "At most half the character pairs are compared, with one frame per pair." },
    bestViews: ["Calls and Recursion", "Decisions", "Watches"],
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Trace Euclid's recursive remainder",
    objective: "Use a remainder as the shrinking measure in recursive greatest-common-divisor calculation.",
    difficulty: "Beginner",
    code: `
remainders = []

def gcd(left, right):
    remainders.append((left, right))
    if right == 0:
        return left
    return gcd(right, left % right)

answer = gcd(84, 30)
print("Arguments:", remainders)
print("GCD:", answer)
print("Result:", answer == 6 and remainders[-1][1] == 0)`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list"],
    algorithm: "Recursive Euclidean algorithm",
    phases: ["Record the current pair", "Replace the pair using remainder", "Stop when the second value is zero"],
    invariants: ["The greatest common divisor is unchanged by replacing (a, b) with (b, a mod b)"],
    edgeCases: ["A zero second argument returns the first argument"],
    comparisonGroup: "recursive-number-processing",
    complexity: { time: "O(log min(a, b))", space: "O(log min(a, b))", note: "Remainders shrink quickly and each remainder becomes one recursive call." },
    bestViews: ["Calls and Recursion", "Step Table", "Invariant Checker"],
    eventTypes: ["ENTER_SUBPROBLEM", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Convert a number to binary recursively",
    objective: "Separate quotient recursion from remainder output in base-two conversion.",
    code: `
remainders = []

def to_binary(number):
    if number < 2:
        remainders.append(number)
        return str(number)
    remainder = number % 2
    remainders.append(remainder)
    return to_binary(number // 2) + str(remainder)

binary = to_binary(26)
print("Remainders during descent:", remainders)
print("Binary:", binary)
print("Result:", binary == "11010" and int(binary, 2) == 26)`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list"],
    algorithm: "Recursive base conversion",
    phases: ["Take the low binary digit", "Recurse on the quotient", "Append digits while returning"],
    invariants: ["number equals two times its quotient plus its remainder"],
    edgeCases: ["Zero and one are direct base cases"],
    comparisonGroup: "recursive-number-processing",
    complexity: { time: "O(log n)", space: "O(log n)", note: "Each call divides the number by two." },
    bestViews: ["Calls and Recursion", "Before and After", "Step Table"],
    eventTypes: ["ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Square by recursive exponent halving",
    objective: "Reduce multiplication depth by solving one half-exponent subproblem.",
    code: `
calls = []

def power(base, exponent):
    calls.append(exponent)
    if exponent == 0:
        return 1
    half = power(base, exponent // 2)
    squared = half * half
    return squared if exponent % 2 == 0 else base * squared

answer = power(3, 7)
print("Exponents:", calls)
print("Power:", answer)
print("Result:", answer == 2187 and calls == [7, 3, 1, 0])`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list"],
    algorithm: "Exponentiation by squaring",
    phases: ["Halve the exponent", "Square the returned half power", "Multiply once more for an odd exponent"],
    invariants: ["The returned value equals base raised to the current exponent"],
    edgeCases: ["Exponent zero returns one"],
    comparisonGroup: "fast-power",
    complexity: { time: "O(log n)", space: "O(log n)", note: "Only one half-exponent call is made at each level." },
    bestViews: ["Calls and Recursion", "Decisions", "Complexity Lab"],
    eventTypes: ["ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Search a sorted range recursively",
    objective: "Track inclusive boundaries through recursive binary search.",
    code: `
values = [3, 8, 12, 19, 24, 31, 42]
visited = []

def binary_search(items, target, low, high):
    if low > high:
        return -1
    middle = (low + high) // 2
    visited.append((low, middle, high))
    if items[middle] == target:
        return middle
    if items[middle] < target:
        return binary_search(items, target, middle + 1, high)
    return binary_search(items, target, low, middle - 1)

index = binary_search(values, 31, 0, len(values) - 1)
print("Ranges:", visited)
print("Index:", index)
print("Result:", index == 5 and values[index] == 31)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack"],
    algorithm: "Recursive binary search",
    phases: ["Reject an empty range", "Compare the middle value", "Recurse into one remaining half"],
    invariants: ["If the target exists, it remains inside the inclusive search range"],
    edgeCases: ["A missing target eventually creates low greater than high"],
    comparisonGroup: "binary-search-forms",
    complexity: { time: "O(log n)", space: "O(log n)", note: "Every call discards about half the remaining indices." },
    bestViews: ["Calls and Recursion", "Watches", "Algorithm Path"],
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Flatten nested lists recursively",
    objective: "Distinguish recursive list containers from scalar values while preserving left-to-right order.",
    code: `
nested = [1, [2, [3, 4], 5], [], [6]]
flat = []
visits = []

def flatten(value):
    if isinstance(value, list):
        visits.append(("list", len(value)))
        for item in value:
            flatten(item)
        return
    visits.append(("value", value))
    flat.append(value)

flatten(nested)
print("Flat:", flat)
print("Visits:", visits)
print("Result:", flat == [1, 2, 3, 4, 5, 6])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "python-list", "stack"],
    algorithm: "Recursive nested-list flattening",
    phases: ["Classify the current value", "Recurse through list children", "Append scalar leaves"],
    invariants: ["The output preserves the left-to-right order of scalar leaves"],
    edgeCases: ["An empty nested list contributes no values"],
    comparisonGroup: "recursive-structure-walks",
    complexity: { time: "O(n)", space: "O(d)", note: "Every nested container and scalar is visited once; d is maximum nesting depth." },
    bestViews: ["Calls and Recursion", "Structure Canvas", "Algorithm Path"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Count nodes in a nested tree",
    objective: "Define tree size as one current node plus the sizes of all child subtrees.",
    code: `
tree = {
    "name": "root",
    "children": [
        {"name": "left", "children": []},
        {"name": "right", "children": [
            {"name": "leaf", "children": []},
        ]},
    ],
}
subtree_sizes = {}

def count_nodes(node):
    total = 1
    for child in node["children"]:
        total += count_nodes(child)
    subtree_sizes[node["name"]] = total
    return total

count = count_nodes(tree)
print("Subtree sizes:", subtree_sizes)
print("Count:", count)
print("Result:", count == 4 and subtree_sizes["right"] == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "hash-table", "stack"],
    algorithm: "Recursive tree size",
    phases: ["Count the current node", "Solve every child subtree", "Store and return the combined size"],
    invariants: ["Each subtree size includes its root exactly once"],
    edgeCases: ["A leaf has size one"],
    comparisonGroup: "recursive-tree-measures",
    complexity: { time: "O(n)", space: "O(h)", note: "Each node is visited once and h active frames follow the tree height." },
    bestViews: ["Calls and Recursion", "Structure Canvas", "Variables"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Measure tree height recursively",
    objective: "Combine child heights to measure the longest root-to-leaf route.",
    code: `
tree = {
    "name": "A",
    "children": [
        {"name": "B", "children": []},
        {"name": "C", "children": [
            {"name": "D", "children": [
                {"name": "E", "children": []},
            ]},
        ]},
    ],
}
heights = {}

def height(node):
    if not node["children"]:
        heights[node["name"]] = 1
        return 1
    value = 1 + max(height(child) for child in node["children"])
    heights[node["name"]] = value
    return value

answer = height(tree)
print("Heights:", heights)
print("Height:", answer)
print("Result:", answer == 4 and heights["C"] == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "hash-table", "stack"],
    algorithm: "Recursive tree height",
    phases: ["Recognize a leaf", "Measure every child", "Add one to the greatest child height"],
    invariants: ["A stored height is the node count on the longest downward path from that node"],
    edgeCases: ["A leaf has height one in this lesson's convention"],
    comparisonGroup: "recursive-tree-measures",
    complexity: { time: "O(n)", space: "O(h)", note: "Every node contributes once and recursive depth follows the longest route." },
    bestViews: ["Calls and Recursion", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Evaluate an expression tree recursively",
    objective: "Return numeric leaves and combine child results at operator nodes.",
    code: `
expression = {
    "op": "*",
    "left": {"value": 7},
    "right": {
        "op": "+",
        "left": {"value": 2},
        "right": {"value": 3},
    },
}
evaluated = []

def evaluate(node):
    if "value" in node:
        return node["value"]
    left = evaluate(node["left"])
    right = evaluate(node["right"])
    result = left + right if node["op"] == "+" else left * right
    evaluated.append((node["op"], left, right, result))
    return result

answer = evaluate(expression)
print("Operations:", evaluated)
print("Value:", answer)
print("Result:", answer == 35 and evaluated[-1] == ("*", 7, 5, 35))`,
    expectedResult: "Result: True",
    structureTypes: ["binary-tree", "stack", "python-list"],
    algorithm: "Recursive expression-tree evaluation",
    phases: ["Return a numeric leaf", "Evaluate left and right children", "Apply the current operator"],
    invariants: ["Every returned value equals the value of its complete subtree"],
    edgeCases: ["A one-node numeric expression needs no operator"],
    comparisonGroup: "recursive-tree-walks",
    complexity: { time: "O(n)", space: "O(h)", note: "Every expression node is evaluated once with call depth equal to tree height." },
    bestViews: ["Calls and Recursion", "Structure Canvas", "Before and After"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Reuse memoized Fibonacci subproblems",
    objective: "Store solved recursive subproblems so repeated Fibonacci requests return immediately.",
    code: `
memo = {0: 0, 1: 1}
computed = []
cache_hits = []

def fibonacci(number):
    if number in memo:
        cache_hits.append(number)
        return memo[number]
    computed.append(number)
    memo[number] = fibonacci(number - 1) + fibonacci(number - 2)
    return memo[number]

answer = fibonacci(8)
print("Computed:", computed)
print("Cache hits:", cache_hits)
print("Memo:", memo)
print("Result:", answer == 21 and len(computed) == 7 and memo[8] == 21)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "stack"],
    algorithm: "Top-down memoized Fibonacci",
    phases: ["Check the memo", "Solve two smaller missing values", "Store the completed value"],
    invariants: ["Every memo entry equals the Fibonacci value for its key"],
    edgeCases: ["Zero and one are seeded base cases"],
    comparisonGroup: "fibonacci-forms",
    complexity: { time: "O(n)", space: "O(n)", note: "Each value from two through n is computed once and then reused." },
    bestViews: ["Calls and Recursion", "References", "Complexity Lab"],
    eventTypes: ["FIND", "ENTER_SUBPROBLEM", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Classify parity with mutual recursion",
    objective: "Follow two functions that reduce one shared problem until reaching zero.",
    code: `
journey = []

def is_even(number):
    journey.append(("even", number))
    if number == 0:
        return True
    return is_odd(number - 1)

def is_odd(number):
    journey.append(("odd", number))
    if number == 0:
        return False
    return is_even(number - 1)

answer = is_even(6)
print("Journey:", journey)
print("Even:", answer)
print("Result:", answer and journey[-1] == ("even", 0))`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list"],
    algorithm: "Mutual recursion parity check",
    phases: ["Enter the current parity claim", "Switch to the opposite claim for n minus one", "Resolve the claim at zero"],
    invariants: ["Each switch preserves the original number's parity relationship"],
    edgeCases: ["Zero resolves directly as even"],
    comparisonGroup: "recursion-foundations",
    complexity: { time: "O(n)", space: "O(n)", note: "The two functions alternate across n reductions." },
    bestViews: ["Calls and Recursion", "Operation Journey", "Algorithm Path"],
    eventTypes: ["ENTER_SUBPROBLEM", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Compare recursive and iterative factorial",
    objective: "Verify equal factorial results while separating recursive depth from loop state.",
    difficulty: "Guided Challenge",
    code: `
number = 6
recursive_calls = []
iterative_steps = []

def recursive_factorial(value):
    recursive_calls.append(value)
    if value <= 1:
        return 1
    return value * recursive_factorial(value - 1)

def iterative_factorial(value):
    result = 1
    for factor in range(2, value + 1):
        result *= factor
        iterative_steps.append((factor, result))
    return result

recursive_answer = recursive_factorial(number)
iterative_answer = iterative_factorial(number)
print("Recursive calls:", recursive_calls)
print("Iterative steps:", iterative_steps)
print("Answers:", recursive_answer, iterative_answer)
print("Result:", recursive_answer == iterative_answer == 720)`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list"],
    algorithm: "Recursive versus iterative factorial",
    phases: ["Calculate through recursive descent", "Calculate through loop accumulation", "Compare equal final results"],
    invariants: ["Both forms multiply the integers from two through n exactly once"],
    edgeCases: ["Zero and one return one in both forms"],
    comparisonGroup: "factorial-forms",
    complexity: { time: "O(n) for both", space: "O(n) recursive and O(1) iterative", note: "Both perform linear multiplication work, but only recursion keeps n active call frames." },
    bestViews: ["Compare Algorithms", "Calls and Recursion", "Complexity Lab"],
    eventTypes: ["ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Compare naive and memoized Fibonacci",
    objective: "Measure repeated recursive calls before and after memoization on the same input.",
    difficulty: "Guided Challenge",
    code: `
number = 8
naive_calls = 0
memo_calls = 0
memo = {0: 0, 1: 1}

def naive_fibonacci(value):
    global naive_calls
    naive_calls += 1
    if value < 2:
        return value
    return naive_fibonacci(value - 1) + naive_fibonacci(value - 2)

def memo_fibonacci(value):
    global memo_calls
    memo_calls += 1
    if value in memo:
        return memo[value]
    memo[value] = memo_fibonacci(value - 1) + memo_fibonacci(value - 2)
    return memo[value]

naive_answer = naive_fibonacci(number)
memo_answer = memo_fibonacci(number)
print("Calls:", naive_calls, memo_calls)
print("Answers:", naive_answer, memo_answer)
print("Result:", naive_answer == memo_answer == 21 and memo_calls < naive_calls)`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "hash-table"],
    algorithm: "Naive versus memoized Fibonacci",
    phases: ["Run the repeated-subproblem recursion", "Run the memoized recursion", "Compare answers and observed calls"],
    invariants: ["Both functions implement the same Fibonacci recurrence"],
    edgeCases: ["Zero and one do not create repeated subproblems"],
    comparisonGroup: "fibonacci-forms",
    complexity: { time: "O(2^n) naive and O(n) memoized", space: "O(n)", note: "The call counters are observed for n equals eight; the Big O statements describe growth." },
    bestViews: ["Compare Algorithms", "Calls and Recursion", "Complexity Lab"],
    eventTypes: ["ENTER_SUBPROBLEM", "FIND", "INSERT", "RETURN_RESULT"],
  },
];

/** Backtracking lessons grow choices, reject invalid states, and undo decisions. */
const backtrackingPrograms = [
  {
    title: "Generate every fixed-length binary string",
    objective: "Build a complete choice tree by appending zero and one at every position.",
    difficulty: "Beginner",
    code: `
length = 3
results = []
journey = []

def generate(prefix):
    journey.append(prefix)
    if len(prefix) == length:
        results.append(prefix)
        return
    generate(prefix + "0")
    generate(prefix + "1")

generate("")
print("Strings:", results)
print("Visited states:", len(journey))
print("Result:", len(results) == 8 and results[0] == "000" and results[-1] == "111")`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "stack", "python-list"],
    algorithm: "Binary choice backtracking",
    phases: ["Choose the next bit", "Record a complete string", "Return to explore the other bit"],
    invariants: ["Every prefix length is at most the requested length"],
    edgeCases: ["Length zero produces one empty string"],
    comparisonGroup: "backtracking-choice-trees",
    complexity: { time: "O(2^n)", space: "O(n)", note: "There are two choices at each of n positions and at most n active frames." },
    bestViews: ["Calls and Recursion", "Algorithm Path", "Operation Journey"],
    eventTypes: ["CHOOSE", "ENTER_SUBPROBLEM", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Enumerate all subsets",
    objective: "Represent each subset decision as include or exclude for one array value.",
    difficulty: "Beginner",
    code: `
values = [1, 2, 3]
subsets = []
current = []

def build(index):
    if index == len(values):
        subsets.append(current.copy())
        return

    build(index + 1)

    current.append(values[index])
    build(index + 1)
    current.pop()

build(0)
print("Subsets:", subsets)
print("Count:", len(subsets))
print("Result:", len(subsets) == 8 and [] in subsets and values in subsets)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "stack", "python-list"],
    algorithm: "Subset backtracking",
    phases: ["Exclude the current value", "Include the current value", "Undo the inclusion"],
    invariants: ["current contains only choices from indices before the active index"],
    edgeCases: ["An empty input has one subset: the empty subset"],
    comparisonGroup: "backtracking-choice-trees",
    complexity: { time: "O(n * 2^n)", space: "O(n)", note: "The choice tree has 2^n leaves and copying a subset can take O(n)." },
    bestViews: ["Calls and Recursion", "Mutation Explorer", "Algorithm Path"],
    eventTypes: ["CHOOSE", "INSERT", "REMOVE", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Permute distinct symbols in place",
    objective: "Choose each remaining symbol, recurse, and restore the list with a matching swap.",
    code: `
symbols = ["A", "B", "C"]
permutations = []
swaps = []

def permute(start):
    if start == len(symbols):
        permutations.append("".join(symbols))
        return
    for index in range(start, len(symbols)):
        symbols[start], symbols[index] = symbols[index], symbols[start]
        swaps.append((start, index, "choose"))
        permute(start + 1)
        symbols[start], symbols[index] = symbols[index], symbols[start]
        swaps.append((start, index, "restore"))

permute(0)
print("Permutations:", permutations)
print("Restored:", symbols)
print("Result:", len(permutations) == 6 and symbols == ["A", "B", "C"])`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "In-place permutation backtracking",
    phases: ["Swap a candidate into the active position", "Permute the remaining suffix", "Restore the original positions"],
    invariants: ["Positions before start are fixed for the active branch", "Every choose swap has a restore swap"],
    edgeCases: ["An empty list has one empty permutation"],
    comparisonGroup: "permutation-pruning",
    complexity: { time: "O(n * n!)", space: "O(n)", note: "There are n! complete arrangements and each output contains n symbols." },
    bestViews: ["Calls and Recursion", "Mutation Explorer", "Step Table"],
    eventTypes: ["SWAP", "CHOOSE", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Choose fixed-size combinations",
    objective: "Grow increasing combinations while pruning branches with too few remaining values.",
    difficulty: "Beginner",
    code: `
upper = 5
size = 3
combinations = []
current = []
pruned = 0

def choose(start):
    global pruned
    if len(current) == size:
        combinations.append(current.copy())
        return
    needed = size - len(current)
    if upper - start + 1 < needed:
        pruned += 1
        return
    for value in range(start, upper + 1):
        current.append(value)
        choose(value + 1)
        current.pop()

choose(1)
print("Combinations:", combinations)
print("Pruned:", pruned)
print("Result:", len(combinations) == 10 and combinations[0] == [1, 2, 3])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "stack", "python-list"],
    algorithm: "Combination backtracking",
    phases: ["Check completion and remaining capacity", "Choose a larger next value", "Undo before trying the next candidate"],
    invariants: ["Values inside current are strictly increasing"],
    edgeCases: ["A requested size above the available count has no solutions"],
    comparisonGroup: "combination-search",
    complexity: { time: "O(C(n, k) * k)", space: "O(k)", note: "The search emits each size-k combination and stores at most k choices." },
    bestViews: ["Calls and Recursion", "Decisions", "Algorithm Path"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Build combinations that reach a target",
    objective: "Reuse sorted positive candidates while pruning sums that exceed the target.",
    code: `
candidates = [2, 3, 5]
target = 8
solutions = []
current = []
rejected = []

def search(start, remaining):
    if remaining == 0:
        solutions.append(current.copy())
        return
    for index in range(start, len(candidates)):
        value = candidates[index]
        if value > remaining:
            rejected.append((value, remaining))
            break
        current.append(value)
        search(index, remaining - value)
        current.pop()

search(0, target)
print("Solutions:", solutions)
print("Rejected boundaries:", rejected)
print("Result:", solutions == [[2, 2, 2, 2], [2, 3, 3], [3, 5]])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "stack", "python-list"],
    algorithm: "Combination-sum backtracking",
    phases: ["Check the remaining target", "Choose a reusable candidate", "Prune oversized candidates and restore"],
    invariants: ["The chosen values are nondecreasing and sum to target minus remaining"],
    edgeCases: ["A target of zero has one empty combination"],
    comparisonGroup: "combination-search",
    complexity: { time: "Exponential in target depth", space: "O(target / min candidate)", note: "The branching search is bounded by how many smallest candidates can fit." },
    bestViews: ["Calls and Recursion", "Watches", "Edge Case Lab"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Generate balanced parentheses",
    objective: "Prune invalid prefixes by tracking how many opening and closing marks have been used.",
    code: `
pairs = 3
results = []
states = []

def build(prefix, opened, closed):
    states.append((prefix, opened, closed))
    if len(prefix) == pairs * 2:
        results.append(prefix)
        return
    if opened < pairs:
        build(prefix + "(", opened + 1, closed)
    if closed < opened:
        build(prefix + ")", opened, closed + 1)

build("", 0, 0)
print("Parentheses:", results)
print("States:", len(states))
print("Result:", results == ["((()))", "(()())", "(())()", "()(())", "()()()"])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "stack", "python-list"],
    algorithm: "Balanced-parentheses backtracking",
    phases: ["Add an opening mark when capacity remains", "Add a closing mark only after an unmatched opening", "Record a complete valid string"],
    invariants: ["closed never exceeds opened and opened never exceeds pairs"],
    edgeCases: ["Zero pairs produce one empty string"],
    comparisonGroup: "constraint-pruning",
    complexity: { time: "O(C_n * n)", space: "O(n)", note: "The nth Catalan number counts valid results, each with length 2n." },
    bestViews: ["Calls and Recursion", "Decisions", "Invariant Checker"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Find every route through a blocked grid",
    objective: "Explore right and down moves while rejecting blocked or out-of-bounds cells.",
    code: `
grid = [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
]
rows, columns = len(grid), len(grid[0])
routes = []
path = []

def walk(row, column):
    if row >= rows or column >= columns or grid[row][column] == 1:
        return
    path.append((row, column))
    if (row, column) == (rows - 1, columns - 1):
        routes.append(path.copy())
    else:
        walk(row, column + 1)
        walk(row + 1, column)
    path.pop()

walk(0, 0)
print("Routes:", routes)
print("Count:", len(routes))
print("Result:", len(routes) == 2 and all(route[-1] == (2, 2) for route in routes))`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "stack"],
    algorithm: "Grid-route backtracking",
    phases: ["Reject an invalid cell", "Choose the current cell", "Explore moves and remove the cell"],
    invariants: ["Every path contains only open in-bounds cells"],
    edgeCases: ["A blocked start or destination has no route"],
    comparisonGroup: "grid-backtracking",
    complexity: { time: "O(2^(r+c)) in the open-grid bound", space: "O(r + c)", note: "Each position can branch right and down along paths of at most r plus c cells." },
    bestViews: ["Algorithm Path", "Calls and Recursion", "Structure Canvas"],
    eventTypes: ["VISIT_NODE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Place four queens without attacks",
    objective: "Track occupied columns and diagonals while enumerating valid queen placements.",
    difficulty: "Guided Challenge",
    code: `
size = 4
solutions = []
placement = []
columns = set()
down_diagonals = set()
up_diagonals = set()

def place(row):
    if row == size:
        solutions.append(placement.copy())
        return
    for column in range(size):
        down = row - column
        up = row + column
        if column in columns or down in down_diagonals or up in up_diagonals:
            continue
        placement.append(column)
        columns.add(column)
        down_diagonals.add(down)
        up_diagonals.add(up)
        place(row + 1)
        placement.pop()
        columns.remove(column)
        down_diagonals.remove(down)
        up_diagonals.remove(up)

place(0)
print("Solutions:", solutions)
print("Count:", len(solutions))
print("Result:", solutions == [[1, 3, 0, 2], [2, 0, 3, 1]])`,
    expectedResult: "Result: True",
    structureTypes: ["array", "set", "tree", "stack"],
    algorithm: "N-Queens backtracking",
    phases: ["Test one column and both diagonals", "Place a safe queen", "Remove it after exploring the next row"],
    invariants: ["No two placed queens share a column or diagonal"],
    edgeCases: ["Boards of size two and three have no solutions"],
    comparisonGroup: "constraint-pruning",
    complexity: { time: "O(n!) upper bound", space: "O(n)", note: "Column uniqueness limits each row to unused columns before diagonal pruning." },
    bestViews: ["Invariant Checker", "Calls and Recursion", "Algorithm Path"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Solve a four-by-four Sudoku",
    objective: "Choose an empty cell, try legal values, and restore the cell after a failed branch.",
    difficulty: "Guided Challenge",
    code: `
board = [
    [1, 0, 0, 4],
    [0, 4, 1, 0],
    [0, 1, 4, 0],
    [4, 0, 0, 1],
]
size = 4
box = 2
attempts = 0

def valid(row, column, value):
    if value in board[row]:
        return False
    if any(board[index][column] == value for index in range(size)):
        return False
    start_row = (row // box) * box
    start_column = (column // box) * box
    return all(
        board[r][c] != value
        for r in range(start_row, start_row + box)
        for c in range(start_column, start_column + box)
    )

def solve():
    global attempts
    for row in range(size):
        for column in range(size):
            if board[row][column] == 0:
                for value in range(1, size + 1):
                    attempts += 1
                    if valid(row, column, value):
                        board[row][column] = value
                        if solve():
                            return True
                        board[row][column] = 0
                return False
    return True

solved = solve()
expected = [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]]
print("Board:", board)
print("Attempts:", attempts)
print("Result:", solved and board == expected)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "set"],
    algorithm: "Sudoku backtracking",
    phases: ["Find the next empty cell", "Try a row-column-box legal value", "Restore zero after a failed continuation"],
    invariants: ["Every filled row, column, and box contains no duplicate nonzero value"],
    edgeCases: ["An already complete valid board returns immediately"],
    comparisonGroup: "constraint-satisfaction",
    complexity: { time: "O(k^e) upper bound", space: "O(e)", note: "For e empty cells, each can try up to k symbols before constraint pruning." },
    bestViews: ["Structure Canvas", "Calls and Recursion", "Invariant Checker"],
    eventTypes: ["COMPARE", "WRITE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Search for a word in a letter board",
    objective: "Follow adjacent cells without reusing one cell inside the same candidate path.",
    code: `
board = [
    ["A", "B", "C", "E"],
    ["S", "F", "C", "S"],
    ["A", "D", "E", "E"],
]
word = "ABCCED"
rows, columns = len(board), len(board[0])
path = []

def search(row, column, index):
    if index == len(word):
        return True
    if row < 0 or row >= rows or column < 0 or column >= columns:
        return False
    if board[row][column] != word[index]:
        return False
    letter = board[row][column]
    board[row][column] = "#"
    path.append((row, column))
    found = (
        search(row + 1, column, index + 1)
        or search(row - 1, column, index + 1)
        or search(row, column + 1, index + 1)
        or search(row, column - 1, index + 1)
    )
    board[row][column] = letter
    if not found:
        path.pop()
    return found

found = any(search(r, c, 0) for r in range(rows) for c in range(columns))
print("Path:", path)
print("Found:", found)
print("Result:", found and len(path) == len(word))`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "stack"],
    algorithm: "Word-search backtracking",
    phases: ["Match the next character", "Mark the cell during four-direction search", "Restore the letter before returning"],
    invariants: ["A cell marked with # occurs at most once in the active path"],
    edgeCases: ["An empty word is found without visiting a cell"],
    comparisonGroup: "grid-backtracking",
    complexity: { time: "O(r * c * 3^L)", space: "O(L)", note: "After the first letter, a path has at most three unused directions for L characters." },
    bestViews: ["Algorithm Path", "Mutation Explorer", "Calls and Recursion"],
    eventTypes: ["VISIT_NODE", "COMPARE", "WRITE", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Color a graph with three colors",
    objective: "Assign colors one vertex at a time while rejecting colors used by assigned neighbors.",
    code: `
graph = {
    "A": ["B", "C"],
    "B": ["A", "C"],
    "C": ["A", "B"],
}
colors = ["red", "green", "blue"]
assignment = {}
solutions = []

def color(vertex_index):
    vertices = list(graph)
    if vertex_index == len(vertices):
        solutions.append(assignment.copy())
        return
    vertex = vertices[vertex_index]
    forbidden = {assignment[n] for n in graph[vertex] if n in assignment}
    for candidate in colors:
        if candidate in forbidden:
            continue
        assignment[vertex] = candidate
        color(vertex_index + 1)
        del assignment[vertex]

color(0)
print("Colorings:", solutions)
print("Count:", len(solutions))
print("Result:", len(solutions) == 6 and all(len(set(s.values())) == 3 for s in solutions))`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "set", "stack"],
    algorithm: "Graph-coloring backtracking",
    phases: ["Collect neighbor colors", "Choose an allowed color", "Remove the assignment after exploring"],
    invariants: ["No assigned adjacent vertices share a color"],
    edgeCases: ["A self-loop makes a proper coloring impossible under this contract"],
    comparisonGroup: "constraint-satisfaction",
    complexity: { time: "O(k^V * E) upper bound", space: "O(V)", note: "Up to k colors are tried per vertex, with neighbor checks pruning invalid branches." },
    bestViews: ["Structure Canvas", "Invariant Checker", "Algorithm Path"],
    eventTypes: ["VISIT_NODE", "COMPARE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Find one subset with a requested sum",
    objective: "Stop the include-exclude search as soon as one positive-number subset reaches the target.",
    code: `
values = [3, 34, 4, 12, 5, 2]
target = 9
chosen = []
visited = []

def find_subset(index, remaining):
    visited.append((index, remaining))
    if remaining == 0:
        return True
    if index == len(values) or remaining < 0:
        return False

    chosen.append(values[index])
    if find_subset(index + 1, remaining - values[index]):
        return True
    chosen.pop()

    return find_subset(index + 1, remaining)

found = find_subset(0, target)
print("Chosen:", chosen)
print("Visited:", len(visited))
print("Result:", found and sum(chosen) == target)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "array", "stack"],
    algorithm: "Subset-sum backtracking",
    phases: ["Test completion and positive overshoot", "Include the current value", "Undo and exclude it"],
    invariants: ["sum(chosen) plus remaining equals the original target"],
    edgeCases: ["Target zero succeeds with the empty subset"],
    comparisonGroup: "subset-constraints",
    complexity: { time: "O(2^n)", space: "O(n)", note: "Each value can be included or excluded before pruning." },
    bestViews: ["Calls and Recursion", "Watches", "Algorithm Path"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Partition values into equal-sum groups",
    objective: "Reduce equal partition to choosing a subset whose sum is half the total.",
    code: `
values = [1, 5, 11, 5]
total = sum(values)
target = total // 2
left_group = []

def choose(index, remaining):
    if remaining == 0:
        return True
    if index == len(values) or remaining < 0:
        return False
    left_group.append(values[index])
    if choose(index + 1, remaining - values[index]):
        return True
    left_group.pop()
    return choose(index + 1, remaining)

possible = total % 2 == 0 and choose(0, target)
right_group = values.copy()
for value in left_group:
    right_group.remove(value)

print("Groups:", left_group, right_group)
print("Sums:", sum(left_group), sum(right_group))
print("Result:", possible and sum(left_group) == sum(right_group) == 11)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "Equal-partition backtracking",
    phases: ["Reject an odd total", "Search for a half-total subset", "Derive the remaining group"],
    invariants: ["The two groups together preserve every input occurrence"],
    edgeCases: ["An odd total cannot split into equal integer sums"],
    comparisonGroup: "subset-constraints",
    complexity: { time: "O(2^n)", space: "O(n)", note: "The subset search can examine both decisions for every value." },
    bestViews: ["Calls and Recursion", "Invariant Checker", "Edge Case Lab"],
    eventTypes: ["COMPARE", "CHOOSE", "BACKTRACK", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Expand telephone keypad choices",
    objective: "Map each digit to letters and backtrack through the Cartesian product.",
    difficulty: "Beginner",
    code: `
digits = "23"
letters = {
    "2": "abc",
    "3": "def",
}
combinations = []
current = []

def expand(index):
    if index == len(digits):
        combinations.append("".join(current))
        return
    for letter in letters[digits[index]]:
        current.append(letter)
        expand(index + 1)
        current.pop()

expand(0)
print("Combinations:", combinations)
print("Count:", len(combinations))
print("Result:", len(combinations) == 9 and combinations[0] == "ad" and combinations[-1] == "cf")`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "tree", "stack"],
    algorithm: "Keypad-combination backtracking",
    phases: ["Look up letters for the current digit", "Choose one letter", "Remove it after expanding the suffix"],
    invariants: ["current contains exactly one letter for every processed digit"],
    edgeCases: ["An empty digit string produces no displayed combinations in many interfaces; this lesson records one empty product internally"],
    comparisonGroup: "backtracking-choice-trees",
    complexity: { time: "O(4^n * n)", space: "O(n)", note: "A digit offers at most four letters and each completed string has length n." },
    bestViews: ["Calls and Recursion", "References", "Algorithm Path"],
    eventTypes: ["READ", "CHOOSE", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Partition text into palindromes",
    objective: "Choose only palindromic prefixes and continue partitioning the remaining suffix.",
    code: `
text = "aab"
partitions = []
current = []
rejected = []

def is_palindrome(start, end):
    return text[start:end] == text[start:end][::-1]

def partition(start):
    if start == len(text):
        partitions.append(current.copy())
        return
    for end in range(start + 1, len(text) + 1):
        if not is_palindrome(start, end):
            rejected.append(text[start:end])
            continue
        current.append(text[start:end])
        partition(end)
        current.pop()

partition(0)
print("Partitions:", partitions)
print("Rejected:", rejected)
print("Result:", partitions == [["a", "a", "b"], ["aa", "b"]])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "stack", "python-list"],
    algorithm: "Palindrome-partition backtracking",
    phases: ["Try every next prefix", "Reject non-palindromic prefixes", "Backtrack after partitioning the suffix"],
    invariants: ["Every string inside current is a palindrome and their concatenation equals the processed prefix"],
    edgeCases: ["An empty string has one empty partition"],
    comparisonGroup: "string-backtracking",
    complexity: { time: "O(n * 2^n)", space: "O(n)", note: "There are exponentially many cut patterns and palindrome checks copy or inspect substrings." },
    bestViews: ["Calls and Recursion", "Decisions", "Algorithm Path"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
  {
    title: "Prune duplicate permutations",
    objective: "Skip equal candidates at one decision depth so repeated input values produce unique arrangements.",
    difficulty: "Guided Challenge",
    code: `
values = [1, 1, 2]
values.sort()
used = [False] * len(values)
current = []
permutations = []
pruned = 0

def build():
    global pruned
    if len(current) == len(values):
        permutations.append(current.copy())
        return
    for index, value in enumerate(values):
        if used[index]:
            continue
        if index > 0 and values[index] == values[index - 1] and not used[index - 1]:
            pruned += 1
            continue
        used[index] = True
        current.append(value)
        build()
        current.pop()
        used[index] = False

build()
print("Unique permutations:", permutations)
print("Pruned:", pruned)
print("Result:", permutations == [[1, 1, 2], [1, 2, 1], [2, 1, 1]] and pruned > 0)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "tree", "stack"],
    algorithm: "Duplicate-aware permutation backtracking",
    phases: ["Sort equal values together", "Skip a duplicate whose earlier twin is unused", "Choose, recurse, and restore"],
    invariants: ["At one depth, equal unused values start only one equivalent branch"],
    edgeCases: ["All equal values produce exactly one permutation"],
    comparisonGroup: "permutation-pruning",
    complexity: { time: "O(n * n! / product(count!))", space: "O(n)", note: "Duplicate pruning reduces leaves to the number of unique permutations." },
    bestViews: ["Calls and Recursion", "Decisions", "Compare Algorithms"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "BACKTRACK", "RETURN_RESULT"],
  },
];

/** Divide-and-conquer lessons split inputs, solve parts, and combine evidence. */
const divideAndConquerPrograms = [
  {
    title: "Sum balanced halves",
    objective: "Split an array until one-value segments and combine their sums.",
    difficulty: "Beginner",
    code: `
values = [4, 7, 1, 9, 3, 6]
segments = []

def range_sum(items, left, right):
    segments.append((left, right))
    if left == right:
        return items[left]
    middle = (left + right) // 2
    left_sum = range_sum(items, left, middle)
    right_sum = range_sum(items, middle + 1, right)
    return left_sum + right_sum

total = range_sum(values, 0, len(values) - 1)
print("Segments:", segments)
print("Total:", total)
print("Result:", total == 30 and len(segments) == 11)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "Divide-and-conquer sum",
    phases: ["Split a multi-value range", "Return a one-value sum", "Add the two half sums"],
    invariants: ["Every returned sum covers exactly its inclusive range"],
    edgeCases: ["A one-value range is already solved"],
    comparisonGroup: "divide-reductions",
    complexity: { time: "O(n)", space: "O(log n)", note: "Every value appears in one leaf and balanced recursion uses logarithmic depth." },
    bestViews: ["Calls and Recursion", "Algorithm Path", "Step Table"],
    eventTypes: ["PARTITION", "ENTER_SUBPROBLEM", "MERGE", "RETURN_RESULT"],
  },
  {
    title: "Select the maximum from balanced halves",
    objective: "Compare the maximum returned by each recursively solved half.",
    difficulty: "Beginner",
    code: `
values = [-5, 12, 3, 8, 19, 2, 7]
comparisons = []

def range_max(items, left, right):
    if left == right:
        return items[left]
    middle = (left + right) // 2
    left_max = range_max(items, left, middle)
    right_max = range_max(items, middle + 1, right)
    comparisons.append((left_max, right_max))
    return left_max if left_max > right_max else right_max

maximum = range_max(values, 0, len(values) - 1)
print("Half maxima:", comparisons)
print("Maximum:", maximum)
print("Result:", maximum == 19 and len(comparisons) == len(values) - 1)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "Divide-and-conquer maximum",
    phases: ["Split the current range", "Solve both halves", "Choose the larger half result"],
    invariants: ["Each returned candidate is the maximum of its complete range"],
    edgeCases: ["A single value is its range maximum"],
    comparisonGroup: "divide-reductions",
    complexity: { time: "O(n)", space: "O(log n)", note: "The recursion performs n minus one combines with balanced depth." },
    bestViews: ["Calls and Recursion", "Decisions", "Operation Journey"],
    eventTypes: ["PARTITION", "COMPARE", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Merge sorted halves",
    objective: "Trace recursive splitting and the stable merge that rebuilds one sorted list.",
    code: `
values = [8, 3, 5, 1, 9, 6, 2, 7]
merges = []

def merge(left, right):
    combined = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            combined.append(left[i])
            i += 1
        else:
            combined.append(right[j])
            j += 1
    combined.extend(left[i:])
    combined.extend(right[j:])
    merges.append((left, right, combined.copy()))
    return combined

def merge_sort(items):
    if len(items) <= 1:
        return items.copy()
    middle = len(items) // 2
    return merge(merge_sort(items[:middle]), merge_sort(items[middle:]))

sorted_values = merge_sort(values)
print("Sorted:", sorted_values)
print("Merge count:", len(merges))
print("Result:", sorted_values == sorted(values) and len(merges) == 7)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "Merge sort",
    phases: ["Split until one-value lists", "Sort both halves recursively", "Stably merge the ordered halves"],
    invariants: ["Every list returned by merge_sort is sorted and preserves its input occurrences"],
    edgeCases: ["Empty and one-value lists return copied base cases"],
    comparisonGroup: "divide-sorting",
    complexity: { time: "O(n log n)", space: "O(n)", note: "There are logarithmic merge levels, each processing all n values into auxiliary lists." },
    bestViews: ["Calls and Recursion", "Mutation Explorer", "Complexity Lab"],
    eventTypes: ["PARTITION", "COMPARE", "MERGE", "RETURN_RESULT"],
  },
  {
    title: "Partition values around a pivot",
    objective: "Build recursive quicksort partitions and inspect how input shape changes their balance.",
    code: `
values = [7, 2, 9, 4, 3, 8, 5]
partitions = []

def quicksort(items):
    if len(items) <= 1:
        return items.copy()
    pivot = items[-1]
    lower = [value for value in items[:-1] if value <= pivot]
    higher = [value for value in items[:-1] if value > pivot]
    partitions.append((pivot, lower.copy(), higher.copy()))
    return quicksort(lower) + [pivot] + quicksort(higher)

sorted_values = quicksort(values)
print("Partitions:", partitions)
print("Sorted:", sorted_values)
print("Result:", sorted_values == sorted(values) and partitions[0][0] == 5)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "Out-of-place quicksort",
    phases: ["Choose the final value as pivot", "Partition remaining values", "Sort both partitions and concatenate"],
    invariants: ["Every lower value is at most the pivot and every higher value is greater"],
    edgeCases: ["Already sorted input creates unbalanced partitions with this pivot rule"],
    comparisonGroup: "divide-sorting",
    complexity: { time: "O(n log n) average, O(n^2) worst", space: "O(n)", note: "Partition balance controls recursion depth; this teaching form also allocates new lists." },
    bestViews: ["Calls and Recursion", "Decisions", "Edge Case Lab"],
    eventTypes: ["PARTITION", "COMPARE", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Locate the first duplicate boundary",
    objective: "Use divide-and-conquer boundaries to find the first index whose value reaches a target.",
    code: `
values = [2, 4, 4, 4, 7, 9]
target = 4
ranges = []

def lower_bound(items, target, low, high):
    ranges.append((low, high))
    if low == high:
        return low
    middle = (low + high) // 2
    if items[middle] < target:
        return lower_bound(items, target, middle + 1, high)
    return lower_bound(items, target, low, middle)

index = lower_bound(values, target, 0, len(values))
found = index < len(values) and values[index] == target
print("Ranges:", ranges)
print("Boundary:", index)
print("Result:", found and index == 1)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack"],
    algorithm: "Recursive lower bound",
    phases: ["Inspect the middle boundary", "Discard the side that cannot contain the first match", "Return the one-position boundary"],
    invariants: ["The first value at least target remains inside the half-open range"],
    edgeCases: ["A target above all values returns len(items)"],
    comparisonGroup: "binary-search-forms",
    complexity: { time: "O(log n)", space: "O(log n)", note: "Every call halves a half-open search range." },
    bestViews: ["Calls and Recursion", "Watches", "Algorithm Path"],
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Count inversions during merge",
    objective: "Count cross-half out-of-order pairs while merging two sorted recursive results.",
    difficulty: "Guided Challenge",
    code: `
values = [2, 4, 1, 3, 5]
merge_counts = []

def sort_and_count(items):
    if len(items) <= 1:
        return items.copy(), 0
    middle = len(items) // 2
    left, left_count = sort_and_count(items[:middle])
    right, right_count = sort_and_count(items[middle:])
    merged = []
    i = j = cross_count = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            cross_count += len(left) - i
            j += 1
    merged.extend(left[i:])
    merged.extend(right[j:])
    total = left_count + right_count + cross_count
    merge_counts.append((left, right, cross_count))
    return merged, total

sorted_values, inversions = sort_and_count(values)
print("Merges:", merge_counts)
print("Sorted:", sorted_values)
print("Inversions:", inversions)
print("Result:", sorted_values == sorted(values) and inversions == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "Merge-sort inversion counting",
    phases: ["Count inversions in each half", "Count cross inversions during merge", "Add the three counts"],
    invariants: ["A right value chosen before remaining left values forms one inversion with each remainder"],
    edgeCases: ["Sorted input has zero inversions"],
    comparisonGroup: "divide-counting",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Merge sort orders and counts without checking every pair directly." },
    bestViews: ["Calls and Recursion", "Step Table", "Invariant Checker"],
    eventTypes: ["PARTITION", "COMPARE", "MERGE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Find a maximum crossing subarray",
    objective: "Combine the best left, right, and center-crossing sums for each range.",
    difficulty: "Guided Challenge",
    code: `
values = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
combines = []

def maximum_subarray(items, left, right):
    if left == right:
        return items[left], left, right
    middle = (left + right) // 2
    left_best = maximum_subarray(items, left, middle)
    right_best = maximum_subarray(items, middle + 1, right)

    running = 0
    best_left_sum = float("-inf")
    best_left_index = middle
    for index in range(middle, left - 1, -1):
        running += items[index]
        if running > best_left_sum:
            best_left_sum = running
            best_left_index = index

    running = 0
    best_right_sum = float("-inf")
    best_right_index = middle + 1
    for index in range(middle + 1, right + 1):
        running += items[index]
        if running > best_right_sum:
            best_right_sum = running
            best_right_index = index

    crossing = (best_left_sum + best_right_sum, best_left_index, best_right_index)
    answer = max(left_best, right_best, crossing, key=lambda result: result[0])
    combines.append((left, right, answer))
    return answer

best_sum, start, end = maximum_subarray(values, 0, len(values) - 1)
print("Best slice:", values[start:end + 1])
print("Best sum:", best_sum)
print("Result:", best_sum == 6 and values[start:end + 1] == [4, -1, 2, 1])`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "Divide-and-conquer maximum subarray",
    phases: ["Solve the left and right halves", "Measure the best center-crossing range", "Choose the greatest of three candidates"],
    invariants: ["Every returned range is contiguous and lies inside its current boundaries"],
    edgeCases: ["All-negative input returns its greatest single value"],
    comparisonGroup: "divide-range-optimization",
    complexity: { time: "O(n log n)", space: "O(log n)", note: "Each recursion level scans crossing ranges whose total length is n." },
    bestViews: ["Calls and Recursion", "Watches", "Complexity Lab"],
    eventTypes: ["PARTITION", "COMPARE", "CHOOSE", "MERGE", "RETURN_RESULT"],
  },
  {
    title: "Vote for a majority across halves",
    objective: "Combine majority candidates from two halves and verify their counts in the current range.",
    code: `
values = ["A", "B", "A", "A", "C", "A", "A"]
checks = []

def majority(items, left, right):
    if left == right:
        return items[left]
    middle = (left + right) // 2
    left_candidate = majority(items, left, middle)
    right_candidate = majority(items, middle + 1, right)
    if left_candidate == right_candidate:
        return left_candidate
    left_count = sum(items[index] == left_candidate for index in range(left, right + 1))
    right_count = sum(items[index] == right_candidate for index in range(left, right + 1))
    checks.append((left, right, left_candidate, left_count, right_candidate, right_count))
    return left_candidate if left_count > right_count else right_candidate

candidate = majority(values, 0, len(values) - 1)
count = values.count(candidate)
print("Checks:", checks)
print("Candidate:", candidate, count)
print("Result:", candidate == "A" and count > len(values) // 2)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "Divide-and-conquer majority candidate",
    phases: ["Find a candidate in each half", "Return immediately when candidates agree", "Count competing candidates in the complete range"],
    invariants: ["A true range majority must be a majority candidate from at least one half"],
    edgeCases: ["A final candidate still requires verification when no majority is promised"],
    comparisonGroup: "divide-counting",
    complexity: { time: "O(n log n)", space: "O(log n)", note: "Each level recounts candidates across ranges totaling n." },
    bestViews: ["Calls and Recursion", "Decisions", "Invariant Checker"],
    eventTypes: ["PARTITION", "COMPARE", "CHOOSE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Multiply large integers with Karatsuba",
    objective: "Replace four half-size products with three recursively combined products.",
    difficulty: "Guided Challenge",
    code: `
calls = []

def karatsuba(left, right):
    calls.append((left, right))
    if left < 10 or right < 10:
        return left * right

    digits = max(len(str(left)), len(str(right)))
    half = digits // 2
    base = 10 ** half
    left_high, left_low = divmod(left, base)
    right_high, right_low = divmod(right, base)

    low_product = karatsuba(left_low, right_low)
    high_product = karatsuba(left_high, right_high)
    mixed_product = karatsuba(left_low + left_high, right_low + right_high)
    middle = mixed_product - low_product - high_product
    return high_product * (base ** 2) + middle * base + low_product

left = 1234
right = 5678
product = karatsuba(left, right)
print("Calls:", len(calls))
print("Product:", product)
print("Result:", product == left * right == 7006652)`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "tree"],
    algorithm: "Karatsuba multiplication",
    phases: ["Split each integer into high and low parts", "Solve three recursive products", "Recombine place values"],
    invariants: ["Each split preserves number equals high times base plus low"],
    edgeCases: ["A one-digit operand uses direct multiplication"],
    comparisonGroup: "fast-multiplication",
    complexity: { time: "O(n^log2(3))", space: "O(log n)", note: "Three half-size multiplications replace the four used by direct divide-and-conquer multiplication." },
    bestViews: ["Calls and Recursion", "Before and After", "Complexity Lab"],
    eventTypes: ["PARTITION", "ENTER_SUBPROBLEM", "MERGE", "RETURN_RESULT"],
  },
  {
    title: "Select a rank by recursive partition",
    objective: "Discard the partition that cannot contain the requested sorted rank.",
    code: `
values = [9, 1, 7, 3, 8, 2, 6, 4, 5]
rank = 4
partitions = []

def quickselect(items, target_rank):
    if len(items) == 1:
        return items[0]
    pivot = items[len(items) // 2]
    lower = [value for value in items if value < pivot]
    equal = [value for value in items if value == pivot]
    higher = [value for value in items if value > pivot]
    partitions.append((pivot, len(lower), len(equal), len(higher), target_rank))
    if target_rank < len(lower):
        return quickselect(lower, target_rank)
    if target_rank < len(lower) + len(equal):
        return pivot
    return quickselect(higher, target_rank - len(lower) - len(equal))

selected = quickselect(values, rank)
print("Partitions:", partitions)
print("Selected:", selected)
print("Result:", selected == sorted(values)[rank] == 5)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "stack", "tree"],
    algorithm: "Out-of-place quickselect",
    phases: ["Partition around one pivot", "Locate the target rank among partition sizes", "Recurse into only the necessary partition"],
    invariants: ["The adjusted target rank refers to the same value in the selected partition"],
    edgeCases: ["Duplicate pivot values occupy a rank interval"],
    comparisonGroup: "divide-range-optimization",
    complexity: { time: "O(n) average, O(n^2) worst", space: "O(n)", note: "One partition is followed per level, but poor pivots can shrink by only one." },
    bestViews: ["Calls and Recursion", "Watches", "Decisions"],
    eventTypes: ["PARTITION", "COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
];

/** Greedy lessons make locally justified choices and test their preconditions. */
const greedyPrograms = [
  {
    title: "Choose the earliest finishing activities",
    objective: "Maximize non-overlapping activities by repeatedly accepting the next earliest finish.",
    difficulty: "Beginner",
    code: `
activities = [
    ("A", 1, 4),
    ("B", 3, 5),
    ("C", 0, 6),
    ("D", 5, 7),
    ("E", 8, 9),
    ("F", 5, 9),
]
ordered = sorted(activities, key=lambda item: item[2])
selected = []
last_finish = float("-inf")

for name, start, finish in ordered:
    if start >= last_finish:
        selected.append(name)
        last_finish = finish

print("Order:", [item[0] for item in ordered])
print("Selected:", selected)
print("Result:", selected == ["A", "D", "E"])`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Earliest-finish activity selection",
    phases: ["Sort by finish time", "Accept a compatible activity", "Move the finish boundary"],
    invariants: ["Selected activities never overlap and last_finish belongs to the final selection"],
    edgeCases: ["Activities that touch at a boundary are compatible in this lesson"],
    comparisonGroup: "activity-selection-rules",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Sorting dominates the one-pass greedy scan." },
    bestViews: ["Decisions", "Watches", "Operation Journey"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Compare activity-selection rules",
    objective: "Show that earliest finish can outperform choosing the shortest available duration.",
    difficulty: "Guided Challenge",
    code: `
activities = [
    ("LongEarly", 0, 3),
    ("ShortMiddle", 2, 4),
    ("LateOne", 3, 5),
    ("LateTwo", 5, 7),
]

def select(ordered):
    chosen = []
    finish_boundary = float("-inf")
    for name, start, finish in ordered:
        if start >= finish_boundary:
            chosen.append(name)
            finish_boundary = finish
    return chosen

earliest_finish = select(sorted(activities, key=lambda item: item[2]))
shortest_duration = select(sorted(activities, key=lambda item: (item[2] - item[1], item[2])))
print("Earliest finish:", earliest_finish)
print("Shortest duration:", shortest_duration)
print("Result:", len(earliest_finish) == 3 and len(shortest_duration) == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Activity-selection rule comparison",
    phases: ["Order by each proposed local rule", "Run the same compatibility scan", "Compare observed selection counts"],
    invariants: ["Each produced schedule is non-overlapping"],
    edgeCases: ["Tie-breaking can change which optimal schedule appears without changing its size"],
    comparisonGroup: "activity-selection-rules",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Each strategy sorts then scans, but only earliest finish has the reviewed optimality guarantee." },
    bestViews: ["Compare Algorithms", "Decisions", "Complexity Lab"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "RETURN_RESULT"],
  },
  {
    title: "Allocate meeting rooms by earliest release",
    objective: "Reuse the room that becomes free first or open a new room when meetings overlap.",
    code: `
import heapq

meetings = [(0, 30), (5, 10), (15, 20), (25, 35)]
meetings.sort()
room_finishes = []
history = []

for start, finish in meetings:
    if room_finishes and room_finishes[0] <= start:
        released = heapq.heapreplace(room_finishes, finish)
        history.append(("reuse", released, start, finish))
    else:
        heapq.heappush(room_finishes, finish)
        history.append(("open", start, finish))

print("History:", history)
print("Rooms:", len(room_finishes))
print("Result:", len(room_finishes) == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["priority-queue", "array"],
    algorithm: "Minimum meeting rooms",
    phases: ["Sort meetings by start", "Inspect the earliest room finish", "Reuse or open a room"],
    invariants: ["The heap contains one finish time for every room currently represented"],
    edgeCases: ["A meeting starting when another ends can reuse that room"],
    comparisonGroup: "greedy-resource-allocation",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Each meeting performs at most one heap update after sorting." },
    bestViews: ["Structure Canvas", "Operation Journey", "Watches"],
    eventTypes: ["PEEK", "POP", "PUSH", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Fill a fractional knapsack by value density",
    objective: "Take whole or fractional items from highest value per unit weight.",
    code: `
capacity = 10
items = [
    ("A", 6, 30),
    ("B", 3, 18),
    ("C", 4, 20),
]
ordered = sorted(items, key=lambda item: item[2] / item[1], reverse=True)
remaining = capacity
chosen = []
total_value = 0.0

for name, weight, value in ordered:
    if remaining == 0:
        break
    fraction = min(1.0, remaining / weight)
    chosen.append((name, fraction))
    total_value += value * fraction
    remaining -= weight * fraction

print("Chosen:", chosen)
print("Value:", total_value)
print("Result:", chosen == [("B", 1.0), ("A", 1.0), ("C", 0.25)] and total_value == 53.0)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Fractional knapsack",
    phases: ["Sort by value density", "Take the maximum feasible fraction", "Reduce remaining capacity"],
    invariants: ["Chosen weight never exceeds capacity and choices follow nonincreasing density"],
    edgeCases: ["Zero capacity accepts nothing"],
    comparisonGroup: "knapsack-boundaries",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Density sorting dominates the linear fill." },
    bestViews: ["Decisions", "Watches", "Complexity Lab"],
    eventTypes: ["COMPARE", "CHOOSE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Make canonical coin change greedily",
    objective: "Use the largest available coin repeatedly for a denomination system where the rule is optimal.",
    difficulty: "Beginner",
    code: `
coins = [25, 10, 5, 1]
amount = 63
remaining = amount
chosen = []

for coin in coins:
    count, remaining = divmod(remaining, coin)
    chosen.extend([coin] * count)

print("Coins:", chosen)
print("Count:", len(chosen))
print("Remaining:", remaining)
print("Result:", chosen == [25, 25, 10, 1, 1, 1] and sum(chosen) == amount)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Greedy canonical coin change",
    phases: ["Consider coins from largest to smallest", "Take as many as fit", "Carry the remainder forward"],
    invariants: ["Chosen sum plus remaining always equals the original amount"],
    edgeCases: ["Amount zero selects no coins"],
    comparisonGroup: "coin-change-rules",
    complexity: { time: "O(k + output)", space: "O(output)", note: "The lesson scans k denominations and explicitly stores every selected coin." },
    bestViews: ["Watches", "Step Table", "Invariant Checker"],
    eventTypes: ["COMPARE", "CHOOSE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Expose a greedy coin-change counterexample",
    objective: "Compare largest-first coins with an exhaustive optimum when denominations break the greedy guarantee.",
    difficulty: "Guided Challenge",
    code: `
coins = [4, 3, 1]
amount = 6

def greedy_change():
    remaining = amount
    chosen = []
    for coin in coins:
        while coin <= remaining:
            chosen.append(coin)
            remaining -= coin
    return chosen

best = None
def search(remaining, start, chosen):
    global best
    if remaining == 0:
        if best is None or len(chosen) < len(best):
            best = chosen.copy()
        return
    for index in range(start, len(coins)):
        coin = coins[index]
        if coin <= remaining:
            chosen.append(coin)
            search(remaining - coin, index, chosen)
            chosen.pop()

greedy = greedy_change()
search(amount, 0, [])
print("Greedy:", greedy)
print("Optimal:", best)
print("Result:", greedy == [4, 1, 1] and best == [3, 3] and len(best) < len(greedy))`,
    expectedResult: "Result: True",
    structureTypes: ["array", "tree", "stack"],
    algorithm: "Greedy coin-change counterexample",
    phases: ["Run largest-first selection", "Enumerate feasible coin combinations", "Compare the coin counts"],
    invariants: ["Both compared selections sum to the requested amount"],
    edgeCases: ["A denomination set needs proof before largest-first can claim optimality"],
    comparisonGroup: "coin-change-rules",
    complexity: { time: "Greedy O(k + output), exhaustive exponential", space: "Exponential output search", note: "The exhaustive search is a small teaching oracle, not the scalable coin-change solution." },
    bestViews: ["Compare Algorithms", "Edge Case Lab", "Invariant Checker"],
    eventTypes: ["CHOOSE", "REJECT", "BACKTRACK", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Maintain correct lemonade change",
    objective: "Prefer giving a ten-and-five pair before three fives when returning fifteen.",
    code: `
bills = [5, 5, 5, 10, 20]
fives = 0
tens = 0
history = []
possible = True

for bill in bills:
    if bill == 5:
        fives += 1
    elif bill == 10:
        if fives == 0:
            possible = False
            break
        fives -= 1
        tens += 1
    else:
        if tens > 0 and fives > 0:
            tens -= 1
            fives -= 1
        elif fives >= 3:
            fives -= 3
        else:
            possible = False
            break
    history.append((bill, fives, tens))

print("History:", history)
print("Cash:", fives, tens)
print("Result:", possible and history[-1] == (20, 1, 0))`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Greedy lemonade change",
    phases: ["Receive the current bill", "Choose change that preserves flexible fives", "Update available bill counts"],
    invariants: ["Stored fives and tens are nonnegative after every served customer"],
    edgeCases: ["A first bill above five cannot receive change"],
    comparisonGroup: "greedy-cash-rules",
    complexity: { time: "O(n)", space: "O(n) for teaching history", note: "Each customer is handled once; production state needs only two counters." },
    bestViews: ["Decisions", "Before and After", "Invariant Checker"],
    eventTypes: ["COMPARE", "CHOOSE", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Reach the end with the farthest boundary",
    objective: "Update the farthest reachable index and reject an index beyond that boundary.",
    difficulty: "Beginner",
    code: `
jumps = [2, 3, 1, 1, 4]
farthest = 0
history = []
reachable = True

for index, jump in enumerate(jumps):
    if index > farthest:
        reachable = False
        break
    farthest = max(farthest, index + jump)
    history.append((index, jump, farthest))
    if farthest >= len(jumps) - 1:
        break

print("History:", history)
print("Farthest:", farthest)
print("Result:", reachable and farthest >= len(jumps) - 1)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Greedy jump-game reachability",
    phases: ["Reject an unreachable index", "Extend the farthest boundary", "Stop after reaching the destination"],
    invariants: ["Every processed index is reachable and farthest is the greatest reach seen so far"],
    edgeCases: ["A one-value list is already at its destination"],
    comparisonGroup: "greedy-boundaries",
    complexity: { time: "O(n)", space: "O(n) for teaching history", note: "The scan visits each necessary index once." },
    bestViews: ["Watches", "Invariant Checker", "Algorithm Path"],
    eventTypes: ["VISIT_INDEX", "COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Find a complete gas-station circuit",
    objective: "Reset the candidate start after any prefix deficit while preserving total feasibility.",
    code: `
gas = [1, 2, 3, 4, 5]
cost = [3, 4, 5, 1, 2]
total_balance = 0
tank = 0
start = 0
resets = []

for index, (supply, travel) in enumerate(zip(gas, cost)):
    difference = supply - travel
    total_balance += difference
    tank += difference
    if tank < 0:
        resets.append((start, index))
        start = index + 1
        tank = 0

possible = total_balance >= 0
print("Resets:", resets)
print("Start:", start)
print("Result:", possible and start == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Greedy gas-station start",
    phases: ["Accumulate local and total balance", "Reject a failed start and its intervening indices", "Keep the next candidate when total fuel is sufficient"],
    invariants: ["tank is the balance from the current candidate start through the current index"],
    edgeCases: ["A negative total balance proves that no start works"],
    comparisonGroup: "greedy-boundaries",
    complexity: { time: "O(n)", space: "O(n) for teaching resets", note: "One scan eliminates failed start ranges without retrying complete circuits." },
    bestViews: ["Watches", "Decisions", "Invariant Checker"],
    eventTypes: ["COMPARE", "REJECT", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Burst intervals with minimum arrows",
    objective: "Sort intervals by end and reuse one arrow for every interval containing that point.",
    code: `
balloons = [(10, 16), (2, 8), (1, 6), (7, 12)]
ordered = sorted(balloons, key=lambda interval: interval[1])
arrows = []
current_point = None

for start, end in ordered:
    if current_point is None or start > current_point:
        current_point = end
        arrows.append(current_point)

covered = [
    any(start <= arrow <= end for arrow in arrows)
    for start, end in balloons
]
print("Order:", ordered)
print("Arrows:", arrows)
print("Result:", arrows == [6, 12] and all(covered))`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Minimum interval stabbing",
    phases: ["Sort intervals by right endpoint", "Reuse the current point when it remains inside", "Place a new point at the next earliest end"],
    invariants: ["Every processed interval contains at least one selected arrow"],
    edgeCases: ["Touching a boundary counts as coverage"],
    comparisonGroup: "greedy-intervals",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Sorting dominates the one-pass endpoint selection." },
    bestViews: ["Decisions", "Watches", "Invariant Checker"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Remove the fewest overlapping intervals",
    objective: "Keep the interval with the earliest finish whenever an overlap forces one removal.",
    code: `
intervals = [(1, 2), (2, 3), (3, 4), (1, 3)]
ordered = sorted(intervals, key=lambda interval: interval[1])
kept = []
removed = []
last_end = float("-inf")

for interval in ordered:
    start, end = interval
    if start >= last_end:
        kept.append(interval)
        last_end = end
    else:
        removed.append(interval)

print("Kept:", kept)
print("Removed:", removed)
print("Result:", len(removed) == 1 and kept == [(1, 2), (2, 3), (3, 4)])`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Erase overlapping intervals",
    phases: ["Sort by finish time", "Keep a compatible interval", "Reject an overlapping interval"],
    invariants: ["The kept intervals are non-overlapping and finish as early as the greedy prefix permits"],
    edgeCases: ["Intervals sharing only an endpoint do not overlap in this lesson"],
    comparisonGroup: "greedy-intervals",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Finish-time sorting supports a linear keep-or-remove scan." },
    bestViews: ["Decisions", "Operation Journey", "Compare Algorithms"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "RETURN_RESULT"],
  },
  {
    title: "Partition labels at last occurrences",
    objective: "Close each text segment only after it contains the final occurrence of every character already seen.",
    code: `
text = "ababcbacadefegdehijhklij"
last = {character: index for index, character in enumerate(text)}
start = 0
end = 0
parts = []
history = []

for index, character in enumerate(text):
    end = max(end, last[character])
    history.append((index, character, end))
    if index == end:
        parts.append(end - start + 1)
        start = index + 1

print("Parts:", parts)
print("Boundaries:", [entry for entry in history if entry[0] == entry[2]])
print("Result:", parts == [9, 7, 8])`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array", "python-list"],
    algorithm: "Greedy partition labels",
    phases: ["Precompute every character's final index", "Extend the active segment boundary", "Close a segment when the scan reaches its boundary"],
    invariants: ["Every seen character's final occurrence lies at or before the active end"],
    edgeCases: ["An empty string produces no partitions"],
    comparisonGroup: "greedy-boundaries",
    complexity: { time: "O(n)", space: "O(k)", note: "Two linear passes store one final index for each distinct character." },
    bestViews: ["Watches", "Step Table", "References"],
    eventTypes: ["READ", "UPDATE_BOUNDARY", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Build Huffman prefix-code lengths",
    objective: "Repeatedly merge the two least frequent nodes and derive a prefix-code length for each symbol.",
    difficulty: "Guided Challenge",
    code: `
import heapq
from itertools import count

frequencies = {"A": 5, "B": 9, "C": 12, "D": 13, "E": 16, "F": 45}
sequence = count()
heap = [(weight, next(sequence), symbol) for symbol, weight in frequencies.items()]
heapq.heapify(heap)
merges = []

while len(heap) > 1:
    left_weight, _, left = heapq.heappop(heap)
    right_weight, _, right = heapq.heappop(heap)
    parent = (left, right)
    combined = left_weight + right_weight
    merges.append((left_weight, right_weight, combined))
    heapq.heappush(heap, (combined, next(sequence), parent))

root = heap[0][2]
lengths = {}
def collect(node, depth):
    if isinstance(node, str):
        lengths[node] = depth
        return
    collect(node[0], depth + 1)
    collect(node[1], depth + 1)

collect(root, 0)
weighted_length = sum(frequencies[symbol] * lengths[symbol] for symbol in frequencies)
print("Merges:", merges)
print("Lengths:", lengths)
print("Weighted length:", weighted_length)
print("Result:", len(merges) == 5 and lengths["F"] == 1 and weighted_length == 224)`,
    expectedResult: "Result: True",
    structureTypes: ["priority-queue", "binary-tree", "hash-table"],
    algorithm: "Huffman coding",
    phases: ["Heapify symbol frequencies", "Merge the two lightest subtrees", "Traverse the final tree to measure code lengths"],
    invariants: ["Every heap node weight equals the frequency total of its subtree"],
    edgeCases: ["A single symbol can use a zero-length conceptual code or an application-defined one-bit code"],
    comparisonGroup: "greedy-tree-building",
    complexity: { time: "O(k log k)", space: "O(k)", note: "Each of k leaves enters a heap and k minus one merges update it." },
    bestViews: ["Structure Canvas", "Operation Journey", "Invariant Checker"],
    eventTypes: ["POP", "PUSH", "MERGE", "VISIT_NODE", "RETURN_RESULT"],
  },
  {
    title: "Schedule profitable jobs before deadlines",
    objective: "Consider jobs by profit and place each in the latest available slot before its deadline.",
    difficulty: "Guided Challenge",
    code: `
jobs = [
    ("A", 2, 100),
    ("B", 1, 19),
    ("C", 2, 27),
    ("D", 1, 25),
    ("E", 3, 15),
]
maximum_deadline = max(deadline for _, deadline, _ in jobs)
slots = [None] * maximum_deadline
profit = 0
decisions = []

for name, deadline, value in sorted(jobs, key=lambda job: job[2], reverse=True):
    placed = False
    for slot in range(min(deadline, maximum_deadline) - 1, -1, -1):
        if slots[slot] is None:
            slots[slot] = name
            profit += value
            decisions.append((name, slot + 1, "placed"))
            placed = True
            break
    if not placed:
        decisions.append((name, None, "rejected"))

print("Slots:", slots)
print("Decisions:", decisions)
print("Profit:", profit)
print("Result:", slots == ["C", "A", "E"] and profit == 142)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "python-list"],
    algorithm: "Greedy job sequencing",
    phases: ["Sort jobs by descending profit", "Search backward for the latest legal free slot", "Place or reject the job"],
    invariants: ["Every scheduled job occupies one slot no later than its deadline"],
    edgeCases: ["A job with no free legal slot is rejected even when profitable"],
    comparisonGroup: "greedy-scheduling",
    complexity: { time: "O(n log n + nD)", space: "O(D)", note: "This beginner form sorts jobs then scans up to D deadline slots per job." },
    bestViews: ["Decisions", "Mutation Explorer", "Invariant Checker"],
    eventTypes: ["COMPARE", "CHOOSE", "REJECT", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Connect ropes with minimum accumulated cost",
    objective: "Repeatedly combine the two shortest ropes so early costs stay small.",
    code: `
import heapq

ropes = [4, 3, 2, 6]
heap = ropes.copy()
heapq.heapify(heap)
merges = []
total_cost = 0

while len(heap) > 1:
    first = heapq.heappop(heap)
    second = heapq.heappop(heap)
    combined = first + second
    total_cost += combined
    merges.append((first, second, combined, total_cost))
    heapq.heappush(heap, combined)

print("Merges:", merges)
print("Cost:", total_cost)
print("Result:", total_cost == 29 and heap == [15])`,
    expectedResult: "Result: True",
    structureTypes: ["priority-queue", "python-list"],
    algorithm: "Minimum rope-connection cost",
    phases: ["Heapify all rope lengths", "Remove and combine the two shortest", "Return the combined rope to the heap"],
    invariants: ["The heap always represents all not-yet-combined rope groups"],
    edgeCases: ["Zero or one rope has zero connection cost"],
    comparisonGroup: "greedy-tree-building",
    complexity: { time: "O(n log n)", space: "O(n)", note: "There are n minus one merges, each with heap removals and insertion." },
    bestViews: ["Structure Canvas", "Operation Journey", "Step Table"],
    eventTypes: ["POP", "MERGE", "PUSH", "RETURN_RESULT"],
  },
  {
    title: "Refuel at the largest passed station",
    objective: "Delay refueling decisions and use the largest previously reachable supply only when necessary.",
    difficulty: "Guided Challenge",
    code: `
import heapq

target = 100
start_fuel = 25
stations = [(10, 10), (20, 30), (30, 30), (60, 40)]
stations = stations + [(target, 0)]
available = []
fuel = start_fuel
previous = 0
stops = 0
history = []

for position, supply in stations:
    fuel -= position - previous
    while fuel < 0 and available:
        added = -heapq.heappop(available)
        fuel += added
        stops += 1
        history.append(("refuel", added, position, fuel))
    if fuel < 0:
        stops = -1
        break
    heapq.heappush(available, -supply)
    history.append(("pass", position, supply, fuel))
    previous = position

print("History:", history)
print("Stops:", stops)
print("Result:", stops == 3 and fuel >= 0)`,
    expectedResult: "Result: True",
    structureTypes: ["priority-queue", "array"],
    algorithm: "Minimum refueling stops",
    phases: ["Spend fuel to reach the next station", "Take the largest passed supply while in deficit", "Add the newly passed supply for future need"],
    invariants: ["The heap contains supplies from passed stations not yet used"],
    edgeCases: ["If fuel stays negative after the heap empties, the target is unreachable"],
    comparisonGroup: "greedy-resource-allocation",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Each station supply enters and leaves the heap at most once." },
    bestViews: ["Structure Canvas", "Watches", "Edge Case Lab"],
    eventTypes: ["PUSH", "POP", "COMPARE", "CHOOSE", "RETURN_RESULT"],
  },
];

/** Definitions remain ordered by the approved Chunk 5 curriculum sequence. */
const definitions = [
  ...recursionPrograms.map((program) => ({ ...program, section: "Recursion" })),
  ...backtrackingPrograms.map((program) => ({ ...program, section: "Backtracking" })),
  ...divideAndConquerPrograms.map((program) => ({ ...program, section: "Divide and conquer" })),
  ...greedyPrograms.map((program) => ({ ...program, section: "Greedy algorithms" })),
];

/** Frozen Chunk 5 records continue identifiers from DSA-338 through DSA-397. */
export const DSA_CHUNK_FIVE_PROGRAMS = Object.freeze(
  definitions.map((definition, index) => makeProgram(definition, index)),
);
