/**
 * Reusable Python editor foundation for Code Explorer workspaces.
 *
 * The existing execution workspace has trace-specific CodeMirror extensions.
 * This smaller controller supplies the common source, wrapping, sizing, and
 * fallback behavior needed by the DSA foundation without pretending that
 * execution decorations or automatic comments already exist there.
 */

/** Pinned CodeMirror dependency URLs audited and already used by Code Explorer. */
const CODEMIRROR_MODULES = Object.freeze({
  editor: "https://esm.sh/codemirror@6.0.2?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.6,@codemirror/language@6.12.4,@lezer/highlight@1.2.3",
  python: "https://esm.sh/@codemirror/lang-python@6.2.1?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.6,@codemirror/language@6.12.4,@lezer/highlight@1.2.3",
  language: "https://esm.sh/@codemirror/language@6.12.4?deps=@codemirror/state@6.7.1,@codemirror/view@6.43.6,@lezer/highlight@1.2.3",
  highlight: "https://esm.sh/@lezer/highlight@1.2.3",
  state: "https://esm.sh/@codemirror/state@6.7.1",
});

/** Font sizes exposed by both workspace toolbars. */
export const EDITOR_FONT_SIZES = Object.freeze([12, 14, 16, 18, 20, 22]);

/**
 * Creates a CodeMirror Python editor with a native textarea fallback.
 * @param {{
 *   mount: HTMLElement,
 *   shell: HTMLElement,
 *   initialCode: string,
 *   preferences: {wrap: boolean, fontSize: number},
 *   onChange: (code: string) => void,
 *   onFallback?: (error: unknown) => void
 * }} options Required DOM, source, preference, and callback values.
 * @returns {Promise<{
 *   getCode: () => string,
 *   setCode: (code: string) => void,
 *   focus: () => void,
 *   applyPreferences: (preferences: {wrap: boolean, fontSize: number}) => void,
 *   enhanced: boolean
 * }>} Stable editor API independent from the mounted implementation.
 */
export async function createPythonEditor(options) {
  const { mount, shell, initialCode, onChange, onFallback = () => {} } = options;
  let code = initialCode;
  let editorView = null;
  let fallbackEditor = null;
  let editorConfiguration = null;

  /**
   * Applies validated display preferences without changing Python source.
   * @param {{wrap: boolean, fontSize: number}} preferences Current presentation choices.
   */
  function applyPreferences(preferences) {
    const safeFontSize = EDITOR_FONT_SIZES.includes(Number(preferences.fontSize))
      ? Number(preferences.fontSize)
      : 14;
    shell.style.setProperty("--editor-font-size", `${safeFontSize}px`);

    if (fallbackEditor) {
      fallbackEditor.wrap = preferences.wrap ? "soft" : "off";
      fallbackEditor.classList.toggle("wrap-disabled", !preferences.wrap);
    }

    if (editorView && editorConfiguration) {
      editorView.dispatch({
        effects: editorConfiguration.wrapCompartment.reconfigure(
          preferences.wrap ? editorConfiguration.lineWrapping : [],
        ),
      });
      editorView.requestMeasure();
    }
  }

  try {
    // CodeMirror packages share exact state and highlighting versions so token
    // identity remains stable across independently delivered ES modules.
    const [
      { basicSetup, EditorView },
      { python },
      { syntaxHighlighting },
      { classHighlighter },
      { Compartment },
    ] = await Promise.all([
      import(CODEMIRROR_MODULES.editor),
      import(CODEMIRROR_MODULES.python),
      import(CODEMIRROR_MODULES.language),
      import(CODEMIRROR_MODULES.highlight),
      import(CODEMIRROR_MODULES.state),
    ]);

    // A compartment changes wrapping without rebuilding the document or losing selection.
    const wrapCompartment = new Compartment();
    editorConfiguration = { wrapCompartment, lineWrapping: EditorView.lineWrapping };

    editorView = new EditorView({
      doc: code,
      extensions: [
        basicSetup,
        python(),
        syntaxHighlighting(classHighlighter),
        wrapCompartment.of(options.preferences.wrap ? EditorView.lineWrapping : []),
        EditorView.updateListener.of((update) => {
          if (!update.docChanged) return;
          code = update.state.doc.toString();
          onChange(code);
        }),
      ],
      parent: mount,
    });
  } catch (error) {
    // A basic editor preserves all source editing when the optional CDN modules fail.
    console.error("Code Explorer enhanced editor initialization failed.", error);
    fallbackEditor = document.createElement("textarea");
    fallbackEditor.className = "fallback-editor";
    fallbackEditor.value = code;
    fallbackEditor.spellcheck = false;
    fallbackEditor.setAttribute("aria-label", "Python code editor");
    fallbackEditor.addEventListener("input", () => {
      code = fallbackEditor.value;
      onChange(code);
    });
    mount.replaceChildren(fallbackEditor);
    onFallback(error);
  }

  applyPreferences(options.preferences);

  return {
    /** @returns {string} Complete current source from the active editor. */
    getCode: () => editorView?.state.doc.toString() ?? fallbackEditor?.value ?? code,

    /**
     * Replaces the complete document after an explicit caller-owned action.
     * @param {string} nextCode Complete Python source to display.
     */
    setCode: (nextCode) => {
      code = nextCode;
      if (editorView) {
        editorView.dispatch({
          changes: { from: 0, to: editorView.state.doc.length, insert: nextCode },
          selection: { anchor: 0 },
        });
      } else if (fallbackEditor) {
        fallbackEditor.value = nextCode;
        onChange(nextCode);
      } else {
        onChange(nextCode);
      }
    },

    /** Returns keyboard focus to the active editing surface. */
    focus: () => {
      if (editorView) editorView.focus();
      else fallbackEditor?.focus();
    },

    applyPreferences,
    enhanced: Boolean(editorView),
  };
}
