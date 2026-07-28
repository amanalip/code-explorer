# Current state of the DSA LAB UI

Baseline recorded: 2026-07-28 14:32:14 EDT (-0400)

Document status: Living current-state audit, Trace, Data, Flow, and Labs redesign Chunks 1 through 4 shipped

Scope: All 18 learning views in the Data Structures and Algorithms workspace

Last documentation audit: 2026-07-28 19:04:26 EDT (-0400)

## Why this document exists

In this project, **LAB UI** means the complete learning interface on the right
side of `data-structures.html`. It includes the Trace, Data, Flow, and Labs
areas. It does not mean only the three views under the Labs tab.

This file preserves the original baseline and records what a learner can see
after each shipped redesign chunk. It keeps the project honest by preventing a
later visual improvement from being described as if it had always existed.

The current interface is functionally complete:

- All 18 views are registered.
- All 535 reviewed programs can supply data to the views.
- The learning panel is bounded and independently scrollable.
- Observed evidence and reviewed curriculum context remain separate.
- Edited and pasted programs lose claims that require an exact catalog match.
- Light mode, dark mode, desktop, and narrow layouts work without page-level
  horizontal overflow.

The interface redesign is now functionally complete at the individual-view
level. All five Trace views, all six Data views, all four Flow views, and all
three Labs views use the new beginner-oriented visual system. Chunk 5 remains
for the complete cross-view accessibility, fallback, responsive, and
regression audit.

## Current state after Trace redesign Chunk 1

Recorded: 2026-07-28 14:59:56 EDT (-0400)

Chunk 1 changed presentation and interaction only. It did not change the 535
programs, worker, trace format, numerical limits, persistence, privacy model,
or the other thirteen view renderers.

The five Trace views now share an orientation sequence:

```text
evidence badge and view name
        |
        v
one beginner question
        |
        v
program, step, source line, and event
        |
        v
exact executed source
        |
        v
purpose-specific teaching visual
        |
        v
honest boundary or next action
```

This order is an empathy rule, not decoration. A new programmer should not
need to decode an unfamiliar panel before learning what question it answers.

| Trace view | Current visual form | Beginner benefit | Honesty boundary |
| --- | --- | --- | --- |
| Algorithm Story | Selectable recorded timeline, current observation, and separate reviewed phase map | Connects the selected source line to nearby execution history | A reviewed phase is not assigned to an arbitrary selected line |
| Before and After | Four-count change summary plus one vertical card per visible name | Makes created, changed, removed, and unchanged state scannable | Values are bounded recorded snapshots, not physical memory |
| Decisions | Condition to result to next-line route, plus visible scope values | Makes the taken path readable as one sequence | Visible values are not claimed to all be condition operands |
| Calls and Recursion | Depth summary and ordered Active or Waiting frames with bounded locals | Makes nested calls and changing arguments visible | Named algorithm context requires exact unchanged reviewed source |
| Error Coach | IDE-style diagnostic, meaning, safe experiment, and explicit repair boundary | Turns a failure into a focused investigation | The tool does not promise a guaranteed repair |

Switching views or loading a new result returns the internal learning stage to
its orientation header. Moving playback does not reset that internal scroll
position, so a learner reading a long comparison is not pulled away on every
step.

Real-browser verification covered:

- Algorithm Story playback navigation on an unchanged reviewed program.
- Before and After dynamic full-state cards.
- A true precondition route with the exact next recorded line.
- A five-level recursive countdown with changing local `number` values.
- A real `IndexError` with location, meaning, and a safe experiment.
- Light desktop presentation.
- Dark presentation at a 390 by 844 viewport.
- Internal vertical overflow with no page-level horizontal overflow.
- No browser console errors or page exceptions during a repeated error run.

## Current state after Data redesign Chunk 2

Recorded: 2026-07-28 15:37:06 EDT (-0400)

Chunk 2 changed the presentation and interaction of the six Data views. It did
not change learner program source, the 535-program curriculum, trace semantics,
execution limits, persistence keys, analytics policy, or reviewed-source
matching.

The six Data views now begin with the same learner orientation:

```text
evidence badge and Data view name
        |
        v
one beginner question
        |
        v
program, selected step, and source line
        |
        v
exact executed source
        |
        v
scope, structure, reference, mutation, or invariant visual
        |
        v
honest display boundary or suggested next action
```

