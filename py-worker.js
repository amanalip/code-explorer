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
                "type": "while",
                "condition": condition,
                "source": source_lines[node.lineno - 1].strip(),
            })
    # Source order creates predictable selection when several loops are present.
    loops.sort(key=lambda item: item["line"])
    return loops

# Coordinate parsing, tracing, output capture, execution, and final serialization.
def run_trace(source):
    """Compile and execute learner source while recording educational snapshots.

    Args:
        source: Complete Python program supplied by the browser editor.

    Returns:
        A dictionary containing steps, loop metadata, stdout, and an optional error.
    """
    # splitlines provides direct one-based source lookup for trace line numbers.
    source_lines = source.splitlines()
    # All print output accumulates in this stream and is copied into each snapshot.
    stdout = io.StringIO()
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
        return {"steps": [], "loops": [], "output": "", "error": syntax_error}

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
    program_globals = {
        "__name__": "__main__",
        "__builtins__": builtins,
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
        "output": stdout.getvalue(),
        "error": runtime_error,
    }

# USER_SOURCE is injected by JavaScript immediately before this harness runs.
result_json = json.dumps(run_trace(USER_SOURCE))
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
    // The harness runs asynchronously from JavaScript, though Python itself is synchronous.
    await pyodide.runPythonAsync(tracerSource);
    // JSON avoids leaking live PyProxy objects across the worker boundary.
    const resultJson = pyodide.globals.get("result_json");
    const result = JSON.parse(resultJson);
    // Removing temporary globals allows their Python and WebAssembly memory to be reclaimed.
    pyodide.globals.delete("USER_SOURCE");
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
