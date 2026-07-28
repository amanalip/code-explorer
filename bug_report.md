# Code Explorer incident report

## CE-2026-07-27-01: non-finite Python floats broke browser trace transport

| Field | Value |
| --- | --- |
| Status | Resolved and verified in the working tree |
| Severity | High |
| First reported | During DSA Chunk 5 verification on 2026-07-27 |
| Report generated | 2026-07-27 23:56:07 EDT, UTC-04:00 |
| Affected component | Shared Pyodide trace worker in `py-worker.js` |
| Affected workspaces | Python Programming and Python Data Structures and Algorithms |
| Confirmed trigger | A traced value containing positive or negative infinity |
| Related boundary value | NaN used the same unsafe transport path |
| Learner data exposure | None |
| Analytics or telemetry involved | None |
| Network upload involved | None |
| Original resolution audit | 397 of 397 DSA programs passed through the real browser worker |
| Latest regression audit | 451 of 451 DSA programs passed on 2026-07-28 |

## Executive summary

Code Explorer could execute a valid Python program and still fail while
returning its trace to the browser. The failure occurred when any serialized
snapshot contained a non-finite floating-point value:

```python
float("inf")
float("-inf")
float("nan")
```

Python accepts these values. They are useful in algorithms, especially when
infinity represents an initial unreachable distance or an absent best score.
The worker's Python serializer treated them like ordinary primitive floats.
Python's `json.dumps` then emitted `Infinity`, `-Infinity`, or `NaN`.

Those tokens are not valid JSON. The browser received the text and passed it to
JavaScript `JSON.parse`, which rejected it. The visible result was a runtime
infrastructure error even though the learner's Python calculation itself was
valid.

The correction converts only the transport representation of non-finite floats
to stable strings while preserving their Python type and readable spelling.
The worker's final JSON encoding now uses `allow_nan=False` as a strict safety
assertion. Positive infinity, negative infinity, and NaN can no longer leak as
invalid JSON tokens.

## Learner-visible symptom

The reported `DSA-324` edge-relaxation lesson included:

```python
infinity = float("inf")
distance = {"A": 0, "B": 7, "C": infinity}
```

The browser displayed an error similar to:

```text
Python could not run this program: Unexpected token 'I',
..."value": Infinity}... is not valid JSON
```

The important clues were:

- The source was valid Python.
- The unexpected token was the letter `I`.
- The error excerpt contained `"value": Infinity`.
- The runtime status became Python unavailable.
- The failure occurred before a usable trace reached the interface.

Together, these clues pointed away from the algorithm and toward the
Python-to-JavaScript transport boundary.

## Impact

### What failed

- A run could complete inside Python but fail before JavaScript received a
  usable trace object.
- The learner could not inspect Story, Variables, Structure Canvas, Console
  Output, or any other trace-driven view.
- The runtime status could imply that Python was unavailable even though the
  actual failure was invalid serialized text.
- Any source containing a non-finite float in a recorded local or global value
  could trigger the defect.

### What did not fail

- Python arithmetic with infinity remained valid inside Pyodide.
- The learner's source was not changed.
- Local saved source was not erased.
- No trace or learner source was uploaded.
- No analytics, telemetry, cookies, remote logging, or crash-report request was
  involved.
- Finite integers and floats continued to use their normal numeric transport.
- The 3,000-step limit and 30-second timeout were not changed.

### Why severity is High

The defect blocked a valid, reviewed production lesson and could affect pasted
learner code. It crossed both workspaces because they share the same worker. It
also invalidated the assumption that direct Python execution alone proved a
catalog program could run in the website.

The issue did not expose data, corrupt source, or execute unsafe remote work.
For that reason it is not classified as a security incident. It is a high
severity reliability and compatibility incident.

## Technical background

### Strict JSON number rules

JSON supports finite numbers. It does not define these tokens:

```text
Infinity
-Infinity
NaN
```

