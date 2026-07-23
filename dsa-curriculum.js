/**
 * Code Explorer Data Structures and Algorithms curriculum, Chunk 1.
 *
 * This module owns the first 131 reviewed programs in the 535-program Tier A
 * plan. Every record contains enough teaching metadata for the catalog, honest
 * curriculum context in the learning views, executable validation, and later
 * comparison work. The browser receives plain frozen records. It does not
 * generate learner progress, analytics events, or remote requests.
 */

import { DSA_PROGRAM_REQUIRED_FIELDS } from "./dsa-contracts.js";

/** The six Chunk 1 sections and their exact approved program counts. */
export const DSA_CHUNK_ONE_SECTIONS = Object.freeze([
  ["Algorithm and complexity foundations", 24],
  ["Abstract data types and representations", 12],
  ["Python-native containers", 42],
  ["Arrays and sequence techniques", 20],
  ["Searching", 9],
  ["Sorting and sorting properties", 24],
]);

/** Three labels describe increasing conceptual depth without tracking progress. */
export const DSA_DIFFICULTIES = Object.freeze(["Beginner", "Developing", "Guided Challenge"]);

/**
 * Removes accidental outer whitespace while preserving meaningful indentation
 * and blank lines inside a Python document.
 *
 * @param {string} source Complete Python source written in a template literal.
 * @returns {string} Stable source suitable for the editor and validator.
 */
function cleanCode(source) {
  return source.replace(/^\n/, "").replace(/\s+$/, "");
}

/**
 * Creates one complete curriculum record and supplies safe empty defaults for
 * optional collections. Required fields remain present on every program.
 *
 * @param {object} definition Human-reviewed lesson definition.
 * @param {number} index Zero-based position in the complete Chunk 1 catalog.
 * @returns {Readonly<object>} Frozen program metadata and source.
 */
function makeProgram(definition, index) {
  const record = {
    id: `dsa-${String(index + 1).padStart(3, "0")}`,
    title: definition.title,
    section: definition.section,
    difficulty: definition.difficulty || "Beginner",
    objective: definition.objective,
    description: definition.description || definition.objective,
    prerequisites: definition.prerequisites || [],
    code: cleanCode(definition.code),
    preparedInputs: definition.preparedInputs || [],
    expectedResult: definition.expectedResult,
    structureTypes: definition.structureTypes || [],
    algorithm: definition.algorithm || "Concept demonstration",
    phases: definition.phases || ["Set up", "Perform the operation", "Inspect the result"],
    invariants: definition.invariants || [],
    edgeCases: definition.edgeCases || [],
    comparisonGroup: definition.comparisonGroup || "",
    complexity: definition.complexity || {
      time: "Depends on the demonstrated operation",
      space: "Depends on the demonstrated representation",
      note: "Use the recorded counts as one observation, not as proof of a growth class.",
    },
    bestViews: definition.bestViews || ["Algorithm Story", "Variables", "Step Table"],
    eventTypes: definition.eventTypes || ["READ", "WRITE", "RETURN_RESULT"],
    intentionalError: definition.intentionalError || null,
  };

  // A development-time assertion makes schema omissions fail near their source.
  for (const field of DSA_PROGRAM_REQUIRED_FIELDS) {
    if (!(field in record)) {
      throw new Error(`DSA curriculum record ${record.id} is missing ${field}.`);
    }
  }
  return Object.freeze(record);
}

/** Shared metadata for short operation lessons keeps repeated facts consistent. */
const COMPLEXITIES = Object.freeze({
  constant: { time: "O(1)", space: "O(1)", note: "One indexed or direct operation is observed for this input." },
  linear: { time: "O(n)", space: "O(1)", note: "The operation may inspect each of n values once." },
  linearCopy: { time: "O(n)", space: "O(n)", note: "The result copies up to n values into a new container." },
  quadratic: { time: "O(n^2)", space: "O(1)", note: "A nested scan can compare pairs of values." },
  logarithmic: { time: "O(log n)", space: "O(1)", note: "Each decision removes roughly half of the remaining range." },
  linearithmic: { time: "O(n log n)", space: "O(n)", note: "Repeated halving is combined with linear merge work." },
});

/*
 * Foundations begin with the language of algorithms, then build toward
 * invariants, growth, operation counting, and honest experimental evidence.
 */
