import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { OrderDropdownList } from '../OrderDropdownList'
import { OrderDropdownItem } from '../OrderDropdownItem'

import { retrievalStatusPropsEsi } from '../../OrderStatus/__tests__/mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const { orders } = retrievalStatusPropsEsi.retrieval.collections.byId[1]

  const props = {
    orders,
    totalOrders: 2
  }

  const enzymeWrapper = shallow(<OrderDropdownList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderDropdownList component', () => {
  const { enzymeWrapper } = setup()

  test('is displayed', () => {
    expect(enzymeWrapper).toBeDefined()
  })

  test('renders items', () => {
    expect(enzymeWrapper.find(OrderDropdownItem).length).toEqual(2)
  })
})
