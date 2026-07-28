# Improvements in the DSA LAB UI

Ledger created: 2026-07-28 14:32:14 EDT (-0400)

Document status: Living implementation ledger, Trace redesign Chunk 1 verified

Scope: Visual and interaction redesign of all 18 DSA learning views

Companion baseline: `current state of LAB UI.md`

Last implementation audit: 2026-07-28 14:59:56 EDT (-0400)

## How to read this document

This is a living technical improvement record.

Before development, it describes the approved intent and the reason for each
change. After every implementation chunk, it must record:

- What actually changed.
- Why that solution was selected.
- How the implementation works.
- What remained unchanged.
- What tests passed.
- What is still pending.
- Any correction or failed assumption discovered during the work.

Planned work must remain labelled **Planned**. A feature becomes
**Implemented and verified** only after source checks and real-browser checks
pass.

## Improvement objective

The goal is not to make eighteen generic panels more decorative. The goal is
to make each view visually teach its own idea.

```text
current state
generic article + explanation + cards
        |
        v
target state
view-specific question + view-specific visual + trustworthy evidence
```

A beginner should be able to answer these questions quickly:

1. What am I looking at?
2. Which program and execution step does it describe?
3. What changed or matters most?
4. Is this observed evidence, reviewed context, or unavailable?
5. What should I inspect or try next?

## Beginner empathy is an implementation requirement

Aman added a decisive design instruction before Chunk 1 was closed: inspect
the interface as if seeing programming for the first time. Empathy is not a
late copy-editing pass. It changes information order, labels, empty states,
error guidance, responsive behavior, and verification.

Every redesigned view must therefore pass this beginner check:

```text
Can I name the question this view answers?
        |
        +-- No -> the heading and introduction need work
        |
        +-- Yes
              |
              v
Can I find the current program, step, line, and source?
        |
        +-- No -> orientation must come before details
        |
        +-- Yes
              |
              v
Can I tell observed fact from reviewed guidance?
        |
        +-- No -> evidence labels or boundaries are incomplete
        |
        +-- Yes
              |
              v
Do I know what to inspect or try next?
        |
        +-- No -> add a safe next action
        |
        +-- Yes -> the view is ready for visual verification
```

The practical rule is simple: do not make a beginner decode the interface
before they can study the program.

## Non-negotiable boundaries

The redesign must not change:

- The 535 reviewed programs.
- Program source or expected-result markers.
- The Python worker or trace limits unless a separate approved task changes
  them.
- The 3,000-step maximum trace.
- The 30-second execution timeout.
- Exact-source matching for reviewed DSA context.
- Conservative behavior for edited and pasted code.
- Local-only source, input, and preference persistence.
- The no-analytics and no-learner-data-collection rule.
- Automatic Learning Comments behavior.
- The source editor contract.

## Shared visual system

Status: Partially implemented and verified for the five Trace views

The five Trace views now use the shared orientation and unavailable-state
components while retaining their own layouts. Data, Flow, and Labs adoption
remains planned.

### Program and step context strip

Where relevant, the top of a view will identify:

- Selected program.
- Selected trace step.
- Executed source line.
- Evidence type.
- The main question answered by the view.

### Evidence presentation

Evidence will use text and structure in addition to color:

```text
[OBSERVED]
Fact recorded during this local execution.

[CURRICULUM CONTEXT]
Reviewed explanation for an exact unchanged catalog program.

[UNAVAILABLE]
Code Explorer does not have enough trustworthy evidence.
```

### Shared component vocabulary

- Context strips
- Metric cards
- State-change rows
- Timelines
- Frame stacks
- Decision paths
- Structure cells
- Node-and-edge canvases
- Diagnostic blocks
- Comparison lanes
- Experiment cards
- Designed empty states
- Honesty notes
- Legends

### Interaction requirements

- The selected view must remain keyboard accessible.
- Focus must remain visible in both themes.
- Playback must update the selected visual without moving the panel.
- Long content must scroll inside the bounded stage.
- Reduced-motion preferences must disable nonessential movement.
- Visual state must never depend on color alone.
- Optional visualization failures must leave a readable HTML fallback.

## Proposed presentation architecture

Status: Partially implemented for Trace, planned for later areas

The redesign should separate evidence preparation from visual rendering.

```text
trace and reviewed metadata
        |
        v
view model builder
        |
        +-- plain bounded data
        +-- explicit evidence labels
        +-- explicit unavailable reasons
        |
        v
view-specific renderer
        |
        +-- semantic HTML
        +-- optional graph or plot enhancement
        |
        v
accessible learning stage
```

