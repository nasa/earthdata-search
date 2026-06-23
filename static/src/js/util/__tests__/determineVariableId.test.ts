import { VariableMetadata } from '../../types/sharedTypes'
import { determineVariableId } from '../determineVariableId'
import { HarmonyVariable } from '../getDerivedHarmonyState/getDerivedHarmonyState'

describe('determineVariableId', () => {
  test('returns conceptId when it exists (UMM-S variable)', () => {
    const variableMetadata: VariableMetadata = {
      conceptId: 'V123-CMR',
      definition: 'A variable for testing',
      instanceInformation: null,
      longName: 'Test Variable',
      name: 'test_variable',
      nativeId: 'test-var-1',
      scienceKeywords: []
    }
    const result = determineVariableId(variableMetadata)
    expect(result).toEqual('V123-CMR')
  })

  test('returns the ID from href when conceptId is missing (Harmony variable)', () => {
    const harmonyVariable: HarmonyVariable = {
      name: 'A harmony variable',
      href: 'https://cmr.example.com/search/concepts/V456-HARMONY',
      scienceKeywords: [],
      longName: '',
      units: ''
    }
    const result = determineVariableId(harmonyVariable)
    expect(result).toEqual('V456-HARMONY')
  })

  test('returns undefined when no variable information is blank from harmony', () => {
    const harmonyVariable: HarmonyVariable = {
      name: '',
      href: '',
      scienceKeywords: [],
      longName: '',
      units: ''
    }
    const result = determineVariableId(harmonyVariable)
    expect(result).toEqual(undefined)
  })
})
