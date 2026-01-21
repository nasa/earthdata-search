import React from 'react'
import type { Mock } from 'vitest'

import setupTest from '../../../../../../../vitestConfigs/setupTest'
import OrderStatusItem from '../../OrderStatusItem'
import EchoOrderStatusItem from '../EchoOrderStatusItem'
import { STATUS_MESSAGES } from '../../../../constants/orderStatusMessages'

vi.mock('../../OrderStatusItem', () => ({ default: vi.fn(() => <div />) }))

const mockUseGetRetrievalGranuleLinks = vi.fn()
vi.mock('../../../../hooks/useGetRetrievalGranuleLinks', () => ({
  useGetRetrievalGranuleLinks: () => mockUseGetRetrievalGranuleLinks()
}))

vi.mock('../../buildEddLink', () => ({ default: vi.fn().mockReturnValue('mock-eddlink') }))

const setup = setupTest({
  Component: EchoOrderStatusItem,
  defaultProps: {
    defaultOpen: true,
    retrievalCollection: {
      collectionMetadata: {
        directDistributionInformation: {},
        title: 'Collection Title',
        isCSDA: false
      },
      granuleCount: 1,
      obfuscatedId: '12345',
      retrievalOrders: [{
        error: null,
        id: 127,
        orderInformation: {},
        orderNumber: null,
        state: 'create_failed',
        type: 'ECHO ORDERS'
      }],
      updatedAt: '2024-01-01T00:00:00Z'
    },
    retrievalId: '1'
  }
})

describe('EchoOrderStatusItem', () => {
  describe('when the order has failed', () => {
    test('renders an OrderStatusItem', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: ['https://example.com/browse'],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      setup()

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'ECHO ORDERS',
        className: 'order-status-item order-status-item--is-opened order-status-item--failed',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        opened: true,
        orderInfo: STATUS_MESSAGES.ECHO_ORDERS.FAILED,
        orderStatus: 'failed',
        progressPercentage: 100,
        setOpened: expect.any(Function),
        tabs: expect.any(Array),
        title: 'Collection Title',
        totalCompleteOrders: 0,
        totalOrders: 0,
        updatedAt: '2024-01-01T00:00:00Z'
      }, {})

      const orderStatusItemCall = (OrderStatusItem as Mock).mock.calls[0][0]
      const { tabs } = orderStatusItemCall

      expect(tabs).toHaveLength(1)

      const browseImageryTab = tabs[0]
      expect(browseImageryTab.props.title).toEqual('Browse Imagery')
      const browseLinksPanel = browseImageryTab.props.children
      expect(browseLinksPanel.props).toEqual({
        accessMethodType: 'ECHO ORDERS',
        browseUrls: ['https://example.com/browse'],
        earthdataEnvironment: 'prod',
        eddLink: 'mock-eddlink',
        granuleCount: 1,
        granuleLinksIsLoading: false,
        retrievalCollection: {
          collectionMetadata: {
            directDistributionInformation: {},
            isCSDA: false,
            title: 'Collection Title'
          },
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalOrders: [{
            error: null,
            id: 127,
            orderInformation: {},
            orderNumber: null,
            state: 'create_failed',
            type: 'ECHO ORDERS'
          }],
          updatedAt: '2024-01-01T00:00:00Z'
        },
        retrievalId: '1'
      })
    })
  })

  describe('when the order is creating', () => {
    test('renders an OrderStatusItem', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: [],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      setup({
        overrideProps: {
          retrievalCollection: {
            collectionMetadata: {
              directDistributionInformation: {},
              title: 'Collection Title',
              isCSDA: false
            },
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalOrders: [{
              error: null,
              id: 127,
              orderInformation: {},
              orderNumber: null,
              state: 'creating',
              type: 'ECHO ORDERS'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'ECHO ORDERS',
        className: 'order-status-item order-status-item--is-opened',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        opened: true,
        orderInfo: STATUS_MESSAGES.ECHO_ORDERS.IN_PROGRESS,
        orderStatus: 'creating',
        progressPercentage: 0,
        setOpened: expect.any(Function),
        tabs: expect.any(Array),
        title: 'Collection Title',
        totalCompleteOrders: 0,
        totalOrders: 0,
        updatedAt: '2024-01-01T00:00:00Z'
      }, {})
    })
  })

  describe('when the order is complete', () => {
    test('renders an OrderStatusItem', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: [],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      setup({
        overrideProps: {
          retrievalCollection: {
            collectionMetadata: {
              directDistributionInformation: {},
              title: 'Collection Title',
              isCSDA: false
            },
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalOrders: [{
              error: null,
              id: 127,
              orderInformation: {},
              orderNumber: null,
              state: 'complete',
              type: 'ECHO ORDERS'
            }],
            updatedAt: '2024-01-01T00:00:00Z'
          }
        }
      })

      expect(OrderStatusItem).toHaveBeenCalledTimes(1)
      expect(OrderStatusItem).toHaveBeenCalledWith({
        accessMethodType: 'ECHO ORDERS',
        className: 'order-status-item order-status-item--is-opened order-status-item--complete',
        collectionIsCSDA: false,
        granuleCount: 1,
        hasStatus: true,
        messageIsError: false,
        messages: [],
        opened: true,
        orderInfo: STATUS_MESSAGES.ECHO_ORDERS.COMPLETE,
        orderStatus: 'complete',
        progressPercentage: 100,
        setOpened: expect.any(Function),
        tabs: expect.any(Array),
        title: 'Collection Title',
        totalCompleteOrders: 0,
        totalOrders: 0,
        updatedAt: '2024-01-01T00:00:00Z'
      }, {})
    })
  })

  describe('when there are no Browse URLs', () => {
    test('does not render the Browse tab', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: [],
          data: [],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      setup()

      const orderStatusItemCall = (OrderStatusItem as Mock).mock.calls[0][0]
      const { tabs } = orderStatusItemCall

      expect(tabs).toHaveLength(0)
    })
  })
})
