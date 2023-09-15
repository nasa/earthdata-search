import React from 'react'
import {
  render, screen, getByRole, getAllByRole
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import '@testing-library/jest-dom'

import { AdminRetrievalDetails } from '../AdminRetrievalDetails'

function setup(overrideProps) {
  const props = {
    retrieval: {
      username: 'edsc-test',
      obfuscated_id: '06347346'
    },
    onRequeueOrder: jest.fn(),
    ...overrideProps
  }

  const renderContainer = (props) => render(<AdminRetrievalDetails {...props} />)

  return {
    renderContainer,
    props
  }
}

describe('AdminRetrievalDetails component', () => {
  test('should render the site AdminRetrievalDetails', () => {
    const { renderContainer, props } = setup()

    renderContainer(props)

    expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(0)).toHaveTextContent('edsc-test')
    expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(1)).toHaveTextContent('06347346')
  })

  describe('with collections', () => {
    test('should render collections', () => {
      const { renderContainer, props } = setup({
        retrieval: {
          username: 'edsc-test',
          jsondata: {
            portal_id: 'testPortal',
            source: '?mock-source'
          },
          obfuscated_id: '06347346',
          collections: [{
            id: 1,
            collection_id: 'C10000005',
            data_center: 'EDSC',
            granule_count: 35,
            access_method: {
              type: 'download'
            },
            created_at: '2023-07-18T17:53:49.000Z',
            updated_at: '2023-07-18T17:54:22.000Z',
            orders: []
          }]
        }
      })

      renderContainer(props)

      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(0)).toHaveTextContent('edsc-test')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(1)).toHaveTextContent('06347346')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(2)).toHaveTextContent('/portal/testPortal/search?mock-source')
      expect(screen.getAllByTestId('admin-retrieval-details__collections').length).toEqual(1)

      expect(screen.getAllByTestId('admin-retrieval-details__collection-heading').at(0)).toHaveTextContent('C10000005')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(3)).toHaveTextContent('1')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(4)).toHaveTextContent('download')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(5)).toHaveTextContent('EDSC')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(6)).toHaveTextContent('0')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(7)).toHaveTextContent('35')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(8)).toHaveTextContent('2023-07-18T17:53:49.000Z')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(9)).toHaveTextContent('2023-07-18T17:54:22.000Z')
    })
  })

  describe('with orders', () => {
    test('should render collections and the orders table', () => {
      const { renderContainer, props } = setup({
        retrieval: {
          username: 'edsc-test',
          jsondata: {
            source: '?mock-source'
          },
          obfuscated_id: '06347346',
          collections: [{
            id: 1,
            collection_id: 'C10000005',
            data_center: 'EDSC',
            granule_count: 35,
            access_method: {
              type: 'download'
            },
            created_at: '2023-07-18T17:53:49.000Z',
            updated_at: '2023-07-18T17:54:22.000Z',
            orders: [{
              id: 5,
              order_information: {},
              order_number: '40058',
              state: 'creating',
              type: 'ECHO ORDERS'
            }, {
              id: 6,
              order_information: {},
              order_number: '4005',
              state: 'creating',
              type: 'ECHO ORDERS'
            }]
          }]
        }
      })
      renderContainer(props)

      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(0)).toHaveTextContent('edsc-test')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(1)).toHaveTextContent('06347346')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(2)).toHaveTextContent('/search?mock-source')

      expect(screen.getAllByTestId('admin-retrieval-details__collections').length).toEqual(1)
      expect(screen.getAllByTestId('admin-retrieval-details__collection-heading')[0]).toHaveTextContent('C10000005')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(3)).toHaveTextContent('1')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(4)).toHaveTextContent('download')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(5)).toHaveTextContent('EDSC')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(6)).toHaveTextContent('2')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(7)).toHaveTextContent('35')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(8)).toHaveTextContent('2023-07-18T17:53:49.000Z')
      expect(screen.getAllByTestId('admin-retrieval-details__metadata-display-content').at(9)).toHaveTextContent('2023-07-18T17:54:22.000Z')
      expect(screen.getAllByTestId('admin-retrieval-details__orders-table').length).toEqual(1)
      expect(screen.getAllByTestId('admin-retrieval-details__order-row').length).toEqual(2)
      expect(getAllByRole(screen.getAllByTestId('admin-retrieval-details__order-row').at(0), 'cell').at(1)).toHaveTextContent('5')
      expect(getAllByRole(screen.getAllByTestId('admin-retrieval-details__order-row').at(0), 'cell').at(2)).toHaveTextContent('40058')
      expect(getAllByRole(screen.getAllByTestId('admin-retrieval-details__order-row').at(0), 'cell').at(3)).toHaveTextContent('ECHO ORDERS')
      expect(getAllByRole(screen.getAllByTestId('admin-retrieval-details__order-row').at(0), 'cell').at(4)).toHaveTextContent('creating')
    })

    test('clicking on the Requeue button calls onRequeueOrder', async () => {
      const user = userEvent.setup()
      const { renderContainer, props } = setup({
        retrieval: {
          username: 'edsc-test',
          jsondata: {
            source: '?mock-source'
          },
          obfuscated_id: '06347346',
          collections: [{
            id: 1,
            collection_id: 'C10000005',
            data_center: 'EDSC',
            granule_count: 35,
            access_method: {
              type: 'download'
            },
            created_at: '2023-07-18T17:53:49.000Z',
            updated_at: '2023-07-18T17:54:22.000Z',
            orders: [{
              id: 5,
              order_information: {},
              order_number: '40058',
              state: 'creating',
              type: 'ECHO ORDERS'
            }]
          }]
        }
      })

      const { container } = renderContainer(props)
      await user.click(getByRole(container, 'button', { value: { text: /Requeue/ } }))

      expect(props.onRequeueOrder).toHaveBeenCalledTimes(1)
      expect(props.onRequeueOrder).toHaveBeenCalledWith(5)
    })
  })
})
