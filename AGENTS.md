# Code Explorer contributor instructions

Code Explorer is a teaching-oriented open-source project. Every change must protect the learner experience, preserve browser stability, and keep the repository understandable to a new contributor.

## Instruction priority

When requirements compete, use this order:

1. Protect learner code and browser stability.
2. Keep explanations accurate and conservative.
3. Preserve accessibility and responsive behavior.
4. Keep the interface approachable for a beginner.
5. Keep the source heavily commented and easy to study.
6. Add visual polish only when it supports the points above.

Never claim that Code Explorer supports behavior that has not been implemented and tested.

## Project boundaries

- The application is a static website hosted through GitHub Pages.
- Python runs in the browser through Pyodide inside a Web Worker.
- The main interface uses plain HTML, CSS, and JavaScript.
- CodeMirror provides the enhanced source editor.
- Cytoscape provides the reference and execution-path graphs.
- Learner source is a single Python file named `main.py` in the interface.
- The tool is intended for beginner programs, demonstrations, and small exercises. It is not a general replacement for a Python IDE or production debugger.
- The Python workspace contains 134 reviewed language-learning programs.
- DSA Chunk 2 contains 197 reviewed programs across 9 sections. The full Tier A target is 535, so 338 later programs remain unimplemented.
- DSA reviewed context requires an exact unchanged catalog-source match. Pasted or edited code receives only the observed evidence its local trace supports.
- The trace limit is 3,000 steps.
- The outer execution timeout is 30 seconds.
- A trace limit or timeout must produce a clear learner-facing message.

## Privacy and no analytics rule

Code Explorer must never collect learner data for analytics, telemetry, advertising, profiling, engagement measurement, or behavioral tracking.

Prohibited additions include:

- First-party or third-party analytics SDKs
- Tracking pixels and marketing tags
- Session replay or heatmap services
- Browser fingerprinting
- Event beacons such as `navigator.sendBeacon()`
- Automatic remote logging or crash-report uploads
- Hidden form submissions
- Cookies or identifiers used to recognize a learner
- Uploading source, prepared input, traces, console output, clipboard text, watches, bookmarks, or locally stored preferences

Browser local storage is permitted only for the documented same-origin persistence features. Page-to-worker `postMessage()` communication is local browser execution, not a network upload. Neither mechanism may be repurposed into collection.

Pinned runtimes, modules, fonts, GitHub Pages hosting, and deliberately selected external links can create ordinary asset or navigation requests. Do not attach learner content or project-generated identifiers to those requests. Code Explorer must not receive, store, expose, or provide maintainers access to provider-side IP addresses, browser headers, or raw request logs. Preserve `rel="noreferrer"` on external links. Before adding or changing any external dependency, audit its documentation and source for analytics, telemetry, remote logging, and unexpected network behavior.

GitHub repository Insights may provide aggregate recent repository traffic, clones, referring sites, or popular content to people with push access. Do not describe those platform summaries as Code Explorer analytics. They do not authorize adding application tracking, and they must never be joined to learner source, input, traces, output, clipboard content, local-storage values, or workspace actions.

Every change involving a network API, external URL, dependency, storage key, clipboard action, worker message, or error logger must answer all of these questions in review:

```text
Does learner-authored or learner-derived data leave the browser?
        |
        +-- Yes -> reject the change
        |
        +-- No  -> identify the exact local destination and lifetime

Does the dependency collect analytics or telemetry?
        |
        +-- Yes or uncertain -> do not add it
        |
        +-- No -> document the dependency request and continue review
```

Do not add an analytics consent banner as a substitute for this rule. The project decision is no analytics collection, not analytics collection behind an opt-in.

## Repository map

