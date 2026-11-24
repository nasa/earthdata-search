import { computeKeywordMappings } from '../computeKeywordMappings'
import { mockHarmonyKeywordMappings, harmonyVariablesResponse } from './mocks'

describe('computeKeywordMappings', () => {
  describe('when computing harmony variables', () => {
    test('correctly returns mapped keywords', () => {
      const { items } = harmonyVariablesResponse
      const keywordMappings = computeKeywordMappings(items)

      expect(keywordMappings).toEqual(mockHarmonyKeywordMappings)
    })

    test('correctly returns mapped keywords when no science keywords exist', () => {
      const emptyKeywordResponse = [
        {
          name: 'Dust_Score_A',
          href: 'https://cmr.example.com/search/concepts/V1200279034-E2E_18_4',
          scienceKeywords: []
        }
      ]

      const keywordMappings = computeKeywordMappings(emptyKeywordResponse)

      expect(keywordMappings).toEqual([])
    })
  })
})
