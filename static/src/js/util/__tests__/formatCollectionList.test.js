import { formatCollectionList } from '../formatCollectionList'

describe('formatCollectionList', () => {
  test('formats good metadata', () => {
    const collections = {
      allIds: ['collectionId']
    }
    const metadata = {
      collectionId: {
        cloudHosted: true,
        summary: 'test summary',
        consortiums: [],
        datasetId: 'test dataset id',
        granuleCount: 42,
        hasMapImagery: false,
        id: 'collectionId',
        isCSDA: false,
        isOpenSearch: false,
        isNrt: false,
        organizations: ['test/org'],
        serviceFeatures: {
          esi: {
            has_formats: false,
            has_variables: false,
            has_transforms: false,
            has_spatial_subsetting: false,
            has_temporal_subsetting: false
          },
          opendap: {
            has_formats: false,
            has_variables: false,
            has_transforms: false,
            has_spatial_subsetting: false,
            has_temporal_subsetting: false
          },
          harmony: {
            has_formats: false,
            has_variables: false,
            has_transforms: false,
            has_spatial_subsetting: false,
            has_temporal_subsetting: false
          }
        },
        shortName: 'test_short_name',
        thumbnail: 'http://some.test.com/thumbnail/url.jpg',
        timeEnd: '2019-01-15T00:00:00.000Z',
        timeStart: '2019-01-14T00:00:00.000Z',
        versionId: 2
      }
    }
    const projectIds = []
    const browser = { name: 'chrome' }

    const expectedResult = {
      cloudHosted: true,
      summary: 'test summary',
      collectionId: 'collectionId',
      consortiums: [],
      datasetId: 'test dataset id',
      displayOrganization: 'test/org',
      granuleCount: 42,
      hasFormats: false,
      hasMapImagery: false,
      hasSpatialSubsetting: false,
      hasTemporalSubsetting: false,
      hasTransforms: false,
      hasVariables: false,
      isCollectionInProject: false,
      isCSDA: false,
      isOpenSearch: false,
      isLast: true,
      isNrt: false,
      nrt: {},
      organizations: ['test/org'],
      shortName: 'test_short_name',
      temporalEnd: '2019-01-15',
      temporalRange: '2019-01-14 to 2019-01-15',
      temporalStart: '2019-01-14',
      thumbnail: 'http://some.test.com/thumbnail/url.jpg',
      versionId: 2
    }

    expect(formatCollectionList(collections, metadata, projectIds, browser)[0])
      .toEqual(expectedResult)
  })

  test('formats missing metadata', () => {
    const collections = {
      allIds: ['collectionId']
    }
    const metadata = {
      collectionId: {
        id: 'collectionId'
      }
    }
    const projectIds = []
    const browser = { name: 'chrome' }

    const expectedResult = {
      cloudHosted: false,
      summary: '',
      collectionId: 'collectionId',
      consortiums: [],
      datasetId: null,
      displayOrganization: '',
      granuleCount: 0,
      hasFormats: false,
      hasMapImagery: false,
      hasSpatialSubsetting: false,
      hasTemporalSubsetting: false,
      hasTransforms: false,
      hasVariables: false,
      isCollectionInProject: false,
      isCSDA: false,
      isOpenSearch: false,
      isLast: true,
      isNrt: false,
      nrt: {},
      organizations: [],
      shortName: undefined,
      temporalEnd: '',
      temporalRange: '',
      temporalStart: '',
      thumbnail: null,
      versionId: undefined
    }

    expect(formatCollectionList(collections, metadata, projectIds, browser)[0])
      .toEqual(expectedResult)
  })

  test('formats temporal with start and without end', () => {
    const collections = {
      allIds: ['collectionId']
    }
    const metadata = {
      collectionId: {
        id: 'collectionId',
        timeStart: '2019-01-14T00:00:00.000Z'
      }
    }
    const projectIds = []
    const browser = { name: 'chrome' }

    const expectedResult = {
      temporalEnd: 'ongoing',
      temporalRange: '2019-01-14 ongoing',
      temporalStart: '2019-01-14'
    }

    expect(formatCollectionList(collections, metadata, projectIds, browser)[0]).toEqual(
      expect.objectContaining(expectedResult)
    )
  })

  test('formats temporal with end and without start', () => {
    const collections = {
      allIds: ['collectionId']
    }
    const metadata = {
      collectionId: {
        id: 'collectionId',
        timeEnd: '2019-01-15T00:00:00.000Z'
      }
    }
    const projectIds = []
    const browser = { name: 'chrome' }

    const expectedResult = {
      temporalEnd: '2019-01-15',
      temporalRange: 'Up to 2019-01-15',
      temporalStart: ''
    }

    expect(formatCollectionList(collections, metadata, projectIds, browser)[0]).toEqual(
      expect.objectContaining(expectedResult)
    )
  })

  test('formats serviceFeatures', () => {
    const collections = {
      allIds: ['collectionId']
    }
    const metadata = {
      collectionId: {
        summary: 'test summary',
        datasetId: 'test dataset id',
        granuleCount: 42,
        hasMapImagery: false,
        id: 'collectionId',
        isCSDA: false,
        isOpenSearch: false,
        isNrt: false,
        organizations: ['test/org'],
        serviceFeatures: {
          esi: {
            has_formats: false,
            has_variables: true,
            has_transforms: true,
            has_spatial_subsetting: true,
            has_temporal_subsetting: false
          },
          opendap: {
            has_formats: false,
            has_variables: false,
            has_transforms: false,
            has_spatial_subsetting: true,
            has_temporal_subsetting: false
          },
          harmony: {
            has_formats: true,
            has_variables: false,
            has_transforms: false,
            has_spatial_subsetting: false,
            has_temporal_subsetting: true
          }
        },
        shortName: 'test_short_name',
        thumbnail: 'http://some.test.com/thumbnail/url.jpg',
        timeEnd: '2019-01-15T00:00:00.000Z',
        timeStart: '2019-01-14T00:00:00.000Z',
        versionId: 2
      }
    }
    const projectIds = []
    const browser = { name: 'chrome' }

    const expectedResult = {
      cloudHosted: false,
      summary: 'test summary',
      collectionId: 'collectionId',
      consortiums: [],
      datasetId: 'test dataset id',
      displayOrganization: 'test/org',
      granuleCount: 42,
      hasFormats: true,
      hasMapImagery: false,
      hasSpatialSubsetting: true,
      hasTemporalSubsetting: true,
      hasTransforms: true,
      hasVariables: true,
      isCollectionInProject: false,
      isCSDA: false,
      isOpenSearch: false,
      isLast: true,
      isNrt: false,
      nrt: {},
      organizations: ['test/org'],
      shortName: 'test_short_name',
      temporalEnd: '2019-01-15',
      temporalRange: '2019-01-14 to 2019-01-15',
      temporalStart: '2019-01-14',
      thumbnail: 'http://some.test.com/thumbnail/url.jpg',
      versionId: 2
    }

    expect(formatCollectionList(collections, metadata, projectIds, browser)[0])
      .toEqual(expectedResult)
  })

  describe('when dates are provided with bad formats', () => {
    test('recovers when time_start is provided with a bad format', () => {
      const collections = {
        allIds: ['collectionId']
      }
      const metadata = {
        collectionId: {
          id: 'collectionId',
          timeStart: '-3700-01-01T00:00:00.000Z',
          timeEnd: '2019-01-14T00:00:00.000Z'
        }
      }
      const projectIds = []
      const browser = { name: 'chrome' }

      const expectedResult = {
        temporalEnd: '2019-01-14',
        temporalRange: 'Up to 2019-01-14',
        temporalStart: ''
      }

      expect(formatCollectionList(collections, metadata, projectIds, browser)[0]).toEqual(
        expect.objectContaining(expectedResult)
      )
    })

    test('recovers when time_end is provided with a bad format', () => {
      const collections = {
        allIds: ['collectionId']
      }
      const metadata = {
        collectionId: {
          id: 'collectionId',
          timeStart: '2019-01-14T00:00:00.000Z',
          timeEnd: '-2000-12-31T00:00:00.000Z'
        }
      }
      const projectIds = []
      const browser = { name: 'chrome' }

      const expectedResult = {
        temporalEnd: 'ongoing',
        temporalRange: '2019-01-14 ongoing',
        temporalStart: '2019-01-14'
      }

      expect(formatCollectionList(collections, metadata, projectIds, browser)[0]).toEqual(
        expect.objectContaining(expectedResult)
      )
    })

    test('recovers when time_start and time_end are provided with bad formats', () => {
      const collections = {
        allIds: ['collectionId']
      }
      const metadata = {
        collectionId: {
          id: 'collectionId',
          timeStart: '-3700-01-01T00:00:00.000Z',
          timeEnd: '-2000-12-31T00:00:00.000Z'
        }
      }
      const projectIds = []
      const browser = { name: 'chrome' }

      const expectedResult = {
        temporalEnd: '',
        temporalRange: '',
        temporalStart: ''
      }

      expect(formatCollectionList(collections, metadata, projectIds, browser)[0]).toEqual(
        expect.objectContaining(expectedResult)
      )
    })
  })

  test('formats the summary in IE', () => {
    const collections = {
      allIds: ['collectionId']
    }
    const metadata = {
      collectionId: {
        id: 'collectionId',
        summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
      }
    }
    const projectIds = []
    const browser = { name: 'ie' }

    const expectedResult = {
      summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in volupt...'
    }

    expect(formatCollectionList(collections, metadata, projectIds, browser)[0]).toEqual(
      expect.objectContaining(expectedResult)
    )
  })
})
