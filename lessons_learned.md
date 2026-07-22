# Code Explorer lessons learned

This is a living post-mortem for Code Explorer. It records what Aman Ali Pogaku learned while defining and reviewing the product, and what Codex learned while researching, building, testing, correcting, and documenting it.

The purpose is not to assign blame. The purpose is to preserve reasoning that would otherwise disappear after a feature is finished. A future beginner, contributor, or maintainer should be able to understand why the project looks and behaves the way it does.

## How to read this document

```text
Question or idea
       |
       v
Discussion and feasibility check
       |
       v
Decision
       |
       +-- Implemented
       +-- Deferred
       +-- Rejected or narrowed
       |
       v
Lesson preserved here
       |
       v
Better decisions during the next change
```

The document has two main viewpoints:

- **Lessons learned by the user** records product, learning, scope, design, and project-management insights that emerged from Aman's questions and decisions.
- **Lessons learned by Codex** records engineering, testing, communication, reliability, and maintenance insights that should improve future work.

## Attribution and correction standard

This document should state clearly where an important correction, constraint, or product idea originated. Giving credit is not about declaring a winner. It preserves the actual collaboration that improved the project.

The standard is:

- Credit Aman when his question, observation, or correction materially improves the product decision.
- Record user-side learning that emerges from successful decisions, implementation evidence, and seeing an idea work, even when Aman did not need to correct Codex.
- Record Codex's mistaken assumption or incomplete reasoning directly instead of rewriting history to make it appear correct from the beginning.
- Credit Codex when technical evidence, testing, or a safety boundary corrects an unsafe or impractical proposal.
- Explain the evidence when either participant changes the other's mind.
- Distinguish a discussed idea from an approved feature and an implemented feature.
- Correct this document when later evidence shows that an earlier lesson is incomplete.

```text
Initial idea or claim
        |
        v
Question or challenge
        |
        v
Evidence and reasoning
        |
        v
Corrected decision
        |
        v
Credit the person who identified the improvement
```

Honesty matters more than defending an earlier answer. Aman should expect Codex to challenge him respectfully when a request would be misleading, unsafe, unreliable, or unnecessarily complicated. Codex should expect Aman to correct product assumptions that overlook the learner's experience, the project's values, or the intended ambition. Both kinds of correction strengthen an open-source project.

## Status words used below

| Status | Meaning |
| --- | --- |
| Implemented | The behavior exists in the current codebase and should be tested before it is described as complete. |
| Approved next | The feature has been approved, but development has not started or has not finished. |
| Deferred | The idea is useful, but the project intentionally postponed it. |
| Explored | The idea was researched or discussed without a build decision. |
| Boundary | The project intentionally does not promise this behavior. |

## Project journey at a glance

```text
Static Python visualizer idea
          |
          v
Feasibility before implementation
          |
          v
Python-first beginner MVP
          |
          v
Dedicated execution workspace
          |
          v
Reliable trace, variables, loops, and output
          |
          v
Expanded Trace, Data, Flow, and Labs views
          |
          v
UI stability, themes, fonts, graphs, and editor tools
          |
          v
18 guided examples and a detailed beginner README in v1
          |
          v
Repository governance through AGENTS.md and SKILLS.md
          |
          v
Living post-mortems through lessons_learned.md
          |
          v
Automatic Learning Comments and 54 examples in v2
          |
          v
Vertical curriculum navigation and inline study comments in v3
          |
          v
Explicit permanent no-analytics project rule
          |
          v
Blended 134-program curriculum and inspectable object state in v4
```

# Lessons learned by the user

## 1. A useful project starts with feasibility, not code

The first important decision was to ask whether the idea was possible before authorizing a build. The original vision involved pasting Python code, visualizing data flow, showing variables and memory-like relationships, and drawing a program graph.

The lesson is that a strong idea benefits from being separated into three categories:

```text
Easy and reliable now
       +-- Source editor
       +-- Browser execution
       +-- Output capture
       +-- Step playback
       +-- Variable snapshots

Moderate work
       +-- Conditions and loop explanations
       +-- Function frames
       +-- Mutation history
       +-- Reference and flow graphs

Hard or misleading without strict limits
       +-- Exact physical memory visualization
       +-- Every Python feature and package
       +-- Production-debugger behavior
       +-- Unlimited execution and trace storage
```

Asking for this distinction prevented an exciting concept from becoming an unreliable promise.

## 2. A static, client-side product can still be substantial

The project began with a practical constraint: CachyOS, Codex on Linux, a GitHub account, and GitHub Pages, with no desire to operate a server.

The resulting lesson is that a static site is not limited to simple text pages. Modern browser technologies can provide:

- A real Python runtime through Pyodide.
- Background execution through a Web Worker.
- A capable editor through CodeMirror.
- Interactive graphs through Cytoscape.
- Local persistence through browser storage.
- A dedicated workspace that can be bookmarked and reloaded.

The lack of a server became a product value. Learner code remains inside the browser, hosting stays simple, and the open-source project remains easier to deploy.

## 3. A clear audience is a feature filter

The project deliberately focuses on beginners learning Python. That decision affects every later choice.

A beginner-focused tool should:

- Explain one observable fact at a time.
- Use small programs and bounded traces.
- Prefer plain language over debugger terminology.
- Show values, scopes, conditions, loops, calls, and errors visually.
- Avoid features that complete the learner's entire solution.
- Provide examples that isolate concepts before combining them.
- Make failure states understandable instead of merely reporting technical errors.

The audience definition helped reject unnecessary complexity and justified features such as Story, Before and After, Loop Table, Error Coach, and guided examples.

## 4. Python was the right first language

The project considered future language expansion, but Python remained the first target because:

- It is widely used by beginners.
- Pyodide runs it in the browser.
- Python exposes tracing through `sys.settrace`.
- Python's AST can describe loops, conditions, and source structure.
- Its variables, collections, functions, and exceptions create useful teaching moments.

The broader lesson is to build one language deeply before offering several languages shallowly.

## 5. Similar language support depends on runtime observability

When other programming languages were discussed, the important question was not merely whether code could execute in a browser. The stronger question was whether the tool could reliably collect the same educational facts:

- Executed source line
- Variables in scope
- Before and after values
- Function calls and returns
- Conditions and loop iterations
- Errors
- Mutable objects and references
- A bounded execution path

Languages with browser runtimes, interpreters, source instrumentation, or debugger hooks are better candidates than languages that only compile to opaque WebAssembly without useful source-level state.

This remains an explored future direction, not a promise that every current Python feature can immediately be duplicated for every language.

## 6. DevOps learning needs simulation, parsing, or visualization rather than ordinary execution

Jenkins, Terraform, Docker, Kubernetes, Ansible, GitHub Actions, and similar technologies can inspire Code Explorer-like learning tools, but they are different from tracing Python variables.

A safe beginner tool for these technologies would usually need to:

- Parse configuration or pipeline files.
- Visualize dependency order and lifecycle stages.
- Explain what a command or block intends to do.
- Simulate plans or state transitions.
- Avoid applying real infrastructure by default.
- Clearly separate simulated results from real provider behavior.

The lesson is that the interface idea can transfer, but the execution model cannot simply be copied.

## 7. Library research changes what is realistically possible

It was valuable to challenge an initial difficulty estimate and ask whether JavaScript libraries could help. That led to a more grounded plan around:

- CodeMirror for editing and source annotations.
- Pyodide for client-side Python.
- Cytoscape for graphs.
- Browser workers, storage, clipboard, and dialog APIs.

Later, checking CodeMirror's documentation revealed additional learning possibilities such as decorations, hover tooltips, lint diagnostics, custom gutters, and educational autocomplete.

The lesson is to research mature browser primitives before declaring a feature too difficult or inventing a custom implementation.

## 8. The project does not use Vue, and it does not need Vue yet

The application uses plain JavaScript, HTML, and CSS. Asking whether Vue was present clarified the actual technology stack.

The lesson is that framework choice should follow a demonstrated need. A larger feature count does not automatically require a framework. The current direct architecture remains understandable for beginners and avoids a build step. If state coordination becomes unsafe later, that decision can be revisited with evidence.

## 9. MVP screens should be defined before styling and implementation

Defining the landing page, examples dialog, and execution workspace before building helped establish the main journey:

```text
Landing page
     |
     +-- Start exploring
     |       |
     |       v
     |   workspace.html
     |
     +-- Load an example
             |
             v
       Select program
             |
             v
       workspace.html with saved source
```

The lesson is that screens, navigation, and persistence are product behavior, not decoration.

## 10. A workspace needs its own URL and persistent source

The initial single-page behavior made reloading costly because the learner could be returned to the beginning. Requesting a separate `workspace.html` established a durable location.

The important learning is that a serious browser tool should let the user:

- Bookmark the working page.
- Reload without losing source.
- Enter from a direct link.
- Navigate home with a normal link.
- Select an example on the landing page and arrive with it already loaded.

This is a small architectural decision with a large usability benefit.

## 11. Navigation must be tested as a user journey

At one point, Start exploring and selecting an example did not open the editor correctly. The screenshots showed that individual components could look correct while the complete journey remained broken.

