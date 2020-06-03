import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

describe('url#decodeUrlParams', () => {
  test('decodes project collections correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            excludedGranuleIds: [],
            isVisible: false,
            isCwic: undefined,
            granules: {},
            granuleFilters: {},
            metadata: {}
          },
          collectionId2: {
            excludedGranuleIds: [],
            isVisible: false,
            isCwic: undefined,
            granules: {},
            granuleFilters: {},
            metadata: {}
          }
        }
      },
      focusedCollection: '',
      project: {
        byId: {
          collectionId1: {},
          collectionId2: {}
        },
        collectionIds: ['collectionId1', 'collectionId2']
      }
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
            isCwic: undefined,
            isVisible: false,
            granules: {},
            granuleFilters: {},
            metadata: {}
          },
          collectionId2: {
            excludedGranuleIds: [],
            isCwic: undefined,
            isVisible: false,
            granules: {},
            granuleFilters: {},
            metadata: {}
          }
        }
      },
      focusedCollection: 'collectionId1',
      project: {
        byId: {
          collectionId1: {},
          collectionId2: {}
        },
        collectionIds: ['collectionId1', 'collectionId2']
      }
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
            isVisible: false,
            granules: {},
            granuleFilters: {},
            metadata: {}
          },
          collectionId2: {
            excludedGranuleIds: [],
            isCwic: false,
            isVisible: true,
            granules: {},
            granuleFilters: {},
            metadata: {}
          }
        }
      },
      focusedCollection: '',
      project: {
        byId: {
          collectionId1: {},
          collectionId2: {}
        },
        collectionIds: ['collectionId1', 'collectionId2']
      }
    }
    expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[2][v]=t')).toEqual(expectedResult)
  })

  test('decodes selected variables correctly', () => {
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
            granuleFilters: {},
            metadata: {}
          },
          collectionId2: {
            excludedGranuleIds: [],
            isCwic: undefined,
            isVisible: false,
            granules: {},
            granuleFilters: {},
            metadata: {}
          }
        }
      },
      focusedCollection: '',
      project: {
        byId: {
          collectionId1: {
            accessMethods: {
              opendap: {
                selectedVariables: ['V123456-EDSC', 'V987654-EDSC']
              }
            }
          },
          collectionId2: {}
        },
        collectionIds: ['collectionId1', 'collectionId2']
      }
    }
    expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][uv]=V123456-EDSC!V987654-EDSC')).toEqual(expectedResult)
  })
})

describe('url#encodeUrlQuery', () => {
  test('does not encode project collections if no collections exist', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      collections: {
        allIds: [],
        byId: {}
      },
      focusedCollection: '',
      project: {
        collectionIds: []
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })

  test('correctly encodes project collections', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {}
      },
      focusedCollection: '',
      project: {
        collectionIds: ['collectionId1', 'collectionId2']
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2')
  })

  test('correctly encodes focusedCollection and project collections', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {}
      },
      focusedCollection: 'collectionId1',
      project: {
        collectionIds: ['collectionId1', 'collectionId2']
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId1!collectionId1!collectionId2')
  })

  test('correctly encodes project collections visibility', () => {
    const props = {
      hasGranulesOrCwic: true,
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
        }
      },
      focusedCollection: '',
      project: {
        collectionIds: ['collectionId1', 'collectionId2']
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[2][v]=t')
  })

  test('correctly encodes selected variables', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      collections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            isVisible: false,
            metadata: {}
          },
          collectionId2: {
            isVisible: false,
            metadata: {}
          }
        }
      },
      focusedCollection: '',
      project: {
        byId: {
          collectionId1: {
            accessMethods: {
              opendap: {
                selectedVariables: ['V123456-EDSC', 'V987654-EDSC']
              }
            },
            selectedAccessMethod: 'opendap'
          },
          collectionId2: {}
        },
        collectionIds: ['collectionId1', 'collectionId2']
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[1][uv]=V123456-EDSC!V987654-EDSC')
  })
})
