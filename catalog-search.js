/**
 * Shared local catalog-search helpers for Code Explorer.
 *
 * Both learning workspaces keep reviewed program records in browser memory.
 * These helpers flatten those existing records into normalized search text.
 * They never save a query, contact a server, modify a curriculum record, or
 * inspect learner activity outside the current search field.
 */

/**
 * Converts one search value into lowercase, punctuation-tolerant words.
 *
 * Unicode normalization keeps accented text searchable by its base letters.
 * Replacing punctuation with spaces lets equivalent queries such as `O(n)` and
 * `o n` reach the same reviewed complexity metadata.
 *
 * @param {unknown} value Search query or reviewed metadata value.
 * @returns {string} Normalized words separated by single spaces.
 */
export function normalizeCatalogSearch(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Collects searchable primitive values from one reviewed program record.
 *
 * Arrays and nested metadata objects are supported so DSA complexity, phases,
 * invariants, edge cases, and similar fields remain discoverable. A WeakSet
 * prevents an accidental cyclic object from trapping the browser in recursion.
 *
 * @param {unknown} value Current metadata value being inspected.
 * @param {string[]} output Primitive values collected for normalization.
 * @param {WeakSet<object>} visited Objects already inspected in this traversal.
 * @returns {void}
 */
function collectCatalogValues(value, output, visited) {
  if (value === null || value === undefined) return;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    output.push(String(value));
    return;
  }
  if (typeof value !== "object" || visited.has(value)) return;
  visited.add(value);
  if (Array.isArray(value)) {
    value.forEach((item) => collectCatalogValues(item, output, visited));
    return;
  }
  Object.values(value).forEach((item) => collectCatalogValues(item, output, visited));
}

/**
 * Builds one reusable normalized text index for a reviewed program record.
 *
 * @param {object} program Immutable Python or DSA curriculum record.
 * @returns {string} Complete normalized metadata and source text.
 */
export function catalogSearchText(program) {
  const values = [];
  collectCatalogValues(program, values, new WeakSet());
  return normalizeCatalogSearch(values.join(" "));
}

/**
 * Tests a prepared search index against every word in the learner's query.
 *
 * Using AND behavior makes multi-word searches useful for narrowing a large
 * catalog. For example, `binary guided` requires both ideas to be present
 * somewhere in the same reviewed record. An empty query matches every record.
 *
 * @param {string} preparedText Normalized program index from catalogSearchText.
 * @param {string} query Current unsaved search-field value.
 * @returns {boolean} Whether every normalized query word appears in the record.
 */
export function matchesCatalogSearch(preparedText, query) {
  const terms = normalizeCatalogSearch(query).split(" ").filter(Boolean);
  return terms.every((term) => preparedText.includes(term));
}
