# Code Explorer Data Structures and Algorithms tiers

This document preserves the curriculum boundary and implementation status for the separate Python Data Structures and Algorithms workspace. Chunk 1 implements the first 131 reviewed programs and the reusable runtime. Later listings remain a planning reference, not a claim that their programs are available.

```text
CURRENT STATUS

Tier A  -> Chunk 1 implements 131 of 535 approved programs
Tier B  -> recorded for later evaluation
Tier C  -> recorded as an optional specialist catalog

Local DSA execution, playback, comparisons, comments, and 18 learning views work.
The remaining 404 Tier A programs are not implemented yet.
```

## Why the work is divided into tiers

The tiers protect quality and maintainability. They do not rank topics by importance alone.

```text
Reusable visualization foundation
              |
              v
Tier A core curriculum
              |
              v
Reliability, accessibility, and learning review
              |
              v
Tier B advanced curriculum
              |
              v
Another evidence-based review
              |
              v
Selected Tier C specialist topics
```

Completing Tier A does not automatically approve Tier B. Completing Tier B does not automatically approve Tier C. Each transition requires a separate product, maintenance, and learner-value review.

## Shared product boundary

The Data Structures and Algorithms workspace is separate from the existing Python workspace.

```text
Code Explorer landing page
|
+-- Start exploring Python
|      +-- existing workspace.html
|      +-- existing Python curriculum and trace views
|
+-- Start exploring Python Data Structures and Algorithms
       +-- implemented data-structures.html workspace
       +-- 131-program Chunk 1 curriculum
       +-- implemented 18-view runtime
       +-- later reviewed curriculum chunks
```

The two workspaces may reuse the editor, theme, Pyodide worker foundation, trace playback, serialization, dialogs, accessibility helpers, and safe local persistence. They must not become two copied applications that drift apart.

## Documentation and navigation boundary

The landing page represents two separate learning paths, so it must not present one ambiguous Tool Guide link.

```text
index.html
|
+-- no Tool Guide control
|
+-- Start exploring Python
|      |
|      v
|   workspace.html
|      +-- Tool Guide -> README.md
|
+-- Start exploring Python Data Structures and Algorithms
       |
       v
   data-structures.html
       +-- Tool Guide -> README_DSA.md
```

The existing `README.md` remains the public beginner guide for the Python execution workspace and its 134-program curriculum. It should be linked from `workspace.html`, not from the shared landing page or the Data Structures workspace.

`README_DSA.md` is the public beginner guide for the Data Structures workspace, its implemented 131-program curriculum, evidence boundaries, verified limits, and later completed curriculum chunks. It is linked from `data-structures.html`, not from the existing Python workspace.

`README_DSA.md` must not become a catalogue of unimplemented promises. Update it after each verified Tier A chunk. `Tier.md` remains the planning catalogue; `README_DSA.md` describes only learner-visible behavior that actually exists and explicitly marks unavailable behavior.

Both workspace links should use the same accessible Tool Guide label and visual treatment. Their targets differ by workspace context. External GitHub links must preserve the existing privacy and `noreferrer` rules.

### Implemented Chunk 1 view contract

Chunk 1 renders working results through the final eighteen names under four bounded areas:

```text
TRACE
+-- Algorithm Story
+-- Before and After
+-- Decisions
+-- Calls and Recursion
+-- Error Coach

DATA
+-- Variables
+-- Watches
+-- Structure Canvas
+-- References
+-- Mutation Explorer
+-- Invariant Checker

FLOW
+-- Operation Journey
+-- Algorithm Path
+-- Step Table
+-- Complexity Lab

LABS
+-- Input Playground
+-- Compare Algorithms
+-- Edge Case Lab
```

All 18 renderers work with recorded evidence. Views use **Unavailable** when the current run cannot support a conclusion, **Curriculum context** only for an exact unchanged reviewed program, **Observed** for local trace facts, and **Shortened** at a presentation boundary.

### Complete limits documentation contract

`README_DSA.md` contains one discoverable section that explains every enforced limit in the implemented Data Structures and Algorithms workspace. It must not mention only the graph-size limit or assume that beginners understand why a limit exists.

The section must cover every applicable category:

