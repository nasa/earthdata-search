import { HarmonyScienceKeyword } from './getDerivedHarmonyState/getDerivedHarmonyState'

/**
 * Represents the shape of a variable object from a UMM-S record.
 */
interface UmmSVariable {
  /** Concept Id of the variable */
  conceptId?: string
  /** Definition of the variable */
  definition: string
  /** Instance Information of the variable (if applicable) */
  instanceInformation: null
  /** Long Name of the variable */
  longName: string
  /** Name of the variable */
  name: string
  /** Native Id of the variable */
  nativeId: string
  /** Science Keywords of the variable */
  scienceKeywords: HarmonyScienceKeyword[]
}

/**
 * Represents the shape of a variable object from a Harmony capabilities document.
 */
interface HarmonyVariable {
  /** Name of the variable */
  name: string
  /** CMR url of the variable */
  href: string
  /** Science Keywords of the variable */
  scienceKeywords: HarmonyScienceKeyword[]
}

/**
 * Determines the variable ID from a variable object.
 * The input can be a standard UMM-S variable or a Harmony variable.
 * Prefers the conceptId, but will fall back to parsing the href for Harmony variables.
 * @param {UmmSVariable | HarmonyVariable} variable - The variable object.
 * @returns {string | undefined} The determined variable ID, or undefined if not found.
 */
export const determineVariableId = (
  variable: UmmSVariable | HarmonyVariable
): string | undefined => {
  // Use a type guard to check for 'conceptId'.
  // The `variable.conceptId` check ensures we don't return an empty string.
  if ('conceptId' in variable && variable.conceptId) {
    return variable.conceptId
  }

  // Use a type guard to check for 'href'. This is the fallback for Harmony variables.
  if ('href' in variable && variable.href) {
    return variable.href.split('/').pop()
  }

  return undefined
}
