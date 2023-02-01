import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { OrderProgressList } from '../OrderProgressList'
import { OrderProgressItem } from '../OrderProgressItem'

import { retrievalStatusPropsEsi } from '../../OrderStatus/__tests__/mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const { orders } = retrievalStatusPropsEsi.retrieval.collections.byId[1]

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