The lesson is to test actions from their true starting point:

```text
Landing action
       |
       v
Navigation
       |
       v
Saved or selected state
       |
       v
Workspace initialization
       |
       v
Expected editor content
```

A button is not complete merely because it has a click handler. Its destination and resulting state must be verified.

## 12. Dark mode is a complete visual system, not one background color

Early screenshots showed surfaces that remained dark in light mode and text that was hard to read in dark mode. The lesson is that theme work must cover:

- Page backgrounds
- Panels and dialogs
- Editor surfaces
- Text and muted text
- Borders and focus rings
- Syntax highlighting
- Graph labels and nodes
- Buttons, sliders, and native form controls
- Empty states and overlays

Theme testing must inspect every nested surface in both modes.

## 13. Explicit labels are often better than unexplained symbols

The original theme button used a symbol. Replacing it with explicit Dark mode and Light mode text made the action understandable without prior knowledge.

The GitHub control moved in the opposite direction because the GitHub mark is broadly recognizable and retains a complete accessible label.

The lesson is not that text is always better than icons. The lesson is to evaluate recognition, context, and accessibility for each control.

## 14. Geeky design still needs readable typography

The desired visual identity was geeky, creative, and technical. Later screenshots exposed blurry or low-contrast graph and interface text.

The lesson is that aesthetic character must not reduce legibility. A technical interface benefits from monospace accents, terminal motifs, grids, and bold geometry, but body copy and graph labels still need:

- Sufficient size
- Strong contrast
- Stable rendering
- Sensible line height
- Appropriate font weight
- Clear light and dark theme colors

The best visual style supports comprehension rather than competing with it.

## 15. Graph movement can become a health and comfort problem

The description of graph windows “shaking as though they got seizures” was important feedback. Repeated layout work, resizing, or refitting can cause distracting motion and physical discomfort.

The lesson is that visualization stability is part of accessibility. Graphs should:

- Reuse an existing graph instance where possible.
- Avoid rerunning layout for a simple step selection.
- Update styles without rebuilding stable elements.
- Fit only on initial display or explicit request.
- Respect reduced-motion preferences.
- Avoid container size oscillation and nested scroll fighting.

UI tests should include watching the interface through several trace steps, not only taking one still screenshot.

## 16. Zoom needs both convenience and granular control

A Fit button is useful for immediate orientation, but longer programs and larger graphs need a zoom slider. The resulting design combined:

- Fit
- Zoom out
- Zoom in
- A granular percentage slider
- A visible percentage value
- Persistent graph-specific zoom preferences

The lesson is that presets and granular control serve different needs. Offering both makes visualizations more usable without making zoom behavior mysterious.

## 17. Editor productivity features matter in a learning tool

Text wrapping, selectable font size, complete-document Copy, and complete-document Paste were requested because learners repeatedly move code between lessons, exercises, and Code Explorer.

The lesson is that learning tools still need practical editing comfort:

- Wrapping should change presentation without changing source.
- Font size should be independent from graph zoom.
- Copy should clearly operate on the complete program.
- Paste should clearly replace the complete program.
- Source changes must invalidate stale trace data.
- Preferences should survive reloads.

These are not glamorous features, but they reduce friction during every use.

## 18. Browser permission failures need explicit feedback

Clipboard APIs depend on browser context and permission. If Paste silently fails, a learner may assume the tool is broken.

The requested permission alert established a broader lesson:

- A blocked capability must produce a visible explanation.
- The explanation should identify the permission involved.
- It should provide a fallback such as focusing the editor and pressing `Ctrl+V`.
- Empty clipboard content should not erase useful source.

Silence is not a safe fallback for user-initiated operations.

## 19. Safety limits should be chosen around learning value, not maximum capacity

Several possible limits were discussed, including 10,000 steps with two minutes and 5,000 steps with 45 seconds. The current code remains deliberately bounded at:

```text
Maximum trace: 3,000 steps
Execution timeout: 30 seconds
```

The lesson is that browser capability is not the only consideration. Every step carries serialized variables, frames, output, and visualization work. Higher limits can increase:

- Browser memory use
- Mobile instability
- Playback complexity
- Graph size
- Time spent waiting for an unhelpful trace

For beginners, a clear limit message and advice to reduce input are often more valuable than recording a very large execution.

## 20. A trace store can be improved, but should not be optimized without a concrete need

The idea of improving the trace store was explored and then intentionally withdrawn. That was a useful decision.

The lesson is that internal optimization should be driven by observed failures, profiling, or an approved feature that requires it. Reworking storage merely because the project is growing can introduce risk without improving the learner experience.

## 21. The tool is useful for data structures, but not automatically complete for algorithms

Code Explorer already teaches important data-structure ideas:

- Lists, tuples, sets, and dictionaries
- Indexes and keys
- Nested structures
- Mutation and reassignment
- Aliases and shared objects
- Value histories

Classical data structures and algorithms require additional representations and examples. Stacks, queues, linked lists, trees, graphs, sorting, searching, recursion, and complexity analysis each need carefully designed educational views.

The lesson is to distinguish “Python can execute this algorithm” from “the tool teaches this algorithm well.” Execution alone is not sufficient pedagogy.

## 22. LeetCode compatibility is not the right success measure

The question about running all LeetCode Python problems exposed several boundaries:

- Many problems assume a platform-provided function signature or data type.
- Some require large inputs or many iterations.
- Some rely on recursion depth, performance, packages, or hidden tests.
- A 3,000-step educational trace is intentionally smaller than many challenge workloads.

The tool can help study small algorithm examples and selected challenge solutions, but it should not claim universal LeetCode compatibility.

The better success measure is whether a beginner can understand the behavior of a suitably small program.

## 23. A large feature set needs information architecture

As the workspace grew, a flat tab row became difficult to scan. Grouping views under four learning areas created a stable mental model:

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

The lesson is that adding a feature also creates a navigation cost. Grouping by the learner's question makes a complex workspace feel smaller.

## 24. Specialist views should answer different questions

The expanded workspace works best when each view has a distinct purpose:

- Story: What did this step do?
- Before and After: What changed?
- Conditions: Why was this branch chosen?
- Function Journey: What happened across calls?
- Error Coach: Why did execution stop?
- Variables: What does this name contain now?
- Watches: Which selected names should remain visible?
- Structures: What are the children, indexes, or keys?
- References: Do names share an object?
- Mutation Explorer: Was the object changed or the name replaced?
- Execution Path: Which transition occurred?
- Coverage: Which source lines were reached?
- Loop Table: How did values vary by iteration?
- Loop Lab: Where is the selected step within the loop?
- Input Playground: What responses will `input()` consume?
- Compare Runs: What changed between two experiments?
- Trace Bookmarks: Which moments deserve later review?

The lesson is to avoid two tabs that present the same data with different titles.

## 25. Example quantity should follow feature coverage

The project began with fewer examples, then questioned whether eight were enough. v1 contained 18 curated programs. v2 deliberately expanded the library to 54 after the filters, card metadata, and desktop-oriented learning workspace made the larger curriculum navigable.

The useful lesson is not that 18 or 54 is a magical number. The correct number depends on feature coverage, meaningful variation, navigation quality, and the intended learning depth. A larger library is justified when examples are categorized, varied, and connected to clear learning routes rather than added only to increase a count.

The expanded examples now cover:

- Variables and arithmetic
- Strings
- Conditions and Boolean logic
- Prepared input
- `for` and `while` loops
- `break` and `continue`
- Functions and nested calls
- List mutation
- Aliases and reassignment
- Nested dictionaries and lists
- Dictionary counting
- Runtime errors

Each example should have a primary learning goal and recommended views.

## 26. Documentation should guide behavior, not merely list features

The README initially felt too short even after features were documented. The most valued additions were maps such as:

- A useful question map
- The workspace map
- A final beginner workflow

The lesson is that beginners need decision support:

```text
I have a question
       |
       v
Which view answers it?
       |
       v
What should I look for?
       |
       v
What should I try next?
```

Feature names alone do not teach someone how to use a complex tool.

## 27. Documentation work benefits from deliberate sequencing

The examples expansion and README expansion were intentionally divided into two phases. Examples were implemented and tested first. Documentation was updated only after the feature set was stable.

The lesson is that separating major work can improve quality when one phase depends on the final truth produced by another. Documentation should be synchronized with code, but it should describe verified behavior rather than an unstable intermediate plan.

## 28. The README should remain a tool guide

The README was deliberately scoped to Code Explorer's features, workflows, examples, expected behavior, and beginner guidance. Implementation architecture and system design were reserved for future documentation.

The lesson is that one document should not serve every audience. The current separation is:

```text
README.md
     +-- Beginner tool guide

AGENTS.md
     +-- Contributor rules

SKILLS.md
     +-- Internal project knowledge and working recipes

lessons_learned.md
     +-- Decisions, discoveries, mistakes, and post-mortems

Future documentation folder
     +-- Deeper implementation and system-design material
```

## 29. Small wording changes can clarify product scope

Changing “Paste a beginner Python program” to “Paste a Python program” removed an unnecessary restriction while preserving the beginner audience.