A **view model** is a plain JavaScript object prepared for one visual. It
should contain only the values that the renderer is permitted to show. This
keeps evidence decisions out of graph styling and makes fallback rendering
possible.

Example:

```javascript
{
  evidence: "observed",
  stepNumber: 8,
  lineNumber: 12,
  source: "middle = (low + high) // 2",
  changes: [
    { name: "middle", before: "3", after: "5", kind: "updated" }
  ]
}
```

The object above is an explanatory shape, not the final implementation. Actual
source must retain the project's detailed comments, limits, and escaping
rules.

## Proposed component ownership

Status: Trace component families implemented, later families planned

| Component family | Responsibility | Must not do |
| --- | --- | --- |
| View context | Program, view purpose, step, line, source, and evidence orientation | Infer a named algorithm |
| State cards | Variables, values, types, scopes, and changes | Bypass serialization limits |
| Timeline | Ordered events, mutations, calls, or story entries | Claim an event was executed when it was not recorded |
| Structure renderer | Present one approved conceptual structure | Show physical-looking memory addresses |
| Graph adapter | Convert approved nodes and edges into an optional interactive graph | Decide evidence truth from visual styling |
| Plot adapter | Convert bounded numeric comparisons into an optional plot | Turn one run into a universal performance conclusion |
| Empty state | Explain missing evidence and the next safe action | Display a blank or misleading success state |
| HTML fallback | Preserve all essential facts without the optional library | Hide exact values available in the enhanced view |

## View state contract

Every redesigned view must explicitly handle these states:

| State | Meaning | Required presentation |
| --- | --- | --- |
| Before run | No useful local trace exists | Designed explanation of what the view will answer and how to begin |
| Observed | Recorded trace evidence exists | Visible Observed label and selected-step context |
| Reviewed | Exact unchanged catalog source supplies curriculum metadata | Separate Curriculum context label |
| Edited | Source differs from its selected catalog record | Observed evidence remains, reviewed claims disappear |
| Pasted | Source has no reviewed origin | Generic observed presentation only |
| Error | Python returned syntax or runtime error evidence | Preserve inspectable evidence and safe guidance |
| Shortened | A display limit hid later items | State the exact display limit and that more evidence existed |
| Optional library unavailable | Graph or plot enhancement failed to load | Render the complete semantic HTML fallback |

## Planned view improvements

### TRACE

#### Algorithm Story

Status: Implemented and verified in Chunk 1

Change:

- Replaced a primarily textual summary with a selectable chronological story
  lane.
- Emphasize the active operation, source line, affected values, and position
  within the recorded journey.

Why:

A story should show sequence. A paragraph forces the learner to reconstruct
that sequence mentally.

How:

- Builds up to five nearby story entries from existing trace steps.
- Mark the active entry with text, shape, and focus state.
- Labels later entries as later recorded steps, not predicted execution.
- Keep source and serialized values escaped and bounded.
- Keeps the exact reviewed program phase map visibly separate and explicitly
  refuses to assign a named phase to an arbitrary selected line.

#### Before and After

Status: Implemented and verified in Chunk 1

Change:

- Strengthen the existing vertical variable comparison.
- Make creation, removal, mutation, and unchanged state visually distinct.

Why:

The underlying evidence is useful, but the learner needs a faster way to find
the meaningful difference.

How:

- Retain one full-width card per visible name.
- Keep Before above After.
- Add an explicit change classification and directional connector.
- Wrap long serialized values inside the card.
- Add a four-part summary for created, changed, removed, and unchanged names.

#### Decisions

Status: Implemented and verified in Chunk 1

Change:

- Present a condition as an evidence-backed decision path.

Why:

A beginner should see the condition, observed result, and next recorded line
as one connected idea.

How:

- Use a condition block, textual Boolean result, and next-line destination.
- Show bounded values visible in scope, while clearly stating that they are not
  proven to be the condition's operands.
- Never invent an unexecuted branch.

Correction discovered during implementation:

The initial plan said **observed operands**. The current worker reliably records
scope snapshots and source lines, but it does not identify the complete operand
set of every arbitrary Python expression. Renaming the section to **Visible
values at the check** preserves useful orientation without upgrading scope
evidence into expression evidence.

#### Calls and Recursion

Status: Implemented and verified in Chunk 1

Change:

- Present recorded frames as a changing call stack with visible depth.

Why:

Recursion is difficult when frame nesting and return movement are reduced to
ordinary cards.

