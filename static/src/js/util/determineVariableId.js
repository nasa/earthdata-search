/**
 * Determines the variable ID from a variable object.
 * Prefers the conceptId, but will fall back to parsing the href for Harmony variables.
 * @param {Object} variable - The variable object, which may contain conceptId if it's coming from cmr or an href if its coming from harmony.
 * @returns {string|undefined} The determined variable ID, or undefined if not found.
 */
export const determineVariableId = (variable) => {
  if (!variable) return undefined

  const { conceptId, href } = variable

  // Some variables have a conceptId, which is preferred.
  if (conceptId) {
    return conceptId
  }

  // Fallback for Harmony variables which may not have a conceptId.
  if (href) {
    return href.split('/').pop()
  }

  return undefined
}