The final capitalization, “Paste a Python program,” also matters because Python is a proper name.

The lesson is that interface wording should describe what the tool accepts without making the learner feel categorized or limited.

## 30. Discoverability grows in importance as features grow

Adding a Tool Guide link beside the repository and theme controls recognized that a feature-rich workspace needs help close at hand.

Similarly, expanding landing-page topic chips helped the introduction reflect the actual product rather than its earliest four concepts.

The lesson is that every added capability should prompt two questions:

- How will a beginner discover it?
- Where will a beginner learn when to use it?

## 31. Ownership and presentation details matter in open source

Adding the copyright “Aman Ali Pogaku,” a recognizable GitHub icon, a guide link, explicit theme labels, and consistent landing-page topics improved the project's identity.

The lesson is that open-source polish includes attribution, discoverability, accessibility, and trust, not only functionality.

## 32. Code comments are part of the teaching mission

The request for very detailed comments across all files recognized that the repository itself may be studied by beginners.

The lesson is to comment:

- Why a function exists
- What data it receives
- What it returns
- What state or browser capability it changes
- What safety limit it enforces
- Why a fallback exists
- Why a non-obvious design choice was made

Comments should teach decisions and concepts. Comments that merely translate punctuation into English can make code harder to read.

## 33. The no-em-dash rule is a real project requirement

The preference to avoid em dash characters applies to responses, interface text, source comments, and documentation. It is now a permanent repository rule and an automated search check.

The lesson is that writing-style requirements deserve the same consistency as code-style requirements.

## 34. CodeMirror can support a learning layer, not only a text editor

Research into CodeMirror documentation identified several practical future features:

- Automatic Learning Comments
- Hover variable inspection
- Inline error diagnostics
- Inline variable values
- Run-to-line gutter markers
- Read and write highlighting
- Learning-focused autocomplete
- Smart fold summaries

CodeMirror supplies presentation primitives such as decorations, widgets, tooltips, diagnostics, gutters, and completion sources. Code Explorer must still supply accurate Python meaning from syntax and trace evidence.

## 35. Automatic Learning Comments can be valuable if it is conservative

The approved next feature will create a separate commented learning version after a trace. It should combine parsed syntax with observed execution facts.

The feature is valuable because a learner can study or copy the explanation outside the workspace. It is also risky because a confident but false comment can teach the wrong concept.

The accepted safety rules are:

- Do not change the original source by default.
- Preserve indentation, blank lines, and existing comments.
- Do not invent explanations for unsupported or ambiguous code.
- Do not present one loop iteration's value as universally true.
- Require confirmation before replacing the editor with generated source.
- Let comment-generation failure remain isolated from tracing.
- Test every included example and additional edge cases.

Automatic Learning Comments is implemented in v2 with a separate preview, three detail levels, complete-document copy, confirmation-gated replacement, trace-backed evidence, and generated-line deduplication.

## 36. It is acceptable to defer a good idea

Several ideas were intentionally deferred:

- Classical algorithm-specific visualizations
- A larger or redesigned trace store
- A future documentation folder
- Other programming languages
- DevOps-specific learning tools
- Additional CodeMirror learning features beyond Automatic Learning Comments

The lesson is that saying “later” can protect the current product. A project becomes reliable by finishing selected features, not by immediately implementing every good idea.

## 37. Asking for confirmation before building reduces mistakes

The user repeatedly requested feasibility, reliability, feature definitions, interface maps, and difficulty explanations before authorizing implementation.

This produced a useful collaboration pattern:

```text
Idea
  |
  v
Can it be reliable?
  |
  v
What is the exact scope?
  |
  v
What will the interface look like?
  |
  v
What are the failure boundaries?
  |
  v
Build authorization
```

This pattern is especially valuable for features that transform learner code or expand the execution model.

## 38. A growing codebase needs persistent operating knowledge

Creating `AGENTS.md` and `SKILLS.md` was a response to growing complexity.

The lesson is that important requirements should not depend on one conversation's memory. Persistent files now record:

- Contributor rules
- Commenting expectations
- Safety boundaries
- Current capabilities
- Dependency versions
- State and persistence behavior
- Implementation recipes
- Regression programs
- Documentation synchronization

This lowers the chance that a future change quietly violates an earlier decision.

## 39. Sanity checks should compare documentation with code

The documentation audit did more than reread prose. It checked:

- All cached HTML ids exist.
- No duplicate ids exist.
- Both JavaScript files parse.
- Example count matches the README catalog.
- Asset cache versions match across pages.
- Markdown code fences are balanced.
- Forbidden dash characters are absent.
- Limits and dependencies match source constants and imports.

The audit also found a false `state.result` reference and corrected it to the real separated state fields.

The lesson is that documentation can contain bugs and deserves automated consistency checks.

## 40. Post-mortems should be a living project artifact

The idea for this file is itself an important lesson. Finished features preserve code, but they do not automatically preserve uncertainty, rejected options, painful UI problems, or the reasoning behind a decision.

Separating lessons into user and Codex perspectives keeps both kinds of knowledge:

- Product intuition and beginner needs
- Engineering and verification discipline
- Questions that changed the direction
- Mistakes that should not recur
- Deferred ideas worth reconsidering later

This file should be updated whenever a future task produces a reusable insight, even if no bug occurred.

## 41. Inline annotations and source comments are different products

The discussion about inline variable values led to an important clarification. CodeMirror can display temporary information beside code without changing the Python document. The v2 Learning Comments dialog generates a real `#`-commented study document that can be copied or placed into source after confirmation. The v3 Automatic comments toggle reuses the same reliable explanations as temporary editor widgets, so learners can choose either product deliberately.

```text
Inline annotation
       +-- Exists only in the editor view
       +-- Changes with the selected trace step
       +-- Does not become part of the Python program

Generated source comment
       +-- Is real Python text
       +-- Can be copied and studied elsewhere
       +-- Enters the editor only after confirmation

Automatic comments widget
       +-- Looks like a Python comment above its source line
       +-- Never becomes part of the document
       +-- Can be hidden without reconstructing source
```

The lesson is to identify whether a learning aid is presentation, generated content, or an actual source transformation before estimating or implementing it.

## 42. Breaks are part of sustainable project work

Imaginary coffee breaks, a real coffee break, and the decision to stop for sleep were lighthearted parts of the conversation, but they preserve a serious lesson. Long feature sessions can reduce visual judgment, patience, and review quality.

When the interface causes a headache, the correct response is not to keep staring at it. Stop, remove the motion problem, test calmly, and return with fresh attention.

Good collaboration leaves room to think between feature groups. A pause can prevent rushed requirements and unnecessary rework.

## 43. A larger example library can be the right choice when navigation is already strong

The initial concern about expanding from 18 to 54 examples was that a beginner might feel overwhelmed. Aman pointed out that concept filters already reduce the visible choices and that a serious user will normally study this feature-rich workspace on a laptop or desktop.

That changed the decision. Quantity and overload are not the same thing.

```text
54 unorganized snippets
        -> overwhelming

54 categorized programs
        + filters
        + difficulty levels
        + line counts
        + learning ladders
        + best-view suggestions
        -> navigable curriculum
```

The user was correct to connect the acceptable library size to the interface already built around it. Product decisions should consider the complete experience rather than one number in isolation.

Status: Implemented in v2.

## 44. Repetition teaches when the structure and context vary

The request was not simply for 36 more examples. It asked for several versions of important concepts, including `while` loops with different variable structures and complexity.

Educational repetition should vary the mental task:

- Countdown teaches a decreasing counter.
- Save until the goal teaches a growing total and target condition.
- Validate a positive number teaches repeated input and acceptance state.
- Process a task queue teaches mutation until a collection becomes empty.

All four use `while`, but they build different mental models. Repetition becomes useful when each example exposes another reason for using the construct.

Status: Implemented in v2.

## 45. Longer examples create a bridge from isolated syntax to real reading

Very short examples are excellent for first contact, but they do not fully teach a beginner how several familiar ideas cooperate in one program. Aman explicitly requested 15 to 20 line examples so learners could practice handling more complete source.

The resulting curriculum includes twelve programs in that range. They remain bounded enough for step-by-step tracing while combining calculation, conditions, loops, functions, collections, input, and reporting.

```text
one idea
   -> two combined ideas
   -> complete small program
   -> one learner-made variation
```

Status: Implemented in v2.

## 46. Generated comments are valuable because they can become a portable study artifact

Automatic Learning Comments began as a question about adding comments to pasted or newly written code. The important product decision was to generate a separate study copy only after a trace, then let the learner copy it or confirm a replacement.

This gives the feature several learning roles:

- A plain-language review beside source.
- A portable copy for personal notes.
- A bridge between visual evidence and ordinary Python comments.
- A way to compare concise and detailed explanations.

The original program remains protected by default, and generated notes describe observed behavior rather than pretending to know every future execution.

Status: Implemented in v2.

## 47. Beginner documentation needs misunderstandings and routes, not only definitions

The Python glossary originally defined a small set of terms in one or two sentences. Aman correctly identified that shallow documentation would not help a first-time learner enough.

A useful beginner reference needs four parts:

