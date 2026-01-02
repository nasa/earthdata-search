import routerHelper from '../../../router/router'

import { changeUrl } from '../changeUrl'

describe('changeUrl', () => {
  describe('when called with a string', () => {
    beforeEach(() => {
      routerHelper.router!.state = {
        location: {
          pathname: '/search',
          search: '?p=C00001-EDSC'
        }
      }
    })

    test('calls replace when the pathname has not changed', () => {
      const newPath = '/search?p=C00001-EDSC'

      changeUrl(newPath)

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router?.navigate).toHaveBeenCalledWith(newPath, { replace: true })
    })

    test('calls push when the pathname has changed', () => {
      const newPath = '/search/granules?p=C00001-EDSC'

      changeUrl(newPath)

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router?.navigate).toHaveBeenCalledWith(newPath, { replace: false })
    })
  })

  describe('when called with an object', () => {
    test('calls replace when the pathname has not changed', () => {
      const newPath = {
        pathname: '/search',
        search: '?p=C00001-EDSC'
      }

      routerHelper.router!.state = {
        location: {
          pathname: '/search',
          search: ''
        }
      }

      changeUrl(newPath)

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router?.navigate).toHaveBeenCalledWith(newPath, { replace: true })
    })

    test('calls push when the pathname has changed', () => {
      const newPath = {
        pathname: '/granules',
        search: '?p=C00001-EDSC'
      }

      routerHelper.router!.state = {
        location: {
          pathname: '/search',
          search: ''
        }
      }

      changeUrl(newPath)

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router?.navigate).toHaveBeenCalledWith(newPath, { replace: false })
    })
  })
})
