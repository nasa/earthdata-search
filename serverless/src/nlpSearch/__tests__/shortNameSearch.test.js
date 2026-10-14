import { mockClient } from 'aws-sdk-client-mock'
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { shortNameSearch } from '../shortNameSearch'

const s3ClientMock = mockClient(S3Client)

const shortNames = [
  {
    shortName: 'USGS_P-11_cells',
    version: '1'
  },
  {
    shortName: 'USGS_P-11_cells',
    version: '2'
  },
  {
    shortName: 'ATL03',
    version: '006'
  },
  {
    shortName: 'ATL03',
    version: '007'
  },
  {
    shortName: 'ATL03',
    version: '004'
  },
  {
    shortName: 'ATL06',
    version: '006'
  },
  {
    shortName: 'MOD11A1',
    version: '006.01'
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
  test('returns the shortName only once without a version when no version is in the query', async () => {
    const result = await shortNameSearch('USGS_P-11_cells in Maryland in 2014')

    expect(result).toEqual({
      matches: [
        {
          shortName: 'USGS_P-11_cells',
          shortNameMatch: 'USGS_P-11_cells',
          versionMatch: null,
          matchType: 'exact',
          distance: 0
        }
      ],
      remainingQuery: 'in Maryland in 2014'
    })
  })

  test('returns the matching version when a version is in the query', async () => {
    const result = await shortNameSearch('ALT03 v007 over Greenland')

    expect(result).toEqual({
      matches: [
        {
          shortName: 'ATL03',
          version: '007',
          shortNameMatch: 'ALT03',
          versionMatch: 'v007',
          matchType: 'fuzzy',
          distance: 1
        }
      ],
      remainingQuery: 'over Greenland'
    })
  })

  test.each([
    ['atl03 v4', 'v4'],
    ['atl03 4', '4'],
    ['atl03 V0004', 'V0004']
  ])('matches versions ignoring leading zeros for "%s"', async (query, versionMatch) => {
    const result = await shortNameSearch(query)

    expect(result).toEqual({
      matches: [
        {
          shortName: 'ATL03',
          version: '004',
          shortNameMatch: 'atl03',
          versionMatch,
          matchType: 'exact',
          distance: 0
        }
      ],
      remainingQuery: ''
    })
  })

  test('matches multi-segment versions ignoring leading zeros', async () => {
    const result = await shortNameSearch('MOD11A1 v6.1')

    expect(result).toEqual({
      matches: [
        {
          shortName: 'MOD11A1',
          version: '006.01',
          shortNameMatch: 'MOD11A1',
          versionMatch: 'v6.1',
          matchType: 'exact',
          distance: 0
        }
      ],
      remainingQuery: ''
    })
  })

  test('does not treat a version with a different value as a match', async () => {
    const result = await shortNameSearch('MOD11A1 v6.10')

    expect(result).toEqual({
      matches: [
        {
          shortName: 'MOD11A1',
          shortNameMatch: 'MOD11A1',
          versionMatch: null,
          matchType: 'exact',
          distance: 0
        }
      ],
      remainingQuery: 'v6.10'
    })
  })

  test('returns each tied fuzzy shortName once without a version', async () => {
    const result = await shortNameSearch('ATL0X')

    expect(result).toEqual({
      matches: [
        {
          shortName: 'ATL03',
          shortNameMatch: 'ATL0X',
          versionMatch: null,
          matchType: 'fuzzy',
          distance: 1
        },
        {
          shortName: 'ATL06',
          shortNameMatch: 'ATL0X',
          versionMatch: null,
          matchType: 'fuzzy',
          distance: 1
        }
      ],
      remainingQuery: ''
    })
  })

  test('returns each short name found when more than one matches', async () => {
    const result = await shortNameSearch('ATL03 007 and ATL06 data')

    expect(result).toEqual({
      matches: [
        {
          shortName: 'ATL03',
          shortNameMatch: 'ATL03',
          version: '007',
          versionMatch: '007',
          matchType: 'exact',
          distance: 0
        },
        {
          shortName: 'ATL06',
          shortNameMatch: 'ATL06',
          versionMatch: null,
          matchType: 'exact',
          distance: 0
        }
      ],
      remainingQuery: 'and data'
    })
  })

  test('only loads the shortNames file from S3 once', () => {
    expect(s3ClientMock.commandCalls(GetObjectCommand)).toHaveLength(1)
  })
})