```text
TERM
+-- plain definition
+-- small code example
+-- common misunderstanding
+-- best place to observe it in the tool
```

The same principle applies beyond the glossary. A list of 54 example names is less useful than categories, learning ladders, expected behavior, and guidance about intentional failures.

Status: Implemented in the v2 documentation.

## 48. Category navigation should match how people scan a curriculum

Aman noticed that the expanded concept list was technically usable but required left-to-right scrolling. For a fixed educational taxonomy, that interaction makes learners search for navigation rather than search through ideas.

A vertical list communicates the whole structure more naturally:

```text
HORIZONTAL STRIP                  VERTICAL CURRICULUM
some categories visible          All
        |                         Foundations
        v                         Decisions
scroll sideways to discover      Loops
the rest                          Functions and Scope
                                  Collections
                                  References and Mutation
                                  Input and Debugging
```

The lesson is not that horizontal controls are always wrong. They are weak when labels are long, the set is known and bounded, and users need to compare all categories. The final browser uses a vertical sidebar on desktop and a bounded vertical region on mobile.

Status: Implemented in v3.

## 49. Learning flow can matter more than explanation density

Automatic comments were useful, but permanently placing generated text into source could interrupt the learner's sense of how the original program reads. Aman separated two needs that initially looked like one feature:

- Read explanations temporarily while following the program.
- Export a real commented copy for later study.

The first need benefits from an on or off reading layer. The second benefits from a preview, copy action, and explicit replacement confirmation. Treating them as separate modes preserves focus without removing either capability.

Status: Implemented in v3.

## 50. A visual replacement can satisfy the learning goal without replacing data

The request described the editor being replaced by automatic comments while the control was on. The reliable interpretation is visual replacement, not document mutation. The learner sees explanations and source together, but the stored Python remains unchanged.

This distinction protects:

- Python line numbers
- Trace-to-source mapping
- Replay breakpoints
- Execution heatmap ranges
- Normal Copy behavior
- Reloaded source

The broader product lesson is to ask what experience the learner wants, then choose the safest data behavior that produces that experience.

Status: Implemented in v3.

## 51. More features need clearer modes, not merely more buttons

The toolbar now names its state explicitly: **Automatic comments off** and **Automatic comments on**. The export action remains **Learning comments**. Each label describes a different consequence.

```text
Need a temporary reading aid?  -> Automatic comments
Need a portable study file?    -> Learning comments
Need original code again?      -> turn Automatic comments off
```

This continues an earlier project lesson about explicit Dark mode and Light mode labels. Discoverability improves when a control names both its purpose and current state.

Status: Implemented in v3.

## 52. Privacy should be an explicit invariant, not an assumption

Aman asked whether the project collected any user data for analytics, while also stating the permanent requirement that it never should. The code already had no analytics, but an unwritten expectation is easier to violate accidentally when a future contributor adds a dependency, logging tool, or product metric.

The user lesson is that privacy needs two kinds of clarity:

```text
CURRENT FACT
No analytics or telemetry code exists
        |
        v
PERMANENT RULE
Future work must not introduce it
        |
        v
REPEATABLE AUDIT
Check dependencies, network APIs, storage, links, and data flow
```

It is also important to distinguish local persistence from collection. Saving source and preferences in browser local storage lets the same browser restore the workspace. Code Explorer has no application server or upload path that receives those values.

Honest privacy language still acknowledges normal web infrastructure. GitHub Pages, module CDNs, and font hosting receive ordinary asset requests. Code Explorer does not attach learner source, input, traces, clipboard contents, stored preferences, or tracking identifiers to those requests. Their provider-side request records are not returned to Code Explorer, and maintainers cannot view raw IP addresses or browser headers through the project.

GitHub repository Insights can separately show aggregate items such as recent repository visitor or clone totals, referring sites, and popular repository content to people with push access. This does not reveal what a learner typed or did inside Code Explorer. A count saying that a repository page received views is not a record of one learner's source, input, trace, clipboard, or saved workspace.

Status: Verified and documented as a permanent project boundary on 2026-07-22.

## 53. A recommended learning path must not imply learner tracking

During planning for a larger beginner curriculum, Codex said that the Smart Cafe Bill checkpoint would appear after the learner had "studied enough" variables, arithmetic, assignment, and simple conditions. Aman correctly identified the hidden implication: Code Explorer does not collect progress data, so it cannot know what an individual learner has studied or whether that learner is ready.

The corrected model is static guidance rather than observed progress:

```text
What Code Explorer can do
+-- number curriculum sections
+-- place concepts in a recommended order
+-- list prerequisites on a project card
+-- label difficulty and source length
+-- let the learner open, skip, or revisit anything

What Code Explorer must not claim
+-- that it knows which lesson was completed
+-- that it knows whether a learner is ready
+-- that it observed study time or progress
+-- that it maintains a learner profile
```

The important wording correction is:

```text
Misleading
"This appears after the learner has studied enough."

Accurate
"This appears after its prerequisite topics in the recommended curriculum order."
```

Aman deserves explicit credit for catching this privacy and language inconsistency. The correction protects the permanent no-analytics rule while still allowing the site to provide a useful beginner route. It also demonstrates why privacy review must inspect product wording, not only network code.

Status: Implemented in v4. The All view now uses a fixed recommended sequence with prerequisite labels and no progress collection, readiness calculation, completion claim, or locked lesson.

## 54. Expanding a curriculum should preserve and blend proven examples

When a larger curriculum was proposed, Aman asked whether the original 54 programs were being removed. That question exposed an ambiguity in the plan. The proposal discussed a final count and new buckets without stating clearly that the existing programs would remain part of the curriculum.

The original 54 programs are not disposable placeholders. They already cover important beginner and debugging behavior, including:

- Prepared input
- Syntax and runtime investigation
- Index, key, and conversion errors
- Conditions and Boolean logic
- Several `for` and `while` loop patterns
- Functions, nested calls, scope, and recursion
- Lists, tuples, sets, dictionaries, and nested collections
- Aliasing, mutation, reassignment, and shallow copying

The correct expansion model is:

```text
Existing 54 programs
        |
        +-- keep programs that remain accurate and useful
        +-- reposition them in the recommended sequence
        +-- rename topics or categories where clarity improves
        +-- revise weak examples instead of preserving them blindly
        +-- retain error and debugging coverage
        |
        v
Add new concept lessons and guided checkpoints
        |
        v
One blended curriculum with no accidental coverage loss
```

This is not a promise that every existing title must remain unchanged. It is a promise that expansion starts with a coverage inventory and migration plan rather than deleting a tested corpus and rebuilding from memory. Aman deserves credit for requiring that clarification before development, especially for calling out errors and other easy-to-miss concepts.

Status: Implemented in v4. The reviewed 54-program corpus was blended with 80 additional programs, and its important debugging, recursion, input, collection, and mutation coverage remains represented in the 134-program curriculum.

## 55. Guided programs should integrate concepts into a meaningful result

Aman asked for more guided mini programs and rejected the idea of adding cheap examples merely to raise a number. He wanted the source to become longer where useful so a beginner could experience increasing complexity and finish feeling capable rather than overwhelmed.

That led to a practical quality test for every guided checkpoint:

```text
Clear task
    |
    +-- recognizable data
    +-- two or more earlier concepts
    +-- visible state changes
    +-- useful final output
    +-- coherent beginning, middle, and end
    |
    v
Small complete program
```

Length is not quality by itself. A 25-line program that tells one understandable story is better than 25 unrelated statements. v4 therefore uses 12 guided programs ranging from 18 through 31 lines, including a cafe bill, gradebook, expense summary, attendance report, library tracker, resilient order flow, and object-oriented pet tracker.

Aman deserves credit for insisting that examples should build confidence rather than decorate the catalog. The correction to Codex is permanent: curriculum expansion must be evaluated by learning progression and program coherence, not only counts.

Status: Implemented in v4.

## 56. Intentional errors must be unmistakable before execution

Error examples are valuable, but a complete beginner may interpret a planned exception as proof that the site or lesson is broken. The earlier 54-program library contained three important debugging cases. Preserving them in a larger curriculum required a stronger contract than a descriptive title.

v4 gives each intentional failure:

- A visible learning-error badge on its card
- The exact expected exception type
- Structural validation of the declaration
- Runtime validation that the declared exception actually occurs

Every other example must compile and finish with its prepared input. This creates a clean distinction:

```text
Declared investigation       Ordinary lesson
+-- warning shown first      +-- no error expected
+-- exact error named        +-- must compile
+-- exact error verified     +-- must finish
```

The learner benefit is emotional as well as technical. A beginner can explore failure with confidence because the interface has already explained that the stop is the lesson.

Status: Implemented in v4.

## 57. A larger catalog needs both freedom and a recommended route

Aman correctly observed that 134 examples remain usable because learners can filter by concept and serious exploration is comfortable on a laptop or desktop. That does not remove the need for a beginner-friendly starting point.

The resulting design supports both needs:

```text
Want guidance?                     Know the topic you need?
+-- open All                       +-- select a category
+-- follow fixed order             +-- open any card
+-- read prerequisites             +-- skip or revisit freely
+-- meet guided checkpoints        +-- no lock and no profile
```