const foundationPrograms = [
  {
    title: "Name an algorithm's input and output",
    section: "Algorithm and complexity foundations",
    objective: "Identify the values supplied to a procedure and the value it produces.",
    code: `
temperatures = [18, 21, 19, 24]
total = 0

for temperature in temperatures:
    total += temperature

average = total / len(temperatures)
print("Input count:", len(temperatures))
print("Result:", average)`,
    expectedResult: "Result: 20.5",
    structureTypes: ["python-list"],
    algorithm: "Average by accumulation",
    phases: ["Read the input sequence", "Accumulate a total", "Divide by the count"],
    invariants: ["total equals the sum of values already visited"],
    edgeCases: ["An empty list needs a policy before division"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "VISIT_INDEX", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Check a precondition before searching",
    section: "Algorithm and complexity foundations",
    objective: "Use a precondition to protect an algorithm from unsuitable input.",
    code: `
values = [2, 4, 7, 9, 12]
target = 9
is_sorted = values == sorted(values)

if is_sorted:
    found = target in values
    print("Search allowed:", found)
else:
    print("Search skipped: input must be sorted")

print("Result:", is_sorted)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "Precondition check",
    phases: ["Inspect the requirement", "Choose whether to continue", "Report the contract"],
    invariants: ["The search branch runs only when values are sorted"],
    edgeCases: ["A descending list fails this precondition"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["READ", "COMPARE", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Verify a postcondition",
    section: "Algorithm and complexity foundations",
    objective: "Check that a completed operation produced the property it promised.",
    code: `
original = [7, 2, 5, 2]
result = sorted(original)

same_values = sorted(original) == result
nondecreasing = all(
    result[index] <= result[index + 1]
    for index in range(len(result) - 1)
)

postcondition = same_values and nondecreasing
print("Sorted result:", result)
print("Result:", postcondition)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "Sorting postcondition",
    phases: ["Transform the data", "Check membership preservation", "Check order"],
    invariants: ["The result contains the original values in nondecreasing order"],
    edgeCases: ["Duplicates must remain represented"],
    complexity: COMPLEXITIES.linearithmic,
    eventTypes: ["READ", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Test a claim with several cases",
    section: "Algorithm and complexity foundations",
    objective: "Use examples to find evidence for correctness without calling the examples a proof.",
    code: `
def is_even(number):
    return number % 2 == 0

cases = [(0, True), (3, False), (8, True), (-5, False)]
passed = 0

for number, expected in cases:
    actual = is_even(number)
    if actual == expected:
        passed += 1
    print(number, actual, expected)

print("Result:", passed == len(cases))`,
    expectedResult: "Result: True",
    algorithm: "Example-based correctness check",
    phases: ["Define the claim", "Run representative cases", "Compare actual with expected"],
    invariants: ["passed counts only cases whose actual and expected results match"],
    edgeCases: ["Examples support confidence but do not prove every integer"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["COMPARE", "VISIT_INDEX", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Make loop progress visible",
    section: "Algorithm and complexity foundations",
    objective: "Track a measure that moves toward termination on every loop iteration.",
    code: `
remaining = 5
history = []

while remaining > 0:
    history.append(remaining)
    remaining -= 1

terminated = remaining == 0
print("Progress:", history)
print("Result:", terminated)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "Countdown termination",
    phases: ["Choose a progress measure", "Decrease it", "Stop at the boundary"],
    invariants: ["remaining is a nonnegative integer and decreases each iteration"],
    edgeCases: ["A missing decrement would prevent termination"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["COMPARE", "INSERT", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Maintain a running-sum invariant",
    section: "Algorithm and complexity foundations",
    objective: "Explain why an accumulator remains correct after each visited value.",
    code: `
values = [3, 1, 4, 1, 5]
running_total = 0
checks = []

for index, value in enumerate(values):
    running_total += value
    expected = sum(values[: index + 1])
    checks.append(running_total == expected)

print("Checks:", checks)
print("Result:", running_total)`,
    expectedResult: "Result: 14",
    structureTypes: ["python-list"],
    algorithm: "Running sum",
    phases: ["Start with the empty-prefix sum", "Extend by one value", "Check the processed prefix"],
    invariants: ["running_total equals the sum of values through the current index"],
    complexity: { time: "O(n^2) in this teaching check", space: "O(n)", note: "The repeated sum checks add work; the accumulator alone is O(n)." },
    eventTypes: ["VISIT_INDEX", "READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Maintain a sorted-prefix invariant",
    section: "Algorithm and complexity foundations",
    objective: "Observe how insertion sort preserves order in the processed prefix.",
    code: `
values = [5, 2, 4, 1]
checks = []

for index in range(1, len(values)):
    current = values[index]
    position = index
    while position > 0 and values[position - 1] > current:
        values[position] = values[position - 1]
        position -= 1
    values[position] = current
    checks.append(values[: index + 1] == sorted(values[: index + 1]))

print("Invariant checks:", checks)
print("Result:", values)`,
    expectedResult: "Result: [1, 2, 4, 5]",
    structureTypes: ["array"],
    algorithm: "Insertion sort invariant",
    phases: ["Select the next value", "Shift larger prefix values", "Insert into the sorted prefix"],
    invariants: ["values through index form a sorted permutation of their original values"],
    complexity: COMPLEXITIES.quadratic,
    eventTypes: ["VISIT_INDEX", "COMPARE", "READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Count constant work",
    section: "Algorithm and complexity foundations",
    objective: "Separate a fixed number of operations from the size of the input.",
    code: `
values = [11, 22, 33, 44, 55]
operations = 0

first = values[0]
operations += 1
last = values[-1]
operations += 1
difference = last - first
operations += 1

print("Difference:", difference)
print("Result:", operations)`,
    expectedResult: "Result: 3",
    structureTypes: ["array"],
    algorithm: "Constant-time endpoint check",
    phases: ["Read first value", "Read last value", "Compute one difference"],
    complexity: COMPLEXITIES.constant,
    eventTypes: ["READ", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Observe linear growth",
    section: "Algorithm and complexity foundations",
    objective: "Count one visit per input value and relate the count to n.",
    code: `
sizes = [2, 4, 8]
observations = []

for size in sizes:
    visits = 0
    values = list(range(size))
    for value in values:
        visits += 1
    observations.append((size, visits))

print("Observations:", observations)
print("Result:", observations[-1])`,
    expectedResult: "Result: (8, 8)",
    structureTypes: ["python-list"],
    algorithm: "Linear scan experiment",
    phases: ["Choose input sizes", "Visit every value", "Compare n with visits"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["VISIT_INDEX", "READ", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Observe quadratic growth",
    section: "Algorithm and complexity foundations",
    objective: "Count pair comparisons produced by two complete nested loops.",
    code: `
sizes = [2, 3, 4]
observations = []

for size in sizes:
    comparisons = 0
    for left in range(size):
        for right in range(size):
            comparisons += 1
    observations.append((size, comparisons))

print("Observations:", observations)
print("Result:", observations[-1])`,
    expectedResult: "Result: (4, 16)",
    algorithm: "All ordered pairs",
    phases: ["Choose input sizes", "Pair every left and right index", "Compare n with n squared"],
    complexity: COMPLEXITIES.quadratic,
    eventTypes: ["VISIT_INDEX", "COMPARE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Observe logarithmic halving",
    section: "Algorithm and complexity foundations",
    objective: "Count how many halvings reduce a positive value to one.",
    code: `
number = 64
history = [number]
halvings = 0

while number > 1:
    number //= 2
    halvings += 1
    history.append(number)

print("History:", history)
print("Result:", halvings)`,
    expectedResult: "Result: 6",
    structureTypes: ["python-list"],
    algorithm: "Repeated halving",
    phases: ["Start at n", "Remove half the range", "Stop at one"],
    invariants: ["number remains a positive power of two"],
    complexity: COMPLEXITIES.logarithmic,
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Combine divide and merge work",
    section: "Algorithm and complexity foundations",
    objective: "Connect repeated halving with linear work at each merge level.",
    code: `
def merge_sort(values, depth=0):
    if len(values) <= 1:
        return values, 0
    middle = len(values) // 2
    left, left_work = merge_sort(values[:middle], depth + 1)
    right, right_work = merge_sort(values[middle:], depth + 1)
    merged = []
    while left and right:
        merged.append(left.pop(0) if left[0] <= right[0] else right.pop(0))
    merged.extend(left or right)
    return merged, left_work + right_work + len(merged)

ordered, merge_work = merge_sort([7, 2, 6, 3, 5, 1, 4, 0])
print("Ordered:", ordered)
print("Result:", merge_work)`,
    expectedResult: "Result: 24",
    structureTypes: ["array"],
    algorithm: "Merge sort work count",
    phases: ["Divide into halves", "Solve each half", "Merge and count"],
    complexity: COMPLEXITIES.linearithmic,
    eventTypes: ["ENTER_SUBPROBLEM", "COMPARE", "MERGE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Count exponential subsets",
    section: "Algorithm and complexity foundations",
    objective: "See why each include-or-exclude choice doubles the number of subsets.",
    code: `
values = ["a", "b", "c", "d"]
subsets = [[]]

for value in values:
    additions = []
    for existing in subsets:
        additions.append(existing + [value])
    subsets.extend(additions)

print("Subset count:", len(subsets))
print("Result:", subsets[-1])`,
    expectedResult: "Result: ['a', 'b', 'c', 'd']",
    structureTypes: ["python-list"],
    algorithm: "Iterative subset generation",
    phases: ["Start with the empty subset", "Duplicate existing choices", "Add the current value"],
    complexity: { time: "O(2^n)", space: "O(2^n)", note: "There are two membership choices for each of n values." },
    eventTypes: ["CHOOSE", "INSERT", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Count factorial arrangements",
    section: "Algorithm and complexity foundations",
    objective: "Observe how the number of permutations multiplies as choices are arranged.",
    code: `
def permutations(values):
    if len(values) <= 1:
        return [values]
    arrangements = []
    for index, value in enumerate(values):
        remaining = values[:index] + values[index + 1:]
        for suffix in permutations(remaining):
            arrangements.append([value] + suffix)
    return arrangements

result = permutations([1, 2, 3])
print("Arrangements:", result)
print("Result:", len(result))`,
    expectedResult: "Result: 6",
    structureTypes: ["python-list"],
    algorithm: "Recursive permutation generation",
    phases: ["Choose a first value", "Arrange the remainder", "Combine each choice"],
    complexity: { time: "O(n * n!)", space: "O(n * n!)", note: "The program materializes every arrangement and copies n values per result." },
    eventTypes: ["CHOOSE", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Compare best and worst linear-search cases",
    section: "Algorithm and complexity foundations",
    objective: "Measure how target position changes observed work without changing the worst-case class.",
    code: `
def search_with_count(values, target):
    for index, value in enumerate(values):
        if value == target:
            return index, index + 1
    return -1, len(values)

values = [4, 8, 15, 16, 23, 42]
best = search_with_count(values, 4)
middle = search_with_count(values, 16)
worst = search_with_count(values, 99)

print("Cases:", best, middle, worst)
print("Result:", worst[1])`,
    expectedResult: "Result: 6",
    structureTypes: ["array"],
    algorithm: "Linear search case analysis",
    phases: ["Scan from the beginning", "Stop on a match", "Count inspected values"],
    edgeCases: ["First value", "Middle value", "Missing target"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["VISIT_INDEX", "COMPARE", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "linear-search-cases",
  },
  {
    title: "Trade memory for faster membership",
    section: "Algorithm and complexity foundations",
    objective: "Compare repeated list scans with building a set once.",
    code: `
inventory = ["pen", "book", "lamp", "cable", "mug"]
queries = ["mug", "chair", "pen", "screen"]

list_answers = [item in inventory for item in queries]
inventory_set = set(inventory)
set_answers = [item in inventory_set for item in queries]

same_answers = list_answers == set_answers
print("List answers:", list_answers)
print("Set answers:", set_answers)
print("Result:", same_answers)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list", "set"],
    algorithm: "Membership representation tradeoff",
    phases: ["Answer by scanning", "Build a hash set", "Answer by hashed membership"],
    complexity: { time: "List O(qn), set expected O(n + q)", space: "List O(1) extra, set O(n)", note: "q is the number of queries and n is the inventory size." },
    eventTypes: ["READ", "COMPARE", "INSERT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "membership-representations",
  },
  {
    title: "Model amortized append cost",
    section: "Algorithm and complexity foundations",
    objective: "See how occasional resizing can coexist with inexpensive average appends.",
    code: `
capacity = 1
size = 0
copy_work = 0
history = []

for value in range(8):
    if size == capacity:
        copy_work += size
        capacity *= 2
    size += 1
    history.append((size, capacity, copy_work))

print("Growth:", history)
print("Result:", copy_work)`,
    expectedResult: "Result: 7",
    structureTypes: ["array"],
    algorithm: "Dynamic-array capacity model",
    phases: ["Check capacity", "Resize occasionally", "Append one value"],
    invariants: ["capacity is at least size"],
    complexity: { time: "Amortized O(1) append", space: "O(n)", note: "This is a capacity model, not a view into CPython's exact private allocation strategy." },
    eventTypes: ["CHECK_INVARIANT", "COMPARE", "WRITE", "INSERT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Count comparisons explicitly",
    section: "Algorithm and complexity foundations",
    objective: "Instrument an algorithm with a counter that has one precise meaning.",
    code: `
values = [6, 2, 9, 3, 7]
largest = values[0]
comparisons = 0

for value in values[1:]:
    comparisons += 1
    if value > largest:
        largest = value

print("Largest:", largest)
print("Result:", comparisons)`,
    expectedResult: "Result: 4",
    structureTypes: ["array"],
    algorithm: "Maximum scan",
    phases: ["Keep the best seen value", "Compare each remaining value", "Update when larger"],
    invariants: ["largest is the maximum of the processed prefix"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "COMPARE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Count swaps separately from comparisons",
    section: "Algorithm and complexity foundations",
    objective: "Keep two operation counters separate so their evidence is interpretable.",
    code: `
values = [3, 2, 1]
comparisons = 0
swaps = 0

for end in range(len(values) - 1, 0, -1):
    for index in range(end):
        comparisons += 1
        if values[index] > values[index + 1]:
            values[index], values[index + 1] = values[index + 1], values[index]
            swaps += 1

print("Ordered:", values)
print("Counts:", comparisons, swaps)
print("Result:", swaps)`,
    expectedResult: "Result: 3",
    structureTypes: ["array"],
    algorithm: "Bubble sort counters",
    phases: ["Compare neighbors", "Swap inverted pairs", "Shrink the unsorted suffix"],
    complexity: COMPLEXITIES.quadratic,
    eventTypes: ["COMPARE", "SWAP", "UPDATE_BOUNDARY", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "sorting-operation-counts",
  },
  {
    title: "Separate reads from writes",
    section: "Algorithm and complexity foundations",
    objective: "Count data access and data modification as different kinds of work.",
    code: `
source = [2, 4, 6, 8]
doubled = []
reads = 0
writes = 0

for value in source:
    reads += 1
    doubled.append(value * 2)
    writes += 1

print("Doubled:", doubled)
print("Counts:", reads, writes)
print("Result:", reads == writes)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Transform with access counters",
    phases: ["Read one source value", "Compute its transformation", "Write one result"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["READ", "WRITE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Separate measured steps from Big O",
    section: "Algorithm and complexity foundations",
    objective: "Treat a run's operation count as evidence while keeping the growth claim theoretical.",
    code: `
def count_visits(size):
    visits = 0
    for _ in range(size):
        visits += 1
    return visits

observations = []
for size in [1, 5, 10]:
    observations.append((size, count_visits(size)))

growth_claim = "O(n)"
print("Observed:", observations)
print("Reviewed class:", growth_claim)
print("Result:", observations[-1][1])`,
    expectedResult: "Result: 10",
    algorithm: "Observed versus theoretical complexity",
    phases: ["Run fixed experiments", "Record counts", "Keep the reviewed class separate"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["VISIT_INDEX", "WRITE", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Run an input-size experiment",
    section: "Algorithm and complexity foundations",
    objective: "Collect several bounded observations without pretending the sample proves all inputs.",
    code: `
def triangular_work(size):
    operations = 0
    for row in range(size):
        for column in range(row + 1):
            operations += 1
    return operations

observations = {
    size: triangular_work(size)
    for size in [2, 4, 6]
}

print("Observed work:", observations)
print("Result:", observations[6])`,
    expectedResult: "Result: 21",
    structureTypes: ["hash-table"],
    algorithm: "Triangular nested-loop experiment",
    phases: ["Choose bounded sizes", "Count triangular work", "Compare observations"],
    complexity: COMPLEXITIES.quadratic,
    eventTypes: ["VISIT_INDEX", "WRITE", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Build memory-use intuition",
    section: "Algorithm and complexity foundations",
    objective: "Distinguish a reused reference from a newly copied list without claiming physical addresses.",
    code: `
original = [10, 20, 30]
alias = original
copy = original.copy()

alias.append(40)

same_alias_object = alias is original
same_copy_object = copy is original
print("Original:", original)
print("Copy:", copy)
print("Result:", (same_alias_object, same_copy_object))`,
    expectedResult: "Result: (True, False)",
    structureTypes: ["python-list"],
    algorithm: "Reference and copy comparison",
    phases: ["Create one list", "Create an alias and a copy", "Mutate and compare identity"],
    edgeCases: ["Identity is conceptual object sameness, not a physical RAM address"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["READ", "WRITE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Compare a loop with a formula",
    section: "Algorithm and complexity foundations",
    objective: "Compare two correct algorithms that solve the same sum problem with different work.",
    code: `
def loop_sum(limit):
    total = 0
    operations = 0
    for number in range(1, limit + 1):
        total += number
        operations += 1
    return total, operations

def formula_sum(limit):
    return limit * (limit + 1) // 2, 1

loop_result = loop_sum(100)
formula_result = formula_sum(100)
print("Loop:", loop_result)
print("Formula:", formula_result)
print("Result:", loop_result[0] == formula_result[0])`,
    expectedResult: "Result: True",
    algorithm: "Iterative sum versus closed form",
    phases: ["Solve by accumulation", "Solve by formula", "Compare results and work"],
    invariants: ["Both methods must produce the same total for a nonnegative integer limit"],
    complexity: { time: "Loop O(n), formula O(1)", space: "O(1)", note: "The comparison uses the same mathematical input." },
    eventTypes: ["VISIT_INDEX", "WRITE", "COMPARE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "sum-strategies",
  },
];

/*
 * Abstract data type lessons separate the promised operations from the concrete
 * Python representation used to implement them.
 */
const adtPrograms = [
  {
    title: "Define an abstract stack interface",
    section: "Abstract data types and representations",
    objective: "Describe stack behavior through push, pop, peek, and empty operations.",
    code: `
class Stack:
    def __init__(self):
        self._items = []

    def push(self, value):
        self._items.append(value)

    def pop(self):
        return self._items.pop()

    def peek(self):
        return self._items[-1]

    def is_empty(self):
        return not self._items

stack = Stack()
stack.push("draft")
stack.push("review")
top = stack.peek()
removed = stack.pop()
print("Top:", top)
print("Result:", (removed, stack.is_empty()))`,
    expectedResult: "Result: ('review', False)",
    structureTypes: ["stack", "python-list"],
    algorithm: "Stack ADT with list representation",
    phases: ["Create the representation", "Push values", "Peek and pop"],
    invariants: ["The most recently pushed remaining value is the next value popped"],
    complexity: { time: "Push and pop at the end are amortized O(1)", space: "O(n)", note: "The list is the representation; LIFO behavior is the abstraction." },
    eventTypes: ["PUSH", "PEEK", "POP", "RETURN_RESULT"],
  },
  {
    title: "Implement a stack with deque",
    section: "Abstract data types and representations",
    objective: "Keep the stack interface while changing its concrete representation.",
    code: `
from collections import deque

class Stack:
    def __init__(self):
        self._items = deque()

    def push(self, value):
        self._items.append(value)

    def pop(self):
        return self._items.pop()

stack = Stack()
for task in ["plan", "code", "test"]:
    stack.push(task)

order = [stack.pop(), stack.pop(), stack.pop()]
print("Removal order:", order)
print("Result:", order[0])`,
    expectedResult: "Result: test",
    structureTypes: ["stack", "deque"],
    algorithm: "Stack ADT with deque representation",
    phases: ["Preserve the interface", "Push tasks", "Remove in LIFO order"],
    invariants: ["Changing representation does not change LIFO behavior"],
    complexity: { time: "Push and pop are O(1)", space: "O(n)", note: "The abstract behavior is independent of the chosen supported container." },
    eventTypes: ["PUSH", "POP", "CHECK_INVARIANT", "RETURN_RESULT"],
    comparisonGroup: "stack-representations",
  },
  {
    title: "Implement a queue with deque",
    section: "Abstract data types and representations",
    objective: "Model first-in, first-out behavior with opposite deque ends.",
    code: `
from collections import deque

class Queue:
    def __init__(self):
        self._items = deque()

    def enqueue(self, value):
        self._items.append(value)

    def dequeue(self):
        return self._items.popleft()

queue = Queue()
for customer in ["Ari", "Bea", "Chen"]:
    queue.enqueue(customer)

served = [queue.dequeue(), queue.dequeue()]
print("Served:", served)
print("Result:", served[0])`,
    expectedResult: "Result: Ari",
    structureTypes: ["queue", "deque"],
    algorithm: "Queue ADT with deque representation",
    phases: ["Enqueue at the rear", "Dequeue at the front", "Preserve arrival order"],
    invariants: ["The earliest remaining enqueued value leaves next"],
    complexity: { time: "Enqueue and dequeue are O(1)", space: "O(n)", note: "deque supports efficient operations at both ends." },
    eventTypes: ["ENQUEUE", "DEQUEUE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Implement a bounded circular queue",
    section: "Abstract data types and representations",
    objective: "Reuse fixed array cells by wrapping front and rear indices.",
    code: `
capacity = 4
items = [None] * capacity
front = 0
size = 0

for value in ["A", "B", "C"]:
    rear = (front + size) % capacity
    items[rear] = value
    size += 1

removed = items[front]
items[front] = None
front = (front + 1) % capacity
size -= 1

rear = (front + size) % capacity
items[rear] = "D"
size += 1

logical = [items[(front + offset) % capacity] for offset in range(size)]
print("Physical cells:", items)
print("Result:", logical)`,
    expectedResult: "Result: ['B', 'C', 'D']",
    structureTypes: ["queue", "array"],
    algorithm: "Circular queue",
    phases: ["Enqueue with modular rear", "Advance the front", "Wrap into reusable cells"],
    invariants: ["0 <= size <= capacity", "Logical order begins at front and wraps modulo capacity"],
    edgeCases: ["Full queue", "Empty queue", "Wraparound"],
    complexity: COMPLEXITIES.constant,
    eventTypes: ["ENQUEUE", "DEQUEUE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Represent a queue with linked records",
    section: "Abstract data types and representations",
    objective: "Compare a linked queue representation with a contiguous container.",
    code: `
head = None
tail = None

for value in ["red", "green", "blue"]:
    node = {"value": value, "next": None}
    if tail is None:
        head = tail = node
    else:
        tail["next"] = node
        tail = node

removed = head["value"]
head = head["next"]
if head is None:
    tail = None

print("Removed:", removed)
print("Result:", head["value"])`,
    expectedResult: "Result: green",
    structureTypes: ["queue", "singly-linked-list"],
    algorithm: "Linked queue representation",
    phases: ["Link new tail records", "Read the head", "Advance the head"],
    invariants: ["tail.next is None", "head is None exactly when the queue is empty"],
    complexity: { time: "Enqueue and dequeue are O(1)", space: "O(n)", note: "Each value is stored in a separate linked record." },
    eventTypes: ["LINK", "ENQUEUE", "DEQUEUE", "UNLINK", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Use one list as two different ADTs",
    section: "Abstract data types and representations",
    objective: "See that a representation does not determine the abstract behavior by itself.",
    code: `
values = ["first", "second", "third"]

stack_representation = values.copy()
stack_removed = stack_representation.pop()

queue_representation = values.copy()
queue_removed = queue_representation.pop(0)

print("Stack removed:", stack_removed)
print("Queue removed:", queue_removed)
print("Result:", stack_removed != queue_removed)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list", "stack", "queue"],
    algorithm: "ADT behavior comparison",
    phases: ["Copy one representation", "Apply LIFO removal", "Apply FIFO removal"],
    invariants: ["Operation rules define the ADT, not the Python type name alone"],
    complexity: { time: "Stack pop O(1), list-front queue pop O(n)", space: "O(n) per copy", note: "A list can model both behaviors, but not with equal operation costs." },
    eventTypes: ["POP", "DEQUEUE", "COMPARE", "RETURN_RESULT"],
    comparisonGroup: "same-representation-different-adt",
  },
  {
    title: "Model a priority service interface",
    section: "Abstract data types and representations",
    objective: "Remove the highest-priority item independently of insertion order.",
    code: `
requests = []

def add_request(priority, name):
    requests.append((priority, name))

def serve_next():
    best_index = min(range(len(requests)), key=lambda index: requests[index][0])
    return requests.pop(best_index)

add_request(3, "update profile")
add_request(1, "reset password")
add_request(2, "change address")

served = serve_next()
print("Served:", served)
print("Result:", requests)`,
    expectedResult: "Result: [(3, 'update profile'), (2, 'change address')]",
    structureTypes: ["priority-queue", "python-list"],
    algorithm: "Unsorted-list priority queue",
    phases: ["Insert requests", "Scan for the best priority", "Remove that request"],
    invariants: ["serve_next returns the remaining request with the smallest priority number"],
    complexity: { time: "Insert O(1), remove-best O(n)", space: "O(n)", note: "A later heap lesson changes the representation and cost tradeoff." },
    eventTypes: ["INSERT", "COMPARE", "REMOVE", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Specify a set interface",
    section: "Abstract data types and representations",
    objective: "Use uniqueness and membership as the defining behavior of a set ADT.",
    code: `
class UniqueTags:
    def __init__(self):
        self._tags = set()

    def add(self, tag):
        self._tags.add(tag)

    def contains(self, tag):
        return tag in self._tags

    def remove(self, tag):
        self._tags.discard(tag)

tags = UniqueTags()
for tag in ["python", "graphs", "python"]:
    tags.add(tag)
tags.remove("graphs")

print("Contains python:", tags.contains("python"))
print("Result:", len(tags._tags))`,
    expectedResult: "Result: 1",
    structureTypes: ["set"],
    algorithm: "Set ADT",
    phases: ["Add unique values", "Test membership", "Remove without duplicates"],
    invariants: ["Each tag appears at most once"],
    complexity: { time: "Expected O(1) add, contains, and remove", space: "O(n)", note: "Hashing supplies expected constant-time operations." },
    eventTypes: ["INSERT", "FIND", "REMOVE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Specify a map interface",
    section: "Abstract data types and representations",
    objective: "Associate each unique key with one current value.",
    code: `
class ScoreMap:
    def __init__(self):
        self._scores = {}

    def put(self, name, score):
        self._scores[name] = score

    def get(self, name):
        return self._scores.get(name)

scores = ScoreMap()
scores.put("Ari", 8)
scores.put("Bea", 9)
scores.put("Ari", 10)

print("Ari:", scores.get("Ari"))
print("Result:", len(scores._scores))`,
    expectedResult: "Result: 2",
    structureTypes: ["hash-table"],
    algorithm: "Map ADT",
    phases: ["Insert key-value pairs", "Replace one key's value", "Retrieve by key"],
    invariants: ["Each key has at most one current mapped value"],
    complexity: { time: "Expected O(1) put and get", space: "O(n)", note: "A repeated key replaces its value rather than adding a duplicate key." },
    eventTypes: ["INSERT", "WRITE", "FIND", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Choose a representation for membership",
    section: "Abstract data types and representations",
    objective: "Select a list or set representation based on ordering and lookup needs.",
    code: `
attendees = ["Ari", "Bea", "Chen", "Dia"]
questions = ["Dia", "Eli", "Ari"]

ordered_answers = []
for name in questions:
    ordered_answers.append(name in attendees)

membership_index = set(attendees)
indexed_answers = [name in membership_index for name in questions]

print("Order preserved:", attendees)
print("Answers agree:", ordered_answers == indexed_answers)
print("Result:", indexed_answers)`,
    expectedResult: "Result: [True, False, True]",
    structureTypes: ["python-list", "set"],
    algorithm: "Representation choice",
    phases: ["Preserve ordered source", "Build a membership index", "Compare answers"],
    invariants: ["Both representations answer membership consistently"],
    complexity: { time: "List queries O(qn), set build and queries expected O(n + q)", space: "O(n)", note: "The set adds memory and does not replace the ordered source when order matters." },
    eventTypes: ["READ", "INSERT", "FIND", "COMPARE", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "membership-representations",
  },
  {
    title: "Protect a bounded-buffer invariant",
    section: "Abstract data types and representations",
    objective: "Reject an operation that would violate an ADT capacity rule.",
    code: `
capacity = 3
buffer = []
attempts = ["A", "B", "C", "D"]
accepted = []

for value in attempts:
    if len(buffer) < capacity:
        buffer.append(value)
        accepted.append(True)
    else:
        accepted.append(False)

within_capacity = len(buffer) <= capacity
print("Accepted:", accepted)
print("Buffer:", buffer)
print("Result:", within_capacity)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "queue"],
    algorithm: "Bounded buffer",
    phases: ["Check available capacity", "Accept or reject", "Verify the size rule"],
    invariants: ["0 <= len(buffer) <= capacity"],
    edgeCases: ["Attempt to insert when full"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["COMPARE", "CHOOSE", "INSERT", "REJECT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Compare interface-equivalent stacks",
    section: "Abstract data types and representations",
    objective: "Confirm that two representations satisfy the same observable stack behavior.",
    code: `
from collections import deque

operations = [("push", 4), ("push", 7), ("pop", None), ("push", 9), ("pop", None)]
list_stack = []
deque_stack = deque()
list_output = []
deque_output = []

for operation, value in operations:
    if operation == "push":
        list_stack.append(value)
        deque_stack.append(value)
    else:
        list_output.append(list_stack.pop())
        deque_output.append(deque_stack.pop())

print("List output:", list_output)
print("Deque output:", deque_output)
print("Result:", list_output == deque_output)`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list", "deque"],
    algorithm: "Representation equivalence check",
    phases: ["Replay the same operations", "Collect observable outputs", "Compare behavior"],
    invariants: ["Equivalent stack implementations produce the same pop sequence"],
    complexity: { time: "O(m) for m operations", space: "O(n)", note: "Both supported representations provide amortized or direct O(1) end operations." },
    eventTypes: ["PUSH", "POP", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "stack-representations",
  },
];

/*
 * Python-native container lessons systematically cover the operations beginners
 * meet in real programs. Closely related methods share vocabulary, but each
 * program has a distinct objective, state transition, and observable result.
 */
const containerPrograms = [
  {
    title: "Read list positions from both ends",
    section: "Python-native containers",
    objective: "Relate positive and negative list indices to the same stored values.",
    code: `
colors = ["red", "green", "blue", "gold"]
first = colors[0]
last = colors[-1]
second_last = colors[-2]

positions_agree = colors[2] == second_last
print("Endpoints:", first, last)
print("Second last:", second_last)
print("Result:", positions_agree)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "Indexed list access",
    phases: ["Create an ordered list", "Read positive indices", "Read negative indices"],
    edgeCases: ["An index outside the list raises IndexError"],
    complexity: COMPLEXITIES.constant,
    eventTypes: ["READ", "VISIT_INDEX", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Replace one list value",
    section: "Python-native containers",
    objective: "Mutate one indexed cell while preserving the surrounding order.",
    code: `
scores = [8, 6, 9, 7]
before = scores.copy()
index = 1
scores[index] = 10

unchanged_neighbors = scores[0] == before[0] and scores[2:] == before[2:]
print("Before:", before)
print("After:", scores)
print("Result:", unchanged_neighbors)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "Indexed replacement",
    phases: ["Copy the prior state", "Write one index", "Check unaffected cells"],
    invariants: ["List length and all non-target positions remain unchanged"],
    complexity: COMPLEXITIES.constant,
    eventTypes: ["READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Extract a list slice",
    section: "Python-native containers",
    objective: "Create an independent sublist from a half-open index range.",
    code: `
days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
workdays = days[0:5]
weekend = days[5:]

workdays.append("Planning")
original_unchanged = len(days) == 7
print("Workdays copy:", workdays)
print("Weekend:", weekend)
print("Result:", original_unchanged)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "List slicing",
    phases: ["Choose half-open ranges", "Create slice copies", "Mutate a copy"],
    invariants: ["Slicing a list creates a new outer list"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["READ", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Replace a range with slice assignment",
    section: "Python-native containers",
    objective: "Use slice assignment to replace several adjacent values in place.",
    code: `
route = ["home", "old-a", "old-b", "office"]
before_id = id(route)

route[1:3] = ["station", "cafe", "library"]

same_list = id(route) == before_id
print("Updated route:", route)
print("Length:", len(route))
print("Result:", same_list)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "Slice assignment",
    phases: ["Select a target range", "Replace it with new values", "Confirm in-place mutation"],
    invariants: ["The name route still references the same list object"],
    complexity: { time: "O(n + k)", space: "O(k)", note: "Values after the slice may shift, and k replacement values are read." },
    eventTypes: ["READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Append values to a growing list",
    section: "Python-native containers",
    objective: "Build a result one value at a time with append.",
    code: `
measurements = [3, 5, 8, 13]
doubled = []
lengths = []

for measurement in measurements:
    doubled.append(measurement * 2)
    lengths.append(len(doubled))

print("Growth:", lengths)
print("Values:", doubled)
print("Result:", doubled[-1])`,
    expectedResult: "Result: 26",
    structureTypes: ["python-list"],
    algorithm: "Append-based transformation",
    phases: ["Visit a source value", "Transform it", "Append one result"],
    invariants: ["len(doubled) equals the number of processed measurements"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["VISIT_INDEX", "READ", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Extend a list with several values",
    section: "Python-native containers",
    objective: "Distinguish adding each incoming item from appending the incoming list itself.",
    code: `
morning = ["email", "planning"]
afternoon = ["coding", "review"]
schedule = morning.copy()

schedule.extend(afternoon)

flat_strings = all(isinstance(item, str) for item in schedule)
print("Schedule:", schedule)
print("Count:", len(schedule))
print("Result:", flat_strings)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "List extension",
    phases: ["Copy the first sequence", "Insert every value from the second", "Check the flat result"],
    complexity: { time: "O(k)", space: "O(k) additional list capacity", note: "k is the number of values supplied to extend." },
    eventTypes: ["READ", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Insert at a chosen position",
    section: "Python-native containers",
    objective: "Insert one value and observe how later list positions shift.",
    code: `
queue = ["Ari", "Chen", "Dia"]
before_positions = {name: queue.index(name) for name in queue}

queue.insert(1, "Bea")
after_positions = {name: queue.index(name) for name in queue}

chen_shifted = after_positions["Chen"] == before_positions["Chen"] + 1
print("Queue:", queue)
print("Positions:", after_positions)
print("Result:", chen_shifted)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list", "queue"],
    algorithm: "Indexed insertion",
    phases: ["Record positions", "Insert one value", "Inspect shifted suffix positions"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "INSERT", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Remove the first matching value",
    section: "Python-native containers",
    objective: "Use remove when the value is known and duplicate behavior matters.",
    code: `
tasks = ["test", "build", "test", "deploy"]
before_count = tasks.count("test")

tasks.remove("test")
after_count = tasks.count("test")

removed_one = before_count - after_count == 1
print("Remaining:", tasks)
print("Test count:", after_count)
print("Result:", removed_one)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "First-match removal",
    phases: ["Count duplicate values", "Remove the first match", "Check one occurrence disappeared"],
    edgeCases: ["Removing a missing value raises ValueError"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["FIND", "REMOVE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Pop and use the removed value",
    section: "Python-native containers",
    objective: "Remove by position while retaining the removed list value.",
    code: `
history = ["open", "edit", "save", "close"]
last_action = history.pop()
first_action = history.pop(0)
ends_removed = (first_action, last_action) == ("open", "close")

print("Removed:", first_action, last_action)
print("Remaining:", history)
print("Correct ends:", ends_removed)
print("Result:", len(history))`,
    expectedResult: "Result: 2",
    structureTypes: ["python-list", "stack"],
    algorithm: "Positional pop",
    phases: ["Pop the end", "Pop the beginning", "Inspect returned values"],
    complexity: { time: "End pop O(1), front pop O(n)", space: "O(1)", note: "Removing the front shifts the remaining list values." },
    eventTypes: ["POP", "DEQUEUE", "RETURN_RESULT"],
  },
  {
    title: "Clear a list without rebinding aliases",
    section: "Python-native containers",
    objective: "Observe that clear mutates one shared list instead of assigning a new list.",
    code: `
cart = ["tea", "rice", "soap"]
alias = cart
object_before = id(cart)

cart.clear()

same_object = id(cart) == object_before
alias_observes_empty = alias == []
print("Cart:", cart)
print("Alias:", alias)
print("Result:", same_object and alias_observes_empty)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "In-place clear",
    phases: ["Create a shared reference", "Remove every item in place", "Inspect both names"],
    invariants: ["clear preserves list identity while setting length to zero"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "REMOVE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Locate and count list values",
    section: "Python-native containers",
    objective: "Use index for the first position and count for total occurrences.",
    code: `
votes = ["blue", "green", "blue", "gold", "blue"]
first_blue = votes.index("blue")
blue_count = votes.count("blue")

summary = {
    "first": first_blue,
    "count": blue_count,
}

print("Summary:", summary)
print("Result:", summary["count"])`,
    expectedResult: "Result: 3",
    structureTypes: ["python-list", "hash-table"],
    algorithm: "List search summaries",
    phases: ["Find the first match", "Count every match", "Store a labeled summary"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["FIND", "COMPARE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Reverse and sort with different promises",
    section: "Python-native containers",
    objective: "Compare reversing current order with sorting by value.",
    code: `
values = [4, 1, 3, 2]
reversed_values = values.copy()
sorted_values = values.copy()

reversed_values.reverse()
sorted_values.sort()

print("Reversed:", reversed_values)
print("Sorted:", sorted_values)
print("Original:", values)
print("Result:", reversed_values != sorted_values)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "Reverse versus sort",
    phases: ["Copy one input", "Reverse one copy", "Sort the other copy"],
    invariants: ["Both operations preserve the multiset of values"],
    complexity: { time: "Reverse O(n), sort O(n log n)", space: "Copies use O(n)", note: "Reverse uses positions; sort uses comparisons and ordering rules." },
    eventTypes: ["READ", "SWAP", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    comparisonGroup: "reverse-versus-sort",
  },
  {
    title: "Separate aliasing from a shallow copy",
    section: "Python-native containers",
    objective: "See which list mutation is shared through an alias and which nested mutation is shared through a shallow copy.",
    code: `
original = [["A", 1], ["B", 2]]
alias = original
shallow = original.copy()

alias.append(["C", 3])
shallow[0][1] = 10

outer_lengths_differ = len(original) != len(shallow)
nested_value_shared = original[0][1] == shallow[0][1]
print("Original:", original)
print("Shallow:", shallow)
print("Result:", (outer_lengths_differ, nested_value_shared))`,
    expectedResult: "Result: (True, True)",
    structureTypes: ["python-list"],
    algorithm: "Alias and shallow-copy experiment",
    phases: ["Create an alias and outer copy", "Mutate the outer list", "Mutate a shared nested list"],
    invariants: ["A shallow copy duplicates the outer list but not nested objects"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["READ", "INSERT", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Combine list operators and membership",
    section: "Python-native containers",
    objective: "Use concatenation, repetition, and membership while tracking which operations create new lists.",
    code: `
base = ["x", "y"]
combined = base + ["z"]
repeated = base * 3

contains_z = "z" in combined
base_unchanged = base == ["x", "y"]

print("Combined:", combined)
print("Repeated:", repeated)
print("Result:", contains_z and base_unchanged)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "List operator composition",
    phases: ["Concatenate into a new list", "Repeat into another list", "Check membership and source"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["READ", "INSERT", "FIND", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Transform and flatten nested lists",
    section: "Python-native containers",
    objective: "Use comprehensions to transform values and flatten one nesting level.",
    code: `
rows = [[1, 2, 3], [4, 5], [6]]
flat = [
    value
    for row in rows
    for value in row
]
squares = [value * value for value in flat]

print("Flat:", flat)
print("Squares:", squares)
print("Result:", sum(squares))`,
    expectedResult: "Result: 91",
    structureTypes: ["python-list", "array"],
    algorithm: "One-level flatten and transform",
    phases: ["Visit each row", "Visit each row value", "Transform the flat sequence"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["VISIT_INDEX", "READ", "INSERT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Traverse a two-dimensional list",
    section: "Python-native containers",
    objective: "Address matrix cells with row and column indices.",
    code: `
matrix = [
    [2, 4, 6],
    [1, 3, 5],
    [7, 8, 9],
]
row_totals = []

for row_index, row in enumerate(matrix):
    total = 0
    for column_index, value in enumerate(row):
        total += value
    row_totals.append(total)

print("Row totals:", row_totals)
print("Result:", max(row_totals))`,
    expectedResult: "Result: 24",
    structureTypes: ["array"],
    algorithm: "Row-major matrix traversal",
    phases: ["Visit each row", "Visit each column", "Accumulate one row total"],
    invariants: ["total equals the sum of cells already visited in the current row"],
    complexity: { time: "O(rows * columns)", space: "O(rows)", note: "Every matrix cell is read once." },
    eventTypes: ["VISIT_INDEX", "READ", "WRITE", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Create and look up dictionary entries",
    section: "Python-native containers",
    objective: "Retrieve labeled values by unique dictionary keys.",
    code: `
profile = {
    "name": "Ari",
    "level": 3,
    "active": True,
}

name = profile["name"]
level = profile["level"]
summary = f"{name} is level {level}"

print("Summary:", summary)
print("Result:", profile["active"])`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table"],
    algorithm: "Dictionary lookup",
    phases: ["Create key-value entries", "Look up known keys", "Build a result"],
    edgeCases: ["Bracket lookup of a missing key raises KeyError"],
    complexity: { time: "Expected O(1) per lookup", space: "O(n)", note: "Hashing maps each key to its current value." },
    eventTypes: ["READ", "FIND", "RETURN_RESULT"],
  },
  {
    title: "Insert and replace dictionary values",
    section: "Python-native containers",
    objective: "Distinguish adding a new key from updating an existing key.",
    code: `
stock = {"pens": 4, "books": 2}
before_keys = set(stock)

stock["lamps"] = 3
stock["pens"] = 7

added_keys = set(stock) - before_keys
print("Stock:", stock)
print("Added keys:", sorted(added_keys))
print("Result:", stock["pens"])`,
    expectedResult: "Result: 7",
    structureTypes: ["hash-table", "set"],
    algorithm: "Dictionary insert and update",
    phases: ["Record existing keys", "Insert one key", "Replace one value"],
    invariants: ["A dictionary keeps one current value per key"],
    complexity: { time: "Expected O(1) per write", space: "O(n)", note: "Replacing a value does not increase the number of keys." },
    eventTypes: ["INSERT", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Delete entries with del and pop",
    section: "Python-native containers",
    objective: "Compare deleting by statement with removing and returning a value.",
    code: `
settings = {"theme": "dark", "font": 16, "tips": True}

removed_font = settings.pop("font")
del settings["tips"]
remaining_keys = sorted(settings)

print("Removed font:", removed_font)
print("Remaining:", settings)
print("Remaining keys:", remaining_keys)
print("Result:", len(settings))`,
    expectedResult: "Result: 1",
    structureTypes: ["hash-table"],
    algorithm: "Dictionary deletion",
    phases: ["Pop and retain one value", "Delete another entry", "Inspect the remaining map"],
    complexity: { time: "Expected O(1) per deletion", space: "O(1)", note: "pop returns the removed value; del does not." },
    eventTypes: ["REMOVE", "READ", "RETURN_RESULT"],
  },
  {
    title: "Iterate through dictionary keys and values",
    section: "Python-native containers",
    objective: "Use items to keep each dictionary key paired with its value.",
    code: `
prices = {"tea": 3, "rice": 5, "soap": 4}
labels = []
total = 0

for item, price in prices.items():
    labels.append(f"{item}:{price}")
    total += price

print("Labels:", labels)
print("Key present:", "tea" in prices)
print("Result:", total)`,
    expectedResult: "Result: 12",
    structureTypes: ["hash-table", "python-list"],
    algorithm: "Dictionary item traversal",
    phases: ["Visit each entry", "Keep key and value together", "Accumulate values"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["VISIT_INDEX", "READ", "FIND", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Use get for an optional key",
    section: "Python-native containers",
    objective: "Supply an explicit fallback without raising a missing-key error.",
    code: `
counts = {"red": 2, "blue": 1}
queries = ["red", "green", "blue"]
answers = []

for color in queries:
    answers.append(counts.get(color, 0))

print("Answers:", answers)
print("Original keys:", sorted(counts))
print("Result:", sum(answers))`,
    expectedResult: "Result: 3",
    structureTypes: ["hash-table"],
    algorithm: "Optional dictionary lookup",
    phases: ["Visit each query", "Return mapped value or fallback", "Preserve the dictionary"],
    complexity: { time: "Expected O(q)", space: "O(q)", note: "q is the number of lookup requests." },
    eventTypes: ["FIND", "CHOOSE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Merge dictionary updates",
    section: "Python-native containers",
    objective: "Apply several updates and observe replacement when keys overlap.",
    code: `
defaults = {"theme": "light", "font": 14, "wrap": True}
preferences = {"theme": "dark", "font": 18}
resolved = defaults.copy()

resolved.update(preferences)

overridden = {
    key: resolved[key]
    for key in preferences
}
print("Resolved:", resolved)
print("Overridden:", overridden)
print("Result:", resolved["theme"])`,
    expectedResult: "Result: dark",
    structureTypes: ["hash-table"],
    algorithm: "Dictionary overlay",
    phases: ["Copy defaults", "Overlay explicit preferences", "Inspect overlapping keys"],
    invariants: ["Every preference key has its preference value in the result"],
    complexity: { time: "O(d + p)", space: "O(d)", note: "d and p are the numbers of default and preference entries." },
    eventTypes: ["READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Accumulate groups with setdefault",
    section: "Python-native containers",
    objective: "Create a missing list once and then append values to the correct group.",
    code: `
records = [("fruit", "apple"), ("tool", "hammer"), ("fruit", "pear")]
groups = {}

for category, item in records:
    bucket = groups.setdefault(category, [])
    bucket.append(item)

print("Groups:", groups)
print("Fruit:", groups["fruit"])
print("Result:", len(groups))`,
    expectedResult: "Result: 2",
    structureTypes: ["hash-table", "python-list"],
    algorithm: "Dictionary grouping",
    phases: ["Visit one record", "Find or create its bucket", "Append to that bucket"],
    invariants: ["Each record appears in exactly one category bucket"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["FIND", "INSERT", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Build a dictionary comprehension",
    section: "Python-native containers",
    objective: "Create keyed transformed values from one source sequence.",
    code: `
words = ["ant", "bear", "cat", "dolphin"]
lengths = {
    word: len(word)
    for word in words
    if len(word) >= 4
}

longest_word = max(lengths, key=lengths.get)
print("Lengths:", lengths)
print("Longest:", longest_word)
print("Result:", lengths[longest_word])`,
    expectedResult: "Result: 7",
    structureTypes: ["hash-table", "python-list"],
    algorithm: "Filtered dictionary comprehension",
    phases: ["Visit source words", "Filter by length", "Map accepted words to lengths"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["VISIT_INDEX", "COMPARE", "INSERT", "FIND", "RETURN_RESULT"],
  },
  {
    title: "Inspect nested dictionaries and valid keys",
    section: "Python-native containers",
    objective: "Navigate nested mappings and distinguish immutable keys from mutable values.",
    code: `
courses = {
    ("python", 1): {"title": "Foundations", "lessons": 8},
    ("python", 2): {"title": "Data Structures", "lessons": 12},
}

key = ("python", 2)
course = courses[key]
course["lessons"] += 1

print("Course:", course)
print("Insertion order:", list(courses))
print("Result:", courses[key]["lessons"])`,
    expectedResult: "Result: 13",
    structureTypes: ["hash-table"],
    algorithm: "Nested dictionary update",
    phases: ["Use an immutable tuple key", "Read a nested mapping", "Mutate its value"],
    edgeCases: ["A list cannot be a dictionary key because it is mutable and unhashable"],
    complexity: { time: "Expected O(1) lookup and update", space: "O(n)", note: "Modern Python dictionaries preserve insertion order." },
    eventTypes: ["FIND", "READ", "WRITE", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Create a set and remove duplicates",
    section: "Python-native containers",
    objective: "Use set uniqueness while restoring a predictable display order.",
    code: `
raw_tags = ["python", "graphs", "python", "sorting", "graphs"]
unique_tags = set(raw_tags)
ordered_tags = sorted(unique_tags)

duplicates_removed = len(raw_tags) - len(unique_tags)
print("Unique:", ordered_tags)
print("Removed count:", duplicates_removed)
print("Result:", len(unique_tags))`,
    expectedResult: "Result: 3",
    structureTypes: ["set", "python-list"],
    algorithm: "Set-based deduplication",
    phases: ["Read repeated values", "Insert into a set", "Sort only for presentation"],
    invariants: ["Each distinct tag appears once in the set"],
    complexity: { time: "Expected O(n) to deduplicate, O(u log u) to sort for display", space: "O(u)", note: "u is the number of unique values." },
    eventTypes: ["READ", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Compare remove and discard",
    section: "Python-native containers",
    objective: "Use discard when absence is acceptable and remove when absence should be an error.",
    code: `
permissions = {"read", "write", "share"}
permissions.remove("share")
permissions.discard("admin")

has_write = "write" in permissions
print("Permissions:", sorted(permissions))
print("Missing discard was safe:", "admin" not in permissions)
print("Result:", has_write)`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Set deletion policies",
    phases: ["Remove a known value", "Discard an optional value", "Check membership"],
    edgeCases: ["remove raises KeyError for a missing value", "discard leaves the set unchanged"],
    complexity: { time: "Expected O(1) per operation", space: "O(1) extra", note: "Both operations use hashed membership." },
    eventTypes: ["REMOVE", "FIND", "RETURN_RESULT"],
  },
  {
    title: "Combine sets with union and intersection",
    section: "Python-native containers",
    objective: "Find values appearing in either set and values shared by both sets.",
    code: `
design = {"Ari", "Bea", "Chen"}
coding = {"Bea", "Chen", "Dia"}

either_team = design | coding
both_teams = design & coding

print("Either:", sorted(either_team))
print("Both:", sorted(both_teams))
print("Result:", len(both_teams))`,
    expectedResult: "Result: 2",
    structureTypes: ["set"],
    algorithm: "Set union and intersection",
    phases: ["Read two memberships", "Combine all distinct values", "Keep common values"],
    complexity: { time: "Expected O(a + b)", space: "O(a + b)", note: "a and b are the two set sizes." },
    eventTypes: ["READ", "INSERT", "FIND", "RETURN_RESULT"],
  },
  {
    title: "Find set differences",
    section: "Python-native containers",
    objective: "Distinguish one-sided difference from symmetric difference.",
    code: `
planned = {"login", "search", "export", "share"}
completed = {"login", "search", "profile"}

remaining = planned - completed
different = planned ^ completed

print("Remaining:", sorted(remaining))
print("In exactly one set:", sorted(different))
print("Result:", len(different))`,
    expectedResult: "Result: 3",
    structureTypes: ["set"],
    algorithm: "Set difference analysis",
    phases: ["Subtract completed work", "Find one-set-only values", "Compare the results"],
    complexity: { time: "Expected O(a + b)", space: "O(a + b)", note: "Difference direction matters; symmetric difference has no direction." },
    eventTypes: ["READ", "FIND", "RETURN_RESULT"],
  },
  {
    title: "Check subset and superset relationships",
    section: "Python-native containers",
    objective: "Express containment between complete groups rather than individual values.",
    code: `
required = {"read", "comment"}
editor = {"read", "comment", "write"}
viewer = {"read"}

editor_qualifies = required <= editor
viewer_qualifies = required <= viewer
editor_is_superset = editor >= required

print("Editor:", editor_qualifies)
print("Viewer:", viewer_qualifies)
print("Result:", editor_is_superset)`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Subset policy check",
    phases: ["Define required capabilities", "Compare candidate sets", "Report containment"],
    complexity: { time: "Expected O(len(required)) per check", space: "O(1) extra", note: "The check may inspect each required member." },
    eventTypes: ["FIND", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Check whether sets are disjoint",
    section: "Python-native containers",
    objective: "Detect whether two groups share no values.",
    code: `
morning_rooms = {"A", "B", "C"}
evening_rooms = {"D", "E"}
maintenance_rooms = {"C", "F"}

evening_conflict = not morning_rooms.isdisjoint(evening_rooms)
maintenance_conflict = not morning_rooms.isdisjoint(maintenance_rooms)

print("Evening conflict:", evening_conflict)
print("Maintenance conflict:", maintenance_conflict)
print("Result:", maintenance_conflict)`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Disjointness check",
    phases: ["Compare group memberships", "Stop if a shared value exists", "Report conflicts"],
    complexity: { time: "Expected O(min(a, b))", space: "O(1) extra", note: "The smaller set can be checked against the larger one." },
    eventTypes: ["FIND", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Create sets with comprehensions and frozenset",
    section: "Python-native containers",
    objective: "Build transformed unique values and use an immutable set as a dictionary key.",
    code: `
numbers = range(1, 8)
even_squares = {
    number * number
    for number in numbers
    if number % 2 == 0
}

route = frozenset({"A", "B"})
costs = {route: 12}

print("Even squares:", sorted(even_squares))
print("Route key:", sorted(route))
print("Result:", costs[route])`,
    expectedResult: "Result: 12",
    structureTypes: ["set", "hash-table"],
    algorithm: "Set comprehension and immutable set key",
    phases: ["Filter and transform numbers", "Freeze a membership group", "Use it as a hashable key"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["VISIT_INDEX", "COMPARE", "INSERT", "FIND", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Operate on both ends of a deque",
    section: "Python-native containers",
    objective: "Append and remove efficiently at both the left and right ends.",
    code: `
from collections import deque

line = deque(["B", "C"])
line.appendleft("A")
line.append("D")

first = line.popleft()
last = line.pop()

print("Removed:", first, last)
print("Remaining:", list(line))
print("Result:", len(line))`,
    expectedResult: "Result: 2",
    structureTypes: ["deque"],
    algorithm: "Double-ended queue operations",
    phases: ["Add at both ends", "Remove at both ends", "Inspect the middle"],
    complexity: { time: "O(1) per end operation", space: "O(n)", note: "deque is designed for efficient work at both ends." },
    eventTypes: ["ENQUEUE", "PUSH", "DEQUEUE", "POP", "RETURN_RESULT"],
  },
  {
    title: "Rotate a deque",
    section: "Python-native containers",
    objective: "Move end values around a circular view without manually slicing.",
    code: `
from collections import deque

players = deque(["Ari", "Bea", "Chen", "Dia"])
players.rotate(1)
after_right = list(players)
players.rotate(-2)
after_left = list(players)

print("Right rotation:", after_right)
print("Then left:", after_left)
print("Result:", players[0])`,
    expectedResult: "Result: Bea",
    structureTypes: ["deque"],
    algorithm: "Deque rotation",
    phases: ["Rotate right", "Record the order", "Rotate left"],
    complexity: { time: "O(k) for the smaller effective rotation", space: "O(1) extra", note: "Rotation changes logical order in place." },
    eventTypes: ["ROTATE", "READ", "RETURN_RESULT"],
  },
  {
    title: "Keep a bounded deque history",
    section: "Python-native containers",
    objective: "Use maxlen to retain only the most recent values.",
    code: `
from collections import deque

recent = deque(maxlen=3)
snapshots = []

for reading in [10, 20, 30, 40, 50]:
    recent.append(reading)
    snapshots.append(list(recent))

print("Snapshots:", snapshots)
print("Final recent:", list(recent))
print("Result:", recent[0])`,
    expectedResult: "Result: 30",
    structureTypes: ["deque", "queue"],
    algorithm: "Bounded recent-history queue",
    phases: ["Append each reading", "Discard the oldest when full", "Keep the latest window"],
    invariants: ["len(recent) <= 3"],
    complexity: { time: "O(n) for n appends", space: "O(1) because maxlen is fixed at 3", note: "Each individual append is O(1)." },
    eventTypes: ["ENQUEUE", "DEQUEUE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Use deque as stack and queue",
    section: "Python-native containers",
    objective: "Apply different removal ends to model LIFO and FIFO behavior.",
    code: `
from collections import deque

values = ["one", "two", "three"]
stack = deque(values)
queue = deque(values)

stack_order = [stack.pop() for _ in range(len(stack))]
queue_order = [queue.popleft() for _ in range(len(queue))]

print("Stack:", stack_order)
print("Queue:", queue_order)
print("Result:", stack_order[0] != queue_order[0])`,
    expectedResult: "Result: True",
    structureTypes: ["deque", "stack", "queue"],
    algorithm: "Deque ADT comparison",
    phases: ["Load identical values", "Remove from one end for LIFO", "Remove from the other end for FIFO"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["PUSH", "POP", "ENQUEUE", "DEQUEUE", "COMPARE", "RETURN_RESULT"],
    comparisonGroup: "same-representation-different-adt",
  },
  {
    title: "Count frequencies with Counter",
    section: "Python-native containers",
    objective: "Build a frequency map and inspect the most common values.",
    code: `
from collections import Counter

letters = list("mississippi")
counts = Counter(letters)
top_two = counts.most_common(2)

print("Counts:", sorted(counts.items()))
print("Top two:", top_two)
print("Result:", counts["i"])`,
    expectedResult: "Result: 4",
    structureTypes: ["hash-table"],
    algorithm: "Frequency counting",
    phases: ["Visit each value", "Increment its count", "Rank common values"],
    complexity: { time: "O(n + u log u) for a full ranking", space: "O(u)", note: "u is the number of unique values." },
    eventTypes: ["VISIT_INDEX", "FIND", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Combine multisets with Counter arithmetic",
    section: "Python-native containers",
    objective: "Add and subtract occurrence counts while dropping nonpositive results.",
    code: `
from collections import Counter

warehouse_a = Counter({"pen": 3, "book": 1})
warehouse_b = Counter({"pen": 1, "lamp": 2})
combined = warehouse_a + warehouse_b
remaining = combined - Counter({"pen": 2, "lamp": 1})

print("Combined:", sorted(combined.items()))
print("Remaining:", sorted(remaining.items()))
print("Result:", remaining["pen"])`,
    expectedResult: "Result: 2",
    structureTypes: ["hash-table"],
    algorithm: "Multiset arithmetic",
    phases: ["Combine positive counts", "Subtract consumed counts", "Inspect remaining multiplicities"],
    invariants: ["Counter subtraction output contains only positive counts"],
    complexity: { time: "O(a + b)", space: "O(a + b)", note: "Work depends on the distinct keys in both counters." },
    eventTypes: ["READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Group values with defaultdict",
    section: "Python-native containers",
    objective: "Create missing collection values automatically through a factory.",
    code: `
from collections import defaultdict

words = ["ant", "apple", "bear", "boat", "cat"]
by_initial = defaultdict(list)

for word in words:
    by_initial[word[0]].append(word)

normal = dict(by_initial)
print("Groups:", normal)
print("B words:", normal["b"])
print("Result:", len(normal))`,
    expectedResult: "Result: 3",
    structureTypes: ["hash-table", "python-list"],
    algorithm: "Factory-backed grouping",
    phases: ["Read a grouping key", "Create a missing list", "Append the value"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["FIND", "INSERT", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Layer mappings with ChainMap",
    section: "Python-native containers",
    objective: "Resolve a key through local settings before shared defaults.",
    code: `
from collections import ChainMap

defaults = {"theme": "light", "font": 14, "wrap": True}
project = {"font": 18}
session = {"theme": "dark"}
resolved = ChainMap(session, project, defaults)

values = {
    key: resolved[key]
    for key in ["theme", "font", "wrap"]
}

print("Resolved:", values)
print("Result:", resolved["font"])`,
    expectedResult: "Result: 18",
    structureTypes: ["hash-table"],
    algorithm: "Layered mapping lookup",
    phases: ["Order mapping layers", "Search from first to last", "Return the first matching key"],
    invariants: ["Earlier maps override later maps without mutating them"],
    complexity: { time: "O(m) worst case per lookup", space: "O(m) mapping references", note: "m is the number of mapping layers." },
    eventTypes: ["FIND", "READ", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Name tuple positions with namedtuple",
    section: "Python-native containers",
    objective: "Keep tuple immutability while giving each position a readable field name.",
    code: `
from collections import namedtuple

Point = namedtuple("Point", ["x", "y"])
start = Point(2, 3)
end = Point(7, 11)

delta = Point(end.x - start.x, end.y - start.y)
distance_squared = delta.x ** 2 + delta.y ** 2

print("Delta:", delta)
print("Result:", distance_squared)`,
    expectedResult: "Result: 89",
    structureTypes: ["python-list"],
    algorithm: "Named immutable record",
    phases: ["Define field names", "Create immutable records", "Read fields for a calculation"],
    invariants: ["Point values cannot be changed in place"],
    complexity: COMPLEXITIES.constant,
    eventTypes: ["READ", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Move ordered dictionary entries",
    section: "Python-native containers",
    objective: "Use OrderedDict operations when explicit entry reordering is part of the task.",
    code: `
from collections import OrderedDict

recent = OrderedDict()
for page in ["home", "docs", "examples"]:
    recent[page] = True

recent.move_to_end("home")
oldest, _ = recent.popitem(last=False)

print("Remaining order:", list(recent))
print("Removed oldest:", oldest)
print("Result:", list(recent)[-1])`,
    expectedResult: "Result: home",
    structureTypes: ["hash-table", "queue"],
    algorithm: "Explicit ordered-map reordering",
    phases: ["Insert entries", "Move one entry to the end", "Remove from the front"],
    complexity: { time: "O(1) move and end removal", space: "O(n)", note: "OrderedDict exposes explicit reordering operations beyond ordinary insertion order." },
    eventTypes: ["INSERT", "ROTATE", "DEQUEUE", "RETURN_RESULT"],
    difficulty: "Developing",
  },
];

/*
 * Array and sequence techniques progress from explicit indexed scans through
 * pointers, windows, prefix information, partitioning, intervals, and matrices.
 */
const arrayPrograms = [
  {
    title: "Scan an array with explicit indices",
    section: "Arrays and sequence techniques",
    objective: "Connect each visited index with the value stored at that position.",
    code: `
values = [12, 7, 19, 4, 11]
visited = []
total = 0

for index in range(len(values)):
    value = values[index]
    visited.append((index, value))
    total += value

print("Visited:", visited)
print("Result:", total)`,
    expectedResult: "Result: 53",
    structureTypes: ["array"],
    algorithm: "Indexed array scan",
    phases: ["Choose the next index", "Read its value", "Update the accumulator"],
    invariants: ["total equals the sum of values at visited indices"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["VISIT_INDEX", "READ", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Find both endpoints safely",
    section: "Arrays and sequence techniques",
    objective: "Check for an empty sequence before reading first and last values.",
    code: `
values = [5, 8, 13, 21]

if values:
    endpoints = (values[0], values[-1])
    span = endpoints[1] - endpoints[0]
else:
    endpoints = None
    span = 0

print("Endpoints:", endpoints)
print("Result:", span)`,
    expectedResult: "Result: 16",
    structureTypes: ["array"],
    algorithm: "Guarded endpoint access",
    phases: ["Check whether data exists", "Read both endpoints", "Compute a span"],
    edgeCases: ["Empty sequence"],
    complexity: COMPLEXITIES.constant,
    eventTypes: ["COMPARE", "CHOOSE", "READ", "RETURN_RESULT"],
  },
  {
    title: "Reverse a range in place",
    section: "Arrays and sequence techniques",
    objective: "Swap mirrored positions while two indices move toward the center.",
    code: `
values = [1, 2, 3, 4, 5, 6]
left = 1
right = 4
swaps = 0

while left < right:
    values[left], values[right] = values[right], values[left]
    swaps += 1
    left += 1
    right -= 1

print("Reversed range:", values)
print("Result:", swaps)`,
    expectedResult: "Result: 2",
    structureTypes: ["array"],
    algorithm: "Two-pointer range reversal",
    phases: ["Place pointers at range ends", "Swap mirrored values", "Move inward"],
    invariants: ["Values outside the selected range never change"],
    complexity: { time: "O(k)", space: "O(1)", note: "k is the length of the reversed range." },
    eventTypes: ["READ", "SWAP", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Find a pair with two pointers",
    section: "Arrays and sequence techniques",
    objective: "Use sorted order to move one boundary after each sum comparison.",
    code: `
values = [1, 3, 4, 6, 8, 10]
target = 14
left = 0
right = len(values) - 1
pair = None

while left < right:
    total = values[left] + values[right]
    if total == target:
        pair = (values[left], values[right])
        break
    if total < target:
        left += 1
    else:
        right -= 1

print("Pair:", pair)
print("Result:", sum(pair))`,
    expectedResult: "Result: 14",
    structureTypes: ["array"],
    algorithm: "Two-pointer pair sum",
    phases: ["Start at both sorted ends", "Compare the current sum", "Move the boundary that can improve it"],
    invariants: ["No discarded outside pair can sum to target under sorted order"],
    edgeCases: ["Missing target", "Duplicate values"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Remove sorted duplicates in place",
    section: "Arrays and sequence techniques",
    objective: "Use read and write indices to compact distinct sorted values.",
    code: `
values = [1, 1, 2, 2, 2, 4, 5, 5]
write = 1

for read in range(1, len(values)):
    if values[read] != values[write - 1]:
        values[write] = values[read]
        write += 1

unique = values[:write]
print("Compacted prefix:", unique)
print("New length:", write)
print("Result:", unique)`,
    expectedResult: "Result: [1, 2, 4, 5]",
    structureTypes: ["array"],
    algorithm: "Two-pointer duplicate removal",
    phases: ["Keep the first value", "Scan with a read index", "Write only new values"],
    invariants: ["values before write are the distinct values seen so far"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["VISIT_INDEX", "READ", "COMPARE", "WRITE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Move matching values to the end",
    section: "Arrays and sequence techniques",
    objective: "Partition zeros from nonzero values while preserving nonzero order.",
    code: `
values = [0, 3, 0, 1, 4, 0, 2]
write = 0

for value in values:
    if value != 0:
        values[write] = value
        write += 1

while write < len(values):
    values[write] = 0
    write += 1

print("Partitioned:", values)
print("Result:", values[-3:])`,
    expectedResult: "Result: [0, 0, 0]",
    structureTypes: ["array"],
    algorithm: "Stable zero compaction",
    phases: ["Copy nonzero values forward", "Track the next write cell", "Fill the suffix with zeros"],
    invariants: ["The prefix before write contains processed nonzero values in original order"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "COMPARE", "WRITE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Rotate an array with reversal",
    section: "Arrays and sequence techniques",
    objective: "Rotate right using three in-place range reversals.",
    code: `
def reverse_range(values, left, right):
    while left < right:
        values[left], values[right] = values[right], values[left]
        left += 1
        right -= 1

values = [1, 2, 3, 4, 5, 6, 7]
shift = 3 % len(values)
reverse_range(values, 0, len(values) - 1)
reverse_range(values, 0, shift - 1)
reverse_range(values, shift, len(values) - 1)

print("Rotated:", values)
print("Result:", values[0])`,
    expectedResult: "Result: 5",
    structureTypes: ["array"],
    algorithm: "Array rotation by reversal",
    phases: ["Reverse the whole array", "Restore the rotated prefix", "Restore the rotated suffix"],
    invariants: ["All original values remain exactly once"],
    edgeCases: ["Zero shift", "Shift larger than length"],
    complexity: { time: "O(n)", space: "O(1)", note: "Modulo reduces any shift to one equivalent rotation." },
    eventTypes: ["SWAP", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Merge two sorted sequences",
    section: "Arrays and sequence techniques",
    objective: "Choose the smaller front value while preserving sorted order.",
    code: `
left_values = [1, 4, 7, 10]
right_values = [2, 3, 8, 11]
left = 0
right = 0
merged = []

while left < len(left_values) and right < len(right_values):
    if left_values[left] <= right_values[right]:
        merged.append(left_values[left])
        left += 1
    else:
        merged.append(right_values[right])
        right += 1

merged.extend(left_values[left:])
merged.extend(right_values[right:])
print("Merged:", merged)
print("Result:", merged[-1])`,
    expectedResult: "Result: 11",
    structureTypes: ["array"],
    algorithm: "Two-way merge",
    phases: ["Compare both front values", "Append the smaller value", "Append the remaining suffix"],
    invariants: ["merged is sorted and contains exactly the consumed values"],
    complexity: { time: "O(a + b)", space: "O(a + b)", note: "Every input value is appended once." },
    eventTypes: ["READ", "COMPARE", "MERGE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Build prefix sums",
    section: "Arrays and sequence techniques",
    objective: "Store cumulative totals so later range sums reuse earlier work.",
    code: `
values = [3, 1, 4, 1, 5, 9]
prefix = [0]

for value in values:
    prefix.append(prefix[-1] + value)

left = 2
right = 5
range_sum = prefix[right] - prefix[left]

print("Prefix:", prefix)
print("Range values:", values[left:right])
print("Result:", range_sum)`,
    expectedResult: "Result: 10",
    structureTypes: ["array"],
    algorithm: "Prefix sums",
    phases: ["Start with an empty-prefix zero", "Extend cumulative totals", "Subtract two prefix values"],
    invariants: ["prefix[i] equals the sum of values before index i"],
    complexity: { time: "Build O(n), query O(1)", space: "O(n)", note: "Extra memory makes repeated range queries fast." },
    eventTypes: ["READ", "WRITE", "VISIT_INDEX", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Answer several range-sum queries",
    section: "Arrays and sequence techniques",
    objective: "Reuse one prefix array across multiple half-open ranges.",
    code: `
values = [2, 5, 1, 8, 3, 4]
prefix = [0]
for value in values:
    prefix.append(prefix[-1] + value)

queries = [(0, 3), (2, 5), (1, 6)]
answers = []
for left, right in queries:
    answers.append(prefix[right] - prefix[left])

print("Queries:", queries)
print("Answers:", answers)
print("Result:", answers[-1])`,
    expectedResult: "Result: 21",
    structureTypes: ["array"],
    algorithm: "Repeated prefix-sum queries",
    phases: ["Precompute cumulative totals", "Read each query boundary", "Subtract two prefix cells"],
    invariants: ["Each answer equals sum(values[left:right])"],
    complexity: { time: "O(n + q)", space: "O(n)", note: "n values are preprocessed once and q queries take constant time each." },
    eventTypes: ["READ", "WRITE", "VISIT_INDEX", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Measure a fixed sliding window",
    section: "Arrays and sequence techniques",
    objective: "Update a fixed-size window sum by removing one value and adding one value.",
    code: `
values = [4, 2, 1, 7, 8, 1, 2]
window_size = 3
window_sum = sum(values[:window_size])
best_sum = window_sum
best_start = 0

for right in range(window_size, len(values)):
    window_sum += values[right]
    window_sum -= values[right - window_size]
    if window_sum > best_sum:
        best_sum = window_sum
        best_start = right - window_size + 1

best_window = values[best_start:best_start + window_size]
print("Best window:", best_window)
print("Result:", best_sum)`,
    expectedResult: "Result: 16",
    structureTypes: ["array"],
    algorithm: "Fixed sliding window",
    phases: ["Sum the first window", "Slide by one index", "Keep the best observed window"],
    invariants: ["window_sum equals the sum of exactly window_size current values"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "WRITE", "UPDATE_BOUNDARY", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Shrink a variable sliding window",
    section: "Arrays and sequence techniques",
    objective: "Find the shortest positive-value subarray whose sum reaches a target.",
    code: `
values = [2, 3, 1, 2, 4, 3]
target = 7
left = 0
window_sum = 0
best_length = len(values) + 1

for right, value in enumerate(values):
    window_sum += value
    while window_sum >= target:
        best_length = min(best_length, right - left + 1)
        window_sum -= values[left]
        left += 1

answer = 0 if best_length > len(values) else best_length
print("Shortest length:", answer)
print("Result:", answer)`,
    expectedResult: "Result: 2",
    structureTypes: ["array"],
    algorithm: "Variable sliding window",
    phases: ["Expand the right boundary", "Shrink while the requirement holds", "Keep the shortest valid length"],
    invariants: ["After shrinking, the remaining positive-value window is below target"],
    edgeCases: ["This shrinking rule relies on nonnegative values"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "WRITE", "UPDATE_BOUNDARY", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Find a maximum subarray with Kadane's algorithm",
    section: "Arrays and sequence techniques",
    objective: "Choose whether the best subarray ending here starts fresh or extends the previous one.",
    code: `
values = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
current_sum = values[0]
best_sum = values[0]
current_start = 0
best_range = (0, 1)

for index in range(1, len(values)):
    if values[index] > current_sum + values[index]:
        current_sum = values[index]
        current_start = index
    else:
        current_sum += values[index]
    if current_sum > best_sum:
        best_sum = current_sum
        best_range = (current_start, index + 1)

print("Best subarray:", values[best_range[0]:best_range[1]])
print("Result:", best_sum)`,
    expectedResult: "Result: 6",
    structureTypes: ["array"],
    algorithm: "Kadane's maximum-subarray algorithm",
    phases: ["Choose start-fresh or extend", "Update the best ending-here sum", "Record the best overall range"],
    invariants: ["current_sum is the maximum sum of a subarray ending at the current index"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["VISIT_INDEX", "COMPARE", "CHOOSE", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Partition around a pivot",
    section: "Arrays and sequence techniques",
    objective: "Move values no greater than a pivot into a left partition.",
    code: `
values = [8, 3, 1, 7, 0, 10, 2]
pivot = values[-1]
boundary = 0

for index in range(len(values) - 1):
    if values[index] <= pivot:
        values[boundary], values[index] = values[index], values[boundary]
        boundary += 1

values[boundary], values[-1] = values[-1], values[boundary]
left_ok = all(value <= pivot for value in values[:boundary])
right_ok = all(value > pivot for value in values[boundary + 1:])

print("Partitioned:", values)
print("Pivot index:", boundary)
print("Result:", left_ok and right_ok)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Lomuto-style pivot partition",
    phases: ["Choose the final value as pivot", "Grow the small-value partition", "Place the pivot at its boundary"],
    invariants: ["Values before boundary are no greater than pivot"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "COMPARE", "SWAP", "PARTITION", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Select a kth value with quickselect",
    section: "Arrays and sequence techniques",
    objective: "Partition only the side that can contain the requested order statistic.",
    code: `
def partition(values, left, right):
    pivot = values[right]
    boundary = left
    for index in range(left, right):
        if values[index] <= pivot:
            values[boundary], values[index] = values[index], values[boundary]
            boundary += 1
    values[boundary], values[right] = values[right], values[boundary]
    return boundary

values = [7, 2, 1, 8, 6, 3, 5, 4]
k = 3
left = 0
right = len(values) - 1

while left <= right:
    pivot_index = partition(values, left, right)
    if pivot_index == k:
        break
    if pivot_index < k:
        left = pivot_index + 1
    else:
        right = pivot_index - 1

print("Partitioned state:", values)
print("Result:", values[k])`,
    expectedResult: "Result: 4",
    structureTypes: ["array"],
    algorithm: "Iterative quickselect",
    phases: ["Partition a candidate range", "Compare pivot index with k", "Keep only the relevant side"],
    invariants: ["The kth final position remains inside the active boundaries"],
    complexity: { time: "Average O(n), worst O(n^2)", space: "O(1)", note: "Pivot quality determines how quickly the candidate range shrinks." },
    eventTypes: ["COMPARE", "SWAP", "PARTITION", "UPDATE_BOUNDARY", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Find a majority candidate by voting",
    section: "Arrays and sequence techniques",
    objective: "Cancel opposing values and then verify the surviving candidate.",
    code: `
values = [2, 2, 1, 1, 1, 2, 2]
candidate = None
balance = 0

for value in values:
    if balance == 0:
        candidate = value
    balance += 1 if value == candidate else -1

occurrences = values.count(candidate)
is_majority = occurrences > len(values) // 2

print("Candidate:", candidate)
print("Occurrences:", occurrences)
print("Result:", is_majority)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Boyer-Moore majority vote",
    phases: ["Choose a candidate when balance is zero", "Cancel different values", "Verify the survivor"],
    invariants: ["balance represents unmatched votes for the current candidate"],
    edgeCases: ["A surviving candidate is not necessarily a majority until verified"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "COMPARE", "CHOOSE", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Merge overlapping intervals",
    section: "Arrays and sequence techniques",
    objective: "Sort intervals by start and extend the latest merged interval when ranges overlap.",
    code: `
intervals = [(5, 7), (1, 3), (2, 6), (8, 10), (9, 12)]
intervals.sort()
merged = []

for start, end in intervals:
    if not merged or start > merged[-1][1]:
        merged.append([start, end])
    else:
        merged[-1][1] = max(merged[-1][1], end)

print("Sorted input:", intervals)
print("Merged:", merged)
print("Result:", len(merged))`,
    expectedResult: "Result: 2",
    structureTypes: ["array"],
    algorithm: "Interval merging",
    phases: ["Sort by interval start", "Start a separate interval or overlap", "Extend the current merged end"],
    invariants: ["merged intervals are sorted and nonoverlapping"],
    complexity: { time: "O(n log n)", space: "O(n)", note: "Sorting dominates; the merge scan is linear." },
    eventTypes: ["COMPARE", "CHOOSE", "MERGE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Traverse a matrix by columns",
    section: "Arrays and sequence techniques",
    objective: "Change loop order to group values by column instead of row.",
    code: `
matrix = [
    [2, 4, 6],
    [1, 3, 5],
    [7, 8, 9],
]
column_totals = []

for column in range(len(matrix[0])):
    total = 0
    for row in range(len(matrix)):
        total += matrix[row][column]
    column_totals.append(total)

print("Column totals:", column_totals)
print("Result:", max(column_totals))`,
    expectedResult: "Result: 20",
    structureTypes: ["array"],
    algorithm: "Column-major matrix traversal",
    phases: ["Choose a column", "Visit every row in that column", "Record its total"],
    complexity: { time: "O(rows * columns)", space: "O(columns)", note: "Every matrix cell is read once, but traversal order differs from row-major order." },
    eventTypes: ["VISIT_INDEX", "READ", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Transpose a rectangular matrix",
    section: "Arrays and sequence techniques",
    objective: "Turn each original column into one row of a new matrix.",
    code: `
matrix = [
    [1, 2, 3],
    [4, 5, 6],
]
rows = len(matrix)
columns = len(matrix[0])
transposed = []

for column in range(columns):
    new_row = []
    for row in range(rows):
        new_row.append(matrix[row][column])
    transposed.append(new_row)

print("Original:", matrix)
print("Transposed:", transposed)
print("Result:", (len(transposed), len(transposed[0])))`,
    expectedResult: "Result: (3, 2)",
    structureTypes: ["array"],
    algorithm: "Matrix transpose",
    phases: ["Choose an original column", "Read down its rows", "Append it as a new row"],
    invariants: ["transposed[column][row] equals matrix[row][column]"],
    complexity: { time: "O(rows * columns)", space: "O(rows * columns)", note: "Every cell is copied to one reversed coordinate." },
    eventTypes: ["VISIT_INDEX", "READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Walk a matrix in spiral order",
    section: "Arrays and sequence techniques",
    objective: "Shrink four boundaries after traversing each outside edge.",
    code: `
matrix = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
]
top = 0
bottom = len(matrix) - 1
left = 0
right = len(matrix[0]) - 1
spiral = []

while top <= bottom and left <= right:
    for column in range(left, right + 1):
        spiral.append(matrix[top][column])
    top += 1
    for row in range(top, bottom + 1):
        spiral.append(matrix[row][right])
    right -= 1
    if top <= bottom:
        for column in range(right, left - 1, -1):
            spiral.append(matrix[bottom][column])
        bottom -= 1
    if left <= right:
        for row in range(bottom, top - 1, -1):
            spiral.append(matrix[row][left])
        left += 1

print("Spiral:", spiral)
print("Result:", spiral[-1])`,
    expectedResult: "Result: 7",
    structureTypes: ["array"],
    algorithm: "Spiral matrix traversal",
    phases: ["Traverse the top and right edges", "Traverse remaining bottom and left edges", "Shrink all used boundaries"],
    invariants: ["Unvisited cells remain within top, bottom, left, and right"],
    edgeCases: ["One remaining row", "One remaining column"],
    complexity: { time: "O(rows * columns)", space: "O(rows * columns) for output", note: "Each cell is appended exactly once." },
    eventTypes: ["VISIT_INDEX", "READ", "INSERT", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
];

/*
 * Searching lessons keep target position, boundary meaning, and insertion
 * points explicit. Sorted-input requirements are stated beside binary methods.
 */
const searchPrograms = [
  {
    title: "Find a target with linear search",
    section: "Searching",
    objective: "Inspect values from left to right and stop at the first match.",
    code: `
values = [14, 7, 21, 9, 32]
target = 9
found_index = -1
visits = 0

for index, value in enumerate(values):
    visits += 1
    if value == target:
        found_index = index
        break

print("Found index:", found_index)
print("Visits:", visits)
print("Result:", values[found_index])`,
    expectedResult: "Result: 9",
    structureTypes: ["array"],
    algorithm: "Linear search",
    phases: ["Visit the next index", "Compare with target", "Stop at the first match"],
    invariants: ["All indices before the current index do not contain the target"],
    edgeCases: ["Target first", "Target last", "Target missing"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["VISIT_INDEX", "READ", "COMPARE", "RETURN_RESULT"],
    comparisonGroup: "search-strategies",
  },
  {
    title: "Use a sentinel to simplify a scan",
    section: "Searching",
    objective: "Temporarily place the target at the end so the loop needs one stopping condition.",
    code: `
values = [8, 3, 6, 2, 9]
target = 6
last = values[-1]
values[-1] = target
index = 0

while values[index] != target:
    index += 1

values[-1] = last
found = index < len(values) - 1 or last == target
answer = index if found else -1

print("Restored:", values)
print("Found index:", answer)
print("Result:", found)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Sentinel linear search",
    phases: ["Save and replace the final value", "Scan until the guaranteed match", "Restore and decide whether it was real"],
    invariants: ["The original final value is restored before reporting"],
    edgeCases: ["Target originally at the final position", "Target missing"],
    complexity: COMPLEXITIES.linear,
    eventTypes: ["READ", "WRITE", "COMPARE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "search-strategies",
  },
  {
    title: "Search a sorted array by halving",
    section: "Searching",
    objective: "Use an inclusive binary-search interval and discard half after each comparison.",
    code: `
values = [2, 5, 8, 12, 16, 23, 38, 56]
target = 23
left = 0
right = len(values) - 1
found_index = -1
comparisons = 0

while left <= right:
    middle = (left + right) // 2
    comparisons += 1
    if values[middle] == target:
        found_index = middle
        break
    if values[middle] < target:
        left = middle + 1
    else:
        right = middle - 1

print("Found index:", found_index)
print("Comparisons:", comparisons)
print("Result:", values[found_index])`,
    expectedResult: "Result: 23",
    structureTypes: ["array"],
    algorithm: "Iterative binary search",
    phases: ["Inspect the middle value", "Choose the matching half", "Stop on match or empty interval"],
    invariants: ["If target exists, it remains inside the inclusive left-to-right interval"],
    edgeCases: ["Empty array", "Missing target", "Single value"],
    complexity: COMPLEXITIES.logarithmic,
    eventTypes: ["READ", "COMPARE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "search-strategies",
  },
  {
    title: "Trace recursive binary search",
    section: "Searching",
    objective: "Express each binary-search half as a smaller recursive subproblem.",
    code: `
def binary_search(values, target, left, right, calls):
    calls.append((left, right))
    if left > right:
        return -1
    middle = (left + right) // 2
    if values[middle] == target:
        return middle
    if values[middle] < target:
        return binary_search(values, target, middle + 1, right, calls)
    return binary_search(values, target, left, middle - 1, calls)

values = [3, 6, 9, 12, 15, 18, 21]
calls = []
index = binary_search(values, 15, 0, len(values) - 1, calls)

print("Call ranges:", calls)
print("Found index:", index)
print("Result:", values[index])`,
    expectedResult: "Result: 15",
    structureTypes: ["array"],
    algorithm: "Recursive binary search",
    phases: ["Record the active interval", "Handle empty or matching base case", "Recurse into one half"],
    invariants: ["Each recursive interval is strictly smaller"],
    complexity: { time: "O(log n)", space: "O(log n)", note: "The call stack stores one frame per halving." },
    eventTypes: ["ENTER_SUBPROBLEM", "READ", "COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "binary-search-forms",
  },
  {
    title: "Find the first occurrence",
    section: "Searching",
    objective: "Continue binary search to the left after finding a duplicate target.",
    code: `
values = [1, 2, 2, 2, 4, 6, 6]
target = 2
left = 0
right = len(values) - 1
answer = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] >= target:
        if values[middle] == target:
            answer = middle
        right = middle - 1
    else:
        left = middle + 1

print("First index:", answer)
print("Result:", answer)`,
    expectedResult: "Result: 1",
    structureTypes: ["array"],
    algorithm: "First-occurrence binary search",
    phases: ["Inspect the middle", "Record a match", "Keep searching left"],
    invariants: ["answer is the smallest matching index found so far"],
    edgeCases: ["Duplicate target", "Missing target"],
    complexity: COMPLEXITIES.logarithmic,
    eventTypes: ["READ", "COMPARE", "WRITE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "binary-search-boundaries",
  },
  {
    title: "Find the last occurrence",
    section: "Searching",
    objective: "Continue binary search to the right after finding a duplicate target.",
    code: `
values = [1, 2, 2, 2, 4, 6, 6]
target = 2
left = 0
right = len(values) - 1
answer = -1

while left <= right:
    middle = (left + right) // 2
    if values[middle] <= target:
        if values[middle] == target:
            answer = middle
        left = middle + 1
    else:
        right = middle - 1

print("Last index:", answer)
print("Result:", answer)`,
    expectedResult: "Result: 3",
    structureTypes: ["array"],
    algorithm: "Last-occurrence binary search",
    phases: ["Inspect the middle", "Record a match", "Keep searching right"],
    invariants: ["answer is the largest matching index found so far"],
    edgeCases: ["Duplicate target", "Missing target"],
    complexity: COMPLEXITIES.logarithmic,
    eventTypes: ["READ", "COMPARE", "WRITE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "binary-search-boundaries",
  },
  {
    title: "Find a lower-bound insertion point",
    section: "Searching",
    objective: "Find the first position whose value is not less than the target.",
    code: `
values = [2, 4, 4, 4, 7, 9]
target = 4
left = 0
right = len(values)

while left < right:
    middle = (left + right) // 2
    if values[middle] < target:
        left = middle + 1
    else:
        right = middle

lower_bound = left
print("Insertion point:", lower_bound)
print("Value there:", values[lower_bound])
print("Result:", lower_bound)`,
    expectedResult: "Result: 1",
    structureTypes: ["array"],
    algorithm: "Lower bound",
    phases: ["Use a half-open search interval", "Discard values less than target", "Return the first allowed position"],
    invariants: ["Indices before left are less than target; indices at or after right are not less"],
    complexity: COMPLEXITIES.logarithmic,
    eventTypes: ["READ", "COMPARE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "binary-search-boundaries",
  },
  {
    title: "Find an upper-bound insertion point",
    section: "Searching",
    objective: "Find the first position whose value is greater than the target.",
    code: `
values = [2, 4, 4, 4, 7, 9]
target = 4
left = 0
right = len(values)

while left < right:
    middle = (left + right) // 2
    if values[middle] <= target:
        left = middle + 1
    else:
        right = middle

upper_bound = left
duplicate_count = upper_bound - 1
print("Insertion point:", upper_bound)
print("First greater:", values[upper_bound])
print("Result:", duplicate_count)`,
    expectedResult: "Result: 3",
    structureTypes: ["array"],
    algorithm: "Upper bound",
    phases: ["Use a half-open search interval", "Discard values no greater than target", "Return the first greater position"],
    invariants: ["Indices before left are no greater than target; indices at or after right are greater"],
    complexity: COMPLEXITIES.logarithmic,
    eventTypes: ["READ", "COMPARE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "binary-search-boundaries",
  },
  {
    title: "Use bisect for search and insertion",
    section: "Searching",
    objective: "Apply the standard-library boundary functions while remembering that list insertion still shifts values.",
    code: `
from bisect import bisect_left, bisect_right, insort_right

values = [1, 3, 3, 5, 8]
target = 3
first = bisect_left(values, target)
after_last = bisect_right(values, target)
count = after_last - first

insort_right(values, 4)

print("Target range:", (first, after_last))
print("After insertion:", values)
print("Result:", count)`,
    expectedResult: "Result: 2",
    structureTypes: ["array"],
    algorithm: "Python bisect boundaries",
    phases: ["Find left and right boundaries", "Derive the duplicate count", "Insert while preserving order"],
    invariants: ["The list remains sorted after insort_right"],
    complexity: { time: "Search O(log n), list insertion O(n)", space: "O(1) extra", note: "Finding the position is logarithmic, but shifting list cells is linear." },
    eventTypes: ["FIND", "COMPARE", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "binary-search-forms",
  },
];

/*
 * Sorting lessons include implementations, data-shape cases, stability,
 * mutation behavior, operation counts, and Python's reviewed library behavior.
 */
const sortingPrograms = [
  {
    title: "Bubble larger values right",
    section: "Sorting and sorting properties",
    objective: "Swap inverted adjacent pairs until every pass fixes one suffix value.",
    code: `
values = [5, 1, 4, 2, 8]
comparisons = 0
swaps = 0

for end in range(len(values) - 1, 0, -1):
    for index in range(end):
        comparisons += 1
        if values[index] > values[index + 1]:
            values[index], values[index + 1] = values[index + 1], values[index]
            swaps += 1

print("Sorted:", values)
print("Counts:", comparisons, swaps)
print("Result:", values == sorted(values))`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Bubble sort",
    phases: ["Compare adjacent values", "Swap inverted neighbors", "Shrink the unsorted suffix"],
    invariants: ["Values after end are in their final sorted positions"],
    complexity: COMPLEXITIES.quadratic,
    eventTypes: ["COMPARE", "SWAP", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    comparisonGroup: "elementary-sorts",
  },
  {
    title: "Stop bubble sort after a clean pass",
    section: "Sorting and sorting properties",
    objective: "Use a swap flag to detect already-sorted input early.",
    code: `
values = [1, 2, 3, 5, 4, 6]
passes = 0
comparisons = 0

for end in range(len(values) - 1, 0, -1):
    swapped = False
    passes += 1
    for index in range(end):
        comparisons += 1
        if values[index] > values[index + 1]:
            values[index], values[index + 1] = values[index + 1], values[index]
            swapped = True
    if not swapped:
        break

print("Sorted:", values)
print("Passes and comparisons:", passes, comparisons)
print("Result:", passes)`,
    expectedResult: "Result: 2",
    structureTypes: ["array"],
    algorithm: "Optimized bubble sort",
    phases: ["Start a pass with no swap", "Repair adjacent inversions", "Stop after a clean pass"],
    invariants: ["A pass with no swaps proves the array is sorted"],
    complexity: { time: "Best O(n), worst O(n^2)", space: "O(1)", note: "The early stop makes input order observable." },
    eventTypes: ["COMPARE", "SWAP", "CHOOSE", "CHECK_INVARIANT", "RETURN_RESULT"],
    comparisonGroup: "bubble-sort-variants",
  },
  {
    title: "Select the smallest remaining value",
    section: "Sorting and sorting properties",
    objective: "Grow a sorted prefix by selecting one minimum from the suffix.",
    code: `
values = [64, 25, 12, 22, 11]
comparisons = 0
swaps = 0

for start in range(len(values) - 1):
    minimum = start
    for index in range(start + 1, len(values)):
        comparisons += 1
        if values[index] < values[minimum]:
            minimum = index
    if minimum != start:
        values[start], values[minimum] = values[minimum], values[start]
        swaps += 1

print("Sorted:", values)
print("Counts:", comparisons, swaps)
print("Result:", swaps)`,
    expectedResult: "Result: 3",
    structureTypes: ["array"],
    algorithm: "Selection sort",
    phases: ["Scan the unsorted suffix", "Remember its minimum", "Swap into the prefix"],
    invariants: ["Values before start are the smallest values in sorted order"],
    complexity: COMPLEXITIES.quadratic,
    eventTypes: ["READ", "COMPARE", "CHOOSE", "SWAP", "CHECK_INVARIANT", "RETURN_RESULT"],
    comparisonGroup: "elementary-sorts",
  },
  {
    title: "Insert into a sorted prefix",
    section: "Sorting and sorting properties",
    objective: "Shift larger prefix values and insert the selected value into its position.",
    code: `
values = [12, 11, 13, 5, 6]
comparisons = 0
shifts = 0

for index in range(1, len(values)):
    current = values[index]
    position = index
    while position > 0:
        comparisons += 1
        if values[position - 1] <= current:
            break
        values[position] = values[position - 1]
        shifts += 1
        position -= 1
    values[position] = current

print("Sorted:", values)
print("Counts:", comparisons, shifts)
print("Result:", shifts)`,
    expectedResult: "Result: 7",
    structureTypes: ["array"],
    algorithm: "Insertion sort",
    phases: ["Select the next value", "Shift larger prefix values", "Insert into the gap"],
    invariants: ["The prefix through the current index is sorted"],
    complexity: { time: "Best O(n), worst O(n^2)", space: "O(1)", note: "Nearly sorted data requires few shifts." },
    eventTypes: ["READ", "COMPARE", "WRITE", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
    comparisonGroup: "elementary-sorts",
  },
  {
    title: "Merge sorted halves recursively",
    section: "Sorting and sorting properties",
    objective: "Divide an array, sort both halves, and merge them into a new ordered result.",
    code: `
def merge(left, right):
    merged = []
    left_index = 0
    right_index = 0
    while left_index < len(left) and right_index < len(right):
        if left[left_index] <= right[right_index]:
            merged.append(left[left_index])
            left_index += 1
        else:
            merged.append(right[right_index])
            right_index += 1
    return merged + left[left_index:] + right[right_index:]

def merge_sort(values):
    if len(values) <= 1:
        return values
    middle = len(values) // 2
    left = merge_sort(values[:middle])
    right = merge_sort(values[middle:])
    return merge(left, right)

values = [38, 27, 43, 3, 9, 82, 10]
ordered = merge_sort(values)
print("Original:", values)
print("Sorted:", ordered)
print("Result:", ordered[0])`,
    expectedResult: "Result: 3",
    structureTypes: ["array"],
    algorithm: "Merge sort",
    phases: ["Divide into halves", "Sort both subproblems", "Merge sorted results"],
    invariants: ["merge receives sorted inputs and produces a sorted permutation"],
    complexity: COMPLEXITIES.linearithmic,
    eventTypes: ["ENTER_SUBPROBLEM", "COMPARE", "MERGE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "divide-and-conquer-sorts",
  },
  {
    title: "Partition and quicksort",
    section: "Sorting and sorting properties",
    objective: "Place one pivot and recursively sort the partitions on either side.",
    code: `
def partition(values, low, high):
    pivot = values[high]
    boundary = low
    for index in range(low, high):
        if values[index] <= pivot:
            values[boundary], values[index] = values[index], values[boundary]
            boundary += 1
    values[boundary], values[high] = values[high], values[boundary]
    return boundary

def quicksort(values, low, high):
    if low >= high:
        return
    pivot_index = partition(values, low, high)
    quicksort(values, low, pivot_index - 1)
    quicksort(values, pivot_index + 1, high)

values = [10, 7, 8, 9, 1, 5]
quicksort(values, 0, len(values) - 1)
print("Sorted:", values)
print("Result:", values[-1])`,
    expectedResult: "Result: 10",
    structureTypes: ["array"],
    algorithm: "Quicksort",
    phases: ["Partition around a pivot", "Sort the left partition", "Sort the right partition"],
    invariants: ["After partition, values left of the pivot are no greater and values right are greater"],
    complexity: { time: "Average O(n log n), worst O(n^2)", space: "Average O(log n) call stack", note: "Pivot balance controls recursion depth and total comparisons." },
    eventTypes: ["COMPARE", "SWAP", "PARTITION", "ENTER_SUBPROBLEM", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "divide-and-conquer-sorts",
  },
  {
    title: "Group duplicate pivots with three-way quicksort",
    section: "Sorting and sorting properties",
    objective: "Partition values into less-than, equal-to, and greater-than pivot regions.",
    code: `
def three_way_quicksort(values):
    if len(values) <= 1:
        return values
    pivot = values[len(values) // 2]
    lower = [value for value in values if value < pivot]
    equal = [value for value in values if value == pivot]
    higher = [value for value in values if value > pivot]
    return three_way_quicksort(lower) + equal + three_way_quicksort(higher)

values = [4, 2, 4, 1, 4, 3, 2, 4]
ordered = three_way_quicksort(values)

print("Original:", values)
print("Sorted:", ordered)
print("Result:", ordered.count(4))`,
    expectedResult: "Result: 4",
    structureTypes: ["array"],
    algorithm: "Three-way quicksort",
    phases: ["Choose a pivot", "Group lower, equal, and higher values", "Recurse only on unequal groups"],
    invariants: ["Every input value belongs to exactly one partition"],
    complexity: { time: "Average O(n log n), duplicate-heavy cases can approach O(n)", space: "O(n)", note: "This readable version creates new partition lists." },
    eventTypes: ["CHOOSE", "COMPARE", "PARTITION", "ENTER_SUBPROBLEM", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "quicksort-variants",
  },
  {
    title: "Build and drain a min heap",
    section: "Sorting and sorting properties",
    objective: "Use heap operations to repeatedly remove the smallest remaining value.",
    code: `
import heapq

values = [12, 11, 13, 5, 6, 7]
heap = values.copy()
heapq.heapify(heap)
ordered = []

while heap:
    ordered.append(heapq.heappop(heap))

print("Original:", values)
print("Sorted:", ordered)
print("Result:", ordered[-1])`,
    expectedResult: "Result: 13",
    structureTypes: ["heap", "array"],
    algorithm: "Heap sort with heapq",
    phases: ["Heapify the values", "Extract the minimum", "Append to sorted output"],
    invariants: ["The heap root is the smallest remaining value"],
    complexity: { time: "O(n log n)", space: "O(n) in this copied-output version", note: "heapify is O(n); n removals each cost O(log n)." },
    eventTypes: ["READ", "CHECK_INVARIANT", "REMOVE", "INSERT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "sorting-families",
  },
  {
    title: "Sort bounded integers by counting",
    section: "Sorting and sorting properties",
    objective: "Replace comparisons with frequency counts when values occupy a small known range.",
    code: `
values = [4, 2, 2, 8, 3, 3, 1]
maximum = max(values)
counts = [0] * (maximum + 1)

for value in values:
    counts[value] += 1

ordered = []
for value, count in enumerate(counts):
    ordered.extend([value] * count)

print("Counts:", counts)
print("Sorted:", ordered)
print("Result:", ordered[-1])`,
    expectedResult: "Result: 8",
    structureTypes: ["array"],
    algorithm: "Counting sort",
    phases: ["Count each key", "Visit keys in order", "Emit each key by its count"],
    invariants: ["sum(counts) equals the number of input values"],
    edgeCases: ["A huge key range can require excessive memory", "This direct version expects nonnegative integers"],
    complexity: { time: "O(n + k)", space: "O(n + k)", note: "k is the maximum key plus one." },
    eventTypes: ["READ", "WRITE", "VISIT_INDEX", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "non-comparison-sorts",
  },
  {
    title: "Sort integers digit by digit",
    section: "Sorting and sorting properties",
    objective: "Apply a stable counting pass from the least significant digit upward.",
    code: `
def counting_pass(values, place):
    buckets = [[] for _ in range(10)]
    for value in values:
        digit = (value // place) % 10
        buckets[digit].append(value)
    return [value for bucket in buckets for value in bucket]

values = [170, 45, 75, 90, 802, 24, 2, 66]
place = 1
history = []

while max(values) // place > 0:
    values = counting_pass(values, place)
    history.append(values.copy())
    place *= 10

print("Passes:", history)
print("Sorted:", values)
print("Result:", values[0])`,
    expectedResult: "Result: 2",
    structureTypes: ["array", "queue"],
    algorithm: "Least-significant-digit radix sort",
    phases: ["Group by the current digit", "Collect buckets stably", "Advance to the next digit"],
    invariants: ["After each pass, values are ordered by all processed digits"],
    edgeCases: ["This version handles nonnegative base-10 integers"],
    complexity: { time: "O(d(n + b))", space: "O(n + b)", note: "d is digit count and b is the base, here 10." },
    eventTypes: ["READ", "ENQUEUE", "MERGE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "non-comparison-sorts",
  },
  {
    title: "Keep the original with sorted",
    section: "Sorting and sorting properties",
    objective: "Use sorted to create a new list while leaving the source list unchanged.",
    code: `
original = [9, 1, 5, 3]
original_id = id(original)
ordered = sorted(original)

different_objects = ordered is not original
source_unchanged = original == [9, 1, 5, 3]

print("Original:", original)
print("Ordered:", ordered)
print("Original id stable:", id(original) == original_id)
print("Result:", different_objects and source_unchanged)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "Out-of-place Python sorting",
    phases: ["Read the original sequence", "Create an ordered list", "Compare identity and contents"],
    complexity: { time: "O(n log n)", space: "O(n)", note: "sorted accepts any iterable and returns a new list." },
    eventTypes: ["READ", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    comparisonGroup: "python-sort-interfaces",
  },
  {
    title: "Mutate a list with sort",
    section: "Sorting and sorting properties",
    objective: "Use list.sort when the existing list itself should become ordered.",
    code: `
values = [9, 1, 5, 3]
alias = values
object_before = id(values)
return_value = values.sort()

same_object = id(values) == object_before
alias_observes_sort = alias == [1, 3, 5, 9]

print("Sorted in place:", values)
print("sort returned:", return_value)
print("Result:", same_object and alias_observes_sort)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list"],
    algorithm: "In-place Python sorting",
    phases: ["Create a shared reference", "Sort the list in place", "Inspect identity and return value"],
    invariants: ["list.sort preserves list identity and returns None"],
    complexity: { time: "O(n log n) worst case", space: "Implementation-dependent auxiliary memory", note: "Python uses TimSort and mutates the existing list." },
    eventTypes: ["READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    comparisonGroup: "python-sort-interfaces",
  },
  {
    title: "Sort records with a key",
    section: "Sorting and sorting properties",
    objective: "Separate the record being retained from the derived value used for ordering.",
    code: `
students = [
    {"name": "Ari", "score": 88},
    {"name": "Bea", "score": 95},
    {"name": "Chen", "score": 88},
]

ranked = sorted(
    students,
    key=lambda student: (-student["score"], student["name"]),
)

print("Ranked names:", [student["name"] for student in ranked])
print("Top score:", ranked[0]["score"])
print("Result:", ranked[0]["name"])`,
    expectedResult: "Result: Bea",
    structureTypes: ["python-list", "hash-table"],
    algorithm: "Key-based sorting",
    phases: ["Derive a composite key", "Compare keys", "Retain complete records"],
    invariants: ["Every original record appears once in the result"],
    complexity: COMPLEXITIES.linearithmic,
    eventTypes: ["READ", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Observe stable sorting",
    section: "Sorting and sorting properties",
    objective: "Confirm that records with equal keys retain their original relative order.",
    code: `
records = [
    ("Ari", "blue"),
    ("Bea", "green"),
    ("Chen", "blue"),
    ("Dia", "green"),
]

ordered = sorted(records, key=lambda record: record[1])
blue_names = [
    name
    for name, color in ordered
    if color == "blue"
]

print("Ordered:", ordered)
print("Blue order:", blue_names)
print("Result:", blue_names == ["Ari", "Chen"])`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Stable key sort",
    phases: ["Attach equal sorting keys", "Sort by key", "Inspect original order within a tie"],
    invariants: ["Equal-key records retain their input order"],
    complexity: COMPLEXITIES.linearithmic,
    eventTypes: ["READ", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "sorting-properties",
  },
  {
    title: "Demonstrate an unstable selection swap",
    section: "Sorting and sorting properties",
    objective: "See how a distant selection-sort swap can reverse equal-key record order.",
    code: `
records = [("A", 2), ("B", 2), ("C", 1)]
values = records.copy()

for start in range(len(values) - 1):
    minimum = start
    for index in range(start + 1, len(values)):
        if values[index][1] < values[minimum][1]:
            minimum = index
    values[start], values[minimum] = values[minimum], values[start]

equal_key_order = [
    name
    for name, key in values
    if key == 2
]

print("Sorted records:", values)
print("Equal-key order:", equal_key_order)
print("Result:", equal_key_order)`,
    expectedResult: "Result: ['B', 'A']",
    structureTypes: ["array"],
    algorithm: "Unstable selection sort example",
    phases: ["Select a later minimum", "Swap across equal-key records", "Inspect tie order"],
    invariants: ["Keys are sorted even though equal-key input order may change"],
    complexity: COMPLEXITIES.quadratic,
    eventTypes: ["COMPARE", "CHOOSE", "SWAP", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "sorting-properties",
  },
  {
    title: "Measure already-sorted input",
    section: "Sorting and sorting properties",
    objective: "Compare fixed-pass and early-stop bubble sort on an already-sorted array.",
    code: `
def bubble_counts(values, early_stop):
    comparisons = 0
    passes = 0
    for end in range(len(values) - 1, 0, -1):
        swapped = False
        passes += 1
        for index in range(end):
            comparisons += 1
            if values[index] > values[index + 1]:
                values[index], values[index + 1] = values[index + 1], values[index]
                swapped = True
        if early_stop and not swapped:
            break
    return passes, comparisons

values = [1, 2, 3, 4, 5, 6]
fixed = bubble_counts(values.copy(), False)
adaptive = bubble_counts(values.copy(), True)

print("Fixed:", fixed)
print("Adaptive:", adaptive)
print("Result:", adaptive[1] < fixed[1])`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Sorted-input bubble comparison",
    phases: ["Run fixed passes", "Run early-stop passes", "Compare observed work"],
    complexity: { time: "Fixed O(n^2), adaptive best O(n)", space: "O(n) here because inputs are copied", note: "The algorithms receive equivalent sorted inputs." },
    eventTypes: ["COMPARE", "CHOOSE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "bubble-sort-variants",
  },
  {
    title: "Measure reverse-sorted input",
    section: "Sorting and sorting properties",
    objective: "Observe maximum adjacent inversions for bubble sort.",
    code: `
values = [6, 5, 4, 3, 2, 1]
swaps = 0
comparisons = 0

for end in range(len(values) - 1, 0, -1):
    for index in range(end):
        comparisons += 1
        if values[index] > values[index + 1]:
            values[index], values[index + 1] = values[index + 1], values[index]
            swaps += 1

expected_inversions = 6 * 5 // 2
print("Counts:", comparisons, swaps)
print("Sorted:", values)
print("Result:", swaps == expected_inversions)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Reverse-input bubble sort",
    phases: ["Compare each adjacent pair", "Repair every inversion", "Compare swaps with n choose 2"],
    invariants: ["Each adjacent swap removes one inversion"],
    complexity: COMPLEXITIES.quadratic,
    eventTypes: ["COMPARE", "SWAP", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "sorting-input-shapes",
  },
  {
    title: "Sort nearly ordered data by insertion",
    section: "Sorting and sorting properties",
    objective: "Observe that insertion sort performs few shifts when values are close to their positions.",
    code: `
values = [1, 2, 4, 3, 5, 7, 6, 8]
shifts = 0

for index in range(1, len(values)):
    current = values[index]
    position = index
    while position > 0 and values[position - 1] > current:
        values[position] = values[position - 1]
        shifts += 1
        position -= 1
    values[position] = current

print("Sorted:", values)
print("Shifts:", shifts)
print("Result:", shifts)`,
    expectedResult: "Result: 2",
    structureTypes: ["array"],
    algorithm: "Adaptive insertion sort",
    phases: ["Select the next value", "Shift nearby inversions", "Insert into the small gap"],
    invariants: ["The processed prefix remains sorted"],
    complexity: { time: "O(n + inversions)", space: "O(1)", note: "Nearly ordered input has few inversions and therefore few shifts." },
    eventTypes: ["READ", "COMPARE", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "sorting-input-shapes",
  },
  {
    title: "Compare sorts on duplicate-heavy data",
    section: "Sorting and sorting properties",
    objective: "Compare a two-way partition with a three-way grouping on many equal values.",
    code: `
values = [4, 2, 4, 4, 1, 4, 3, 4]
pivot = 4

two_way_left = []
two_way_right = []
for value in values:
    if value <= pivot:
        two_way_left.append(value)
    else:
        two_way_right.append(value)

lower = [value for value in values if value < pivot]
equal = [value for value in values if value == pivot]
higher = [value for value in values if value > pivot]

print("Two-way sizes:", len(two_way_left), len(two_way_right))
print("Three-way sizes:", len(lower), len(equal), len(higher))
print("Result:", len(equal))`,
    expectedResult: "Result: 5",
    structureTypes: ["array"],
    algorithm: "Two-way versus three-way partition",
    phases: ["Partition with equals on one side", "Separate equals explicitly", "Compare partition balance"],
    complexity: COMPLEXITIES.linearCopy,
    eventTypes: ["READ", "COMPARE", "PARTITION", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "quicksort-variants",
  },
  {
    title: "Compare elementary-sort counters",
    section: "Sorting and sorting properties",
    objective: "Run bubble, selection, and insertion sorts on equivalent input with comparable counters.",
    code: `
def bubble(values):
    comparisons = swaps = 0
    for end in range(len(values) - 1, 0, -1):
        for index in range(end):
            comparisons += 1
            if values[index] > values[index + 1]:
                values[index], values[index + 1] = values[index + 1], values[index]
                swaps += 1
    return comparisons, swaps

def selection(values):
    comparisons = swaps = 0
    for start in range(len(values) - 1):
        minimum = start
        for index in range(start + 1, len(values)):
            comparisons += 1
            if values[index] < values[minimum]:
                minimum = index
        if minimum != start:
            values[start], values[minimum] = values[minimum], values[start]
            swaps += 1
    return comparisons, swaps

def insertion(values):
    comparisons = shifts = 0
    for index in range(1, len(values)):
        current = values[index]
        position = index
        while position > 0:
            comparisons += 1
            if values[position - 1] <= current:
                break
            values[position] = values[position - 1]
            shifts += 1
            position -= 1
        values[position] = current
    return comparisons, shifts

source = [5, 1, 4, 2, 8]
results = {
    "bubble": bubble(source.copy()),
    "selection": selection(source.copy()),
    "insertion": insertion(source.copy()),
}

print("Counters:", results)
print("Result:", len(results))`,
    expectedResult: "Result: 3",
    structureTypes: ["array", "hash-table"],
    algorithm: "Elementary sorting comparison",
    phases: ["Copy equivalent inputs", "Run three explicit algorithms", "Compare named counters carefully"],
    invariants: ["Each algorithm receives the same starting values"],
    complexity: COMPLEXITIES.quadratic,
    eventTypes: ["COMPARE", "SWAP", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "elementary-sorts",
  },
  {
    title: "Check counting-sort suitability",
    section: "Sorting and sorting properties",
    objective: "Decide whether a key range is compact enough for direct counting storage.",
    code: `
datasets = {
    "compact": [3, 1, 2, 3, 0],
    "sparse": [2, 1000, 5000],
}
decisions = {}

for name, values in datasets.items():
    key_range = max(values) - min(values) + 1
    decisions[name] = {
        "n": len(values),
        "range": key_range,
        "suitable": key_range <= len(values) * 4,
    }

print("Decisions:", decisions)
print("Result:", decisions["compact"]["suitable"] and not decisions["sparse"]["suitable"])`,
    expectedResult: "Result: True",
    structureTypes: ["array", "hash-table"],
    algorithm: "Non-comparison sort suitability check",
    phases: ["Measure input length", "Measure key range", "Apply a reviewed teaching threshold"],
    edgeCases: ["Negative keys require an offset", "Huge sparse ranges waste counting storage"],
    complexity: { time: "O(n)", space: "O(1) before sorting", note: "The threshold is a teaching policy, not a universal library rule." },
    eventTypes: ["READ", "COMPARE", "CHOOSE", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "non-comparison-sorts",
  },
  {
    title: "Preserve records through stable digit passes",
    section: "Sorting and sorting properties",
    objective: "See why radix sort requires each digit pass to preserve earlier relative order.",
    code: `
records = [(21, "A"), (11, "B"), (22, "C"), (12, "D")]

ones_sorted = sorted(records, key=lambda record: record[0] % 10)
tens_sorted = sorted(ones_sorted, key=lambda record: record[0] // 10)

labels_for_tens_one = [
    label
    for number, label in tens_sorted
    if number // 10 == 1
]

print("After ones:", ones_sorted)
print("After tens:", tens_sorted)
print("Result:", labels_for_tens_one)`,
    expectedResult: "Result: ['B', 'D']",
    structureTypes: ["array"],
    algorithm: "Stable radix-pass demonstration",
    phases: ["Order by ones digit", "Stably order by tens digit", "Inspect order retained within a tens group"],
    invariants: ["A later stable pass preserves order established by earlier digits within equal current digits"],
    complexity: { time: "O(d * n log n) in this built-in-sort demonstration", space: "O(n)", note: "A true radix implementation typically uses linear stable counting passes." },
    eventTypes: ["READ", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "non-comparison-sorts",
  },
  {
    title: "Recognize natural ordered runs",
    section: "Sorting and sorting properties",
    objective: "Detect already-ordered stretches that an adaptive sorting strategy can exploit.",
    code: `
values = [1, 2, 5, 3, 4, 8, 7, 9]
runs = []
start = 0

for index in range(1, len(values)):
    if values[index] < values[index - 1]:
        runs.append(values[start:index])
        start = index
runs.append(values[start:])

ordered = sorted(values)
print("Natural runs:", runs)
print("Run count:", len(runs))
print("Result:", ordered)`,
    expectedResult: "Result: [1, 2, 3, 4, 5, 7, 8, 9]",
    structureTypes: ["array"],
    algorithm: "Natural-run detection",
    phases: ["Scan adjacent order", "Close a run at each drop", "Sort with an adaptive library algorithm"],
    invariants: ["Every detected run is nondecreasing"],
    complexity: { time: "Run detection O(n), Python sort worst O(n log n)", space: "O(n) for recorded runs and output", note: "This lesson illustrates one high-level TimSort idea without reproducing CPython internals." },
    eventTypes: ["READ", "COMPARE", "CHOOSE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
    comparisonGroup: "python-sort-interfaces",
  },
  {
    title: "Build a complete sorting decision guide",
    section: "Sorting and sorting properties",
    objective: "Choose a reviewed sorting family from input properties and product constraints.",
    code: `
scenarios = [
    {"name": "tiny nearly sorted", "stable": True, "bounded_keys": False, "memory_tight": True},
    {"name": "millions of small integers", "stable": True, "bounded_keys": True, "memory_tight": False},
    {"name": "general Python records", "stable": True, "bounded_keys": False, "memory_tight": False},
]

choices = {}
for scenario in scenarios:
    if scenario["bounded_keys"] and not scenario["memory_tight"]:
        choice = "counting-family"
    elif scenario["name"] == "tiny nearly sorted":
        choice = "insertion-sort"
    else:
        choice = "python-timsort"
    choices[scenario["name"]] = choice

print("Choices:", choices)
print("Result:", choices["general Python records"])`,
    expectedResult: "Result: python-timsort",
    structureTypes: ["array", "hash-table"],
    algorithm: "Sorting strategy selection",
    phases: ["Read scenario constraints", "Apply explicit decision rules", "Record a justified family"],
    edgeCases: ["Stability requirement", "Bounded key range", "Memory limit", "Input order"],
    complexity: { time: "Decision O(s)", space: "O(s)", note: "This guide chooses a family; it does not execute the selected sort." },
    eventTypes: ["READ", "COMPARE", "CHOOSE", "WRITE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "sorting-families",
  },
];

/** All Chunk 1 definitions are joined in their recommended teaching order. */
const definitions = [
  ...foundationPrograms,
  ...adtPrograms,
  ...containerPrograms,
  ...arrayPrograms,
  ...searchPrograms,
  ...sortingPrograms,
];

/** Frozen public catalog consumed by the DSA workspace and validators. */
export const DSA_CHUNK_ONE_PROGRAMS = Object.freeze(
  definitions.map((definition, index) => makeProgram(definition, index)),
);
