import { formatCollectionList } from '../formatCollectionList'

describe('formatCollectionList', () => {
  test('formats good metadata', () => {
    const collections = {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          id: 'collectionId',
          dataset_id: 'test dataset id',
          summary: 'test summary',
          granule_count: 42,
          has_formats: false,
          has_spatial_subsetting: false,
          has_temporal_subsetting: false,
          has_transforms: false,
          has_variables: false,
          has_map_imagery: false,
          is_cwic: false,
          is_nrt: false,
          organizations: ['test/org'],
          short_name: 'test_short_name',
          thumbnail: 'http://some.test.com/thumbnail/url.jpg',
          time_end: '2019-01-15T00:00:00.000Z',
          time_start: '2019-01-14T00:00:00.000Z',
          version_id: 2
        }
      }
    }
    const projectIds = []
    const browser = { name: 'chrome' }

    const expectedResult = {
      collectionId: 'collectionId',
      datasetId: 'test dataset id',
      description: 'test summary',
      displayOrganization: 'test/org',
      granuleCount: 42,
      hasFormats: false,
      hasMapImagery: false,
      hasSpatialSubsetting: false,
      hasTemporalSubsetting: false,
      hasTransforms: false,
      hasVariables: false,
      isCollectionInProject: false,
      isCwic: false,
      isLast: true,
      isNrt: false,
      shortName: 'test_short_name',
      temporalEnd: '2019-01-15',
      temporalRange: '2019-01-14 to 2019-01-15',
      temporalStart: '2019-01-14',
      thumbnail: 'http://some.test.com/thumbnail/url.jpg',
      versionId: 2
    }

    expect(formatCollectionList(collections, projectIds, browser)[0]).toEqual(expectedResult)
  })

  test('formats missing metadata', () => {
    const collections = {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          id: 'collectionId'
        }
      }
    }
    const projectIds = []
    const browser = { name: 'chrome' }

    const expectedResult = {
      collectionId: 'collectionId',
      datasetId: null,
      description: '',
      displayOrganization: '',
      granuleCount: 0,
      hasFormats: false,
      hasMapImagery: false,
      hasSpatialSubsetting: false,
      hasTemporalSubsetting: false,
      hasTransforms: false,
      hasVariables: false,
      isCollectionInProject: false,
      isCwic: false,
      isLast: true,
      isNrt: false,
      shortName: undefined,
      temporalEnd: '',
      temporalRange: '',
      temporalStart: '',
      thumbnail: null,
      versionId: undefined
    }

    expect(formatCollectionList(collections, projectIds, browser)[0]).toEqual(expectedResult)
  })

  test('formats temporal with start and without end', () => {
    const collections = {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          id: 'collectionId',
          time_start: '2019-01-14T00:00:00.000Z'
        }
      }
    }
    const projectIds = []
    const browser = { name: 'chrome' }

    const expectedResult = {
      temporalEnd: 'ongoing',
      temporalRange: '2019-01-14 ongoing',
      temporalStart: '2019-01-14'
    }

    expect(formatCollectionList(collections, projectIds, browser)[0]).toEqual(
      expect.objectContaining(expectedResult)
    )
  })

  test('formats temporal with end and without start', () => {
    const collections = {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          id: 'collectionId',
          time_end: '2019-01-15T00:00:00.000Z'
        }
      }
    }
    const projectIds = []
    const browser = { name: 'chrome' }

    const expectedResult = {
      temporalEnd: '2019-01-15',
      temporalRange: 'Up to 2019-01-15',
      temporalStart: ''
    }

    expect(formatCollectionList(collections, projectIds, browser)[0]).toEqual(
      expect.objectContaining(expectedResult)
    )
  })

  test('formats the description in IE', () => {
    const collections = {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          id: 'collectionId',
          summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
        }
      }
    }
    const projectIds = []
    const browser = { name: 'ie' }

    const expectedResult = {
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volupt...'
    }

    expect(formatCollectionList(collections, projectIds, browser)[0]).toEqual(
      expect.objectContaining(expectedResult)
    )
  })
})
