/* @ts-expect-error This file does not have types */
import { computeKeywordMappings } from './computeKeywordMappings'
/* @ts-expect-error This file does not have types */
import { computeHierarchyMappings } from './computeHierarchyMappings'
import { determineVariableId } from '../determineVariableId'
import { HarmonyVariable } from '../getDerivedHarmonyState/getDerivedHarmonyState'
import { UmmSVariable } from '../../types/sharedTypes'
import { HierarchyMapping, KeywordMapping } from '../../zustand/types'

/**
 * Response from CMR with the ummSVariable array in it.
 */
export interface CmrVariableResponse {
  count?: number;
  items?: UmmSVariable[]
}

export interface VariablesResult {
  hierarchyMappings: HierarchyMapping[]
  keywordMappings: KeywordMapping[]
  variables: Record<string, HarmonyVariable | UmmSVariable>
}

/**
 * Given the items result from a CMR variable search, returns the variables in an object with the key being the concept id
 * and the value being the variable metadata
 * @param items - Items array from a CMR variable search result
 * @returns Object mapping concept IDs to variable metadata
 */
const computeVariables = (
  items: HarmonyVariable[] | UmmSVariable[]
): Record<string, HarmonyVariable | UmmSVariable> => {
  const variables: Record<string, HarmonyVariable | UmmSVariable> = {}

  items.forEach((variable: HarmonyVariable | UmmSVariable) => {
    const variableId = determineVariableId(variable)

    if (!variableId) return

    variables[variableId] = variable
  })

  return variables
}

/**
 * Processes variable data from CMR into a consistent format.
 * This function can handle both the object structure from a CMR search (`{ count, items }`)
 * and a direct array of variable items.
 * @param data - Variable object response from CMR or an array of variables from the harmony capabilities document.
 * @returns An object containing the computed mappings and variables.
 */
export const getVariables = (
  data: HarmonyVariable[] | CmrVariableResponse
): VariablesResult => {
  // Determine the source of the variable items, defaulting to an empty array.
  const variableItems: HarmonyVariable[] | UmmSVariable[] = (
    Array.isArray(data) ? data : (data as CmrVariableResponse).items
  ) || []

  const hierarchyMappings = computeHierarchyMappings(variableItems)
  const keywordMappings = computeKeywordMappings(variableItems)
  const variables = computeVariables(variableItems)

  return {
    hierarchyMappings,
    keywordMappings,
    variables
  }
}
