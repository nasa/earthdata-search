import { getGranuleCount } from '../granuleCount'

describe('getGranuleCount', () => {
  test('provides a default for hits', () => {
    const collection = {
      granules: {}
    }

    expect(getGranuleCount(collection)).toEqual(0)
  })

  test('returns the granule count', () => {
    const collection = {
      granules: {
        hits: 10
      }
    }

    expect(getGranuleCount(collection)).toEqual(10)
  })

  test('returns 0 if there are no granules', () => {
    const collection = {
      granules: {
        hits: 0
      }
    }

    expect(getGranuleCount(collection)).toEqual(0)
  })

  test('returns granule count minus the excluded granules', () => {
    const collection = {
      excludedGranuleIds: [1, 2, 3],
      granules: {
        hits: 10
      }
    }

    expect(getGranuleCount(collection)).toEqual(7)
  })

  describe('when a project collection is provided', () => {
    test('returns granule count minus the excluded granules', () => {
      const collection = {
        excludedGranuleIds: [1, 2, 3],
        granules: {
          hits: 10
        }
      }

      const projectCollection = {
        addedGranuleIds: [],
        removedGranuleIds: []
      }

      expect(getGranuleCount(collection, projectCollection)).toEqual(7)
    })

    test('returns granule count minus the excluded and removed granules', () => {
      const collection = {
        excludedGranuleIds: [1, 2, 3],
        granules: {
          hits: 10
        }
      }

      const projectCollection = {
        addedGranuleIds: [],
        removedGranuleIds: [4, 5, 6]
      }

      expect(getGranuleCount(collection, projectCollection)).toEqual(4)
    })

    test('returns granule count minus the excluded and removed granules and removes duplicates', () => {
      const collection = {
        excludedGranuleIds: [1, 2, 3],
        granules: {
          hits: 10
        }
      }

      const projectCollection = {
        addedGranuleIds: [],
        removedGranuleIds: [1, 5, 6]
      }

      expect(getGranuleCount(collection, projectCollection)).toEqual(5)
    })

    test('returns granule count when granules are added', () => {
      const collection = {
        excludedGranuleIds: [1, 2, 3],
        granules: {
          hits: 10
        }
      }

      const projectCollection = {
        addedGranuleIds: [4, 5, 6],
        removedGranuleIds: []
      }

      expect(getGranuleCount(collection, projectCollection)).toEqual(3)
    })

    test('returns granule count when granules are added and overrides exluded', () => {
      const collection = {
        excludedGranuleIds: [1, 2, 3],
        granules: {
          hits: 10
        }
      }

      const projectCollection = {
        addedGranuleIds: [1, 5, 6],
        removedGranuleIds: []
      }

      expect(getGranuleCount(collection, projectCollection)).toEqual(3)
    })
  })
})
