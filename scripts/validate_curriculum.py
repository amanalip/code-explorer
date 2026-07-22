"""Compile and execute every detached Code Explorer curriculum program.

The JavaScript catalog validator can export the complete example collection to
a temporary JSON file. This companion script reads that file, supplies prepared
input, executes every program in fresh globals, and verifies the three explicit
intentional errors by exception type.

No learner data is involved. The input file contains only programs committed to
the repository, and the validator performs no network requests or analytics.
"""

# argparse provides a clear required path and conventional command-line help.
import argparse
# builtins is copied so input can be replaced without altering the interpreter globally.
import builtins
# redirect_stdout prevents example output from overwhelming the validation report.
import contextlib
# StringIO receives redirected output entirely in memory.
import io
# json reads the detached catalog created by the JavaScript validator.
import json
# signal bounds every individual program so an accidental infinite loop is named.
import signal


def stop_slow_example(signum, frame):
    """Raise a teachable timeout when one example exceeds two seconds."""

    # The parameters are required by Python's signal callback contract but the
    # exception itself is the only result needed by the validation loop.
    del signum, frame
    raise TimeoutError("Program exceeded the validator's two-second example limit")


def validate_example(example):
    """Compile and execute one program, returning a failure string or None.

    Args:
        example: Detached dictionary containing title, code, optional input, and
            an optional expected-error label.

    Returns:
        A readable failure description, or None when behavior matches metadata.
    """

    # Prepared responses reproduce the Input Playground contract used in the browser.
    prepared = iter(example.get("inputs", "").splitlines())

    def prepared_input(prompt=""):
        """Return the next saved response without reading a real terminal."""

        # The prompt is intentionally ignored because redirected example output
        # is not part of this validator's pass or fail decision.
        del prompt
        try:
            return next(prepared)
        except StopIteration as error:
            raise EOFError("Validator ran out of prepared input") from error

    # Each program receives ordinary builtins except for deterministic input.
    safe_builtins = dict(vars(builtins))
    safe_builtins["input"] = prepared_input
    scope = {"__name__": "__main__", "__builtins__": safe_builtins}
    expected = example.get("expectedError")

    try:
        compiled = compile(example["code"], f"<curriculum:{example['title']}>", "exec")
        signal.alarm(2)
        with contextlib.redirect_stdout(io.StringIO()):
            exec(compiled, scope, scope)
    except BaseException as error:
        expected_type = expected.split()[-1] if expected else None
        if expected_type != type(error).__name__:
            return f"{example['title']}: unexpected {type(error).__name__}: {error}"
    else:
        if expected:
            return f"{example['title']}: expected {expected} but completed successfully"
    finally:
        signal.alarm(0)
    return None


def main():
    """Load the detached catalog, validate every program, and print a summary."""

    parser = argparse.ArgumentParser(description="Execute all Code Explorer curriculum programs.")
    parser.add_argument("catalog", help="Temporary JSON file exported by validate-curriculum.mjs")
    arguments = parser.parse_args()

    # UTF-8 preserves learner-facing titles and Python text exactly.
    with open(arguments.catalog, encoding="utf-8") as catalog_file:
        examples = json.load(catalog_file)

    # SIGALRM is local to this command-line audit and is cancelled after every example.
    signal.signal(signal.SIGALRM, stop_slow_example)
    failures = [failure for example in examples if (failure := validate_example(example))]
    if failures:
        raise SystemExit("\n".join(failures))

    intentional_count = sum(bool(example.get("expectedError")) for example in examples)
    print(f"Validated {len(examples)} Python programs, including {intentional_count} intentional errors.")


# Direct execution runs the audit, while importing the module remains side-effect free.
if __name__ == "__main__":
    main()
