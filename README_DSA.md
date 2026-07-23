# Code Explorer: Python Data Structures and Algorithms

> Prepare the structure. Follow the operation. Question the evidence.

This is the beginner guide for the separate Code Explorer Data Structures and Algorithms workspace.

## Current release status

The DSA workspace is currently at **Chunk 0: foundation preview**.

Chunk 0 provides:

- A dedicated `data-structures.html` page.
- A separate Python editor that does not overwrite the original Python workspace.
- Automatic same-origin saving of DSA source.
- Editor text wrapping.
- Editor font sizes from 12 px through 22 px.
- Complete-document Copy and Paste actions.
- Light and dark themes.
- Responsive navigation for the final 18 approved learning views.
- Clear **Unavailable** messages wherever runtime evidence does not yet exist.
- A validated target of 535 future Tier A curriculum programs.

Chunk 0 does not provide:

- Python execution in the DSA workspace.
- DSA traces or playback.
- Structure visualizations.
- Runtime operation events.
- Algorithm comparisons.
- Automatic or exported learning comments.
- A DSA example catalog.
- Any of the planned 535 curriculum programs.

The disabled controls and foundation cards state these boundaries directly. They are not loading indicators and do not become active after waiting.

```text
CHUNK 0
|
+-- real editor and local persistence
+-- real theme and clipboard controls
+-- real 18-view navigation
+-- validated names and curriculum target
|
+-- no execution evidence yet
+-- no algorithm result yet
+-- no implemented DSA curriculum yet
```

## Contents

