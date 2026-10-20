import { mockClient } from 'aws-sdk-client-mock'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { clearShortNameCache, shortNameSearch } from '../shortNameSearch'

const s3ClientMock = mockClient(S3Client)

const shortNames = [
  {
    shortName: 'USGS_P-11_cells',
    isActive: true,
    hasGranules: true,
    version: '1'
  },
  {
    shortName: 'USGS_P-11_cells',
    isActive: true,
    hasGranules: true,
    version: '2'
  },
  {
    shortName: 'ATL03',
    isActive: false,
    hasGranules: true,
    version: '006'
  },
  {
    shortName: 'ATL03',
    isActive: true,
    hasGranules: true,
    version: '007'
  },
  {
    shortName: 'ATL03',
    isActive: false,
    hasGranules: false,
    version: '004'
  },
  {
    shortName: 'ATL06',
    isActive: true,
    hasGranules: true,
    version: '006'
  },
  {
    shortName: 'MOD11A1',
    isActive: true,
    hasGranules: true,
    version: '006.01'
  },
  {
    shortName: 'INACTIVE01',
    version: '1',
    isActive: false,
    hasGranules: true
  },
  {
    shortName: 'INACTIVE01',
    version: '2',
    isActive: true,
    hasGranules: false
  },
  {
    shortName: 'ALLINACTIVE01',
    version: '1',
    isActive: false,
    hasGranules: true
  },
  {
    shortName: 'ALLINACTIVE01',
    version: '2',
    isActive: false,
    hasGranules: true
  },
  {
    shortName: 'GRAN01',
    version: '1',
    isActive: true,
    hasGranules: true
  },
  {
    shortName: 'NOGRAN01',
    version: '1',
    isActive: true,
    hasGranules: false
  },
  {
    shortName: 'NUMERIC01',
    version: '9',
    isActive: true,
    hasGranules: false
  },
  {
    shortName: 'NUMERIC01',
    version: '10',
    isActive: true,
    hasGranules: true
  }
]

beforeAll(() => {
  // The shortNames index is cached in memory after the first load, so S3 is only mocked once
  s3ClientMock.on(GetObjectCommand).resolves({
    Body: {
      transformToString: async () => JSON.stringify(shortNames)
    }
  })
})

