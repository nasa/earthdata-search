import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import { updateIsAuthorized, adminIsAuthorized } from '../isAuthorized'
import { SET_ADMIN_IS_AUTHORIZED } from '../../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

describe('updateIsAuthorized', () => {
  test('should create an action to update the isAuthorized state', () => {
    const payload = true

    const expectedAction = {
      type: SET_ADMIN_IS_AUTHORIZED,
      payload
    }

    expect(updateIsAuthorized(payload)).toEqual(expectedAction)
  })
})

describe('adminIsAuthorized', () => {
  test('calls lambda to determine if the user is authorized', async () => {
    nock(/localhost/)
      .get(/admin\/is_authorized/)
      .reply(200, { authorized: true })

    const store = mockStore({
      authToken: 'mockToken'
    })

    await store.dispatch(adminIsAuthorized()).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        type: SET_ADMIN_IS_AUTHORIZED,
        payload: true
      })
    })
  })
})
