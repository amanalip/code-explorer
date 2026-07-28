# Code Explorer: Python Data Structures and Algorithms

Code Explorer DSA is a separate, browser-based learning workspace for studying how Python data structures and algorithms behave one recorded step at a time. It combines editable Python, a reviewed curriculum, trace playback, structure views, algorithm context, comparisons, input experiments, and conservative explanations.

Everything runs on the learner's device. Code Explorer does not collect learner source, input, output, traces, clipboard text, preferences, or interaction analytics.

## Current release status

The DSA workspace is at **Chunk 7: complete Tier A curriculum**.

Chunks 1 through 7 implement:

- 535 reviewed and executable curriculum programs.
- 25 ordered curriculum sections.
- A vertical example browser with local metadata search, section counts, difficulty, line count, objective, complexity, and recommended views.
- Local Python execution through the same isolated Pyodide worker used by the Python workspace.
- A 3,000-step trace limit and a 30-second outer timeout.
- Playback controls and 18 working learning views under Trace, Data, Flow, and Labs.
- Observed, Curriculum context, Unavailable, and Shortened evidence labels.
- Automatic comments, Learning comments, wrapping, font sizing, Copy, Paste, prepared input, source persistence, and theme persistence.
- 20 approved structure representation names and 31 stable DSA event names.

Chunk 7 completes all 535 approved Tier A programs. The final 84 programs contain 48 edge-case and debugging investigations plus 36 integrated guided challenges. Tier B, Tier C, future view extensions, and later algorithms recorded in `Tier.md` are still plans, not implemented claims.

## Contents