- [Start here](#start-here)
- [Choose the correct workspace](#choose-the-correct-workspace)
- [Workspace map](#workspace-map)
- [The DSA editor](#the-dsa-editor)
- [The 18-view learning map](#the-18-view-learning-map)
- [Honest evidence labels](#honest-evidence-labels)
- [Foundation status counts](#foundation-status-counts)
- [What is saved](#what-is-saved)
- [Current limits](#current-limits)
- [Privacy and network requests](#privacy-and-network-requests)
- [Accessibility and responsive behavior](#accessibility-and-responsive-behavior)
- [Troubleshooting](#troubleshooting)
- [What comes after Chunk 0](#what-comes-after-chunk-0)

## Start here

1. Open the Code Explorer landing page.
2. Select **Python Data Structures and Algorithms**.
3. Read the **Chunk 0 foundation preview** message.
4. Edit the starter search program or paste your own Python source.
5. Try **Wrap on**, the font selector, **Copy**, and **Paste**.
6. Open **Trace**, **Data**, **Flow**, and **Labs**.
7. Select different views and read the question each future view will answer.

Do not expect **Run trace** to activate in Chunk 0. The current purpose is to establish a safe separate workspace and a stable learning map before runtime features and hundreds of reviewed programs are added.

### The editable starter source

The initial DSA source is a small linear search:

```python
values = [7, 3, 9, 1, 5]
target = 9
found_index = -1

for index, value in enumerate(values):
    if value == target:
        found_index = index
        break

print("Found index:", found_index)
```

In Chunk 0 this code is editable source only. The DSA workspace does not execute it yet. The program is not counted as one of the planned 535 reviewed curriculum programs.

## Choose the correct workspace

The landing page now provides two equally visible paths:

```text
Code Explorer
|
+-- Start exploring Python
|      |
|      +-- workspace.html
|      +-- 134 implemented Python programs
|      +-- implemented Python tracing views
|      +-- Tool Guide -> README.md
|
+-- Python Data Structures and Algorithms
       |
       +-- data-structures.html
       +-- Chunk 0 foundation preview
       +-- Tool Guide -> README_DSA.md
```

The shared landing page has no Tool Guide button because one link would be ambiguous. Each workspace links to the guide that describes its own implemented behavior.

## Workspace map

```text
DATA STRUCTURES AND ALGORITHMS WORKSPACE
|
+-- Header
|      +-- DSA foundation status
|      +-- Light mode or Dark mode
|      +-- DSA Tool Guide
|      +-- GitHub repository
|
+-- Workspace heading
|      +-- Home
|      +-- Chunk 0 boundary
|      +-- disabled future actions
|
+-- DSA Python source
|      +-- Wrap on or Wrap off
|      +-- Automatic comments unavailable
|      +-- Font size
|      +-- Copy
|      +-- Paste
|      +-- main.py
|      +-- source line and character count
|
+-- Learning-view foundation
|      +-- Trace
|      +-- Data
|      +-- Flow
|      +-- Labs
|
+-- Foundation status
       +-- 18 approved view contracts
       +-- 31 normalized event names
       +-- 19 representation names
       +-- 535 planned Tier A programs
```

## The DSA editor

### Separate source

The DSA workspace and original Python workspace use different local source keys.

```text
workspace.html source
        |
        +-- remains unchanged when DSA source is edited

data-structures.html source
        |
        +-- remains unchanged when Python workspace source is edited
```

Reloading `data-structures.html` restores the latest DSA source when same-origin browser storage is available.

### Wrap

**Wrap on** keeps a long source line inside the editor width.

**Wrap off** preserves one visual row per source line and allows the editor's own horizontal scrolling.

Changing wrapping affects presentation only. It does not insert or remove Python characters.

### Font size

The implemented choices are:

```text
12 px
14 px
16 px
18 px
20 px
22 px
```

The selected size is saved locally for the DSA editor. It does not change the original Python workspace font setting.

### Copy

**Copy** requests permission to place the complete DSA source document on the system clipboard. It copies the complete document, not only a selection.

If modern clipboard writing is unavailable, Code Explorer attempts a native selection-based fallback. If both approaches are blocked, the workspace tells the learner to focus the editor and use the operating system copy shortcut.

### Paste

**Paste** requests plain text from the system clipboard and replaces the complete DSA editor document.

Pressing the dedicated Paste control is the learner's explicit request for complete-document replacement. An empty clipboard does not erase the current source.

If clipboard reading is blocked, a visible alert explains that permission was blocked and suggests focusing the editor and using the operating system paste shortcut.

### Enhanced editor fallback

CodeMirror supplies the enhanced editor when its pinned modules load successfully. If those modules cannot load, Code Explorer creates a basic textarea containing the same source.

The fallback still supports:

- Editing.
- Local source saving.
- Wrapping.
- Font sizing.
- Copy.
- Paste.
- Line and character statistics.

The fallback message does not claim that a network failure changed or deleted source.

## The 18-view learning map

Chunk 0 implements the navigation and reviewed purpose of each view. It does not implement runtime results for these views.

### Trace

| View | Question it will answer | Chunk 0 result |
| --- | --- | --- |
| Algorithm Story | How does the selected Python step relate to a reviewed algorithm action? | Unavailable |
| Before and After | What changed between adjacent recorded states? | Unavailable |
| Decisions | What comparison occurred and which path was selected? | Unavailable |
| Calls and Recursion | Which calls, frames, base cases, depths, and returns were observed? | Unavailable |
| Error Coach | What recorded failure occurred and what evidence should be inspected first? | Unavailable |

### Data

| View | Question it will answer | Chunk 0 result |
| --- | --- | --- |
| Variables | Which names, values, types, scopes, and histories exist? | Unavailable |
| Watches | How do selected boundaries, counters, indices, pointers, or accumulators change? | Unavailable |
| Structure Canvas | What supported structure exists and how is it connected or ordered? | Unavailable |
| References | Which names, nodes, and objects conceptually reference each other? | Unavailable |
| Mutation Explorer | Did an object change in place, or was a name reassigned? | Unavailable |
| Invariant Checker | Does recorded evidence satisfy a reviewed structure or algorithm rule? | Unavailable |

### Flow

| View | Question it will answer | Chunk 0 result |
| --- | --- | --- |
| Operation Journey | Where does the current event belong inside the complete operation? | Unavailable |
| Algorithm Path | Which indices, nodes, edges, states, or subproblems were visited? | Unavailable |
| Step Table | How do values and structure actions compare across steps or phases? | Unavailable |
| Complexity Lab | What work was observed, and what theory is supplied by reviewed curriculum context? | Unavailable |

### Labs

| View | Question it will answer | Chunk 0 result |
| --- | --- | --- |
| Input Playground | What changes when controlled input values change? | Unavailable |
| Compare Algorithms | How do compatible reviewed programs or runs differ on equivalent inputs? | Unavailable |
| Edge Case Lab | How does a reviewed algorithm behave on meaningful boundaries? | Unavailable |

### Why unavailable views are selectable

The view shell is intentionally testable before runtime work begins. Selecting a view confirms:

- Its approved name.
- Its learning area.
- Its beginner-facing purpose.
- Its responsive tab behavior.
- Its saved local selection.
- Its honest no-evidence state.

It does not confirm that its future visualization or explanation is implemented.

## Honest evidence labels

Future DSA results will use four evidence labels. Chunk 0 already uses **Unavailable** so the interface begins with the correct honesty rule.

```text
Observed
-> directly supported by the recorded execution

Curriculum context
-> reviewed knowledge attached to a catalog program

Unavailable
-> cannot be concluded from current evidence

Shortened
-> evidence exists, but a documented presentation limit was reached
```

Examples:

```text
Observed:
The program compared target with values[middle].

Curriculum context:
This reviewed binary-search lesson removes one half after the comparison.

Unavailable:
Code Explorer cannot reliably identify the intended algorithm in this pasted program.

Shortened:
The graph contains more nodes than this view displays. The trace and source remain preserved.
```

Chunk 0 produces no observed DSA events, curriculum explanations, or shortened DSA diagrams.

## Foundation status counts

The bottom status panel displays:

| Count | Meaning | Implementation claim? |
| ---: | --- | --- |
| 18 | Approved and rendered view contracts | Navigation only |
| 31 | Stable normalized event names for later chunks | No events emitted yet |
| 19 | Stable structure representation names | No DSA renderer implemented yet |
| 535 | Approved Tier A curriculum target | No DSA programs implemented yet |

These values prevent later chunks from silently changing foundational names or losing curriculum coverage. They must not be read as completed-feature totals.

## What is saved

Chunk 0 may save these values in same-origin browser storage:

| Local value | Purpose | Lifetime |
| --- | --- | --- |
| DSA source | Restore `main.py` after reload | Until site data is cleared or replaced |
| DSA wrapping | Restore visual wrapping | Until site data is cleared or changed |
| DSA font size | Restore editor text size | Until site data is cleared or changed |
| Active DSA view | Return to the selected view | Until site data is cleared or another view is selected |
| Shared theme | Keep light or dark mode consistent | Until site data is cleared or theme changes |

Chunk 0 does not save:

- Traces.
- Console output.
- Algorithm events.
- Comparisons.
- Edge-case results.
- Watches.
- Bookmarks.
- Curriculum completion.
- Learner identity.
- Analytics events.

If browser storage is blocked or full, the workspace remains usable for the current page session. Reload persistence may be unavailable. Code Explorer does not upload the values as a fallback.

## Current limits

This section describes every limit that applies to the implemented Chunk 0 workspace.

### Execution limit

The DSA workspace does not execute Python in Chunk 0.

Therefore:

- No DSA trace-step limit is active.
- No DSA execution timeout is active.
- No recursion limit is set by the DSA workspace.
- No DSA console-output limit is active.
- **Run trace** remains disabled.

The original Python workspace still has its own documented 3,000-step and 30-second limits. Those existing limits must not be mistaken for an active DSA runtime.

### Source-document limit

Chunk 0 does not impose a fixed character or line-count cap on the editor. Browser memory and editor performance still have practical limits.

The workspace is intended for beginner programs and small DSA experiments, not very large repositories or production files. The footer reports exact source lines and characters so the learner can see document size.

If a very large document feels slow:

1. Copy the source to a safe local file.
2. Reduce the program to the structure or algorithm currently being studied.
3. Reload the workspace if necessary.
4. Paste the smaller focused program.

### Font-size limit

Only the six documented values from 12 px through 22 px are accepted. Modified storage values outside this list return to 14 px.

### Learning-view limit

Chunk 0 contains exactly 18 approved views across four areas. It does not accept custom view definitions from learner source or browser storage.

Unknown or modified saved view ids return to **Algorithm Story** instead of creating a blank panel.

### Event and representation limits

The status panel contains 31 event names and 19 representation names. These are contracts only.

Chunk 0 emits:

```text
0 DSA runtime events
0 structure diagrams
0 invariant results
0 complexity measurements
0 comparisons
```

There is no hidden partial event stream.

### Catalog limit

The number 535 is the approved Tier A target, not a current catalog size.

Chunk 0 provides:

```text
0 reviewed DSA curriculum programs
```

The editable starter source is not included in the 535 target.

### Clipboard limit

Copy and Paste handle plain text only. Clipboard access depends on:

- Browser support.
- Secure-context rules.
- User permission.
- A direct learner action.

Code Explorer does not read the clipboard automatically and does not retain clipboard text outside the editor replacement requested by the learner.

### Local-storage limit

Storage capacity is controlled by the browser and may differ by browser mode, device, site settings, or available space. Chunk 0 does not claim a universal number.

If saving fails:

- The current editor remains usable.
- The source is not uploaded.
- A later reload may return to an older saved value or the starter source.

### Display limit

Chunk 0 renders static contract prose instead of graphs or tables. No DSA visualization can currently be shortened because no DSA visualization is implemented.

Later chunks must document verified node, edge, cell, bucket, depth, label, history, and comparison limits here before those features are described as available.

### Desktop and mobile boundary

The same source, settings, and view contracts are available at desktop and narrow widths.

Presentation changes include:

- Two primary workspace columns stack into one.
- Editor controls wrap into additional rows.
- Learning tabs wrap inside their panel.
- Four foundation metrics become a two-column phone grid.
- The landing destinations stack on narrow screens.

Mobile presentation does not reduce the current contract counts.

## Privacy and network requests

Code Explorer does not collect learner data for analytics, telemetry, advertising, profiling, or engagement measurement.

Chunk 0 does not upload:

- DSA source.
- Clipboard text.
- Selected views.
- Theme.
- Editor preferences.
- Any learner identifier.

The DSA page requests pinned CodeMirror modules from `esm.sh` when the enhanced editor loads. GitHub Pages serves the site, and external Tool Guide or GitHub links navigate only after the learner selects them.

Those providers can receive ordinary request metadata such as an IP address and browser headers under their own policies. Code Explorer does not attach learner source, clipboard content, stored settings, project-generated identifiers, or workspace actions to those requests. Project maintainers cannot use Code Explorer to view provider-side IP addresses, raw browser headers, or raw request logs.

GitHub may expose aggregate repository traffic to people with repository access. For example, it may report that a repository page received a number of visits during a recent period. That does not reveal the Python source a learner typed, which view they opened, their clipboard, their local settings, or what happened in their workspace. It is GitHub platform traffic, not Code Explorer application analytics.

External links use `rel="noreferrer"`.

## Accessibility and responsive behavior

Chunk 0 includes:

- Semantic header, main, workspace, navigation, tab list, tab panel, and footer regions.
- Visible text for theme actions.
- Accessible names for the GitHub link and guide destination.
- Text-based runtime status in addition to a status dot.
- Text-based **Unavailable** evidence state in addition to color.
- `aria-pressed` on wrapping and area navigation.
- `aria-selected` on view tabs.
- Visible keyboard focus from the shared interface theme.
- Reduced-motion support from the shared stylesheet.
- No required horizontal category scrolling.

Disabled actions remain keyboard-unavailable because they have no implemented result.

## Troubleshooting

### Run trace is disabled

This is expected in Chunk 0. Waiting or reloading will not activate it.

### Examples are disabled

The DSA curriculum begins in Chunk 1. The original 134 Python programs remain available inside `workspace.html`.

### A view says Unavailable

This is the correct foundation state. It means the view has no recorded DSA evidence and will not guess.

### My DSA code returned after reload

This is expected local persistence. It does not mean the code was uploaded or associated with an account.

### My DSA code did not return after reload

Browser storage may be blocked, full, cleared, or unavailable in the current mode. Code Explorer keeps working in the current session but does not upload source as a backup.

### The enhanced editor did not load

The browser may be offline, `esm.sh` may be unavailable, or a network policy may block the module request. Use the basic editor fallback. Your visible source remains editable.

### Paste shows a permission alert

Allow clipboard access for the page, or focus the editor and use the operating system paste shortcut.

### The selected view changed to Algorithm Story

A saved view id was missing, invalid, or no longer recognized. The workspace returned to its safe first view rather than showing an empty panel.

## What comes after Chunk 0

The approved implementation sequence is:

```text
Chunk 0  Shared architecture and DSA workspace foundation
Chunk 1  Foundations, containers, arrays, searching, and sorting
Chunk 2  Stacks, queues, linked structures, and hashing
Chunk 3  Trees, BSTs, heaps, tries, and Union-Find
Chunk 4  Graphs, traversal, shortest paths, and spanning trees
Chunk 5  Recursion, backtracking, and divide and conquer
Chunk 6  Greedy algorithms, dynamic programming, bits, and mathematics
Chunk 7  Investigations, guided challenges, comparisons, and final audit
```

This sequence is a roadmap, not an implemented-feature claim. Each later chunk must update this guide with only the behavior, programs, views, limits, and failure states that passed its release checks.

The final Tier A target remains 535 high-quality programs. Development in chunks protects that quality. It does not reduce the final subject coverage.
