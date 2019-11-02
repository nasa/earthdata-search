import { getGranuleCount } from '../granuleCount'

describe('getGranuleCount', () => {
  test('returns the granule count', () => {
    const granules = {
      hits: 10
    }
    const collection = {}

    expect(getGranuleCount(granules, collection)).toEqual(10)
  })

  test('returns 0 if there are no granules', () => {
    const granules = {
      hits: 0
    }
    const collection = {}

    expect(getGranuleCount(granules, collection)).toEqual(0)
  })

  test('returns granule count minus the excluded granules', () => {
    const granules = {
      hits: 10
    }
    const collection = {
      excludedGranuleIds: [1, 2, 3]
    }

    expect(getGranuleCount(granules, collection)).toEqual(7)
  })
})
