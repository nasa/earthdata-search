import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

describe('url#decodeUrlParams', () => {
  test('decodes project collections correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedCollection: '',
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              granules: {},
              isVisible: false
            },
            collectionId2: {
              granules: {},
              isVisible: false
            }
          }
        }
      }
    }
    expect(decodeUrlParams('?p=!collectionId1!collectionId2')).toEqual(expectedResult)
  })

  test('decodes focusedCollection and project collections correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedCollection: 'collectionId1',
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              granules: {},
              isVisible: false
            },
            collectionId2: {
              granules: {},
              isVisible: false
            }
          }
        }
      },
      query: {
        collection: {
          ...emptyDecodedResult.query.collection,
          byId: {
            collectionId1: {
              granules: {
                pageNum: 1
              }
            }
          }
        }
      }
    }
    expect(decodeUrlParams('?p=collectionId1!collectionId1!collectionId2')).toEqual(expectedResult)
  })

  test('decodes project collections visibility correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedCollection: '',
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              granules: {},
              isVisible: false
            },
            collectionId2: {
              granules: {},
              isVisible: true
            }
          }
        }
      },
      query: {
        collection: {
          ...emptyDecodedResult.query.collection,
          byId: {
            collectionId1: {
              granules: {}
            },
            collectionId2: {
              granules: {}
            }
          }
        }
      }
    }
    expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[2][v]=t')).toEqual(expectedResult)
  })

  test('decodes selected variables correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedCollection: '',
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              granules: {},
              isVisible: false,
              accessMethods: {
                opendap: {
                  selectedOutputFormat: undefined,
                  selectedOutputProjection: undefined,
                  selectedVariables: ['V123456-EDSC', 'V987654-EDSC']
                }
              },
              selectedAccessMethod: 'opendap'
            },
            collectionId2: {
              granules: {},
              isVisible: false,
              selectedAccessMethod: undefined
            }
          }
        }
      },
      query: {
        collection: {
          ...emptyDecodedResult.query.collection,
          byId: {
            collectionId1: {
              granules: {}
            },
            collectionId2: {
              granules: {}
            }
          }
        }
      }
    }
    expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=opendap&pg[1][uv]=V123456-EDSC!V987654-EDSC')).toEqual(expectedResult)
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
        collections: {
          allIds: [],
          byId: {}
        }
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
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {}
        }
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2')
  })

  test('correctly encodes focusedCollection and project collections', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: 'collectionId1',
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {}
        }
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId1!collectionId1!collectionId2')
  })

  test('correctly encodes project collections visibility', () => {
    const props = {
      collectionsMetadata: {
        collectionId1: {},
        collectionId2: {}
      },
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: '',
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              isVisible: false
            },
            collectionId2: {
              isVisible: true
            }
          }
        }
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[2][v]=t')
  })

  test('correctly encodes selected variables', () => {
    const props = {
      collectionsMetadata: {
        collectionId1: {},
        collectionId2: {}
      },
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: '',
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
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
          }
        }
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[1][m]=opendap&pg[1][uv]=V123456-EDSC!V987654-EDSC')
  })
})
