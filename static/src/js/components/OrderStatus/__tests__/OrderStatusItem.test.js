import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { retrievalStatusProps } from './mocks'

import { OrderStatusItem } from '../OrderStatusItem'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    key: 'TEST_COLLECTION_111',
    collection: retrievalStatusProps.retrieval.collections.download[1],
    type: 'download',
    match: {
      params: {
        retrieval_id: 2,
        id: 1
      },
      path: '/downloads/2/collections/1'
    },
    onChangePath: jest.fn(),
    onFetchRetrievalCollection: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<OrderStatusItem {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderStatus component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper).toBeDefined()
    expect(enzymeWrapper.hasClass('order-status-item')).toEqual(true)
  })

  describe('Downloadable Orders', () => {
    test('renders correct status classname', () => {
      const { enzymeWrapper } = setup()
      expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(false)
      expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(false)
      expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(false)
    })
  })

  describe('ECHO Orders', () => {
    describe('In Progress', () => {
      test('renders correct status classname', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_orders',
          collection: {
            collection_id: 'TEST_COLLECTION_111',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              dataset_id: 'Test Dataset ID'
            },
            access_method: {
              type: 'ECHO ORDERS'
            },
            orders: [{
              state: 'PROCESSING',
              order_information: {
                state: 'PROCESSING'
              }
            }],
            isLoaded: true
          }
        })
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
      })
    })

    describe('Complete', () => {
      test('renders correct status classname when order status is complete', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_orders',
          collection: {
            collection_id: 'TEST_COLLECTION_111',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              dataset_id: 'Test Dataset ID'
            },
            access_method: {},
            orders: [{
              state: 'CLOSED',
              order_information: {
                state: 'CLOSED'
              }
            }],
            isLoaded: true
          }
        })
        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)
      })
    })

    describe('Failed', () => {
      test('renders correct status classname when order status is failed', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_orders',
          collection: {
            collection_id: 'TEST_COLLECTION_111',
            collection_metadata: {
              dataset_id: 'Test Dataset ID'
            },
            access_method: {},
            orders: [{
              state: 'NOT_VALIDATED',
              order_information: {
                state: 'NOT_VALIDATED'
              }
            }],
            isLoaded: true
          }
        })
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(true)
      })
    })
  })
  describe('ESI Orders', () => {
    describe('In Progress', () => {
      test('renders correct status classname', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_orders',
          collection: {
            collection_id: 'TEST_COLLECTION_111',
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
        expect(enzymeWrapper.hasClass('order-status-item--in_progress')).toEqual(true)
      })
    })

    describe('Complete', () => {
      test('renders correct status classname when order status is complete', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_orders',
          collection: {
            collection_id: 'TEST_COLLECTION_111',
            collection_metadata: {
              id: 'TEST_COLLECTION_111',
              dataset_id: 'Test Dataset ID'
            },
            access_method: {},
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
        expect(enzymeWrapper.hasClass('order-status-item--complete')).toEqual(true)
      })
    })

    describe('Failed', () => {
      test('renders correct status classname when order status is failed', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_orders',
          collection: {
            collection_id: 'TEST_COLLECTION_111',
            collection_metadata: {
              dataset_id: 'Test Dataset ID'
            },
            access_method: {},
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
        expect(enzymeWrapper.hasClass('order-status-item--failed')).toEqual(true)
      })
    })
  })
})
