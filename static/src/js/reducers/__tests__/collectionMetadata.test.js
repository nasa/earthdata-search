import collectionMetadataReducer from '../collectionMetadata'
import {
  CLEAR_COLLECTION_GRANULES,
  CLEAR_EXCLUDE_GRANULE_ID,
  EXCLUDE_GRANULE_ID,
  UNDO_EXCLUDE_GRANULE_ID,
  UPDATE_COLLECTION_METADATA,
  TOGGLE_COLLECTION_VISIBILITY,
  RESTORE_FROM_URL,
  STARTED_GRANULES_TIMER,
  LOADED_GRANULES,
  FINISHED_GRANULES_TIMER,
  LOADING_GRANULES,
  ADD_MORE_GRANULE_RESULTS,
  UPDATE_GRANULE_RESULTS,
  UPDATE_COLLECTION_GRANULE_FILTERS,
  RESET_GRANULE_RESULTS,
  UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS
} from '../../constants/actionTypes'

const initialState = {
  allIds: [],
  byId: {}
}

const initialStateWithCollection = {
  allIds: ['collectionId'],
  byId: {
    collectionId: {
      granules: {}
    }
  }
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(collectionMetadataReducer(undefined, action)).toEqual(initialState)
  })
})

describe('CLEAR_COLLECTION_GRANULES', () => {
  test('return the correct state', () => {
    const action = {
      type: CLEAR_COLLECTION_GRANULES
    }

    const initial = {
      allIds: ['collection1', 'collection2'],
      byId: {
        collection1: {
          excludedGranuleIds: ['granule1'],
          granules: {
            allIds: ['collection1-granule1', 'collection1-granule2'],
            byId: {
              'collection1-granule1': {
                mock: 'granule1'
              },
              'collection1-granule2': {
                mock: 'granule2'
              }
            }
          },
          metadata: {
            mock: 'collection1'
          }
        },
        collection2: {
          excludedGranuleIds: [],
          granules: {
            allIds: ['collection2-granule1', 'collection2-granule2'],
            byId: {
              'collection2-granule1': {
                mock: 'granule1'
              },
              'collection2-granule2': {
                mock: 'granule2'
              }
            }
          },
          metadata: {
            mock: 'collection2'
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['collection1', 'collection2'],
      byId: {
        collection1: {
          excludedGranuleIds: ['granule1'],
          granules: {},
          metadata: {
            mock: 'collection1'
          }
        },
        collection2: {
          excludedGranuleIds: [],
          granules: {},
          metadata: {
            mock: 'collection2'
          }
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_COLLECTION_METADATA', () => {
  test('returns the correct state when collection has not been visited yet', () => {
    const action = {
      type: UPDATE_COLLECTION_METADATA,
      payload: [{
        collectionId: {
          mock: 'data'
        }
      }]
    }

    const expectedState = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          currentCollectionGranuleParams: {},
          excludedGranuleIds: [],
          formattedMetadata: undefined,
          granuleFilters: { sortKey: '-start_date' },
          granules: {},
          isCwic: undefined,
          isVisible: true,
          metadata: undefined,
          ummMetadata: undefined
        }
      }
    }

    expect(collectionMetadataReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the correct state when collection has been visited', () => {
    const action = {
      type: UPDATE_COLLECTION_METADATA,
      payload: [{
        collectionId: {
          mock: 'data'
        }
      }]
    }

    const initial = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {
            allIds: ['granuleId1'],
            byId: {
              granuleId1: {
                mock: 'data'
              }
            }
          },
          isVisible: true
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {
            allIds: ['granuleId1'],
            byId: {
              granuleId1: {
                mock: 'data'
              }
            }
          },
          isVisible: true,
          isCwic: undefined,
          metadata: undefined,
          ummMetadata: undefined,
          formattedMetadata: undefined
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('return the correct state', () => {
    const payload = {
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {},
          metadata: {}
        }
      }
    }
    const action = {
      type: RESTORE_FROM_URL,
      payload: { collections: payload }
    }

    const expectedState = {
      ...initialState,
      ...payload
    }

    expect(collectionMetadataReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('EXCLUDE_GRANULE_ID', () => {
  test('returns the correct state', () => {
    const action = {
      type: EXCLUDE_GRANULE_ID,
      payload: {
        collectionId: 'collectionId',
        granuleId: 'granuleId1'
      }
    }

    const initial = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: [],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UNDO_EXCLUDE_GRANULE_ID', () => {
  test('returns the correct state', () => {
    const action = {
      type: UNDO_EXCLUDE_GRANULE_ID,
      payload: 'collectionId'
    }

    const initial = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1', 'granuleId2'],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['collectionId'],
      byId: {
        collectionId: {
          excludedGranuleIds: ['granuleId1'],
          granules: {},
          metadata: {
            mock: 'data'
          }
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('TOGGLE_COLLECTION_VISIBILITY', () => {
  test('returns the correct state', () => {
    const action = {
      type: TOGGLE_COLLECTION_VISIBILITY,
      payload: 'collectionId'
    }

    const initial = {
      ...initialState,
      byId: {
        collectionId: {
          isVisible: true
        }
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          isVisible: false
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('CLEAR_EXCLUDE_GRANULE_ID', () => {
  test('returns the correct state', () => {
    const action = {
      type: CLEAR_EXCLUDE_GRANULE_ID
    }

    const initialState = {
      allIds: ['collection1', 'collection2'],
      byId: {
        collection1: {
          excludedGranuleIds: ['granule1', 'granule2'],
          granules: {
            allIds: ['granule1'],
            byId: {
              granule1: {
                mock: 'granule1'
              }
            }
          },
          metadata: {
            mock: 'collection1'
          }
        },
        collection2: {
          excludedGranuleIds: ['granule1'],
          granules: {
            allIds: ['granule1'],
            byId: {
              granule1: {
                mock: 'granule1'
              }
            }
          },
          metadata: {
            mock: 'collection1'
          }
        },
        collection3: {
          granules: {
            allIds: ['granule1'],
            byId: {
              granule1: {
                mock: 'granule1'
              }
            }
          },
          metadata: {
            mock: 'collection2'
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      allIds: ['collection1', 'collection2'],
      byId: {
        collection1: {
          excludedGranuleIds: [],
          granules: {
            allIds: ['granule1'],
            byId: {
              granule1: {
                mock: 'granule1'
              }
            }
          },
          metadata: {
            mock: 'collection1'
          }
        },
        collection2: {
          excludedGranuleIds: [],
          granules: {
            allIds: ['granule1'],
            byId: {
              granule1: {
                mock: 'granule1'
              }
            }
          },
          metadata: {
            mock: 'collection1'
          }
        },
        collection3: {
          granules: {
            allIds: ['granule1'],
            byId: {
              granule1: {
                mock: 'granule1'
              }
            }
          },
          metadata: {
            mock: 'collection2'
          }
        }
      }
    }

    expect(collectionMetadataReducer(initialState, action)).toEqual(expectedState)
  })
})

describe('UPDATE_COLLECTION_GRANULE_FILTERS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_COLLECTION_GRANULE_FILTERS,
      payload: {
        id: 'collectionId',
        granuleFilters: {
          mockFilter: true
        }
      }
    }

    const expectedState = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {},
          granuleFilters: {
            mockFilter: true
          }
        }
      }
    }

    expect(collectionMetadataReducer(initialStateWithCollection, action)).toEqual(expectedState)
  })
})

describe('UPDATE_GRANULE_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_GRANULE_RESULTS,
      payload: {
        collectionId: 'collectionId',
        results: [{
          id: 'mockGranuleId',
          mockGranuleData: 'goes here'
        }],
        hits: 1,
        isCwic: true,
        totalSize: {
          size: '1.0',
          unit: 'MB'
        }
      }
    }

    const expectedState = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {
            allIds: ['mockGranuleId'],
            byId: {
              mockGranuleId: {
                id: 'mockGranuleId',
                mockGranuleData: 'goes here'
              }
            },
            hits: 1,
            isCwic: true,
            totalSize: {
              size: '1.0',
              unit: 'MB'
            }
          }
        }
      }
    }

    expect(collectionMetadataReducer(initialStateWithCollection, action)).toEqual(expectedState)
  })
})

describe('ADD_MORE_GRANULE_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: ADD_MORE_GRANULE_RESULTS,
      payload: {
        collectionId: 'collectionId',
        results: [{
          id: 'mockCollectionId2',
          mockGranuleData: 'goes here 2'
        }],
        hits: 0,
        keyword: 'search keyword'
      }
    }

    const initial = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {
            allIds: ['mockGranuleId1'],
            byId: {
              mockGranuleId1: {
                id: 'mockGranuleId1',
                mockGranuleData: 'goes here 1'
              }
            },
            hits: 2,
            isCwic: true,
            totalSize: {
              size: '2.0',
              unit: 'MB'
            }
          }
        }
      }
    }

    const expectedState = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {
            allIds: ['mockGranuleId1', 'mockCollectionId2'],
            byId: {
              mockGranuleId1: {
                id: 'mockGranuleId1',
                mockGranuleData: 'goes here 1'
              },
              mockCollectionId2: {
                id: 'mockCollectionId2',
                mockGranuleData: 'goes here 2'
              }
            },
            hits: 2,
            isCwic: true,
            totalSize: {
              size: '2.0',
              unit: 'MB'
            }
          }
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('LOADING_GRANULES', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADING_GRANULES,
      payload: 'collectionId'
    }

    const expectedState = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {
            isLoading: true,
            isLoaded: false
          }
        }
      }
    }

    expect(collectionMetadataReducer(initialStateWithCollection, action)).toEqual(expectedState)
  })
})

describe('LOADED_GRANULES', () => {
  test('returns the correct state', () => {
    const action = {
      type: LOADED_GRANULES,
      payload: {
        collectionId: 'collectionId',
        loaded: true
      }
    }

    const expectedState = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {
            isLoading: false,
            isLoaded: true
          }
        }
      }
    }

    expect(collectionMetadataReducer(initialStateWithCollection, action)).toEqual(expectedState)
  })
})

describe('STARTED_GRANULES_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: STARTED_GRANULES_TIMER,
      payload: 'collectionId'
    }

    // Mock current time to equal 5
    jest.spyOn(Date, 'now').mockImplementation(() => 5)

    const expectedState = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {
            timerStart: 5
          }
        }
      }
    }

    expect(collectionMetadataReducer(initialStateWithCollection, action)).toEqual(expectedState)
  })
})