This balances a comprehensive library with learner autonomy. The vertical navigator keeps all category subsections accessible without sideways scrolling, while the All view creates a route without pretending to personalize it.

Status: Implemented in v4.

## 58. Curriculum quality can be verified without reducing learning to test results

Aman required that the code quality remain high because complete beginners may copy both the syntax and the habits shown by each example. That requirement produced an important user-side discovery: educational content can remain friendly and creative while also being treated as executable release material.

The curriculum now has two complementary quality views:

```text
Teaching review
+-- Is the purpose clear?
+-- Does complexity increase sensibly?
+-- Is the name welcoming and specific?
+-- Does the final output feel meaningful?
              |
              v
Execution review
+-- Does the source compile?
+-- Does prepared input cover input() calls?
+-- Does the program finish within its guard?
+-- Does only a declared learning error fail?
```

Neither view replaces the other. A program can execute perfectly and still be a weak lesson. A beautifully explained program can still contain an accidental error. Aman's quality request led to both reviews being required for the complete 134-program corpus.

This is not a correction of a mistake. It is a successful product instinct confirmed by implementation evidence. The project owner can ask for approachable content and engineering-grade validation at the same time.

Status: Implemented in v4 through the structural and Python execution validators.

## 59. Object-oriented learning becomes clearer when object state is visible

Adding a Classes and Objects category created a new learner question. It is not enough to see that a class definition ran or that a method was called. A beginner also needs to connect the object-oriented vocabulary to changing values inside an instance.

The Object-Oriented Pet Care Tracker demonstrates the connection:

```text
Class blueprint
      |
      v
Pet instance
+-- name
+-- animal
+-- meals
+-- exercised
      |
      v
Method call changes an attribute
      |
      v
Variables and Structures reveal the new state
```

The user-side lesson is that a concept category should use the wider strengths of the tool. Classes should not become isolated textbook examples when the workspace can reveal attributes, references, and mutation. This principle can guide future curriculum additions: connect new syntax to the visual evidence that makes it understandable.

Status: Implemented in v4 with bounded object attributes and stable instance labels.

## 60. Exact catalog promises should become maintenance contracts

Before implementation, Aman asked to see the complete table that would appear in the Examples window. That request transformed an approximate plan into exact product commitments: 134 programs, 12 categories, 12 guided checkpoints, three levels, and three intentional errors.

The important user-side lesson is that exact numbers are most useful when they become verifiable contracts rather than decorative marketing claims.

```text
Approved curriculum table
          |
          +-- application category order
          +-- card and filter counts
          +-- README catalog
          +-- contributor checklist
          +-- structural validator
          +-- changelog evidence
          |
          v
One count with several independent checks
```

This approach reduces accidental omissions during future expansion. If one program moves categories, every category total and the overall total must still agree. If a guided program is added, its prerequisites and checkpoint placement become part of the same contract.

Aman deserves credit for asking for the table before development rather than accepting a vague promise. The insight is broader than this release: important open-source scope decisions should be written in a form that code and documentation can both verify.

Status: Implemented in v4.

## 61. A comprehensive tool can stay beginner-friendly through layered choice

The finished curriculum confirms another product instinct that did not begin as a correction. Aman believed a larger library could remain usable because concept filters would let learners narrow it and desktop users could explore the full tool comfortably.

The implementation shows that comprehensiveness and approachability are not opposites when choices are layered:

```text
First visit
+-- fixed recommended order
+-- smallest First Steps examples

Focused question
+-- choose one concept category
+-- compare several variations

Growing confidence
+-- open a guided checkpoint
+-- inspect several workspace views

Independent learner
+-- open any program directly
+-- change it and run a new trace
```

The user-side lesson is not simply that more examples are better. More examples become useful when navigation, naming, difficulty, prerequisites, and program quality work together. The 134-program library validates that design principle while still leaving every learner free to skip, revisit, or experiment.

Status: Implemented in v4.

## 62. A list of beginner terms is not an explanation

The Error Coach guide named ten Python error types but explained only one of them in detail. Aman noticed that a complete beginner could see names such as `TypeError`, `ValueError`, `IndexError`, and `KeyError` without having enough knowledge to distinguish them.

That observation creates a documentation test:

```text
Beginner term introduced
          |
          +-- plain-language meaning
          +-- tiny concrete cause
          +-- first evidence to inspect
          +-- reasonable next experiment
          |
          v
Term becomes usable knowledge
```

A list can help an experienced reader scan coverage, but it can frighten or confuse a beginner when the surrounding guide assumes the vocabulary it is supposed to teach. The README now explains every Error Coach type, the difference between Python errors and workspace messages, the three intentional-error programs, indentation as part of the syntax-error family, EOF as the end of prepared input, and several commonly confused exception pairs.

Aman deserves credit for identifying the gap from a first-time reader's perspective. The broader lesson is that documentation depth should be judged at each introduced term, not by the total length of the document.

Status: Implemented in the README Error Coach, troubleshooting, curriculum, and glossary sections.

# Lessons learned by Codex

## 1. Do not confuse technical possibility with a reliable product promise

Many behaviors are technically possible in a browser. Reliability depends on a narrower supported scope, bounded data, explicit fallbacks, and tests.

For Code Explorer, statements should distinguish:

- What exists now
- What has been approved but not built
- What is feasible with limits
- What remains exploratory
- What the project intentionally does not promise

This distinction is especially important when discussing every Python program, all LeetCode questions, exact memory, other languages, and real DevOps systems.

## 2. State the difficulty in terms of data and failure modes

Labels such as easy, moderate, and difficult are only useful when explained.

A better explanation identifies:

- Required source metadata
- Required runtime evidence
- Whether the browser API needs permission
- Whether a library provides the interface primitive
- Whether the feature alters learner source
- Whether it must work during repeated loops and nested calls
- Whether mobile memory or rendering is at risk

This makes estimates understandable and prevents difficulty labels from sounding arbitrary.

## 3. Research official library capabilities before finalizing scope

The user correctly challenged early assumptions by asking about JavaScript libraries. Future feasibility work should inspect official documentation and the current project integration before concluding that a feature is too difficult.

For CodeMirror, it was important to distinguish:

- Features already supplied through `basicSetup`
- Interface primitives that Code Explorer can extend
- Python meaning that CodeMirror cannot infer alone

The library can render a tooltip or diagnostic. Code Explorer remains responsible for the accuracy of the value, error, scope, or explanation shown inside it.

## 4. Keep the static architecture as a deliberate constraint

The project does not need to acquire a server merely because a feature sounds advanced. Before proposing backend infrastructure, check whether the feature can be implemented through:

- Pyodide
- A Web Worker
- Python AST data
- Trace snapshots
- Browser storage
- File or clipboard export
- CodeMirror annotations

If a server is genuinely required, explain why and ask before changing the product boundary.

## 5. Browser execution must stay off the main UI thread

Python execution belongs inside `py-worker.js`. The worker protects interface responsiveness and can be terminated after the outer timeout.

Future changes must avoid:

- Running learner Python on the main thread
- Sending live Python objects into the UI
- Returning unbounded snapshots
- Allowing stale worker messages to overwrite a newer run
- Forgetting to reset the worker after a timeout

The run id, worker lifecycle, 3,000-step cap, and 30-second timeout are core safety mechanisms.

## 6. Trace facts and source facts should come from different evidence

The reliable division is:

```text
Python AST
     +-- What structure exists in the source?
     +-- Where are loops and conditions?
     +-- What statement kind is this?

Recorded trace
     +-- Which line actually executed?
     +-- What values existed?
     +-- What changed?
     +-- What output and error occurred?
```

Explanations should not use static structure to claim that a branch ran, and they should not use one runtime observation to claim every possible behavior.

This distinction is essential for Automatic Learning Comments.

## 7. Serialization is part of product safety

Every recorded value can multiply across thousands of snapshots. Safe serialization must continue to:

- Limit nested depth
- Limit container children
- Shorten representations
- Detect cycles
- Mark shared objects
- Avoid failing on a broken user-defined `repr`
- Return JSON-compatible data

The interface should state when a preview is shortened so the learner does not confuse display limits with Python's real value.

## 8. UI screenshots are evidence, not decoration

The screenshots revealed problems that source inspection alone would not reliably identify:

- Incorrect theme surfaces
- Weak dark-mode text
- Unstyled or missing view content
- Graph overflow
- Font blur
- Repeated graph movement
- Controls that were not discoverable

Future UI work should use screenshots and real browser interaction at representative states, themes, and viewport sizes.

## 9. Test motion over time, not only static layout

A still screenshot cannot reveal shaking. Visualization tests must advance through several trace steps, switch tabs, resize the viewport, use Fit, and change zoom while observing whether the panel remains stable.

Graph rendering should separate:

- Structural changes that require rebuilding elements
- Selection changes that require only style updates
- Explicit Fit requests
- Persistent user zoom

Repeated automatic fitting should be treated as a likely source of discomfort.

## 10. Graph typography needs browser-level verification

