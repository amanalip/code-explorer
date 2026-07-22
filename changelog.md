# Code Explorer changelog

This changelog records learner-visible releases of Code Explorer. It explains what changed, why it matters to a beginner, what was verified, and which boundaries still apply.

```text
VERSION ENTRY
|
+-- Date
+-- Learner-visible additions
+-- Changed behavior
+-- Documentation and accessibility
+-- Verification evidence
+-- Known boundaries
```

Version numbers describe meaningful stages of the learning tool. They are not claims that every possible Python program or browser environment is supported.

## v4, 2026-07-22

v4 turns the starter library into a structured 134-program beginner curriculum and makes learner-defined objects inspectable across the existing trace views.

### A blended 134-program curriculum

The original 54-program library was treated as reviewed learning coverage, not as disposable placeholder content. Each existing lesson was kept, renamed, moved, or expanded only when its teaching purpose remained represented. Eighty additional programs were then blended into the same library.

```text
54 reviewed programs
        +
80 additional programs
        |
        v
134-program curriculum
        |
        +-- short focused lessons
        +-- repeated practice with useful variation
        +-- intentional debugging investigations
        +-- longer guided checkpoints
        +-- classes and object state
```

The shipped category totals are:

| Category | Programs |
| --- | ---: |
| First Steps | 10 |
| Variables and Types | 10 |
| Operators and Expressions | 10 |
| Strings | 8 |
| Decisions | 12 |
| Loops | 16 |
| Functions and Scope | 16 |
| Collections | 16 |
| References and Mutation | 8 |
| Input, Errors and Debugging | 8 |
| Classes and Objects | 8 |
| Guided Mini Programs | 12 |
| **Total** | **134** |

The level totals are 46 Beginner, 56 Developing, and 32 Guided Challenge. Twenty programs contain at least 15 source lines, giving learners a bridge between isolated ideas and complete small programs.

### Fixed recommended order without learner tracking

Selecting **All** presents a fixed curriculum route. Focused concept lessons appear in teaching order, and a guided checkpoint is inserted after the concepts listed on its card.

This is a curriculum recommendation only. Code Explorer does not collect completion history, calculate readiness, build a learner profile, or claim to know what a particular person has studied. A learner can open any category or any program at any time.

```text
Curriculum metadata
        |
        +-- fixed order
        +-- listed prerequisites
        +-- checkpoint number
        |
        v
Recommended display sequence

No account + no progress events + no learner profile
```

Each category row now displays its exact program count. Each card displays its topic, level, title, purpose, recommended views, and accurate singular or plural line count. Guided cards also display prerequisites and their checkpoint position.

### Twelve guided mini programs

The guided checkpoints combine earlier concepts into programs with a beginning, middle, and useful result:

| Checkpoint | Program | Lines | Main integration |
| ---: | --- | ---: | --- |
| 1 | Smart Cafe Bill | 27 | values, arithmetic, and a decision |
| 2 | Temperature Week Summary | 19 | a list, loop, totals, and comparison |
| 3 | Quiz Score Reporter | 22 | score processing, decisions, and a report |
| 4 | Habit Streak Tracker | 19 | Boolean values, loop state, and best-result tracking |
| 5 | Student Gradebook | 18 | nested collection records and aggregation |
| 6 | Personal Expense Summary | 28 | dictionaries, categories, loops, and totals |
| 7 | Inventory Assistant | 19 | mutable records and restock decisions |
| 8 | Classroom Attendance Report | 24 | nested records, counting, and summaries |
| 9 | Word and Sentence Analyzer | 24 | string cleanup, word loops, and measurements |
| 10 | Library Loan Tracker | 25 | record updates, due-state decisions, and output |
| 11 | Resilient Order Intake | 31 | prepared input, validation, retrying, and error handling |
| 12 | Object-Oriented Pet Care Tracker | 27 | a class, instances, methods, attributes, and a collection |

The longer programs range from 18 through 31 lines. Length is used to support a coherent task, not to inflate the curriculum count.

### Deliberate errors are visibly different from mistakes

Three programs intentionally stop with an error so a beginner can study Error Coach:

- **An index to investigate** expects `IndexError`.
- **A number to investigate** expects `ValueError`.
- **A key to investigate** expects `KeyError`.

Their cards display an **Intentional learning error** warning and the expected exception before the learner opens the program. Every other program must compile and finish with its prepared input. This makes an intentional debugging lesson visibly different from an accidental broken example.

