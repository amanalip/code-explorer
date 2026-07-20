const DEFAULT_CODE = `total = 0

for number in range(1, 4):
    total += number
    print("Added", number)

print("Total:", total)`;

const EXAMPLES = [
  {
    topic: "Variables",
    title: "A tiny calculation",
    description: "Watch names appear and values move through an expression.",
    code: `price = 8
quantity = 3
total = price * quantity
print("Total:", total)`,
  },
  {
    topic: "For loop",
    title: "Running total",
    description: "See an accumulator change during each loop iteration.",
    code: DEFAULT_CODE,
  },
  {
    topic: "While loop",
    title: "Countdown",
    description: "Follow a condition and changing counter until the loop ends.",
    code: `count = 3

while count > 0:
    print(count)
    count -= 1

print("Lift off!")`,
  },
  {
    topic: "Conditions",
    title: "Pass or try again",
    description: "See which path Python chooses after checking a condition.",
    code: `score = 72

if score >= 50:
    result = "Pass"
else:
    result = "Try again"

print(result)`,
  },
  {
    topic: "Functions",
    title: "A function call",
    description: "Watch a local frame appear, calculate, and return a value.",
    code: `def double(number):
    result = number * 2
    return result

answer = double(4)
print(answer)`,
  },
  {
    topic: "Lists",
    title: "Growing a list",
    description: "Observe a list as values are appended inside a loop.",
    code: `squares = []

for number in range(1, 4):
    squares.append(number * number)

print(squares)`,
  },
];

const els = Object.fromEntries(
  [
    "runtimeStatus", "runtimeLabel", "themeButton", "themeIcon", "welcomeScreen", "workspace",
    "startButton", "heroExampleButton", "backButton", "examplesButton", "runButton", "stopButton",
    "editor", "editorShell", "codeStats", "storyTab", "loopTab", "loopBadge", "storyView", "loopView",
    "emptyStory", "traceContent", "traceKicker", "executedCode", "explanation", "changeList",
    "variablesGrid", "callStackSection", "callStack", "emptyLoop", "loopContent", "loopType",
    "iterationCount", "loopSource", "loopMeter", "iterationList", "stepCount", "previousButton",
    "playButton", "nextButton", "restartButton", "stepSlider", "progressPercent", "speedSelect",
    "consoleOutput", "clearOutputButton", "examplesDialog", "closeExamplesButton", "exampleGrid", "toast",
  ].map((id) => [id, document.getElementById(id)]),
);

const state = {
  editorView: null,
  fallbackEditor: null,
  code: DEFAULT_CODE,
  worker: null,
  workerReady: null,
  resolveWorkerReady: null,
  rejectWorkerReady: null,
  running: false,
  runId: 0,
  runTimeout: null,
  trace: [],
  loops: [],
  error: null,
  currentStep: 0,
  playing: false,
  playTimer: null,
  activePanel: "story",
  toastTimer: null,
};

