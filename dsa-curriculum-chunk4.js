/**
 * Code Explorer Data Structures and Algorithms curriculum, Chunk 4.
 *
 * This module adds 68 reviewed programs for Union-Find and graph algorithms.
 * Each program runs independently and carries the complete evidence metadata
 * consumed by the catalog, trace views, learning comments, comparisons, and
 * detached release validators.
 *
 * The records contain no learner data and perform no network activity.
 */

import { DSA_PROGRAM_REQUIRED_FIELDS } from "./dsa-contracts.js";

/** The four Chunk 4 sections and their approved Tier A counts. */
export const DSA_CHUNK_FOUR_SECTIONS = Object.freeze([
  ["Union-Find", 10],
  ["Graph structures and vocabulary", 24],
  ["Graph traversal and connectivity", 20],
  ["Shortest paths and spanning trees", 14],
]);

/** Removes only outer template whitespace while preserving Python formatting. */
function cleanCode(source) {
  return source.replace(/^\n/, "").replace(/\s+$/, "");
}

/**
 * Builds one immutable program using the complete shared curriculum schema.
 *
 * @param {object} definition Reviewed metadata and executable Python source.
 * @param {number} index Zero-based index inside Chunk 4.
 * @returns {Readonly<object>} Complete record numbered after Chunk 3.
 */
function makeProgram(definition, index) {
  const record = {
    id: `dsa-${String(index + 270).padStart(3, "0")}`,
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
    bestViews: definition.bestViews || ["Structure Canvas", "Operation Journey", "Variables"],
    eventTypes: definition.eventTypes,
    intentionalError: null,
  };
  for (const field of DSA_PROGRAM_REQUIRED_FIELDS) {
    if (!(field in record)) throw new Error(`Chunk 4 program ${record.id} is missing ${field}.`);
  }
  return Object.freeze(record);
}

/** Shared complexity descriptions keep related graph lessons consistent. */
const COST = Object.freeze({
  unionFind: {
    time: "O(alpha(n)) amortized",
    space: "O(n)",
    note: "Union by size or rank with path compression gives near-constant amortized operations while storing one parent entry per item.",
  },
  graphLinear: {
    time: "O(V + E)",
    space: "O(V)",
    note: "The traversal visits every reachable vertex and examines every reachable adjacency entry.",
  },
  dijkstra: {
    time: "O((V + E) log V)",
    space: "O(V + E)",
    note: "An adjacency list and binary heap process improving distance candidates; stale heap entries can be skipped.",
  },
  matrix: {
    time: "O(V^2)",
    space: "O(V^2)",
    note: "The matrix stores one cell for every ordered pair of vertices.",
  },
});

