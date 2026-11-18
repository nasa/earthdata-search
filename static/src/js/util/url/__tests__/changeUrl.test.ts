import routerHelper from '../../../router/router'
import useEdscStore from '../../../zustand/useEdscStore'

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
      const newPath = '/search?p=C00002-EDSC'

      changeUrl(newPath)

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router?.navigate).toHaveBeenCalledWith(newPath, { replace: true })
    })

    test('does not navigate when the URL has not changed', () => {
      changeUrl('/search?p=C00001-EDSC')

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(0)
    })

    test('calls push when the pathname has changed', () => {
      const newPath = '/search/granules?p=C00001-EDSC'

      changeUrl(newPath)

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router?.navigate).toHaveBeenCalledWith(newPath, { replace: false })
    })

    test('preserves analytics parameters when updating the search query', async () => {
      routerHelper.router!.state = {
        location: {
          pathname: '/search',
          search: '?q=old&utm_source=test&utm_medium=agent&utm_campaign=launch&gclid=click-id&dclid=display-id&other=discarded'
        }
      }

      await changeUrl('/search?q=new')

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router?.navigate).toHaveBeenCalledWith(
        '/search?q=new&utm_source=test&utm_medium=agent&utm_campaign=launch&gclid=click-id&dclid=display-id',
        { replace: true }
      )
    })

    test('prefers analytics parameter values supplied in the new URL', async () => {
      routerHelper.router!.state = {
        location: {
          pathname: '/search',
          search: '?q=old&utm_source=original&utm_medium=email&utm_campaign=launch&gclid=old-click&dclid=old-display'
        }
      }

      await changeUrl('/search?q=new&utm_source=newsource&gclid=new-click')

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router?.navigate).toHaveBeenCalledWith(
        '/search?q=new&utm_source=newsource&gclid=new-click&utm_medium=email&utm_campaign=launch&dclid=old-display',
        { replace: true }
      )
    })

    test('does not navigate when preserving analytics parameters produces the current URL', async () => {
      routerHelper.router!.state = {
        location: {
          pathname: '/search',
          search: '?q=hello&utm_source=test&utm_medium=agent&gclid=click-id&dclid=display-id'
        }
      }

      await changeUrl('/search?q=hello')

      expect(routerHelper.router?.navigate).not.toHaveBeenCalled()
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

    test('does not navigate when the URL has not changed', () => {
      routerHelper.router!.state = {
        location: {
          pathname: '/search',
          search: '?p=C00001-EDSC'
        }
      }

      changeUrl({
        pathname: '/search',
        search: '?p=C00001-EDSC'
      })

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(0)
    })

    test('preserves analytics parameters when an object replaces the search', async () => {
      routerHelper.router!.state = {
        location: {
          pathname: '/search',
          search: '?q=old&utm_source=test&utm_medium=agent&utm_campaign=launch&gclid=click-id&dclid=display-id'
        }
      }

      await changeUrl({ search: '?q=new' })

      expect(routerHelper.router?.navigate).toHaveBeenCalledTimes(1)
      expect(routerHelper.router?.navigate).toHaveBeenCalledWith(
        { search: '?q=new&utm_source=test&utm_medium=agent&utm_campaign=launch&gclid=click-id&dclid=display-id' },
        { replace: true }
      )
    })
  })

  describe('when an error occurs', () => {
    test('calls handleError with the error and action', async () => {
      const newPath = '/search'

      const mockError = new Error('Test error')

      routerHelper.router!.navigate = vi.fn(() => {
        throw mockError
      })

      useEdscStore.setState((state) => {
        // eslint-disable-next-line no-param-reassign
        state.errors.handleError = vi.fn()
      })

      await changeUrl(newPath)

      // Assuming you have a way to access the error handler, for example:
      const { errors } = useEdscStore.getState()
      expect(errors.handleError).toHaveBeenCalledTimes(1)
      expect(errors.handleError).toHaveBeenCalledWith({
        error: mockError,
        action: 'changeUrl',
        title: 'Something went wrong loading the page. Refresh it to return to previous page'
      })
    })
  })
})
