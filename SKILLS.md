# Code Explorer project knowledge and working playbook

This file preserves the practical knowledge needed to extend Code Explorer safely. It complements `AGENTS.md`: that file defines the rules, while this file records what the application currently does and how its major parts fit together. Reusable discoveries, mistakes, successful patterns, and deferred decisions belong in `lessons_learned.md`.

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

`Tier.md` records the Tier A, B, and C curriculum for the separate Data Structures workspace. Chunk 0 implements only the workspace foundation, shared contracts, editor controls, and honest 18-view navigation. The 535-program Tier A catalog remains an approved target with zero DSA curriculum programs shipped in Chunk 0. Do not treat a listed structure, algorithm, event, renderer, or view result as implemented unless code, verification, and learner-visible documentation prove it.

Documentation routing is implemented: `index.html` has no ambiguous Tool Guide control, its two matching primary actions open the Python and DSA paths, `workspace.html` links to `README.md`, and `data-structures.html` links to `README_DSA.md`.

The DSA guide now documents every implemented Chunk 0 limit and explicitly states which execution and visualization limits are not active because those features do not exist yet. For every later execution, serialization, display, visualization, history, comparison, explanation, complexity, persistence, platform, and curriculum boundary, `README_DSA.md` must state the verified value, what is counted, why it exists, threshold behavior, whether execution stopped or presentation was shortened, what evidence remains safe, and what the learner can try next.

The approved 535-program target has a curriculum quality contract. Counts alone never establish completion. Each section must progress from focused foundations through standard operations, meaningful variations, applied programs, and comparisons. Reject constant-only or name-only variations, filler lines, incoherent scripts, weak metadata, and examples whose recommended views have nothing useful to show. Validation must report line-count distributions and near-duplicate candidates, while human review must judge correctness, teaching depth, readability, coherent progression, and whether longer concepts received enough space. Short programs remain valid when the concept is genuinely atomic.

## Current capability ledger

### Landing and navigation

- Dedicated landing page at `index.html`.
- Dedicated, reloadable workspace at `workspace.html`.
- Dedicated DSA foundation at `data-structures.html`.
- Two matching primary learning-path actions on the landing page.
- The Python starter-program picker lives only inside `workspace.html`.
- Contextual Tool Guide links live inside their matching workspaces.
- GitHub icon link to the repository.
- Explicit Dark mode and Light mode control.
- Copyright attribution for Aman Ali Pogaku.

### DSA Chunk 0 foundation

- Separate DSA `main.py` source and editor-preference storage.
- CodeMirror Python editing with a native textarea fallback.
- Wrapping, six font sizes, complete-document Copy and Paste, and source statistics.
- Final 18-view navigation grouped under Trace, Data, Flow, and Labs.
- Static reviewed purpose text and an explicit **Unavailable** evidence state for every view.
- Disabled Run trace, examples, Automatic comments, and Learning comments until later chunks implement their evidence.
- Stable contracts for 31 event names, 19 structure representation names, required program metadata, and the 535-program Tier A arithmetic.
- `scripts/validate-dsa-foundation.mjs` checks contracts, routes, guide targets, and required HTML ids.

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
- Before and After compares adjacent snapshots.
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

- Input Playground supplies prepared responses for `input()`.
- Compare Runs stores two trace summaries for comparison.
- Trace Bookmarks saves important playback moments during the current session.

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
- Independent vertical scrolling for desktop navigation and cards, plus stacked vertical navigation above one-column cards on mobile.
- Accurate source-line counts, program counts, filter-reset scrolling, and prepared input for input-driven examples.
- A fixed recommended sequence that interleaves 12 named guided checkpoints after their listed prerequisite concepts without collecting or inferring learner progress.
- Twenty programs of at least 15 lines, including 12 guided mini programs from 18 through 31 lines.
- Three clearly labeled investigation programs that intentionally raise `IndexError`, `ValueError`, or `KeyError`. All other examples must finish without an accidental error.
- Eight Classes and Objects programs, including classes, instances, attributes, methods, constructors, inheritance, composition, and a longer object-oriented checkpoint.
- Extensive README walkthroughs, question maps, workflows, expected behavior, troubleshooting, and glossary.

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

Code Explorer does not use Vue, React, a package installation step, or a bundler. Both HTML pages load the same `app.js` and `styles.css` files directly. Their matching query versions are intentional cache busters for GitHub Pages and must be changed together when either shared asset changes.

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

## Persistence inventory

| Data | Storage behavior |
| --- | --- |
| Current Python source | Saved in local storage and restored on reload |
| Theme | Saved in local storage |
| Editor wrap and font size | Saved in local storage |
| Graph zoom | Saved in local storage |
| Watched variable names | Saved in local storage, with at most 12 valid names |
| Prepared input text | Saved in local storage |
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
2. Build stable element ids from stable program concepts.
3. Avoid rerunning layout on every selected trace step when selection styling is enough.
4. Connect the shared fit and zoom behavior.
5. Check label legibility in both themes and at several zoom levels.
6. Check that switching tabs does not produce shaking or repeated resizing.

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
