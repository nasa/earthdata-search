import projectReducer, { initialGranuleState } from '../project'
import {
  ADD_ACCESS_METHODS,
  ADD_COLLECTION_TO_PROJECT,
  ADD_GRANULE_TO_PROJECT_COLLECTION,
  ADD_MORE_PROJECT_GRANULE_RESULTS,
  ERRORED_PROJECT_GRANULES,
  FINISHED_PROJECT_GRANULES_TIMER,
  PROJECT_GRANULES_LOADED,
  PROJECT_GRANULES_LOADING,
  REMOVE_COLLECTION_FROM_PROJECT,
  REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
  RESTORE_FROM_URL,
  SELECT_ACCESS_METHOD,
  STARTED_PROJECT_GRANULES_TIMER,
  SUBMITTED_PROJECT,
  SUBMITTING_PROJECT,
  TOGGLE_COLLECTION_VISIBILITY,
  UPDATE_ACCESS_METHOD,
  UPDATE_PROJECT_GRANULE_PARAMS,
  UPDATE_PROJECT_GRANULE_RESULTS
} from '../../constants/actionTypes'

const initialState = {
  collections: {
    allIds: [],
    byId: {}
  },
  isSubmitted: false,
  isSubmitting: false
}

describe('INITIAL_STATE', () => {
  test('is correct', () => {
    const action = { type: 'dummy_action' }

    expect(projectReducer(undefined, action)).toEqual(initialState)
  })
})

describe('ADD_COLLECTION_TO_PROJECT', () => {
  test('returns the correct state', () => {
    const collectionId = 'collectionId'

    const action = {
      type: ADD_COLLECTION_TO_PROJECT,
      payload: collectionId
    }

    const expectedState = {
      ...initialState,
      collections: {
        allIds: [collectionId],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            },
            isVisible: true
          }
        }
      }
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
  })

  test('returns the correct state if the collection is already in the project', () => {
    const collectionId = 'collectionId'

    const action = {
      type: ADD_COLLECTION_TO_PROJECT,
      payload: collectionId
    }

    const initial = {
      ...initialState,
      collections: {
        allIds: [collectionId],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      collections: {
        allIds: [collectionId],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('ADD_GRANULE_TO_PROJECT_COLLECTION', () => {
  describe('when there are no removed granules', () => {
    test('returns the correct state', () => {
      const action = {
        type: ADD_GRANULE_TO_PROJECT_COLLECTION,
        payload: {
          collectionId: 'collectionId',
          granuleId: 'granuleId'
        }
      }

      const initial = {
        ...initialState,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {}
            }
          }
        }
      }

      const expectedState = {
        ...initial,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                addedGranuleIds: ['granuleId']
              }
            }
          }
        }
      }

      expect(projectReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('when there are removed granules', () => {
    test('returns the correct state', () => {
      const action = {
        type: ADD_GRANULE_TO_PROJECT_COLLECTION,
        payload: {
          collectionId: 'collectionId',
          granuleId: 'granuleId1'
        }
      }

      const initial = {
        ...initialState,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                removedGranuleIds: ['granuleId1', 'granuleId2']
              }
            }
          }
        }
      }

      const expectedState = {
        ...initial,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                removedGranuleIds: ['granuleId2']
              }
            }
          }
        }
      }

      expect(projectReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('when the granule is already added', () => {
    test('returns the correct state', () => {
      const action = {
        type: ADD_GRANULE_TO_PROJECT_COLLECTION,
        payload: {
          collectionId: 'collectionId',
          granuleId: 'granuleId'
        }
      }

      const initial = {
        ...initialState,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                addedGranuleIds: ['granuleId']
              }
            }
          }
        }
      }

      const expectedState = {
        ...initial,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                addedGranuleIds: ['granuleId']
              }
            }
          }
        }
      }

      expect(projectReducer(initial, action)).toEqual(expectedState)
    })
  })

  test('returns the correct state if collection is not a project collection', () => {
    const collectionId = 'collectionId'

    const action = {
      type: ADD_GRANULE_TO_PROJECT_COLLECTION,
      payload: collectionId
    }

    const initial = {
      ...initialState,
      collections: {
        allIds: [],
        byId: {}
      }
    }

    const expectedState = {
      ...initial
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('REMOVE_GRANULE_FROM_PROJECT_COLLECTION', () => {
  describe('when the collection is not in the current project', () => {
    test('returns the correct state', () => {
      const action = {
        type: REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
        payload: {
          collectionId: 'collectionId2',
          granuleId: 'granuleId'
        }
      }

      const initial = {
        ...initialState,
        collections: {
          allIds: ['collectionId1'],
          byId: {
            collectionId1: {}
          }
        }
      }

      const expectedState = {
        ...initial
      }

      expect(projectReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('when there are no added granules', () => {
    test('returns the correct state', () => {
      const action = {
        type: REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
        payload: {
          collectionId: 'collectionId',
          granuleId: 'granuleId'
        }
      }

      const initial = {
        ...initialState,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {}
            }
          }
        }
      }

      const expectedState = {
        ...initial,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                removedGranuleIds: ['granuleId']
              }
            }
          }
        }
      }

      expect(projectReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('when there are added granules', () => {
    test('returns the correct state', () => {
      const action = {
        type: REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
        payload: {
          collectionId: 'collectionId',
          granuleId: 'granuleId1'
        }
      }

      const initial = {
        ...initialState,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                addedGranuleIds: ['granuleId1', 'granuleId2']
              }
            }
          }
        }
      }

      const expectedState = {
        ...initial,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                addedGranuleIds: ['granuleId2']
              }
            }
          }
        }
      }

      expect(projectReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('when the granule has already been removed', () => {
    test('returns the correct state', () => {
      const action = {
        type: REMOVE_GRANULE_FROM_PROJECT_COLLECTION,
        payload: {
          collectionId: 'collectionId',
          granuleId: 'granuleId2'
        }
      }

      const initial = {
        ...initialState,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                removedGranuleIds: ['granuleId1', 'granuleId2']
              }
            }
          }
        }
      }

      const expectedState = {
        ...initial,
        collections: {
          allIds: ['collectionId'],
          byId: {
            collectionId: {
              granules: {
                removedGranuleIds: ['granuleId1', 'granuleId2']
              }
            }
          }
        }
      }

      expect(projectReducer(initial, action)).toEqual(expectedState)
    })
  })
})

