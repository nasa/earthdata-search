import { getVariables } from '../getVariables'
import { variablesResponse, mockKeywordMappings, mockVariables } from './mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getVariables', () => {
  test('correctly formats variables from graphql', () => {
    const { keywordMappings, variables } = getVariables(variablesResponse)

    expect(keywordMappings).toEqual(mockKeywordMappings)
    expect(variables).toEqual(mockVariables)
  })
})
