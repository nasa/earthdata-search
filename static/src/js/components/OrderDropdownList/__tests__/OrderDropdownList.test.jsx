import setupTest from '../../../../../../vitestConfigs/setupTest'

import OrderDropdownList from '../OrderDropdownList'
import OrderDropdownItem from '../OrderDropdownItem'

import { retrievalStatusPropsEsi } from '../../OrderStatus/__tests__/mocks'

vi.mock('../OrderDropdownItem', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: OrderDropdownList,
  defaultProps: {
    orders: retrievalStatusPropsEsi.retrieval.retrievalCollections[0].retrievalOrders,
    totalOrders: 2
  }
})

describe('OrderDropdownList component', () => {
  test('renders items', () => {
    setup()

    expect(OrderDropdownItem).toHaveBeenCalledTimes(2)
    expect(OrderDropdownItem).toHaveBeenNthCalledWith(1, {
      index: 0,
      order: {
        orderInformation: {
          contactInformation: {
            contactEmail: 'nsidc@nsidc.org',
            contactName: 'NSIDC User Services'
          },
          downloadUrls: { downloadUrl: ['https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html', 'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip'] },
          requestStatus: {
            numberProcessed: 81,
            status: 'complete',
            totalNumber: 81
          }
        },
        orderNumber: '5000000333461',
        state: 'complete',
        type: 'ESI'
      },
      totalOrders: 2
    }, {})

    expect(OrderDropdownItem).toHaveBeenNthCalledWith(2, {
      index: 1,
      order: {
        orderInformation: {
          contactInformation: {
            contactEmail: 'nsidc@nsidc.org',
            contactName: 'NSIDC User Services'
          },
          downloadUrls: { downloadUrl: ['https://n5eil02u.ecs.nsidc.org/esir/5000000333462.html', 'https://n5eil02u.ecs.nsidc.org/esir/5000000333462.zip'] },
          requestStatus: {
            numberProcessed: 13,
            status: 'processing',
            totalNumber: 100
          }
        },
        orderNumber: '5000000333462',
        state: 'processing',
        type: 'ESI'
      },
      totalOrders: 2
    }, {})
  })
})
