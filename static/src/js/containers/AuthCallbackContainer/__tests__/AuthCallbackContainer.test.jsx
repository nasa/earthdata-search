import * as tinyCookie from 'tiny-cookie'

import { AuthCallbackContainer } from '../AuthCallbackContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'
import useEdscStore from '../../../zustand/useEdscStore'

jest.mock('tiny-cookie', () => ({
  set: jest.fn()
}))

const setup = setupTest({
  Component: AuthCallbackContainer,
  defaultZustandState: {
    earthdataDownloadRedirect: {
      redirect: '',
      setRedirectUrl: jest.fn()
    },
    location: {
      location: {
        search: '?jwt=mockjwttoken&redirect=http%3A%2F%2Flocalhost%3A8080%2Fsearch'
      }
    }
  }
})

describe('AuthCallbackContainer component', () => {
  const { replace } = window.location

  beforeEach(() => {
    delete window.location
    window.location = { replace: jest.fn() }
  })

  afterEach(() => {
    window.location.replace = replace
  })

  test('sets the auth cookie and redirects', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')

    setup()

    expect(setSpy).toHaveBeenCalledTimes(1)
    expect(setSpy).toHaveBeenCalledWith('authToken', 'mockjwttoken')

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('http://localhost:8080/search')
  })

  test('updates zustand and redirects to earthdata-download-callback for authCallback', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')

    setup({
      overrideZustandState: {
        location: {
          location: {
            search: '?jwt=mockjwttoken&accessToken=mock-token&redirect=earthdata-download%3A%2F%2FauthCallback'
          }
        }
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)
    expect(window.location.replace).toHaveBeenCalledTimes(0)

    const zustandState = useEdscStore.getState()
    const { earthdataDownloadRedirect } = zustandState
    const { setRedirectUrl } = earthdataDownloadRedirect

    expect(setRedirectUrl).toHaveBeenCalledTimes(1)
    expect(setRedirectUrl).toHaveBeenCalledWith('earthdata-download://authCallback&token=mock-token')
  })

  test('updates zustand and redirects to earthdata-download-callback for eulaCallback', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')

    setup({
      overrideZustandState: {
        location: {
          location: {
            search: 'eddRedirect=earthdata-download%3A%2F%2FeulaCallback'
          }
        }
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)
    expect(window.location.replace).toHaveBeenCalledTimes(0)

    const zustandState = useEdscStore.getState()
    const { earthdataDownloadRedirect } = zustandState
    const { setRedirectUrl } = earthdataDownloadRedirect

    expect(setRedirectUrl).toHaveBeenCalledTimes(1)
    expect(setRedirectUrl).toHaveBeenCalledWith('earthdata-download://eulaCallback')
  })

  test('clears the auth cookie and redirects to root path if values are not set', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')

    setup({
      overrideZustandState: {
        location: {
          location: {
            search: ''
          }
        }
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(1)
    expect(setSpy).toHaveBeenCalledWith('authToken', '')

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('/')
  })

  test('does not follow the redirect if the redirect param is not valid', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')

    setup({
      overrideZustandState: {
        location: {
          location: {
            search: '?redirect=javascript:alert(document.domain);'
          }
        }
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('/not-found')
  })

  test('does not follow the redirect if the redirect param is not relative to earthdata-search', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')

    setup({
      overrideZustandState: {
        location: {
          location: {
            search: '?redirect=https://evil.com'
          }
        }
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('/not-found')
  })

  test('does not follow the eddRedirect it is not a valid earthdata-download redirect', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')

    setup({
      overrideZustandState: {
        location: {
          location: {
            search: '?eddRedirect=https://evil.com'
          }
        }
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('/not-found')
  })

  test('does not follow the redirect if the eddRedirect param is not valid', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')

    setup({
      overrideZustandState: {
        location: {
          location: {
            search: '?eddRedirect=javascript:alert(document.domain);'
          }
        }
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('/not-found')
  })
})
