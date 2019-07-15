import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { orderStatusProps } from './mocks'

import { OrderStatusItem } from '../OrderStatusItem'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collection: orderStatusProps.order.collections.download[0],
    type: 'download',
    onChangePath: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<OrderStatusItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderStatus component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper).toBeDefined()
    expect(enzymeWrapper.hasClass('order-status-item')).toEqual(true)
  })

  describe('download item type', () => {
    test('renders correct status classname', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.hasClass('order-status-item--success')).toEqual(true)
    })
  })

  describe('status classname', () => {
    describe('in progress', () => {
      test('renders correct status classname', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_order',
          collection: {
            collection_id: 'TEST_COLLECTION_111',
            collection_metadata: {
              dataset_id: 'Test Dataset ID',
              order_status: 'in progress'
            }
          }
        })
        expect(enzymeWrapper.hasClass('order-status-item--in-progress')).toEqual(true)
      })
    })

    describe('complete', () => {
      test('renders correct status classname when order status is complete', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_order',
          collection: {
            collection_id: 'TEST_COLLECTION_111',
            collection_metadata: {
              dataset_id: 'Test Dataset ID',
              order_status: 'complete'
            }
          }
        })
        expect(enzymeWrapper.hasClass('order-status-item--success')).toEqual(true)
      })
    })

    describe('errored', () => {
      test('renders correct status classname when order status is failed', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_order',
          collection: {
            collection_id: 'TEST_COLLECTION_111',
            collection_metadata: {
              dataset_id: 'Test Dataset ID',
              order_status: 'failed'
            }
          }
        })
        expect(enzymeWrapper.hasClass('order-status-item--errored')).toEqual(true)
      })
    })
  })
})
