import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { OrderProgressList } from '../../OrderProgressList/OrderProgressList'

import { orderStatusProps, orderStatusPropsEsi } from './mocks'

import { OrderStatusItemBody } from '../OrderStatusItemBody'

beforeEach(() => {
  jest.clearAllMocks()
})

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    collection: orderStatusProps.order.collections.download[0],
    type: 'download',
    onChangePath: jest.fn(),
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
        collection: orderStatusPropsEsi.order.collections.esi[0],
        type: 'esi_order'
      })
      expect(enzymeWrapper.find('.order-status-item-body__state').length).toEqual(1)
    })

    describe('Order Info', () => {
      test('displays the processing status', () => {
        const { enzymeWrapper } = setup({
          collection: orderStatusPropsEsi.order.collections.esi[0],
          type: 'esi_order'
        })

        expect(enzymeWrapper.find('.order-status-item-body__processed').text()).toEqual('1/2 orders complete')
        expect(enzymeWrapper.find('.order-status-item-body__status').text()).toContain('(44%)')
      })
    })

    describe('More Details', () => {
      describe('More Details button', () => {
        test('is displayed', () => {
          const { enzymeWrapper } = setup({
            collection: orderStatusPropsEsi.order.collections.esi[0],
            type: 'esi_order'
          })

          expect(enzymeWrapper.find('.order-status-item-body__button--more-details').length).toEqual(1)
        })

        test('opens the panel on click', () => {
          const { enzymeWrapper } = setup({
            collection: orderStatusPropsEsi.order.collections.esi[0],
            type: 'esi_order'
          })

          enzymeWrapper.find('.order-status-item-body__button--more-details').prop('onClick')()
          expect(enzymeWrapper.find(OrderProgressList).length).toEqual(1)
        })
      })

      describe('More Details panel', () => {
        describe('on page load', () => {
          const { enzymeWrapper } = setup({
            collection: orderStatusPropsEsi.order.collections.esi[0],
            type: 'esi_order'
          })

          test('is not displayed', () => {
            expect(enzymeWrapper.find('.order-status-item-body__progress-list').length).toEqual(0)
          })
        })

        describe('after the button is clicked', () => {
          const { enzymeWrapper } = setup({
            collection: orderStatusPropsEsi.order.collections.esi[0],
            type: 'esi_order'
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
        collection: orderStatusPropsEsi.order.collections.esi[0],
        type: 'esi_order'
      })

      const linksDropdown = enzymeWrapper.find('.order-status-item-body__button--links')

      describe('Download Links button', () => {
        test('is displayed', () => {
          expect(linksDropdown.length).toEqual(1)
        })
      })
    })
  })

  describe('order status', () => {
    describe('in progress', () => {
      test('renders with the correct classname', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_order',
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
          }
        })

        expect(enzymeWrapper.find('.order-status-item-body__state-display').length).toEqual(1)
        expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--success')).toEqual(false)
        expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--errored')).toEqual(false)
      })
    })

    describe('success', () => {
      test('renders with the correct classname', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_order',
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
          }
        })

        expect(enzymeWrapper.find('.order-status-item-body__state-display').length).toEqual(1)
        expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--success')).toEqual(true)
      })
    })

    describe('error', () => {
      test('renders with the correct classname', () => {
        const { enzymeWrapper } = setup({
          type: 'echo_order',
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
          }
        })

        expect(enzymeWrapper.find('.order-status-item-body__state-display').length).toEqual(1)
        expect(enzymeWrapper.find('.order-status-item-body__state-display').hasClass('order-status-item-body__state-display--errored')).toEqual(true)
      })
    })
  })
})
