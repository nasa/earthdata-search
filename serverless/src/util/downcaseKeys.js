/**
 * Downcase all keys of an object
 * @param {*} obj Object to transform
 * @returns Object with all keys downcased
 */
export const downcaseKeys = (obj = {}) => {
  const entries = Object.entries(obj)

  return Object.fromEntries(
    entries.map(([key, value]) => [key.toLowerCase(), value])
  )
}
