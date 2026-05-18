import { getOpendapVariables, getHarmonyVariables } from '../getVariables'
import {
  opendapVariablesResponse,
  mockOpendapKeywordMappings,
  mockOpendapVariables,
  harmonyVariablesResponse,
  mockHarmonyKeywordMappings,
  mockHarmonyVariables
} from './mocks'

describe('getOpendapVariables', () => {
  describe('when variables exist', () => {
    test('correctly formats variables from graphql', () => {
      const { keywordMappings, variables } = getOpendapVariables(opendapVariablesResponse)

      expect(keywordMappings).toEqual(mockOpendapKeywordMappings)
      expect(variables).toEqual(mockOpendapVariables)
    })
  })

  describe('when no variables exist', () => {
    test('correctly formats variables from graphql', () => {
      const { keywordMappings, variables } = getOpendapVariables({
        count: 0,
        items: null
      })

      expect(keywordMappings).toEqual([])
      expect(variables).toEqual({})
    })
  })
})

describe('getHarmonyVariables', () => {
  describe('when variables exist', () => {
    test('correctly formats variables from the capabilities document', () => {
      // Harmony variables come as an array, not an object with `items`
      const { keywordMappings, variables } = getHarmonyVariables(harmonyVariablesResponse.items)

      expect(keywordMappings).toEqual(mockHarmonyKeywordMappings)
      expect(variables).toEqual(mockHarmonyVariables)
    })
  })

  describe('when no variables exist', () => {
    test('correctly returns empty data structures', () => {
      const { keywordMappings, variables } = getHarmonyVariables([])

      expect(keywordMappings).toEqual([])
      expect(variables).toEqual({})
    })
  })
})