function preferredTheme() {
  const saved = localStorage.getItem("code-explorer-theme");
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("code-explorer-theme", theme);
  els.themeIcon.textContent = theme === "dark" ? "☀" : "☾";
  els.themeButton.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} mode`);
}

function toggleTheme() {
  applyTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

function updateCodeStats() {
  const code = getCode();
  const lines = code ? code.split("\n").length : 0;
  els.codeStats.textContent = `${lines} line${lines === 1 ? "" : "s"} · ${code.length} chars`;
}

async function initializeEditor() {
  try {
    const [{ basicSetup, EditorView }, { python }] = await Promise.all([
      import("https://esm.sh/codemirror@6.0.2"),
      import("https://esm.sh/@codemirror/lang-python@6.2.1"),
    ]);

    state.editorView = new EditorView({
      doc: state.code,
      extensions: [
        basicSetup,
        python(),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            state.code = update.state.doc.toString();
            updateCodeStats();
            if (state.trace.length) clearTrace();
          }
        }),
      ],
      parent: els.editor,
    });
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.className = "fallback-editor";
    textarea.value = state.code;
    textarea.spellcheck = false;
    textarea.setAttribute("aria-label", "Python code editor");
    textarea.addEventListener("input", () => {
      state.code = textarea.value;
      updateCodeStats();
      if (state.trace.length) clearTrace();
    });
    els.editor.replaceChildren(textarea);
    state.fallbackEditor = textarea;
    showToast("The enhanced editor could not load. The basic editor is ready instead.");
  }
  updateCodeStats();
}

function getCode() {
  if (state.editorView) return state.editorView.state.doc.toString();
  if (state.fallbackEditor) return state.fallbackEditor.value;
  return state.code;
}

function setCode(code) {
  state.code = code;
  if (state.editorView) {
    state.editorView.dispatch({
      changes: { from: 0, to: state.editorView.state.doc.length, insert: code },
      selection: { anchor: 0 },
    });
  } else if (state.fallbackEditor) {
    state.fallbackEditor.value = code;
  }
  updateCodeStats();
  clearTrace();
}

function focusLine(lineNumber) {
  if (!state.editorView || !lineNumber) return;
  const safeLine = Math.max(1, Math.min(lineNumber, state.editorView.state.doc.lines));
  const line = state.editorView.state.doc.line(safeLine);
  state.editorView.dispatch({
    selection: { anchor: line.from },
    scrollIntoView: true,
  });
}

function showWorkspace() {
  els.welcomeScreen.classList.add("hidden");
  els.workspace.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  ensureWorker();
  window.setTimeout(() => state.editorView?.requestMeasure(), 50);
}

function showWelcome() {
  pausePlayback();
  els.workspace.classList.add("hidden");
  els.welcomeScreen.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setRuntimeStatus(status, label) {
  els.runtimeStatus.className = `runtime-status ${status}`;
  els.runtimeLabel.textContent = label;
}

function ensureWorker() {
  if (state.worker) return state.workerReady;

  setRuntimeStatus("loading", "Loading Python");
  state.workerReady = new Promise((resolve, reject) => {
    state.resolveWorkerReady = resolve;
    state.rejectWorkerReady = reject;
  });

  state.worker = new Worker("py-worker.js", { type: "module" });
  state.worker.addEventListener("message", handleWorkerMessage);
  state.worker.addEventListener("error", (event) => {
    const message = event.message || "Python worker failed to load.";
    state.rejectWorkerReady?.(new Error(message));
    setRuntimeStatus("error", "Runtime error");
    finishRunning();
    showError(message);
  });
  return state.workerReady;
}

function destroyWorker() {
  if (state.worker) state.worker.terminate();
  state.worker = null;
  state.workerReady = null;
  state.resolveWorkerReady = null;
  state.rejectWorkerReady = null;
  window.clearTimeout(state.runTimeout);
}

function handleWorkerMessage(event) {
  const message = event.data;
  if (message.type === "ready") {
    setRuntimeStatus("ready", "Python ready");
    state.resolveWorkerReady?.();
    return;
  }
  if (message.type === "init-error") {
    setRuntimeStatus("error", "Runtime unavailable");
    state.rejectWorkerReady?.(new Error(message.error));
    showError(`Python could not load. ${message.error}`);
    return;
  }
  if (message.runId !== state.runId) return;
  if (message.type === "result") {
    window.clearTimeout(state.runTimeout);
    finishRunning();
    loadResult(message.result);
  } else if (message.type === "run-error") {
    window.clearTimeout(state.runTimeout);
    finishRunning();
    showError(message.error);
  }
}

async function runCode() {
  const source = getCode().trimEnd();
  if (!source.trim()) {
    showToast("Add some Python code first.", true);
    return;
  }

  pausePlayback();
  state.running = true;
  state.runId += 1;
  els.runButton.disabled = true;
  els.runButton.querySelector(".button-ready").classList.add("hidden");
  els.runButton.querySelector(".button-loading").classList.remove("hidden");
  els.stopButton.classList.remove("hidden");
  setConsole("// Preparing a safe Python trace...", "muted");

  try {
    await ensureWorker();
    state.worker.postMessage({ type: "run", runId: state.runId, source });
    state.runTimeout = window.setTimeout(() => {
      stopExecution("The program ran for too long and was stopped. It may contain an infinite loop.");
    }, 8000);
  } catch (error) {
    finishRunning();
    showError(`Python could not start. ${error.message}`);
  }
}

function finishRunning() {
  state.running = false;
  els.runButton.disabled = false;
  els.runButton.querySelector(".button-ready").classList.remove("hidden");
  els.runButton.querySelector(".button-loading").classList.add("hidden");
  els.stopButton.classList.add("hidden");
}

function stopExecution(reason = "Execution stopped.") {
  state.runId += 1;
  destroyWorker();
  finishRunning();
  setRuntimeStatus("", "Runtime offline");
  showError(reason);
  showToast(reason, true);
}

function loadResult(result) {
  state.trace = result.steps || [];
  state.loops = result.loops || [];
  state.error = result.error || null;
  state.currentStep = 0;
  els.loopBadge.textContent = String(state.loops.length);

  if (!state.trace.length) {
    clearPlaybackControls();
    if (state.error) {
      showTraceError(state.error);
    } else {
      setConsole("// Program finished without executing a traceable line.", "muted");
      showToast("Nothing to trace in this program.");
    }
    return;
  }

  els.emptyStory.classList.add("hidden");
  els.traceContent.classList.remove("hidden");
  els.stepSlider.max = String(state.trace.length - 1);
  els.stepSlider.disabled = false;
  els.previousButton.disabled = false;
  els.playButton.disabled = false;
  els.nextButton.disabled = false;
  els.restartButton.disabled = false;
  renderStep();

  if (state.error) {
    showToast(`${state.error.type}: ${state.error.message}`, true);
  } else {
    showToast(`Trace ready with ${state.trace.length} steps.`);
  }
}

function clearTrace() {
  pausePlayback();
  state.trace = [];
  state.loops = [];
  state.error = null;
  state.currentStep = 0;
  els.emptyStory.classList.remove("hidden");
  els.traceContent.classList.add("hidden");
  els.emptyLoop.classList.remove("hidden");
  els.loopContent.classList.add("hidden");
  els.loopBadge.textContent = "0";
  els.stepCount.textContent = "STEP 00 / 00";
  setConsole("// Output will appear here", "muted");
  clearPlaybackControls();
}

function clearPlaybackControls() {
  els.stepSlider.min = "0";
  els.stepSlider.max = "0";
  els.stepSlider.value = "0";
  els.stepSlider.disabled = true;
  els.previousButton.disabled = true;
  els.playButton.disabled = true;
  els.nextButton.disabled = true;
  els.restartButton.disabled = true;
  els.progressPercent.textContent = "0%";
}

function variablesForStep(step) {
  const values = { ...step.globals };
  if (step.frames?.length) Object.assign(values, step.frames.at(-1).locals);
  return Object.fromEntries(
    Object.entries(values).filter(([name, value]) => {
      if (name.startsWith("__")) return false;
      return !["function", "module", "type"].includes(value?.type);
    }),
  );
}

function valueSignature(value) {
  if (!value) return "";
  return JSON.stringify({
    type: value.type,
    display: value.display,
    items: value.items,
    entries: value.entries,
  });
}

function changesAt(index) {
  const current = variablesForStep(state.trace[index]);
  const previous = index > 0 ? variablesForStep(state.trace[index - 1]) : {};
  const names = new Set([...Object.keys(previous), ...Object.keys(current)]);
  const changes = [];

  for (const name of names) {
    if (!(name in previous)) {
      changes.push({ name, kind: "created", oldValue: "not set", newValue: current[name]?.display ?? "?" });
    } else if (!(name in current)) {
      changes.push({ name, kind: "removed", oldValue: previous[name]?.display ?? "?", newValue: "removed" });
    } else if (valueSignature(previous[name]) !== valueSignature(current[name])) {
      changes.push({
        name,
        kind: "changed",
        oldValue: previous[name]?.display ?? "?",
        newValue: current[name]?.display ?? "?",
      });
    }
  }
  return changes;
}

function loopForStep(step) {
  return state.loops.find((loop) => loop.line === step.line);
}

function isLoopExitStep(step) {
  const loop = loopForStep(step);
  return Boolean(loop && step.nextLine && (step.nextLine <= loop.line || step.nextLine > loop.endLine));
}

function statementKind(source, event, step) {
  const line = source.trim();
  if (event === "exception") return "ERROR";
  if (event === "return" || /^return\b/.test(line)) return "RETURN";
  if (step && isLoopExitStep(step)) return "LOOP COMPLETE";
  if (/^for\b/.test(line)) return "FOR LOOP";
  if (/^while\b/.test(line)) return "WHILE LOOP";
  if (/^(if|elif)\b/.test(line)) return "CONDITION";
  if (/^else\s*:/.test(line)) return "ELSE BRANCH";
  if (/^def\b/.test(line)) return "FUNCTION";
  if (/^print\s*\(/.test(line)) return "OUTPUT";
  if (/^[A-Za-z_]\w*\s*(\+=|-=|\*=|\/=|\/\/=|%=)/.test(line)) return "UPDATE";
  if (/^[A-Za-z_]\w*\s*=/.test(line)) return "ASSIGNMENT";
  return "STATEMENT";
}

function explainStep(step, changes) {
  const line = step.source.trim();
  if (step.event === "exception") {
    return `Python stopped here because ${step.detail?.type || "an error"} occurred: ${step.detail?.message || "unknown error"}.`;
  }
  if (step.event === "return") {
    const value = step.detail?.display;
    if (/^return\b/.test(line)) return `The function finished and returned ${value ?? "a value"}.`;
    if (step.frames?.length > 1) return `Python finished this function step and prepared to return ${value ?? "its result"}.`;
  }
  if (isLoopExitStep(step)) return "The loop has no more iterations, so Python continued with the code below it.";
  if (/^for\s+(.+?)\s+in\s+(.+):$/.test(line)) {
    const match = line.match(/^for\s+(.+?)\s+in\s+(.+):$/);
    return `Python took the next value from ${match[2]} and stored it in ${match[1]}.`;
  }
  if (/^while\s+(.+):$/.test(line)) {
    const condition = line.match(/^while\s+(.+):$/)?.[1];
    return `Python checked whether ${condition} is true before continuing the loop.`;
  }
  if (/^(if|elif)\s+(.+):$/.test(line)) {
    const condition = line.match(/^(?:if|elif)\s+(.+):$/)?.[1];
    return `Python checked the condition ${condition} and chose which path to follow.`;
  }
  if (/^else\s*:/.test(line)) return "Python entered the alternative path because the earlier condition was false.";
  if (/^def\s+(\w+)/.test(line)) {
    const name = line.match(/^def\s+(\w+)/)?.[1];
    return `Python created the function ${name}. Its body will run when the function is called.`;
  }
  if (/^print\s*\(/.test(line)) return "Python sent this value to the program output.";
  if (/^return\b/.test(line)) return "Python sent this value back to the code that called the function.";

  if (changes.length === 1) {
    const change = changes[0];
    if (change.kind === "created") return `Python created ${change.name} and gave it the value ${change.newValue}.`;
    if (change.kind === "removed") return `Python removed the name ${change.name} from the current scope.`;
    return `Python updated ${change.name} from ${change.oldValue} to ${change.newValue}.`;
  }
  if (changes.length > 1) {
    return `Python completed this instruction and changed ${changes.map((change) => change.name).join(", ")}.`;
  }
  return "Python completed this instruction without changing a visible variable.";
}

function renderStep() {
  if (!state.trace.length) return;
  const index = Math.max(0, Math.min(state.currentStep, state.trace.length - 1));
  state.currentStep = index;
  const step = state.trace[index];
  const changes = changesAt(index);
  const percent = state.trace.length <= 1 ? 100 : Math.round((index / (state.trace.length - 1)) * 100);

  els.stepCount.textContent = `STEP ${String(index + 1).padStart(2, "0")} / ${String(state.trace.length).padStart(2, "0")}`;
  els.traceKicker.textContent = `LINE ${String(step.line).padStart(2, "0")} // ${statementKind(step.source, step.event, step)}`;
  els.executedCode.textContent = step.source.trimEnd();
  els.explanation.textContent = explainStep(step, changes);
  els.stepSlider.value = String(index);
  els.progressPercent.textContent = `${percent}%`;
  els.previousButton.disabled = index === 0;
  els.nextButton.disabled = index === state.trace.length - 1;
  els.playButton.textContent = state.playing ? "Ⅱ" : "▶";

  renderChanges(changes);
  renderVariables(variablesForStep(step));
  renderCallStack(step.frames || []);
  renderLoopLab(index);
  focusLine(step.line);

  if (step.output) {
    setConsole(step.output);
  } else if (step.event === "exception") {
    setConsole(`${step.detail?.type || "Error"}: ${step.detail?.message || "Program stopped"}`, "error");
  } else {
    setConsole("// No output yet", "muted");
  }

  if (index === state.trace.length - 1 && state.error) {
    appendConsoleError(state.error);
  }
}