describe('shortNameSearch', () => {
  test('returns the shortName only once when no version is in the query', async () => {
    const result = await shortNameSearch('USGS_P-11_cells in Maryland in 2014')

    expect(result).toEqual({
      shortNames: ['USGS_P-11_cells'],
      entryIds: [],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: 'in Maryland in 2014'
    })
  })

  test('returns an entry id when a short name and version is in the query', async () => {
    const result = await shortNameSearch('ATL03 v007 over Greenland')

    expect(result).toEqual({
      shortNames: [],
      entryIds: ['ATL03_007'],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: 'over Greenland'
    })
  })

  test.each([
    'ATL03 over Greenland v007',
    'v007 ATL03 over Greenland'
  ])('does not match a version that is not immediately after the shortName for "%s"', async (query) => {
    const result = await shortNameSearch(query)

    expect(result).toEqual({
      shortNames: ['ATL03'],
      entryIds: [],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: query.replace('ATL03 ', '')
    })
  })

  test.each([
    'atl-03',
    'ATL_03',
    'ATL:03',
    'Atl.03'
  ])('matches shortNames ignoring case and separators for "%s"', async (word) => {
    const result = await shortNameSearch(`${word} over Greenland`)

    expect(result).toEqual({
      shortNames: ['ATL03'],
      entryIds: [],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: 'over Greenland'
    })
  })

  test('matches indexed shortNames with separators ignoring separators in the query', async () => {
    const result = await shortNameSearch('usgsp11cells v2')

    expect(result).toEqual({
      shortNames: [],
      entryIds: ['USGS_P-11_cells_2'],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: ''
    })
  })

  test.each([
    'atl03 v4',
    'atl03 4',
    'atl03 V0004'
  ])('matches versions ignoring leading zeros for "%s"', async (query) => {
    const result = await shortNameSearch(query)

    expect(result).toEqual({
      shortNames: [],
      entryIds: ['ATL03_004'],
      includeInactiveCollections: true,
      hasGranulesOrCwic: undefined,
      remainingQuery: ''
    })
  })

  test('matches multi-segment versions ignoring leading zeros', async () => {
    const result = await shortNameSearch('MOD11A1 v6.1')

    expect(result).toEqual({
      shortNames: [],
      entryIds: ['MOD11A1_006.01'],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: ''
    })
  })

  test('does not treat a version with a different value as a match', async () => {
    const result = await shortNameSearch('MOD11A1 v6.10')

    expect(result).toEqual({
      shortNames: ['MOD11A1'],
      entryIds: [],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: 'v6.10'
    })
  })

  test.each([
    'ALT03',
    'ATL0X',
    'ATL3'
  ])('does not fuzzy match "%s"', async (word) => {
    const result = await shortNameSearch(`${word} over Greenland`)

    expect(result).toEqual({
      shortNames: [],
      entryIds: [],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: `${word} over Greenland`
    })
  })

  test('returns shortNames and entry ids when more than one matches', async () => {
    const result = await shortNameSearch('ATL03 007 and ATL06 data')

    expect(result).toEqual({
      shortNames: ['ATL06'],
      entryIds: ['ATL03_007'],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: 'and data'
    })
  })

  test('returns each shortName and entry id only once', async () => {
    const result = await shortNameSearch('ATL03 v7 ATL03 007 ATL06 atl06')

    expect(result).toEqual({
      shortNames: ['ATL06'],
      entryIds: ['ATL03_007'],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: ''
    })
  })

  test.each([
    ['atl03_006', 'ATL03_006'],
    ['ATL03_006', 'ATL03_006'],
    ['MOD11A1_006.01,', 'MOD11A1_006.01'],
    ['usgs_p-11_cells_2', 'USGS_P-11_cells_2']
  ])('matches an entry id typed in the query for "%s"', async (word, entryId) => {
    const result = await shortNameSearch(`${word} over Greenland`)

    expect(result).toEqual(expect.objectContaining({
      shortNames: [],
      entryIds: [entryId],
      remainingQuery: 'over Greenland'
    }))
  })

  test('does not match an entry id with a version that is not in the index', async () => {
    const result = await shortNameSearch('ATL03_999 over Greenland')

    expect(result).toEqual({
      shortNames: [],
      entryIds: [],
      includeInactiveCollections: false,
      hasGranulesOrCwic: true,
      remainingQuery: 'ATL03_999 over Greenland'
    })
  })

  test('returns typed entry ids alongside shortName and version matches', async () => {
    const result = await shortNameSearch('atl03_006 ATL03 v7 and ATL06 data')

    expect(result).toEqual({
      shortNames: ['ATL06'],
      entryIds: ['ATL03_006', 'ATL03_007'],
      includeInactiveCollections: true,
      hasGranulesOrCwic: true,
      remainingQuery: 'and data'
    })
  })

  describe('includeInactiveCollections', () => {
    test('defaults to false and true when the matches have the default values', async () => {
      const result = await shortNameSearch('GRAN01 over Greenland')

      expect(result).toEqual({
        shortNames: ['GRAN01'],
        entryIds: [],
        includeInactiveCollections: false,
        hasGranulesOrCwic: true,
        remainingQuery: 'over Greenland'
      })
    })

    test('is false for a shortName when any of its versions do not include inactive collections', async () => {
      const result = await shortNameSearch('INACTIVE01')

      expect(result).toEqual({
        shortNames: ['INACTIVE01'],
        entryIds: [],
        includeInactiveCollections: false,
        hasGranulesOrCwic: undefined,
        remainingQuery: ''
      })
    })

    test('is true for a shortName when all of its versions include inactive collections', async () => {
      const result = await shortNameSearch('ALLINACTIVE01')

      expect(result).toEqual({
        shortNames: ['ALLINACTIVE01'],
        entryIds: [],
        includeInactiveCollections: true,
        hasGranulesOrCwic: true,
        remainingQuery: ''
      })
    })

    test('is true when a second shortName has all of its versions include inactive collections', async () => {
      const result = await shortNameSearch('INACTIVE01 and ALLINACTIVE01')

      expect(result).toEqual({
        shortNames: ['INACTIVE01', 'ALLINACTIVE01'],
        entryIds: [],
        includeInactiveCollections: true,
        hasGranulesOrCwic: undefined,
        remainingQuery: 'and'
      })
    })

    test('uses only the matched version of a shortName followed by a version', async () => {
      const result = await shortNameSearch('INACTIVE01 v1')

      expect(result).toEqual({
        shortNames: [],
        entryIds: ['INACTIVE01_1'],
        includeInactiveCollections: true,
        hasGranulesOrCwic: true,
        remainingQuery: ''
      })
    })

    test('uses only the matched version of a typed entry id', async () => {
      const result = await shortNameSearch('inactive01_2')

      expect(result).toEqual({
        shortNames: [],
        entryIds: ['INACTIVE01_2'],
        includeInactiveCollections: false,
        hasGranulesOrCwic: undefined,
        remainingQuery: ''
      })
    })
  })

  describe('hasGranulesOrCwic', () => {
    test('uses only the greatest version of a shortName without a version', async () => {
      // ATL03 004 does not have granules, but the greatest version, 007, does
      const result = await shortNameSearch('atl03')

      expect(result).toEqual({
        shortNames: ['ATL03'],
        entryIds: [],
        includeInactiveCollections: false,
        hasGranulesOrCwic: true,
        remainingQuery: ''
      })
    })

    test('is undefined when the greatest version of a shortName does not have granules', async () => {
      // INACTIVE01 1 has granules, but the greatest version, 2, does not
      const result = await shortNameSearch('INACTIVE01')

      expect(result).toEqual(expect.objectContaining({
        shortNames: ['INACTIVE01'],
        hasGranulesOrCwic: undefined
      }))
    })

    test('compares versions numerically to find the greatest version', async () => {
      // `10` is greater than `9`, even though it sorts first as a string
      const result = await shortNameSearch('NUMERIC01')

      expect(result).toEqual(expect.objectContaining({
        shortNames: ['NUMERIC01'],
        hasGranulesOrCwic: true
      }))
    })

    test('uses the matched version, not the greatest, when a version is in the query', async () => {
      const result = await shortNameSearch('atl03 v4')

      expect(result).toEqual(expect.objectContaining({
        entryIds: ['ATL03_004'],
        hasGranulesOrCwic: undefined
      }))
    })

    test('is undefined when any of several matches do not have granules', async () => {
      const result = await shortNameSearch('GRAN01 and NOGRAN01_1')

      expect(result).toEqual({
        shortNames: ['GRAN01'],
        entryIds: ['NOGRAN01_1'],
        includeInactiveCollections: false,
        hasGranulesOrCwic: undefined,
        remainingQuery: 'and'
      })
    })

    test('is true when any of several matches include granules', async () => {
      const result = await shortNameSearch('GRAN01 and INACTIVE01_1')

      expect(result).toEqual({
        shortNames: ['GRAN01'],
        entryIds: ['INACTIVE01_1'],
        includeInactiveCollections: true,
        hasGranulesOrCwic: true,
        remainingQuery: 'and'
      })
    })
  })

  test('only loads the shortNames file from S3 once', () => {
    expect(s3ClientMock.commandCalls(GetObjectCommand)).toHaveLength(1)
  })

  describe('when there is an error', () => {
    test('handles the error gracefully', async () => {
      clearShortNameCache()

      // Mock an error reading the S3 file
      s3ClientMock.on(GetObjectCommand).rejects(new Error('S3 error'))

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const result = await shortNameSearch('ERROR_SCENARIO')

      expect(consoleSpy).toHaveBeenCalledTimes(1)
      expect(consoleSpy).toHaveBeenCalledWith('Error performing short name search:', expect.any(Error))

      expect(result).toEqual({
        shortNames: [],
        entryIds: [],
        includeInactiveCollections: false,
        hasGranulesOrCwic: undefined,
        remainingQuery: 'ERROR_SCENARIO'
      })
    })
  })
})
