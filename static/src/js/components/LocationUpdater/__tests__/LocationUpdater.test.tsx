import setupTest from '../../../../../../jestConfigs/setupTest'
import useEdscStore from '../../../zustand/useEdscStore'

import { LocationUpdater, mapDispatchToProps } from '../LocationUpdater'
// @ts-expect-error: This file does not have types
import actions from '../../../actions'

const setup = setupTest({
  Component: LocationUpdater,
  defaultProps: {
    onChangePath: jest.fn()
  },
  defaultZustandState: {
    location: {
      location: {
        pathname: '/',
        search: ''
      },
      setLocation: jest.fn(),
      setNavigate: jest.fn()
    }
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('/new/path')

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('/new/path')
  })
})

describe('LocationUpdater', () => {
  it('updates the location and navigate in Zustand store', () => {
    const { props } = setup()

    const zustandState = useEdscStore.getState()
    const { location } = zustandState
    const { setLocation, setNavigate } = location

    // expect(setLocation).toHaveBeenCalledTimes(1)
    // expect(setLocation).toHaveBeenCalledWith({
    //   hash: '',
    //   key: 'default',
    //   pathname: '/',
    //   search: '',
    //   state: null
    // })

    expect(props.onChangePath).toHaveBeenCalledTimes(1)
    expect(props.onChangePath).toHaveBeenCalledWith('/')

    expect(setNavigate).toHaveBeenCalledTimes(1)
    expect(setNavigate).toHaveBeenCalledWith(expect.any(Function))
  })
})
