/**
 * Code Explorer Data Structures and Algorithms curriculum, Chunk 6.
 *
 * This module adds the final 54 direct-teaching Tier A programs. Dynamic
 * programming lessons make state, transitions, base cases, and reconstruction
 * visible. Bit lessons explain finite masks and Python's integer behavior.
 * Mathematical lessons turn number-theory ideas into small verified methods.
 *
 * Every record is static reviewed curriculum. No learner source, trace,
 * preference, search, or progress information leaves the browser.
 */

import { DSA_PROGRAM_REQUIRED_FIELDS } from "./dsa-contracts.js";

/** The three Chunk 6 sections and their approved Tier A counts. */
export const DSA_CHUNK_SIX_SECTIONS = Object.freeze([
  ["Dynamic programming", 24],
  ["Bit manipulation", 16],
  ["Elementary mathematical algorithms", 14],
]);

/** Removes only outer template whitespace while preserving Python indentation. */
function cleanCode(source) {
  return source.replace(/^\n/, "").replace(/\s+$/, "");
}

/**
 * Builds one complete immutable curriculum record.
 *
 * @param {object} definition Reviewed metadata and executable Python source.
 * @param {number} index Zero-based index inside Chunk 6.
 * @returns {Readonly<object>} Complete record numbered after Chunk 5.
 */
function makeProgram(definition, index) {
  const record = {
    id: `dsa-${String(index + 398).padStart(3, "0")}`,
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
    bestViews: definition.bestViews || ["Structure Canvas", "Step Table", "Invariant Checker"],
    eventTypes: definition.eventTypes,
    intentionalError: null,
  };

  // Failing near the definition makes a missing teaching field easier to fix.
  for (const field of DSA_PROGRAM_REQUIRED_FIELDS) {
    if (!(field in record)) {
      throw new Error(`Chunk 6 program ${record.id} is missing ${field}.`);
    }
  }
  return Object.freeze(record);
}

/**
 * Dynamic programming progresses from one-dimensional state to tables,
 * reconstruction, space optimization, and strategy selection.
 */
