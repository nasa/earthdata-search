import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

describe('url#decodeUrlParams', () => {
  describe('focusedCollection excludedGranules', () => {
    test('decodes CMR excludeGranules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK'],
              isCwic: false,
              isVisible: false,
              granules: {},
              granuleFilters: {},
              metadata: {}
            }
          }
        },
        focusedCollection: 'collectionId',
        project: {
          byId: {},
          collectionIds: []
        }
      }
      expect(decodeUrlParams('?p=collectionId&pg[0][x]=12345!56789!MOCK')).toEqual(expectedResult)
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
              isVisible: false,
              granules: {},
              granuleFilters: {},
              metadata: {}
            }
          }
        },
        focusedCollection: 'collectionId',
        project: {
          byId: {},
          collectionIds: []
        }
      }
      expect(decodeUrlParams('?p=collectionId&pg[0][cx]=12345!56789')).toEqual(expectedResult)
    })
  })

  describe('project collection excludedGranules', () => {
    test('decodes excludeGranules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK'],
              isCwic: false,
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
            collectionId: {}
          },
          collectionIds: ['collectionId']
        }
      }
      expect(decodeUrlParams('?p=!collectionId&pg[1][x]=12345!56789!MOCK')).toEqual(expectedResult)
    })
  })

  describe('focused project collection excludedGranules', () => {
    test('decodes excludeGranules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              excludedGranuleIds: ['G12345-MOCK', 'G56789-MOCK'],
              isCwic: false,
              isVisible: false,
              granules: {},
              granuleFilters: {},
              metadata: {}
            }
          }
        },
        focusedCollection: 'collectionId',
        project: {
          byId: {
            collectionId: {}
          },
          collectionIds: ['collectionId']
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
      collections: {
        allIds: [],
        byId: {}
      },
      focusedCollection: 'collectionId',
      project: {
        collectionIds: []
      }
    }
    expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
  })

  test('does not encode collections if no focusedCollection exist', () => {
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

  describe('focusedCollection excludedGranules', () => {
    describe('CMR excludedGranules', () => {
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
                isCwic: false,
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
          hasGranulesOrCwic: true,
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
            }
          },
          focusedCollection: 'collectionId',
          project: {
            collectionIds: []
          }
        }
        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId&pg[0][x]=12345!56789!MOCK')
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
                isCwic: true,
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
          hasGranulesOrCwic: true,
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
            }
          },
          focusedCollection: 'collectionId',
          project: {
            collectionIds: []
          }
        }
        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId&pg[0][cx]=12345!56789')
      })
    })
  })

  describe('project collection excludedGranules', () => {
    test('encodes excludedGranules correctly', () => {
      const props = {
        hasGranulesOrCwic: true,
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
          }
        },
        focusedCollection: '',
        project: {
          collectionIds: ['collectionId']
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId&pg[1][x]=12345!56789!MOCK')
    })
  })

  describe('focused project collection excludedGranules', () => {
    test('encodes excludedGranules correctly', () => {
      const props = {
        hasGranulesOrCwic: true,
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
          }
        },
        focusedCollection: 'collectionId',
        project: {
          collectionIds: ['collectionId']
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId!collectionId&pg[1][x]=12345!56789!MOCK')
    })
  })
})