How:

- Stack frames by recorded depth.
- Distinguish entry, active execution, suspended caller, and return.
- Show bounded arguments, locals, and return values.
- Use recorded frame evidence for pasted code without inventing an algorithm
  phase.
- Label every frame Active or Waiting so color is never the only state signal.

#### Error Coach

Status: Implemented and verified in Chunk 1

Change:

- Give errors an IDE-style diagnostic journey.

Why:

Beginners need to know where the error occurred, what Python reported, what
that means, and what safe experiment to try.

How:

- Separate error type, location, source, explanation, evidence, and next step.
- Retain conservative syntax and runtime guidance.
- Do not claim one universal repair.
- Provide plain-language guidance for common syntax, indentation, name, type,
  index, key, division, value, attribute, and recursion failures.
- Mark a guaranteed repair as Unavailable because learner intent is not
  recorded evidence.

### DATA

#### Variables

Status: Planned

Change:

- Group variables by scope and make value changes easier to scan.

How:

- Use variable cards with name, type, scope, current value, previous value,
  and change state.
- Keep large or nested values bounded.

#### Watches

Status: Planned

Change:

- Turn watched names into a compact live dashboard.

How:

- Distinguish changed, unchanged, newly created, removed, and unavailable
  values using text and shape.
- Retain the twelve-name display limit.

#### Structure Canvas

Status: Planned

Change:

- Give each approved structure a representation that matches its behavior.

How:

- Use purpose-built HTML for arrays, lists, tuples, stacks, queues, deques,
  dictionaries, sets, and heaps where a simple linear or grouped layout is
  clearer.
- Use a graph canvas only for relationships that genuinely need nodes and
  edges, such as linked structures, trees, tries, Union-Find, and graphs.
- Retain the thirty-entry display limit.

#### References

Status: Planned

Change:

- Replace the limited conceptual relationship layout with a mature,
  interactive reference map.

How:

- Reuse pinned Cytoscape loading patterns.
- Render names, conceptual objects, and reference edges.
- Provide Fit, zoom, pan, selection, labels, and a readable HTML fallback.
- Continue stating that the map is conceptual and not a physical RAM-address
  view.

#### Mutation Explorer

Status: Planned

Change:

- Connect the mutation target, operation, before value, after value, and
  affected aliases in one history.

How:

- Build a vertical mutation timeline from existing bounded mutation evidence.
- Visually link aliases only when serialized reference evidence supports it.

#### Invariant Checker

Status: Planned

Change:

- Present reviewed invariants as an evidence checklist.

How:

- Show the invariant statement, current evidence, and one of satisfied,
  violated, or unavailable.
- Never turn lack of evidence into a success.

### FLOW

#### Operation Journey

Status: Planned

Change:

- Give normalized events a clear chronological spine.

How:

- Use event-specific shapes for read, compare, write, insert, remove, call,
  return, and visit.
- Preserve the existing thirty-event limit.
- Keep the selected event synchronized with playback.

#### Algorithm Path

Status: Planned

Change:

- Render executed transitions as an interactive path graph.

How:

- Use Cytoscape for nodes, directed edges, visit counts, selection, Fit, and
  bounded zoom.
- Highlight only the current recorded path.
- Preserve the eighty-transition limit.
- Provide an HTML transition-list fallback.

#### Step Table

Status: Planned

Change:

- Make the table feel like an approachable debugger.

How:

- Add a sticky heading and stable column layout.
- Retain the exact selected row marker and `aria-current`.
- Improve source, event, and changed-name scanning.
- Preserve the 120-row display limit.

#### Complexity Lab

Status: Planned

Change:

- Separate observed run measurements from reviewed growth behavior visually.

How:

- Use metric cards for the current recorded run.
- Use a small educational growth plot for reviewed Big O when exact catalog
  context is available.
- Label browser-specific timing as unsuitable for universal performance
  conclusions.
- Provide a readable table fallback if plotting is unavailable.

### LABS

#### Input Playground

Status: Planned

Change:

- Replace the anonymous multiline surface with ordered response rows and a
  clear execution path.

How:

- Preserve the existing local multiline string as the storage contract.
- Present it through numbered response controls.
- Show prompts only after they are observed.
- Show consumed and unused responses after execution.

#### Compare Algorithms

Status: Planned

Change:

- Present compatible runs side by side with visible differences.

How:

- Keep at most two same-session summaries.
- Show input context, observed steps, outcome, and error state.
- Present reviewed complexity separately from observed metrics.
- Offer compatible reviewed programs without claiming that one run proves
  universal superiority.