function renderChanges(changes) {
  if (!changes.length) {
    els.changeList.innerHTML = '<div class="no-changes">No visible variable changed in this step.</div>';
    return;
  }
  els.changeList.replaceChildren(
    ...changes.map((change) => {
      const item = document.createElement("div");
      item.className = `change-item ${change.kind}`;
      item.innerHTML = `
        <span class="change-name"></span>
        <span class="old-value"></span>
        <span class="arrow">→</span>
        <span class="new-value"></span>`;
      item.querySelector(".change-name").textContent = change.name;
      item.querySelector(".old-value").textContent = change.oldValue;
      item.querySelector(".new-value").textContent = change.newValue;
      return item;
    }),
  );
}

function renderVariables(variables) {
  const entries = Object.entries(variables);
  if (!entries.length) {
    els.variablesGrid.innerHTML = '<div class="no-changes">No visible variables are in scope yet.</div>';
    return;
  }
  els.variablesGrid.replaceChildren(
    ...entries.map(([name, value]) => {
      const card = document.createElement("div");
      card.className = "variable-card";
      const nameNode = document.createElement("span");
      nameNode.className = "variable-name";
      nameNode.textContent = name;
      const valueNode = document.createElement("span");
      valueNode.className = "variable-value";
      valueNode.textContent = value.display;
      valueNode.title = value.display;
      const typeNode = document.createElement("span");
      typeNode.className = "variable-type";
      typeNode.textContent = value.type;
      card.append(nameNode, valueNode, typeNode);
      return card;
    }),
  );
}