JavaScript can represent `Infinity` and `NaN` as language values, but
`JSON.parse` follows the stricter JSON grammar:

```javascript
JSON.parse('{"value": Infinity}') // throws SyntaxError
```

### Python encoder behavior

Python's `json.dumps` defaults to:

```python
allow_nan=True
```

With that default, Python emits nonstandard tokens:

```python
json.dumps({"value": float("inf")})
# '{"value": Infinity}'

json.dumps({"value": float("-inf")})
# '{"value": -Infinity}'

json.dumps({"value": float("nan")})
# '{"value": NaN}'
```

Python documents this as JavaScript-compatible behavior, but the output is not
strict JSON. A different Python decoder may accept it. JavaScript
`JSON.parse` does not.

## Failure path before the correction

```text
Learner source
    |
    v
Pyodide executes valid Python
    |
    v
sys.settrace records locals and globals
    |
    v
_serialize sees float("inf")
    |
    +-- old behavior: primitive float passes through unchanged
    |
    v
json.dumps uses allow_nan=True
    |
    v
result text contains Infinity
    |
    v
worker JavaScript calls JSON.parse
    |
    v
SyntaxError before a trace object exists
    |
    v
workspace reports Python unavailable
```

## Root cause

The root cause was an incomplete serializer contract.

The `_serialize` function promised finite, JSON-compatible teaching data, but
its primitive branch accepted every Python float:

```python
if value is None or isinstance(value, (bool, int, float, str)):
    return {
        "type": value_type,
        "display": _safe_repr(value),
        "value": value,
    }
```

That branch was safe for finite floats and unsafe for non-finite floats. The
final `json.dumps` call used its permissive default, so no Python-side error
forced the missing case to become visible during development.

The defect required both conditions:

1. A trace snapshot contained a non-finite float.
2. That snapshot crossed the strict JavaScript JSON parser.

## Contributing factors

### Direct execution did not exercise the transport boundary

The curriculum validator:

1. Compiled each Python program.
2. Executed it in a fresh namespace.
3. Captured standard output.
4. Checked the program-specific `expectedResult`.

That is valuable evidence, but it does not call the tracing serializer and does
not parse the worker result in JavaScript. `DSA-324` could therefore pass direct
Python validation while failing in the browser.

### Representative browser checks did not originally include every boundary value

Earlier browser checks covered assignments, loops, functions, mutable
containers, errors, reviewed context, pasted-code honesty, and responsive
views. They did not establish an explicit matrix for:

- Positive infinity.
- Negative infinity.
- NaN.
- Values nested inside dictionaries, lists, object attributes, or trace
  snapshots.

### The final encoder was permissive

Because `allow_nan=True` is Python's default, the encoder did not reject the
unsafe serializer output. A strict final encoder would have turned the hidden
contract violation into a Python-side development failure before JavaScript
received malformed text.

## Detection

Aman reported the learner-visible failure with a screenshot and asked for the
affected program plus every other catalog program to be checked. This report
was the first evidence that direct execution and browser execution disagreed.

The report was especially useful because it included:

- The exact source.
- The runtime status.
- The parser's unexpected token.
- The invalid JSON excerpt.
- The instruction to audit the complete catalog.

Credit belongs to Aman for identifying a production-path failure that existing
tests did not cover.

## Correction

### 1. Detect non-finite floats before the primitive branch

The worker now imports `math` and checks:

```python
if isinstance(value, float) and not math.isfinite(value):
    return {
        "type": value_type,
        "display": _safe_repr(value),
        "value": _safe_repr(value),
        "nonFinite": True,
    }
```

This preserves:

- `type: "float"` for teaching.
- `display: "inf"`, `"-inf"`, or `"nan"` for readable Python evidence.
- A stable string in `value` so strict JSON can transport it.
- `nonFinite: True` so future renderers can distinguish the boundary case
  without parsing display text.

This does not change the live Python value used by the learner's program.
Only the detached teaching description uses the safe string.

