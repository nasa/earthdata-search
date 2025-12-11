import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { toggleFacetsModal } from '../ui'

import { TOGGLE_VIEW_ALL_FACETS_MODAL } from '../../constants/actionTypes'

const mockStore = configureMockStore([thunk])

describe('toggleFacetsModal', () => {
  test('should create an action to update the state', () => {
    const store = mockStore({
      ui: {
        facetsModal: {
          isOpen: false
        }
      }
    })

    const payload = true
    store.dispatch(toggleFacetsModal(payload))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      type: TOGGLE_VIEW_ALL_FACETS_MODAL,
      payload: true
    })
  })
})