function renderCallStack(frames) {
  if (!frames.length) {
    els.callStackSection.classList.add("hidden");
    return;
  }
  els.callStackSection.classList.remove("hidden");
  els.callStack.replaceChildren(
    ...frames.map((frame, index) => {
      const item = document.createElement("div");
      item.className = `stack-frame ${index === frames.length - 1 ? "active" : ""}`;
      const name = frame.name === "<module>" ? "global frame" : `${frame.name}()`;
      item.innerHTML = `<span></span><span></span>`;
      item.children[0].textContent = name;
      item.children[1].textContent = `${Object.keys(frame.locals || {}).length} local${Object.keys(frame.locals || {}).length === 1 ? "" : "s"}`;
      return item;
    }),
  );
}

function loopOccurrences(loop, throughIndex = state.trace.length - 1) {
  const occurrences = [];
  for (let index = 0; index <= throughIndex; index += 1) {
    const step = state.trace[index];
    if (step.line !== loop.line || isLoopExitStep(step)) continue;
    const variables = variablesForStep(step);
    const keyValue = loop.target ? variables[loop.target]?.display : undefined;
    occurrences.push({ index, variables, keyValue });
  }
  return occurrences;
}

function renderLoopLab(stepIndex) {
  if (!state.loops.length) {
    els.emptyLoop.classList.remove("hidden");
    els.loopContent.classList.add("hidden");
    return;
  }

  const loopsReached = state.loops.filter((loop) => loopOccurrences(loop, stepIndex).length > 0);
  const activeLoop = loopsReached.at(-1) || state.loops[0];
  const allOccurrences = loopOccurrences(activeLoop);
  const reached = loopOccurrences(activeLoop, stepIndex);
  const currentIteration = reached.length;

  els.emptyLoop.classList.add("hidden");
  els.loopContent.classList.remove("hidden");
  els.loopType.textContent = `${activeLoop.type.toUpperCase()} LOOP`;
  els.iterationCount.textContent = currentIteration
    ? `ITERATION ${String(currentIteration).padStart(2, "0")}`
    : "WAITING TO ENTER";
  els.loopSource.textContent = activeLoop.source;
  els.loopMeter.style.width = `${Math.min(100, (currentIteration / Math.max(1, allOccurrences.length)) * 100)}%`;

  els.iterationList.replaceChildren(
    ...allOccurrences.slice(0, 40).map((occurrence, index) => {
      const item = document.createElement("div");
      const isReached = occurrence.index <= stepIndex;
      const isCurrent = index === reached.length - 1;
      item.className = `iteration-item ${isCurrent ? "current" : ""}`;
      const summary = activeLoop.target && occurrence.keyValue !== undefined
        ? `${activeLoop.target} = ${occurrence.keyValue}`
        : activeLoop.condition
          ? `check: ${activeLoop.condition}`
          : "loop check";
      item.innerHTML = `
        <span class="iteration-number"></span>
        <span class="iteration-summary"></span>
        <span class="iteration-values"></span>`;
      item.querySelector(".iteration-number").textContent = isReached ? (isCurrent ? "●" : "✓") : String(index + 1);
      item.querySelector(".iteration-summary").textContent = `Iteration ${index + 1}`;
      item.querySelector(".iteration-values").textContent = isReached ? summary : "waiting";
      return item;
    }),
  );
}

