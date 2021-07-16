import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

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
              isVisible: true
            },
            collectionId2: {
              granules: {},
              isVisible: true
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
              isVisible: true
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
              isVisible: true
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
              isVisible: true,
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
              isVisible: true,
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

  describe('enable temporal subsetting flag', () => {
    test('decodes enable temporal subsetting correctly when false', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: '',
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: true,
                accessMethods: {
                  harmony: {
                    enableTemporalSubsetting: false,
                    selectedOutputFormat: undefined,
                    selectedOutputProjection: undefined,
                    selectedVariables: undefined
                  }
                },
                selectedAccessMethod: 'harmony'
              },
              collectionId2: {
                granules: {},
                isVisible: true,
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

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony&pg[1][ets]=f')).toEqual(expectedResult)
    })

    test('decodes enable temporal subsetting correctly when true', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: '',
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: true,
                accessMethods: {
                  harmony: {
                    enableTemporalSubsetting: true,
                    selectedOutputFormat: undefined,
                    selectedOutputProjection: undefined,
                    selectedVariables: undefined
                  }
                },
                selectedAccessMethod: 'harmony'
              },
              collectionId2: {
                granules: {},
                isVisible: true,
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

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony&pg[1][ets]=t')).toEqual(expectedResult)
    })

    test('decodes enable temporal subsetting correctly when not encoded', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: '',
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: true,
                accessMethods: {
                  harmony: {
                    enableTemporalSubsetting: true,
                    selectedOutputFormat: undefined,
                    selectedOutputProjection: undefined,
                    selectedVariables: undefined
                  }
                },
                selectedAccessMethod: 'harmony'
              },
              collectionId2: {
                granules: {},
                isVisible: true,
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

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony')).toEqual(expectedResult)
    })
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

    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[1][v]=f&pg[2][v]=t')
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

    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[1][v]=f&pg[1][m]=opendap&pg[1][uv]=V123456-EDSC!V987654-EDSC&pg[2][v]=f')
  })

  test('correctly encodes enable temporal subsetting', () => {
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
                harmony: {
                  enableTemporalSubsetting: false
                }
              },
              selectedAccessMethod: 'harmony'
            },
            collectionId2: {}
          }
        }
      }
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[1][v]=f&pg[1][m]=harmony&pg[1][ets]=f&pg[2][v]=f')
  })
})
