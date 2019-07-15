import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { StaticRouter } from 'react-router'
import { Link } from 'react-router-dom'

import { orderStatusProps, orderStatusPropsTwo } from './mocks'

import { Well } from '../../Well/Well'
import { OrderStatus } from '../OrderStatus'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = orderStatusProps

  const enzymeWrapper = mount(
    <StaticRouter>
      <OrderStatus {...props} />
    </StaticRouter>
  )

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderStatus component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    const orderStatus = enzymeWrapper.find(OrderStatus)
    expect(orderStatus).toBeDefined()
  })

  test('calls onFetchOrder when mounted', () => {
    const { props } = setup()
    expect(props.onFetchOrder).toHaveBeenCalledTimes(1)
    expect(props.onFetchOrder).toHaveBeenCalledWith(7, 'testToken')
  })

  test('calls onFetchOrder when new props are recieved', () => {
    const { enzymeWrapper, props } = setup()
    enzymeWrapper.find(OrderStatus).instance().componentWillReceiveProps({
      ...orderStatusProps,
      ...orderStatusPropsTwo
    })
    expect(props.onFetchOrder).toHaveBeenCalledTimes(2)
    expect(props.onFetchOrder).toHaveBeenCalledWith(7, 'testToken2')
  })

  describe('introduction', () => {
    test('displays the correct text', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction).text()).toEqual('This page will automatically update as your orders are processed. The Order Status page can be accessed later by visiting https://search.earthdata.nasa.gov/data/retrieve/7 or the Download Status and History page.')
    })

    test('order status link has correct href', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction).find('a').at(0).props().href).toEqual('https://search.earthdata.nasa.gov/data/retrieve/7')
    })

    test('status link has correct href', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find(Well.Introduction).find('a').at(1).props().href).toEqual('/data/status/')
    })
  })

  describe('data links', () => {
    test('renders data links in a list', () => {
      const { enzymeWrapper } = setup()
      const orderStatus = enzymeWrapper.find(OrderStatus)
      expect(orderStatus.find('.order-status__collection-links-item').length).toEqual(1)
      expect(orderStatus.find('.order-status__collection-link').at(0).props().href).toEqual('http://linkurl.com/test')
    })
  })

  describe('footer links', () => {
    test('calls onChangePath when the search link is clicked', () => {
      const { enzymeWrapper, props } = setup()
      const orderStatus = enzymeWrapper.find(OrderStatus)
      const backToSearchLink = orderStatus.find('.order-status__footer-link-list').find(Link).at(0)
      backToSearchLink.simulate('click')
      expect(props.onChangePath).toHaveBeenCalledTimes(1)
      expect(props.onChangePath).toHaveBeenCalledWith('/search/?test=source_link')
    })
  })
})
