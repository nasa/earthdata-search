import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes CMR excludeGranules correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK'],
            isCwic: false,
            metadata: {}
          }
        },
        projectIds: []
      },
      focusedCollection: 'collectionId'
    }
    expect(decodeUrlParams('?p=collectionId&pg%5B0%5D%5Bx%5D=12345%2156789%21MOCK')).toEqual(expectedResult)
  })

  test('decodes CWIC excludeGranules correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            excludedGranuleIds: ['12345', '56789'],
            isCwic: true,
            metadata: {}
          }
        },
        projectIds: []
      },
      focusedCollection: 'collectionId'
    }
    expect(decodeUrlParams('?p=collectionId&pg%5B0%5D%5Bcx%5D=12345%2156789')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('does not encode collections if no collections exist', () => {
    const props = {
      pathname: '/path/here',
      collections: {
        allIds: [],
        byId: {},
        projectIds: []
      },
      focusedCollection: 'collectionId'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
  })

  test('does not encode collections if no focusedCollection exist', () => {
    const props = {
      pathname: '/path/here',
      collections: {
        allIds: [],
        byId: {},
        projectIds: []
      },
      focusedCollection: ''
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })

  describe('CMR excludedGranules', () => {
    test('does not encode excludedGranules if no excludedGranules exist', () => {
      const props = {
        pathname: '/path/here',
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              excludedGranuleIds: [],
              granules: {},
              isCwic: false,
              metadata: { mock: 'data' }
            }
          },
          projectIds: []
        },
        focusedCollection: 'collectionId'
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
    })

    test('encodes excludedGranules correctly', () => {
      const props = {
        pathname: '/path/here',
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK'],
              granules: {},
              isCwic: false,
              metadata: { mock: 'data' }
            }
          },
          projectIds: []
        },
        focusedCollection: 'collectionId'
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId&pg%5B0%5D%5Bx%5D=12345%2156789%21MOCK')
    })
  })

  describe('CWIC excludedGranules', () => {
    test('does not encode excludedGranules if no excludedGranules exist', () => {
      const props = {
        pathname: '/path/here',
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              excludedGranuleIds: [],
              granules: {},
              isCwic: true,
              metadata: { mock: 'data' }
            }
          },
          projectIds: []
        },
        focusedCollection: 'collectionId'
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
    })

    test('encodes excludedGranules correctly', () => {
      const props = {
        pathname: '/path/here',
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              excludedGranuleIds: ['12345', '56789'],
              granules: {},
              isCwic: true,
              metadata: { mock: 'data' }
            }
          },
          projectIds: []
        },
        focusedCollection: 'collectionId'
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId&pg%5B0%5D%5Bx%5D=12345%2156789')
    })
  })
})