Cytoscape labels can look different from ordinary DOM text. Font choice, pixel ratio, canvas scaling, zoom, node size, and contrast can all affect clarity.

Future graph changes should verify:

- Light and dark labels
- Active and inactive nodes
- Edge labels
- Minimum and maximum zoom
- Mobile rendering
- Device pixel ratio behavior
- Whether text remains clear after Fit

Readable labels are more important than fitting the maximum number of nodes on screen.

## 11. Accessibility feedback often improves the mainstream interface

Explicit theme labels, visible zoom percentages, text runtime status, focus states, stable motion, permission alerts, and accessible names help all learners.

Future controls should communicate through more than color. Icon-only controls require complete accessible labels. Native controls should be retained when they provide keyboard behavior for free.

## 12. Clipboard behavior must account for browser context

Clipboard APIs can behave differently under `file://`, localhost, GitHub Pages, permission policies, and user gesture requirements.

Reliable clipboard implementation requires:

- A trusted user action
- Modern API support checks
- A writing fallback where appropriate
- A visible blocked-permission alert for reading
- Protection against empty clipboard replacement
- Clear manual keyboard alternatives

The feature should be tested under HTTP rather than assumed from local file behavior.

## 13. Dedicated pages should use ordinary links when possible

Normal anchor navigation works before JavaScript loads, supports bookmarks, and behaves predictably under GitHub Pages.

Use JavaScript only for state preparation that must happen before navigation, such as saving selected example code and prepared inputs.

The broken Start exploring and example journey demonstrated why navigation should not rely on an unnecessary single-page illusion.

## 14. Persistence needs an inventory, not scattered storage calls

Different values have different intended lifetimes:

- Source, theme, editor preferences, graph zoom, watches, and prepared input persist locally.
- Trace snapshots are rebuilt.
- Bookmarks belong to one trace.
- Breakpoint markers last for the current page session.
- Run comparisons last for the current page session.

Every new saved preference should define a key, safe default, validation, failure fallback, reset expectation, and README entry.

## 15. Source changes must invalidate derived explanations

A trace describes one exact program. If the editor changes, old values, coverage, paths, bookmarks, and explanations become misleading.

All source-writing paths, including typing, Paste, examples, and future generated comments, must intentionally decide whether they:

- Preserve the source
- Replace the source
- Clear stale trace data
- Save locally
- Require confirmation

Routing source access through `getCode()` and `setCode()` helps keep CodeMirror and the fallback editor consistent.

## 16. A fallback is only useful if features degrade honestly

The native textarea lets source editing continue if CodeMirror fails to load. It does not automatically reproduce every CodeMirror feature.

Documentation and UI should not imply that syntax highlighting, decorations, or clickable CodeMirror gutter behavior exists in the fallback. Optional enhancements must fail without blocking basic editing and tracing.

## 17. Information architecture should grow before the tab row breaks

The move to Trace, Data, Flow, and Labs showed that navigation redesign should happen before a flat list becomes unusable.

Future views should be placed according to the question they answer. A new top-level group should require a genuinely new family of learner questions, not merely another implementation type.

## 18. Empty, normal, error, and missing-data states all need design

Every view renderer should handle:

- No trace yet
- A valid selected step
- A step with no relevant change
- Missing optional metadata
- Syntax failure with no trace
- Runtime error after partial execution
- A library that fails to load

An empty graph or blank panel is not an acceptable implicit error message.

## 19. Example programs are integration tests in disguise

Each curated example connects source editing, worker execution, tracing, a specialist view, playback, and documentation.

When adding a feature, the example library should be used to identify:

- Normal cases
- Repeated lines
- Nested frames
- Shared references
- Input
- Runtime errors
- Syntax errors

Automatic Learning Comments should be tested against all 134 examples because the full curriculum exercises different explanation patterns, repeated lines, nested decisions, calls, collections, aliases, inputs, intentional runtime errors, class definitions, and object attributes.

## 20. Do not describe implementation as complete until browser behavior is verified

Source code can contain the intended feature while the interface remains broken due to:

- Missing element ids
- Cached assets
- Incorrect event binding
- Theme-specific CSS
- Overflow
- stale graph instances
- permission restrictions
- navigation state

Completion requires testing the real user journey, not only inspecting functions.

## 21. Asset cache versions are part of static-site correctness

Both HTML pages use query versions for shared CSS and JavaScript. When one page receives a new version and the other does not, the landing page and workspace can run different generations of the application.

Future shared asset changes must update matching query versions in `index.html` and `workspace.html` together.

## 22. Documentation should be verified like code

The sanity audit found and corrected:

- An inaccurate “searchable” claim for a category-filtered library
- A missing favicon entry in the repository map
- Missing pinned dependency documentation
- An ambiguous generated-source confirmation rule
- A nonexistent `state.result` reference
- Imprecise state lifetimes

Useful documentation checks include:

- Source constants against documented limits
- Actual examples against catalog rows
- Imported versions against dependency tables
- HTML ids against cached element references
- Matching cache versions across pages
- Balanced Markdown fences
- Forbidden-character searches

Documentation accuracy is a functional requirement because future work uses these files as instructions.

## 23. “Everything” requires organized coverage, not one enormous paragraph

When a user requests that nothing be missed, the response should organize information by decisions, features, failures, boundaries, and future work. Structure makes omissions easier to notice and later updates easier to place.

This document uses numbered lessons, status language, maps, tables, and two perspectives so new knowledge can be inserted without rewriting the whole history.

## 24. Reflect the user's ideas back as durable rules

Several strong project rules originated directly from user feedback:

- Check feasibility before building.
- Keep the project client-side.
- Focus on Python and beginners first.
- Use a creative technical design without sacrificing readability.
- Support both themes completely.
- Avoid unexplained symbols.
- Provide granular zoom.
- Show clipboard permission failures.
- Keep detailed source comments.
- Use guided maps in documentation.
- Split large tasks into quality-focused phases.
- Maintain project knowledge files.
- Keep a living post-mortem.

Codex should treat these as design input, not incidental conversation.

## 25. Avoid overpromising Automatic Learning Comments

It is reasonable to promise conservative behavior for the currently supported beginner Python scope. It is not reasonable to promise perfect comments for every possible Python program.

The implementation should prefer omission over false confidence. Advanced metaprogramming, dynamic imports, asynchronous behavior, external packages, descriptors, decorators with complex effects, and other highly dynamic constructs may not support a useful automatic explanation.

The interface should state when no reliable comment can be generated.

## 26. Generated explanations should remain reversible

Generated explanations must remain non-destructive by default. The Automatic comments toolbar mode can show them as temporary widgets that never enter source. The Learning Comments export mode must show a separate preview before real generated lines can replace the editor. Copying is safe. Hiding either surface is safe. Replacing the editor is allowed only after the learner reviews the preview and confirms the action.

The general lesson applies to any future transformation:

```text
Generate
   |
   v
Preview
   |
   +-- Cancel
   +-- Copy
   +-- Confirm replacement
```

Never silently rewrite learner work.

## 27. Communication should lead with the decision and boundary

When the user asks whether something is possible, the answer should begin with a direct conclusion. Detail should then explain the supported scope, limitations, and difficulty.

ASCII diagrams were repeatedly useful because they made workspace hierarchy, trace flow, and beginner journeys understandable without requiring a visual design file.

Future planning responses should continue to use them when relationships are more important than prose.

## 28. Do not start a bundled build while the user is still collecting tasks

When the user said more tasks were coming, waiting for the full list was the correct choice. Features that affect the same editor toolbar, worker result, state, or documentation can be designed and tested more coherently together.

However, waiting should be explicit. The current status must clearly say which approved feature remains unimplemented.

## 29. Repository instructions need precise exceptions

The first expanded safety rule said every complete-document replacement required confirmation. A sanity audit revealed that this would incorrectly include the dedicated Paste action, where clicking Paste is itself the explicit request.

The corrected rule distinguishes:

- Direct user-requested replacement such as Paste
- Generated or transformed source replacement that needs an additional confirmation

The lesson is that broad safety rules need concrete examples and exceptions to avoid creating new usability problems.

## 30. A post-mortem should record wins as well as mistakes

The project learned from broken navigation, weak theme contrast, graph shaking, blurry labels, and inaccurate documentation. It should also preserve successful patterns:

- Separating feasibility from implementation
- Building a dedicated workspace
- Grouping views by learner question
- Using a worker for safe execution
- Growing from 54 focused examples to a validated 134-program curriculum with filters, recommended order, and learning ladders
- Creating extensive guided documentation
- Adding persistent contributor knowledge
- Performing code-to-document sanity checks

Post-mortems are most useful when they explain what should be repeated as well as what should be avoided.

## 31. Never treat a clarifying question as a lack of ability

Questions such as whether a library already solves part of the problem, whether 16 examples are enough, or whether a limit is safe are signs of careful product ownership.

Codex should explain tradeoffs without condescension, match the user's level, and treat challenges to an estimate as useful review. “Beginner-friendly” describes the tool's audience. It should never be used to make assumptions about the person designing the tool.

## 32. Every promised feature needs a completion ledger

