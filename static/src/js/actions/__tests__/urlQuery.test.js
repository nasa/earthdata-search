import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import { changePath, changeUrl } from '../urlQuery'

const mockStore = configureMockStore([thunk])

describe('changePath', () => {

})

describe('changeUrl', () => {
  describe('when called with a string', () => {
    test('calls replace when the pathname has not changed', () => {
      const newPath = '/search?p=C00001-EDSC'

      const store = mockStore({
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'replace'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })

    test('calls push when the pathname has changed', () => {
      const newPath = '/search/granules?p=C00001-EDSC'

      const store = mockStore({
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'push'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })
  })


  describe('when called with an object', () => {
    test('calls replace when the pathname has not changed', () => {
      const newPath = {
        pathname: '/search',
        search: '?p=C00001-EDSC'
      }

      const store = mockStore({
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'replace'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })

    test('calls push when the pathname has changed', () => {
      const newPath = {
        pathname: '/granules',
        search: '?p=C00001-EDSC'
      }

      const store = mockStore({
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'push'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })
  })
})
