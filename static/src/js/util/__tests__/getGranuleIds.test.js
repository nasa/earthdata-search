import { getGranuleIds } from '../getGranuleIds'

describe('getGranuleIds', () => {
  test('returns granule ids when none are exluded', () => {
    const ids = [
      'id1',
      'id2',
      'id3'
    ]

    const granules = {
      allIds: ids
    }

    expect(getGranuleIds({ granules })).toEqual(ids)
  })

  test('returns granule ids when excluded ids exists', () => {
    const ids = [
      'id1',
      'id2',
      'id3'
    ]

    const granules = {
      allIds: ids
    }

    const excludedGranuleIds = ['id2']

    expect(getGranuleIds({ granules, excludedGranuleIds })).toEqual(['id1', 'id3'])
  })

  test('returns cwic granule ids when excluded ids exists', () => {
    const ids = [
      'id1',
      'id2',
      'id3'
    ]

    const granules = {
      allIds: ids
    }

    const excludedGranuleIds = ['688861619']

    expect(getGranuleIds({
      granules,
      excludedGranuleIds,
      isCwic: true
    })).toEqual(['id1', 'id3'])
  })

  test('returns a limited amount of granule ids', () => {
    const ids = [
      'id1',
      'id2',
      'id3'
    ]

    const granules = {
      allIds: ids
    }

    expect(getGranuleIds({
      granules,
      limit: 2
    })).toEqual(['id1', 'id2'])
  })
})
