import React from 'react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

// @ts-expect-error The file does not have types
import { retrievalStatusPropsEchoOrder } from './mocks'

import OrderStatusList from '../OrderStatusList'
import OrderStatusCollection from '../OrderStatusCollection'

vi.mock('../OrderStatusCollection', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: OrderStatusList,
  defaultProps: {
    retrievalCollections: Object.values(
      retrievalStatusPropsEchoOrder.retrieval.retrievalCollections
    ),
    retrievalId: '1'
  }
})

describe('OrderStatus component', () => {
  test('renders a list of OrderStatusItem components', () => {
    setup()

    expect(OrderStatusCollection).toHaveBeenCalledTimes(1)
    expect(OrderStatusCollection).toHaveBeenCalledWith({
      collection: {
        collectionId: 'TEST_COLLECTION_111',
        collectionMetadata: {
          datasetId: 'Test Dataset ID',
          id: 'C10000001-EDSC'
        },
        links: [{
          links: [{
            type: 'HOME PAGE',
            url: 'http://linkurl.com/test'
          }],
          title: 'Test Dataset ID'
        }],
        retrievalOrders: [{
          orderInformation: {
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
          orderNumber: '92567A0B-D146-B396-583B-D8C3487CE087',
          state: 'PROCESSING',
          type: 'ECHO ORDERS'
        }]
      },
      defaultOpen: true,
      retrievalId: '1'
    }, {})
  })
})
