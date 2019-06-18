import { decodeUrlParams, encodeUrlQuery } from '../url'

const emptyDecodedResult = {
  collections: undefined,
  cmrFacets: {
    data_center_h: undefined,
    instrument_h: undefined,
    platform_h: undefined,
    processing_level_id_h: undefined,
    project_h: undefined,
    science_keywords_h: undefined
  },
  featureFacets: {
    customizable: false,
    mapImagery: false,
    nearRealTime: false
  },
  focusedCollection: undefined,
  focusedGranule: undefined,
  map: {},
  query: {
    keyword: undefined,
    spatial: {
      boundingBox: undefined,
      point: undefined,
      polygon: undefined
    },
    temporal: {},
    overrideTemporal: {}
  },
  timeline: undefined
}

describe('url#decodeUrlParams', () => {
  test('given no string it returns no object', () => {
    const expectedResult = {
      ...emptyDecodedResult
    }
    expect(decodeUrlParams('')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('given no query it returns no params', () => {
    const props = {
      pathname: '/path/here'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })
})

export default emptyDecodedResult
