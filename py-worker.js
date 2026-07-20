import { loadPyodide } from "https://cdn.jsdelivr.net/pyodide/v0.28.2/full/pyodide.mjs";

let pyodidePromise;

const tracerSource = String.raw`
import ast
import builtins
import contextlib
import io
import json
import sys
import traceback

USER_FILE = "<code-explorer>"
MAX_STEPS = 600
MAX_DEPTH = 4
MAX_ITEMS = 30

def _safe_repr(value, limit=120):
    try:
        text = repr(value)
    except Exception:
        text = f"<{type(value).__name__}>"
    if len(text) > limit:
        return text[:limit - 3] + "..."
    return text

def _serialize(value, seen=None, depth=0):
    if seen is None:
        seen = set()

    value_type = type(value).__name__
    if value is None or isinstance(value, (bool, int, float, str)):
        return {
            "type": value_type,
            "display": _safe_repr(value),
            "value": value,
        }

    object_id = id(value)
    if object_id in seen:
        return {
            "type": value_type,
            "display": f"<shared {value_type}>",
            "objectId": str(object_id),
            "shared": True,
        }

    if depth >= MAX_DEPTH:
        return {
            "type": value_type,
            "display": _safe_repr(value),
            "objectId": str(object_id),
            "truncated": True,
        }

    next_seen = seen | {object_id}
    result = {
        "type": value_type,
        "display": _safe_repr(value),
        "objectId": str(object_id),
    }

    if isinstance(value, (list, tuple, set, frozenset)):
        items = list(value)[:MAX_ITEMS]
        result["items"] = [_serialize(item, next_seen, depth + 1) for item in items]
        result["length"] = len(value)
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

    return result

def _visible_variables(mapping):
    result = {}
    for name, value in mapping.items():
        if name.startswith("__") or name in {"builtins"}:
            continue
        if callable(value) and getattr(value, "__module__", None) == "builtins":
            continue
        result[name] = _serialize(value)
    return result

def _user_frames(frame):
    frames = []
    current = frame
    while current is not None:
        if current.f_code.co_filename == USER_FILE:
            frames.append({
                "name": current.f_code.co_name,
                "line": current.f_lineno,
                "locals": _visible_variables(current.f_locals),
            })
        current = current.f_back
    frames.reverse()
    return frames

def _loop_metadata(tree, source_lines):
    loops = []
    for node in ast.walk(tree):
        if isinstance(node, ast.For):
            target = ast.unparse(node.target) if hasattr(ast, "unparse") else "item"
            loops.append({
                "line": node.lineno,
                "endLine": getattr(node, "end_lineno", node.lineno),
                "type": "for",
                "target": target,
                "source": source_lines[node.lineno - 1].strip(),
            })
        elif isinstance(node, ast.While):
            condition = ast.unparse(node.test) if hasattr(ast, "unparse") else "condition"
            loops.append({
                "line": node.lineno,
                "endLine": getattr(node, "end_lineno", node.lineno),
                "type": "while",
                "condition": condition,
                "source": source_lines[node.lineno - 1].strip(),
            })
    loops.sort(key=lambda item: item["line"])
    return loops

def run_trace(source):
    source_lines = source.splitlines()
    stdout = io.StringIO()
    steps = []
    frame_last_lines = {}
    syntax_error = None

    try:
        tree = ast.parse(source, filename=USER_FILE)
        loops = _loop_metadata(tree, source_lines)
        compiled = compile(tree, USER_FILE, "exec")
    except SyntaxError as error:
        syntax_error = {
            "type": "SyntaxError",
            "message": error.msg,
            "line": error.lineno or 1,
            "offset": error.offset or 0,
            "source": error.text.strip() if error.text else "",
        }
        return {"steps": [], "loops": [], "output": "", "error": syntax_error}

    def capture(frame, line_number, event, detail=None, next_line=None):
        if len(steps) >= MAX_STEPS:
            raise RuntimeError(f"Trace stopped after {MAX_STEPS} steps. The program may contain a long or infinite loop.")
        if not line_number or line_number < 1 or line_number > len(source_lines):
            return
        frames = _user_frames(frame)
        active_locals = frames[-1]["locals"] if frames else {}
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

    def tracer(frame, event, arg):
        if frame.f_code.co_filename != USER_FILE:
            return tracer

        frame_id = id(frame)
        if event == "call":
            frame_last_lines[frame_id] = None
            return tracer

        if event == "line":
            previous_line = frame_last_lines.get(frame_id)
            if previous_line is not None:
                capture(frame, previous_line, "line", next_line=frame.f_lineno)
            frame_last_lines[frame_id] = frame.f_lineno
            return tracer

        if event == "return":
            previous_line = frame_last_lines.get(frame_id)
            if previous_line is not None:
                capture(frame, previous_line, "return", _serialize(arg))
            frame_last_lines.pop(frame_id, None)
            return tracer

        if event == "exception":
            error_type, error_value, _ = arg
            capture(frame, frame.f_lineno, "exception", {
                "type": error_type.__name__,
                "message": str(error_value),
            })
            return tracer

        return tracer

    program_globals = {
        "__name__": "__main__",
        "__builtins__": builtins,
    }
    runtime_error = None

    try:
        with contextlib.redirect_stdout(stdout):
            sys.settrace(tracer)
            try:
                exec(compiled, program_globals, program_globals)
            finally:
                sys.settrace(None)
    except BaseException as error:
        sys.settrace(None)
        runtime_error = {
            "type": type(error).__name__,
            "message": str(error),
            "line": None,
        }
        extracted = traceback.extract_tb(error.__traceback__)
        user_entries = [entry for entry in extracted if entry.filename == USER_FILE]
        if user_entries:
            runtime_error["line"] = user_entries[-1].lineno

    return {
        "steps": steps,
        "loops": loops,
        "output": stdout.getvalue(),
        "error": runtime_error,
    }

result_json = json.dumps(run_trace(USER_SOURCE))
`;

async function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = loadPyodide();
  }
  return pyodidePromise;
}

getPyodide()
  .then(() => self.postMessage({ type: "ready" }))
  .catch((error) => self.postMessage({ type: "init-error", error: error.message }));

self.addEventListener("message", async (event) => {
  if (event.data?.type !== "run") return;

  try {
    const pyodide = await getPyodide();
    pyodide.globals.set("USER_SOURCE", event.data.source);
    await pyodide.runPythonAsync(tracerSource);
    const resultJson = pyodide.globals.get("result_json");
    const result = JSON.parse(resultJson);
    pyodide.globals.delete("USER_SOURCE");
    pyodide.globals.delete("result_json");
    self.postMessage({ type: "result", runId: event.data.runId, result });
  } catch (error) {
    self.postMessage({
      type: "run-error",
      runId: event.data.runId,
      error: error?.message || String(error),
    });
  }
});
