# Code Explorer project knowledge and working playbook

This file preserves the practical knowledge needed to extend Code Explorer safely. It complements `AGENTS.md`: that file defines the rules, while this file records what the application currently does and how its major parts fit together. Reusable discoveries, mistakes, successful patterns, and deferred decisions belong in `lessons_learned.md`.

Material reliability incidents receive a dedicated technical record.
`bug_report.md` currently documents the non-finite-float transport failure,
root cause, correction, complete browser audit, privacy analysis, and required
regression matrix.

Update this document whenever a capability, dependency, data contract, implementation pattern, important risk, or regression test changes.

## Product purpose

Code Explorer helps a beginner answer four families of questions:

```text
Python source
     |
     v
Recorded execution
     |
     +-- TRACE: What did Python do?
     +-- DATA: What values and objects exist?
     +-- FLOW: Where did execution travel?
     +-- LABS: What changes when I experiment?
```

The tool records a bounded execution first and then replays it. Playback breakpoints and timeline controls navigate the recorded trace. They do not pause the original Python interpreter.

`Tier.md` records the Tier A, B, and C curriculum for the separate Data Structures workspace. Chunk 7 completes Tier A with 535 reviewed programs across twenty-five sections, local execution, playback, and all 18 DSA learning views. Tier B and Tier C remain unimplemented. Do not treat a later listed structure, algorithm, renderer extension, or program as implemented unless code, verification, and learner-visible documentation prove it.

Documentation routing is implemented: `index.html` has no ambiguous Tool Guide control, its two matching primary actions open the Python and DSA paths, `workspace.html` links to `README.md`, and `data-structures.html` links to `README_DSA.md`.

The DSA guide documents every active complete Tier A execution, serialization, display, history, comparison, explanation, complexity, persistence, platform, and curriculum boundary. It states the verified value, what is counted, why it exists, threshold behavior, whether execution stopped or presentation was shortened, what evidence remains safe, and what the learner can try next.

The approved 535-program target has a curriculum quality contract. Counts alone never establish completion. Each section must progress from focused foundations through standard operations, meaningful variations, applied programs, and comparisons. Reject constant-only or name-only variations, filler lines, incoherent scripts, weak metadata, and examples whose recommended views have nothing useful to show. Validation must report line-count distributions and near-duplicate candidates, while human review must judge correctness, teaching depth, readability, coherent progression, and whether longer concepts received enough space. Short programs remain valid when the concept is genuinely atomic.

## Current capability ledger

### Landing and navigation

- Dedicated landing page at `index.html`.
- Dedicated, reloadable workspace at `workspace.html`.
- Dedicated, executable DSA workspace at `data-structures.html`.
- Two matching primary landing actions named **Start exploring Python** and **Start exploring Python Data Structures and Algorithms**.
- Python heading copy names the **Python Programming workspace** and briefly explains writing, running, replaying, and inspecting code.
- The Python starter-program picker lives only inside `workspace.html`.
- Contextual Tool Guide links live inside their matching workspaces.
- GitHub icon link to the repository.
- Explicit Dark mode and Light mode control.
- Copyright attribution for Aman Ali Pogaku.

### DSA Chunk 3 trees, heaps, tries, and string search

- Separate DSA `main.py` source, prepared input, active-view state, and editor preferences.
- 269 reviewed programs: 197 from Chunks 1 and 2, plus 30 tree and BST lessons, 18 heap and priority-queue lessons, and 24 trie and string-algorithm lessons.
- `dsa-curriculum-chunk3.js` owns stable IDs `DSA-198` through `DSA-269` and the exact 30, 18, and 24 section contracts.
- Chunk 3 programs progress from representations and basic operations through invariants, edge cases, applied workflows, and explicit comparisons. Ninety-six implemented programs now contain at least 15 meaningful source lines.
- CodeMirror Python editing with a native textarea fallback, wrapping, six font sizes, whole-document Copy and Paste, and local source statistics.
- Existing `py-worker.js` local execution with a 3,000-step trace limit and a 30-second outer worker timeout.
- Working playback and 18 views grouped under Trace, Data, Flow, and Labs.
- Visible Observed, Curriculum context, Unavailable, and Shortened evidence states.
- Exact-source matching before reviewed algorithm, phase, invariant, edge-case, comparison, or Big O context can appear.
- Automatic comments as a read-only IDE-style editor replacement layer, plus confirmation-gated Learning comments export.
- One safe DSA study renderer for both comment surfaces, with visual line numbers, conservative syntax spans, explicit read-only chrome, note bands, and presentation text that never enters copied or adopted source.
- A Python-parity DSA Learning comments dialog with Essential, Guided, and Detailed filtering, a live note summary, a three-part evidence legend, visibly separate curriculum-context rows, and a footer that remains reachable inside the bounded modal.
- A wider DSA desktop boundary with one horizontal view-label row. The source and view columns stack before becoming cramped, while narrow screens scroll only the bounded label strip.
- A fixed-height DSA source and learning pair shared by all 18 views: 690 pixels at laptop widths and 590 pixels on narrow phones. Any long result scrolls inside `#dsaViewStage` instead of expanding the complete workspace.
- A stable playback grid with one grouped button row, a flexible timeline, and a fixed speed selector. The timeline receives its own row on narrow screens.
- Local metadata search across every implemented DSA record, composed with vertical section filters and accurate per-section match counts.
- Stable contracts for 31 event names, 20 structure representation names, required program metadata, and the 535-program Tier A arithmetic.
- Bounded DSA presentation: 12 watches, 30 structure entries, 30 journey events, 80 path transitions, 120 table rows, and 2 comparison summaries.
- `scripts/validate-dsa-foundation.mjs` checks contracts, routes, guide targets, and required HTML ids.
- `scripts/validate-dsa-curriculum.mjs` validates exact counts, schema, uniqueness, source depth, metadata, and near-duplicate candidates.
- `scripts/validate_dsa_curriculum.py` compiles, executes, and checks the expected result for all 535 detached programs.
- Reviewed Structure Canvas roles now include tree, binary tree, BST, heap, priority queue, trie, Union-Find, and graph. These roles decorate observed serialized values only after exact source matching and a compatible value appears in the selected trace step. Edited and pasted source stays generic.

### DSA Chunk 4 Union-Find and graph algorithms

- 337 reviewed programs: 269 from Chunks 1 through 3, plus 10 Union-Find lessons, 24 graph-structure lessons, 20 traversal and connectivity lessons, and 14 shortest-path and spanning-tree lessons.
- `dsa-curriculum-chunk4.js` owns stable IDs `DSA-270` through `DSA-337` and the exact 10, 24, 20, and 14 section contracts.
- The new programs progress from parent forests and representation vocabulary through traversal, connectivity, weighted relaxation, shortest paths, minimum spanning trees, and explicit comparisons.
- One hundred forty-six cumulative programs contain at least 15 meaningful source lines. All traversal lessons contain at least 19, and all shortest-path and spanning-tree lessons contain at least 14.
- Reviewed Structure Canvas roles now include Union-Find and graph. Candidate selection prefers parent, component, graph, adjacency, matrix, edge, forest, or tree variables with a compatible serialized container.
- A reviewed role is not enough by itself. The selected trace step must also
  contain a semantically named compatible container. Until then, Structure
  Canvas uses its generic observed layout.
- Edited and pasted programs never inherit a named graph algorithm, invariant, phase, complexity claim, comparison group, or specialized orientation.
- `scripts/validate-dsa-curriculum.mjs` now enforces 337 cumulative programs and exact Chunk 4 section counts.
- `scripts/validate_dsa_curriculum.py` compiles, executes, and checks the expected result for all 337 detached programs.
- Chunk 4 comparison groups cover Union-Find forms and optimizations, connectivity methods, graph representations, walk-trail-path distinctions, traversal orders, topological ordering, unweighted and weighted paths, and minimum spanning trees.

Chunk 4 browser evidence:

- A local metadata search for `DSA-337 Kruskal Prim comparison` returns exactly
  the reviewed comparison program.
- `DSA-337` records 204 trace steps for its reviewed input, reports equal MST
  totals of 13, and uses graph orientation only after a compatible graph value
  exists.
- `DSA-270` begins with a generic observed `items` list. Its Union-Find
  orientation appears at the later step containing the `parent` dictionary.
- Editing an exact reviewed program removes the named algorithm context while
  all 18 observed views continue rendering.
- The bounded DSA view stage scrolls independently at desktop and 390-pixel
  mobile widths without creating page-level horizontal overflow.

### DSA Chunk 5 recursion, backtracking, divide and conquer, and greedy algorithms

- 397 reviewed programs: 337 from Chunks 1 through 4, plus 18 recursion
  lessons, 16 backtracking lessons, 10 divide-and-conquer lessons, and 16
  greedy lessons.