| Data view | Current visual form | Beginner benefit | Honesty boundary |
| --- | --- | --- | --- |
| Variables | Scope sections with current value, Python type, change state, and previous value when relevant | Separates module names from active function locals and makes one-step changes visible | Module globals and locals are not duplicated as two scopes |
| Watches | Ranked local suggestions with reason, value, and change state | Gives a compact starting point when many names exist | Suggestions are not saved choices, progress tracking, or proof that a name controls the algorithm |
| Structure Canvas | Selected observed container, reviewed orientation guide, and bounded role-specific cells | Gives stacks, queues, deques, linked structures, hashes, sets, trees, heaps, tries, Union-Find, and graphs a readable entry point | Reviewed labels require exact unchanged source and flattened text is never converted into invented edges |
| References | Optional Cytoscape map plus a complete semantic text map | Makes shared object identity visible without requiring graph interaction | Worker object tokens are temporary conceptual evidence, not physical RAM addresses |
| Mutation Explorer | One event per changed conceptual object with Before, Executed, After, and affected alias names | Distinguishes in-place change from name reassignment | Two aliases of one mutated list are grouped as one object event rather than counted twice |
| Invariant Checker | Reviewed checklist with the selected observed line beside each curriculum rule | Teaches learners what rule to question while replaying an algorithm | Every automatic satisfied or violated verdict remains Unavailable without a dedicated verified check |

### References graph lifecycle

References is the only Chunk 2 view with an optional graph enhancement.
Semantic HTML is rendered first and remains below the graph at all times.
Cytoscape 3.31.0 is loaded lazily only after References has useful object
evidence.

```text
References opens
      |
      +-- complete text map appears immediately
      |
      v
optional Cytoscape request
      |
      +-- succeeds -> Fit, pan, zoom, selection, labelled graph
      |
      +-- fails -> explicit unavailable message, text map remains complete

automatic playback starts
      |
      +-- destroy the graph once
      +-- update the text map with each selected step
      |
      v
playback pauses or finishes
      |
      +-- build one graph for the final selected step
```

This lifecycle prevents a heavy graph from being destroyed and rebuilt on
every playback tick. It directly addresses the earlier shaking interface
problem.

### Corrections discovered during browser testing

Two issues were found and corrected before Chunk 2 was documented as shipped.

1. Python reports module-level globals and locals as the same namespace. The
   first Data implementation displayed that one namespace twice. The corrected
   scope builder omits the duplicate module-local group while retaining a real
   named function scope.
2. Worker comparisons report a changed shared list once for each visible alias.
   The first Mutation Explorer implementation therefore showed two mutations
   for one list. The corrected renderer groups equal object-token changes into
   one event and lists both affected names.

These corrections matter because a visually attractive but conceptually
duplicated diagram would teach the wrong mental model.

Real-browser verification covered:

- All six Data tabs after an unchanged reviewed trace.
- Variables at the beginning and end of a run, plus a real `f()` local scope.
- A reviewed list-backed stack selecting `stack`, not the unrelated larger
  `operations` list, and showing BASE and TOP.
- Edited source retaining generic observed Structure Canvas cells.
- One shared list referenced by `items` and `alias`.
- One in-place append rendered as one object mutation with two affected names.
- A References graph with Fit, zoom, pan, selection-ready nodes, labels, and
  the complete text fallback.
- Deliberately blocked Cytoscape loading with the text map still usable.
- Graph suspension during playback and one rebuild after pause.
- Dark mode at 390 by 844 pixels with no page-level horizontal overflow.
- A 448-pixel visible stage with 1,562 pixels of internally scrollable
  References content.
- All six Data views without browser console errors during an ordinary run.

## Current state after Flow redesign Chunk 3

Recorded: 2026-07-28 16:25:20 EDT (-0400)

Chunk 3 changed the presentation and interaction of the four Flow views. It did
not change learner source, curriculum records, worker messages, execution
limits, persistence keys, or the rule that edited source loses reviewed
curriculum claims.

All four Flow views now begin with one orientation sequence:

```text
evidence badge and Flow view name
        |
        v
one beginner question
        |
        v
program and selected playback boundary
        |
        v
source line and exact executed source
        |
        v
operation, path, table, or complexity visual
        |
        v
honest bound, evidence distinction, or fallback
```

The selected playback position is described as a **boundary** because Flow
views explain movement across recorded steps. A learner sees what happened at
that boundary before scanning a larger chronology.