- Execution limits, including recorded steps, elapsed time, recursion protection, console output, and prepared input.
- Serialization and display limits, including nesting depth, item count, object attributes, text length, and shortened representations.
- Visualization limits, including nodes, edges, array cells, buckets, tree depth, labels, transitions, and any structure-specific bound.
- History and comparison limits, including operation events, Step Table rows, watched values, bookmarks, stored comparison runs, and edge-case runs.
- Explanation limits, including the difference between observed trace evidence, reviewed curriculum metadata, and conclusions that are unavailable for arbitrary pasted code.
- Complexity limits, including the difference between measured operation counts and reviewed theoretical complexity. One run must never be presented as proof of a Big O classification.
- Persistence and browser-storage limits, including what is saved, what resets, and what happens if storage is unavailable.
- Platform limits, including tested browser and viewport boundaries, mobile presentation differences, and any dependency or offline restrictions.
- Curriculum limits, including the implemented tier, supported structures and algorithms, and behavior that remains planned rather than available.

Every documented limit must answer the same beginner questions:

```text
What is limited?
|
+-- What exactly is counted?
+-- What verified numerical limit is enforced?
+-- Why does the limit protect the browser or the learner?
+-- What happens when the limit is reached?
+-- Did execution stop, or was only the display shortened?
+-- Is the original source and recorded evidence preserved?
+-- What can the learner change and try next?
+-- Is the behavior the same on desktop and mobile?
```

Numerical values must come from implemented constants and verification, not from the planning document. If the DSA workspace reuses an existing Python workspace limit, `README_DSA.md` must still state and explain it directly. A shortened graph, table, label, or value must be visibly identified as shortened so a learner does not mistake a presentation boundary for Python behavior.

## Tier A: core curriculum

Tier A establishes the reusable event model, playback system, visualization language, accessibility model, and core beginner-to-intermediate curriculum. Its approved catalog target is 535 programs. This count is a curriculum contract, not implementation status.

### Approved Tier A catalog count

| Tier A section | Programs |
| --- | ---: |
| Algorithm and complexity foundations | 24 |
| Abstract data types and representations | 12 |
| Python-native containers | 42 |
| Arrays and sequence techniques | 20 |
| Searching | 9 |
| Sorting and sorting properties | 24 |
| Stacks, queues, and deques | 22 |
| Linked structures | 20 |
| Hash tables and set algorithms | 24 |
| Trees and binary search trees | 30 |
| Heaps and priority queues | 18 |
| Tries and string algorithms | 24 |
| Union-Find | 10 |
| Graph structures and vocabulary | 24 |
| Graph traversal and connectivity | 20 |
| Shortest paths and spanning trees | 14 |
| Recursion | 18 |
| Backtracking | 16 |
| Divide and conquer | 10 |
| Greedy algorithms | 16 |
| Dynamic programming | 24 |
| Bit manipulation | 16 |
| Elementary mathematical algorithms | 14 |
| **Direct lessons** | **451** |
| Edge-case and debugging investigations | 48 |
| Integrated guided challenges | 36 |
| **Tier A total** | **535** |

```text
451 direct teaching programs
+ 48 edge-case and debugging investigations
+ 36 integrated guided challenges
= 535 Tier A programs
```

Every direct lesson needs its own primary learning objective and runnable Python program. Investigation programs cover relevant boundaries and deliberate failures. Guided challenges combine earlier concepts into meaningful applications.

### Chunk 1 implemented slice

The first six direct-teaching sections are implemented and validated:

| Implemented section | Programs | Status |
| --- | ---: | --- |
| Algorithm and complexity foundations | 24 | Implemented in Chunk 1 |
| Abstract data types and representations | 12 | Implemented in Chunk 1 |
| Python-native containers | 42 | Implemented in Chunk 1 |
| Arrays and sequence techniques | 20 | Implemented in Chunk 1 |
| Searching | 9 | Implemented in Chunk 1 |
| Sorting and sorting properties | 24 | Implemented in Chunk 1 |
| **Chunk 1 total** | **131** | **Executable and validated** |

```text
535 approved Tier A programs
- 131 implemented Chunk 1 programs
= 404 programs remaining
```

The next row in the approved catalog, Stacks, queues, and deques, is not partly implemented by the existence of `list` or `deque` examples in the Python-native container section. Chunk 1 teaches those container operations. A later chunk must still provide the dedicated abstract-data-type curriculum, representations, comparisons, invariants, edge cases, and validators promised by that row.

### Program quality contract

