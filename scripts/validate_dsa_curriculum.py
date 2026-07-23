"""Compile and execute every detached implemented DSA curriculum program.

The JavaScript validator exports plain JSON first. This script then uses a fresh
global namespace and captured standard output for every program, checks that no
unexpected exception occurred, and verifies the documented expected result.
"""

from __future__ import annotations

import contextlib
import io
import json
import pathlib
import sys


def validate_program(program: dict[str, object]) -> str | None:
    """Return one failure message, or None when a program behaves as documented."""

    program_id = str(program["id"])
    title = str(program["title"])
    source = str(program["code"])
    expected = str(program["expectedResult"])
    output = io.StringIO()
    namespace: dict[str, object] = {"__name__": "__main__"}

    try:
        compiled = compile(source, f"<{program_id}>", "exec")
        with contextlib.redirect_stdout(output):
            exec(compiled, namespace, namespace)
    except BaseException as error:
        return f"{program_id} {title}: unexpected {type(error).__name__}: {error}"

    stdout = output.getvalue()
    if expected not in stdout:
        return (
            f"{program_id} {title}: expected output to contain {expected!r}, "
            f"received {stdout!r}"
        )
    return None


def main() -> int:
    """Load the detached catalog, validate all programs, and report failures."""

    if len(sys.argv) != 2:
        print("Usage: validate_dsa_curriculum.py <detached-curriculum.json>")
        return 2

    catalog_path = pathlib.Path(sys.argv[1])
    programs = json.loads(catalog_path.read_text(encoding="utf-8"))
    failures = [
        failure
        for program in programs
        if (failure := validate_program(program)) is not None
    ]

    if failures:
        print("\n".join(failures))
        return 1

    print(f"Validated {len(programs)} executable implemented DSA programs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
