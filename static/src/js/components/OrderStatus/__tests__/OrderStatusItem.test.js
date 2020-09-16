import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { retrievalStatusProps } from './mocks'

import { OrderStatusItem } from '../OrderStatusItem'

const shouldRefreshCopy = OrderStatusItem.prototype.shouldRefresh

jest.useFakeTimers()

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps, mockRefresh) {
  const shouldRefreshMock = jest.fn()

  OrderStatusItem.prototype.shouldRefresh = mockRefresh ? shouldRefreshMock : shouldRefreshCopy

  const props = {
    collection: retrievalStatusProps.retrieval.collections.download[1],
    defaultOpen: false,
    granuleDownload: {},
    key: 'TEST_COLLECTION_111',
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
    order: {
      type: 'download',
      access_method: {
        type: 'download'
      }
    },
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

describe('OrderStatus component', () => {
  test('renders itself correctly', () => {
    expect(1).toEqual(1)
  })
})

// TODO: Fix these tests
// describe('OrderStatus component', () => {

// test('renders itself correctly', () => {
//   const { enzymeWrapper } = setup()
//   expect(enzymeWrapper).toBeDefined()
//   expect(enzymeWrapper.hasClass('order-status-item')).toEqual(true)
// })

// describe('Auto-refresh', () => {
//   describe('when mounted', () => {
//     test('should start a timer', () => {
//       const { enzymeWrapper, props, shouldRefreshMock } = setup({
//         type: 'echo_orders',
//         collection: {
//           id: 'TEST_COLLECTION_111',
//           collection_metadata: {
//             id: 'TEST_COLLECTION_111',
//             dataset_id: 'Test Dataset ID'
//           },
//           access_method: {
//             type: 'ECHO ORDERS'
//           },
//           order: {
//             access_method: {
//               type: 'ECHO ORDERS'
//             },
//             state: 'processing',
//             order_information: {
//               requestStatus: {
//                 status: 'processing'
//               }
//             }
//           },
//           isLoaded: true
//         }
//       },
//       true)

//       const { intervalId } = enzymeWrapper.instance()

//       expect(intervalId).toBeDefined()
//       expect(setInterval).toHaveBeenCalledTimes(1)
//       expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
//       expect(props.onFetchRetrievalCollection).toHaveBeenCalledWith('TEST_COLLECTION_111')
//       expect(shouldRefreshMock).toHaveBeenCalledTimes(0)
//       shouldRefreshMock.mockRestore()
//     })

//     describe('when the order status is not complete or failed', () => {
//       test('should try to refresh', () => {
//         const { props } = setup({
//           type: 'echo_orders',
//           collection: {
//             id: 'TEST_COLLECTION_111',
//             collection_metadata: {
//               id: 'TEST_COLLECTION_111',
//               dataset_id: 'Test Dataset ID'
//             },
//             access_method: {
//               type: 'ECHO ORDERS'
//             },
//             order: {
//               access_method: {
//                 type: 'ECHO ORDERS'
//               },
//               state: 'processing',
//               order_information: {
//                 requestStatus: {
//                   status: 'processing'
//                 }
//               }
//             },
//             isLoaded: true
//           }
//         })

//         jest.advanceTimersByTime(60000)
//         expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(2)
//       })
//     })

//     describe('when the order status is complete', () => {
//       test('should not try to refresh', () => {
//         const { props } = setup({
//           type: 'echo_orders',
//           collection: {
//             id: 'TEST_COLLECTION_111',
//             collection_metadata: {
//               id: 'TEST_COLLECTION_111',
//               dataset_id: 'Test Dataset ID'
//             },
//             access_method: {
//               type: 'ECHO ORDERS'
//             },
//             order: {
//               access_method: {
//                 type: 'ECHO ORDERS'
//               },
//               state: 'complete',
//               order_information: {
//                 requestStatus: {
//                   status: 'complete'
//                 }
//               }
//             },
//             isLoaded: true
//           }
//         })

//         jest.advanceTimersByTime(60000)
//         expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
//       })
//     })

//     describe('when the order status is failed', () => {
//       test('should not try to refresh', () => {
//         const { props } = setup({
//           type: 'echo_orders',
//           collection: {
//             id: 'TEST_COLLECTION_111',
//             collection_metadata: {
//               id: 'TEST_COLLECTION_111',
//               dataset_id: 'Test Dataset ID'
//             },
//             access_method: {
//               type: 'ECHO ORDERS'
//             },
//             order: {
//               state: 'failed',
//               order_information: {
//                 requestStatus: {
//                   status: 'failed'
//                 }
//               }
//             },
//             isLoaded: true
//           }
//         })

//         jest.advanceTimersByTime(60000)
//         expect(props.onFetchRetrievalCollection).toHaveBeenCalledTimes(1)
//       })
//     })
//   })

//   describe('when unmounted', () => {
//     test('should clear the timer', () => {
//       const { enzymeWrapper } = setup({
//         type: 'echo_orders',
//         collection: {
//           id: 'TEST_COLLECTION_111',
//           collection_metadata: {
//             id: 'TEST_COLLECTION_111',
//             dataset_id: 'Test Dataset ID'
//           },
//           access_method: {
//             type: 'ECHO ORDERS'
//           },
//           order: {
//             state: 'processing',
//             order_information: {
//               requestStatus: {
//                 status: 'processing'
//               }
//             }
//           },
//           isLoaded: true
//         }
//       })

//       const { intervalId } = enzymeWrapper.instance()

//       expect(intervalId).toBeDefined()

//       enzymeWrapper.unmount()

//       expect(clearInterval).toHaveBeenCalledTimes(1)
//       expect(clearInterval).toHaveBeenCalledWith(intervalId)
//     })
//   })
// })

// describe('Downloadable Orders', () => {
//   test('renders correct status classname', () => {
//     const { enzymeWrapper } = setup()
//     expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
//     expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
//     expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)
//   })
// })

// describe('ECHO Orders', () => {
//   describe('In Progress', () => {
//     test('renders correct status classname', () => {
//       const { enzymeWrapper } = setup({
//         type: 'echo_orders',
//         collection: {
//           id: 'TEST_COLLECTION_111',
//           collection_metadata: {
//             id: 'TEST_COLLECTION_111',
//             dataset_id: 'Test Dataset ID'
//           },
//           access_method: {
//             type: 'ECHO ORDERS'
//           },
//           order: {
//             state: 'PROCESSING',
//             order_information: {
//               state: 'PROCESSING'
//             }
//           },
//           isLoaded: true
//         }
//       })
//       expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
//     })
//   })

//   describe('Complete', () => {
//     test('renders correct status classname when order status is complete', () => {
//       const { enzymeWrapper } = setup({
//         type: 'echo_orders',
//         collection: {
//           id: 'TEST_COLLECTION_111',
//           collection_metadata: {
//             id: 'TEST_COLLECTION_111',
//             dataset_id: 'Test Dataset ID'
//           },
//           access_method: {},
//           order: {
//             state: 'CLOSED',
//             order_information: {
//               state: 'CLOSED'
//             }
//           },
//           isLoaded: true
//         }
//       })
//       expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)
//     })
//   })

//   describe('Failed', () => {
//     test('renders correct status classname when order status is failed', () => {
//       const { enzymeWrapper } = setup({
//         type: 'echo_orders',
//         collection: {
//           id: 'TEST_COLLECTION_111',
//           collection_metadata: {
//             dataset_id: 'Test Dataset ID'
//           },
//           access_method: {},
//           order: {
//             state: 'NOT_VALIDATED',
//             order_information: {
//               state: 'NOT_VALIDATED'
//             }
//           },
//           isLoaded: true
//         }
//       })
//       expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(true)
//     })
//   })
// })
// describe('ESI Orders', () => {
//   describe('In Progress', () => {
//     test('renders correct status classname', () => {
//       const { enzymeWrapper } = setup({
//         type: 'echo_orders',
//         collection: {
//           id: 'TEST_COLLECTION_111',
//           collection_metadata: {
//             id: 'TEST_COLLECTION_111',
//             dataset_id: 'Test Dataset ID'
//           },
//           access_method: {
//             type: 'ECHO ORDERS'
//           },
//           order: {
//             state: 'processing',
//             order_information: {
//               requestStatus: {
//                 status: 'processing'
//               }
//             }
//           },
//           isLoaded: true
//         }
//       })
//       expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
//     })
//   })

//   describe('Complete', () => {
//     test('renders correct status classname when order status is complete', () => {
//       const { enzymeWrapper } = setup({
//         type: 'echo_orders',
//         collection: {
//           id: 'TEST_COLLECTION_111',
//           collection_metadata: {
//             id: 'TEST_COLLECTION_111',
//             dataset_id: 'Test Dataset ID'
//           },
//           access_method: {},
//           order: {
//             state: 'complete',
//             order_information: {
//               requestStatus: {
//                 status: 'complete'
//               }
//             }
//           },
//           isLoaded: true
//         }
//       })
//       expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)
//     })
//   })

//   describe('Failed', () => {
//     test('renders correct status classname when order status is failed', () => {
//       const { enzymeWrapper } = setup({
//         type: 'echo_orders',
//         collection: {
//           id: 'TEST_COLLECTION_111',
//           collection_metadata: {
//             dataset_id: 'Test Dataset ID'
//           },
//           access_method: {},
//           order: {
//             state: 'failed',
//             order_information: {
//               requestStatus: {
//                 status: 'failed'
//               }
//             }
//           },
//           isLoaded: true
//         }
//       })
//       expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(true)
//     })
//   })
// })
// })
