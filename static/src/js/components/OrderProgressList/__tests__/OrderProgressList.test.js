import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { OrderProgressList } from '../OrderProgressList'
import { OrderProgressItem } from '../OrderProgressItem'

import { orderStatusPropsEsi } from '../../OrderStatus/__tests__/mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const { orders } = orderStatusPropsEsi.order.collections.esi_orders[0]
    .access_method.order.service_options

  const props = {
    orders
  }

  const enzymeWrapper = shallow(<OrderProgressList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderProgressList component', () => {
  const { enzymeWrapper } = setup()

  test('is displayed', () => {
    expect(enzymeWrapper).toBeDefined()
  })

  test('renders items', () => {
    expect(enzymeWrapper.find(OrderProgressItem).length).toEqual(2)
  })
})
