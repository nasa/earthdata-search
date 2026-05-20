import { determineVariableId } from '../determineVariableId'

describe('determineVariableId', () => {
  test('returns conceptId when it exists (UMM-S variable)', () => {
    const ummsVariable = {
      conceptId: 'V123-CMR',
      definition: 'A variable for testing',
      instanceInformation: null,
      longName: 'Test Variable',
      name: 'test_variable',
      nativeId: 'test-var-1',
      scienceKeywords: []
    }
    const result = determineVariableId(ummsVariable)
    expect(result).toEqual('V123-CMR')
  })

  test('returns the ID from href when conceptId is missing (Harmony variable)', () => {
    const harmonyVariable = {
      name: 'A harmony variable',
      href: 'https://cmr.example.com/search/concepts/V456-HARMONY',
      scienceKeywords: []
    }
    const result = determineVariableId(harmonyVariable)
    expect(result).toEqual('V456-HARMONY')
  })
})
