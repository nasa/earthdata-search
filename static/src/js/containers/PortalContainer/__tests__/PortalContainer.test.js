import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { PortalContainer } from '../PortalContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    match: {
      params: {}
    },
    portal: {
      portalId: ''
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

describe('PortalContainer component', () => {
  test('renders the page title without a portal', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('title').text()).toEqual('Earthdata Search')
  })

  test('renders the page title with a portal', () => {
    const { enzymeWrapper } = setup({
      portal: {
        portalId: 'simple',
        title: 'Simple'
      }
    })

    expect(enzymeWrapper.find('title').text()).toEqual('Earthdata Search :: Simple Portal')
  })

  test('should call onLoadPortalConfig on mount without a portal', () => {
    const { props } = setup()

    expect(props.onLoadPortalConfig.mock.calls.length).toBe(1)
    expect(props.onLoadPortalConfig.mock.calls[0]).toEqual([undefined])
  })

  test('should call onLoadPortalConfig on mount without a portal', () => {
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