| Flow view | Current visual form | Beginner benefit | Honesty boundary |
| --- | --- | --- | --- |
| Operation Journey | Selected-operation explanation and a keyboard-focusable vertical event spine | Keeps earlier, selected, and later recorded operations in one readable sequence | Shows at most 30 operations around the selected step and never calls later recorded steps unexecuted |
| Algorithm Path | Selected transition, optional interactive Cytoscape graph, complete ordered transition list, and line-visit counts | Connects an executed source line to the line that preceded it and exposes repeated routes | The graph groups repeated transitions for readability while the text list preserves displayed chronological order |
| Step Table | Debugger-style table with sticky headings, executed source, and one visible Current step row | Lets playback control one row without losing line, event, changed names, or source context | Shows at most 120 rows around the selected step while playback retains the full trace |
| Complexity Lab | Observed metrics and event bars beside separate reviewed time and space cards | Distinguishes what one run counted from how reviewed work grows with input size | One run is not wall-clock benchmarking and cannot prove Big O; edited source loses reviewed formulas |

### Algorithm Path graph lifecycle

Algorithm Path reuses the same pinned Cytoscape 3.31.0 asset already approved
for References. No second graph or plot library was added.

```text
Algorithm Path opens
      |
      +-- selected transition and complete ordered list appear
      |
      v
optional Cytoscape enhancement
      |
      +-- succeeds -> Fit, pan, zoom, selected line and transition
      |
      +-- fails -> explicit unavailable message, ordered list remains

automatic playback starts
      |
      +-- remove the graph once
      +-- keep the selected transition and list updating
      |
      v
playback pauses or finishes
      |
      +-- rebuild one graph for the selected boundary
```

The graph groups equal line-to-line transitions and labels their visit count.
The semantic ordered list is not replaced by that grouped picture. This
prevents a loop edge labelled `4x` from hiding the fact that the transition
occurred at four distinct recorded positions.

### Complexity evidence model

Complexity Lab now has two visibly separate evidence columns:

```text
OBSERVED PLAYBACK PREFIX              REVIEWED CURRICULUM CONTEXT
recorded step count                   reviewed time Big O
reached source-line count             reviewed space Big O
normalized event-cue bars             reviewed explanation

one local run                         exact unchanged catalog program
```

The event bars compare normalized event counts only inside the selected
playback prefix. They do not measure elapsed time, processor work, or memory
usage. The reviewed formulas do not come from those bars. Any edit changes the
right column to an explicit Unavailable state while the observed left column
continues working.

Real-browser verification covered:

- All four Flow tabs after an unchanged reviewed trace.
- Operation Journey selection at the start and later points in a repeated
  loop.
- Algorithm Path success with Fit, 50 to 160 percent zoom, pan, selection,
  grouped repeated edges, and the complete ordered transition list.
- Algorithm Path graph suspension during playback and safe reconstruction
  after playback.
- A deliberately blocked Cytoscape request that left the ordered transition
  list complete with an explicit graph-unavailable message.
- Step Table moving exactly one `aria-current="true"` row after Previous.
- Complexity counts changing with the playback prefix.
- Reviewed time and space formulas disappearing after one harmless source
  edit while observed counts remained.
- Dark mode at 390 by 844 pixels with no page-level horizontal overflow.
- A 448-pixel learning stage scrolling through 1,856 to 2,353 pixels of Flow
  content depending on the selected view.

## Current state after Labs redesign Chunk 4

Recorded: 2026-07-28 19:04:26 EDT (-0400)

Chunk 4 changed the presentation and local experiment state of the three Labs
views. It did not change learner source, the worker trace schema, the
3,000-step or 30-second execution limits, curriculum records, network
behavior, or the rule that edited source loses reviewed curriculum context.

Labs now follows a different orientation from playback views:

```text
evidence badge and Labs view name
        |
        v
one experiment question
        |
        v
program and experiment facts
        |
        v
prepare, compare, or predict workflow
        |
        v
observed result or honest unavailable state
        |
        v
local lifetime and interpretation boundary
```

| Labs view | Current visual form | Beginner benefit | Honesty boundary |
| --- | --- | --- | --- |
| Input Playground | Prepare form, numbered queue, run-queue status, and observed prompt map | Makes response order visible before running and connects only recorded prompts afterward | Empty means zero responses, preview stops at 30 rows, document stops at 20,000 characters, and edited queue text cannot relabel an older run |
| Compare Algorithms | Compatible reviewed route cards and two side-by-side session slots | Makes two local runs scannable without asking the learner to remember the first result | Exact reviewed groups only, two summaries, 800 output characters, no timing or universal speed claim |
| Edge Case Lab | Four-step experiment method and numbered reviewed prediction cards | Turns a boundary into one controlled learning action | No automatic verdict, no attempt or completion tracking, and no reviewed cards after source editing |