/** Union-Find lessons progress from parent forests to applied connectivity. */
const unionFindPrograms = [
  {
    title: "Create one set for every item",
    objective: "Initialize a disjoint-set forest in which every item is its own representative.",
    difficulty: "Beginner",
    code: `
items = ["A", "B", "C", "D"]
parent = {}
size = {}

for item in items:
    parent[item] = item
    size[item] = 1

roots = [item for item in items if parent[item] == item]
print("Parent:", parent)
print("Sizes:", size)
print("Roots:", roots)
print("Result:", roots == items and sum(size.values()) == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "hash-table"],
    algorithm: "Make-set initialization",
    phases: ["Create empty parent and size maps", "Make each item its own parent", "Verify one root per initial set"],
    invariants: ["Every item reaches exactly one representative", "Every initial set has size one"],
    edgeCases: ["An empty item collection creates no sets"],
    comparisonGroup: "union-find-optimizations",
    complexity: { time: "O(n)", space: "O(n)", note: "Initialization writes one parent and size entry for each item." },
    bestViews: ["Structure Canvas", "Variables", "Invariant Checker"],
    eventTypes: ["INSERT", "LINK", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Follow parents to a representative",
    objective: "Trace parent links iteratively until reaching the root of one set.",
    difficulty: "Beginner",
    code: `
parent = {"A": "B", "B": "C", "C": "C", "D": "D"}
start = "A"
path = [start]
current = start

while parent[current] != current:
    current = parent[current]
    path.append(current)

representative = current
print("Path:", path)
print("Representative:", representative)
print("Result:", path == ["A", "B", "C"] and representative == "C")`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "hash-table"],
    algorithm: "Iterative find",
    phases: ["Start at the requested item", "Follow parent links", "Stop when a node parents itself"],
    invariants: ["The current item stays inside the same set", "A representative is its own parent"],
    edgeCases: ["Finding a root stops without entering the loop"],
    comparisonGroup: "union-find-find-forms",
    complexity: { time: "O(h)", space: "O(h)", note: "The walk follows h parent links and stores the observed path for teaching." },
    bestViews: ["Operation Journey", "Watches", "Structure Canvas"],
    eventTypes: ["FIND", "VISIT_NODE", "READ", "RETURN_RESULT"],
  },
  {
    title: "Find a representative recursively",
    objective: "Express representative lookup as a recursive parent-chain problem.",
    code: `
parent = {"A": "B", "B": "C", "C": "C", "D": "D"}
visited = []

def find(item):
    visited.append(item)
    if parent[item] == item:
        return item
    return find(parent[item])

representative = find("A")
print("Visited:", visited)
print("Representative:", representative)
print("Result:", visited == ["A", "B", "C"] and representative == "C")`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "hash-table"],
    algorithm: "Recursive find",
    phases: ["Enter one parent-chain subproblem", "Recognize a self-parent root", "Return the root through every call"],
    invariants: ["Every recursive call remains in the original set"],
    edgeCases: ["A root is the recursive base case"],
    comparisonGroup: "union-find-find-forms",
    complexity: { time: "O(h)", space: "O(h)", note: "The call stack holds one frame for each parent link on a height-h path." },
    bestViews: ["Calls and Recursion", "Operation Journey", "Structure Canvas"],
    eventTypes: ["FIND", "ENTER_SUBPROBLEM", "VISIT_NODE", "RETURN_RESULT"],
  },
  {
    title: "Join two sets with a basic union",
    objective: "Connect two representatives and verify that their items become connected.",
    difficulty: "Beginner",
    code: `
parent = {item: item for item in ["A", "B", "C", "D"]}

def find(item):
    while parent[item] != item:
        item = parent[item]
    return item

def union(left, right):
    left_root = find(left)
    right_root = find(right)
    if left_root == right_root:
        return False
    parent[right_root] = left_root
    return True

changed = union("A", "B")
same_set = find("A") == find("B")
print("Parent:", parent)
print("Changed:", changed)
print("Result:", changed and same_set and find("C") != find("A"))`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "hash-table"],
    algorithm: "Basic union",
    phases: ["Find both representatives", "Skip an already-connected pair", "Link one representative to the other"],
    invariants: ["Only representatives are linked during union", "Union never separates an existing set"],
    edgeCases: ["Union of two connected items makes no change"],
    comparisonGroup: "union-find-optimizations",
    complexity: { time: "O(h)", space: "O(n)", note: "Two uncompressed finds follow parent height h before one link changes." },
    bestViews: ["Before and After", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["FIND", "UNION", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Keep shallow trees with union by size",
    objective: "Attach the smaller component below the larger component's representative.",
    code: `
items = list("ABCDEF")
parent = {item: item for item in items}
size = {item: 1 for item in items}

def find(item):
    while parent[item] != item:
        item = parent[item]
    return item

def union(left, right):
    left_root = find(left)
    right_root = find(right)
    if left_root == right_root:
        return False
    if size[left_root] < size[right_root]:
        left_root, right_root = right_root, left_root
    parent[right_root] = left_root
    size[left_root] += size[right_root]
    return True

for edge in [("A", "B"), ("C", "D"), ("A", "C"), ("E", "F"), ("A", "E")]:
    union(*edge)

root = find("F")
print("Parent:", parent)
print("Root size:", size[root])
print("Result:", root == find("A") and size[root] == 6)`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "hash-table"],
    algorithm: "Union by size",
    phases: ["Find both roots", "Place the larger component first", "Attach and update its size"],
    invariants: ["Only a representative's size is authoritative", "The winning size equals both merged component sizes"],
    edgeCases: ["Equal-size components may choose either representative consistently"],
    comparisonGroup: "union-find-optimizations",
    complexity: { time: "O(log n) per find without compression", space: "O(n)", note: "Union by size bounds forest height logarithmically even before path compression." },
    bestViews: ["Structure Canvas", "Invariant Checker", "Step Table"],
    eventTypes: ["FIND", "COMPARE", "UNION", "LINK", "CHECK_INVARIANT"],
  },
  {
    title: "Keep shallow trees with union by rank",
    objective: "Track an upper bound on tree height and increase it only when equal ranks merge.",
    code: `
items = list("ABCDEFGH")
parent = {item: item for item in items}
rank = {item: 0 for item in items}

def find(item):
    while parent[item] != item:
        item = parent[item]
    return item

def union(left, right):
    left_root = find(left)
    right_root = find(right)
    if left_root == right_root:
        return False
    if rank[left_root] < rank[right_root]:
        left_root, right_root = right_root, left_root
    parent[right_root] = left_root
    if rank[left_root] == rank[right_root]:
        rank[left_root] += 1
    return True

for edge in [("A", "B"), ("C", "D"), ("A", "C"), ("E", "F"), ("G", "H"), ("E", "G"), ("A", "E")]:
    union(*edge)

root = find("H")
print("Root:", root)
print("Root rank:", rank[root])
print("Result:", root == find("A") and rank[root] == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "hash-table"],
    algorithm: "Union by rank",
    phases: ["Compare root ranks", "Attach the lower-rank root", "Increase rank only after an equal-rank merge"],
    invariants: ["A nonroot rank is not used to choose future links", "Unequal-rank union does not increase the winning rank"],
    edgeCases: ["Equal ranks require one deterministic winner"],
    comparisonGroup: "union-find-optimizations",
    complexity: { time: "O(log n) per find without compression", space: "O(n)", note: "Rank prevents repeated attachment from creating a linear parent chain." },
    bestViews: ["Structure Canvas", "Invariant Checker", "Before and After"],
    eventTypes: ["FIND", "COMPARE", "UNION", "LINK", "CHECK_INVARIANT"],
  },
  {
    title: "Compress a parent path during find",
    objective: "Rewrite visited parent links so future finds reach the representative sooner.",
    code: `
parent = {"A": "B", "B": "C", "C": "D", "D": "D", "E": "E"}
before = dict(parent)
visited = []

def find(item):
    visited.append(item)
    if parent[item] != item:
        parent[item] = find(parent[item])
    return parent[item]

representative = find("A")
after = dict(parent)
compressed = all(parent[item] == "D" for item in ["A", "B", "C", "D"])

print("Visited:", visited)
print("Before:", before)
print("After:", after)
print("Result:", representative == "D" and compressed)`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "hash-table"],
    algorithm: "Find with path compression",
    phases: ["Follow links recursively", "Discover the representative", "Rewrite every returning link to the root"],
    invariants: ["Compression changes shape but not set membership"],
    edgeCases: ["Finding a representative performs no rewrite"],
    comparisonGroup: "union-find-optimizations",
    complexity: COST.unionFind,
    bestViews: ["Before and After", "Mutation Explorer", "Calls and Recursion"],
    eventTypes: ["FIND", "ENTER_SUBPROBLEM", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Answer repeated connectivity questions",
    objective: "Build components once and answer whether selected item pairs share a representative.",
    code: `
items = range(7)
parent = list(items)
size = [1] * len(parent)

def find(item):
    while parent[item] != item:
        parent[item] = parent[parent[item]]
        item = parent[item]
    return item

def union(left, right):
    left_root = find(left)
    right_root = find(right)
    if left_root == right_root:
        return
    if size[left_root] < size[right_root]:
        left_root, right_root = right_root, left_root
    parent[right_root] = left_root
    size[left_root] += size[right_root]

for left, right in [(0, 1), (1, 2), (3, 4), (5, 6), (4, 5)]:
    union(left, right)

queries = [(0, 2), (0, 3), (3, 6)]
answers = [find(left) == find(right) for left, right in queries]
print("Queries:", list(zip(queries, answers)))
print("Result:", answers == [True, False, True])`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "array"],
    algorithm: "Union-Find connectivity queries",
    phases: ["Build components from connections", "Find each query pair's representatives", "Compare representatives"],
    invariants: ["Two items are connected exactly when their representatives match"],
    edgeCases: ["An item is always connected to itself"],
    comparisonGroup: "connectivity-methods",
    complexity: COST.unionFind,
    bestViews: ["Step Table", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["UNION", "FIND", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Count connected components with Union-Find",
    objective: "Decrease a component counter only when one union merges two different sets.",
    code: `
vertex_count = 8
edges = [(0, 1), (1, 2), (3, 4), (5, 6), (6, 7), (5, 7)]
parent = list(range(vertex_count))
size = [1] * vertex_count
components = vertex_count

def find(vertex):
    if parent[vertex] != vertex:
        parent[vertex] = find(parent[vertex])
    return parent[vertex]

for left, right in edges:
    left_root = find(left)
    right_root = find(right)
    if left_root == right_root:
        continue
    if size[left_root] < size[right_root]:
        left_root, right_root = right_root, left_root
    parent[right_root] = left_root
    size[left_root] += size[right_root]
    components -= 1

groups = {find(vertex) for vertex in range(vertex_count)}
print("Representatives:", sorted(groups))
print("Component count:", components)
print("Result:", components == len(groups) == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "graph", "array"],
    algorithm: "Component counting with Union-Find",
    phases: ["Start with one component per vertex", "Merge roots for every connecting edge", "Count the surviving representatives"],
    invariants: ["The counter decreases exactly once per successful union"],
    edgeCases: ["A redundant edge does not change the component count", "An isolated vertex remains its own component"],
    comparisonGroup: "connectivity-methods",
    complexity: COST.unionFind,
    bestViews: ["Invariant Checker", "Structure Canvas", "Complexity Lab"],
    eventTypes: ["VISIT_EDGE", "FIND", "UNION", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Detect an undirected cycle with Union-Find",
    objective: "Recognize the first edge whose endpoints already belong to the same component.",
    code: `
vertices = range(5)
edges = [(0, 1), (1, 2), (2, 3), (3, 1), (3, 4)]
parent = list(vertices)
size = [1] * len(parent)
cycle_edge = None

def find(vertex):
    while parent[vertex] != vertex:
        parent[vertex] = parent[parent[vertex]]
        vertex = parent[vertex]
    return vertex

for left, right in edges:
    left_root = find(left)
    right_root = find(right)
    if left_root == right_root:
        cycle_edge = (left, right)
        break
    if size[left_root] < size[right_root]:
        left_root, right_root = right_root, left_root
    parent[right_root] = left_root
    size[left_root] += size[right_root]

print("Cycle edge:", cycle_edge)
print("Processed parent:", parent)
print("Result:", cycle_edge == (3, 1))`,
    expectedResult: "Result: True",
    structureTypes: ["union-find", "graph", "array"],
    algorithm: "Undirected-cycle detection with Union-Find",
    phases: ["Inspect the next edge", "Compare endpoint representatives", "Stop on a redundant connection or merge the components"],
    invariants: ["Processed edges form a forest until the first redundant connection"],
    edgeCases: ["A self-loop is detected immediately", "This method does not directly detect directed cycles"],
    comparisonGroup: "undirected-cycle-detection",
    complexity: COST.unionFind,
    bestViews: ["Algorithm Path", "Invariant Checker", "Edge Case Lab"],
    eventTypes: ["VISIT_EDGE", "FIND", "COMPARE", "UNION", "RETURN_RESULT"],
  },
].map((program) => ({ ...program, section: "Union-Find" }));

/** Graph-vocabulary lessons make representation choices explicit and testable. */
const graphStructurePrograms = [
  {
    title: "Name vertices and edges",
    objective: "Separate a graph's vertex collection from the relationships stored as edges.",
    difficulty: "Beginner",
    code: `
vertices = {"A", "B", "C", "D"}
edges = [("A", "B"), ("A", "C"), ("C", "D")]

edge_endpoints = set()
for left, right in edges:
    edge_endpoints.add(left)
    edge_endpoints.add(right)

unknown = edge_endpoints - vertices
isolated = vertices - edge_endpoints
print("Vertices:", sorted(vertices))
print("Edges:", edges)
print("Isolated:", sorted(isolated))
print("Result:", not unknown and isolated == set())`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "set", "array"],
    algorithm: "Graph vocabulary inspection",
    phases: ["Declare vertices", "Declare endpoint pairs", "Verify every endpoint belongs to the graph"],
    invariants: ["Every edge endpoint is a declared vertex"],
    edgeCases: ["A declared vertex can have no incident edge"],
    complexity: { time: "O(V + E)", space: "O(V)", note: "The check scans vertices and edge endpoints once." },
    bestViews: ["Structure Canvas", "Variables", "Invariant Checker"],
    eventTypes: ["READ", "VISIT_EDGE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Build an undirected adjacency list",
    objective: "Store each undirected edge in both endpoint adjacency lists.",
    difficulty: "Beginner",
    code: `
vertices = ["A", "B", "C", "D"]
edges = [("A", "B"), ("A", "C"), ("B", "D")]
graph = {vertex: [] for vertex in vertices}

for left, right in edges:
    graph[left].append(right)
    graph[right].append(left)

for vertex in graph:
    graph[vertex].sort()

print("Graph:", graph)
print("Degree A:", len(graph["A"]))
print("Result:", graph["A"] == ["B", "C"] and graph["D"] == ["B"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Undirected adjacency-list construction",
    phases: ["Create one neighbor list per vertex", "Add both directions for each edge", "Inspect the resulting neighborhoods"],
    invariants: ["If v appears beside u, then u appears beside v"],
    edgeCases: ["An isolated vertex keeps an empty neighbor list"],
    comparisonGroup: "graph-representations",
    complexity: { time: "O(V + E)", space: "O(V + E)", note: "Every vertex is initialized and every undirected edge creates two adjacency entries." },
    bestViews: ["Structure Canvas", "Before and After", "Invariant Checker"],
    eventTypes: ["INSERT", "LINK", "VISIT_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Build a directed adjacency list",
    objective: "Preserve edge direction by adding only each edge's outgoing relationship.",
    difficulty: "Beginner",
    code: `
vertices = ["plan", "shop", "cook", "eat"]
edges = [("plan", "shop"), ("shop", "cook"), ("cook", "eat"), ("plan", "cook")]
graph = {vertex: [] for vertex in vertices}

for source, target in edges:
    graph[source].append(target)

outgoing_from_plan = graph["plan"]
incoming_to_plan = [source for source, targets in graph.items() if "plan" in targets]

print("Graph:", graph)
print("Outgoing from plan:", outgoing_from_plan)
print("Incoming to plan:", incoming_to_plan)
print("Result:", outgoing_from_plan == ["shop", "cook"] and incoming_to_plan == [])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Directed adjacency-list construction",
    phases: ["Create all vertices", "Store each outgoing edge once", "Distinguish outgoing from incoming relationships"],
    invariants: ["An adjacency entry source to target does not imply target to source"],
    edgeCases: ["A sink vertex has no outgoing neighbors"],
    comparisonGroup: "graph-direction",
    complexity: { time: "O(V + E)", space: "O(V + E)", note: "Each directed edge creates one adjacency entry." },
    bestViews: ["Structure Canvas", "Algorithm Path", "Invariant Checker"],
    eventTypes: ["INSERT", "LINK", "VISIT_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Attach weights to adjacency entries",
    objective: "Represent a weighted directed graph with neighbor and cost pairs.",
    difficulty: "Beginner",
    code: `
vertices = ["A", "B", "C", "D"]
edges = [("A", "B", 4), ("A", "C", 2), ("C", "B", 1), ("B", "D", 5)]
graph = {vertex: [] for vertex in vertices}

for source, target, weight in edges:
    graph[source].append((target, weight))

outgoing_cost = sum(weight for _, weight in graph["A"])
lightest = min(graph["A"], key=lambda entry: entry[1])

print("Weighted graph:", graph)
print("Lightest from A:", lightest)
print("Result:", outgoing_cost == 6 and lightest == ("C", 2))`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Weighted adjacency-list construction",
    phases: ["Create vertex records", "Store target and weight together", "Inspect outgoing costs"],
    invariants: ["Every adjacency pair keeps its edge endpoint and weight together"],
    edgeCases: ["Negative weights are representable even when an algorithm cannot accept them"],
    comparisonGroup: "weighted-graph-representations",
    complexity: { time: "O(V + E)", space: "O(V + E)", note: "The representation stores one weighted entry per directed edge." },
    bestViews: ["Structure Canvas", "Variables", "Edge Case Lab"],
    eventTypes: ["INSERT", "LINK", "READ", "RETURN_RESULT"],
  },
  {
    title: "Create an adjacency matrix",
    objective: "Map vertex labels to matrix indices and mark every undirected connection.",
    code: `
vertices = ["A", "B", "C", "D"]
index = {vertex: position for position, vertex in enumerate(vertices)}
edges = [("A", "B"), ("A", "D"), ("B", "C")]
matrix = [[0] * len(vertices) for _ in vertices]

for left, right in edges:
    left_index = index[left]
    right_index = index[right]
    matrix[left_index][right_index] = 1
    matrix[right_index][left_index] = 1

row_a = matrix[index["A"]]
print("Matrix:", matrix)
print("Row A:", row_a)
print("Result:", row_a == [0, 1, 0, 1] and matrix[2][1] == 1)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "hash-table"],
    algorithm: "Undirected adjacency-matrix construction",
    phases: ["Assign one index per vertex", "Allocate every matrix cell", "Mark both directions for each edge"],
    invariants: ["An undirected adjacency matrix is symmetric"],
    edgeCases: ["The diagonal records self-loops if they exist"],
    comparisonGroup: "graph-representations",
    complexity: COST.matrix,
    bestViews: ["Structure Canvas", "Before and After", "Complexity Lab"],
    eventTypes: ["WRITE", "LINK", "VISIT_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Use an edge list as the source of truth",
    objective: "Process a compact list of weighted edges without building neighbor collections.",
    difficulty: "Beginner",
    code: `
edges = [
    ("A", "B", 7),
    ("B", "C", 2),
    ("A", "C", 9),
    ("C", "D", 1),
]

light_edges = []
total_weight = 0
for source, target, weight in edges:
    total_weight += weight
    if weight <= 2:
        light_edges.append((source, target, weight))

print("Light edges:", light_edges)
print("Total weight:", total_weight)
print("Result:", light_edges == [("B", "C", 2), ("C", "D", 1)] and total_weight == 19)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array"],
    algorithm: "Edge-list scan",
    phases: ["Store complete edge records", "Scan edges in list order", "Select edges by weight"],
    invariants: ["Every list entry contains both endpoints and its weight"],
    edgeCases: ["Finding all neighbors requires scanning the complete edge list"],
    comparisonGroup: "graph-representations",
    complexity: { time: "O(E)", space: "O(E)", note: "The program scans and stores one record per edge." },
    bestViews: ["Step Table", "Variables", "Complexity Lab"],
    eventTypes: ["VISIT_EDGE", "READ", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Measure degree in an undirected graph",
    objective: "Count incident edges through adjacency-list lengths.",
    difficulty: "Beginner",
    code: `
graph = {
    "A": ["B", "C", "D"],
    "B": ["A", "C"],
    "C": ["A", "B"],
    "D": ["A"],
    "E": [],
}

degrees = {}
for vertex, neighbors in graph.items():
    degrees[vertex] = len(neighbors)

degree_sum = sum(degrees.values())
edge_count = degree_sum // 2
print("Degrees:", degrees)
print("Edges from degree sum:", edge_count)
print("Result:", degrees["A"] == 3 and degrees["E"] == 0 and edge_count == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Undirected degree measurement",
    phases: ["Inspect every neighbor list", "Record each vertex degree", "Use the degree-sum identity"],
    invariants: ["The sum of undirected degrees equals twice the edge count"],
    edgeCases: ["An isolated vertex has degree zero"],
    comparisonGroup: "graph-degree",
    complexity: { time: "O(V)", space: "O(V)", note: "With stored adjacency lengths, one constant-time length check is made per vertex." },
    bestViews: ["Variables", "Invariant Checker", "Structure Canvas"],
    eventTypes: ["READ", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Measure incoming and outgoing degree",
    objective: "Count directed edges separately at their source and target endpoints.",
    code: `
vertices = ["A", "B", "C", "D"]
edges = [("A", "B"), ("A", "C"), ("C", "B"), ("B", "D")]
out_degree = {vertex: 0 for vertex in vertices}
in_degree = {vertex: 0 for vertex in vertices}

for source, target in edges:
    out_degree[source] += 1
    in_degree[target] += 1

balanced_totals = sum(out_degree.values()) == sum(in_degree.values()) == len(edges)
print("Out degree:", out_degree)
print("In degree:", in_degree)
print("Result:", out_degree["A"] == 2 and in_degree["B"] == 2 and balanced_totals)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Directed degree measurement",
    phases: ["Initialize two counters per vertex", "Increment the source and target counters", "Verify both totals equal the edge count"],
    invariants: ["Total indegree and total outdegree both equal the number of directed edges"],
    edgeCases: ["A source can have zero indegree", "A sink can have zero outdegree"],
    comparisonGroup: "graph-degree",
    complexity: { time: "O(V + E)", space: "O(V)", note: "The program initializes every vertex and scans every directed edge once." },
    bestViews: ["Before and After", "Invariant Checker", "Variables"],
    eventTypes: ["VISIT_EDGE", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Preserve isolated vertices",
    objective: "Keep declared vertices visible even when they never appear in an edge.",
    difficulty: "Beginner",
    code: `
vertices = {"A", "B", "C", "D", "E"}
edges = [("A", "B"), ("B", "C")]
graph = {vertex: [] for vertex in vertices}

for left, right in edges:
    graph[left].append(right)
    graph[right].append(left)

isolated = sorted(vertex for vertex, neighbors in graph.items() if not neighbors)
connected_vertices = sorted(vertex for vertex, neighbors in graph.items() if neighbors)

print("Isolated:", isolated)
print("Connected vertices:", connected_vertices)
print("Result:", isolated == ["D", "E"] and connected_vertices == ["A", "B", "C"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "set"],
    algorithm: "Isolated-vertex detection",
    phases: ["Initialize every declared vertex", "Attach edges", "Select empty adjacency lists"],
    invariants: ["Edge construction never removes a declared vertex"],
    edgeCases: ["A graph can contain only isolated vertices"],
    comparisonGroup: "graph-boundaries",
    complexity: { time: "O(V + E)", space: "O(V + E)", note: "Construction scans edges and isolation checks scan all vertices." },
    bestViews: ["Structure Canvas", "Edge Case Lab", "Invariant Checker"],
    eventTypes: ["INSERT", "VISIT_EDGE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Recognize a self-loop",
    objective: "Detect an edge whose source and target are the same vertex.",
    difficulty: "Beginner",
    code: `
edges = [("A", "B"), ("B", "B"), ("B", "C"), ("C", "D")]
self_loops = []
ordinary_edges = []

for source, target in edges:
    if source == target:
        self_loops.append((source, target))
    else:
        ordinary_edges.append((source, target))

print("Self-loops:", self_loops)
print("Ordinary edges:", ordinary_edges)
print("Result:", self_loops == [("B", "B")] and len(ordinary_edges) == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array"],
    algorithm: "Self-loop detection",
    phases: ["Inspect each endpoint pair", "Compare source with target", "Separate self-loops from ordinary edges"],
    invariants: ["A self-loop has identical endpoints"],
    edgeCases: ["A self-loop contributes differently to degree depending on graph direction"],
    comparisonGroup: "graph-boundaries",
    complexity: { time: "O(E)", space: "O(E)", note: "Every edge is classified once and stored in one output list." },
    bestViews: ["Decisions", "Edge Case Lab", "Step Table"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Count parallel edges in a multigraph",
    objective: "Use normalized endpoint pairs to count repeated undirected connections.",
    code: `
edges = [("A", "B"), ("B", "A"), ("A", "B"), ("B", "C"), ("C", "B")]
counts = {}

for left, right in edges:
    key = tuple(sorted((left, right)))
    counts[key] = counts.get(key, 0) + 1

parallel = {edge: count for edge, count in counts.items() if count > 1}
simple_edge_count = len(counts)

print("Counts:", counts)
print("Parallel:", parallel)
print("Result:", parallel == {("A", "B"): 3, ("B", "C"): 2} and simple_edge_count == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Parallel-edge counting",
    phases: ["Normalize each undirected pair", "Count equal normalized edges", "Select multiplicities above one"],
    invariants: ["Reversing an undirected edge does not change its normalized key"],
    edgeCases: ["A simple graph forbids parallel edges", "Direction must not be normalized in a directed multigraph"],
    comparisonGroup: "graph-boundaries",
    complexity: { time: "O(E)", space: "O(E)", note: "Each edge contributes one hash-table update." },
    bestViews: ["Mutation Explorer", "Edge Case Lab", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "WRITE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Compare sparse and dense edge capacity",
    objective: "Relate an undirected graph's edge count to the maximum possible edge count.",
    difficulty: "Beginner",
    code: `
vertex_count = 6
sparse_edges = 5
dense_edges = 13
maximum_edges = vertex_count * (vertex_count - 1) // 2

sparse_ratio = sparse_edges / maximum_edges
dense_ratio = dense_edges / maximum_edges

classification = {
    "sparse": sparse_ratio < 0.5,
    "dense": dense_ratio >= 0.5,
}

print("Maximum edges:", maximum_edges)
print("Ratios:", round(sparse_ratio, 2), round(dense_ratio, 2))
print("Result:", maximum_edges == 15 and all(classification.values()))`,
    expectedResult: "Result: True",
    structureTypes: ["graph"],
    algorithm: "Undirected density comparison",
    phases: ["Calculate complete-graph capacity", "Normalize each edge count", "Compare the ratios with a stated teaching threshold"],
    invariants: ["A simple undirected graph has at most V(V-1)/2 edges"],
    edgeCases: ["Density labels depend on a declared threshold", "Self-loops change the capacity formula"],
    comparisonGroup: "sparse-dense-representation",
    complexity: { time: "O(1)", space: "O(1)", note: "The lesson compares supplied counts without enumerating edges." },
    bestViews: ["Complexity Lab", "Variables", "Edge Case Lab"],
    eventTypes: ["READ", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Convert an adjacency list to a matrix",
    objective: "Translate named neighbor relationships into indexed matrix cells.",
    code: `
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A"],
    "D": ["B"],
}
vertices = sorted(graph)
index = {vertex: position for position, vertex in enumerate(vertices)}
matrix = [[0] * len(vertices) for _ in vertices]

for source, neighbors in graph.items():
    for target in neighbors:
        matrix[index[source]][index[target]] = 1

row_a = matrix[index["A"]]
symmetrical = all(matrix[row][column] == matrix[column][row]
                  for row in range(len(vertices))
                  for column in range(len(vertices)))
print("Vertices:", vertices)
print("Matrix:", matrix)
print("Result:", row_a == [0, 1, 1, 0] and symmetrical)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Adjacency-list to matrix conversion",
    phases: ["Assign stable vertex indices", "Visit every adjacency entry", "Mark its indexed matrix cell"],
    invariants: ["Conversion preserves every directed adjacency entry"],
    edgeCases: ["Undirected symmetry depends on symmetric source data"],
    comparisonGroup: "graph-representation-conversion",
    complexity: { time: "O(V^2 + E)", space: "O(V^2)", note: "Matrix allocation is quadratic before adjacency entries are copied." },
    bestViews: ["Before and After", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Convert a matrix to an adjacency list",
    objective: "Scan matrix rows and recover each vertex's outgoing neighbors.",
    code: `
vertices = ["A", "B", "C", "D"]
matrix = [
    [0, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 0],
    [0, 1, 0, 0],
]
graph = {vertex: [] for vertex in vertices}

for row, source in enumerate(vertices):
    for column, target in enumerate(vertices):
        if matrix[row][column]:
            graph[source].append(target)

print("Graph:", graph)
print("Neighbors of B:", graph["B"])
print("Result:", graph["A"] == ["B", "C"] and graph["B"] == ["A", "D"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "hash-table"],
    algorithm: "Adjacency-matrix to list conversion",
    phases: ["Create empty neighbor lists", "Scan every matrix cell", "Append targets for marked cells"],
    invariants: ["Every nonzero cell becomes one adjacency entry"],
    edgeCases: ["Weighted matrices must preserve values rather than only truthiness"],
    comparisonGroup: "graph-representation-conversion",
    complexity: { time: "O(V^2)", space: "O(V + E)", note: "Every matrix cell is inspected even when the graph is sparse." },
    bestViews: ["Step Table", "Structure Canvas", "Complexity Lab"],
    eventTypes: ["VISIT_INDEX", "COMPARE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Convert an edge list to adjacency lists",
    objective: "Create both directions of an undirected adjacency list from endpoint pairs.",
    code: `
vertices = ["A", "B", "C", "D", "E"]
edges = [("A", "B"), ("A", "C"), ("C", "D"), ("D", "E")]
graph = {vertex: [] for vertex in vertices}

for left, right in edges:
    graph[left].append(right)
    graph[right].append(left)

for neighbors in graph.values():
    neighbors.sort()

entry_count = sum(len(neighbors) for neighbors in graph.values())
print("Graph:", graph)
print("Adjacency entries:", entry_count)
print("Result:", graph["D"] == ["C", "E"] and entry_count == 2 * len(edges))`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "hash-table"],
    algorithm: "Edge-list to undirected adjacency-list conversion",
    phases: ["Initialize all declared vertices", "Add two adjacency entries per edge", "Verify the doubled entry count"],
    invariants: ["Every undirected edge produces exactly two adjacency entries"],
    edgeCases: ["Parallel edges produce repeated adjacency entries unless deliberately deduplicated"],
    comparisonGroup: "graph-representation-conversion",
    complexity: { time: "O(V + E)", space: "O(V + E)", note: "Initialization scans vertices and construction scans edges once." },
    bestViews: ["Structure Canvas", "Invariant Checker", "Before and After"],
    eventTypes: ["VISIT_EDGE", "LINK", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Transpose a directed graph",
    objective: "Reverse every directed edge while preserving every declared vertex.",
    code: `
graph = {
    "A": ["B", "C"],
    "B": ["D"],
    "C": ["B"],
    "D": [],
    "E": [],
}
transpose = {vertex: [] for vertex in graph}

for source, targets in graph.items():
    for target in targets:
        transpose[target].append(source)

for targets in transpose.values():
    targets.sort()

print("Transpose:", transpose)
print("Incoming to B:", transpose["B"])
print("Result:", transpose["B"] == ["A", "C"] and transpose["E"] == [])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Directed-graph transpose",
    phases: ["Initialize every transposed vertex", "Reverse each source-target pair", "Inspect incoming-neighbor lists"],
    invariants: ["The transpose contains target to source exactly when the original contains source to target"],
    edgeCases: ["An isolated vertex remains present", "A self-loop reverses to itself"],
    comparisonGroup: "graph-direction",
    complexity: { time: "O(V + E)", space: "O(V + E)", note: "Every vertex and directed edge is copied once." },
    bestViews: ["Before and After", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "LINK", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Validate undirected adjacency symmetry",
    objective: "Report neighbor entries that do not have a matching reverse entry.",
    code: `
graph = {
    "A": ["B", "C"],
    "B": ["A"],
    "C": ["A", "D"],
    "D": [],
}
missing_reverse = []

for source, neighbors in graph.items():
    for target in neighbors:
        if source not in graph.get(target, []):
            missing_reverse.append((source, target))

is_valid = not missing_reverse
print("Missing reverse entries:", missing_reverse)
print("Valid undirected graph:", is_valid)
print("Result:", missing_reverse == [("C", "D")] and not is_valid)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Undirected representation validation",
    phases: ["Visit every stored adjacency", "Search for the reverse adjacency", "Collect representation defects"],
    invariants: ["Every undirected adjacency entry must have a reverse entry"],
    edgeCases: ["A missing target vertex is also invalid", "Parallel entries require a multiplicity policy"],
    comparisonGroup: "graph-validation",
    complexity: { time: "O(V + E * d) with list membership", space: "O(E)", note: "List membership can scan the target degree d for each adjacency entry." },
    bestViews: ["Invariant Checker", "Error Coach", "Step Table"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "REJECT", "RETURN_RESULT"],
  },
  {
    title: "Validate every edge endpoint",
    objective: "Detect edges that refer to a vertex outside the declared vertex set.",
    difficulty: "Beginner",
    code: `
vertices = {"A", "B", "C", "D"}
edges = [("A", "B"), ("B", "C"), ("C", "X"), ("D", "A")]
invalid_edges = []

for source, target in edges:
    source_known = source in vertices
    target_known = target in vertices
    if not source_known or not target_known:
        invalid_edges.append((source, target))

valid_edges = [edge for edge in edges if edge not in invalid_edges]
print("Invalid:", invalid_edges)
print("Valid:", valid_edges)
print("Result:", invalid_edges == [("C", "X")] and len(valid_edges) == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "set", "array"],
    algorithm: "Edge-endpoint validation",
    phases: ["Inspect one edge", "Check both endpoints against the vertex set", "Separate invalid records"],
    invariants: ["Every accepted edge has two declared endpoints"],
    edgeCases: ["A graph builder can reject or explicitly add an unknown endpoint"],
    comparisonGroup: "graph-validation",
    complexity: { time: "O(E)", space: "O(E)", note: "Hash-set membership checks both endpoints of every edge." },
    bestViews: ["Decisions", "Error Coach", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "REJECT", "RETURN_RESULT"],
  },
  {
    title: "Check whether a sequence is a walk",
    objective: "Verify that every consecutive vertex pair is connected by an edge.",
    difficulty: "Beginner",
    code: `
graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D"],
    "D": ["B", "C"],
}
candidate = ["A", "B", "D", "C", "A"]
checked_edges = []
is_walk = True

for source, target in zip(candidate, candidate[1:]):
    checked_edges.append((source, target))
    if target not in graph.get(source, []):
        is_walk = False
        break

print("Checked:", checked_edges)
print("Is walk:", is_walk)
print("Result:", is_walk and len(checked_edges) == len(candidate) - 1)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Walk validation",
    phases: ["Form consecutive vertex pairs", "Check each pair for adjacency", "Stop on a missing edge"],
    invariants: ["Every consecutive pair in a valid walk is an edge"],
    edgeCases: ["A one-vertex sequence is a length-zero walk"],
    comparisonGroup: "walk-trail-path",
    complexity: { time: "O(k * d) with list membership", space: "O(k)", note: "The program checks k consecutive pairs and stores them for inspection." },
    bestViews: ["Algorithm Path", "Decisions", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "REJECT", "RETURN_RESULT"],
  },
  {
    title: "Distinguish a trail from a walk",
    objective: "Confirm adjacency and reject a candidate that repeats an edge.",
    code: `
graph = {
    "A": ["B", "C"],
    "B": ["A", "C"],
    "C": ["A", "B", "D"],
    "D": ["C"],
}
candidate = ["A", "B", "C", "A", "C", "D"]
used_edges = set()
is_walk = True
is_trail = True

for source, target in zip(candidate, candidate[1:]):
    if target not in graph.get(source, []):
        is_walk = False
        is_trail = False
        break
    edge = tuple(sorted((source, target)))
    if edge in used_edges:
        is_trail = False
    used_edges.add(edge)

print("Used edges:", sorted(used_edges))
print("Walk and trail:", is_walk, is_trail)
print("Result:", is_walk and not is_trail)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "set"],
    algorithm: "Undirected trail validation",
    phases: ["Validate adjacency", "Normalize each traversed edge", "Reject repeated edges"],
    invariants: ["A trail is a walk with no repeated edge"],
    edgeCases: ["A trail may repeat a vertex", "Directed edges must not be normalized"],
    comparisonGroup: "walk-trail-path",
    complexity: { time: "O(k * d)", space: "O(k)", note: "Each of k steps checks adjacency and one hash-set edge key." },
    bestViews: ["Algorithm Path", "Edge Case Lab", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "REJECT", "RETURN_RESULT"],
  },
  {
    title: "Distinguish a simple path from a trail",
    objective: "Reject an otherwise valid trail when it revisits a vertex.",
    code: `
graph = {
    "A": ["B", "C"],
    "B": ["A", "C"],
    "C": ["A", "B", "D"],
    "D": ["C"],
}
candidate = ["A", "B", "C", "A"]
visited_vertices = set()
is_path = True

for index, vertex in enumerate(candidate):
    if vertex in visited_vertices:
        is_path = False
        break
    visited_vertices.add(vertex)
    if index and vertex not in graph[candidate[index - 1]]:
        is_path = False
        break

print("Visited before rejection:", sorted(visited_vertices))
print("Is simple path:", is_path)
print("Result:", not is_path and candidate[-1] == "A")`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "set"],
    algorithm: "Simple-path validation",
    phases: ["Check whether the vertex was seen", "Verify adjacency to the previous vertex", "Reject a repeated vertex or missing edge"],
    invariants: ["A simple path visits every vertex at most once"],
    edgeCases: ["A closed cycle repeats its starting vertex and is not a simple path under this definition"],
    comparisonGroup: "walk-trail-path",
    complexity: { time: "O(k * d)", space: "O(k)", note: "The path scan uses a visited set and adjacency-list membership." },
    bestViews: ["Algorithm Path", "Decisions", "Edge Case Lab"],
    eventTypes: ["VISIT_NODE", "VISIT_EDGE", "COMPARE", "REJECT", "RETURN_RESULT"],
  },
  {
    title: "Recognize a directed acyclic graph",
    objective: "Use a topological ordering as evidence that every directed edge moves forward.",
    code: `
vertices = ["plan", "shop", "cook", "eat"]
edges = [("plan", "shop"), ("plan", "cook"), ("shop", "cook"), ("cook", "eat")]
order = ["plan", "shop", "cook", "eat"]
position = {vertex: index for index, vertex in enumerate(order)}
violations = []

for source, target in edges:
    if position[source] >= position[target]:
        violations.append((source, target))

all_vertices_present = set(order) == set(vertices)
is_dag_evidence = all_vertices_present and not violations
print("Order:", order)
print("Violations:", violations)
print("Result:", is_dag_evidence)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Topological-order verification",
    phases: ["Map vertices to order positions", "Check every directed edge", "Accept when every edge moves forward"],
    invariants: ["A valid topological order places each source before its target"],
    edgeCases: ["An order missing a vertex is invalid", "A directed cycle has no valid topological order"],
    comparisonGroup: "topological-ordering",
    complexity: { time: "O(V + E)", space: "O(V)", note: "Position construction scans vertices and verification scans edges." },
    bestViews: ["Invariant Checker", "Algorithm Path", "Edge Case Lab"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Compare representation storage counts",
    objective: "Count adjacency-list entries and matrix cells for the same sparse graph.",
    code: `
vertices = ["A", "B", "C", "D", "E", "F"]
edges = [("A", "B"), ("B", "C"), ("C", "D"), ("D", "E"), ("E", "F")]
adjacency = {vertex: [] for vertex in vertices}

for left, right in edges:
    adjacency[left].append(right)
    adjacency[right].append(left)

list_entries = len(adjacency) + sum(len(neighbors) for neighbors in adjacency.values())
matrix_cells = len(vertices) * len(vertices)
edge_list_fields = len(edges) * 2

print("List entries:", list_entries)
print("Matrix cells:", matrix_cells)
print("Edge endpoint fields:", edge_list_fields)
print("Result:", list_entries == 16 and matrix_cells == 36 and edge_list_fields == 10)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Graph representation storage comparison",
    phases: ["Build adjacency lists", "Count representation units", "Compare counts for the same graph"],
    invariants: ["The comparison uses one unchanged vertex and edge set"],
    edgeCases: ["Field counts are teaching evidence, not byte-level memory measurements"],
    comparisonGroup: "sparse-dense-representation",
    complexity: { time: "O(V + E)", space: "O(V + E)", note: "The program builds an adjacency list and reports conceptual storage units, not physical bytes." },
    bestViews: ["Compare Algorithms", "Complexity Lab", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "INSERT", "READ", "RETURN_RESULT"],
  },
  {
    title: "Choose a representation for neighbor queries",
    objective: "Compare observed checks for adjacency-list and edge-list neighbor lookup.",
    code: `
vertices = list("ABCDEFGH")
edges = [("A", "B"), ("A", "C"), ("B", "D"), ("C", "E"), ("F", "G")]
adjacency = {vertex: [] for vertex in vertices}
for left, right in edges:
    adjacency[left].append(right)
    adjacency[right].append(left)

target = "A"
list_checks = 1
list_neighbors = list(adjacency[target])
edge_checks = 0
edge_neighbors = []
for left, right in edges:
    edge_checks += 1
    if left == target:
        edge_neighbors.append(right)
    elif right == target:
        edge_neighbors.append(left)

print("List neighbors:", sorted(list_neighbors))
print("Edge neighbors:", sorted(edge_neighbors))
print("Observed checks:", list_checks, edge_checks)
print("Result:", sorted(list_neighbors) == sorted(edge_neighbors) and list_checks < edge_checks)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Neighbor-query representation comparison",
    phases: ["Build the adjacency index", "Read one stored neighbor list", "Scan the edge list for the same answer"],
    invariants: ["Both representations describe the same graph and return equal neighbors"],
    edgeCases: ["One observed input does not prove physical speed or universal memory use"],
    comparisonGroup: "graph-representations",
    complexity: { time: "O(degree) versus O(E)", space: "O(V + E) versus O(E)", note: "Reviewed bounds are separate from the two observed check counters." },
    bestViews: ["Compare Algorithms", "Complexity Lab", "Step Table"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "READ", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
].map((program) => ({ ...program, section: "Graph structures and vocabulary" }));

/** Traversal lessons move from visits to paths, components, cycles, and grids. */
const traversalPrograms = [
  {
    title: "Traverse a graph breadth first",
    objective: "Use a queue to visit vertices in increasing distance from a start vertex.",
    difficulty: "Beginner",
    code: `
from collections import deque

graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
}
queue = deque(["A"])
visited = {"A"}
order = []

while queue:
    vertex = queue.popleft()
    order.append(vertex)
    for neighbor in graph[vertex]:
        if neighbor not in visited:
            visited.add(neighbor)
            queue.append(neighbor)

print("BFS order:", order)
print("Visited:", sorted(visited))
print("Result:", order == ["A", "B", "C", "D", "E", "F"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "queue", "hash-table", "set"],
    algorithm: "Breadth-first search",
    phases: ["Enqueue and mark the start", "Dequeue one frontier vertex", "Discover and enqueue unseen neighbors"],
    invariants: ["A vertex is enqueued at most once", "The queue processes nondecreasing distance layers"],
    edgeCases: ["Only the start component is visited"],
    comparisonGroup: "graph-traversal-orders",
    complexity: COST.graphLinear,
    bestViews: ["Algorithm Path", "Operation Journey", "Structure Canvas"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "MARK_VISITED", "VISIT_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Traverse a graph with recursive depth first search",
    objective: "Follow one unseen neighbor path deeply before returning to explore alternatives.",
    code: `
graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
}
visited = set()
order = []

def dfs(vertex):
    visited.add(vertex)
    order.append(vertex)
    for neighbor in graph[vertex]:
        if neighbor not in visited:
            dfs(neighbor)

dfs("A")
print("DFS order:", order)
print("Visited:", sorted(visited))
print("Result:", order == ["A", "B", "D", "E", "F", "C"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "set", "hash-table"],
    algorithm: "Recursive depth-first search",
    phases: ["Mark the current vertex", "Recurse into one unseen neighbor", "Return and continue remaining neighbors"],
    invariants: ["A marked vertex is never entered recursively again"],
    edgeCases: ["A deep graph can exceed Python's recursion limit"],
    comparisonGroup: "graph-traversal-orders",
    complexity: COST.graphLinear,
    bestViews: ["Calls and Recursion", "Algorithm Path", "Operation Journey"],
    eventTypes: ["VISIT_NODE", "MARK_VISITED", "ENTER_SUBPROBLEM", "VISIT_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Traverse a graph with an explicit stack",
    objective: "Implement depth-first traversal iteratively while controlling neighbor push order.",
    code: `
graph = {
    "A": ["B", "C"],
    "B": ["A", "D", "E"],
    "C": ["A", "F"],
    "D": ["B"],
    "E": ["B", "F"],
    "F": ["C", "E"],
}
stack = ["A"]
visited = set()
order = []

while stack:
    vertex = stack.pop()
    if vertex in visited:
        continue
    visited.add(vertex)
    order.append(vertex)
    for neighbor in reversed(graph[vertex]):
        if neighbor not in visited:
            stack.append(neighbor)

print("Iterative DFS:", order)
print("Result:", order == ["A", "B", "D", "E", "F", "C"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "stack", "set", "hash-table"],
    algorithm: "Iterative depth-first search",
    phases: ["Pop a pending vertex", "Skip it if already visited", "Push unseen neighbors in controlled order"],
    invariants: ["Only the first pop of a vertex adds it to the traversal order"],
    edgeCases: ["Mark-on-pop can place duplicate pending entries on the stack"],
    comparisonGroup: "graph-traversal-orders",
    complexity: COST.graphLinear,
    bestViews: ["Structure Canvas", "Operation Journey", "Step Table"],
    eventTypes: ["PUSH", "POP", "MARK_VISITED", "VISIT_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Reconstruct a path from BFS parents",
    objective: "Record who discovered each vertex and walk those parent links backward from a target.",
    code: `
from collections import deque

graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "E"],
    "D": ["B", "F"],
    "E": ["C", "F"],
    "F": ["D", "E"],
}
start, target = "A", "F"
queue = deque([start])
parent = {start: None}

while queue and target not in parent:
    vertex = queue.popleft()
    for neighbor in graph[vertex]:
        if neighbor not in parent:
            parent[neighbor] = vertex
            queue.append(neighbor)

path = []
current = target
while current is not None:
    path.append(current)
    current = parent[current]
path.reverse()

print("Parents:", parent)
print("Path:", path)
print("Result:", path == ["A", "B", "D", "F"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "queue", "hash-table", "array"],
    algorithm: "BFS path reconstruction",
    phases: ["Discover vertices and record parents", "Stop after reaching the target", "Follow parents backward and reverse"],
    invariants: ["Each parent edge connects a vertex to the previous BFS layer"],
    edgeCases: ["An unreachable target has no parent entry"],
    comparisonGroup: "unweighted-shortest-path",
    complexity: COST.graphLinear,
    bestViews: ["Algorithm Path", "References", "Before and After"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "MARK_VISITED", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Collect every reachable vertex",
    objective: "Return the start vertex's complete reachable set without assuming the graph is connected.",
    difficulty: "Beginner",
    code: `
graph = {
    0: [1, 2],
    1: [0, 3],
    2: [0],
    3: [1],
    4: [5],
    5: [4],
}
start = 0
pending = [start]
reachable = set()

while pending:
    vertex = pending.pop()
    if vertex in reachable:
        continue
    reachable.add(vertex)
    pending.extend(graph[vertex])

unreachable = set(graph) - reachable
print("Reachable:", sorted(reachable))
print("Unreachable:", sorted(unreachable))
print("Result:", reachable == {0, 1, 2, 3} and unreachable == {4, 5})`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "stack", "set", "hash-table"],
    algorithm: "Reachability search",
    phases: ["Seed the pending stack", "Mark and expand one reachable vertex", "Subtract the result from all vertices"],
    invariants: ["Every marked vertex has a path from the start"],
    edgeCases: ["The start alone is reachable in an isolated component"],
    comparisonGroup: "connectivity-methods",
    complexity: COST.graphLinear,
    bestViews: ["Algorithm Path", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["PUSH", "POP", "MARK_VISITED", "VISIT_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Count components with repeated DFS",
    objective: "Start a new traversal whenever the outer scan finds an unvisited vertex.",
    code: `
graph = {
    "A": ["B"],
    "B": ["A", "C"],
    "C": ["B"],
    "D": ["E"],
    "E": ["D"],
    "F": [],
}
visited = set()
components = []

for start in graph:
    if start in visited:
        continue
    component = []
    stack = [start]
    visited.add(start)
    while stack:
        vertex = stack.pop()
        component.append(vertex)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append(neighbor)
    components.append(sorted(component))

print("Components:", components)
print("Result:", components == [["A", "B", "C"], ["D", "E"], ["F"]])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "stack", "set", "array"],
    algorithm: "Connected-components search",
    phases: ["Scan for an unseen start", "Traverse its complete component", "Store the component and continue scanning"],
    invariants: ["Completed components are disjoint", "Visited vertices belong to exactly one stored component"],
    edgeCases: ["An isolated vertex creates a one-vertex component"],
    comparisonGroup: "connectivity-methods",
    complexity: COST.graphLinear,
    bestViews: ["Algorithm Path", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["VISIT_NODE", "MARK_VISITED", "PUSH", "POP", "RETURN_RESULT"],
  },
  {
    title: "Compare DFS and Union-Find component labels",
    objective: "Build components by traversal and by disjoint sets, then verify equal partitions.",
    difficulty: "Guided Challenge",
    code: `
vertices = list(range(7))
edges = [(0, 1), (1, 2), (3, 4), (4, 5)]
graph = {vertex: [] for vertex in vertices}
for left, right in edges:
    graph[left].append(right)
    graph[right].append(left)

dfs_groups = []
visited = set()
for start in vertices:
    if start in visited:
        continue
    stack = [start]
    visited.add(start)
    group = []
    while stack:
        vertex = stack.pop()
        group.append(vertex)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                stack.append(neighbor)
    dfs_groups.append(tuple(sorted(group)))

parent = list(range(len(vertices)))
def find(vertex):
    if parent[vertex] != vertex:
        parent[vertex] = find(parent[vertex])
    return parent[vertex]
for left, right in edges:
    left_root, right_root = find(left), find(right)
    if left_root != right_root:
        parent[right_root] = left_root

uf_groups = {}
for vertex in vertices:
    uf_groups.setdefault(find(vertex), []).append(vertex)
uf_partition = sorted(tuple(group) for group in uf_groups.values())
dfs_partition = sorted(dfs_groups)

print("DFS:", dfs_partition)
print("Union-Find:", uf_partition)
print("Result:", dfs_partition == uf_partition)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "union-find", "stack", "hash-table"],
    algorithm: "DFS versus Union-Find connectivity comparison",
    phases: ["Build components by repeated DFS", "Build components by unions", "Normalize and compare both partitions"],
    invariants: ["Both methods operate on the same unchanged vertex and edge sets"],
    edgeCases: ["Traversal answers graph reachability; Union-Find answers accumulated undirected connectivity"],
    comparisonGroup: "connectivity-methods",
    complexity: { time: "O(V + E) versus O((V + E) alpha(V))", space: "O(V + E)", note: "Both reviewed bounds are shown separately from this input's trace." },
    bestViews: ["Compare Algorithms", "Complexity Lab", "Invariant Checker"],
    eventTypes: ["MARK_VISITED", "VISIT_EDGE", "FIND", "UNION", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Detect a directed cycle with visit colors",
    objective: "Treat an edge to an active recursion-path vertex as evidence of a directed cycle.",
    code: `
graph = {
    "A": ["B"],
    "B": ["C", "D"],
    "C": ["A"],
    "D": ["E"],
    "E": [],
}
color = {vertex: "white" for vertex in graph}
cycle_edge = None

def visit(vertex):
    global cycle_edge
    color[vertex] = "gray"
    for neighbor in graph[vertex]:
        if color[neighbor] == "gray":
            cycle_edge = (vertex, neighbor)
            return True
        if color[neighbor] == "white" and visit(neighbor):
            return True
    color[vertex] = "black"
    return False

has_cycle = any(color[vertex] == "white" and visit(vertex) for vertex in graph)
print("Cycle edge:", cycle_edge)
print("Colors:", color)
print("Result:", has_cycle and cycle_edge == ("C", "A"))`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table"],
    algorithm: "Directed-cycle detection with DFS colors",
    phases: ["Mark a vertex active", "Inspect outgoing edges", "Detect an active neighbor or finish the vertex"],
    invariants: ["Gray vertices form the active recursion path", "Black vertices are completely explored"],
    edgeCases: ["An edge to a black vertex is not a back edge", "A self-loop is a cycle"],
    comparisonGroup: "directed-cycle-detection",
    complexity: COST.graphLinear,
    bestViews: ["Calls and Recursion", "Algorithm Path", "Invariant Checker"],
    eventTypes: ["VISIT_NODE", "VISIT_EDGE", "MARK_VISITED", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Detect an undirected cycle with parent tracking",
    objective: "Ignore the edge back to a DFS parent and detect any other visited neighbor.",
    code: `
graph = {
    0: [1],
    1: [0, 2, 3],
    2: [1, 3],
    3: [1, 2, 4],
    4: [3],
}
visited = set()
cycle_edge = None

def visit(vertex, parent):
    global cycle_edge
    visited.add(vertex)
    for neighbor in graph[vertex]:
        if neighbor == parent:
            continue
        if neighbor in visited:
            cycle_edge = (vertex, neighbor)
            return True
        if visit(neighbor, vertex):
            return True
    return False

has_cycle = visit(0, None)
print("Cycle edge:", cycle_edge)
print("Visited:", sorted(visited))
print("Result:", has_cycle and set(cycle_edge) == {1, 3})`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "set"],
    algorithm: "Undirected-cycle detection with DFS",
    phases: ["Mark the current vertex", "Skip only the parent edge", "Detect another visited neighbor or recurse"],
    invariants: ["The parent edge is not mistaken for a cycle"],
    edgeCases: ["Disconnected graphs require a DFS start in every component"],
    comparisonGroup: "undirected-cycle-detection",
    complexity: COST.graphLinear,
    bestViews: ["Calls and Recursion", "Algorithm Path", "Edge Case Lab"],
    eventTypes: ["VISIT_NODE", "VISIT_EDGE", "MARK_VISITED", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Check whether a graph is bipartite",
    objective: "Assign opposite colors across every edge and reject a same-color conflict.",
    code: `
from collections import deque

graph = {
    "A": ["B", "D"],
    "B": ["A", "C"],
    "C": ["B", "D"],
    "D": ["A", "C"],
    "E": [],
}
color = {}
conflict = None

for start in graph:
    if start in color:
        continue
    color[start] = 0
    queue = deque([start])
    while queue and conflict is None:
        vertex = queue.popleft()
        for neighbor in graph[vertex]:
            if neighbor not in color:
                color[neighbor] = 1 - color[vertex]
                queue.append(neighbor)
            elif color[neighbor] == color[vertex]:
                conflict = (vertex, neighbor)
                break

print("Colors:", color)
print("Conflict:", conflict)
print("Result:", conflict is None and color["A"] != color["B"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "queue", "hash-table"],
    algorithm: "Bipartite check with BFS",
    phases: ["Start one uncolored component", "Assign opposite neighbor colors", "Reject a same-color edge"],
    invariants: ["Every processed edge joins opposite colors"],
    edgeCases: ["Disconnected components need separate starts", "An odd cycle creates a conflict"],
    comparisonGroup: "graph-coloring",
    complexity: COST.graphLinear,
    bestViews: ["Decisions", "Algorithm Path", "Invariant Checker"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "VISIT_EDGE", "CHOOSE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Topologically sort with depth first search",
    objective: "Append each directed vertex after its descendants and reverse the finishing order.",
    code: `
graph = {
    "plan": ["shop", "invite"],
    "shop": ["cook"],
    "invite": ["eat"],
    "cook": ["eat"],
    "eat": [],
}
visited = set()
finishing = []

def visit(vertex):
    visited.add(vertex)
    for neighbor in graph[vertex]:
        if neighbor not in visited:
            visit(neighbor)
    finishing.append(vertex)

for vertex in graph:
    if vertex not in visited:
        visit(vertex)

order = list(reversed(finishing))
position = {vertex: index for index, vertex in enumerate(order)}
valid = all(position[source] < position[target]
            for source, targets in graph.items()
            for target in targets)
print("Topological order:", order)
print("Result:", valid and order[0] == "plan" and order[-1] == "eat")`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "stack", "set", "hash-table"],
    algorithm: "DFS topological sort",
    phases: ["Recursively explore descendants", "Append a finished vertex", "Reverse finishing order and validate"],
    invariants: ["A vertex is appended only after every reachable unvisited child"],
    edgeCases: ["A separate active-path check is required to reject directed cycles"],
    comparisonGroup: "topological-ordering",
    complexity: COST.graphLinear,
    bestViews: ["Calls and Recursion", "Algorithm Path", "Invariant Checker"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "PUSH", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Topologically sort with Kahn's algorithm",
    objective: "Repeatedly remove zero-indegree vertices and lower their neighbors' indegrees.",
    code: `
from collections import deque

graph = {
    "plan": ["shop", "invite"],
    "shop": ["cook"],
    "invite": ["eat"],
    "cook": ["eat"],
    "eat": [],
}
indegree = {vertex: 0 for vertex in graph}
for targets in graph.values():
    for target in targets:
        indegree[target] += 1

queue = deque(vertex for vertex in graph if indegree[vertex] == 0)
order = []
while queue:
    vertex = queue.popleft()
    order.append(vertex)
    for neighbor in graph[vertex]:
        indegree[neighbor] -= 1
        if indegree[neighbor] == 0:
            queue.append(neighbor)

is_dag = len(order) == len(graph)
print("Topological order:", order)
print("Final indegrees:", indegree)
print("Result:", is_dag and order[0] == "plan" and order[-1] == "eat")`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "queue", "hash-table"],
    algorithm: "Kahn topological sort",
    phases: ["Count every indegree", "Process one zero-indegree vertex", "Release neighbors that reach zero indegree"],
    invariants: ["The queue contains only vertices whose remaining indegree is zero"],
    edgeCases: ["Fewer than V outputs reveal a directed cycle"],
    comparisonGroup: "topological-ordering",
    complexity: COST.graphLinear,
    bestViews: ["Structure Canvas", "Step Table", "Invariant Checker"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "REMOVE", "VISIT_EDGE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Flood fill a connected grid region",
    objective: "Treat orthogonally adjacent equal-color cells as graph neighbors and recolor one component.",
    code: `
from collections import deque

grid = [
    [1, 1, 0, 0],
    [1, 0, 0, 1],
    [1, 1, 0, 1],
]
start = (0, 0)
old_color = grid[start[0]][start[1]]
new_color = 2
queue = deque([start])
grid[start[0]][start[1]] = new_color
changed = [start]

while queue:
    row, column = queue.popleft()
    for row_step, column_step in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        next_row = row + row_step
        next_column = column + column_step
        inside = 0 <= next_row < len(grid) and 0 <= next_column < len(grid[0])
        if inside and grid[next_row][next_column] == old_color:
            grid[next_row][next_column] = new_color
            changed.append((next_row, next_column))
            queue.append((next_row, next_column))

print("Changed:", changed)
print("Grid:", grid)
print("Result:", len(changed) == 5 and grid[1][3] == 1)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "queue"],
    algorithm: "Grid flood fill",
    phases: ["Recolor and enqueue the start", "Inspect four neighboring coordinates", "Recolor and enqueue matching unseen cells"],
    invariants: ["Every queued cell has already received the new color"],
    edgeCases: ["If old and new colors match, an explicit visited set prevents repeated work"],
    comparisonGroup: "grid-traversal",
    complexity: { time: "O(rows * columns)", space: "O(rows * columns)", note: "In the largest connected region every grid cell is visited and can enter the queue." },
    bestViews: ["Structure Canvas", "Algorithm Path", "Mutation Explorer"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "VISIT_NODE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Count islands in a binary grid",
    objective: "Start a flood fill at every unvisited land cell and count the resulting components.",
    code: `
grid = [
    [1, 1, 0, 0, 0],
    [1, 0, 0, 1, 1],
    [0, 0, 1, 0, 0],
    [1, 1, 0, 0, 1],
]
visited = set()
islands = 0
sizes = []

for row in range(len(grid)):
    for column in range(len(grid[0])):
        if grid[row][column] == 0 or (row, column) in visited:
            continue
        islands += 1
        size = 0
        stack = [(row, column)]
        visited.add((row, column))
        while stack:
            current_row, current_column = stack.pop()
            size += 1
            for row_step, column_step in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                next_cell = (current_row + row_step, current_column + column_step)
                inside = 0 <= next_cell[0] < len(grid) and 0 <= next_cell[1] < len(grid[0])
                if inside and grid[next_cell[0]][next_cell[1]] == 1 and next_cell not in visited:
                    visited.add(next_cell)
                    stack.append(next_cell)
        sizes.append(size)

print("Island sizes:", sizes)
print("Island count:", islands)
print("Result:", islands == 5 and sorted(sizes) == [1, 1, 2, 2, 3])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "stack", "set"],
    algorithm: "Grid connected-component counting",
    phases: ["Scan for unseen land", "Flood fill one island", "Record its size and resume scanning"],
    invariants: ["Every visited cell is land in exactly one counted island"],
    edgeCases: ["Diagonal cells are separate under four-direction adjacency"],
    comparisonGroup: "grid-traversal",
    complexity: { time: "O(rows * columns)", space: "O(rows * columns)", note: "Each cell is scanned and each land cell is visited at most once." },
    bestViews: ["Algorithm Path", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["VISIT_INDEX", "PUSH", "POP", "MARK_VISITED", "RETURN_RESULT"],
  },
  {
    title: "Measure distance from multiple sources",
    objective: "Seed BFS with every source so each vertex receives its nearest-source distance.",
    code: `
from collections import deque

graph = {
    0: [1],
    1: [0, 2, 4],
    2: [1, 3],
    3: [2, 5],
    4: [1, 5],
    5: [3, 4, 6],
    6: [5],
}
sources = [0, 6]
distance = {source: 0 for source in sources}
queue = deque(sources)

while queue:
    vertex = queue.popleft()
    for neighbor in graph[vertex]:
        if neighbor not in distance:
            distance[neighbor] = distance[vertex] + 1
            queue.append(neighbor)

print("Distances:", distance)
print("Middle distances:", distance[2], distance[4])
print("Result:", distance == {0: 0, 6: 0, 1: 1, 5: 1, 2: 2, 4: 2, 3: 2})`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "queue", "hash-table"],
    algorithm: "Multi-source breadth-first search",
    phases: ["Enqueue every source at distance zero", "Expand the nearest pending layer", "Assign each unseen neighbor once"],
    invariants: ["The first assigned distance is the nearest distance to any source"],
    edgeCases: ["Duplicate sources must not be enqueued as separate discoveries"],
    comparisonGroup: "unweighted-shortest-path",
    complexity: COST.graphLinear,
    bestViews: ["Step Table", "Algorithm Path", "Invariant Checker"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "MARK_VISITED", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Compute every unweighted distance from a start",
    objective: "Use BFS layers to assign the minimum edge count from one source.",
    code: `
from collections import deque

graph = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A", "D", "E"],
    "D": ["B", "C", "F"],
    "E": ["C"],
    "F": ["D"],
}
start = "A"
distance = {start: 0}
queue = deque([start])

while queue:
    vertex = queue.popleft()
    for neighbor in graph[vertex]:
        if neighbor not in distance:
            distance[neighbor] = distance[vertex] + 1
            queue.append(neighbor)

layers = {}
for vertex, steps in distance.items():
    layers.setdefault(steps, []).append(vertex)

print("Distance:", distance)
print("Layers:", layers)
print("Result:", distance["F"] == 3 and layers[2] == ["D", "E"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "queue", "hash-table"],
    algorithm: "Unweighted single-source shortest distances",
    phases: ["Assign the source distance", "Discover the next BFS layer", "Group vertices by final distance"],
    invariants: ["A vertex's first discovered BFS distance is minimal in an unweighted graph"],
    edgeCases: ["Unreachable vertices never receive a distance"],
    comparisonGroup: "unweighted-shortest-path",
    complexity: COST.graphLinear,
    bestViews: ["Algorithm Path", "Step Table", "Invariant Checker"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "VISIT_EDGE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Find a shortest route through a maze",
    objective: "Run BFS on passable grid cells and reconstruct one shortest coordinate path.",
    difficulty: "Guided Challenge",
    code: `
from collections import deque

maze = [
    "S...",
    ".##.",
    "...#",
    ".#..",
    "...T",
]
start = (0, 0)
target = (4, 3)
queue = deque([start])
parent = {start: None}

while queue and target not in parent:
    row, column = queue.popleft()
    for row_step, column_step in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        next_cell = (row + row_step, column + column_step)
        inside = 0 <= next_cell[0] < len(maze) and 0 <= next_cell[1] < len(maze[0])
        if inside and maze[next_cell[0]][next_cell[1]] != "#" and next_cell not in parent:
            parent[next_cell] = (row, column)
            queue.append(next_cell)

path = []
current = target
while current is not None:
    path.append(current)
    current = parent[current]
path.reverse()

print("Path:", path)
print("Moves:", len(path) - 1)
print("Result:", path[0] == start and path[-1] == target and len(path) - 1 == 7)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "queue", "hash-table"],
    algorithm: "Maze shortest path with BFS",
    phases: ["Discover passable cells by distance", "Record one parent per discovered cell", "Reconstruct the target route"],
    invariants: ["Every parent cell is one legal move closer to the start"],
    edgeCases: ["An unreachable target has no parent entry", "Several equally short routes can exist"],
    comparisonGroup: "grid-traversal",
    complexity: { time: "O(rows * columns)", space: "O(rows * columns)", note: "Each passable cell is discovered at most once and can enter the queue." },
    bestViews: ["Algorithm Path", "References", "Structure Canvas"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "VISIT_NODE", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Record BFS level boundaries",
    objective: "Process the queue one current layer at a time and preserve level groups.",
    code: `
from collections import deque

graph = {
    "A": ["B", "C"],
    "B": ["D", "E"],
    "C": ["F"],
    "D": [],
    "E": ["G"],
    "F": [],
    "G": [],
}
queue = deque(["A"])
visited = {"A"}
levels = []

while queue:
    level = []
    for _ in range(len(queue)):
        vertex = queue.popleft()
        level.append(vertex)
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    levels.append(level)

print("Levels:", levels)
print("Depth:", len(levels) - 1)
print("Result:", levels == [["A"], ["B", "C"], ["D", "E", "F"], ["G"]])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "queue", "array", "set"],
    algorithm: "BFS level grouping",
    phases: ["Measure the current queue layer", "Process exactly that many vertices", "Store the layer before continuing"],
    invariants: ["Vertices entering during a layer belong to the next layer"],
    edgeCases: ["A single start vertex produces one level"],
    comparisonGroup: "graph-traversal-orders",
    complexity: COST.graphLinear,
    bestViews: ["Step Table", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "VISIT_NODE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Compare BFS and DFS visit orders",
    objective: "Run both traversals on one graph and distinguish equal coverage from different order.",
    difficulty: "Guided Challenge",
    code: `
from collections import deque

graph = {
    "A": ["B", "C"],
    "B": ["D", "E"],
    "C": ["F"],
    "D": [],
    "E": ["F"],
    "F": [],
}

bfs_order = []
bfs_seen = {"A"}
queue = deque(["A"])
while queue:
    vertex = queue.popleft()
    bfs_order.append(vertex)
    for neighbor in graph[vertex]:
        if neighbor not in bfs_seen:
            bfs_seen.add(neighbor)
            queue.append(neighbor)

dfs_order = []
dfs_seen = set()
stack = ["A"]
while stack:
    vertex = stack.pop()
    if vertex in dfs_seen:
        continue
    dfs_seen.add(vertex)
    dfs_order.append(vertex)
    stack.extend(reversed(graph[vertex]))

print("BFS:", bfs_order)
print("DFS:", dfs_order)
print("Result:", set(bfs_order) == set(dfs_order) == set(graph) and bfs_order != dfs_order)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "queue", "stack", "set"],
    algorithm: "BFS versus DFS comparison",
    phases: ["Record queue-based breadth order", "Record stack-based depth order", "Compare coverage and sequence"],
    invariants: ["Both searches begin at the same vertex and use the same adjacency order"],
    edgeCases: ["Neighbor order can change either valid traversal sequence"],
    comparisonGroup: "graph-traversal-orders",
    complexity: { time: "O(V + E) for each traversal", space: "O(V)", note: "The program compares two linear traversals and reports observed orders." },
    bestViews: ["Compare Algorithms", "Algorithm Path", "Complexity Lab"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "PUSH", "POP", "MARK_VISITED", "RETURN_RESULT"],
  },
  {
    title: "Clone an adjacency-list graph",
    objective: "Create independent neighbor lists so later mutation does not change the original graph.",
    code: `
original = {
    "A": ["B", "C"],
    "B": ["A", "D"],
    "C": ["A"],
    "D": ["B"],
}
clone = {}

for vertex, neighbors in original.items():
    clone[vertex] = list(neighbors)

clone["A"].append("D")
clone["D"].append("A")

same_before_extra_edge = all(
    set(original[vertex]).issubset(set(clone[vertex]))
    for vertex in original
)
independent_lists = all(original[vertex] is not clone[vertex] for vertex in original)

print("Original A:", original["A"])
print("Clone A:", clone["A"])
print("Result:", same_before_extra_edge and independent_lists and "D" not in original["A"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table", "array"],
    algorithm: "Adjacency-list graph cloning",
    phases: ["Create one new neighbor list per vertex", "Copy every adjacency entry", "Mutate the clone and verify independence"],
    invariants: ["Cloned neighbor lists do not alias original neighbor lists"],
    edgeCases: ["Copying only the outer dictionary would leave shared lists"],
    comparisonGroup: "graph-updates",
    complexity: { time: "O(V + E)", space: "O(V + E)", note: "The clone allocates and copies every vertex list and adjacency entry." },
    bestViews: ["References", "Mutation Explorer", "Invariant Checker"],
    eventTypes: ["READ", "INSERT", "LINK", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
].map((program) => ({ ...program, section: "Graph traversal and connectivity" }));

/** Weighted-graph lessons separate relaxation evidence from reviewed bounds. */
const shortestPathPrograms = [
  {
    title: "Relax one weighted edge",
    objective: "Update a target distance only when traveling through the source produces a shorter candidate.",
    difficulty: "Beginner",
    code: `
infinity = float("inf")
distance = {"A": 0, "B": 7, "C": infinity}
edge = ("A", "B", 4)
source, target, weight = edge

candidate = distance[source] + weight
before = distance[target]
changed = False
if candidate < distance[target]:
    distance[target] = candidate
    changed = True

print("Before B:", before)
print("Candidate:", candidate)
print("After B:", distance[target])
print("Result:", changed and before == 7 and distance["B"] == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "hash-table"],
    algorithm: "Edge relaxation",
    phases: ["Read the source distance and edge weight", "Calculate a candidate target distance", "Keep the smaller known value"],
    invariants: ["Relaxation never increases a known distance"],
    edgeCases: ["An unreachable source cannot create a finite candidate"],
    comparisonGroup: "shortest-path-relaxation",
    complexity: { time: "O(1)", space: "O(1)", note: "One edge relaxation performs a fixed number of lookups and comparisons." },
    bestViews: ["Before and After", "Decisions", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "READ", "COMPARE", "RELAX_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Find weighted shortest distances with Dijkstra",
    objective: "Finalize nearest unsettled distance candidates in a graph with nonnegative weights.",
    code: `
import heapq

graph = {
    "A": [("B", 4), ("C", 2)],
    "B": [("D", 5)],
    "C": [("B", 1), ("D", 8)],
    "D": [],
}
distance = {vertex: float("inf") for vertex in graph}
distance["A"] = 0
heap = [(0, "A")]
settled = []

while heap:
    current_distance, vertex = heapq.heappop(heap)
    if current_distance != distance[vertex]:
        continue
    settled.append(vertex)
    for neighbor, weight in graph[vertex]:
        candidate = current_distance + weight
        if candidate < distance[neighbor]:
            distance[neighbor] = candidate
            heapq.heappush(heap, (candidate, neighbor))

print("Settled:", settled)
print("Distances:", distance)
print("Result:", distance == {"A": 0, "B": 3, "C": 2, "D": 8})`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "priority-queue", "hash-table"],
    algorithm: "Dijkstra shortest paths",
    phases: ["Pop the smallest current candidate", "Skip a stale candidate or settle the vertex", "Relax every outgoing edge"],
    invariants: ["A settled vertex has its final shortest distance when weights are nonnegative"],
    edgeCases: ["Negative weights invalidate the greedy finalization rule"],
    comparisonGroup: "single-source-shortest-path",
    complexity: COST.dijkstra,
    bestViews: ["Operation Journey", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["POP", "VISIT_NODE", "VISIT_EDGE", "RELAX_EDGE", "PUSH", "RETURN_RESULT"],
  },
  {
    title: "Skip stale Dijkstra heap entries",
    objective: "Recognize that a better later candidate can leave an obsolete pair inside the priority queue.",
    code: `
import heapq

graph = {
    "A": [("B", 10), ("C", 1)],
    "B": [("D", 1)],
    "C": [("B", 1), ("D", 10)],
    "D": [],
}
distance = {vertex: float("inf") for vertex in graph}
distance["A"] = 0
heap = [(0, "A")]
processed = []
stale = []

while heap:
    current_distance, vertex = heapq.heappop(heap)
    if current_distance != distance[vertex]:
        stale.append((current_distance, vertex))
        continue
    processed.append((current_distance, vertex))
    for neighbor, weight in graph[vertex]:
        candidate = current_distance + weight
        if candidate < distance[neighbor]:
            distance[neighbor] = candidate
            heapq.heappush(heap, (candidate, neighbor))

print("Processed:", processed)
print("Stale:", stale)
print("Result:", distance["D"] == 3 and (10, "B") in stale)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "priority-queue", "hash-table"],
    algorithm: "Dijkstra with lazy stale-entry removal",
    phases: ["Pop a heap candidate", "Compare it with the latest distance", "Skip stale work or relax outgoing edges"],
    invariants: ["Only the latest distance for a vertex may relax its edges"],
    edgeCases: ["A heap can contain several candidates for one vertex"],
    comparisonGroup: "dijkstra-implementation",
    complexity: COST.dijkstra,
    bestViews: ["Decisions", "Structure Canvas", "Step Table"],
    eventTypes: ["POP", "COMPARE", "REJECT", "RELAX_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Reconstruct a weighted shortest path",
    objective: "Store a predecessor whenever Dijkstra improves a distance and rebuild the target route.",
    code: `
import heapq

graph = {
    "A": [("B", 4), ("C", 2)],
    "B": [("D", 5), ("E", 9)],
    "C": [("B", 1), ("D", 8)],
    "D": [("E", 2)],
    "E": [],
}
start, target = "A", "E"
distance = {vertex: float("inf") for vertex in graph}
previous = {start: None}
distance[start] = 0
heap = [(0, start)]

while heap:
    current_distance, vertex = heapq.heappop(heap)
    if current_distance != distance[vertex]:
        continue
    for neighbor, weight in graph[vertex]:
        candidate = current_distance + weight
        if candidate < distance[neighbor]:
            distance[neighbor] = candidate
            previous[neighbor] = vertex
            heapq.heappush(heap, (candidate, neighbor))

path = []
current = target
while current is not None:
    path.append(current)
    current = previous[current]
path.reverse()

print("Path:", path)
print("Cost:", distance[target])
print("Result:", path == ["A", "C", "B", "D", "E"] and distance[target] == 10)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "priority-queue", "hash-table", "array"],
    algorithm: "Dijkstra path reconstruction",
    phases: ["Relax distances and predecessors", "Follow target predecessors backward", "Reverse and report the path"],
    invariants: ["Each predecessor edge explains the current best known distance"],
    edgeCases: ["An unreachable target has no predecessor and no finite route"],
    comparisonGroup: "single-source-shortest-path",
    complexity: COST.dijkstra,
    bestViews: ["References", "Algorithm Path", "Invariant Checker"],
    eventTypes: ["RELAX_EDGE", "LINK", "POP", "PUSH", "RETURN_RESULT"],
  },
  {
    title: "Keep unreachable distances explicit",
    objective: "Distinguish an unreachable vertex from a reachable vertex whose shortest distance is zero.",
    difficulty: "Beginner",
    code: `
import heapq

graph = {
    "A": [("B", 2)],
    "B": [("C", 3)],
    "C": [],
    "D": [("E", 1)],
    "E": [],
}
distance = {vertex: float("inf") for vertex in graph}
distance["A"] = 0
heap = [(0, "A")]

while heap:
    current_distance, vertex = heapq.heappop(heap)
    if current_distance != distance[vertex]:
        continue
    for neighbor, weight in graph[vertex]:
        candidate = current_distance + weight
        if candidate < distance[neighbor]:
            distance[neighbor] = candidate
            heapq.heappush(heap, (candidate, neighbor))

unreachable = sorted(vertex for vertex, cost in distance.items() if cost == float("inf"))
print("Distances:", distance)
print("Unreachable:", unreachable)
print("Result:", distance["A"] == 0 and unreachable == ["D", "E"])`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "priority-queue", "hash-table"],
    algorithm: "Unreachable shortest-path handling",
    phases: ["Initialize every distance to infinity", "Relax only the start component", "Select distances that remain infinite"],
    invariants: ["A finite distance is backed by a path from the source"],
    edgeCases: ["Zero is a valid source distance and must not mean unreachable"],
    comparisonGroup: "shortest-path-boundaries",
    complexity: COST.dijkstra,
    bestViews: ["Edge Case Lab", "Variables", "Invariant Checker"],
    eventTypes: ["READ", "RELAX_EDGE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Reject negative weights before Dijkstra",
    objective: "Validate the nonnegative-weight precondition instead of returning a misleading route.",
    code: `
edges = [
    ("A", "B", 4),
    ("A", "C", 2),
    ("C", "B", -3),
    ("B", "D", 5),
]
negative_edges = []

for source, target, weight in edges:
    if weight < 0:
        negative_edges.append((source, target, weight))

can_run_dijkstra = not negative_edges
recommendation = "Dijkstra" if can_run_dijkstra else "Bellman-Ford"

print("Negative edges:", negative_edges)
print("Recommended:", recommendation)
print("Result:", negative_edges == [("C", "B", -3)] and recommendation == "Bellman-Ford")`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array"],
    algorithm: "Dijkstra precondition validation",
    phases: ["Inspect every edge weight", "Collect negative edges", "Choose an algorithm compatible with the evidence"],
    invariants: ["Dijkstra is offered only when every edge weight is nonnegative"],
    edgeCases: ["A zero-weight edge is allowed", "A negative cycle needs additional detection"],
    comparisonGroup: "single-source-shortest-path",
    complexity: { time: "O(E)", space: "O(E)", note: "The validator scans all edges and stores any rejected records." },
    bestViews: ["Error Coach", "Edge Case Lab", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "REJECT", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Find shortest paths in a directed acyclic graph",
    objective: "Relax outgoing edges once in topological order, including a negative edge safely.",
    code: `
graph = {
    "A": [("B", 3), ("C", 6)],
    "B": [("C", 4), ("D", 4), ("E", 11)],
    "C": [("D", 8), ("G", 11)],
    "D": [("E", -4), ("F", 5), ("G", 2)],
    "E": [("H", 9)],
    "F": [("H", 1)],
    "G": [("H", 2)],
    "H": [],
}
topological_order = ["A", "B", "C", "D", "E", "F", "G", "H"]
distance = {vertex: float("inf") for vertex in graph}
distance["A"] = 0

for vertex in topological_order:
    if distance[vertex] == float("inf"):
        continue
    for neighbor, weight in graph[vertex]:
        candidate = distance[vertex] + weight
        if candidate < distance[neighbor]:
            distance[neighbor] = candidate

print("Distances:", distance)
print("Distance H:", distance["H"])
print("Result:", distance["E"] == 3 and distance["H"] == 11)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "hash-table"],
    algorithm: "DAG shortest paths",
    phases: ["Use a valid topological order", "Skip unreachable vertices", "Relax each outgoing edge once"],
    invariants: ["All incoming predecessors of a vertex are processed before it"],
    edgeCases: ["Negative edges are allowed because a DAG has no directed cycle"],
    comparisonGroup: "single-source-shortest-path",
    complexity: { time: "O(V + E)", space: "O(V)", note: "Topological ordering and one relaxation per edge give linear work." },
    bestViews: ["Algorithm Path", "Step Table", "Invariant Checker"],
    eventTypes: ["VISIT_NODE", "VISIT_EDGE", "RELAX_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Use Bellman-Ford with negative edges",
    objective: "Repeat full edge relaxation so improvements can travel through negative edges.",
    code: `
vertices = ["A", "B", "C", "D", "E"]
edges = [
    ("A", "B", 4),
    ("A", "C", 5),
    ("B", "C", -2),
    ("C", "D", 3),
    ("B", "E", 7),
    ("D", "E", 1),
]
distance = {vertex: float("inf") for vertex in vertices}
distance["A"] = 0
passes = 0

for _ in range(len(vertices) - 1):
    changed = False
    for source, target, weight in edges:
        if distance[source] == float("inf"):
            continue
        candidate = distance[source] + weight
        if candidate < distance[target]:
            distance[target] = candidate
            changed = True
    passes += 1
    if not changed:
        break

print("Distances:", distance)
print("Passes:", passes)
print("Result:", distance == {"A": 0, "B": 4, "C": 2, "D": 5, "E": 6})`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "hash-table"],
    algorithm: "Bellman-Ford shortest paths",
    phases: ["Initialize source and infinite distances", "Relax every edge for repeated passes", "Stop early after a pass with no improvement"],
    invariants: ["After k passes, shortest paths using at most k edges are represented"],
    edgeCases: ["An unreachable source endpoint cannot relax an edge"],
    comparisonGroup: "single-source-shortest-path",
    complexity: { time: "O(VE)", space: "O(V)", note: "The worst case performs V minus 1 full edge scans." },
    bestViews: ["Step Table", "Before and After", "Complexity Lab"],
    eventTypes: ["VISIT_EDGE", "RELAX_EDGE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Detect a reachable negative cycle",
    objective: "Run one extra Bellman-Ford scan and report an edge that can still improve.",
    code: `
vertices = ["A", "B", "C", "D"]
edges = [
    ("A", "B", 1),
    ("B", "C", -2),
    ("C", "B", -2),
    ("C", "D", 2),
]
distance = {vertex: float("inf") for vertex in vertices}
distance["A"] = 0

for _ in range(len(vertices) - 1):
    for source, target, weight in edges:
        if distance[source] != float("inf") and distance[source] + weight < distance[target]:
            distance[target] = distance[source] + weight

cycle_edge = None
for source, target, weight in edges:
    if distance[source] != float("inf") and distance[source] + weight < distance[target]:
        cycle_edge = (source, target, weight)
        break

print("Cycle evidence:", cycle_edge)
print("Distances not final:", distance)
print("Result:", cycle_edge is not None and set(cycle_edge[:2]) == {"B", "C"})`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "hash-table"],
    algorithm: "Bellman-Ford negative-cycle detection",
    phases: ["Perform V minus 1 relaxation passes", "Scan every edge once more", "Report a still-improving reachable edge"],
    invariants: ["Without a reachable negative cycle, no edge improves after V minus 1 passes"],
    edgeCases: ["A negative cycle unreachable from the source does not affect source distances"],
    comparisonGroup: "shortest-path-boundaries",
    complexity: { time: "O(VE)", space: "O(V)", note: "The algorithm adds one full edge scan after the standard relaxation passes." },
    bestViews: ["Error Coach", "Invariant Checker", "Edge Case Lab"],
    eventTypes: ["VISIT_EDGE", "RELAX_EDGE", "CHECK_INVARIANT", "REJECT", "RETURN_RESULT"],
  },
  {
    title: "Compute all-pairs distances with Floyd-Warshall",
    objective: "Allow each vertex in turn as an intermediate point between every ordered pair.",
    difficulty: "Guided Challenge",
    code: `
infinity = float("inf")
vertices = ["A", "B", "C", "D"]
distance = [
    [0, 3, infinity, 7],
    [8, 0, 2, infinity],
    [5, infinity, 0, 1],
    [2, infinity, infinity, 0],
]
snapshots = []

for middle in range(len(vertices)):
    changes = 0
    for source in range(len(vertices)):
        for target in range(len(vertices)):
            candidate = distance[source][middle] + distance[middle][target]
            if candidate < distance[source][target]:
                distance[source][target] = candidate
                changes += 1
    snapshots.append(changes)

print("Final matrix:", distance)
print("Changes per middle:", snapshots)
print("Result:", distance[0] == [0, 3, 5, 6] and distance[3][2] == 7)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "array", "dynamic-programming-table"],
    algorithm: "Floyd-Warshall all-pairs shortest paths",
    phases: ["Choose an allowed intermediate vertex", "Compare direct and through-middle routes", "Store every shorter pair distance"],
    invariants: ["After middle k, distances use only the first k vertices as intermediates"],
    edgeCases: ["A negative diagonal after completion indicates a negative cycle"],
    comparisonGroup: "all-pairs-shortest-path",
    complexity: { time: "O(V^3)", space: "O(V^2)", note: "Three nested vertex loops update one quadratic distance matrix." },
    bestViews: ["Step Table", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["VISIT_INDEX", "COMPARE", "RELAX_EDGE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Build a minimum spanning tree with Kruskal",
    objective: "Choose increasing-weight edges that connect different components.",
    code: `
vertices = list("ABCDE")
edges = [
    (1, "A", "B"),
    (2, "B", "C"),
    (3, "A", "C"),
    (4, "B", "D"),
    (5, "C", "D"),
    (6, "C", "E"),
    (7, "D", "E"),
]
parent = {vertex: vertex for vertex in vertices}
size = {vertex: 1 for vertex in vertices}

def find(vertex):
    if parent[vertex] != vertex:
        parent[vertex] = find(parent[vertex])
    return parent[vertex]

tree = []
total = 0
for weight, left, right in sorted(edges):
    left_root, right_root = find(left), find(right)
    if left_root == right_root:
        continue
    if size[left_root] < size[right_root]:
        left_root, right_root = right_root, left_root
    parent[right_root] = left_root
    size[left_root] += size[right_root]
    tree.append((left, right, weight))
    total += weight
    if len(tree) == len(vertices) - 1:
        break

print("Tree edges:", tree)
print("Total weight:", total)
print("Result:", len(tree) == 4 and total == 13)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "union-find", "array"],
    algorithm: "Kruskal minimum spanning tree",
    phases: ["Sort edges by weight", "Reject edges inside one component", "Union accepted endpoints until V minus 1 edges"],
    invariants: ["Accepted edges remain acyclic", "Every accepted edge is the lightest safe edge considered so far"],
    edgeCases: ["A disconnected graph produces a minimum spanning forest"],
    comparisonGroup: "minimum-spanning-tree",
    complexity: { time: "O(E log E)", space: "O(V + E)", note: "Edge sorting dominates near-constant Union-Find checks." },
    bestViews: ["Algorithm Path", "Structure Canvas", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "FIND", "COMPARE", "UNION", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Build a minimum spanning tree with Prim",
    objective: "Grow one connected tree by repeatedly choosing the lightest crossing edge.",
    code: `
import heapq

graph = {
    "A": [("B", 1), ("C", 3)],
    "B": [("A", 1), ("C", 2), ("D", 4)],
    "C": [("A", 3), ("B", 2), ("D", 5), ("E", 6)],
    "D": [("B", 4), ("C", 5), ("E", 7)],
    "E": [("C", 6), ("D", 7)],
}
visited = {"A"}
heap = [(weight, "A", target) for target, weight in graph["A"]]
heapq.heapify(heap)
tree = []
total = 0

while heap and len(visited) < len(graph):
    weight, source, target = heapq.heappop(heap)
    if target in visited:
        continue
    visited.add(target)
    tree.append((source, target, weight))
    total += weight
    for neighbor, next_weight in graph[target]:
        if neighbor not in visited:
            heapq.heappush(heap, (next_weight, target, neighbor))

print("Tree edges:", tree)
print("Total weight:", total)
print("Result:", len(tree) == 4 and total == 13)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "priority-queue", "set", "array"],
    algorithm: "Prim minimum spanning tree",
    phases: ["Seed crossing edges from one start", "Choose the lightest edge to an unseen vertex", "Add its outgoing crossing edges"],
    invariants: ["Visited vertices and accepted edges form one connected tree"],
    edgeCases: ["One run reaches only the start component in a disconnected graph"],
    comparisonGroup: "minimum-spanning-tree",
    complexity: { time: "O(E log V)", space: "O(V + E)", note: "The adjacency list and heap manage crossing-edge candidates." },
    bestViews: ["Structure Canvas", "Operation Journey", "Invariant Checker"],
    eventTypes: ["PUSH", "POP", "VISIT_EDGE", "CHOOSE", "MARK_VISITED", "RETURN_RESULT"],
  },
  {
    title: "Build a minimum spanning forest",
    objective: "Restart Prim's process at every unseen vertex to cover a disconnected weighted graph.",
    code: `
import heapq

graph = {
    "A": [("B", 1), ("C", 4)],
    "B": [("A", 1), ("C", 2)],
    "C": [("A", 4), ("B", 2)],
    "D": [("E", 3)],
    "E": [("D", 3)],
    "F": [],
}
visited = set()
forest = []
total = 0

for start in graph:
    if start in visited:
        continue
    visited.add(start)
    component_edges = []
    heap = [(weight, start, target) for target, weight in graph[start]]
    heapq.heapify(heap)
    while heap:
        weight, source, target = heapq.heappop(heap)
        if target in visited:
            continue
        visited.add(target)
        component_edges.append((source, target, weight))
        total += weight
        for neighbor, next_weight in graph[target]:
            if neighbor not in visited:
                heapq.heappush(heap, (next_weight, target, neighbor))
    forest.append(component_edges)

print("Forest:", forest)
print("Total weight:", total)
print("Result:", len(forest) == 3 and [len(tree) for tree in forest] == [2, 1, 0] and total == 6)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "priority-queue", "set", "array"],
    algorithm: "Prim minimum spanning forest",
    phases: ["Find an unseen component start", "Grow its minimum spanning tree", "Store the tree and continue the outer scan"],
    invariants: ["Each forest tree spans exactly one connected component"],
    edgeCases: ["An isolated vertex contributes an empty edge list"],
    comparisonGroup: "minimum-spanning-tree",
    complexity: { time: "O(E log V)", space: "O(V + E)", note: "Across all restarts, each vertex is marked once and edges enter bounded heaps." },
    bestViews: ["Algorithm Path", "Structure Canvas", "Edge Case Lab"],
    eventTypes: ["VISIT_NODE", "PUSH", "POP", "CHOOSE", "RETURN_RESULT"],
  },
  {
    title: "Compare Kruskal and Prim on one graph",
    objective: "Verify that two reviewed MST algorithms reach the same minimum total through different choices.",
    difficulty: "Guided Challenge",
    code: `
import heapq

vertices = list("ABCDE")
edges = [
    (1, "A", "B"), (2, "B", "C"), (3, "A", "C"),
    (4, "B", "D"), (5, "C", "D"), (6, "C", "E"), (7, "D", "E"),
]

parent = {vertex: vertex for vertex in vertices}
def find(vertex):
    if parent[vertex] != vertex:
        parent[vertex] = find(parent[vertex])
    return parent[vertex]

kruskal_edges = []
for weight, left, right in sorted(edges):
    left_root, right_root = find(left), find(right)
    if left_root != right_root:
        parent[right_root] = left_root
        kruskal_edges.append((left, right, weight))

graph = {vertex: [] for vertex in vertices}
for weight, left, right in edges:
    graph[left].append((right, weight))
    graph[right].append((left, weight))

visited = {"A"}
heap = [(weight, "A", target) for target, weight in graph["A"]]
heapq.heapify(heap)
prim_edges = []
while heap and len(visited) < len(vertices):
    weight, source, target = heapq.heappop(heap)
    if target in visited:
        continue
    visited.add(target)
    prim_edges.append((source, target, weight))
    for neighbor, next_weight in graph[target]:
        if neighbor not in visited:
            heapq.heappush(heap, (next_weight, target, neighbor))

kruskal_total = sum(edge[2] for edge in kruskal_edges)
prim_total = sum(edge[2] for edge in prim_edges)
print("Kruskal:", kruskal_edges, kruskal_total)
print("Prim:", prim_edges, prim_total)
print("Result:", len(kruskal_edges) == len(prim_edges) == 4 and kruskal_total == prim_total == 13)`,
    expectedResult: "Result: True",
    structureTypes: ["graph", "union-find", "priority-queue", "array"],
    algorithm: "Kruskal versus Prim comparison",
    phases: ["Build one MST from sorted global edges", "Build one MST from local crossing edges", "Compare edge counts and total weights"],
    invariants: ["Both algorithms use the same connected undirected weighted graph"],
    edgeCases: ["Equal weights can produce different valid MST edge sets with the same total"],
    comparisonGroup: "minimum-spanning-tree",
    complexity: { time: "O(E log E) versus O(E log V)", space: "O(V + E)", note: "The program reports equal observed totals while metadata preserves distinct reviewed strategies." },
    bestViews: ["Compare Algorithms", "Complexity Lab", "Invariant Checker"],
    eventTypes: ["FIND", "UNION", "PUSH", "POP", "CHOOSE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
].map((program) => ({ ...program, section: "Shortest paths and spanning trees" }));

/** Definitions remain ordered by the approved Chunk 4 curriculum sequence. */
const definitions = [
  ...unionFindPrograms,
  ...graphStructurePrograms,
  ...traversalPrograms,
  ...shortestPathPrograms,
];

/** Frozen Chunk 4 records continue identifiers from DSA-270 through DSA-337. */
export const DSA_CHUNK_FOUR_PROGRAMS = Object.freeze(
  definitions.map((definition, index) => makeProgram(definition, index)),
);
