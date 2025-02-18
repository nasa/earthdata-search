import React from 'react'
import { render } from '@testing-library/react'
import * as tinyCookie from 'tiny-cookie'

import actions from '../../../actions'
import { AuthTokenContainer, mapDispatchToProps } from '../AuthTokenContainer'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

jest.mock('tiny-cookie', () => ({
  get: jest.fn()
}))

const setup = (props) => {
  render(
    <AuthTokenContainer {...props} />
  )
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

    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
      disableDatabaseComponents: 'false'
    }))

    const props = {
      children: 'children',
      onSetContactInfoFromJwt: jest.fn(),
      onSetPreferencesFromJwt: jest.fn(),
      onSetUserFromJwt: jest.fn(),
      onUpdateAuthToken: jest.fn()
    }
    setup(props)

    expect(props.onUpdateAuthToken).toHaveBeenCalledTimes(1)
    expect(props.onUpdateAuthToken).toHaveBeenCalledWith('token')

    expect(props.onSetContactInfoFromJwt).toHaveBeenCalledTimes(1)
    expect(props.onSetContactInfoFromJwt).toHaveBeenCalledWith('token')

    expect(props.onSetPreferencesFromJwt).toHaveBeenCalledTimes(1)
    expect(props.onSetPreferencesFromJwt).toHaveBeenCalledWith('token')

    expect(props.onSetUserFromJwt).toHaveBeenCalledTimes(1)
    expect(props.onSetUserFromJwt).toHaveBeenCalledWith('token')
  })

  describe('when disableDatabaseComponents is true', () => {
    test('should call onUpdateAuthToken with an empty string', () => {
      jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
        if (param === 'authToken') return 'token'

        return ''
      })

      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const props = {
        children: 'children',
        onSetContactInfoFromJwt: jest.fn(),
        onSetPreferencesFromJwt: jest.fn(),
        onSetUserFromJwt: jest.fn(),
        onUpdateAuthToken: jest.fn()
      }
      setup(props)

      expect(props.onUpdateAuthToken).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAuthToken).toHaveBeenCalledWith('')
    })
  })
})