### Classes and object state across the workspace

The new Classes and Objects category introduces classes, instances, attributes, methods, constructors, inheritance, composition, and a guided object-oriented program.

Learner-defined instances now expose a bounded attribute mapping to the existing data views:

```text
pet variable
     |
     v
<Pet instance>
     |
     +-- .name = "Milo"
     +-- .animal = "cat"
     +-- .meals = 2
     +-- .exercised = True
```

Variables and Structures can expand the attributes. Mutation Explorer can show attribute-bearing instances as mutable objects. References can connect a name to an instance and the instance to its contained values. The same depth, item, cycle, representation, and graph-size limits used for built-in collections remain active.

Default Python instance text often contains a hexadecimal process address. v4 normalizes that text to a stable label such as `<Pet instance>`. The interface therefore avoids implying that a temporary address is a useful or permanent RAM location.

Automatic Learning Comments now recognize class definitions and can explain that a class creates a reusable object blueprint. Runtime details remain limited to recorded evidence.

### IDE-style Learning Comments study view

The Learning Comments dialog now gives generated study copies a clearer editor-like reading hierarchy in both Light mode and Dark mode.

```text
READ-ONLY STUDY VIEW
|
+-- main.py file tab
+-- visual line-number gutter
+-- Python syntax colors
+-- purple Trace note bands
+-- Python 3 and document status
|
+-- Copy exact commented Python
+-- Replace only after confirmation
```

The preview explicitly says **Read only**. Trace-powered notes use full-width tinted rows and visible labels, while original Python uses conservative syntax colors. The inline Automatic comments layer uses the same visible **Trace note** label instead of presenting long, faint comment text.

All IDE chrome is presentation only. Visual line numbers, the file tab, legend, colors, and status strip are never included by **Copy commented code** or **Replace editor**. Learner-controlled source is rendered through text nodes, and the feature adds no dependency, network request, stored identifier, analytics, or learner-data collection.

### v4 verification evidence

- The structural validator found exactly 54 reviewed base examples plus 80 additional examples, for 134 unique titles.
- All 12 category totals and all three level totals matched the documented values.
- All 134 sources compiled and executed with their prepared input under an individual timeout guard.
- Exactly the three visibly labeled investigation programs raised their declared exception types. No other example produced an accidental syntax or runtime error.
- The 12 guided programs retained their prerequisite lists and fixed checkpoint positions.
- A desktop browser displayed all 134 cards, all 13 filter choices, accurate counts, independently scrolling regions, and no horizontal category scrolling.
- A 390 by 844 mobile browser displayed the vertical categories above one-column cards without page-level horizontal overflow or card-content escape.
- Light and dark mode checks confirmed readable categories, cards, badges, prerequisites, and intentional-error warnings.
- The Object-Oriented Pet Care Tracker produced 33 trace steps, a class-definition learning note, stable instance labels, and expandable object attributes.
- The intentional `IndexError` program showed its warning before selection and the expected Error Coach result at its failing step.
- Desktop light and dark browser checks confirmed readable IDE chrome, source colors, note bands, focus states, and action controls.
- A 390 by 844 dark-mode check of the 27-line Object-Oriented Pet Care Tracker kept the dialog within the viewport, wrapped 21 Detailed notes, and produced no page-level or preview-level horizontal overflow.
- An intercepted copy action returned the exact generated 12-line commented Python document for the default example. It included `# Code Explorer:` notes and original Python but excluded visual line numbers, file chrome, badges, and status text.

### v4 boundaries

- The examples form a recommended curriculum, not a complete Python language reference or a record of learner progress.
- Opening a later program is always allowed. Prerequisites are guidance, not locks.
- Object attributes are deliberately bounded. Extremely deep, large, slot-only, extension, or unusual proxy objects may have less detail.
- Inheritance and composition examples teach introductory mechanics. They do not attempt to cover every object-oriented design pattern.
- The trace remains limited to 3,000 recorded steps and the outer execution timeout remains 30 seconds.
- Code Explorer remains a static client-side learning tool and does not collect analytics or learner data.

## v3, 2026-07-22

v3 improves how learners read a large curriculum and how they use generated explanations without interrupting the original program flow.

### Automatic comments inside the editor

The trace-powered note set introduced in v2 can now be shown directly beside its related source lines.