### 2. Make final JSON encoding strict

The final encoder now uses:

```python
result_json = json.dumps(
    run_trace(USER_SOURCE, json.loads(USER_INPUTS_JSON)),
    allow_nan=False,
)
```

This is defense in depth. If a future raw non-finite float bypasses
`_serialize`, Python raises during encoding instead of silently producing text
that JavaScript cannot parse.

### 3. Add a static transport regression

The DSA foundation validator now requires all three safeguards:

- `math.isfinite` classification.
- The explicit `nonFinite` marker.
- `allow_nan=False` strict encoding.

The static check is not a replacement for browser execution. It prevents an
accidental removal of the known correction and makes the boundary visible to a
future contributor.

### 4. Bump browser cache versions

All HTML entry points and imported modules use the same updated cache version.
This prevents a browser from combining a new controller with an older cached
worker.

## Verification

### Focused positive-infinity regression

`DSA-324` was loaded through the real catalog and run through the actual
browser worker.

Verified behavior:

- Runtime status: `Trace ready`.
- Trace length: 14 of 14 selected at completion.
- Output included the before distance, candidate, updated distance, and
  documented successful result.
- Variables preserved readable `inf` evidence.

### Focused negative-infinity regression

`DSA-378` uses negative infinity while computing a maximum subarray.

Verified behavior:

- Runtime status: `Trace ready`.
- Trace length: 306 of 306 selected at completion.
- Output included the best slice `[4, -1, 2, 1]`.
- Output included best sum `6`.
- Output included the documented result marker.

### Focused combined non-finite regression

A pasted local program stored positive infinity, negative infinity, and NaN in
the same list, unpacked them into separate names, and checked
`math.isnan(missing)`.

Verified behavior:

- Runtime status: `Trace ready`.
- Trace length: 5 of 5 selected at completion.
- Output displayed `[inf, -inf, nan]`.
- Output displayed `Result: True`.
- The original saved DSA source was restored after the temporary probe.

### Complete detached execution

The cumulative curriculum validators checked:

```text
397 unique DSA records
20 implemented sections
397 successful Python compilations and executions
397 documented expected-result markers
192 programs with at least 15 meaningful source lines
```

### Complete real-browser worker audit

Every exact catalog program was:

1. Located through the catalog.
2. Selected by its exact visible stable ID.
3. Loaded into the editor.
4. Run through the actual Pyodide worker.
5. Waited to a terminal runtime state.
6. Required to reach `Trace ready`.
7. Advanced to its final recorded trace step.
8. Compared with its own `expectedResult`.

Final result:

```text
Expected records: 397
Completed browser runs: 397
Programs reaching Trace ready: 397
Programs displaying their documented expected result: 397
Failures: 0
```

## Audit-harness corrections

The full-catalog browser audit itself required two corrections. These are
documented because a flawed test can create false confidence or false alarms.

### First harness mistake: reading output at step zero

Console Output is time-aware. At step zero it correctly displays:

```text
// No output yet
```

The first harness read that state and reported 397 failures even though all 397
runs reached `Trace ready`. The correction moved the timeline to its maximum
recorded step before inspecting output.

### Second harness mistake: clicking the first search result

Catalog search is intentionally broad. It searches stable IDs, titles,
metadata, and source. Searching `dsa-170` is normalized into tokens, and the
radix-sort lesson also contains the number `170`.

The second harness clicked the first matching card and compared that different
program with the `DSA-170` expected result. The product search was working as
designed. The test selection was ambiguous.

The definitive harness selected the card whose visible stable ID exactly
matched the target. The final exact-ID run produced zero failures.

### Third harness mistake: clicking before a reloaded controller was ready

The first focused NaN probe reloaded the page, then clicked Run before
`dsa-app.js` finished creating the editor and attaching its event handlers.
The visible button existed in HTML, but the JavaScript editor state was not yet
ready. That automation attempt produced a local `getCode` error and did not
start Python.

