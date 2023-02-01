import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import * as tinyCookie from 'tiny-cookie'

import actions from '../../../actions'
import { AuthTokenContainer, mapDispatchToProps } from '../AuthTokenContainer'

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

describe('mapDispatchToProps', () => {
  test('onSetContactInfoFromJwt calls actions.setContactInfoFromJwt', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setContactInfoFromJwt')

    mapDispatchToProps(dispatch).onSetContactInfoFromJwt('mock-token')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('mock-token')
  })

  test('onSetPreferencesFromJwt calls actions.setPreferencesFromJwt', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setPreferencesFromJwt')

    mapDispatchToProps(dispatch).onSetPreferencesFromJwt('mock-token')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('mock-token')
  })

  test('onSetUserFromJwt calls actions.setUserFromJwt', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setUserFromJwt')

    mapDispatchToProps(dispatch).onSetUserFromJwt('mock-token')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('mock-token')
  })

  test('onUpdateAuthToken calls actions.updateAuthToken', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAuthToken')

    mapDispatchToProps(dispatch).onUpdateAuthToken('mock-token')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('mock-token')
  })
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
