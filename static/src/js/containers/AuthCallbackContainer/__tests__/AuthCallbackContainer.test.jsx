import { useLocation } from 'react-router-dom'
import * as tinyCookie from 'tiny-cookie'

import { AuthCallbackContainer } from '../AuthCallbackContainer'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import useEdscStore from '../../../zustand/useEdscStore'

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useLocation: vi.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

vi.mock('tiny-cookie', () => ({
  set: vi.fn()
}))

const setup = setupTest({
  Component: AuthCallbackContainer,
  defaultZustandState: {
    earthdataDownloadRedirect: {
      redirect: '',
      setRedirectUrl: vi.fn()
    }
  },
  withRouter: true
})

describe('AuthCallbackContainer component', () => {
  const { replace } = window.location

  beforeEach(() => {
    delete window.location
    window.location = {
      replace: vi.fn()
    }
  })

  afterEach(() => {
    window.location.replace = replace
  })

  test('sets the auth cookie and redirects', () => {
    useLocation.mockReturnValue({
      search: '?edlToken=mockjwttoken&redirect=http%3A%2F%2Flocalhost%3A8080%2Fsearch'
    })

    const setSpy = vi.spyOn(tinyCookie, 'set')

    setup()

    expect(setSpy).toHaveBeenCalledTimes(1)
    expect(setSpy).toHaveBeenCalledWith('edlToken', 'mockjwttoken')

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['http://localhost:8080/search'])
  })

  test('updates zustand and redirects to earthdata-download-callback for authCallback', () => {
    useLocation.mockReturnValue({
      search: '?edlToken=mockjwttoken&redirect=earthdata-download%3A%2F%2FauthCallback'
    })

    const setSpy = vi.spyOn(tinyCookie, 'set')

    setup()

    expect(setSpy).toHaveBeenCalledTimes(0)
    expect(window.location.replace).toHaveBeenCalledTimes(0)

    const zustandState = useEdscStore.getState()
    const { earthdataDownloadRedirect } = zustandState
    const { setRedirectUrl } = earthdataDownloadRedirect

    expect(setRedirectUrl).toHaveBeenCalledTimes(1)
    expect(setRedirectUrl).toHaveBeenCalledWith('earthdata-download://authCallback&token=mockjwttoken')
  })

  test('updates zustand and redirects to earthdata-download-callback for eulaCallback', () => {
    useLocation.mockReturnValue({
      search: 'eddRedirect=earthdata-download%3A%2F%2FeulaCallback'
    })

    const setSpy = vi.spyOn(tinyCookie, 'set')

    setup()

    expect(setSpy).toHaveBeenCalledTimes(0)
    expect(window.location.replace).toHaveBeenCalledTimes(0)

    const zustandState = useEdscStore.getState()
    const { earthdataDownloadRedirect } = zustandState
    const { setRedirectUrl } = earthdataDownloadRedirect

    expect(setRedirectUrl).toHaveBeenCalledTimes(1)
    expect(setRedirectUrl).toHaveBeenCalledWith('earthdata-download://eulaCallback')
  })

  test('clears the auth cookie and redirects to root path if values are not set', () => {
    useLocation.mockReturnValue({
      search: ''
    })

    const setSpy = vi.spyOn(tinyCookie, 'set')

    setup()

    expect(setSpy).toHaveBeenCalledTimes(1)
    expect(setSpy).toHaveBeenCalledWith('edlToken', undefined)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['http://localhost:8080/'])
  })

  test('redirects to /not-found if the safe URL validation fails', () => {
    useLocation.mockReturnValue({
      search: '?redirect=https://evil.com'
    })

    setup()

    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })

  test('redirects to /not-found if the eddRedirect fails safety validation', () => {
    useLocation.mockReturnValue({
      // Pass a malicious URL so getSafeRedirectUrl returns null
      search: '?eddRedirect=earthdata-download%3A%2F%2FauthCallback@evil.com'
    })

    setup()

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })
})