### Input evidence lifecycle

The exact prepared document is copied into `state.activeRunInputs` before the
asynchronous worker starts:

```text
visible prepared document
        |
        +-- Run clicked -> immutable run snapshot -> local worker
        |
        +-- learner edits visible queue during run
                 |
                 +-- visible warning: latest run used older text
```

This distinction prevents a changed queue from making old prompt evidence look
current. Intentional blank lines inside a nonempty queue retain their position,
while a completely empty document produces no prepared responses.

### Comparison evidence lifecycle

Compare Algorithms filters session summaries by the current exact reviewed
comparison group. Loading a compatible program invalidates the old trace but
does not erase an earlier compatible summary. Running the second program fills
the second slot.

```text
reviewed program A -> local run summary A
reviewed program B -> local run summary B
                           |
                           v
prepared-text fairness check
                           |
                           v
trace-step difference with explicit not-timing warning
```

Reloading clears these summaries. They are not saved, uploaded, or treated as
evidence that a learner attempted or completed a lesson.

### Labs browser evidence

Real-browser verification covered:

- Two prepared responses mapping to two recorded `input()` prompts.
- A queue edit after running producing a stale evidence warning.
- Empty prepared text reporting zero responses after reload.
- Two exact substring-search programs filling Run A and Run B with 217 and 99
  recorded steps while the interface refused to call the difference timing.
- A singleton reviewed comparison group producing a designed unavailable
  state.
- Reload clearing the two comparison slots.
- Exact reviewed KMP source receiving one reviewed edge-case prediction.
- One harmless source comment immediately removing that reviewed prediction.
- Dark mode at 390 by 844 pixels with no page-level horizontal overflow.
- A 448-pixel stage scrolling through 1,598 pixels of Input Playground content.
- All 535 DSA programs passing structural, compile, execution, and expected
  result validation after the interface change.
- All 134 Python-language programs passing their independent regression suite,
  including the three documented intentional errors.

## Current interface map

```text
DSA LEARNING PANEL
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
    +-- Input Playground
    +-- Compare Algorithms
    +-- Edge Case Lab
```

## Current rendering architecture

All views are created dynamically by `dsa-app.js`. Trace, Data, Flow, and Labs
use separate teaching shells appropriate to their different learning jobs.

```text
selected view ID
      |
      v
renderActiveView()
      |
      +-- Trace -> createTraceViewShell()
      |                +-- purpose-specific Trace body
      |
      +-- Data  -> createDataViewShell()
      |                +-- purpose-specific Data body
      |                +-- optional graph enhancement
      |                +-- complete HTML fallback
      |
      +-- Flow  -> createFlowViewShell()
      |                +-- purpose-specific Flow body
      |                +-- optional path graph enhancement
      |                +-- complete ordered HTML fallback
      |
      +-- Labs  -> createLabsViewShell()
                       +-- purpose-specific experiment body
                       +-- exact local state and lifetime boundary
      |
      v
bounded dsaViewStage.replaceChildren(...)
```

This architecture keeps orientation consistent without forcing unrelated
concepts into one visual grammar.

## Current source ownership

The current UI is spread across a small number of files. A beginner reading
the repository should understand the responsibility of each one before
changing a view.

| File | Current responsibility | Why it matters to the redesign |
| --- | --- | --- |
| `data-structures.html` | Stable learning-panel mount points, navigation containers, playback, editor, dialogs, and output | New permanent regions or accessibility relationships begin here |
| `dsa-app.js` | Workspace state, view selection, all 18 renderers, playback synchronization, catalog context, and worker results | Most view-specific markup is currently created here |
| `dsa-runtime.js` | Pure evidence helpers, value comparisons, event cues, structure selection, and DSA comments | Visual code must not replace or weaken evidence classification |
| `dsa-contracts.js` | Approved area, view, event, structure, metadata, and evidence names | The redesign must retain the same 18 registered view IDs |
| `styles.css` | Shared themes, fixed learning-stage geometry, current generic DSA cards, tables, lanes, and responsive behavior | New visual components must not create layout movement or page overflow |
| `py-worker.js` | Local Python execution, tracing, serialization, input handling, and safety limits | The presentation redesign should not require a worker rewrite |

