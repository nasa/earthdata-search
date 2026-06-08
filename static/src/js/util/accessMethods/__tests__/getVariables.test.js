import { getVariables } from '../getVariables'
import {
  opendapVariablesResponse,
  mockOpendapKeywordMappings,
  mockOpendapVariables,
  harmonyVariablesResponse,
  mockHarmonyKeywordMappings,
  mockHarmonyVariables
} from './mocks'

describe('getVariables (OPENDaP)', () => {
  describe('when variables exist', () => {
    test('correctly formats variables from graphql', () => {
      const { keywordMappings, variables } = getVariables(opendapVariablesResponse)

      expect(keywordMappings).toEqual(mockOpendapKeywordMappings)
      expect(variables).toEqual(mockOpendapVariables)
    })
  })

  describe('when no variables exist', () => {
    test('correctly formats variables from graphql', () => {
      const { keywordMappings, variables } = getVariables({
        count: 0,
        items: null
      })

      expect(keywordMappings).toEqual([])
      expect(variables).toEqual({})
    })
  })
})

describe('getVariables (Harmony)', () => {
  describe('when variables exist', () => {
    test('correctly formats variables from the capabilities document', () => {
      // Harmony variables come as an array, not an object with `items`
      const { keywordMappings, variables } = getVariables(harmonyVariablesResponse.items)

      expect(keywordMappings).toEqual(mockHarmonyKeywordMappings)
      expect(variables).toEqual(mockHarmonyVariables)
    })
  })

  describe('when no variables exist', () => {
    test('correctly returns empty data structures', () => {
      const { keywordMappings, variables } = getVariables([])

      expect(keywordMappings).toEqual([])
      expect(variables).toEqual({})
    })
  })
})
