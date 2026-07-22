/**
 * Code Explorer Python execution worker
 *
 * This module runs outside the browser's main UI thread. It loads Pyodide,
 * executes learner source through a Python tracer, serializes each educational
 * snapshot, and returns plain JSON-compatible data to app.js. Keeping execution
 * here prevents ordinary Python work from making the visible page unresponsive.
 */

// Pyodide is loaded from its official browser distribution as an ES module.
import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.mjs";

// The promise is created lazily and cached so all runs reuse one Python runtime.
let pyodidePromise;

/**
 * Python source for the tracing harness executed inside Pyodide.
 *
 * String.raw preserves Python backslashes exactly. The final expression writes
 * JSON into result_json, which is intentionally the only complex value crossing
 * from Python back into JavaScript.
 */
const tracerSource = String.raw`
"""
Educational trace harness used by the Code Explorer browser worker.

The harness parses source for loop metadata, traces only frames belonging to the
learner's virtual file, records safe snapshots, captures stdout, and converts all
results into JSON. It does not attempt to expose physical memory addresses as a
memory model. Object identifiers are used only to recognize shared references.
"""

# The standard AST module supplies loop structure without executing the program.
import ast
# Builtins are passed explicitly into the isolated globals dictionary used by exec.
import builtins
# redirect_stdout captures print calls without replacing Python's print function.
import contextlib
# StringIO provides the in-memory stream that accumulates console output.
import io
# JSON creates a value that crosses the Python and JavaScript boundary safely.
import json
# sys.settrace supplies the call, line, return, and exception events used below.
import sys
# traceback locates the learner's source line when execution raises an exception.
import traceback

# This virtual filename distinguishes learner frames from Pyodide and harness frames.
USER_FILE = "<code-explorer>"
# This cap supports larger programs while still preventing runaway browser memory use.
MAX_STEPS = 3000
# Nested containers deeper than this limit are represented by a concise preview.
MAX_DEPTH = 4
# Large containers include only this many children while retaining their true length.
MAX_ITEMS = 30

# Safely format one value for compact display in the browser.
def _safe_repr(value, limit=120):
    """Return a short representation even when an object's repr method is faulty.

    Args:
        value: Any Python object encountered in a visible scope.
        limit: Maximum number of characters included in the educational preview.

    Returns:
        A bounded string safe to place in JSON and render as text in the browser.
    """
    # repr is useful for learning because it preserves quotes and container syntax.
    try:
        text = repr(value)
    # A user-defined repr can raise, so failure falls back to the object's type name.
    except Exception:
        text = f"<{type(value).__name__}>"
    # Long values are shortened to protect the layout and the size of every snapshot.
    if len(text) > limit:
        return text[:limit - 3] + "..."
    # Values already within the limit are returned unchanged.
    return text

# Recursively detach a live Python value into finite educational data.
def _serialize(value, seen=None, depth=0):
    """Convert a Python value into a finite JSON-compatible teaching description.

    The serializer preserves type, display text, container children, and an object
    identifier for reference reasoning. The seen set prevents cyclic containers
    such as a list that contains itself from recursing forever.
    """
    # Every top-level serialization begins with an empty set of visited object ids.
    if seen is None:
        seen = set()

    # The Python type name is displayed next to each variable in the interface.
    value_type = type(value).__name__
    # Primitive immutable values can cross JSON directly without child traversal.
    if value is None or isinstance(value, (bool, int, float, str)):
        return {
            "type": value_type,
            "display": _safe_repr(value),
            "value": value,
        }

    # Non-primitive objects receive an identity token for shared-reference detection.
    object_id = id(value)
    # Encountering an id twice means following it again would duplicate or cycle data.
    if object_id in seen:
        return {
            "type": value_type,
            "display": f"<shared {value_type}>",
            "objectId": str(object_id),
            "shared": True,
        }

    # Deep values keep a readable preview but omit children after the configured limit.
    if depth >= MAX_DEPTH:
        return {
            "type": value_type,
            "display": _safe_repr(value),
            "objectId": str(object_id),
            "truncated": True,
        }

    # A copied set keeps sibling branches independent while marking this branch visited.
    next_seen = seen | {object_id}
    # Every complex value shares a common summary before type-specific fields are added.
    result = {
        "type": value_type,
        "display": _safe_repr(value),
        "objectId": str(object_id),
    }

    # Sequence-like containers expose a bounded list of recursively serialized items.
    if isinstance(value, (list, tuple, set, frozenset)):
        items = list(value)[:MAX_ITEMS]
        result["items"] = [_serialize(item, next_seen, depth + 1) for item in items]
        result["length"] = len(value)
    # Dictionaries preserve key and value descriptions as an ordered entry collection.
    elif isinstance(value, dict):
        items = list(value.items())[:MAX_ITEMS]
        result["entries"] = [
            {
                "key": _serialize(key, next_seen, depth + 1),
                "value": _serialize(item, next_seen, depth + 1),
            }
            for key, item in items
        ]
        result["length"] = len(value)

    # Objects without recognized container structure still return their common summary.
    return result

# Select and serialize the names that are useful to a beginning programmer.
def _visible_variables(mapping):
    """Filter a Python scope and serialize only learner-relevant names.

    Dunder implementation names and ordinary builtin callables would overwhelm a
    beginner, so they are removed while user functions remain available to frame
    accounting even though the JavaScript UI may choose not to show them as cards.
    """
    # A new dictionary prevents mutation of the live frame mapping supplied by Python.
    result = {}
    # Each scope entry is considered independently for visibility and serialization.
    for name, value in mapping.items():
        # Double-underscore implementation details and the builtins alias stay hidden.
        if name.startswith("__") or name in {"builtins"}:
            continue
        # Standard builtin functions are language infrastructure, not learner variables.
        if callable(value) and getattr(value, "__module__", None) == "builtins":
            continue
        # Accepted values are copied into a snapshot-safe serialized form.
        result[name] = _serialize(value)
    # The returned mapping can be encoded as JSON without retaining live references.
    return result

# Convert Python's linked frame chain into the ordered stack shown by the UI.
def _user_frames(frame):
    """Collect user-code frames from global scope to the currently active call.

    Python links frames backward through f_back. This function follows that chain,
    keeps only the virtual learner file, then reverses it for intuitive display.
    """
    # Frames are appended from active to oldest before being reversed at the end.
    frames = []
    # current walks toward the root without changing Python's actual call stack.
    current = frame
    # A None parent marks the end of the interpreter's frame chain.
    while current is not None:
        # Internal Pyodide and harness frames are excluded by their different filename.
        if current.f_code.co_filename == USER_FILE:
            frames.append({
                "name": current.f_code.co_name,
                "line": current.f_lineno,
                "locals": _visible_variables(current.f_locals),
            })
        # Move from the active frame to its caller for the next loop iteration.
        current = current.f_back
    # Global-first ordering matches the stack visualization used in app.js.
    frames.reverse()
    return frames

# Read loop locations and expressions without running the learner program.
def _loop_metadata(tree, source_lines):
    """Extract static for and while loop boundaries from a parsed syntax tree.

    Line ranges let the JavaScript side tell an iteration entry from the final
    loop check that transfers control to the code following the loop.
    """
    # One plain dictionary is produced for every loop node found anywhere in the AST.
    loops = []
    # ast.walk includes nested loops, so later features can visualize them too.
    for node in ast.walk(tree):
        # For loops expose their target name and iterable expression.
        if isinstance(node, ast.For):
            target = ast.unparse(node.target) if hasattr(ast, "unparse") else "item"
            loops.append({
                "line": node.lineno,
                "endLine": getattr(node, "end_lineno", node.lineno),
                "bodyLine": node.body[0].lineno if node.body else node.lineno,
                "type": "for",
                "target": target,
                "source": source_lines[node.lineno - 1].strip(),
            })
        # While loops expose their condition rather than an iteration target.
        elif isinstance(node, ast.While):
            condition = ast.unparse(node.test) if hasattr(ast, "unparse") else "condition"
            loops.append({
                "line": node.lineno,
                "endLine": getattr(node, "end_lineno", node.lineno),
                "bodyLine": node.body[0].lineno if node.body else node.lineno,
                "type": "while",
                "condition": condition,
                "source": source_lines[node.lineno - 1].strip(),
            })
    # Source order creates predictable selection when several loops are present.
    loops.sort(key=lambda item: item["line"])
    return loops

# Extract condition branches so explanations can state which route was observed.
def _condition_metadata(tree, source_lines):
    """Return line boundaries for every if statement in the learner source."""
    # Each entry identifies the condition, its true branch, and its optional alternative.
    conditions = []
    # ast.walk includes nested and elif conditions, which Python represents as nested If nodes.
    for node in ast.walk(tree):
        if not isinstance(node, ast.If):
            continue
        conditions.append({
            "line": node.lineno,
            "endLine": getattr(node, "end_lineno", node.lineno),
            "bodyLine": node.body[0].lineno if node.body else None,
            "elseLine": node.orelse[0].lineno if node.orelse else None,
            "source": source_lines[node.lineno - 1].strip(),
        })
    # Source order lets JavaScript find a condition deterministically by its line.
    conditions.sort(key=lambda item: item["line"])
    return conditions

# Convert one syntax node back into compact Python text for beginner explanations.
def _node_text(node, fallback="the expression"):
    """Return a bounded source-like label for an AST node.

    Args:
        node: Python AST node whose meaning should appear in a generated note.
        fallback: Safe wording used when unparsing is unavailable or fails.

    Returns:
        A single-line string short enough to keep generated comments readable.
    """
    # ast.unparse is available in the Pyodide Python version, but the guarded
    # call keeps comment generation optional if a future syntax node rejects it.
    try:
        text = ast.unparse(node).replace("\n", " ").strip()
    except Exception:
        return fallback
    # Long expressions remain visible in the original source, so the note uses
    # a concise label instead of duplicating a complete statement.
    return text if len(text) <= 72 else text[:69] + "..."

# Extract the readable name of a call such as print(), values.append(), or input().
def _call_name(call):
    """Return a dotted callable name without evaluating the call expression."""
    # A plain name covers builtins and learner-defined functions.
    if isinstance(call.func, ast.Name):
        return call.func.id
    # An attribute call preserves the receiver expression for mutation notes.
    if isinstance(call.func, ast.Attribute):
        receiver = _node_text(call.func.value, "the object")
        return f"{receiver}.{call.func.attr}"
    # Unusual dynamic call targets receive neutral wording rather than a guess.
    return "the callable"

# Describe one statement using only syntax facts that are safe before execution.
def _learning_description(node, source_lines):
    """Build one conservative beginner note for a supported Python statement.

    Args:
        node: AST statement being described.
        source_lines: Original source lines used to recognize elif spelling.

    Returns:
        A tuple of explanation text, detail level, and statement kind, or None
        when the construct cannot be explained reliably.
    """
    # Definitions and control flow are essential because they shape the whole run.
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
        parameters = ", ".join(argument.arg for argument in node.args.args) or "no parameters"
        return (f"Defines {node.name} with {parameters}. Its body runs only when the function is called.", 1, "function")
    if isinstance(node, ast.For):
        target = _node_text(node.target, "the loop variable")
        iterable = _node_text(node.iter, "the iterable")
        return (f"Repeats the indented block for each value from {iterable}, storing the current value in {target}.", 1, "for")
    if isinstance(node, ast.While):
        condition = _node_text(node.test, "the condition")
        return (f"Repeats the indented block while {condition} remains true.", 1, "while")
    if isinstance(node, ast.If):
        condition = _node_text(node.test, "the condition")
        source = source_lines[node.lineno - 1].lstrip() if node.lineno <= len(source_lines) else ""
        if source.startswith("elif "):
            return (f"Checks the next condition, {condition}, and chooses whether that indented path can run.", 1, "condition")
        return (f"Checks whether {condition} and chooses which indented path can run.", 1, "condition")
    if isinstance(node, ast.Return):
        value = _node_text(node.value, "a value") if node.value is not None else "control without a value"
        return (f"Returns {value} to the code that called this function.", 1, "return")
    if isinstance(node, ast.Break):
        return ("Ends the nearest loop immediately and continues after that loop.", 1, "break")
    if isinstance(node, ast.Continue):
        return ("Skips the rest of the current iteration and starts the next loop check.", 1, "continue")
    if isinstance(node, ast.Try):
        return ("Runs this protected block so a matching except block can explain or handle an error.", 1, "try")
    if isinstance(node, ast.Raise):
        return ("Raises an exception deliberately, so ordinary execution stops unless a matching handler catches it.", 1, "raise")

    # Assignments are guided details because they explain how program state grows.
    if isinstance(node, (ast.Assign, ast.AnnAssign, ast.NamedExpr)):
        raw_targets = node.targets if isinstance(node, ast.Assign) else [node.target]
        target_text = ", ".join(_node_text(target, "a target") for target in raw_targets)
        value = getattr(node, "value", None)
        # input() nested inside a conversion remains an input operation even when
        # the outer call is int(), float(), or another learner-selected function.
        input_call = next((part for part in ast.walk(value) if isinstance(part, ast.Call)
                           and isinstance(part.func, ast.Name) and part.func.id == "input"), None) if value else None
        if input_call is not None:
            return (f"Requests the next prepared input value and stores the resulting value in {target_text}.", 1, "input")
        # Subscript and attribute targets change part of an existing object.
        if any(isinstance(target, (ast.Subscript, ast.Attribute)) for target in raw_targets):
            return (f"Updates {target_text} inside an existing object.", 2, "mutation")
        return (f"Evaluates the right side and stores the result in {target_text}.", 2, "assignment")
    if isinstance(node, ast.AugAssign):
        target = _node_text(node.target, "the target")
        operator = {
            ast.Add: "+=", ast.Sub: "-=", ast.Mult: "*=", ast.Div: "/=",
            ast.FloorDiv: "//=", ast.Mod: "%=", ast.Pow: "**=",
        }.get(type(node.op), "an update operator")
        return (f"Updates {target} with {operator} using the value on the right.", 2, "update")

    # Expression statements are described only for recognizable calls.
    if isinstance(node, ast.Expr) and isinstance(node.value, ast.Call):
        call = node.value
        call_name = _call_name(call)
        if call_name == "print":
            return ("Attempts to evaluate the supplied values and send them to Console Output with print.", 1, "output")
        mutation_methods = {"append", "extend", "insert", "remove", "pop", "clear", "sort", "reverse", "add", "discard", "update", "setdefault"}
        method = call.func.attr if isinstance(call.func, ast.Attribute) else None
        if method in mutation_methods:
            receiver = _node_text(call.func.value, "the object")
            return (f"Calls {method} on {receiver}, which can mutate that existing object.", 2, "mutation")
        return (f"Calls {call_name} for its behavior or side effect.", 3, "call")

    # Imports and context managers can be explained from syntax without claiming
    # anything about an external package's runtime behavior.
    if isinstance(node, (ast.Import, ast.ImportFrom)):
        return (f"Imports {_node_text(node, 'a module')} so its names can be used later.", 3, "import")
    if isinstance(node, (ast.With, ast.AsyncWith)):
        return ("Enters a managed context and guarantees that its cleanup behavior runs afterward.", 3, "with")
    if isinstance(node, ast.Assert):
        return (f"Checks that {_node_text(node.test, 'the assertion')} is true and raises AssertionError otherwise.", 2, "assert")
    if isinstance(node, ast.Pass):
        return ("Keeps this block syntactically valid without performing an action.", 3, "pass")
    # Class definitions and other advanced statements are omitted instead of
    # receiving an explanation that could hide important Python semantics.
    return None

# Build detached comment metadata after execution so syntax and runtime evidence can be combined.
def _learning_comment_metadata(tree, source_lines, steps):
    """Return sorted, bounded learning notes for statements in the source.

    Each note contains a source line, detail level, statement kind, and text. A
    runtime suffix is added only when the trace supplies direct evidence, such
    as a statement visit count, selected condition path, or assigned value.
    """
    # Group snapshots by completed source line for bounded evidence lookups.
    steps_by_line = {}
    for step in steps:
        steps_by_line.setdefault(step.get("line"), []).append(step)

    # One note per source line prevents dense one-line Python from producing a
    # confusing stack of comments that cannot map clearly to separate statements.
    notes_by_line = {}
    statement_nodes = [node for node in ast.walk(tree) if isinstance(node, ast.stmt)]
    statement_nodes.sort(key=lambda node: (getattr(node, "lineno", 0), getattr(node, "col_offset", 0)))
    for node in statement_nodes:
        description = _learning_description(node, source_lines)
        if description is None:
            continue
        text, level, kind = description
        # Decorated definitions receive their note before the first decorator so
        # copied code preserves Python's decorator-to-definition relationship.
        decorators = getattr(node, "decorator_list", [])
        line = min([node.lineno] + [decorator.lineno for decorator in decorators])
        if line in notes_by_line:
            continue
        visits = steps_by_line.get(node.lineno, [])
        # Exception snapshots prove that the statement failed, but Python can
        # also emit a frame-exit event for the same failing line. Completion,
        # loop, and outcome counts are therefore withheld for any line that
        # raised instead of accidentally counting exception propagation as work.
        exception_visits = [visit for visit in visits if visit.get("event") == "exception"]

        # A single simple-name assignment can safely report its observed value.
        assignment_target = None
        if isinstance(node, ast.Assign) and len(node.targets) == 1 and isinstance(node.targets[0], ast.Name):
            assignment_target = node.targets[0].id
        elif isinstance(node, ast.AnnAssign) and isinstance(node.target, ast.Name):
            assignment_target = node.target.id
        if assignment_target and len(visits) == 1 and not exception_visits:
            snapshot = visits[-1]
            visible = dict(snapshot.get("globals", {}))
            visible.update(snapshot.get("locals", {}))
            value = visible.get(assignment_target)
            if value and value.get("display") is not None:
                display = value["display"]
                # Binary floating-point can expose a long representation such as
                # 5.550000000000001. A bounded significant-digit display teaches
                # the observed magnitude without presenting machine noise as intent.
                if value.get("type") == "float" and len(display) > 12 and isinstance(value.get("value"), (int, float)):
                    display = format(value["value"], ".10g")
                    text += f" In this run, {assignment_target} became approximately {display}."
                else:
                    text += f" In this run, {assignment_target} became {display}."
        # Repeated execution is reported as a count without pretending that one
        # observed value represents every loop iteration or function call.
        elif len(visits) > 1 and not exception_visits and not isinstance(node, (ast.For, ast.While, ast.If)):
            text += f" This line completed {len(visits)} times during the recorded run."

        # The first exception snapshot contains the original Python type and
        # message. Reporting it is more useful and more accurate than inferring
        # that the statement completed from later frame-unwinding events.
        if exception_visits:
            detail = exception_visits[0].get("detail") or {}
            error_type = detail.get("type", "an exception")
            text += f" This run raised {error_type} on this line before it completed."

        # Loop evidence counts entry into the first body statement, which maps
        # directly to completed iterations for the supported ordinary loops.
        if isinstance(node, (ast.For, ast.While)) and node.body:
            body_steps = steps_by_line.get(node.body[0].lineno, [])
            body_failed = any(visit.get("event") == "exception" for visit in body_steps)
            if not body_failed:
                body_visits = len(body_steps)
                text += f" The loop body was entered {body_visits} time{'s' if body_visits != 1 else ''} in this run."

        # Condition evidence uses the next executed line recorded when the
        # condition completed. Mixed outcomes are possible inside repeated loops.
        if isinstance(node, ast.If) and not exception_visits:
            body_line = node.body[0].lineno if node.body else None
            outcomes = set()
            for visit in visits:
                outcomes.add("true" if visit.get("nextLine") == body_line else "false")
            if outcomes == {"true"}:
                text += " This run followed the true path."
            elif outcomes == {"false"}:
                text += " This run followed the false path."
            elif outcomes == {"true", "false"}:
                text += " Repeated checks followed both the true and false paths."

        notes_by_line[line] = {
            "line": line,
            "level": level,
            "kind": kind,
            "text": text,
        }

    # else, except, and finally headers do not have independent ast.stmt nodes,
    # so conservative header notes are derived from exact stripped source text.
    for line_number, source_line in enumerate(source_lines, start=1):
        stripped = source_line.strip()
        if line_number in notes_by_line:
            continue
        if stripped == "else:":
            notes_by_line[line_number] = {"line": line_number, "level": 1, "kind": "else", "text": "Runs this path when the related earlier condition was false."}
        elif stripped.startswith("except") and stripped.endswith(":"):
            notes_by_line[line_number] = {"line": line_number, "level": 1, "kind": "except", "text": "Handles a matching error raised inside the protected try block."}
        elif stripped == "finally:":
            notes_by_line[line_number] = {"line": line_number, "level": 2, "kind": "finally", "text": "Runs this cleanup block whether or not an error occurred."}

    # Source order keeps insertion deterministic and makes the result easy to inspect.
    return [notes_by_line[line] for line in sorted(notes_by_line)]

# Coordinate parsing, tracing, output capture, execution, and final serialization.
def run_trace(source, prepared_inputs=None):
    """Compile and execute learner source while recording educational snapshots.

    Args:
        source: Complete Python program supplied by the browser editor.
        prepared_inputs: Ordered strings returned by calls to input().

    Returns:
        A dictionary containing steps, loop metadata, stdout, and an optional error.
    """
    # splitlines provides direct one-based source lookup for trace line numbers.
    source_lines = source.splitlines()
    # All print output accumulates in this stream and is copied into each snapshot.
    stdout = io.StringIO()
    # A private queue provides deterministic stdin without browser prompts or server state.
    input_values = iter(prepared_inputs or [])
    # The log lets the interface explain which prepared response each prompt consumed.
    input_log = []
    # steps preserves execution order for forward and backward UI playback.
    steps = []
    # The last line per frame lets a later trace event capture the effects of that line.
    frame_last_lines = {}
    # The variable is initialized for clarity before the compile-time error branch.
    syntax_error = None

    # Parsing and compilation happen before tracing so syntax failures are handled cleanly.
    try:
        tree = ast.parse(source, filename=USER_FILE)
        loops = _loop_metadata(tree, source_lines)
        conditions = _condition_metadata(tree, source_lines)
        compiled = compile(tree, USER_FILE, "exec")
    # SyntaxError occurs before any frame exists, so it returns a result with no steps.
    except SyntaxError as error:
        syntax_error = {
            "type": "SyntaxError",
            "message": error.msg,
            "line": error.lineno or 1,
            "offset": error.offset or 0,
            "source": error.text.strip() if error.text else "",
        }
        return {"steps": [], "loops": [], "conditions": [], "output": "", "error": syntax_error, "inputLog": [], "learningComments": []}

    # This replacement follows Python's input contract while consuming only learner-prepared values.
    def teaching_input(prompt=""):
        """Print the prompt, consume one prepared response, and record the exchange."""
        # input() normally writes its prompt without a trailing newline.
        if prompt:
            print(prompt, end="")
        # Running out of responses is explicit and teachable instead of silently returning empty text.
        try:
            value = next(input_values)
        except StopIteration as error:
            raise EOFError("Input Playground has no prepared value left") from error
        # Echoing the response makes captured console output resemble an interactive terminal session.
        print(value)
        input_log.append({"prompt": str(prompt), "value": value})
        return value

    # This nested helper freezes the current interpreter state into one timeline item.
    def capture(frame, line_number, event, detail=None, next_line=None):
        """Append one fully detached snapshot of the current user-code state."""
        # The hard event limit stops runaway programs before browser memory is exhausted.
        if len(steps) >= MAX_STEPS:
            raise RuntimeError(
                f"Trace limit reached: Code Explorer recorded the maximum of {MAX_STEPS:,} steps. "
                "Shorten the program or reduce the number of loop iterations."
            )
        # Defensive bounds checking ignores trace metadata that cannot map to the source.
        if not line_number or line_number < 1 or line_number > len(source_lines):
            return
        # Frames are serialized before execution resumes and mutates their live locals.
        frames = _user_frames(frame)
        # The final frame is the active local scope; module code falls back to no locals.
        active_locals = frames[-1]["locals"] if frames else {}
        # Every field below is JSON-compatible and safe to send across a Worker boundary.
        steps.append({
            "line": line_number,
            "source": source_lines[line_number - 1],
            "event": event,
            "detail": detail,
            "nextLine": next_line,
            "globals": _visible_variables(frame.f_globals),
            "locals": active_locals,
            "frames": frames,
            "output": stdout.getvalue(),
        })

    # Python invokes this callback for every enabled trace event in learner frames.
    def tracer(frame, event, arg):
        """Handle Python trace events and capture the line that just completed."""
        # Returning early for other filenames avoids tracing the harness and libraries.
        if frame.f_code.co_filename != USER_FILE:
            return tracer

        # id(frame) is stable for the lifetime of one active Python call frame.
        frame_id = id(frame)
        # A call initializes line tracking; its first line event supplies actual source.
        if event == "call":
            frame_last_lines[frame_id] = None
            return tracer

        # A line event fires before the new line, so the previous line has just finished.
        if event == "line":
            previous_line = frame_last_lines.get(frame_id)
            if previous_line is not None:
                capture(frame, previous_line, "line", next_line=frame.f_lineno)
            frame_last_lines[frame_id] = frame.f_lineno
            return tracer

        # A return event captures the final line and attaches the serialized return value.
        if event == "return":
            previous_line = frame_last_lines.get(frame_id)
            if previous_line is not None:
                capture(frame, previous_line, "return", _serialize(arg))
            frame_last_lines.pop(frame_id, None)
            return tracer

        # Exception events preserve the Python type and readable message for explanation.
        if event == "exception":
            error_type, error_value, _ = arg
            capture(frame, frame.f_lineno, "exception", {
                "type": error_type.__name__,
                "message": str(error_value),
            })
            return tracer

        # Returning the tracer keeps tracing enabled for subsequent events in this frame.
        return tracer

    # The learner receives an ordinary module-like global scope with Python builtins.
    # Copying the builtin namespace lets input() be replaced for this run without mutating Pyodide globally.
    program_builtins = dict(vars(builtins))
    program_builtins["input"] = teaching_input
    program_globals = {
        "__name__": "__main__",
        "__builtins__": program_builtins,
    }
    # A null error marks successful execution unless the guarded exec branch replaces it.
    runtime_error = None

    # Redirect output and enable tracing only for the duration of learner execution.
    try:
        with contextlib.redirect_stdout(stdout):
            sys.settrace(tracer)
            # The inner finally always disables tracing, even if user code raises.
            try:
                exec(compiled, program_globals, program_globals)
            finally:
                sys.settrace(None)
    # BaseException also catches interruption-like Python failures for safe reporting.
    except BaseException as error:
        sys.settrace(None)
        runtime_error = {
            "type": type(error).__name__,
            "message": str(error),
            "line": None,
        }
        # Traceback entries are filtered so the UI points only to learner source.
        extracted = traceback.extract_tb(error.__traceback__)
        user_entries = [entry for entry in extracted if entry.filename == USER_FILE]
        if user_entries:
            runtime_error["line"] = user_entries[-1].lineno

    # The final result contains both the replayable timeline and terminal outcome.
    return {
        "steps": steps,
        "loops": loops,
        "conditions": conditions,
        "output": stdout.getvalue(),
        "error": runtime_error,
        "inputLog": input_log,
        "learningComments": _learning_comment_metadata(tree, source_lines, steps),
    }

# USER_SOURCE is injected by JavaScript immediately before this harness runs.
result_json = json.dumps(run_trace(USER_SOURCE, json.loads(USER_INPUTS_JSON)))
`;