## Current state and lifetime model

Not every value displayed by a view has the same lifetime. Confusing these
lifetimes could accidentally turn a session-only learning aid into false
progress tracking.

| State | Lifetime | Used by the LAB UI | Current boundary |
| --- | --- | --- | --- |
| `state.code` | Saved locally across reloads | Establishes visible source and exact reviewed matching | Never uploaded by application code |
| `state.activeView` | Saved locally across reloads | Restores one of the 18 approved view IDs | Must be validated against `DSA_VIEWS` |
| `state.preparedInputs` | Saved locally across reloads | Supplies Input Playground values | Limited to 20,000 characters when loaded |
| `state.trace` | Current page session | Supplies observed steps, values, frames, events, and output | Cleared when source changes |
| `state.currentStep` | Current trace session | Selects the evidence shown during playback | Clamped to the recorded trace |
| `state.activeProgram` | Current exact-source relationship | Supplies reviewed algorithm metadata | Becomes unavailable after any source edit |
| `state.inputLog` | Current completed run | Shows prompts and consumed responses | Not a persistent history |
| `state.comparisonRuns` | Current page session | Supplies up to two compatible run summaries | Not completion tracking |
| `state.error` | Current completed run | Supplies Error Coach evidence | Cleared with stale trace evidence |

## Current rendering lifecycle

```text
learner chooses a view
        |
        v
selectView(viewId)
        |
        +-- validate the ID
        +-- save the active ID locally
        +-- rerender area navigation
        +-- rerender view tabs
        |
        v
renderActiveView()
        |
        +-- read selected step
        +-- read exact reviewed context when available
        +-- build safe DOM nodes
        |
        v
replace the bounded view stage

playback changes currentStep
        |
        +-- update controls
        +-- rerender active view
        +-- rerender console
```

This complete replacement model is simple and safe. It also means a future
graph or plot renderer must destroy, reuse, or detach its previous instance
before the stage is replaced.

## Current display limits

These limits are part of the learner-safety contract, not arbitrary visual
choices.

| Surface | Current limit | Reason |
| --- | ---: | --- |
| Serialized trace | 3,000 recorded steps | Prevent unbounded trace storage and rendering |
| Complete execution | 30 seconds | Stop browser work that does not complete promptly |
| Structure Canvas | 30 displayed cells or entries | Keep structures readable and bounded |
| References graph | 90 nodes and edges | Bound optional layout and rendering work while retaining the complete text map |
| Operation Journey | 30 displayed events | Prevent an event timeline from overwhelming the view |
| Algorithm Path | 80 displayed transitions | Bound path layout and interaction cost |
| Step Table | 120 displayed rows | Keep the debugger table usable |
| Compare Algorithms | 2 same-session summaries | Preserve direct comparison without creating a run archive |
| Watches | 12 visible names | Keep the dashboard scan-friendly |

The redesign may explain these limits better. It must not silently remove or
raise them.

## What currently works well

### Evidence remains conservative

The UI distinguishes:

- **Observed**, meaning the fact came from the recorded local trace.
- **Curriculum context**, meaning the claim belongs to an exact unchanged
  reviewed program.
- **Unavailable**, meaning the application does not have enough trustworthy
  evidence.

This boundary must survive the redesign.

### The learning stage is bounded

Long tables and histories scroll inside the learning panel instead of making
the complete page grow. This prevents playback controls and neighboring
content from moving while a learner changes views.

### Learner-controlled text is inserted safely

Source, values, errors, prompts, and metadata are rendered as text. They are
not trusted as HTML.

### Several views already contain useful information

- Before and After shows the selected step, source line, and adjacent values.
- Step Table identifies the current trace row.
- Operation Journey follows normalized events.
- Calls and Recursion reads recorded frames.
- Structure Canvas selects a compatible visible value conservatively.

The problem is mainly how this information is presented and connected.

## Shared current-state problems

The following findings preserve the original all-view baseline. Chunks 1
through 3 resolve them for the five Trace, six Data, and four Flow views. They
remain active review questions for the three Labs views.

### One visual treatment is reused too broadly

A variable dashboard, recursive call stack, graph path, algorithm comparison,
and edge-case investigation should not look like variations of the same
article.

### Empty space has no teaching purpose

