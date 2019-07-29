import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { retrievalStatusProps } from './mocks'

import { OrderStatusList } from '../OrderStatusList'
import OrderStatusItem from '../OrderStatusItem'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collections: retrievalStatusProps.retrieval.collections.download,
    heading: 'Stage For Delivery',
    introduction: 'When the data for the following orders becomes available, an email containing download links will be sent to the address you\'ve provided.',
    type: 'echo_order',
    onChangePath: jest.fn()
  }

  const enzymeWrapper = shallow(<OrderStatusList {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderStatus component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper).toBeDefined()
    expect(enzymeWrapper.hasClass('order-status-list')).toEqual(true)
  })

  describe('heading', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.order-status-list__heading').at(0).text()).toEqual('Stage For Delivery')
    })
  })

  describe('introduction', () => {
    test('renders correctly', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.find('.order-status-list__introduction').at(0).text()).toEqual('When the data for the following orders becomes available, an email containing download links will be sent to the address you\'ve provided.')
    })
  })

  describe('list', () => {
    test('renders correctly', () => {
      const { enzymeWrapper, props } = setup()
      expect(enzymeWrapper.find(OrderStatusItem).length).toEqual(1)
      expect(enzymeWrapper.find(OrderStatusItem).at(0).props()).toEqual({
        collection: {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            dataset_id: 'Test Dataset ID'
          },
          access_method: {
            order: {
              order_status: 'in progress'
            }
          }
        },
        onChangePath: props.onChangePath,
        type: 'echo_order'
      })
    })
  })
})
