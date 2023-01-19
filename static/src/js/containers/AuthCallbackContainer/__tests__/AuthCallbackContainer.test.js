import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import * as tinyCookie from 'tiny-cookie'

import { AuthCallbackContainer, mapStateToProps } from '../AuthCallbackContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    location: {
      search: '?jwt=mockjwttoken&redirect=http%3A%2F%2Flocalhost%3A8080%2Fsearch'
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<AuthCallbackContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.restoreAllMocks()
  jest.clearAllMocks()
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