describe('FINISHED_GRANULES_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: FINISHED_GRANULES_TIMER,
      payload: 'collectionId'
    }

    // Set current time to 10, and future time to 15
    // Load time will equal 5
    jest.spyOn(Date, 'now').mockImplementation(() => 15)

    const start = 10

    const initial = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {
            timerStart: start
          }
        }
      }
    }

    const expectedState = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {
            timerStart: null,
            loadTime: 5
          }
        }
      }
    }

    expect(collectionMetadataReducer(initial, action)).toEqual(expectedState)
  })
})

describe('RESET_GRANULE_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: RESET_GRANULE_RESULTS,
      payload: 'collectionId'
    }

    const expectedState = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          granules: {
            allIds: [],
            byId: {},
            hits: null,
            isCwic: null,
            isLoaded: false,
            isLoading: false,
            loadTime: 0,
            timerStart: null
          }
        }
      }
    }

    expect(collectionMetadataReducer(initialStateWithCollection, action)).toEqual(expectedState)
  })
})

describe('UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_CURRENT_COLLECTION_GRANULE_PARAMS,
      payload: {
        collectionId: 'collectionId',
        granuleParams: {
          mock: 'params'
        }
      }
    }

    const expectedState = {
      ...initialStateWithCollection,
      byId: {
        collectionId: {
          currentCollectionGranuleParams: {
            mock: 'params'
          },
          granules: {}
        }
      }
    }

    expect(collectionMetadataReducer(initialStateWithCollection, action)).toEqual(expectedState)
  })
})
