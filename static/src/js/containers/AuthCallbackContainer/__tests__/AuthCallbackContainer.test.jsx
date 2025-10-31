import { useLocation } from 'react-router-dom'
import * as tinyCookie from 'tiny-cookie'

import { AuthCallbackContainer } from '../AuthCallbackContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'
import useEdscStore from '../../../zustand/useEdscStore'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

jest.mock('tiny-cookie', () => ({
  set: jest.fn()
}))

const setup = setupTest({
  Component: AuthCallbackContainer,
  defaultZustandState: {
    earthdataDownloadRedirect: {
      redirect: '',
      setRedirectUrl: jest.fn()
    }
  },
  withRouter: true
})

describe('AuthCallbackContainer component', () => {
  const { replace } = window.location

  afterEach(() => {
    window.location.replace = replace
  })

  test('sets the auth cookie and redirects', () => {
    useLocation.mockReturnValue({
      search: '?edlToken=mockjwttoken&redirect=http%3A%2F%2Flocalhost%3A8080%2Fsearch'
    })

    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

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

    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

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

    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

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

    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup()

    expect(setSpy).toHaveBeenCalledTimes(1)
    expect(setSpy).toHaveBeenCalledWith('edlToken', undefined)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/'])
  })

  test('does not follow the redirect if the redirect param is not valid', () => {
    useLocation.mockReturnValue({
      search: '?redirect=javascript:alert(document.domain);'
    })

    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup()

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })

  test('does not follow the redirect if the redirect param is not relative to earthdata-search', () => {
    useLocation.mockReturnValue({
      search: '?redirect=https://evil.com'
    })

    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup()

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })

  test('does not follow the eddRedirect it is not a valid earthdata-download redirect', () => {
    useLocation.mockReturnValue({
      search: '?eddRedirect=https://evil.com'
    })

    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup()

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })

  test('does not follow the redirect if the eddRedirect param is not valid', () => {
    useLocation.mockReturnValue({
      search: '?eddRedirect=javascript:alert(document.domain);'
    })

    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup()

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/not-found'])
  })
})