The user later asked Codex to verify that every promised improvement, including an earlier group numbered 1 through 7 and the later 17-view workspace map, had actually been completed.

The lesson is that a prose promise should become a checklist before implementation begins:

```text
Promised capability
       |
       +-- Interface mounting point
       +-- State and data source
       +-- Normal rendering
       +-- Empty and error rendering
       +-- Light and dark styles
       +-- Desktop and mobile behavior
       +-- Browser interaction test
       +-- README explanation
       +-- Capability ledger update
```

A function name or empty tab is not proof of completion. The user-visible behavior must be exercised.

## 33. User trust increases the responsibility to verify

The user explicitly trusted Codex to build carefully and reliably. Trust should never reduce testing or make uncertainty disappear from the report.

The correct response to trust is:

- Keep scope honest.
- Preserve learner source.
- Test the complete journey.
- Report what was and was not verified.
- Correct inaccuracies found during audits.
- Avoid describing approved future work as implemented.

Trust is a reason for stronger evidence, not a substitute for evidence.

## 34. Initial scope advice should be revisited when product context changes

Codex initially treated 54 examples mainly as a possible discoverability risk. That concern was reasonable but incomplete. It underweighted the filter interface, desktop-first use, and Aman's goal of creating a comprehensive learning tool.

The correction was to evaluate the whole system and convert the larger count into explicit curriculum structure. Future estimates should ask:

- Is navigation already capable of narrowing the set?
- Does repetition add another learning pattern?
- Can the examples double as integration tests?
- Does the intended device provide enough room to browse them?
- Can documentation give learners a recommended path?

This is not about one person being wrong. It is an example of a product decision becoming better after another constraint and another ambition were made explicit.

## 35. Automated schema checks cannot judge teaching prose

The automated comment audit checked all 54 examples and produced 421 valid note records. It confirmed line numbers, detail levels, fields, and nonempty text. Manual reading still found two quality issues:

- `elif` wording joined text awkwardly.
- Floating-point evidence exposed distracting binary precision.

Both were corrected. The honest lesson is that a structurally valid explanation can still be unpleasant or confusing to read.

Browser review then found a deeper trace-semantics issue. A failing `print(colors[index])` line produced an exception event and a frame-exit event on the same source line. A simple count incorrectly described that as two completions. The correction suppresses ambiguous completion, loop, and condition counts on a failing line and explicitly names the observed exception instead.

```text
AUTOMATED CHECKS                 HUMAN READING
+-- valid line                    +-- natural wording
+-- valid level                   +-- useful emphasis
+-- nonempty text                 +-- beginner clarity
+-- all examples covered          +-- sensible number formatting
             |                               |
             +---------------+---------------+
                             v
                    reliable teaching note
```

## 36. A full example corpus is a regression suite, not only content

The original 54 programs already exercised more behavior than a small hand-written test list. The blended 134-program corpus expands that regression surface:

- Assignments and conversions
- Boolean logic and nested branches
- Multiple loop shapes and repeated lines
- Calls, returns, scope, nested calls, and recursion
- Lists, tuples, sets, dictionaries, and nested structures
- Aliases, mutation, reassignment, and shallow copies
- Prepared input and three intentional error types
- First statements, values, operators, and strings
- Classes, instances, methods, attributes, inheritance, and composition
- Twelve guided programs that combine several earlier concepts

Running the entire corpus found integration problems that isolated unit examples could miss. Future trace metadata or explanation changes should keep this corpus executable as a standard regression step.

## 37. Generated transformations need ownership markers

The exact prefix `# Code Explorer:` gives the application a safe, narrow way to recognize its own generated lines. It should not attempt to identify generated text using vague wording or remove arbitrary learner comments.

This establishes a reusable rule:

```text
Tool-generated content
      |
      +-- has an exact ownership marker
      +-- can be regenerated without duplication
      +-- does not claim ownership of learner content
      +-- remains preview-first and reversible
```

## 38. Runtime evidence should enrich syntax, not replace it

The AST knows that a line is a `for` statement, assignment, return, or mutation call. The trace knows how often a line ran and which values or outcomes were observed. Neither source is sufficient alone.

The implemented design combines them conservatively:

- Syntax supplies the structural explanation.
- Trace data adds observed values and counts.
- Missing evidence removes a claim instead of encouraging a guess.
- A syntax error produces no runtime-backed comment set.

This boundary should remain stable when more explanation patterns are added.

## 39. Documentation audits need cross-file invariants

Updating five documents independently creates a real risk of inconsistent counts, statuses, labels, dates, and limits. A final audit must search for stale facts and compare each document with executable source.

For the current release, the important cross-file invariants are:

- 134 total examples formed from 54 reviewed base examples and 80 additions
- Twelve exact category counts totaling 134
- Difficulty totals of 46 Beginner, 56 Developing, and 32 Guided Challenge
- Twenty programs of at least 15 lines
- Twelve guided checkpoints from 18 through 31 lines with listed prerequisites
- Three intentional error examples
- Automatic Learning Comments marked implemented, not approved next
- 3,000 trace steps and 30 seconds
- v1 dated 2026-07-20, v2 dated 2026-07-21, and v3 and v4 dated 2026-07-22
- Automatic comments marked as a non-destructive v3 editor view
- Vertical examples navigation documented without stale horizontal-scroll instructions
- Class definitions, object attributes, stable instance labels, and bounded object serialization marked implemented in v4
- Recommended order described as fixed guidance without learner tracking

Documentation is not complete merely because every requested file changed. The files must agree with each other and with the interface.

## 40. Editor decorations preserve coordinate systems

Temporary teaching notes could have been implemented by inserting comment text and later trying to reconstruct the original document. That would make several coordinate systems unstable at once.

CodeMirror block widgets provide the safer model:

```text
source line position
       |
       +-- heatmap decoration
       +-- current-line decoration
       +-- automatic-comment widget
       +-- breakpoint gutter marker

document text remains one shared coordinate system
```

The implementation lesson is to use decorations for presentation and transactions for genuine source edits. This reduces restoration logic and prevents derived features from drifting to different line numbers.

## 41. One evidence set can support multiple learning surfaces

The worker already produced finite records containing line, level, kind, and text. Reusing those records for inline widgets and the export preview avoids two explanation engines that could disagree.

The two surfaces may format the same record differently, but they must share:

- Supported statement boundaries
- Trace-backed facts
- Detail filtering
- Conservative omission rules
- Source-line association

The implementation should branch at presentation, not at truth generation.

## 42. Constrained grid children need real size tests

The first mobile CSS pass set program cards to `min-height: 0` because each card occupied one column. In a height-constrained grid, the browser compressed each button row to about 42 pixels while its 171 pixels of content overflowed into neighboring cards.

This was not obvious from a desktop screenshot or a page-overflow measurement. The correction required checking element rectangles and scroll heights in a real narrow browser.

Prevention rule:

```text
responsive grid changed
       |
       +-- inspect screenshot
       +-- compare card height with card scrollHeight
       +-- check page horizontal overflow
       +-- check independent scroll containers
```

The final mobile cards retain a 190-pixel minimum.

## 43. Category changes should reset result position

Independent scrolling creates another state relationship. If the learner scrolls far down one long category and selects a shorter one, retaining the old card scroll position can open the new category midway through its results.

Resetting only the program region to `scrollTop = 0` gives a predictable beginning without disturbing the category navigator. Small interface state like scroll position deserves the same deliberate lifecycle thinking as trace state.

## 44. Documentation should record discovered failures, not only final success

The mobile card compression was found during implementation and corrected before release. Recording it honestly creates a reusable regression test and explains why the minimum height exists. Removing the history would make a future contributor more likely to view the rule as arbitrary and delete it.

Open-source post-mortems help most when they describe:

- The intended behavior
- What testing exposed
- Why the failure occurred
- The correction
- The permanent prevention check

## 45. A privacy audit must follow data, not only search for brand names

Searching for known analytics products is useful but incomplete. A custom `fetch()` call, beacon, form action, WebSocket, remote logger, or dependency could transmit data without containing the word analytics.

The audit therefore followed both capabilities and learner data:

```text
NETWORK CAPABILITIES                  LEARNER DATA
external imports                     source
fetch and XHR                        prepared input
beacons and sockets                  trace and console
forms and links                      clipboard text
cookies and storage                  watches and bookmarks
remote logging                       saved preferences
          |                                  |
          +----------------+-----------------+
                           |
                           v
            Does any learner data reach a remote destination?
                           |
                           v
                          No
```

The application code contains no fetch, XHR, socket, beacon, cookie, form submission, analytics SDK, telemetry SDK, or remote logger. Source and prepared input cross from the main page to the local Web Worker through `postMessage`, then results return to the same page.

The technical lesson is also to avoid an absolute statement that the browser makes no network requests. Pinned dependencies and fonts load from external hosts, and GitHub Pages serves the site. The precise promise is that Code Explorer performs no analytics, sends no learner-authored or learner-derived content to those hosts, and receives no provider request logs that maintainers could inspect through this project. GitHub's aggregate repository traffic panel remains a separate platform summary and cannot be used to open or reconstruct a learner's workspace.

## 46. Do not imply personalized knowledge when presenting a static curriculum