const dynamicProgrammingPrograms = [
  {
    title: "Build Fibonacci values from solved prefixes",
    objective: "Store each solved Fibonacci prefix so later states reuse two earlier answers.",
    difficulty: "Beginner",
    code: `
target = 8
table = [0] * (target + 1)
table[1] = 1
transitions = []

for index in range(2, target + 1):
    table[index] = table[index - 1] + table[index - 2]
    transitions.append((index, table[index - 1], table[index - 2], table[index]))

print("Table:", table)
print("Transitions:", transitions)
print("Result:", table[target] == 21)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Bottom-up Fibonacci tabulation",
    phases: ["Initialize base states zero and one", "Fill each state from two solved predecessors", "Read the target state"],
    invariants: ["Before index i is filled, every state below i is final"],
    edgeCases: ["Targets zero and one use initialized base states"],
    comparisonGroup: "fibonacci-dp-forms",
    complexity: { time: "O(n)", space: "O(n)", note: "The table stores one solved state for every index through n." },
    eventTypes: ["READ", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Compress Fibonacci state to two values",
    objective: "Replace a complete Fibonacci table with only the two states required by the next transition.",
    difficulty: "Beginner",
    code: `
target = 8
previous = 0
current = 1
history = [(0, previous), (1, current)]

for index in range(2, target + 1):
    previous, current = current, previous + current
    history.append((index, current))

print("History:", history)
print("Stored state:", (previous, current))
print("Result:", current == 21 and len(history) == target + 1)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "python-list"],
    algorithm: "Space-optimized Fibonacci",
    phases: ["Keep the two base values", "Roll the pair forward", "Return the current target value"],
    invariants: ["After index i, current equals Fibonacci i and previous equals Fibonacci i minus one"],
    edgeCases: ["Target zero needs a direct zero result in a reusable function"],
    comparisonGroup: "fibonacci-dp-forms",
    complexity: { time: "O(n)", space: "O(1)", note: "The algorithm retains two numeric states; the history list exists only for this lesson." },
    bestViews: ["Before and After", "Watches", "Compare Algorithms"],
    eventTypes: ["READ", "WRITE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Count ways to climb a staircase",
    objective: "Model each stair as the sum of ways arriving from one or two steps below.",
    difficulty: "Beginner",
    code: `
stairs = 6
ways = [0] * (stairs + 1)
ways[0] = 1
choices = []

for stair in range(1, stairs + 1):
    from_one = ways[stair - 1]
    from_two = ways[stair - 2] if stair >= 2 else 0
    ways[stair] = from_one + from_two
    choices.append((stair, from_one, from_two, ways[stair]))

print("Ways by stair:", ways)
print("Choices:", choices)
print("Result:", ways[stairs] == 13)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Staircase counting dynamic program",
    phases: ["Seed one way to stand before the stairs", "Combine one-step and two-step arrivals", "Read the final stair"],
    invariants: ["Every stored count includes all valid sequences ending at that stair"],
    edgeCases: ["Zero stairs has one empty sequence"],
    comparisonGroup: "staircase-dp",
    complexity: { time: "O(n)", space: "O(n)", note: "Each stair reads at most two earlier states." },
    eventTypes: ["READ", "WRITE", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Minimize the cost of climbing stairs",
    objective: "Track the cheapest cost of reaching each position before stepping beyond the staircase.",
    code: `
cost = [10, 15, 20, 5, 8]
minimum = [0] * (len(cost) + 1)
decisions = []

for position in range(2, len(cost) + 1):
    one_step = minimum[position - 1] + cost[position - 1]
    two_steps = minimum[position - 2] + cost[position - 2]
    minimum[position] = min(one_step, two_steps)
    decisions.append((position, one_step, two_steps, minimum[position]))

print("Minimum table:", minimum)
print("Decisions:", decisions)
print("Result:", minimum[-1] == 20)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Minimum-cost staircase dynamic program",
    phases: ["Initialize the two free starting positions", "Compare the two possible previous steps", "Store the cheaper arrival"],
    invariants: ["minimum[i] is the cheapest known cost to reach position i"],
    edgeCases: ["A two-step staircase can be left from either starting position"],
    comparisonGroup: "staircase-dp",
    complexity: { time: "O(n)", space: "O(n)", note: "Each position compares two constant-time candidates." },
    bestViews: ["Decisions", "Step Table", "Invariant Checker"],
    eventTypes: ["COMPARE", "READ", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Choose nonadjacent houses for maximum value",
    objective: "Compare skipping and taking each house while preserving the nonadjacent constraint.",
    code: `
houses = [2, 7, 9, 3, 1]
best = [0] * (len(houses) + 1)
best[1] = houses[0]
decisions = []

for count in range(2, len(houses) + 1):
    skip = best[count - 1]
    take = best[count - 2] + houses[count - 1]
    best[count] = max(skip, take)
    decisions.append((count - 1, skip, take, best[count]))

print("Best prefixes:", best)
print("Decisions:", decisions)
print("Result:", best[-1] == 12)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "House robber dynamic program",
    phases: ["Seed the empty and first-house prefixes", "Compare skipping with taking plus the safe prefix", "Keep the best legal prefix value"],
    invariants: ["best[i] is optimal for the first i houses without adjacent selections"],
    edgeCases: ["An empty street returns zero", "One house returns its own value"],
    comparisonGroup: "nonadjacent-selection-dp",
    complexity: { time: "O(n)", space: "O(n)", note: "Every house creates one take-or-skip decision." },
    bestViews: ["Decisions", "Before and After", "Complexity Lab"],
    eventTypes: ["COMPARE", "CHOOSE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Find the fewest coins with unreachable states",
    objective: "Use positive infinity to distinguish amounts that have not yet received a valid coin combination.",
    code: `
coins = [1, 3, 4]
target = 6
fewest = [0] + [float("inf")] * target
updates = []

for amount in range(1, target + 1):
    for coin in coins:
        if coin <= amount and fewest[amount - coin] != float("inf"):
            candidate = fewest[amount - coin] + 1
            if candidate < fewest[amount]:
                fewest[amount] = candidate
                updates.append((amount, coin, candidate))

print("Fewest table:", fewest)
print("Updates:", updates)
print("Result:", fewest[target] == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Minimum coin change",
    phases: ["Mark unsolved positive amounts as unreachable", "Try extending each reachable remainder", "Keep the smallest coin count"],
    invariants: ["After amount a is complete, fewest[a] is minimal for the available coins"],
    edgeCases: ["An unreachable target remains positive infinity", "Target zero needs no coins"],
    comparisonGroup: "coin-change-dp",
    complexity: { time: "O(target * c)", space: "O(target)", note: "Each amount considers each of c coin denominations." },
    bestViews: ["Structure Canvas", "Mutation Explorer", "Edge Case Lab"],
    eventTypes: ["COMPARE", "READ", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Count coin combinations without reordering",
    objective: "Process one denomination at a time so equivalent coin orders count as one combination.",
    code: `
coins = [1, 2, 5]
target = 5
ways = [0] * (target + 1)
ways[0] = 1
snapshots = []

for coin in coins:
    for amount in range(coin, target + 1):
        ways[amount] += ways[amount - coin]
    snapshots.append((coin, ways.copy()))

print("Snapshots:", snapshots)
print("Ways:", ways)
print("Result:", ways[target] == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Coin-change combination counting",
    phases: ["Seed the empty combination", "Extend amounts with one denomination", "Retain order-independent counts"],
    invariants: ["After processing coin c, each count uses only processed denominations"],
    edgeCases: ["Target zero has one empty combination"],
    comparisonGroup: "coin-change-dp",
    complexity: { time: "O(target * c)", space: "O(target)", note: "Loop order prevents permutations from being counted separately." },
    eventTypes: ["READ", "WRITE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Pack each item at most once",
    objective: "Fill a two-dimensional table that distinguishes taking an item from leaving it behind.",
    code: `
weights = [2, 3, 4, 5]
values = [3, 4, 5, 8]
capacity = 8
table = [[0] * (capacity + 1) for _ in range(len(weights) + 1)]

for item in range(1, len(weights) + 1):
    weight = weights[item - 1]
    value = values[item - 1]
    for room in range(capacity + 1):
        table[item][room] = table[item - 1][room]
        if weight <= room:
            take = value + table[item - 1][room - weight]
            table[item][room] = max(table[item][room], take)

print("Final row:", table[-1])
print("Best value:", table[-1][capacity])
print("Result:", table[-1][capacity] == 12)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Zero-one knapsack tabulation",
    phases: ["Create item-prefix and capacity states", "Compare skip with one legal take", "Read the full-prefix capacity state"],
    invariants: ["Row i uses only the first i items and never reuses item i"],
    edgeCases: ["Zero capacity and zero items produce value zero"],
    comparisonGroup: "knapsack-dp",
    complexity: { time: "O(n * capacity)", space: "O(n * capacity)", note: "Every item-capacity pair is solved once." },
    bestViews: ["Structure Canvas", "Decisions", "Step Table"],
    eventTypes: ["READ", "COMPARE", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Reuse items in an unbounded knapsack",
    objective: "Allow the current item to contribute repeatedly by reading the current dynamic-programming row.",
    code: `
weights = [3, 4, 6]
values = [5, 6, 10]
capacity = 12
best = [0] + [float("-inf")] * capacity
choices = []

for room in range(1, capacity + 1):
    for weight, value in zip(weights, values):
        if weight <= room and best[room - weight] != float("-inf"):
            candidate = best[room - weight] + value
            if candidate > best[room]:
                best[room] = candidate
                choices.append((room, weight, candidate))

print("Best exact capacities:", best)
print("Choices:", choices)
print("Result:", best[capacity] == 20)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Unbounded knapsack for exact capacity",
    phases: ["Mark positive exact capacities unreachable", "Extend a reachable smaller capacity with any item", "Keep the largest exact-capacity value"],
    invariants: ["A finite state represents a combination whose total weight equals its index"],
    edgeCases: ["An exact capacity with no combination remains negative infinity"],
    comparisonGroup: "knapsack-dp",
    complexity: { time: "O(n * capacity)", space: "O(capacity)", note: "Every capacity considers each item, and an item may be reused." },
    bestViews: ["Structure Canvas", "Edge Case Lab", "Invariant Checker"],
    eventTypes: ["COMPARE", "READ", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Decide subset sum with reachable totals",
    objective: "Grow the set of totals reachable after each value without reusing that value.",
    code: `
values = [3, 34, 4, 12, 5, 2]
target = 9
reachable = [False] * (target + 1)
reachable[0] = True
snapshots = []

for value in values:
    for total in range(target, value - 1, -1):
        if reachable[total - value]:
            reachable[total] = True
    snapshots.append((value, reachable.copy()))

print("Snapshots:", snapshots)
print("Reachable:", reachable)
print("Result:", reachable[target])`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "bit-set"],
    algorithm: "Subset-sum dynamic program",
    phases: ["Seed reachable total zero", "Scan totals backward for each value", "Read target reachability"],
    invariants: ["Backward scanning prevents one input value from being reused in its own iteration"],
    edgeCases: ["Target zero is reachable through the empty subset"],
    comparisonGroup: "subset-family-dp",
    complexity: { time: "O(n * target)", space: "O(target)", note: "Each value scans the bounded target range once." },
    eventTypes: ["READ", "WRITE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Split values into equal-sum groups",
    objective: "Reduce equal partition to subset sum after checking the total-sum parity.",
    code: `
values = [1, 5, 11, 5]
total = sum(values)
possible = total % 2 == 0
target = total // 2
reachable = {0}
history = []

if possible:
    for value in values:
        additions = {subtotal + value for subtotal in reachable if subtotal + value <= target}
        reachable |= additions
        history.append((value, sorted(reachable)))

partitioned = possible and target in reachable
print("Target:", target)
print("History:", history)
print("Result:", partitioned)`,
    expectedResult: "Result: True",
    structureTypes: ["set", "dynamic-programming-table"],
    algorithm: "Equal-partition dynamic program",
    phases: ["Reject an odd total", "Grow bounded reachable subset sums", "Check half the total"],
    invariants: ["reachable contains totals formed from processed values only"],
    edgeCases: ["An odd total cannot split equally", "An empty list has two empty equal groups by this sum definition"],
    comparisonGroup: "subset-family-dp",
    complexity: { time: "O(n * target)", space: "O(target)", note: "The bounded reachable set contains at most target plus one totals." },
    bestViews: ["Structure Canvas", "Before and After", "Edge Case Lab"],
    eventTypes: ["READ", "INSERT", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Measure a longest common subsequence",
    objective: "Fill a prefix table that either extends a match or keeps the better skipped prefix.",
    code: `
left = "ABCBDAB"
right = "BDCABA"
table = [[0] * (len(right) + 1) for _ in range(len(left) + 1)]

for row in range(1, len(left) + 1):
    for column in range(1, len(right) + 1):
        if left[row - 1] == right[column - 1]:
            table[row][column] = table[row - 1][column - 1] + 1
        else:
            table[row][column] = max(table[row - 1][column], table[row][column - 1])

print("Last row:", table[-1])
print("Length:", table[-1][-1])
print("Result:", table[-1][-1] == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Longest common subsequence length",
    phases: ["Create empty-prefix base states", "Extend matching prefixes or skip one side", "Read the full-prefix length"],
    invariants: ["table[i][j] is the LCS length for the first i and j characters"],
    edgeCases: ["An empty string has common-subsequence length zero"],
    comparisonGroup: "sequence-alignment-dp",
    complexity: { time: "O(m * n)", space: "O(m * n)", note: "Every pair of prefix lengths is solved once." },
    eventTypes: ["COMPARE", "READ", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Reconstruct one longest common subsequence",
    objective: "Walk backward through a completed prefix table to recover one valid subsequence.",
    difficulty: "Guided Challenge",
    code: `
left = "ABCBDAB"
right = "BDCABA"
table = [[0] * (len(right) + 1) for _ in range(len(left) + 1)]

for row in range(1, len(left) + 1):
    for column in range(1, len(right) + 1):
        if left[row - 1] == right[column - 1]:
            table[row][column] = table[row - 1][column - 1] + 1
        else:
            table[row][column] = max(table[row - 1][column], table[row][column - 1])

row, column = len(left), len(right)
reversed_answer = []
path = []
while row > 0 and column > 0:
    path.append((row, column))
    if left[row - 1] == right[column - 1]:
        reversed_answer.append(left[row - 1])
        row -= 1
        column -= 1
    elif table[row - 1][column] >= table[row][column - 1]:
        row -= 1
    else:
        column -= 1

answer = "".join(reversed(reversed_answer))
print("Backtrack path:", path)
print("Subsequence:", answer)
print("Result:", len(answer) == 4 and answer == "BCBA")`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Longest common subsequence reconstruction",
    phases: ["Fill the prefix-length table", "Walk toward an equal or better predecessor", "Reverse matched characters"],
    invariants: ["Every chosen character is equal in both strings and precedes later chosen characters"],
    edgeCases: ["Ties can produce a different but equally long valid subsequence"],
    comparisonGroup: "sequence-alignment-dp",
    complexity: { time: "O(m * n)", space: "O(m * n)", note: "Table construction dominates the linear backtracking path." },
    bestViews: ["Algorithm Path", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["COMPARE", "READ", "WRITE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Count edits between two words",
    objective: "Compare insertion, deletion, and replacement costs for every pair of prefixes.",
    code: `
source = "kitten"
target = "sitting"
rows = len(source) + 1
columns = len(target) + 1
distance = [[0] * columns for _ in range(rows)]

for row in range(rows):
    distance[row][0] = row
for column in range(columns):
    distance[0][column] = column

for row in range(1, rows):
    for column in range(1, columns):
        replacement = distance[row - 1][column - 1] + (source[row - 1] != target[column - 1])
        deletion = distance[row - 1][column] + 1
        insertion = distance[row][column - 1] + 1
        distance[row][column] = min(replacement, deletion, insertion)

print("Last row:", distance[-1])
print("Distance:", distance[-1][-1])
print("Result:", distance[-1][-1] == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Levenshtein edit distance",
    phases: ["Initialize empty-prefix edit costs", "Compare three predecessor operations", "Read the full-word distance"],
    invariants: ["distance[i][j] is minimal for the first i source and j target characters"],
    edgeCases: ["Transforming an empty word requires one insertion per target character"],
    comparisonGroup: "edit-distance-dp",
    complexity: { time: "O(m * n)", space: "O(m * n)", note: "Every prefix pair considers three constant-time transitions." },
    bestViews: ["Structure Canvas", "Decisions", "Complexity Lab"],
    eventTypes: ["COMPARE", "READ", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Measure a longest increasing subsequence",
    objective: "Let each position extend the best increasing subsequence ending at an earlier smaller value.",
    code: `
values = [10, 9, 2, 5, 3, 7, 101, 18]
lengths = [1] * len(values)
parents = [-1] * len(values)

for current in range(len(values)):
    for previous in range(current):
        if values[previous] < values[current] and lengths[previous] + 1 > lengths[current]:
            lengths[current] = lengths[previous] + 1
            parents[current] = previous

end = max(range(len(values)), key=lambda index: lengths[index])
sequence = []
while end != -1:
    sequence.append(values[end])
    end = parents[end]
sequence.reverse()

print("Lengths:", lengths)
print("Sequence:", sequence)
print("Result:", len(sequence) == 4 and sequence == [2, 5, 7, 101])`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Quadratic longest increasing subsequence",
    phases: ["Seed a length-one subsequence at every position", "Extend from smaller earlier values", "Follow parent links from a best endpoint"],
    invariants: ["lengths[i] is best among increasing subsequences ending exactly at i"],
    edgeCases: ["Equal values do not extend a strictly increasing subsequence"],
    comparisonGroup: "increasing-subsequence-dp",
    complexity: { time: "O(n^2)", space: "O(n)", note: "Each position compares with every earlier position." },
    bestViews: ["References", "Algorithm Path", "Invariant Checker"],
    eventTypes: ["COMPARE", "READ", "WRITE", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Count paths through an empty grid",
    objective: "Accumulate arrivals from the cell above and the cell to the left.",
    difficulty: "Beginner",
    code: `
rows = 3
columns = 4
paths = [[0] * columns for _ in range(rows)]

for row in range(rows):
    for column in range(columns):
        if row == 0 and column == 0:
            paths[row][column] = 1
        else:
            from_above = paths[row - 1][column] if row > 0 else 0
            from_left = paths[row][column - 1] if column > 0 else 0
            paths[row][column] = from_above + from_left

print("Path table:", paths)
print("Result:", paths[-1][-1] == 10)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Grid path counting",
    phases: ["Seed one path at the origin", "Combine arrivals from top and left", "Read the destination"],
    invariants: ["Each cell count includes every right-and-down path ending at that cell"],
    edgeCases: ["A one-cell grid has one path"],
    comparisonGroup: "grid-dp",
    complexity: { time: "O(rows * columns)", space: "O(rows * columns)", note: "Each grid cell is solved once." },
    eventTypes: ["READ", "WRITE", "MERGE", "RETURN_RESULT"],
  },
  {
    title: "Minimize a weighted grid path",
    objective: "Store the cheapest top-or-left arrival while including each visited cell cost.",
    code: `
grid = [
    [1, 3, 1],
    [1, 5, 1],
    [4, 2, 1],
]
cost = [[0] * len(grid[0]) for _ in grid]

for row in range(len(grid)):
    for column in range(len(grid[0])):
        if row == 0 and column == 0:
            cost[row][column] = grid[row][column]
            continue
        from_above = cost[row - 1][column] if row > 0 else float("inf")
        from_left = cost[row][column - 1] if column > 0 else float("inf")
        cost[row][column] = grid[row][column] + min(from_above, from_left)

print("Cost table:", cost)
print("Minimum:", cost[-1][-1])
print("Result:", cost[-1][-1] == 7)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Minimum grid path sum",
    phases: ["Seed the origin cost", "Choose the cheaper valid predecessor", "Add the current cell cost"],
    invariants: ["cost[r][c] is the minimum right-and-down path cost to that cell"],
    edgeCases: ["An unavailable top or left predecessor is represented by positive infinity"],
    comparisonGroup: "grid-dp",
    complexity: { time: "O(rows * columns)", space: "O(rows * columns)", note: "Each cell compares at most two predecessor costs." },
    bestViews: ["Structure Canvas", "Decisions", "Edge Case Lab"],
    eventTypes: ["COMPARE", "READ", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Collapse a triangle from its base",
    objective: "Replace each triangle position with its value plus the cheaper of its two children.",
    code: `
triangle = [
    [2],
    [3, 4],
    [6, 5, 7],
    [4, 1, 8, 3],
]
best = triangle[-1].copy()
history = [best.copy()]

for row in range(len(triangle) - 2, -1, -1):
    for column, value in enumerate(triangle[row]):
        best[column] = value + min(best[column], best[column + 1])
    history.append(best[:row + 1])

print("Collapsed rows:", history)
print("Minimum:", best[0])
print("Result:", best[0] == 11)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Bottom-up triangle path sum",
    phases: ["Copy the base row", "Combine each parent with its cheaper child", "Finish at the apex"],
    invariants: ["After processing row r, best[c] is the minimum path from triangle[r][c] to the base"],
    edgeCases: ["A one-value triangle returns that value"],
    comparisonGroup: "grid-dp",
    complexity: { time: "O(n^2)", space: "O(n)", note: "Every triangle entry is read once and one base-width array is reused." },
    bestViews: ["Mutation Explorer", "Before and After", "Structure Canvas"],
    eventTypes: ["COMPARE", "READ", "WRITE", "MERGE", "RETURN_RESULT"],
  },
  {
    title: "Segment a sentence with dictionary words",
    objective: "Mark each prefix reachable when one dictionary word follows an already reachable boundary.",
    code: `
text = "applepenapple"
dictionary = {"apple", "pen"}
reachable = [False] * (len(text) + 1)
reachable[0] = True
matches = []

for end in range(1, len(text) + 1):
    for start in range(end):
        word = text[start:end]
        if reachable[start] and word in dictionary:
            reachable[end] = True
            matches.append((start, end, word))
            break

print("Matches:", matches)
print("Reachable prefixes:", reachable)
print("Result:", reachable[-1])`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "set"],
    algorithm: "Word-break dynamic program",
    phases: ["Seed the empty prefix", "Try an earlier reachable split", "Mark a prefix after a dictionary match"],
    invariants: ["reachable[i] is true only when text through i can be fully segmented"],
    edgeCases: ["The empty string is segmentable", "Unknown suffixes remain unreachable"],
    comparisonGroup: "string-segmentation-dp",
    complexity: { time: "O(n^3) with Python slicing", space: "O(n)", note: "There are O(n^2) splits and each slice can copy O(n) characters." },
    bestViews: ["Watches", "Decisions", "Algorithm Path"],
    eventTypes: ["READ", "COMPARE", "CHOOSE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Maximize value from cutting a rod",
    objective: "Compare every legal first cut while reusing solved values for the remaining length.",
    code: `
prices = [0, 1, 5, 8, 9, 10, 17, 17, 20]
length = 8
best = [0] * (length + 1)
first_cut = [0] * (length + 1)

for size in range(1, length + 1):
    for cut in range(1, size + 1):
        candidate = prices[cut] + best[size - cut]
        if candidate > best[size]:
            best[size] = candidate
            first_cut[size] = cut

pieces = []
remaining = length
while remaining > 0:
    pieces.append(first_cut[remaining])
    remaining -= first_cut[remaining]

print("Best values:", best)
print("Pieces:", pieces)
print("Result:", best[length] == 22 and sum(pieces) == length)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Rod-cutting dynamic program",
    phases: ["Solve lengths from short to long", "Try every first cut", "Follow stored cuts to reconstruct a plan"],
    invariants: ["best[size] is optimal after every legal first cut has been considered"],
    edgeCases: ["Length zero has value zero and no pieces"],
    comparisonGroup: "unbounded-partition-dp",
    complexity: { time: "O(n^2)", space: "O(n)", note: "Length size considers size possible first cuts." },
    bestViews: ["References", "Decisions", "Algorithm Path"],
    eventTypes: ["COMPARE", "READ", "WRITE", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Choose a matrix multiplication order",
    objective: "Minimize scalar multiplications by trying every split of each matrix interval.",
    difficulty: "Guided Challenge",
    code: `
dimensions = [10, 30, 5, 60]
matrix_count = len(dimensions) - 1
cost = [[0] * matrix_count for _ in range(matrix_count)]
split = [[None] * matrix_count for _ in range(matrix_count)]

for chain_length in range(2, matrix_count + 1):
    for left in range(matrix_count - chain_length + 1):
        right = left + chain_length - 1
        cost[left][right] = float("inf")
        for middle in range(left, right):
            candidate = (
                cost[left][middle]
                + cost[middle + 1][right]
                + dimensions[left] * dimensions[middle + 1] * dimensions[right + 1]
            )
            if candidate < cost[left][right]:
                cost[left][right] = candidate
                split[left][right] = middle

print("Cost table:", cost)
print("Split table:", split)
print("Result:", cost[0][-1] == 4500 and split[0][-1] == 1)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Matrix-chain multiplication order",
    phases: ["Increase solved interval length", "Try every split point", "Keep the cheapest parenthesization cost"],
    invariants: ["Every shorter interval needed by a candidate has already been solved"],
    edgeCases: ["One matrix requires zero multiplications"],
    comparisonGroup: "interval-dp",
    complexity: { time: "O(n^3)", space: "O(n^2)", note: "Each interval tries every internal split." },
    bestViews: ["Structure Canvas", "Watches", "Invariant Checker"],
    eventTypes: ["ENTER_SUBPROBLEM", "COMPARE", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Count valid message decodings",
    objective: "Combine one-digit and legal two-digit endings for every encoded prefix.",
    code: `
message = "2263"
ways = [0] * (len(message) + 1)
ways[0] = 1
ways[1] = 0 if message[0] == "0" else 1
transitions = []

for end in range(2, len(message) + 1):
    one_digit = int(message[end - 1])
    two_digits = int(message[end - 2:end])
    if 1 <= one_digit <= 9:
        ways[end] += ways[end - 1]
    if 10 <= two_digits <= 26:
        ways[end] += ways[end - 2]
    transitions.append((end, one_digit, two_digits, ways[end]))

print("Ways:", ways)
print("Transitions:", transitions)
print("Result:", ways[-1] == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Digit-message decoding count",
    phases: ["Initialize the empty and first-character prefixes", "Add valid one-digit and two-digit endings", "Read the complete prefix count"],
    invariants: ["ways[i] counts every valid decoding of exactly the first i characters"],
    edgeCases: ["A leading zero has no decoding", "Only values ten through twenty-six form two-digit letters"],
    comparisonGroup: "string-segmentation-dp",
    complexity: { time: "O(n)", space: "O(n)", note: "Each prefix checks at most two endings." },
    eventTypes: ["READ", "COMPARE", "MERGE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Compute maximum profit with transaction state",
    objective: "Separate holding and not-holding states while limiting stock trades to two completed transactions.",
    difficulty: "Guided Challenge",
    code: `
prices = [3, 3, 5, 0, 0, 3, 1, 4]
transactions = 2
not_holding = [0] * (transactions + 1)
holding = [float("-inf")] * (transactions + 1)
history = []

for price in prices:
    next_not_holding = not_holding.copy()
    next_holding = holding.copy()
    for count in range(1, transactions + 1):
        next_holding[count] = max(holding[count], not_holding[count - 1] - price)
        next_not_holding[count] = max(not_holding[count], holding[count] + price)
    holding = next_holding
    not_holding = next_not_holding
    history.append((price, holding.copy(), not_holding.copy()))

print("History:", history)
print("Profit:", not_holding[transactions])
print("Result:", not_holding[transactions] == 6)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Stock profit with bounded transactions",
    phases: ["Initialize cash and impossible holding states", "Choose rest, buy, or sell for each transaction count", "Read the final not-holding profit"],
    invariants: ["holding[t] and not_holding[t] summarize legal histories with at most t completed sales"],
    edgeCases: ["No prices produce zero profit", "An impossible holding state begins at negative infinity"],
    comparisonGroup: "state-machine-dp",
    complexity: { time: "O(n * k)", space: "O(k)", note: "Each price updates two states for each of k transaction limits." },
    bestViews: ["Before and After", "Invariant Checker", "Edge Case Lab"],
    eventTypes: ["COMPARE", "CHOOSE", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Recognize the anatomy of a dynamic program",
    objective: "Compare memoized and tabulated solutions while naming state, transition, base case, and evaluation order.",
    difficulty: "Guided Challenge",
    code: `
values = [4, 2, 7, 1, 3]
memo = {}

def best_memo(index):
    if index >= len(values):
        return 0
    if index not in memo:
        skip = best_memo(index + 1)
        take = values[index] + best_memo(index + 2)
        memo[index] = max(skip, take)
    return memo[index]

table = [0] * (len(values) + 2)
for index in range(len(values) - 1, -1, -1):
    table[index] = max(table[index + 1], values[index] + table[index + 2])

memo_answer = best_memo(0)
table_answer = table[0]
print("Memo states:", sorted(memo.items()))
print("Table:", table)
print("Result:", memo_answer == table_answer == 14)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "hash-table"],
    algorithm: "Memoization and tabulation comparison",
    phases: ["Define the nonadjacent-selection state", "Solve on demand with memoization", "Solve in reverse dependency order with tabulation"],
    invariants: ["Both forms apply the same skip-or-take transition to the same index state"],
    edgeCases: ["Indices beyond the list have value zero"],
    comparisonGroup: "dp-strategy-selection",
    complexity: { time: "O(n) for either form", space: "O(n)", note: "Each index state is solved once; recursion also uses call-stack space." },
    bestViews: ["Compare Algorithms", "Calls and Recursion", "Structure Canvas"],
    eventTypes: ["ENTER_SUBPROBLEM", "READ", "WRITE", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
];

/**
 * Bit lessons begin with readable masks, then move through counting,
 * uniqueness, subset encoding, flags, distance, Gray code, and fixed-width
 * arithmetic. Every example prints binary state so the representation remains
 * visible to a beginner.
 */
const bitManipulationPrograms = [
  {
    title: "Compare bits with AND OR and XOR",
    objective: "Read the truth behavior of three bitwise operators from aligned finite binary values.",
    difficulty: "Beginner",
    code: `
left = 0b1100
right = 0b1010

and_value = left & right
or_value = left | right
xor_value = left ^ right

print("Left: ", format(left, "04b"))
print("Right:", format(right, "04b"))
print("AND:  ", format(and_value, "04b"))
print("OR:   ", format(or_value, "04b"))
print("XOR:  ", format(xor_value, "04b"))
print("Result:", and_value == 8 and or_value == 14 and xor_value == 6)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set"],
    algorithm: "Bitwise operator comparison",
    phases: ["Align two finite masks", "Apply each operator position by position", "Interpret the resulting masks"],
    invariants: ["AND keeps shared one bits, OR keeps any one bit, and XOR keeps differing bits"],
    edgeCases: ["Leading zeroes are formatting, not stored integer bits"],
    comparisonGroup: "bitwise-foundations",
    complexity: { time: "O(1) for bounded machine-sized teaching values", space: "O(1)", note: "Python integers can grow, so operation cost scales with integer bit length in general." },
    bestViews: ["Before and After", "Variables", "Compare Algorithms"],
    eventTypes: ["READ", "WRITE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Set clear toggle and test one bit",
    objective: "Build one-position masks and observe four common bit-control operations.",
    difficulty: "Beginner",
    code: `
value = 0b1010
position = 2
mask = 1 << position

tested_before = bool(value & mask)
set_value = value | mask
cleared_value = set_value & ~mask
toggled_value = value ^ mask

print("Original:", format(value, "04b"))
print("Mask:    ", format(mask, "04b"))
print("Set:     ", format(set_value, "04b"))
print("Cleared: ", format(cleared_value, "04b"))
print("Toggled: ", format(toggled_value, "04b"))
print("Result:", not tested_before and cleared_value == value and toggled_value == 14)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set"],
    algorithm: "Single-bit control operations",
    phases: ["Shift one into the target position", "Combine the mask with the value", "Test the intended bit state"],
    invariants: ["The mask has exactly one set bit at the requested nonnegative position"],
    edgeCases: ["A negative shift count is invalid in Python"],
    comparisonGroup: "bitwise-foundations",
    complexity: { time: "O(1) for the bounded mask", space: "O(1)", note: "Each displayed operation uses one finite teaching integer." },
    bestViews: ["Before and After", "Mutation Explorer", "Step Table"],
    eventTypes: ["READ", "WRITE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Pack two small fields into one integer",
    objective: "Use shifts and masks to encode and recover two bounded unsigned fields.",
    code: `
category = 5
priority = 9
priority_width = 4
priority_mask = (1 << priority_width) - 1

packed = (category << priority_width) | priority
decoded_category = packed >> priority_width
decoded_priority = packed & priority_mask

print("Packed:", format(packed, "08b"))
print("Category:", decoded_category)
print("Priority:", decoded_priority)
print("Result:", decoded_category == category and decoded_priority == priority)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set"],
    algorithm: "Bit-field packing and unpacking",
    phases: ["Reserve a fixed number of low bits", "Shift and combine the fields", "Mask and shift to decode"],
    invariants: ["Priority must fit within the reserved four low bits"],
    edgeCases: ["A field value larger than its mask would overlap neighboring bits"],
    comparisonGroup: "bit-field-representations",
    complexity: { time: "O(1) for bounded fields", space: "O(1)", note: "The example uses a fixed eight-bit presentation." },
    bestViews: ["Variables", "Before and After", "Invariant Checker"],
    eventTypes: ["READ", "WRITE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Count one bits by shifting",
    objective: "Inspect every binary position while shifting a positive integer toward zero.",
    difficulty: "Beginner",
    code: `
number = 0b11010100
working = number
count = 0
visited = []

while working:
    bit = working & 1
    visited.append((format(working, "08b"), bit))
    count += bit
    working >>= 1

print("Visited:", visited)
print("Count:", count)
print("Result:", count == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "python-list"],
    algorithm: "Shift-based population count",
    phases: ["Read the low bit", "Add it to the count", "Shift the remaining bits right"],
    invariants: ["Processed low positions have contributed exactly their zero-or-one value"],
    edgeCases: ["Zero skips the loop and has zero set bits", "This loop is written for nonnegative integers"],
    comparisonGroup: "population-count-methods",
    complexity: { time: "O(b)", space: "O(1)", note: "b is the number of binary positions; the visited list is lesson-only evidence." },
    bestViews: ["Step Table", "Watches", "Operation Journey"],
    eventTypes: ["READ", "WRITE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Count one bits by clearing the lowest one",
    objective: "Use number AND number minus one to remove exactly one set bit per iteration.",
    code: `
number = 0b11010100
working = number
count = 0
history = []

while working:
    before = working
    working &= working - 1
    count += 1
    history.append((format(before, "08b"), format(working, "08b")))

print("Clears:", history)
print("Count:", count)
print("Result:", count == 4 and len(history) == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "python-list"],
    algorithm: "Brian Kernighan population count",
    phases: ["Find the effect of subtracting one", "Clear the lowest set bit", "Count one cleared bit"],
    invariants: ["Each iteration reduces the number of set bits by exactly one"],
    edgeCases: ["Zero performs no iterations"],
    comparisonGroup: "population-count-methods",
    complexity: { time: "O(k)", space: "O(1)", note: "k is the number of set bits; history is retained only for visualization." },
    bestViews: ["Compare Algorithms", "Before and After", "Invariant Checker"],
    eventTypes: ["READ", "REMOVE", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Recognize a positive power of two",
    objective: "Connect a one-bit representation with the number AND number minus one test.",
    difficulty: "Beginner",
    code: `
values = [0, 1, 2, 3, 4, 12, 16]
checks = []

for value in values:
    positive = value > 0
    one_bit = positive and (value & (value - 1)) == 0
    checks.append((value, format(value, "05b"), one_bit))

powers = [value for value, _, accepted in checks if accepted]
print("Checks:", checks)
print("Powers:", powers)
print("Result:", powers == [1, 2, 4, 16])`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "array"],
    algorithm: "Power-of-two bit test",
    phases: ["Reject nonpositive values", "Clear the lowest set bit", "Accept only when no set bits remain"],
    invariants: ["A positive power of two has exactly one set bit"],
    edgeCases: ["Zero must be rejected explicitly"],
    comparisonGroup: "single-bit-properties",
    complexity: { time: "O(n) for n tested values", space: "O(n) for the study records", note: "Each bounded integer test uses constant displayed work." },
    bestViews: ["Decisions", "Step Table", "Edge Case Lab"],
    eventTypes: ["COMPARE", "READ", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Isolate the lowest set bit",
    objective: "Use number AND negative number to identify the least significant one-bit mask.",
    code: `
number = 0b1011000
lowest = number & -number
position = lowest.bit_length() - 1

remaining = number ^ lowest
restored = remaining | lowest

print("Number:   ", format(number, "07b"))
print("Lowest:   ", format(lowest, "07b"))
print("Position:", position)
print("Remaining:", format(remaining, "07b"))
print("Result:", lowest == 0b1000 and position == 3 and restored == number)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set"],
    algorithm: "Lowest-set-bit isolation",
    phases: ["Form the two's-complement negative value conceptually", "Keep the shared lowest one bit", "Use the isolated mask"],
    invariants: ["For a positive number, the result contains exactly its lowest set bit"],
    edgeCases: ["Zero produces an isolated mask of zero and has no valid set-bit position"],
    comparisonGroup: "single-bit-properties",
    complexity: { time: "O(1) for the bounded example", space: "O(1)", note: "Python represents negative integers with unbounded sign extension, but this identity remains valid." },
    bestViews: ["Variables", "Before and After", "Edge Case Lab"],
    eventTypes: ["READ", "WRITE", "REMOVE", "RETURN_RESULT"],
  },
  {
    title: "Find one unpaired value with XOR",
    objective: "Cancel equal pairs through XOR while preserving the value that appears once.",
    difficulty: "Beginner",
    code: `
values = [4, 1, 2, 1, 2]
unpaired = 0
history = []

for value in values:
    before = unpaired
    unpaired ^= value
    history.append((before, value, unpaired))

print("History:", history)
print("Unpaired:", unpaired)
print("Result:", unpaired == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "array"],
    algorithm: "Single-number XOR cancellation",
    phases: ["Start with XOR identity zero", "Cancel every repeated pair", "Retain the unpaired value"],
    invariants: ["Accumulator equals the XOR of every processed value regardless of order"],
    edgeCases: ["The contract requires exactly one unpaired value and all others paired"],
    comparisonGroup: "xor-uniqueness",
    complexity: { time: "O(n)", space: "O(1)", note: "One accumulator replaces a frequency table under the pairing contract." },
    bestViews: ["Before and After", "Invariant Checker", "Operation Journey"],
    eventTypes: ["READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Separate two unpaired values",
    objective: "Partition values by one differing bit after paired values cancel together.",
    code: `
values = [1, 2, 1, 3, 2, 5]
combined = 0
for value in values:
    combined ^= value

separating_bit = combined & -combined
first = 0
second = 0
groups = []

for value in values:
    if value & separating_bit:
        first ^= value
        groups.append((value, 1))
    else:
        second ^= value
        groups.append((value, 0))

answer = sorted([first, second])
print("Separating bit:", separating_bit)
print("Groups:", groups)
print("Result:", answer == [3, 5])`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "array"],
    algorithm: "Two-single-numbers XOR partition",
    phases: ["XOR all values to combine the two answers", "Isolate one bit where answers differ", "Cancel pairs inside separate groups"],
    invariants: ["Equal paired values enter the same group and cancel"],
    edgeCases: ["The contract requires exactly two unpaired values"],
    comparisonGroup: "xor-uniqueness",
    complexity: { time: "O(n)", space: "O(1)", note: "The algorithm performs two linear passes and uses bounded accumulators." },
    bestViews: ["Decisions", "Algorithm Path", "Invariant Checker"],
    eventTypes: ["READ", "COMPARE", "CHOOSE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Recover a missing index with XOR",
    objective: "Cancel the complete index range against observed values to leave the missing member.",
    code: `
values = [3, 0, 1, 4]
expected_xor = 0
observed_xor = 0
history = []

for index in range(len(values) + 1):
    expected_xor ^= index
for value in values:
    observed_xor ^= value
    history.append((value, observed_xor))

missing = expected_xor ^ observed_xor
print("Expected XOR:", expected_xor)
print("Observed history:", history)
print("Missing:", missing)
print("Result:", missing == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "array"],
    algorithm: "Missing-number XOR cancellation",
    phases: ["XOR the complete expected range", "XOR every observed value", "Cancel shared members"],
    invariants: ["Every present value appears once in each aggregate and cancels"],
    edgeCases: ["The missing value may be zero or n"],
    comparisonGroup: "xor-uniqueness",
    complexity: { time: "O(n)", space: "O(1)", note: "Two linear scans avoid a separate set." },
    bestViews: ["Before and After", "Watches", "Invariant Checker"],
    eventTypes: ["READ", "WRITE", "MERGE", "RETURN_RESULT"],
  },
  {
    title: "Enumerate subsets with binary masks",
    objective: "Map every mask position to the decision to include or exclude one input value.",
    code: `
values = ["A", "B", "C"]
subsets = []
mask_records = []

for mask in range(1 << len(values)):
    subset = []
    for position, value in enumerate(values):
        if mask & (1 << position):
            subset.append(value)
    subsets.append(subset)
    mask_records.append((format(mask, "03b"), subset.copy()))

print("Mask records:", mask_records)
print("Subset count:", len(subsets))
print("Result:", len(subsets) == 8 and ["A", "C"] in subsets)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "array"],
    algorithm: "Bitmask subset enumeration",
    phases: ["Generate every n-bit mask", "Test each item position", "Build the represented subset"],
    invariants: ["Each mask represents exactly one include-or-exclude decision vector"],
    edgeCases: ["An empty input has one subset represented by mask zero"],
    comparisonGroup: "subset-enumeration-forms",
    complexity: { time: "O(n * 2^n)", space: "O(n * 2^n) for stored subsets", note: "There are 2^n masks and n tested positions per mask." },
    bestViews: ["Algorithm Path", "Step Table", "Structure Canvas"],
    eventTypes: ["VISIT_INDEX", "COMPARE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Combine permissions with named flags",
    objective: "Treat one integer as a small set of permissions while keeping operations readable through names.",
    difficulty: "Beginner",
    code: `
READ = 1 << 0
WRITE = 1 << 1
EXECUTE = 1 << 2

permissions = READ | WRITE
checks = {
    "read": bool(permissions & READ),
    "write": bool(permissions & WRITE),
    "execute": bool(permissions & EXECUTE),
}

permissions |= EXECUTE
permissions &= ~WRITE
final_checks = {
    "read": bool(permissions & READ),
    "write": bool(permissions & WRITE),
    "execute": bool(permissions & EXECUTE),
}

print("Initial checks:", checks)
print("Final checks:", final_checks)
print("Result:", final_checks == {"read": True, "write": False, "execute": True})`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "hash-table"],
    algorithm: "Bit-flag permission set",
    phases: ["Assign one bit per permission", "Combine and test named masks", "Add or remove a permission"],
    invariants: ["Each permission owns a distinct one-bit mask"],
    edgeCases: ["Unknown bits should be rejected or ignored by an application contract"],
    comparisonGroup: "bit-field-representations",
    complexity: { time: "O(1) for three flags", space: "O(1)", note: "Named masks keep a bounded flag set readable." },
    bestViews: ["Variables", "Mutation Explorer", "Invariant Checker"],
    eventTypes: ["READ", "INSERT", "REMOVE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Represent membership with an integer bit set",
    objective: "Store a bounded set of nonnegative integers as positions in one mask.",
    code: `
members = [1, 3, 4, 7]
bit_set = 0
history = []

for member in members:
    bit_set |= 1 << member
    history.append((member, format(bit_set, "08b")))

queries = {value: bool(bit_set & (1 << value)) for value in range(8)}
decoded = [value for value, present in queries.items() if present]

print("History:", history)
print("Queries:", queries)
print("Decoded:", decoded)
print("Result:", decoded == members)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "set"],
    algorithm: "Bounded-universe integer bit set",
    phases: ["Set one position for every member", "Test membership with the same position mask", "Decode set positions"],
    invariants: ["Bit i is one exactly when integer i is present"],
    edgeCases: ["This representation requires a known practical maximum member"],
    comparisonGroup: "set-representations",
    complexity: { time: "O(n + u)", space: "O(1) integer plus output", note: "n members are inserted and u bounded positions are decoded." },
    bestViews: ["Structure Canvas", "Mutation Explorer", "Compare Algorithms"],
    eventTypes: ["INSERT", "READ", "VISIT_INDEX", "RETURN_RESULT"],
  },
  {
    title: "Measure Hamming distance with XOR",
    objective: "XOR two equal-width codes and count positions where their bits differ.",
    code: `
left = 0b110101
right = 0b100011
difference = left ^ right
working = difference
distance = 0
clears = []

while working:
    before = working
    working &= working - 1
    distance += 1
    clears.append((format(before, "06b"), format(working, "06b")))

print("Difference:", format(difference, "06b"))
print("Clears:", clears)
print("Distance:", distance)
print("Result:", distance == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set"],
    algorithm: "Hamming distance by XOR population count",
    phases: ["XOR to mark differing positions", "Clear one marked position per step", "Count differences"],
    invariants: ["Set bits in the XOR result correspond exactly to unequal input positions"],
    edgeCases: ["Equal values have distance zero"],
    comparisonGroup: "bit-distance-methods",
    complexity: { time: "O(k)", space: "O(1)", note: "k is the number of differing bits; the clears list is lesson-only evidence." },
    bestViews: ["Before and After", "Operation Journey", "Invariant Checker"],
    eventTypes: ["COMPARE", "READ", "REMOVE", "RETURN_RESULT"],
  },
  {
    title: "Generate reflected Gray codes",
    objective: "Transform consecutive integers so neighboring codes differ in exactly one bit.",
    code: `
width = 3
codes = []
transitions = []

for number in range(1 << width):
    gray = number ^ (number >> 1)
    codes.append(gray)
    if len(codes) > 1:
        difference = codes[-2] ^ codes[-1]
        one_bit = difference != 0 and (difference & (difference - 1)) == 0
        transitions.append((codes[-2], codes[-1], difference, one_bit))

formatted = [format(code, f"0{width}b") for code in codes]
print("Gray codes:", formatted)
print("Transitions:", transitions)
print("Result:", len(codes) == 8 and all(item[3] for item in transitions))`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "array"],
    algorithm: "Binary-reflected Gray code",
    phases: ["Enumerate ordinary integers", "XOR each value with its right shift", "Verify adjacent one-bit changes"],
    invariants: ["Consecutive generated codes differ in exactly one position"],
    edgeCases: ["Width zero produces one empty-width numeric code zero"],
    comparisonGroup: "bit-sequence-encodings",
    complexity: { time: "O(2^w)", space: "O(2^w)", note: "Every w-bit code is generated and stored once." },
    bestViews: ["Algorithm Path", "Invariant Checker", "Step Table"],
    eventTypes: ["READ", "WRITE", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Add bounded unsigned values without plus",
    objective: "Separate XOR sum bits from shifted carry bits in a fixed eight-bit teaching width.",
    difficulty: "Guided Challenge",
    code: `
left = 13
right = 16
width = 8
mask = (1 << width) - 1
carry_bit = 1 << width
history = []

first = left & mask
second = right & mask
while second:
    partial = (first ^ second) & mask
    carry = ((first & second) << 1) & mask
    history.append((format(first, "08b"), format(second, "08b"), format(partial, "08b"), format(carry, "08b")))
    first, second = partial, carry

unsigned_result = first
signed_result = first if first < carry_bit // 2 else first - carry_bit
print("History:", history)
print("Unsigned:", unsigned_result)
print("Signed view:", signed_result)
print("Result:", unsigned_result == 29)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "array"],
    algorithm: "Fixed-width bitwise addition",
    phases: ["Use XOR for sum bits without carry", "Shift shared one bits into carry positions", "Repeat until carry is zero"],
    invariants: ["Within the fixed mask, partial plus carry preserves the bounded sum"],
    edgeCases: ["The explicit width defines overflow and signed interpretation", "Unbounded Python negatives require a mask for this loop"],
    comparisonGroup: "bit-arithmetic",
    complexity: { time: "O(w)", space: "O(1)", note: "At most w carry positions move through the fixed teaching width." },
    bestViews: ["Before and After", "Step Table", "Edge Case Lab"],
    eventTypes: ["READ", "WRITE", "MERGE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
];

/**
 * Mathematical algorithms focus on explicit invariants and integer-safe
 * operations. They avoid floating-point guesses where an exact integer method
 * is available and state the preconditions behind modular results.
 */
const mathematicalPrograms = [
  {
    title: "Find a greatest common divisor by remainders",
    objective: "Replace a pair with divisor and remainder until the nonzero common divisor is exposed.",
    difficulty: "Beginner",
    code: `
left = 252
right = 105
history = []

while right != 0:
    quotient = left // right
    remainder = left % right
    history.append((left, right, quotient, remainder))
    left, right = right, remainder

gcd = abs(left)
print("Euclidean steps:", history)
print("GCD:", gcd)
print("Result:", gcd == 21)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Euclidean greatest common divisor",
    phases: ["Divide and record the remainder", "Replace the pair with a smaller equivalent pair", "Return the last nonzero divisor"],
    invariants: ["gcd(a, b) equals gcd(b, a mod b)"],
    edgeCases: ["The absolute value handles negative inputs", "gcd(0, 0) is conventionally zero in Python"],
    comparisonGroup: "gcd-family",
    complexity: { time: "O(log min(a, b))", space: "O(1)", note: "Remainders shrink quickly; history is retained only for this lesson." },
    bestViews: ["Step Table", "Invariant Checker", "Operation Journey"],
    eventTypes: ["READ", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Recover Bezout coefficients with extended Euclid",
    objective: "Track coefficient updates that express the greatest common divisor as a linear combination.",
    code: `
original_left = 240
original_right = 46
old_r, r = original_left, original_right
old_s, s = 1, 0
old_t, t = 0, 1
history = []

while r != 0:
    quotient = old_r // r
    history.append((old_r, r, quotient, old_s, old_t))
    old_r, r = r, old_r - quotient * r
    old_s, s = s, old_s - quotient * s
    old_t, t = t, old_t - quotient * t

gcd, coefficient_left, coefficient_right = old_r, old_s, old_t
identity = original_left * coefficient_left + original_right * coefficient_right
print("History:", history)
print("Coefficients:", (coefficient_left, coefficient_right))
print("Result:", gcd == 2 and identity == gcd)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Extended Euclidean algorithm",
    phases: ["Run the remainder recurrence", "Apply the same quotient to coefficient pairs", "Verify the Bezout identity"],
    invariants: ["Each remainder is represented by its current coefficients of the original inputs"],
    edgeCases: ["Coefficient signs depend on input order"],
    comparisonGroup: "gcd-family",
    complexity: { time: "O(log min(a, b))", space: "O(1)", note: "Coefficient updates follow the same number of divisions as Euclid's algorithm." },
    bestViews: ["Step Table", "Invariant Checker", "Before and After"],
    eventTypes: ["READ", "WRITE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Derive a least common multiple from the GCD",
    objective: "Divide before multiplying so the least common multiple follows from the shared greatest divisor.",
    difficulty: "Beginner",
    code: `
left = 84
right = 30
a, b = abs(left), abs(right)
history = []

while b:
    history.append((a, b, a % b))
    a, b = b, a % b

gcd = a
lcm = 0 if left == 0 or right == 0 else abs(left // gcd * right)
product_identity = gcd * lcm == abs(left * right)

print("GCD history:", history)
print("GCD and LCM:", (gcd, lcm))
print("Result:", lcm == 420 and product_identity)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Least common multiple through GCD",
    phases: ["Find the greatest common divisor", "Divide one input by the shared factor", "Multiply by the other input"],
    invariants: ["For nonzero inputs, gcd(a, b) times lcm(a, b) equals absolute a times b"],
    edgeCases: ["If either input is zero, this lesson defines the LCM as zero"],
    comparisonGroup: "gcd-family",
    complexity: { time: "O(log min(a, b))", space: "O(1)", note: "The GCD calculation dominates the constant final arithmetic." },
    bestViews: ["Invariant Checker", "Watches", "Edge Case Lab"],
    eventTypes: ["READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Test primality through the square root",
    objective: "Reject small factors and stop when no possible factor can remain below the square root.",
    difficulty: "Beginner",
    code: `
number = 97
tested = []

if number < 2:
    prime = False
elif number == 2:
    prime = True
elif number % 2 == 0:
    prime = False
else:
    prime = True
    factor = 3
    while factor * factor <= number:
        tested.append(factor)
        if number % factor == 0:
            prime = False
            break
        factor += 2

print("Odd factors tested:", tested)
print("Prime:", prime)
print("Result:", prime and tested == [3, 5, 7, 9])`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Trial-division primality test",
    phases: ["Handle values below two and even numbers", "Test odd factors through the square root", "Accept after all possible small divisors fail"],
    invariants: ["Before factor f is tested, no smaller tested prime candidate divides the number"],
    edgeCases: ["Zero and one are not prime", "Two is the only even prime"],
    comparisonGroup: "prime-detection",
    complexity: { time: "O(sqrt(n))", space: "O(1)", note: "Only odd candidates through the square root are tested; the list records lesson evidence." },
    bestViews: ["Decisions", "Step Table", "Edge Case Lab"],
    eventTypes: ["COMPARE", "READ", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Mark primes with the sieve of Eratosthenes",
    objective: "Cross out composite multiples beginning at each prime candidate squared.",
    code: `
limit = 40
is_prime = [True] * (limit + 1)
is_prime[0] = is_prime[1] = False
crossed_out = []

factor = 2
while factor * factor <= limit:
    if is_prime[factor]:
        newly_crossed = []
        for multiple in range(factor * factor, limit + 1, factor):
            if is_prime[multiple]:
                newly_crossed.append(multiple)
            is_prime[multiple] = False
        crossed_out.append((factor, newly_crossed))
    factor += 1

primes = [number for number, accepted in enumerate(is_prime) if accepted]
print("Crossed out:", crossed_out)
print("Primes:", primes)
print("Result:", primes == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37])`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "array"],
    algorithm: "Sieve of Eratosthenes",
    phases: ["Assume candidates are prime", "Cross out multiples from factor squared", "Collect unmarked values"],
    invariants: ["When factor f is reached, any composite below f squared already has a smaller prime factor"],
    edgeCases: ["A limit below two contains no primes"],
    comparisonGroup: "prime-detection",
    complexity: { time: "O(n log log n)", space: "O(n)", note: "The boolean table represents every candidate through the limit." },
    bestViews: ["Structure Canvas", "Mutation Explorer", "Complexity Lab"],
    eventTypes: ["VISIT_INDEX", "REMOVE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Decompose an integer into prime factors",
    objective: "Remove each smallest divisor repeatedly until the remaining value is prime.",
    code: `
number = 756
remaining = number
factors = []
steps = []
candidate = 2

while candidate * candidate <= remaining:
    while remaining % candidate == 0:
        factors.append(candidate)
        remaining //= candidate
        steps.append((candidate, remaining))
    candidate = 3 if candidate == 2 else candidate + 2

if remaining > 1:
    factors.append(remaining)
    steps.append((remaining, 1))

product = 1
for factor in factors:
    product *= factor

print("Division steps:", steps)
print("Factors:", factors)
print("Result:", factors == [2, 2, 3, 3, 3, 7] and product == number)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Trial-division prime factorization",
    phases: ["Try the smallest remaining divisor", "Remove it repeatedly", "Append a final prime remainder"],
    invariants: ["Product of recorded factors times remaining always equals the original number"],
    edgeCases: ["One has an empty prime factorization", "This lesson expects a positive integer"],
    comparisonGroup: "factorization-methods",
    complexity: { time: "O(sqrt(n)) worst case", space: "O(log n) output", note: "A prime input tests candidates through its square root." },
    bestViews: ["Step Table", "Invariant Checker", "Operation Journey"],
    eventTypes: ["COMPARE", "REMOVE", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Raise a number modulo a modulus by squaring",
    objective: "Read exponent bits while repeatedly squaring the base under a modulus.",
    code: `
base = 7
exponent = 128
modulus = 13
result = 1
working_base = base % modulus
working_exponent = exponent
history = []

while working_exponent > 0:
    used = working_exponent & 1
    if used:
        result = (result * working_base) % modulus
    history.append((working_exponent, working_base, used, result))
    working_base = (working_base * working_base) % modulus
    working_exponent >>= 1

print("History:", history)
print("Modular power:", result)
print("Result:", result == pow(base, exponent, modulus) == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["bit-set", "array"],
    algorithm: "Binary modular exponentiation",
    phases: ["Reduce the starting base", "Multiply result for each set exponent bit", "Square the base and shift the exponent"],
    invariants: ["Processed exponent bits are represented in result while unprocessed power remains in the working base"],
    edgeCases: ["Exponent zero returns one modulo the modulus", "The modulus must be positive"],
    comparisonGroup: "modular-arithmetic",
    complexity: { time: "O(log exponent)", space: "O(1)", note: "One iteration processes one exponent bit; history is study evidence." },
    bestViews: ["Watches", "Before and After", "Complexity Lab"],
    eventTypes: ["READ", "COMPARE", "WRITE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Find a modular inverse with Bezout coefficients",
    objective: "Use extended Euclid and verify that the coefficient is an inverse only when the GCD is one.",
    code: `
value = 17
modulus = 43
old_r, r = value, modulus
old_s, s = 1, 0
history = []

while r:
    quotient = old_r // r
    history.append((old_r, r, quotient, old_s))
    old_r, r = r, old_r - quotient * r
    old_s, s = s, old_s - quotient * s

gcd = old_r
inverse = old_s % modulus if gcd == 1 else None
verified = inverse is not None and (value * inverse) % modulus == 1

print("History:", history)
print("Inverse:", inverse)
print("Result:", inverse == 38 and verified)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Modular inverse by extended Euclid",
    phases: ["Track the value coefficient through Euclid", "Require a greatest common divisor of one", "Normalize and verify the coefficient"],
    invariants: ["The tracked coefficient participates in a linear combination for the current remainder"],
    edgeCases: ["No modular inverse exists when value and modulus are not coprime"],
    comparisonGroup: "modular-arithmetic",
    complexity: { time: "O(log modulus)", space: "O(1)", note: "The method follows the Euclidean remainder sequence." },
    bestViews: ["Invariant Checker", "Step Table", "Edge Case Lab"],
    eventTypes: ["READ", "WRITE", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Build a row of Pascal's triangle",
    objective: "Construct binomial coefficients from neighboring values in the previous row.",
    difficulty: "Beginner",
    code: `
target_row = 6
triangle = [[1]]

for row_index in range(1, target_row + 1):
    previous = triangle[-1]
    current = [1]
    for column in range(1, row_index):
        current.append(previous[column - 1] + previous[column])
    current.append(1)
    triangle.append(current)

row = triangle[target_row]
symmetry = row == list(reversed(row))
print("Triangle:", triangle)
print("Row:", row)
print("Result:", row == [1, 6, 15, 20, 15, 6, 1] and symmetry)`,
    expectedResult: "Result: True",
    structureTypes: ["dynamic-programming-table", "array"],
    algorithm: "Pascal triangle construction",
    phases: ["Start with row zero", "Add adjacent previous coefficients", "Place one at both boundaries"],
    invariants: ["Every row begins and ends with one and is symmetric"],
    edgeCases: ["Row zero contains one coefficient"],
    comparisonGroup: "binomial-coefficients",
    complexity: { time: "O(r^2)", space: "O(r^2)", note: "The lesson retains every coefficient through target row r." },
    bestViews: ["Structure Canvas", "Invariant Checker", "Step Table"],
    eventTypes: ["READ", "MERGE", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Count trailing zeroes in a factorial",
    objective: "Count factors of five contributed by powers of five without constructing the factorial.",
    code: `
number = 125
power = 5
zeroes = 0
contributions = []

while power <= number:
    contribution = number // power
    zeroes += contribution
    contributions.append((power, contribution, zeroes))
    power *= 5

print("Contributions:", contributions)
print("Trailing zeroes:", zeroes)
print("Result:", zeroes == 31)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Factorial trailing-zero count",
    phases: ["Count multiples of five", "Add extra factors from higher powers of five", "Stop beyond the input"],
    invariants: ["The accumulated count equals all factors of five contributed by processed powers"],
    edgeCases: ["Numbers below five have zero trailing factorial zeroes"],
    comparisonGroup: "factorial-properties",
    complexity: { time: "O(log_5 n)", space: "O(1)", note: "Each iteration multiplies the tested power by five." },
    bestViews: ["Step Table", "Watches", "Complexity Lab"],
    eventTypes: ["READ", "WRITE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Find an integer square root by binary search",
    objective: "Return the largest integer whose square does not exceed the input.",
    code: `
number = 12345
left = 0
right = number
answer = 0
history = []

while left <= right:
    middle = (left + right) // 2
    square = middle * middle
    history.append((left, middle, right, square))
    if square <= number:
        answer = middle
        left = middle + 1
    else:
        right = middle - 1

print("History:", history)
print("Integer square root:", answer)
print("Result:", answer == 111 and answer * answer <= number < (answer + 1) ** 2)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Integer square root by binary search",
    phases: ["Maintain a candidate interval", "Compare the middle square with the input", "Keep the largest feasible middle"],
    invariants: ["answer is the largest confirmed feasible value below the current left boundary"],
    edgeCases: ["Zero and one return themselves"],
    comparisonGroup: "integer-root-methods",
    complexity: { time: "O(log n)", space: "O(1)", note: "The candidate interval is halved after every comparison." },
    bestViews: ["Watches", "Algorithm Path", "Invariant Checker"],
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "READ", "RETURN_RESULT"],
  },
  {
    title: "Convert an integer to another base",
    objective: "Collect repeated division remainders and reverse them into a positional representation.",
    difficulty: "Beginner",
    code: `
number = 255
base = 16
digits = "0123456789ABCDEF"
working = number
reversed_digits = []
steps = []

if working == 0:
    reversed_digits.append("0")
while working > 0:
    working, remainder = divmod(working, base)
    reversed_digits.append(digits[remainder])
    steps.append((working, remainder))

representation = "".join(reversed(reversed_digits))
print("Division steps:", steps)
print("Representation:", representation)
print("Result:", representation == "FF")`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "array"],
    algorithm: "Repeated-division base conversion",
    phases: ["Divide by the target base", "Push each least-significant remainder", "Reverse digits into positional order"],
    invariants: ["Collected remainders encode the removed low-order digits"],
    edgeCases: ["Zero needs an explicit zero digit", "This digit table supports bases two through sixteen"],
    comparisonGroup: "number-representations",
    complexity: { time: "O(log_base n)", space: "O(log_base n)", note: "One output digit is collected per division." },
    bestViews: ["Structure Canvas", "Operation Journey", "Before and After"],
    eventTypes: ["READ", "PUSH", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Reduce a fraction to canonical terms",
    objective: "Use the greatest common divisor to normalize sign and remove every shared factor.",
    code: `
numerator = -150
denominator = -210
if denominator == 0:
    raise ValueError("denominator must not be zero")

sign = -1 if (numerator < 0) ^ (denominator < 0) else 1
a, b = abs(numerator), abs(denominator)
history = []
while b:
    history.append((a, b, a % b))
    a, b = b, a % b

divisor = a
reduced_numerator = sign * (abs(numerator) // divisor)
reduced_denominator = abs(denominator) // divisor

print("GCD history:", history)
print("Reduced:", (reduced_numerator, reduced_denominator))
print("Result:", (reduced_numerator, reduced_denominator) == (5, 7))`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Canonical fraction reduction",
    phases: ["Validate the denominator and normalize sign", "Find the greatest common divisor", "Divide both terms by the shared factor"],
    invariants: ["The reduced denominator is positive and the represented rational value is unchanged"],
    edgeCases: ["A zero denominator is invalid", "A zero numerator normalizes to zero over one in a reusable implementation"],
    comparisonGroup: "gcd-applications",
    complexity: { time: "O(log min(a, b))", space: "O(1)", note: "Euclid's algorithm dominates the constant normalization work." },
    bestViews: ["Error Coach", "Invariant Checker", "Before and After"],
    eventTypes: ["COMPARE", "READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Combine two coprime congruences",
    objective: "Construct the smallest shared solution for two coprime modular conditions.",
    difficulty: "Guided Challenge",
    code: `
remainder_one, modulus_one = 2, 3
remainder_two, modulus_two = 3, 5

def extended_gcd(left, right):
    old_r, r = left, right
    old_s, s = 1, 0
    while r:
        quotient = old_r // r
        old_r, r = r, old_r - quotient * r
        old_s, s = s, old_s - quotient * s
    return old_r, old_s

gcd, coefficient = extended_gcd(modulus_one, modulus_two)
if gcd != 1:
    solution = None
else:
    inverse = coefficient % modulus_two
    adjustment = ((remainder_two - remainder_one) * inverse) % modulus_two
    combined_modulus = modulus_one * modulus_two
    solution = (remainder_one + modulus_one * adjustment) % combined_modulus

checks = solution % modulus_one == remainder_one and solution % modulus_two == remainder_two
print("Solution:", solution)
print("Combined modulus:", modulus_one * modulus_two)
print("Result:", solution == 8 and checks)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Two-modulus Chinese remainder construction",
    phases: ["Require coprime moduli", "Invert the first modulus under the second", "Apply and normalize the needed adjustment"],
    invariants: ["The constructed value preserves the first congruence while the adjustment satisfies the second"],
    edgeCases: ["Noncoprime moduli need an additional consistency check and a different combined modulus"],
    comparisonGroup: "modular-arithmetic",
    complexity: { time: "O(log min(m1, m2))", space: "O(1)", note: "Extended Euclid finds the needed inverse." },
    bestViews: ["Calls and Recursion", "Invariant Checker", "Edge Case Lab"],
    eventTypes: ["READ", "COMPARE", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
];

/** Definitions remain ordered by the approved direct-teaching sequence. */
const definitions = [
  ...dynamicProgrammingPrograms.map((program) => ({ ...program, section: "Dynamic programming" })),
  ...bitManipulationPrograms.map((program) => ({ ...program, section: "Bit manipulation" })),
  ...mathematicalPrograms.map((program) => ({ ...program, section: "Elementary mathematical algorithms" })),
];

/** Frozen Chunk 6 records continue identifiers from DSA-398 through DSA-451. */
export const DSA_CHUNK_SIX_PROGRAMS = Object.freeze(
  definitions.map((definition, index) => makeProgram(definition, index)),
);
