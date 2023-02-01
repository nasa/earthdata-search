import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { AdminRetrievalDetails } from '../AdminRetrievalDetails'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    retrieval: {
      username: 'edsc-test',
      obfuscated_id: '06347346'
    },
    onRequeueOrder: jest.fn(),
    ...overrideProps
  }
  const enzymeWrapper = shallow(<AdminRetrievalDetails {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminRetrievalDetails component', () => {
  test('should render the site AdminRetrievalDetails', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(0).text()).toEqual('edsc-test')
    expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(1).text()).toEqual('06347346')
  })

  describe('with collections', () => {
    test('should render collections', () => {
      const { enzymeWrapper } = setup({
        retrieval: {
          username: 'edsc-test',
          jsondata: {
            portal_id: 'testPortal',
            source: '?mock-source'
          },
          obfuscated_id: '06347346',
          collections: [{
            id: 1,
            collection_id: 'C10000005',
            data_center: 'EDSC',
            granule_count: 35,
            orders: []
          }]
        }
      })

      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(0).text()).toEqual('edsc-test')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(1).text()).toEqual('06347346')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(2).text()).toEqual('/portal/testPortal/search?mock-source')
      expect(enzymeWrapper.find('.admin-retrieval-details__collection').length).toEqual(1)

      expect(enzymeWrapper.find('.admin-retrieval-details__collection-heading').at(0).text()).toEqual('C10000005')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(3).text()).toEqual('1')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(4).text()).toEqual('EDSC')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(5).text()).toEqual('0')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(6).text()).toEqual('35')
    })
  })

  describe('with orders', () => {
    test('should render collections and the orders table', () => {
      const { enzymeWrapper } = setup({
        retrieval: {
          username: 'edsc-test',
          jsondata: {
            source: '?mock-source'
          },
          obfuscated_id: '06347346',
          collections: [{
            id: 1,
            collection_id: 'C10000005',
            data_center: 'EDSC',
            granule_count: 35,
            orders: [{
              id: 5,
              order_information: {},
              order_number: '40058',
              state: 'creating',
              type: 'ECHO ORDERS'
            }, {
              id: 6,
              order_information: {},
              order_number: '4005',
              state: 'creating',
              type: 'ECHO ORDERS'
            }]
          }]
        }
      })

      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(0).text()).toEqual('edsc-test')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(1).text()).toEqual('06347346')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(2).text()).toEqual('/search?mock-source')

      expect(enzymeWrapper.find('.admin-retrieval-details__collection').length).toEqual(1)
      expect(enzymeWrapper.find('.admin-retrieval-details__collection-heading').at(0).text()).toEqual('C10000005')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(3).text()).toEqual('1')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(4).text()).toEqual('EDSC')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(5).text()).toEqual('2')
      expect(enzymeWrapper.find('.admin-retrieval-details__metadata-display-content').at(6).text()).toEqual('35')

      expect(enzymeWrapper.find('.admin-retrieval-details__orders-table').length).toEqual(1)
      expect(enzymeWrapper.find('.admin-retrieval-details__order-row').length).toEqual(2)
      expect(enzymeWrapper.find('.admin-retrieval-details__order-row td').at(1).text()).toEqual('5')
      expect(enzymeWrapper.find('.admin-retrieval-details__order-row td').at(2).text()).toEqual('40058')
      expect(enzymeWrapper.find('.admin-retrieval-details__order-row td').at(3).text()).toEqual('ECHO ORDERS')
      expect(enzymeWrapper.find('.admin-retrieval-details__order-row td').at(4).text()).toEqual('creating')
    })

    test('clicking on the Requeue button calls onRequeueOrder', () => {
      const { enzymeWrapper, props } = setup({
        retrieval: {
          username: 'edsc-test',
          jsondata: {
            source: '?mock-source'
          },
          obfuscated_id: '06347346',
          collections: [{
            id: 1,
            collection_id: 'C10000005',
            data_center: 'EDSC',
            granule_count: 35,
            orders: [{
              id: 5,
              order_information: {},
              order_number: '40058',
              state: 'creating',
              type: 'ECHO ORDERS'
            }]
          }]
        }
      })

      enzymeWrapper.find('.admin-retrieval-details__order-row td').at(0).children(0).simulate('click')

      expect(props.onRequeueOrder).toHaveBeenCalledTimes(1)
      expect(props.onRequeueOrder).toHaveBeenCalledWith(5)
    })
  })
})
