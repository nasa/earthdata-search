import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { SET_PROVIDERS } from '../../constants/actionTypes'
import { setProviders, fetchProviders } from '../providers'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
})

describe('setProviders', () => {
  test('should create an action to set providers', () => {
    const payload = [
      {
        provider: {
          id: 'abcd-1234-efgh-5678',
          organization_name: 'EDSC-TEST',
          provider_id: 'EDSC-TEST'
        }
      }, {
        provider: {
          id: 'abcd-1234-efgh-5678',
          organization_name: 'NONE-EDSC-TEST',
          provider_id: 'NONE-EDSC-TEST'
        }
      }
    ]

    const expectedAction = {
      type: SET_PROVIDERS,
      payload
    }

    expect(setProviders(payload)).toEqual(expectedAction)
  })
})

describe('fetchProviders', () => {
  test('should load providers', async () => {
    nock(/localhost/)
      .get(/providers/)
      .reply(200, [
        {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'EDSC-TEST',
            provider_id: 'EDSC-TEST'
          }
        }, {
          provider: {
            id: 'abcd-1234-efgh-5678',
            organization_name: 'NONE-EDSC-TEST',
            provider_id: 'NONE-EDSC-TEST'
          }
        }
      ])

    const payload = [
      {
        provider: {
          id: 'abcd-1234-efgh-5678',
          organization_name: 'EDSC-TEST',
          provider_id: 'EDSC-TEST'
        }
      }, {
        provider: {
          id: 'abcd-1234-efgh-5678',
          organization_name: 'NONE-EDSC-TEST',
          provider_id: 'NONE-EDSC-TEST'
        }
      }
    ]

    // mockStore with initialState
    const store = mockStore({
      authToken: 'token',
      providers: []
    })

    // call the dispatch
    await store.dispatch(fetchProviders())

    // Is setProviders called with the right payload
    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: SET_PROVIDERS,
      payload
    })
  })

  test('should not fetch providers if user is not logged in', async () => {
    // mockStore with initialState
    const store = mockStore({
      authToken: '',
      providers: []
    })

    // call the dispatch
    await store.dispatch(fetchProviders()).then(() => {
      // Is setProviders called with the right payload
      const storeActions = store.getActions()
      expect(storeActions.length).toBe(0)
    })
  })
})
