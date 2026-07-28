# Current state of the DSA LAB UI

Baseline recorded: 2026-07-28 14:32:14 EDT (-0400)

Document status: Living current-state audit, Trace redesign Chunk 1 shipped

Scope: All 18 learning views in the Data Structures and Algorithms workspace

Last documentation audit: 2026-07-28 14:59:56 EDT (-0400)

## Why this document exists

In this project, **LAB UI** means the complete learning interface on the right
side of `data-structures.html`. It includes the Trace, Data, Flow, and Labs
areas. It does not mean only the three views under the Labs tab.

This file records what a learner can see before the redesign begins. It keeps
the project honest by preventing a later visual improvement from being
described as if it had always existed.

The current interface is functionally complete:

- All 18 views are registered.
- All 535 reviewed programs can supply data to the views.
- The learning panel is bounded and independently scrollable.
- Observed evidence and reviewed curriculum context remain separate.
- Edited and pasted programs lose claims that require an exact catalog match.
- Light mode, dark mode, desktop, and narrow layouts work without page-level
  horizontal overflow.

The interface redesign is now partially complete. All five Trace views use the
new beginner-oriented visual system. The remaining thirteen Data, Flow, and
Labs views still largely use the earlier generic treatments and remain future
redesign chunks.

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

Most views are created dynamically by `dsa-app.js`.

```text
selected view ID
      |
      v
renderActiveView()
      |
      v
one view-specific JavaScript function
      |
      v
generic article.dsa-runtime-view
      |
      +-- evidence badge
      +-- heading
      +-- explanatory paragraph
      +-- cards, list, or table
      |
      v
dsaViewStage.replaceChildren(...)
```

This architecture helped establish consistent evidence labels and bounded
rendering. It also encouraged very different concepts to share one visual
grammar.

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

The following findings preserve the original all-view baseline. Chunk 1 resolves
them for the five Trace views only. They remain active review questions for the
thirteen Data, Flow, and Labs views.

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

| View | Current presentation | Current strength | Main presentation gap |
| --- | --- | --- | --- |
| Algorithm Story | Heading, prose, and step facts | Uses selected trace evidence | Does not feel like a chronological story |
| Before and After | Vertical comparison cards | Correct adjacent state and source context | Needs stronger change hierarchy and scanability |
| Decisions | Condition-oriented cards and text | Preserves observed branch evidence | Operands, result, and chosen path do not form one clear visual |
| Calls and Recursion | Frame information in generic cards | Uses real recorded frames | Depth, entry, active frame, and return movement are not immediately visible |
| Error Coach | Error facts and explanatory text | Avoids unsupported diagnosis | Does not yet resemble a focused IDE diagnostic journey |

### Data views

| View | Current presentation | Current strength | Main presentation gap |
| --- | --- | --- | --- |
| Variables | Variable cards | Shows visible scope values | Type, scope, change, and current importance compete for attention |
| Watches | Bounded watched-name rows | Preserves unavailable and changing states | Does not feel like a compact live dashboard |
| Structure Canvas | Role-specific HTML cells and lanes | Supports bounded conceptual structures | Complex pointer and graph relationships remain visually limited |
| References | Conceptual relationship content | Avoids physical RAM claims | Lacks a mature interactive node-and-edge map |
| Mutation Explorer | Mutation history entries | Retains chronological evidence | Before, operation, after, and aliases are not strongly connected |
| Invariant Checker | Reviewed statements and evidence | Keeps reviewed claims separate | Status, evidence, and failure meaning need a clearer checklist design |

### Flow views

| View | Current presentation | Current strength | Main presentation gap |
| --- | --- | --- | --- |
| Operation Journey | Ordered event cards | Normalizes reads, writes, calls, returns, and visits | The active event and overall journey lack a strong visual spine |
| Algorithm Path | Transition-oriented HTML | Uses actual executed transitions | Paths are not laid out as a readable interactive graph |
| Step Table | Scrollable table | Current row follows playback | Needs stronger debugger styling, sticky context, and easier scanning |
| Complexity Lab | Reviewed complexity text and observed facts | Separates Big O from one recorded run | Growth behavior and run measurements are not visualized |

### Labs views

| View | Current presentation | Current strength | Main presentation gap |
| --- | --- | --- | --- |
| Input Playground | One multiline textarea and one Run button | Preserves response order and local-only storage | Inputs are anonymous and disconnected from observed prompts |
| Compare Algorithms | Related buttons and textual run summaries | Restricts comparisons to reviewed compatible groups | Does not provide a genuine side-by-side comparison |
| Edge Case Lab | Reviewed bullet list | Does not invent completion tracking or test results | Suggestions do not feel like guided experiments |

## Why the Python workspace feels more polished

The Python workspace contains permanent semantic markup and dedicated visual
components for many learning experiences. It has purpose-specific empty
states, scenario cards, call-stack frames, comparison grids, loop timelines,
coverage rows, editor-like diagnostics, and carefully styled controls.

The DSA workspace reused the runtime, editor, storage, evidence, and playback
foundations. It did not reuse the same level of view-specific presentation.

```text
Python workspace
    feature -> dedicated markup -> dedicated CSS -> visual iteration

DSA workspace
    view contract -> generic renderer -> generic CSS -> functional output
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
| Visual differentiation | Moderate | Trace views are distinct; thirteen later views still need redesign |
| Beginner scanability | Moderate | Trace orientation is strong; later areas retain denser generic layouts |
| Empty-state quality | Moderate | Trace states provide actions; later areas still need the same treatment |
| Concept visualization | Moderate | Trace history, state, decisions, depth, and errors are visual; Data, Flow, and Labs remain |

## Baseline conclusion

The current DSA LAB UI is technically dependable and now has a complete
beginner-oriented Trace area. It remains visually unfinished as a complete
18-view system because the Data, Flow, and Labs redesign chunks have not
started.

The redesign must preserve the proven runtime and evidence foundation while
giving every view a visual form appropriate to the concept it teaches.
