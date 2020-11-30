import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import * as tinyCookie from 'tiny-cookie'

import { AuthTokenContainer } from '../AuthTokenContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    children: 'children',
    onSetContactInfoFromJwt: jest.fn(),
    onSetPreferencesFromJwt: jest.fn(),
    onSetUserFromJwt: jest.fn(),
    onUpdateAuthToken: jest.fn()
  }

  const enzymeWrapper = shallow(<AuthTokenContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('AuthTokenContainer component', () => {
  test('should call onUpdateAuthToken when mounted', () => {
    jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'authToken') return 'token'
      return ''
    })

    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper).toBeDefined()
    expect(props.onUpdateAuthToken).toHaveBeenCalled()
    expect(props.onUpdateAuthToken.mock.calls[0]).toEqual(['token'])
    expect(props.onSetContactInfoFromJwt).toHaveBeenCalled()
    expect(props.onSetContactInfoFromJwt.mock.calls[0]).toEqual(['token'])
    expect(props.onSetPreferencesFromJwt).toHaveBeenCalled()
    expect(props.onSetPreferencesFromJwt.mock.calls[0]).toEqual(['token'])
    expect(props.onSetUserFromJwt).toHaveBeenCalled()
    expect(props.onSetUserFromJwt.mock.calls[0]).toEqual(['token'])
  })
})