function goToStep(index) {
  pausePlayback();
  state.currentStep = Number(index);
  renderStep();
}

function previousStep() {
  if (state.currentStep > 0) goToStep(state.currentStep - 1);
}

function nextStep() {
  if (state.currentStep < state.trace.length - 1) goToStep(state.currentStep + 1);
}

function togglePlayback() {
  if (state.playing) {
    pausePlayback();
    return;
  }
  if (!state.trace.length) return;
  if (state.currentStep >= state.trace.length - 1) state.currentStep = 0;
  state.playing = true;
  els.playButton.textContent = "Ⅱ";
  scheduleNextStep();
}

function scheduleNextStep() {
  window.clearTimeout(state.playTimer);
  state.playTimer = window.setTimeout(() => {
    if (!state.playing) return;
    if (state.currentStep >= state.trace.length - 1) {
      pausePlayback();
      return;
    }
    state.currentStep += 1;
    renderStep();
    scheduleNextStep();
  }, Number(els.speedSelect.value));
}

function pausePlayback() {
  state.playing = false;
  window.clearTimeout(state.playTimer);
  if (els.playButton) els.playButton.textContent = "▶";
}

function restartTrace() {
  goToStep(0);
}

function switchPanel(panel) {
  state.activePanel = panel;
  const storyActive = panel === "story";
  els.storyTab.classList.toggle("active", storyActive);
  els.loopTab.classList.toggle("active", !storyActive);
  els.storyTab.setAttribute("aria-selected", String(storyActive));
  els.loopTab.setAttribute("aria-selected", String(!storyActive));
  els.storyView.classList.toggle("hidden", !storyActive);
  els.loopView.classList.toggle("hidden", storyActive);
}

