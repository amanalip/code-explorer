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

## v9, 2026-07-23

v9 adds local program search to the Python and DSA example catalogs.

### Complete reviewed-record search

- The 134-program Python catalog searches title, topic, category, difficulty, description, views, prerequisites, intentional errors, and reviewed source.
- The 197-program DSA catalog additionally searches stable ID, algorithm, structures, events, expected result, phases, invariants, edge cases, comparison metadata, and complexity.
- Multiple words use AND behavior, so every word must match somewhere in the same record.
- Case, accents, and punctuation are normalized for predictable matching.
- Search results remain normal clickable cards that load through the existing editor path.

### Filters, counts, and recovery

- Search and the selected category or section apply together.
- Every filter badge reports its current search-match count.
- The visible result count updates and is announced politely to assistive technology.
- A zero-result panel explains what happened and offers Clear search.
- Clearing search retains the selected category or section.
- Python search results preserve their absolute recommended-route number.
- DSA results retain their stable `DSA-001` through `DSA-197` identifiers.

### Privacy boundary

Search queries remain temporary in-memory page state. They are not persisted, uploaded, added to a URL, logged remotely, or collected for analytics. No dependency, network request, storage key, execution limit, curriculum count, or trace behavior changed.

### Verification evidence

- Python hidden error metadata search found the exact intentional `KeyError` lesson and loaded it into the editor.
- DSA hidden edge-case search found the exact empty-list division lesson.
- `DSA-197 FIFO` found and loaded the exact hash-indexed cache program.
- A mismatched DSA section and query produced the explicit empty state. Clear search retained the section, restored its 20 cards, and returned keyboard focus to search.
- At 390 by 844, both catalogs retained 322-pixel search fields, one-column result cards, and zero page or dialog horizontal overflow.
- Desktop light and dark screenshots confirmed readable fields, badges, cards, and focus treatment.

### DSA Learning comments parity correction

- The DSA dialog now uses the same four-row IDE hierarchy as Python: header, detail toolbar, flexible preview, and visible action footer.
- Essential, Guided, and Detailed select worker note levels 1, 2, and 3 without rerunning Python or changing source.
- A live summary reports the selected note density and whether three exact reviewed curriculum notes are available.
- The legend and rows distinguish syntax or trace notes, reviewed curriculum context, and original Python using text plus separate colors.
- Copy commented code and Replace editor remain visible inside the bounded modal at desktop and mobile sizes.
- Copy still uses the plain generated Python document. Visual line numbers, colors, badges, legend text, summary text, and editor chrome are excluded.

The correction was tested in light and dark themes at desktop and 390 by 844. The real Copy commented code action completed successfully, and the DSA foundation validator now checks all three detail boundaries. No program, curriculum total, execution limit, dependency, storage key, analytics behavior, or network request changed.

### DSA trace-state reading correction

- Before and After now identifies the selected step, executed line number, and exact recorded source before presenting values.
- The view renders the complete visible state as one full-width vertical variable card per name, rather than showing only names changed by the current instruction.
- Each card places Before above After with explicit text labels and a downward direction cue.
- Cards appear, disappear, remain, or update as playback changes the recorded scope state.
- Created, changed, removed, and unchanged are written as text so color is never the only meaning.
- Step Table now marks the selected trace row with visible **Current step** text, `aria-current="true"`, and supporting visual emphasis.
- Operation Journey keeps its existing current-operation behavior.

This correction changes presentation only. It adds no curriculum programs, trace events, dependencies, storage keys, analytics, network requests, or execution limits. Desktop and 390 by 844 browser checks cover light and dark themes, playback movement, variable-card growth, selected-row movement, and page overflow.

## v8, 2026-07-23

v8 corrects the DSA workspace interface before the next curriculum chunk. It does not add programs, views, dependencies, storage, analytics, or new network behavior.

### Stable horizontal view navigation

- The DSA workspace uses a wider desktop boundary so the editor and learning view both receive useful reading width.
- Trace and Data view labels remain on one horizontal baseline rather than wrapping into an accidental second row.
- The source and learning panels stack before either column becomes cramped.
- On a narrow phone, only the bounded view-label strip may scroll horizontally. The complete page retains zero horizontal overflow.