- `dsa-curriculum-chunk5.js` owns stable IDs `DSA-338` through `DSA-397` and
  the exact 18, 16, 10, and 16 section contracts.
- The recursion route progresses from direct base cases through string, number,
  array, nested-structure, and tree recursion, then memoization, mutual
  recursion, and iterative comparisons.
- The backtracking route requires visible choose, explore, restore, and reject
  behavior. Applied programs include grids, N-Queens, four-by-four Sudoku, word
  search, graph coloring, subset constraints, and duplicate pruning.
- Divide-and-conquer records expose split boundaries, solved parts, and combine
  steps through reductions, sorting, lower bounds, inversion counting,
  maximum-subarray combination, majority candidates, Karatsuba, and
  quickselect.
- Greedy metadata states the local rule and reviewed invariant. The catalog
  includes counterexamples so a local choice is never described as generally
  optimal without its required problem contract.
- One hundred ninety-two cumulative programs contain at least 15 meaningful
  source lines. Chunk 5 section minima are 10 recursion lines, 14 backtracking
  lines, 14 divide-and-conquer lines, and 11 greedy lines.
- `scripts/validate-dsa-curriculum.mjs` enforces 397 cumulative programs,
  exact section counts, source depth, schema, search, uniqueness, and
  near-duplicate boundaries.
- `scripts/validate_dsa_curriculum.py` compiles, executes, and checks the
  expected-result marker for all 397 detached programs.
- Reviewed context for a base case, recurrence, pruning rule, combine step,
  greedy-choice property, or Big O remains exact-source only. Edited and pasted
  programs receive observed frames, values, decisions, and events without an
  invented algorithm proof.

Chunk 5 browser evidence:

- Search exposes exact section badges of 18 Recursion, 16 Backtracking, 10
  Divide and conquer, and 16 Greedy algorithms, with 397 total programs.
- `DSA-355` records 264 steps and shows six nested naive-Fibonacci frames at a
  representative middle step.
- `DSA-364` records 575 steps, solves the reviewed four-by-four Sudoku, and
  reports 20 attempted values.
- `DSA-374` records 162 steps and reports a correctly sorted result after seven
  merges.
- `DSA-397` records 64 steps and reports three refueling stops.
- Editing `DSA-374` removes named merge-sort context while observed line and
  value evidence remains available.
- All 18 views render after the reviewed merge-sort trace.
- At 390 by 844 pixels in dark mode, the learning panel remains 590 pixels
  high, the view stage scrolls independently, and page-level horizontal
  overflow remains zero.
- Browser testing reproduced and corrected the shared non-finite-float
  serialization defect. `DSA-324` now transports positive infinity,
  `DSA-378` transports negative infinity, and both reach `Trace ready`.
- A separate pasted-code probe transported `inf`, `-inf`, and `nan` together,
  reached `Trace ready`, and preserved Python's `math.isnan` result.
- A definitive exact-ID browser audit ran all 397 catalog programs through the
  actual Pyodide worker, advanced each trace to its final step, and matched
  every record's own expected-result marker. The final failure count was zero.

### DSA Chunk 6 dynamic programming, bit manipulation, and mathematical algorithms

- 451 reviewed programs: 397 from Chunks 1 through 5, plus 24 dynamic
  programming lessons, 16 bit-manipulation lessons, and 14 elementary
  mathematical-algorithm lessons.
- `dsa-curriculum-chunk6.js` owns stable IDs `DSA-398` through `DSA-451` and
  the exact 24, 16, and 14 section contracts.
- Dynamic-programming metadata names the state, base states, transition,
  dependency-safe order, reconstruction information, and any deliberate
  storage compression.
- Bit lessons state the nonnegative-input or finite-width contract that gives
  masks, shifts, cancellation, and bounded overflow their meaning. Python
  integers do not silently use one small fixed machine width.
- Mathematical lessons expose an executable invariant and any required
  precondition through shrinking remainders, factors, intervals, exponents,
  digits, or modular checks.
- Two hundred twenty cumulative programs contain at least 15 meaningful
  source lines. Chunk 6 section minima are 10 dynamic-programming lines, 10
  bit-manipulation lines, and 12 mathematical-algorithm lines.
- Exact reviewed source can receive named state, recurrence, bit-width,
  number-theory precondition, invariant, comparison, and Big O context.
  Edited or pasted source receives only observed local evidence.

Chunk 6 browser evidence:

- The catalog reports 24 Dynamic programming, 16 Bit manipulation, and 14
  Elementary mathematical algorithms records, with 451 total programs.
- `DSA-403` transports positive infinity as an unsolved minimum state and
  reaches `Trace ready`.
- `DSA-406` transports negative infinity as an impossible maximum state and
  reaches `Trace ready`.
- `DSA-422` verifies a finite bit-mask lesson.
- `DSA-451` verifies the final coprime-congruence lesson.
- A definitive exact-ID audit ran all 451 catalog programs through the actual
  Pyodide worker, advanced every trace to its final step, and matched each
  program's own expected-result marker. The failure count was zero.

Chunk 6 curriculum review uses this sequence:

```text
precise objective
    |
    v
executable source with visible invariant
    |
    v
honest metadata supported by the 18 views
    |
    v
detached compile, run, and expected-result check
    |
    v
strict worker transport and final browser-output check
```

A table alone does not prove dynamic programming. A bitwise operator alone
does not prove a safe width contract. A mathematical result alone does not
prove its precondition or invariant.

### DSA Chunk 7 investigations and integrated guided challenges

- 535 reviewed Tier A programs: 451 direct-teaching lessons plus 48
  edge-case and debugging investigations and 36 guided challenges.
- `dsa-curriculum-chunk7.js` owns stable IDs `DSA-452` through `DSA-535`.
- Investigation records use named case tables. Generated Python prints the
  case label, actual value, expected value, and pass state, then accepts the
  lesson only when every case matches.
- Investigation families cover search bounds, order and duplicates, mutation
  and aliasing, capacity and underflow, structural boundaries, non-finite and
  signed numeric boundaries, string boundaries, and invariant audits.
- Guided challenges cover twelve complete workflows: browser history, ticket
  scheduling, inventory, autocomplete, unweighted routing, weighted routing,
  minimum cable, expression evaluation, maze search, edit distance,
  dependency scheduling, and least-recently-used caching.
- Each workflow has a baseline, boundary-review, and invariant-audit record.
  These are study lenses, not progress tracking and not proof that a learner
  completed prerequisites.
- The exact-source boundary remains unchanged. Reviewed algorithm names,
  invariants, edge cases, phases, and Big O disappear after any source edit.
  Observed trace views remain available for the edited or pasted program.

Chunk 7 authoring and release sequence:

```text
48 named-case investigations
        +
12 integrated workflows x 3 study lenses
        |
        v
84 schema-complete reviewed records
        |
        v
near-duplicate and source-depth checks
        |
        v
535 detached compile, run, and expected-result checks
        |
        v
strict worker transport and exact-ID browser audit
```

Chunk 7 depth evidence:

- Investigations contain 17 to 30 meaningful source lines.
- Guided challenges contain 21 to 35 meaningful source lines.
- 304 cumulative Tier A programs contain at least 15 meaningful lines.
- The protected cumulative regression floor is 290, leaving room for later
  comment-only maintenance without encouraging filler.
- The first detached execution sweep caught a browser-history expected-state
  mistake. The implementation correctly restored `guide` before the final
  visit, so the reviewed expectation was corrected from two back-stack pages
  to three. A compiled program is not a validated teaching result.

Chunk 7 browser verification must include:

- An investigation selected by exact stable ID, advanced to its final step,
  with the named case observations and `Result: True` visible.
- A baseline guided workflow and its matching boundary-review and
  invariant-audit records.
- `DSA-535`, the final Tier A record.
- Positive infinity, negative infinity, and NaN through the strict worker
  path. The non-finite transport incident remains a permanent regression.
- A complete 535-record exact-ID audit before the release is described as
  definitive.

### Strict Python-to-JavaScript value transport

`py-worker.js` must detach every recorded Python value into strict
JSON-compatible teaching data. Python's `json.dumps` accepts NaN and positive
or negative infinity by default, but the emitted `NaN`, `Infinity`, and
`-Infinity` tokens are not valid JSON and JavaScript `JSON.parse` rejects
them.

The required contract is:

```text
finite primitive
    |
    +-- preserve its JSON number, boolean, string, or null value

non-finite float
    |
    +-- preserve type: float
    +-- preserve display: inf, -inf, or nan
    +-- transport value as stable text
    +-- mark nonFinite: true

final result
    |
    +-- json.dumps(..., allow_nan=False)
```

The explicit `math.isfinite` branch is the normal conversion. Strict final
encoding is defense in depth. Do not remove either one.

Transport verification has separate layers:

