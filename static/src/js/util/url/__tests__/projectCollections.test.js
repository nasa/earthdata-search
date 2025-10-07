import { decodeUrlParams, encodeUrlQuery } from '../url'

import { emptyDecodedResult } from './url.mocks'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import { initialGranuleQuery } from '../collectionsEncoders'

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    defaultPortal: 'default'
  }))
})

describe('url#decodeUrlParams', () => {
  test('decodes project collections correctly', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedCollection: null,
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              granules: {},
              isVisible: true,
              selectedAccessMethod: undefined
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
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          byId: {
            collectionId1: {
              granules: initialGranuleQuery
            },
            collectionId2: {
              granules: initialGranuleQuery
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
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          byId: {
            collectionId1: {
              granules: initialGranuleQuery
            },
            collectionId2: {
              granules: initialGranuleQuery
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
      focusedCollection: null,
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              granules: {},
              isVisible: true,
              selectedAccessMethod: undefined
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
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          byId: {
            collectionId1: {
              granules: initialGranuleQuery
            },
            collectionId2: {
              granules: initialGranuleQuery
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
      focusedCollection: null,
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              granules: {},
              isVisible: true,
              accessMethods: {
                opendap: {
                  enableConcatenateDownload: undefined,
                  enableSpatialSubsetting: undefined,
                  enableTemporalSubsetting: undefined,
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
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          byId: {
            collectionId1: {
              granules: initialGranuleQuery
            },
            collectionId2: {
              granules: initialGranuleQuery
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
        focusedCollection: null,
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
                    enableSpatialSubsetting: true,
                    enableConcatenateDownload: false,
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
          ...emptyDecodedResult.query,
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId1: {
                granules: initialGranuleQuery
              },
              collectionId2: {
                granules: initialGranuleQuery
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony&pg[1][cd]=f&pg[1][ets]=f')).toEqual(expectedResult)
    })

    test('decodes enable temporal subsetting correctly when true', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: null,
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: true,
                accessMethods: {
                  harmony: {
                    enableConcatenateDownload: false,
                    enableSpatialSubsetting: true,
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
          ...emptyDecodedResult.query,
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId1: {
                granules: initialGranuleQuery
              },
              collectionId2: {
                granules: initialGranuleQuery
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
        focusedCollection: null,
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: true,
                accessMethods: {
                  harmony: {
                    enableConcatenateDownload: true,
                    enableSpatialSubsetting: true,
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
          ...emptyDecodedResult.query,
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId1: {
                granules: initialGranuleQuery
              },
              collectionId2: {
                granules: initialGranuleQuery
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony&pg[1][cd]=t')).toEqual(expectedResult)
    })
  })

  describe('enable spatial subsetting flag', () => {
    test('decodes enable spatial subsetting correctly when false', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: null,
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: true,
                accessMethods: {
                  harmony: {
                    enableConcatenateDownload: false,
                    enableTemporalSubsetting: true,
                    enableSpatialSubsetting: false,
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
          ...emptyDecodedResult.query,
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId1: {
                granules: initialGranuleQuery
              },
              collectionId2: {
                granules: initialGranuleQuery
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony&pg[1][ess]=f')).toEqual(expectedResult)
    })

    test('decodes enable spatial subsetting correctly when true', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: null,
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
                    enableSpatialSubsetting: true,
                    enableConcatenateDownload: false,
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
          ...emptyDecodedResult.query,
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId1: {
                granules: initialGranuleQuery
              },
              collectionId2: {
                granules: initialGranuleQuery
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony&pg[1][cd]=f&pg[1][ets]=f&pg[1][ess]=t')).toEqual(expectedResult)
    })
  })

  test('decodes enable spatial subsetting correctly when not encoded', () => {
    const expectedResult = {
      ...emptyDecodedResult,
      focusedCollection: null,
      project: {
        collections: {
          allIds: ['collectionId1', 'collectionId2'],
          byId: {
            collectionId1: {
              granules: {},
              isVisible: true,
              accessMethods: {
                harmony: {
                  enableSpatialSubsetting: true,
                  enableTemporalSubsetting: true,
                  enableConcatenateDownload: false,
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
        ...emptyDecodedResult.query,
        collection: {
          ...emptyDecodedResult.query.collection,
          byId: {
            collectionId1: {
              granules: initialGranuleQuery
            },
            collectionId2: {
              granules: initialGranuleQuery
            }
          }
        }
      }
    }

    expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony')).toEqual(expectedResult)
  })

  describe('enable concatenate download flag', () => {
    test('decodes enable concatenate download correctly when false', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: null,
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: true,
                accessMethods: {
                  harmony: {
                    enableSpatialSubsetting: true,
                    enableConcatenateDownload: false,
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
          ...emptyDecodedResult.query,
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId1: {
                granules: initialGranuleQuery
              },
              collectionId2: {
                granules: initialGranuleQuery
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony&pg[1][cd]=f&pg[1][ets]=f')).toEqual(expectedResult)
    })

    test('decodes enable concatenate download correctly when true', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: null,
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: true,
                accessMethods: {
                  harmony: {
                    enableSpatialSubsetting: true,
                    enableConcatenateDownload: true,
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
          ...emptyDecodedResult.query,
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId1: {
                granules: initialGranuleQuery
              },
              collectionId2: {
                granules: initialGranuleQuery
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][m]=harmony&pg[1][ets]=f&pg[1][cd]=t')).toEqual(expectedResult)
    })
  })

  describe('swodlr project parameters', () => {
    test('correctly decodes swodlr access method', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: null,
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: false,
                accessMethods: {
                  swodlr: {
                    swodlrData: {
                      params: {
                        rasterResolution: '90',
                        outputSamplingGridType: 'UTM',
                        outputGranuleExtentFlag: 'false'
                      },
                      custom_params: {
                        'G3225437730-POCLOUD': {
                          utmZoneAdjust: '1',
                          mgrsBandAdjust: '0'
                        },
                        'G3225437639-POCLOUD': {
                          utmZoneAdjust: '0',
                          mgrsBandAdjust: '-1'
                        }
                      }
                    }
                  }
                },
                selectedAccessMethod: 'swodlr'
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
          ...emptyDecodedResult.query,
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId1: {
                granules: initialGranuleQuery
              },
              collectionId2: {
                granules: initialGranuleQuery
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][v]=f&pg[1][m]=swodlr&pg[1][swod][params][rasterResolution]=90&pg[1][swod][params][outputSamplingGridType]=UTM&pg[1][swod][params][outputGranuleExtentFlag]=false&pg[1][swod][custom_params][G3225437730-POCLOUD][utmZoneAdjust]=1&pg[1][swod][custom_params][G3225437730-POCLOUD][mgrsBandAdjust]=0&pg[1][swod][custom_params][G3225437639-POCLOUD][utmZoneAdjust]=0&pg[1][swod][custom_params][G3225437639-POCLOUD][mgrsBandAdjust]=-1&pg[1][cd]=f&pg[2][v]=f')).toEqual(expectedResult)
    })

    test('returns undefined when swodlrData is null', () => {
      const expectedResult = {
        ...emptyDecodedResult,
        focusedCollection: null,
        project: {
          collections: {
            allIds: ['collectionId1', 'collectionId2'],
            byId: {
              collectionId1: {
                granules: {},
                isVisible: false,
                selectedAccessMethod: 'swodlr'
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
          ...emptyDecodedResult.query,
          collection: {
            ...emptyDecodedResult.query.collection,
            byId: {
              collectionId1: {
                granules: initialGranuleQuery
              },
              collectionId2: {
                granules: initialGranuleQuery
              }
            }
          }
        }
      }

      expect(decodeUrlParams('?p=!collectionId1!collectionId2&pg[1][v]=f&pg[1][m]=swodlr&pg[1][swod]&pg[1]&pg[1][cd]=f&pg[2][v]=f')).toEqual(expectedResult)
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
      focusedCollection: null,
      projectCollections: {
        allIds: [],
        byId: {}
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
      focusedCollection: null,
      projectCollections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {}
      }
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2')
  })

  test('correctly encodes focusedCollection and project collections', () => {
    const props = {
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: 'collectionId1',
      projectCollections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {}
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
      focusedCollection: null,
      projectCollections: {
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
      focusedCollection: null,
      projectCollections: {
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

    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[1][v]=f&pg[1][m]=opendap&pg[1][uv]=V123456-EDSC!V987654-EDSC&pg[1][cd]=f&pg[2][v]=f')
  })

  test('correctly encodes enable temporal subsetting', () => {
    const props = {
      collectionsMetadata: {
        collectionId1: {},
        collectionId2: {}
      },
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: null,
      projectCollections: {
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

    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[1][v]=f&pg[1][m]=harmony&pg[1][cd]=f&pg[1][ets]=f&pg[1][ess]=f&pg[2][v]=f')
  })

  test('correctly encodes enable spatial subsetting', () => {
    const props = {
      collectionsMetadata: {
        collectionId1: {},
        collectionId2: {}
      },
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: null,
      projectCollections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            accessMethods: {
              harmony: {
                enableTemporalSubsetting: false,
                enableSpatialSubsetting: false,
                enableConcatenateDownload: false
              }
            },
            selectedAccessMethod: 'harmony'
          },
          collectionId2: {}
        }
      }
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[1][v]=f&pg[1][m]=harmony&pg[1][cd]=f&pg[1][ets]=f&pg[1][ess]=f&pg[2][v]=f')
  })

  test('correctly encodes swodlr access method', () => {
    const props = {
      collectionsMetadata: {
        collectionId1: {},
        collectionId2: {}
      },
      hasGranulesOrCwic: true,
      pathname: '/path/here',
      focusedCollection: null,
      projectCollections: {
        allIds: ['collectionId1', 'collectionId2'],
        byId: {
          collectionId1: {
            accessMethods: {
              swodlr: {
                id: 'S3084748458-POCLOUD',
                isValid: true,
                longName: 'PODAAC SWOT On-Demand Level 2 Raster Generation (SWODLR)',
                name: 'PODAAC_SWODLR',
                type: 'SWODLR',
                supportsSwodlr: true,
                url: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
                swodlrData: {
                  params: {
                    rasterResolution: 90,
                    outputSamplingGridType: 'UTM',
                    outputGranuleExtentFlag: false
                  },
                  custom_params: {
                    'G3225437730-POCLOUD': {
                      utmZoneAdjust: 1,
                      mgrsBandAdjust: 0
                    },
                    'G3225437639-POCLOUD': {
                      utmZoneAdjust: 0,
                      mgrsBandAdjust: -1
                    }
                  }
                }
              }
            },
            selectedAccessMethod: 'swodlr'
          },
          collectionId2: {}
        }
      }
    }

    expect(encodeUrlQuery(props)).toEqual('/path/here?p=!collectionId1!collectionId2&pg[1][v]=f&pg[1][m]=swodlr&pg[1][swod][params][rasterResolution]=90&pg[1][swod][params][outputSamplingGridType]=UTM&pg[1][swod][params][outputGranuleExtentFlag]=false&pg[1][swod][custom_params][G3225437730-POCLOUD][utmZoneAdjust]=1&pg[1][swod][custom_params][G3225437730-POCLOUD][mgrsBandAdjust]=0&pg[1][swod][custom_params][G3225437639-POCLOUD][utmZoneAdjust]=0&pg[1][swod][custom_params][G3225437639-POCLOUD][mgrsBandAdjust]=-1&pg[1][cd]=f&pg[2][v]=f')
  })
})