- `index.html`: landing page, two learning-path actions, shared header, and footer.
- `workspace.html`: persistent execution workspace and all dynamic mounting points.
- `data-structures.html`: separate Chunk 2 DSA workspace, editor, dialogs, playback, status, and 18-view mounting points.
- `styles.css`: complete light theme, dark theme, responsive layout, editor presentation, graphs, panels, and controls.
- `catalog-search.js`: shared local-only normalization, record indexing, and multi-word matching for both program catalogs.
- `app.js`: application state, editor setup, the original reviewed example set, playback, learning views, graph rendering, persistence, and UI events.
- `landing.js`: lightweight landing-page theme controller after example selection moved inside workspaces.
- `dsa-app.js`: DSA state, curriculum browser, worker lifecycle, playback, comments, persistence, and 18 view renderers.
- `dsa-contracts.js`: approved DSA areas, views, evidence labels, event names, representation names, metadata fields, and Tier A totals.
- `dsa-curriculum.js`: 131 reviewed Chunk 1 program records and six ordered section definitions.
- `dsa-curriculum-chunk2.js`: 66 reviewed Chunk 2 records for stacks, queues, deques, linked structures, hash tables, and sets, plus three ordered section definitions.
- `dsa-runtime.js`: pure observed-evidence classification, value comparison, condition helpers, structure selection, and level-filtered DSA comment generation.
- `shared-ui.js`: theme and guarded local-storage helpers shared by new page controllers.
- `shared-editor.js`: reusable Python CodeMirror foundation with a native textarea fallback.
- `curriculum.js`: the additional curriculum examples that blend with the reviewed base set to form the 134-program library.
- `py-worker.js`: isolated Pyodide runtime, Python tracing harness, safe serialization, input handling, and execution limits.
- `scripts/validate-curriculum.mjs`: structural curriculum validator and detached-example exporter.
- `scripts/validate_curriculum.py`: Python compile-and-run validator for all detached examples and their documented intentional errors.
- `scripts/validate-dsa-foundation.mjs`: structural validator for shared DSA contracts, routing, ids, 18 views, 20 structures, and the 535-program target.
- `scripts/validate-dsa-curriculum.mjs`: combined Chunk 1 and Chunk 2 schema, exact section counts, uniqueness, depth, metadata, and near-duplicate validator with detached export.
- `scripts/validate_dsa_curriculum.py`: compile, execute, and expected-result validator for all 197 detached DSA programs.
- `favicon.svg`: code-themed browser-tab icon shared by both pages.
- `README.md`: public beginner guide for using Code Explorer and understanding its features.
- `README_DSA.md`: public guide for the 197-program DSA workspace, evidence boundaries, all active limits, privacy, and later verified chunks.
- `SKILLS.md`: internal project knowledge, capability ledger, recurring implementation recipes, and verification guidance.
- `lessons_learned.md`: living post-mortem containing reusable product and engineering lessons from the user and Codex perspectives.
- `changelog.md`: dated learner-visible release history, verification notes, compatibility boundaries, and upgrade guidance.
- `Tier.md`: planning and status reference for implemented Chunk 2 coverage and the remaining Tier A, B, and C curriculum scope.
- `LICENSE`: GPL license text. Do not modify it while adding explanatory material.

## Required workflow for every change

1. Read the relevant source and its existing comments before editing.
2. Check `SKILLS.md` for related behavior, shared state, safety boundaries, and test cases.
3. Make the smallest coherent change that completely satisfies the request.
4. Add or update teaching-oriented comments with the code.
5. Review `README.md` on every change.
6. Update `README.md` whenever the learner-visible interface, behavior, examples, limits, privacy, persistence, workflow, or expected result changes.
7. Update `SKILLS.md` whenever a capability, dependency, data contract, recurring implementation pattern, project boundary, risk, or validation requirement changes.
8. Update `lessons_learned.md` whenever the work produces a reusable discovery, mistake, correction, successful pattern, deferred decision, or new contributor rule.
9. Update `changelog.md` when a versioned learner-visible feature, example-library expansion, limit, compatibility boundary, or material correction ships.
10. Run proportional syntax, static, content, and browser checks.
11. Inspect the final diff for unrelated edits, stale comments, inconsistent counts, and forbidden dash characters.

A purely internal refactor does not need artificial material added to the public guide. It still requires an explicit README review, and `SKILLS.md` must be updated if the internal working knowledge changed.

## Commenting standard

When adding or changing source, configuration, markup, styles, or assets:

- Add clear comments for every new function, component, configuration block, and non-obvious control-flow block.
- Explain why the code exists, what data it receives, what it returns, and any side effects or safety limits.
- Prefer comments that teach concepts and design decisions over comments that merely repeat syntax.
- Keep comments accurate whenever behavior changes. Outdated comments are bugs.
- Comment related declarations as a coherent block when individual line comments would make the code harder to read.
- Preserve the beginner-friendly language used throughout the project.
- Do not use em dash or en dash characters in code, comments, documentation, or interface text.

For JavaScript functions, use JSDoc with parameter and return information where applicable. For Python inside the worker string, use Python docstrings and focused hash comments. For CSS, describe the responsibility of each selector block. For HTML, explain semantic regions, controls, accessibility relationships, and dynamic mounting points.

## Learner safety and explanation rules