1. Direct Python execution proves the program itself runs.
2. Serializer checks prove the trace contains bounded detached descriptions.
3. Strict encoding proves Python produced valid JSON text.
4. JavaScript parsing proves the consumer accepts that text.
5. Browser playback at the final step proves the learner can see the
   program-specific expected output.

The incident, root cause, audit-harness corrections, privacy analysis, and
prevention matrix are recorded in `bug_report.md`.

### DSA evidence flow

```text
Editor source
    |
    +-- exact match with one reviewed program?
    |       |
    |       +-- Yes -> attach curriculum context
    |       +-- No  -> keep named context unavailable
    |
    +-- execute in local worker
            |
            +-- recorded frames and values -> Observed views
            +-- bounded serializers -> Structure and reference views
            +-- completed result -> comments and comparison summary
```

The runtime may classify conservative cues such as a write, condition, call, return, visit, or likely swap from trace evidence. These cues do not permit the controller to invent a named algorithm.

### Source editor

- CodeMirror 6 Python editor with a native textarea fallback.
- Automatic local saving of the complete source.
- Text wrapping toggle.
- Editor font sizes from 12 px through 22 px.
- Complete-document Copy and Paste actions.
- Clear clipboard permission feedback.
- Execution-line focus and heatmap decorations.
- Clickable replay breakpoints in the line-number gutter.
- Source line and character statistics.
- Non-destructive Automatic comments widgets rendered above related source lines after a trace.
- Automatic comments on or off state with visible text, `aria-pressed`, and disabled behavior before evidence exists.
- Original-source Copy behavior even while visual notes are shown.
- A read-only commented fallback preview when CodeMirror is unavailable.
- Automatic Learning Comments generated from parsed syntax and the completed trace.
- Essential, Guided, and Detailed comment levels in a separate preview.
- Complete commented-document copy and confirmation-gated editor replacement.
- Generated-line deduplication through the `# Code Explorer:` prefix while learner comments remain intact.

### Trace area

- Story explains the selected step.
- Before and After names the selected step, line, and executed source, then renders the complete visible variable state as one vertical card per name. Cards appear, disappear, or update with playback while each card compares adjacent snapshots.
- Conditions explains observed branch decisions and simple operands.
- Function Journey shows calls, local frames, arguments, and returns.
- Error Coach presents syntax and runtime guidance.

### Data area

- Variables provides scope-aware value inspection and history.
- Watches follows selected names across trace steps.
- Structures expands lists, tuples, sets, and dictionaries.
- References draws conceptual name-to-object relationships.
- Mutation Explorer distinguishes object mutation from name reassignment.

### Flow area

- Execution Path draws observed transitions and visit counts.
- Coverage reports reached, repeated, and missed executable lines.
- Loop Table compares variable values across iterations.
- Loop Lab explains the active loop and iteration position.

### Labs area

- Input Playground turns the locally stored multiline document into an exact
  ordered response queue. An empty document means zero responses, while blank
  lines inside a nonempty document remain intentional blank responses.
- Input Playground maps only worker-recorded successful `input()` calls to
  prompts and returned values. Changing the queue after a run produces a stale
  evidence warning rather than silently relabelling the old input log.
- The prepared document stops at 20,000 characters and its visual preview
  stops at 30 rows. The complete allowed queue still reaches the worker.
- Compare Algorithms is restricted to exact reviewed source and comparison
  groups containing at least two programs. It keeps the newest two compatible
  summaries in page memory only.
- Each comparison summary stores exact prepared-input text, trace-step count,
  reached-line count, consumed-input count, algorithm name, result, and an
  800-character output preview. The fairness check compares prepared text but
  states that matching input does not prove equivalent source data.
- Trace-step differences are recording comparisons, never timings or inferred
  Big O.
- Edge Case Lab converts reviewed edge-case text into prediction-first
  experiment cards. It recommends relevant views but never records attempts,
  completion, or correctness.
- Edited or pasted source removes comparison and edge-case curriculum context
  while the local editor and observed trace remain usable.

### Playback and visualization

- Previous, play or pause, next, and restart controls.
- Timeline slider and selectable playback speed.
- Current-step console output reconstruction.
- Graph fit buttons and granular persistent zoom controls.
- Stable graph rendering designed to avoid repeated layout shaking.

### Examples and guidance

- 134 curated examples grouped into 12 concept categories and three difficulty levels.
- The current library blends 54 reviewed base examples with 80 additional programs. Existing debugging, recursion, mutation, copying, input, and collection coverage was preserved while names, categories, and longer programs were improved where useful.
- Category-filterable starter-program library with a vertical category navigator and per-category count badges.
- Local metadata search across all 134 reviewed records, composed with categories and preserving absolute route numbers in search results.
- Independent vertical scrolling for desktop navigation and cards, plus stacked vertical navigation above one-column cards on mobile.
- Accurate source-line counts, program counts, filter-reset scrolling, and prepared input for input-driven examples.
- A fixed recommended sequence that interleaves 12 named guided checkpoints after their listed prerequisite concepts without collecting or inferring learner progress.
- Twenty programs of at least 15 lines, including 12 guided mini programs from 18 through 31 lines.
- Three clearly labeled investigation programs that intentionally raise `IndexError`, `ValueError`, or `KeyError`. All other examples must finish without an accidental error.
- Eight Classes and Objects programs, including classes, instances, attributes, methods, constructors, inheritance, composition, and a longer object-oriented checkpoint.
- Extensive README walkthroughs, question maps, workflows, expected behavior, troubleshooting, and glossary.

### Shared catalog search

`catalog-search.js` owns one browser-local search contract for both workspaces.

```text
Immutable reviewed program record
        |
        +-- collect primitive metadata values
        +-- normalize case, accents, and punctuation
        +-- prepare one in-memory text index
        |
Temporary search query
        +-- normalize into words
        +-- require every word to match
        |
Selected category or section
        |
        v
Matching cards, badges, and live result count
```

Implementation rules:

- Prepare one index per reviewed record at module startup. Do not repeatedly flatten full source and metadata after every keystroke.
- Search values, not learner identity or activity. Queries remain session-only state and never use browser storage.
- Do not upload, log remotely, add to a URL, or include search queries in analytics.
- Keep query matching and category or section matching as an intersection.
- Update filter badges from the active search so zero-result sections are visible before selection.
- Require all normalized query words to match somewhere in the same record.
- Treat punctuation consistently so reviewed complexity strings remain searchable.
- Preserve stable DSA identifiers and absolute Python route numbers in search results.
- Use a visible label, native search input, concise help, polite live result count, keyboard focus, and a Clear search recovery action.
- Keep curriculum records immutable. The prepared index is a separate in-memory Map.
- Selecting a match must reuse the existing card-loading path rather than creating a second editor-mutation flow.

### Automatic Learning Comments

Automatic Learning Comments is implemented. It creates a study copy after a trace instead of silently rewriting learner source.

The safe intended behavior is:

```text
Original learner source
          +
Parsed Python structure
          +
Recorded trace evidence
          |
          v
Learning-comment metadata
          |
     +----+------------------+
     |                       |
     v                       v
Visual editor widgets    Separate commented preview
     |                       |
     +-- Show or hide         +-- Copy commented code
     +-- Never enter source   +-- Hide preview
                              +-- Replace editor only after confirmation
```

Implemented guarantees:

- The original source remains unchanged by default.
- Inline widgets are decorations attached to source line positions, not inserted document text.
- Inline widgets use a visible `Trace note` badge and readable prose styling so generated guidance remains distinct from editable Python in both themes.
- Editor Copy, line counts, breakpoints, heatmap ranges, and trace mapping continue to use the original document.
- The inline mode starts off for each trace and clears on editing, pasting, example selection, or a new run.
- The selected detail level filters both the inline view and export preview.
- Existing comments, indentation, and blank lines are preserved.
- Comments explain purpose and observed behavior instead of repeating syntax.
- Repeated loop values are described carefully and are not presented as one universal value.
- Unsupported or ambiguous constructs receive no invented explanation.
- Comment-generation failure cannot break tracing, playback, or source editing.
- The export dialog uses a read-only IDE-style shell with a file tab, visual gutter, syntax colors, note bands, and status strip. These elements are presentation only and never enter copied or replaced source.
- `renderLearningPreviewDocument()` creates all source and note content with text nodes. It never treats learner-controlled source as HTML.
- `appendPythonPreviewTokens()` is a conservative display tokenizer, not the Python parser and not a source transformer. The exact generated document remains owned by the comment-building path used by Copy and Replace.
- The study palette derives from the existing light and dark theme variables. It adds no external theme dependency, saved preference, network request, or learner-data path.
- The explanation engine has full-corpus evidence from the reviewed 54-program base and representative v4 checks for class definitions and object attributes. The complete 134-program corpus is separately compile-and-run validated, while syntax-error, runtime-error, repeated-line, and unsupported explanation cases remain explicit regression checks.
- `README.md`, this file, and relevant source comments are updated in the same change.
- `lessons_learned.md` records what the feature teaches the project during implementation and testing.