### Repaired playback bar

- Previous, Play, Next, and Restart now use one grouped control row.
- The timeline receives the complete flexible middle region on desktop.
- Speed remains a fixed readable control at the right.
- On a narrow screen, the timeline moves to its own row below the buttons.

### IDE-style DSA learning comments

- Automatic comments and the Learning comments dialog now share one safe line-numbered study renderer.
- The renderer adds conservative Python syntax colors, clearly tinted DSA note rows, read-only file chrome, generated line counts, and a compact status strip.
- Visual line numbers, syntax spans, badges, file chrome, and status text remain presentation only.
- Normal Copy continues to copy original Python.
- Copy commented code continues to copy the plain generated study document.
- Replace editor still requires explicit confirmation and adopts only that same plain document.

### Verification evidence

- JavaScript syntax checks and repository whitespace checks passed.
- Both the five-label Trace row and six-label Data row remained one baseline at a 1,493-pixel desktop viewport.
- At 1,280 pixels, the panels stacked cleanly and the Data labels remained one row.
- At 390 by 844, the tab strip used bounded internal scrolling with zero page-level horizontal overflow.
- Playback controls shared one baseline with a 1,069-pixel desktop timeline and a 320-pixel mobile timeline.
- A reviewed run generated 20 preview rows and 10 DSA note rows in both comment surfaces.
- Automatic comments preserved the exact stored learner source in light and dark themes.

## v7, 2026-07-23

v7 ships **Chunk 2: linear and hashed structures** for the Python Data Structures and Algorithms workspace. It adds 66 reviewed programs to the 131-program Chunk 1 foundation. The implemented catalog now contains 197 programs across nine sections. The approved Tier A destination remains 535 programs, so 338 later programs are explicitly unavailable.

### Sixty-six new reviewed programs

| Chunk 2 section | Programs | Main learning journey |
| --- | ---: | --- |
| Stacks, queues, and deques | 22 | LIFO and FIFO behavior, bounded operations, bracket checking, postfix evaluation, monotonic stacks, two-stack queues, deques, scheduling, and representation comparisons |
| Linked structures | 20 | Nodes, traversal, insertion, deletion, reversal, middle and cycle techniques, doubly and circular links, linked stacks, linked queues, and representation comparison |
| Hash tables and set algorithms | 24 | Buckets, collisions, updates, deletion, load factor, rehashing, frequency maps, equality, set relations, longest consecutive runs, and membership comparison |
| **Chunk 2 addition** | **66** | **Reviewed linear and hashed structure curriculum** |

Every new record uses the same complete curriculum contract as Chunk 1. It includes runnable source, learning objective, prerequisites, difficulty, expected result, reviewed structures, phases, invariants, edge cases, comparison relationships, complexity context, recommended views, and event vocabulary.

The complete implemented arithmetic is:

```text
131 Chunk 1 programs
 66 Chunk 2 programs
--------------------
197 implemented programs

535 approved Tier A destination
-197 implemented programs
--------------------
338 programs still unavailable
```

### Structure Canvas orientation

Structure Canvas can now orient observed serialized cells according to the exact reviewed catalog program:

- Stack examples identify TOP and BASE.
- Queue and deque examples identify FRONT and REAR.
- Linked examples identify HEAD and TAIL and show conceptual links.
- Hash-table examples present bounded entries as bucket-like rows.
- Set examples present unordered conceptual members.

These labels are curriculum context, not a claim about a physical RAM address or Python's private internal storage. If the learner edits the reviewed source or pastes a different program, the canvas returns to its generic observed-value layout. The trace remains useful, but named structure orientation is withheld because the source no longer has an exact reviewed identity.

### Representation comparisons

Chunk 2 includes deliberate comparisons instead of presenting one implementation as universally correct. Examples compare list and deque stacks, deque and two-stack queues, linked and array insertion, and list scan and set membership. Runtime counts remain observed evidence. Big O descriptions remain reviewed curriculum context.

### Verification evidence

