import * as tinyCookie from 'tiny-cookie'

import setupTest from '../../../../../../jestConfigs/setupTest'

import AuthToken from '../AuthToken'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

jest.mock('tiny-cookie', () => ({
  get: jest.fn()
}))

const setup = setupTest({
  Component: AuthToken,
  defaultProps: {
    children: 'children'
  },
  defaultZustandState: {
    user: {
      setAuthToken: jest.fn()
    }
  }
})

describe('AuthToken component', () => {
  test('should call setAuthToken when mounted', () => {
    jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'authToken') return 'token'

      return ''
    })

    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
      disableDatabaseComponents: 'false'
    }))

    const { zustandState } = setup()

    expect(zustandState.user.setAuthToken).toHaveBeenCalledTimes(1)
    expect(zustandState.user.setAuthToken).toHaveBeenCalledWith('token')
  })

  describe('when disableDatabaseComponents is true', () => {
    test('should call setAuthToken with an empty string', () => {
      jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
        if (param === 'authToken') return 'token'

        return ''
      })

      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const { zustandState } = setup()

      expect(zustandState.user.setAuthToken).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setAuthToken).toHaveBeenCalledWith(undefined)
    })
  })
})