The two surfaces intentionally answer different learner needs:

| Surface | State owner | Source mutation | Primary purpose |
| --- | --- | --- | --- |
| Automatic comments toggle | `state.automaticCommentsVisible` and the current `learningComments` records | Never | Read explanations in context, then return to compact source flow |
| Learning comments dialog | Current `learningComments`, selected detail, and generated preview text | Only after explicit replacement confirmation | Copy or adopt a portable commented study document |

## Runtime and dependency map

```text
workspace.html
     |
     v
app.js
     |
     +-- curriculum.js
     |      +-- 80 additional examples
     |      +-- guided prerequisites
     |      +-- intentional-error metadata
     |
     +-- CodeMirror modules from esm.sh
     |      +-- editing
     |      +-- Python syntax highlighting
     |      +-- line decorations
     |
     +-- Cytoscape from esm.sh
     |      +-- reference graph
     |      +-- execution-path graph
     |
     +-- py-worker.js
            |
            +-- Pyodide from jsDelivr
                   +-- Python AST parsing
                   +-- sys.settrace snapshots
                   +-- safe value serialization
                   +-- captured output and errors
```

All remote modules are loaded at runtime. The editor keeps a native fallback, but Python execution and graph features require their browser dependencies to load successfully.

```text
data-structures.html
     |
     v
dsa-app.js
     |
     +-- dsa-contracts.js
     |      +-- 4 areas and 18 views
     |      +-- 31 event names
     |      +-- 20 structure names
     |      +-- 535-program target arithmetic
     |
     +-- dsa-curriculum.js
     |      +-- 6 Chunk 1 sections
     |      +-- 131 reviewed records
     |
     +-- dsa-curriculum-chunk2.js
     |      +-- 3 Chunk 2 sections
     |      +-- 66 reviewed records
     |
     +-- dsa-curriculum-chunk3.js
     |      +-- 3 Chunk 3 sections
     |      +-- 72 reviewed records
     |
     +-- dsa-curriculum-chunk4.js
     |      +-- 4 Chunk 4 sections
     |      +-- 68 reviewed records
     |
     +-- dsa-curriculum-chunk5.js
     |      +-- 4 Chunk 5 sections
     |      +-- 60 reviewed records
     |
     +-- dsa-curriculum-chunk6.js
     |      +-- 3 Chunk 6 sections
     |      +-- 54 reviewed records
     |      +-- 451 combined reviewed records
     |
     +-- dsa-curriculum-chunk7.js
     |      +-- 2 Chunk 7 sections
     |      +-- 84 reviewed records
     |      +-- 535 complete Tier A records
     |
     +-- dsa-runtime.js
     |      +-- pure observed-evidence helpers
     |      +-- bounded comment generation
     |
     +-- shared-ui.js and shared-editor.js
     |      +-- theme, storage, CodeMirror, fallback
     |
     +-- py-worker.js
            +-- same local execution and serialization limits
```

The DSA controller intentionally does not import the Python curriculum. The workspaces share infrastructure while keeping source, examples, view meaning, and documentation separate.

### Pinned browser dependencies

| Dependency | Current version | Role |
| --- | ---: | --- |
| Pyodide | 0.28.2 | Browser Python runtime |
| CodeMirror package | 6.0.2 | Enhanced editor setup |
| CodeMirror Python language | 6.2.1 | Python parsing and syntax highlighting |
| CodeMirror state | 6.7.1 | Editor state fields and effects |
| CodeMirror view | 6.43.6 | Editor rendering and decorations |
| CodeMirror language | 6.12.4 | Language support and highlighting integration |
| Lezer highlight | 1.2.3 | Stable syntax token classes |
| Cytoscape | 3.31.0 | Reference and execution-path graphs |

Code Explorer does not use Vue, React, a package installation step, or a bundler. The three HTML pages load shared assets and their page-specific controllers directly. Matching query versions are intentional cache busters for GitHub Pages and must be synchronized whenever a shared asset changes.

### Privacy and network boundary

Code Explorer has no analytics, telemetry, advertising, profiling, user-account, remote-database, session-recording, fingerprinting, or automatic crash-reporting subsystem.

The current network-capable surface is deliberately small:

| Host or destination | Purpose | Learner content attached by Code Explorer? |
| --- | --- | --- |
| GitHub Pages | Serve the static project files | No application analytics payload |
| `esm.sh` | Load pinned CodeMirror and Cytoscape modules | No |
| jsDelivr | Load pinned Pyodide files | No |
| Google Fonts | Load DM Sans and IBM Plex Mono font files | No |
| GitHub links | Open the repository or README after a deliberate learner click | No, and links use `noreferrer` |
| Local Web Worker | Receive source and prepared input for in-browser execution | This is same-page browser messaging, not a network destination |
| Browser local storage | Restore source and documented preferences on the same origin | This is local persistence, not remote collection |

Standard asset and page requests can expose ordinary transport metadata, such as IP address, browser headers, and the requested path, to the relevant hosting provider. The application does not append source, input, trace data, clipboard text, stored preferences, analytics identifiers, or user identifiers to those requests. Provider-side request metadata is not returned to the application, and project maintainers have no Code Explorer endpoint, raw-log access, or analytics dashboard through which to view it.

GitHub repository Insights is a separate platform feature. For repositories where it is available, people with push access can see aggregate recent visitors and clones, referring sites, and popular repository content. Treat those as GitHub repository statistics, not application events. They do not expose the Python entered in the workspace, prepared input, traces, console output, clipboard text, local-storage values, raw dependency-request IP addresses, or raw dependency-request browser headers. Do not write code that attempts to connect repository traffic totals to an individual learner session.

The permanent implementation rule is stricter than adding a consent flow: do not add analytics at all. Reject any dependency or feature that requires learner-data collection, analytics events, telemetry, tracking pixels, behavior recording, fingerprinting, or automatic remote error uploads.

Privacy audit recipe:

1. Search source, markup, styles, configuration, and dependencies for analytics and telemetry products or keywords.
2. Search for `fetch`, `XMLHttpRequest`, `WebSocket`, `EventSource`, `navigator.sendBeacon`, form actions, cookies, IndexedDB, service workers, and dynamic external URLs.
3. Inventory every remaining external URL and state exactly why it is contacted.
4. Trace learner source, input, output, clipboard, watch names, bookmarks, and preferences from creation to final destination.
5. Confirm worker `postMessage` calls stay inside the browser and that no remote request consumes their payload.
6. Confirm external links retain `noreferrer` and open only after an explicit learner action.
7. Update README.md, AGENTS.md, SKILLS.md, and lessons_learned.md when the privacy boundary or audit knowledge changes.

The 2026-07-22 audit found no `fetch()`, `XMLHttpRequest`, WebSocket, EventSource, beacon, cookie, IndexedDB, form submission, analytics SDK, telemetry SDK, remote logger, tracker, or source-upload path in application code. The only learner-content transfer is `app.js` sending source and prepared input to `py-worker.js` through local worker `postMessage()`.

## Core data flow

```text
getCode()
   |
   v
runCode()
   |
   +-- ensureWorker()
   +-- attach unique run id
   +-- start 30-second outer timeout
   |
   v
py-worker.js run_trace()
   |
   +-- parse AST metadata
   +-- create conservative statement explanations
   +-- execute with sys.settrace
   +-- stop at 3,000 steps
   +-- serialize visible scopes safely
   +-- capture stdout and exceptions
   +-- combine structure with observed values, counts, and outcomes
   |
   v
loadResult()
   |
   +-- trace snapshots
   +-- loops and conditions
   +-- console output
   +-- error information
   +-- learningComments metadata
   |
   v
renderStep()
   |
   +-- selected Trace view
   +-- selected Data view
   +-- selected Flow view
   +-- selected Labs view
   +-- editor line and heatmap
   +-- console at selected time
```

The `learningComments` result contains JSON-compatible records with `line`, `level`, `kind`, and `text`. `line` connects a note to one source line. `level` ranges from 1 through 3 for Essential, Guided, and Detailed filtering. `kind` supports future presentation decisions. `text` contains conservative learner-facing prose.

## Important state relationships

