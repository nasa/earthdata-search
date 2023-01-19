import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { retrievalStatusPropsEchoOrder } from './mocks'

import { OrderStatusList } from '../OrderStatusList'
import OrderStatusItem from '../OrderStatusItem'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
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

  describe('list', () => {
    test('renders correctly', () => {
      const { enzymeWrapper, props } = setup()

      expect(enzymeWrapper.find(OrderStatusItem).length).toEqual(1)
      expect(enzymeWrapper.find(OrderStatusItem).at(0).props()).toEqual({
        defaultOpen: true,
        earthdataEnvironment: 'prod',
        granuleDownload: {},
        collection: {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            id: 'C10000001-EDSC',
            dataset_id: 'Test Dataset ID'
          },
          access_method: {
            type: 'ECHO ORDERS'
          },
          orders: [
            {
              type: 'ECHO ORDERS',
              order_number: '92567A0B-D146-B396-583B-D8C3487CE087',
              state: 'PROCESSING',
              order_information: {
                client_identity: 'kzAY1v0kVjQ7QVpwBw-kLQ',
                created_at: '2019-08-14T12:26:37Z',
                id: '92567A0B-D146-B396-583B-D8C3487CE087',
                notification_level: 'INFO',
                order_price: 0,
                owner_id: 'CF8F45-8138-232E-7C36-5D023FEF8',
                provider_orders: [
                  {
                    reference: {
                      id: 'EDF_DEV06',
                      location: 'https://cmr.sit.earthdata.nasa.gov:/legacy-services/rest/orders/92567A0B-D146-B396-583B-D8C3487CE087/provider_orders/EDF_DEV06',
                      name: 'EDF_DEV06'
                    }
                  }
                ],
                state: 'PROCESSING',
                submitted_at: '2019-08-14T12:26:42Z',
                updated_at: '2019-08-14T12:27:13Z',
                user_domain: 'OTHER',
                user_region: 'USA'
              }
            }
          ]
        },
        match: {
          params: {
            retrieval_id: 2,
            id: 1
          },
          path: '/downloads/2/collections/1'
        },
        onChangePath: props.onChangePath,
        onFetchRetrieval: props.onFetchRetrieval,
        onFetchRetrievalCollection: props.onFetchRetrievalCollection,
        onFetchRetrievalCollectionGranuleLinks: props.onFetchRetrievalCollectionGranuleLinks,
        onFetchRetrievalCollectionGranuleBrowseLinks:
          props.onFetchRetrievalCollectionGranuleBrowseLinks,
        onToggleAboutCSDAModal: props.onToggleAboutCSDAModal
      })
    })
  })
})
