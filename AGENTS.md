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
- The trace limit is 3,000 steps.
- The outer execution timeout is 30 seconds.
- A trace limit or timeout must produce a clear learner-facing message.

## Repository map

- `index.html`: landing page, project introduction, starter-program dialog, shared header, and footer.
- `workspace.html`: persistent execution workspace and all dynamic mounting points.
- `styles.css`: complete light theme, dark theme, responsive layout, editor presentation, graphs, panels, and controls.
- `app.js`: application state, editor setup, examples, playback, learning views, graph rendering, persistence, and UI events.
- `py-worker.js`: isolated Pyodide runtime, Python tracing harness, safe serialization, input handling, and execution limits.
- `favicon.svg`: code-themed browser-tab icon shared by both pages.
- `README.md`: public beginner guide for using Code Explorer and understanding its features.
- `SKILLS.md`: internal project knowledge, capability ledger, recurring implementation recipes, and verification guidance.
- `lessons_learned.md`: living post-mortem containing reusable product and engineering lessons from the user and Codex perspectives.
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
9. Run proportional syntax, static, and browser checks.
10. Inspect the final diff for unrelated edits, stale comments, and forbidden dash characters.

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
- When `app.js` or `styles.css` changes, keep the cache-version query synchronized in both HTML documents.
- Confirm all new functions and non-obvious blocks have accurate comments.

### Browser checks

- Serve the repository through a local HTTP server rather than relying only on `file://` behavior.
- Test the landing page and the dedicated workspace page.
- Check light mode and dark mode.
- Check a desktop viewport and a narrow mobile viewport.
- Confirm there are no browser console errors.
- Confirm controls remain stable while the trace step changes.
- Confirm source survives a workspace reload.

### Trace checks

- Run a simple assignment program.
- Run a condition with both outcomes when relevant.
- Run a loop with repeated lines.
- Run a function with parameters and a return value.
- Run a mutable-container example when values or references change.
- Run syntax-error and runtime-error cases.
- Confirm the 3,000-step limit and 30-second timeout still produce clear messages when execution work changes.

## Documentation synchronization

Use this mapping during every change:

| Change | README.md | SKILLS.md | lessons_learned.md |
| --- | --- | --- | --- |
| New learner feature | Explain purpose, controls, workflow, examples, and expected behavior | Record components, state, data, risks, and tests | Record reusable product or implementation insight |
| Changed interface text or navigation | Update names, maps, and walkthroughs | Update selectors or event-flow knowledge if affected | Record the reason when it teaches a broader lesson |
| New example | Update catalog and suggested learning route | Record example schema or coverage changes | Record curriculum insight when relevant |
| Changed limit or supported behavior | Update limits and troubleshooting | Update safety boundaries and tests | Record the evidence and tradeoff behind the decision |
| New saved preference | Update persistence and privacy guidance | Record key, default, validation, and reset behavior | Record a lesson when persistence behavior was surprising |
| Internal refactor only | Review for accuracy, edit only if learner behavior changed | Update file ownership or implementation recipe if changed | Update only when a reusable pattern or correction emerged |
| Bug fix | Correct any affected expected behavior or troubleshooting text | Record a reusable regression check | Preserve the cause, correction, and prevention lesson |

Documentation work is part of feature completion, not a later cleanup task.
