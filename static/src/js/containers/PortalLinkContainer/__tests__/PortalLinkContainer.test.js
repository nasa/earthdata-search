import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { Link } from 'react-router-dom'

import { PortalLinkContainer } from '../PortalLinkContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    children: 'Click Here',
    className: 'test-class',
    dispatch: jest.fn(),
    match: {},
    label: '',
    location: {},
    history: {},
    onClick: jest.fn(),
    portal: {
      portalId: 'edsc'
    },
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
  beforeEach(() => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      defaultPortal: 'edsc'
    }))
  })

  test('should return a link with the default portal provided', () => {
    const { enzymeWrapper } = setup()

    const link = enzymeWrapper.find(Link)
    expect(link.props().className).toEqual('test-class')
    expect(link.props().type).toEqual('link')
    expect(link.props().children).toEqual('Click Here')
    expect(link.props().to).toEqual({
      pathname: '/search'
    })
  })

  test('should return a link with a non-default portal provided', () => {
    const { enzymeWrapper } = setup({
      portal: {
        portalId: 'simple'
      }
    })

    const link = enzymeWrapper.find(Link)
    expect(link.props().className).toEqual('test-class')
    expect(link.props().type).toEqual('link')
    expect(link.props().children).toEqual('Click Here')
    expect(link.props().to).toEqual({
      pathname: '/portal/simple/search'
    })
  })

  test('should return a link with a non-default portal and a string `to` link', () => {
    const { enzymeWrapper } = setup({
      portal: {
        portalId: 'simple'
      },
      to: '/search'
    })

    const link = enzymeWrapper.find(Link)
    expect(link.props().className).toEqual('test-class')
    expect(link.props().type).toEqual('link')
    expect(link.props().children).toEqual('Click Here')
    expect(link.props().to).toEqual('/portal/simple/search')
  })

  test('should return a button when the type is set', () => {
    const pushMock = jest.fn()
    const { enzymeWrapper } = setup({
      type: 'button',
      history: {
        push: pushMock
      }
    })

    const button = enzymeWrapper.find('.test-class')
    expect(button.props().type).toEqual('button')
    expect(button.props().children).toEqual('Click Here')

    button.props().onClick()

    expect(pushMock).toHaveBeenCalledTimes(1)
    expect(pushMock).toHaveBeenCalledWith({ pathname: '/search' })
  })
})
