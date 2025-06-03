import setupTest from '../../../../../../jestConfigs/setupTest'
import useEdscStore from '../../../zustand/useEdscStore'

import LocationUpdater from '../LocationUpdater'

const setup = setupTest({
  Component: LocationUpdater,
  defaultZustandState: {
    location: {
      setLocation: jest.fn(),
      setNavigate: jest.fn()
    }
  },
  withRouter: true
})

describe('LocationUpdater', () => {
  it('updates the location and navigate in Zustand store', () => {
    setup()

    const zustandState = useEdscStore.getState()
    const { location } = zustandState
    const { setLocation, setNavigate } = location

    expect(setLocation).toHaveBeenCalledTimes(1)
    expect(setLocation).toHaveBeenCalledWith({
      hash: '',
      key: 'default',
      pathname: '/',
      search: '',
      state: null
    })

    expect(setNavigate).toHaveBeenCalledTimes(1)
    expect(setNavigate).toHaveBeenCalledWith(expect.any(Function))
  })
})