```text
Completed trace
      |
      v
Learning-comment records
      |
      +-- Automatic comments toggle
      |        |
      |        +-- on: visual widgets above source lines
      |        +-- off: compact original source view
      |
      +-- Learning comments dialog
               |
               +-- copy commented study document
               +-- replace editor only after confirmation
```

Added behavior:

- The editor toolbar now includes **Automatic comments off** beside the Wrap control.
- The control stays disabled until the current source produces useful trace-backed notes.
- Selecting it changes the visible label to **Automatic comments on** and sets the matching pressed state for assistive technology.
- Notes render as CodeMirror block widgets above supported lines. They look like Python comments but are not inserted into the editor document.
- Selecting the control again removes the widgets and restores the compact source-only view.
- Guided remains the default amount of explanation. Choosing Essential, Guided, or Detailed in the Learning Comments dialog also refreshes visible inline notes.
- Normal editor **Copy** continues to copy the original program, even while comments are visible.
- The line and character footer, gutter numbers, replay breakpoints, execution heatmap, local source storage, and worker input continue to use the original document.
- Editing, pasting, loading another example, clearing the trace, or starting a new run hides old widgets and invalidates their evidence.
- The textarea fallback keeps the original source as editable data and presents a separate read-only commented preview.
- The existing Learning Comments dialog remains the deliberate export surface for copying a real commented document or confirming editor replacement.

This separation provides two reliable learning modes:

| Need | Control | Source result |
| --- | --- | --- |
| Read explanations in context and then return to normal code flow | Automatic comments | Original source always remains unchanged |
| Save or share a portable commented study copy | Learning comments | Original remains unchanged unless replacement is explicitly confirmed |

### Vertical examples browser

The 54-program curriculum now uses a vertical category navigator instead of a horizontal filter strip.

Desktop behavior:

- A fixed-width left sidebar lists All and the seven curriculum categories.
- Each row displays the exact number of programs in that category.
- The selected category uses a clear filled state plus `aria-pressed`.
- The category sidebar and program-card region scroll vertically and independently.
- The two-column card region uses the available dialog width without requiring horizontal navigation.
- Selecting a category returns its card list to the first program.

Mobile behavior:

- The vertical category region stacks above the results.
- Program cards become a one-column list.
- Categories and results keep separate bounded vertical scrolling.
- Cards retain enough height for topic, difficulty, title, purpose, and recommended views.
- The layout creates no page-level horizontal overflow at a 390-pixel viewport.

The examples dialog was enlarged on desktop so longer category names and richer cards remain comfortable to scan. The same markup and behavior are shared by the landing page and workspace.

### Documentation and contributor knowledge

- README.md now distinguishes temporary inline explanations from exportable commented source, with workflows, state diagrams, persistence rules, expected behavior, and troubleshooting.
- README.md now documents the vertical desktop and mobile examples layouts and removes the obsolete instruction to scroll categories horizontally.
- AGENTS.md now requires source-preservation checks for visual editor annotations and vertical-navigation regression checks for the examples browser.
- SKILLS.md now records the widget state, fallback behavior, editor invariants, layout invariants, and browser evidence.
- lessons_learned.md now records the product value of protecting reading flow, separating a study view from an export artifact, and testing constrained mobile grid rows.

### v3 verification evidence

- The default seven-line program produced a 12-step browser trace and five visible Guided widgets.
- Showing and hiding the widgets kept the source footer at `7 lines · 108 chars`.
- Loading another example while comments were visible removed every widget, disabled the control, cleared the stale trace, and loaded the new source intact.
- The original Learning Comments dialog still opened with its detail selector, evidence summary, complete preview, copy action, and confirmation-gated replacement action.
- Desktop light and dark checks confirmed readable inline notes and examples navigation.
- The landing examples dialog rendered exactly 54 cards and eight filter choices with no horizontal filter overflow.
- The Loops filter reported `Showing 11 of 54 programs`.
- A 390 by 844 mobile test confirmed a 352-pixel dialog, 190-pixel minimum card height, 390-pixel page width, and no page-level horizontal overflow.
- Mobile inline-note testing confirmed five wrapped widgets, a 360-pixel editor width, and no horizontal editor overflow in light and dark themes.
- Browser testing discovered that removing the mobile card minimum let CSS Grid compress rows to 42 pixels while their content overflowed. The shipped rule preserves a 190-pixel minimum and prevents that regression.

### v3 boundaries