describe('REMOVE_COLLECTION_FROM_PROJECT', () => {
  describe('when the collection is in the project', () => {
    test('returns the correct state', () => {
      const collectionId = 'collectionId'

      const action = {
        type: REMOVE_COLLECTION_FROM_PROJECT,
        payload: collectionId
      }

      const initial = {
        ...initialState,
        collections: {
          allIds: ['existingCollectionId', collectionId, 'anotherExistingCollectionId'],
          byId: {
            existingCollectionId: {},
            collectionId: {},
            anotherExistingCollectionId: {}
          }
        }
      }

      const expectedState = {
        ...initial,
        collections: {
          allIds: ['existingCollectionId', 'anotherExistingCollectionId'],
          byId: {
            existingCollectionId: {},
            anotherExistingCollectionId: {}
          }
        }
      }

      expect(projectReducer(initial, action)).toEqual(expectedState)
    })
  })

  describe('when the collection is not in the project', () => {
    test('returns the correct state', () => {
      const collectionId = 'collectionId'

      const action = {
        type: REMOVE_COLLECTION_FROM_PROJECT,
        payload: collectionId
      }

      const initial = {
        ...initialState,
        collections: {
          allIds: ['existingCollectionId', 'anotherExistingCollectionId'],
          byId: {
            existingCollectionId: {},
            anotherExistingCollectionId: {}
          }
        }
      }

      const expectedState = {
        ...initial,
        collections: {
          allIds: ['existingCollectionId', 'anotherExistingCollectionId'],
          byId: {
            existingCollectionId: {},
            anotherExistingCollectionId: {}
          }
        }
      }

      expect(projectReducer(initial, action)).toEqual(expectedState)
    })
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        project: {
          collections: {
            allIds: ['collectionId'],
            byId: {
              collectionId: {}
            }
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {}
        }
      }
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SELECT_ACCESS_METHOD', () => {
  test('returns the correct state', () => {
    const action = {
      type: SELECT_ACCESS_METHOD,
      payload: {
        collectionId: 'collectionId',
        selectedAccessMethod: 'download'
      }
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {}
        }
      }
    }

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            selectedAccessMethod: 'download'
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('ADD_ACCESS_METHODS', () => {
  test('returns the correct state', () => {
    const action = {
      type: ADD_ACCESS_METHODS,
      payload: {
        collectionId: 'collectionId',
        methods: {
          download: {
            type: 'download'
          }
        }
      }
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {}
        }
      }
    }

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })

  test('returns the correct state when there is a selectedAccessMethod', () => {
    const action = {
      type: ADD_ACCESS_METHODS,
      payload: {
        collectionId: 'collectionId',
        methods: {
          download: {
            type: 'download'
          }
        },
        selectedAccessMethod: 'download'
      }
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {}
        }
      }
    }

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            accessMethods: {
              download: {
                type: 'download'
              }
            },
            selectedAccessMethod: 'download'
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_ACCESS_METHOD', () => {
  test('returns the correct state', () => {
    const collectionId = 'collectionId'

    const action = {
      type: UPDATE_ACCESS_METHOD,
      payload: {
        collectionId,
        method: {
          echoOrder: {
            model: 'form model'
          }
        }
      }
    }

    const initial = {
      ...initialState,
      collections: {
        allIds: [collectionId],
        byId: {
          collectionId: {
            accessMethods: {
              echoOrder: {
                type: 'ECHO ORDERS'
              }
            }
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      collections: {
        allIds: [collectionId],
        byId: {
          collectionId: {
            accessMethods: {
              echoOrder: {
                type: 'ECHO ORDERS',
                model: 'form model'
              }
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('SUBMITTING_PROJECT', () => {
  test('returns the correct state', () => {
    const action = {
      type: SUBMITTING_PROJECT
    }

    const expectedState = {
      ...initialState,
      isSubmitted: false,
      isSubmitting: true
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SUBMITTED_PROJECT', () => {
  test('returns the correct state', () => {
    const action = {
      type: SUBMITTED_PROJECT
    }

    const expectedState = {
      ...initialState,
      isSubmitted: true,
      isSubmitting: false
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('STARTED_PROJECT_GRANULES_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: STARTED_PROJECT_GRANULES_TIMER,
      payload: 'collectionId'
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {}
        }
      }
    }

    jest.spyOn(Date, 'now').mockImplementation(() => 5)

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              timerStart: 5
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('ERRORED_PROJECT_GRANULES', () => {
  test('returns the correct state', () => {
    const action = {
      type: ERRORED_PROJECT_GRANULES,
      payload: 'collectionId'
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              isErrored: true,
              isLoaded: true
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('FINISHED_PROJECT_GRANULES_TIMER', () => {
  test('returns the correct state', () => {
    const action = {
      type: FINISHED_PROJECT_GRANULES_TIMER,
      payload: 'collectionId'
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              timerStart: 5
            }
          }
        }
      }
    }

    jest.spyOn(Date, 'now').mockImplementation(() => 7)

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              timerStart: null,
              loadTime: 2
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('PROJECT_GRANULES_LOADED', () => {
  test('returns the correct state', () => {
    const action = {
      type: PROJECT_GRANULES_LOADED,
      payload: {
        collectionId: 'collectionId',
        loaded: true
      }
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              isLoaded: true
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('PROJECT_GRANULES_LOADING', () => {
  test('returns the correct state', () => {
    const action = {
      type: PROJECT_GRANULES_LOADING,
      payload: 'collectionId'
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              isLoading: true
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('ADD_MORE_PROJECT_GRANULE_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: ADD_MORE_PROJECT_GRANULE_RESULTS,
      payload: {
        collectionId: 'collectionId',
        results: [{
          id: 'granuleId2'
        }]
      }
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              allIds: ['granuleId1']
            }
          }
        }
      }
    }

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              allIds: ['granuleId1', 'granuleId2']
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_PROJECT_GRANULE_RESULTS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_PROJECT_GRANULE_RESULTS,
      payload: {
        collectionId: 'collectionId',
        results: [{
          id: 'granuleId'
        }],
        isOpenSearch: false,
        hits: 1,
        totalSize: {
          size: '42',
          units: 'MB'
        },
        singleGranuleSize: 42
      }
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              allIds: ['granuleId'],
              isOpenSearch: false,
              hits: 1,
              totalSize: {
                size: '42',
                units: 'MB'
              },
              singleGranuleSize: 42
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('UPDATE_PROJECT_GRANULE_PARAMS', () => {
  test('returns the correct state', () => {
    const action = {
      type: UPDATE_PROJECT_GRANULE_PARAMS,
      payload: {
        collectionId: 'collectionId',
        pageNum: 1
      }
    }

    const initial = {
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState
            }
          }
        }
      }
    }

    const expectedState = {
      ...initial,
      collections: {
        allIds: ['collectionId'],
        byId: {
          collectionId: {
            granules: {
              ...initialGranuleState,
              params: {
                pageNum: 1
              }
            }
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
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
      collections: {
        byId: {
          collectionId: {
            isVisible: true
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      collections: {
        byId: {
          collectionId: {
            isVisible: false
          }
        }
      }
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})