- `state.trace` is the recorded playback timeline.
- `state.learningComments` contains comment metadata for the current source and current run only.
- `state.automaticCommentsVisible` records whether the current trace's visual learning layer is shown. It is false before a trace, while a new run starts, after a source change, and after trace clearing.
- `state.commentOverlay` stores the CodeMirror learning-comment effect and widget constructors. The field is separate from heatmap decorations so either layer can refresh without rebuilding the other.
- `state.fallbackLearningPreview` refers to the read-only commented preview created only when the native textarea fallback is active.
- `state.currentStep` selects the snapshot used by most views.
- Changing editor source invalidates the recorded trace.
- Worker results are separated into `state.trace`, `state.loops`, `state.conditions`, `state.error`, and `state.inputLog`. Console output is retained inside each trace snapshot so moving backward reconstructs the output visible at that moment.
- Watches, bookmarks, comparisons, breakpoints, graph instances, editor preferences, and learning preferences have different lifetimes. Check their initialization and clearing behavior before reusing them.
- CodeMirror and the textarea fallback must both use `getCode()` and `setCode()` so features do not depend on one editor implementation.
- A view renderer must handle the empty state, a normal selected step, missing metadata, and an error result.
- Editing or replacing source clears `state.learningComments` because runtime facts from the old source are stale.
- Editing or replacing source also hides the automatic layer before clearing its records. A visible old note must never survive beside changed source.
- `renderAutomaticComments()` owns button text, disabled state, pressed state, CodeMirror widgets, and fallback preview cleanup. Call it after any change to visibility, evidence, editor availability, or comment detail.
- `buildLearningCommentedSource()` removes only older lines beginning with the exact generated prefix, preserves learner comments, and inserts current notes above their related source lines.

### DSA controller relationships

- `state.code` is separate from Python-workspace source and is saved under `code-explorer-dsa-source`.
- `state.program` is non-null only when normalized editor source exactly matches one record in the combined implemented DSA catalog.
- `state.trace`, `state.error`, `state.loops`, `state.conditions`, and `state.inputLog` come from the local worker result.
- `state.comparisonRuns` keeps at most two in-session summaries. It is not persistent learner progress.
- `state.preparedInputs` is local browser text and is capped at 20,000 characters when loaded.
- `state.activeView` selects one of the 18 contracted renderers and is locally restored.
- `state.selectedProgramId` stores only the stable origin of the reviewed DSA question. It survives edits so the learner keeps the prompt, but Paste and complete-source transformations clear it.
- `state.automaticCommentsVisible` changes only presentation. Original editor source remains the source of truth.
- `state.referenceGraphLibrary` caches only the optional Cytoscape module for
  the current page. `state.referenceGraph` owns the live References instance,
  and `state.referenceGraphRenderId` rejects stale asynchronous completions.
- `state.algorithmPathGraph` owns the separate live Algorithm Path instance,
  while `state.algorithmPathGraphRenderId` rejects stale imports or renders.
  Both graph views reuse `state.referenceGraphLibrary` and must destroy their
  own instance when playback, theme, source, or view state requires it.
- Editing source immediately clears the old trace, error, comments, comparison eligibility, and exact reviewed-program identity.
- Reviewed phases, invariants, edge cases, complexity, and comparison groups must read from `state.program`, never from source-text heuristics.
- Observed views must read from worker evidence and remain useful when `state.program` is null.
- Structure Canvas may use exact reviewed structure metadata to orient observed cells as a stack, queue, deque, linked structure, hash table, set, tree, heap, priority queue, trie, Union-Find, or graph only after that exact reviewed match succeeds.
- `reviewedStructureCandidate()` must select a compatible semantically named
  container before falling back to the generic largest-container helper. This
  prevents an input list from receiving stack, tree, trie, or graph labels.
- The role label never changes the serialized value or claims a physical memory layout. Learner-authored or modified source receives the generic observed structure layout.
- `dataScopeGroups()` keeps globals and real function locals separate but
  removes the duplicate module-local namespace.
- `groupedObjectChanges()` converts name-level alias reports into one object
  mutation event with multiple affected names.
- Invariant Checker currently has no general proof engine. Exact reviewed
  rules are questions paired with observed lines, and every automatic
  satisfied or violated verdict must remain Unavailable.

## Persistence inventory

| Data | Storage behavior |
| --- | --- |
| Current Python source | Saved in local storage and restored on reload |
| Current DSA source | Saved under a separate local key and restored on DSA reload |
| Selected Python example question | Stable reviewed title saved locally; cleared by Paste or complete-source replacement |
| Selected DSA question | Stable reviewed ID saved locally; cleared by Paste or complete-source replacement |
| Theme | Saved in local storage |
| Editor wrap and font size | Saved in local storage |
| Graph zoom | Saved in local storage |
| Watched variable names | Saved in local storage, with at most 12 valid names |
| Prepared input text | Saved in local storage |
| DSA prepared input text | Saved under a separate local key, limited to 20,000 characters |
| Active DSA view | Saved as one validated 18-view identifier |
| DSA comparison summaries | Current DSA page session only, at most two |
| Current trace | Recreated by running code |
| Playback position | Session state only |
| Trace bookmarks | Current trace only |
| Replay breakpoint markers | Current page session, retained across reruns but not reloads |
| Run comparisons | Current page session only |
| Learning-comment metadata and export preview | Current trace only |
| Automatic comments visible or hidden | Current trace only, always reset when evidence becomes stale |
| Commented source after confirmed replacement | Becomes ordinary locally saved editor source |

When adding persistence, validate parsed values and merge them with safe defaults. A malformed stored value must not prevent application initialization.

None of these values is an analytics event. There is no synchronization, account association, remote backup, or upload path. A future implementation must not reinterpret local persistence as permission to transmit data.

## Safety boundaries

- Python executes away from the main UI thread.
- The UI owns an outer 30-second execution timeout and can terminate the worker.
- The tracer records at most 3,000 steps.
- Serialized containers stop at a bounded depth and item count.
- Representations are shortened before crossing into the interface.
- Cyclic and shared objects are represented without infinite recursion.
- Learner-defined instances expose a bounded `attributes` mapping when a safe `__dict__` is available. The mapping obeys the same depth, item, cycle, and representation limits as built-in containers.
- Default Python object representations are normalized to stable teaching labels such as `<Pet instance>` so the interface does not display process-specific hexadecimal addresses as meaningful memory locations.
- Only frames belonging to the learner's virtual file enter the educational call stack.
- Graphs are conceptual views and must not claim to show physical RAM addresses.
- The DSA References graph contains at most 90 combined nodes and edges. The
  complete semantic text map must remain available when the graph is
  shortened, loading, unavailable, or deliberately suspended during playback.
- Learner strings rendered as markup must be escaped.
- Learner source, prepared input, trace snapshots, console output, clipboard contents, watches, bookmarks, and preferences must never be transmitted to analytics, telemetry, tracking, profiling, advertising, or remote logging services.
- Console warnings may explain local browser failures, but must not be forwarded automatically to a remote collector.
- Generated comments must never claim an unobserved value or path.
- Exception events must suppress ambiguous completion, loop, and condition counts for the failing line. Python frame unwinding can otherwise make one failure resemble repeated completion.
- Comment preview, copying, and closing must leave the editor unchanged.
- Inline learning widgets must never become part of `getCode()`, local source storage, normal editor Copy, worker input, breakpoint line numbers, or heatmap ranges.
- Starting execution must hide old inline widgets before the worker begins so stale claims cannot remain visible during a new run.
- The fallback learning preview must be read-only and must not replace the source value used by execution.
- Complete-document replacement must remain behind an explicit confirmation.

## Recurring implementation recipes

### Add a learner-visible view

1. Place the view under the best existing learning area: Trace, Data, Flow, or Labs.
2. Add semantic HTML for its tab, panel, and empty state.
3. Add a focused render function in `app.js` that tolerates missing data.
4. Connect it through the shared panel-switching and step-rendering paths.
5. Add CSS for light mode, dark mode, mobile width, focus, and overflow.
6. Add comments for the mounting point, renderer inputs, derived data, and fallbacks.
7. Update the README workspace map, question map, detailed section, expected behavior, and troubleshooting when relevant.
8. Update this capability ledger and add regression cases.

### Add trace metadata

1. Prefer Python AST data for source structure.
2. Prefer `sys.settrace` snapshots for observed runtime facts.
3. Serialize only finite JSON-compatible data.
4. Document every new result field at its production and consumption points.
5. Keep the worker result backward-safe when data is absent.
6. Test nested scopes, repeated lines, errors, and the step cap.

### Add an editor feature

1. Confirm behavior in CodeMirror and the textarea fallback.
2. Route source reads and writes through `getCode()` and `setCode()`.
3. Preserve source exactly unless the learner explicitly requests a transformation.
4. Clear stale trace state after a real source change.
5. Avoid permanent toolbar controls when a contextual action is clearer.
6. Verify wrap on, wrap off, all supported font sizes, and mobile overflow.
7. If the feature is a visual annotation, implement it as a decoration or separate preview instead of changing the document unless source transformation is the explicit product goal.
8. Verify ordinary Copy, local saving, worker execution, line statistics, trace mapping, and breakpoints against the unmodified source.

### Add a starter program