- JavaScript syntax checks passed for the new curriculum module, DSA controller, contracts, runtime, and validators.
- The combined curriculum validator confirmed 197 unique programs and the exact nine section counts.
- The Python validator compiled, executed, and checked the documented expected-result marker for all 197 programs.
- Forty-eight implemented programs contain at least 15 meaningful source lines.
- The new programs retain bounded values, trace steps, structure entries, path rows, comparison history, and prepared input.
- Browser checks covered the catalog, representative stack, queue, linked, hash, and set programs, all 18 views, exact-match orientation, edited-source honesty, light and dark themes, desktop and mobile layouts, and the existing Python learning path.
- No analytics, telemetry, remote logging, network API, storage key, runtime dependency, trace limit, or timeout was added or changed.

### Known boundary

Chunk 2 does not implement trees, binary-search trees, heaps, priority queues, tries, Union-Find, graphs, recursion, backtracking, greedy algorithms, dynamic programming, bit manipulation, mathematical algorithms, later investigations, or integrated capstone challenges. Those families remain part of the approved route in `Tier.md`, not selectable programs in the current catalog.

## v6, 2026-07-23

v6 ships **Chunk 1: core sequences** for the separate Python Data Structures and Algorithms workspace. It implements 131 reviewed programs and the reusable local DSA learning runtime. The complete Tier A target remains 535, so 404 later programs are explicitly unavailable.

### Reviewed 131-program curriculum

The implemented catalog contains:

| Section | Programs |
| --- | ---: |
| Algorithm and complexity foundations | 24 |
| Abstract data types and representations | 12 |
| Python-native containers | 42 |
| Arrays and sequence techniques | 20 |
| Searching | 9 |
| Sorting and sorting properties | 24 |
| **Chunk 1 total** | **131** |

Each record includes source, an objective, prerequisites, difficulty, prepared input, expected result, structures, algorithm context, phases, invariants, edge cases, comparison relationships, complexity context, recommended views, events, and an intentional-error contract.

### Clearer learning-path labels

The second landing action now says **Start exploring Python Data Structures and Algorithms**. The invitation matches **Start exploring Python**, while the complete subject remains explicit.

The original Python page now says **Python Programming workspace** instead of the generic **Execution workspace**. A short description explains that learners can write, run, replay, and inspect variables, decisions, loops, functions, objects, and output.

The example dialog uses independent vertical section and card scrolling. Cards show enough information to choose a lesson before loading it, and mobile uses a stacked vertical layout without horizontal category scrolling.

### Local execution and playback

The DSA workspace now runs Python through the existing isolated Pyodide worker. It provides previous, play, next, restart, timeline, speed, and time-aware Console Output controls.

The execution boundaries remain:

- 3,000 recorded trace steps.
- 30-second outer timeout.
- A clear learner-facing message when either execution boundary stops the run.

### All 18 DSA views

Trace now provides Algorithm Story, Before and After, Decisions, Calls and Recursion, and Error Coach.

Data now provides Variables, Watches, Structure Canvas, References, Mutation Explorer, and Invariant Checker.

Flow now provides Operation Journey, Algorithm Path, Step Table, and Complexity Lab.

Labs now provides Input Playground, Compare Algorithms, and Edge Case Lab.

Observed runtime facts are separate from reviewed curriculum context. Pasted or edited code continues to receive observed views, but named algorithms, phases, invariants, edge cases, comparison groups, and Big O remain Unavailable unless source exactly matches a reviewed program.

### Learning comments

Automatic comments replace only the visible editor surface with a read-only teaching copy. Original source remains the editor data and normal Copy target. Turning the feature off restores the unchanged editor.

Learning comments provides a separate read-only preview, complete commented-code copy, and a confirmation-gated editor replacement.

### Bounded presentation

Chunk 1 adds documented display limits for watches, structure entries, operation journeys, paths, step tables, comparison history, prepared input, and serialization. A shortened view preserves source and trace evidence and uses a visible Shortened label. It is not described as an execution failure.

### Verification evidence

