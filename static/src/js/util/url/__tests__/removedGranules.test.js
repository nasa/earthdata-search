import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

describe('url#decodeUrlParams', () => {
  describe('project collection added granules', () => {
    test('decodes added CMR granules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              excludedGranuleIds: [],
              isCwic: false,
              isVisible: false,
              granules: {},
              granuleFilters: {},
              metadata: {},
              formattedMetadata: {},
              ummMetadata: {}
            }
          }
        },
        focusedCollection: 'collectionId',
        project: {
          byId: {
            collectionId: {
              removedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
            }
          },
          collectionIds: ['collectionId']
        }
      }
      expect(decodeUrlParams('?p=collectionId!collectionId&pg[1][r]=12345!56789!MOCK')).toEqual(expectedResult)
    })

    test('decodes added CWIC granules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              excludedGranuleIds: [],
              isCwic: true,
              isVisible: false,
              granules: {},
              granuleFilters: {},
              metadata: {},
              formattedMetadata: {},
              ummMetadata: {}
            }
          }
        },
        focusedCollection: 'collectionId',
        project: {
          byId: {
            collectionId: {
              removedGranuleIds: ['12345', '56789']
            }
          },
          collectionIds: ['collectionId']
        }
      }
      const decodedRes = decodeUrlParams('?p=collectionId!collectionId&pg[1][cr]=12345!56789')
      expect(decodedRes).toEqual(expectedResult)
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

  describe('focusedCollection added granules', () => {
    describe('CMR added granules', () => {
      test('does not encode added granules if no added granules exist', () => {
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
            collectionIds: [],
            byId: {
              collectionId: {
                addedGranules: []
              }
            }
          }
        }
        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
      })

      test('encodes added granules correctly', () => {
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
            collectionIds: ['collectionId'],
            byId: {
              collectionId: {
                removedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
              }
            }
          }
        }
        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId!collectionId&pg[1][r]=12345!56789!MOCK')
      })
    })

    describe('CWIC added granules', () => {
      test('does not encode added granules if no added granules exist', () => {
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

      test('encodes added granules correctly', () => {
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
            collectionIds: ['collectionId'],
            byId: {
              collectionId: {
                removedGranuleIds: ['12345', '56789']
              }
            }
          }
        }
        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId!collectionId&pg[1][cr]=12345!56789')
      })
    })
  })

  describe('project collection added granules', () => {
    test('encodes added granules correctly', () => {
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
          collectionIds: ['collectionId'],
          byId: {
            collectionId: {
              removedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
            }
          }
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId!collectionId&pg[1][r]=12345!56789!MOCK')
    })
  })

  describe('focused project collection added granules', () => {
    test('encodes added granules correctly', () => {
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
          collectionIds: ['collectionId'],
          byId: {
            collectionId: {
              removedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
            }
          }
        }
      }
      expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId!collectionId&pg[1][r]=12345!56789!MOCK')
    })
  })
})
