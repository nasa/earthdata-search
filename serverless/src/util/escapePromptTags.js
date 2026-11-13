/**
 * Neutralizes any opening or closing `tagName` tags in untrusted text before it is placed
 * inside `<tagName>...</tagName>` in an LLM prompt. Without this, the text could close the
 * data block early and add its own instructions after it.
 *
 * Matching is case-insensitive and tolerates whitespace and attributes (e.g. `</ Query >`).
 * @param {String} text The untrusted text
 * @param {String} tagName The tag the text will be wrapped in, e.g. `query`
 * @returns {String} The text with any `tagName` tags escaped
 */
export const escapePromptTags = (text, tagName) => {
  const tagPattern = new RegExp(`<\\s*(\\/?)\\s*${tagName}\\b[^>]*>`, 'gi')

  return String(text).replace(tagPattern, `&lt;$1${tagName}&gt;`)
}
