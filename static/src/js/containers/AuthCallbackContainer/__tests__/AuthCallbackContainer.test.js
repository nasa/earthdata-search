import React from 'react'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import * as tinyCookie from 'tiny-cookie'

import { AuthCallbackContainer, mapStateToProps } from '../AuthCallbackContainer'

const setup = (overrideProps) => {
  const props = {
    location: {
      search: '?jwt=mockjwttoken&redirect=http%3A%2F%2Flocalhost%3A8080%2Fsearch'
    },
    ...overrideProps
  }

  act(() => {
    render(
      <AuthCallbackContainer {...props} />
    )
  })
}

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