The corrected probe waited until the runtime label reported `Chunk 5 ready`
before selecting Run. It then reached `Trace ready`, displayed all three
non-finite spellings, and restored the original saved source.

This was a test-timing mistake, not a learner-path defect observed after normal
page initialization. The clean final browser session waited for readiness and
recorded no console error.

## Privacy and security analysis

This incident involved only local browser execution:

```text
editor -> local Web Worker -> local Pyodide -> local JavaScript controller
```

The correction adds:

- No analytics.
- No telemetry.
- No remote logging.
- No network API.
- No cookie.
- No learner identifier.
- No storage key.
- No request containing source, trace, input, output, or error data.

The exception text shown to the learner was generated locally. Code Explorer
maintainers did not receive it automatically. Aman chose to share the
screenshot during development.

## Compatibility and behavior after the correction

| Python value | Live Python behavior | Serialized teaching value | Visible type |
| --- | --- | --- | --- |
| `1.5` | Unchanged finite float | Numeric `1.5` | `float` |
| `float("inf")` | Positive infinity | String `"inf"` with `nonFinite: true` | `float` |
| `float("-inf")` | Negative infinity | String `"-inf"` with `nonFinite: true` | `float` |
| `float("nan")` | NaN semantics remain in Python | String `"nan"` with `nonFinite: true` | `float` |

Learners should remember that NaN is not equal to itself in Python. The string
transport marker does not redefine that rule. It describes a recorded value
after execution.

## Prevention actions

### Required serializer boundary matrix

Future serializer changes must check:

- `None`.
- Booleans.
- Small and large integers.
- Finite positive and negative floats.
- Positive infinity.
- Negative infinity.
- NaN.
- Strings.
- Empty and populated containers.
- Nested non-finite values.
- Shared references.
- Cycles.
- Long representations.
- User-defined instances.

### Required proof layers

```text
source and schema checks
        |
        v
direct language execution
        |
        v
strict serialization
        |
        v
consumer parsing
        |
        v
controller readiness
        |
        v
real browser state and visible output
```

No one layer should be described as proof of every later layer.

### Release rule

A worker or serializer change is not complete until:

1. Static syntax checks pass.
2. The strict transport guard is present.
3. Focused boundary programs run in a real browser.
4. Program-specific expected output is checked at the final trace step.
5. The exact catalog ID is used for automated selection.
6. Automation waits for controller readiness after navigation or reload.
7. Both workspaces are reviewed because they share the worker.
8. Documentation and lessons explain any changed supported behavior.

## Files changed or reviewed

| File | Responsibility |
| --- | --- |
| `py-worker.js` | Detects non-finite floats and enforces strict JSON encoding |
| `scripts/validate-dsa-foundation.mjs` | Protects the transport correction from accidental removal |
| `README.md` | Explains the shared learner-visible non-finite value behavior |
| `README_DSA.md` | Explains the DSA limit and troubleshooting behavior |
| `AGENTS.md` | Adds the recurring contributor regression requirement |
| `SKILLS.md` | Records the serializer contract and verification recipe |
| `lessons_learned.md` | Preserves user and Codex lessons, including audit mistakes |
| `changelog.md` | Records the material learner-visible reliability correction |
| `Tier.md` | Records the cumulative Chunk 5 browser evidence |
| `bug_report.md` | Preserves this complete technical incident record |

## Final resolution statement

The learner's algorithm was not the cause. The defect was an incomplete
application transport contract around valid Python non-finite floats.

The worker now produces strict JSON-safe teaching data, the final encoder
rejects future raw non-finite leaks, focused positive and negative infinity
examples pass, and all 397 exact DSA catalog programs pass through the real
browser worker with their documented expected results.

## Post-resolution Chunk 6 regression audit

