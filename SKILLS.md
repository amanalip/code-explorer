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

## Current capability ledger

### Landing and navigation

- Dedicated landing page at `index.html`.
- Dedicated, reloadable workspace at `workspace.html`.
- Starter-program picker shared by landing and workspace flows.
- Tool Guide link to the public README.
- GitHub icon link to the repository.
- Explicit Dark mode and Light mode control.
- Copyright attribution for Aman Ali Pogaku.

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

- 54 curated examples grouped into seven concept categories and three difficulty levels.
- Category-filterable starter-program library.
- Sticky filters, accurate source-line counts, and prepared input for input-driven examples.
- Twelve 15 to 20 line Guided Challenge programs that combine earlier concepts.
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
Separate commented preview
          |
          +-- Copy commented code
          +-- Hide preview
          +-- Replace editor only after confirmation
```

Implemented guarantees:

- The original source remains unchanged by default.
- Existing comments, indentation, and blank lines are preserved.
- Comments explain purpose and observed behavior instead of repeating syntax.
- Repeated loop values are described carefully and are not presented as one universal value.
- Unsupported or ambiguous constructs receive no invented explanation.
- Comment-generation failure cannot break tracing, playback, or source editing.
- The feature is validated against all 54 included examples plus syntax-error, runtime-error, repeated-line, and unsupported cases.
- `README.md`, this file, and relevant source comments are updated in the same change.
- `lessons_learned.md` records what the feature teaches the project during implementation and testing.

## Runtime and dependency map

```text
workspace.html
     |
     v
app.js
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
- `state.currentStep` selects the snapshot used by most views.
- Changing editor source invalidates the recorded trace.
- Worker results are separated into `state.trace`, `state.loops`, `state.conditions`, `state.error`, and `state.inputLog`. Console output is retained inside each trace snapshot so moving backward reconstructs the output visible at that moment.
- Watches, bookmarks, comparisons, breakpoints, graph instances, editor preferences, and learning preferences have different lifetimes. Check their initialization and clearing behavior before reusing them.
- CodeMirror and the textarea fallback must both use `getCode()` and `setCode()` so features do not depend on one editor implementation.
- A view renderer must handle the empty state, a normal selected step, missing metadata, and an error result.
- Editing or replacing source clears `state.learningComments` because runtime facts from the old source are stale.
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
| Learning-comment metadata and preview | Current trace only |
| Commented source after confirmed replacement | Becomes ordinary locally saved editor source |

When adding persistence, validate parsed values and merge them with safe defaults. A malformed stored value must not prevent application initialization.

## Safety boundaries

- Python executes away from the main UI thread.
- The UI owns an outer 30-second execution timeout and can terminate the worker.
- The tracer records at most 3,000 steps.
- Serialized containers stop at a bounded depth and item count.
- Representations are shortened before crossing into the interface.
- Cyclic and shared objects are represented without infinite recursion.
- Only frames belonging to the learner's virtual file enter the educational call stack.
- Graphs are conceptual views and must not claim to show physical RAM addresses.
- Learner strings rendered as markup must be escaped.
- Generated comments must never claim an unobserved value or path.
- Exception events must suppress ambiguous completion, loop, and condition counts for the failing line. Python frame unwinding can otherwise make one failure resemble repeated completion.
- Comment preview, copying, and closing must leave the editor unchanged.
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

### Add a starter program

1. Keep it short enough for a beginner to inspect step by step.
2. Give it a single primary concept, category, difficulty, description, source, and optional prepared input.
3. Confirm it runs within all safety limits.
4. Inspect its Story, Variables, relevant specialist view, and final output.
5. Update the README catalog and suggested learning route.
6. Update the exact example count in this file and any learner-facing interface comment that states it.

Current library invariants:

| Dimension | Required value |
| --- | --- |
| Total | 54 |
| Categories | Foundations 8, Decisions 7, Loops 11, Functions and Scope 8, Collections 10, References and Mutation 4, Input and Debugging 6 |
| Levels | Beginner 19, Developing 22, Guided Challenge 13 |
| Extended programs | 12 programs from 15 through 20 source lines |
| Intentional failures | `IndexError`, `ValueError`, and `KeyError` in three named debugging examples |

### Change Automatic Learning Comments

1. Keep structural explanations in the worker's Python AST pass and observed facts in the trace-derived evidence pass.
2. Return finite plain metadata. Do not return a prewritten replacement document from the worker.
3. Keep level numbers stable: 1 Essential, 2 Guided, 3 Detailed.
4. Use observed facts only when the selected source line and trace support them.
5. Prefer no comment over a clever but uncertain explanation.
6. Preserve the exact `# Code Explorer:` prefix unless migration behavior is designed and documented.
7. Test original-source preservation, all detail levels, copy, cancel, confirmed replacement, rerun deduplication, existing learner comments, blank lines, and indentation.
8. Run the full 54-example corpus because it covers loops, nested conditions, functions, recursion, collections, aliases, shallow copies, input, and intentional errors.
9. Inspect representative prose manually. Schema validation can catch missing fields, but it cannot catch awkward language or misleading numeric formatting.

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

Verify all three detail levels, copy, cancel, replacement, and a second generation without duplicate `# Code Explorer:` lines.

## Current validation evidence

- All 54 starter sources parse as valid Python.
- All 54 were executed with their prepared inputs. Only the three intentionally failing debugging programs raised their documented errors.
- The complete corpus produced 421 learning-comment records during automated validation, with valid line numbers, levels, kinds, and nonempty text.
- Manual prose review caught and corrected awkward `elif` wording and overly noisy floating-point values. This is a permanent reason to combine automated schema checks with human reading.
- Browser testing of an intentional `IndexError` caught and corrected a false repeated-completion count caused by exception and frame-exit events sharing one line.
- A browser run using Pyodide confirmed the default repeated loop produced a 12-step trace, enabled Learning comments, and reported three loop-body entries.

## Documentation completion test

Before describing a feature as complete, answer all of these questions:

- Can a first-time learner discover it?
- Does the README explain why and when to use it?
- Is there a small code example or walkthrough when useful?
- Does the README state the expected behavior?
- Are limits, persistence, permissions, and failure states documented?
- Does this file identify its state, data, dependencies, risks, and tests?
- Do source comments still describe the real behavior?

If any answer is no, the feature is not fully documented.
