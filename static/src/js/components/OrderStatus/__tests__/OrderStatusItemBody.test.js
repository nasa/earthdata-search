import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { Badge, ProgressBar } from 'react-bootstrap'

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
        collection: orderStatusPropsEsi.order.collections.esi_orders[0],
        type: 'esi_order'
      })
      expect(enzymeWrapper.find('.order-status-item-body__state').length).toEqual(1)
    })

    describe('Order Info', () => {
      test('displays the processing status', () => {
        const { enzymeWrapper } = setup({
          collection: orderStatusPropsEsi.order.collections.esi_orders[0],
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
            collection: orderStatusPropsEsi.order.collections.esi_orders[0],
            type: 'esi_order'
          })

          expect(enzymeWrapper.find('.order-status-item-body__button--more-details').length).toEqual(1)
        })

        test('opens the panel on click', () => {
          const { enzymeWrapper } = setup({
            collection: orderStatusPropsEsi.order.collections.esi_orders[0],
            type: 'esi_order'
          })

          enzymeWrapper.find('.order-status-item-body__button--more-details').prop('onClick')()
          expect(enzymeWrapper.find('.order-status-item-body__progress-list').length).toEqual(1)
        })
      })

      describe('More Details panel', () => {
        describe('on page load', () => {
          const { enzymeWrapper } = setup({
            collection: orderStatusPropsEsi.order.collections.esi_orders[0],
            type: 'esi_order'
          })

          test('is not displayed', () => {
            expect(enzymeWrapper.find('.order-status-item-body__progress-list').length).toEqual(0)
          })
        })

        describe('after the button is clicked', () => {
          const { enzymeWrapper } = setup({
            collection: orderStatusPropsEsi.order.collections.esi_orders[0],
            type: 'esi_order'
          })

          enzymeWrapper.find('.order-status-item-body__button--more-details').prop('onClick')()
          const progressList = enzymeWrapper.find('.order-status-item-body__progress-list')

          test('is displayed', () => {
            expect(progressList.length).toEqual(1)
          })

          test('lists the orders', () => {
            expect(progressList.find('.order-status-item-body__progress-item').length).toEqual(2)
          })

          test('shows the correct order metadata', () => {
            const orderOne = progressList.find('.order-status-item-body__progress-item').at(0)
            const orderTwo = progressList.find('.order-status-item-body__progress-item').at(1)

            expect(orderOne.find('.order-status-item-body__progress-item-title').text()).toEqual('Order ID: 5000000333461')
            expect(orderOne.find('.order-status-item-body__progress-item-processed').text()).toEqual('81 of 81 granules processed (100%)')
            expect(orderOne.find(ProgressBar).prop('now')).toEqual(100)
            expect(orderOne.find(Badge).text()).toEqual('Complete')

            expect(orderTwo.find('.order-status-item-body__progress-item-title').text()).toEqual('Order ID: 5000000333462')
            expect(orderTwo.find('.order-status-item-body__progress-item-processed').text()).toEqual('13 of 100 granules processed (13%)')
            expect(orderTwo.find(ProgressBar).prop('now')).toEqual(13)
            expect(orderTwo.find(Badge).text()).toEqual('In progress')
          })

          describe('contact information', () => {
            test('displays correctly', () => {
              expect(enzymeWrapper.find('.order-status-item-body__contact').length).toEqual(1)
              expect(enzymeWrapper.find('.order-status-item-body__contact').text()).toEqual('For assistance, please contact NSIDC User Services at nsidc@nsidc.org')
            })

            test('creates an email link', () => {
              expect(enzymeWrapper.find('.order-status-item-body__contact').find('a').prop('href')).toEqual('mailto:nsidc@nsidc.org')
              expect(enzymeWrapper.find('.order-status-item-body__contact').find('a').text()).toEqual('nsidc@nsidc.org')
            })
          })
        })
      })
    })

    describe('Download Links', () => {
      const { enzymeWrapper } = setup({
        collection: orderStatusPropsEsi.order.collections.esi_orders[0],
        type: 'esi_order'
      })

      const linksDropdown = enzymeWrapper.find('.order-status-item-body__button--links')

      describe('Download Links button', () => {
        test('is displayed', () => {
          expect(linksDropdown.length).toEqual(1)
        })
      })

      describe('Download Links dropdown', () => {
        test('displays the links', () => {
          const linkOne = linksDropdown.find('.order-status-item-body__links-item').at(0)
          const linkTwo = linksDropdown.find('.order-status-item-body__links-item').at(1)

          expect(linkOne.find('.order-status-item-body__links-title').text()).toEqual('Order 1/2 Order ID: 5000000333461')
          expect(linkOne.find('.order-status-item-body__links-list-item').length).toEqual(2)
          expect(linkOne.find('.order-status-item-body__links-list-item').at(0).find('.order-status-item-body__links-link').text())
            .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html')
          expect(linkOne.find('.order-status-item-body__links-list-item').at(0).find('.order-status-item-body__links-link').prop('href'))
            .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html')
          expect(linkOne.find('.order-status-item-body__links-list-item').at(1).find('.order-status-item-body__links-link').text())
            .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip')
          expect(linkOne.find('.order-status-item-body__links-list-item').at(1).find('.order-status-item-body__links-link').prop('href'))
            .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip')


          expect(linkTwo.find('.order-status-item-body__links-title').text()).toEqual('Order 2/2 Order ID: 5000000333462')
          expect(linkTwo.find('.order-status-item-body__links-list-item').at(0).find('.order-status-item-body__links-link').text())
            .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333462.html')
          expect(linkTwo.find('.order-status-item-body__links-list-item').at(0).find('.order-status-item-body__links-link').prop('href'))
            .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333462.html')
          expect(linkTwo.find('.order-status-item-body__links-list-item').at(1).find('.order-status-item-body__links-link').text())
            .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333462.zip')
          expect(linkTwo.find('.order-status-item-body__links-list-item').at(1).find('.order-status-item-body__links-link').prop('href'))
            .toEqual('https://n5eil02u.ecs.nsidc.org/esir/5000000333462.zip')
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