1. Decide whether the program is a focused concept example or a guided integration checkpoint. Keep a focused example small enough to inspect step by step, and let a guided program grow only when each added line advances a coherent learner task.
2. Give it a single primary concept, category, difficulty, description, source, and optional prepared input.
3. Add prerequisite metadata to every guided program. The prerequisites describe a recommended fixed sequence, not tracked completion.
4. If failure is the lesson, label it as an intentional learning error and declare the exact expected exception type. Never use an accidental error as teaching content.
5. Confirm it runs within all safety limits.
6. Inspect its Story, Variables, relevant specialist view, and final output.
7. Update the README catalog and suggested learning route.
8. Update the exact example count in this file and any learner-facing interface comment that states it.
9. Run both curriculum validators before shipping.

Current library invariants:

| Dimension | Required value |
| --- | --- |
| Total | 134, formed from 54 reviewed base examples plus 80 additional examples |
| Categories | First Steps 10, Variables and Types 10, Operators and Expressions 10, Strings 8, Decisions 12, Loops 16, Functions and Scope 16, Collections 16, References and Mutation 8, Input, Errors and Debugging 8, Classes and Objects 8, Guided Mini Programs 12 |
| Levels | Beginner 46, Developing 56, Guided Challenge 32 |
| Extended programs | 20 programs of at least 15 source lines; the 12 guided checkpoints range from 18 through 31 lines |
| Intentional failures | `IndexError`, `ValueError`, and `KeyError` in three named debugging examples |

The examples browser has its own layout invariants:

```text
DESKTOP
vertical category sidebar | independently scrolling two-column cards

MOBILE
bounded vertical categories
---------------------------
independently scrolling one-column cards
```

Category changes must set the card region's `scrollTop` to zero. Every mobile card needs a real minimum height because a constrained grid can otherwise shrink button rows while their text continues overflowing.

### Change Automatic Learning Comments

1. Keep structural explanations in the worker's Python AST pass and observed facts in the trace-derived evidence pass.
2. Return finite plain metadata. Do not return a prewritten replacement document from the worker.
3. Keep level numbers stable: 1 Essential, 2 Guided, 3 Detailed.
4. Use observed facts only when the selected source line and trace support them.
5. Prefer no comment over a clever but uncertain explanation.
6. Preserve the exact `# Code Explorer:` prefix unless migration behavior is designed and documented.
7. Keep inline display records and the export document derived from the same filtered metadata so their wording cannot drift.
8. Render inline notes as block widgets before the related source line. Keep their `Trace note` label visible and never dispatch source changes to simulate temporary comments.
9. Keep IDE chrome, CSS-generated gutter numbers, syntax spans, legends, and status text outside the generated source string. Test that none of them reaches Copy or Replace.
10. Render learner-controlled source through text nodes. If display tokenization is uncertain, show plain text rather than guessing or using HTML interpolation.
11. Test original-source preservation, inline on and off, button semantics, all detail levels, normal editor Copy, export copy, cancel, confirmed replacement, rerun deduplication, existing learner comments, blank lines, and indentation.
12. Test invalidation through manual editing, complete-document paste, example selection, clear-trace behavior, and the start of a new run.
13. Test CodeMirror and fallback behavior, both themes, desktop, mobile wrapping, bounded internal scrolling, and absence of horizontal overflow.
14. Run the full 134-example corpus because it covers first statements, values, operators, strings, decisions, loops, functions, recursion, collections, aliases, shallow copies, input, intentional errors, classes, object attributes, inheritance, composition, and guided integrations.
15. Inspect representative prose manually. Schema validation can catch missing fields, but it cannot catch awkward language or misleading numeric formatting.

### Add or change a graph

1. Reuse the shared Cytoscape loader and palette.
2. Render complete semantic HTML before starting the optional import. The
   graph must enhance essential facts rather than own them.
3. Build stable element ids from stable program concepts.
4. Bound the DSA References graph to 90 combined nodes and edges.
5. Avoid rerunning layout on every selected trace step when selection styling
   is enough. DSA References destroys its graph when automatic playback starts
   and rebuilds once after playback pauses or completes.
6. Use a render generation number when a tab, theme, or trace can change while
   an asynchronous import or layout is still pending.
7. Connect Fit and the 50 to 160 percent zoom range.
8. Check label legibility in both themes and at several zoom levels.
9. Intercept or block the optional library request and prove that the text
   fallback remains complete.
10. Check that switching tabs does not produce shaking or repeated resizing.

### Change a DSA study preview

1. Keep `currentCommentedSource()` as the only plain generated document used by copy and replacement actions.
2. Send that string to `renderDsaStudyPreview()` for presentation. Never read copy content back from the rendered DOM.
3. Build every row with text nodes and bounded syntax spans. Never insert learner-controlled or trace-derived text as trusted HTML.
4. Keep file chrome, CSS line numbers, read-only badges, line counts, and status text outside the generated document.
5. Use the exact `# Code Explorer DSA:` prefix to distinguish generated learning-note rows from original Python.
6. Map Essential, Guided, and Detailed to worker levels 1, 2, and 3. Reject a missing or malformed level instead of letting it bypass the selected boundary.
7. Keep exact reviewed program, objective, and complexity preamble notes at every density, but only while `activeProgram` proves an unchanged catalog match.
8. Present syntax or trace notes, curriculum context, and Python source as three named visual layers. Curriculum context needs a separate class and color treatment in addition to different wording.
9. Keep the DSA dialog on the shared four-row grid: header, toolbar, flexible editor, and actions. A three-row override makes the editor consume footer space and can hide Copy.
10. Test Automatic comments and the Learning comments dialog in light and dark themes.
11. Confirm Essential excludes levels 2 and 3, Guided includes levels 1 and 2, and Detailed includes levels 1 through 3.
12. Confirm both surfaces show the same generated line count and note rows for the same selected density and completed run.
13. Confirm normal Copy returns original Python while Automatic comments are visible.
14. Confirm Copy commented code returns only the generated Python document.
15. Confirm toggling either preview or changing detail does not change local source, trace evidence, source statistics, or playback state.
16. At desktop and 390-pixel mobile width, confirm the summary, preview, Copy, and Replace controls all remain inside the modal in both themes.

### Change the DSA learning-panel navigation

1. Keep Trace, Data, Flow, and Labs as the bounded top-level grouping.
2. Keep every selected area's view labels in one horizontal row.
3. Provide enough desktop width for the complete row before considering internal scrolling.
4. Stack the source and learning panels before either panel becomes too narrow.
5. On a phone, allow horizontal overflow only inside the view-label strip. Never create page-level horizontal overflow.
6. Verify the longest Data row, not only the shorter Trace row.
7. Check tab baselines, panel height, and selected underline before and after changing areas and trace steps.
8. Keep the source and learning panels at the same explicit height. A `min-height` alone does not constrain a CSS grid row when a child has tall intrinsic content.
9. Keep `#dsaViewStage` as the vertical scroll owner with `min-height: 0`, `overflow: auto`, contained overscroll, and a stable scrollbar gutter.
10. Test a short unavailable view and representative long views from Trace, Data, Flow, and Labs at the same viewport. The learning panel height and the top position of playback must remain unchanged while only `dsaViewStage.scrollTop` changes.

### Change a DSA trace-state view

1. Keep Before and After tied to `state.currentStep`. Show its one-based step number, total trace length, executed line number, and exact recorded source before values.
2. Build the card list with `variableComparisons()`, which uses the union of visible names in the previous and current serialized snapshots. Do not reduce the list to changed names because stable unchanged cards preserve a learner's positional context.
3. Keep `variableChanges()` responsible for created, changed, and removed classifications inside that pure helper. Label every remaining union member unchanged.
4. Keep one full-width card per variable at every viewport. Inside each card, order the previous value, a downward direction cue, and the resulting value.
5. Use `serializedLabel()` for both values. Missing earlier or later values must say `not set` rather than becoming an unexplained blank.
6. Keep the Step Table's selected row synchronized through the event's original trace index. Do not derive it from its position inside the bounded 120-row slice.
7. Mark the selected table row with `aria-current="true"` and visible `Current step` text. A border or background may reinforce that state but must not be its only indication.
8. Leave Operation Journey's established current-event treatment independent. Do not duplicate or replace it while changing Before and After or Step Table.
9. Test repeated playback movement, variable creation, variable updates, scope exit, and an instruction with no value change. Confirm the vertical card count and labels follow the selected snapshot.
10. Test light and dark themes at desktop and 390-pixel width. Confirm wrapped values stay inside cards and the table remains usable through its bounded internal overflow.

### Add a saved preference

1. Define a specific storage key and safe default.
2. Validate type and range while loading.
3. Apply the value consistently to the UI and runtime state.
4. Save only after a valid user action.
5. Document what persists, how it affects code, and how a learner can reset it.

## Regression scenarios

Keep these small programs available during manual testing.

### Assignment and output

```python
price = 8
quantity = 3
total = price * quantity
print("Total:", total)
```

### Condition

```python
score = 72
if score >= 60:
    result = "pass"
else:
    result = "try again"
print(result)
```

### Repeated loop line