The panel has a deliberate fixed height, but several views place a small
amount of content at the top of a large surface. The remaining area looks
unfinished instead of acting as a meaningful empty state.

### Important context is easy to miss

Program name, selected step, line number, source statement, evidence type, and
view purpose are not presented through one consistent orientation strip.

### Text explains ideas that should also be visible

The current interface often describes a change, path, relationship, or
comparison in prose when position, direction, grouping, or scale would make it
easier to understand.

### Technical validation does not measure visual teaching quality

Existing checks prove that the views render, remain bounded, and preserve
evidence rules. They do not prove that a beginner can understand the primary
idea within a few seconds.

### The stage centers content even when a view needs a workspace layout

The current stage was designed to center unavailable previews and small
results. Runtime views later expanded to fill it. This mixed responsibility
contributes to large empty areas and inconsistent alignment between views.

### Renderer cleanup is not yet a visualization concern

The current views mainly create ordinary DOM nodes, so replacing the stage is
enough to release them. Interactive graph or plot libraries will introduce
instances, event listeners, resize behavior, and lifecycle cleanup that the
current architecture does not yet manage.

### Visual meaning is not specified as a contract

The repository defines data and evidence contracts, but it does not yet define
the main visual question, focal element, empty state, active state, and
fallback state for every view. This allowed implementation completeness to be
measured without teaching clarity.

## View-by-view current state

### Trace views

| View | Current presentation | Current strength | Current boundary |
| --- | --- | --- | --- |
| Algorithm Story | Selected-step explanation, bounded timeline, and separate phase map | Makes chronology selectable while protecting exact source evidence | A reviewed phase is never assigned to one selected line without dedicated evidence |
| Before and After | Full-width vertical variable cards with Before above After | Makes adjacent state appear, disappear, remain, or change with playback | Shows only recorded serialized scope evidence |
| Decisions | One condition-to-result-to-next-line route | Keeps the actual observed branch together | Visible scope values are context, not proven operands |
| Calls and Recursion | Depth rail with Active and Waiting frames | Makes changing call depth and bounded locals visible | Edited source retains frames but loses reviewed journey context |
| Error Coach | IDE-style location, meaning, and next-experiment journey | Explains the recorded error without inventing a repair | A guaranteed fix is explicitly unavailable |

### Data views

| View | Current presentation | Current strength | Remaining boundary |
| --- | --- | --- | --- |
| Variables | Scope-aware value dashboard | Shows current, previous, type, scope, and change state | Worker serialization remains bounded and conceptual |
| Watches | Bounded suggestion dashboard | Shows up to 12 useful local names with reasons | Suggestions are not saved watches or learner tracking |
| Structure Canvas | Reviewed orientation plus observed cells | Supports all approved structure families without inventing edges | Complex relationships remain conservative when structured edge evidence is absent |
| References | Optional interactive graph plus complete text map | Makes shared conceptual identity visible without physical RAM claims | Graph is bounded to 90 elements and text remains the accessible source of truth |
| Mutation Explorer | Object-level Before to Executed to After journeys | Groups aliases of one mutated object correctly | Object tokens are temporary evidence for one trace |
| Invariant Checker | Reviewed question checklist | Keeps reviewed rules beside observed source | Automatic satisfied or violated verdicts remain unavailable |

### Flow views

| View | Current presentation | Current strength | Remaining boundary |
| --- | --- | --- | --- |
| Operation Journey | Selected-operation summary and vertical event spine | Normalizes reads, writes, calls, returns, and visits while following playback | Bounded to 30 displayed operations around the selected step |
| Algorithm Path | Optional interactive graph plus complete ordered transitions | Makes repeated routes and the selected transition visible | Grouped graph edges supplement rather than replace chronological text evidence |
| Step Table | Debugger table with sticky header, source, and one current row | Current row follows every playback control | Bounded to 120 rows around the selected position |
| Complexity Lab | Observed metric bars beside reviewed formulas | Separates playback-prefix counts from exact-source Big O | Does not benchmark time or infer Big O from one run |

### Labs views

| View | Current presentation | Current strength | Current boundary |
| --- | --- | --- | --- |
| Input Playground | Prepare, numbered Order, and observed prompt mapping | Preserves exact response order and warns when visible input is newer than run evidence | Document stops at 20,000 characters and preview stops at 30 rows |
| Compare Algorithms | Reviewed route cards, Run A and Run B, bounded metrics, output, and fairness check | Keeps only compatible exact-source results and refuses timing claims | Two session summaries, 800 output characters per summary, no benchmark claim |
| Edge Case Lab | Predict, Change, Run, Inspect method with numbered experiment cards | Makes reviewed boundaries actionable without collecting progress | Reviewed cards disappear after source editing and no automatic verdict is produced |

