/**
 * Lightweight landing-page controller.
 *
 * The landing page now chooses between two learning paths and no longer owns a
 * program catalog. It therefore loads only shared theme behavior instead of the
 * much larger Python workspace application and its 134-example curriculum.
 */

import { applyTheme, preferredTheme, toggleTheme } from "./shared-ui.js?v=20260723-2";

/** Theme controls are optional so semantic navigation still works if markup changes. */
const themeButton = document.getElementById("themeButton");
const themeLabel = document.getElementById("themeLabel");
const themeControls = { button: themeButton, label: themeLabel };

// Apply colors synchronously during module startup to minimize a wrong-theme flash.
applyTheme(preferredTheme(), themeControls);

// A named button and shared controller keep theme behavior identical across pages.
themeButton?.addEventListener("click", () => toggleTheme(themeControls));
