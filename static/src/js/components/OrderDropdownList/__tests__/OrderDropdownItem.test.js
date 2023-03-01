import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { OrderDropdownItem } from '../OrderDropdownItem'

import { retrievalStatusPropsEsi } from '../../OrderStatus/__tests__/mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const order = retrievalStatusPropsEsi.retrieval.collections.byId[1].orders[0]

  const props = {
    order,
    index: 0,
    totalOrders: 2
  }

  const enzymeWrapper = shallow(<OrderDropdownItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderDropdownItem component', () => {
  const { enzymeWrapper } = setup()

  test('is displayed', () => {
    expect(enzymeWrapper).toBeDefined()
  })

  test('displays the links', () => {
    expect(enzymeWrapper.find('.order-dropdown-item__title').text()).toEqual('Order 1/2 Order ID: 5000000333461')
    expect(enzymeWrapper.find('.order-dropdown-item__list-item').length).toEqual(2)
    expect(enzymeWrapper.find('.order-dropdown-item__list-item').at(0).find('.order-dropdown-item__link').text())
      .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html')
    expect(enzymeWrapper.find('.order-dropdown-item__list-item').at(0).find('.order-dropdown-item__link').prop('href'))
      .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html')
    expect(enzymeWrapper.find('.order-dropdown-item__list-item').at(1).find('.order-dropdown-item__link').text())
      .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip')
    expect(enzymeWrapper.find('.order-dropdown-item__list-item').at(1).find('.order-dropdown-item__link').prop('href'))
      .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip')
  })
})
