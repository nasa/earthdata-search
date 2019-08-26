import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { OrderProgressList } from '../../OrderProgressList/OrderProgressList'

import { retrievalStatusProps, retrievalStatusPropsEsi } from './mocks'

import { OrderStatusItemBody } from '../OrderStatusItemBody'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collection: retrievalStatusProps.retrieval.collections.download[1],
    type: 'download',
    match: {
      params: {
        retrieval_id: 2,
        id: 1
      },
      path: '/downloads/2/collections/1'
    },
    orderStatus: 'creating',
    onChangePath: jest.fn(),
    onFetchRetrievalCollection: jest.fn(),
    ...overrideProps
  }

  const enzymeWrapper = shallow(<OrderStatusItemBody {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('OrderStatusItemBody component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper).toBeDefined()
    expect(enzymeWrapper.hasClass('order-status-item-body')).toEqual(true)
  })

  describe('ESI Order', () => {
    test('displays the correct state', () => {
      const { enzymeWrapper } = setup({
        collection: retrievalStatusPropsEsi.retrieval.collections.esi[1],
        type: 'esi',
        orderStatus: 'in progress'
      })
      expect(enzymeWrapper.find('.order-status-item-body__state').length).toEqual(1)
    })

    describe('Aggregated Order Info', () => {
      test('displays the \'in progress\' status', () => {
        const { enzymeWrapper } = setup({
          collection: retrievalStatusPropsEsi.retrieval.collections.esi[1],
          type: 'esi',
          orderStatus: 'in progress'
        })

        expect(enzymeWrapper.find('.order-status-item-body__processed').text()).toEqual('1/2 orders complete')
        expect(enzymeWrapper.find('.order-status-item-body__status').text()).toEqual('1/2 orders complete (51%)')
      })
    })

    describe('More Details', () => {
      describe('More Details button', () => {
        test('is displayed', () => {
          const { enzymeWrapper } = setup({
            collection: retrievalStatusPropsEsi.retrieval.collections.esi[1],
            type: 'esi'
          })

          expect(enzymeWrapper.find('.order-status-item-body__button--more-details').length).toEqual(1)
        })

        test('opens the panel on click', () => {
          const { enzymeWrapper } = setup({
            collection: retrievalStatusPropsEsi.retrieval.collections.esi[1],
            type: 'esi'
          })

          enzymeWrapper.find('.order-status-item-body__button--more-details').prop('onClick')()
          expect(enzymeWrapper.find(OrderProgressList).length).toEqual(1)
        })
      })

      describe('More Details panel', () => {
        describe('on page load', () => {
          const { enzymeWrapper } = setup({
            collection: retrievalStatusPropsEsi.retrieval.collections.esi[1],
            type: 'esi'
          })

          test('is not displayed', () => {
            expect(enzymeWrapper.find('.order-status-item-body__progress-list').length).toEqual(0)
          })
        })

        describe('after the button is clicked', () => {
          const { enzymeWrapper } = setup({
            collection: retrievalStatusPropsEsi.retrieval.collections.esi[1],
            type: 'esi'
          })

          enzymeWrapper.find('.order-status-item-body__button--more-details').prop('onClick')()
          const progressList = enzymeWrapper.find(OrderProgressList)

          test('is displayed', () => {
            expect(progressList.length).toEqual(1)
          })
        })
      })
    })

    describe('Download Links', () => {
      const { enzymeWrapper } = setup({
        collection: retrievalStatusPropsEsi.retrieval.collections.esi[1],
        type: 'esi'
      })

      const linksDropdown = enzymeWrapper.find('.order-status-item-body__button--links')

      describe('Download Links button', () => {
        test('is displayed', () => {
          expect(linksDropdown.length).toEqual(1)
        })
      })
    })

    describe('ECHO Order', () => {
      describe('in progress', () => {
        test('renders with the correct classname', () => {
          const { enzymeWrapper } = setup({
            type: 'echo_orders',
            collection: {
              collection_id: 'TEST_COLLECTION_111',
              collection_metadata: {
                dataset_id: 'Test Dataset ID'
              },
              access_method: {
                order: {
                  order_status: 'in progress'
                }
              }
            },
            orderStatus: 'in progress'
          })

          expect(enzymeWrapper.find('.order-status-item-body__state-display').length).toEqual(1)
          expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--complete')).toEqual(false)
          expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--failed')).toEqual(false)
        })
      })

      describe('complete', () => {
        test('renders with the correct classname', () => {
          const { enzymeWrapper } = setup({
            type: 'echo_orders',
            collection: {
              collection_id: 'TEST_COLLECTION_111',
              collection_metadata: {
                dataset_id: 'Test Dataset ID'
              },
              access_method: {
                order: {
                  order_status: 'complete'
                }
              }
            },
            orderStatus: 'complete'
          })

          expect(enzymeWrapper.find('.order-status-item-body__state-display').length).toEqual(1)
          expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--complete')).toEqual(true)
        })
      })

      describe('failed', () => {
        test('renders with the correct classname', () => {
          const { enzymeWrapper } = setup({
            type: 'echo_orders',
            collection: {
              collection_id: 'TEST_COLLECTION_111',
              collection_metadata: {
                dataset_id: 'Test Dataset ID'
              },
              access_method: {
                order: {
                  order_status: 'failed'
                }
              }
            },
            orderStatus: 'failed'
          })

          expect(enzymeWrapper.find('.order-status-item-body__state-display').length).toEqual(1)
          expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--failed')).toEqual(true)
        })
      })
    })
  })
})
