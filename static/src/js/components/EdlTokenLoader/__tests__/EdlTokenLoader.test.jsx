import * as tinyCookie from 'tiny-cookie'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import EdlTokenLoader from '../EdlTokenLoader'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

vi.mock('tiny-cookie', () => ({
  get: vi.fn()
}))

const setup = setupTest({
  Component: EdlTokenLoader,
  defaultProps: {
    children: 'children'
  },
  defaultZustandState: {
    user: {
      setEdlToken: vi.fn()
    }
  }
})

describe('EdlTokenLoader component', () => {
  test('should call setEdlToken when mounted', () => {
    vi.spyOn(tinyCookie, 'get').mockImplementation((param) => {
      if (param === 'edlToken') return 'token'

      return ''
    })

    vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
      disableDatabaseComponents: 'false'
    }))

    const { zustandState } = setup()

    expect(zustandState.user.setEdlToken).toHaveBeenCalledTimes(1)
    expect(zustandState.user.setEdlToken).toHaveBeenCalledWith('token')
  })

  describe('when disableDatabaseComponents is true', () => {
    test('should call setEdlToken with an empty string', () => {
      vi.spyOn(tinyCookie, 'get').mockImplementation((param) => {
        if (param === 'edlToken') return 'token'

        return ''
      })

      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        disableDatabaseComponents: 'true'
      }))

      const { zustandState } = setup()

      expect(zustandState.user.setEdlToken).toHaveBeenCalledTimes(1)
      expect(zustandState.user.setEdlToken).toHaveBeenCalledWith(null)
    })
  })
})
