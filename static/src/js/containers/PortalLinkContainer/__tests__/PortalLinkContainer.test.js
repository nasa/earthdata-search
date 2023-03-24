import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import { Link } from 'react-router-dom'

import { mapDispatchToProps, mapStateToProps, PortalLinkContainer } from '../PortalLinkContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import actions from '../../../actions'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    children: 'Click Here',
    className: 'test-class',
    match: {},
    label: '',
    location: {},
    history: {},
    onClick: jest.fn(),
    portal: {
      portalId: 'edsc'
    },
    newPortal: undefined,
    to: {
      pathname: '/search'
    },
    type: 'link',
    onChangePath: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<PortalLinkContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath(false)

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith(false)
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
      pathname: '/search',
      search: ''
    })
  })

  test('should return a link with a non-default portal provided', () => {
    const { enzymeWrapper } = setup({
      portal: {
        portalId: 'example'
      }
    })

    const link = enzymeWrapper.find(Link)
    expect(link.props().className).toEqual('test-class')
    expect(link.props().type).toEqual('link')
    expect(link.props().children).toEqual('Click Here')
    expect(link.props().to).toEqual({
      pathname: '/search',
      search: '?portal=example'
    })
  })

  describe('when passing a string `to` link', () => {
    test('should return a link with a non-default portal', () => {
      const { enzymeWrapper } = setup({
        portal: {
          portalId: 'example'
        },
        to: '/search'
      })

      const link = enzymeWrapper.find(Link)
      expect(link.props().className).toEqual('test-class')
      expect(link.props().type).toEqual('link')
      expect(link.props().children).toEqual('Click Here')
      expect(link.props().to).toEqual({
        pathname: '/search',
        search: '?portal=example'
      })
    })

    test('should return a link with search parameters', () => {
      const { enzymeWrapper } = setup({
        portal: {
          portalId: 'edsc'
        },
        to: '/search?q=modis'
      })

      const link = enzymeWrapper.find(Link)
      expect(link.props().className).toEqual('test-class')
      expect(link.props().type).toEqual('link')
      expect(link.props().children).toEqual('Click Here')
      expect(link.props().to).toEqual({
        pathname: '/search',
        search: '?q=modis'
      })
    })
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
    expect(pushMock).toHaveBeenCalledWith({
      pathname: '/search',
      search: ''
    })
  })

  describe('when newPortal is provided', () => {
    test('should return a link when newPortal is set', () => {
      const { enzymeWrapper } = setup({
        portal: {
          portalId: 'example'
        },
        newPortal: {
          portalId: 'anotherExample'
        }
      })

      const link = enzymeWrapper.find(Link)
      expect(link.props().className).toEqual('test-class')
      expect(link.props().type).toEqual('link')
      expect(link.props().children).toEqual('Click Here')
      expect(link.props().to).toEqual({
        pathname: '/search',
        search: '?portal=anotherExample'
      })
    })

    test('should return a link when newPortal is empty', () => {
      const { enzymeWrapper } = setup({
        portal: {
          portalId: 'example'
        },
        newPortal: {}
      })

      const link = enzymeWrapper.find(Link)
      expect(link.props().className).toEqual('test-class')
      expect(link.props().type).toEqual('link')
      expect(link.props().children).toEqual('Click Here')
      expect(link.props().to).toEqual({
        pathname: '/search',
        search: ''
      })
    })
  })

  describe('when updatePath is true', () => {
    test('should call onChangePath', () => {
      const { enzymeWrapper, props } = setup({
        portal: {
          portalId: 'example'
        },
        updatePath: true,
        onClick: null
      })

      const link = enzymeWrapper.find(Link)

      link.props().onClick()

      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/search?portal=example')
    })

    test('should call the provided onClick and onChangePath', () => {
      const { enzymeWrapper, props } = setup({
        portal: {
          portalId: 'example'
        },
        updatePath: true
      })

      const link = enzymeWrapper.find(Link)

      link.props().onClick({ mock: 'event' })

      expect(props.onClick).toHaveBeenCalledTimes(1)
      expect(props.onClick).toHaveBeenCalledWith({ mock: 'event' })

      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/search?portal=example')
    })
  })
})
