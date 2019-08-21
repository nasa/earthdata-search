import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Link } from 'react-router-dom'

import { PortalLinkContainer } from '../PortalLinkContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    children: 'Click Here',
    className: 'test-class',
    onClick: jest.fn(),
    portalId: '',
    to: {
      pathname: '/search'
    },
    type: 'link',
    ...overrideProps
  }

  const enzymeWrapper = shallow(<PortalLinkContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('PortalLinkContainer component', () => {
  test('should return a link without a portal provided', () => {
    const { enzymeWrapper } = setup()

    const link = enzymeWrapper.find(Link)
    expect(link.props().className).toEqual('test-class')
    expect(link.props().type).toEqual('link')
    expect(link.props().children).toEqual('Click Here')
    expect(link.props().to).toEqual({
      pathname: '/search'
    })
  })

  test('should return a link with a portal provided', () => {
    const { enzymeWrapper } = setup({
      portalId: 'simple'
    })

    const link = enzymeWrapper.find(Link)
    expect(link.props().className).toEqual('test-class')
    expect(link.props().type).toEqual('link')
    expect(link.props().children).toEqual('Click Here')
    expect(link.props().to).toEqual({
      pathname: '/portal/simple/search'
    })
  })

  test('should return a link with a portal and a string `to` link', () => {
    const { enzymeWrapper } = setup({
      portalId: 'simple',
      to: '/search'
    })

    const link = enzymeWrapper.find(Link)
    expect(link.props().className).toEqual('test-class')
    expect(link.props().type).toEqual('link')
    expect(link.props().children).toEqual('Click Here')
    expect(link.props().to).toEqual('/portal/simple/search')
  })
})
