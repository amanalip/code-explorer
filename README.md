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

Select **Examples** to open a curated library of 18 programs. Every card includes a concept, difficulty level, short purpose, and the views that reveal its most useful behavior.

### Filtering the library

```text
ALL
|
+-- Basics
+-- Decisions
+-- Loops
+-- Functions
+-- Collections
+-- Input and Errors
```

The active filter shows how many programs are visible out of the complete set of 18. On a narrow screen, scroll the filter row horizontally to reach every category.

### Complete example catalog

| Category | Level | Example | Main learning goal | Best views |
| --- | --- | --- | --- | --- |
| Basics | Beginner | A tiny calculation | Follow values through multiplication | Story, Before and After, Variables |
| Basics | Beginner | Building a message | Combine strings into a new value | Story, Before and After, Structures |
| Decisions | Beginner | Pass or try again | Observe a true branch | Conditions, Coverage, Story |
| Decisions | Intermediate | Checking multiple conditions | Understand `and` and two Boolean facts | Conditions, Before and After, Coverage |
| Decisions | Beginner | Different inputs, different paths | Compare branch choices caused by input | Input Playground, Compare Runs, Conditions |
| Loops | Beginner | Running total | Follow an accumulator through a `for` loop | Loop Table, Loop Lab, Coverage |
| Loops | Beginner | Countdown | Follow a `while` condition until it becomes false | Conditions, Execution Path, Loop Lab |
| Loops | Intermediate | Find the first match | See how `break` ends a search | Execution Path, Coverage, Loop Table |
| Loops | Intermediate | Skip unwanted values | See how `continue` skips part of an iteration | Execution Path, Coverage, Loop Table |
| Functions | Beginner | A function call | Follow a parameter, local result, and return value | Function Journey, Story, Variables |
| Functions | Intermediate | One function calling another | Follow nested calls and local frames | Function Journey, Story, Variables |
| Collections | Beginner | Growing a list | Observe repeated list mutation | Structures, Mutation Explorer, Loop Table |
| Collections | Intermediate | Two names sharing one list | Understand aliases and shared mutation | References, Mutation Explorer, Variables |
| Collections | Intermediate | Mutate or replace a list | Compare in-place mutation with reassignment | Mutation Explorer, References, Before and After |
| Collections | Intermediate | Nested student data | Inspect a dictionary containing a list | Variables, Structures, References |
| Collections | Intermediate | Counting words | Build and update dictionary entries in a loop | Structures, Mutation Explorer, Loop Table |
| Input and Errors | Beginner | A personalized greeting | Consume two inputs and choose a branch | Input Playground, Conditions, Compare Runs |
| Input and Errors | Beginner | An index to investigate | Connect an `IndexError` to list state | Error Coach, Variables, Structures |

### Difficulty labels

- **Beginner** programs isolate one primary concept and use short, direct source code.
- **Intermediate** programs combine concepts such as loops with conditions, nested calls, aliases, or object identity.

Intermediate does not mean that the example is unsafe or excessively large. It means you may benefit from studying its Beginner prerequisite first.

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

The two input examples prepare safe sample responses automatically:

```text
Different inputs, different paths
Prepared input: 72

A personalized greeting
Prepared inputs:
Aman
25
```

You can replace these values in Input Playground before running.

### Suggested example order

```text
A tiny calculation
        |
        v
Building a message
        |
        v
Pass or try again
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
       References and nested data
                 |
                 v
        Input comparison and errors
```

## Guided beginner walkthroughs

The walkthroughs below are lessons, not merely demonstrations. For each one, predict first, inspect several views, explain what happened, and then change the program to test your understanding.

### Walkthrough 1: Run your first complete trace

**Learning objective:** understand the relationship between source lines, trace steps, variable state, and console output.

Load **Basics > A tiny calculation**:

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

Load **Basics > Building a message**:

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

Load **Functions > A function call**:

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

Load **Functions > One function calling another**:

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

Part B uses **Input and Errors > An index to investigate**:

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

New run or changed source
        |
        v
Execution-only state is cleared, then rebuilt by the next run
```

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

### How the glossary concepts connect

```text
PROGRAM EXECUTION
|
+-- Trace step
|   +-- source line
|   +-- output so far
|   +-- active call stack
|       +-- frame
|           +-- scope
|               +-- assignment creates or changes names
|
+-- Values and objects
|   +-- immutable value
|   |   +-- reassignment connects a name to another value
|   |
|   +-- mutable object
|       +-- mutation changes existing contents
|       +-- alias gives the same object another name
|
+-- Repeated control flow
|   +-- iteration
|   +-- loop path
|
+-- Whole-run evidence
    +-- coverage
    +-- reference map
    +-- execution path
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
