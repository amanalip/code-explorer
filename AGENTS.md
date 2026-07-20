# Code Explorer contributor instructions

Code Explorer is intentionally written as a teaching-oriented open-source project.

When adding or changing source, configuration, markup, styles, or assets:

- Add clear comments for every new function, component, configuration block, and non-obvious control-flow block.
- Explain why the code exists, what data it receives, what it returns, and any side effects or safety limits.
- Prefer comments that teach concepts and design decisions over comments that merely repeat syntax.
- Keep comments accurate whenever behavior changes. Outdated comments are treated as bugs.
- Preserve the beginner-friendly language used throughout the project.
- Do not use em dash characters in code, comments, documentation, or interface text.
- Do not alter the GPL license text when adding explanatory material.

For JavaScript functions, prefer JSDoc comments with parameter and return information. For Python code inside the worker string, use Python docstrings and hash comments. For CSS, describe the responsibility of each selector block. For HTML, explain semantic regions and dynamic mounting points.