#### Edge Case Lab

Status: Planned

Change:

- Turn reviewed edge-case text into guided experiment cards.

How:

- Number each reviewed suggestion.
- Identify useful evidence views.
- State that suggestions are not tracked completion.
- Do not display Pass or Fail unless an actual reviewed case and observed
  result contract supports it.
- Keep reviewed suggestions unavailable for edited or pasted source.

## Optional visualization dependencies

Status: Planned and subject to privacy and fallback audit

### Cytoscape

Intended views:

- References
- Algorithm Path
- Relationship-heavy Structure Canvas representations

Rules:

- Reuse the already pinned project version unless an explicit dependency audit
  approves a different version.
- Load lazily only when a graph view needs it.
- Destroy or reuse old instances so tab changes do not leak memory.
- Attach no learner content to a request URL, header, or remote service.
- Provide a structured local HTML fallback.

### Educational plotting

Intended views:

- Complexity Lab
- Compare Algorithms when a plot materially improves comparison

Rules:

- Select and pin a browser-compatible open-source library only after auditing
  its source, documentation, network behavior, accessibility, bundle cost, and
  fallback needs.
- Do not add a chart merely for decoration.
- Keep exact numbers readable outside the visual plot.

No new plotting dependency is considered shipped at the time this document is
created.

## Visualization lifecycle and memory safety

Status: Planned

An optional visualization cannot be treated like ordinary static markup.

Before replacing the active view:

1. Stop view-owned timers or observers.
2. Remove view-owned event listeners when they are not attached to disposable
   child nodes.
3. Destroy or release the previous graph or plot instance.
4. Clear references that would retain detached DOM.
5. Render the next semantic fallback.
6. Enhance the fallback only after the optional library is ready.

Playback updates should modify or safely recreate only the active
visualization. Hidden views must not continue performing layout work.

## Responsive design contract

Status: Planned

### Desktop

- Source and learning panels retain their stable two-column or stacked
  breakpoint behavior.
- View content uses the available width instead of sitting as a small block in
  the center.
- Tables and graphs use their own bounded regions.

### Narrow screens

- The document must remain exactly within the viewport width.
- Area navigation remains readable.
- View tabs may scroll only inside their existing strip.
- Comparison columns stack vertically.
- Graph controls remain keyboard reachable and do not cover nodes.
- Tables scroll inside their own wrapper when columns cannot wrap safely.
- No card text may escape its boundary.

### Motion

- Playback selection may change emphasis.
- Layouts must not shake, continuously resize, or re-center on every step.
- `prefers-reduced-motion` must suppress nonessential transitions.

## Visual accessibility contract

Status: Planned

- Every interactive graph needs a meaningful region label.
- Every graph needs a nonvisual node-and-edge summary.
- Active nodes and paths need text or shape in addition to color.
- Plots need exact values outside the plotted marks.
- Tables need real headings.
- Timelines need an ordered semantic reading sequence.
- Icon-only controls need accessible names.
- Focus must remain visible in both themes.
- Contrast must remain readable for normal prose, monospace code, badges, and
  disabled controls.

## Privacy and dependency review contract

Status: Planned

Before a dependency is introduced or reused in a new DSA view, the
implementation record must answer:

```text
What exact version is loaded?
From which host?
Does the package contain analytics, telemetry, or remote logging?
Does Code Explorer attach learner data to the request?
What happens when the request fails?
Can the essential view work without it?
How is the instance cleaned up?
```

Any answer that is unknown blocks the dependency from shipping.

## Five-chunk implementation plan

The redesign requires **five implementation chunks**. Creating these baseline
documents is preparation and is not counted as a feature chunk.

| Chunk | Scope | Completion evidence |
| --- | --- | --- |
| 1 | Shared visual system and all five Trace views | Five view states, playback synchronization, both themes, desktop and mobile |
| 2 | All six Data views and bounded relationship visualization | Structure contracts, reference fallback, mutation and invariant evidence |
| 3 | All four Flow views and complexity presentation | Event path, selected table row, graph fallback, observed versus reviewed separation |
| 4 | All three Labs views | Ordered inputs, two-run comparison, edge-case honesty, local persistence |
| 5 | Cross-view accessibility, responsive polish, fallback testing, documentation, and complete regression audit | All 18 views, 535 programs, privacy, limits, console, overflow, and final visual review |

The agent must stop after each chunk so the user can inspect and commit it
before the next chunk starts.

