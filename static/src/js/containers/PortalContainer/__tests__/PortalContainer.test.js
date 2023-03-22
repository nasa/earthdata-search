import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import actions from '../../../actions'
import { mapDispatchToProps, mapStateToProps, PortalContainer } from '../PortalContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    match: {
      params: {}
    },
    portal: {
      portalId: 'edsc'
    },
    onLoadPortalConfig: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<PortalContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('mapDispatchToProps', () => {
  test('onLoadPortalConfig calls actions.loadPortalConfig', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'loadPortalConfig')

    mapDispatchToProps(dispatch).onLoadPortalConfig('portalId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('portalId')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      portal: {}
    }

    const expectedState = {
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('PortalContainer component', () => {
  test('renders the page title without a portal', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('title').text()).toEqual('Earthdata Search')
  })

  test('renders the page title with a portal', () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    const { enzymeWrapper } = setup({
      portal: {
        portalId: 'simple',
        title: 'Simple'
      }
    })

    expect(enzymeWrapper.find('title').text()).toEqual('Earthdata Search :: Simple Portal')
  })

  test('should call onLoadPortalConfig on mount with a portal', () => {
    const { props } = setup({
      match: {
        params: {
          portalId: 'simple'
        }
      }
    })

    expect(props.onLoadPortalConfig.mock.calls.length).toBe(1)
    expect(props.onLoadPortalConfig.mock.calls[0]).toEqual(['simple'])
  })
})
