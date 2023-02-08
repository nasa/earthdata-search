import { getVariables } from '../getVariables'
import { variablesResponse, mockKeywordMappings, mockVariables } from './mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getVariables', () => {
  describe('when variables exist', () => {
    test('correctly formats variables from graphql', () => {
      const { keywordMappings, variables } = getVariables(variablesResponse)

      expect(keywordMappings).toEqual(mockKeywordMappings)
      expect(variables).toEqual(mockVariables)
    })
  })

  describe('when no variables exist', () => {
    test('correctly formats variables from graphql', () => {
      const { keywordMappings, variables } = getVariables({ count: 0, items: null })

      expect(keywordMappings).toEqual([])
      expect(variables).toEqual({})
    })
  })
})
