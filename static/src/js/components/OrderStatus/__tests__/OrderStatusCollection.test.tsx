import React from 'react'
import { waitFor } from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import DownloadStatusItem from '../AccessMethodItems/DownloadStatusItem'
import HarmonyStatusItem from '../AccessMethodItems/HarmonyStatusItem'
import OrderStatusCollection from '../OrderStatusCollection'
// @ts-expect-error This file does not have types
import Skeleton from '../../Skeleton/Skeleton'

import GET_RETRIEVAL_COLLECTION from '../../../operations/queries/getRetrievalCollection'

vi.mock('../../Skeleton/Skeleton', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../AccessMethodItems/DownloadStatusItem', () => ({ default: vi.fn(() => <div />) }))
vi.mock('../AccessMethodItems/HarmonyStatusItem', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: OrderStatusCollection,
  defaultProps: {
    collection: {
      obfuscatedId: '12345'
    },
    defaultOpen: true,
    retrievalId: '42'
  },
  withApolloClient: true
})

const collectionMetadata = {
  mock: 'metadata'
}

afterEach(() => {
  vi.useRealTimers()
})

describe('OrderStatusCollection', () => {
  describe('when the collection request is loading', () => {
    test('renders a skeleton', () => {
      setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod: {
                  type: 'download'
                },
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders: []
              }
            }
          }
        }]
      })

      expect(Skeleton).toHaveBeenCalledTimes(2)
      expect(Skeleton).toHaveBeenCalledWith({
        className: 'order-status__collection-skeleton',
        containerStyle: {
          display: 'inline-block',
          height: '175px',
          width: '100%'
        },
        shapes: [{
          height: 18,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 2,
          width: 200
        }, {
          height: 14,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 31,
          width: '80%'
        }, {
          height: 96,
          left: 0,
          radius: 2,
          shape: 'rectangle',
          top: 60,
          width: '100%'
        }]
      }, {})
    })
  })

  describe('when there is an error', () => {
    test('calls handleError', async () => {
      const { zustandState } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          error: new ApolloError({ errorMessage: 'An error occurred' })
        }],
        overrideZustandState: {
          errors: {
            handleError: vi.fn()
          }
        }
      })

      // Wait for the error to be handled
      await waitFor(() => {
        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
      })

      expect(zustandState.errors.handleError).toHaveBeenCalledWith({
        action: 'getRetrievalCollection',
        error: new ApolloError({ errorMessage: 'An error occurred' }),
        resource: 'collection'
      })
    })
  })

  describe('when the collection\'s access method is download', () => {
    test('renders a DownloadStatusItem', async () => {
      setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod: {
                  type: 'download'
                },
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders: []
              }
            }
          }
        }]
      })

      await waitFor(() => {
        expect(DownloadStatusItem).toHaveBeenCalledTimes(1)
      })

      expect(DownloadStatusItem).toHaveBeenCalledWith({
        defaultOpen: true,
        retrievalCollection: {
          accessMethod: { type: 'download' },
          collectionMetadata,
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalId: '42',
          retrievalOrders: [],
          updatedAt: '2025-01-01T00:00:00Z'
        },
        retrievalId: '42'
      }, {})
    })
  })

  describe('when the collection\'s access method is harmony', () => {
    const accessMethod = {
      enableConcatenateDownload: false,
      enableSpatialSubsetting: true,
      enableTemporalSubsetting: true,
      selectedVariables: [
        'V2833331293-POCLOUD'
      ],
      supportsBoundingBoxSubsetting: true,
      supportsConcatenation: false,
      supportsShapefileSubsetting: true,
      type: 'Harmony',
      url: 'https://harmony.earthdata.nasa.gov',
      name: 'PODAAC Concise',
      variables: {
        'V2833331293-POCLOUD': {}
      }
    }

    test('renders an HarmonyStatusItem', async () => {
      const retrievalOrders = [{
        error: null,
        id: 126,
        orderInformation: {},
        orderNumber: null,
        state: 'complete',
        type: 'Harmony'
      }]

      setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_COLLECTION,
            variables: {
              obfuscatedId: '12345'
            }
          },
          result: {
            data: {
              retrievalCollection: {
                accessMethod,
                collectionMetadata,
                granuleCount: 1,
                obfuscatedId: '12345',
                retrievalId: '42',
                updatedAt: '2025-01-01T00:00:00Z',
                retrievalOrders
              }
            }
          }
        }]
      })

      await waitFor(() => {
        expect(HarmonyStatusItem).toHaveBeenCalledTimes(1)
      })

      expect(HarmonyStatusItem).toHaveBeenCalledWith({
        defaultOpen: true,
        retrievalCollection: {
          accessMethod,
          collectionMetadata,
          granuleCount: 1,
          obfuscatedId: '12345',
          retrievalId: '42',
          retrievalOrders,
          updatedAt: '2025-01-01T00:00:00Z'
        },
        retrievalId: '42'
      }, {})
    })

    describe('when the order isn\'t complete', () => {
      beforeEach(() => {
        vi.useFakeTimers({
          shouldAdvanceTime: true
        })
      })

      test('refreshes the order status', async () => {
        const retrievalOrdersInProgress = [{
          error: null,
          id: 126,
          orderInformation: {},
          orderNumber: null,
          state: 'in progress',
          type: 'Harmony'
        }]
        const retrievalOrdersDone = [{
          error: null,
          id: 126,
          orderInformation: {},
          orderNumber: null,
          state: 'complete',
          type: 'Harmony'
        }]

        setup({
          overrideApolloClientMocks: [{
            request: {
              query: GET_RETRIEVAL_COLLECTION,
              variables: {
                obfuscatedId: '12345'
              }
            },
            result: {
              data: {
                retrievalCollection: {
                  accessMethod,
                  collectionMetadata,
                  granuleCount: 1,
                  obfuscatedId: '12345',
                  retrievalId: '42',
                  updatedAt: '2025-01-01T00:00:00Z',
                  retrievalOrders: retrievalOrdersInProgress
                }
              }
            }
          }, {
            request: {
              query: GET_RETRIEVAL_COLLECTION,
              variables: {
                obfuscatedId: '12345'
              }
            },
            result: {
              data: {
                retrievalCollection: {
                  accessMethod,
                  collectionMetadata,
                  granuleCount: 1,
                  obfuscatedId: '12345',
                  retrievalId: '42',
                  updatedAt: '2025-01-01T00:00:00Z',
                  retrievalOrders: retrievalOrdersDone
                }
              }
            }
          }]
        })

        await waitFor(() => {
          // This is called two times because the call to setRefreshInterval causes a second render
          expect(HarmonyStatusItem).toHaveBeenCalledTimes(2)
        })

        expect(HarmonyStatusItem).toHaveBeenNthCalledWith(1, {
          defaultOpen: true,
          retrievalCollection: {
            accessMethod,
            collectionMetadata,
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalId: '42',
            retrievalOrders: retrievalOrdersInProgress,
            updatedAt: '2025-01-01T00:00:00Z'
          },
          retrievalId: '42'
        }, {})

        // Clear existing mocks
        vi.clearAllMocks()

        // Advance the time by the poll interval
        vi.advanceTimersByTime(60000)

        // Test the second render after the load
        await waitFor(() => {
          // This is called two times because the call to setRefreshInterval causes a second render
          expect(HarmonyStatusItem).toHaveBeenCalledTimes(2)
        })

        expect(HarmonyStatusItem).toHaveBeenNthCalledWith(1, {
          defaultOpen: true,
          retrievalCollection: {
            accessMethod,
            collectionMetadata,
            granuleCount: 1,
            obfuscatedId: '12345',
            retrievalId: '42',
            retrievalOrders: retrievalOrdersDone,
            updatedAt: '2025-01-01T00:00:00Z'
          },
          retrievalId: '42'
        }, {})
      })
    })
  })
})