## Detailed chunk deliverables

### Chunk 1 deliverables

Planned source areas:

- `dsa-app.js`
- `styles.css`
- Minimal semantic additions to `data-structures.html` only when dynamic
  markup is insufficient
- DSA UI validator extensions
- Required documentation updates

Required demonstrations:

- Algorithm Story visibly follows playback.
- Before and After retains correct dynamic variable membership.
- Decisions separates condition, operands, result, and selected branch.
- Calls and Recursion shows changing depth for a recursive reviewed example.
- Error Coach retains conservative guidance for syntax and runtime errors.

### Chunk 2 deliverables

Planned source areas:

- Data view-model helpers
- Six Data renderers
- Structure-specific CSS
- Optional Cytoscape adapter if its audit and fallback are complete
- Data-view regression checks

Required demonstrations:

- Linear collections remain simple and readable.
- Linked, tree, trie, Union-Find, and graph relationships are understandable.
- Edited source loses reviewed structure orientation but keeps observed values.
- Reference diagrams remain conceptual.
- Mutation and invariant states follow playback evidence.

### Chunk 3 deliverables

Planned source areas:

- Flow view models
- Operation and path rendering
- Step Table presentation
- Optional plot adapter after dependency review
- Flow-view regression checks

Required demonstrations:

- The active operation and table row stay synchronized.
- Algorithm Path preserves the exact executed transition boundary.
- Complexity Lab never mixes observed counts with reviewed Big O.
- Large paths and tables stop at their documented limits.

### Chunk 4 deliverables

Planned source areas:

- Input row presentation over the existing stored string
- Two-run comparison components
- Edge-case experiment cards
- Labs-specific responsive styles
- Local-storage and comparison checks

Required demonstrations:

- Prepared input order is unchanged.
- Observed prompts appear only after Python records them.
- Run A and Run B remain session-only.
- Reviewed edge cases disappear after source editing.
- No attempt is recorded as learner progress.

### Chunk 5 deliverables

Planned source areas:

- Cross-view consistency corrections
- Reduced-motion behavior
- Fallback simulation hooks or tests
- Complete browser audit
- Public and contributor documentation

Required demonstrations:

- All 18 views have distinct, purposeful layouts.
- Every state in the view-state contract is exercised.
- Both themes and desktop and narrow layouts remain stable.
- Optional libraries can fail without blanking a view.
- All 535 programs still pass the complete curriculum validation.
- No learner data collection or analytics surface was introduced.

## Risk register

| Risk | Why it matters | Planned prevention |
| --- | --- | --- |
| Visual polish weakens evidence honesty | Attractive diagrams can look more certain than the source evidence | Build view models from approved evidence before styling |
| Playback causes shaking | Repeated graph layout can move the complete panel | Keep fixed containers and avoid unnecessary re-layout |
| Library failure creates a blank view | CDN access is not guaranteed | Render semantic fallback first |
| Detached graphs leak memory | Tab and playback changes can create many instances | Explicit instance lifecycle and cleanup |
| Charts imply false performance precision | One browser run is noisy | Separate observed counts, reviewed growth, and timing warnings |
| Mobile diagrams overflow | Graphs and tables can be wider than phones | Bounded internal regions and 390-pixel checks |
| Color carries meaning alone | Some learners cannot distinguish the intended status | Pair color with text, shape, and labels |
| Generic styling returns | Shared components can again flatten view meaning | Require a purpose-specific visual acceptance statement per view |
| Documentation claims planned behavior | Large redesigns make status easy to confuse | Update the ledger only with verified evidence |

## Chunk ledger

### Chunk 1

Status: Implemented and verified

Completed: 2026-07-28 14:59:56 EDT (-0400)

Actual changes:

- Added one shared Trace shell that consistently presents evidence, view name,
  beginner question, program, recorded step, source line, event, and exact
  source before the purpose-specific content.
- Added designed pre-run and unavailable states with a visual marker and three
  safe next actions.
- Rebuilt Algorithm Story as a keyboard-focusable five-entry recorded timeline,
  a selected-step observation, bounded value changes, and a separately labelled
  reviewed phase map.
- Strengthened Before and After with a four-count summary while preserving one
  vertical full-state card for every name visible in either adjacent snapshot.
- Rebuilt Decisions as condition, observed result, and next recorded line,
  followed by bounded visible scope values and an explicit operand boundary.
- Rebuilt Calls and Recursion as an ordered global-to-active frame stack with
  depth, Active and Waiting states, bounded locals, return cues, and separate
  exact-source curriculum context.
