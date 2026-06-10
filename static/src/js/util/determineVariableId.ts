import { HarmonyVariable } from './getDerivedHarmonyState/getDerivedHarmonyState'

import { VariableMetadata } from '../types/sharedTypes'

/**
 * Determines the variable ID from a variable object.
 * The input can be a standard UMM-S variable or a Harmony variable.
 * Prefers the conceptId, but will fall back to parsing the href for Harmony variables.
 * @param {VariableMetadata | HarmonyVariable} variable - The variable object.
 * @returns {string | undefined} The determined variable ID, or undefined if not found.
 */
export const determineVariableId = (
  variable: VariableMetadata | HarmonyVariable
): string | undefined => {
  let variableId
  // Use a type guard to check for 'conceptId'.
  // The `variable.conceptId` check ensures we don't return an empty string.
  if ('conceptId' in variable && variable.conceptId) {
    variableId = variable.conceptId
  }

  // Use a type guard to check for 'href'. This is the fallback for Harmony variables.
  if ('href' in variable && variable.href) {
    variableId = variable.href.split('/').pop()
  }

  return variableId
}