function setConsole(text, kind = "normal") {
  els.consoleOutput.replaceChildren();
  const span = document.createElement("span");
  span.textContent = text;
  if (kind === "muted") span.className = "console-muted";
  if (kind === "error") span.className = "console-error";
  els.consoleOutput.append(span);
}

function appendConsoleError(error) {
  const separator = els.consoleOutput.textContent?.trim() ? "\n\n" : "";
  const span = document.createElement("span");
  span.className = "console-error";
  const location = error.line ? ` at line ${error.line}` : "";
  span.textContent = `${separator}${error.type}${location}: ${error.message}`;
  els.consoleOutput.append(span);
}

function showTraceError(error) {
  const location = error.line ? `Line ${error.line}\n` : "";
  setConsole(`${location}${error.type}: ${error.message}`, "error");
  if (error.line) focusLine(error.line);
  showToast(`${error.type}: ${error.message}`, true);
}

function showError(message) {
  setConsole(message, "error");
}

function showToast(message, isError = false) {
  window.clearTimeout(state.toastTimer);
  els.toast.textContent = message;
  els.toast.classList.toggle("error", isError);
  els.toast.classList.add("visible");
  state.toastTimer = window.setTimeout(() => els.toast.classList.remove("visible"), 4000);
}

function renderExamples() {
  els.exampleGrid.replaceChildren(
    ...EXAMPLES.map((example) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "example-card";
      button.innerHTML = `
        <span class="example-topic"></span>
        <h3></h3>
        <p></p>`;
      button.querySelector(".example-topic").textContent = example.topic;
      button.querySelector("h3").textContent = example.title;
      button.querySelector("p").textContent = example.description;
      button.addEventListener("click", () => {
        setCode(example.code);
        els.examplesDialog.close();
        showWorkspace();
        showToast(`${example.title} loaded. Press Run trace when you are ready.`);
      });
      return button;
    }),
  );
}

