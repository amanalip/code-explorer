/**
 * Code Explorer Data Structures and Algorithms curriculum, Chunk 3.
 *
 * This module adds 72 reviewed programs for trees, heaps, priority queues,
 * tries, and string-search algorithms. Each program is executable on its own
 * and carries the evidence metadata used by the catalog, learning views,
 * generated comments, comparison lab, and detached release validators.
 *
 * The records contain no learner data and perform no network activity.
 */

import { DSA_PROGRAM_REQUIRED_FIELDS } from "./dsa-contracts.js";

/** The three Chunk 3 sections and their approved Tier A counts. */
export const DSA_CHUNK_THREE_SECTIONS = Object.freeze([
  ["Trees and binary search trees", 30],
  ["Heaps and priority queues", 18],
  ["Tries and string algorithms", 24],
]);

/** Removes only outer template whitespace while preserving Python formatting. */
function cleanCode(source) {
  return source.replace(/^\n/, "").replace(/\s+$/, "");
}

/**
 * Builds one immutable program using the complete shared curriculum schema.
 *
 * @param {object} definition Reviewed metadata and executable Python source.
 * @param {number} index Zero-based index inside Chunk 3.
 * @returns {Readonly<object>} Complete record numbered after Chunk 2.
 */
function makeProgram(definition, index) {
  const record = {
    id: `dsa-${String(index + 198).padStart(3, "0")}`,
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
    if (!(field in record)) throw new Error(`Chunk 3 program ${record.id} is missing ${field}.`);
  }
  return Object.freeze(record);
}

/** Shared complexity notes keep equivalent operations described consistently. */
const COST = Object.freeze({
  treeLinear: { time: "O(n)", space: "O(h)", note: "The traversal visits up to n nodes and keeps at most tree height h active calls." },
  treeBreadth: { time: "O(n)", space: "O(w)", note: "The traversal visits each node once and the queue can hold tree width w." },
  bstHeight: { time: "O(h)", space: "O(1)", note: "The search follows one root-to-leaf path of height h; a skewed tree can make h equal n." },
  heapLog: { time: "O(log n)", space: "O(1)", note: "A heap update repairs one ancestor or descendant path." },
  heapBuild: { time: "O(n)", space: "O(1)", note: "Bottom-up heap construction is linear and mutates the supplied list." },
  trieWord: { time: "O(L)", space: "O(L)", note: "The operation follows or creates at most L characters of one word." },
  stringProduct: { time: "O(n * m)", space: "O(1)", note: "The direct search can compare a pattern of length m at each text position." },
});