```python
total = 0
for number in range(1, 4):
    total += number
print(total)
```

### Function frame and return

```python
def double(number):
    result = number * 2
    return result

answer = double(5)
print(answer)
```

### Mutation and alias

```python
numbers = []
alias = numbers
numbers.append(3)
print(alias)
```

### Prepared input

```python
name = input("Name: ")
print("Hello", name)
```

### Runtime error

```python
numbers = [1, 2]
print(numbers[5])
```

### Syntax error

```python
if True
    print("missing colon")
```

### Learning-comment preservation

```python
# This learner comment must remain.
total = 0
for number in range(1, 4):
    total += number
print(total)
```

Verify all three detail levels, inline on and off, unchanged source statistics, normal editor Copy, export copy, cancel, replacement, and a second generation without duplicate `# Code Explorer:` lines.

## Current validation evidence

- The structural curriculum validator found exactly 134 unique programs, 12 exact category totals, 46 Beginner, 56 Developing, 32 Guided Challenge, 12 guided prerequisite lists, and three exact intentional-error declarations.
- All 134 starter sources compiled and executed with their prepared inputs. Only the three explicitly labeled investigation programs raised their exact documented errors.
- The detached validator applies a per-program execution alarm so one mistaken infinite loop cannot stall the complete curriculum audit.
- The current corpus includes 20 programs of at least 15 lines and 12 guided programs ranging from 18 through 31 lines.
- The complete corpus produced 421 learning-comment records during automated validation, with valid line numbers, levels, kinds, and nonempty text.
- Manual prose review caught and corrected awkward `elif` wording and overly noisy floating-point values. This is a permanent reason to combine automated schema checks with human reading.
- Browser testing of an intentional `IndexError` caught and corrected a false repeated-completion count caused by exception and frame-exit events sharing one line.
- A browser run using Pyodide confirmed the default repeated loop produced a 12-step trace, enabled Learning comments, and reported three loop-body entries.
- Browser testing on 2026-07-22 confirmed Automatic comments produced five widgets for the seven-line default program while the footer remained `7 lines · 108 chars`.
- Switching the detail selector while widgets were visible produced 3 Essential, 5 Guided, and 5 Detailed widgets for the default source without changing its statistics or rerunning Python.
- With five widgets visible, the normal editor Copy path was intercepted in browser testing and returned exactly the original 108-character, seven-line program with no `# Code Explorer:` text.
- Starting another trace while widgets were visible immediately removed the old widgets and completed with Automatic comments available but off.
- Selecting another example while inline notes were visible removed all widgets, disabled the control, cleared stale trace data, and preserved the newly selected source.
- The Learning Comments export dialog remained available after the inline mode was added and still showed Guided evidence plus Copy and confirmation-gated replacement actions.
- The IDE-style export preview rendered the default program and the 27-line Object-Oriented Pet Care Tracker in light and dark themes. Its visual gutter, syntax spans, file chrome, and status strip remained outside the copied document.
- At 390 by 844, the longer Detailed preview used bounded internal scrolling, wrapped note prose, kept its actions visible, and produced no page-level or preview-level horizontal overflow.
- An intercepted **Copy commented code** action returned the generated 12-line Python document for the default example, including real `# Code Explorer:` lines and original Python, with no visual gutter numbers or IDE labels.
- The vertical Python workspace examples browser exposed all 13 filter choices, accurate counts, 134 cards, 16 Loop cards, and no horizontal filter overflow.
- Selecting the Classes and Objects checkpoint produced 33 recorded steps, a class-definition learning note, stable `<Pet instance>` labels, and bounded `.name`, `.animal`, `.meals`, and `.exercised` attribute branches.
- Selecting the intentional `IndexError` investigation program displayed its warning before opening it, then produced the expected Error Coach explanation at the failing step.
- Desktop light and dark screenshots confirmed the sidebar and cards remain readable. A 390 by 844 mobile check found and corrected compressed 42-pixel card rows; the final cards retain a 190-pixel minimum, stay inside their boundaries, and create no page-level horizontal overflow.
- Mobile inline comments in light and dark themes retained a 390-pixel page width, a 360-pixel editor width, five wrapped widgets, and the original seven-line source count.
- DSA UI testing on 2026-07-23 confirmed the five Trace tabs and six longer Data tabs share one baseline at 1,493 pixels with no internal or page overflow.
- At 1,280 pixels, the DSA source and learning panels stack to one 1,248-pixel column before either side becomes cramped. The Data tab row still needs no internal scrolling.
- At 390 by 844, the DSA tab labels remain one row with 144 pixels of bounded internal tab-strip overflow and zero page-level overflow.
- The repaired playback bar keeps all four buttons on one baseline. Its timeline measured 1,069 pixels at desktop and 320 pixels on mobile, with the mobile timeline on its own row.
- The DSA Learning comments dialog and Automatic comments surface each rendered 20 safe line rows, 10 visibly separated DSA notes, conservative token colors, read-only chrome, and matching line counts for the reviewed test run.
- Toggling the DSA automatic study surface in light and dark themes left the separately stored original DSA source unchanged.
- The DSA Learning comments dialog now uses the same four-row hierarchy as Python. Its Essential, Guided, and Detailed control, live summary, three-part legend, cyan reviewed-context rows, and both footer actions remained visible in light and dark themes at desktop and 390 by 844.
- The real Copy commented code action produced the success message `Copied the complete commented study program.` from the mobile dark dialog.
- The DSA foundation validator now proves the three note-level boundaries and confirms reviewed context is retained independently of selected Python-note density.
- Python catalog search found one hidden intentional `KeyError` record, displayed its absolute program number 120, and loaded the matching source into the editor.
- DSA catalog search found hidden edge-case metadata for the empty-list division lesson and found `DSA-197` through combined identifier and algorithm terms.
- Selecting Linked structures while the `DSA-197 FIFO` query remained active produced the explicit zero-result state. Clear search retained Linked structures, restored its 20 cards, and focused the search field.
- Both production catalog validators now exercise real-record search behavior, including hidden metadata, source terms, stable identifiers, AND matching, punctuation normalization, and the empty-query contract.
- At 390 by 844, both catalog dialogs retained 322-pixel search fields, bounded one-column cards, and zero page-level or dialog-level horizontal overflow.
- Search queries cleared after page navigation, created no search-related local-storage key, and were absent from request URLs.
- Before and After displayed the exact selected step, line, and source above one full-width vertical card per visible name. Advancing playback added, retained, updated, and removed cards according to the recorded scopes rather than showing only one line's changes.
- Step Table kept exactly one visible `Current step` label and `aria-current` row synchronized with Previous and Next movement. Operation Journey retained its existing selected-operation behavior.
- A 14-row Step Table kept the desktop source and learning panels at 690 pixels. Its stage measured 593 visible pixels against 717 scrollable pixels, and `scrollTop` moved from 0 to 100 without changing panel height.
- At 390 by 844, both primary panels measured 590 pixels, the Step Table stage measured 448 visible pixels against 656 scrollable pixels, and the four-card Before and After view measured 1,156 scrollable pixels. The page width remained exactly 390 pixels.
- The bounded stage is keyboard-focusable, visibly identifies focus, and retains native mouse, trackpad, touch, and keyboard scrolling.
- Chunk 3 browser checks found `DSA-198`, `DSA-228`, and `DSA-246` through local catalog metadata, executed representative tree, heap, and trie programs, and observed their exact result markers.
- Tree, heap, and trie Structure Canvas checks confirmed `role-tree`, `role-heap`, and `role-trie` select compatible observed variables. The trie regression specifically proves the nested `trie` dictionary is selected instead of the simultaneously visible `words` list.
- Editing the exact trie source produced Observed line evidence and the explicit `Named algorithm unavailable` boundary.
- All 18 registered DSA views rendered after a completed Chunk 3 trace without an exception.
- At 390 by 844 in dark mode, the DSA learning panel remained 590 pixels high, the stage scrolled from 0 to 120, and document width remained exactly 390 pixels.
- Data redesign testing on 2026-07-28 rendered all six Data views after a
  reviewed trace and found no ordinary-run console errors or page errors.
- Variables removed the duplicate module-local namespace while retaining a
  separate `f()` local scope during two recorded function steps.
- Reviewed `DSA-132` selected the semantically compatible `stack` list instead
  of the longer `operations` input and displayed BASE and TOP.
- An edited `items` and `alias` program produced one shared References object
  group and one append mutation with two affected names.
- The References graph produced Fit, a 50 to 160 percent zoom slider, labelled
  scope, name, and object nodes, and three Cytoscape canvases. During playback
  it produced zero canvases and an explicit pause message, then rebuilt after
  pause.
- Intercepting the exact Cytoscape request produced the explicit graph
  unavailable state while the complete semantic text map remained readable.
- At 390 by 844 in dark mode, References retained zero page-level horizontal
  overflow and a 448-pixel stage scrolled through 1,562 pixels of content.

