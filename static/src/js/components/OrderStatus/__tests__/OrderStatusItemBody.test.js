import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { orderStatusProps } from './mocks'

import { OrderStatusItemBody } from '../OrderStatusItemBody'

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

  const enzymeWrapper = shallow(<OrderStatusItemBody {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderStatusItemBody component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper).toBeDefined()
    expect(enzymeWrapper.hasClass('order-status-item-body')).toEqual(true)
  })

  describe('order status', () => {
    describe('in progress', () => {
      test('renders with the correct classname', () => {
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

        expect(enzymeWrapper.find('.order-status-item-body__state-display').length).toEqual(1)
        expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--success')).toEqual(false)
        expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--errored')).toEqual(false)
      })
    })

    describe('success', () => {
      test('renders with the correct classname', () => {
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

        expect(enzymeWrapper.find('.order-status-item-body__state-display').length).toEqual(1)
        expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--success')).toEqual(true)
      })
    })

    describe('error', () => {
      test('renders with the correct classname', () => {
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

        expect(enzymeWrapper.find('.order-status-item-body__state-display').length).toEqual(1)
        expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--errored')).toEqual(true)
      })
    })
  })
})