- Never overwrite learner source silently.
- Require explicit confirmation before generated or transformed source replaces the complete editor document. A learner pressing the dedicated Paste control has already requested a complete-document replacement.
- Preserve indentation, blank lines, and existing learner comments when transforming source.
- Base runtime explanations on recorded trace evidence.
- Base source structure explanations on parsed Python syntax.
- If evidence is missing or ambiguous, say that the explanation is unavailable instead of guessing.
- When beginner-facing documentation introduces a technical term, define it nearby or link to a clear definition. For important terms, include a small cause or example, the first evidence to inspect, and a reasonable next experiment.
- Audit vocabulary individually. A feature list or table of supported names is not complete documentation when a first-time learner still needs prior knowledge to understand its entries.
- Clearly distinguish conceptual references from physical RAM addresses.
- Escape learner-controlled content before placing it into HTML.
- Bound displayed values, nested structures, graph sizes, and recorded steps.
- A failure in an optional learning view must not destroy the editor source or the recorded trace.

## Interface and accessibility rules

- Every icon-only control needs an accessible name.
- Important state must use text or shape in addition to color.
- Keyboard focus must remain visible in light and dark themes.
- New controls must work at desktop and mobile widths.
- Avoid layout shifts during playback, tab changes, graph rendering, and editor updates.
- Respect reduced-motion preferences for animation or smooth transitions.
- Keep learning views grouped under Trace, Data, Flow, and Labs rather than creating an unbounded top-level tab row.
- Prefer contextual actions, tooltips, and progressive disclosure over permanent toolbar clutter.
- Keep bounded concept navigation vertical when all categories can fit naturally in a list. Do not require laptop or phone users to scroll a category row sideways.
- When a dialog contains navigation and many results, give each region an explicit height and independent vertical overflow. Never let card contents escape a compressed grid row.
- A visual teaching layer inside the editor must remain distinguishable from actual editable Python source.
- A read-only preview that resembles an editor must say that it is read only. File chrome, visual line numbers, syntax spans, badges, and status text must remain outside copied or adopted source.

## State and persistence rules

- The editor source is stored locally so reloading `workspace.html` restores the program.
- Theme, editor presentation, graph zoom, and learning preferences use browser storage.
- Editing source invalidates the old trace because it no longer describes the visible program.
- Example selection must save the selected code before navigating to the workspace.
- Stored data must remain local unless a future feature clearly asks the learner to export or navigate elsewhere.
- New stored settings need a stable key, safe defaults, validation during loading, and README coverage.

## Verification checklist

Use the checks that match the risk of the change. Learner-visible behavior normally requires all of them.

### Static checks

- Run `node --check app.js` after JavaScript changes.
- Run `node --check py-worker.js` after worker JavaScript changes.
- Run `git diff --check`.
- Search changed text for em dash and en dash characters.
- Confirm HTML ids used by JavaScript exist and remain unique.
- When `app.js` or `styles.css` changes, keep the cache-version query synchronized in all three HTML documents and their imported modules.
- Confirm all new functions and non-obvious blocks have accurate comments.
- Search for analytics, telemetry, tracking, beacon, cookie, form-submission, remote-log, and network APIs whenever dependencies, URLs, storage, or browser capabilities change.
- Confirm no learner source, input, trace, output, clipboard, or stored preference is added to a request URL, body, header, log upload, or third-party API call.

### Browser checks

- Serve the repository through a local HTTP server rather than relying only on `file://` behavior.
- Test the landing page and the dedicated workspace page.
- Test the separate DSA workspace with reviewed and pasted source, and confirm evidence labels remain honest.
- Check light mode and dark mode.
- Check a desktop viewport and a narrow mobile viewport.
- Confirm there are no browser console errors.
- Confirm controls remain stable while the trace step changes.
- Confirm source survives a workspace reload.
- Confirm Python and DSA source keys do not overwrite each other.

### DSA Chunk 2 checks