/**
 * Returns the shared Pyodide initialization promise.
 *
 * Lazy creation avoids downloading the runtime on the welcome screen, while
 * caching ensures later executions reuse the same WebAssembly interpreter.
 *
 * @returns {Promise<object>} A promise resolving to the Pyodide API object.
 */
async function getPyodide() {
  // Only the first caller starts the large asynchronous runtime download.
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide();
  }
  // All callers await the same promise, including calls made while loading.
  return pyodidePromise;
}

// Begin loading as soon as the worker exists and report readiness to the main UI.
getPyodide()
  // A small typed message is enough for app.js to resolve its readiness promise.
  .then(() => self.postMessage({ type: "ready" }))
  // Initialization failures are serialized because Error objects do not clone reliably.
  .catch((error) => self.postMessage({ type: "init-error", error: error.message }));

/**
 * Receives run requests from app.js and returns serialized trace results.
 *
 * Each request carries a run id so the main thread can ignore a response from an
 * older worker run. Python globals are deleted after use to avoid retaining source
 * or large result strings across executions.
 */
self.addEventListener("message", async (event) => {
  // Ignore unrelated future message types instead of treating them as source code.
  if (event.data?.type !== "run") return;

  // Runtime and Python failures are both converted into explicit worker messages.
  try {
    // Reuse the ready runtime or wait for initialization if the run arrived early.
    const pyodide = await getPyodide();
    // USER_SOURCE becomes a Python global read by the final line of tracerSource.
    pyodide.globals.set("USER_SOURCE", event.data.source);
    // Prepared input is serialized explicitly so all values remain strings, matching Python input().
    pyodide.globals.set("USER_INPUTS_JSON", JSON.stringify(event.data.inputs || []));
    // The harness runs asynchronously from JavaScript, though Python itself is synchronous.
    await pyodide.runPythonAsync(tracerSource);
    // JSON avoids leaking live PyProxy objects across the worker boundary.
    const resultJson = pyodide.globals.get("result_json");
    const result = JSON.parse(resultJson);
    // Removing temporary globals allows their Python and WebAssembly memory to be reclaimed.
    pyodide.globals.delete("USER_SOURCE");
    pyodide.globals.delete("USER_INPUTS_JSON");
    pyodide.globals.delete("result_json");
    // The run id pairs this response with the request that produced it.
    self.postMessage({ type: "result", runId: event.data.runId, result });
  // Infrastructure failures still need to release the main UI from its running state.
  } catch (error) {
    // Send only cloneable primitives and preserve the originating request id.
    self.postMessage({
      // The message type selects the infrastructure-error branch in app.js.
      type: "run-error",
      // The id prevents an old failure from replacing the state of a newer run.
      runId: event.data.runId,
      // Optional chaining supports ordinary Error objects and unusual thrown values.
      error: error?.message || String(error),
    });
  }
});
