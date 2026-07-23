/**
 * Code Explorer Data Structures and Algorithms curriculum, Chunk 2.
 *
 * This module adds 66 reviewed structure-focused programs after the 131
 * programs shipped in Chunk 1. Every definition remains executable Python and
 * carries the same evidence contract used by the catalog, views, comments, and
 * detached validators. No record contains learner data or network behavior.
 */

import { DSA_PROGRAM_REQUIRED_FIELDS } from "./dsa-contracts.js";

/** The three Chunk 2 sections and their approved Tier A counts. */
export const DSA_CHUNK_TWO_SECTIONS = Object.freeze([
  ["Stacks, queues, and deques", 22],
  ["Linked structures", 20],
  ["Hash tables and set algorithms", 24],
]);

/** Removes only outer template whitespace while preserving Python formatting. */
function cleanCode(source) {
  return source.replace(/^\n/, "").replace(/\s+$/, "");
}

/**
 * Builds one immutable program using the complete shared curriculum schema.
 *
 * @param {object} definition Reviewed metadata and Python source.
 * @param {number} index Zero-based index inside Chunk 2.
 * @returns {Readonly<object>} Complete catalog record numbered after Chunk 1.
 */
function makeProgram(definition, index) {
  const record = {
    id: `dsa-${String(index + 132).padStart(3, "0")}`,
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
    if (!(field in record)) throw new Error(`Chunk 2 program ${record.id} is missing ${field}.`);
  }
  return Object.freeze(record);
}

/** Frequently reused complexity statements keep equivalent operations aligned. */
const COST = Object.freeze({
  constant: { time: "O(1)", space: "O(1)", note: "The demonstrated end operation performs constant structural work." },
  linear: { time: "O(n)", space: "O(1)", note: "The algorithm may inspect each stored value once." },
  linearCopy: { time: "O(n)", space: "O(n)", note: "The result or teaching snapshot stores up to n values." },
  hashAverage: { time: "Average O(1)", space: "O(n)", note: "Average direct access assumes a healthy hash distribution; worst-case collision behavior differs." },
  setLinear: { time: "Average O(n)", space: "O(n)", note: "The algorithm performs average constant-time set operations for up to n values." },
});

