import React from 'react'

import setupTest from '../../../../../../../jestConfigs/setupTest'
import OrderStatusItem from '../../OrderStatusItem'
import DownloadStatusItem from '../DownloadStatusItem'
import { STATUS_MESSAGES } from '../../../../constants/orderStatusMessages'

jest.mock('../../OrderStatusItem', () => jest.fn(() => <div />))

const mockUseGetRetrievalGranuleLinks = jest.fn()
jest.mock('../../../../hooks/useGetRetrievalGranuleLinks', () => ({
  useGetRetrievalGranuleLinks: () => mockUseGetRetrievalGranuleLinks()
}))

jest.mock('../../buildEddLink', () => jest.fn().mockReturnValue('mock-eddlink'))

const setup = setupTest({
  Component: DownloadStatusItem,
  defaultProps: {
    defaultOpen: true,
    onToggleAboutCSDAModal: jest.fn(),
    retrievalCollection: {
      collectionMetadata: {
        directDistributionInformation: {},
        title: 'Collection Title',
        isCSDA: false
      },
      granuleCount: 1,
      obfuscatedId: '12345',
      retrievalOrders: [],
      updatedAt: '2024-01-01T00:00:00Z'
    },
    retrievalId: '1'
  }
})

describe('DownloadStatusItem', () => {
  test('renders an OrderStatusItem', async () => {
    mockUseGetRetrievalGranuleLinks.mockReturnValue({
      granuleLinks: {
        browse: ['https://example.com/browse'],
        data: ['https://example.com'],
        s3: ['https://example.com/s3']
      },
      loading: false,
      percentDone: '100'
    })

    const { props } = setup()

    expect(OrderStatusItem).toHaveBeenCalledTimes(1)
    expect(OrderStatusItem).toHaveBeenCalledWith({
      accessMethodType: 'download',
      className: 'order-status-item order-status-item--complete order-status-item--is-opened',
      collectionIsCSDA: false,
      granuleCount: 1,
      hasStatus: false,
      messageIsError: false,
      messages: [],
      onToggleAboutCSDAModal: props.onToggleAboutCSDAModal,
      opened: true,
      orderInfo: STATUS_MESSAGES.DOWNLOAD.COMPLETE,
      orderStatus: 'creating',
      progressPercentage: 100,
      setOpened: expect.any(Function),
      tabs: expect.any(Array),
      title: 'Collection Title',
      totalCompleteOrders: 0,
      totalOrders: 0,
      updatedAt: '2024-01-01T00:00:00Z'
    }, {})

    const orderStatusItemCall = (OrderStatusItem as jest.Mock).mock.calls[0][0]
    const { tabs } = orderStatusItemCall

    expect(tabs).toHaveLength(4)

    const downloadFilesTab = tabs[0]
    expect(downloadFilesTab.props.title).toEqual('Download Files')
    const downloadFilesPanel = downloadFilesTab.props.children
    expect(downloadFilesPanel.props).toEqual({
      accessMethodType: 'download',
      collectionIsCSDA: false,
      disableEddInProgress: false,
      downloadLinks: ['https://example.com'],
      eddLink: 'mock-eddlink',
      granuleCount: 1,
      granuleLinksIsLoading: false,
      percentDoneDownloadLinks: '100',
      retrievalId: '1',
      showTextWindowActions: false
    })

    const s3Tab = tabs[1]
    expect(s3Tab.props.title).toEqual('AWS S3 Access')
    const s3LinksPanel = s3Tab.props.children
    expect(s3LinksPanel.props).toEqual({
      accessMethodType: 'download',
      directDistributionInformation: {},
      granuleCount: 1,
      granuleLinksIsLoading: false,
      retrievalId: '1',
      s3Links: ['https://example.com/s3'],
      showTextWindowActions: false
    })

    const downloadScriptTab = tabs[2]
    expect(downloadScriptTab.props.title).toEqual('Download Script')
    const downloadScriptPanel = downloadScriptTab.props.children
    expect(downloadScriptPanel.props).toEqual({
      accessMethodType: 'download',
      downloadLinks: ['https://example.com'],
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
        retrievalOrders: [],
        updatedAt: '2024-01-01T00:00:00Z'
      },
      retrievalId: '1'
    })

    const browseImageryTab = tabs[3]
    expect(browseImageryTab.props.title).toEqual('Browse Imagery')
    const browseLinksPanel = browseImageryTab.props.children
    expect(browseLinksPanel.props).toEqual({
      accessMethodType: 'download',
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
        retrievalOrders: [],
        updatedAt: '2024-01-01T00:00:00Z'
      },
      retrievalId: '1'
    })
  })

  describe('when there are no S3 or Browse URLs', () => {
    test('does not render the S3 or Browse tabs', async () => {
      mockUseGetRetrievalGranuleLinks.mockReturnValue({
        granuleLinks: {
          browse: [],
          data: ['https://example.com'],
          s3: []
        },
        loading: false,
        percentDone: '100'
      })

      setup()

      const orderStatusItemCall = (OrderStatusItem as jest.Mock).mock.calls[0][0]
      const { tabs } = orderStatusItemCall

      expect(tabs).toHaveLength(2)

      const downloadFilesTab = tabs[0]
      expect(downloadFilesTab.props.title).toEqual('Download Files')

      const downloadScriptTab = tabs[1]
      expect(downloadScriptTab.props.title).toEqual('Download Script')
    })
  })
})