The total of 535 is a coverage contract, not a target that can be satisfied with filler. A program does not qualify merely because it compiles, has unique metadata, or changes a few names and constants from another lesson.

Every catalog section must form a deliberate learning progression:

```text
Focused foundation
        |
        v
Standard operation or algorithm
        |
        v
Meaningful variation or edge case
        |
        v
Applied or integrated program
        |
        v
Comparison and reflection
```

Every published program must pass all applicable quality gates:

- Teach one clearly stated primary objective and identify its prerequisites.
- Use a coherent problem or story rather than unrelated statements assembled to increase length.
- Contain enough setup, state change, decisions, and result inspection to make its recommended DSA views useful.
- Use descriptive names, consistent Python style, realistic inputs, and beginner-readable control flow.
- Produce a correct, reviewed result or carry an explicit intentional-error contract.
- Include accurate algorithm phases, structure metadata, invariants, edge cases, comparison relationships, complexity context, and expected evidence wherever those fields apply.
- Differ materially from nearby lessons in objective, structure, algorithm behavior, input shape, edge case, or teaching perspective. Renaming variables or changing constants is not a new lesson.
- Avoid clever shortcuts before the relevant concept has been taught. Later examples may compare the clear implementation with a more idiomatic or efficient version.
- Remain small enough for step-by-step study, but become longer when the concept requires initialization, helper functions, several operations, validation, reporting, or integration.
- End with an observable result that a beginner can inspect and explain.

Line count is evidence to review, not a substitute for lesson quality. A focused base-case lesson may correctly be short. An applied tree, graph, dynamic-programming, or guided program must not be compressed until its reasoning becomes obscure. Conversely, filler statements and unnecessary comments must not be added only to reach a number.

Each catalog section must include substantial programs, not only minimal demonstrations. Structural validation must report source-line distributions by section and difficulty so reviewers can detect suspicious clusters of tiny examples. Human review must then decide whether each length is appropriate for the concept.

No chunk is complete until:

```text
All programs compile or match an intentional-error contract
                         +
All prepared inputs and expected results pass
                         +
All metadata references valid structures, events, and views
                         +
Representative traces and visualizations are inspected
                         +
Near-duplicate and shallow-example review passes
                         +
Beginner readability review passes
```

### Tier A completion coverage added by curriculum audit

The detailed structures and algorithms below remain part of Tier A. The following audited areas are also required for the 535-program contract.

#### Algorithm and complexity foundations

- Algorithm, input, output, precondition, and postcondition
- Correctness, termination, loop invariant, and data-structure invariant
- Time complexity and space complexity
- Best-case, average-case, and worst-case behavior
- Big O, Big Omega, and Big Theta
- Constant, logarithmic, linear, linearithmic, quadratic, exponential, and factorial growth
- Amortized analysis
- Time-space tradeoffs
- Comparison, swap, and operation counting
- Formal complexity versus observed trace steps
- Memory-use intuition
- Input-size experiments and their evidence limits

#### Abstract data types and representations

- Abstract data type versus concrete implementation
- Interface and supported operation
- Representation and invariant
- Choosing between implementations
- Stack ADT implemented with a list, deque, or linked nodes
- Queue ADT implemented with a deque, circular array, or linked nodes
- Same Python container used for different abstract purposes

#### Complete Python-native container coverage

- List creation, indexing, negative indexing, replacement, slicing, and slice assignment
- List append, extend, insert, remove, pop, clear, index, count, reverse, sort, and copy
- List concatenation, repetition, membership, iteration, comprehension, and nested flattening
- List mutation, reassignment, shallow copying, and aliasing
- Dictionary creation, lookup, insertion, replacement, deletion, membership, and iteration
- Dictionary `get`, `pop`, `update`, `setdefault`, comprehension, nesting, order, and key validity
- Set creation, add, remove, discard, pop, clear, and membership
- Set union, intersection, difference, symmetric difference, subset, superset, and disjointness
- Set comprehension, frozen set, and deduplication patterns
- Deque append, append-left, pop, pop-left, rotation, maximum length, stack use, and queue use
- Counter frequency, arithmetic, and most-common operations
- Selected `defaultdict`, `ChainMap`, named-tuple, and ordered-mapping lessons

#### Python algorithm modules

- `heapq` heapify, push, pop, push-pop, replace, merge, smallest, and largest operations
- Stable priority queues using tuple entries and a counter
- `bisect_left`, `bisect_right`, `insort_left`, and `insort_right`
- Binary insertion and the difference between search cost and list insertion cost