| Field | Value |
| --- | --- |
| Audit timestamp | 2026-07-28 12:47:30 EDT, UTC-04:00 |
| Release under review | DSA Chunk 6 |
| Cumulative catalog size | 451 programs |
| New programs | 54 |
| New sections | Dynamic programming, Bit manipulation, Elementary mathematical algorithms |
| Exact browser passes | 451 of 451 |
| Expected-result matches | 451 of 451 |
| Transport failures | 0 |
| Privacy impact | None |

### Why this follow-up was required

The original correction passed the 397-program Chunk 5 catalog, but a
regression record must remain active when new curriculum uses the same risky
value boundary. Dynamic programming commonly uses:

```python
float("inf")
```

as an initial answer meaning that no finite minimum has been found yet. A
maximum-value recurrence can similarly use:

```python
float("-inf")
```

to represent an impossible state. These values are mathematically useful and
valid in Python, so forbidding them would hide an important algorithmic
pattern rather than fix the browser transport.

Aman explicitly asked that the infinity error not return when Chunk 6 shipped.
That requirement correctly turned the prior incident into a release
regression, not a one-time historical check.

### Focused Chunk 6 boundary programs

`DSA-403` uses positive infinity while finding a minimum number of coins:

```text
unreachable state -> positive infinity
candidate found   -> finite count
final result      -> minimum count
```

Verified learner-visible behavior:

- The exact reviewed card was selected.
- The program ran through the actual Pyodide worker.
- Runtime status reached `Trace ready`.
- The completed trace contained 100 recorded steps.
- Final Console Output contained the record's own `Result: True` marker.

`DSA-406` uses negative infinity while maximizing an exact-capacity
unbounded-knapsack value:

```text
impossible state -> negative infinity
valid transition -> finite value
final result     -> maximum reachable value
```

Verified learner-visible behavior:

- The exact reviewed card was selected.
- The program ran through the actual Pyodide worker.
- Runtime status reached `Trace ready`.
- The completed trace contained 157 recorded steps.
- Final Console Output contained the record's own `Result: True` marker.

The two tests cover opposite signs and opposite optimization meanings. They
prove that the browser does not confuse an unsolved minimum with an impossible
maximum while transporting their detached teaching values.

### Complete 451-program browser audit

Focused boundary tests are necessary but cannot prove that the rest of a
growing catalog still works. The corrected exact-ID harness therefore repeated
the full learner path for every record:

```text
wait for Chunk 6 readiness
        |
search for the requested stable ID
        |
select the exact visible ID
        |
run through the real worker
        |
require Trace ready
        |
move playback to the final step
        |
compare visible output with that record's expected marker
```

Final result:

```text
Expected records: 451
Completed browser runs: 451
Programs reaching Trace ready: 451
Programs displaying their documented expected result: 451
Failures: 0
```

The audit also included focused checks for `DSA-422`, a finite bit-mask
lesson, and `DSA-451`, the final coprime-congruence lesson. This ensured the
newest section boundary and final stable ID were both selectable and
executable.

### What did not change

The Chunk 6 release did not weaken or replace the original protection:

- `math.isfinite` still intercepts every non-finite Python float before the
  normal primitive transport path.
- The detached teaching value still keeps type `float`, readable display text,
  stable string data, and `nonFinite: true`.
- Final Python JSON encoding still uses `allow_nan=False`.
- JavaScript still receives strict JSON rather than permissive Python tokens.
- No learner source, trace, input, output, or error was uploaded.
- No analytics, telemetry, cookie, identifier, network logger, or remote crash
  reporter was added.

### Updated prevention rule

Every later DSA chunk must run the focused non-finite matrix when its programs
use infinity or NaN. A cumulative exact-ID browser audit remains required
before claiming complete-catalog reliability. The detached Python validator is
valuable and must continue, but it cannot replace strict serializer and
consumer evidence.

### Updated resolution statement

The original defect remains resolved. The 397-program resolution audit and the
451-program Chunk 6 regression audit both passed. Positive infinity, negative
infinity, and NaN remain valid learner values, and the worker transports them
as strict JSON-safe teaching evidence without changing live Python behavior.