- JavaScript syntax checks passed for the DSA controller, contracts, curriculum, and runtime helpers.
- The DSA foundation validator confirmed 18 views, 31 events, 20 structures, and the 535-program target.
- The curriculum validator confirmed exact section counts, complete metadata, unique source, source-depth rules, and near-duplicate boundaries.
- The Python validator compiled, executed, and checked the expected result for all 131 programs.
- Twenty-eight programs contain at least 15 meaningful source lines.
- Browser checks exercised all 18 views, reviewed and pasted code, automatic comments, the 3,000-step error, source persistence, light and dark themes, desktop and mobile layout, and vertical catalog scrolling.
- Python-workspace curriculum validators remained part of the regression suite.

### Known boundary

Chunk 1 does not ship the remaining 404 Tier A programs. Dedicated stacks and queues, linked structures, hash-table internals, trees, heaps, tries, Union-Find, graphs, recursion, backtracking, greedy algorithms, dynamic programming, bit manipulation, mathematical algorithms, investigations, and integrated challenges remain later reviewed chunks unless already taught only as a Python-native container operation.

## v5, 2026-07-23

v5 begins the separate Python Data Structures and Algorithms learning path with a deliberately bounded Chunk 0 foundation. It does not claim that DSA execution or the 535-program curriculum is complete.

### Two first-class learning paths

The landing page now presents two matching primary actions:

```text
Start exploring Python
Python Data Structures and Algorithms
```

Both use the same dark green structure, arrow, focus, and hover treatment. The Python example catalog moved completely inside `workspace.html`, so the landing page no longer downloads or opens a workspace-specific catalog.

The shared landing-page Tool Guide was removed. Each workspace now provides the guide that matches its own behavior:

```text
workspace.html       -> README.md
data-structures.html -> README_DSA.md
```

### Separate DSA workspace foundation

`data-structures.html` provides:

- An independent DSA `main.py` editor.
- A separate local source key that does not overwrite Python workspace source.
- Text wrapping.
- Font sizes from 12 px through 22 px.
- Complete-document Copy and Paste.
- CodeMirror with a native textarea fallback.
- Light and dark themes.
- Source line and character statistics.
- Responsive desktop and mobile layout.

Python execution is deliberately unavailable in the DSA workspace during Chunk 0. Run trace, examples, Automatic comments, and Learning comments remain disabled with visible explanations.

### Final 18-view foundation

The DSA page renders the approved navigation under Trace, Data, Flow, and Labs:

| Area | Views |
| --- | --- |
| Trace | Algorithm Story, Before and After, Decisions, Calls and Recursion, Error Coach |
| Data | Variables, Watches, Structure Canvas, References, Mutation Explorer, Invariant Checker |
| Flow | Operation Journey, Algorithm Path, Step Table, Complexity Lab |
| Labs | Input Playground, Compare Algorithms, Edge Case Lab |

Every view displays **Unavailable** and states that no runtime evidence exists yet. Selecting a view validates navigation and purpose text only.

### Contracts and validation

Chunk 0 records stable contracts for:

- 18 view names.
- 31 normalized event names.
- 19 structure representation names.
- Required future curriculum metadata.
- The 535-program Tier A section arithmetic.

`scripts/validate-dsa-foundation.mjs` checks contract uniqueness, area membership, routing, guide destinations, required HTML ids, and the exact program target.

### Documentation and limits

`README_DSA.md` documents only implemented Chunk 0 behavior. Its limits section explains:

- Why no DSA execution limits are active yet.
- Separate editor persistence.
- Valid font sizes.
- Clipboard permission boundaries.
- Storage failure behavior.
- The zero-program and zero-event runtime state.
- Responsive presentation.
- Privacy and ordinary dependency requests.

The guide explicitly distinguishes implemented controls, approved contracts, unavailable runtime behavior, and planned curriculum.

### Verification boundary

Chunk 0 is complete only after static checks, the DSA contract validator, Python curriculum regression checks, real-browser navigation, editor interaction, persistence, themes, desktop and mobile layout, privacy review, and documentation consistency checks pass.

The 535 DSA programs remain a future Tier A target. v5 does not count the editable starter source as a curriculum program.

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
