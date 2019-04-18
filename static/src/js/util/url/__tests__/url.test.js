import { decodeUrlParams, encodeUrlQuery } from '../url'
import projections from '../../map/projections'

const emptyDecodedResult = {
  focusedCollection: {
    collectionId: undefined
  },
  map: {},
  query: {
    keyword: undefined,
    spatial: {
      boundingBox: undefined,
      point: undefined,
      polygon: undefined
    },
    temporal: {}
  },
  timeline: {}
}

describe('url#decodeUrlParams', () => {
  test('given no string it returns no object', () => {
    const expectedResult = {
      ...emptyDecodedResult
    }
    expect(decodeUrlParams('')).toEqual(expectedResult)
  })

  test('decodes keywordSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        keyword: 'keyword'
      }
    }
    expect(decodeUrlParams('?q=keyword')).toEqual(expectedResult)
  })

  test('decodes focusedCollection correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedCollection: {
        collectionId: 'collectionId'
      }
    }
    expect(decodeUrlParams('?p=collectionId')).toEqual(expectedResult)
  })

  test('decodes temporalSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        temporal: {
          endDate: '2019-02-01T00:00:00.000Z',
          startDate: '2019-01-01T00:00:00.000Z'
        }
      }
    }
    expect(decodeUrlParams('?qt=2019-01-01T00%3A00%3A00.000Z%2C2019-02-01T00%3A00%3A00.000Z')).toEqual(expectedResult)
  })

  test('decodes pointSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        spatial: {
          ...emptyDecodedResult.query.spatial,
          point: '0,0'
        }
      }
    }
    expect(decodeUrlParams('?sp=0%2C0')).toEqual(expectedResult)
  })

  test('decodes boundingBoxSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        spatial: {
          ...emptyDecodedResult.query.spatial,
          boundingBox: '0,10,20,30'
        }
      }
    }
    expect(decodeUrlParams('?sb=0%2C10%2C20%2C30')).toEqual(expectedResult)
  })

  test('decodes polygonSearch correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      query: {
        ...emptyDecodedResult.query,
        spatial: {
          ...emptyDecodedResult.query.spatial,
          polygon: '-77,38,-77,38,-76,38,-77,38'
        }
      }
    }
    expect(decodeUrlParams('?polygon=-77%2C38%2C-77%2C38%2C-76%2C38%2C-77%2C38')).toEqual(expectedResult)
  })

  test('decodes map correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      map: {
        base: {
          blueMarble: true,
          trueColor: false,
          landWaterMap: false
        },
        latitude: 0,
        longitude: 0,
        overlays: {
          referenceFeatures: true,
          coastlines: false,
          referenceLabels: true
        },
        projection: projections.geographic,
        zoom: 2
      }
    }
    expect(decodeUrlParams('?m=0%210%212%211%210%210%2C2')).toEqual(expectedResult)
  })

  test('decodes timelineQuery correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      timeline: {
        query: {
          end: '',
          interval: 'day',
          start: ''
        },
        state: {
          center: '1534577879'
        }
      }
    }
    expect(decodeUrlParams('?tl=1534577879%214%21%21')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('given no query it returns no params', () => {
    const props = {
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })

  test('encodes keywordSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      keywordSearch: 'keyword'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?q=keyword')
  })

  test('encodes focusedCollection correctly', () => {
    const props = {
      pathname: '/path/here',
      focusedCollection: 'collectionId'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
  })

  test('encodes temporalSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      temporalSearch: {
        endDate: '2019-02-01T00:00:00.000Z',
        startDate: '2019-01-01T00:00:00.000Z'
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?qt=2019-01-01T00%3A00%3A00.000Z%2C2019-02-01T00%3A00%3A00.000Z')
  })

  test('encodes pointSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      pointSearch: '0,0'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?sp=0%2C0')
  })

  test('encodes boundingBoxSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      boundingBoxSearch: '0,10,20,30'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?sb=0%2C10%2C20%2C30')
  })

  test('encodes polygonSearch correctly', () => {
    const props = {
      pathname: '/path/here',
      polygonSearch: '-77,38,-77,38,-76,38,-77,38'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?polygon=-77%2C38%2C-77%2C38%2C-76%2C38%2C-77%2C38')
  })

  describe('map', () => {
    const defaultProps = {
      pathname: '/path/here',
      map: {
        base: {
          blueMarble: true,
          trueColor: false,
          landWaterMap: false
        },
        latitude: '0',
        longitude: '0',
        overlays: {
          referenceFeatures: true,
          coastlines: false,
          referenceLabels: true
        },
        projection: projections.geographic,
        zoom: '2'
      }
    }

    test('does not encode the default map state', () => {
      expect(encodeUrlQuery(defaultProps)).toEqual('/path/here')
    })

    test('encodes map correctly', () => {
      const props = {
        ...defaultProps,
        map: {
          ...defaultProps.map,
          base: {
            blueMarble: false,
            trueColor: false,
            landWaterMap: true
          },
          latitude: 10,
          longitude: 15,
          overlays: {
            referenceFeatures: true,
            coastlines: false,
            referenceLabels: false
          },
          zoom: 0
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?m=10%2115%210%211%212%210')
    })
  })

  describe('timelineQuery', () => {
    test('encodes timelineQuery correctly when timeline is visible', () => {
      const props = {
        pathname: '/path/here',
        timeline: {
          collectionId: 'collectionId',
          state: {
            center: 1534577879
          },
          query: {
            interval: 'day'
          }
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?tl=1534577879%214%21%21')
    })

    test('encodes timelineQuery correctly when the timeline has no center state', () => {
      const props = {
        pathname: '/path/here',
        timeline: {
          collectionId: 'collectionId',
          state: {},
          query: {
            interval: 'day'
          }
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here')
    })

    test('encodes timelineQuery correctly when timeline is not visible', () => {
      const props = {
        pathname: '/path/here',
        timeline: {
          state: {
            center: 1534577879
          },
          query: {
            interval: 'day'
          }
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here')
    })
  })
})
