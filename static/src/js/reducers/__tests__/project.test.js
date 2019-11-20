import projectReducer from '../project'
import {
  ADD_ACCESS_METHODS,
  ADD_COLLECTION_TO_PROJECT,
  REMOVE_COLLECTION_FROM_PROJECT,
  SELECT_ACCESS_METHOD,
  UPDATE_ACCESS_METHOD,
  RESTORE_FROM_URL,
  SUBMITTING_PROJECT,
  SUBMITTED_PROJECT
} from '../../constants/actionTypes'

const initialState = {
  byId: {},
  collectionIds: [],
  collectionsRequiringChunking: [],
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

    const initial = {
      ...initialState,
      collectionIds: ['existingCollectionId']
    }

    const expectedState = {
      ...initial,
      byId: {
        collectionId: {}
      },
      collectionIds: ['existingCollectionId', collectionId]
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })

  test('returns the correct state if collection is already a project collection', () => {
    const collectionId = 'collectionId'

    const action = {
      type: ADD_COLLECTION_TO_PROJECT,
      payload: collectionId
    }

    const initial = {
      ...initialState,
      collectionIds: [collectionId]
    }

    const expectedState = {
      ...initial,
      collectionIds: [collectionId]
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('REMOVE_COLLECTION_FROM_PROJECT', () => {
  test('returns the correct state', () => {
    const collectionId = 'collectionId'

    const action = {
      type: REMOVE_COLLECTION_FROM_PROJECT,
      payload: collectionId
    }

    const initial = {
      ...initialState,
      collectionIds: ['existingCollectionId', collectionId, 'anotherExistingCollectionId']
    }

    const expectedState = {
      ...initial,
      collectionIds: ['existingCollectionId', 'anotherExistingCollectionId']
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })
})

describe('RESTORE_FROM_URL', () => {
  test('returns the correct state', () => {
    const collectionIds = ['collectionId']

    const action = {
      type: RESTORE_FROM_URL,
      payload: {
        project: {
          byId: {
            collectionId: {}
          },
          collectionIds
        }
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {}
      },
      collectionIds: ['collectionId'],
      collectionsRequiringChunking: []
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('SELECT_ACCESS_METHOD', () => {
  test('returns the correct state', () => {
    const collectionId = 'collectionId'

    const action = {
      type: SELECT_ACCESS_METHOD,
      payload: {
        collectionId,
        selectedAccessMethod: 'download'
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          selectedAccessMethod: 'download'
        }
      },
      collectionsRequiringChunking: []
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
  })
})

describe('ADD_ACCESS_METHODS', () => {
  test('returns the correct state', () => {
    const collectionId = 'collectionId'

    const action = {
      type: ADD_ACCESS_METHODS,
      payload: {
        collectionId,
        methods: {
          download: {
            type: 'download'
          }
        }
      }
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          accessMethods: {
            download: {
              type: 'download'
            }
          }
        }
      },
      collectionsRequiringChunking: []
    }

    expect(projectReducer(undefined, action)).toEqual(expectedState)
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
      byId: {
        collectionId: {
          accessMethods: {
            echoOrder: {
              type: 'ECHO ORDERS'
            }
          }
        }
      },
      collectionIds: [collectionId],
      collectionsRequiringChunking: [],
      isSubmitted: false,
      isSubmitting: false
    }

    const expectedState = {
      ...initialState,
      byId: {
        collectionId: {
          accessMethods: {
            echoOrder: {
              type: 'ECHO ORDERS',
              model: 'form model'
            }
          }
        }
      },
      collectionIds: [collectionId],
      collectionsRequiringChunking: []
    }

    expect(projectReducer(initial, action)).toEqual(expectedState)
  })

  describe('SUBMITTING_PROJECT', () => {
    test('returns the correct state', () => {
      const action = {
        type: SUBMITTING_PROJECT
      }

      const expectedState = {
        ...initialState,
        collectionsRequiringChunking: [],
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
        collectionsRequiringChunking: [],
        isSubmitted: true,
        isSubmitting: false
      }

      expect(projectReducer(undefined, action)).toEqual(expectedState)
    })
  })
})
