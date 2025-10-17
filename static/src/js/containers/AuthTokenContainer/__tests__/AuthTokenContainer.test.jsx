import * as tinyCookie from 'tiny-cookie'

import setupTest from '../../../../../../jestConfigs/setupTest'

import actions from '../../../actions'
import { AuthTokenContainer, mapDispatchToProps } from '../AuthTokenContainer'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

jest.mock('tiny-cookie', () => ({
  get: jest.fn()
}))

const setup = setupTest({
  Component: AuthTokenContainer,
  defaultProps: {
    children: 'children',
    onSetContactInfoFromJwt: jest.fn(),
    onSetUserFromJwt: jest.fn(),
    onUpdateAuthToken: jest.fn()
  },
  defaultZustandState: {
    preferences: {
      setPreferencesFromJwt: jest.fn()
    }
  }
})

describe('mapDispatchToProps', () => {
  test('onSetContactInfoFromJwt calls actions.setContactInfoFromJwt', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setContactInfoFromJwt')

    mapDispatchToProps(dispatch).onSetContactInfoFromJwt('mock-token')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('mock-token')
  })

  test('onSetUserFromJwt calls actions.setUserFromJwt', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'setUserFromJwt')

    mapDispatchToProps(dispatch).onSetUserFromJwt('mock-token')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('mock-token')
  })

  test('onUpdateAuthToken calls actions.updateAuthToken', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'updateAuthToken')

    mapDispatchToProps(dispatch).onUpdateAuthToken('mock-token')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('mock-token')
  })
})

describe('AuthTokenContainer component', () => {
  test('should call JWT processing functions when mounted', () => {
    jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'authToken') return 'token'

      return ''
    })

    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
      disableDatabaseComponents: 'false'
    }))

    const { props, zustandState } = setup()

    expect(props.onUpdateAuthToken).toHaveBeenCalledTimes(1)
    expect(props.onUpdateAuthToken).toHaveBeenCalledWith('token')

    expect(props.onSetContactInfoFromJwt).toHaveBeenCalledTimes(1)
    expect(props.onSetContactInfoFromJwt).toHaveBeenCalledWith('token')

    expect(zustandState.preferences.setPreferencesFromJwt).toHaveBeenCalledTimes(1)
    expect(zustandState.preferences.setPreferencesFromJwt).toHaveBeenCalledWith('token')

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

      const { props } = setup()

      expect(props.onUpdateAuthToken).toHaveBeenCalledTimes(1)
      expect(props.onUpdateAuthToken).toHaveBeenCalledWith('')
    })
  })
})
