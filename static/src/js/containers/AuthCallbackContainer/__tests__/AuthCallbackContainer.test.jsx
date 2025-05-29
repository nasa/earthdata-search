import * as tinyCookie from 'tiny-cookie'

import { AuthCallbackContainer, mapStateToProps } from '../AuthCallbackContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'
import useEdscStore from '../../../zustand/useEdscStore'

jest.mock('tiny-cookie', () => ({
  set: jest.fn()
}))

const setup = setupTest({
  Component: AuthCallbackContainer,
  defaultProps: {
    location: {
      search: '?jwt=mockjwttoken&redirect=http%3A%2F%2Flocalhost%3A8080%2Fsearch'
    }
  },
  defaultZustandState: {
    earthdataDownloadRedirect: {
      redirect: '',
      setRedirect: jest.fn()
    }
  }
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      router: {
        location: {}
      }
    }

    const expectedState = {
      location: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('AuthCallbackContainer component', () => {
  const { replace } = window.location

  afterEach(() => {
    jest.clearAllMocks()
    window.location.replace = replace
  })

  test('sets the auth cookie and redirects', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup()

    expect(setSpy).toBeCalledTimes(1)
    expect(setSpy).toBeCalledWith('authToken', 'mockjwttoken')

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['http://localhost:8080/search'])
  })

  test('updates zustand and redirects to earthdata-download-callback for authCallback', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup({
      overrideProps: {
        location: {
          search: '?jwt=mockjwttoken&accessToken=mock-token&redirect=earthdata-download%3A%2F%2FauthCallback'
        }
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)
    expect(window.location.replace).toHaveBeenCalledTimes(0)

    const zustandState = useEdscStore.getState()
    const { earthdataDownloadRedirect } = zustandState
    const { setRedirect } = earthdataDownloadRedirect

    expect(setRedirect).toHaveBeenCalledTimes(1)
    expect(setRedirect).toHaveBeenCalledWith('earthdata-download://authCallback&token=mock-token')
  })

  test('updates zustand and redirects to earthdata-download-callback for eulaCallback', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup({
      overrideProps: {
        location: {
          search: 'eddRedirect=earthdata-download%3A%2F%2FeulaCallback'
        }
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)
    expect(window.location.replace).toHaveBeenCalledTimes(0)

    const zustandState = useEdscStore.getState()
    const { earthdataDownloadRedirect } = zustandState
    const { setRedirect } = earthdataDownloadRedirect

    expect(setRedirect).toHaveBeenCalledTimes(1)
    expect(setRedirect).toHaveBeenCalledWith('earthdata-download://eulaCallback')
  })

  test('clears the auth cookie and redirects to root path if values are not set', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup({
      overrideProps: {
        location: {
          search: ''
        }
      }
    })

    expect(setSpy).toBeCalledTimes(1)
    expect(setSpy).toBeCalledWith('authToken', '')

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/'])
  })

  test('does not follow the redirect if the redirect param is not valid', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup({
      overrideProps: {
        location: {
          search: '?redirect=javascript:alert(document.domain);'
        }
      }
    })

    expect(setSpy).toBeCalledTimes(0)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })

  test('does not follow the redirect if the redirect param is not relative to earthdata-search', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup({
      overrideProps: {
        location: {
          search: '?redirect=https://evil.com'
        }
      }
    })

    expect(setSpy).toBeCalledTimes(0)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })

  test('does not follow the eddRedirect it is not a valid earthdata-download redirect', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup({
      overrideProps: {
        location: {
          search: '?eddRedirect=https://evil.com'
        }
      }
    })

    expect(setSpy).toBeCalledTimes(0)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })

  test('does not follow the redirect if the eddRedirect param is not valid', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup({
      overrideProps: {
        location: {
          search: '?eddRedirect=javascript:alert(document.domain);'
        }
      }
    })

    expect(setSpy).toBeCalledTimes(0)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })
})
