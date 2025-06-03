import React from 'react'
import { screen, within } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import { retrievalStatusProps } from './mocks'

import OrderStatusItem from '../OrderStatusItem'

import ProgressRing from '../../ProgressRing/ProgressRing'
import OrderProgressList from '../../OrderProgressList/OrderProgressList'

import { STATUS_MESSAGES } from '../../../constants/orderStatusMessages'

jest.mock('../../ProgressRing/ProgressRing', () => jest.fn(() => (
  <mock-ProgressRing data-testid="mocked-ProgressRing" />
)))

jest.mock('../../OrderProgressList/OrderProgressList', () => jest.fn(() => (
  <mock-OrderProgressList data-testid="mocked-OrderProgressList" />
)))

const queryCommandSupportedMock = jest.fn(() => true)
global.document.queryCommandSupported = queryCommandSupportedMock

const setup = setupTest({
  Component: OrderStatusItem,
  defaultProps: {
    authToken: 'mock-token',
    collection: retrievalStatusProps.retrieval.collections.byId[1],
    defaultOpen: false,
    earthdataEnvironment: 'prod',
    granuleDownload: {
      isLoading: false,
      TEST_COLLECTION_111: []
    },
    key: 'TEST_COLLECTION_111',
    onChangePath: jest.fn(),
    onFetchRetrieval: jest.fn(),
    onFetchRetrievalCollection: jest.fn(),
    onFetchRetrievalCollectionGranuleLinks: jest.fn(),
    onFetchRetrievalCollectionGranuleBrowseLinks: jest.fn(),
    onToggleAboutCSDAModal: jest.fn(),
    orders: [{
      type: 'download'
    }]
  }
})

afterEach(() => {
  jest.useRealTimers()
})

