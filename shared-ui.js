/**
 * Shared browser-interface helpers used by more than one Code Explorer page.
 *
 * This module intentionally contains only behavior that is independent from a
 * Python trace or DSA event stream. Keeping theme behavior here gives the
 * landing page and both workspaces one storage contract without coupling their
 * larger application controllers.
 */

/** Stable same-origin storage key for the learner's explicit theme choice. */
export const THEME_STORAGE_KEY = "code-explorer-theme";

/**
 * Reads a local-storage value without allowing a restricted browser mode to
 * prevent the page from starting.
 * @param {string} key Storage key owned by Code Explorer.
 * @returns {string|null} Stored text, or null when storage is unavailable.
 */
export function readLocalText(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`Code Explorer could not read local setting "${key}".`, error);
    return null;
  }
}

/**
 * Saves a local-storage value while keeping a full or restricted storage area
 * non-fatal for the visible workspace.
 * @param {string} key Storage key owned by Code Explorer.
 * @param {string} value Complete text value to save locally.
 * @returns {boolean} Whether the browser accepted the value.
 */
export function writeLocalText(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`Code Explorer could not save local setting "${key}".`, error);
    return false;
  }
}

/**
 * Chooses the startup theme from a valid saved preference or the operating
 * system preference. No theme information leaves the browser.
 * @returns {"light"|"dark"} Valid theme name for the root data attribute.
 */
export function preferredTheme() {
  const saved = readLocalText(THEME_STORAGE_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

/**
 * Applies one supported theme and synchronizes the visible and accessible
 * labels of its optional control.
 * @param {"light"|"dark"} theme Theme that should become active.
 * @param {{button?: HTMLElement|null, label?: HTMLElement|null}} controls Optional theme controls.
 */
export function applyTheme(theme, controls = {}) {
  const safeTheme = theme === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = safeTheme;
  writeLocalText(THEME_STORAGE_KEY, safeTheme);

  // The button names the available action instead of repeating the active state.
  const nextThemeLabel = safeTheme === "dark" ? "Light mode" : "Dark mode";
  if (controls.label) controls.label.textContent = nextThemeLabel;
  controls.button?.setAttribute("aria-label", `Switch to ${nextThemeLabel.toLowerCase()}`);
}

/**
 * Switches the current document theme and returns the newly active value so a
 * workspace can refresh theme-sensitive visualizations if necessary.
 * @param {{button?: HTMLElement|null, label?: HTMLElement|null}} controls Optional theme controls.
 * @returns {"light"|"dark"} Newly active theme.
 */
export function toggleTheme(controls = {}) {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme, controls);
  return nextTheme;
}