- Run `node scripts/validate-dsa-foundation.mjs`.
- Run `node scripts/validate-dsa-curriculum.mjs --export /tmp/code-explorer-dsa-curriculum.json`.
- Run `python3 scripts/validate_dsa_curriculum.py /tmp/code-explorer-dsa-curriculum.json`.
- Remove the temporary detached DSA export after validation.
- Confirm the landing page has two matching primary learning-path buttons and no Tool Guide.
- Confirm `workspace.html` links to `README.md` and `data-structures.html` links to `README_DSA.md`.
- Confirm the DSA editor supports wrapping, six validated font sizes, Copy, Paste, fallback editing, source statistics, and separate local persistence.
- Confirm all 18 approved views appear under Trace, Data, Flow, and Labs.
- Confirm all 197 programs execute and produce their documented expected-result marker.
- Confirm section counts are 24 foundations, 12 abstract data types, 42 Python-native containers, 20 array and sequence techniques, 9 searching, 24 sorting, 22 stacks, queues, and deques, 20 linked structures, and 24 hash tables and set algorithms.
- Confirm at least 45 programs retain 15 or more meaningful source lines. The current reviewed count is 48.
- Confirm the catalog shows accurate section, difficulty, line, complexity, and recommended-view metadata.
- Confirm DSA search matches stable ids, titles, source, edge cases, phases, invariants, complexity, structures, events, expected results, and recommended views.
- Confirm DSA search and section filters compose as an intersection, update every section badge, announce the result count, and provide a keyboard-focusable Clear search action.
- Confirm DSA search queries are not persisted, uploaded, logged remotely, or added to request URLs.
- Confirm Observed appears only for trace-derived facts and Curriculum context only for exact unchanged catalog source.
- Edit a catalog example and confirm algorithm name, phases, invariants, edge cases, comparison group, and Big O become Unavailable while observed views continue to work.
- Confirm all 18 views render without an exception after a reviewed trace.
- Confirm 3,000 trace steps produce the explicit limit message and retain an inspectable partial trace.
- Confirm Automatic comments never change original editor source and Learning comments replacement requires confirmation.
- Confirm Automatic comments and Learning comments use the same line-numbered IDE presentation while normal Copy, Copy commented code, and confirmed replacement continue using their documented plain-source targets.
- Confirm DSA Learning comments offers Essential, Guided, and Detailed filtering, updates its exact note summary without rerunning, and keeps reviewed curriculum context visibly separate from syntax or trace notes.
- Confirm the DSA learning-comment modal retains its header, toolbar, flexible preview, and visible Copy and Replace footer at desktop and 390-pixel mobile width in both themes.
- Confirm visual gutters, syntax spans, file chrome, badges, and status text never enter copied or adopted Python.
- Confirm Structure Canvas stops at 30 entries, Watches at 12 names, Operation Journey at 30 events, Algorithm Path at 80 transitions, Step Table at 120 rows, and Compare Algorithms at 2 summaries.
- Confirm exact reviewed stack, queue, deque, linked, hash, and set examples receive their documented conceptual orientation while edited or pasted source remains on the generic observed layout.
- Confirm the Trace and Data view-label sets each remain on one horizontal row at desktop and laptop widths.
- Confirm narrow screens scroll only inside the DSA view-label strip and never create page-level horizontal overflow.
- Confirm playback buttons remain one grouped row, the timeline receives usable width, and mobile moves the timeline below the controls.
- Confirm light and dark themes, desktop and mobile layouts, visible focus, tab semantics, and no horizontal page overflow.
- Confirm the status panel states 197 implemented programs, 9 implemented sections, 20 representations, the 535 target, and the honest remaining count of 338.

### Trace checks

- Run a simple assignment program.
- Run a condition with both outcomes when relevant.
- Run a loop with repeated lines.
- Run a function with parameters and a return value.
- Run a mutable-container example when values or references change.
- Run syntax-error and runtime-error cases.
- Confirm the 3,000-step limit and 30-second timeout still produce clear messages when execution work changes.

### Automatic Learning Comments checks

- Confirm both Automatic comments and Learning comments are disabled before a useful trace and enabled after a supported completed run.
- Confirm Automatic comments starts off after each run, switches its visible text and `aria-pressed` state correctly, and can be turned off without changing source.
- Confirm inline widgets do not alter `getCode()`, the line and character footer, gutter line numbers, breakpoints, execution heatmap, or trace-to-source alignment.
- Confirm normal editor **Copy** still copies original Python while inline notes are visible.
- Confirm changing Essential, Guided, or Detailed refreshes visible inline notes without rerunning Python.
- Confirm editing, pasting, loading another example, and starting a new run immediately hide inline notes and invalidate stale note metadata.
- Confirm the textarea fallback keeps original source as its data and presents comments in a separate read-only preview.
- Confirm Essential, Guided, and Detailed produce progressively richer previews without changing the source.
- Confirm learner-written comments, blank lines, and indentation remain intact.
- Confirm **Copy commented code** copies the complete generated document.
- Confirm the IDE-style preview gutter, badges, legend, file tab, and status strip are visual only and never enter copied or replaced source.
- Confirm learner source and generated comments are rendered as text rather than trusted HTML.
- Confirm **Replace editor** requires confirmation, clears the stale trace, and saves the new source only after confirmation.
- Rerun commented source and confirm older `# Code Explorer:` lines are replaced rather than duplicated.
- Confirm repeated loop lines describe counts or changing behavior without claiming one universal value.
- Confirm runtime-error traces explain only available evidence and syntax errors leave the feature disabled.
- Confirm an unsupported statement receives no invented explanation.
- Check inline notes in light and dark themes at desktop and narrow mobile widths. Verify wrapping does not create horizontal page overflow.

