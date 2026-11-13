// ASCII control characters other than tab, line feed and carriage return. Postgres rejects
// null bytes in text columns, and the rest have no legitimate use in free text.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

// Unicode bidirectional override and isolate characters. These can make text render in a
// different order than it is stored ("Trojan Source"), which could mislead admins reading it.
const BIDI_CONTROL_CHARACTERS = /[\u202A-\u202E\u2066-\u2069]/g

/**
 * Normalizes user-submitted free text before it is stored. Strips characters that are invalid
 * or deceptive, normalizes line endings and trims surrounding whitespace.
 *
 * This is not HTML escaping. Text is stored as entered and must be escaped when rendered
 * (React does this automatically for text content).
 * @param {String} text The text to sanitize
 * @returns {String|null} The sanitized text, or null when nothing meaningful remains
 */
const sanitizeUserText = (text) => {
  if (text == null) return null

  const sanitized = String(text)
    .normalize('NFC')
    .replace(/\r\n?/g, '\n')
    .replace(CONTROL_CHARACTERS, '')
    .replace(BIDI_CONTROL_CHARACTERS, '')
    .trim()

  return sanitized.length > 0 ? sanitized : null
}

export default sanitizeUserText
