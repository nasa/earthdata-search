import { getGranuleIds } from '../getGranuleIds'

describe('getGranuleIds', () => {
  test('returns granule ids when none are exluded', () => {
    const allIds = [
      'id1',
      'id2',
      'id3'
    ]

    expect(getGranuleIds({ allIds })).toEqual(allIds)
  })

  test('returns granule ids when excluded ids exists', () => {
    const allIds = [
      'id1',
      'id2',
      'id3'
    ]

    const excludedGranuleIds = ['id2']

    expect(getGranuleIds({ allIds, excludedGranuleIds })).toEqual(['id1', 'id3'])
  })

  test('returns cwic granule ids when excluded ids exists', () => {
    const allIds = [
      'id1',
      'id2',
      'id3'
    ]

    const excludedGranuleIds = ['688861619']

    expect(getGranuleIds({
      allIds,
      excludedGranuleIds,
      isOpenSearch: true
    })).toEqual(['id1', 'id3'])
  })

  test('returns a limited amount of granule ids', () => {
    const allIds = [
      'id1',
      'id2',
      'id3'
    ]

    expect(getGranuleIds({
      allIds,
      limit: 2
    })).toEqual(['id1', 'id2'])
  })
})
