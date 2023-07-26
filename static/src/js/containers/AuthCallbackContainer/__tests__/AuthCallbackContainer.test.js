import React from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import * as tinyCookie from 'tiny-cookie'

import {
  AuthCallbackContainer,
  mapDispatchToProps,
  mapStateToProps
} from '../AuthCallbackContainer'
import actions from '../../../actions'

const setup = (overrideProps) => {
  const props = {
    location: {
      search: '?jwt=mockjwttoken&redirect=http%3A%2F%2Flocalhost%3A8080%2Fsearch'
    },
    onAddEarthdataDownloadRedirect: jest.fn(),
    ...overrideProps
  }

  act(() => {
    render(
      <AuthCallbackContainer {...props} />
    )
  })

  return {
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onAddEarthdataDownloadRedirect calls actions.addEarthdataDownloadRedirect', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'addEarthdataDownloadRedirect')

    mapDispatchToProps(dispatch).onAddEarthdataDownloadRedirect({ redirect: 'earthdata-download://authCallback' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ redirect: 'earthdata-download://authCallback' })
  })
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

  test('updates redux and redirects to earthdata-download-callback for authCallback', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    const { props } = setup({
      location: {
        search: '?jwt=mockjwttoken&accessToken=mock-token&redirect=earthdata-download%3A%2F%2FauthCallback'
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace).toHaveBeenCalledTimes(0)

    expect(props.onAddEarthdataDownloadRedirect).toHaveBeenCalledTimes(1)
    expect(props.onAddEarthdataDownloadRedirect).toHaveBeenCalledWith({
      redirect: 'earthdata-download://authCallback&token=mock-token'
    })
  })

  test('updates redux and redirects to earthdata-download-callback for eulaCallback', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    const { props } = setup({
      location: {
        search: 'eddRedirect=earthdata-download%3A%2F%2FeulaCallback'
      }
    })

    expect(setSpy).toHaveBeenCalledTimes(0)

    expect(window.location.replace).toHaveBeenCalledTimes(0)

    expect(props.onAddEarthdataDownloadRedirect).toHaveBeenCalledTimes(1)
    expect(props.onAddEarthdataDownloadRedirect).toHaveBeenCalledWith({
      redirect: 'earthdata-download://eulaCallback'
    })
  })

  test('clears the auth cookie and redirects to root path if values are not set', () => {
    const setSpy = jest.spyOn(tinyCookie, 'set')
    delete window.location
    window.location = { replace: jest.fn() }

    setup({
      location: {
        search: ''
      }
    })

    expect(setSpy).toBeCalledTimes(1)
    expect(setSpy).toBeCalledWith('authToken', '')

    expect(window.location.replace.mock.calls.length).toBe(1)
    expect(window.location.replace.mock.calls[0]).toEqual(['/'])
  })
})