## Documentation completion test

Before describing a feature as complete, answer all of these questions:

- Can a first-time learner discover it?
- Does the README explain why and when to use it?
- Is there a small code example or walkthrough when useful?
- Is every beginner-facing technical term defined nearby or connected to a clear glossary entry?
- When similar terms can be confused, does the guide explain the difference with a concrete example or inspection step?
- Does the README state the expected behavior?
- Are limits, persistence, permissions, and failure states documented?
- Does this file identify its state, data, dependencies, risks, and tests?
- Do source comments still describe the real behavior?

If any answer is no, the feature is not fully documented.

## DSA LAB UI visual redesign records

`current state of LAB UI.md` is the dated baseline for the complete 18-view
DSA learning interface. In this context, LAB UI includes Trace, Data, Flow, and
Labs. It does not refer only to the three Labs tabs.

`Improvements in LAB UI.md` is the implementation ledger. Update it after
every redesign chunk with actual source changes, design reasoning, fallback
behavior, browser evidence, remaining work, and any correction. Never mark a
planned view as implemented merely because its renderer already existed before
the redesign.

The redesign is divided into five commit-sized chunks:

1. Shared visual system and five Trace views. Implemented and verified on
   2026-07-28.
2. Six Data views. Implemented and verified on 2026-07-28.
3. Four Flow views. Implemented and verified on 2026-07-28.
4. Three Labs views. Implemented and verified on 2026-07-28.
5. Cross-view accessibility, responsive behavior, fallbacks, documentation,
   and the complete regression audit.

Technical checks must continue to prove stability and conservative evidence.
Visual acceptance must additionally prove that each view has a purpose-specific
layout, a designed empty state, a clear primary focus, and readable behavior in
both themes at desktop and 390-pixel widths.

### Implemented Labs visual system

The three Labs renderers use `createLabsViewShell()` for orientation and
`renderLabsUnavailable()` for honest next-step states. Labs intentionally
differs from playback views because its primary job is to guide an experiment,
not to describe one selected trace line.

```text
Input Playground
    prepare exact queue -> preview exact order -> run -> map observed prompts

Compare Algorithms
    choose reviewed group -> run A -> run B -> inspect bounded evidence

Edge Case Lab
    predict -> change one condition -> run -> inspect recommended evidence
```

`state.activeRunInputs` snapshots the exact prepared-input document at run
start. This matters because the textarea remains editable while asynchronous
Python work is running. A later comparison summary and Input Playground status
must describe the sent queue, not whatever text happens to be visible after
the run.

`state.comparisonRuns` is intentionally session-only. It is never written to
storage, uploaded, or interpreted as learner progress. Filtering it by the
current exact reviewed comparison group prevents unrelated algorithms from
occupying the two visible slots.

Labs regression checks:

1. Confirm an empty prepared document reports zero responses.
2. Confirm a nonempty document preserves blank internal response lines.
3. Run two `input()` calls and compare the numbered queue with the observed
   prompt-to-response map.
4. Change the queue without rerunning and confirm the stale evidence warning.
5. Run two exact reviewed programs from one comparison group and confirm Run A,
   Run B, and the fairness statement.
6. Reload and confirm comparison summaries disappear while prepared input
   remains local.
7. Open a singleton comparison group and confirm a designed unavailable state.
8. Edit exact reviewed source and confirm Edge Case Lab removes its reviewed
   prompts immediately.
9. At 390 pixels in both themes, confirm the stage scrolls internally and the
   page has no horizontal overflow.

### Implemented Data visual system

The six Data renderers use `createDataViewShell()` for orientation and
`renderDataUnavailable()` for purposeful empty states. The shared shell owns
only evidence, question, program, selected step, source line, exact source, and
bounded facts. Each renderer owns its own learning visual.

```text
createDataViewShell()
        |
        +-- evidence and Data view identity
        +-- one beginner question
        +-- program, step, and source line
        +-- escaped executed source
        |
        v
purpose-specific body mount
        |
        +-- Variables scope dashboard
        +-- Watches suggestion dashboard
        +-- Structure Canvas reading guide and cells
        +-- References graph enhancement and text map
        +-- Mutation Explorer object journey
        +-- Invariant Checker reviewed checklist
```

The important evidence boundaries are:

- Module globals and locals are one displayed namespace.
- A separate local scope appears only for a real active function.
- Watch suggestions are not user tracking or proof of control flow.
- Reviewed structure orientation disappears after any source edit.
- Flattened serialized values never justify invented edges.
- Reference object tokens are conceptual and session-local.
- One changed object shared by aliases is one mutation event.
- Invariants receive no automatic verdict without a dedicated verified check.

The References enhancement lazily imports the already pinned Cytoscape 3.31.0
module from `esm.sh`. No learner source, prepared input, trace, object token,
or identifier is attached to that asset request. The complete HTML map is the
accessible fallback and remains present after success.

### Implemented Flow visual system

The four Flow renderers use `createFlowViewShell()` for orientation and
`renderFlowUnavailable()` for purposeful pre-run states.

```text
createFlowViewShell()
        |
        +-- evidence and Flow view identity
        +-- one beginner question
        +-- program and selected boundary
        +-- source line and escaped executed source
        |
        v
purpose-specific body mount
        |
        +-- Operation Journey event spine
        +-- Algorithm Path graph and ordered fallback
        +-- Step Table debugger surface
        +-- Complexity Lab evidence columns
```

`boundedFlowWindow(entries, activeIndex, limit)` is the shared window contract.
It centers around the selected step when possible and guarantees that the
selected step remains inside the displayed subset. It is used with:

- 30 Operation Journey events.
- 80 Algorithm Path recorded steps.
- 120 Step Table rows.

Algorithm Path reuses the pinned Cytoscape 3.31.0 module and theme palette
already approved for References. It owns a separate graph instance and render
identifier. The optional graph groups repeated line transitions, while the
permanent semantic list retains displayed chronological order. Playback
suspends graph construction, and stopping playback rebuilds one graph.

Complexity Lab follows this non-negotiable evidence split:

```text
observed prefix metrics
        !=
reviewed asymptotic complexity
```

Observed metrics may count trace steps, reached lines, and normalized event
cues through `state.currentStep`. They must not be described as elapsed time,
processor work, memory usage, or proof of Big O. Time and space formulas may
come only from `state.activeProgram`, which requires an exact unchanged
catalog-source match.

Flow regression checks must confirm:

1. Operation Journey selection follows playback and later entries are called
   later recorded steps.
2. Algorithm Path retains its ordered transition list before, during, and
   after optional graph failure.
3. Algorithm Path destroys its graph during playback and rebuilds once after
   pause or completion.
4. Step Table contains one and only one visible `aria-current="true"` row.
5. Previous, Next, Play, Restart, and timeline movement update the table row.
6. Edited source retains observed Complexity Lab counts and loses reviewed Big
   O.
7. The 390-pixel layout scrolls inside `dsaViewStage` without page-level
   horizontal overflow.

### Implemented Trace visual system

The five Trace renderers share orientation without sharing one generic content
layout:

```text
createTraceViewShell()
        |
        +-- evidence and view identity
        +-- one beginner question
        +-- program, step, line, and event
        +-- escaped executed source
        |
        v
purpose-specific body mount
        |
        +-- Algorithm Story timeline
        +-- Before and After state comparison
        +-- Decisions route
        +-- Calls and Recursion frame stack
        +-- Error Coach diagnostic
```

`renderTraceUnavailable()` supplies a consistent pre-run structure with a
symbol, honest reason, and three next actions. It replaces unfinished blank
states without inventing evidence.

`storyEvidenceAt(index)` derives the normalized event and name changes from the
selected and previous snapshots. Timeline entries call `selectStep(index)` and
use `aria-current="step"` on only the selected entry.

`resetViewStageScroll()` returns a newly selected or newly populated view to its
orientation header. It must not run during ordinary playback because doing so
would pull a learner away from the long content they are studying.

The Decisions view may label values as visible in scope. It must not call them
operands because the worker does not reliably report the complete operand set
for every Python expression.

The Calls and Recursion view renders recorded frames from global to active. Each
frame includes textual Active or Waiting state and no more than six bounded
locals. Reviewed algorithm context remains separate and requires exact unchanged
catalog source.

Error Coach maps common Python error types to conservative meanings and safe
experiments. It must always keep the guaranteed-repair boundary visible because
the trace does not record the learner's intended program.

Trace CSS is scoped under `.dsa-trace-view`. Shared orientation classes use the
`.dsa-trace-*` prefix, while each teaching grammar has story, state, decision,
call, or error-specific classes. Mobile presentation stacks context and flow
without creating page-level horizontal overflow.

Chunk 1 does not add a dependency, storage key, worker field, network request,
or analytics behavior. It changes presentation and view-local navigation only.
