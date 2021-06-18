import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  describe('focusedCollection excludedGranules', () => {
    test('decodes CMR excludeGranules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: 'collectionId',
        query: {
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId: {
                granules: {
                  excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK'],
                  pageNum: 1
                }
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=collectionId&pg[0][x]=12345!56789!MOCK')).toEqual(expectedResult)
    })

    test('decodes CWIC excludeGranules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: 'collectionId',
        query: {
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId: {
                granules: {
                  excludedGranuleIds: ['12345', '56789'],
                  pageNum: 1
                }
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=collectionId&pg[0][cx]=12345!56789')).toEqual(expectedResult)
    })
  })

  describe('project collection excludedGranules', () => {
    test('decodes excludeGranules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: '',
        project: {
          collections: {
            allIds: ['collectionId'],
            byId: {
              collectionId: {
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
              collectionId: {
                granules: {
                  excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
                }
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=!collectionId&pg[1][x]=12345!56789!MOCK')).toEqual(expectedResult)
    })
  })

  describe('focused project collection excludedGranules', () => {
    test('decodes excludeGranules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: 'collectionId',
        project: {
          collections: {
            allIds: ['collectionId'],
            byId: {
              collectionId: {
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
              collectionId: {
                granules: {
                  excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK'],
                  pageNum: 1
                }
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=collectionId!collectionId&pg[1][x]=12345!56789!MOCK')).toEqual(expectedResult)
    })
  })
})

describe('url#encodeUrlQuery', () => {
  test('does not encode collections if no collections exist', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: 'collectionId'
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
  })

  test('does not encode collections if no focusedCollection exist', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: ''
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here')
  })

  describe('focusedCollection excludedGranules', () => {
    describe('CMR excludedGranules', () => {
      test('does not encode excludedGranules if no excludedGranules exist', () => {
        const props = {
          hasGranulesOrCwic: true,
          pathname: '/path/here',
          focusedCollection: 'collectionId'
        }

        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
      })

      test('encodes excludedGranules correctly', () => {
        const props = {
          collectionsMetadata: {
            collectionId: {
              isOpenSearch: false
            }
          },
          hasGranulesOrCwic: true,
          pathname: '/path/here',
          focusedCollection: 'collectionId',
          query: {
            collection: {
              byId: {
                collectionId: {
                  granules: {
                    excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
                  }
                }
              }
            }
          }
        }

        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId&pg[0][x]=12345!56789!MOCK&pg[0][v]=f')
      })
    })

    describe('CWIC excludedGranules', () => {
      test('does not encode excludedGranules if no excludedGranules exist', () => {
        const props = {
          hasGranulesOrCwic: true,
          pathname: '/path/here',
          collections: {
            allIds: ['collectionId'],
            byId: {
              collectionId: {
                excludedGranuleIds: [],
                granules: {},
                isOpenSearch: true,
                metadata: { mock: 'data' }
              }
            }
          },
          focusedCollection: 'collectionId',
          project: {
            collectionIds: []
          }
        }

        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
      })

      test('encodes excludedGranules correctly', () => {
        const props = {
          collectionsMetadata: {
            collectionId: {
              isOpenSearch: true
            }
          },
          hasGranulesOrCwic: true,
          pathname: '/path/here',
          focusedCollection: 'collectionId',
          query: {
            collection: {
              byId: {
                collectionId: {
                  granules: {
                    excludedGranuleIds: ['12345', '56789']
                  }
                }
              }
            }
          }
        }

        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId&pg[0][cx]=12345!56789&pg[0][v]=f')
      })
    })
  })

  describe('project collection excludedGranules', () => {
    test('encodes excludedGranules correctly', () => {
      const props = {
        collectionsMetadata: {
          collectionId: {
            isOpenSearch: false
          }
        },
        hasGranulesOrCwic: true,
        pathname: '/path/here',
        focusedCollection: '',
        project: {
          collections: {
            allIds: ['collectionId']
          }
        },
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: {
                  excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
                }
              }
            }
          }
        }
      }

      expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId&pg[1][x]=12345!56789!MOCK&pg[1][v]=f')
    })
  })

  describe('focused project collection excludedGranules', () => {
    test('encodes excludedGranules correctly', () => {
      const props = {
        collectionsMetadata: {
          collectionId: {
            isOpenSearch: false
          }
        },
        hasGranulesOrCwic: true,
        pathname: '/path/here',
        focusedCollection: 'collectionId',
        project: {
          collections: {
            allIds: ['collectionId']
          }
        },
        query: {
          collection: {
            byId: {
              collectionId: {
                granules: {
                  excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
                }
              }
            }
          }
        }
      }

      expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId!collectionId&pg[1][x]=12345!56789!MOCK&pg[1][v]=f')
    })
  })
})
