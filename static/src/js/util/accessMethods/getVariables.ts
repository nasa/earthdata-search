/* @ts-expect-error This file does not have types */
import { computeKeywordMappings } from './computeKeywordMappings'
/* @ts-expect-error This file does not have types */
import { computeHierarchyMappings } from './computeHierarchyMappings'
import { determineVariableId } from '../determineVariableId'
import { HarmonyVariable } from '../getDerivedHarmonyState/getDerivedHarmonyState'
import { VariableMetadata } from '../../types/sharedTypes'
import { HierarchyMapping, KeywordMapping } from '../../zustand/types'

/** Response from CMR with the VariableMetadata array in it. */
export interface CmrVariableResponse {
  /** Number of variable items */
  count: number;
  /** Associated variables array */
  items: VariableMetadata[]
}

/** Response object from this function */
export interface VariablesResult {
  /** Nested heierarchy structure of variables */
  hierarchyMappings: HierarchyMapping[]
  /** Keyword mapping structure of variables */
  keywordMappings: KeywordMapping[]
  /** Object containing variables keyed by their concept Id */
  variables: Record<string, HarmonyVariable | VariableMetadata>
}

/**
 * Given the items result from a CMR variable search, returns the variables in an object with the key being the concept id
 * and the value being the variable metadata
 * @param items - Items array from a CMR variable search result
 * @returns Object mapping concept IDs to variable metadata
 */
const computeVariables = (
  items: HarmonyVariable[] | VariableMetadata[]
): Record<string, HarmonyVariable | VariableMetadata> => {
  const variables: Record<string, HarmonyVariable | VariableMetadata> = {}

  items.forEach((variable: HarmonyVariable | VariableMetadata) => {
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
  const variableItems: HarmonyVariable[] | VariableMetadata[] = (
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
