import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  SET_RETRIEVAL_COLLECTION_LOADING,
  UPDATE_RETRIEVAL_COLLECTION
} from '../../constants/actionTypes'

import {
  fetchRetrievalCollection,
  setRetrievalCollectionLoading,
  updateRetrievalCollection
} from '../retrievalCollection'

import useEdscStore from '../../zustand/useEdscStore'

const mockStore = configureMockStore([thunk])

describe('setRetrievalCollectionLoading', () => {
  test('should create an action to update the search query', () => {
    const payload = []
    const expectedAction = {
      type: SET_RETRIEVAL_COLLECTION_LOADING,
      payload
    }
    expect(setRetrievalCollectionLoading(payload)).toEqual(expectedAction)
  })
})

describe('updateRetrievalCollection', () => {
  test('should create an action to update the search query', () => {
    const expectedAction = {
      type: UPDATE_RETRIEVAL_COLLECTION
    }
    expect(updateRetrievalCollection()).toEqual(expectedAction)
  })
})

describe('fetchRetrievalCollection', () => {
  test('calls lambda to get retrieval collections', async () => {
    nock(/localhost/)
      .get(/retrieval_collections\/1234/)
      .reply(200, {
        id: 1234,
        retrieval_id: '1523485690',
        mock: 'data'
      })

    // MockStore with initialState
    const store = mockStore({
      authToken: 'token'
    })

    // Call the dispatch
    await store.dispatch(fetchRetrievalCollection(1234)).then(() => {
      const storeActions = store.getActions()

      expect(storeActions[0]).toEqual({
        type: SET_RETRIEVAL_COLLECTION_LOADING,
        payload: { id: 1234 }
      })

      expect(storeActions[1]).toEqual({
        type: UPDATE_RETRIEVAL_COLLECTION,
        payload: {
          id: 1234,
          retrieval_id: '1523485690',
          mock: 'data',
          isLoaded: true
        }
      })
    })
  })

  test('does not call updateRegionResults on error', async () => {
    useEdscStore.setState({
      errors: {
        ...useEdscStore.getState().errors,
        handleError: jest.fn()
      }
    })

    nock(/localhost/)
      .get(/retrieval_collections\/1234/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: 'token'
    })

    await store.dispatch(fetchRetrievalCollection(1234)).then(() => {
      const storeActions = store.getActions()

      expect(storeActions[0]).toEqual({
        type: SET_RETRIEVAL_COLLECTION_LOADING,
        payload: { id: 1234 }
      })

      const { errors } = useEdscStore.getState()
      expect(errors.handleError).toHaveBeenCalledTimes(1)
      expect(errors.handleError).toHaveBeenCalledWith(expect.objectContaining({
        action: 'fetchRetrievalCollection',
        resource: 'collection'
      }))
    })
  })
})