- Inline comments remain explanations of the latest recorded run. They are not predictions for every possible input.
- Automatic comments intentionally reset to off when source or evidence changes.
- Visible widgets occupy vertical reading space while enabled, but they do not create Python source lines.
- To export comments as real text, the learner must use the separate Learning Comments dialog.
- Category navigation is vertical, but a small phone still needs vertical scrolling to reach all categories and programs.

## v2, 2026-07-21

### Automatic Learning Comments

Code Explorer can now generate a separate commented study copy after a trace completes.

```text
Python source
      +
Parsed statement structure
      +
Observed trace evidence
      |
      v
Learning-comment metadata
      |
      v
Separate preview
      |
      +-- Copy complete commented source
      +-- Replace editor after confirmation
```

Added behavior:

- **Learning comments** becomes available only after the current source produces useful trace evidence.
- Essential, Guided, and Detailed levels let a learner control explanation density.
- Notes cover supported assignments, conditions, loops, function behavior, input, output, returns, mutations, and error-related statements.
- Runtime evidence can add observed assignment values, execution counts, loop body counts, and condition outcomes.
- Repeated values are described as repeated behavior rather than one universal value.
- The preview preserves the original source by default.
- **Copy commented code** copies the complete generated document.
- **Replace editor** requires explicit confirmation and clears the old trace after replacement.
- Learner-written comments, indentation, and blank lines are preserved.
- Generated notes use the prefix `# Code Explorer:`. Older lines with that exact prefix are removed before a new generation so repeated use does not stack duplicate generated comments.
- Unsupported or ambiguous statements receive no invented explanation.
- Syntax errors leave the feature disabled because no valid parsed program or runtime trace exists.
- Runtime errors may still produce notes for statements supported by evidence recorded before the failure.
- A failing line names its observed exception and does not use frame-unwinding events as a false completion count.

### Expanded 54-program curriculum

The starter library grew from 18 to 54 programs. The aim is repeated practice with varied structure, not a long list of nearly identical snippets.

| Category | Programs |
| --- | ---: |
| Foundations | 8 |
| Decisions | 7 |
| Loops | 11 |
| Functions and Scope | 8 |
| Collections | 10 |
| References and Mutation | 4 |
| Input and Debugging | 6 |
| Total | 54 |

Difficulty distribution:

| Level | Programs | Purpose |
| --- | ---: | --- |
| Beginner | 19 | Isolate one primary idea |
| Developing | 22 | Combine two or more familiar ideas |
| Guided Challenge | 13 | Read and experiment with complete small programs |

Curriculum improvements:

- Important ideas have multiple examples with different variable structures and complexity.
- Eleven loop examples cover accumulators, counters, running maximums, `for`, several `while` patterns, `break`, `continue`, filtering, nested loops, mutation, and summary reports.
- Function examples progress from one call to defaults, local and global scope, multiple returns, nested calls, recursion, and a multi-function pipeline.
- Collection examples cover lists, tuples, sets, dictionaries, matrices, nested records, gradebooks, and inventory data.
- Reference examples contrast aliases, reassignment, mutation, shallow outer copies, and shared nested objects.
- Input and debugging examples cover prepared responses, validation, conversion, and intentional `IndexError`, `ValueError`, and `KeyError` investigations.
- Twelve programs contain 15 to 20 source lines so beginners can practice reading complete small programs.
- Cards display exact source-line counts.
- The filter toolbar remains visible while scrolling the larger dialog.
- Category labels were revised to describe the curriculum more accurately.

### Documentation and project learning

- README.md now documents Automatic Learning Comments with workflows, safety rules, examples, persistence behavior, and troubleshooting.
- README.md now contains the complete 54-program catalog, learning ladders, and clearer routes through the expanded library.
- The Python concepts glossary now connects definitions to examples, common misunderstandings, and the most useful Code Explorer views.
- AGENTS.md now requires comment-feature checks, exact starter-library invariants, changelog synchronization, and content audits.
- SKILLS.md now records the learning-comment data contract, state lifetime, transformation rules, example counts, validation evidence, and recurring test recipes.
- lessons_learned.md now records the user and Codex lessons from revisiting example scale, using generated comments conservatively, and testing prose as well as schemas.

### v2 verification evidence

