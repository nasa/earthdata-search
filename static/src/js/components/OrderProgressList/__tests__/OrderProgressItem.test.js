import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Badge, ProgressBar } from 'react-bootstrap'
import { OrderProgressItem } from '../OrderProgressItem'
import { orderStatusPropsEsi } from '../../OrderStatus/__tests__/mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const order = orderStatusPropsEsi.order.collections.esi[0]
    .access_method.order.service_options.orders[0]

  const props = {
    order
  }

  const enzymeWrapper = shallow(<OrderProgressItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderProgressItem component', () => {
  const { enzymeWrapper } = setup()

  test('is displayed', () => {
    expect(enzymeWrapper).toBeDefined()
  })

  test('shows the correct order metadata', () => {
    expect(enzymeWrapper.find('.order-progress-item__title').text()).toEqual('Order ID: 5000000333461')
    expect(enzymeWrapper.find('.order-progress-item__processed').text()).toEqual('81 of 81 granules processed (100%)')
    expect(enzymeWrapper.find(ProgressBar).prop('now')).toEqual(100)
    expect(enzymeWrapper.find(Badge).text()).toEqual('Complete')
  })
})
