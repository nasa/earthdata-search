import { formatCollectionList } from '../formatCollectionList'

describe('formatCollectionList', () => {
  test('formats good metadata', () => {
    const collections = [{
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
          hasFormats: false,
          hasVariables: false,
          hasTransforms: false,
          hasSpatialSubsetting: false,
          hasTemporalSubsetting: false
        },
        opendap: {
          hasFormats: false,
          hasVariables: false,
          hasTransforms: false,
          hasSpatialSubsetting: false,
          hasTemporalSubsetting: false
        },
        harmony: {
          hasFormats: false,
          hasVariables: false,
          hasTransforms: false,
          hasSpatialSubsetting: false,
          hasTemporalSubsetting: false
        }
      },
      shortName: 'test_short_name',
      thumbnail: 'http://some.test.com/thumbnail/url.jpg',
      timeEnd: '2019-01-15T00:00:00.000Z',
      timeStart: '2019-01-14T00:00:00.000Z',
      versionId: 2
    }]
    const projectIds = []

    const expectedResult = {
      cloudHosted: true,
      summary: 'test summary',
      collectionId: 'collectionId',
      consortiums: [],
      datasetId: 'test dataset id',
      displayOrganization: 'test/org',
      granuleCount: 42,
      hasCombine: false,
      hasFormats: false,
      hasMapImagery: false,
      hasSpatialSubsetting: false,
      hasTemporalSubsetting: false,
      hasTransforms: false,
      hasVariables: false,
      isCollectionInProject: false,
      isDefaultImage: false,
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

    expect(formatCollectionList(collections, projectIds)[0])
      .toEqual(expectedResult)
  })

  test('formats missing metadata', () => {
    const collections = [{
      id: 'collectionId'
    }]
    const projectIds = []

    const expectedResult = {
      cloudHosted: false,
      summary: '',
      collectionId: 'collectionId',
      consortiums: [],
      datasetId: null,
      displayOrganization: '',
      granuleCount: 0,
      hasCombine: false,
      hasFormats: false,
      hasMapImagery: false,
      hasSpatialSubsetting: false,
      hasTemporalSubsetting: false,
      hasTransforms: false,
      hasVariables: false,
      isDefaultImage: false,
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

    expect(formatCollectionList(collections, projectIds)[0])
      .toEqual(expectedResult)
  })

  test('formats temporal with start and without end', () => {
    const collections = [{
      id: 'collectionId',
      timeStart: '2019-01-14T00:00:00.000Z'
    }]
    const projectIds = []

    const expectedResult = {
      temporalEnd: 'Present',
      temporalRange: '2019-01-14 to Present',
      temporalStart: '2019-01-14'
    }

    expect(formatCollectionList(collections, projectIds)[0]).toEqual(
      expect.objectContaining(expectedResult)
    )
  })

  test('formats temporal with end and without start', () => {
    const collections = [{
      id: 'collectionId',
      timeEnd: '2019-01-15T00:00:00.000Z'
    }]
    const projectIds = []

    const expectedResult = {
      temporalEnd: '2019-01-15',
      temporalRange: 'Up to 2019-01-15',
      temporalStart: ''
    }

    expect(formatCollectionList(collections, projectIds)[0]).toEqual(
      expect.objectContaining(expectedResult)
    )
  })

  test('formats serviceFeatures', () => {
    const collections = [{
      summary: 'test summary',
      datasetId: 'test dataset id',
      granuleCount: 42,
      hasMapImagery: false,
      id: 'collectionId',
      isDefaultImage: false,
      isCSDA: false,
      isOpenSearch: false,
      isNrt: false,
      organizations: ['test/org'],
      serviceFeatures: {
        esi: {
          hasFormats: false,
          hasVariables: true,
          hasTransforms: true,
          hasSpatialSubsetting: true,
          hasTemporalSubsetting: false
        },
        opendap: {
          hasFormats: false,
          hasVariables: false,
          hasTransforms: false,
          hasSpatialSubsetting: true,
          hasTemporalSubsetting: false
        },
        harmony: {
          hasFormats: true,
          hasVariables: false,
          hasTransforms: false,
          hasSpatialSubsetting: false,
          hasTemporalSubsetting: true
        }
      },
      shortName: 'test_short_name',
      thumbnail: 'http://some.test.com/thumbnail/url.jpg',
      timeEnd: '2019-01-15T00:00:00.000Z',
      timeStart: '2019-01-14T00:00:00.000Z',
      versionId: 2
    }]
    const projectIds = []

    const expectedResult = {
      cloudHosted: false,
      summary: 'test summary',
      collectionId: 'collectionId',
      consortiums: [],
      datasetId: 'test dataset id',
      displayOrganization: 'test/org',
      granuleCount: 42,
      hasCombine: false,
      hasFormats: true,
      hasMapImagery: false,
      hasSpatialSubsetting: true,
      hasTemporalSubsetting: true,
      hasTransforms: true,
      hasVariables: true,
      isCollectionInProject: false,
      isCSDA: false,
      isDefaultImage: false,
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

    expect(formatCollectionList(collections, projectIds)[0])
      .toEqual(expectedResult)
  })

  describe('when dates are provided with bad formats', () => {
    test('recovers when time_start is provided with a bad format', () => {
      const collections = [{
        id: 'collectionId',
        timeStart: '-3700-01-01T00:00:00.000Z',
        timeEnd: '2019-01-14T00:00:00.000Z'
      }
      ]
      const projectIds = []

      const expectedResult = {
        temporalEnd: '2019-01-14',
        temporalRange: 'Up to 2019-01-14',
        temporalStart: ''
      }

      expect(formatCollectionList(collections, projectIds)[0]).toEqual(
        expect.objectContaining(expectedResult)
      )
    })

    test('recovers when time_end is provided with a bad format', () => {
      const collections = [{
        id: 'collectionId',
        timeStart: '2019-01-14T00:00:00.000Z',
        timeEnd: '-2000-12-31T00:00:00.000Z'
      }
      ]
      const projectIds = []

      const expectedResult = {
        temporalEnd: 'Present',
        temporalRange: '2019-01-14 to Present',
        temporalStart: '2019-01-14'
      }

      expect(formatCollectionList(collections, projectIds)[0]).toEqual(
        expect.objectContaining(expectedResult)
      )
    })

    test('recovers when time_start and time_end are provided with bad formats', () => {
      const collections = [{
        id: 'collectionId',
        timeStart: '-3700-01-01T00:00:00.000Z',
        timeEnd: '-2000-12-31T00:00:00.000Z'
      }
      ]
      const projectIds = []

      const expectedResult = {
        temporalEnd: '',
        temporalRange: '',
        temporalStart: ''
      }

      expect(formatCollectionList(collections, projectIds)[0]).toEqual(
        expect.objectContaining(expectedResult)
      )
    })
  })
})