#### Algorithm-design paradigms

- Brute force, exhaustive search, generate-and-test, and baseline solutions
- Decrease-and-conquer reasoning
- Divide, solve, and combine
- Recursion trees
- Greedy choice, local choice, and global result
- Greedy activity selection, interval scheduling, fractional knapsack, and job sequencing
- Greedy coin examples that succeed and fail
- Dynamic-programming state, transition, base case, overlapping subproblems, and optimal substructure
- Memoization, tabulation, reconstruction, and space optimization
- Comparisons among greedy, backtracking, divide-and-conquer, and dynamic programming

#### String and set algorithm families

- String indexing, slicing, immutability, and efficient construction
- Character frequencies, reversal, palindrome, anagram, and first non-repeating character
- Duplicate removal, word frequencies, run-length encoding, and basic compression
- Naive substring search, longest common prefix, and longest non-repeating substring
- Set union, intersection, difference, symmetric difference, subset, superset, and disjointness algorithms
- Set-based membership optimization, graph visited sets, and order-preserving deduplication

#### Recursion and sorting analysis

- Recursive base case, recursive case, progress, stack growth, and unwinding
- Return-value combination, infinite recursion, depth limits, and iterative alternatives
- Recurrence relations, recursion trees, and memoized recursion
- Stable, unstable, in-place, out-of-place, adaptive, comparison, and non-comparison sorting
- Sorting with keys, duplicates, already-sorted input, reverse-sorted input, and nearly sorted input
- Comparison count, swap count, auxiliary space, and high-level TimSort concepts

#### Graph foundations and additional core paths

- Vertex, edge, neighbor, degree, indegree, outdegree, walk, trail, path, and cycle
- Connected component, reachability, source, sink, isolated vertex, and weighted path
- Strong and weak connectivity
- Negative edges, self-loops, parallel edges, sparse graphs, and dense graphs
- Representation tradeoffs and graph-representation conversion
- Add and remove vertices and edges
- Directed-graph transpose
- Shortest path in a directed acyclic graph
- Multi-source breadth-first search
- Bellman-Ford and negative-cycle detection
- Path reconstruction for shortest-path algorithms
- Transitive-closure concept

#### Bit and elementary mathematical algorithms

- Binary representation and bitwise AND, OR, XOR, and NOT
- Left shift, right shift, set, clear, toggle, and test operations
- Set-bit counting, power-of-two checks, XOR uniqueness, subset masks, and permission flags
- Euclidean greatest common divisor and least common multiple
- Prime checking, Sieve of Eratosthenes, and prime factorization
- Fast exponentiation and modular exponentiation
- Iterative Fibonacci and Pascal's triangle
- Combination and permutation generation

#### Systematic investigations and guided integration

- Relevant empty, one-item, two-item, duplicate, missing-target, negative, zero, sorted, and reverse-sorted cases
- Relevant disconnected, cyclic, invalid-operation, capacity, and repeated-operation cases
- Forty-eight explicitly documented investigation programs
- Thirty-six integrated guided challenges that combine structures, algorithms, analysis, and debugging

### Tier A data structures

#### Python and sequence foundations

- Python list and dynamic-array concept
- Tuple and fixed sequence
- String as an indexed sequence
- Two-dimensional list and matrix
- Dictionary
- Set
- `collections.deque`
- `collections.Counter`

#### Linear structures

- Stack
- Queue
- Circular queue
- Deque
- Priority queue
- Singly linked list
- Doubly linked list

#### Hash structures

- Hash table
- Hash set
- Separate chaining
- Open addressing with linear probing
- Frequency map and multiset concept

#### Trees and hierarchical structures

- General rooted tree
- Binary tree
- Binary search tree
- Min heap
- Max heap
- Trie
- Expression tree

#### Connectivity structures

- Disjoint-set forest
- Union-Find
- Undirected graph
- Directed graph
- Weighted graph
- Directed acyclic graph
- Forest
- Adjacency list
- Adjacency matrix
- Edge list

### Tier A algorithms

#### Searching

- Linear search
- Binary search
- Recursive binary search
- First and last occurrence
- Lower and upper bound concepts

#### Sorting

- Bubble sort
- Optimized bubble sort
- Selection sort
- Insertion sort
- Merge sort
- Quicksort
- Three-way quicksort
- Heap sort
- Counting sort
- Radix sort

