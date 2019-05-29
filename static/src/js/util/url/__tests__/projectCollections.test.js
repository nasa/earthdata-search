import { decodeUrlParams, encodeUrlQuery } from '../url'

import emptyDecodedResult from './url.test'

describe('url#decodeUrlParams', () => {
  test('decodes project collections correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            excludedGranuleIds: [],
            isCwic: false,
            isVisible: false,
            granules: {},
            metadata: {}
          },
          collectionId2: {
            excludedGranuleIds: [],
            isCwic: false,
            isVisible: false,
            granules: {},
            metadata: {}
          }
        },
        projectIds: ['collectionId1', 'collectionId2']
      },
      focusedCollection: ''
    }
    expect(decodeUrlParams('?p=!collectionId1!collectionId2')).toEqual(expectedResult)
  })

  test('decodes focusedCollection and project collections correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            excludedGranuleIds: [],
            isCwic: false,
            isVisible: false,
            granules: {},
            metadata: {}
          },
          collectionId2: {
            excludedGranuleIds: [],
            isCwic: false,
            isVisible: false,
            granules: {},
            metadata: {}
          }
        },
        projectIds: ['collectionId1', 'collectionId2']
      },
      focusedCollection: 'collectionId1'
    }
    expect(decodeUrlParams('?p=collectionId1!collectionId1!collectionId2')).toEqual(expectedResult)
  })

  test('decodes project collections visibility correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            excludedGranuleIds: [],
            isCwic: false,
            isVisible: false,
            granules: {},
            metadata: {}
          },
          collectionId2: {
            excludedGranuleIds: [],
            isCwic: false,
            isVisible: true,
            granules: {},
            metadata: {}
          }
        },
        projectIds: ['collectionId1', 'collectionId2']
      },
      focusedCollection: ''
    }
    expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[2][v]=t')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('does not encode project collections if no collections exist', () => {
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

  test('correctly encodes project collections', () => {
    const props = {
      pathname: '/path/here',
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {},
        projectIds: ['collectionId1', 'collectionId2']
      },
      focusedCollection: ''
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2')
  })

  test('correctly encodes focusedCollection and project collections', () => {
    const props = {
      pathname: '/path/here',
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {},
        projectIds: ['collectionId1', 'collectionId2']
      },
      focusedCollection: 'collectionId1'
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId1!collectionId1!collectionId2')
  })

  test('correctly encodes project collections visibility', () => {
    const props = {
      pathname: '/path/here',
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isVisible: false,
            metadata: {}
          },
          collectionId2: {
            isVisible: true,
            metadata: {}
          }
        },
        projectIds: ['collectionId1', 'collectionId2']
      },
      focusedCollection: ''
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[2][v]=t')
  })
})