## Why the Python workspace feels more polished

The Python workspace contains permanent semantic markup and dedicated visual
components for many learning experiences. It has purpose-specific empty
states, scenario cards, call-stack frames, comparison grids, loop timelines,
coverage rows, editor-like diagnostics, and carefully styled controls.

The DSA workspace originally reused the runtime, editor, storage, evidence,
and playback foundations without the same level of view-specific
presentation. Chunks 1 through 4 corrected that gap.

```text
Python workspace
    feature -> dedicated markup -> dedicated CSS -> visual iteration

DSA workspace before the redesign
    view contract -> generic renderer -> generic CSS -> functional output

DSA workspace after Chunks 1 through 4
    view question -> evidence model -> purpose-specific visual -> bounded state
```

## How this state developed

The DSA work prioritized:

1. A correct 535-program curriculum.
2. Reliable compile and execution behavior.
3. Honest evidence boundaries.
4. Browser-safe limits.
5. All 18 views rendering without exceptions.
6. Visual refinement after the curriculum chunks.

That sequence protected correctness. It also allowed temporary presentation
patterns to become the shared interface for all views.

The mistake was treating visual refinement as decoration. For a teaching tool,
the way a relationship or transition is shown is part of the explanation.

## Baseline acceptance evidence

Before redesign work begins, the baseline is:

- 535 reviewed DSA programs pass detached compilation, execution, and
  expected-result validation.
- All 18 view renderers are registered.
- The DSA learning stage remains bounded on desktop and narrow screens.
- Current evidence labels remain honest for reviewed, edited, and pasted code.
- The application has no learner analytics or remote learner-data collection.

These facts are regression boundaries. A more attractive interface is not an
improvement if it weakens any of them.

## Current accessibility baseline

The existing interface already provides several protections:

- Area buttons and view tabs expose selected state.
- The active view labels the focusable learning stage.
- The stage accepts native keyboard scrolling.
- Important evidence types use visible words, not color alone.
- Long content remains inside a bounded region.
- Narrow screens keep view tabs inside a dedicated horizontal strip instead
  of widening the full page.

The current baseline still needs a view-by-view visual reading-order audit.
When richer diagrams are introduced, keyboard focus, text alternatives,
legends, and nonvisual summaries must be designed with them.

## Current privacy and network baseline

The LAB UI does not send learner source, trace values, prepared inputs,
comparison summaries, viewed tabs, or interactions to an analytics or remote
logging service.

Current local destinations are:

```text
source and documented preferences -> same-origin browser storage
source and prepared inputs         -> local Web Worker
trace and comparison summaries     -> current page memory
```

Any optional graph or plot dependency added during the redesign must be
audited before use. Loading a library from a pinned asset host must never add
learner data to a request.

## Current quality assessment

| Dimension | Baseline assessment | Explanation |
| --- | --- | --- |
| Runtime reliability | Strong | Complete curriculum and worker checks pass |
| Evidence honesty | Strong | Reviewed and observed claims remain separated |
| Browser stability | Strong | Bounded views and numerical limits are established |
| Accessibility foundation | Moderate | Navigation and scrolling work, but richer visuals need explicit alternatives |
| Visual differentiation | Strong pending final audit | All eighteen views now use purpose-specific teaching layouts |
| Beginner scanability | Strong pending final audit | Every view begins with an evidence-aware question and a concept-specific reading path |
| Empty-state quality | Strong pending final audit | Missing trace, curriculum, comparison, and optional graph states explain why and offer a safe next step |
| Concept visualization | Strong with bounded limits | History, state, relationships, transitions, debugger rows, complexity evidence, input order, comparisons, and experiments are visible |

## Baseline conclusion

The current DSA LAB UI is technically dependable and now has complete
beginner-oriented Trace, Data, Flow, and Labs areas. Every individual view has
its intended teaching form. The redesign is not declared fully complete until
Chunk 5 finishes the cross-view accessibility, fallback, responsive, and
complete curriculum regression audit.

The redesign must preserve the proven runtime and evidence foundation while
giving every view a visual form appropriate to the concept it teaches.
