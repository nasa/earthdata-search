/**
 * Returns a pluralized string if a value is greater than zero. It will return a pluralized value for zero as well.
 * @param {string} string The string to pluralize.
 * @param {number} value The number to use for pluralization.
 * @returns {string} A pluralized string.
 */
export const pluralize = (string, value) => {
  if (typeof value !== 'number') return `${string}`
  if (value > 1 || value === 0) {
    return `${string}s`
  }
  return `${string}`
}

export default pluralize