function openExamples() {
  if (!els.examplesDialog.open) els.examplesDialog.showModal();
}

function bindEvents() {
  els.themeButton.addEventListener("click", toggleTheme);
  els.startButton.addEventListener("click", showWorkspace);
  els.heroExampleButton.addEventListener("click", openExamples);
  els.backButton.addEventListener("click", showWelcome);
  els.examplesButton.addEventListener("click", openExamples);
  els.closeExamplesButton.addEventListener("click", () => els.examplesDialog.close());
  els.examplesDialog.addEventListener("click", (event) => {
    if (event.target === els.examplesDialog) els.examplesDialog.close();
  });
  els.runButton.addEventListener("click", runCode);
  els.stopButton.addEventListener("click", () => stopExecution("Execution stopped by you."));
  els.storyTab.addEventListener("click", () => switchPanel("story"));
  els.loopTab.addEventListener("click", () => switchPanel("loop"));
  els.previousButton.addEventListener("click", previousStep);
  els.nextButton.addEventListener("click", nextStep);
  els.playButton.addEventListener("click", togglePlayback);
  els.restartButton.addEventListener("click", restartTrace);
  els.stepSlider.addEventListener("input", (event) => goToStep(event.target.value));
  els.speedSelect.addEventListener("change", () => {
    if (state.playing) scheduleNextStep();
  });
  els.clearOutputButton.addEventListener("click", () => setConsole("// Output cleared", "muted"));
  window.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      if (!els.workspace.classList.contains("hidden") && !state.running) runCode();
    }
  });
}

async function initialize() {
  applyTheme(preferredTheme());
  renderExamples();
  bindEvents();
  await initializeEditor();
}

initialize();
