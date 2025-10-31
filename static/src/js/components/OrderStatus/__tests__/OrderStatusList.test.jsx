import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import { retrievalStatusPropsEchoOrder } from './mocks'

import OrderStatusList from '../OrderStatusList'
import OrderStatusItem from '../OrderStatusItem'

jest.mock('../OrderStatusItem', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: OrderStatusList,
  defaultProps: {
    collections: Object.values(retrievalStatusPropsEchoOrder.retrieval.collections.byId),
    earthdataEnvironment: 'prod',
    granuleDownload: {},
    heading: 'Stage For Delivery',
    introduction: 'When the data for the following orders becomes available, an email containing download links will be sent to the address you\'ve provided.',
    type: 'echo_orders',
    match: {
      params: {
        retrieval_id: 2,
        id: 1
      },
      path: '/downloads/2/collections/1'
    },
    onChangePath: jest.fn(),
    onFetchRetrieval: jest.fn(),
    onFetchRetrievalCollection: jest.fn(),
    onFetchRetrievalCollectionGranuleLinks: jest.fn(),
    onFetchRetrievalCollectionGranuleBrowseLinks: jest.fn(),
    onToggleAboutCSDAModal: jest.fn()
  }
})

describe('OrderStatus component', () => {
  test('renders a list of OrderStatusItem components', () => {
    setup()

    expect(OrderStatusItem).toHaveBeenCalledTimes(1)
    expect(OrderStatusItem).toHaveBeenCalledWith({
      collection: {
        access_method: { type: 'ECHO ORDERS' },
        collection_id: 'TEST_COLLECTION_111',
        collection_metadata: {
          dataset_id: 'Test Dataset ID',
          id: 'C10000001-EDSC'
        },
        orders: [{
          order_information: {
            client_identity: 'kzAY1v0kVjQ7QVpwBw-kLQ',
            created_at: '2019-08-14T12:26:37Z',
            id: '92567A0B-D146-B396-583B-D8C3487CE087',
            notification_level: 'INFO',
            order_price: 0,
            owner_id: 'CF8F45-8138-232E-7C36-5D023FEF8',
            provider_orders: [{
              reference: {
                id: 'EDF_DEV06',
                location: 'https://cmr.sit.earthdata.nasa.gov:/legacy-services/rest/orders/92567A0B-D146-B396-583B-D8C3487CE087/provider_orders/EDF_DEV06',
                name: 'EDF_DEV06'
              }
            }],
            state: 'PROCESSING',
            submitted_at: '2019-08-14T12:26:42Z',
            updated_at: '2019-08-14T12:27:13Z',
            user_domain: 'OTHER',
            user_region: 'USA'
          },
          order_number: '92567A0B-D146-B396-583B-D8C3487CE087',
          state: 'PROCESSING',
          type: 'ECHO ORDERS'
        }]
      },
      defaultOpen: true,
      earthdataEnvironment: 'prod',
      granuleDownload: {},
      onChangePath: expect.any(Function),
      onFetchRetrieval: expect.any(Function),
      onFetchRetrievalCollection: expect.any(Function),
      onFetchRetrievalCollectionGranuleBrowseLinks: expect.any(Function),
      onFetchRetrievalCollectionGranuleLinks: expect.any(Function),
      onToggleAboutCSDAModal: expect.any(Function)
    }, {})
  })
})