- Exactly 54 examples were found in the application data.
- Every example parsed as valid Python.
- Every example was executed with its prepared inputs.
- Only the three intentionally failing debugging examples raised their expected exception types.
- All category and difficulty totals matched their documented counts.
- Exactly 12 examples contained 15 to 20 source lines.
- The full example corpus generated 421 valid learning-comment records during automated validation.
- Representative generated prose was reviewed manually. Awkward `elif` wording and noisy floating-point representations were found and corrected.
- An intentional `IndexError` browser run exposed a false repeated-completion count from exception propagation. The release logic now suppresses ambiguous counts and reports the exception instead.
- A real browser Pyodide run confirmed repeated-loop evidence and Learning comments availability.
- Light theme, dark theme, desktop, mobile, copy, replacement confirmation, rerun deduplication, and error states are part of the release browser checklist.

### v2 boundaries

- Generated comments explain the completed run, not every possible future input.
- Learning comments are not artificial-intelligence guesses and do not attempt to infer the learner's intention.
- Code Explorer still targets small educational programs within the 3,000-step and 30-second limits.
- The three intentionally failing starter programs are lessons for Error Coach, not regressions.
- A missing generated note is safer than an uncertain explanation.

## v1, 2026-07-20

v1 established Code Explorer as a static, client-side Python execution visualizer for beginners.

### Website and workspace foundation

- Dedicated landing page and dedicated reloadable execution workspace.
- GitHub Pages compatible static hosting with no application server.
- Shared navigation, Tool Guide link, GitHub icon, explicit Dark mode and Light mode control, and copyright attribution for Aman Ali Pogaku.
- Geek-inspired visual identity with responsive light and dark themes.
- Persistent editor source so reloading the workspace restores the current program.

### Source editor

- CodeMirror Python editing with a native textarea fallback.
- Syntax highlighting, line numbers, complete-document Copy and Paste, clipboard permission feedback, wrap control, and font sizes from 12 px through 22 px.
- Source line and character totals.
- Executed-line heatmap and current-line emphasis.
- Clickable replay breakpoints in the line-number gutter.

### Safe browser execution

- Pyodide runs Python entirely in the browser.
- A Web Worker separates Python execution from the main interface.
- The trace records at most 3,000 steps.
- The outer execution timeout is 30 seconds.
- Clear messages explain trace-limit, timeout, stop, syntax-error, runtime-error, and missing-input states.
- Safe bounded serialization handles common values, nested containers, shared references, cycles, shortened representations, and omitted-item messages.
- Input Playground provides deterministic responses to `input()` calls.

### Trace, Data, Flow, and Labs

```text
TRACE
+-- Story
+-- Before and After
+-- Conditions
+-- Function Journey
+-- Error Coach

DATA
+-- Variables
+-- Watches
+-- Structures
+-- References
+-- Mutation Explorer

FLOW
+-- Execution Path
+-- Coverage
+-- Loop Table
+-- Loop Lab

LABS
+-- Input Playground
+-- Compare Runs
+-- Trace Bookmarks
```

These views share one selected trace step so source, values, console output, and diagrams remain synchronized.

### Playback and visualization

- Previous, play or pause, next, restart, timeline slider, bookmarks, and playback-speed controls.
- Console output reconstruction for the selected point in time.
- Cytoscape reference and execution-path graphs.
- Fit controls and granular persistent zoom from 40 percent through 200 percent.
- Stabilized graph layouts to prevent repeated shaking during step changes or tab switches.
- Improved graph typography and contrast in light and dark themes.

### Initial learning library and guide

- Eighteen initial examples covered foundations, decisions, loops, functions, collections, input, and errors.
- The public README introduced question maps, workspace maps, fourteen guided walkthroughs, expected behavior, limits, privacy, troubleshooting, a glossary, and a final beginner workflow.
- Interface empty states explain which action or trace data a view needs.
- Responsive layouts support desktop and mobile use, while the fuller workspace remains best suited to a laptop or desktop screen.

### v1 boundaries

- Code Explorer does not claim to display physical RAM addresses.
- Playback breakpoints pause the recorded timeline, not the live Python interpreter.
- Coverage and execution graphs describe one observed run.
- The tool is not a production debugger, full IDE, package sandbox, or universal LeetCode runner.
- Large, intensive, graphical, operating-system-dependent, or package-heavy programs may not fit the browser runtime and visual trace model.

## How to read future entries

When a later release changes a documented count, label, limit, or behavior, its entry should state both the new behavior and the learner impact. Historical entries remain accurate descriptions of the version in which they shipped. They should not be silently rewritten to make an earlier version appear to contain later features.
