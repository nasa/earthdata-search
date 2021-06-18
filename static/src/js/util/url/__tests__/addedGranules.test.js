import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('url#decodeUrlParams', () => {
  describe('project collection added granules', () => {
    test('decodes added CMR granules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: 'collectionId',
        project: {
          collections: {
            allIds: ['collectionId'],
            byId: {
              collectionId: {
                granules: {
                  addedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
                },
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
                  pageNum: 1
                }
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=collectionId!collectionId&pg[1][a]=12345!56789!MOCK')).toEqual(expectedResult)
    })

    test('decodes added CWIC granules correctly', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: 'collectionId',
        project: {
          collections: {
            allIds: ['collectionId'],
            byId: {
              collectionId: {
                granules: {
                  addedGranuleIds: ['12345', '56789']
                },
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
                  pageNum: 1
                }
              }
            }
          }
        }
      }

      const decodedRes = decodeUrlParams('?p=collectionId!collectionId&pg[1][ca]=12345!56789')
      expect(decodedRes).toEqual(expectedResult)
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

  describe('focusedCollection added granules', () => {
    describe('CMR added granules', () => {
      test('does not encode added granules if no added granules exist', () => {
        const props = {
          hasGranulesOrCwic: true,
          pathname: '/path/here',
          focusedCollection: 'collectionId'
        }

        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
      })

      test('encodes added granules correctly', () => {
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
              allIds: ['collectionId'],
              byId: {
                collectionId: {
                  granules: {
                    addedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
                  }
                }
              }
            }
          }
        }

        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId!collectionId&pg[1][a]=12345!56789!MOCK&pg[1][v]=f')
      })
    })

    describe('CWIC added granules', () => {
      test('does not encode added granules if no added granules exist', () => {
        const props = {
          hasGranulesOrCwic: true,
          pathname: '/path/here',
          focusedCollection: 'collectionId'
        }

        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId')
      })

      test('encodes added granules correctly', () => {
        const props = {
          collectionsMetadata: {
            collectionId: {
              isOpenSearch: true
            }
          },
          hasGranulesOrCwic: true,
          pathname: '/path/here',
          focusedCollection: 'collectionId',
          project: {
            collections: {
              allIds: ['collectionId'],
              byId: {
                collectionId: {
                  granules: {
                    addedGranuleIds: ['12345', '56789']
                  }
                }
              }
            }
          }
        }

        expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId!collectionId&pg[1][ca]=12345!56789&pg[1][v]=f')
      })
    })
  })

  describe('project collection added granules', () => {
    test('encodes added granules correctly', () => {
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
            allIds: ['collectionId'],
            byId: {
              collectionId: {
                granules: {
                  addedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
                }
              }
            }
          }
        }
      }

      expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId&pg[1][a]=12345!56789!MOCK&pg[1][v]=f')
    })
  })

  describe('focused project collection added granules', () => {
    test('encodes added granules correctly', () => {
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
            allIds: ['collectionId'],
            byId: {
              collectionId: {
                granules: {
                  addedGranuleIds: ['G12345-MOCK', 'G56789-MOCK']
                }
              }
            }
          }
        }
      }

      expect(encodeUrlQuery(props)).toEqual('/path/here?p=collectionId!collectionId&pg[1][a]=12345!56789!MOCK&pg[1][v]=f')
    })
  })
})