- Rebuilt Error Coach as an IDE-style diagnostic with error family, message,
  learner location, source, plain-language meaning, a safe experiment, and a
  visible statement that a guaranteed repair is unavailable.
- Added responsive light and dark styling for all five visual grammars.
- Reset internal view scroll when selecting or newly populating a view. Playback
  does not reset it, which prevents long-view reading from jumping.
- Extended the DSA foundation validator with the new visual and evidence
  contracts.

How it works:

- `createTraceViewShell()` owns only shared orientation and returns an empty body
  mount. Each renderer supplies its own teaching visual.
- `renderTraceUnavailable()` prevents blank states from looking broken.
- `storyEvidenceAt()` derives event and change evidence from adjacent recorded
  snapshots.
- All learner-controlled source and values continue to enter the document
  through `textContent`.
- `resetViewStageScroll()` runs after view selection, trace invalidation, and a
  newly loaded result, but not after ordinary playback steps.
- No dependency, network request, storage key, worker contract, runtime limit,
  curriculum record, or analytics behavior changed.

Verification:

- `node --check dsa-app.js`
- `node --check app.js`
- `node --check landing.js`
- `node scripts/validate-dsa-foundation.mjs`
- Real-browser playback of Average by accumulation for Algorithm Story and
  Before and After.
- Real-browser playback of Check a precondition before searching for Decisions.
- Real-browser playback of Count down through recursive calls through five
  nested function frames.
- Real-browser execution of `values = []` followed by `print(values[1])` for
  the `IndexError` diagnostic journey.
- Desktop light-theme inspection.
- 390 by 844 dark-theme inspection.
- Measured 375-pixel document width against a 375-pixel viewport, proving no
  page-level horizontal overflow.
- Measured a 448-pixel visible internal stage against 882 pixels of scrollable
  content in the mobile error journey.
- Repeated an error run with browser console and page-error listeners attached;
  both returned empty error lists.

Remaining:

- Chunk 2 Data views.
- Chunk 3 Flow views.
- Chunk 4 Labs views.
- Chunk 5 cross-view accessibility, fallback, documentation, and complete
  regression audit.

### Chunk 2

Status: Not started

Actual changes: None

Verification: Not run

### Chunk 3

Status: Not started

Actual changes: None

Verification: Not run

### Chunk 4

Status: Not started

Actual changes: None

Verification: Not run

### Chunk 5

Status: Not started

Actual changes: None

Verification: Not run

## Required verification after every chunk

- Run JavaScript syntax checks for changed controllers.
- Run `git diff --check`.
- Search changed text for forbidden em dash and en dash characters.
- Confirm learner-controlled content is inserted safely.
- Confirm no analytics, telemetry, beacon, remote logging, or learner-data
  request was added.
- Test exact reviewed source and edited or pasted source.
- Test light and dark modes.
- Test a desktop viewport and a 390-pixel viewport.
- Confirm visible keyboard focus.
- Confirm the learning panel remains bounded and scrollable.
- Confirm playback does not move the surrounding layout.
- Confirm optional visualization failure leaves a useful fallback.
- Update this ledger with actual evidence rather than planned claims.

## Documentation update procedure

After each chunk:

1. Update the relevant view statuses in this file.
2. Add an actual-changes subsection to the chunk ledger.
3. Record exact validation commands and browser journeys.
4. Update `current state of LAB UI.md` so it describes the newly shipped
   state, not the original baseline alone.
5. Update `README_DSA.md` for learner-visible behavior.
6. Update `SKILLS.md` for source ownership, state, dependencies, risks, and
   regression checks.
7. Update `lessons_learned.md` honestly with user, Codex, and shared findings.
8. Update `changelog.md` only when the chunk is a learner-visible release.
9. Compare all documentation for matching view names, limits, dependency
   versions, privacy behavior, and completion status.

The two LAB UI documents must remain useful to a beginner contributor. They
must explain terms, show the data flow, and state why a decision exists rather
than merely listing filenames.

## Final completion standard

The redesign is complete only when:

```text
all 18 views have purpose-specific layouts
        +
all evidence boundaries remain conservative
        +
all 535 programs still validate
        +
desktop and mobile remain stable
        +
light and dark themes remain readable
        +
optional libraries fail safely
        +
documentation matches the shipped interface
```

Passing syntax checks alone is not enough. Rendering without an exception is
not enough. The final review must also ask whether a beginner can identify the
view's purpose, current evidence, important change, and next useful action.
