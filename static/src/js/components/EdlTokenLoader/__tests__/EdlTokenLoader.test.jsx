import * as tinyCookie from 'tiny-cookie'

import setupTest from '../../../../../../jestConfigs/setupTest'

import EdlTokenLoader from '../EdlTokenLoader'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

jest.mock('tiny-cookie', () => ({
  get: jest.fn()
}))

const setup = setupTest({
  Component: EdlTokenLoader,
  defaultProps: {
    children: 'children'
  },
  defaultZustandState: {
    user: {
      setEdlToken: jest.fn()
    }
  }
})

describe('EdlTokenLoader component', () => {
  test('should call setEdlToken when mounted', () => {
    jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'edlToken') return 'token'

      return ''
    })

    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
      disableDatabaseComponents: 'false'
    }))

    const { zustandState } = setup()

    expect(zustandState.user.setEdlToken).toHaveBeenCalledTimes(1)
    expect(zustandState.user.setEdlToken).toHaveBeenCalledWith('token')
  })

  describe('when disableDatabaseComponents is true', () => {
    test('should call setEdlToken with an empty string', () => {
      jest.spyOn(tinyCookie, 'get').mockImplementation((param) => {
        if (param === 'edlToken') return 'token'

        return ''
      })

      jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const { zustandState } = setup()

      expect(zustandState.user.setEdlToken).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setEdlToken).toHaveBeenCalledWith(null)
    })
  })
})