- [Start here](#start-here)
- [Choose the correct workspace](#choose-the-correct-workspace)
- [Workspace map](#workspace-map)
- [The 535-program curriculum](#the-535-program-curriculum)
- [Your first guided run](#your-first-guided-run)
- [Editor controls](#editor-controls)
- [Trace playback](#trace-playback)
- [Evidence labels and honesty](#evidence-labels-and-honesty)
- [The 18 learning views](#the-18-learning-views)
- [Automatic and exported learning comments](#automatic-and-exported-learning-comments)
- [Pasted-code boundary](#pasted-code-boundary)
- [Limits and bounded presentation](#limits-and-bounded-presentation)
- [Persistence](#persistence)
- [Privacy and network requests](#privacy-and-network-requests)
- [Troubleshooting](#troubleshooting)
- [What comes next](#what-comes-next)

## Start here

Use this route if data structures and algorithms are your main question:

```text
Landing page
    |
    +-- Start exploring Python Data Structures and Algorithms
            |
            +-- Examples
            |      |
            |      +-- choose a section
            |      +-- read the objective
            |      +-- inspect complexity and best views
            |      +-- open one program
            |
            +-- Run trace
                   |
                   +-- replay steps
                   +-- inspect structure state
                   +-- compare evidence with curriculum context
```

The shortest useful workflow is:

1. Open **Examples**.
2. Choose **Algorithm and complexity foundations**.
3. Open **Average by accumulation**.
4. Predict its output.
5. Select **Run trace**.
6. Use the timeline or arrow controls to move through the run.
7. Compare **Algorithm Story**, **Variables**, **Step Table**, and **Complexity Lab**.
8. Change one input value in the editor.
9. Run again and compare what changed.

Code Explorer does not record which lessons you studied or which suggestions you tried. The section order is a recommendation, not a completion tracker.

## Choose the correct workspace

```text
What are you trying to understand?
|
+-- Python statements, variables, loops, functions, classes, or errors
|      |
|      +-- Start exploring Python
|             Guide: README.md
|
+-- data structure operations, algorithm behavior, invariants, or complexity
       |
       +-- Start exploring Python Data Structures and Algorithms
              Guide: README_DSA.md
```

Both workspaces execute Python locally, but they organize learning differently. The Python workspace starts from language behavior. The DSA workspace starts from reviewed algorithm questions and structure operations.

## Workspace map

```text
DATA STRUCTURES AND ALGORITHMS WORKSPACE
|
+-- SOURCE
|   +-- editable main.py
|   +-- Wrap on or off
|   +-- Automatic comments on or off
|   +-- font size
|   +-- Copy
|   +-- Paste
|
+-- CURRICULUM
|   +-- 535 reviewed programs
|   +-- local search across complete reviewed records
|   +-- 25 vertical section filters
|   +-- objective and description
|   +-- difficulty and line count
|   +-- reviewed time and space context
|   +-- recommended views
|
+-- TRACE
|   +-- Algorithm Story
|   +-- Before and After
|   +-- Decisions
|   +-- Calls and Recursion
|   +-- Error Coach
|
+-- DATA
|   +-- Variables
|   +-- Watches
|   +-- Structure Canvas
|   +-- References
|   +-- Mutation Explorer
|   +-- Invariant Checker
|
+-- FLOW
|   +-- Operation Journey
|   +-- Algorithm Path
|   +-- Step Table
|   +-- Complexity Lab
|
+-- LABS
|   +-- Input Playground
|   +-- Compare Algorithms
|   +-- Edge Case Lab
|
+-- PLAYBACK
|   +-- previous, play, next, restart
|   +-- step slider
|   +-- 0.5x, 1x, or 2x speed
|
+-- OUTPUT
    +-- console text available up to the selected step
    +-- clear visual output without changing the program
```

### Workspace layout

The DSA workspace uses a wider desktop boundary than the Python workspace because a structure or algorithm view often needs to sit beside the source that produced it.

```text
WIDE LAPTOP OR DESKTOP

+-------------------------+  +----------------------------------+
| Python source           |  | TRACE | DATA | FLOW | LABS       |
| editor or study preview |  | one horizontal view-label row    |
|                         |  | current evidence and explanation |
+-------------------------+  +----------------------------------+

NARROW LAPTOP OR PHONE

+---------------------------------------------------------------+
| Python source or study preview                                |
+---------------------------------------------------------------+
| TRACE | DATA | FLOW | LABS                                    |
| one horizontal view-label row                                 |
| the label strip scrolls inside this panel only when necessary |
+---------------------------------------------------------------+
```

At a wide laptop size, source and the selected learning view appear beside each other. Before either column becomes too narrow, the panels stack vertically. View names never break into an accidental second row. On a narrow phone, the view-label strip keeps one horizontal row and can scroll inside its own boundary. The complete page does not scroll sideways.

### Scrolling long learning views

The DSA source panel and learning panel keep stable heights. This is the shared contract for all 18 learning views. A long Step Table, Before and After list, Operation Journey, graph, comparison, or any other learning result does not keep enlarging the complete workspace.

Move the pointer over the learning result and use a mouse wheel, trackpad gesture, touch scroll, Page Up, Page Down, Home, End, or the visible scrollbar. Only the result stage moves:

```text
+---------------- DSA LEARNING PANEL ----------------+
| TRACE | DATA | FLOW | LABS                         |
| view tabs                              STEP 20 / 20 |
+----------------------------------------------------+
|                                                    |
|   long selected view                         ^     |
|   scrolls inside this region                 |     |
|                                              |     |
|                                              v     |
+----------------------------------------------------+

Playback and Console Output keep their positions below the bounded panel.
```

The learning result uses a stable scrollbar gutter, so its readable width does not jump when a short view becomes long enough to scroll. Short results remain inside the same stable region without needing vertical movement. On a phone, the panel uses a shorter but still bounded height. The view-label strip can scroll horizontally, while the selected learning result scrolls vertically.

## The 535-program curriculum

### Exact implemented counts

| Order | Section | Programs | Main learning purpose |
| --- | --- | ---: | --- |
| 01 | Algorithm and complexity foundations | 24 | Inputs, outputs, preconditions, postconditions, invariants, operation counts, growth, and space reasoning |
| 02 | Abstract data types and representations | 12 | Separate an interface promise from one concrete representation |
| 03 | Python-native containers | 42 | Lists, tuples, dictionaries, sets, deque, Counter, defaultdict, ChainMap, namedtuple, and OrderedDict |
| 04 | Arrays and sequence techniques | 20 | Traversal, two pointers, sliding windows, prefix sums, partitioning, intervals, selection, and matrices |
| 05 | Searching | 9 | Linear search, binary search, boundaries, insertion points, and repeated queries |
| 06 | Sorting and sorting properties | 24 | Elementary sorts, divide-and-conquer sorts, non-comparison sorts, stability, adaptiveness, and input shape |
| 07 | Stacks, queues, and deques | 22 | LIFO and FIFO contracts, monotonic structures, circular queues, bounded history, and comparisons |
| 08 | Linked structures | 20 | Singly, doubly, and circular links, traversal, insertion, deletion, reversal, pointers, and linked ADTs |
| 09 | Hash tables and set algorithms | 24 | Buckets, collisions, chaining, resizing, membership, frequencies, grouping, and set relationships |
| 10 | Trees and binary search trees | 30 | Tree vocabulary, depth-first and breadth-first traversals, shape rules, serialization, BST search, insertion, deletion, validation, rank, and height |
| 11 | Heaps and priority queues | 18 | Array relationships, heapify, push, pop, invariant checks, top-k selection, stable scheduling, k-way merge, and construction comparisons |
| 12 | Tries and string algorithms | 24 | Prefix insertion, lookup, deletion, autocomplete, counted paths, suffix tries, direct search, KMP, rolling hash, and string transformations |
| 13 | Union-Find | 10 | Make set, representative lookup, union, size and rank balancing, path compression, connectivity, components, and cycle detection |
| 14 | Graph structures and vocabulary | 24 | Vertices, edges, direction, weights, degree, adjacency lists, matrices, edge lists, conversions, validation, walks, trails, paths, DAGs, and representation tradeoffs |
| 15 | Graph traversal and connectivity | 20 | BFS, recursive and iterative DFS, paths, reachability, components, cycles, bipartite checks, topological sorts, grid traversal, and traversal comparisons |
| 16 | Shortest paths and spanning trees | 14 | Relaxation, Dijkstra, DAG paths, Bellman-Ford, negative cycles, Floyd-Warshall, Kruskal, Prim, forests, and MST comparison |
| 17 | Recursion | 18 | Base cases, shrinking measures, return-time combination, recursive strings, numbers, arrays, trees, mutual recursion, memoization, and iterative comparisons |
| 18 | Backtracking | 16 | Choice trees, restoration, pruning, subsets, permutations, combinations, grids, N-Queens, Sudoku, graph coloring, partitions, and duplicate-aware enumeration |
| 19 | Divide and conquer | 10 | Balanced reductions, merge sort, quicksort, lower bounds, inversion counting, range optimization, majority candidates, Karatsuba multiplication, and quickselect |
| 20 | Greedy algorithms | 16 | Scheduling, room allocation, fractional choice, coin boundaries, cash change, reachability, intervals, prefix coding, job sequencing, ropes, and refueling |
| 21 | Dynamic programming | 24 | State design, base states, transitions, tabulation, memoization, reconstruction, space optimization, sequence alignment, grid paths, interval state, and state machines |
| 22 | Bit manipulation | 16 | AND, OR, XOR, masks, shifts, bit fields, population counts, one-bit properties, cancellation, subsets, flags, bit sets, Hamming distance, Gray code, and bounded bitwise addition |
| 23 | Elementary mathematical algorithms | 14 | GCD, extended Euclid, LCM, primality, sieves, factorization, modular arithmetic, binomial coefficients, factorial properties, integer roots, base conversion, fractions, and congruences |
| 24 | Edge-case and debugging investigations | 48 | Search boundaries, duplicates, ordering, mutation, aliasing, underflow, capacity, malformed structures, disconnected graphs, non-finite numbers, string boundaries, and invariant audits |
| 25 | Integrated guided challenges | 36 | Complete navigation, scheduling, inventory, autocomplete, routing, network, parsing, search, text, dependency, and cache workflows with baseline, boundary-review, and invariant-audit lenses |
| **Total** | **Chunks 1 through 7** | **535** | **Complete approved Tier A curriculum** |

### Chunk 7 investigation route

The investigation section teaches a repeatable debugging habit:

```text
Name the suspicious boundary
        |
        v
Prepare several explicit cases
        |
        v
Run one reviewed operation
        |
        v
Record actual and expected values
        |
        v
Accept the conclusion only if every case agrees
```

The 48 investigations are executable lessons, not a list of warnings. They
cover empty and singleton inputs, endpoints, duplicates, stable order,
rotation, interval contact, aliasing, shallow copies, safe mutation, missing
keys, stack underflow, queue capacity, deque ends, heap ties, stale priority
entries, disconnected graphs, cycles, partial trees, duplicate BST keys,
redundant unions, positive infinity, negative infinity, NaN, signed division,
modular wraparound, empty string patterns, Unicode characters, delimiter
balance, hash verification, partition rules, heap order, BST range rules,
linked cycles, dynamic-programming base states, and shortest-path
postconditions.

Every investigation card contains named edge cases. The program prints an
observation row containing the case name, actual value, expected value, and
pass result. **Edge Case Lab** helps locate the reviewed boundary, while
**Decisions** and **Step Table** show what the local run actually did.

All 535 Tier A records were selected by exact visible stable ID, executed
through the real Pyodide worker, advanced to the final recorded step, and
compared with their own expected-result marker. All 535 matched. This proves
the current reviewed catalog, not arbitrary future programs or unimplemented
later tiers.

### Chunk 7 guided challenge route

The 36 guided challenges are twelve complete workflows studied through three
different lenses:

```text
WORKFLOW
|
+-- Baseline
|      +-- understand the complete successful run
|
+-- Boundary review
|      +-- make documented edge questions visible
|
+-- Invariant audit
       +-- list the rules that should remain true
       +-- connect each rule to the final state
```

The workflow families are browser history, fair ticket scheduling, inventory
reconciliation, trie autocomplete, unweighted routing, weighted routing,
minimum-cable network design, expression evaluation, maze backtracking, edit
distance, dependency ordering, and least-recently-used caching. These are
guided checkpoints, not evidence that Code Explorer tracked or verified a
learner's earlier progress.

### Chunk 6 learning routes

The 54 new programs finish the direct-teaching portion of Tier A through three
connected routes:

```text
DYNAMIC PROGRAMMING, 24 PROGRAMS
|
+-- identify the state and its meaning
+-- write base states before transitions
+-- choose a dependency-safe evaluation order
+-- compare take, skip, split, match, and predecessor transitions
+-- reconstruct an answer from parent or choice information
+-- compress storage only after identifying which earlier states are needed
+-- compare memoization with tabulation without claiming one form is universal

BIT MANIPULATION, 16 PROGRAMS
|
+-- read AND, OR, XOR, shifts, masks, and one-bit operations
+-- count, isolate, set, clear, toggle, and test bits
+-- use XOR only when the pairing or range contract is satisfied
+-- encode subsets, permissions, bounded membership, and Gray codes
+-- state Python's unbounded-integer behavior and any chosen teaching width

ELEMENTARY MATHEMATICAL ALGORITHMS, 14 PROGRAMS
|
+-- preserve divisibility through Euclidean remainders
+-- verify Bezout coefficients and modular inverses
+-- distinguish primality testing, sieving, and factorization
+-- use exact integer methods for modular powers, roots, and base conversion
+-- state preconditions for fractions and congruence construction
```

These routes are recommendations, not tracked progress. Code Explorer does not
record whether a learner opened or completed any route.

### Chunk 5 learning routes

The 60 new programs form four connected learning routes:

```text
RECURSION, 18 PROGRAMS
|
+-- identify a base case and a shrinking measure
+-- combine results while calls return
+-- process strings, numbers, arrays, nested lists, and trees
+-- inspect inclusive and half-open recursive boundaries
+-- reuse memoized subproblems
+-- compare recursion with iteration and naive repeated work

BACKTRACKING, 16 PROGRAMS
|
+-- build binary choices, subsets, permutations, and combinations
+-- make one choice and restore mutable state after the branch
+-- reject impossible prefixes before deeper exploration
+-- solve grid routes, N-Queens, a four-by-four Sudoku, and word search
+-- color a graph and solve subset constraints
+-- prune duplicate permutations without losing unique answers

DIVIDE AND CONQUER, 10 PROGRAMS
|
+-- split balanced ranges and combine sums or maxima
+-- sort through merge and pivot partitions
+-- preserve a lower-bound search contract
+-- count inversions during merge
+-- combine crossing ranges and majority candidates
+-- study Karatsuba multiplication and rank selection

GREEDY ALGORITHMS, 16 PROGRAMS
|
+-- justify earliest-finish scheduling
+-- allocate rooms and fractional capacity
+-- compare a valid coin system with a greedy counterexample
+-- preserve useful cash, reachability, fuel, and interval boundaries
+-- construct prefix codes and schedule profitable jobs
+-- minimize rope cost and refueling stops with priority queues
```

These routes are recommendations, not tracked progress. Code Explorer does not
record which route a learner opened or completed.

### Earlier Chunk 4 learning routes

The 68 new programs continue the ordered curriculum with four connected routes:

```text
UNION-FIND, 10 PROGRAMS
|
+-- create one set per item
+-- find representatives iteratively and recursively
+-- join sets with basic union, size, and rank
+-- compress parent paths
+-- answer connectivity questions and count components
+-- detect an undirected cycle

GRAPH STRUCTURES AND VOCABULARY, 24 PROGRAMS
|
+-- distinguish vertices, edges, direction, and weights
+-- build adjacency lists, matrices, and edge lists
+-- measure degree, isolation, self-loops, and parallel edges
+-- convert and validate representations
+-- distinguish walks, trails, paths, and DAG evidence
+-- compare conceptual storage and neighbor-query work

GRAPH TRAVERSAL AND CONNECTIVITY, 20 PROGRAMS
|
+-- run BFS, recursive DFS, and iterative DFS
+-- reconstruct paths, collect reachability, and count components
+-- compare DFS with Union-Find
+-- detect directed and undirected cycles
+-- check bipartite graphs and create topological orders
+-- flood-fill grids, count islands, and solve a maze
+-- compare breadth-first and depth-first visit orders

SHORTEST PATHS AND SPANNING TREES, 14 PROGRAMS
|
+-- understand one edge relaxation
+-- run Dijkstra and inspect stale heap entries
+-- reconstruct routes and preserve unreachable states
+-- reject Dijkstra when negative edges violate its precondition
+-- run DAG shortest paths and Bellman-Ford
+-- detect reachable negative cycles
+-- compute all-pairs paths with Floyd-Warshall
+-- build trees and forests with Kruskal and Prim
+-- compare two reviewed MST strategies on one graph
```

### Earlier Chunk 3 learning routes

The 72 new programs are not a flat collection. Each section moves from a visible
representation toward operations, invariants, applications, and comparisons:

```text
TREES AND BINARY SEARCH TREES, 30 PROGRAMS
|
+-- represent roots, children, leaves, and empty links
+-- traverse in preorder, inorder, postorder, and level order
+-- count nodes, leaves, height, and paths
+-- inspect shape rules, equality, balance, and completeness
+-- serialize, deserialize, mirror, and search
+-- insert, validate, and delete BST keys
+-- study extremes, ancestors, neighbors, rank, and tree shape

HEAPS AND PRIORITY QUEUES, 18 PROGRAMS
|
+-- map parent and child indices
+-- heapify, peek, push, pop, replace, and validate
+-- select kth and top-k values
+-- preserve stable order for equal priorities
+-- schedule applied work and merge sorted sequences
+-- compare repeated insertion with bottom-up heapify

TRIES AND STRING ALGORITHMS, 24 PROGRAMS
|
+-- insert, find, prefix-check, count, and delete trie words
+-- autocomplete, suggest contacts, and store prefix counts
+-- study wildcard paths, suffix tries, and word segmentation
+-- search directly, with KMP, and with a rolling hash
+-- inspect anagrams, common prefixes, runs, and overlapping matches
+-- compare direct search evidence with KMP on the same input
```

Use the routes as recommendations, not tracked progress. Code Explorer never
records whether a learner opened, completed, or understood a program.

### Which view should I open first?

```text
My question is about...
|
+-- tree shape or character branches
|      +-- Structure Canvas, References, Invariant Checker
|
+-- recursion or traversal order
|      +-- Calls and Recursion, Operation Journey, Algorithm Path
|
+-- heap repair or top-k candidates
|      +-- Structure Canvas, Mutation Explorer, Step Table
|
+-- search boundaries or pattern indices
|      +-- Watches, Step Table, Before and After
|
+-- two reviewed strategies
       +-- Compare Algorithms, Complexity Lab
```

Chunk 6 adds these useful questions:

```text
My question is about...
|
+-- what one dynamic-programming state means
|      +-- Algorithm Story, Variables, Invariant Checker
|
+-- why a table cell changed
|      +-- Before and After, Decisions, Step Table
|
+-- how an answer is reconstructed
|      +-- References, Algorithm Path, Structure Canvas
|
+-- which bits a mask includes
|      +-- Variables, Before and After, Step Table
|
+-- whether a bit trick needs a fixed width or pairing contract
|      +-- Edge Case Lab, Invariant Checker, Algorithm Story
|
+-- why a number-theory identity remains true
       +-- Invariant Checker, Watches, Operation Journey
```

Earlier Chunk 5 topics add these useful questions:

```text
My question is about...
|
+-- base cases, call depth, or return-time combination
|      +-- Calls and Recursion, Algorithm Path, Step Table
|
+-- choosing, rejecting, and restoring one branch
|      +-- Calls and Recursion, Mutation Explorer, Decisions
|
+-- split ranges and combined subproblem results
|      +-- Algorithm Path, Before and After, Complexity Lab
|
+-- whether a local greedy rule is justified
|      +-- Decisions, Invariant Checker, Compare Algorithms
|
+-- a greedy counterexample or boundary condition
       +-- Edge Case Lab, Compare Algorithms, Algorithm Story
```

Earlier Chunk 4 topics add these useful questions:

```text
My question is about...
|
+-- parent links, representatives, or component merging
|      +-- Structure Canvas, Before and After, Invariant Checker
|
+-- frontier order or visited vertices
|      +-- Operation Journey, Algorithm Path, Step Table
|
+-- path cost or edge relaxation
|      +-- Before and After, Watches, Complexity Lab
|
+-- cycles, bipartite colors, or topological validity
|      +-- Decisions, Invariant Checker, Edge Case Lab
|
+-- two connectivity, traversal, path, or MST strategies
       +-- Compare Algorithms, Complexity Lab
```

Structure Canvas uses a dedicated reviewed orientation only when the editor
source exactly matches a catalog program. Tree-family records label their root
fields, heap-family records emphasize the observed root, and trie records label
character edges. Union-Find records orient parent collections, and graph records
orient adjacency collections. These are conceptual teaching labels over
serialized Python values. They are not physical RAM addresses and they do not
reveal private interpreter storage.

Every catalog program has:

- A unique stable identifier from `DSA-001` through `DSA-535`.
- A distinct title and teaching objective.
- A section and difficulty.
- Reviewed source code and prepared input.
- An expected result used by automated validation.
- Structure and event metadata.
- A named algorithm only when the reviewed example supports that name.
- Phases, invariants, edge cases, comparison groups, and complexity context when applicable.
- Recommended views selected for that program.

### Searching the DSA curriculum

The search field examines the complete reviewed program record:

```text
DSA SEARCH INDEX
|
+-- stable ID, title, section, and difficulty
+-- objective and description
+-- algorithm name and reviewed source
+-- prerequisites and prepared input
+-- expected result
+-- structure and event metadata
+-- phases and invariants
+-- edge cases and comparison group
+-- time, space, and complexity note
+-- recommended views
```

This makes metadata that is not printed in full on every card discoverable. For example:

- `DSA-337 Kruskal Prim comparison` finds the final Chunk 4 comparison through its stable ID and algorithm metadata.
- `DSA-397 minimum refueling stops` finds the final Chunk 5 lesson through its stable ID, title, phases, and greedy metadata.
- `DSA-535 invariant audit` finds the final Tier A cache challenge through its stable ID, invariant, challenge, and audit metadata.
- `empty list division` finds **Name an algorithm's input and output** through its reviewed edge-case metadata.
- `O(log n) guided challenge` requires complexity and difficulty terms to match the same program.
- A class, function, variable, or operation name can match the reviewed source.

Search and section filtering use an intersection:

```text
Search matches
      +
Selected section
      |
      v
Visible cards and per-section match counts
```

Each word must match somewhere in the same reviewed record. Punctuation and capitalization do not need to be exact, so `O(n)` and `o n` are treated consistently. If the selected section has no match, the catalog shows a clear empty result and a **Clear search** action. Clearing the query retains the selected section.

The query is temporary page state. It is not saved, included in learner progress, collected for analytics, or transmitted over the network. Selecting a matching card still uses the ordinary reviewed-program loading path and does not run it until the learner selects **Run trace**.

The catalog validator rejects missing metadata, duplicate identifiers, duplicate titles, duplicate source, weak source depth, unsupported structure names, unsupported event names, and suspiciously similar examples. A separate Python validator compiles and executes every program and checks its expected result.

### Difficulty labels

- **Beginner** focuses on one central idea with limited moving parts.
- **Developing** combines operations, state, or reasoning steps.
- **Guided Challenge** asks the learner to compare, justify, or integrate several ideas.

Difficulty is editorial guidance. It is not a score, test result, or claim about the learner.

### Longer programs

Short examples remain useful for atomic ideas, but the implemented catalog includes 146 programs with at least 15 meaningful source lines. Every traversal lesson has at least 19 meaningful lines, and every shortest-path or spanning-tree lesson has at least 14. Longer examples are used where setup, transformation, checks, and results need room to form one coherent lesson.

### What Chunk 2 adds

```text
STACK
  push -> [ BASE | ... | TOP ] <- pop

QUEUE
  dequeue <- [ FRONT | ... | REAR ] <- enqueue

LINKED CHAIN
  HEAD -> node -> node -> TAIL

HASH TABLE
  key -> hash -> bucket -> exact-key comparison

SET
  unordered unique membership
```

These diagrams are conceptual. They explain the reviewed abstract role of observed Python values. They are not physical RAM addresses, CPython internal diagrams, or claims about an arbitrary pasted program.

Chunk 2 includes representation comparisons such as list versus deque stacks, deque versus two-stack queues, linked versus array insertion, and list scan versus set membership. Comparison cards keep observed counts separate from reviewed complexity.

### What Chunk 3 adds

```text
BINARY TREE
                 root
                /    \
             left    right

MIN-HEAP ARRAY
index 0 is the root
parent(i) = (i - 1) // 2
left(i)   = 2 * i + 1
right(i)  = 2 * i + 2

TRIE
root
 +-- c -- a -- t [word]
 |         +-- r [word]
 +-- d -- o -- g [word]
```

Chunk 3 adds exact-source curriculum comparisons for tree traversal orders, BST
deletion cases, balanced and skewed shapes, heap construction, priority-queue
tie policies, top-k selection, trie prefix applications, and substring-search
strategies. Compare Algorithms suggests related reviewed programs directly.
Selecting one loads its complete reviewed source into the editor so a comparison
run is based on that source, not on a hidden implementation.

### What Chunk 6 adds

```text
DYNAMIC PROGRAMMING
state meaning
   +
base states
   +
transition from already solved states
   +
dependency-safe evaluation order
   |
   +-- optional parent or choice data for reconstruction
   +-- optional storage compression after dependencies are understood

BIT MANIPULATION
finite teaching mask
   |
   +-- AND keeps shared one bits
   +-- OR keeps any one bit
   +-- XOR keeps differing bits
   +-- shifts move positional meaning
   +-- an explicit width defines bounded overflow or signed interpretation

MATHEMATICAL ALGORITHMS
input contract
   |
   +-- exact integer invariant
   +-- shrinking remainder, factor, interval, exponent, or digit state
   +-- verified result and boundary condition
```

Chunk 6 comparisons cover full-table and rolling Fibonacci, staircase cost and
counting states, zero-one and unbounded knapsack, minimum and counting coin
change, subset-family problems, LCS length and reconstruction, memoization and
tabulation, population-count methods, XOR uniqueness contracts, set
representations, GCD applications, primality approaches, and modular
arithmetic.

The catalog deliberately uses positive infinity for unsolved minimum states and
negative infinity for impossible maximum states. These are valid Python floats.
The strict worker serializer preserves their type and readable spelling while
transporting JSON-safe trace evidence. Focused DSA-403 and DSA-406 browser
checks plus the complete 535-program audit protect the correction documented in
`bug_report.md`.

### Chunk 6 beginner vocabulary

| Term | Beginner meaning | First evidence to inspect | A useful next experiment |
| --- | --- | --- | --- |
| **Dynamic programming** | A method that solves overlapping subproblems once and combines stored answers according to a defined state and transition. | Open Algorithm Story and identify what one table index or cell means. | Write the state meaning in one sentence before changing the input. |
| **State** | The smallest information needed to name one subproblem, such as an index, capacity, prefix pair, grid cell, or transaction count. | Inspect Variables and the table indices at the selected step. | Ask whether removing one state component would make two different subproblems look identical. |
| **Base state** | A subproblem whose answer is known without reading another dynamic-programming state. | Inspect the table before the main filling loop. | Change an empty-input or zero-capacity boundary and predict the initialized value. |
| **Transition** | The rule that computes one state from already solved states. | Use Before and After on a cell update. | List every predecessor state used by the transition. |
| **Evaluation order** | The order in which states are solved so every dependency is ready before it is read. | Follow Step Table from the earliest state to the target. | Reverse a copied loop only when dependencies still point to completed states. |
| **Memoization** | Top-down storage that solves states when recursion first requests them and reuses cached answers later. | Watch the memo dictionary and Calls and Recursion. | Compare the observed calls with the paired tabulation lesson. |
| **Tabulation** | Bottom-up storage that fills states in an explicit dependency-safe order. | Inspect the dynamic-programming table across several steps. | Predict which row or index is filled next. |
| **Reconstruction** | Following stored parents, choices, or table relationships to recover an actual sequence or plan, not only its score. | Open References or Algorithm Path for LCS, LIS, or rod cutting. | Change a tie and see whether a different but equally valid answer appears. |
| **Space optimization** | Keeping only the earlier states required by the next transition instead of retaining a complete table. | Compare full-table and rolling Fibonacci. | Explain what information is lost, especially whether reconstruction remains possible. |
| **Bit** | One binary position whose value is zero or one. Position zero is the least significant bit. | Inspect formatted binary output beside the integer value. | Toggle one position and compare the decimal change. |
| **Mask** | An integer whose selected one bits identify positions an operation should test, keep, add, remove, or toggle. | Watch `mask` and the value before and after a bit operation. | Build a mask containing two positions instead of one. |
| **XOR** | A bitwise operation that produces one where input bits differ. Equal values cancel because `x ^ x` is zero. | Follow the XOR accumulator in the single-number lesson. | Break the pairing precondition and observe why the remaining value no longer has the promised meaning. |
| **Population count** | The number of one bits in a nonnegative integer's binary representation. | Compare shifting with clearing the lowest set bit. | Use a value with many zero bits and compare observed iteration counts. |
| **Bit field** | Several small bounded values or flags packed into different bit positions of one integer. | Inspect the packed binary value and decoded fields. | Try a field value larger than its reserved mask and inspect the overlap. |
| **Fixed width** | An explicit number of bit positions used to define masking, overflow, or signed interpretation. Python integers do not silently use one small fixed width. | Open the bounded bitwise-addition lesson and inspect its eight-bit mask. | Increase the teaching width and verify the same non-overflowing sum. |
| **Greatest common divisor** | The largest positive integer dividing both inputs without a remainder. | Follow Euclidean remainder pairs. | Swap the inputs and verify the final GCD is unchanged. |
| **Bezout identity** | An equation `a*x + b*y = gcd(a, b)` produced by extended Euclid. | Inspect the final coefficients and verification expression. | Change the inputs and verify the new coefficients, not only the GCD. |
| **Modular inverse** | A value that multiplies another value to leave remainder one under a modulus. It exists only when the value and modulus are coprime. | Inspect the GCD precondition and final modular check. | Choose noncoprime inputs and confirm the inverse becomes unavailable. |
| **Prime number** | An integer greater than one with no positive divisors except one and itself. | Compare trial division with the sieve. | Test zero, one, two, a square, and a larger prime. |
| **Sieve** | A table method that marks composite multiples so unmarked candidates are prime. | Use Mutation Explorer on the boolean table. | Lower the limit and predict which crossing steps disappear. |
| **Congruence** | A statement that two integers have the same remainder under a modulus. | Inspect both remainder checks in the final Chunk 6 lesson. | Change one remainder and recompute the smallest shared solution. |

The honesty boundary remains unchanged. Edited or pasted code can show
observed table mutations, masks, loops, comparisons, calls, and output. Code
Explorer does not invent its state definition, recurrence, bit-width contract,
number-theory precondition, proof, or Big O claim.

### What Chunk 5 adds

```text
RECURSION
problem
   |
   +-- base case returns directly
   |
   +-- recursive case solves a smaller version
                |
                +-- waiting calls combine returned results

BACKTRACKING
choose -> explore -> restore
   |
   +-- reject a branch as soon as a reviewed constraint fails

DIVIDE AND CONQUER
split -> solve left and right -> combine

GREEDY
reviewed local rule -> choice -> preserved invariant
                           |
                           +-- a counterexample means the rule needs a different precondition
```

Chunk 5 comparisons cover recursive and iterative factorial, naive and memoized
Fibonacci, duplicate-aware permutations, activity-selection rules, canonical
and noncanonical coin systems, interval choices, and compatible divided-range
strategies. A comparison result belongs to its reviewed source and input.

### Chunk 5 beginner vocabulary

| Term | Beginner meaning | First evidence to inspect | A useful next experiment |
| --- | --- | --- | --- |
| **Recursion** | A function solves a problem by calling itself, directly or indirectly, on a smaller problem. | Open Calls and Recursion and locate the changing argument. | Change the input by one and compare maximum call depth. |
| **Base case** | A condition that returns without making another recursive call. It stops further descent. | Find the deepest call and the first direct return. | Remove or break the base case only in a tiny copied example and observe the safe trace or runtime boundary. |
| **Recursive case** | The part that reduces the current problem and delegates the smaller version to another call. | Compare arguments in adjacent call frames. | Write down the shrinking measure before running. |
| **Call stack** | The ordered active function frames waiting for deeper calls to return. Code Explorer presents conceptual frames, not physical RAM addresses. | Use Calls and Recursion during the deepest step. | Compare recursive and iterative factorial. |
| **Memoization** | Storing a solved subproblem so later calls can reuse its answer. | Watch the memo dictionary and cache-hit path. | Remove memo storage from Fibonacci and compare observed call counts. |
| **Backtracking** | A search method that makes a choice, explores what follows, and restores state before trying another choice. | Use Mutation Explorer around an append and matching pop or a swap and restore. | Disable one restoration line in a copied small example and inspect the broken invariant. |
| **Candidate** | One possible choice at the current search position. | Open Decisions and identify accepted and rejected values. | Reverse candidate order and compare solution order without claiming the set of valid answers changed. |
| **Constraint** | A rule that every valid partial or complete answer must satisfy. | Use Invariant Checker in N-Queens, Sudoku, or graph coloring. | Add one extra restriction and observe which branches disappear. |
| **Pruning** | Stopping a branch when evidence proves it cannot produce an acceptable answer. | Compare a rejected state with the next backtrack event. | Remove one safe pruning rule and compare step counts on the same small input. |
| **Choice tree** | A conceptual tree whose edges are decisions and whose leaves are complete answers or rejected dead ends. | Open Algorithm Path for subsets or parentheses. | Increase the input size by one and compare the number of results. |
| **Divide and conquer** | Split a problem into smaller parts, solve them, and combine their results. | Follow range boundaries and merge events. | Compare balanced and unbalanced quicksort partitions. |
| **Combine step** | The work that turns solved subproblems into the current problem's answer. | Inspect a merge, half-maximum comparison, or crossing-range choice. | Predict the combined result before moving playback forward. |
| **Greedy algorithm** | A method that commits to a locally preferred choice because a reviewed argument shows the choice can belong to an optimal solution. | Use Decisions and Invariant Checker together. | Change the input to a documented counterexample before trusting a similar local rule elsewhere. |
| **Greedy-choice property** | The reason a locally preferred choice can be made without revisiting it for that problem. | Read Curriculum context and the invariant for the exact reviewed program. | Compare earliest-finish scheduling with shortest-duration scheduling. |
| **Counterexample** | A concrete input that disproves a broad claim. One correct result cannot prove a rule, but one valid counterexample can disprove it. | Open the greedy coin-change counterexample. | Change the denominations and test whether the failure remains. |

The honesty boundary still applies. Edited or pasted recursion can show observed
calls, frames, values, and returns, but Code Explorer does not invent its base
case, recurrence, pruning proof, greedy-choice property, or Big O claim.

### What Chunk 4 adds

```text
UNION-FIND FOREST
item -> parent -> representative
          |
          +-- union by size or rank limits height
          +-- path compression rewrites future routes

GRAPH ADJACENCY
vertex -> neighbor
       -> neighbor with optional weight

TRAVERSAL FRONTIERS
BFS  uses a queue
DFS  uses recursion or a stack

WEIGHTED PATHS
known source distance + edge weight -> candidate target distance

SPANNING TREES
Kruskal -> globally ordered edges plus Union-Find
Prim    -> locally crossing edges plus a priority queue
```

Chunk 4 comparisons cover representative lookup forms, Union-Find
optimizations, connectivity by traversal versus Union-Find, graph
representations, traversal orders, topological ordering, unweighted paths,
single-source weighted paths, and minimum spanning trees.

The honesty boundary remains unchanged. A reviewed graph name, invariant,
phase, Big O statement, or comparison is available only while the source
exactly matches its catalog program. Edited or pasted graph code still receives
observed trace evidence, but Code Explorer does not guess which named graph
algorithm it implements.

### Chunk 4 beginner vocabulary

The catalog introduces each idea through executable programs, but these short
definitions can help before the first run.

| Term | Beginner meaning | First evidence to inspect | A useful next experiment |
| --- | --- | --- | --- |
| **Union-Find** | A structure that groups items into disjoint, non-overlapping sets and answers whether two items belong to the same group. It is also called a disjoint-set union structure. | Open Structure Canvas and watch the `parent` collection after a union. | Reverse the order of two unions and check whether the final groups remain equivalent. |
| **Representative** | One chosen item that identifies a complete Union-Find group. Following parent links eventually reaches it. | Watch the value returned by `find`. | Add a longer parent chain and compare it before and after path compression. |
| **Path compression** | A `find` optimization that rewrites visited parent links so later searches reach the representative more directly. | Compare the `parent` collection before and after repeated finds. | Disable the rewrite in a copied program and compare observed step counts. |
| **Vertex and edge** | A vertex is an item in a graph. An edge records a relationship between two vertices. | Open Structure Canvas and Console Output for a graph-vocabulary lesson. | Add one vertex with no edges and see how isolation is represented. |
| **Adjacency list** | A mapping from each vertex to its neighbors. It is often compact when few of the possible edges exist. | Inspect the graph variable in Variables or Structure Canvas. | Add one edge and identify exactly which neighbor collection changes. |
| **Adjacency matrix** | A rectangular table whose row and column positions say whether two vertices are connected, sometimes with a stored weight. | Use Structures to inspect rows and indices. | Compare the same graph as a list, matrix, and edge list. |
| **BFS** | Breadth-first search explores through a queue, visiting nearby layers before more distant layers. | Watch the queue and visit order in Operation Journey. | Change the neighbor order and compare the resulting visit order. |
| **DFS** | Depth-first search follows one route deeply before returning to try another route. It can use recursion or an explicit stack. | Open Calls and Recursion for recursive DFS, or Watches for iterative DFS. | Run the paired BFS and DFS examples on the same graph. |
| **Connected component** | A group of vertices that can reach one another through the graph relationships considered by the program. | Inspect the component labels or component count. | Remove a bridge edge and check whether one component becomes two. |
| **Topological order** | An ordering of a directed acyclic graph in which every prerequisite appears before the item that depends on it. | Use Invariant Checker and inspect every directed edge. | Add a cycle and observe why a complete valid order is unavailable. |
| **Relaxation** | A shortest-path update that asks whether one known distance plus an edge weight improves another distance. | Use Before and After on a distance update. | Increase one edge weight and check which later updates change. |
| **Dijkstra's algorithm** | A shortest-path method for graphs whose relevant edge weights are non-negative. A negative edge breaks its required precondition. | Inspect the chosen minimum-distance vertex and the distance map. | Run the negative-weight boundary lesson before editing a Dijkstra example. |
| **Bellman-Ford algorithm** | A shortest-path method that repeatedly relaxes edges and can report a reachable negative cycle. | Watch the distance map across passes. | Remove the negative cycle edge and compare the final result. |
| **Negative cycle** | A reachable cycle whose total weight is below zero. Repeating it can keep reducing a route cost, so no finite shortest answer exists for affected routes. | Inspect the extra Bellman-Ford pass that still finds an improvement. | Change one weight so the cycle total becomes zero and rerun. |
| **Floyd-Warshall algorithm** | A table-based method that considers every vertex as an allowed intermediate point to compute shortest paths between every pair. | Open Structures and watch the distance matrix. | Change one edge and find which source-target entries are affected. |
| **Minimum spanning tree** | A minimum-total-weight set of edges that connects every vertex of a connected undirected weighted graph without a cycle. | Inspect chosen edges, total weight, and the final connectivity check. | Disconnect the graph and observe that the result becomes a spanning forest. |
| **Kruskal's algorithm** | A minimum-spanning-tree method that considers edges from lighter to heavier and uses Union-Find to reject cycles. | Watch sorted edges and parent groups. | Create two equal-weight edges and inspect the accepted order without claiming it is the only valid tree. |
| **Prim's algorithm** | A minimum-spanning-tree method that grows outward from a starting vertex by repeatedly choosing a light crossing edge. | Watch the visited set and priority queue. | Choose a different starting vertex and compare the final total weight. |

The operation shown by one trace belongs to that program and its current input.
For example, a BFS visit order can change when neighbor order changes even
though the program is still BFS. Reviewed Big O is curriculum context, while
the displayed step count is observed evidence from one run.

## Your first guided run

Try this reviewed bubble-sort lesson:

```python
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
print("Result:", values == sorted(values))
```

Expected behavior:

```text
Source is unchanged
        |
        +-- Run trace
                |
                +-- Python executes in the local worker
                +-- 53 steps are recorded for this exact input
                +-- Algorithm Story shows observed line behavior
                +-- curriculum context names Bubble sort
                +-- Structure Canvas shows the current list
                +-- Step Table shows bounded recorded rows
                +-- Complexity Lab separates counts from Big O
```

The exact step count belongs to this program and input. It is not the same as Big O. Big O describes how resource growth behaves as input size changes.

## Editor controls

### Selected question

Selecting an inbuilt DSA program shows its reviewed title and objective directly
above the editor. The question remains visible while the learner changes the
source, which prevents the exercise prompt from disappearing during problem
solving. Reloading the same workspace restores the locally selected question.

Paste and confirmed complete-source replacement clear the question. Pasted or
independently written code never receives an invented exercise description.
The banner is curriculum orientation, not proof of completion and not an
analytics or progress record.

### Wrap

**Wrap on** keeps long lines inside the visible editor width. **Wrap off** preserves horizontal source layout. This is a visual preference and never inserts line breaks into Python.

### Font size

Choose 12, 14, 16, 18, 20, or 22 pixels. The preference is stored locally and shared with the project editor presentation rules.

### Copy

**Copy** copies the complete original editor document. If Automatic comments are visible, normal Copy still copies original Python rather than the read-only teaching layer.

### Paste

**Paste** asks the browser clipboard API for text and replaces the complete editor document because the learner explicitly selected a whole-document paste action. If permission is blocked, Code Explorer displays a clear permission message. Pasting invalidates the old trace immediately because it no longer describes the visible source.

### Source editing

Editing any character invalidates the recorded run. Re-run the program before trusting step-specific views. The source is stored under a DSA-specific same-origin browser key, so it does not overwrite the Python workspace source.

## Trace playback

The playback bar contains:

- **Previous**: move back one recorded step.
- **Play**: advance automatically.
- **Next**: move forward one recorded step.
- **Restart**: return to the first step.
- **Timeline**: jump directly to a step.
- **Speed**: use 0.5x, 1x, or 2x playback.

The code editor highlights the selected source line. Output is shown only when the selected step has reached that output. Changing views does not change the selected step.

Playback is a review of recorded evidence. It does not re-execute Python at every slider position.

The four navigation buttons remain one grouped row. On a wide screen, the timeline receives the flexible middle region and Speed stays at the right. On a phone, the timeline moves to its own complete row below the buttons so its labels and slider never collide.

## Evidence labels and honesty

Every important explanation uses a text label as well as color:

| Label | Meaning |
| --- | --- |
| **Observed** | Derived from this local execution trace |
| **Curriculum context** | Reviewed metadata attached to the exact unchanged catalog source |
| **Unavailable** | Evidence is missing, ambiguous, or unsupported |
| **Shortened** | More evidence exists, but the display stopped at a documented presentation limit |

```text
Can the tool support this statement?
|
+-- recorded by this run
|      +-- label it Observed
|
+-- reviewed for this exact unchanged catalog program
|      +-- label it Curriculum context
|
+-- neither source is sufficient
       +-- label it Unavailable
```

Code Explorer never upgrades a likely guess into a named algorithm claim.

## The 18 learning views

### Trace area

#### Algorithm Story

Shows the executed line, a conservative event cue, recorded name changes, and reviewed algorithm context when the source exactly matches a catalog program. It does not assign a named phase to an arbitrary pasted line.

#### Before and After

Shows the selected trace step, its Python line number, and the exact executed source line before showing any values.

Every variable visible immediately before or after that step receives one full-width vertical card:

```text
STEP 7 OF 25 · LINE 4
for temperature in temperatures:

temperature                         changed
+--------------------------------------------+
| Before                                     |
| 18                                         |
+--------------------------------------------+
                    |
                    v
+--------------------------------------------+
| After                                      |
| 21                                         |
+--------------------------------------------+
```

The list represents the complete visible variable state, not only the names changed by one line. As playback moves forward, a newly created name adds a card, a name that leaves scope eventually removes a card, and an existing value updates inside its stable card. The change label says created, changed, removed, or unchanged. Before and After labels and the downward arrow make the reading order understandable without depending on color.

The displayed values are bounded serialized snapshots. They are not live Python objects or physical RAM addresses. If the recorded scopes contain no visible variable, the view says so instead of inventing state.

#### Decisions

Shows reached conditions and an observed outcome when the trace provides enough evidence. If the selected prefix has not reached a condition, it says so.

#### Calls and Recursion

Shows the recorded call stack and visible frame variables. Stack depth is observed. A recursion label is used only when the evidence supports it.

#### Error Coach

Shows a syntax or runtime error, the closest learner line, available recent values, and a reasonable first inspection. It does not invent a repair. A trace-limit failure clearly states the 3,000-step boundary.

### Data area

#### Variables

Shows bounded serialized names, values, and Python types at the selected step.

#### Watches

Suggests up to 12 currently visible names. These are local suggestions, not saved learner progress, and not a claim that every name controls the algorithm.

#### Structure Canvas

Shows one visible container using a representation appropriate to its serialized shape. For an exact catalog program, reviewed labels can orient the same observed cells as stack TOP and BASE, queue FRONT and REAR, linked HEAD and TAIL, hash entries, set members, tree root fields, heap roots and nodes, or trie character edges. Pasted code receives generic observed cells because its abstract role is not reviewed. A display contains at most 30 cells or entries. Additional content is marked Shortened.

#### References

Groups names by conceptual object token. This is a name-to-object teaching map, not a physical RAM address and not a memory profiler.

#### Mutation Explorer

Separates a name referencing a different object from an observed in-place value change when tokens and serialized evidence permit that distinction.

#### Invariant Checker

Shows reviewed invariant questions for an exact catalog program. It currently presents rules to test rather than claiming a formal proof.

### Flow area

#### Operation Journey

Lists up to 30 observed event cues in order. It is a bounded learning summary, not the complete internal worker event stream.

The selected operation already carries the existing current-step treatment. This view is intentionally independent from the Before and After layout.

#### Algorithm Path

Shows up to 80 executed source-line transitions and visit counts.

#### Step Table

Shows up to 120 recorded rows with step, line, event cue, and changed names. The row matching the selected playback position receives a visible **Current step** label, a boundary, and `aria-current="true"`. Previous, Next, playback, restart, and timeline movement update that marker with the selected trace step. Color is only supporting emphasis.

```text
Step                 Line   Event cue       Changed names
1                    1      WRITE           values
2                    2      WRITE           total
3  [Current step]    4      VISIT_INDEX     value
```

When more than 120 rows are available in the selected trace prefix, the view displays the latest bounded rows and marks the presentation Shortened. The underlying inspectable trace is not deleted by this presentation limit.

#### Complexity Lab

Separates observed counts from reviewed asymptotic context:

```text
Observed in this run                  Reviewed curriculum context
--------------------                  ---------------------------
recorded steps                        time complexity
reached source lines                  space complexity
event cue counts                      comparison notes
```

One run cannot prove a complexity class. The Big O card appears only for an unchanged reviewed program.

### Labs area

#### Input Playground

Accepts one prepared `input()` response per line. Values stay in the browser. A run consumes them in order.

#### Compare Algorithms

Keeps at most two in-session run summaries and suggests related reviewed programs from the same comparison group. Comparisons use compatible catalog contracts and observed counts. The tool does not claim that unlike inputs form a fair benchmark.

#### Edge Case Lab

Shows reviewed boundary questions for the exact catalog program. It asks the learner to predict and run changes. Code Explorer does not track whether a suggestion was completed.

## Automatic and exported learning comments

### Automatic comments

After a useful run, select **Automatic comments** to replace only the visible editor surface with a read-only commented study copy.

```text
Original editable source
        |
        +-- Automatic comments on
        |       +-- read-only teaching copy is visible
        |       +-- original source remains stored and copied
        |
        +-- Automatic comments off
                +-- original editor returns unchanged
```

The visible teaching layer is formatted like a small IDE:

- The file bar identifies `main.py`, the DSA note mode, and the read-only state.
- Visual line numbers help a learner return to the matching original line.
- Conservative syntax colors distinguish Python keywords, names, strings, numbers, constants, and operators.
- Syntax or trace notes use a purple-tinted row, reviewed curriculum context uses a cyan-tinted row, and both retain the visible `# Code Explorer DSA:` label.
- The status strip reports Python 3, the generated line count, and that original source remains unchanged.

These elements are presentation only. Visual line numbers, colors, badges, file chrome, and status text are never inserted into the editor and are never included by normal Copy.

The current Essential, Guided, or Detailed choice also controls Automatic comments. Changing it refreshes the visible read-only teaching layer without rerunning Python, changing the trace, or editing the original source.

### Learning comments

**Learning comments** opens an IDE-style read-only preview. It can:

- Switch between Essential, Guided, and Detailed Python notes without rerunning the program.
- Report the exact number and selected density of generated Python notes.
- Distinguish syntax or trace notes, exact reviewed curriculum context, and original Python through a visible legend and separate row treatments.
- Copy the complete commented document.
- Replace the editor only after explicit confirmation.
- Preserve indentation, blank lines, and learner comments.
- Remove older Code Explorer DSA comment lines before creating a fresh copy.

Generated comments use observed trace evidence plus reviewed context when available. Unsupported statements receive no invented explanation.

```text
DSA LEARNING COMMENTS
|
+-- Comment detail
|   +-- Essential: core control flow, input, output, and errors
|   +-- Guided: Essential plus assignments, updates, and mutations
|   +-- Detailed: Guided plus supported additional syntax notes
|
+-- Evidence legend
|   +-- Purple: syntax or trace note
|   +-- Cyan: exact reviewed curriculum context
|   +-- Mint: original Python source
|
+-- Safe actions
    +-- Copy commented code
    |   +-- copies only the generated Python document
    |
    +-- Replace editor
        +-- requires explicit confirmation
```

The three reviewed preamble notes, program name, objective, and reviewed complexity, stay visible at every detail level only when the editor exactly matches a catalog program. Edited or pasted code receives a direct message that curriculum context is unavailable. This prevents a generated study copy from presenting a catalog claim as trace evidence.

The dialog uses the same safe line renderer, toolbar hierarchy, bounded editor center, and visible action footer as the Python Learning comments dialog. The footer remains inside the modal at desktop and mobile sizes, so **Copy commented code** and **Replace editor** are always reachable without scrolling the page behind the dialog.

**Copy commented code** copies the real generated Python document only. **Replace editor** uses that same document, but only after explicit confirmation. The IDE frame, visual gutter, badges, syntax spans, legend, note count, and status strip remain outside both actions.

## Pasted-code boundary

Pasted or newly written Python is fully welcome. It can receive:

- Local execution.
- Step playback.
- Variable and value changes.
- Condition evidence.
- Stack frames.
- Structure snapshots.
- References and mutations supported by serialization.
- Executed paths, step tables, errors, input, and observed counts.

It does not automatically receive:

- A reviewed algorithm name.
- Reviewed phases.
- Reviewed invariants.
- Reviewed Big O.
- Reviewed edge cases.
- A curriculum comparison group.

Example:

```text
numbers = [3, 1, 2]
numbers.sort()

Observed:
  numbers changed from [3, 1, 2] to [1, 2, 3]

Unavailable:
  a reviewed named algorithm and phase

Reason:
  Python's sort call is observable, but this pasted source is not an exact
  reviewed curriculum record. Code Explorer does not guess hidden runtime
  internals or attach catalog claims to similar-looking text.
```

## Limits and bounded presentation

Limits protect the browser and keep explanations readable. An execution limit stops a run. A presentation limit shortens only one view while preserving the recorded trace.

| Boundary | Current value | What happens at the boundary |
| --- | ---: | --- |
| Recorded trace steps | 3,000 | Execution stops with a clear learner-facing RuntimeError |
| Outer execution time | 30 seconds | The worker is terminated and the learner receives a timeout message |
| Serialization depth | 4 nested levels | Deeper content is represented by a bounded marker |
| Serialized items per container | 30 | Additional items are omitted from the serialized snapshot |
| Serialized representation text | 120 characters | Longer representations are shortened |
| Non-finite floats | `inf`, `-inf`, and `nan` | Python keeps the live float while the trace transports its type and readable spelling through strict JSON-safe text |
| Structure Canvas entries | 30 | The view is labeled Shortened |
| Suggested watches | 12 names | Additional visible names are not shown in Watches |
| Operation Journey | 30 events | The view is labeled Shortened |
| Algorithm Path | 80 transitions | The view is labeled Shortened |
| Step Table | 120 rows | The view is labeled Shortened |
| Compare Algorithms history | 2 run summaries | The oldest in-session summary is replaced |
| Prepared-input text | 20,000 characters | Additional text is ignored when loaded into the local input field |
| Active learning views | 18 | Custom learner-defined views are not supported |
| Implemented curriculum | 535 programs | Tier A is complete; Tier B and Tier C remain unimplemented planning references |
| Approved structure names | 20 | Unknown structures receive generic bounded presentation |
| Stable event names | 31 | Runtime cues remain conservative when an exact DSA event is unavailable |

### Trace limit example

```python
total = 0
for number in range(4000):
    total += number
print(total)
```

This program reaches the 3,000-step boundary before completing. Error Coach reports:

```text
Trace limit reached: Code Explorer recorded the maximum of 3,000 steps.
Shorten the program or reduce the number of loop iterations.
```

The partial trace remains inspectable. The missing final output must not be treated as successful program output.

### No fixed source-size promise

The editor does not impose a documented line or character cap. Browser memory, CodeMirror, parsing, tracing, and rendering still have practical limits. The workspace is designed for study programs, not production repositories or competitive-programming stress tests.

## Persistence

The browser stores these same-origin values locally:

- DSA editor source.
- Prepared input.
- Active DSA view.
- Theme.
- Editor wrap and font presentation preferences.
- The stable ID of the selected reviewed question, when one exists.

Reloading `data-structures.html` restores source and preferences. It does not restore a trusted completed trace. Run again so the evidence describes the current page state.

The browser can clear local storage in private mode, through site-data controls, or under storage pressure. Copy important work into a normal file.

## Privacy and network requests

Code Explorer has no analytics, advertising, tracking pixels, session replay, heatmaps, fingerprinting, remote crash logging, cookies for recognition, or learner identifiers.

The application does not upload:

- Source or commented source.
- Prepared input.
- Trace steps or event counts.
- Console output or errors.
- Clipboard contents.
- Watches, comparisons, or edge-case experiments.
- Local-storage values.
- Button clicks, time spent, or learning progress.

Browser execution still makes ordinary asset requests:

- GitHub Pages serves the static site.
- jsDelivr serves pinned browser libraries.
- Google Fonts may serve the configured fonts.
- Explicit external links navigate only when selected.

Those providers can receive ordinary request metadata such as an IP address and browser headers under their own policies. Code Explorer does not attach learner content or project-generated identifiers to those requests. The project maintainers cannot inspect provider-side raw IP addresses or browser headers through Code Explorer.

GitHub may show maintainers aggregate repository Insights such as recent page views, clones, referring sites, or popular content. Example: GitHub might report that a repository page received 20 views during a recent period. That does not reveal which Python program a learner typed, which example they ran, what appeared in output, or what was stored locally. These platform summaries are separate from the application and are never joined to learner workspace data.

## Troubleshooting

### Run trace stops at 3,000 steps

This is the documented safety limit. Inspect the partial trace, reduce the loop range or input size, and run again.

### The run times out

The worker exceeded 30 seconds. Reduce input size, remove unbounded work, or choose a smaller reviewed example.

### A named algorithm says Unavailable

Your source differs from the exact reviewed catalog source. Observed runtime views still work. Reopen the catalog version if you want its reviewed phases, invariants, edge cases, and complexity context.

### Automatic comments are disabled

Run a supported program first. Syntax errors and runs without useful trace evidence do not enable generated learning comments.

### Paste is blocked

Allow clipboard access for the page, or paste directly into the focused editor with the operating system shortcut. Code Explorer displays a message rather than silently failing.

### Output has not appeared at the selected step

Move the timeline later. Console Output follows recorded time and does not reveal future output.

### A program uses infinity or NaN

Python permits `float("inf")`, `float("-inf")`, and `float("nan")`. Code
Explorer preserves the live Python value during execution. Its detached trace
stores the value's `float` type and readable spelling as strict JSON-safe text
so the browser can display it without changing the learner's calculation.

Infinity is common in shortest-path and optimization examples. NaN has its
normal Python behavior, including the fact that it does not compare equal to
itself. The trace display is evidence about the recorded value, not a
replacement value inserted into the learner's program.

The non-finite transport path is covered by positive-infinity,
negative-infinity, strict-encoding, and complete-catalog browser checks. The
technical incident and its prevention rules are recorded in
[`bug_report.md`](bug_report.md).

### A structure is shortened

The underlying serialized evidence exceeded a presentation or serialization boundary. Use a smaller input or inspect Variables and Step Table. Shortened is not the same as an execution failure.

### Source disappeared after browser cleanup

Local persistence depends on browser site storage. If site data was cleared, Code Explorer cannot recover it. Keep important source in a normal local file or repository.

## What comes next

```text
Chunk 0  Separate route, contracts, navigation, editor foundation
   |
   v
Chunk 1  131 programs, local runtime, 18 working views
   |
   v
Chunk 2  66 stack, queue, deque, linked, hash, and set programs
   |
   v
Chunk 3  72 tree, BST, heap, priority-queue, trie, and string-search programs
   |
   v
Chunk 4  68 Union-Find, graph representation, traversal, path, and MST programs
   |
   v
Chunk 5  60 recursion, backtracking, divide-and-conquer, and greedy programs
   |
   v
Chunk 6  54 dynamic-programming, bit-manipulation, and mathematics programs
   |
   v
Chunk 7  84 investigations and integrated guided challenges
   |
   v
Tier A complete: 535 reviewed programs
   |
   +-- review complete Tier A evidence before considering Tier B or Tier C
   +-- preserve the same evidence labels and limits
   +-- extend validators before making implementation claims
```

See `Tier.md` for the complete approved curriculum plan. A later chunk ships only when its programs, runtime behavior, documentation, limits, accessibility, privacy, and browser tests all pass together.