/** Tree lessons progress from representation and traversal to complete BST updates. */
const treePrograms = [
  {
    title: "Name the parts of a binary tree",
    objective: "Represent a root, children, and leaves with nested dictionaries.",
    difficulty: "Beginner",
    code: `
tree = {
    "value": "A",
    "left": {"value": "B", "left": None, "right": None},
    "right": {"value": "C", "left": None, "right": None},
}

root_value = tree["value"]
left_value = tree["left"]["value"]
right_value = tree["right"]["value"]
leaves = [left_value, right_value]

print("Root:", root_value)
print("Children:", leaves)
print("Result:", root_value == "A" and leaves == ["B", "C"])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree", "hash-table"],
    algorithm: "Binary-tree representation",
    phases: ["Create the root record", "Connect two child records", "Read root and leaf values"],
    invariants: ["Every nonempty node has one value and two child fields"],
    edgeCases: ["An empty tree has no root", "A leaf has two empty child links"],
    complexity: { time: "O(1)", space: "O(1)", note: "The lesson creates and inspects a fixed three-node tree." },
    eventTypes: ["LINK", "READ", "RETURN_RESULT"],
  },
  {
    title: "Distinguish leaves from internal nodes",
    objective: "Classify binary-tree nodes by checking whether child links exist.",
    difficulty: "Beginner",
    code: `
tree = {
    "value": 8,
    "left": {"value": 3, "left": None, "right": None},
    "right": {"value": 10, "left": None, "right": None},
}

def is_leaf(node):
    return node is not None and node["left"] is None and node["right"] is None

root_is_leaf = is_leaf(tree)
left_is_leaf = is_leaf(tree["left"])
right_is_leaf = is_leaf(tree["right"])

print("Root leaf:", root_is_leaf)
print("Child leaves:", left_is_leaf, right_is_leaf)
print("Result:", not root_is_leaf and left_is_leaf and right_is_leaf)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Leaf classification",
    phases: ["Inspect the root", "Inspect both child links", "Classify leaves and internal nodes"],
    invariants: ["A leaf has no nonempty children"],
    edgeCases: ["None is not a leaf"],
    complexity: { time: "O(1)", space: "O(1)", note: "Each classification checks two child links." },
    eventTypes: ["READ", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Traverse a tree in preorder",
    objective: "Visit each node before recursively visiting its left and right subtrees.",
    code: `
tree = {
    "value": "A",
    "left": {"value": "B", "left": {"value": "D", "left": None, "right": None}, "right": None},
    "right": {"value": "C", "left": None, "right": {"value": "E", "left": None, "right": None}},
}

def preorder(node, visited):
    if node is None:
        return
    visited.append(node["value"])
    preorder(node["left"], visited)
    preorder(node["right"], visited)

order = []
preorder(tree, order)
print("Preorder:", order)
print("Result:", order == ["A", "B", "D", "C", "E"])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Recursive preorder traversal",
    phases: ["Visit the current node", "Traverse the left subtree", "Traverse the right subtree"],
    invariants: ["A node appears before every descendant in its traversal segment"],
    edgeCases: ["An empty subtree contributes no values"],
    comparisonGroup: "tree-traversal-orders",
    complexity: COST.treeLinear,
    bestViews: ["Calls and Recursion", "Operation Journey", "Structure Canvas"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Traverse a tree in inorder",
    objective: "Visit the left subtree, current node, and right subtree in that order.",
    code: `
tree = {
    "value": 4,
    "left": {"value": 2, "left": {"value": 1, "left": None, "right": None}, "right": {"value": 3, "left": None, "right": None}},
    "right": {"value": 6, "left": {"value": 5, "left": None, "right": None}, "right": {"value": 7, "left": None, "right": None}},
}

def inorder(node, visited):
    if node is None:
        return
    inorder(node["left"], visited)
    visited.append(node["value"])
    inorder(node["right"], visited)

order = []
inorder(tree, order)
print("Inorder:", order)
print("Result:", order == [1, 2, 3, 4, 5, 6, 7])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "Recursive inorder traversal",
    phases: ["Traverse the left subtree", "Visit the current node", "Traverse the right subtree"],
    invariants: ["A valid BST produces nondecreasing inorder values"],
    edgeCases: ["Duplicate-key policy determines whether equal values are valid"],
    comparisonGroup: "tree-traversal-orders",
    complexity: COST.treeLinear,
    bestViews: ["Calls and Recursion", "Operation Journey", "Invariant Checker"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Traverse a tree in postorder",
    objective: "Visit both child subtrees before processing their parent.",
    code: `
tree = {
    "value": "root",
    "left": {"value": "left", "left": None, "right": None},
    "right": {"value": "right", "left": None, "right": None},
}

def postorder(node, visited):
    if node is None:
        return
    postorder(node["left"], visited)
    postorder(node["right"], visited)
    visited.append(node["value"])

order = []
postorder(tree, order)
print("Postorder:", order)
print("Result:", order == ["left", "right", "root"])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Recursive postorder traversal",
    phases: ["Traverse the left subtree", "Traverse the right subtree", "Visit the current node"],
    invariants: ["Every child appears before its parent"],
    edgeCases: ["An empty tree produces an empty order"],
    comparisonGroup: "tree-traversal-orders",
    complexity: COST.treeLinear,
    bestViews: ["Calls and Recursion", "Operation Journey", "Structure Canvas"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Traverse a tree level by level",
    objective: "Use a queue to visit nodes in increasing depth order.",
    code: `
from collections import deque

tree = {
    "value": "A",
    "left": {"value": "B", "left": {"value": "D", "left": None, "right": None}, "right": None},
    "right": {"value": "C", "left": None, "right": {"value": "E", "left": None, "right": None}},
}

queue = deque([tree])
order = []
while queue:
    node = queue.popleft()
    order.append(node["value"])
    if node["left"] is not None:
        queue.append(node["left"])
    if node["right"] is not None:
        queue.append(node["right"])

print("Level order:", order)
print("Result:", order == ["A", "B", "C", "D", "E"])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree", "queue"],
    algorithm: "Breadth-first tree traversal",
    phases: ["Enqueue the root", "Dequeue and visit one node", "Enqueue its nonempty children"],
    invariants: ["The queue holds discovered nodes whose children are not processed"],
    edgeCases: ["An empty tree starts with an empty queue"],
    comparisonGroup: "tree-traversal-orders",
    complexity: COST.treeBreadth,
    bestViews: ["Operation Journey", "Structure Canvas", "Step Table"],
    eventTypes: ["ENQUEUE", "DEQUEUE", "VISIT_NODE", "RETURN_RESULT"],
  },
  {
    title: "Count every node recursively",
    objective: "Decompose tree size into the root plus the sizes of two subtrees.",
    code: `
tree = {
    "value": 10,
    "left": {"value": 5, "left": {"value": 2, "left": None, "right": None}, "right": None},
    "right": {"value": 15, "left": None, "right": {"value": 20, "left": None, "right": None}},
}

def count_nodes(node):
    if node is None:
        return 0
    left_count = count_nodes(node["left"])
    right_count = count_nodes(node["right"])
    return 1 + left_count + right_count

total = count_nodes(tree)
print("Node count:", total)
print("Result:", total == 5)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Recursive node count",
    phases: ["Stop at an empty link", "Count each subtree", "Add the current node"],
    invariants: ["Each nonempty node contributes exactly one"],
    edgeCases: ["An empty tree has size zero"],
    complexity: COST.treeLinear,
    bestViews: ["Calls and Recursion", "Before and After", "Complexity Lab"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Measure binary-tree height",
    objective: "Compute the longest root-to-leaf path through recursive subtree heights.",
    code: `
tree = {
    "value": 1,
    "left": {"value": 2, "left": {"value": 4, "left": None, "right": None}, "right": None},
    "right": {"value": 3, "left": None, "right": None},
}

def height(node):
    if node is None:
        return 0
    left_height = height(node["left"])
    right_height = height(node["right"])
    return 1 + max(left_height, right_height)

tree_height = height(tree)
print("Height:", tree_height)
print("Result:", tree_height == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Recursive tree height",
    phases: ["Measure the left subtree", "Measure the right subtree", "Extend the longer path"],
    invariants: ["The returned height is one plus the larger child height"],
    edgeCases: ["This lesson defines empty-tree height as zero"],
    comparisonGroup: "tree-shape-height",
    complexity: COST.treeLinear,
    bestViews: ["Calls and Recursion", "Before and After", "Complexity Lab"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "SOLVE_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Count the leaves of a tree",
    objective: "Recognize terminal nodes and combine leaf counts from both subtrees.",
    code: `
tree = {
    "value": "A",
    "left": {"value": "B", "left": None, "right": None},
    "right": {"value": "C", "left": {"value": "D", "left": None, "right": None}, "right": {"value": "E", "left": None, "right": None}},
}

def leaf_count(node):
    if node is None:
        return 0
    if node["left"] is None and node["right"] is None:
        return 1
    return leaf_count(node["left"]) + leaf_count(node["right"])

leaves = leaf_count(tree)
print("Leaves:", leaves)
print("Result:", leaves == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Recursive leaf count",
    phases: ["Reject empty links", "Recognize a leaf", "Combine child results"],
    invariants: ["Only nodes with no children contribute one"],
    edgeCases: ["A one-node tree has one leaf"],
    complexity: COST.treeLinear,
    bestViews: ["Calls and Recursion", "Decisions", "Structure Canvas"],
    eventTypes: ["VISIT_NODE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Sum values stored in a tree",
    objective: "Reduce a numeric tree by combining each value with two subtree totals.",
    code: `
tree = {
    "value": 8,
    "left": {"value": 3, "left": {"value": 1, "left": None, "right": None}, "right": {"value": 6, "left": None, "right": None}},
    "right": {"value": 10, "left": None, "right": None},
}

def tree_sum(node):
    if node is None:
        return 0
    left_total = tree_sum(node["left"])
    right_total = tree_sum(node["right"])
    return node["value"] + left_total + right_total

total = tree_sum(tree)
print("Tree sum:", total)
print("Result:", total == 28)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Recursive tree reduction",
    phases: ["Reduce the left subtree", "Reduce the right subtree", "Add the current value"],
    invariants: ["Every node value contributes exactly once"],
    edgeCases: ["An empty tree contributes zero"],
    complexity: COST.treeLinear,
    bestViews: ["Calls and Recursion", "Variables", "Before and After"],
    eventTypes: ["VISIT_NODE", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Find a value with depth-first search",
    objective: "Stop a recursive tree search as soon as either subtree finds the target.",
    code: `
tree = {
    "value": 7,
    "left": {"value": 4, "left": {"value": 2, "left": None, "right": None}, "right": None},
    "right": {"value": 11, "left": {"value": 9, "left": None, "right": None}, "right": None},
}
target = 9
visited = []

def contains(node, wanted):
    if node is None:
        return False
    visited.append(node["value"])
    if node["value"] == wanted:
        return True
    return contains(node["left"], wanted) or contains(node["right"], wanted)

found = contains(tree, target)
print("Visited:", visited)
print("Result:", found and visited[-1] == target)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Depth-first tree search",
    phases: ["Visit the current node", "Check the target", "Search remaining subtrees only if needed"],
    invariants: ["Visited contains exactly the nodes inspected before success"],
    edgeCases: ["A missing target can require visiting every node"],
    complexity: COST.treeLinear,
    bestViews: ["Algorithm Path", "Calls and Recursion", "Operation Journey"],
    eventTypes: ["VISIT_NODE", "COMPARE", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
  },
  {
    title: "Recover a root-to-node path",
    objective: "Use backtracking to keep only the branch that reaches a target node.",
    code: `
tree = {
    "value": "A",
    "left": {"value": "B", "left": {"value": "D", "left": None, "right": None}, "right": None},
    "right": {"value": "C", "left": {"value": "E", "left": None, "right": None}, "right": None},
}
path = []

def find_path(node, target):
    if node is None:
        return False
    path.append(node["value"])
    if node["value"] == target:
        return True
    if find_path(node["left"], target) or find_path(node["right"], target):
        return True
    path.pop()
    return False

found = find_path(tree, "E")
print("Path:", path)
print("Result:", found and path == ["A", "C", "E"])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree", "stack"],
    algorithm: "Tree-path backtracking",
    phases: ["Choose the current node", "Explore child branches", "Remove a failed choice"],
    invariants: ["Path contains the active root-to-current route"],
    edgeCases: ["A missing target empties the path after full backtracking"],
    complexity: COST.treeLinear,
    bestViews: ["Calls and Recursion", "Operation Journey", "Algorithm Path"],
    eventTypes: ["VISIT_NODE", "CHOOSE", "BACKTRACK", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Mirror a binary tree in place",
    objective: "Swap every node's left and right child links recursively.",
    code: `
tree = {
    "value": 1,
    "left": {"value": 2, "left": None, "right": None},
    "right": {"value": 3, "left": None, "right": None},
}

def mirror(node):
    if node is None:
        return
    node["left"], node["right"] = node["right"], node["left"]
    mirror(node["left"])
    mirror(node["right"])

before = [tree["left"]["value"], tree["right"]["value"]]
mirror(tree)
after = [tree["left"]["value"], tree["right"]["value"]]
print("Before:", before)
print("After:", after)
print("Result:", before == [2, 3] and after == [3, 2])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Recursive tree mirror",
    phases: ["Swap current child links", "Mirror the new left subtree", "Mirror the new right subtree"],
    invariants: ["Every completed subtree is the reflection of its original shape"],
    edgeCases: ["Empty and one-node trees remain unchanged"],
    complexity: COST.treeLinear,
    bestViews: ["Mutation Explorer", "References", "Calls and Recursion"],
    eventTypes: ["SWAP", "VISIT_NODE", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Compare two trees for equality",
    objective: "Require matching structure and values at every corresponding node.",
    code: `
left_tree = {
    "value": 5,
    "left": {"value": 3, "left": None, "right": None},
    "right": {"value": 8, "left": None, "right": None},
}
right_tree = {
    "value": 5,
    "left": {"value": 3, "left": None, "right": None},
    "right": {"value": 8, "left": None, "right": None},
}

def same_tree(left, right):
    if left is None or right is None:
        return left is right
    if left["value"] != right["value"]:
        return False
    return same_tree(left["left"], right["left"]) and same_tree(left["right"], right["right"])

equal = same_tree(left_tree, right_tree)
print("Structurally equal:", equal)
print("Result:", equal)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Recursive tree equality",
    phases: ["Compare empty-link shape", "Compare current values", "Compare both child pairs"],
    invariants: ["A true result means every corresponding subtree matched"],
    edgeCases: ["Equal values with different shapes are not equal trees"],
    complexity: { time: "O(n)", space: "O(h)", note: "The comparison visits corresponding nodes until a mismatch or completion." },
    bestViews: ["Calls and Recursion", "Decisions", "Invariant Checker"],
    eventTypes: ["COMPARE", "VISIT_NODE", "RETURN_RESULT"],
  },
  {
    title: "Check whether a tree is height balanced",
    objective: "Return height and detect imbalance in one bottom-up traversal.",
    code: `
tree = {
    "value": 1,
    "left": {"value": 2, "left": {"value": 3, "left": None, "right": None}, "right": None},
    "right": {"value": 4, "left": None, "right": None},
}

def checked_height(node):
    if node is None:
        return 0
    left_height = checked_height(node["left"])
    if left_height == -1:
        return -1
    right_height = checked_height(node["right"])
    if right_height == -1 or abs(left_height - right_height) > 1:
        return -1
    return 1 + max(left_height, right_height)

balanced = checked_height(tree) != -1
print("Balanced:", balanced)
print("Result:", balanced)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Bottom-up balance check",
    phases: ["Measure the left subtree", "Measure the right subtree", "Reject a height gap above one"],
    invariants: ["A nonnegative return is the height of a balanced subtree"],
    edgeCases: ["An empty tree is balanced"],
    complexity: COST.treeLinear,
    bestViews: ["Calls and Recursion", "Invariant Checker", "Decisions"],
    eventTypes: ["VISIT_NODE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Recognize a full binary tree",
    objective: "Verify that every node has either zero children or two children.",
    code: `
tree = {
    "value": 1,
    "left": {"value": 2, "left": None, "right": None},
    "right": {"value": 3, "left": None, "right": None},
}

def is_full(node):
    if node is None:
        return True
    left = node["left"]
    right = node["right"]
    if left is None and right is None:
        return True
    if left is None or right is None:
        return False
    return is_full(left) and is_full(right)

full = is_full(tree)
print("Full tree:", full)
print("Result:", full)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Full-tree validation",
    phases: ["Recognize a leaf", "Reject exactly one child", "Validate both complete child pairs"],
    invariants: ["No validated node has exactly one child"],
    edgeCases: ["The empty tree satisfies this structural definition"],
    complexity: COST.treeLinear,
    bestViews: ["Invariant Checker", "Decisions", "Calls and Recursion"],
    eventTypes: ["CHECK_INVARIANT", "COMPARE", "VISIT_NODE", "RETURN_RESULT"],
  },
  {
    title: "Recognize a complete binary tree",
    objective: "Use level order to ensure no real node appears after a missing child slot.",
    code: `
from collections import deque

tree = {
    "value": 1,
    "left": {"value": 2, "left": {"value": 4, "left": None, "right": None}, "right": None},
    "right": {"value": 3, "left": None, "right": None},
}

queue = deque([tree])
missing_seen = False
complete = True
while queue:
    node = queue.popleft()
    if node is None:
        missing_seen = True
        continue
    if missing_seen:
        complete = False
        break
    queue.append(node["left"])
    queue.append(node["right"])

print("Complete tree:", complete)
print("Result:", complete)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree", "queue"],
    algorithm: "Level-order completeness check",
    phases: ["Read nodes in level order", "Remember the first missing position", "Reject a later nonempty node"],
    invariants: ["After the first missing slot, every remaining queued slot must be empty"],
    edgeCases: ["A right child without a left sibling violates completeness"],
    complexity: COST.treeBreadth,
    bestViews: ["Invariant Checker", "Operation Journey", "Step Table"],
    eventTypes: ["DEQUEUE", "ENQUEUE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Serialize a tree with empty markers",
    objective: "Preserve both values and shape in a preorder text representation.",
    code: `
tree = {
    "value": "A",
    "left": {"value": "B", "left": None, "right": None},
    "right": {"value": "C", "left": None, "right": None},
}
tokens = []

def serialize(node):
    if node is None:
        tokens.append("#")
        return
    tokens.append(node["value"])
    serialize(node["left"])
    serialize(node["right"])

serialize(tree)
encoded = ",".join(tokens)
print("Serialized:", encoded)
print("Result:", encoded == "A,B,#,#,C,#,#")`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree", "python-list"],
    algorithm: "Preorder tree serialization",
    phases: ["Write a value token", "Serialize the left subtree", "Serialize the right subtree"],
    invariants: ["Every empty child position contributes one marker"],
    edgeCases: ["An empty tree serializes to one empty marker"],
    comparisonGroup: "tree-serialization",
    complexity: { time: "O(n)", space: "O(n)", note: "The traversal writes value and empty-link tokens for the complete shape." },
    bestViews: ["Calls and Recursion", "Operation Journey", "Variables"],
    eventTypes: ["VISIT_NODE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Deserialize a preorder tree",
    objective: "Rebuild the exact tree shape by consuming serialized tokens once.",
    code: `
tokens = iter("A,B,#,#,C,#,#".split(","))

def deserialize():
    token = next(tokens)
    if token == "#":
        return None
    node = {"value": token, "left": None, "right": None}
    node["left"] = deserialize()
    node["right"] = deserialize()
    return node

tree = deserialize()
root = tree["value"]
children = [tree["left"]["value"], tree["right"]["value"]]
leaf_links_empty = tree["left"]["left"] is None and tree["right"]["right"] is None

print("Root:", root)
print("Children:", children)
print("Result:", root == "A" and children == ["B", "C"] and leaf_links_empty)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-tree"],
    algorithm: "Preorder tree deserialization",
    phases: ["Consume one token", "Create or stop at an empty link", "Rebuild both child subtrees"],
    invariants: ["Each recursive call consumes exactly one serialized subtree"],
    edgeCases: ["Malformed or incomplete token streams need separate validation"],
    comparisonGroup: "tree-serialization",
    complexity: { time: "O(n)", space: "O(h)", note: "Each encoded node or empty marker is consumed once." },
    bestViews: ["Calls and Recursion", "Mutation Explorer", "References"],
    eventTypes: ["READ", "LINK", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Insert keys into a binary search tree",
    objective: "Follow ordered child links and attach each new key at an empty position.",
    code: `
def insert(node, value):
    if node is None:
        return {"value": value, "left": None, "right": None}
    if value < node["value"]:
        node["left"] = insert(node["left"], value)
    elif value > node["value"]:
        node["right"] = insert(node["right"], value)
    return node

root = None
for value in [8, 3, 10, 1, 6, 14]:
    root = insert(root, value)

left_branch = [root["left"]["value"], root["left"]["right"]["value"]]
right_branch = [root["right"]["value"], root["right"]["right"]["value"]]
print("Left branch:", left_branch)
print("Right branch:", right_branch)
print("Result:", left_branch == [3, 6] and right_branch == [10, 14])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "Recursive BST insertion",
    phases: ["Compare with the current key", "Choose one child direction", "Attach at the first empty link"],
    invariants: ["Every left key is smaller and every right key is larger under the no-duplicate policy"],
    edgeCases: ["This implementation ignores duplicate keys"],
    comparisonGroup: "bst-core-operations",
    complexity: { time: "O(h) per insertion", space: "O(h)", note: "Each insertion follows one tree path; h depends on tree shape." },
    bestViews: ["Structure Canvas", "Calls and Recursion", "Invariant Checker"],
    eventTypes: ["COMPARE", "VISIT_NODE", "INSERT", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Search a binary search tree iteratively",
    objective: "Discard one ordered subtree after every comparison.",
    code: `
tree = {
    "value": 8,
    "left": {"value": 3, "left": {"value": 1, "left": None, "right": None}, "right": {"value": 6, "left": None, "right": None}},
    "right": {"value": 10, "left": None, "right": {"value": 14, "left": None, "right": None}},
}
target = 6
current = tree
path = []

while current is not None:
    path.append(current["value"])
    if target == current["value"]:
        break
    if target < current["value"]:
        current = current["left"]
    else:
        current = current["right"]

found = current is not None
print("Search path:", path)
print("Result:", found and path == [8, 3, 6])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "Iterative BST search",
    phases: ["Compare at the current node", "Choose the only possible subtree", "Stop on match or empty link"],
    invariants: ["If the target exists, it remains inside the chosen subtree"],
    edgeCases: ["A missing target ends at an empty child link"],
    comparisonGroup: "bst-core-operations",
    complexity: COST.bstHeight,
    bestViews: ["Algorithm Path", "Decisions", "Watches"],
    eventTypes: ["COMPARE", "VISIT_NODE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Find the minimum BST key",
    objective: "Follow left child links until no smaller descendant can exist.",
    difficulty: "Beginner",
    code: `
tree = {
    "value": 8,
    "left": {"value": 3, "left": {"value": 1, "left": None, "right": None}, "right": {"value": 6, "left": None, "right": None}},
    "right": {"value": 10, "left": None, "right": None},
}

current = tree
path = []
while current["left"] is not None:
    path.append(current["value"])
    current = current["left"]
path.append(current["value"])

minimum = current["value"]
print("Left path:", path)
print("Result:", minimum == 1)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST minimum",
    phases: ["Start at the root", "Follow each left link", "Return the leftmost key"],
    invariants: ["No visited node has a smaller key outside its left subtree"],
    edgeCases: ["The tree must be nonempty"],
    comparisonGroup: "bst-extremes",
    complexity: COST.bstHeight,
    bestViews: ["Algorithm Path", "Watches", "Structure Canvas"],
    eventTypes: ["VISIT_NODE", "READ", "RETURN_RESULT"],
  },
  {
    title: "Find the maximum BST key",
    objective: "Follow right child links until no larger descendant can exist.",
    difficulty: "Beginner",
    code: `
tree = {
    "value": 8,
    "left": {"value": 3, "left": None, "right": None},
    "right": {"value": 10, "left": None, "right": {"value": 14, "left": None, "right": None}},
}

current = tree
path = []
while current["right"] is not None:
    path.append(current["value"])
    current = current["right"]
path.append(current["value"])

maximum = current["value"]
print("Right path:", path)
print("Result:", maximum == 14)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST maximum",
    phases: ["Start at the root", "Follow each right link", "Return the rightmost key"],
    invariants: ["No visited node has a larger key outside its right subtree"],
    edgeCases: ["The tree must be nonempty"],
    comparisonGroup: "bst-extremes",
    complexity: COST.bstHeight,
    bestViews: ["Algorithm Path", "Watches", "Structure Canvas"],
    eventTypes: ["VISIT_NODE", "READ", "RETURN_RESULT"],
  },
  {
    title: "Confirm sorted BST inorder output",
    objective: "Connect the BST ordering rule with a nondecreasing traversal result.",
    code: `
tree = {
    "value": 5,
    "left": {"value": 2, "left": {"value": 1, "left": None, "right": None}, "right": {"value": 4, "left": None, "right": None}},
    "right": {"value": 8, "left": {"value": 7, "left": None, "right": None}, "right": {"value": 9, "left": None, "right": None}},
}

def inorder(node, values):
    if node is None:
        return
    inorder(node["left"], values)
    values.append(node["value"])
    inorder(node["right"], values)

values = []
inorder(tree, values)
ordered = all(values[index] < values[index + 1] for index in range(len(values) - 1))
print("Inorder values:", values)
print("Result:", ordered and values == [1, 2, 4, 5, 7, 8, 9])`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST inorder ordering check",
    phases: ["Collect inorder values", "Compare adjacent keys", "Confirm strict increase"],
    invariants: ["A no-duplicate BST has a strictly increasing inorder sequence"],
    edgeCases: ["A local parent-child check alone cannot prove the global BST rule"],
    comparisonGroup: "bst-validation",
    complexity: { time: "O(n)", space: "O(n)", note: "The traversal and adjacent check are linear and the explicit value list stores n keys." },
    bestViews: ["Invariant Checker", "Operation Journey", "Variables"],
    eventTypes: ["VISIT_NODE", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Validate a BST with inherited bounds",
    objective: "Carry every ancestor restriction into recursive subtree validation.",
    code: `
tree = {
    "value": 8,
    "left": {"value": 3, "left": {"value": 1, "left": None, "right": None}, "right": {"value": 6, "left": None, "right": None}},
    "right": {"value": 10, "left": {"value": 9, "left": None, "right": None}, "right": {"value": 14, "left": None, "right": None}},
}

def valid_bst(node, lower, upper):
    if node is None:
        return True
    value = node["value"]
    if not lower < value < upper:
        return False
    left_valid = valid_bst(node["left"], lower, value)
    right_valid = valid_bst(node["right"], value, upper)
    return left_valid and right_valid

valid = valid_bst(tree, float("-inf"), float("inf"))
print("Valid BST:", valid)
print("Result:", valid)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "Range-based BST validation",
    phases: ["Check the inherited range", "Tighten the upper bound on the left", "Tighten the lower bound on the right"],
    invariants: ["Each node key lies inside every ancestor-imposed bound"],
    edgeCases: ["Duplicate handling requires an explicit inclusive or exclusive policy"],
    comparisonGroup: "bst-validation",
    complexity: COST.treeLinear,
    bestViews: ["Invariant Checker", "Calls and Recursion", "Watches"],
    eventTypes: ["COMPARE", "CHECK_INVARIANT", "VISIT_NODE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Delete a leaf from a BST",
    objective: "Remove a matched BST node that has no children.",
    code: `
def delete(node, target):
    if node is None:
        return None
    if target < node["value"]:
        node["left"] = delete(node["left"], target)
    elif target > node["value"]:
        node["right"] = delete(node["right"], target)
    else:
        if node["left"] is None:
            return node["right"]
        if node["right"] is None:
            return node["left"]
    return node

tree = {"value": 8, "left": {"value": 3, "left": None, "right": None}, "right": {"value": 10, "left": None, "right": None}}
tree = delete(tree, 3)
print("Left child:", tree["left"])
print("Result:", tree["left"] is None and tree["right"]["value"] == 10)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST leaf deletion",
    phases: ["Search for the target", "Replace the leaf with its empty child", "Reconnect the returned subtree"],
    invariants: ["All remaining keys keep their original ordering"],
    edgeCases: ["Deleting a missing key leaves the tree unchanged"],
    comparisonGroup: "bst-deletion-cases",
    complexity: { time: "O(h)", space: "O(h)", note: "Recursive deletion follows one search path and reconnects it while returning." },
    bestViews: ["Mutation Explorer", "References", "Calls and Recursion"],
    eventTypes: ["COMPARE", "VISIT_NODE", "REMOVE", "UNLINK", "RETURN_RESULT"],
  },
  {
    title: "Delete a BST node with one child",
    objective: "Promote the only child when removing a one-child BST node.",
    code: `
def delete(node, target):
    if node is None:
        return None
    if target < node["value"]:
        node["left"] = delete(node["left"], target)
    elif target > node["value"]:
        node["right"] = delete(node["right"], target)
    else:
        if node["left"] is None:
            return node["right"]
        if node["right"] is None:
            return node["left"]
    return node

tree = {
    "value": 8,
    "left": {"value": 3, "left": None, "right": {"value": 6, "left": None, "right": None}},
    "right": {"value": 10, "left": None, "right": None},
}
tree = delete(tree, 3)
print("Promoted child:", tree["left"]["value"])
print("Result:", tree["left"]["value"] == 6)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST one-child deletion",
    phases: ["Find the target", "Return its only child", "Reconnect the promoted subtree"],
    invariants: ["Promotion preserves every remaining key's ancestor bounds"],
    edgeCases: ["The only child can be on either side"],
    comparisonGroup: "bst-deletion-cases",
    complexity: { time: "O(h)", space: "O(h)", note: "The recursive search and reconnection follow a path of height h." },
    bestViews: ["Mutation Explorer", "References", "Invariant Checker"],
    eventTypes: ["COMPARE", "REMOVE", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Delete a BST node with two children",
    objective: "Replace a two-child node with its inorder successor and remove the duplicate successor.",
    code: `
def minimum(node):
    while node["left"] is not None:
        node = node["left"]
    return node

def delete(node, target):
    if node is None:
        return None
    if target < node["value"]:
        node["left"] = delete(node["left"], target)
    elif target > node["value"]:
        node["right"] = delete(node["right"], target)
    else:
        if node["left"] is None:
            return node["right"]
        if node["right"] is None:
            return node["left"]
        successor = minimum(node["right"])
        node["value"] = successor["value"]
        node["right"] = delete(node["right"], successor["value"])
    return node

tree = {"value": 8, "left": {"value": 3, "left": None, "right": None}, "right": {"value": 10, "left": {"value": 9, "left": None, "right": None}, "right": None}}
tree = delete(tree, 8)
print("New root:", tree["value"])
print("Result:", tree["value"] == 9 and tree["right"]["left"] is None)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST two-child deletion",
    phases: ["Find the target", "Copy the smallest right-subtree key", "Delete the successor from its old position"],
    invariants: ["The replacement key is larger than every left key and no larger than remaining right keys"],
    edgeCases: ["The inorder successor can be the immediate right child"],
    comparisonGroup: "bst-deletion-cases",
    complexity: { time: "O(h)", space: "O(h)", note: "Search and successor removal stay within tree height h." },
    bestViews: ["Mutation Explorer", "Invariant Checker", "Calls and Recursion"],
    eventTypes: ["COMPARE", "READ", "WRITE", "REMOVE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Find a lowest common ancestor in a BST",
    objective: "Use ordered keys to locate the first node where two search paths split.",
    code: `
tree = {
    "value": 8,
    "left": {"value": 3, "left": {"value": 1, "left": None, "right": None}, "right": {"value": 6, "left": None, "right": None}},
    "right": {"value": 10, "left": None, "right": {"value": 14, "left": None, "right": None}},
}
first = 1
second = 6
current = tree
path = []

while current is not None:
    path.append(current["value"])
    if first < current["value"] and second < current["value"]:
        current = current["left"]
    elif first > current["value"] and second > current["value"]:
        current = current["right"]
    else:
        break

ancestor = current["value"]
print("Search path:", path)
print("Result:", ancestor == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST lowest common ancestor",
    phases: ["Compare both keys with the current key", "Move while both lie on one side", "Stop where their paths split"],
    invariants: ["Both target keys remain inside the current subtree"],
    edgeCases: ["One target can itself be the lowest common ancestor"],
    complexity: COST.bstHeight,
    bestViews: ["Algorithm Path", "Decisions", "Watches"],
    eventTypes: ["COMPARE", "VISIT_NODE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Find a BST predecessor",
    objective: "Track the best smaller key while following a BST search path.",
    code: `
tree = {
    "value": 8,
    "left": {"value": 3, "left": {"value": 1, "left": None, "right": None}, "right": {"value": 6, "left": None, "right": None}},
    "right": {"value": 10, "left": None, "right": None},
}
target = 7
current = tree
predecessor = None
path = []

while current is not None:
    path.append(current["value"])
    if current["value"] < target:
        predecessor = current["value"]
        current = current["right"]
    else:
        current = current["left"]

print("Search path:", path)
print("Predecessor:", predecessor)
print("Result:", predecessor == 6)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST predecessor search",
    phases: ["Compare the current key", "Save a smaller candidate", "Search for a closer candidate"],
    invariants: ["Predecessor is the largest smaller key seen so far"],
    edgeCases: ["The minimum key has no predecessor"],
    comparisonGroup: "bst-neighbors",
    complexity: COST.bstHeight,
    bestViews: ["Watches", "Algorithm Path", "Before and After"],
    eventTypes: ["COMPARE", "VISIT_NODE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Find a BST successor",
    objective: "Track the best larger key while following a BST search path.",
    code: `
tree = {
    "value": 8,
    "left": {"value": 3, "left": None, "right": {"value": 6, "left": None, "right": None}},
    "right": {"value": 10, "left": None, "right": {"value": 14, "left": None, "right": None}},
}
target = 9
current = tree
successor = None
path = []

while current is not None:
    path.append(current["value"])
    if current["value"] > target:
        successor = current["value"]
        current = current["left"]
    else:
        current = current["right"]

print("Search path:", path)
print("Successor:", successor)
print("Result:", successor == 10)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST successor search",
    phases: ["Compare the current key", "Save a larger candidate", "Search for a closer candidate"],
    invariants: ["Successor is the smallest larger key seen so far"],
    edgeCases: ["The maximum key has no successor"],
    comparisonGroup: "bst-neighbors",
    complexity: COST.bstHeight,
    bestViews: ["Watches", "Algorithm Path", "Before and After"],
    eventTypes: ["COMPARE", "VISIT_NODE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Select the kth smallest BST key",
    objective: "Use inorder traversal order to stop at the requested rank.",
    code: `
tree = {
    "value": 5,
    "left": {"value": 3, "left": {"value": 2, "left": None, "right": None}, "right": {"value": 4, "left": None, "right": None}},
    "right": {"value": 8, "left": {"value": 7, "left": None, "right": None}, "right": None},
}
k = 4
ordered = []

def inorder(node):
    if node is None or len(ordered) >= k:
        return
    inorder(node["left"])
    if len(ordered) < k:
        ordered.append(node["value"])
    inorder(node["right"])

inorder(tree)
answer = ordered[k - 1]
print("Visited in order:", ordered)
print("Result:", answer == 5)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree", "python-list"],
    algorithm: "Kth-smallest inorder selection",
    phases: ["Traverse smaller keys", "Append the current key", "Stop after rank k is reached"],
    invariants: ["Collected keys are the smallest visited keys in sorted order"],
    edgeCases: ["k must be between one and the number of nodes"],
    complexity: { time: "O(h + k)", space: "O(h + k)", note: "The traversal can stop after reaching k values but still follows tree height h." },
    bestViews: ["Calls and Recursion", "Watches", "Algorithm Path"],
    eventTypes: ["VISIT_NODE", "READ", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Build a balanced BST from sorted values",
    objective: "Choose middle values recursively so subtree heights stay close.",
    code: `
values = [1, 2, 3, 4, 5, 6, 7]

def build_balanced(start, end):
    if start >= end:
        return None
    middle = (start + end) // 2
    node = {"value": values[middle], "left": None, "right": None}
    node["left"] = build_balanced(start, middle)
    node["right"] = build_balanced(middle + 1, end)
    return node

tree = build_balanced(0, len(values))
root = tree["value"]
children = [tree["left"]["value"], tree["right"]["value"]]
print("Root:", root)
print("Children:", children)
print("Result:", root == 4 and children == [2, 6])`,
    expectedResult: "Result: True",
    structureTypes: ["array", "tree", "binary-search-tree"],
    algorithm: "Sorted-array to balanced BST",
    phases: ["Choose a middle key", "Build the left range", "Build the right range"],
    invariants: ["Each subtree receives a contiguous sorted range"],
    edgeCases: ["An empty range produces an empty subtree"],
    comparisonGroup: "tree-shape-height",
    complexity: { time: "O(n)", space: "O(log n)", note: "Each key becomes one node and balanced recursion uses logarithmic depth." },
    bestViews: ["Calls and Recursion", "Structure Canvas", "References"],
    eventTypes: ["ENTER_SUBPROBLEM", "INSERT", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Compare balanced and skewed BST heights",
    objective: "Connect insertion order with tree height and worst-case search depth.",
    code: `
def insert(node, value):
    if node is None:
        return {"value": value, "left": None, "right": None}
    if value < node["value"]:
        node["left"] = insert(node["left"], value)
    else:
        node["right"] = insert(node["right"], value)
    return node

def height(node):
    if node is None:
        return 0
    return 1 + max(height(node["left"]), height(node["right"]))

balanced = None
for value in [4, 2, 6, 1, 3, 5, 7]:
    balanced = insert(balanced, value)

skewed = None
for value in [1, 2, 3, 4, 5, 6, 7]:
    skewed = insert(skewed, value)

balanced_height = height(balanced)
skewed_height = height(skewed)
print("Heights:", balanced_height, skewed_height)
print("Result:", balanced_height == 3 and skewed_height == 7)`,
    expectedResult: "Result: True",
    structureTypes: ["tree", "binary-search-tree"],
    algorithm: "BST shape comparison",
    phases: ["Build from balanced order", "Build from sorted order", "Compare resulting heights"],
    invariants: ["Both trees contain the same keys and preserve BST ordering"],
    edgeCases: ["An unbalanced ordinary BST offers no logarithmic-height guarantee"],
    comparisonGroup: "tree-shape-height",
    complexity: { time: "O(n^2) for the skewed build", space: "O(n)", note: "Sorted insertion creates a height-n tree and repeated path walks can total quadratic work." },
    bestViews: ["Compare Algorithms", "Complexity Lab", "Invariant Checker"],
    eventTypes: ["INSERT", "COMPARE", "VISIT_NODE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
/*
 * Four sound candidate lessons overlap stronger lessons in this release.
 * Keeping them outside the exported curriculum protects the exact 30-program
 * contract while preserving the reviewed drafts for a later investigation or
 * guided-challenge decision. They never appear in the learner catalog.
 */
].filter((program) => ![
  "Distinguish leaves from internal nodes",
  "Sum values stored in a tree",
  "Recognize a full binary tree",
  "Find a BST predecessor",
].includes(program.title)).map((program) => ({
  ...program,
  section: "Trees and binary search trees",
}));

/** Heap lessons make array shape, repair operations, and queue policies visible. */
const heapPrograms = [
  {
    title: "Map heap indices to family relationships",
    objective: "Derive parent and child positions from a zero-based heap index.",
    difficulty: "Beginner",
    code: `
heap = [2, 5, 4, 9, 7, 8]
index = 1

parent_index = (index - 1) // 2
left_index = 2 * index + 1
right_index = 2 * index + 2

parent = heap[parent_index]
current = heap[index]
children = [heap[left_index], heap[right_index]]

print("Parent:", parent)
print("Current:", current)
print("Children:", children)
print("Result:", parent == 2 and current == 5 and children == [9, 7])`,
    expectedResult: "Result: True",
    structureTypes: ["array", "heap"],
    algorithm: "Heap index relationships",
    phases: ["Choose an array index", "Calculate parent and child indices", "Read the related values"],
    invariants: ["Heap shape is encoded by contiguous array positions"],
    edgeCases: ["The root has no parent", "A node near the end may have fewer than two children"],
    complexity: { time: "O(1)", space: "O(1)", note: "Index arithmetic and direct list access use constant work." },
    bestViews: ["Structure Canvas", "Watches", "Variables"],
    eventTypes: ["READ", "VISIT_INDEX", "RETURN_RESULT"],
  },
  {
    title: "Turn a list into a min-heap",
    objective: "Apply bottom-up heap construction and inspect the minimum at the root.",
    difficulty: "Beginner",
    code: `
import heapq

values = [9, 4, 7, 1, 3, 6]
before = values.copy()
heapq.heapify(values)

root = values[0]
valid = True
for child in range(1, len(values)):
    parent = (child - 1) // 2
    if values[parent] > values[child]:
        valid = False

print("Before:", before)
print("Heap array:", values)
print("Root:", root)
print("Result:", valid and root == 1)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list", "heap"],
    algorithm: "Bottom-up min-heap construction",
    phases: ["Start with an arbitrary array", "Repair parent-child ordering bottom up", "Check the root and heap rule"],
    invariants: ["Every parent key is no greater than its child keys"],
    edgeCases: ["Heap order does not mean the complete array is sorted"],
    comparisonGroup: "heap-construction",
    complexity: COST.heapBuild,
    bestViews: ["Structure Canvas", "Invariant Checker", "Mutation Explorer"],
    eventTypes: ["PUSH", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Push a value into a min-heap",
    objective: "Insert at the end and let the new value rise until heap order returns.",
    difficulty: "Beginner",
    code: `
import heapq

heap = [2, 5, 4, 9, 7, 8]
inserted = 1
before = heap.copy()
heapq.heappush(heap, inserted)

valid = all(
    heap[(child - 1) // 2] <= heap[child]
    for child in range(1, len(heap))
)

print("Before:", before)
print("After push:", heap)
print("Root:", heap[0])
print("Result:", valid and heap[0] == 1 and len(heap) == 7)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list", "heap"],
    algorithm: "Min-heap insertion",
    phases: ["Append the new value", "Compare it with ancestors", "Stop when heap order holds"],
    invariants: ["All parent keys are no greater than their children after repair"],
    edgeCases: ["Pushing into an empty heap creates the root"],
    comparisonGroup: "heap-updates",
    complexity: COST.heapLog,
    bestViews: ["Structure Canvas", "Mutation Explorer", "Invariant Checker"],
    eventTypes: ["PUSH", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Pop the minimum from a heap",
    objective: "Remove the root and observe how the remaining values restore heap order.",
    difficulty: "Beginner",
    code: `
import heapq

heap = [1, 3, 2, 9, 7, 8, 4]
before = heap.copy()
minimum = heapq.heappop(heap)

valid = all(
    heap[(child - 1) // 2] <= heap[child]
    for child in range(1, len(heap))
)

print("Before:", before)
print("Removed:", minimum)
print("Remaining heap:", heap)
print("Result:", minimum == 1 and valid and len(heap) == 6)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list", "heap"],
    algorithm: "Min-heap root removal",
    phases: ["Remove the root", "Move the last value to the root", "Repair downward until heap order holds"],
    invariants: ["The removed value is the minimum and the remaining array is a heap"],
    edgeCases: ["Popping an empty heap raises IndexError"],
    comparisonGroup: "heap-updates",
    complexity: COST.heapLog,
    bestViews: ["Structure Canvas", "Mutation Explorer", "Invariant Checker"],
    eventTypes: ["POP", "REMOVE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Peek without changing a heap",
    objective: "Read the minimum root while preserving every heap element.",
    difficulty: "Beginner",
    code: `
import heapq

heap = [7, 2, 9, 4]
heapq.heapify(heap)
before = heap.copy()

minimum = heap[0] if heap else None
after = heap.copy()

print("Minimum:", minimum)
print("Unchanged:", before == after)
print("Result:", minimum == 2 and before == after)`,
    expectedResult: "Result: True",
    structureTypes: ["python-list", "heap", "priority-queue"],
    algorithm: "Safe heap peek",
    phases: ["Check whether the heap is empty", "Read index zero", "Confirm no mutation occurred"],
    invariants: ["Peeking does not change length or order"],
    edgeCases: ["An empty heap needs an explicit fallback"],
    complexity: { time: "O(1)", space: "O(1)", note: "The minimum is stored at index zero and no repair occurs." },
    bestViews: ["Before and After", "Mutation Explorer", "Structure Canvas"],
    eventTypes: ["PEEK", "READ", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Simulate a max-heap with negative priorities",
    objective: "Transform keys so Python's min-heap removes the largest original value first.",
    code: `
import heapq

values = [4, 9, 2, 7, 5]
max_heap = []
for value in values:
    heapq.heappush(max_heap, -value)

descending = []
while max_heap:
    descending.append(-heapq.heappop(max_heap))

print("Descending:", descending)
print("Result:", descending == [9, 7, 5, 4, 2])`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue", "python-list"],
    algorithm: "Negated-key max-heap",
    phases: ["Negate and push every value", "Pop the smallest transformed key", "Undo negation for descending output"],
    invariants: ["The smallest stored negative represents the largest original value"],
    edgeCases: ["Priority transformation must be reversed exactly once"],
    comparisonGroup: "heap-order-directions",
    complexity: { time: "O(n log n)", space: "O(n)", note: "n pushes and n pops each perform logarithmic heap repair." },
    bestViews: ["Operation Journey", "Structure Canvas", "Variables"],
    eventTypes: ["PUSH", "POP", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Find the kth smallest value with a heap",
    objective: "Remove the minimum exactly k times to reveal the requested rank.",
    code: `
import heapq

values = [9, 4, 7, 1, 3, 6]
k = 3
heap = values.copy()
heapq.heapify(heap)
removed = []

for _ in range(k):
    removed.append(heapq.heappop(heap))

answer = removed[-1]
print("Removed in order:", removed)
print("Remaining heap:", heap)
print("Result:", answer == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue", "python-list"],
    algorithm: "Kth-smallest heap selection",
    phases: ["Build a min-heap", "Pop k ordered minima", "Return the last removed value"],
    invariants: ["Removed contains the smallest values in nondecreasing order"],
    edgeCases: ["k must be between one and the input length"],
    comparisonGroup: "top-k-selection",
    complexity: { time: "O(n + k log n)", space: "O(n)", note: "Heapify is linear, followed by k logarithmic removals." },
    bestViews: ["Operation Journey", "Step Table", "Complexity Lab"],
    eventTypes: ["PUSH", "POP", "RETURN_RESULT"],
  },
  {
    title: "Keep the k largest values in a min-heap",
    objective: "Maintain only the best k candidates while scanning a longer sequence.",
    code: `
import heapq

values = [5, 1, 9, 3, 14, 7, 11]
k = 3
largest = []

for value in values:
    if len(largest) < k:
        heapq.heappush(largest, value)
    elif value > largest[0]:
        heapq.heapreplace(largest, value)

answer = sorted(largest, reverse=True)
print("Heap candidates:", largest)
print("Largest values:", answer)
print("Result:", answer == [14, 11, 9])`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue", "python-list"],
    algorithm: "Bounded top-k min-heap",
    phases: ["Fill up to k candidates", "Compare later values with the smallest candidate", "Replace only when a better value arrives"],
    invariants: ["The heap contains the k largest values seen so far"],
    edgeCases: ["If k exceeds input length, every input value remains"],
    comparisonGroup: "top-k-selection",
    complexity: { time: "O(n log k)", space: "O(k)", note: "The bounded heap performs logarithmic work in k for accepted candidates." },
    bestViews: ["Invariant Checker", "Operation Journey", "Complexity Lab"],
    eventTypes: ["COMPARE", "PUSH", "POP", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Report a running kth largest value",
    objective: "Update a fixed-size heap after each reading and report its current root.",
    code: `
import heapq

stream = [4, 5, 8, 2, 10, 9]
k = 3
leaders = []
reports = []

for value in stream:
    heapq.heappush(leaders, value)
    if len(leaders) > k:
        heapq.heappop(leaders)
    reports.append(leaders[0] if len(leaders) == k else None)

print("Reports:", reports)
print("Final leaders:", sorted(leaders, reverse=True))
print("Result:", reports == [None, None, 4, 4, 5, 8])`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue"],
    algorithm: "Streaming kth-largest tracker",
    phases: ["Push the new reading", "Remove one excess candidate", "Report the smallest retained leader"],
    invariants: ["After k readings, the root is the kth largest value seen"],
    edgeCases: ["No kth-largest value exists before k readings"],
    comparisonGroup: "top-k-selection",
    complexity: { time: "O(n log k)", space: "O(k)", note: "Each stream item triggers at most one bounded push and pop." },
    bestViews: ["Step Table", "Watches", "Invariant Checker"],
    eventTypes: ["PUSH", "POP", "PEEK", "RETURN_RESULT"],
  },
  {
    title: "Schedule jobs by priority",
    objective: "Store priority and job name together so the smallest priority number runs first.",
    difficulty: "Beginner",
    code: `
import heapq

jobs = []
heapq.heappush(jobs, (3, "write notes"))
heapq.heappush(jobs, (1, "fix outage"))
heapq.heappush(jobs, (2, "review code"))

run_order = []
while jobs:
    priority, name = heapq.heappop(jobs)
    run_order.append((priority, name))

print("Run order:", run_order)
print("Result:", [name for _, name in run_order] == ["fix outage", "review code", "write notes"])`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue"],
    algorithm: "Tuple priority queue",
    phases: ["Push priority-item pairs", "Pop the smallest priority", "Repeat until no jobs remain"],
    invariants: ["The root pair has the smallest lexicographic priority key"],
    edgeCases: ["Equal priorities compare later tuple fields unless a tie policy is added"],
    comparisonGroup: "priority-queue-policies",
    complexity: { time: "O(n log n)", space: "O(n)", note: "The demonstration pushes and pops n queued jobs." },
    bestViews: ["Operation Journey", "Structure Canvas", "Step Table"],
    eventTypes: ["PUSH", "POP", "RETURN_RESULT"],
  },
  {
    title: "Keep equal-priority jobs stable",
    objective: "Add an insertion counter so equal priorities preserve arrival order.",
    code: `
import heapq

jobs = []
arrival = 0
for priority, name in [(2, "alpha"), (1, "urgent"), (2, "beta"), (2, "gamma")]:
    heapq.heappush(jobs, (priority, arrival, name))
    arrival += 1

run_order = []
while jobs:
    priority, _, name = heapq.heappop(jobs)
    run_order.append((priority, name))

names = [name for _, name in run_order]
print("Stable order:", names)
print("Result:", names == ["urgent", "alpha", "beta", "gamma"])`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue"],
    algorithm: "Stable tuple priority queue",
    phases: ["Attach a monotonic arrival counter", "Order by priority then arrival", "Remove jobs in stable order"],
    invariants: ["Equal-priority jobs leave in increasing arrival order"],
    edgeCases: ["The counter also prevents comparing non-orderable job objects"],
    comparisonGroup: "priority-queue-policies",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Every job enters and leaves the heap once." },
    bestViews: ["Step Table", "Invariant Checker", "Operation Journey"],
    eventTypes: ["PUSH", "POP", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Simulate an emergency-room queue",
    objective: "Combine urgency and arrival order in an applied priority queue.",
    code: `
import heapq

patients = [
    ("Mina", 3),
    ("Omar", 1),
    ("Lia", 2),
    ("Noah", 1),
]
waiting = []
for arrival, (name, urgency) in enumerate(patients):
    heapq.heappush(waiting, (urgency, arrival, name))

treated = []
while waiting:
    urgency, arrival, name = heapq.heappop(waiting)
    treated.append(name)
    print("Treat:", name, "urgency", urgency, "arrival", arrival)

print("Result:", treated == ["Omar", "Noah", "Lia", "Mina"])`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue"],
    algorithm: "Stable urgency scheduling",
    phases: ["Convert each arrival into a priority record", "Select the most urgent waiting record", "Use arrival order to break ties"],
    invariants: ["Lower urgency numbers run first and equal urgency remains first-in, first-out"],
    edgeCases: ["Real systems need explicit rules for changing urgency"],
    comparisonGroup: "priority-queue-policies",
    complexity: { time: "O(n log n)", space: "O(n)", note: "n admissions and treatments each use a logarithmic heap operation." },
    bestViews: ["Operation Journey", "Step Table", "Invariant Checker"],
    eventTypes: ["PUSH", "POP", "CHOOSE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Merge several sorted sequences",
    objective: "Use one heap entry per sequence to repeatedly choose the next global value.",
    code: `
import heapq

sequences = [[1, 4, 7], [2, 5, 8], [0, 3, 6, 9]]
frontier = []
for sequence_index, sequence in enumerate(sequences):
    if sequence:
        heapq.heappush(frontier, (sequence[0], sequence_index, 0))

merged = []
while frontier:
    value, sequence_index, value_index = heapq.heappop(frontier)
    merged.append(value)
    next_index = value_index + 1
    if next_index < len(sequences[sequence_index]):
        next_value = sequences[sequence_index][next_index]
        heapq.heappush(frontier, (next_value, sequence_index, next_index))

print("Merged:", merged)
print("Result:", merged == list(range(10)))`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue", "array"],
    algorithm: "K-way sorted merge",
    phases: ["Seed one frontier value per sequence", "Pop the smallest frontier", "Push the successor from the same sequence"],
    invariants: ["The frontier contains the smallest unmerged value from each active sequence"],
    edgeCases: ["Empty input sequences contribute no frontier entry"],
    comparisonGroup: "sorted-merging",
    complexity: { time: "O(N log k)", space: "O(k)", note: "N total values pass through a heap containing at most k sequences." },
    bestViews: ["Operation Journey", "Invariant Checker", "Complexity Lab"],
    eventTypes: ["PUSH", "POP", "MERGE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Sort values with repeated heap removal",
    objective: "Separate heap order from sorted output by removing minima one at a time.",
    code: `
import heapq

values = [9, 4, 7, 1, 3, 6]
heap = values.copy()
heapq.heapify(heap)
ordered = []

while heap:
    ordered.append(heapq.heappop(heap))

print("Original:", values)
print("Sorted output:", ordered)
print("Heap exhausted:", heap)
print("Result:", ordered == sorted(values))`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "array"],
    algorithm: "Heap sort with an auxiliary heap",
    phases: ["Build a min-heap", "Remove each minimum", "Append removals to sorted output"],
    invariants: ["Ordered is sorted and contains exactly the values already removed"],
    edgeCases: ["Python's heapq version here uses extra output storage"],
    comparisonGroup: "sorting-with-heaps",
    complexity: { time: "O(n log n)", space: "O(n)", note: "Heap construction is linear and n removals are logarithmic." },
    bestViews: ["Operation Journey", "Mutation Explorer", "Complexity Lab"],
    eventTypes: ["PUSH", "POP", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Replace the heap root",
    objective: "Combine root removal and insertion when the heap is known to be nonempty.",
    code: `
import heapq

heap = [2, 5, 4, 9, 7, 8]
incoming = 6
before = heap.copy()
removed = heapq.heapreplace(heap, incoming)

valid = all(
    heap[(child - 1) // 2] <= heap[child]
    for child in range(1, len(heap))
)

print("Before:", before)
print("Removed:", removed)
print("After:", heap)
print("Result:", removed == 2 and incoming in heap and valid)`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue"],
    algorithm: "Heap root replacement",
    phases: ["Remove the current root", "Place the incoming value at the root", "Repair heap order downward"],
    invariants: ["Length is unchanged and the final array satisfies heap order"],
    edgeCases: ["heapreplace requires a nonempty heap"],
    comparisonGroup: "heap-combined-operations",
    complexity: COST.heapLog,
    bestViews: ["Before and After", "Mutation Explorer", "Invariant Checker"],
    eventTypes: ["POP", "PUSH", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Push then pop in one heap operation",
    objective: "Study how heappushpop keeps the larger of an incoming value and the current minimum.",
    code: `
import heapq

heap = [3, 5, 4, 9, 7, 8]
incoming = 6
before = heap.copy()
removed = heapq.heappushpop(heap, incoming)

valid = all(
    heap[(child - 1) // 2] <= heap[child]
    for child in range(1, len(heap))
)

print("Before:", before)
print("Removed:", removed)
print("After:", heap)
print("Result:", removed == 3 and incoming in heap and valid)`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue"],
    algorithm: "Combined heap push-pop",
    phases: ["Compare the incoming value with the root", "Return the smaller candidate", "Keep a repaired fixed-size heap"],
    invariants: ["Length is unchanged and heap order holds"],
    edgeCases: ["An incoming value smaller than the root can be returned immediately"],
    comparisonGroup: "heap-combined-operations",
    complexity: COST.heapLog,
    bestViews: ["Before and After", "Decisions", "Invariant Checker"],
    eventTypes: ["COMPARE", "PUSH", "POP", "RETURN_RESULT"],
  },
  {
    title: "Diagnose a broken min-heap",
    objective: "Find every child whose parent violates the min-heap ordering rule.",
    code: `
values = [2, 7, 4, 9, 1, 8]
violations = []

for child in range(1, len(values)):
    parent = (child - 1) // 2
    parent_value = values[parent]
    child_value = values[child]
    if parent_value > child_value:
        violations.append({
            "parent_index": parent,
            "child_index": child,
            "pair": (parent_value, child_value),
        })

print("Violations:", violations)
first = violations[0]
print("Result:", len(violations) == 1 and first["pair"] == (7, 1))`,
    expectedResult: "Result: True",
    structureTypes: ["array", "heap"],
    algorithm: "Min-heap invariant audit",
    phases: ["Visit every non-root index", "Derive its parent", "Record parent-greater-than-child violations"],
    invariants: ["Every valid parent value is no greater than each child value"],
    edgeCases: ["An empty or one-value list is already a valid heap"],
    complexity: { time: "O(n)", space: "O(v)", note: "The audit checks each child once and records v violations." },
    bestViews: ["Invariant Checker", "Step Table", "Structure Canvas"],
    eventTypes: ["VISIT_INDEX", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Compare heap construction strategies",
    objective: "Confirm that repeated insertion and bottom-up heapify produce valid heaps with the same minimum.",
    code: `
import heapq

values = [9, 4, 7, 1, 3, 6, 2]

inserted_heap = []
for value in values:
    heapq.heappush(inserted_heap, value)

heapified = values.copy()
heapq.heapify(heapified)

def valid_heap(heap):
    return all(
        heap[(child - 1) // 2] <= heap[child]
        for child in range(1, len(heap))
    )

same_values = sorted(inserted_heap) == sorted(heapified)
same_minimum = inserted_heap[0] == heapified[0] == min(values)
print("Inserted heap:", inserted_heap)
print("Heapified:", heapified)
print("Result:", valid_heap(inserted_heap) and valid_heap(heapified) and same_values and same_minimum)`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "python-list"],
    algorithm: "Heap construction comparison",
    phases: ["Build with repeated pushes", "Build with bottom-up heapify", "Compare invariants rather than exact layouts"],
    invariants: ["Both arrays contain the same values and satisfy heap order"],
    edgeCases: ["Several different arrays can represent valid heaps for the same values"],
    comparisonGroup: "heap-construction",
    complexity: { time: "O(n log n) versus O(n)", space: "O(n)", note: "Repeated insertion is n logarithmic updates; bottom-up heapify is linear." },
    bestViews: ["Compare Algorithms", "Complexity Lab", "Invariant Checker"],
    eventTypes: ["PUSH", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Maintain the smallest available seat",
    objective: "Return released identifiers to a priority queue so allocation always chooses the minimum.",
    code: `
import heapq

available = [1, 2, 3, 4]
heapq.heapify(available)
assigned = []

for _ in range(3):
    assigned.append(heapq.heappop(available))

released = assigned.pop(1)
heapq.heappush(available, released)
next_seat = heapq.heappop(available)

print("Still assigned:", assigned)
print("Released:", released)
print("Next seat:", next_seat)
print("Result:", assigned == [1, 3] and next_seat == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["heap", "priority-queue"],
    algorithm: "Reusable minimum identifier queue",
    phases: ["Allocate the smallest identifier", "Return a released identifier", "Allocate the new minimum"],
    invariants: ["The heap contains exactly the currently available identifiers"],
    edgeCases: ["Allocation needs a policy when no identifier is available"],
    complexity: { time: "O(log n) per allocate or release", space: "O(n)", note: "Each availability update repairs one heap path." },
    bestViews: ["Operation Journey", "Invariant Checker", "Structure Canvas"],
    eventTypes: ["POP", "PUSH", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
/*
 * The seat allocator is a useful applied draft, but its objective overlaps the
 * stable priority-queue applications selected for this 18-program section.
 */
].filter((program) => program.title !== "Maintain the smallest available seat").map((program) => ({
  ...program,
  section: "Heaps and priority queues",
}));

/** Trie and string lessons move from prefix storage to several search strategies. */
const trieStringPrograms = [
  {
    title: "Insert words into a trie",
    objective: "Create one nested branch per character and mark complete words explicitly.",
    difficulty: "Beginner",
    code: `
trie = {}
words = ["cat", "car", "dog"]

for word in words:
    node = trie
    for character in word:
        node = node.setdefault(character, {})
    node["$"] = True

root_letters = sorted(trie)
shared_prefix = sorted(trie["c"]["a"])
print("Root letters:", root_letters)
print("After ca:", shared_prefix)
print("Result:", root_letters == ["c", "d"] and shared_prefix == ["r", "t"])`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "hash-table", "tree"],
    algorithm: "Trie insertion",
    phases: ["Start at the root", "Create or reuse each character edge", "Mark the terminal node"],
    invariants: ["Every root-to-terminal path spells one stored word"],
    edgeCases: ["A word can be a prefix of another word"],
    comparisonGroup: "trie-core-operations",
    complexity: COST.trieWord,
    bestViews: ["Structure Canvas", "Mutation Explorer", "References"],
    eventTypes: ["VISIT_EDGE", "INSERT", "MARK_VISITED", "RETURN_RESULT"],
  },
  {
    title: "Look up a complete word in a trie",
    objective: "Separate a complete-word match from a path that is only a prefix.",
    difficulty: "Beginner",
    code: `
trie = {"c": {"a": {"t": {"$": True}, "r": {"$": True}}}}

def contains(word):
    node = trie
    for character in word:
        if character not in node:
            return False
        node = node[character]
    return "$" in node

cat_found = contains("cat")
ca_found = contains("ca")
cab_found = contains("cab")
print("cat, ca, cab:", cat_found, ca_found, cab_found)
print("Result:", cat_found and not ca_found and not cab_found)`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "hash-table", "tree"],
    algorithm: "Exact trie lookup",
    phases: ["Follow each character edge", "Stop if an edge is missing", "Require a terminal marker"],
    invariants: ["The current node represents exactly the consumed prefix"],
    edgeCases: ["A valid prefix is not automatically a complete word"],
    comparisonGroup: "trie-core-operations",
    complexity: { time: "O(L)", space: "O(1)", note: "Lookup follows at most L existing character edges." },
    bestViews: ["Algorithm Path", "Decisions", "Invariant Checker"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Check a prefix in a trie",
    objective: "Accept any existing character path without requiring a word-ending marker.",
    difficulty: "Beginner",
    code: `
trie = {"c": {"a": {"t": {"$": True}, "r": {"$": True}}}, "d": {"o": {"g": {"$": True}}}}

def starts_with(prefix):
    node = trie
    visited = []
    for character in prefix:
        if character not in node:
            return False, visited
        visited.append(character)
        node = node[character]
    return True, visited

found, path = starts_with("ca")
missing, missing_path = starts_with("cow")
print("Prefix path:", path)
print("Missing path:", missing_path)
print("Result:", found and not missing)`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree"],
    algorithm: "Trie prefix lookup",
    phases: ["Begin at the root", "Follow prefix characters", "Succeed after the last character"],
    invariants: ["Visited spells the existing portion of the requested prefix"],
    edgeCases: ["The empty prefix matches every trie"],
    comparisonGroup: "trie-core-operations",
    complexity: { time: "O(P)", space: "O(P)", note: "The demonstration follows and records at most P prefix characters." },
    bestViews: ["Algorithm Path", "Step Table", "Variables"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Observe shared trie prefixes",
    objective: "Show how several words reuse nodes before their character paths diverge.",
    difficulty: "Beginner",
    code: `
words = ["team", "tear", "ten"]
trie = {}
created_edges = 0

for word in words:
    node = trie
    for character in word:
        if character not in node:
            node[character] = {}
            created_edges += 1
        node = node[character]
    node["$"] = True

naive_characters = sum(len(word) for word in words)
root_branch = sorted(trie["t"]["e"])
print("Characters without sharing:", naive_characters)
print("Created character edges:", created_edges)
print("Branches after te:", root_branch)
print("Result:", created_edges == 6 and root_branch == ["a", "n"])`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree", "hash-table"],
    algorithm: "Trie prefix sharing",
    phases: ["Insert a word", "Reuse existing prefix edges", "Create edges only after divergence"],
    invariants: ["Equal prefixes map to the same path"],
    edgeCases: ["Words with no shared first letter use separate root branches"],
    complexity: { time: "O(total characters)", space: "O(created edges)", note: "Insertion processes every input character and stores only distinct prefix edges." },
    bestViews: ["References", "Structure Canvas", "Mutation Explorer"],
    eventTypes: ["READ", "VISIT_EDGE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Collect trie completions",
    objective: "Find a prefix node and traverse its descendants to generate matching words.",
    code: `
words = ["car", "card", "care", "cat", "dog"]
trie = {}
for word in words:
    node = trie
    for character in word:
        node = node.setdefault(character, {})
    node["$"] = True

def collect(node, prefix, output):
    if "$" in node:
        output.append(prefix)
    for character in sorted(key for key in node if key != "$"):
        collect(node[character], prefix + character, output)

prefix = "car"
node = trie
for character in prefix:
    node = node[character]
matches = []
collect(node, prefix, matches)

print("Completions:", matches)
print("Result:", matches == ["car", "card", "care"])`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree", "python-list"],
    algorithm: "Trie autocomplete",
    phases: ["Follow the requested prefix", "Traverse descendant character edges", "Emit each terminal path"],
    invariants: ["Every emitted word begins with the requested prefix"],
    edgeCases: ["A missing prefix has no completion node"],
    comparisonGroup: "prefix-applications",
    complexity: { time: "O(P + output characters)", space: "O(h)", note: "The lookup follows P characters, then traversal follows only returned branches." },
    bestViews: ["Calls and Recursion", "Algorithm Path", "Structure Canvas"],
    eventTypes: ["VISIT_EDGE", "VISIT_NODE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Delete a word without deleting its prefix",
    objective: "Remove one terminal marker while preserving branches needed by other words.",
    code: `
trie = {"c": {"a": {"r": {"$": True, "d": {"$": True}}, "t": {"$": True}}}}

def delete(node, word, index=0):
    if index == len(word):
        if "$" not in node:
            return False
        del node["$"]
        return len(node) == 0
    character = word[index]
    if character not in node:
        return False
    remove_child = delete(node[character], word, index + 1)
    if remove_child:
        del node[character]
    return len(node) == 0

delete(trie, "car")
car_node = trie["c"]["a"]["r"]
card_remains = "d" in car_node and "$" in car_node["d"]
cat_remains = "$" in trie["c"]["a"]["t"]
print("car terminal:", "$" in car_node)
print("Result:", "$" not in car_node and card_remains and cat_remains)`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree", "hash-table"],
    algorithm: "Recursive trie deletion",
    phases: ["Follow the word path", "Remove its terminal marker", "Prune only now-unused edges while returning"],
    invariants: ["Every retained edge belongs to at least one retained word"],
    edgeCases: ["Deleting a prefix word must preserve longer words"],
    comparisonGroup: "trie-core-operations",
    complexity: COST.trieWord,
    bestViews: ["Mutation Explorer", "References", "Calls and Recursion"],
    eventTypes: ["VISIT_EDGE", "REMOVE", "UNLINK", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Count words below a trie node",
    objective: "Count terminal markers rather than character nodes.",
    code: `
trie = {
    "a": {"n": {"$": True, "t": {"$": True}, "d": {"$": True}}},
    "b": {"e": {"$": True}},
}

def count_words(node):
    total = 1 if "$" in node else 0
    for character, child in node.items():
        if character != "$":
            total += count_words(child)
    return total

all_words = count_words(trie)
an_words = count_words(trie["a"]["n"])
print("All words:", all_words)
print("Words beginning an:", an_words)
print("Result:", all_words == 4 and an_words == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree"],
    algorithm: "Trie terminal count",
    phases: ["Count the current terminal marker", "Recurse into character children", "Add subtree counts"],
    invariants: ["Each stored word contributes exactly one terminal marker"],
    edgeCases: ["Internal character nodes are not words unless marked terminal"],
    complexity: { time: "O(nodes)", space: "O(h)", note: "The traversal visits every node below the selected prefix." },
    bestViews: ["Calls and Recursion", "Variables", "Structure Canvas"],
    eventTypes: ["VISIT_NODE", "READ", "RETURN_RESULT"],
  },
  {
    title: "Find the longest stored prefix",
    objective: "Remember the deepest terminal reached while scanning a longer text.",
    code: `
roots = ["a", "an", "ant", "anti"]
trie = {}
for word in roots:
    node = trie
    for character in word:
        node = node.setdefault(character, {})
    node["$"] = True

text = "antique"
node = trie
longest = ""
prefix = ""
for character in text:
    if character not in node:
        break
    prefix += character
    node = node[character]
    if "$" in node:
        longest = prefix

print("Longest stored prefix:", longest)
print("Result:", longest == "anti")`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree"],
    algorithm: "Longest-prefix trie match",
    phases: ["Follow text characters", "Remember each terminal prefix", "Stop at the first missing edge"],
    invariants: ["Longest is the deepest terminal on the consumed path"],
    edgeCases: ["No matching first character produces an empty result"],
    comparisonGroup: "prefix-applications",
    complexity: { time: "O(L)", space: "O(L)", note: "The scan follows at most L text characters and builds the visible prefix." },
    bestViews: ["Watches", "Algorithm Path", "Before and After"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Replace words by their shortest roots",
    objective: "Stop at the first terminal trie node while rewriting each sentence word.",
    code: `
roots = ["cat", "bat", "rat"]
trie = {}
for root in roots:
    node = trie
    for character in root:
        node = node.setdefault(character, {})
    node["$"] = True

def shortest_root(word):
    node = trie
    prefix = ""
    for character in word:
        if character not in node:
            return word
        prefix += character
        node = node[character]
        if "$" in node:
            return prefix
    return word

sentence = "the cattle was rattled by the battery"
replaced = " ".join(shortest_root(word) for word in sentence.split())
print("Replaced:", replaced)
print("Result:", replaced == "the cat was rat by the bat")`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree"],
    algorithm: "Shortest-root replacement",
    phases: ["Split the sentence", "Search each word until its first terminal", "Join replaced words"],
    invariants: ["A replacement is the shortest stored root of its original word"],
    edgeCases: ["Words with no stored root remain unchanged"],
    comparisonGroup: "prefix-applications",
    complexity: { time: "O(total text characters)", space: "O(dictionary characters)", note: "Each word scan stops by its length or the first root match." },
    bestViews: ["Operation Journey", "Algorithm Path", "Variables"],
    eventTypes: ["VISIT_EDGE", "COMPARE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Segment text with a trie",
    objective: "Use trie prefix walks and dynamic reachability to split text into known words.",
    code: `
words = ["code", "explorer", "learn"]
trie = {}
for word in words:
    node = trie
    for character in word:
        node = node.setdefault(character, {})
    node["$"] = True

text = "codeexplorer"
reachable = [False] * (len(text) + 1)
reachable[0] = True

for start in range(len(text)):
    if not reachable[start]:
        continue
    node = trie
    for end in range(start, len(text)):
        character = text[end]
        if character not in node:
            break
        node = node[character]
        if "$" in node:
            reachable[end + 1] = True

print("Reachable boundaries:", [index for index, value in enumerate(reachable) if value])
print("Result:", reachable[-1])`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "dynamic-programming-table", "array"],
    algorithm: "Trie-assisted word break",
    phases: ["Start from a reachable boundary", "Follow trie edges through the remaining text", "Mark each terminal end as reachable"],
    invariants: ["A true boundary has a valid segmentation of the preceding text"],
    edgeCases: ["Shared prefixes can create several reachable next boundaries"],
    complexity: { time: "O(n * L)", space: "O(n)", note: "Each reachable start follows at most maximum dictionary-word length L." },
    bestViews: ["Step Table", "Invariant Checker", "Algorithm Path"],
    eventTypes: ["VISIT_INDEX", "VISIT_EDGE", "WRITE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Match a wildcard inside a trie",
    objective: "Branch across every child when a dot can represent any one character.",
    code: `
trie = {"c": {"a": {"t": {"$": True}, "r": {"$": True}}}, "d": {"o": {"g": {"$": True}}}}

def matches(node, pattern, index=0):
    if index == len(pattern):
        return "$" in node
    character = pattern[index]
    if character == ".":
        return any(
            matches(child, pattern, index + 1)
            for key, child in node.items()
            if key != "$"
        )
    if character not in node:
        return False
    return matches(node[character], pattern, index + 1)

first = matches(trie, "c.t")
second = matches(trie, "d.g")
missing = matches(trie, "b.t")
print("Matches:", first, second, missing)
print("Result:", first and second and not missing)`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree"],
    algorithm: "Recursive trie wildcard search",
    phases: ["Read one pattern character", "Follow one edge or branch across all children", "Require a terminal at pattern end"],
    invariants: ["Each active call has matched exactly its pattern prefix"],
    edgeCases: ["Several wildcards can explore many branches"],
    complexity: { time: "O(branching^wildcards)", space: "O(L)", note: "Literal edges are direct, while wildcard positions can branch across many children." },
    bestViews: ["Calls and Recursion", "Algorithm Path", "Decisions"],
    eventTypes: ["VISIT_EDGE", "CHOOSE", "ENTER_SUBPROBLEM", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "List trie words lexicographically",
    objective: "Visit character edges in sorted order to produce dictionary order.",
    code: `
words = ["tea", "to", "ten", "in", "inn"]
trie = {}
for word in words:
    node = trie
    for character in word:
        node = node.setdefault(character, {})
    node["$"] = True

ordered = []
def visit(node, prefix):
    if "$" in node:
        ordered.append(prefix)
    for character in sorted(key for key in node if key != "$"):
        visit(node[character], prefix + character)

visit(trie, "")
print("Lexicographic words:", ordered)
print("Result:", ordered == sorted(words))`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree"],
    algorithm: "Lexicographic trie traversal",
    phases: ["Emit the current terminal", "Sort outgoing character edges", "Traverse each child prefix"],
    invariants: ["Completed output is in lexicographic order"],
    edgeCases: ["A shorter word appears before its longer extension"],
    complexity: { time: "O(total characters plus edge sorting)", space: "O(h)", note: "Traversal visits stored edges; sorting cost depends on alphabet branching." },
    bestViews: ["Calls and Recursion", "Operation Journey", "Structure Canvas"],
    eventTypes: ["VISIT_NODE", "VISIT_EDGE", "RETURN_RESULT"],
  },
  {
    title: "Store prefix frequencies",
    objective: "Increment counters along trie paths to answer prefix counts directly.",
    code: `
words = ["app", "apple", "ape", "bat"]
trie = {}
for word in words:
    node = trie
    for character in word:
        node = node.setdefault(character, {"count": 0})
        node["count"] += 1
    node["$"] = True

def prefix_count(prefix):
    node = trie
    for character in prefix:
        if character not in node:
            return 0
        node = node[character]
    return node["count"]

print("ap count:", prefix_count("ap"))
print("app count:", prefix_count("app"))
print("Result:", prefix_count("ap") == 3 and prefix_count("app") == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree", "hash-table"],
    algorithm: "Counted trie insertion",
    phases: ["Follow or create each edge", "Increment the reached prefix counter", "Read the final prefix counter"],
    invariants: ["A node count equals the number of inserted words sharing its prefix"],
    edgeCases: ["Repeated insertion counts repeated occurrences unless deduplicated first"],
    comparisonGroup: "prefix-applications",
    complexity: COST.trieWord,
    bestViews: ["Mutation Explorer", "Variables", "Structure Canvas"],
    eventTypes: ["VISIT_EDGE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Suggest contacts after each character",
    objective: "Show how the candidate set narrows as a typed prefix grows.",
    code: `
contacts = ["alice", "ali", "allen", "bob"]
trie = {}
for contact in contacts:
    node = trie
    for character in contact:
        node = node.setdefault(character, {})
    node["$"] = contact

def collect(node, output):
    if "$" in node:
        output.append(node["$"])
    for key in sorted(key for key in node if key != "$"):
        collect(node[key], output)

typed = "ali"
node = trie
reports = []
for character in typed:
    node = node.get(character)
    matches = []
    if node is not None:
        collect(node, matches)
    reports.append(matches)

print("Suggestions:", reports)
print("Result:", reports[-1] == ["ali", "alice"])`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree"],
    algorithm: "Incremental contact suggestions",
    phases: ["Advance one typed character", "Locate the corresponding prefix node", "Collect its terminal descendants"],
    invariants: ["Each later candidate set matches a longer prefix"],
    edgeCases: ["After a missing character, later prefixes also have no matches"],
    comparisonGroup: "prefix-applications",
    complexity: { time: "O(P + reported characters)", space: "O(h)", note: "Prefix navigation is linear and reporting follows matching descendants." },
    bestViews: ["Step Table", "Algorithm Path", "Operation Journey"],
    eventTypes: ["VISIT_EDGE", "VISIT_NODE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Find substrings with a suffix trie",
    objective: "Insert every suffix so substring queries become prefix walks.",
    code: `
text = "banana"
suffix_trie = {}
for start in range(len(text)):
    node = suffix_trie
    for character in text[start:]:
        node = node.setdefault(character, {})
    node["$"] = True

def contains(pattern):
    node = suffix_trie
    for character in pattern:
        if character not in node:
            return False
        node = node[character]
    return True

print("ana:", contains("ana"))
print("nana:", contains("nana"))
print("apple:", contains("apple"))
print("Result:", contains("ana") and contains("nana") and not contains("apple"))`,
    expectedResult: "Result: True",
    structureTypes: ["trie", "tree"],
    algorithm: "Naive suffix trie",
    phases: ["Choose each suffix start", "Insert its remaining characters", "Query a pattern as a trie prefix"],
    invariants: ["Every text suffix is represented from the root"],
    edgeCases: ["This teaching representation uses quadratic space"],
    comparisonGroup: "substring-search",
    complexity: { time: "O(n^2) build, O(m) query", space: "O(n^2)", note: "All n suffixes can contain a total quadratic number of character edges without compression." },
    bestViews: ["Complexity Lab", "Structure Canvas", "Algorithm Path"],
    eventTypes: ["VISIT_INDEX", "INSERT", "VISIT_EDGE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Search for a substring directly",
    objective: "Compare the pattern at every feasible text start without hidden helpers.",
    difficulty: "Beginner",
    code: `
text = "abracadabra"
pattern = "cada"
found_at = -1
comparisons = 0

for start in range(len(text) - len(pattern) + 1):
    matched = True
    for offset in range(len(pattern)):
        comparisons += 1
        if text[start + offset] != pattern[offset]:
            matched = False
            break
    if matched:
        found_at = start
        break

print("Found at:", found_at)
print("Character comparisons:", comparisons)
print("Result:", found_at == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Naive substring search",
    phases: ["Choose a candidate start", "Compare pattern characters", "Stop on a complete match"],
    invariants: ["Every start before found_at has been disproved"],
    edgeCases: ["Repeated prefixes can cause many repeated comparisons"],
    comparisonGroup: "substring-search",
    complexity: COST.stringProduct,
    bestViews: ["Step Table", "Watches", "Complexity Lab"],
    eventTypes: ["VISIT_INDEX", "COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Build a KMP prefix table",
    objective: "Record the longest proper prefix that is also a suffix at every pattern position.",
    code: `
pattern = "ababaca"
prefix = [0] * len(pattern)
length = 0
index = 1

while index < len(pattern):
    if pattern[index] == pattern[length]:
        length += 1
        prefix[index] = length
        index += 1
    elif length > 0:
        length = prefix[length - 1]
    else:
        prefix[index] = 0
        index += 1

print("Prefix table:", prefix)
print("Result:", prefix == [0, 0, 1, 2, 3, 0, 1])`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "KMP prefix-function construction",
    phases: ["Compare current and prefix characters", "Extend a matching border", "Fall back to a shorter border after mismatch"],
    invariants: ["prefix[i] is the longest valid border length for pattern through i"],
    edgeCases: ["A mismatch at border length zero advances with zero"],
    comparisonGroup: "substring-search",
    complexity: { time: "O(m)", space: "O(m)", note: "The index advances or the border shortens, so total prefix-table work is linear." },
    bestViews: ["Step Table", "Watches", "Invariant Checker"],
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "WRITE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Search text with KMP",
    objective: "Reuse the prefix table so a mismatch does not recheck known matching text.",
    code: `
text = "ababcabcabababd"
pattern = "ababd"
prefix = [0, 0, 1, 2, 0]
text_index = 0
pattern_index = 0
found_at = -1

while text_index < len(text):
    if text[text_index] == pattern[pattern_index]:
        text_index += 1
        pattern_index += 1
        if pattern_index == len(pattern):
            found_at = text_index - pattern_index
            break
    elif pattern_index > 0:
        pattern_index = prefix[pattern_index - 1]
    else:
        text_index += 1

print("Found at:", found_at)
print("Result:", found_at == 10)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Knuth-Morris-Pratt search",
    phases: ["Compare current text and pattern characters", "Advance both on a match", "Use the prefix table after mismatch"],
    invariants: ["Characters before text_index never need to become a new unchecked start"],
    edgeCases: ["An empty pattern requires an explicit API policy"],
    comparisonGroup: "substring-search",
    complexity: { time: "O(n + m)", space: "O(m)", note: "Prefix construction and the search each move through their inputs without backing up the text index." },
    bestViews: ["Step Table", "Watches", "Complexity Lab"],
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Search text with a rolling hash",
    objective: "Update a window hash in constant time and verify characters only on hash matches.",
    code: `
text = "abracadabra"
pattern = "cada"
base = 257
modulus = 1_000_000_007
window_size = len(pattern)
high = pow(base, window_size - 1, modulus)

pattern_hash = 0
window_hash = 0
for index in range(window_size):
    pattern_hash = (pattern_hash * base + ord(pattern[index])) % modulus
    window_hash = (window_hash * base + ord(text[index])) % modulus

found_at = -1
for start in range(len(text) - window_size + 1):
    if pattern_hash == window_hash and text[start:start + window_size] == pattern:
        found_at = start
        break
    if start + window_size < len(text):
        window_hash = (window_hash - ord(text[start]) * high) % modulus
        window_hash = (window_hash * base + ord(text[start + window_size])) % modulus

print("Found at:", found_at)
print("Result:", found_at == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "hash-table"],
    algorithm: "Rabin-Karp rolling-hash search",
    phases: ["Hash the pattern and first window", "Compare hashes and verify a possible match", "Roll the window hash forward"],
    invariants: ["window_hash represents the current text window modulo the selected modulus"],
    edgeCases: ["Hash collisions require direct substring verification"],
    comparisonGroup: "substring-search",
    complexity: { time: "Average O(n + m)", space: "O(1)", note: "Rolling updates are constant; many collisions can increase verification work." },
    bestViews: ["Watches", "Step Table", "Complexity Lab"],
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "WRITE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Group words by character frequency",
    objective: "Use an immutable frequency signature so anagrams share one dictionary bucket.",
    code: `
words = ["eat", "tea", "tan", "ate", "nat", "bat"]
groups = {}

for word in words:
    counts = [0] * 26
    for character in word:
        counts[ord(character) - ord("a")] += 1
    signature = tuple(counts)
    groups.setdefault(signature, []).append(word)

normalized = sorted(sorted(group) for group in groups.values())
expected = sorted([["ate", "eat", "tea"], ["nat", "tan"], ["bat"]])
print("Anagram groups:", normalized)
print("Result:", normalized == expected)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array"],
    algorithm: "Frequency-signature anagram grouping",
    phases: ["Count each word's characters", "Convert counts to a hashable signature", "Append the word to its signature bucket"],
    invariants: ["Words in one bucket have identical character multiplicities"],
    edgeCases: ["The fixed 26-slot signature assumes lowercase English letters"],
    comparisonGroup: "string-classification",
    complexity: { time: "O(total characters)", space: "O(number of words)", note: "Each character is counted once and each word enters one dictionary bucket." },
    bestViews: ["Structure Canvas", "Mutation Explorer", "Invariant Checker"],
    eventTypes: ["VISIT_INDEX", "WRITE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Find the longest common prefix",
    objective: "Shrink a candidate prefix until every word begins with it.",
    difficulty: "Beginner",
    code: `
words = ["flower", "flow", "flight"]
prefix = words[0] if words else ""
checks = []

for word in words[1:]:
    while not word.startswith(prefix):
        checks.append((word, prefix))
        prefix = prefix[:-1]
        if not prefix:
            break

print("Shrink checks:", checks)
print("Longest common prefix:", prefix)
print("Result:", prefix == "fl")`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Progressive common-prefix reduction",
    phases: ["Start with the first word", "Test the next word", "Shorten until it matches"],
    invariants: ["Prefix is common to every word already processed"],
    edgeCases: ["An empty word forces an empty common prefix"],
    comparisonGroup: "prefix-applications",
    complexity: { time: "O(total compared characters)", space: "O(1)", note: "The candidate only shrinks and is tested against each word." },
    bestViews: ["Watches", "Before and After", "Invariant Checker"],
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Compress repeated characters",
    objective: "Convert consecutive equal characters into one character-count run.",
    difficulty: "Beginner",
    code: `
text = "aaabbccccdaa"
runs = []
current = text[0]
count = 1

for character in text[1:]:
    if character == current:
        count += 1
    else:
        runs.append(current + str(count))
        current = character
        count = 1
runs.append(current + str(count))

encoded = "".join(runs)
print("Runs:", runs)
print("Encoded:", encoded)
print("Result:", encoded == "a3b2c4d1a2")`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Run-length encoding",
    phases: ["Start the first run", "Extend equal characters or close the run", "Append the final run"],
    invariants: ["Closed runs exactly encode the processed text prefix"],
    edgeCases: ["An empty string needs an early return before reading index zero"],
    comparisonGroup: "string-transformations",
    complexity: { time: "O(n)", space: "O(n)", note: "The scan visits each character once and stores the encoded runs." },
    bestViews: ["Step Table", "Before and After", "Invariant Checker"],
    eventTypes: ["COMPARE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Decode run-length text",
    objective: "Parse character-count groups and expand each run into original text.",
    code: `
encoded = "a3b2c4d1a2"
decoded_parts = []
index = 0

while index < len(encoded):
    character = encoded[index]
    index += 1
    digits = []
    while index < len(encoded) and encoded[index].isdigit():
        digits.append(encoded[index])
        index += 1
    count = int("".join(digits))
    decoded_parts.append(character * count)

decoded = "".join(decoded_parts)
print("Decoded parts:", decoded_parts)
print("Decoded:", decoded)
print("Result:", decoded == "aaabbccccdaa")`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Run-length decoding",
    phases: ["Read one run character", "Parse all following count digits", "Expand and append the run"],
    invariants: ["Decoded parts represent every complete encoded run consumed so far"],
    edgeCases: ["Malformed input can omit a count or start with a digit"],
    comparisonGroup: "string-transformations",
    complexity: { time: "O(encoded length plus output length)", space: "O(output length)", note: "Parsing is linear and expansion writes every decoded character." },
    bestViews: ["Step Table", "Watches", "Error Coach"],
    eventTypes: ["READ", "UPDATE_BOUNDARY", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Find all occurrences including overlaps",
    objective: "Continue one position after a match so overlapping occurrences remain visible.",
    code: `
text = "aaaaa"
pattern = "aaa"
matches = []
comparisons = 0

for start in range(len(text) - len(pattern) + 1):
    matched = True
    for offset, character in enumerate(pattern):
        comparisons += 1
        if text[start + offset] != character:
            matched = False
            break
    if matched:
        matches.append(start)

print("Match starts:", matches)
print("Comparisons:", comparisons)
print("Result:", matches == [0, 1, 2])`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Overlapping substring enumeration",
    phases: ["Choose every feasible start", "Compare the complete pattern", "Record each successful start"],
    invariants: ["Every recorded index begins an exact pattern occurrence"],
    edgeCases: ["Advancing by pattern length would miss overlapping matches"],
    comparisonGroup: "substring-search",
    complexity: COST.stringProduct,
    bestViews: ["Step Table", "Watches", "Edge Case Lab"],
    eventTypes: ["VISIT_INDEX", "COMPARE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Compare direct search and KMP evidence",
    objective: "Run two reviewed searches on the same text and compare observed character checks.",
    code: `
text = "aaaaaaaaab"
pattern = "aaaab"

naive_checks = 0
naive_index = -1
for start in range(len(text) - len(pattern) + 1):
    for offset in range(len(pattern)):
        naive_checks += 1
        if text[start + offset] != pattern[offset]:
            break
    else:
        naive_index = start
        break

prefix = [0] * len(pattern)
length = 0
for index in range(1, len(pattern)):
    while length and pattern[index] != pattern[length]:
        length = prefix[length - 1]
    if pattern[index] == pattern[length]:
        length += 1
        prefix[index] = length

kmp_checks = 0
text_index = pattern_index = 0
while text_index < len(text) and pattern_index < len(pattern):
    kmp_checks += 1
    if text[text_index] == pattern[pattern_index]:
        text_index += 1
        pattern_index += 1
    elif pattern_index:
        pattern_index = prefix[pattern_index - 1]
    else:
        text_index += 1
kmp_index = text_index - pattern_index if pattern_index == len(pattern) else -1

print("Indices:", naive_index, kmp_index)
print("Observed checks:", naive_checks, kmp_checks)
print("Result:", naive_index == kmp_index == 5 and kmp_checks < naive_checks)`,
    expectedResult: "Result: True",
    structureTypes: ["array"],
    algorithm: "Naive versus KMP search comparison",
    phases: ["Run direct candidate comparisons", "Build and use KMP fallback state", "Compare equal results and observed checks"],
    invariants: ["Both algorithms must report the same match index"],
    edgeCases: ["Observed checks on one input do not prove universal running time"],
    comparisonGroup: "substring-search",
    complexity: { time: "O(n * m) versus O(n + m)", space: "O(m)", note: "The metadata states reviewed bounds while the program reports only this input's observed checks." },
    bestViews: ["Compare Algorithms", "Complexity Lab", "Step Table"],
    eventTypes: ["COMPARE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
/*
 * Decoding remains a useful transformation draft, but Chunk 3 gives the fixed
 * 24th slot to the direct versus KMP comparison requested for curriculum-based
 * comparisons. The draft is not exported or shown as implemented.
 */
].filter((program) => program.title !== "Decode run-length text").map((program) => ({
  ...program,
  section: "Tries and string algorithms",
}));

/** Definitions remain ordered by the approved Chunk 3 curriculum sequence. */
const definitions = [
  ...treePrograms,
  ...heapPrograms,
  ...trieStringPrograms,
];

/** Frozen Chunk 3 records continue identifiers from DSA-198 through DSA-269. */
export const DSA_CHUNK_THREE_PROGRAMS = Object.freeze(
  definitions.map((definition, index) => makeProgram(definition, index)),
);