#### Array and sequence techniques

- Two pointers
- Fast and slow pointers
- Fixed sliding window
- Variable sliding window
- Prefix sums
- Kadane's maximum-subarray algorithm
- Merge sorted sequences
- Array rotation
- Range reversal
- Duplicate removal
- Pivot partitioning
- Quickselect
- Majority-element voting
- Interval merging

#### Matrix and grid techniques

- Row-major traversal
- Column-major traversal
- Spiral traversal
- Diagonal traversal
- Matrix transpose
- Matrix rotation
- Matrix multiplication
- Flood fill
- Island counting
- Grid breadth-first search
- Grid depth-first search
- Shortest unweighted grid path

#### Stack algorithms

- Push, pop, and peek
- Balanced brackets
- Infix-to-postfix conversion
- Postfix evaluation
- Undo-stack model
- Next greater element
- Stock span
- Monotonic stack
- Minimum stack
- Queue using two stacks

#### Queue and deque algorithms

- Enqueue, dequeue, front, and rear
- Circular-queue operations
- Stack using queues
- Sliding-window maximum
- Monotonic deque
- Round-robin scheduling concept

#### Linked-list algorithms

- Insert at head and tail
- Insert at a position
- Remove from head and tail
- Remove by value
- Search and traversal
- Iterative reversal
- Recursive reversal
- Find the middle node
- Detect a cycle
- Find the cycle entry
- Merge sorted lists
- Remove duplicates
- Find the nth node from the end

#### Hashing algorithms

- Hash calculation
- Insert, search, and delete
- Collision demonstration
- Separate chaining
- Linear probing
- Rehashing and resize concept
- Frequency counting
- Duplicate detection
- Two Sum
- Grouping anagrams
- Set intersection

#### Tree algorithms

- General depth-first traversal
- General breadth-first traversal
- Preorder traversal
- Inorder traversal
- Postorder traversal
- Level-order traversal
- Tree height and depth
- Count nodes and leaves
- Tree diameter
- Balanced-tree check
- Symmetry check
- Lowest common ancestor
- Root-to-leaf paths
- Path sum
- Serialize and deserialize

#### Binary-search-tree algorithms

- Search
- Insert
- Delete a leaf
- Delete a node with one child
- Delete a node with two children
- Minimum and maximum
- Predecessor and successor
- Validate a binary search tree
- Find the kth smallest value

#### Heap and priority-queue algorithms

- Build a heap
- Heapify up
- Heapify down
- Insert
- Extract minimum
- Extract maximum
- Replace root
- Top-k values
- K-way merge
- Running median with two heaps

#### Trie algorithms

- Insert a word
- Search for a word
- Search for a prefix
- Delete a word
- Autocomplete concept
- Longest common prefix

#### Union-Find algorithms

- Make set
- Find representative
- Union
- Union by rank
- Union by size
- Path compression
- Connected-component detection
- Undirected-cycle detection

#### Graph algorithms

- Breadth-first search
- Recursive depth-first search
- Iterative depth-first search
- Path reconstruction
- Connected components
- Directed-cycle detection
- Undirected-cycle detection
- Topological sort with depth-first search
- Kahn's topological sort
- Unweighted shortest path
- Dijkstra's shortest path
- Kruskal's minimum spanning tree
- Prim's minimum spanning tree
- Bipartite check

#### Recursion and backtracking foundations

- Factorial
- Fibonacci
- Recursive binary search
- Recursive tree traversal
- Generate subsets
- Generate permutations
- Generate combinations
- Maze solving
- N-Queens
- Parenthesis generation

#### Dynamic-programming foundations

- Memoization
- Tabulation
- Fibonacci
- Climbing stairs
- House robber
- Coin change
- Zero-one knapsack
- Subset sum
- Longest increasing subsequence
- Longest common subsequence
- Grid paths
- Minimum path sum

## Tier B: advanced curriculum

Tier B extends the foundation with balancing, range queries, advanced strings, deeper graphs, and larger algorithm families.

### Tier B data structures

- Circular linked list
- Doubly circular linked list
- Ordered-map concept
- LRU cache
- AVL tree
- Red-black tree
- B-tree
- B+ tree
- Huffman tree
- Segment tree
- Fenwick tree
- Sparse table
- Radix tree
- Suffix array
- Prefix-function table
- Z-function table
- Rolling-hash table
- Bloom filter
- Inverted index
- Bipartite graph
- Multigraph

