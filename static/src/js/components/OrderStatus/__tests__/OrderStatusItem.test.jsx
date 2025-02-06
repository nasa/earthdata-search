import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { retrievalStatusProps } from './mocks'

import { OrderStatusItem } from '../OrderStatusItem'

import { ProgressRing } from '../../ProgressRing/ProgressRing'

import * as getClientId from '../../../../../../sharedUtils/getClientId'

const shouldRefreshCopy = OrderStatusItem.prototype.shouldRefresh

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers({ legacyFakeTimers: true })
  jest.spyOn(getClientId, 'getClientId').mockImplementation(() => ({
    client: 'eed-default-test-serverless-client'
  }))
})

afterEach(() => {
  jest.useRealTimers()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps, mockRefresh) {
  const shouldRefreshMock = jest.fn()

  OrderStatusItem.prototype.shouldRefresh = mockRefresh ? shouldRefreshMock : shouldRefreshCopy

  const props = {
    authToken: 'mock-token',
    collection: retrievalStatusProps.retrieval.collections.byId[1],
    defaultOpen: false,
    earthdataEnvironment: 'prod',
    granuleDownload: {
      isLoading: false,
      TEST_COLLECTION_111: []
    },
    key: 'TEST_COLLECTION_111',
    match: {
      params: {
        retrieval_id: '2',
        id: '1'
      },
      path: '/downloads/2/collections/1'
    },
    onChangePath: jest.fn(),
    onFetchRetrieval: jest.fn(),
    onFetchRetrievalCollection: jest.fn(),
    onFetchRetrievalCollectionGranuleLinks: jest.fn(),
    onFetchRetrievalCollectionGranuleBrowseLinks: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    orders: [{
      type: 'download'
    }],
    type: 'download',
    ...overrideProps
  }
  const enzymeWrapper = shallow(<OrderStatusItem {...props} />)

  return {
    enzymeWrapper,
    props,
    shouldRefreshMock
  }
}

describe('OrderStatusItem', () => {
  describe('Auto-refresh', () => {
    describe('when mounted', () => {
      test('should start a timer', () => {
        const { enzymeWrapper, props, shouldRefreshMock } = setup(
          {
            type: 'echo_orders',
            collection: {
              id: 1,
              collection_id: 'TEST_COLLECTION_111',
              retrieval_id: '54',
              collection_metadata: {
                id: 'TEST_COLLECTION_111',
                dataset_id: 'Test Dataset ID'
              },
              access_method: {
                type: 'ECHO ORDERS'
              },
              orders: [{
                id: 1,
                state: 'processing',
                order_information: {
                  requestStatus: {
                    status: 'processing'
                  }
                }
              }],
              isLoaded: true
            }
          },
          true
        )

        jest.spyOn(global, 'setInterval')

        const { intervalId } = enzymeWrapper.instance()

        expect(intervalId).toBeDefined()
        expect(setInterval).toHaveBeenCalledTimes(1)
        expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
        expect(props.onFetchRetrievalCollection).toHaveBeenCalledWith(1)
        expect(shouldRefreshMock).toHaveBeenCalledTimes(0)

        shouldRefreshMock.mockRestore()
      })

      describe('when the order status is not complete or failed', () => {
        test('should try to refresh', () => {
          const { props } = setup({
            type: 'echo_orders',
            collection: {
              id: 111,
              collection_metadata: {
                id: 'TEST_COLLECTION_111',
                dataset_id: 'Test Dataset ID'
              },
              access_method: {
                type: 'ECHO ORDERS'
              },
              orders: [{
                state: 'processing',
                order_information: {
                  requestStatus: {
                    status: 'processing'
                  }
                }
              }],
              isLoaded: true
            }
          })

          jest.advanceTimersByTime(60000)
          expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(2)
        })
      })

      describe('when the order status is complete', () => {
        test('should not try to refresh', () => {
          const { props } = setup({
            type: 'echo_orders',
            collection: {
              id: 111,
              collection_metadata: {
                id: 'TEST_COLLECTION_111',
                dataset_id: 'Test Dataset ID'
              },
              access_method: {
                type: 'ECHO ORDERS'
              },
              orders: [{
                state: 'complete',
                order_information: {
                  requestStatus: {
                    status: 'complete'
                  }
                }
              }],
              isLoaded: true
            }
          })

          jest.advanceTimersByTime(60000)
          expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
        })
      })

      describe('when the order status is failed', () => {
        test('should not try to refresh', () => {
          const { props } = setup({
            type: 'echo_orders',
            collection: {
              id: 111,
              collection_metadata: {
                id: 'TEST_COLLECTION_111',
                dataset_id: 'Test Dataset ID'
              },
              access_method: {
                type: 'ECHO ORDERS'
              },
              orders: [{
                state: 'failed',
                order_information: {
                  requestStatus: {
                    status: 'failed'
                  }
                }
              }],
              isLoaded: true
            }
          })

          jest.advanceTimersByTime(60000)
          expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
        })
      })

      describe('when the order status is canceled', () => {
        test('should not try to refresh', () => {
          const { props } = setup({
            type: 'harmony',
            collection: {
              id: 111,
              collection_metadata: {
                id: 'TEST_COLLECTION_111',
                dataset_id: 'Test Dataset ID'
              },
              access_method: {
                type: 'HARMONY'
              },
              orders: [{
                state: 'canceled',
                order_information: {}
              }],
              isLoaded: true
            }
          })

          jest.advanceTimersByTime(60000)
          expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
        })
      })
    })

    describe('when unmounted', () => {
      test('should clear the timer', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_orders',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              dataset_id: 'Test Dataset ID'
            },
            access_method: {
              type: 'ECHO ORDERS'
            },
            orders: [{
              state: 'processing',
              order_information: {
                requestStatus: {
                  status: 'processing'
                }
              }
            }],
            isLoaded: true
          }
        })

        const { intervalId } = enzymeWrapper.instance()

        expect(intervalId).toBeDefined()

        enzymeWrapper.unmount()

        expect(clearInterval).toHaveBeenCalledTimes(1)
        expect(clearInterval).toHaveBeenCalledWith(intervalId)
      })
    })
  })

  describe('download', () => {
    test('renders correct status classname', () => {
      const { enzymeWrapper } = setup({
        type: 'download',
        collection: {
          id: 1,
          collection_id: 'TEST_COLLECTION_111',
          retrieval_collection_id: '42',
          retrieval_id: '54',
          collection_metadata: {
            id: 'TEST_COLLECTION_111',
            title: 'Test Dataset ID',
            shortName: 'shortName',
            versionId: 'versionId'
          },
          access_method: {
            type: 'download'
          },
          granule_count: 100,
          orders: [],
          isLoaded: true
        },
        granuleDownload: {
          1: {
            percentDone: '50',
            links: []
          },
          isLoading: true
        }
      })

      // Download orders are defaulted to complete
      expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)

      expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
      expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

      const header = enzymeWrapper.find('.order-status-item__header')
      expect(header.find(ProgressRing).props().progress).toEqual(100)
      expect(header.find('.order-status-item__status').text()).toEqual('Complete')
      expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
      expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Download')

      let body = enzymeWrapper.find('.order-status-item__body')
      expect(body.length).toBe(0)

      // Expand the body
      enzymeWrapper.find('.order-status-item__button').simulate('click')

      expect(header.find(ProgressRing).props().progress).toEqual(100)
      expect(header.find('.order-status-item__status').text()).toEqual('Complete')
      expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
      expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Download')

      body = enzymeWrapper.find('.order-status-item__body')
      expect(body.find(ProgressRing).props().progress).toEqual(100)
      expect(body.find('.order-status-item__status').text()).toEqual('Complete')
      expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

      expect(body.find('.order-status-item__orders-processed').length).toEqual(0)
      expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('Download')
      expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

      expect(body.find('.order-status-item__order-info').text()).toEqual('Download your data directly from the links below, or use the provided download script.')
      expect(body.find('.order-status-item__additional-info').text()).toEqual('')

      const tabs = body.find('EDSCTabs')
      expect(tabs.children().length).toEqual(2)

      const linksTab = tabs.childAt(0)
      expect(linksTab.props().title).toEqual('Download Files')
      expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
      expect(linksTab.childAt(0).props().percentDoneDownloadLinks).toEqual('50')
      expect(linksTab.childAt(0).props().downloadLinks).toEqual([])
      expect(linksTab.childAt(0).props().eddLink).toEqual('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=shortName_versionId&clientId=eed-default-test-serverless-client&token=Bearer mock-token&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
      expect(linksTab.childAt(0).props().disableEddInProgress).toEqual(false)

      const scriptTab = tabs.childAt(1)
      expect(scriptTab.props().title).toEqual('Download Script')
      expect(scriptTab.childAt(0).props().granuleCount).toEqual(100)
      expect(scriptTab.childAt(0).props().downloadLinks).toEqual([])
    })
  })

  describe('browse imagery', () => {
    test('renders correct status classname', () => {
      const { enzymeWrapper } = setup({
        type: 'download',
        collection: {
          id: 1,
          collection_id: 'TEST_COLLECTION_111',
          retrieval_collection_id: '42',
          retrieval_id: '54',
          collection_metadata: {
            id: 'TEST_COLLECTION_111',
            title: 'Test Dataset ID',
            shortName: 'shortName',
            versionId: 'versionId',
            granules: {
              items: [{
                browse_flag: true
              }]
            }
          },
          access_method: {
            type: 'download'
          },
          granule_count: 100,
          orders: [],
          isLoaded: true
        },
        granuleDownload: {
          1: {
            percentDone: '50',
            links: {
              browse: ['http://example.com']
            }
          },
          isLoading: true
        }
      })

      // Download orders are defaulted to complete
      expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)

      expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
      expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

      const header = enzymeWrapper.find('.order-status-item__header')
      expect(header.find(ProgressRing).props().progress).toEqual(100)
      expect(header.find('.order-status-item__status').text()).toEqual('Complete')
      expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
      expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Download')

      let body = enzymeWrapper.find('.order-status-item__body')
      expect(body.length).toBe(0)

      // Expand the body
      enzymeWrapper.find('.order-status-item__button').simulate('click')

      expect(header.find(ProgressRing).props().progress).toEqual(100)
      expect(header.find('.order-status-item__status').text()).toEqual('Complete')
      expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
      expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Download')

      body = enzymeWrapper.find('.order-status-item__body')
      expect(body.find(ProgressRing).props().progress).toEqual(100)
      expect(body.find('.order-status-item__status').text()).toEqual('Complete')
      expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

      expect(body.find('.order-status-item__orders-processed').length).toEqual(0)
      expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('Download')
      expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

      expect(body.find('.order-status-item__order-info').text()).toEqual('Download your data directly from the links below, or use the provided download script.')
      expect(body.find('.order-status-item__additional-info').text()).toEqual('')

      const tabs = body.find('EDSCTabs')
      expect(tabs.children().length).toEqual(3)

      const linksTab = tabs.childAt(0)
      expect(linksTab.props().title).toEqual('Download Files')
      expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
      expect(linksTab.childAt(0).props().percentDoneDownloadLinks).toEqual('50')
      expect(linksTab.childAt(0).props().downloadLinks).toEqual([])
      expect(linksTab.childAt(0).props().eddLink).toEqual('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=shortName_versionId&clientId=eed-default-test-serverless-client&token=Bearer mock-token&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
      expect(linksTab.childAt(0).props().disableEddInProgress).toEqual(false)

      const scriptTab = tabs.childAt(1)
      expect(scriptTab.props().title).toEqual('Download Script')
      expect(scriptTab.childAt(0).props().granuleCount).toEqual(100)
      expect(scriptTab.childAt(0).props().downloadLinks).toEqual([])

      const browseTab = tabs.childAt(2)
      expect(browseTab.props().title).toEqual('Browse Imagery')
      expect(browseTab.childAt(0).props().granuleCount).toEqual(100)
      expect(browseTab.childAt(0).props().browseUrls).toEqual(['http://example.com'])
      expect(browseTab.childAt(0).props().eddLink).toEqual('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Dbrowse%26ee%3Dprod&downloadId=shortName_versionId&clientId=eed-default-test-serverless-client&token=Bearer mock-token&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
    })
  })

  describe('CSDA', () => {
    test('renders the CSDA information', () => {
      const { enzymeWrapper } = setup({
        type: 'download',
        collection: {
          id: 1,
          collection_id: 'TEST_COLLECTION_111',
          retrieval_id: '54',
          collection_metadata: {
            id: 'TEST_COLLECTION_111',
            title: 'Test Dataset ID',
            isCSDA: true
          },
          access_method: {
            type: 'download'
          },
          granule_count: 100,
          orders: [],
          isLoaded: true
        }
      })

      enzymeWrapper.find('.order-status-item__button').simulate('click')

      const body = enzymeWrapper.find('.order-status-item__body')
      const tabs = body.find('EDSCTabs')
      expect(tabs.children().length).toEqual(2)

      const linksTab = tabs.childAt(0)
      expect(linksTab.props().title).toEqual('Download Files')
      expect(linksTab.childAt(0).props().collectionIsCSDA).toEqual(true)

      const message = enzymeWrapper.find('.order-status-item__note')
      expect(message.text()).toContain('This collection is made available through the NASA Commercial Smallsat Data Acquisition (CSDA) Program')
    })

    test('more details triggers modal on click', () => {
      const { enzymeWrapper, props } = setup({
        type: 'download',
        collection: {
          id: 1,
          collection_id: 'TEST_COLLECTION_111',
          retrieval_id: '54',
          collection_metadata: {
            id: 'TEST_COLLECTION_111',
            title: 'Test Dataset ID',
            isCSDA: true
          },
          access_method: {
            type: 'download'
          },
          granule_count: 100,
          orders: [],
          isLoaded: true
        }
      })

      enzymeWrapper.find('.order-status-item__button').simulate('click')

      const message = enzymeWrapper.find('.order-status-item__note')
      const moreDetailsButton = message.find('.order-status-item__header-message-link')

      moreDetailsButton.simulate('click')

      expect(props.onToggleAboutCSDAModal).toHaveBeenCalledTimes(1)
      expect(props.onToggleAboutCSDAModal).toHaveBeenCalledWith(true)
    })
  })

  describe('OPeNDAP', () => {
    test('renders correct status classname', () => {
      const { enzymeWrapper } = setup({
        type: 'OPeNDAP',
        collection: {
          id: 1,
          collection_id: 'TEST_COLLECTION_111',
          retrieval_collection_id: '42',
          retrieval_id: '54',
          collection_metadata: {
            id: 'TEST_COLLECTION_111',
            title: 'Test Dataset ID',
            shortName: 'shortName',
            versionId: 'versionId'
          },
          access_method: {
            type: 'OPeNDAP'
          },
          granule_count: 100,
          orders: [],
          isLoaded: true
        },
        granuleDownload: {
          1: {
            links: {
              download: [
                'http://example.com'
              ]
            }
          },
          isLoading: true
        }
      })

      // OPeNDAP orders are defaulted to complete
      expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)

      expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
      expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

      const header = enzymeWrapper.find('.order-status-item__header')
      expect(header.find(ProgressRing).props().progress).toEqual(100)
      expect(header.find('.order-status-item__status').text()).toEqual('Complete')
      expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
      expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('OPeNDAP')

      let body = enzymeWrapper.find('.order-status-item__body')
      expect(body.length).toBe(0)

      // Expand the body
      enzymeWrapper.find('.order-status-item__button').simulate('click')

      expect(header.find(ProgressRing).props().progress).toEqual(100)
      expect(header.find('.order-status-item__status').text()).toEqual('Complete')
      expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
      expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('OPeNDAP')

      body = enzymeWrapper.find('.order-status-item__body')
      expect(body.find(ProgressRing).props().progress).toEqual(100)
      expect(body.find('.order-status-item__status').text()).toEqual('Complete')
      expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

      expect(body.find('.order-status-item__orders-processed').length).toEqual(0)
      expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('OPeNDAP')
      expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

      expect(body.find('.order-status-item__order-info').text()).toEqual('Download your data directly from the links below, or use the provided download script.')
      expect(body.find('.order-status-item__additional-info').text()).toEqual('')

      const tabs = body.find('EDSCTabs')
      expect(tabs.children().length).toEqual(2)

      const linksTab = tabs.childAt(0)
      expect(linksTab.props().title).toEqual('Download Files')
      expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
      expect(linksTab.childAt(0).props().downloadLinks).toEqual(['http://example.com'])
      expect(linksTab.childAt(0).props().eddLink).toEqual('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=shortName_versionId&clientId=eed-default-test-serverless-client&token=Bearer mock-token&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
      expect(linksTab.childAt(0).props().disableEddInProgress).toEqual(false)

      const scriptTab = tabs.childAt(1)
      expect(scriptTab.props().title).toEqual('Download Script')
      expect(scriptTab.childAt(0).props().granuleCount).toEqual(100)
      expect(scriptTab.childAt(0).props().downloadLinks).toEqual(['http://example.com'])
    })
  })

  describe('ESI', () => {
    describe('when the order created', () => {
      test('renders creating state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ESI'
            },
            granule_count: 100,
            orders: [{
              state: 'creating',
              order_information: {}
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Creating')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Creating')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('Creating')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ESI')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are pending processing. This may take some time.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)

        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])
        expect(linksTab.childAt(0).props().showTextWindowActions).toEqual(false)

        const statusTab = tabs.childAt(1)
        expect(statusTab.props().title).toEqual('Order Status')
      })
    })

    describe('when the order is submitted', () => {
      test('renders in progress state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ESI'
            },
            granule_count: 100,
            orders: [{
              state: 'initialized',
              order_information: {}
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('In progress')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ESI')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])
        expect(linksTab.childAt(0).props().showTextWindowActions).toEqual(false)

        const statusTab = tabs.childAt(1)
        expect(statusTab.props().title).toEqual('Order Status')
      })
    })

    describe('when the order is in progress', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ESI'
            },
            granule_count: 100,
            orders: [{
              state: 'processing',
              order_information: {
                'xsi:schemaLocation': 'http://eosdis.nasa.gov/esi/rsp/e https://newsroom.gsfc.nasa.gov/esi/8.1/schemas/ESIAgentResponseExternal.xsd',
                xmlns: '',
                'xmlns:iesi': 'http://eosdis.nasa.gov/esi/rsp/i',
                'xmlns:ssw': 'http://newsroom.gsfc.nasa.gov/esi/rsp/ssw',
                'xmlns:eesi': 'http://eosdis.nasa.gov/esi/rsp/e',
                'xmlns:esi': 'http://eosdis.nasa.gov/esi/rsp',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                order: {
                  orderId: 50250,
                  Instructions: 'You may receive an email about your order if you specified an EMAIL address.'
                },
                contactInformation: {
                  contactName: 'LP DAAC User Services',
                  contactEmail: 'lpdaac@usgs.gov'
                },
                processInfo: {
                  processDuration: 'PT7H17M28.085S',
                  subagentId: 'GEDI'
                },
                requestStatus: {
                  status: 'processing',
                  numberProcessed: 28,
                  totalNumber: 31
                }
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(90)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(90%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(90)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(90%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(90)
        expect(body.find('.order-status-item__status').text()).toEqual('In progress')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(90%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ESI')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])
        expect(linksTab.childAt(0).props().showTextWindowActions).toEqual(false)

        const statusTab = tabs.childAt(1)
        expect(statusTab.props().title).toEqual('Order Status')
      })
    })

    describe('when the order is in complete', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ESI'
            },
            granule_count: 100,
            orders: [{
              state: 'complete',
              order_information: {
                'xsi:schemaLocation': 'http://eosdis.nasa.gov/esi/rsp/e https://newsroom.gsfc.nasa.gov/esi/8.1/schemas/ESIAgentResponseExternal.xsd',
                xmlns: '',
                'xmlns:iesi': 'http://eosdis.nasa.gov/esi/rsp/i',
                'xmlns:ssw': 'http://newsroom.gsfc.nasa.gov/esi/rsp/ssw',
                'xmlns:eesi': 'http://eosdis.nasa.gov/esi/rsp/e',
                'xmlns:esi': 'http://eosdis.nasa.gov/esi/rsp',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                downloadUrls: {
                  downloadUrl: [
                    'https://e4ftl01.cr.usgs.gov/ops/esir/50250.html',
                    'https://e4ftl01.cr.usgs.gov/ops/esir/50250.zip',
                    ''
                  ]
                },
                order: {
                  orderId: 50250,
                  Instructions: 'You may receive an email about your order if you specified an EMAIL address.'
                },
                contactInformation: {
                  contactName: 'LP DAAC User Services',
                  contactEmail: 'lpdaac@usgs.gov'
                },
                processInfo: {
                  processDuration: 'PT7H17M28.085S',
                  subagentId: 'GEDI'
                },
                requestStatus: {
                  status: 'complete',
                  numberProcessed: 31,
                  totalNumber: 31
                }
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(100)
        expect(body.find('.order-status-item__status').text()).toEqual('Complete')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('1/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ESI')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are done processing and are available for download.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)

        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([
          'https://e4ftl01.cr.usgs.gov/ops/esir/50250.html',
          'https://e4ftl01.cr.usgs.gov/ops/esir/50250.zip'
        ])

        expect(linksTab.childAt(0).props().showTextWindowActions).toEqual(false)

        const statusTab = tabs.childAt(1)
        expect(statusTab.props().title).toEqual('Order Status')
      })
    })

    describe('when the order failed', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ESI'
            },
            granule_count: 100,
            orders: [{
              state: 'failed',
              order_information: {
                'xsi:schemaLocation': 'http://eosdis.nasa.gov/esi/rsp/e https://newsroom.gsfc.nasa.gov/esi/8.1/schemas/ESIAgentResponseExternal.xsd',
                xmlns: '',
                'xmlns:iesi': 'http://eosdis.nasa.gov/esi/rsp/i',
                'xmlns:ssw': 'http://newsroom.gsfc.nasa.gov/esi/rsp/ssw',
                'xmlns:eesi': 'http://eosdis.nasa.gov/esi/rsp/e',
                'xmlns:esi': 'http://eosdis.nasa.gov/esi/rsp',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                order: {
                  orderId: 50250,
                  Instructions: 'You may receive an email about your order if you specified an EMAIL address.'
                },
                contactInformation: {
                  contactName: 'LP DAAC User Services',
                  contactEmail: 'lpdaac@usgs.gov'
                },
                processInfo: {
                  message: '188291813:InternalError - -1:Cancelled (Timeout).',
                  processDuration: 'PT7H17M28.085S',
                  subagentId: 'GEDI'
                },
                requestStatus: {
                  status: 'failed',
                  numberProcessed: 1,
                  totalNumber: 1
                }
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(true)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(100)
        expect(body.find('.order-status-item__status').text()).toEqual('Failed')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('1/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ESI')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('The order has failed processing.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('Service has responded with message:188291813:InternalError - -1:Cancelled (Timeout).')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])
        expect(linksTab.childAt(0).props().showTextWindowActions).toEqual(false)

        const statusTab = tabs.childAt(1)
        expect(statusTab.props().title).toEqual('Order Status')
      })

      test('renders an updated progress state when messages is an array', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ESI'
            },
            granule_count: 100,
            orders: [{
              state: 'failed',
              order_information: {
                'xsi:schemaLocation': 'http://eosdis.nasa.gov/esi/rsp/e https://newsroom.gsfc.nasa.gov/esi/8.1/schemas/ESIAgentResponseExternal.xsd',
                xmlns: '',
                'xmlns:iesi': 'http://eosdis.nasa.gov/esi/rsp/i',
                'xmlns:ssw': 'http://newsroom.gsfc.nasa.gov/esi/rsp/ssw',
                'xmlns:eesi': 'http://eosdis.nasa.gov/esi/rsp/e',
                'xmlns:esi': 'http://eosdis.nasa.gov/esi/rsp',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                order: {
                  orderId: 50250,
                  Instructions: 'You may receive an email about your order if you specified an EMAIL address.'
                },
                contactInformation: {
                  contactName: 'LP DAAC User Services',
                  contactEmail: 'lpdaac@usgs.gov'
                },
                processInfo: {
                  message: [
                    '188291813:InternalError - -1:Cancelled (Timeout).',
                    '188291814:InternalError - -1:Cancelled (Timeout).',
                    '188291815:InternalError - -1:Cancelled (Timeout).',
                    '188291816:InternalError - -1:Cancelled (Timeout).'
                  ],
                  processDuration: 'PT7H17M28.085S',
                  subagentId: 'GEDI'
                },
                requestStatus: {
                  status: 'failed',
                  numberProcessed: 1,
                  totalNumber: 1
                }
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(true)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ESI')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(100)
        expect(body.find('.order-status-item__status').text()).toEqual('Failed')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('1/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ESI')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('The order has failed processing.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('Service has responded with message:188291813:InternalError - -1:Cancelled (Timeout).')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])
        expect(linksTab.childAt(0).props().showTextWindowActions).toEqual(false)

        const statusTab = tabs.childAt(1)
        expect(statusTab.props().title).toEqual('Order Status')
      })
    })
  })

  describe('ECHO ORDERS', () => {
    describe('when the order created', () => {
      test('renders creating state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ECHO ORDERS'
            },
            granule_count: 100,
            orders: [{
              state: 'creating',
              order_information: {}
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Creating')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Creating')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('Creating')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').length).toEqual(0)
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ECHO ORDERS')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your order has been created and sent to the data provider. You will receive an email when your order is processed and ready to download.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(0)
      })
    })

    describe('when the order is submitted', () => {
      test('renders in progress state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ECHO ORDERS'
            },
            granule_count: 100,
            orders: [{
              state: 'initialized',
              order_information: {}
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('In progress')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').length).toEqual(0)
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ECHO ORDERS')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your order has been created and sent to the data provider. You will receive an email when your order is processed and ready to download.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(0)
      })
    })

    describe('when the order is in progress', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ECHO ORDERS'
            },
            granule_count: 100,
            orders: [{
              state: 'processing',
              order_information: {
                client_identity: 'OLpAZlE4HqIOMr0TYqg7UQ',
                created_at: '2020-09-15T20:06:52Z',
                id: 'A520DA68-CB05-23A1-23EA-88B2CF4F48B2',
                notification_level: 'INFO',
                order_price: 0,
                owner_id: 'CFAEB65C-F647-E569-927A-792C46DA9B52',
                provider_orders: [
                  {
                    reference: {
                      id: 'LARC_ASDC',
                      location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/orders/A520DA68-CB05-23A1-23EA-88B2CF4F48B2/provider_orders/LARC_ASDC',
                      name: 'LARC_ASDC'
                    }
                  }
                ],
                state: 'PROCESSING',
                submitted_at: '2020-09-15T20:07:24Z',
                updated_at: '2020-09-15T20:07:31Z',
                user_domain: 'GOVERNMENT',
                user_region: 'USA'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('In progress')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').length).toEqual(0)
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ECHO ORDERS')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your order has been created and sent to the data provider. You will receive an email when your order is processed and ready to download.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(0)
      })
    })

    describe('when the order is in complete', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ECHO ORDERS'
            },
            granule_count: 100,
            orders: [{
              state: 'complete',
              order_information: {
                client_identity: 'OLpAZlE4HqIOMr0TYqg7UQ',
                created_at: '2020-09-15T20:06:52Z',
                id: 'A520DA68-CB05-23A1-23EA-88B2CF4F48B2',
                notification_level: 'INFO',
                order_price: 0,
                owner_id: 'CFAEB65C-F647-E569-927A-792C46DA9B52',
                provider_orders: [
                  {
                    reference: {
                      id: 'LARC_ASDC',
                      location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/orders/A520DA68-CB05-23A1-23EA-88B2CF4F48B2/provider_orders/LARC_ASDC',
                      name: 'LARC_ASDC'
                    }
                  }
                ],
                state: 'CLOSED',
                submitted_at: '2020-09-15T20:07:24Z',
                updated_at: '2020-09-15T20:07:31Z',
                user_domain: 'GOVERNMENT',
                user_region: 'USA'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(100)
        expect(body.find('.order-status-item__status').text()).toEqual('Complete')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

        expect(body.find('.order-status-item__orders-processed').length).toEqual(0)
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ECHO ORDERS')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('The data provider has completed processing your order. You should have received an email with information regarding how to access your data from the data provider.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(0)
      })
    })

    describe('when the order failed', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper } = setup({
          type: 'esi',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'ECHO ORDERS'
            },
            granule_count: 100,
            orders: [{
              state: 'failed',
              order_information: {
                'xsi:schemaLocation': 'http://eosdis.nasa.gov/esi/rsp/e https://newsroom.gsfc.nasa.gov/esi/8.1/schemas/ECHO ORDERSAgentResponseExternal.xsd',
                xmlns: '',
                'xmlns:iesi': 'http://eosdis.nasa.gov/esi/rsp/i',
                'xmlns:ssw': 'http://newsroom.gsfc.nasa.gov/esi/rsp/ssw',
                'xmlns:eesi': 'http://eosdis.nasa.gov/esi/rsp/e',
                'xmlns:esi': 'http://eosdis.nasa.gov/esi/rsp',
                'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                order: {
                  orderId: 50250,
                  Instructions: 'You may receive an email about your order if you specified an EMAIL address.'
                },
                contactInformation: {
                  contactName: 'LP DAAC User Services',
                  contactEmail: 'lpdaac@usgs.gov'
                },
                processInfo: {
                  message: '188291813:InternalError - -1:Cancelled (Timeout).',
                  processDuration: 'PT7H17M28.085S',
                  subagentId: 'GEDI'
                },
                requestStatus: {
                  status: 'failed',
                  numberProcessed: 1,
                  totalNumber: 1
                }
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(true)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('ECHO ORDERS')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(100)
        expect(body.find('.order-status-item__status').text()).toEqual('Failed')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

        expect(body.find('.order-status-item__orders-processed').length).toEqual(0)
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('ECHO ORDERS')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('The data provider is reporting the order has failed processing.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(0)
      })
    })
  })

  describe('Harmony', () => {
    describe('when the order created', () => {
      test('renders creating state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'harmony',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'Harmony'
            },
            granule_count: 100,
            orders: [{
              state: 'creating',
              order_information: {}
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Creating')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Creating')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('Creating')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('Harmony')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are pending processing. This may take some time.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(3)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])

        const stacLinksTab = tabs.childAt(1)
        expect(stacLinksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(stacLinksTab.childAt(0).props().stacLinks).toEqual([])

        const orderStatusTab = tabs.childAt(2)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order is submitted', () => {
      test('renders in progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'harmony',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'Harmony'
            },
            granule_count: 100,
            orders: [{
              state: 'running',
              order_information: {
                jobID: 'e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                links: [
                  {
                    rel: 'self',
                    href: 'https://harmony.uat.earthdata.nasa.gov/jobs/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                    type: 'application/json',
                    title: 'Job Status'
                  }
                ],
                status: 'running',
                message: 'CMR query identified 51 granules.',
                request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800432-EEDTEST%2CG1233800431-EEDTEST%2CG1233800430-EEDTEST%2CG1233800429-EEDTEST%2CG1233800428-EEDTEST%2CG1233800427-EEDTEST%2CG1233800426-EEDTEST%2CG1233800513-EEDTEST%2CG1233800512-EEDTEST%2CG1233800425-EEDTEST%2CG1233800424-EEDTEST%2CG1233800423-EEDTEST%2CG1233800422-EEDTEST%2CG1233800421-EEDTEST%2CG1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800418-EEDTEST%2CG1233800417-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800414-EEDTEST%2CG1233800413-EEDTEST%2CG1233800412-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800409-EEDTEST%2CG1233800408-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800405-EEDTEST%2CG1233800404-EEDTEST%2CG1233800403-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800400-EEDTEST%2CG1233800399-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800396-EEDTEST%2CG1233800395-EEDTEST%2CG1233800394-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800391-EEDTEST%2CG1233800390-EEDTEST&subset=time(%222020-01-06T08%3A18%3A35.096Z%22%3A%222020-01-10T20%3A38%3A58.262Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
                progress: 0,
                username: 'rabbott',
                createdAt: '2020-09-10T13:50:22.372Z',
                updatedAt: '2020-09-10T13:50:22.372Z'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('In progress')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('Harmony')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(3)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])

        const stacLinksTab = tabs.childAt(1)
        expect(stacLinksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(stacLinksTab.childAt(0).props().stacLinks).toEqual([])

        const orderStatusTab = tabs.childAt(2)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order is in progress', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'harmony',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'Harmony'
            },
            granule_count: 100,
            orders: [{
              type: 'Harmony',
              state: 'running',
              order_information: {
                jobID: 'e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                links: [
                  {
                    rel: 'self',
                    href: 'https://harmony.uat.earthdata.nasa.gov/jobs/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                    type: 'application/json',
                    title: 'Job Status'
                  },
                  {
                    title: 'STAC catalog',
                    href: 'https://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/',
                    rel: 'stac-catalog-json',
                    type: 'application/json'
                  },
                  {
                    href: 'https://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.png',
                    title: 'G1233800390-EEDTEST',
                    type: 'image/png',
                    rel: 'data',
                    bbox: [
                      -180,
                      64.2,
                      -169.6,
                      71.6
                    ],
                    temporal: {
                      start: '2020-01-06T08:00:00.000Z',
                      end: '2020-01-06T09:59:59.000Z'
                    }
                  }
                ],
                status: 'running',
                message: 'CMR query identified 51 granules.',
                request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800432-EEDTEST%2CG1233800431-EEDTEST%2CG1233800430-EEDTEST%2CG1233800429-EEDTEST%2CG1233800428-EEDTEST%2CG1233800427-EEDTEST%2CG1233800426-EEDTEST%2CG1233800513-EEDTEST%2CG1233800512-EEDTEST%2CG1233800425-EEDTEST%2CG1233800424-EEDTEST%2CG1233800423-EEDTEST%2CG1233800422-EEDTEST%2CG1233800421-EEDTEST%2CG1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800418-EEDTEST%2CG1233800417-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800414-EEDTEST%2CG1233800413-EEDTEST%2CG1233800412-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800409-EEDTEST%2CG1233800408-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800405-EEDTEST%2CG1233800404-EEDTEST%2CG1233800403-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800400-EEDTEST%2CG1233800399-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800396-EEDTEST%2CG1233800395-EEDTEST%2CG1233800394-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800391-EEDTEST%2CG1233800390-EEDTEST&subset=time(%222020-01-06T08%3A18%3A35.096Z%22%3A%222020-01-10T20%3A38%3A58.262Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
                progress: 90,
                username: 'rabbott',
                createdAt: '2020-09-10T13:50:22.372Z',
                updatedAt: '2020-09-10T13:50:22.372Z'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(90)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(90%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(90)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(90%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(90)
        expect(body.find('.order-status-item__status').text()).toEqual('In progress')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(90%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('Harmony')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are currently processing. Once processing is finished, links will be displayed below and sent to the email you\'ve provided.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(3)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([
          'https://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.png'
        ])

        expect(linksTab.childAt(0).props().eddLink).toEqual(null)
        expect(linksTab.childAt(0).props().disableEddInProgress).toEqual(true)

        const stacLinksTab = tabs.childAt(1)
        expect(stacLinksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(stacLinksTab.childAt(0).props().stacLinks).toEqual([
          'https://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/'
        ])

        const orderStatusTab = tabs.childAt(2)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order is in complete', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'harmony',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_collection_id: '42',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID',
              shortName: 'testDataset',
              versionId: '1'
            },
            access_method: {
              type: 'Harmony'
            },
            granule_count: 100,
            orders: [{
              type: 'Harmony',
              state: 'successful',
              order_information: {
                jobID: 'e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                links: [
                  {
                    rel: 'self',
                    href: 'https://harmony.uat.earthdata.nasa.gov/jobs/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                    type: 'application/json',
                    title: 'Job Status'
                  },
                  {
                    title: 'STAC catalog',
                    href: 'https://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/',
                    rel: 'stac-catalog-json',
                    type: 'application/json'
                  },
                  {
                    href: 'https://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.png',
                    title: 'G1233800390-EEDTEST',
                    type: 'image/png',
                    rel: 'data',
                    bbox: [
                      -180,
                      64.2,
                      -169.6,
                      71.6
                    ],
                    temporal: {
                      start: '2020-01-06T08:00:00.000Z',
                      end: '2020-01-06T09:59:59.000Z'
                    }
                  }
                ],
                status: 'successful',
                message: 'CMR query identified 51 granules.',
                request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800432-EEDTEST%2CG1233800431-EEDTEST%2CG1233800430-EEDTEST%2CG1233800429-EEDTEST%2CG1233800428-EEDTEST%2CG1233800427-EEDTEST%2CG1233800426-EEDTEST%2CG1233800513-EEDTEST%2CG1233800512-EEDTEST%2CG1233800425-EEDTEST%2CG1233800424-EEDTEST%2CG1233800423-EEDTEST%2CG1233800422-EEDTEST%2CG1233800421-EEDTEST%2CG1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800418-EEDTEST%2CG1233800417-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800414-EEDTEST%2CG1233800413-EEDTEST%2CG1233800412-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800409-EEDTEST%2CG1233800408-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800405-EEDTEST%2CG1233800404-EEDTEST%2CG1233800403-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800400-EEDTEST%2CG1233800399-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800396-EEDTEST%2CG1233800395-EEDTEST%2CG1233800394-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800391-EEDTEST%2CG1233800390-EEDTEST&subset=time(%222020-01-06T08%3A18%3A35.096Z%22%3A%222020-01-10T20%3A38%3A58.262Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
                progress: 100,
                username: 'rabbott',
                createdAt: '2020-09-10T13:50:22.372Z',
                updatedAt: '2020-09-10T13:50:22.372Z'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(100)
        expect(body.find('.order-status-item__status').text()).toEqual('Complete')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('1/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('Harmony')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are done processing and are available for download.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('Service has responded with message:CMR query identified 51 granules.')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(3)

        const linksTab = tabs.childAt(0)

        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([
          'https://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.png'
        ])

        expect(linksTab.childAt(0).props().eddLink).toEqual('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=testDataset_1&clientId=eed-default-test-serverless-client&token=Bearer mock-token&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
        expect(linksTab.childAt(0).props().disableEddInProgress).toEqual(false)

        const stacLinksTab = tabs.childAt(1)
        expect(stacLinksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(stacLinksTab.childAt(0).props().stacLinks).toEqual([
          'https://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/'
        ])

        const orderStatusTab = tabs.childAt(2)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order is completed_with_errors', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'harmony',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_collection_id: '42',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID',
              shortName: 'testDataset',
              versionId: '1'
            },
            access_method: {
              type: 'Harmony'
            },
            granule_count: 100,
            orders: [{
              type: 'Harmony',
              state: 'complete_with_errors',
              order_information: {
                jobID: 'e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                links: [
                  {
                    rel: 'self',
                    href: 'https://harmony.uat.earthdata.nasa.gov/jobs/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                    type: 'application/json',
                    title: 'Job Status'
                  },
                  {
                    title: 'STAC catalog',
                    href: 'https://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/',
                    rel: 'stac-catalog-json',
                    type: 'application/json'
                  },
                  {
                    href: 'https://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.png',
                    title: 'G1233800390-EEDTEST',
                    type: 'image/png',
                    rel: 'data',
                    bbox: [
                      -180,
                      64.2,
                      -169.6,
                      71.6
                    ],
                    temporal: {
                      start: '2020-01-06T08:00:00.000Z',
                      end: '2020-01-06T09:59:59.000Z'
                    }
                  }
                ],
                status: 'complete_with_errors',
                message: 'The job has completed with errors. See the errors field for more details',
                request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800432-EEDTEST%2CG1233800431-EEDTEST%2CG1233800430-EEDTEST%2CG1233800429-EEDTEST%2CG1233800428-EEDTEST%2CG1233800427-EEDTEST%2CG1233800426-EEDTEST%2CG1233800513-EEDTEST%2CG1233800512-EEDTEST%2CG1233800425-EEDTEST%2CG1233800424-EEDTEST%2CG1233800423-EEDTEST%2CG1233800422-EEDTEST%2CG1233800421-EEDTEST%2CG1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800418-EEDTEST%2CG1233800417-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800414-EEDTEST%2CG1233800413-EEDTEST%2CG1233800412-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800409-EEDTEST%2CG1233800408-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800405-EEDTEST%2CG1233800404-EEDTEST%2CG1233800403-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800400-EEDTEST%2CG1233800399-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800396-EEDTEST%2CG1233800395-EEDTEST%2CG1233800394-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800391-EEDTEST%2CG1233800390-EEDTEST&subset=time(%222020-01-06T08%3A18%3A35.096Z%22%3A%222020-01-10T20%3A38%3A58.262Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
                progress: 100,
                username: 'rabbott',
                createdAt: '2020-09-10T13:50:22.372Z',
                updatedAt: '2020-09-10T13:50:22.372Z'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        let body = enzymeWrapper.find('.order-status-item__body')

        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(100)
        expect(body.find('.order-status-item__status').text()).toEqual('Complete')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('1/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('Harmony')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are done processing and are available for download.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('Service has responded with message:The job has completed with errors. See the errors field for more details')

        const tabs = body.find('EDSCTabs')

        expect(tabs.children().length).toEqual(3)

        const linksTab = tabs.childAt(0)

        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([
          'https://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.png'
        ])

        expect(linksTab.childAt(0).props().eddLink).toEqual('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3D42%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=testDataset_1&clientId=eed-default-test-serverless-client&token=Bearer mock-token&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
        expect(linksTab.childAt(0).props().disableEddInProgress).toEqual(false)

        const stacLinksTab = tabs.childAt(1)
        expect(stacLinksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(stacLinksTab.childAt(0).props().stacLinks).toEqual([
          'https://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/'
        ])

        const orderStatusTab = tabs.childAt(2)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order failed', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'harmony',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'Harmony'
            },
            granule_count: 100,
            orders: [{
              state: 'failed',
              order_information: {
                jobID: 'e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                links: [
                  {
                    rel: 'self',
                    href: 'https://harmony.uat.earthdata.nasa.gov/jobs/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                    type: 'application/json',
                    title: 'Job Status'
                  }
                ],
                status: 'failed',
                message: 'Variable subsetting failed with error: HTTP Error 400: Bad Request.',
                request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800432-EEDTEST%2CG1233800431-EEDTEST%2CG1233800430-EEDTEST%2CG1233800429-EEDTEST%2CG1233800428-EEDTEST%2CG1233800427-EEDTEST%2CG1233800426-EEDTEST%2CG1233800513-EEDTEST%2CG1233800512-EEDTEST%2CG1233800425-EEDTEST%2CG1233800424-EEDTEST%2CG1233800423-EEDTEST%2CG1233800422-EEDTEST%2CG1233800421-EEDTEST%2CG1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800418-EEDTEST%2CG1233800417-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800414-EEDTEST%2CG1233800413-EEDTEST%2CG1233800412-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800409-EEDTEST%2CG1233800408-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800405-EEDTEST%2CG1233800404-EEDTEST%2CG1233800403-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800400-EEDTEST%2CG1233800399-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800396-EEDTEST%2CG1233800395-EEDTEST%2CG1233800394-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800391-EEDTEST%2CG1233800390-EEDTEST&subset=time(%222020-01-06T08%3A18%3A35.096Z%22%3A%222020-01-10T20%3A38%3A58.262Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
                progress: 0,
                username: 'rabbott',
                createdAt: '2020-09-10T13:50:22.372Z',
                updatedAt: '2020-09-10T13:50:22.372Z'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(true)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(100)
        expect(body.find('.order-status-item__status').text()).toEqual('Failed')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('1/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('Harmony')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('The order has failed processing.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('Service has responded with message:Variable subsetting failed with error: HTTP Error 400: Bad Request.')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(3)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])

        const stacLinksTab = tabs.childAt(1)
        expect(stacLinksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(stacLinksTab.childAt(0).props().stacLinks).toEqual([])

        const orderStatusTab = tabs.childAt(2)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order is canceled', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'harmony',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'Harmony'
            },
            granule_count: 100,
            orders: [{
              state: 'canceled',
              order_information: {
                jobID: 'e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                links: [
                  {
                    rel: 'self',
                    href: 'https://harmony.uat.earthdata.nasa.gov/jobs/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                    type: 'application/json',
                    title: 'Job Status'
                  }
                ],
                status: 'canceled',
                message: 'Canceled by user.',
                request: 'https://harmony.uat.earthdata.nasa.gov/C1233800302-EEDTEST/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleIds=G1233800432-EEDTEST%2CG1233800431-EEDTEST%2CG1233800430-EEDTEST%2CG1233800429-EEDTEST%2CG1233800428-EEDTEST%2CG1233800427-EEDTEST%2CG1233800426-EEDTEST%2CG1233800513-EEDTEST%2CG1233800512-EEDTEST%2CG1233800425-EEDTEST%2CG1233800424-EEDTEST%2CG1233800423-EEDTEST%2CG1233800422-EEDTEST%2CG1233800421-EEDTEST%2CG1233800420-EEDTEST%2CG1233800419-EEDTEST%2CG1233800418-EEDTEST%2CG1233800417-EEDTEST%2CG1233800511-EEDTEST%2CG1233800510-EEDTEST%2CG1233800416-EEDTEST%2CG1233800415-EEDTEST%2CG1233800414-EEDTEST%2CG1233800413-EEDTEST%2CG1233800412-EEDTEST%2CG1233800411-EEDTEST%2CG1233800410-EEDTEST%2CG1233800409-EEDTEST%2CG1233800408-EEDTEST%2CG1233800509-EEDTEST%2CG1233800508-EEDTEST%2CG1233800407-EEDTEST%2CG1233800406-EEDTEST%2CG1233800405-EEDTEST%2CG1233800404-EEDTEST%2CG1233800403-EEDTEST%2CG1233800402-EEDTEST%2CG1233800401-EEDTEST%2CG1233800400-EEDTEST%2CG1233800399-EEDTEST%2CG1233800507-EEDTEST%2CG1233800506-EEDTEST%2CG1233800398-EEDTEST%2CG1233800397-EEDTEST%2CG1233800396-EEDTEST%2CG1233800395-EEDTEST%2CG1233800394-EEDTEST%2CG1233800393-EEDTEST%2CG1233800392-EEDTEST%2CG1233800391-EEDTEST%2CG1233800390-EEDTEST&subset=time(%222020-01-06T08%3A18%3A35.096Z%22%3A%222020-01-10T20%3A38%3A58.262Z%22)&format=image%2Fpng&outputCrs=EPSG%3A4326',
                progress: 0,
                username: 'rabbott',
                createdAt: '2020-09-10T13:50:22.372Z',
                updatedAt: '2020-09-10T13:50:22.372Z'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--canceled')).toEqual(true)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Canceled')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Canceled')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('Harmony')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('Canceled')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('1/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('Harmony')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('100 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('The order has been canceled.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('Service has responded with message:Canceled by user.')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(3)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])

        const stacLinksTab = tabs.childAt(1)
        expect(stacLinksTab.childAt(0).props().granuleCount).toEqual(100)
        expect(stacLinksTab.childAt(0).props().stacLinks).toEqual([])

        const orderStatusTab = tabs.childAt(2)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })
  })

  describe('Swodlr', () => {
    describe('when the order created', () => {
      test('renders creating state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'SWODLR',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'SWODLR'
            },
            granule_count: 10,
            orders: [{
              state: 'creating',
              order_information: {}
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Creating')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Creating')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('Creating')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('SWODLR')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('10 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are pending generation. This may take some time.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(10)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])

        const orderStatusTab = tabs.childAt(1)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order is submitted', () => {
      test('renders in progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'SWODLR',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'SWODLR'
            },
            granule_count: 10,
            orders: [{
              state: 'generating',
              order_information: {}
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('In progress')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('SWODLR')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('10 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are currently being generated. Once generation is finished, links will be displayed below and sent to the email you\'ve provided.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(10)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])

        const orderStatusTab = tabs.childAt(1)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order is in progress', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'SWODLR',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'SWODLR'
            },
            granule_count: 10,
            orders: [{
              type: 'SWODLR',
              state: 'available',
              order_information: {
                jobID: 'e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                status: 'running',
                message: 'CMR query identified 51 granules.',
                productId: '714cbd4d-2733-4ba0-85ac-b42a4aa4a1dc',
                granules: [{
                  id: '22be8568-d7a7-460b-9b4a-d560b5688da2',
                  uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/714cbd4d-2733-4ba0-85ac-b42a4aa4a1dc/1718399955/SWOT_L2_HR_Raster_1000m_UTM11Q_N_x_x_x_007_121_100F_20231127T173107_20231127T173121_DIC0_01.nc',
                  timestamp: '2024-06-14T21:19:21.025'
                }],
                username: 'edlusername',
                createdAt: '2020-09-10T13:50:22.372Z',
                updatedAt: '2020-09-10T13:50:22.372Z',
                error: 'Variable subsetting failed with error: HTTP Error 400: Bad Request.'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('In progress')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('In progress')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('SWODLR')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('10 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders are currently being generated. Once generation is finished, links will be displayed below and sent to the email you\'ve provided.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)

        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(10)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])

        expect(linksTab.childAt(0).props().eddLink).toEqual('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3Dundefined%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=undefined&clientId=eed-default-test-serverless-client&token=Bearer mock-token&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
        expect(linksTab.childAt(0).props().disableEddInProgress).toEqual(false)

        const orderStatusTab = tabs.childAt(1)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order is in complete', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'SWODLR',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'SWODLR'
            },
            granule_count: 1,
            orders: [{
              type: 'SWODLR',
              state: 'complete',
              order_information: {
                jobID: 'e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                status: 'complete',
                message: 'CMR query identified 51 granules.',
                productId: '714cbd4d-2733-4ba0-85ac-b42a4aa4a1dc',
                granules: [{
                  id: '22be8568-d7a7-460b-9b4a-d560b5688da2',
                  uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/714cbd4d-2733-4ba0-85ac-b42a4aa4a1dc/1718399955/SWOT_L2_HR_Raster_1000m_UTM11Q_N_x_x_x_007_121_100F_20231127T173107_20231127T173121_DIC0_01.nc',
                  timestamp: '2024-06-14T21:19:21.025'
                }],
                username: 'edlusername',
                createdAt: '2020-09-10T13:50:22.372Z',
                updatedAt: '2020-09-10T13:50:22.372Z'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(100)
        expect(header.find('.order-status-item__status').text()).toEqual('Complete')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(100%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(100)
        expect(body.find('.order-status-item__status').text()).toEqual('Complete')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(100%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('1/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('SWODLR')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('1 Granule')

        expect(body.find('.order-status-item__order-info').text()).toEqual('Your orders have been generated and are available for download.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)

        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(1)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([
          'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/714cbd4d-2733-4ba0-85ac-b42a4aa4a1dc/1718399955/SWOT_L2_HR_Raster_1000m_UTM11Q_N_x_x_x_007_121_100F_20231127T173107_20231127T173121_DIC0_01.nc'
        ])

        expect(linksTab.childAt(0).props().eddLink).toEqual('earthdata-download://startDownload?getLinks=http%3A%2F%2Flocalhost%3A3000%2Fgranule_links%3Fid%3Dundefined%26flattenLinks%3Dtrue%26linkTypes%3Ddata%26ee%3Dprod&downloadId=undefined&clientId=eed-default-test-serverless-client&token=Bearer mock-token&authUrl=http%3A%2F%2Flocalhost%3A3000%2Flogin%3Fee%3Dprod%26eddRedirect%3Dearthdata-download%253A%252F%252FauthCallback&eulaRedirectUrl=http%3A%2F%2Flocalhost%3A8080%2Fauth_callback%3FeddRedirect%3Dearthdata-download%253A%252F%252FeulaCallback')
        expect(linksTab.childAt(0).props().disableEddInProgress).toEqual(false)

        const orderStatusTab = tabs.childAt(1)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })

    describe('when the order failed', () => {
      test('renders an updated progress state', () => {
        const { enzymeWrapper, props } = setup({
          type: 'SWODLR',
          collection: {
            id: 1,
            collection_id: 'TEST_COLLECTION_111',
            retrieval_id: '54',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              title: 'Test Dataset ID'
            },
            access_method: {
              type: 'SWODLR'
            },
            granule_count: 10,
            orders: [{
              state: 'failed',
              order_information: {
                jobID: 'e116eeb5-f05e-4e5b-bc97-251dd6e1c66e',
                reason: 'SDS job failed - please contact support',
                granules: [],
                productId: '6980916a-fdfd-49d1-a2ee-98d838be6314',
                status: 'failed',
                username: 'edlusername',
                createdAt: '2020-09-10T13:50:22.372Z',
                updatedAt: '2020-09-10T13:50:22.372Z'
              }
            }],
            isLoaded: true
          }
        })

        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(true)

        const header = enzymeWrapper.find('.order-status-item__header')
        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        let body = enzymeWrapper.find('.order-status-item__body')
        expect(body.length).toBe(0)

        // Expand the body
        enzymeWrapper.find('.order-status-item__button').simulate('click')

        expect(header.find(ProgressRing).props().progress).toEqual(0)
        expect(header.find('.order-status-item__status').text()).toEqual('Failed')
        expect(header.find('.order-status-item__percentage').text()).toEqual('(0%)')
        expect(header.find('.order-status-item__meta-column--access-method').text()).toEqual('SWODLR')

        body = enzymeWrapper.find('.order-status-item__body')
        expect(body.find(ProgressRing).props().progress).toEqual(0)
        expect(body.find('.order-status-item__status').text()).toEqual('Failed')
        expect(body.find('.order-status-item__percentage').text()).toEqual('(0%)')

        expect(body.find('.order-status-item__orders-processed').text()).toEqual('0/1 orders complete')
        expect(body.find('.order-status-item__meta-body--access-method').text()).toEqual('SWODLR')
        expect(body.find('.order-status-item__meta-body--granules').text()).toEqual('10 Granules')

        expect(body.find('.order-status-item__order-info').text()).toEqual('The order has failed.')
        expect(body.find('.order-status-item__additional-info').text()).toEqual('Service has responded with message:SDS job failed - please contact support')

        const tabs = body.find('EDSCTabs')
        expect(tabs.children().length).toEqual(2)

        const linksTab = tabs.childAt(0)
        expect(linksTab.props().title).toEqual('Download Files')
        expect(linksTab.childAt(0).props().granuleCount).toEqual(10)
        expect(linksTab.childAt(0).props().downloadLinks).toEqual([])

        const orderStatusTab = tabs.childAt(1)
        expect(orderStatusTab.props().title).toEqual('Order Status')
        expect(orderStatusTab.childAt(0).props().orders).toEqual(props.collection.orders)
      })
    })
  })
})
