# Code Explorer: Python Data Structures and Algorithms

Code Explorer DSA is a separate, browser-based learning workspace for studying how Python data structures and algorithms behave one recorded step at a time. It combines editable Python, a reviewed curriculum, trace playback, structure views, algorithm context, comparisons, input experiments, and conservative explanations.

Everything runs on the learner's device. Code Explorer does not collect learner source, input, output, traces, clipboard text, preferences, or interaction analytics.

## Current release status

The DSA workspace is at **Chunk 2: linear and hashed structures**.

Chunks 1 and 2 implement:

- 197 reviewed and executable curriculum programs.
- 9 ordered curriculum sections.
- A vertical example browser with local metadata search, section counts, difficulty, line count, objective, complexity, and recommended views.
- Local Python execution through the same isolated Pyodide worker used by the Python workspace.
- A 3,000-step trace limit and a 30-second outer timeout.
- Playback controls and 18 working learning views under Trace, Data, Flow, and Labs.
- Observed, Curriculum context, Unavailable, and Shortened evidence labels.
- Automatic comments, Learning comments, wrapping, font sizing, Copy, Paste, prepared input, source persistence, and theme persistence.
- 20 approved structure representation names and 31 stable DSA event names.

Chunk 2 does **not** implement all of Tier A. The approved Tier A target is 535 programs, so 338 programs and their later structure families remain unimplemented. A planned program, structure, view extension, or algorithm in `Tier.md` is not an implemented claim.

## Contents

- [Start here](#start-here)
- [Choose the correct workspace](#choose-the-correct-workspace)
- [Workspace map](#workspace-map)
- [The 197-program curriculum](#the-197-program-curriculum)
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
|   +-- 197 reviewed programs
|   +-- local search across complete reviewed records
|   +-- 9 vertical section filters
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

## The 197-program curriculum

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
| **Total** | **Chunks 1 and 2** | **197** | **Reviewed sequence, linear, and hashed structure curriculum** |

Every catalog program has:

- A unique stable identifier from `DSA-001` through `DSA-197`.
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

- `DSA-197 FIFO` finds the exact reviewed cache program through its stable ID and algorithm label.
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

Short examples remain useful for atomic ideas, but the implemented catalog includes 48 programs with at least 15 meaningful source lines. Longer examples are used where setup, transformation, checks, and results need room to form one coherent lesson.

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

Compares variables before and after the selected step. Created, changed, and unchanged states use text, not color alone.

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

Shows one visible container using a representation appropriate to its serialized shape. For an exact Chunk 2 catalog program, reviewed labels can orient the same observed cells as stack TOP and BASE, queue FRONT and REAR, linked HEAD and TAIL, hash entries, or set members. Pasted code receives generic observed cells because its abstract role is not reviewed. A display contains at most 30 cells or entries. Additional content is marked Shortened.

#### References

Groups names by conceptual object token. This is a name-to-object teaching map, not a physical RAM address and not a memory profiler.

#### Mutation Explorer

Separates a name referencing a different object from an observed in-place value change when tokens and serialized evidence permit that distinction.

#### Invariant Checker

Shows reviewed invariant questions for an exact catalog program. It currently presents rules to test rather than claiming a formal proof.

### Flow area

#### Operation Journey

Lists up to 30 observed event cues in order. It is a bounded learning summary, not the complete internal worker event stream.

#### Algorithm Path

Shows up to 80 executed source-line transitions and visit counts.

#### Step Table

Shows up to 120 recorded rows with step, line, event cue, and changed names.

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
| Structure Canvas entries | 30 | The view is labeled Shortened |
| Suggested watches | 12 names | Additional visible names are not shown in Watches |
| Operation Journey | 30 events | The view is labeled Shortened |
| Algorithm Path | 80 transitions | The view is labeled Shortened |
| Step Table | 120 rows | The view is labeled Shortened |
| Compare Algorithms history | 2 run summaries | The oldest in-session summary is replaced |
| Prepared-input text | 20,000 characters | Additional text is ignored when loaded into the local input field |
| Active learning views | 18 | Custom learner-defined views are not supported |
| Implemented curriculum | 197 programs | The remaining 338 Tier A programs are not selectable |
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
Later chunks
   |
   +-- complete the remaining 338 Tier A programs
   +-- preserve the same evidence labels and limits
   +-- extend validators before making implementation claims
```

See `Tier.md` for the complete approved curriculum plan. A later chunk ships only when its programs, runtime behavior, documentation, limits, accessibility, privacy, and browser tests all pass together.