describe('OrderStatusItem', () => {
  describe('refreshing status', () => {
    beforeEach(() => {
      jest.useFakeTimers({ legacyFakeTimers: true })
    })

    describe('when the status is creating', () => {
      test('calls onFetchRetrievalCollection after a delay', async () => {
        const { props } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
        expect(props.onFetchRetrievalCollection).toHaveBeenCalledWith(1)

        // Calls onFetchRetrievalCollection after 5s
        jest.advanceTimersByTime(5000)

        expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(2)
        expect(props.onFetchRetrievalCollection).toHaveBeenCalledWith(1)
      })
    })

    describe('when the status is in progress', () => {
      test('calls onFetchRetrievalCollection after a delay', async () => {
        const { props } = setup({
          overrideProps: {
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
                state: 'initialized',
                order_information: {}
              }],
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
        expect(props.onFetchRetrievalCollection).toHaveBeenCalledWith(1)

        // Calls onFetchRetrievalCollection after 60s
        jest.advanceTimersByTime(60000)

        expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(2)
        expect(props.onFetchRetrievalCollection).toHaveBeenCalledWith(1)
      })
    })

    describe('when the status is done', () => {
      test('does not call onFetchRetrievalCollection after a delay', async () => {
        const { props } = setup({
          overrideProps: {
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
                state: 'complete',
                order_information: {}
              }],
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)

        // Calls onFetchRetrievalCollection after 60s
        jest.advanceTimersByTime(60000)

        expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
      })
    })

    describe('when the download files list is incomplete', () => {
      test('calls onFetchRetrievalCollectionGranuleLinks', async () => {
        const { props } = setup({
          overrideProps: {
            collection: {
              id: 1,
              collection_id: 'TEST_COLLECTION_111',
              retrieval_id: '54',
              collection_metadata: {
                id: 'TEST_COLLECTION_111',
                title: 'Test Dataset ID'
              },
              access_method: {
                type: 'Download'
              },
              granule_count: 100,
              orders: [{
                state: 'complete',
                order_information: {}
              }],
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Calls onFetchRetrievalCollectionGranuleLinks because the links have not been loaded
        expect(props.onFetchRetrievalCollectionGranuleLinks).toHaveBeenCalledTimes(1)
        expect(props.onFetchRetrievalCollectionGranuleLinks).toHaveBeenCalledWith(props.collection)
      })
    })
  })

  describe('when the access method is download', () => {
    test('renders the correct order status', async () => {
      const { user } = setup({
        overrideProps: {
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
            granule_count: 2,
            orders: [],
            isLoaded: true,
            updated_at: '2025-01-24T02:34:33.340Z'
          },
          granuleDownload: {
            1: {
              percentDone: '50',
              links: {
                download: [
                  'http://example.com'
                ]
              }
            },
            isLoading: true
          }
        }
      })

      // Minimized Header values

      // Progress ring is 100%
      expect(ProgressRing).toHaveBeenCalledTimes(1)
      expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
        progress: 100
      }), {})

      // Status is 'Complete'
      expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
      expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

      // Access method is Download
      expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Download')

      // Granules is 2
      expect(screen.getByLabelText('Granule Count')).toHaveTextContent('2 Granules')

      // Expand the body
      const button = screen.getByRole('button', { name: 'Show details' })
      await user.click(button)

      // Progress ring is 100%
      expect(ProgressRing).toHaveBeenCalledTimes(2)
      expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
        progress: 100
      }), {})

      // Status is 'Complete'
      expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
      expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
      expect(screen.getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

      // Access method is Download
      expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Download')

      // Granules is 2
      expect(screen.getByLabelText('Granule Count')).toHaveTextContent('2 Granules')

      expect(screen.getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.DOWNLOAD.COMPLETE)

      expect(screen.getByRole('link', { name: 'http://example.com' })).toHaveAttribute('href', 'http://example.com')

      // Click on the Download Script tab
      const downloadScriptTab = screen.getByRole('tab', { name: 'Download Script' })
      await user.click(downloadScriptTab)

      // The download script contains the link
      expect(screen.getByRole('code')).toHaveTextContent('http://example.com')
    })

    describe('when the collection is CSDA', () => {
      test('renders the CSDA information', async () => {
        const { user } = setup({
          overrideProps: {
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
          }
        })

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        expect(screen.getByLabelText('CSDA Note')).toHaveTextContent('This collection is made available through the NASA Commercial Smallsat Data Acquisition (CSDA) Program for NASA funded researchers. Access to the data will require additional authentication. More Details')
      })

      describe('when clicking on More Details', () => {
        test('more details triggers modal on click', async () => {
          const { props, user } = setup({
            overrideProps: {
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
            }
          })

          // Expand the body
          const button = screen.getByRole('button', { name: 'Show details' })
          await user.click(button)

          const moreDetails = screen.getByRole('button', { name: 'More details' })
          await user.click(moreDetails)

          expect(props.onToggleAboutCSDAModal).toHaveBeenCalledTimes(1)
          expect(props.onToggleAboutCSDAModal).toHaveBeenCalledWith(true)
        })
      })
    })
  })

  describe('when the collection has browse imagery', () => {
    test('renders the correct order status', async () => {
      const { user } = setup({
        overrideProps: {
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
            granule_count: 2,
            orders: [],
            isLoaded: true,
            updated_at: '2025-01-24T02:34:33.340Z'
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
        }
      })

      // Minimized Header values

      // Progress ring is 100%
      expect(ProgressRing).toHaveBeenCalledTimes(1)
      expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
        progress: 100
      }), {})

      // Status is 'Complete'
      expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
      expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

      // Access method is Download
      expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Download')

      // Granules is 2
      expect(screen.getByLabelText('Granule Count')).toHaveTextContent('2 Granules')

      // Expand the body
      const button = screen.getByRole('button', { name: 'Show details' })
      await user.click(button)

      // Progress ring is 100%
      expect(ProgressRing).toHaveBeenCalledTimes(2)
      expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
        progress: 100
      }), {})

      // Status is 'Complete'
      expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
      expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
      expect(screen.getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

      // Access method is Download
      expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Download')

      // Granules is 2
      expect(screen.getByLabelText('Granule Count')).toHaveTextContent('2 Granules')

      expect(screen.getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.DOWNLOAD.COMPLETE)

      // Click on the Browse Imagery tab
      const browseImageryTab = screen.getByRole('tab', { name: 'Browse Imagery' })
      await user.click(browseImageryTab)

      expect(screen.getByRole('link', { name: 'http://example.com' })).toHaveAttribute('href', 'http://example.com')
    })
  })

  describe('when the access method is OPeNDAP', () => {
    test('renders the correct order status', async () => {
      const { user } = setup({
        overrideProps: {
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
            isLoaded: true,
            updated_at: '2025-01-24T02:34:33.340Z'
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
        }
      })

      // Minimized Header values

      // Progress ring is 100%
      expect(ProgressRing).toHaveBeenCalledTimes(1)
      expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
        progress: 100
      }), {})

      // Status is 'Complete'
      expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
      expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

      // Access method is OPeNDAP
      expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('OPeNDAP')

      // Granules is 100
      expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

      // Expand the body
      const button = screen.getByRole('button', { name: 'Show details' })
      await user.click(button)

      // Progress ring is 100%
      expect(ProgressRing).toHaveBeenCalledTimes(2)
      expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
        progress: 100
      }), {})

      // Status is 'Complete'
      expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
      expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
      expect(screen.getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

      // Access method is OPeNDAP
      expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('OPeNDAP')

      // Granules is 100
      expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

      expect(screen.getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.OPENDAP.COMPLETE)

      expect(screen.getByRole('link', { name: 'http://example.com' })).toHaveAttribute('href', 'http://example.com')

      // Click on the Download Script tab
      const downloadScriptTab = screen.getByRole('tab', { name: 'Download Script' })
      await user.click(downloadScriptTab)

      // The download script contains the link
      expect(screen.getByRole('code')).toHaveTextContent('http://example.com')
    })
  })

  describe('when the access method is ESI', () => {
    describe('when the order created', () => {
      test('renders creating state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Creating'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Creating')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is ESI
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Creating'
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Creating')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ESI
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.CREATING)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is submitted', () => {
      test('renders in progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is ESI
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ESI
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.IN_PROGRESS)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is in progress', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 90%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 90
        }), {})

        // Status is 'In progress'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is ESI
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 90%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 90
        }), {})

        // Status is 'In progress', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ESI
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.IN_PROGRESS)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is in complete', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

        // Access method is ESI
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete', 1/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('1/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ESI
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.COMPLETE)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('Retrieved 2 files for 100 granulesDownload FilesExpandhttps://e4ftl01.cr.usgs.gov/ops/esir/50250.htmlhttps://e4ftl01.cr.usgs.gov/ops/esir/50250.zip')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order failed', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Failed'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is ESI
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Failed', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('1/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ESI
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.FAILED)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })

      test('renders an updated progress state when messages is an array', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Failed'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

        // Access method is ESI
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Failed', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('1/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ESI
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('ESI')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.FAILED)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })
  })

  describe('when the access method is ECHO ORDERS', () => {
    describe('when the order created', () => {
      test('renders creating state', async () => {
        const { user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Creating'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Creating')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Creating'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Creating')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(screen.getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(screen.getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ECHO_ORDERS.IN_PROGRESS)
      })
    })

    describe('when the order is submitted', () => {
      test('renders in progress state', async () => {
        const { user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(screen.getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(screen.getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ECHO_ORDERS.IN_PROGRESS)
      })
    })

    describe('when the order is in progress', () => {
      test('renders an updated progress state', async () => {
        const { user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(screen.getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(screen.getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ECHO_ORDERS.IN_PROGRESS)
      })
    })

    describe('when the order is in complete', () => {
      test('renders an updated progress state', async () => {
        const { user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
        expect(screen.getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(screen.getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ECHO_ORDERS.COMPLETE)
      })
    })

    describe('when the order failed', () => {
      test('renders an updated progress state', async () => {
        const { user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Failed'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Failed'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
        expect(screen.getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is ECHO ORDERS
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('ECHO ORDERS')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(screen.getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ECHO_ORDERS.FAILED)
      })
    })
  })

  describe('when the access method is Harmony', () => {
    describe('when the order created', () => {
      test('renders creating state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Creating'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Creating')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is Harmony
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Creating', 0/1 orders complete, last updated)
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Creating')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is Harmony
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.CREATING)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the STAC Links tab
        const stacLinksTag = screen.getByRole('tab', { name: 'STAC Links' })
        await user.click(stacLinksTag)

        expect(screen.getByLabelText('STAC Links')).toHaveTextContent('STAC links will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is submitted', () => {
      test('renders in progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is Harmony
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is Harmony
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.IN_PROGRESS)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the STAC Links tab
        const stacLinksTag = screen.getByRole('tab', { name: 'STAC Links' })
        await user.click(stacLinksTag)

        expect(screen.getByLabelText('STAC Links')).toHaveTextContent('STAC links will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is in progress', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 90%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 90
        }), {})

        // Status is 'In progress'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('90%')

        // Access method is Harmony
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 90%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 90
        }), {})

        // Status is 'In progress', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('90%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is Harmony
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.IN_PROGRESS)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('Retrieved 1 file for 100 granulesDownload FilesCopySaveExpandhttps://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.pnghttps://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.png')

        // Click on the STAC Links tab
        const stacLinksTag = screen.getByRole('tab', { name: 'STAC Links' })
        await user.click(stacLinksTag)

        expect(screen.getByLabelText('STAC Links')).toHaveTextContent('Retrieving STAC links for 100 granules...CopySaveExpandhttps://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/https://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is in complete', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

        // Access method is Harmony
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete', 1/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('1/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is Harmony
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.COMPLETE)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('Retrieved 1 file for 100 granulesDownload FilesCopySaveExpandhttps://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.pnghttps://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.png')

        // Click on the STAC Links tab
        const stacLinksTag = screen.getByRole('tab', { name: 'STAC Links' })
        await user.click(stacLinksTag)

        expect(screen.getByLabelText('STAC Links')).toHaveTextContent('Retrieved 1 STAC links for 100 granulesCopySaveExpandhttps://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/https://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is completed_with_errors', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

        // Access method is Harmony
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('1/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is Harmony
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.COMPLETE)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('Retrieved 1 file for 100 granulesDownload FilesCopySaveExpandhttps://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.pnghttps://harmony.uat.earthdata.nasa.gov/service-results/harmony-uat-staging/public/harmony/gdal/a75ebeba-978e-4e68-9131-e36710fb800e/006_04_00feff_asia_west_regridded.png')

        // Click on the STAC Links tab
        const stacLinksTag = screen.getByRole('tab', { name: 'STAC Links' })
        await user.click(stacLinksTag)

        expect(screen.getByLabelText('STAC Links')).toHaveTextContent('Retrieved 1 STAC links for 100 granulesCopySaveExpandhttps://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/https://harmony.uat.earthdata.nasa.gov/stac/e116eeb5-f05e-4e5b-bc97-251dd6e1c66e/')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order failed', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Failed'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

        // Access method is Harmony
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 100%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Failed', 1/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('1/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is Harmony
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.FAILED)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the STAC Links tab
        const stacLinksTag = screen.getByRole('tab', { name: 'STAC Links' })
        await user.click(stacLinksTag)

        expect(screen.getByLabelText('STAC Links')).toHaveTextContent('STAC links will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is canceled', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Canceled'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Canceled')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is Harmony
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Canceled', 1/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Canceled')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('1/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is Harmony
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('Harmony')

        // Granules is 100
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('100 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.ESI.CANCELED)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the STAC Links tab
        const stacLinksTag = screen.getByRole('tab', { name: 'STAC Links' })
        await user.click(stacLinksTag)

        expect(screen.getByLabelText('STAC Links')).toHaveTextContent('STAC links will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })
  })

  describe('when the access method is SWODLR', () => {
    describe('when the order is created', () => {
      test('renders creating state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Creating', 0/1 orders complete, last updated
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Creating')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is SWODLR
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 10
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('10 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Creating', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Creating')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is SWODLR
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 10
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('10 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.SWODLR.CREATING)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is submitted', () => {
      test('renders in progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress', 0/1 orders complete, last updated
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is SWODLR
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 10
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('10 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is SWODLR
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 10
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('10 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.SWODLR.IN_PROGRESS)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is in progress', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress', 0/1 orders complete, last updated
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is SWODLR
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 10
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('10 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'In progress', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('In progress')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is SWODLR
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 10
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('10 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.SWODLR.IN_PROGRESS)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order is in complete', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

        // Access method is SWODLR
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 1
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('1 Granule')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 100
        }), {})

        // Status is 'Complete', 1/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('1/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is SWODLR
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 1
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('1 Granule')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.SWODLR.COMPLETE)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('Retrieved 1 file for 1 granuleDownload FilesCopySaveExpandhttps://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/714cbd4d-2733-4ba0-85ac-b42a4aa4a1dc/1718399955/SWOT_L2_HR_Raster_1000m_UTM11Q_N_x_x_x_007_121_100F_20231127T173107_20231127T173121_DIC0_01.nchttps://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/714cbd4d-2733-4ba0-85ac-b42a4aa4a1dc/1718399955/SWOT_L2_HR_Raster_1000m_UTM11Q_N_x_x_x_007_121_100F_20231127T173107_20231127T173121_DIC0_01.nc')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })

    describe('when the order failed', () => {
      test('renders an updated progress state', async () => {
        const { props, user } = setup({
          overrideProps: {
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
              isLoaded: true,
              updated_at: '2025-01-24T02:34:33.340Z'
            }
          }
        })

        // Minimized Header values

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(1)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Failed'
        expect(screen.getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')

        // Access method is SWODLR
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 10
        expect(screen.getByLabelText('Granule Count')).toHaveTextContent('10 Granules')

        // Expand the body
        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        // Progress ring is 0%
        expect(ProgressRing).toHaveBeenCalledTimes(2)
        expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
          progress: 0
        }), {})

        // Status is 'Failed', 0/1 orders complete, last updated
        const orderStatusItemHeader = screen.getByTestId('order-status-item__body-header')
        expect(within(orderStatusItemHeader).getByLabelText('Order Status')).toHaveTextContent('Failed')
        expect(within(orderStatusItemHeader).getByLabelText('Order Progress Percentage')).toHaveTextContent('0%')
        expect(within(orderStatusItemHeader).getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(within(orderStatusItemHeader).getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')

        // Access method is SWODLR
        expect(within(orderStatusItemHeader).getByLabelText('Access Method Type')).toHaveTextContent('SWODLR')

        // Granules is 10
        expect(within(orderStatusItemHeader).getByLabelText('Granule Count')).toHaveTextContent('10 Granules')

        expect(within(orderStatusItemHeader).getByLabelText('Order Information')).toHaveTextContent(STATUS_MESSAGES.SWODLR.FAILED)

        expect(screen.getByLabelText('Download Files')).toHaveTextContent('The download files will become available once the order has finished processing.')

        // Click on the Order Status tab
        const orderStatusTab = screen.getByRole('tab', { name: 'Order Status' })
        await user.click(orderStatusTab)

        expect(OrderProgressList).toHaveBeenCalledTimes(1)
        expect(OrderProgressList).toHaveBeenCalledWith(expect.objectContaining({
          orders: props.collection.orders
        }), {})
      })
    })
  })
})
