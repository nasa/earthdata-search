import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { Badge, ProgressBar } from 'react-bootstrap'
import { OrderProgressItem } from '../OrderProgressItem'

import { retrievalStatusPropsEsi } from '../../OrderStatus/__tests__/mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const order = retrievalStatusPropsEsi.retrieval.collections.byId[1].orders[0]

  const props = {
    order,
    ...overrideProps
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
    expect(enzymeWrapper.find('.order-progress-item__processed').text()).toEqual('81 of 81 granule(s) processed (100%)')
    expect(enzymeWrapper.find(ProgressBar).prop('now')).toEqual(100)
    expect(enzymeWrapper.find(Badge).text()).toEqual('Complete')
  })

  describe('when order information is not defined', () => {
    test('displays the correct progress', () => {
      const { enzymeWrapper } = setup({
        order: {
          ...retrievalStatusPropsEsi.retrieval.collections.byId[1].orders[0],
          state: 'creating',
          order_information: {}
        }
      })
      expect(enzymeWrapper.find('.order-progress-item__title').text()).toEqual('Order ID: 5000000333461')
      expect(enzymeWrapper.find('.order-progress-item__processed').text()).toEqual('(0%)')
      expect(enzymeWrapper.find(ProgressBar).prop('now')).toEqual(0)
      expect(enzymeWrapper.find(Badge).text()).toEqual('Creating')
    })
  })
})
