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

## Contents

- [Start here](#start-here)
- [What happens when you run a trace](#what-happens-when-you-run-a-trace)
- [Workspace map](#workspace-map)
- [The editor](#the-editor)
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
        -> Labs > Trace Bookmarks
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

- `SyntaxError`
- `IndentationError`
- `NameError`
- `TypeError`
- `ValueError`
- `IndexError`
- `KeyError`
- `ZeroDivisionError`
- `AttributeError`
- `EOFError`

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

## Flow views

Flow views summarize paths, source coverage, and loop behavior.

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

## Labs

Labs help you deliberately vary, compare, and organize executions.

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

Select **Examples** to choose one of eight focused programs.

| Topic | Example | Main views to open |
| --- | --- | --- |
| Variables | A tiny calculation | Story, Before and After, Variables |
| For loop | Running total | Loop Table, Loop Lab, Coverage |
| While loop | Countdown | Conditions, Execution Path, Loop Lab |
| Conditions | Pass or try again | Conditions, Coverage, Compare Runs |
| Functions | A function call | Function Journey, Story call stack, Variables |
| Lists | Growing a list | Structures, References, Mutation Explorer |
| Input | A personalized greeting | Input Playground, Conditions, Compare Runs |
| Errors | An index to investigate | Error Coach, Variables, Structures |

Choosing an example replaces the complete editor source. If you want to keep your current program, use **Copy** before loading the example.

## Guided beginner walkthroughs

### Walkthrough 1: Follow a variable

Use:

```python
balance = 10
balance = balance + 5
balance = balance * 2
print(balance)
```

Steps:

1. Run the trace.
2. Select **Next** until the second assignment is selected.
3. Read **Trace > Before and After**.
4. Open **Data > Variables** and select `balance`.
5. Use its value history to jump among `10`, `15`, and `30`.
6. Add `balance` to **Watches**.

Expected final value:

```text
30
```

Learning goal: assignment changes what value a name currently represents.

### Walkthrough 2: Understand a branch

Use:

```python
temperature = 18

if temperature >= 20:
    message = "Warm"
else:
    message = "Cool"

print(message)
```

Steps:

1. Run the trace.
2. Open **Trace > Conditions**.
3. Observe that `temperature >= 20` is false.
4. Open **Flow > Coverage**.
5. Compare reached and missed branch lines.

Expected output:

```text
Cool
```

Learning goal: only one branch body runs for this value.

### Walkthrough 3: Understand list mutation

Use:

```python
numbers = []
alias = numbers
numbers.append(4)
alias.append(9)
print(numbers)
```

Steps:

1. Run the trace.
2. Open **Data > References** to see `numbers` and `alias` reference one object.
3. Move to each `append()` step.
4. Open **Data > Mutation Explorer**.
5. Confirm that Object A remains Object A while its contents change.
6. Open **Data > Structures** to inspect indexes `0` and `1`.

Expected output:

```text
[4, 9]
```

Learning goal: two names can reference the same mutable object.

### Walkthrough 4: Compare two loop runs

Use:

```python
limit = int(input("Limit: "))
total = 0

for number in range(1, limit + 1):
    total += number

print(total)
```

Run A:

```text
3
```

Run B:

```text
5
```

Steps:

1. Prepare `3` in Input Playground.
2. Run and capture Run A.
3. Replace the prepared input with `5`.
4. Run and capture Run B.
5. Read Compare Runs.
6. Open Loop Table to compare each run separately.

Expected outputs:

```text
Run A: 6
Run B: 15
```

Learning goal: a small input change can alter loop length, state history, output, and trace length.

### Walkthrough 5: Investigate an error

Use:

```python
names = ["Ada", "Grace"]
position = 2
print(names[position])
```

Steps:

1. Run the trace.
2. Move to the final step.
3. Read **Trace > Error Coach**.
4. Inspect `position` in **Data > Variables**.
5. Inspect `names` in **Data > Structures**.
6. Compare valid indexes `0` and `1` with the requested index `2`.

Expected result:

```text
IndexError: list index out of range
```

Learning goal: error investigation connects the message to concrete program state.

## Expected behavior

### Before running

- Empty views explain what data they need.
- Playback controls remain disabled.
- The console says output will appear there.
- The header may report that Python is loading.

### While running

- **Run trace** enters a loading state.
- A **Stop** button becomes available.
- The console explains that a safe trace is being prepared.
- The interface remains separate from the Python execution.

### After a successful run

- Playback controls become available.
- The first trace step is selected.
- Editor line activity appears.
- Story, Data, Flow, and Lab views receive data from the same timeline.
- Console output follows the selected step.
- Selecting another step updates every view consistently.

### After editing source

- The source is saved automatically.
- The previous trace is cleared.
- Old coverage, path, loop, variable, and bookmark results disappear.
- A new **Run trace** is required.

### After a runtime error

- Steps recorded before the failure remain inspectable.
- The failing line and original Python message are shown.
- Error Coach provides beginner guidance.
- Console output produced before the error remains available.

### After a syntax error

- Python does not produce an execution timeline because the program could not start.
- Code Explorer points to the syntax line when available.
- Error Coach opens with a grammar-focused suggestion.

## Errors and helpful messages

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

## Limits

Limits keep the workspace responsive and the visual explanations readable.

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

Count the calls to `input()` along the path being tested. Add at least that many lines to Input Playground.

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

## Python concepts glossary

### Assignment

Assignment connects a name to a value or object.

```python
score = 10
```

### Scope

Scope describes where a name is available. Code Explorer distinguishes the global scope from active function-local scopes.

### Frame

A frame is a function's active working context. It contains the function's current local variables and execution position.

### Call stack

The call stack is the ordered set of active frames. If `outer()` calls `inner()`, both functions can appear on the stack until `inner()` returns.

### Mutable object

A mutable object can change its contents while remaining the same object. Lists, dictionaries, and sets are common examples.

```python
items = []
items.append(1)
```

### Immutable value

An immutable value cannot be changed in place. Assigning a new integer, string, or tuple value connects the name to another value.

```python
count = 1
count = count + 1
```

### Mutation

Mutation changes the contents of an existing mutable object.

```python
numbers.append(3)
```

### Reassignment

Reassignment makes a name reference a different value or object.

```python
numbers = [3]
```

### Alias

Two names are aliases when they reference the same object.

```python
first = []
second = first
```

### Iteration

An iteration is one pass through a loop body.

### Trace step

A trace step is one recorded execution snapshot containing a source line, visible variables, active frames, and output at that moment.

### Coverage

Coverage describes which source lines were observed during one run. It does not prove that every possible input or branch has been tested.

### Reference map

A reference map is a conceptual diagram connecting scopes, names, and captured objects. It is not a physical memory-address display.

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