### Starter library checks

- Confirm the blended library contains exactly 134 examples: 54 reviewed base examples and 80 additional curriculum examples.
- Confirm category counts are 10 First Steps, 10 Variables and Types, 10 Operators and Expressions, 8 Strings, 12 Decisions, 16 Loops, 16 Functions and Scope, 16 Collections, 8 References and Mutation, 8 Input, Errors and Debugging, 8 Classes and Objects, and 12 Guided Mini Programs.
- Confirm difficulty counts are 46 Beginner, 56 Developing, and 32 Guided Challenge.
- Confirm all 12 guided programs retain their documented prerequisite lists and appear as fixed recommended checkpoints. Never describe their position as evidence that a learner completed earlier work.
- Confirm at least the documented 20 programs remain 15 lines or longer and that longer programs still progress coherently from setup to result.
- Run `node scripts/validate-curriculum.mjs --export /tmp/code-explorer-curriculum.json` to validate metadata, unique titles, counts, checkpoint placement, and the intentional-error contract.
- Run `python3 scripts/validate_curriculum.py /tmp/code-explorer-curriculum.json` to compile and execute every program with its prepared input.
- Confirm only the three explicitly labeled investigation programs stop with their exact documented exception types. An accidental syntax or runtime error in any other program blocks release.
- Remove the temporary detached-example export after validation.
- Confirm cards display accurate line counts and filters report accurate visible and total counts.
- Confirm Python search matches title, topic, category, difficulty, description, views, prerequisites, expected errors, and source code.
- Confirm Python search and category filters compose as an intersection, update all category badges, announce the result count, and preserve absolute recommended-route numbers in search results.
- Confirm Python search queries are not persisted, uploaded, logged remotely, or added to request URLs.
- Confirm all 13 filter choices, including All, are visible through vertical scrolling and never require horizontal scrolling.
- Confirm each filter shows its exact category count and selecting one returns the program list to its first card.
- Confirm the desktop sidebar and card list scroll independently.
- Confirm the mobile category region stacks above one-column cards, card text remains inside each card, and the page has no horizontal overflow.
- Inspect Story, the primary specialist views, output, and generated learning comments across representative one-line, focused, 15-to-20-line, longer guided, intentional-error, and class-based examples.
- Confirm class instances display stable labels such as `<Pet instance>` instead of physical-looking default memory addresses.
- Confirm bounded instance attributes appear in Variables, Structures, Mutation Explorer, and References without bypassing serialization depth, item, cycle, or graph-size limits.

## Documentation synchronization

Use this mapping during every change:

| Change | README.md | SKILLS.md | lessons_learned.md | changelog.md |
| --- | --- | --- | --- | --- |
| New learner feature | Explain purpose, controls, workflow, examples, expected behavior, persistence, and failure states | Record components, state, data, risks, and tests | Record reusable product or implementation insight | Add it to the current dated version |
| Changed interface text or navigation | Update names, maps, and walkthroughs | Update selectors or event-flow knowledge if affected | Record the reason when it teaches a broader lesson | Record it when the change is release-relevant |
| New example | Update catalog and suggested learning route | Record schema, counts, and coverage changes | Record curriculum insight when relevant | Record the new total and curriculum purpose |
| Changed limit or supported behavior | Update limits and troubleshooting | Update safety boundaries and tests | Record evidence and tradeoff | State old and new behavior clearly |
| New saved preference | Update persistence and privacy guidance | Record key, default, validation, and reset behavior | Record a lesson when persistence behavior was surprising | State persistence behavior when learner-visible |
| New dependency or network request | Explain why the browser connects and what learner data is not sent | Record host, purpose, version, privacy audit, and fallback | Record any reusable privacy finding | Update only when the learner-visible release changes |
| Internal refactor only | Review for accuracy, edit only if learner behavior changed | Update file ownership or implementation recipe if changed | Update only when a reusable pattern or correction emerged | Usually no entry |
| Bug fix | Correct affected expected behavior or troubleshooting text | Record a reusable regression check | Preserve cause, correction, and prevention | Record material learner-visible corrections |

Documentation work is part of feature completion, not a later cleanup task.

For DSA changes, apply the same mapping to `README_DSA.md` and keep `README.md` focused on the Python workspace.

After documentation changes, compare README.md, README_DSA.md, AGENTS.md, SKILLS.md, lessons_learned.md, Tier.md, and changelog.md for matching feature names, dates, limits, example totals, category totals, state behavior, and release status. A Markdown file being modified is not evidence that it is correct.