Codex used the phrase "after the learner has studied enough" while describing where a guided checkpoint would appear. That wording was inaccurate. A card's position in a fixed list is evidence about the curriculum designer's recommendation, not evidence about one person's learning history.

Future curriculum language must identify its evidence precisely:

```text
Fixed order                  Local interface state             Collected progress
+-- recommended sequence     +-- current open card             +-- learner profile
+-- listed prerequisites     +-- saved source                  +-- completion history
+-- difficulty label         +-- local preferences             +-- study analytics
          |                             |                                |
          v                             v                                v
May be described directly    Must be described as local        Prohibited in Code Explorer
```

The correction came from Aman, not from a later code audit. Codex should preserve that fact and use the lesson during future interface writing, README updates, and curriculum planning. Privacy-safe implementation can still be undermined by wording that suggests surveillance or personalization that does not exist.

## 47. A larger target count is a migration plan, not a replacement plan

Codex proposed a reorganized 126-example curriculum and later a 134-example curriculum with more guided mini programs. The arithmetic was presented clearly, but the relationship to the existing 54 examples was not. That omission reasonably created concern that the tested examples, including error and debugging lessons, might be discarded.

Before proposing or implementing a curriculum expansion, Codex should produce a coverage ledger:

```text
Existing example
       |
       +-- keep unchanged
       +-- revise for teaching quality
       +-- rename
       +-- move to another bucket
       +-- merge only when no learning behavior is lost
       +-- retire only with an explicit reason and replacement
```

Every existing topic should map to the new structure before new counts are treated as final. Intentional error examples must remain clearly labeled and executable as regression cases. New guided programs should combine earlier concepts, while focused examples should continue isolating individual ideas.

Aman identified the ambiguity before code changed. The permanent lesson for Codex is to say "blend and expand" explicitly when that is the plan, and to verify preservation through a title, topic, feature, and regression mapping.

## 48. Object-oriented examples need observable object state

Adding syntactically valid class examples would not have been enough for Code Explorer. The product promise is to reveal changing data, so a learner-defined instance must connect to the same Variables, Structures, References, and Mutation Explorer questions as a list or dictionary.

The implementation therefore serializes a bounded instance attribute mapping when a safe `__dict__` is available. It does not bypass the existing depth, item, cycle, shortening, or graph-size protections.

```text
class example runs
       |
       +-- class definition gets a structural learning note
       +-- instance gets a stable teaching label
       +-- safe attributes enter bounded serialized data
       +-- existing views reuse that data
```

This is a reusable test for feature completeness: when a new language concept is added, ask whether the existing learning views can reveal the concept's important runtime state rather than merely execute its syntax.

## 49. Default object representations can teach the wrong memory lesson

Python's default instance representation includes a hexadecimal process address. Displaying it inside a conceptual beginner tool can make a temporary implementation detail look like a permanent object identity or a precise RAM map.

v4 normalizes default representations such as `<__main__.Pet object at 0x...>` to `<Pet instance>`. Learner-defined `__repr__` output remains useful, but the default physical-looking address is removed.

The lesson is broader than visual polish. Interface text can make an inaccurate conceptual claim even when the underlying runtime value is technically real. Beginner tools should expose the stable fact, the instance type, and avoid elevating incidental addresses into learning content.

## 50. Large content validation benefits from separate structural and runtime stages

The first validator design attempted to launch the Python corpus runner from the JavaScript structural validator. In the restricted development environment, that combined process did not complete reliably. Treating the timeout as proof of a curriculum error would have been dishonest.

The corrected workflow separates responsibilities:

```text
JavaScript validator
+-- import real application modules
+-- check counts, titles, metadata, prerequisites, expected errors
+-- export detached JSON
             |
             v
Python validator
+-- compile every source
+-- supply prepared input
+-- execute with a per-program alarm
+-- match exact intentional exception types
```

This separation makes failures easier to diagnose and prevents one mistaken infinite loop from stalling the whole audit. The permanent lesson is to distinguish a harness or environment failure from a learner-program failure, then strengthen the harness instead of lowering the quality claim.

## 51. Documentation coverage must be checked at the vocabulary level

Codex documented the Error Coach feature, listed its supported exception families, and included one `IndexError` walkthrough. That looked complete at the section level but remained incomplete at the vocabulary level. Nine named terms still depended on prior Python knowledge.

The corrected audit method is:

```text
Find every beginner-facing named concept
                 |
                 +-- Is it defined nearby or linked clearly?
                 +-- Is there a small example?
                 +-- Is the first inspection step stated?
                 +-- Is it distinguished from similar terms?
                 +-- Does the wording match actual tool behavior?
                 |
                 v
No unexplained coverage lists
```

The final question exposed an additional implementation boundary: compile-time indentation problems travel through Code Explorer's syntax-error path. The README now states that the heading may say `SyntaxError` while the Python message explains indentation, rather than implying that the interface always presents a separate `IndentationError` header.

The permanent Codex lesson is that a long document can still be shallow at one crucial point. Section presence, heading counts, and feature lists do not replace reading each technical term as though it were the learner's first encounter.

# Shared lessons for future work

## The reliability checklist

Before approving a feature:

```text
Does it help a beginner answer a clear question?
                    |
                    v
Can the current static architecture support it?
                    |
                    v
What evidence makes its explanation true?
                    |
                    v
What happens when evidence is missing?
                    |
                    v
Can it fail without damaging source or trace state?
                    |
                    v
How will desktop, mobile, light, and dark modes behave?
                    |
                    v
What examples and regression programs test it?
                    |
                    v
Have README.md, SKILLS.md, comments, and this file been reviewed?
```

## The beginner-value test

A proposed feature is a strong fit when it does at least one of these:

- Reveals an otherwise invisible runtime fact.
- Connects source code to a changing value.
- Explains why Python selected a path.
- Makes a function or loop easier to follow.
- Helps compare two deliberate experiments.
- Turns an error into a next learning action.
- Reduces friction without hiding the code.

A feature is a weak fit when it mainly adds decoration, completes the learner's work, requires an unrelated server, or presents more information without a clear question.

## The documentation update rule

```text
Learner-visible behavior changed?
       |
       +-- Yes: update README.md
       |
       +-- No: review README.md for accuracy

Project knowledge or implementation pattern changed?
       |
       +-- Yes: update SKILLS.md

Contributor rule changed?
       |
       +-- Yes: update AGENTS.md

Reusable discovery, mistake, decision, or success occurred?
       |
       +-- Yes: update lessons_learned.md
```

## Current decisions and deferred work

| Topic | Current decision |
| --- | --- |
| Automatic Learning Comments export preview | Implemented in v2 |
| Automatic comments inline editor view | Implemented in v3 |
| Examples category navigation | Vertical sidebar on desktop and stacked vertical region on mobile in v3 |
| Larger beginner curriculum | Implemented in v4 as 134 blended programs across 12 categories |
| Curriculum progress language | Use a fixed recommended order and prerequisite labels; do not imply observed completion or readiness |
| Analytics and telemetry | Permanently prohibited; no consent-based analytics exception |
| Learner data uploads | Prohibited; source, input, traces, output, clipboard, watches, bookmarks, and preferences remain local |
| External asset requests | Allowed only for documented pinned dependencies with no learner content attached |
| Hover variable inspector | Explored for later |
| Inline diagnostics | Explored for later |
| Inline variable values | Explored for later |
| Run-to-line navigation | Existing replay breakpoints provide part of this behavior |
| Read and write highlighting | Explored for later |
| Learning autocomplete | Explored for later |
| Smart fold summaries | Explored for later |
| Classical algorithm visualizations | Deferred |
| Trace-store redesign | Deferred |
| Other programming languages | Explored, no build approved |
| DevOps learning tools | Explored as separate or future tools |
| Documentation folder | Deferred until the code and public guide are ready for deeper system documentation |
| Maximum trace | 3,000 steps |
| Execution timeout | 30 seconds |
| Hosting model | Static GitHub Pages, client-side execution |

# Future update template

Copy this section when a future task creates a reusable lesson.

```text
## YYYY-MM-DD: Short lesson title

Perspective:
- User
- Codex
- Shared

Status:
- Implemented
- Approved next
- Deferred
- Explored
- Boundary

What happened:
Describe the question, observation, failure, or successful decision.

What we learned:
State the reusable lesson in beginner-friendly language.

What changed:
List code, interface, test, documentation, or process changes.

What to do next time:
Write the exact action future contributors should repeat or avoid.

How to verify:
List the source check, browser journey, example, viewport, theme, or documentation comparison that proves the lesson was applied.
```

# Closing perspective

Code Explorer improved because questions were treated as design evidence. Concerns about feasibility, limits, permissions, readability, motion, navigation, documentation, and beginner confusion all produced concrete improvements.

The project should continue using this loop:

```text
Listen carefully
      |
      v
Define the real learner problem
      |
      v
Research available tools
      |
      v
Set an honest boundary
      |
      v
Build conservatively
      |
      v
Test the real journey
      |
      v
Document the behavior
      |
      v
Preserve the lesson
```

That final step is why this file now exists.