### Tier B algorithms

- Jump search
- Exponential search
- Interpolation search
- Shell sort
- Bucket sort
- Cocktail shaker sort
- Linked-list intersection and palindrome checks
- LRU-cache operations
- AVL insertion and rotations
- AVL deletion
- Red-black insertion cases
- Red-black deletion cases
- Huffman coding
- Segment-tree construction and queries
- Segment-tree point updates
- Fenwick-tree construction, updates, and queries
- Sparse-table construction and queries
- Bellman-Ford
- Floyd-Warshall
- A* search
- Zero-one BFS
- Kosaraju's strongly connected components
- Tarjan's strongly connected components
- Bridges
- Articulation points
- Biconnected components
- Eulerian path and circuit
- Hierholzer's algorithm
- Ford-Fulkerson
- Edmonds-Karp
- Bipartite matching
- Knuth-Morris-Pratt string search
- Rabin-Karp string search
- Z algorithm
- Rolling hash
- Edit distance
- Word break
- Matrix-chain multiplication
- Rod cutting
- Palindrome subsequence
- Activity selection
- Fractional knapsack
- Job sequencing
- Huffman greedy construction
- Extended Euclidean algorithm
- Sieve of Eratosthenes
- Fast modular exponentiation

## Tier C: optional specialist catalog

Tier C contains topics that are technically possible but specialized, expensive to maintain, or less important for the main beginner journey. Each item requires individual approval.

### Tier C data structures

- Skip list
- Threaded binary tree
- Splay tree
- Treap
- Binomial heap
- Fibonacci heap
- Lazy segment tree
- Interval tree
- Suffix tree
- Suffix automaton
- K-d tree
- Quadtree
- Octree
- LFU cache
- Incidence matrix
- External-memory structure concepts
- Concurrent and lock-free structure concepts

### Tier C algorithms

- Morris tree traversal
- Splay operations
- Advanced red-black deletion cases
- Lazy propagation
- Suffix-tree construction
- Suffix-automaton construction
- Manacher's palindrome algorithm
- Johnson's all-pairs shortest paths
- Boruvka's minimum spanning tree
- Dinic's maximum-flow algorithm
- Hopcroft-Karp matching
- Minimum-cut visualizations
- PageRank
- Centrality algorithms
- Graph clustering concepts
- Hamiltonian path backtracking
- Knight's tour
- Bitmask dynamic programming
- Tree dynamic programming
- Interval dynamic programming
- Chinese remainder theorem
- Karatsuba multiplication
- Strassen multiplication concept
- Computational-geometry structures and algorithms

## Capabilities shared by every tier

Every approved structure and algorithm should use the same learning framework:

```text
Python source
      |
      v
Recorded, bounded execution
      |
      v
Normalized learning events
      |
      +-- compare
      +-- visit
      +-- read or write
      +-- swap
      +-- insert or remove
      +-- link or unlink
      +-- push, pop, enqueue, or dequeue
      +-- rotate
      +-- hash or probe
      +-- discover or finish
      +-- relax
      +-- union or find
      +-- partition or merge
      +-- backtrack
      +-- memo read or write
      |
      v
Accessible visual and textual explanation
```

Each implementation must provide, where relevant:

- Structure diagram
- Current operation
- Before and after state
- Operation history
- Source-line synchronization
- Pseudocode or conceptual steps
- Invariant explanation
- General complexity reference
- Observed counts that are clearly separated from formal complexity
- Empty and error states
- Text equivalent for every diagram
- Light and dark themes
- Desktop and mobile behavior
- Reduced-motion behavior
- Bounded structure size and trace length
- Local-only execution with no analytics or learner-data upload

## Tier transition questions

Before moving to the next tier, answer:

```text
Is the current tier complete and tested?
              |
              v
Do the shared renderers reduce duplication?
              |
              v
Can a beginner explain the visual vocabulary?
              |
              v
Do mobile, keyboard, and screen-reader paths work?
              |
              v
Are examples correct and documentation complete?
              |
              v
Is the next tier still worth its maintenance cost?
```

## Planning rule

This file preserves scope. It does not authorize development by itself. A feature moves from listed to approved only after discussion, and from approved to implemented only after code, verification, and synchronized documentation are complete.
