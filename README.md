# Code Explorer

> Do not just run Python code. Watch it think.

Code Explorer is a beginner-friendly Python learning tool that turns a program into a step-by-step visual story. Paste or write Python code, run a trace, and move through the recorded execution one instruction at a time.

The workspace helps answer questions that are often difficult when learning Python:

- Which line ran next?
- What changed after this instruction?
- What value does each variable hold right now?
- Is a list being changed, or is a variable being reassigned?
- Which branch of an `if` statement did Python choose?
- How many times did a loop run?
- What local variables exist inside a function?
- Which lines were reached, repeated, or skipped?
- What caused an error, and what should I inspect next?

Code Explorer is intended for learning, experimentation, demonstrations, and small Python exercises. It runs the program privately in the browser and does not require an account, project setup, or server workspace.

This README is the living beginner guide for Code Explorer. It is reviewed whenever the tool changes so its controls, examples, limits, workflows, and expected behavior remain synchronized with the website.

## Contents

- [Start here](#start-here)
- [What happens when you run a trace](#what-happens-when-you-run-a-trace)
- [Workspace map](#workspace-map)
- [The editor](#the-editor)
- [Automatic Learning Comments](#automatic-learning-comments)
- [Trace controls](#trace-controls)
- [Trace views](#trace-views)
- [Data views](#data-views)
- [Flow views](#flow-views)
- [Labs](#labs)
- [Starter programs](#starter-programs)
- [Guided beginner walkthroughs](#guided-beginner-walkthroughs)
- [Expected behavior](#expected-behavior)
- [Errors and helpful messages](#errors-and-helpful-messages)
- [Limits](#limits)
- [Saved preferences and privacy](#saved-preferences-and-privacy)
- [Tips for learning effectively](#tips-for-learning-effectively)
- [Troubleshooting](#troubleshooting)
- [Python concepts glossary](#python-concepts-glossary)

## Start here

### Your first trace

1. Open Code Explorer.
2. Select **Start exploring**.
3. Leave the starter program in the editor, or replace it with your own Python.
4. Select **Run trace**.
5. Use the **Next step** button to move through the execution.
6. Read the explanation in **Trace > Story**.
7. Open **Data > Variables** to inspect a value in detail.
8. Open **Flow > Loop Table** if the program contains a loop.

The first Python runtime load can take longer than later runs. Wait until the header reports **Python ready**.

### A small program to try

```python
price = 8
quantity = 3
total = price * quantity
print("Total:", total)
```

Expected final output:

```text
Total: 24
```

Expected learning story:

```text
Step 1: price is created with the value 8
Step 2: quantity is created with the value 3
Step 3: total is created from price * quantity
Step 4: the text and final value are sent to the console
```

The exact number of recorded steps can include function return or completion events. The important idea is that each selected step represents an observed moment in the real execution.

## What happens when you run a trace

```text
Your Python source
       |
       v
Select Run trace
       |
       v
Python executes the program
       |
       +--------------------+
       |                    |
       v                    v
Execution snapshots     Console output
       |
       v
Recorded timeline
       |
       +----------+-----------+-----------+
       |          |           |           |
       v          v           v           v
     TRACE       DATA        FLOW        LABS
       |          |           |           |
       v          v           v           v
 Explanations  Variables   Paths and   Inputs, run
 and errors    and values  loop views  comparisons,
                                      and bookmarks
```

Running a trace does not slowly execute Python in front of you. The program runs first, Code Explorer records a bounded timeline, and the playback controls let you study that timeline at your own pace.

This distinction matters for breakpoints. A Code Explorer breakpoint pauses timeline playback when it reaches a marked source line. It does not pause the original Python process while that process is running.

## Workspace map

The workspace is organized into four learning areas. Each area groups views that answer a related kind of question.

```text
CODE EXPLORER WORKSPACE
|
+-- EDITOR
|   +-- Python source
|   +-- Wrap on or off
|   +-- Font size
|   +-- Copy complete program
|   +-- Paste complete program
|   +-- Line numbers and replay breakpoints
|   +-- Automatic comments on or off inside the editor
|   +-- Exportable Learning Comments study copy
|
+-- TRACE: What is Python doing now?
|   +-- Story
|   +-- Before and After
|   +-- Conditions
|   +-- Function Journey
|   +-- Error Coach
|
+-- DATA: What values and objects exist now?
|   +-- Variables
|   +-- Watches
|   +-- Structures
|   +-- References
|   +-- Mutation Explorer
|
+-- FLOW: Where did execution travel?
|   +-- Execution Path
|   +-- Coverage
|   +-- Loop Table
|   +-- Loop Lab
|
+-- LABS: How can I experiment with the trace?
|   +-- Input Playground
|   +-- Compare Runs
|   +-- Trace Bookmarks
|
+-- PLAYBACK
|   +-- Previous
|   +-- Play or pause
|   +-- Next
|   +-- Restart
|   +-- Bookmark
|   +-- Timeline slider
|   +-- Playback speed
|
+-- CONSOLE OUTPUT
    +-- Output visible at the selected step
    +-- Runtime or syntax error details
```

### A useful question map

```text
What are you wondering?
|
+-- "What did this line do?"
|       -> Trace > Story
|
+-- "Exactly what value changed?"
|       -> Trace > Before and After
|
+-- "Why did Python choose this branch?"
|       -> Trace > Conditions
|
+-- "What happened inside the function?"
|       -> Trace > Function Journey
|
+-- "Why did the program stop?"
|       -> Trace > Error Coach
|
+-- "What is inside this variable?"
|       -> Data > Variables
|
+-- "How do I keep an eye on this name?"
|       -> Data > Watches
|
+-- "What are the indexes or keys?"
|       -> Data > Structures
|
+-- "Do two names point to the same object?"
|       -> Data > References
|
+-- "Was this list changed or replaced?"
|       -> Data > Mutation Explorer
|
+-- "Which line ran after which line?"
|       -> Flow > Execution Path
|
+-- "Which source lines were skipped?"
|       -> Flow > Coverage
|
+-- "How did values differ per iteration?"
|       -> Flow > Loop Table
|
+-- "Where am I inside the loop?"
|       -> Flow > Loop Lab
|
+-- "How do I provide input()?"
|       -> Labs > Input Playground
|
+-- "What changes when I use different input?"
|       -> Labs > Compare Runs
|
+-- "How do I save important trace moments?"
|       -> Labs > Trace Bookmarks
|
+-- "Can I read teaching comments without changing my code?"
|       -> Run a trace, then select Automatic comments
|
+-- "Can I export a real commented copy of my program?"
        -> Run a trace, then select Learning comments
```

## The editor

The editor is where you write, paste, and review the complete Python program.

### Source editing

- Python syntax is highlighted when the enhanced editor is available.
- The footer reports the current number of lines and characters.
- Your current source is saved automatically in the browser.
- Reloading the workspace restores the most recently saved source.
- Editing source after a trace clears that old trace because it no longer describes the current program.
- If the enhanced editor cannot load, Code Explorer provides a basic text editor so source editing remains available.

### Text wrapping

Select **Wrap on** or **Wrap off** in the editor toolbar.

- **Wrap on** keeps long lines inside the visible editor width.
- **Wrap off** preserves each source line on one visual row and allows horizontal scrolling.
- Wrapping changes presentation only. It does not insert newline characters into the Python source.
- The choice is remembered after a reload.

### Editor font size

Choose one of these sizes:

```text
12 px  14 px  16 px  18 px  20 px  22 px
```

The font-size choice affects editor readability only. It does not change the code or the graph zoom level. The choice is remembered after a reload.

### Copy and Paste

The toolbar actions operate on the complete editor document.

- **Copy** copies the entire Python program, not only the current selection.
- **Paste** replaces the entire editor document with plain text from the clipboard.
- Pasting new source clears an old trace.
- An empty clipboard does not erase the current program.
- If clipboard reading is blocked, Code Explorer shows a clear permission alert and suggests using `Ctrl+V` inside the editor.
- If copying is blocked, Code Explorer suggests selecting the editor and using `Ctrl+C`.

### Replay breakpoints

Select a line number in the editor gutter to add or remove a breakpoint.

```text
Source line number selected
          |
          v
Breakpoint marker appears
          |
          v
Play the recorded trace
          |
          v
Playback pauses when that source line is reached
```

Use replay breakpoints when you want automatic playback to stop before a line that deserves closer inspection.

Important behavior:

- Breakpoints affect automatic trace playback.
- Previous, Next, and the timeline slider still work normally.
- A line can be reached several times, so a loop breakpoint can pause repeatedly.
- A breakpoint does not interrupt the original live execution.

### Execution heatmap

After a trace is ready, editor lines communicate execution activity:

- The current line receives the strongest highlight.
- Reached lines are visually marked.
- Repeated lines show that a loop or repeated call visited them more than once.
- Lines that did not run remain unhighlighted.

Use **Flow > Coverage** when you want a numbered summary instead of editor highlighting.

### Automatic comments inside the editor

After a useful trace completes, select **Automatic comments off** to turn the inline learning view on. Code Explorer places trace-powered notes above supported source lines. Select **Automatic comments on** to hide them again.

This is a reading mode. The notes look like Python comments, but they are visual editor widgets rather than characters inserted into the document.

```text
ORIGINAL EDITOR DOCUMENT              VISUAL LEARNING LAYER
total = 0                             # Code Explorer: total became 0.
for number in range(1, 4):            # Code Explorer: the body ran 3 times.
    total += number                    # Code Explorer: total was updated.
          |                                      |
          +------------------+-------------------+
                             |
                             v
                 WHAT THE LEARNER SEES
                 comment, then source line
                             |
            +----------------+----------------+
            |                                 |
            v                                 v
     Copy still copies                 Trace line numbers,
     original Python                   breakpoints, and heatmap
                                       remain aligned
```

Why this matters:

- The program's natural reading flow can be restored instantly.
- Each temporary explanation has a visible **Trace note** label, so it cannot be mistaken for Python that the learner typed.
- Line numbers still refer to the real Python source.
- Breakpoints and execution highlighting do not move to artificial comment lines.
- **Copy** and **Paste** continue to operate on the original editor document.
- The learner can compare the explanation with the line it describes without opening another dialog.

The inline view follows the selected comment detail level from the Learning Comments dialog. Guided is the default. If Automatic comments is already on, changing Essential, Guided, or Detailed refreshes the visible notes immediately without rerunning Python.

Automatic comments has a deliberate lifecycle:

```text
No current trace
      |
      v
Automatic comments disabled
      |
      | successful or useful partial trace
      v
Automatic comments available, initially off
      |
      +-- select on  -> visual notes appear
      +-- select off -> visual notes disappear
      |
      +-- edit, paste, or load another program
      |                    |
      |                    v
      |           notes and stale trace are cleared
      |
      +-- start a new run
                           |
                           v
                  old notes hide while new
                  evidence is collected
```

If the enhanced CodeMirror editor cannot load, the fallback editor uses a separate read-only commented preview while the original textarea remains the actual source. This keeps the same source-protection promise in both editor modes.

## Automatic Learning Comments

**Best for:** reading explanations beside source and turning a completed trace into a portable commented study copy of the exact program you ran.

Code Explorer provides two related surfaces from the same conservative note set:

| Surface | Best use | Does it edit source? | What Copy does |
| --- | --- | --- | --- |
| **Automatic comments** editor toggle | Temporarily study explanations beside the related lines | No | The normal editor Copy action copies the original Python program |
| **Learning comments** dialog | Preview, copy, or deliberately adopt a real commented document | No by default | **Copy commented code** copies source plus generated `# Code Explorer:` lines |

Use the editor toggle when you want to preserve flow and switch explanations on and off. Use the dialog when you want a portable study artifact for notes, teaching, or later review.

### The IDE-style study view

The Learning Comments dialog presents the generated document as a read-only IDE-style study view. Its structure is designed to make a long commented program easier to scan, not to pretend that the preview is another editable file.

```text
AUTOMATIC LEARNING COMMENTS
+-- Read only status
+-- Comment detail: Essential, Guided, or Detailed
+-- Legend
|   +-- purple: trace-powered teaching note
|   +-- green: original Python source
+-- IDE study surface
|   +-- main.py tab
|   +-- visual line-number gutter
|   +-- conservative Python syntax colors
|   +-- full-width Trace note bands
|   +-- Python 3, line count, UTF-8, and LF status
+-- Copy commented code
+-- Replace editor, with confirmation
```

The study surface follows the website's Light mode or Dark mode. There is no separate IDE-theme setting to learn or save. Light mode uses a bright editor palette, while Dark mode uses a low-glare dark palette with stronger contrast for comments, strings, keywords, numbers, and note text.

The visual line numbers, file tab, legend, colors, and status strip are presentation only. **Copy commented code** copies the exact generated Python document, including real `# Code Explorer:` lines, but it never copies the visual gutter, badges, file name, or status text. The lightweight syntax coloring also changes presentation only. It does not rewrite, parse differently, or execute the displayed source.

On a narrow phone screen, the dialog becomes a compact vertical workspace. The preview scrolls inside its own bounded region, long notes wrap within their rows, and the whole page avoids sideways scrolling. On a larger screen, the same hierarchy has more room without stretching the code into an excessively wide reading line.

Automatic Learning Comments combines two kinds of evidence. Python's parsed syntax explains the role of a statement, while the completed trace supplies facts that were actually observed during this run.

```text
CURRENT PYTHON SOURCE                 COMPLETED TRACE
structure of each statement          values and execution counts
          |                                      |
          +------------------+-------------------+
                             |
                             v
                  CONSERVATIVE LEARNING NOTES
                             |
             +---------------+---------------+
             |                               |
             v                               v
      Inline editor view              Separate export preview
      source unchanged                source unchanged by default
                                             |
                                      +------+------+
                                      |             |
                                      v             v
                                 Copy the copy   Replace editor only
                                                 after confirmation
```

### How to create a commented study copy

1. Write or load a Python program.
2. Select **Run trace** and wait for the run to finish.
3. Choose a study route:
   - Select **Automatic comments off** to read notes inside the editor without changing the document.
   - Select **Learning comments** to open the export preview.
4. Choose the amount of detail.
5. Read the preview before copying or replacing anything.
6. Select **Copy commented code** to keep the editor untouched, or select **Replace editor** and confirm the replacement.

The button is disabled before a useful trace exists. This prevents Code Explorer from presenting source-only guesses as observed runtime explanations.

### Detail levels

| Level | What it includes | When to use it |
| --- | --- | --- |
| Essential | The most important structure and state-changing statements | First reading, classroom projection, or a short revision sheet |
| Guided | Essential notes plus common calls, loop bodies, conditions, and useful observed facts | Recommended for most beginners |
| Detailed | Every supported explanation that Code Explorer can justify | Careful self-study or reviewing a longer example |

Changing the detail level refreshes the export preview and any visible inline notes. It does not rerun Python and does not edit the original program.

### Example

Original program:

```python
total = 0
for number in range(1, 4):
    total += number
print(total)
```

A generated preview can look like this:

```python
# Code Explorer: Creates or updates total. This run stored 0.
total = 0
# Code Explorer: Repeats the indented block for values from range(1, 4). The body started 3 times in this run.
for number in range(1, 4):
    # Code Explorer: Updates total using its previous value and number. This line executed 3 times.
    total += number
# Code Explorer: Attempts to evaluate the supplied values and send them to Console Output with print.
print(total)
```

The exact wording depends on the source and recorded evidence. A value that changes several times is described as repeated behavior instead of being presented as one permanent value.

### What the generator can explain reliably

- Assignments and augmented assignments such as `total += number`
- `if`, `elif`, and `else` branches
- `for` and `while` loops
- Function definitions, calls, and returns
- `break` and `continue`
- `try`, `except`, `finally`, and `raise`
- `input()` and `print()` calls
- Common list, dictionary, and set mutations
- Imports, context managers, assertions, and simple expression calls
- Observed values, line execution counts, loop body counts, and condition outcomes when trace evidence is available
- An observed exception on a failing statement without claiming that the statement completed

### Accuracy boundaries

Automatic comments are learning aids, not a proof of every behavior the program could have.

- A comment describes the run that just happened. Another input may choose another branch or produce another value.
- Code Explorer does not invent a note for an unsupported or ambiguous construct.
- Long or complex values may be shortened for readability.
- Floating-point values may be labelled as approximate.
- A missed branch is not described as impossible. It only was not observed in this run.
- Syntax errors cannot produce runtime-backed comments because Python never began executing the program.

### Source protection and repeated use

Generated lines begin with `# Code Explorer:`. This recognizable prefix lets the tool remove its own older generated lines before producing another study copy, which prevents duplicate comment layers after a rerun. Comments written by the learner are preserved.

```text
Select Learning comments
          |
          v
Preview opens, source unchanged
          |
    +-----+-----+
    |           |
    v           v
  Close        Copy
    |           |
    v           v
No change   Clipboard receives
            commented copy

Replace editor
      |
      v
Confirmation required
      |
      +-- Cancel  -> source unchanged
      +-- Confirm -> commented source becomes editor source
                         and the old trace is cleared
```

After replacement, the commented source is saved like any other editor change. Run a new trace if you want the comments to reflect the new document. The separate preview itself is not stored after the trace is cleared or the page is reloaded.

## Trace controls

The playback bar controls the recorded timeline.

| Control | Meaning | Expected behavior |
| --- | --- | --- |
| Previous | Move backward one recorded step | Variables, explanation, output, and diagrams return to the earlier snapshot |
| Play or pause | Automatically advance or pause | Playback follows the selected speed and stops at the end or at a breakpoint |
| Next | Move forward one recorded step | Every active view updates to the same selected moment |
| Restart | Return to the first step | The program is not rerun |
| Star | Add or remove a bookmark | The selected step appears in Trace Bookmarks |
| Timeline slider | Jump directly to a step | Useful for long traces and granular control |
| Speed | Choose `0.5x`, `1x`, or `2x` | Changes playback delay only, not Python execution speed |

The step counter uses this form:

```text
STEP 03 / 09
```

This means the third recorded snapshot is selected out of nine total snapshots.

The percentage below the slider reports the selected position between the start and end of the trace.

### How one selected step updates the workspace

Every view follows the same selected timeline position. Moving one control never creates a separate, conflicting version of program state.

```text
Previous, Next, Play, Restart, or slider
                    |
                    v
             SELECTED TRACE STEP
                    |
        +-----------+-----------+
        |           |           |
        v           v           v
   Source line   Variables    Console so far
        |           |           |
        +-----------+-----------+
                    |
        +-----------+-----------+
        |           |           |
        v           v           v
      TRACE        DATA        FLOW
   explanation   objects     path and loop
                    |
                    v
                  LABS
        bookmarks and comparisons
```

If two views appear to tell different stories, first confirm that they are describing the same selected step and remember that some views emphasize values before a loop body update.

## Trace views

Trace views explain what Python is doing and why.

### Story

**Best for:** reading execution as a beginner-friendly narrative.

Story can show:

- The selected source line
- The kind of instruction, such as assignment, loop, condition, function call, return, output, or error
- A plain-language explanation
- Variables created, changed, or removed by the selected step
- Output produced by that particular step
- Visible variable cards with names, values, and Python types
- The active call stack and local values

Example:

```python
total = 0
total += 5
```

Possible story sequence:

```text
LINE 01 // ASSIGNMENT
Python created total and gave it the value 0.

LINE 02 // ASSIGNMENT
Python updated total from 0 to 5.
```

Story explanations are educational summaries. They describe observed trace data and common Python statement patterns. They are not a replacement for reading the source line itself.

#### Anatomy of a Story step

```text
STORY STEP
|
+-- Where am I?
|   +-- Trace step number
|   +-- Source line number
|   +-- Highlighted editor line
|
+-- What instruction is this?
|   +-- Assignment
|   +-- Condition
|   +-- Loop
|   +-- Function call or return
|   +-- Output or error
|
+-- What changed?
|   +-- Name created
|   +-- Value updated
|   +-- Name left scope
|   +-- No visible value change
|
+-- What context surrounds it?
    +-- Visible variables
    +-- Active function frames
    +-- Output produced so far
```

### Before and After

**Best for:** isolating the state change caused by one instruction.

For each affected variable, the view shows:

```text
variable name     before value     ->     after value
```

Example:

```python
points = 10
points += 3
```

At the second assignment:

```text
points             10              ->     13
```

Creation and scope changes use readable labels:

```text
not created        ->     10
value              ->     out of scope
```

If an instruction does not change a visible variable, the view says so instead of inventing a change.

### Conditions

**Best for:** understanding `if`, `elif`, and `while` decisions.

The Conditions view reports the path Python actually took.

```python
age = 20
has_ticket = True

if age >= 18 and has_ticket:
    print("Enter")
```

Expected explanation:

```text
age >= 18       True
and
has_ticket      True

True path observed
```

For supported simple expressions, Code Explorer can break a condition into readable pieces. It recognizes common primitive values, `len(name)`, comparison operators, `not`, and straightforward `and` or `or` combinations.

Code Explorer does not execute the condition a second time. This avoids repeating function calls or other side effects merely to produce an explanation.

For a complex expression that cannot be safely isolated, the view still reports the observed branch and clearly states that the result could not be decomposed.

### Function Journey

**Best for:** seeing how a function call creates a local working area and returns a value.

```text
CALLER
  global frame
      |
      v
FUNCTION
  double()
      |
      v
LOCAL VALUES
  number = 4
  result = 8
      |
      v
RETURN
  8
```

Try this program:

```python
def double(number):
    result = number * 2
    return result

answer = double(4)
print(answer)
```

The view becomes useful after execution has entered a user-defined function. Before that point, it displays a calm empty state.

The Story view also contains the call stack, which is helpful for nested function calls:

```text
global frame
    |
    +-- outer()
            |
            +-- inner()
```

The active frame shows up to six visible local values so the display remains readable.

### Error Coach

**Best for:** turning a Python failure into a specific next step.

The Error Coach shows:

1. The original Python error type and message
2. A beginner-friendly meaning
3. A practical inspection or correction suggestion

Built-in guidance is available for common failures:

| Error type | What it means in beginner language | Tiny example that can cause it | First thing to inspect |
| --- | --- | --- | --- |
| `SyntaxError` | Python could not understand the program's grammar, so execution never started. | `if ready` is missing its final colon. | Check the highlighted line and the line immediately before it for missing colons, commas, quotes, or brackets. |
| `IndentationError` | Statements inside a block do not have the indentation Python expects. It is a specialized kind of `SyntaxError`. | Writing `print("Go")` directly under `if ready:` without indenting it. | Align statements that belong to the same block and use spaces consistently. Code Explorer handles compile-time indentation problems through its syntax-error path, so the heading may say `SyntaxError` while the message describes indentation. |
| `NameError` | Python tried to use a variable or function name that has not been created in the current scope. | `print(score)` before assigning `score`. | Check spelling, capitalization, statement order, and whether the name exists inside the active function or global scope. |
| `TypeError` | An operation received a kind of value it cannot use in that way. | `"5" + 2` tries to add text and an integer. | Open Variables and compare the visible types. Convert a value only when that conversion matches the program's intention. |
| `ValueError` | The operation accepts this general type, but the particular value is unsuitable. | `int("twelve")` receives text that is not an integer representation. | Inspect the exact value, including spaces and punctuation, then validate or clean it before conversion. |
| `IndexError` | A list, tuple, string, or other sequence was asked for a position outside its available range. | `colors[2]` when `colors` contains only two items. | Inspect the sequence length. Indexes begin at `0`, so a sequence of length `2` has indexes `0` and `1`. |
| `KeyError` | A dictionary was asked for a key it does not contain. | `prices["marker"]` when only `"pen"` and `"book"` exist. | Open Structures and inspect the actual keys. Use membership checking or `dict.get()` when a missing key is an expected possibility. |
| `ZeroDivisionError` | A division or remainder operation used zero as its divisor. | `average = total / count` when `count` is `0`. | Inspect the divisor and decide what the program should do when there are no values to divide by. |
| `AttributeError` | A value does not provide the requested attribute or method. | `name.apend("!")` misspells a method and also asks a string for list-like behavior. | Inspect the value's type and check the attribute or method spelling. Different types provide different methods. |
| `EOFError` | `input()` requested another response, but Input Playground had no prepared line left. EOF means end of input. | Three calls to `input()` with only two prepared response lines. | Count the `input()` calls on the observed path and add one prepared line for each call. |

Do not read an error type as the whole explanation. A Python failure has several useful parts:

```text
ERROR TYPE
What family of problem occurred?
        |
        v
MESSAGE
What specific operation or value caused Python to stop?
        |
        v
SOURCE LINE
Which statement was active?
        |
        v
RECORDED STATE
What values, types, keys, lengths, and frames existed just before it?
        |
        v
NEXT EXPERIMENT
What one small correction or input change will test your explanation?
```

An exception is not always a programming mistake. Programs can deliberately raise and catch exceptions to handle expected problems. Error Coach is most important when an error stops the run. If the program catches the exception successfully, execution can continue into its `except` block instead.

Example:

```python
colors = ["mint", "purple"]
requested_index = 2
print(colors[requested_index])
```

Expected result:

```text
IndexError: list index out of range

Meaning:
The program requested a sequence position that does not exist.

Try this:
Remember that the first index is 0 and the final index is length minus 1.
```

Use **Before and After**, **Variables**, and **Structures** at the final step to inspect the state that produced the failure.

## Data views

Data views explain variables, containers, and object relationships at the selected step.

### Variables

**Best for:** detailed inspection of one name and its value history.

The scope browser separates:

- Global variables
- Local variables from the active function

Select a variable to inspect:

- Current value
- Python type
- Scope
- Length, when applicable
- Step where it was created
- Most recent recorded change
- Mutable or immutable behavior
- Other visible names sharing the same object
- Nested contents
- Complete meaningful value history

Example value tree:

```text
student                  dict(2)
|
+-- ["name"]             "Aman"       str
|
+-- ["scores"]           list(3)
    |
    +-- [0]              72           int
    +-- [1]              84           int
    +-- [2]              91           int
```

History rows are clickable. Selecting a history event jumps the complete workspace to that recorded step.

#### Variable lifecycle map

```text
Name does not exist
        |
        | assignment or parameter binding
        v
Name is created in a scope
        |
        +-------------------------+
        |                         |
        v                         v
Value remains unchanged     Value or object changes
        |                         |
        |                  +------+------+
        |                  |             |
        |                  v             v
        |              reassigned     mutated
        |                  |             |
        +------------------+-------------+
                           |
                           v
                    More trace steps
                           |
                 +---------+---------+
                 |                   |
                 v                   v
          still in scope       leaves scope
```

Use Value History for the vertical timeline, References for shared objects, and Mutation Explorer when the distinction between reassignment and mutation matters.

### Watches

**Best for:** following a small set of important variable names across a trace.

To watch a variable:

1. Open **Data > Variables**.
2. Select the variable.
3. Select **Watch**.
4. Open **Data > Watches**.

Each watch card shows:

- Variable name
- Current value
- Current Python type
- Whether the name is in scope
- An **Inspect** action
- A **Remove** action

If the selected step occurs before a watched variable is created, the card reports that the name is not in scope. It does not silently remove the watch.

Up to 12 names can be watched at once. Watch choices are remembered after reloads, so a watched name can remain useful across edited versions of the program.

### Structures

**Best for:** understanding indexes, keys, positions, length, and container contents.

Supported structure presentations include:

- `list`
- `tuple`
- `dict`
- `set`
- `frozenset`
- `str`

List example:

```python
colors = ["mint", "purple", "cyan"]
```

```text
colors: list, 3 items

+-------+----------+
| index | value    |
+-------+----------+
| 0     | "mint"   |
| 1     | "purple" |
| 2     | "cyan"   |
+-------+----------+
```

Dictionary example:

```python
person = {"name": "Aman", "age": 25}
```

```text
+----------+--------+
| key      | value  |
+----------+--------+
| "name"   | "Aman" |
| "age"    | 25     |
+----------+--------+
```

The view also explains whether the selected name still has its original value, references a different object, or contains an object that was changed in place.

### References

**Best for:** building a conceptual model of names and objects.

The reference map can contain:

```text
GLOBAL SCOPE
     |
     v
variable name
     |
     | references
     v
Python object or value
     |
     +-- nested item
     +-- nested item
```

Aliasing example:

```python
first = [1, 2]
second = first
second.append(3)
```

Conceptual reference map:

```text
first  --------+
               |
               v
            Object A
            [1, 2, 3]
               ^
               |
second --------+
```

Both names reference the same list object, so mutation through `second` is visible through `first`.

This is a conceptual object-reference map. It is not a display of physical RAM addresses, byte sizes, memory pages, or low-level memory allocation.

Graph controls:

- Use the slider for one-percent zoom control.
- Use minus and plus for five-percent changes.
- Use **Fit** to place the complete graph inside the visible canvas.
- Pan inside the graph when a larger program extends beyond the visible area.
- Graph zoom is available from 40% to 200%.

### Mutation Explorer

**Best for:** learning the difference between creation, mutation, and reassignment.

The Mutation Explorer focuses on mutable `list`, `dict`, and `set` values.

#### Creation

```python
items = []
```

```text
BEFORE                         AFTER
items -> name did not exist    items -> Object A: []
```

#### In-place mutation

```python
items.append("book")
```

```text
BEFORE                         AFTER
items -> Object A: []          items -> Object A: ["book"]
              \________________/
                    same object
```

#### Reassignment

```python
items = ["new"]
```

```text
BEFORE                         AFTER
items -> Object A              items -> Object B
              \________________/
                     new object
```

The view also reports visible aliases, which are other names that reference the same captured object.

#### Object-change decision tree

```text
Did the name exist before this step?
|
+-- No
|   +-- CREATION
|       name -> Object A
|
+-- Yes
    |
    +-- Does it still reference the same object?
        |
        +-- Yes
        |   |
        |   +-- Did visible contents change?
        |       +-- Yes -> MUTATION
        |       +-- No  -> UNCHANGED
        |
        +-- No
            +-- REASSIGNMENT
                name: Object A -> Object B
```

This decision tree is especially useful when Before and After shows different text but you still need to know whether object identity stayed the same.

## Flow views

Flow views summarize paths, source coverage, and loop behavior.

### How the Flow views divide the problem

```text
Latest execution
|
+-- In what order did reached lines connect?
|       -> Execution Path
|
+-- Which source lines ran or did not run?
|       -> Coverage
|
+-- What values appeared at each loop entry?
|       -> Loop Table
|
+-- Which iteration is current, complete, or waiting?
        -> Loop Lab
```

```text
Execution Path asks: "Where did Python travel?"
Coverage asks:       "Which source locations did this run touch?"
Loop Table asks:     "How did values compare across iterations?"
Loop Lab asks:       "Where am I inside the repeated process?"
```

### Execution Path

**Best for:** seeing the actual order in which source lines were reached.

Example:

```python
count = 2
while count > 0:
    print(count)
    count -= 1
print("Done")
```

Observed path:

```text
line 1: count = 2
        |
        v
line 2: while count > 0
        |
        v
line 3: print(count)
        |
        v
line 4: count -= 1
        |
        +----------------+
                         |
                         v
                  line 2 repeated
                         |
                         v
                    line 5: Done
```

Each node contains:

- Source line number
- Source text
- Number of visits

Repeated transitions receive counts. Loop-back connections are visually distinguished. Selecting a graph node jumps to the first trace step for its source line.

The graph shows the path observed during the latest run. It does not predict every theoretically possible branch.

Execution Path has the same zoom, pan, plus, minus, percentage, and Fit controls as References.

### Coverage

**Best for:** finding reached, repeated, and missed source lines.

Coverage reports:

- Percentage of nonblank, noncomment source lines reached
- Number of reached lines
- A per-line status
- Repetition count for lines reached more than once

Legend:

```text
✓    reached once
3x   reached three times
○    not reached in this run
```

Selecting a reached line jumps to its first trace step. Selecting a missed line focuses that line in the editor.

Coverage is based on the latest observed run. A missed line is not necessarily incorrect. It may belong to a valid branch that the current inputs did not choose.

### Loop Table

**Best for:** comparing variable values from one iteration to the next.

Try:

```python
total = 0

for number in range(1, 4):
    total += number

print(total)
```

Expected table shape:

```text
+-----------+--------+--------+
| Iteration | total  | number |
+-----------+--------+--------+
| 1         | 0      | 1      |
| 2         | 1      | 2      |
| 3         | 3      | 3      |
+-----------+--------+--------+
```

The table captures values at loop-entry snapshots. This means the value shown for an accumulator can represent its state before the body updates it during that iteration.

Select an iteration number to jump directly to that moment in the trace.

### Loop Lab

**Best for:** following loop progress as an ordered sequence.

Loop Lab shows:

- Loop type, such as `FOR LOOP` or `WHILE LOOP`
- Original loop source
- Current iteration number
- A progress meter
- Completed iterations
- Current iteration
- Waiting iterations
- Loop target or condition summary

```text
FOR LOOP: for number in range(1, 4)

[===========>................] Iteration 2 of 3

✓ Iteration 1     number = 1
● Iteration 2     number = 2
3 Iteration 3     waiting
```

When a program has no detected `for` or `while` loop, both loop views explain that no loop data is available.

#### Loop-reading map

```text
Enter loop
    |
    v
Choose next value or check condition
    |
    +-- Cannot continue -> leave loop
    |
    +-- Can continue
            |
            v
        Run loop body
            |
      +-----+------------------+
      |                        |
      v                        v
  ordinary end           control statement
      |                  +------+------+
      |                  |             |
      |                  v             v
      |              continue        break
      |                  |             |
      +------------------+             v
      |                              leave loop
      v
Choose next value or check again
```

Use Execution Path to see the arrows, Coverage to see skipped source, and Loop Table to see the values carried through the cycle.

## Labs

Labs help you deliberately vary, compare, and organize executions.

### Experiment cycle

```text
Choose one question
        |
        v
Prepare input or change one source value
        |
        v
Run and inspect the trace
        |
        +-- Save important step -> Trace Bookmarks
        |
        +-- Save complete run   -> Capture Run A
        |
        v
Change exactly one factor
        |
        v
Run and capture Run B
        |
        v
Compare path, state, output, and error
        |
        v
Explain why the first difference occurred
```

Keeping one deliberate change between runs makes the comparison easier to explain.

### Input Playground

**Best for:** programs that use `input()`.

Enter one response per line. Python consumes the lines from top to bottom.

Program:

```python
name = input("Your name: ")
age = int(input("Your age: "))
print(name, age)
```

Input Playground:

```text
Aman
25
```

Expected exchange:

```text
Your name: Aman
Your age: 25
Aman 25
```

Input rules:

- Each line supplies one `input()` response.
- Responses are consumed in order.
- Prepared values are plain strings, just like ordinary Python `input()` results.
- Convert a value with `int()`, `float()`, or another function when required.
- If the program asks for more values than were prepared, it stops with `EOFError` and Error Coach suggests adding another line.
- Prepared input is remembered after a reload.

### Compare Runs

**Best for:** discovering how changed input or changed source affects behavior.

Recommended workflow:

```text
Prepare first input or first source version
               |
               v
           Run trace
               |
               v
         Capture Run A
               |
               v
Change input or change the source
               |
               v
           Run trace
               |
               v
         Capture Run B
               |
               v
Compare inputs, output, step counts,
errors, and first observed difference
```

Compare Runs checks the recorded line path, console output, and visible variable state for each step. It reports the earliest recorded point where the two runs differ.

Example experiment:

```python
score = int(input("Score: "))

if score >= 50:
    print("Pass")
else:
    print("Try again")
```

Run A input:

```text
72
```

Run B input:

```text
40
```

Expected result:

- Run A prints `Pass`.
- Run B prints `Try again`.
- The comparison identifies the first trace position where path or state differs.

Use **Clear** to remove both captured comparison slots without clearing the current trace.

### Trace Bookmarks

**Best for:** creating a personal table of contents for a long trace.

1. Move to an important step.
2. Select the star in the playback controls.
3. Repeat for other important steps.
4. Open **Labs > Trace Bookmarks**.

Each bookmark includes:

- Trace step number
- Source line number
- Source text
- A jump action
- A remove action

Bookmarks belong to the current execution. Running a new trace clears them because old step numbers would no longer describe the new timeline.

## Starter programs

Select **Examples** to open a curated library of 134 programs. The library is a structured beginner curriculum, not a random code collection. It begins with the smallest useful `print()` programs, progresses through values, decisions, loops, functions, collections, references, debugging, and classes, and places 12 complete guided checkpoints after their prerequisite sections.

The current library is a blend rather than a replacement. The tested 54-program v2 corpus was reviewed, renamed or moved where useful, and combined with 80 new programs. Input, intentional errors, recursion, mutation, shallow copying, and nested collections were preserved instead of being lost during the reorganization.

Every example card shows:

- The primary topic
- A difficulty level
- The exact number of source lines
- A short learning purpose
- The views that reveal its most useful behavior
- A fixed sequence number
- Recommended prerequisite concepts for guided checkpoints
- A visible learning-error label when failure is intentional

### Filtering the library

```text
ALL 134 PROGRAMS
|
+-- 01 First Steps .................... 10
+-- 02 Variables and Types ............ 10
+-- 03 Operators and Expressions ...... 10
+-- 04 Strings ......................... 8
+-- 05 Decisions ...................... 12
+-- 06 Loops .......................... 16
+-- 07 Functions and Scope ............ 16
+-- 08 Collections .................... 16
+-- 09 References and Mutation ......... 8
+-- 10 Input, Errors and Debugging ...... 8
+-- 11 Classes and Objects .............. 8
+-- 12 Guided Mini Programs ............ 12
```

The active filter reports both the visible count and the complete count. Categories use a vertical navigation region, so a learner never has to hunt left and right for a concept.

```text
DESKTOP EXAMPLES BROWSER
+----------------------+--------------------------------------+
| CATEGORY SIDEBAR     | PROGRAM CARDS                        |
|                      |                                      |
| All programs     134 | [Hello, Python] [Store one value]    |
| 01 First Steps    10 | [A tiny calculation] [Smart Cafe]    |
| 02 Variables      10 | [More programs continue below]       |
| 03 Operators      10 |                                      |
| 04 Strings         8 | independent vertical card scrolling  |
| 05 Decisions      12 |                                      |
| 06 Loops          16 |                                      |
| 07 Functions      16 |                                      |
| 08 Collections    16 |                                      |
| 09 References      8 |                                      |
| 10 Input/Errors    8 |                                      |
| 11 Classes         8 |                                      |
| 12 Guided         12 |                                      |
|                      |                                      |
| Showing 134 of 134   |                                      |
+----------------------+--------------------------------------+

PHONE EXAMPLES BROWSER
+----------------------------------+
| vertical category region         |
| All, First Steps, Variables, ...  |
+----------------------------------+
| one-column program cards          |
| scroll down through the results   |
+----------------------------------+
```

On a wide screen, the category sidebar and card list scroll vertically as separate regions. On a narrow screen, the category region stacks above the one-column card list and keeps vertical navigation. Selecting a category returns its result list to the first program. Category names receive enough room to wrap rather than creating horizontal navigation.

The numbers are a fixed recommendation, not tracked progress. Code Explorer does not know which lesson a learner completed, whether someone is ready for a checkpoint, or how long anyone studied. There are no accounts, progress profiles, completion analytics, or learner scores. A learner may open, skip, or revisit any program at any time.

```text
Code Explorer provides             Code Explorer does not record
+-- recommended sequence           +-- completed lessons
+-- prerequisite labels            +-- study time
+-- difficulty and line count      +-- learner readiness
+-- best-view suggestions          +-- personal progress
```

### Difficulty labels

- **Beginner** examples isolate one main idea and use direct names and control flow.
- **Developing** examples combine two or more familiar ideas, such as a loop with a condition or a function with a collection.
- **Guided Challenge** examples coordinate several familiar ideas. The 12 checkpoint projects range from 18 to 31 lines and increase the amount of state, structure, and control flow a learner must follow.

A Guided Challenge is not a test you must pass before using it. Load it, run it, and study one view at a time. Moving back to a shorter example is normal learning, not failure.

### Complete 134-program catalog

#### First Steps, 10 programs

| Level | Example | Main learning goal |
| --- | --- | --- |
| Beginner | Hello, Python | Run the smallest complete Python program |
| Beginner | Print text and a number | Display different literal types together |
| Beginner | Three steps in order | Follow statements from first to last |
| Beginner | Label every answer | Make console values understandable |
| Beginner | A comment for the reader | Distinguish explanation from execution |
| Beginner | Meet four literal values | Meet text, integer, decimal, and Boolean literals |
| Beginner | Calculate inside print | Evaluate an expression before output |
| Beginner | Ask Python about a value | Inspect the type of a literal |
| Beginner | Repeat a text pattern | Multiply a string to repeat text |
| Beginner | A morning routine | Read a five-step program in order |

#### Variables and Types, 10 programs

| Level | Example | Main learning goal |
| --- | --- | --- |
| Beginner | Store one value | Assign and print one descriptive name |
| Beginner | Change a variable | Observe reassignment and value history |
| Beginner | Create two names together | Use multiple assignment |
| Beginner | A tiny calculation | Follow names through multiplication |
| Beginner | Reserve an empty result | Use `None` for a result not chosen yet |
| Beginner | Celsius to Fahrenheit | Follow arithmetic and a rounded value |
| Beginner | Building status flags | Combine Boolean facts |
| Developing | Swap two values | Exchange values with tuple assignment |
| Developing | Convert text into numbers | Convert numeric text before calculation |
| Guided Challenge | Personal profile summary | Combine text, numbers, and Boolean state |

#### Operators and Expressions, 10 programs

| Level | Example | Main learning goal |
| --- | --- | --- |
| Beginner | Add and subtract | Calculate a remaining amount |
| Beginner | Multiply and raise a power | Compare multiplication and `**` |
| Beginner | Compare two scores | Store comparison results as Booleans |
| Developing | Division and remainders | Compare `/`, `//`, and `%` |
| Developing | Pack complete boxes | Use quotient and remainder together |
| Developing | Control calculation order | Compare default precedence with parentheses |
| Developing | Require two facts | Use logical `and` |
| Developing | Accept either permission | Use logical `or` |
| Developing | Reverse a Boolean | Use logical `not` |
| Developing | Check collection membership | Compare `in` and `not in` |

#### Strings, 8 programs

| Level | Example | Main learning goal |
| --- | --- | --- |
| Beginner | Building a message | Concatenate text values |
| Beginner | Read characters by position | Use positive and negative indexes |
| Beginner | Measure a message | Count characters with `len` |
| Developing | Cleaning a username | Chain `strip`, `lower`, and `replace` |
| Developing | Slice a word | Select a range of characters |
| Developing | Format a profile sentence | Insert values with an f-string |
| Developing | Rebuild a sentence | Use `split` and `join` |
| Developing | Build initials | Clean, split, and index a name |

#### Decisions, 12 programs

| Level | Example | Main learning goal | Best views |
| --- | --- | --- | --- |
| Beginner | Pass or try again | Observe one true or false branch | Conditions, Coverage, Story |
| Developing | Checking multiple conditions | Understand `and` and its two facts | Conditions, Before and After, Coverage |
| Beginner | Different inputs, different paths | Compare branches produced by input | Input Playground, Compare Runs, Conditions |
| Developing | Grade bands | See Python stop at the first matching `elif` branch | Conditions, Coverage, Execution Path |
| Guided Challenge | Account access check | Follow nested identity and permission decisions | Conditions, Coverage, Execution Path |
| Beginner | Allowed color check | Test membership with `in` | Conditions, Structures, Coverage |
| Guided Challenge | Shipping quote | Combine membership, totals, distance, and pricing rules | Conditions, Coverage, Before and After |
| Beginner | Classify a number | Choose even or odd with modulo | Conditions, Story, Coverage |
| Developing | Positive, zero, or negative | Follow three mutually exclusive paths | Conditions, Coverage, Execution Path |
| Developing | Check a safe range | Use a chained comparison | Conditions, Story, Coverage |
| Developing | Check an empty collection | Observe list truthiness | Conditions, Structures, Coverage |
| Guided Challenge | Choose a ticket price | Combine age bands and membership | Conditions, Before and After, Coverage |

#### Loops, 16 programs

| Level | Example | Main learning goal | Best views |
| --- | --- | --- | --- |
| Beginner | Running total | Follow an accumulator through a `for` loop | Loop Table, Loop Lab, Coverage |
| Beginner | Countdown | Watch a `while` condition become false | Conditions, Execution Path, Loop Lab |
| Developing | Find the first match | See `break` end a search | Execution Path, Coverage, Loop Table |
| Developing | Skip unwanted values | See `continue` skip part of an iteration | Execution Path, Coverage, Loop Table |
| Beginner | Even number squares | Combine filtering with list building | Loop Table, Mutation Explorer, Conditions |
| Developing | Count passing scores | Change a counter only when a rule matches | Loop Table, Conditions, Watches |
| Developing | Find the highest temperature | Maintain a running maximum | Loop Table, Before and After, Conditions |
| Beginner | Save until the goal | Repeat deposits until a target is reached | Loop Lab, Loop Table, Watches |
| Guided Challenge | Process a task queue | Mutate pending and completed lists in a `while` loop | Loop Lab, Mutation Explorer, Structures |
| Guided Challenge | Build a session schedule | Coordinate nested outer and inner loops | Execution Path, Loop Table, Coverage |
| Beginner | Count by twos | Use a custom `range` step | Loop Table, Loop Lab, Execution Path |
| Developing | Number a reading list | Receive positions and values with `enumerate` | Loop Table, Variables, Structures |
| Developing | Visit product prices | Iterate through dictionary items | Loop Table, Structures, Before and After |
| Developing | Read until done | Stop at a sentinel input value | Input Playground, Loop Lab, Conditions |
| Guided Challenge | Search with a loop else | Run `else` when no `break` occurs | Execution Path, Coverage, Loop Table |
| Guided Challenge | Build labels concisely | Construct a list with a comprehension | Story, Structures, Before and After |

#### Functions and Scope, 16 programs

| Level | Example | Main learning goal | Best views |
| --- | --- | --- | --- |
| Beginner | A function call | Follow a parameter, local value, and return | Function Journey, Story, Variables |
| Developing | One function calling another | Follow nested frames and returned values | Function Journey, Story, Variables |
| Beginner | Calculate a rectangle | Move two arguments into one calculation | Function Journey, Variables, Story |
| Developing | Greeting with a default | Compare omitted and supplied default arguments | Function Journey, Compare Runs, Variables |
| Developing | Same name, different scope | Distinguish a local name from a global name | Function Journey, Variables, Watches |
| Developing | Return minimum and maximum | Return a tuple and unpack it at the caller | Function Journey, Structures, Variables |
| Guided Challenge | Recursive factorial | Watch recursive frames grow and return | Function Journey, Story, Variables |
| Guided Challenge | Invoice calculation pipeline | Pass values through several focused functions | Function Journey, Before and After, Variables |
| Beginner | Define and call a greeting | See that a body waits for a call | Function Journey, Call Stack, Story |
| Beginner | Pass a name into a function | Follow an argument into a parameter | Function Journey, Call Stack, Variables |
| Developing | Return instead of only printing | Store and reuse a returned calculation | Function Journey, Before and After, Call Stack |
| Developing | Name the supplied arguments | Use clear keyword arguments | Function Journey, Variables, Call Stack |
| Developing | Calculate without changing outside state | Observe a pure calculation | Function Journey, Before and After, Variables |
| Developing | Average a list of values | Pass a collection and return a summary | Function Journey, Structures, Call Stack |
| Guided Challenge | Validate before calculating | Use an early return | Function Journey, Conditions, Coverage |
| Guided Challenge | Use a private helper function | Follow a nested helper frame | Function Journey, Call Stack, Execution Path |

#### Collections, 16 programs

| Level | Example | Main learning goal | Best views |
| --- | --- | --- | --- |
| Beginner | Growing a list | Observe repeated list mutation | Structures, Mutation Explorer, Loop Table |
| Developing | Nested student data | Inspect a dictionary containing a list | Variables, Structures, References |
| Developing | Counting words | Create and update dictionary entries | Structures, Mutation Explorer, Loop Table |
| Beginner | First, middle, and last | Compare positive and negative list indexes | Structures, Variables, Story |
| Beginner | Unpack a coordinate | Split a tuple into named values | Structures, Variables, Before and After |
| Developing | Unique visitors | Remove duplicates with a set | Structures, Variables, Before and After |
| Developing | Update a product record | Add and replace dictionary values | Structures, Mutation Explorer, References |
| Developing | Read a small matrix | Navigate nested row and column indexes | Structures, Variables, References |
| Beginner | Select part of a list | Create a new list with slicing | Structures, References, Before and After |
| Developing | Read a fixed coordinate record | Unpack a three-value tuple | Structures, Variables, Before and After |
| Developing | Find shared interests | Use set intersection | Structures, Before and After, Variables |
| Beginner | Use a default for a missing key | Read safely with dictionary `get` | Structures, Story, Before and After |
| Developing | Build a price report | Iterate over dictionary items | Loop Table, Structures, Variables |
| Guided Challenge | Index words by length | Build a dictionary comprehension | Structures, Before and After, Story |
| Developing | Use a list as a stack | Observe last-in, first-out behavior | Structures, Mutation Explorer, Value History |
| Developing | Use a list as a small queue | Observe first-in, first-out behavior | Structures, Mutation Explorer, Value History |

#### References and Mutation, 8 programs

| Level | Example | Main learning goal | Best views |
| --- | --- | --- | --- |
| Developing | Two names sharing one list | Observe shared mutation through aliases | References, Mutation Explorer, Variables |
| Developing | Mutate or replace a list | Contrast changing an object with rebinding a name | Mutation Explorer, References, Before and After |
| Developing | Copy an outer list | See a new outer list share nested objects | References, Mutation Explorer, Structures |
| Guided Challenge | Shared settings experiment | Compare an alias, shallow copy, and nested mutation | References, Mutation Explorer, Before and After |
| Beginner | Reassign an integer | Contrast immutable values with shared mutable objects | References, Mutation Explorer, Before and After |
| Developing | Copy before changing | Change a separate shallow list copy | References, Mutation Explorer, Structures |
| Guided Challenge | Share one nested list | Observe a shared list inside two dictionaries | References, Mutation Explorer, Structures |
| Guided Challenge | Mutate a list in a function | Follow a list reference through a call | Function Journey, References, Mutation Explorer |

#### Input, Errors and Debugging, 8 programs

| Level | Example | Main learning goal | Best views |
| --- | --- | --- | --- |
| Beginner | A personalized greeting | Consume two inputs and choose a branch | Input Playground, Conditions, Compare Runs |
| Beginner | An index to investigate | Connect `IndexError` to list state | Error Coach, Variables, Structures |
| Beginner | A number to investigate | Connect `ValueError` to failed integer conversion | Error Coach, Input Playground, Variables |
| Developing | A key to investigate | Connect `KeyError` to available dictionary keys | Error Coach, Structures, Variables |
| Developing | Validate a positive number | Repeat prepared input until a value is accepted | Input Playground, Loop Lab, Conditions |
| Developing | Handle invalid number text | Catch `ValueError` and print a fallback | Input Playground, Error Coach, Coverage |
| Developing | Validate a menu choice | Repeat until input belongs to an allowed set | Input Playground, Loop Lab, Conditions |
| Guided Challenge | Reject an impossible quantity | Raise and catch a meaningful exception | Error Coach, Function Journey, Execution Path |

#### Classes and Objects, 8 programs

| Level | Example | Main learning goal | Best views |
| --- | --- | --- | --- |
| Beginner | Create a simple object | Define a class and attach one attribute | Story, Variables, Structures |
| Developing | Initialize an object | Give an instance state with `__init__` | Function Journey, Variables, Structures |
| Developing | Change object state with a method | Mutate an attribute through a method | Function Journey, Mutation Explorer, Structures |
| Developing | Keep objects independent | Compare state on two instances | References, Structures, Variables |
| Developing | Ask an object for a result | Return a calculation from a method | Function Journey, Structures, Before and After |
| Guided Challenge | Share a class-level value | Compare class and instance attributes | Structures, References, Variables |
| Guided Challenge | Extend a base class | Inherit shared behavior | Function Journey, Call Stack, Structures |
| Guided Challenge | Place one object inside another | Explore composition and nested objects | Structures, References, Function Journey |

#### Guided Mini Programs, 12 programs

| Checkpoint | Program | Recommended prerequisites | Length |
| ---: | --- | --- | ---: |
| 01 | Smart Cafe Bill | Variables, arithmetic, simple conditions, output | 27 lines |
| 02 | Quiz Score Reporter | Variables, lists, loops, conditions | 22 lines |
| 03 | Temperature Week Summary | Lists, `for` loops, running totals, conditions | 19 lines |
| 04 | Habit Streak Tracker | Lists, loops, counters, conditions | 19 lines |
| 05 | Personal Expense Summary | Functions, lists, dictionaries, loops | 28 lines |
| 06 | Student Gradebook | Dictionaries, lists, loops, averages | 18 lines |
| 07 | Inventory Assistant | Nested records, loops, conditions | 19 lines |
| 08 | Classroom Attendance Report | Lists, sets, dictionaries, loops | 24 lines |
| 09 | Word and Sentence Analyzer | String methods, lists, dictionaries, loops | 24 lines |
| 10 | Library Loan Tracker | Functions, nested dictionaries, mutation | 25 lines |
| 11 | Resilient Order Intake | Input, conversion, exception handling, conditions | 31 lines |
| 12 | Object-Oriented Pet Care Tracker | Classes, methods, instances, lists, loops | 27 lines |

Guided checkpoints are interleaved in **All programs** after their prerequisite sections. The Guided Mini Programs filter also collects all 12 in one place. A prerequisite is advice, not a lock. The application does not record whether it was completed.

Three debugging examples intentionally stop. Their failure is the lesson, not a broken example:

| Investigation | Why Python stops | Evidence to inspect | A reasonable correction experiment |
| --- | --- | --- | --- |
| **An index to investigate** | It requests index `2` from a two-item list. The available indexes are `0` and `1`, so Python raises `IndexError`. | Open Structures to count the items and Variables to inspect `requested_index`. | Change the requested index to `1`, or check that the index is smaller than `len(colors)` before reading it. |
| **A number to investigate** | It passes the prepared text `"twelve"` to `int()`. That text does not represent an integer, so Python raises `ValueError`. | Open Input Playground to see the original text and Variables to distinguish the text from a converted number. | Prepare `12`, or validate the text and catch `ValueError` before continuing. |
| **A key to investigate** | It requests `"marker"` from a dictionary containing only `"pen"` and `"book"`, so Python raises `KeyError`. | Open Structures to inspect the existing keys and Variables to inspect `requested_item`. | Request an existing key, check `requested_item in prices`, or use `prices.get(requested_item)` when absence is expected. |

These cards show an **Intentional learning error** warning before opening. Do not fix them immediately. First predict the error, run the trace, inspect the final recorded state, explain the mismatch in your own words, and then make one small correction.

### Learning ladders

Use a ladder when 134 choices feel like too many. Each row is a fixed suggested order, not a tracked requirement.

| Goal | Start | Continue | Finish |
| --- | --- | --- | --- |
| Start from scratch | Hello, Python | Store one value | Smart Cafe Bill |
| Understand values | Store one value | Division and remainders | Personal profile summary |
| Understand decisions | Pass or try again | Grade bands | Quiz Score Reporter |
| Understand `for` loops | Running total | Count passing scores | Temperature Week Summary |
| Understand `while` loops | Countdown | Save until the goal | Process a task queue |
| Understand functions | A function call | Same name, different scope | Invoice calculation pipeline |
| Understand collections | Growing a list | Update a product record | Inventory restock report |
| Understand references | Two names sharing one list | Copy an outer list | Shared settings experiment |
| Learn from errors | An index to investigate | A key to investigate | Fix each example and rerun it |
| Understand objects | Create a simple object | Change object state with a method | Object-Oriented Pet Care Tracker |

```text
ONE CONCEPT
Beginner example
      |
      v
COMBINE TWO IDEAS
Developing example
      |
      v
READ A COMPLETE SMALL PROGRAM
Guided Challenge
      |
      v
CHANGE ONE INPUT OR VALUE
Compare Runs
      |
      v
EXPLAIN IT IN YOUR OWN WORDS
Learning comments and bookmarks
```

### What selecting an example does

```text
Select an example card
        |
        +-- Replaces the complete editor source
        +-- Clears any trace belonging to older source
        +-- Saves the new source in the browser
        +-- Closes the example dialog
        +-- Prepares sample input when the example needs input()
```

If you want to keep your current program, use **Copy** before choosing another example.

Examples that call `input()` prepare safe sample responses automatically. Selecting one replaces the Input Playground text with the values required by that example.

```text
Different inputs, different paths: 72
A personalized greeting: Aman, then 25
A number to investigate: twelve
Validate a positive number: -3, then 7
Read until done: Read chapter, Practise loops, then done
Validate a menu choice: 9, then 2
Resilient Order Intake: Notebook, 3, then yes
```

You can replace these values in Input Playground before running.

### A broad first-time route

```text
Hello, Python
        |
        v
Store one value
        |
        v
Add and subtract
        |
        v
Pass or try again
        |
        v
Smart Cafe Bill
        |
        v
Running total -----> Countdown
        |                 |
        v                 v
A function call     Checking multiple conditions
        |                 |
        v                 v
Growing a list      Find and skip loop examples
        |                 |
        +--------+--------+
                 |
                 v
 Two names sharing one list
       and nested data
                 |
                 v
        Input comparison and errors
                 |
                 v
      Functions and collections
                 |
                 v
       Classes and objects
                 |
                 v
 Object-Oriented Pet Care Tracker
                 |
                 v
       Turn on Automatic comments
       Export a study copy if useful
```

## Guided beginner walkthroughs

The walkthroughs below are lessons, not merely demonstrations. For each one, predict first, inspect several views, explain what happened, and then change the program to test your understanding.

### Walkthrough 1: Run your first complete trace

**Learning objective:** understand the relationship between source lines, trace steps, variable state, and console output.

Load **Variables and Types > A tiny calculation**:

```python
price = 8
quantity = 3
total = price * quantity
print("Total:", total)
```

Before running, predict:

1. Which variable will be created first?
2. What value will `total` receive?
3. Which line will produce output?

Procedure:

1. Select **Run trace**.
2. Confirm that the counter reports four recorded steps.
3. Stay in **Trace > Story**.
4. Select **Next** once at a time.
5. At each step, compare the selected source line with the variable cards.
6. Move backward once and confirm that later variables disappear from that earlier snapshot.
7. Drag the timeline slider to the final step.

Expected state progression:

```text
Step 1     price = 8
Step 2     price = 8, quantity = 3
Step 3     price = 8, quantity = 3, total = 24
Step 4     output includes Total: 24
```

Expected final output:

```text
Total: 24
```

Why it behaves this way: Python executes ordinary top-level statements from top to bottom. The multiplication reads two existing names and assigns the result to a third name.

Common misunderstanding: the trace does not create additional program behavior. It records the behavior that actually occurred.

Try changing:

```python
quantity = 5
```

Check your answer: the final `total` and output should become `40`, while the source path remains the same.

### Walkthrough 2: Follow one variable through time

**Learning objective:** use variable history, Watches, and Before and After to study reassignment.

Paste:

```python
balance = 10
balance = balance + 5
balance = balance * 2
print(balance)
```

Before running, write the three expected values of `balance` on paper.

Procedure:

1. Run the trace.
2. Open **Trace > Before and After**.
3. Select each assignment step.
4. Confirm the transitions `not created -> 10`, `10 -> 15`, and `15 -> 30`.
5. Open **Data > Variables** and select `balance`.
6. Read its creation step and last-change step.
7. Select each row in Value History to jump through time.
8. Select **Watch**, then open **Data > Watches**.
9. Move backward and forward to see the watch card update.

Expected history:

```text
created     10
changed     15
changed     30
```

Expected final output:

```text
30
```

Why it behaves this way: the right side of an assignment is evaluated using the current value, and the resulting value becomes the new value associated with the name.

Common misunderstanding: `balance = balance + 5` is not an algebra equation. It is an ordered instruction.

Challenge: replace the second line with `balance += 5`.

Check your answer: the final result remains `30`, and Story should still explain an update to `balance`.

### Walkthrough 3: Build and inspect a string

**Learning objective:** see that strings are values with indexed contents and that concatenation creates a new string.

Load **Strings > Building a message**:

```python
language = "Python"
adjective = "visual"
message = language + " is " + adjective
print(message)
```

Before running, predict the spaces in the final string exactly.

Procedure:

1. Run the trace.
2. Open **Trace > Before and After** when `message` is created.
3. Confirm that the before value says `not created`.
4. Open **Data > Variables** and select `message`.
5. Confirm that its type is `str` and its length is reported.
6. Open **Data > Structures**.
7. Inspect the character indexes at the beginning of the string.
8. Move to the print step and confirm the console output.

Expected output:

```text
Python is visual
```

Why it behaves this way: `+` concatenates strings in their written order. The spaces come from the literal `" is "`.

Common misunderstanding: Python does not automatically insert spaces when strings are joined with `+`.

Challenge: add another variable and include it in the message:

```python
audience = "beginners"
```

Check your answer: if you append `" for " + audience`, the output should become `Python is visual for beginners`.

### Walkthrough 4: Compare a true branch with a false branch

**Learning objective:** connect a condition result to reached and missed source lines.

Load **Decisions > Pass or try again**:

```python
score = 72

if score >= 50:
    result = "Pass"
else:
    result = "Try again"

print(result)
```

Before running, predict which assignment will be skipped.

Procedure for Run A:

1. Run the trace.
2. Open **Trace > Conditions**.
3. Confirm that `score >= 50` followed the True path.
4. Open **Flow > Coverage**.
5. Identify the reached `Pass` line and missed `Try again` line.
6. Capture this execution as Run A in **Labs > Compare Runs**.

Procedure for Run B:

1. Change `score` to `40`.
2. Run the trace again.
3. Confirm the False path in Conditions.
4. Confirm that the coverage states of the branch bodies are reversed.
5. Capture this execution as Run B.
6. Read the first observed comparison difference.

Expected outputs:

```text
Run A: Pass
Run B: Try again
```

Why it behaves this way: Python executes exactly one of the two branch bodies for each evaluation of this condition.

Common misunderstanding: a missed branch is not necessarily broken. It was simply not selected by this run.

Challenge: test the boundary value `50`.

Check your answer: `50 >= 50` is True, so the output should be `Pass`.

### Walkthrough 5: Decompose a compound condition

**Learning objective:** understand how `and` combines two Boolean facts.

Load **Decisions > Checking multiple conditions**:

```python
age = 20
has_ticket = True

if age >= 18 and has_ticket:
    result = "Enter"
else:
    result = "Wait"

print(result)
```

Before running, evaluate each part separately:

```text
age >= 18       ?
has_ticket      ?
combined with and
```

Procedure:

1. Run the trace.
2. Open **Trace > Conditions**.
3. Read each supported condition piece.
4. Confirm that both pieces are True.
5. Open **Trace > Before and After** to see `result` created.
6. Open **Flow > Coverage** to locate the missed alternative.

Expected output:

```text
Enter
```

Why it behaves this way: an `and` expression is True only when both required facts are truthy.

Common misunderstanding: changing only `age` is not the only way to choose the alternative. A missing ticket also makes the combined result False.

Challenge: change `has_ticket` to `False` without changing `age`.

Check your answer: the output should become `Wait` and the false branch should be covered.

### Walkthrough 6: Read a for loop as a table

**Learning objective:** follow a loop target and accumulator across iterations.

Load **Loops > Running total**:

```python
total = 0

for number in range(1, 4):
    total += number
    print("Added", number)

print("Total:", total)
```

Before running, complete this prediction table:

```text
+-----------+--------+--------------+
| number    | before | after adding |
+-----------+--------+--------------+
| 1         | ?      | ?            |
| 2         | ?      | ?            |
| 3         | ?      | ?            |
+-----------+--------+--------------+
```

Procedure:

1. Run the trace.
2. Open **Flow > Loop Table**.
3. Select each iteration number and observe the selected trace step.
4. Open **Flow > Loop Lab** and compare current, completed, and waiting iterations.
5. Open **Data > Watches** after watching `total` and `number`.
6. Play the trace at `0.5x` speed.
7. Observe the repeated editor-line heatmap.

Expected accumulator sequence:

```text
0 -> 1 -> 3 -> 6
```

Expected final output:

```text
Added 1
Added 2
Added 3
Total: 6
```

Why it behaves this way: `range(1, 4)` produces `1`, `2`, and `3`. The ending value `4` is excluded.

Common misunderstanding: Loop Table records loop-entry snapshots, so an accumulator cell can show its value before the body updates it for that iteration.

Challenge: change the range to `range(1, 6)`.

Check your answer: there should be five iterations and the final total should be `15`.

### Walkthrough 7: Watch a while loop finish

**Learning objective:** understand repeated condition checks and the final false result.

Load **Loops > Countdown**:

```python
count = 3

while count > 0:
    print(count)
    count -= 1

print("Lift off!")
```

Before running, predict the value of `count` when the loop ends.

Procedure:

1. Run the trace.
2. Open **Trace > Conditions** at a loop check.
3. Follow `count > 0` while it is True.
4. Use **Flow > Execution Path** to identify the loop-back edge.
5. Open **Flow > Loop Lab** and move through each iteration.
6. Continue until Story explains that the loop has no more iterations.
7. Confirm that `Lift off!` prints only after the loop exits.

Expected state sequence:

```text
count = 3
count = 2
count = 1
count = 0
condition becomes False
```

Expected output:

```text
3
2
1
Lift off!
```

Why it behaves this way: the body decreases `count`, and Python checks the condition again before each possible iteration.

Common misunderstanding: the value `0` is reached, but it is not printed inside the loop because `0 > 0` is False.

Challenge: remove `count -= 1` only as a thought experiment.

Check your reasoning: the loop would never make progress and Code Explorer would eventually stop it through a safety limit.

### Walkthrough 8: See break and continue change a path

**Learning objective:** distinguish ending a loop from skipping the rest of one iteration.

First load **Loops > Find the first match**:

```python
numbers = [4, 7, 12, 15]
target = 12
found_at = -1

for index in range(len(numbers)):
    if numbers[index] == target:
        found_at = index
        break

print("Found at:", found_at)
```

Procedure for `break`:

1. Run the trace.
2. Open **Flow > Execution Path**.
3. Notice that no later iteration follows the successful match.
4. Open **Flow > Coverage**.
5. Confirm that the assignment and `break` lines were reached.
6. Open **Flow > Loop Table** and count the entered iterations.

Expected output:

```text
Found at: 2
```

Now load **Loops > Skip unwanted values**:

```python
kept = []

for number in range(1, 7):
    if number % 2 == 0:
        continue
    kept.append(number)

print(kept)
```

Procedure for `continue`:

1. Run the trace.
2. Watch that all six loop values are considered.
3. Confirm that `kept.append(number)` is skipped for even values.
4. Compare the repeated paths and coverage.

Expected output:

```text
[1, 3, 5]
```

Why they differ:

```text
break       -> leave the loop completely
continue    -> skip to the next iteration
```

Common misunderstanding: `continue` does not finish the loop.

Challenge: change the target in the first program to `99`.

Check your answer: every iteration should run and `found_at` should remain `-1`.

### Walkthrough 9: Follow parameters and a return value

**Learning objective:** observe a function frame, parameter binding, local calculation, and returned result.

Load **Functions and Scope > A function call**:

```python
def double(number):
    result = number * 2
    return result

answer = double(4)
print(answer)
```

Before running, identify which names should be global and which should be local.

Procedure:

1. Run the trace.
2. Move forward until Python enters `double()`.
3. Open **Trace > Function Journey**.
4. Confirm that the parameter `number` receives `4`.
5. Confirm that `result` is local to `double()`.
6. Return to **Trace > Story** and inspect the call stack.
7. Open **Data > Variables** while the function is active.
8. Move past the return and observe the local frame leave scope.
9. Confirm that global `answer` receives `8`.

Expected journey:

```text
global frame
    |
    v
double(number = 4)
    |
    v
result = 8
    |
    v
return 8
    |
    v
answer = 8
```

Expected output:

```text
8
```

Common misunderstanding: `result` and `answer` can hold the same value while belonging to different scopes.

Challenge: call `double(7)` instead.

Check your answer: the local `result`, returned value, global `answer`, and output should all become `14`.

### Walkthrough 10: Follow one function calling another

**Learning objective:** understand nested function frames and values moving through multiple calls.

Load **Functions and Scope > One function calling another**:

```python
def add_tax(price):
    return price * 1.10

def final_price(price, discount):
    reduced = price - discount
    return add_tax(reduced)

total = final_price(50, 5)
print(round(total, 2))
```

Before running, calculate the reduced price and then the taxed price.

Procedure:

1. Run the trace.
2. Move into `final_price()`.
3. Open **Trace > Function Journey** and inspect its parameters.
4. Move to the call to `add_tax(reduced)`.
5. Return to Story and inspect the stacked frames.
6. Confirm that `reduced` from the caller becomes `price` in `add_tax()`.
7. Follow both returns back to the global frame.
8. Inspect `total` in Variables.

Expected value journey:

```text
50 - 5
   |
   v
reduced = 45
   |
   v
add_tax(price = 45)
   |
   v
49.5 returned
   |
   v
total = 49.5
```

Expected output:

```text
49.5
```

Common misunderstanding: both functions use a parameter named `price`, but each active frame owns its own local name.

Challenge: change the discount to `10`.

Check your answer: `(50 - 10) * 1.10` produces `44.0`.

### Walkthrough 11: Open nested dictionary and list data

**Learning objective:** navigate a container inside another container and observe a nested mutation.

Load **Collections > Nested student data**:

```python
student = {
    "name": "Aman",
    "scores": [72, 84]
}

student["scores"].append(91)
average = sum(student["scores"]) / len(student["scores"])

print(student["name"], round(average, 1))
```

Before running, predict the final length of `student["scores"]`.

Procedure:

1. Run the trace.
2. Open **Data > Variables** and select `student`.
3. Expand the dictionary and then its `scores` list.
4. Move to the `append()` step.
5. Open **Trace > Before and After**.
6. Open **Data > Structures** and inspect the dictionary keys.
7. Open **Data > References** to see the dictionary and nested list as separate conceptual objects.
8. Move to the calculation of `average`.

Expected structure:

```text
student
|
+-- "name"   -> "Aman"
|
+-- "scores" -> [72, 84, 91]
```

Expected output:

```text
Aman 82.3
```

Why it behaves this way: the dictionary stores a reference to a list. Appending changes that nested list without replacing the outer dictionary.

Common misunderstanding: nested containers are not flattened into one value. Each container has its own contents and identity.

Challenge: append `100` before calculating the average.

Check your answer: the scores length becomes four and the rounded average becomes `86.8`.

### Walkthrough 12: Understand two names sharing one list

**Learning objective:** use References and Mutation Explorer to understand aliasing.

Load **Collections > Two names sharing one list**:

```python
first = [1, 2]
second = first
second.append(3)

print("first:", first)
print("second:", second)
```

Before running, decide whether `first` will include `3`.

Procedure:

1. Run the trace.
2. Move to the step where `second` is created.
3. Open **Data > References**.
4. Confirm that both names connect to one list object.
5. Move to `second.append(3)`.
6. Open **Data > Mutation Explorer**.
7. Confirm that Object A remains Object A while its contents change.
8. Open Variables and check the **Shared with** fact.

Expected conceptual map:

```text
first  -----+
            |
            v
         Object A
         [1, 2, 3]
            ^
            |
second -----+
```

Expected output:

```text
first: [1, 2, 3]
second: [1, 2, 3]
```

Why it behaves this way: `second = first` copies the reference to the list. It does not create an independent copy of the list.

Common misunderstanding: two variable names do not guarantee two objects.

Challenge: replace the second line with `second = first.copy()`.

Check your answer: after appending through `second`, `first` should remain `[1, 2]` while `second` becomes `[1, 2, 3]`.

### Walkthrough 13: Compare mutation with reassignment

**Learning objective:** distinguish changing Object A from connecting a name to Object B.

Load **Collections > Mutate or replace a list**:

```python
items = []
original = items

items.append("book")
items = ["new"]

print("original:", original)
print("items:", items)
```

Before running, predict the final values of both names.

Procedure:

1. Run the trace.
2. Move to `items.append("book")`.
3. Open **Data > Mutation Explorer** and read **same object**.
4. Open References and confirm that `items` and `original` share Object A.
5. Move to `items = ["new"]`.
6. Return to Mutation Explorer and read **new object**.
7. Open References again.
8. Confirm that `original` still points to Object A while `items` points to Object B.
9. Use Before and After to inspect the reassignment.

Expected identity story:

```text
After append:
items --------+
              v
           Object A: ["book"]
              ^
original -----+

After reassignment:
original -----> Object A: ["book"]
items --------> Object B: ["new"]
```

Expected output:

```text
original: ['book']
items: ['new']
```

Common misunderstanding: reassignment does not travel backward and rename or erase the earlier object while another name still references it.

Challenge: replace `items = ["new"]` with `items.clear()`.

Check your answer: both `items` and `original` should then show the same empty Object A because `clear()` mutates the shared list.

### Walkthrough 14: Compare inputs and investigate a failure

**Learning objective:** combine Input Playground, Compare Runs, breakpoints, Watches, bookmarks, Coverage, and Error Coach into a repeatable debugging method.

Part A uses **Decisions > Different inputs, different paths**:

```python
score = int(input("Score: "))

if score >= 50:
    message = "Pass"
else:
    message = "Try again"

print(message)
```

Procedure for comparison:

1. Open **Labs > Input Playground** and confirm the prepared value `72`.
2. Run the trace and capture Run A.
3. Watch `score` and `message` in Data.
4. Bookmark the condition step.
5. Change the prepared input to `40`.
6. Run again and capture Run B.
7. Open Compare Runs and read the earliest difference.
8. Open Conditions and Coverage to connect that difference to the selected branch.

Expected outputs:

```text
Run A with 72: Pass
Run B with 40: Try again
```

Part B uses **Input, Errors and Debugging > An index to investigate**:

```python
colors = ["mint", "purple"]
requested_index = 2
print(colors[requested_index])
```

Before running, list the valid indexes for a two-item list.

Procedure for investigation:

1. Select source line 3 in the editor gutter to add a replay breakpoint.
2. Run the trace.
3. Select Play and confirm that replay pauses at the marked line.
4. Bookmark the paused step.
5. Move to the final step.
6. Read **Trace > Error Coach**.
7. Watch `requested_index`.
8. Inspect `colors` in Structures.
9. Compare its indexes `0` and `1` with the requested index `2`.
10. Open Coverage and confirm which lines were reached before failure.

Expected error:

```text
IndexError: list index out of range
```

Debugging flow:

```text
Read the original error
          |
          v
Locate the failing source line
          |
          v
Inspect variables and structures
          |
          v
Compare expected and actual values
          |
          v
Form one small correction
          |
          v
Run a new trace and verify
```

Common misunderstanding: changing the index to `1` is not merely hiding the error. It makes the request valid because `1` is the final index of a two-item list.

Final challenge: change `requested_index` to `1` and run again.

Check your answer: the trace should finish successfully and print `purple`.

## Expected behavior

### Workspace state map

```text
Open workspace
     |
     v
READY FOR SOURCE
     |
     | select Run trace
     v
RUNNING
     |
     +-- Stop selected ---------> STOPPED
     |
     +-- Safety limit reached --> LIMIT MESSAGE
     |
     +-- Syntax failure --------> ERROR COACH, no timeline
     |
     +-- Runtime failure -------> ERROR COACH, partial timeline
     |
     +-- Success ---------------> TRACE READY
                                      |
                         +------------+------------+
                         |                         |
                         v                         v
                    inspect steps             edit source
                         |                         |
                         +-------------------------+
                                      |
                                      v
                              old trace is cleared
```

### Before running

- Empty views explain what data they need.
- Playback controls remain disabled.
- **Automatic comments** remains disabled because there are no trace-backed notes to show.
- **Learning comments** remains disabled because no runtime evidence exists yet.
- The console says output will appear there.
- The header may report that Python is loading.

### While running

- **Run trace** enters a loading state.
- A **Stop** button becomes available.
- Any inline notes from the previous trace hide immediately so they cannot be mistaken for evidence from the new run.
- The console explains that a safe trace is being prepared.
- The interface remains separate from the Python execution.

### After a successful run

- Playback controls become available.
- The first trace step is selected.
- Editor line activity appears.
- Story, Data, Flow, and Lab views receive data from the same timeline.
- Console output follows the selected step.
- Selecting another step updates every view consistently.
- **Automatic comments** becomes available in the off state. Turning it on adds visual notes without adding source lines.
- **Learning comments** becomes available and opens a separate preview of the current source with trace-backed teaching notes.

### After editing source

- The source is saved automatically.
- The previous trace is cleared.
- Old coverage, path, loop, variable, and bookmark results disappear.
- Visible automatic comments disappear immediately.
- Old generated learning-note metadata disappears, and both **Automatic comments** and **Learning comments** become disabled.
- A new **Run trace** is required.

### After a runtime error

- Steps recorded before the failure remain inspectable.
- The failing line and original Python message are shown.
- Error Coach provides beginner guidance.
- Console output produced before the error remains available.
- Automatic comments and Learning comments may still be available for statements that Python parsed and for trace evidence recorded before the failure.

### After a syntax error

- Python does not produce an execution timeline because the program could not start.
- Code Explorer points to the syntax line when available.
- Error Coach opens with a grammar-focused suggestion.
- Automatic comments and Learning comments remain disabled because there is no valid parsed program or runtime trace to support them.

## Errors and helpful messages

This section contains two different kinds of messages:

```text
Python error
+-- comes from the learner program
+-- examples: NameError, TypeError, IndexError
+-- investigate with Error Coach and recorded state

Code Explorer status or limit
+-- comes from the learning workspace
+-- examples: Runtime unavailable, trace limit reached
+-- follow the recovery action in the table below
```

The table below explains workspace messages. For Python exception types, use the detailed [Error Coach reference](#error-coach).

| Message or situation | Meaning | What to do |
| --- | --- | --- |
| Add some Python code first | The editor contains no executable source | Enter or load a program |
| Python ready | The browser runtime can run a trace | Select Run trace |
| Runtime unavailable | Python could not load | Check the connection and reload |
| Execution stopped | Stop was selected | Reduce the work or run again when ready |
| Execution time limit reached | The program ran for 30 seconds | Check for an infinite loop or reduce work |
| Trace limit reached | 3,000 snapshots were recorded | Reduce loop iterations, calls, or source size |
| Input Playground has no prepared value left | `input()` was called too many times | Add one response line per call |
| Clipboard permission is blocked | The browser denied clipboard reading | Allow permission or use `Ctrl+V` |
| Graph renderer unavailable | The optional graph could not load | Check the connection; other views still work |
| No loop detected yet | No supported loop was found or reached | Run a program containing `for` or `while` |
| No references yet | No completed trace is available | Run the program first |
| Name is not in scope | The watched name does not exist at this step | Move to a later step or inspect another scope |
| Learning comments is disabled | No supported completed trace exists for the current source | Run the current program, or correct a syntax error and run again |
| A source line has no generated note | The construct is unsupported, ambiguous, or not useful at the chosen detail level | Choose Detailed, or study that line with Story and Before and After |
| Replace editor asks for confirmation | The action will replace the complete editor document | Review the preview, then confirm or cancel |

## Limits

Limits keep the workspace responsive and the visual explanations readable.

### What to do when a limit appears

```text
Program stopped by a safety limit
|
+-- Message says 3,000 trace steps
|   +-- Reduce loop iterations
|   +-- Test a smaller collection
|   +-- Isolate one function
|   +-- Remove unnecessary repeated calls
|
+-- Message says 30 seconds
|   +-- Check for an infinite while loop
|   +-- Confirm loop state changes toward an exit
|   +-- Remove delays or intensive work
|   +-- Use a smaller teaching input
|
+-- A value preview says items were omitted
    +-- Read the reported true length
    +-- Inspect a smaller sample
    +-- Remember that Python kept the complete live value
```

### Execution safety limits

| Limit | Value | What happens at the limit |
| --- | ---: | --- |
| Maximum trace | 3,000 steps | Execution stops with a clear trace-limit message |
| Execution timeout | 30 seconds | The run is stopped and the Python runtime is reset |

### Visualization limits

| Area | Display limit | Purpose |
| --- | ---: | --- |
| Watches | 12 variable names | Keeps the dashboard focused |
| Container preview | 30 child items | Prevents very large values from overwhelming each step |
| Nested value preview | 4 levels | Prevents cycles and excessive nesting |
| Compact value text | About 120 characters | Keeps cards readable while showing a useful preview |
| Variable history | 200 meaningful rows | Keeps long traces navigable |
| Loop Lab | 40 iterations | Keeps the visual iteration list concise |
| Loop Table | 100 iterations and up to 5 variable columns | Keeps comparisons readable |
| Reference map | Up to 180 graph elements | Protects graph performance |
| Graph zoom | 40% to 200% | Supports overview and close inspection |

A shortened display does not mean Python shortened the live value. It means the visual snapshot shows a bounded preview. Length information and omitted-item messages help indicate when more data exists.

### Best-fit program size

Code Explorer works best with:

- Beginner exercises
- Small scripts
- Variables and expressions
- `if`, `elif`, and `else`
- `for` and `while` loops
- User-defined functions
- Lists, tuples, dictionaries, sets, and strings
- Short input-driven programs
- Small algorithm examples

Code Explorer is not intended to replace a complete local Python development environment. Very large algorithm runs, long recursion, intensive numerical work, interactive graphical programs, operating-system access, and programs requiring many external packages may not fit the visual trace limits.

## Saved preferences and privacy

Code Explorer runs the learner's program inside the browser.

### No analytics and no user-data collection

Code Explorer does not collect learner data for analytics, telemetry, advertising, profiling, product metrics, or behavior tracking. There is no account system, application server, analytics SDK, tracking pixel, cookie, browser fingerprint, event beacon, remote log collector, crash-report upload, or hidden form submission in the project.

```text
LEARNER SOURCE AND INPUT
          |
          v
Browser page
          |
          v
Local Web Worker running Pyodide
          |
          v
Trace returned to the same browser page

No analytics endpoint
No Code Explorer database
No learner profile
No source upload
```

The audited privacy behavior is:

| Data or action | Where it goes | Is it collected by Code Explorer? |
| --- | --- | --- |
| Python source | Local browser storage and the page's local Web Worker | No |
| Prepared `input()` responses | Local browser storage and the local Web Worker | No |
| Trace snapshots and console output | Memory in the current browser page | No |
| Theme, editor, graph, watch, and input preferences | Local browser storage for this site | No |
| Clipboard text | Read or written only after the learner selects Paste or Copy and the browser permits it | No |
| Automatic comments and bookmarks | Current browser session, unless commented source is deliberately copied or adopted | No |
| Analytics events | No analytics system exists | No |

Local storage is persistence, not collection. The application reads those values back on the same browser origin and contains no code that uploads them.

Code Explorer does make ordinary network requests to load the website and pinned browser dependencies. Current external assets include fonts from Google Fonts, editor and graph modules from `esm.sh`, and Pyodide from jsDelivr. GitHub Pages serves the deployed website. Those providers can receive normal web-request metadata such as an IP address, browser headers, and requested asset path under their own policies. Code Explorer does not attach learner source, prepared input, traces, clipboard text, local-storage values, or a learner identifier to those dependency requests.

That provider-side request metadata is not returned to Code Explorer. The application and project maintainers cannot view IP addresses, browser headers, or provider request logs through the website, source repository, or a Code Explorer analytics dashboard because no such collection or dashboard exists.

GitHub has a separate repository Insights feature for people with push access. According to [GitHub's repository traffic guide](https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository), it can summarize recent repository visitors, full clones, referring sites, and popular repository content. This belongs to GitHub's own platform, not to Code Explorer's application.

A beginner-friendly example:

```text
WHAT A GITHUB REPOSITORY SUMMARY MAY SHOW

Repository views ........ a total count
Unique visitors ......... an aggregate count
Full repository clones .. a total count
Popular content ......... README.md received views
Referring sites ......... a site sent visits to the repository

WHAT CODE EXPLORER MAINTAINERS CANNOT SEE THERE

The Python program you typed
The values entered for input()
Your trace steps or console output
Your clipboard contents
Your locally saved source or preferences
Your IP address from Code Explorer dependency requests
Your browser headers from Code Explorer dependency requests
An individual history of which workspace buttons you selected
```

For example, a repository summary might say that a page had several views from several unique visitors. It does not give Code Explorer a copy of what those visitors typed into the tool. It does not turn a local trace into a repository statistic. It does not let the maintainer open one visitor's workspace. It is comparable to a library knowing that a book was requested several times without receiving the notes a reader wrote privately at home.

The privacy boundary can be summarized as three separate layers:

```text
1. CODE EXPLORER LEARNING DATA
   source, input, trace, output, clipboard, preferences
   -> stays in the learner's browser

2. PROVIDER-SIDE REQUEST HANDLING
   ordinary requests for a page, font, or pinned module
   -> handled by that provider
   -> raw provider logs are not available to Code Explorer maintainers

3. GITHUB REPOSITORY INSIGHTS
   aggregate repository traffic supplied by GitHub
   -> separate from the Code Explorer application
   -> contains no learner program, input, trace, clipboard, or local-storage data
```

Selecting **Tool Guide** or the GitHub icon deliberately navigates to GitHub in a new tab. Both links use `noreferrer`, so Code Explorer does not send the current page address as a referrer through those links.

This is a permanent project boundary: future contributors must not add first-party or third-party analytics, telemetry, tracking, advertising pixels, session recording, user profiling, fingerprinting, or automatic remote error reporting. A useful learning feature is not permission to monitor learners.

### What persists and what resets

```text
BROWSER-SAVED LEARNING SETUP
|
+-- Python source
+-- Theme
+-- Editor wrap and font size
+-- Graph zoom
+-- Watched names
+-- Prepared input text

CURRENT EXECUTION ONLY
|
+-- Recorded trace snapshots
+-- Selected step
+-- Console at each step
+-- Coverage and execution path
+-- Loop results
+-- Trace bookmarks
+-- Playback state
+-- Automatic Learning Comments metadata and export preview
+-- Automatic comments visible or hidden state

New run or changed source
        |
        v
Execution-only state is cleared, then rebuilt by the next run
```

If you confirm **Replace editor**, the commented document becomes ordinary editor source and is saved locally like any source edit. Merely showing automatic comments, opening the export preview, or copying the generated preview does not save a commented document.

The inline visibility state intentionally resets with the trace. A reload, source edit, example change, paste, or new run requires fresh runtime evidence and returns Automatic comments to off. The chosen detail level can remain available as a learning preference, but notes are always regenerated from the current run.

The following are saved locally when browser storage is available:

- Current Python source
- Light or dark theme
- Editor wrapping choice
- Editor font size
- Reference graph zoom
- Execution Path graph zoom
- Watched variable names
- Prepared Input Playground text

The following belong to the current trace and are not intended to survive a new execution:

- Current step
- Trace bookmarks
- Playback position
- Breakpoint pauses
- Recorded variable snapshots
- Coverage and path results
- Automatic comments visibility and generated note metadata

No sign-in is required. If the browser blocks local storage, the tool remains usable but may not restore saved source or preferences after reload.

## Tips for learning effectively

### Change one thing at a time

When experimenting, change only one input, value, condition, or line before running again. This makes Compare Runs and Before and After much easier to interpret.

### Predict before moving forward

At each step, ask:

```text
1. Which line will run next?
2. Which names might change?
3. What will be printed?
4. Will a mutable object change in place?
```

Then select **Next** and compare your prediction with the recorded state.

### Use the smallest helpful view

- Start with Story.
- Open Before and After when a change is unclear.
- Open Variables when a value is complex.
- Open Structures for indexes and keys.
- Open Mutation Explorer only when identity matters.
- Open Execution Path when control flow is confusing.

### Bookmark moments of confusion

Bookmark a step before exploring other views. You can return to the exact line and state without trying to remember the slider position.

### Compare inputs, not only outputs

Two runs can print the same result while taking different paths or holding different intermediate variables. Compare Runs checks path and visible state as well as final output.

### Treat missed coverage as a question

When Coverage marks a line as missed, ask what condition or input would make Python reach it. Then run that case and compare.

## Troubleshooting

### Fast troubleshooting map

```text
What is not working?
|
+-- Run does not begin
|   +-- Is the editor empty? -> Add or load source
|   +-- Is Python loading?   -> Wait for Python ready
|   +-- Runtime unavailable? -> Check connection and reload
|
+-- Run begins but stops
|   +-- Python error?        -> Open Error Coach
|   +-- Missing input?       -> Add Input Playground lines
|   +-- Safety limit?        -> Reduce repeated work
|
+-- A view is empty
|   +-- No trace?            -> Run the program
|   +-- Wrong selected step? -> Move to where the concept exists
|   +-- No relevant concept? -> Use another example or view
|
+-- Graph is unavailable
|   +-- Wait briefly
|   +-- Check the connection
|   +-- Continue with Story, Variables, or Coverage
|
+-- Values seem to move backward
    +-- Check the selected trace step
    +-- Remember that output and state follow the timeline
```

### Run trace does not start

1. Check the header status.
2. Wait for **Python ready**.
3. Confirm that the editor is not empty.
4. Reload if the runtime reports that it is unavailable.
5. Check whether a network filter blocked the initial Python runtime download.

### A long program stops

The program probably reached the 3,000-step limit or 30-second timeout.

Try:

- Reducing loop ranges
- Testing one function at a time
- Using a smaller input collection
- Removing deliberate delays
- Checking for an infinite `while` loop
- Replacing a large stress test with a smaller teaching example

### Input produces EOFError

EOF means end of input. In a terminal it traditionally means that no more input can be read. In Code Explorer it means the program called `input()` after all prepared Input Playground lines had already been consumed.

Count the calls to `input()` along the path being tested. Remember that conditions and loops can make the number of calls vary between runs. Add at least one prepared line for every call on the path you want to test.

```python
first = input()
second = input()
```

Needs:

```text
first response
second response
```

### Paste shows a permission alert

The browser blocked clipboard reading. Allow clipboard access for the site, or focus the editor and press `Ctrl+V`.

### A graph is empty or unavailable

- Run a trace first.
- For References, make sure a visible variable exists at the selected step.
- For Execution Path, wait briefly for the graph to appear.
- Check the connection if the graph renderer reports that it could not load.
- Use Story, Variables, Coverage, or Loop Table while graphs are unavailable.

### A watched variable says not in scope

Move to a step after the variable is created or to a step where its function frame is active. A local variable naturally leaves scope when its function finishes.

### The trace no longer matches the editor

Editing automatically clears stale results. Run a new trace for the current source.

### The console appears to lose later output when moving backward

This is expected. Console output is synchronized with the selected point in time. Move forward again to see output produced by later steps.

### Learning comments is disabled

1. Confirm that the visible source has been run since its last edit.
2. Correct any syntax error and run again.
3. Wait for the completed trace before selecting the button.
4. If a runtime error occurred, check whether any source statements executed before the failure.

The same evidence rule applies when **Automatic comments** is disabled. Both controls become available from the same current note set.

### Automatic comments disappeared

This is expected after editing, pasting, loading an example, or starting another run. The former notes described the former source and trace, so Code Explorer removes them instead of leaving a stale explanation beside changed code. Complete the new trace and turn Automatic comments on again.

### Automatic comments changed the editor height

Visual notes occupy space above their related lines while the mode is on. They do not add source lines. The footer line count, Python line numbers, heatmap, and replay breakpoints still use the original document. Turn the mode off to return to the compact source-only layout.

### Copy did not include the visible automatic comments

This is intentional. The editor's **Copy** action always copies the original Python document. To copy real `# Code Explorer:` lines, open **Learning comments** and select **Copy commented code**.

### A generated note is missing

Open the detail selector and choose **Detailed**. If the line still has no note, Code Explorer did not have enough reliable evidence to explain it. This is intentional. Use Story, Before and After, Function Journey, or the relevant specialist view instead of treating the missing note as an error.

### Generated comments appear in the editor

First check the toolbar label:

- If it says **Automatic comments on**, the notes are temporary visual widgets. Turn the control off and the original compact source view returns.
- If Automatic comments is off and `# Code Explorer:` lines remain as editable source, **Replace editor** was previously confirmed. You can remove them manually, undo the replacement while editor history remains available, or rerun the commented program and generate a fresh copy. A fresh generation removes older lines with that exact prefix before adding current notes, so it does not stack duplicate generated layers.

## Python concepts glossary

This glossary is designed to be used beside a trace. Each entry explains the idea, shows a small example, warns about a common misunderstanding, and points to the Code Explorer views that make the idea visible.

### A concept-finding map

```text
What kind of concept is confusing?
|
+-- Names and values
|   +-- name, value, type, expression, assignment, reassignment
|
+-- Choosing and repeating
|   +-- Boolean, condition, branch, for, while, iteration
|   +-- accumulator, counter, break, continue
|
+-- Functions
|   +-- definition, call, parameter, argument, return
|   +-- scope, frame, call stack, recursion
|
+-- Collections
|   +-- list, tuple, dictionary, set, index, key
|   +-- nested structure, mutable object, immutable value
|
+-- Object relationships
|   +-- reference, identity, alias, mutation, shallow copy
|
+-- Program communication and failure
|   +-- input, output, syntax error, runtime error, exception
|
+-- Code Explorer evidence
    +-- trace step, coverage, execution path, reference map
```

### Name, value, and type

A **name** is the word used to refer to data. A **value** is the data itself. A **type** describes the kind of value and the operations Python supports for it.

```python
score = 10
message = "Ready"
```

Here, `score` is a name referring to the integer value `10`. `message` refers to a string value.

Common misunderstanding: a variable is not a labelled physical box shown by Code Explorer. Python names refer to values or objects. Open **Data > References** when the relationship between a name and an object matters.

Best views: **Variables**, **References**, **Story**.

### Expression

An expression is code that Python evaluates to produce a value.

```python
subtotal = price * quantity
```

`price * quantity` is the expression. Assignment then connects `subtotal` to its result.

Common misunderstanding: not every source line is one expression. A line can contain a statement, an expression inside that statement, and a function call inside the expression.

Best views: **Story**, **Before and After**, **Variables**.

### Assignment

Assignment evaluates the expression on the right, then connects the name on the left to the resulting value or object.

```python
price = 8
total = price * 3
```

Common misunderstanding: `=` does not mean mathematical equality in an assignment. It performs an action. Use `==` when asking whether two values are equal.

Best views: **Before and After**, **Variables**, **Story**.

### Reassignment

Reassignment makes an existing name refer to a different value or object.

```python
status = "waiting"
status = "ready"
```

The second line does not edit the string `"waiting"`. It connects `status` to another string.

Common misunderstanding: reassignment and mutation can produce similar printed results but different reference relationships.

Best views: **Before and After**, **Mutation Explorer**, **References**.

### Boolean value

A Boolean value is either `True` or `False`. Comparisons and logical operators often produce Booleans.

```python
old_enough = age >= 18
can_enter = old_enough and has_ticket
```

Common misunderstanding: the strings `"True"` and `"False"` are text, not Boolean values.

Best views: **Variables**, **Conditions**, **Before and After**.

### Condition and branch

A **condition** is an expression Python treats as true or false. A **branch** is the path selected because of that result.

```python
if score >= 50:
    result = "Pass"
else:
    result = "Try again"
```

Only one assignment runs in this example. Another input can select the other branch.

Common misunderstanding: an `else` block does not have its own separate test. It runs when the earlier connected conditions did not select a branch.

Best views: **Conditions**, **Coverage**, **Execution Path**.

### `elif`

`elif` means "otherwise, check this next condition." Python checks the ladder from top to bottom and stops at the first matching branch.

```python
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
else:
    grade = "C or below"
```

Common misunderstanding: every `elif` is not checked after a previous branch succeeds.

Best views: **Conditions**, **Coverage**, **Execution Path**.

### `for` loop and iterable

A `for` loop takes values from an **iterable**, one at a time, and runs its body for each value.

```python
for color in ["mint", "purple"]:
    print(color)
```

The list is iterable. `color` receives a different element during each iteration.

Common misunderstanding: the loop variable does not contain the whole collection at once.

Best views: **Loop Table**, **Loop Lab**, **Variables**.

### `while` loop

A `while` loop repeats while its condition is true.

```python
count = 3
while count > 0:
    count -= 1
```

Something in the loop normally needs to move the condition toward false.

Common misunderstanding: a `while` loop does not automatically update its condition variables. Forgetting the update can create an infinite loop.

Best views: **Loop Lab**, **Conditions**, **Execution Path**.

### Iteration

An iteration is one pass through a loop body.

```python
for number in range(3):
    print(number)
```

The body has three iterations with `number` equal to `0`, `1`, and `2`.

Common misunderstanding: a trace step and an iteration are not the same unit. One iteration can execute several source lines and therefore create several trace steps.

Best views: **Loop Table**, **Loop Lab**, **Story**.

### Accumulator and counter

An **accumulator** combines values over time. A **counter** records how many times something happened.

```python
total = 0
passing_count = 0
for score in scores:
    total += score
    if score >= 50:
        passing_count += 1
```

Common misunderstanding: both often start at zero, but they answer different questions. `total` answers "how much?" while `passing_count` answers "how many?"

Best views: **Loop Table**, **Watches**, **Before and After**.

### `break` and `continue`

`break` ends the nearest loop. `continue` skips the rest of the current iteration and begins the next one.

```python
for number in numbers:
    if number < 0:
        continue
    if number == target:
        break
```

Common misunderstanding: `continue` does not end the whole loop, and `break` does not end the entire program.

Best views: **Execution Path**, **Coverage**, **Loop Table**.

### Function definition and function call

A function definition creates reusable behavior. A function call runs that behavior.

```python
def double(number):
    return number * 2

answer = double(4)
```

The `def` statement defines `double`. `double(4)` calls it.

Common misunderstanding: defining a function does not run its body immediately.

Best views: **Function Journey**, **Story**, **Coverage**.

### Parameter and argument

A **parameter** is a name in a function definition. An **argument** is a value supplied by a particular call.

```python
def greet(name):       # name is a parameter
    return "Hi " + name

message = greet("Ava") # "Ava" is an argument
```

Common misunderstanding: the parameter belongs to the function's local scope. The argument expression is evaluated by the caller.

Best views: **Function Journey**, **Variables**, **Before and After**.

### Return value

`return` ends the current function call and sends a value back to its caller.

```python
def square(number):
    return number * number

result = square(5)
```

Common misunderstanding: `print()` displays a value, while `return` gives a value to the calling code. Printing is not a substitute for returning.

Best views: **Function Journey**, **Story**, **Variables**.

### Scope

Scope describes where a name can be used. Code Explorer distinguishes global scope from active function-local scopes.

```python
message = "global"

def show():
    message = "local"
    print(message)
```

The two `message` names belong to different scopes.

Common misunderstanding: a local name with the same spelling does not automatically replace the global name.

Best views: **Variables**, **Function Journey**, **Watches**.

### Frame

A frame is one active function call's working context. It includes the current execution position and that call's local variables.

Calling the same function twice creates two separate frames over time. Recursive calls can create several active frames for the same function at once.

Common misunderstanding: a function definition is not a frame. A frame exists while a particular call is active.

Best views: **Function Journey**, **Variables**, **Story**.

### Call stack

The call stack is the ordered collection of active frames. If `outer()` calls `inner()`, `outer` waits below `inner` until `inner` returns.

```text
top:    inner frame       currently running
        outer frame       waiting for inner
bottom: global frame      started the call chain
```

Common misunderstanding: the call stack is not a history of every completed call. Function Journey can also summarize completed events, while the active stack describes what is active at one moment.

Best views: **Function Journey**, **Story**, **Variables**.

### Recursion

Recursion occurs when a function calls itself, directly or through other functions.

```python
def countdown(number):
    if number <= 0:
        return
    countdown(number - 1)
```

The condition is a base case that stops new calls.

Common misunderstanding: recursion is not automatically infinite. It becomes unsafe when calls do not move toward a reachable base case.

Best views: **Function Journey**, **Variables**, **Execution Path**.

### Class, object, and instance

A **class** is a reusable definition of data and behavior. An **object** is one value created from a class. The word **instance** means an object considered as a member of that class.

```python
class Book:
    pass

first_book = Book()
second_book = Book()
```

`Book` is the class. `first_book` and `second_book` are separate `Book` instances.

Common misunderstanding: defining a class does not automatically create the useful instances a program needs. Calling the class creates an instance.

Best views: **Story**, **Variables**, **Structures**, **References**.

### Attribute

An attribute is a named value connected to an object. Attribute access uses a dot.

```python
book.title = "Python Basics"
print(book.title)
```

Code Explorer serializes a bounded set of ordinary instance attributes. A structure can therefore appear as:

```text
book
+-- Book instance
    +-- .title = "Python Basics"
    +-- .pages = 240
```

Common misunderstanding: an attribute is not automatically a local variable. `title` and `book.title` can be different names in different places.

Best views: **Structures**, **Variables**, **Mutation Explorer**.

### Method and `self`

A method is a function defined inside a class. An instance method receives the current object through its first parameter, conventionally named `self`.

```python
class Counter:
    def increase(self):
        self.value += 1
```

Calling `counter.increase()` supplies `counter` as `self` automatically.

Common misunderstanding: `self` is not a reserved Python keyword, but using the conventional name makes code understandable to other Python programmers.

Best views: **Function Journey**, **Call Stack**, **Structures**, **Mutation Explorer**.

### Constructor and `__init__`

For these beginner lessons, the constructor call creates an instance and Python then calls `__init__` to initialize its state.

```python
class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

student = Student("Maya", 82)
```

Common misunderstanding: `__init__` initializes an already-created instance. It normally does not return the new object explicitly.

Best views: **Function Journey**, **Variables**, **Structures**.

### Inheritance

Inheritance lets a more specific class reuse and extend behavior from a base class.

```python
class Animal:
    def describe(self):
        return "Animal"

class Dog(Animal):
    def speak(self):
        return "Woof"
```

Common misunderstanding: inheritance is not required whenever two classes interact. Use it when the new class genuinely represents a more specific form of the base class.

Best views: **Function Journey**, **Call Stack**, **Structures**.

### Composition

Composition means one object contains or collaborates with another object. A library containing book objects is composition.

```python
library.books.append(Book("Python Basics"))
```

Common misunderstanding: composition and inheritance answer different design questions. Inheritance describes an "is a" relationship. Composition describes a "has a" relationship.

Best views: **Structures**, **References**, **Function Journey**.

### List

A list is an ordered, mutable collection. Positions use zero-based indexes.

```python
colors = ["red", "green", "blue"]
first = colors[0]
colors.append("purple")
```

Common misunderstanding: the first index is `0`, and the final positive index is one less than the list length.

Best views: **Structures**, **Mutation Explorer**, **Variables**.

### Tuple

A tuple is an ordered, immutable collection. It is useful for fixed groups of values and multiple return values.

```python
point = (12, 7)
x, y = point
```

Common misunderstanding: parentheses do not make every expression a tuple. A comma creates the tuple structure.

Best views: **Structures**, **Variables**, **Before and After**.

### Dictionary, key, and value

A dictionary maps unique keys to values.

```python
product = {"name": "Notebook", "stock": 4}
product["stock"] = 7
```

`"stock"` is a key and `7` is its current value.

Common misunderstanding: dictionary access uses a key, not a numeric position unless numbers were deliberately used as keys. Requesting a missing key raises `KeyError`.

Best views: **Structures**, **Mutation Explorer**, **Variables**.

### Set

A set is a mutable collection of unique values. Sets are useful for membership tests and removing duplicates.

```python
visits = ["Ava", "Noah", "Ava"]
people = set(visits)
```

Common misunderstanding: a set is not designed around stable positional indexes. Do not expect `people[0]` to work.

Best views: **Structures**, **Variables**, **Before and After**.

### Index

An index identifies a position in an ordered collection such as a list, tuple, or string.

```python
word = "Python"
first = word[0]
last = word[-1]
```

Common misunderstanding: a six-character sequence has positive indexes `0` through `5`, not `1` through `6`.

Best views: **Structures**, **Variables**, **Error Coach**.

### Nested structure

A nested structure contains another collection as a value or element.

```python
student = {"name": "Ava", "scores": [82, 91]}
first_score = student["scores"][0]
```

Read access from left to right: find the dictionary value at `"scores"`, then find list element `0` inside that value.

Common misunderstanding: one pair of brackets handles one level of access.

Best views: **Structures**, **References**, **Variables**.

### Mutable object

A mutable object can change its contents while remaining the same object. Lists, dictionaries, and sets are common mutable objects.

```python
items = []
items.append(1)
```

Common misunderstanding: mutation does not require assigning the collection back to the same name.

Best views: **Mutation Explorer**, **References**, **Structures**.

### Immutable value

An immutable value cannot be changed in place. Integers, floats, Booleans, strings, and tuples are common immutable values.

```python
count = 1
count = count + 1
```

The second line produces another integer value and reassigns `count`.

Common misunderstanding: `count += 1` looks like mutation, but an integer is immutable. The name receives another integer value.

Best views: **Before and After**, **Variables**, **Mutation Explorer**.

### Mutation

Mutation changes the contents of an existing mutable object.

```python
numbers = [1, 2]
numbers.append(3)
```

Common misunderstanding: a new visual snapshot does not necessarily mean a new Python object was created. Mutation Explorer distinguishes content change from reassignment.

Best views: **Mutation Explorer**, **References**, **Before and After**.

### Reference, identity, and alias

A **reference** connects a name or container position to an object. **Identity** answers whether two references lead to the same object. Two names are **aliases** when they reference the same object.

```python
first = []
second = first
same_object = first is second
```

Mutating `second` is visible through `first` because both names reach the same list.

Common misunderstanding: equality with `==` compares values, while identity with `is` asks whether references reach the same object.

Best views: **References**, **Mutation Explorer**, **Variables**.

### Shallow copy

A shallow copy creates a new outer container but keeps references to the same nested objects.

```python
original = [[1, 2]]
copied = original.copy()
copied[0].append(3)
```

The outer lists are different objects, but their first elements refer to the same inner list.

Common misunderstanding: shallow copying does not recursively duplicate every nested object.

Best views: **References**, **Mutation Explorer**, **Structures**.

### Input and output

`input()` reads text supplied by the learner. `print()` sends text representations to console output.

```python
raw_age = input("Age: ")
age = int(raw_age)
print("Next age:", age + 1)
```

Common misunderstanding: `input()` always returns a string. Numeric-looking text must be converted before numeric arithmetic.

Best views: **Input Playground**, **Story**, **Console Output**.

### Syntax error

A syntax error means Python could not parse the program's grammar.

```python
if ready
    print("Go")
```

The missing colon prevents execution from starting, so no runtime timeline exists.

Indentation problems are part of the same compile-time family. For example, the body below must move to the right because it belongs to the `if` block:

```python
if ready:
print("Go")
```

Code Explorer may show this through its `SyntaxError` path with a message about expected indentation. Because parsing failed, Variables, Coverage, and other runtime views have no execution evidence yet.

Common misunderstanding: a syntax error is not a false condition or a runtime branch. Python cannot begin the program.

Best views: **Error Coach**, editor line highlight.

### Runtime error and exception

A runtime error happens after valid code begins executing. Python represents the problem with an exception such as `IndexError`, `KeyError`, or `ValueError`.

```python
numbers = [4, 8]
print(numbers[3])
```

The earlier assignment can still appear in a partial trace before the `IndexError`.

Common misunderstanding: an exception message is evidence, not a judgement about the learner. Read the type, failing line, and current values together.

Several exception names sound similar at first. Use the object being accessed or the operation being attempted to separate them:

| Do not confuse | Key difference |
| --- | --- |
| `SyntaxError` and a runtime exception | A syntax error prevents the program from starting. A runtime exception happens after valid source has begun executing. |
| `TypeError` and `ValueError` | `TypeError` usually means the kind of value is unsuitable for the operation. `ValueError` usually means the kind is accepted but the particular content is unsuitable. |
| `IndexError` and `KeyError` | `IndexError` concerns a sequence position. `KeyError` concerns a missing dictionary key. |
| `NameError` and `AttributeError` | `NameError` concerns a name Python cannot find in scope. `AttributeError` concerns a method or attribute that a found value does not provide. |

See the [Error Coach reference](#error-coach) for individual meanings, examples, and first inspection steps.

Best views: **Error Coach**, **Variables**, **Structures**.

### Trace step

A trace step is one recorded execution snapshot. It includes a source line, visible variables, active frames, and output observed at that moment.

Common misunderstanding: one source line can produce several trace steps when a loop or function reaches it repeatedly.

Best views: **Story**, **Before and After**, timeline controls.

### Coverage

Coverage reports which executable source lines were reached, repeated, or missed during one run.

Common misunderstanding: 100 percent coverage for one input does not prove that the program is correct or that every possible value was tested.

Best views: **Coverage**, **Execution Path**, **Compare Runs**.

### Execution path

The execution path is the observed order of reached source lines. Edge counts show repeated transitions.

Common misunderstanding: the graph shows the path for this run, not every theoretical route through the program.

Best views: **Execution Path**, **Coverage**, **Conditions**.

### Reference map

A reference map is a conceptual diagram connecting scopes, names, and captured objects.

Common misunderstanding: the displayed object nodes are not physical RAM addresses and should not be used to estimate memory consumption.

Best views: **References**, **Mutation Explorer**, **Variables**.

### How the glossary concepts connect

```text
PYTHON PROGRAM
|
+-- statements contain expressions
|       |
|       +-- expressions produce values with types
|       +-- assignment connects names to values or objects
|
+-- control flow
|       +-- conditions select branches
|       +-- for loops consume iterables
|       +-- while loops repeat while a condition is true
|       +-- each pass is an iteration
|
+-- function calls
|       +-- arguments enter parameters
|       +-- each call creates a frame and local scope
|       +-- active frames form the call stack
|       +-- return sends a value to the caller
|
+-- collections and objects
|       +-- list, tuple, dictionary, set
|       +-- indexes and keys locate contents
|       +-- mutable objects can change contents
|       +-- aliases can share one object
|       +-- shallow copies share nested objects
|       +-- classes define reusable object blueprints
|       +-- instances carry attributes and use methods
|       +-- inheritance extends a parent class
|       +-- composition connects one object to another
|
+-- communication and failure
|       +-- input supplies strings
|       +-- output displays values
|       +-- syntax errors prevent execution
|       +-- runtime exceptions stop an active path
|
+-- CODE EXPLORER EVIDENCE
        +-- trace steps show moments
        +-- coverage shows reached lines
        +-- execution path shows observed order
        +-- reference map shows conceptual relationships
        +-- learning comments combine syntax with trace facts
```

## A final beginner workflow

```text
WRITE
  Enter a small Python program
      |
      v
RUN
  Create a bounded execution trace
      |
      v
PREDICT
  Guess the next line and state change
      |
      v
STEP
  Move one snapshot forward
      |
      v
EXPLAIN
  Read Story and Before and After
      |
      v
INSPECT
  Open Variables, Structures, or References
      |
      v
ANNOTATE
  Turn Automatic comments on for a trace-backed reading layer
  Turn it off when you want the compact source flow again
      |
      v
COMPARE
  Try another input or source value
      |
      v
REFLECT
  Bookmark what surprised you
      |
      +-----------------------------+
                                    |
                                    v
                              Repeat and learn
```

Code Explorer is most useful when you stay curious about the space between two lines of code. Write a small example, predict what Python will do, and use the trace to check your mental model.

If an explanation is useful enough to keep, open Learning comments and copy the commented study document. If it is only useful for the current reading, leave the source untouched and use the Automatic comments toggle. That distinction lets the tool teach more without quietly taking ownership of the learner's program.
