# Code Explorer Data Structures and Algorithms tiers

This document preserves the proposed curriculum boundary for the separate Python Data Structures workspace. It is a planning reference, not a claim that the listed features are implemented.

```text
CURRENT STATUS

Tier A  -> approved for feature discussion only
Tier B  -> recorded for later evaluation
Tier C  -> recorded as an optional specialist catalog

No Data Structures workspace code has been approved or implemented yet.
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

The proposed Data Structures workspace is separate from the existing Python workspace.

```text
Code Explorer landing page
|
+-- Start exploring Python
|      +-- existing workspace.html
|      +-- existing Python curriculum and trace views
|
+-- Explore Python Data Structures
       +-- proposed data-structures.html
       +-- structure and algorithm curriculum
       +-- specialized visualizations
```

The two workspaces may reuse the editor, theme, Pyodide worker foundation, trace playback, serialization, dialogs, accessibility helpers, and safe local persistence. They must not become two copied applications that drift apart.

## Tier A: core curriculum

Tier A establishes the reusable event model, playback system, visualization language, accessibility model, and core beginner-to-intermediate curriculum.

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