/** Stack, queue, and deque lessons progress from contracts to applied comparisons. */
const stackQueuePrograms = [
  {
    title: "Push and pop a list stack",
    objective: "Observe last-in, first-out behavior using the right end of a Python list.",
    code: `
stack = []
operations = [("push", "draft"), ("push", "review"), ("push", "publish")]

for action, value in operations:
    stack.append(value)
    print(action, value, stack.copy())

removed = stack.pop()
print("Removed:", removed)
print("Remaining:", stack)
print("Result:", removed == "publish")`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "python-list"],
    algorithm: "List-backed stack",
    phases: ["Create an empty stack", "Push values at one end", "Pop the most recent value"],
    invariants: ["The next pop returns the most recently pushed remaining value"],
    edgeCases: ["Popping an empty stack requires a policy"],
    complexity: COST.constant,
    eventTypes: ["PUSH", "POP", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Undo edits with a stack",
    objective: "Use a stack of prior states to undo text edits in reverse order.",
    code: `
document = ""
undo_stack = []
edits = ["A", "AB", "ABC"]

for new_text in edits:
    undo_stack.append(document)
    document = new_text
    print("Edited:", document)

document = undo_stack.pop()
document = undo_stack.pop()
print("After two undos:", document)
print("Result:", document == "A")`,
    expectedResult: "Result: True",
    structureTypes: ["stack"],
    algorithm: "Undo history",
    phases: ["Save the old state", "Apply each edit", "Restore states in reverse order"],
    invariants: ["The top entry is the state immediately before the current document"],
    edgeCases: ["Undo is unavailable when history is empty"],
    complexity: COST.constant,
    eventTypes: ["PUSH", "POP", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Validate balanced brackets",
    objective: "Match each closing bracket with the nearest unmatched opening bracket.",
    code: `
expression = "{[a + (b * c)] - d}"
pairs = {")": "(", "]": "[", "}": "{"}
stack = []
valid = True

for character in expression:
    if character in "([{":
        stack.append(character)
    elif character in pairs:
        if not stack or stack.pop() != pairs[character]:
            valid = False
            break

valid = valid and not stack
print("Unmatched:", stack)
print("Result:", valid)`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "hash-table"],
    algorithm: "Balanced-bracket scan",
    phases: ["Push opening brackets", "Match each closing bracket", "Require an empty stack"],
    invariants: ["The stack contains unmatched openings in encounter order"],
    edgeCases: ["A closing bracket can arrive before any opening", "Openings can remain after the scan"],
    complexity: COST.linear,
    eventTypes: ["READ", "PUSH", "POP", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Evaluate a postfix expression",
    objective: "Use an operand stack to evaluate operators after their operands.",
    code: `
tokens = "5 2 3 * + 4 -".split()
stack = []

for token in tokens:
    if token.isdigit():
        stack.append(int(token))
    else:
        right = stack.pop()
        left = stack.pop()
        if token == "+":
            stack.append(left + right)
        elif token == "*":
            stack.append(left * right)
        else:
            stack.append(left - right)

print("Final stack:", stack)
print("Result:", stack.pop())`,
    expectedResult: "Result: 7",
    structureTypes: ["stack"],
    algorithm: "Postfix evaluation",
    phases: ["Push operands", "Pop two operands for an operator", "Push the operation result"],
    invariants: ["The stack stores values of completed postfix subexpressions"],
    edgeCases: ["An operator needs two operands", "A valid expression leaves exactly one value"],
    complexity: COST.linear,
    eventTypes: ["READ", "PUSH", "POP", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Reverse text with a stack",
    objective: "Make reversal visible by popping characters in last-in, first-out order.",
    code: `
text = "algorithm"
stack = []

for character in text:
    stack.append(character)

reversed_characters = []
while stack:
    reversed_characters.append(stack.pop())

reversed_text = "".join(reversed_characters)
print("Reversed:", reversed_text)
print("Result:", reversed_text == text[::-1])`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "array"],
    algorithm: "Stack reversal",
    phases: ["Push characters left to right", "Pop until empty", "Join popped characters"],
    invariants: ["Popped characters are the reverse of the pushed prefix"],
    complexity: COST.linearCopy,
    eventTypes: ["PUSH", "POP", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Find next greater values",
    objective: "Use a monotonic stack of indices to resolve pending next-greater queries.",
    code: `
values = [4, 5, 2, 10, 8]
answers = [-1] * len(values)
pending = []

for index, value in enumerate(values):
    while pending and values[pending[-1]] < value:
        previous_index = pending.pop()
        answers[previous_index] = value
    pending.append(index)

print("Pending indices:", pending)
print("Next greater:", answers)
print("Result:", answers == [5, 10, 10, -1, -1])`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "array"],
    algorithm: "Monotonic decreasing stack",
    phases: ["Visit each value", "Resolve smaller pending values", "Push the current index"],
    invariants: ["Values at pending indices are nonincreasing from bottom to top"],
    edgeCases: ["Values without a greater successor keep -1"],
    complexity: { time: "O(n)", space: "O(n)", note: "Each index is pushed once and popped at most once." },
    eventTypes: ["VISIT_INDEX", "COMPARE", "POP", "PUSH", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Track a minimum with two stacks",
    objective: "Return the current minimum without scanning the complete value stack.",
    code: `
values = []
minimums = []

for number in [5, 3, 7, 2, 6]:
    values.append(number)
    if not minimums or number <= minimums[-1]:
        minimums.append(number)

removed = values.pop()
if removed == minimums[-1]:
    minimums.pop()

print("Values:", values)
print("Minimum:", minimums[-1])
print("Result:", minimums[-1] == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["stack"],
    algorithm: "Auxiliary minimum stack",
    phases: ["Push a value", "Record new minimums", "Synchronize both stacks on pop"],
    invariants: ["The minimum-stack top equals the minimum of all current values"],
    complexity: COST.constant,
    eventTypes: ["PUSH", "POP", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Compare list and deque stacks",
    objective: "Confirm that two concrete containers can satisfy the same stack contract.",
    code: `
from collections import deque

list_stack = []
deque_stack = deque()
for value in ["one", "two", "three"]:
    list_stack.append(value)
    deque_stack.append(value)

list_order = [list_stack.pop() for _ in range(3)]
deque_order = [deque_stack.pop() for _ in range(3)]

print("List order:", list_order)
print("Deque order:", deque_order)
print("Result:", list_order == deque_order)`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "deque"],
    algorithm: "Stack representation comparison",
    phases: ["Apply equivalent pushes", "Apply equivalent pops", "Compare observable order"],
    invariants: ["Both representations expose the same last-in, first-out contract"],
    complexity: COST.linearCopy,
    eventTypes: ["PUSH", "POP", "COMPARE", "RETURN_RESULT"],
    comparisonGroup: "stack-representations",
  },
  {
    title: "Serve a queue in arrival order",
    objective: "Observe first-in, first-out behavior with a deque.",
    code: `
from collections import deque

queue = deque()
for customer in ["Asha", "Ben", "Chen"]:
    queue.append(customer)
    print("Arrived:", customer, list(queue))

served = []
while queue:
    served.append(queue.popleft())

print("Served:", served)
print("Result:", served == ["Asha", "Ben", "Chen"])`,
    expectedResult: "Result: True",
    structureTypes: ["queue", "deque"],
    algorithm: "Deque-backed queue",
    phases: ["Enqueue at the rear", "Dequeue at the front", "Preserve arrival order"],
    invariants: ["The front item has waited longer than every item behind it"],
    complexity: COST.constant,
    eventTypes: ["ENQUEUE", "DEQUEUE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Schedule tasks with a queue",
    objective: "Process ready tasks in first-in, first-out order while adding follow-up work.",
    code: `
from collections import deque

ready = deque(["parse", "validate"])
completed = []

while ready:
    task = ready.popleft()
    completed.append(task)
    if task == "parse":
        ready.append("index")
    elif task == "validate":
        ready.append("report")

print("Completed:", completed)
print("Result:", completed == ["parse", "validate", "index", "report"])`,
    expectedResult: "Result: True",
    structureTypes: ["queue", "deque"],
    algorithm: "FIFO task scheduling",
    phases: ["Take the front task", "Complete it", "Enqueue newly ready work"],
    invariants: ["Ready tasks preserve the order in which they became available"],
    complexity: COST.linearCopy,
    eventTypes: ["DEQUEUE", "ENQUEUE", "VISIT_INDEX", "RETURN_RESULT"],
  },
  {
    title: "Simulate a printer queue",
    objective: "Track waiting jobs and total pages while a printer serves one job at a time.",
    code: `
from collections import deque

jobs = deque([
    {"name": "notes", "pages": 2},
    {"name": "report", "pages": 5},
    {"name": "chart", "pages": 1},
])
printed = []
page_total = 0

while jobs:
    job = jobs.popleft()
    printed.append(job["name"])
    page_total += job["pages"]
    print("Printed:", job["name"], "waiting:", len(jobs))

print("Order:", printed)
print("Result:", page_total)`,
    expectedResult: "Result: 8",
    structureTypes: ["queue", "deque", "hash-table"],
    algorithm: "Printer queue simulation",
    phases: ["Enqueue print records", "Serve the front record", "Accumulate completed pages"],
    invariants: ["Every job is printed once and in arrival order"],
    complexity: COST.linear,
    eventTypes: ["DEQUEUE", "READ", "WRITE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Implement a circular array queue",
    objective: "Reuse fixed array positions by wrapping front and rear indices.",
    code: `
capacity = 4
buffer = [None] * capacity
front = 0
size = 0

for value in ["A", "B", "C"]:
    rear = (front + size) % capacity
    buffer[rear] = value
    size += 1

removed = buffer[front]
buffer[front] = None
front = (front + 1) % capacity
size -= 1

rear = (front + size) % capacity
buffer[rear] = "D"
size += 1
logical = [buffer[(front + offset) % capacity] for offset in range(size)]
print("Buffer:", buffer)
print("Result:", logical)`,
    expectedResult: "Result: ['B', 'C', 'D']",
    structureTypes: ["queue", "array"],
    algorithm: "Circular array queue",
    phases: ["Compute a wrapped rear", "Advance the wrapped front", "Read logical queue order"],
    invariants: ["0 <= size <= capacity", "Logical offsets wrap with modulo capacity"],
    edgeCases: ["Enqueue needs a full-queue policy", "Dequeue needs an empty-queue policy"],
    complexity: COST.constant,
    eventTypes: ["ENQUEUE", "DEQUEUE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Build a queue from two stacks",
    objective: "Transfer values between stacks only when the dequeue side is empty.",
    code: `
incoming = []
outgoing = []

for value in [10, 20, 30]:
    incoming.append(value)

def dequeue():
    if not outgoing:
        while incoming:
            outgoing.append(incoming.pop())
    return outgoing.pop()

served = [dequeue(), dequeue()]
incoming.append(40)
served.extend([dequeue(), dequeue()])
print("Served:", served)
print("Result:", served == [10, 20, 30, 40])`,
    expectedResult: "Result: True",
    structureTypes: ["queue", "stack"],
    algorithm: "Queue using two stacks",
    phases: ["Push new values to incoming", "Reverse only when outgoing is empty", "Pop the oldest value"],
    invariants: ["Outgoing top is the oldest currently available value"],
    complexity: { time: "Amortized O(1) per operation", space: "O(n)", note: "Each value transfers from incoming to outgoing at most once." },
    eventTypes: ["PUSH", "POP", "ENQUEUE", "DEQUEUE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "queue-representations",
  },
  {
    title: "Check a palindrome with a deque",
    objective: "Compare characters removed from both ends of one deque.",
    code: `
from collections import deque

text = "neveroddoreven"
characters = deque(text)
palindrome = True

while len(characters) > 1:
    left = characters.popleft()
    right = characters.pop()
    if left != right:
        palindrome = False
        break

print("Remaining:", list(characters))
print("Result:", palindrome)`,
    expectedResult: "Result: True",
    structureTypes: ["deque"],
    algorithm: "Two-ended palindrome check",
    phases: ["Load characters", "Remove both ends", "Stop on a mismatch"],
    invariants: ["All removed outer pairs matched"],
    complexity: COST.linear,
    eventTypes: ["DEQUEUE", "POP", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Find sliding-window maximums",
    objective: "Keep only useful candidate indices in a decreasing deque.",
    code: `
from collections import deque

values = [1, 3, -1, -3, 5, 3, 6, 7]
window = 3
candidates = deque()
maximums = []

for index, value in enumerate(values):
    while candidates and candidates[0] <= index - window:
        candidates.popleft()
    while candidates and values[candidates[-1]] <= value:
        candidates.pop()
    candidates.append(index)
    if index >= window - 1:
        maximums.append(values[candidates[0]])

print("Maximums:", maximums)
print("Result:", maximums == [3, 3, 5, 5, 6, 7])`,
    expectedResult: "Result: True",
    structureTypes: ["deque", "array"],
    algorithm: "Monotonic deque window maximum",
    phases: ["Discard expired indices", "Discard weaker rear candidates", "Read the front maximum"],
    invariants: ["Candidate indices increase and their values decrease"],
    complexity: { time: "O(n)", space: "O(k)", note: "Each index enters and leaves the deque at most once." },
    eventTypes: ["VISIT_INDEX", "DEQUEUE", "POP", "ENQUEUE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Rotate a deque schedule",
    objective: "Move a schedule boundary without copying all values manually.",
    code: `
from collections import deque

schedule = deque(["Mon", "Tue", "Wed", "Thu", "Fri"])
schedule.rotate(2)
after_right = list(schedule)

schedule.rotate(-3)
after_left = list(schedule)

print("Right rotation:", after_right)
print("Left rotation:", after_left)
print("Result:", after_left[0])`,
    expectedResult: "Result: Tue",
    structureTypes: ["deque"],
    algorithm: "Deque rotation",
    phases: ["Create the ordered schedule", "Rotate right", "Rotate left from the new state"],
    invariants: ["Rotation preserves every value and the deque length"],
    complexity: { time: "O(k)", space: "O(1)", note: "Rotation work depends on the shorter effective movement in the deque implementation." },
    eventTypes: ["ROTATE", "READ", "RETURN_RESULT"],
  },
  {
    title: "Keep a bounded recent history",
    objective: "Use a maximum-length deque that automatically discards the oldest value.",
    code: `
from collections import deque

recent = deque(maxlen=3)
snapshots = []

for event in ["login", "open", "edit", "save", "close"]:
    recent.append(event)
    snapshots.append(list(recent))

print("Snapshots:", snapshots)
print("Recent:", list(recent))
print("Result:", list(recent) == ["edit", "save", "close"])`,
    expectedResult: "Result: True",
    structureTypes: ["deque", "queue"],
    algorithm: "Bounded deque history",
    phases: ["Set a maximum length", "Append events", "Observe automatic front eviction"],
    invariants: ["The deque stores at most three most recent events"],
    complexity: COST.constant,
    eventTypes: ["ENQUEUE", "DEQUEUE", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Interleave producers and a consumer",
    objective: "Model values arriving and being consumed without changing FIFO order.",
    code: `
from collections import deque

buffer = deque()
consumed = []
actions = [
    ("produce", "A"),
    ("produce", "B"),
    ("consume", None),
    ("produce", "C"),
    ("consume", None),
    ("consume", None),
]

for action, value in actions:
    if action == "produce":
        buffer.append(value)
    elif buffer:
        consumed.append(buffer.popleft())
    print(action, list(buffer), consumed.copy())

print("Result:", consumed == ["A", "B", "C"])`,
    expectedResult: "Result: True",
    structureTypes: ["queue", "deque"],
    algorithm: "Producer-consumer queue simulation",
    phases: ["Enqueue produced values", "Dequeue when consumption is requested", "Preserve FIFO history"],
    invariants: ["Consumed values follow production order"],
    edgeCases: ["A consumer can find an empty buffer"],
    complexity: COST.linearCopy,
    eventTypes: ["ENQUEUE", "DEQUEUE", "CHOOSE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Validate a stack operation log",
    objective: "Reject a pop that does not match the current stack top.",
    code: `
log = [("push", 4), ("push", 7), ("pop", 7), ("push", 9), ("pop", 9), ("pop", 4)]
stack = []
valid = True

for action, value in log:
    if action == "push":
        stack.append(value)
    elif not stack or stack[-1] != value:
        valid = False
        break
    else:
        stack.pop()

valid = valid and not stack
print("Remaining:", stack)
print("Result:", valid)`,
    expectedResult: "Result: True",
    structureTypes: ["stack"],
    algorithm: "Stack-sequence validation",
    phases: ["Replay each operation", "Compare pops with the top", "Require a valid final state"],
    invariants: ["The stack equals all unmatched pushes in order"],
    complexity: COST.linear,
    eventTypes: ["PUSH", "PEEK", "POP", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Navigate browser history with two stacks",
    objective: "Move pages between back and forward stacks while preserving navigation order.",
    code: `
back = []
forward = []
current = "home"

for page in ["docs", "editor", "results"]:
    back.append(current)
    current = page
    forward.clear()

forward.append(current)
current = back.pop()
forward.append(current)
current = back.pop()

print("Current:", current)
print("Back:", back)
print("Forward:", forward)
print("Result:", current == "docs")`,
    expectedResult: "Result: True",
    structureTypes: ["stack"],
    algorithm: "Two-stack browser history",
    phases: ["Visit pages and clear forward history", "Move current to forward", "Restore from back"],
    invariants: ["Back top is the immediately previous page", "Forward top is the immediately next page after going back"],
    complexity: COST.constant,
    eventTypes: ["PUSH", "POP", "WRITE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Compare queue representations",
    objective: "Compare a deque queue with a two-stack queue using the same observable contract.",
    code: `
from collections import deque

source = ["red", "green", "blue", "gold"]
deque_queue = deque(source)
incoming = source.copy()
outgoing = []

deque_order = [deque_queue.popleft() for _ in source]
while incoming:
    outgoing.append(incoming.pop())
stack_order = [outgoing.pop() for _ in source]

print("Deque:", deque_order)
print("Two stacks:", stack_order)
print("Result:", deque_order == stack_order)`,
    expectedResult: "Result: True",
    structureTypes: ["queue", "deque", "stack"],
    algorithm: "Queue representation comparison",
    phases: ["Load equivalent values", "Dequeue through each representation", "Compare observable order"],
    invariants: ["Both representations must return values in source order"],
    complexity: COST.linearCopy,
    eventTypes: ["ENQUEUE", "DEQUEUE", "PUSH", "POP", "COMPARE", "RETURN_RESULT"],
    comparisonGroup: "queue-representations",
    difficulty: "Guided Challenge",
  },
  {
    title: "Manage a service desk with urgent work",
    objective: "Use both ends of a deque to combine normal arrival order with explicit urgent priority.",
    code: `
from collections import deque

desk = deque()
events = [
    ("normal", "ticket-1"),
    ("normal", "ticket-2"),
    ("urgent", "outage"),
    ("normal", "ticket-3"),
]

for priority, item in events:
    if priority == "urgent":
        desk.appendleft(item)
    else:
        desk.append(item)

served = []
while desk:
    served.append(desk.popleft())

print("Served:", served)
print("Result:", served[0] == "outage" and served[1:] == ["ticket-1", "ticket-2", "ticket-3"])`,
    expectedResult: "Result: True",
    structureTypes: ["deque", "queue"],
    algorithm: "Two-ended service scheduling",
    phases: ["Append normal arrivals", "Prepend urgent work", "Serve from the front"],
    invariants: ["Normal items preserve relative arrival order"],
    edgeCases: ["Repeated urgent items are served in reverse urgent-arrival order under prepend policy"],
    complexity: COST.linearCopy,
    eventTypes: ["ENQUEUE", "DEQUEUE", "CHOOSE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "queue-policies",
  },
].map((program) => ({ ...program, section: "Stacks, queues, and deques" }));

/** Linked lessons use explicit nodes and include snapshots for bounded visual study. */
const linkedPrograms = [
  {
    title: "Create and connect singly linked nodes",
    objective: "Build a three-node chain by storing the next-node relationship explicitly.",
    code: `
class Node:
    def __init__(self, value):
        self.value = value
        self.next = None

first = Node("A")
second = Node("B")
third = Node("C")
first.next = second
second.next = third

snapshot = [first.value, first.next.value, first.next.next.value]
print("Chain:", snapshot)
print("Result:", snapshot == ["A", "B", "C"])`,
    expectedResult: "Result: True",
    structureTypes: ["singly-linked-list"],
    algorithm: "Singly linked construction",
    phases: ["Create independent nodes", "Link each node to its successor", "Traverse the relationships"],
    invariants: ["Each non-tail node references exactly one next node", "The tail next reference is None"],
    complexity: COST.linearCopy,
    eventTypes: ["LINK", "READ", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Traverse a singly linked list",
    objective: "Advance one current reference until the tail points to None.",
    code: `
nodes = [
    {"value": 4, "next": 1},
    {"value": 7, "next": 2},
    {"value": 9, "next": None},
]
current = 0
visited = []

while current is not None:
    node = nodes[current]
    visited.append(node["value"])
    current = node["next"]

print("Visited:", visited)
print("Result:", sum(visited))`,
    expectedResult: "Result: 20",
    structureTypes: ["singly-linked-list", "array"],
    algorithm: "Linked traversal",
    phases: ["Start at the head", "Read the current node", "Follow next until None"],
    invariants: ["visited contains the values before current in chain order"],
    complexity: COST.linearCopy,
    eventTypes: ["VISIT_NODE", "READ", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Prepend a new head node",
    objective: "Insert at the front by linking the new node before changing the head.",
    code: `
head = {"value": "B", "next": {"value": "C", "next": None}}
new_node = {"value": "A", "next": None}

new_node["next"] = head
head = new_node

snapshot = []
current = head
while current is not None:
    snapshot.append(current["value"])
    current = current["next"]

print("Chain:", snapshot)
print("Result:", snapshot == ["A", "B", "C"])`,
    expectedResult: "Result: True",
    structureTypes: ["singly-linked-list"],
    algorithm: "Head insertion",
    phases: ["Create a new node", "Point it to the old head", "Move head to the new node"],
    invariants: ["No existing node becomes unreachable during insertion"],
    complexity: COST.constant,
    eventTypes: ["INSERT", "LINK", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Append after the linked tail",
    objective: "Find the tail and attach a new node without changing earlier links.",
    code: `
head = {"value": 2, "next": {"value": 4, "next": None}}
new_node = {"value": 6, "next": None}
current = head
visits = 1

while current["next"] is not None:
    current = current["next"]
    visits += 1
current["next"] = new_node

snapshot = [head["value"], head["next"]["value"], head["next"]["next"]["value"]]
print("Tail-search visits:", visits)
print("Result:", snapshot)`,
    expectedResult: "Result: [2, 4, 6]",
    structureTypes: ["singly-linked-list"],
    algorithm: "Tail append without a tail reference",
    phases: ["Walk to the tail", "Link the tail to the new node", "Inspect the chain"],
    invariants: ["The current tail is the only node whose next reference is None"],
    complexity: COST.linear,
    eventTypes: ["VISIT_NODE", "INSERT", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Search linked values",
    objective: "Stop traversal when a target value is found or the chain ends.",
    code: `
values = [12, 18, 25, 31]
next_index = [1, 2, 3, None]
target = 25
current = 0
position = 0
found = False

while current is not None:
    if values[current] == target:
        found = True
        break
    current = next_index[current]
    position += 1

print("Position:", position)
print("Result:", found)`,
    expectedResult: "Result: True",
    structureTypes: ["singly-linked-list", "array"],
    algorithm: "Linear linked search",
    phases: ["Start at the head", "Compare the current value", "Follow next or stop"],
    edgeCases: ["A missing value reaches None"],
    complexity: COST.linear,
    eventTypes: ["VISIT_NODE", "COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Insert after a matched node",
    objective: "Preserve the old successor while inserting one node inside a chain.",
    code: `
head = {"value": 10, "next": {"value": 30, "next": None}}
current = head

while current is not None and current["value"] != 10:
    current = current["next"]

inserted = {"value": 20, "next": None}
if current is not None:
    inserted["next"] = current["next"]
    current["next"] = inserted

snapshot = [head["value"], head["next"]["value"], head["next"]["next"]["value"]]
print("Chain:", snapshot)
print("Result:", snapshot == [10, 20, 30])`,
    expectedResult: "Result: True",
    structureTypes: ["singly-linked-list"],
    algorithm: "Linked interior insertion",
    phases: ["Find the predecessor", "Save its old successor", "Link predecessor to the inserted node"],
    invariants: ["The inserted node points to the predecessor's former successor"],
    complexity: COST.linear,
    eventTypes: ["VISIT_NODE", "INSERT", "LINK", "RETURN_RESULT"],
  },
  {
    title: "Delete the first matching node",
    objective: "Reconnect a predecessor around the first node whose value matches.",
    code: `
nodes = [
    {"value": "red", "next": 1},
    {"value": "green", "next": 2},
    {"value": "blue", "next": None},
]
head = 0
previous = None
current = head

while current is not None and nodes[current]["value"] != "green":
    previous = current
    current = nodes[current]["next"]

if current is not None:
    if previous is None:
        head = nodes[current]["next"]
    else:
        nodes[previous]["next"] = nodes[current]["next"]

result = [nodes[head]["value"], nodes[nodes[head]["next"]]["value"]]
print("Result:", result)`,
    expectedResult: "Result: ['red', 'blue']",
    structureTypes: ["singly-linked-list", "array"],
    algorithm: "Linked deletion by value",
    phases: ["Track current and predecessor", "Find the target", "Bypass the target node"],
    invariants: ["Previous is either None or directly before current"],
    edgeCases: ["Deleting the head changes the head reference", "A missing target changes nothing"],
    complexity: COST.linear,
    eventTypes: ["VISIT_NODE", "REMOVE", "UNLINK", "LINK", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Reverse a singly linked chain",
    objective: "Redirect each next relationship while preserving access to the unprocessed suffix.",
    code: `
nodes = [
    {"value": 1, "next": 1},
    {"value": 2, "next": 2},
    {"value": 3, "next": None},
]
previous = None
current = 0

while current is not None:
    following = nodes[current]["next"]
    nodes[current]["next"] = previous
    previous = current
    current = following

head = previous
snapshot = []
while head is not None:
    snapshot.append(nodes[head]["value"])
    head = nodes[head]["next"]

print("Result:", snapshot)`,
    expectedResult: "Result: [3, 2, 1]",
    structureTypes: ["singly-linked-list", "array"],
    algorithm: "Iterative linked-list reversal",
    phases: ["Save the following node", "Reverse the current link", "Advance both references"],
    invariants: ["Previous heads the reversed prefix", "Current heads the unprocessed suffix"],
    complexity: COST.linear,
    eventTypes: ["VISIT_NODE", "UNLINK", "LINK", "UPDATE_BOUNDARY", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Find the linked middle",
    objective: "Move a fast reference twice for every one move of a slow reference.",
    code: `
values = ["A", "B", "C", "D", "E"]
next_index = [1, 2, 3, 4, None]
slow = 0
fast = 0
rounds = 0

while fast is not None and next_index[fast] is not None:
    slow = next_index[slow]
    fast = next_index[next_index[fast]]
    rounds += 1

print("Rounds:", rounds)
print("Middle:", values[slow])
print("Result:", values[slow] == "C")`,
    expectedResult: "Result: True",
    structureTypes: ["singly-linked-list"],
    algorithm: "Slow and fast pointers",
    phases: ["Start both at the head", "Advance slow once and fast twice", "Stop when fast reaches the end"],
    invariants: ["Slow has moved half as many links as fast"],
    edgeCases: ["An even-length chain needs a lower-middle or upper-middle policy"],
    complexity: COST.linear,
    eventTypes: ["VISIT_NODE", "UPDATE_BOUNDARY", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Detect a linked cycle",
    objective: "Use two moving references to detect repeated traversal without extra node storage.",
    code: `
next_index = [1, 2, 3, 1]
slow = 0
fast = 0
has_cycle = False
steps = 0

while fast is not None and next_index[fast] is not None:
    slow = next_index[slow]
    fast = next_index[next_index[fast]]
    steps += 1
    if slow == fast:
        has_cycle = True
        break

print("Meeting index:", slow)
print("Steps:", steps)
print("Result:", has_cycle)`,
    expectedResult: "Result: True",
    structureTypes: ["circular-linked-list"],
    algorithm: "Floyd cycle detection",
    phases: ["Advance at different speeds", "Compare references", "Stop at a meeting or chain end"],
    invariants: ["If a cycle exists, relative motion eventually produces a meeting"],
    edgeCases: ["An acyclic chain ends at None", "A self-loop is a cycle"],
    complexity: { time: "O(n)", space: "O(1)", note: "No visited-node set is required." },
    eventTypes: ["VISIT_NODE", "COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Find the kth node from the end",
    objective: "Maintain a fixed gap between two references so the follower stops at the answer.",
    code: `
values = [8, 13, 21, 34, 55]
next_index = [1, 2, 3, 4, None]
k = 2
lead = 0

for _ in range(k):
    lead = next_index[lead]

follow = 0
while lead is not None:
    lead = next_index[lead]
    follow = next_index[follow]

print("Value:", values[follow])
print("Result:", values[follow] == 34)`,
    expectedResult: "Result: True",
    structureTypes: ["singly-linked-list"],
    algorithm: "Fixed-gap linked pointers",
    phases: ["Advance the lead k links", "Move both references together", "Read the follower at lead exhaustion"],
    invariants: ["Lead remains k links ahead of follow"],
    edgeCases: ["k must be positive and no larger than the chain length"],
    complexity: COST.linear,
    eventTypes: ["VISIT_NODE", "UPDATE_BOUNDARY", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Merge two sorted linked sequences",
    objective: "Choose the smaller current node while preserving sorted remainder order.",
    code: `
left = [1, 4, 7, 10]
right = [2, 3, 8, 11]
left_index = 0
right_index = 0
merged = []

while left_index < len(left) and right_index < len(right):
    if left[left_index] <= right[right_index]:
        merged.append(left[left_index])
        left_index += 1
    else:
        merged.append(right[right_index])
        right_index += 1

merged.extend(left[left_index:])
merged.extend(right[right_index:])
print("Merged chain:", merged)
print("Result:", merged == sorted(left + right))`,
    expectedResult: "Result: True",
    structureTypes: ["singly-linked-list"],
    algorithm: "Sorted linked merge",
    phases: ["Compare current nodes", "Link the smaller node", "Attach the remaining suffix"],
    invariants: ["Merged is sorted and contains every consumed value"],
    complexity: COST.linearCopy,
    eventTypes: ["COMPARE", "LINK", "UPDATE_BOUNDARY", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Remove adjacent linked duplicates",
    objective: "Bypass repeated successors in a sorted linked sequence.",
    code: `
nodes = [
    {"value": 1, "next": 1},
    {"value": 1, "next": 2},
    {"value": 2, "next": 3},
    {"value": 3, "next": 4},
    {"value": 3, "next": None},
]
current = 0

while current is not None and nodes[current]["next"] is not None:
    following = nodes[current]["next"]
    if nodes[current]["value"] == nodes[following]["value"]:
        nodes[current]["next"] = nodes[following]["next"]
    else:
        current = following

snapshot = []
current = 0
while current is not None:
    snapshot.append(nodes[current]["value"])
    current = nodes[current]["next"]
print("Result:", snapshot)`,
    expectedResult: "Result: [1, 2, 3]",
    structureTypes: ["singly-linked-list", "array"],
    algorithm: "Sorted linked deduplication",
    phases: ["Compare adjacent nodes", "Bypass a duplicate", "Advance after a distinct value"],
    invariants: ["The processed prefix contains no adjacent duplicates"],
    complexity: COST.linear,
    eventTypes: ["COMPARE", "REMOVE", "UNLINK", "RETURN_RESULT"],
  },
  {
    title: "Traverse a doubly linked list both ways",
    objective: "Use next and previous relationships to visit the same nodes in opposite orders.",
    code: `
nodes = [
    {"value": "A", "previous": None, "next": 1},
    {"value": "B", "previous": 0, "next": 2},
    {"value": "C", "previous": 1, "next": None},
]
forward = []
current = 0
while current is not None:
    forward.append(nodes[current]["value"])
    tail = current
    current = nodes[current]["next"]

backward = []
current = tail
while current is not None:
    backward.append(nodes[current]["value"])
    current = nodes[current]["previous"]

print("Forward:", forward)
print("Result:", backward)`,
    expectedResult: "Result: ['C', 'B', 'A']",
    structureTypes: ["doubly-linked-list", "array"],
    algorithm: "Bidirectional linked traversal",
    phases: ["Follow next to the tail", "Start at the tail", "Follow previous to the head"],
    invariants: ["For adjacent nodes, next and previous relationships agree"],
    complexity: COST.linearCopy,
    eventTypes: ["VISIT_NODE", "READ", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Insert inside a doubly linked chain",
    objective: "Update four neighboring relationships when inserting between two nodes.",
    code: `
nodes = [
    {"value": 10, "previous": None, "next": 1},
    {"value": 30, "previous": 0, "next": None},
]
left = 0
right = nodes[left]["next"]
inserted = len(nodes)
nodes.append({"value": 20, "previous": left, "next": right})

nodes[left]["next"] = inserted
nodes[right]["previous"] = inserted

valid = nodes[nodes[left]["next"]]["value"] == 20
valid = valid and nodes[nodes[right]["previous"]]["value"] == 20
print("Nodes:", nodes)
print("Result:", valid)`,
    expectedResult: "Result: True",
    structureTypes: ["doubly-linked-list", "array"],
    algorithm: "Doubly linked insertion",
    phases: ["Capture both neighbors", "Create two links on the new node", "Redirect both neighbors"],
    invariants: ["Every next link has a matching previous link"],
    complexity: COST.constant,
    eventTypes: ["INSERT", "LINK", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Developing",
  },
  {
    title: "Remove from a doubly linked chain",
    objective: "Reconnect both neighbors before making the removed node unreachable.",
    code: `
nodes = [
    {"value": "left", "previous": None, "next": 1},
    {"value": "remove", "previous": 0, "next": 2},
    {"value": "right", "previous": 1, "next": None},
]
target = 1
previous = nodes[target]["previous"]
following = nodes[target]["next"]

nodes[previous]["next"] = following
nodes[following]["previous"] = previous
nodes[target]["previous"] = None
nodes[target]["next"] = None

valid = nodes[previous]["next"] == following
valid = valid and nodes[following]["previous"] == previous
print("Result:", valid)`,
    expectedResult: "Result: True",
    structureTypes: ["doubly-linked-list", "array"],
    algorithm: "Doubly linked removal",
    phases: ["Read both neighbors", "Join the neighbors", "Detach the removed node"],
    invariants: ["The surviving neighbor links remain symmetric"],
    complexity: COST.constant,
    eventTypes: ["REMOVE", "UNLINK", "LINK", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Walk a circular linked list once",
    objective: "Stop circular traversal when the current reference returns to the head.",
    code: `
values = ["north", "east", "south", "west"]
next_index = [1, 2, 3, 0]
head = 0
current = head
visited = []

while True:
    visited.append(values[current])
    current = next_index[current]
    if current == head:
        break

print("Cycle:", visited)
print("Returned to head:", current)
print("Result:", len(visited) == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["circular-linked-list"],
    algorithm: "Bounded circular traversal",
    phases: ["Visit the head", "Follow next links", "Stop on return to head"],
    invariants: ["No None tail exists in this circular representation"],
    edgeCases: ["A one-node circle points back to itself"],
    complexity: COST.linearCopy,
    eventTypes: ["VISIT_NODE", "COMPARE", "UPDATE_BOUNDARY", "RETURN_RESULT"],
  },
  {
    title: "Implement a linked stack",
    objective: "Push and pop at a linked head to satisfy the stack contract.",
    code: `
head = None

for value in [1, 2, 3]:
    head = {"value": value, "next": head}

popped = []
while head is not None:
    popped.append(head["value"])
    head = head["next"]

print("Pop order:", popped)
print("Result:", popped == [3, 2, 1])`,
    expectedResult: "Result: True",
    structureTypes: ["stack", "singly-linked-list"],
    algorithm: "Linked-node stack",
    phases: ["Prepend on push", "Read the head on pop", "Move head to its successor"],
    invariants: ["Head is the current stack top"],
    complexity: COST.constant,
    eventTypes: ["PUSH", "POP", "LINK", "UNLINK", "RETURN_RESULT"],
    comparisonGroup: "stack-representations",
  },
  {
    title: "Implement a linked queue",
    objective: "Use separate head and tail references for constant-time enqueue and dequeue.",
    code: `
nodes = []
head = None
tail = None

for value in ["A", "B", "C"]:
    nodes.append({"value": value, "next": None})
    new_index = len(nodes) - 1
    if tail is None:
        head = new_index
    else:
        nodes[tail]["next"] = new_index
    tail = new_index

served = []
while head is not None:
    served.append(nodes[head]["value"])
    head = nodes[head]["next"]
if head is None:
    tail = None

print("Served:", served)
print("Result:", tail is None and served == ["A", "B", "C"])`,
    expectedResult: "Result: True",
    structureTypes: ["queue", "singly-linked-list", "array"],
    algorithm: "Head-tail linked queue",
    phases: ["Link each new tail", "Remove from the head", "Reset tail when empty"],
    invariants: ["Tail is None exactly when head is None"],
    complexity: COST.constant,
    eventTypes: ["ENQUEUE", "DEQUEUE", "LINK", "UNLINK", "CHECK_INVARIANT", "RETURN_RESULT"],
    comparisonGroup: "queue-representations",
    difficulty: "Guided Challenge",
  },
  {
    title: "Compare linked and array insertion",
    objective: "Separate the cost of locating a position from the structural work after it is known.",
    code: `
array_values = [10, 20, 40, 50]
linked_values = [10, 20, 40, 50]
known_position = 2

array_shifts = len(array_values) - known_position
array_values.insert(known_position, 30)

linked_relinks = 2
linked_values = (
    linked_values[:known_position]
    + [30]
    + linked_values[known_position:]
)

print("Array shifts:", array_shifts)
print("Linked relinks after location:", linked_relinks)
print("Result:", array_values == linked_values)`,
    expectedResult: "Result: True",
    structureTypes: ["array", "singly-linked-list"],
    algorithm: "Insertion representation comparison",
    phases: ["Assume a known insertion position", "Count array movement", "Count linked relationship changes"],
    invariants: ["Both representations produce the same logical sequence"],
    complexity: { time: "Array O(n), linked O(1) after a known node", space: "O(1) structural work", note: "Finding the linked insertion node can still require O(n) traversal." },
    eventTypes: ["INSERT", "LINK", "COMPARE", "RETURN_RESULT"],
    comparisonGroup: "sequence-representations",
    difficulty: "Guided Challenge",
  },
].map((program) => ({ ...program, section: "Linked structures" }));

/** Hash-table and set lessons expose contracts, collisions, and applied membership patterns. */
const hashSetPrograms = [
  {
    title: "Map keys to bucket indices",
    objective: "Use a small deterministic teaching hash to place keys into a bounded bucket array.",
    code: `
keys = ["ant", "bee", "cat", "dog"]
bucket_count = 5
buckets = [[] for _ in range(bucket_count)]

for key in keys:
    teaching_hash = sum(ord(character) for character in key)
    index = teaching_hash % bucket_count
    buckets[index].append(key)
    print(key, "->", index)

stored = sum(len(bucket) for bucket in buckets)
print("Buckets:", buckets)
print("Result:", stored == len(keys))`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array"],
    algorithm: "Teaching hash and compression",
    phases: ["Compute a deterministic integer", "Compress it to a bucket index", "Store the key"],
    invariants: ["Every key is stored in exactly one valid bucket"],
    complexity: COST.linearCopy,
    eventTypes: ["READ", "VISIT_INDEX", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Resolve collisions with chaining",
    objective: "Store several keys in one bucket without overwriting earlier collisions.",
    code: `
pairs = [("ab", 1), ("ba", 2), ("cc", 3)]
bucket_count = 3
table = [[] for _ in range(bucket_count)]

def index_for(key):
    return sum(ord(character) for character in key) % bucket_count

for key, value in pairs:
    index = index_for(key)
    table[index].append((key, value))

collision_bucket = table[index_for("ab")]
keys = [key for key, value in collision_bucket]
print("Collision chain:", collision_bucket)
print("Result:", "ab" in keys and "ba" in keys)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array"],
    algorithm: "Separate chaining",
    phases: ["Compute the bucket", "Append to its chain", "Compare keys inside the chain"],
    invariants: ["Colliding keys remain distinct entries"],
    complexity: { time: "Average O(1), worst O(n)", space: "O(n)", note: "A long collision chain can require a linear scan." },
    eventTypes: ["INSERT", "COMPARE", "VISIT_INDEX", "RETURN_RESULT"],
  },
  {
    title: "Insert and update a chained table",
    objective: "Replace an existing key's value while preserving every other entry.",
    code: `
table = [[], [], []]

def put(key, value):
    index = len(key) % len(table)
    for position, entry in enumerate(table[index]):
        if entry[0] == key:
            table[index][position] = (key, value)
            return "updated"
    table[index].append((key, value))
    return "inserted"

first = put("red", 1)
second = put("blue", 2)
third = put("red", 9)

print("Actions:", first, second, third)
print("Table:", table)
print("Result:", sum(len(bucket) for bucket in table) == 2)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array"],
    algorithm: "Chained hash-table put",
    phases: ["Locate a bucket", "Search for equal key", "Update or append"],
    invariants: ["At most one live entry in a chain has a given key"],
    complexity: { time: "Average O(1), worst O(n)", space: "O(n)", note: "Collision-chain length controls the worst case." },
    eventTypes: ["READ", "COMPARE", "INSERT", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Look up a chained-table key",
    objective: "Compare full keys after choosing a bucket because equal hashes do not imply equal keys.",
    code: `
table = [
    [("amy", 72), ("zoe", 88)],
    [("li", 91)],
    [],
]

def get(key):
    index = len(key) % len(table)
    for stored_key, value in table[index]:
        if stored_key == key:
            return value
    return None

found = get("zoe")
missing = get("sam")
print("Found:", found)
print("Missing:", missing)
print("Result:", found == 88 and missing is None)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table"],
    algorithm: "Chained hash-table lookup",
    phases: ["Compute the bucket", "Compare candidate keys", "Return value or missing result"],
    edgeCases: ["A missing key and a stored None value need distinct policies in some APIs"],
    complexity: { time: "Average O(1), worst O(n)", space: "O(1)", note: "Lookup scans only the selected collision chain." },
    eventTypes: ["READ", "COMPARE", "VISIT_INDEX", "RETURN_RESULT"],
  },
  {
    title: "Delete a chained-table entry",
    objective: "Remove one matching key from its collision chain without disturbing neighbors.",
    code: `
table = [
    [("east", 1), ("west", 2)],
    [("north", 3)],
]
key_to_remove = "west"
index = 0
removed = False

for position, (key, value) in enumerate(table[index]):
    if key == key_to_remove:
        table[index].pop(position)
        removed = True
        break

remaining = [key for bucket in table for key, value in bucket]
print("Remaining:", remaining)
print("Result:", removed and key_to_remove not in remaining)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array"],
    algorithm: "Chained hash-table deletion",
    phases: ["Select the bucket", "Find the exact key", "Remove only that chain entry"],
    invariants: ["All non-target entries retain their key-value association"],
    complexity: { time: "Average O(1), worst O(n)", space: "O(1)", note: "The selected chain may contain many collisions." },
    eventTypes: ["COMPARE", "REMOVE", "VISIT_INDEX", "RETURN_RESULT"],
  },
  {
    title: "Measure hash-table load factor",
    objective: "Relate stored-entry count to bucket count before choosing a resize policy.",
    code: `
bucket_count = 8
entry_counts = [0, 1, 0, 2, 1, 0, 1, 1]
stored = sum(entry_counts)
load_factor = stored / bucket_count
threshold = 0.75

should_resize = load_factor >= threshold
print("Entries:", stored)
print("Buckets:", bucket_count)
print("Load factor:", load_factor)
print("Result:", should_resize)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array"],
    algorithm: "Load-factor check",
    phases: ["Count entries", "Divide by bucket count", "Apply an explicit resize policy"],
    invariants: ["Load factor equals entries divided by buckets"],
    complexity: COST.linear,
    eventTypes: ["READ", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Rehash entries into more buckets",
    objective: "Recompute every bucket index after changing the bucket count.",
    code: `
entries = [("ant", 1), ("bee", 2), ("cat", 3), ("dog", 4)]
new_bucket_count = 7
new_table = [[] for _ in range(new_bucket_count)]

for key, value in entries:
    index = sum(ord(character) for character in key) % new_bucket_count
    new_table[index].append((key, value))

flattened = [entry for bucket in new_table for entry in bucket]
same_entries = sorted(flattened) == sorted(entries)
print("New table:", new_table)
print("Result:", same_entries)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array"],
    algorithm: "Hash-table rehash",
    phases: ["Allocate new buckets", "Recompute every index", "Verify entry preservation"],
    invariants: ["Rehashing preserves every key-value pair exactly once"],
    complexity: { time: "O(n)", space: "O(n + b)", note: "All n entries move into a new b-bucket array." },
    eventTypes: ["VISIT_INDEX", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Solve two sum with a hash map",
    objective: "Remember earlier values so each complement query avoids a nested scan.",
    code: `
values = [2, 7, 11, 15]
target = 9
seen = {}
answer = None

for index, value in enumerate(values):
    complement = target - value
    if complement in seen:
        answer = (seen[complement], index)
        break
    seen[value] = index

print("Seen:", seen)
print("Indices:", answer)
print("Result:", answer == (0, 1))`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array"],
    algorithm: "One-pass two sum",
    phases: ["Compute the complement", "Query earlier values", "Store the current value"],
    invariants: ["seen maps each processed value to an earlier index"],
    edgeCases: ["Duplicate values can form a valid pair at distinct indices"],
    complexity: COST.setLinear,
    eventTypes: ["VISIT_INDEX", "READ", "COMPARE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Count frequencies with a dictionary",
    objective: "Accumulate one count per distinct value.",
    code: `
words = ["pear", "apple", "pear", "plum", "apple", "pear"]
counts = {}

for word in words:
    counts[word] = counts.get(word, 0) + 1

most_frequent = max(counts, key=counts.get)
total = sum(counts.values())
print("Counts:", counts)
print("Most frequent:", most_frequent)
print("Result:", total == len(words) and counts["pear"] == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table"],
    algorithm: "Frequency table",
    phases: ["Read each value", "Initialize or increment its count", "Inspect aggregate counts"],
    invariants: ["The sum of counts equals the processed item count"],
    complexity: COST.setLinear,
    eventTypes: ["READ", "INSERT", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Find the first repeated value",
    objective: "Use a seen set to stop at the earliest second occurrence.",
    code: `
values = [8, 3, 5, 3, 8, 2]
seen = set()
first_repeat = None

for value in values:
    if value in seen:
        first_repeat = value
        break
    seen.add(value)

print("Seen before stop:", seen)
print("First repeat:", first_repeat)
print("Result:", first_repeat == 3)`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "First-repeat membership scan",
    phases: ["Check membership", "Stop on a repeat", "Otherwise remember the value"],
    invariants: ["seen contains every distinct value before the current position"],
    complexity: COST.setLinear,
    eventTypes: ["READ", "COMPARE", "INSERT", "RETURN_RESULT"],
  },
  {
    title: "Group anagrams by a hash key",
    objective: "Use a canonical sorted-letter key to collect words with the same letters.",
    code: `
words = ["eat", "tea", "tan", "ate", "nat", "bat"]
groups = {}

for word in words:
    key = "".join(sorted(word))
    groups.setdefault(key, []).append(word)

normalized = sorted(sorted(group) for group in groups.values())
print("Groups:", normalized)
print("Group count:", len(groups))
print("Result:", any(group == ["ate", "eat", "tea"] for group in normalized))`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "array"],
    algorithm: "Anagram grouping",
    phases: ["Build a canonical key", "Append to its group", "Inspect grouped values"],
    invariants: ["Words in one group share the same canonical key"],
    complexity: { time: "O(n * k log k)", space: "O(nk)", note: "Each of n words sorts up to k characters for its key." },
    eventTypes: ["READ", "INSERT", "WRITE", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Compute set intersection",
    objective: "Keep only values that appear in both collections.",
    code: `
course_a = {"Ava", "Ben", "Chen", "Dia"}
course_b = {"Ben", "Dia", "Eli"}

both = course_a & course_b
only_a = course_a - course_b

print("Both:", sorted(both))
print("Only A:", sorted(only_a))
print("Result:", both == {"Ben", "Dia"})`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Set intersection",
    phases: ["Build both membership sets", "Select shared values", "Inspect the result"],
    invariants: ["Every intersection value belongs to both inputs"],
    complexity: COST.setLinear,
    eventTypes: ["READ", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Combine sets with union",
    objective: "Create one membership set containing every value from either input.",
    code: `
morning = {"email", "standup", "review"}
afternoon = {"review", "code", "deploy"}

all_tasks = morning | afternoon
duplicates_removed = len(morning) + len(afternoon) - len(all_tasks)

print("All tasks:", sorted(all_tasks))
print("Shared count:", duplicates_removed)
print("Result:", all_tasks == {"email", "standup", "review", "code", "deploy"})`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Set union",
    phases: ["Read both sets", "Combine membership", "Count collapsed overlap"],
    invariants: ["Every input member belongs to the union"],
    complexity: COST.setLinear,
    eventTypes: ["READ", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Compare directional set differences",
    objective: "See that values in left minus right differ from values in right minus left.",
    code: `
planned = {"login", "search", "export", "logout"}
completed = {"login", "search", "share"}

missing = planned - completed
unexpected = completed - planned

print("Missing:", sorted(missing))
print("Unexpected:", sorted(unexpected))
print("Result:", missing == {"export", "logout"} and unexpected == {"share"})`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Directional set difference",
    phases: ["Subtract completed from planned", "Subtract planned from completed", "Interpret each direction"],
    invariants: ["Difference members belong to the left input and not the right"],
    complexity: COST.setLinear,
    eventTypes: ["READ", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Find symmetric set differences",
    objective: "Collect values present in exactly one of two sets.",
    code: `
first = {1, 2, 3, 5}
second = {3, 4, 5, 6}

exclusive = first ^ second
by_parts = (first - second) | (second - first)

print("Exclusive:", sorted(exclusive))
print("By parts:", sorted(by_parts))
print("Result:", exclusive == by_parts == {1, 2, 4, 6})`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Symmetric difference",
    phases: ["Remove the overlap", "Keep both exclusive sides", "Verify an equivalent construction"],
    invariants: ["No result value belongs to both inputs"],
    complexity: COST.setLinear,
    eventTypes: ["READ", "COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Check subset and superset contracts",
    objective: "Test whether every required permission appears in an available permission set.",
    code: `
available = {"read", "write", "share", "archive"}
required = {"read", "share"}
extra = available - required

requirements_met = required <= available
available_is_superset = available >= required

print("Extra permissions:", sorted(extra))
print("Subset:", requirements_met)
print("Result:", requirements_met and available_is_superset)`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Subset requirement check",
    phases: ["Build required membership", "Compare with available membership", "Inspect extra values"],
    invariants: ["A subset has no member outside its superset"],
    complexity: COST.setLinear,
    eventTypes: ["COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Test disjoint resource sets",
    objective: "Detect whether two jobs can run without competing for the same named resource.",
    code: `
job_a = {"database", "cache"}
job_b = {"printer", "scanner"}
job_c = {"cache", "network"}

safe_pair = job_a.isdisjoint(job_b)
conflicting_pair = not job_a.isdisjoint(job_c)
conflicts = job_a & job_c

print("A and B disjoint:", safe_pair)
print("A and C conflicts:", conflicts)
print("Result:", safe_pair and conflicting_pair)`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Set disjointness check",
    phases: ["Compare first resource pair", "Compare second pair", "Expose the actual overlap"],
    invariants: ["Disjoint sets have an empty intersection"],
    complexity: COST.setLinear,
    eventTypes: ["COMPARE", "CHECK_INVARIANT", "RETURN_RESULT"],
  },
  {
    title: "Deduplicate while preserving order",
    objective: "Combine a membership set with an output list so first appearances keep their order.",
    code: `
values = ["a", "b", "a", "c", "b", "d"]
seen = set()
unique = []

for value in values:
    if value not in seen:
        seen.add(value)
        unique.append(value)

print("Seen:", seen)
print("Ordered unique:", unique)
print("Result:", unique == ["a", "b", "c", "d"])`,
    expectedResult: "Result: True",
    structureTypes: ["set", "array"],
    algorithm: "Order-preserving deduplication",
    phases: ["Check membership", "Remember a first appearance", "Append only new values"],
    invariants: ["unique contains each seen value once in first-appearance order"],
    complexity: COST.setLinear,
    eventTypes: ["READ", "COMPARE", "INSERT", "WRITE", "RETURN_RESULT"],
  },
  {
    title: "Find the longest consecutive run",
    objective: "Start counting only at values with no predecessor in the membership set.",
    code: `
values = [100, 4, 200, 1, 3, 2]
numbers = set(values)
best = 0

for number in numbers:
    if number - 1 not in numbers:
        length = 1
        while number + length in numbers:
            length += 1
        best = max(best, length)

print("Members:", numbers)
print("Longest run:", best)
print("Result:", best == 4)`,
    expectedResult: "Result: True",
    structureTypes: ["set"],
    algorithm: "Longest consecutive sequence",
    phases: ["Build a membership set", "Recognize run starts", "Extend each run"],
    invariants: ["A counted run starts only where predecessor membership is absent"],
    complexity: { time: "Average O(n)", space: "O(n)", note: "Each consecutive value participates in one run extension from its start." },
    eventTypes: ["READ", "COMPARE", "VISIT_INDEX", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Detect nearby duplicates",
    objective: "Keep a bounded set for the most recent k positions.",
    code: `
values = [1, 2, 3, 1, 4, 5]
distance = 3
recent = set()
nearby_duplicate = False

for index, value in enumerate(values):
    if value in recent:
        nearby_duplicate = True
        break
    recent.add(value)
    if len(recent) > distance:
        recent.remove(values[index - distance])

print("Recent:", recent)
print("Result:", nearby_duplicate)`,
    expectedResult: "Result: True",
    structureTypes: ["set", "array"],
    algorithm: "Sliding membership set",
    phases: ["Check recent membership", "Add the current value", "Evict the value leaving the window"],
    invariants: ["recent represents at most the previous k values"],
    complexity: { time: "Average O(n)", space: "O(k)", note: "The bounded set stores at most k recent values." },
    eventTypes: ["VISIT_INDEX", "COMPARE", "INSERT", "REMOVE", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Use frozen sets as dictionary keys",
    objective: "Represent an unordered immutable group as a hashable mapping key.",
    code: `
routes = {
    frozenset({"A", "B"}): 5,
    frozenset({"B", "C"}): 7,
}

query_forward = frozenset({"A", "B"})
query_reverse = frozenset({"B", "A"})
same_cost = routes[query_forward] == routes[query_reverse]

print("Route keys:", list(routes))
print("Cost:", routes[query_reverse])
print("Result:", same_cost)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "set"],
    algorithm: "Frozen-set composite key",
    phases: ["Freeze unordered members", "Store the composite key", "Query with equivalent membership"],
    invariants: ["Equal frozen sets have the same members regardless of construction order"],
    complexity: COST.hashAverage,
    eventTypes: ["INSERT", "READ", "COMPARE", "RETURN_RESULT"],
  },
  {
    title: "Observe equality inside a collision",
    objective: "Show that dictionary lookup checks equality after hash values match.",
    code: `
class CollisionKey:
    def __init__(self, label):
        self.label = label

    def __hash__(self):
        return 1

    def __eq__(self, other):
        return isinstance(other, CollisionKey) and self.label == other.label

first = CollisionKey("first")
second = CollisionKey("second")
table = {first: 10, second: 20}

lookup = table[CollisionKey("second")]
print("Entry count:", len(table))
print("Result:", lookup)`,
    expectedResult: "Result: 20",
    structureTypes: ["hash-table"],
    algorithm: "Hash collision with equality resolution",
    phases: ["Return equal hash values", "Compare full keys", "Retrieve the equal key's value"],
    invariants: ["Equal hashes do not make unequal keys the same mapping entry"],
    complexity: { time: "Worst O(n) in this forced collision", space: "O(n)", note: "The lesson intentionally sends every key to one hash value." },
    eventTypes: ["INSERT", "COMPARE", "READ", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
  },
  {
    title: "Compare list scan with set membership",
    objective: "Count explicit list comparisons while checking the same targets through a set.",
    code: `
values = list(range(20))
targets = [19, 7, 25]
comparison_count = 0
list_answers = []

for target in targets:
    found = False
    for value in values:
        comparison_count += 1
        if value == target:
            found = True
            break
    list_answers.append(found)

value_set = set(values)
set_answers = [target in value_set for target in targets]
print("List comparisons:", comparison_count)
print("Answers:", list_answers)
print("Result:", list_answers == set_answers)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "set", "array"],
    algorithm: "Membership representation comparison",
    phases: ["Scan the list explicitly", "Build a set", "Compare equivalent answers"],
    invariants: ["Both representations answer the same membership question"],
    complexity: { time: "List O(qn), set average O(n + q)", space: "Set O(n)", note: "Building the set has a cost that pays off across repeated queries." },
    eventTypes: ["COMPARE", "READ", "INSERT", "RETURN_RESULT"],
    comparisonGroup: "membership-representations",
    difficulty: "Guided Challenge",
  },
  {
    title: "Build a small hash-indexed cache",
    objective: "Combine direct lookup with an explicit bounded eviction order.",
    code: `
from collections import deque

capacity = 3
cache = {}
order = deque()

for key, value in [("A", 1), ("B", 2), ("C", 3), ("D", 4)]:
    if key not in cache and len(cache) == capacity:
        oldest = order.popleft()
        del cache[oldest]
    cache[key] = value
    order.append(key)

hit = cache.get("C")
miss = cache.get("A")
print("Cache:", cache)
print("Order:", list(order))
print("Result:", hit == 3 and miss is None)`,
    expectedResult: "Result: True",
    structureTypes: ["hash-table", "queue", "deque"],
    algorithm: "FIFO cache",
    phases: ["Check capacity", "Evict the oldest key", "Store the new key and order record"],
    invariants: ["Cache keys and order keys match", "Cache size never exceeds capacity"],
    edgeCases: ["Updating an existing key needs an order policy"],
    complexity: COST.hashAverage,
    eventTypes: ["READ", "DEQUEUE", "REMOVE", "INSERT", "CHECK_INVARIANT", "RETURN_RESULT"],
    difficulty: "Guided Challenge",
    comparisonGroup: "cache-policies",
  },
].map((program) => ({ ...program, section: "Hash tables and set algorithms" }));

/** Definitions remain ordered by the approved Chunk 2 curriculum sequence. */
const definitions = [
  ...stackQueuePrograms,
  ...linkedPrograms,
  ...hashSetPrograms,
];

/** Frozen Chunk 2 records continue identifiers from DSA-132 through DSA-197. */
export const DSA_CHUNK_TWO_PROGRAMS = Object.freeze(
  definitions.map((definition, index) => makeProgram(definition, index)),
);
