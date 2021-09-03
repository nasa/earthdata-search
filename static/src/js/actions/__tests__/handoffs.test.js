import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import {
  setSotoLayers,
  fetchSotoLayers
} from '../handoffs'

import {
  SET_SOTO_LAYERS
} from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setSotoLayers', () => {
  test('should create an action to update the search query', () => {
    const payload = ['layer1', 'layer2']
    const expectedAction = {
      type: SET_SOTO_LAYERS,
      payload
    }
    expect(setSotoLayers(payload)).toEqual(expectedAction)
  })
})

describe('fetchSotoLayers', () => {
  test('calls lambda to get sotoLayers', async () => {
    nock(/localhost/)
      .get(/soto_layers/)
      .reply(200, ['layer1', 'layer2'])

    const store = mockStore({
      authToken: ''
    })

    await store.dispatch(fetchSotoLayers()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_SOTO_LAYERS,
        payload: ['layer1', 'layer2']
      })
    })
  })

  test('does not call lambda to get sotoLayers if layers already exist in the store', async () => {
    const store = mockStore({
      handoffs: {
        sotoLayers: ['layer1', 'layer2']
      }
    })

    const result = await store.dispatch(fetchSotoLayers())

    expect(result).toBe(null)
  })

  test('does not call setSotoLayers on error', async () => {
    nock(/localhost/)
      .get(/soto_layers/)
      .reply(500)

    nock(/localhost/)
      .post(/error_logger/)
      .reply(200)

    const store = mockStore({
      authToken: ''
    })

    const consoleMock = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())

    await store.dispatch(fetchSotoLayers()).then(() => {
      expect(consoleMock).toHaveBeenCalledTimes(1)
    })
  })
})
