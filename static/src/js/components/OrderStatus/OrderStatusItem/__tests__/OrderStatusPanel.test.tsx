import { screen } from '@testing-library/react'
import setupTest from '../../../../../../../vitestConfigs/setupTest'
import OrderStatusPanel from '../OrderStatusPanel'

// @ts-expect-error This file does not have types
import OrderProgressList from '../../../OrderProgressList/OrderProgressList'

vi.mock('../../../OrderProgressList/OrderProgressList', () => ({ default: vi.fn() }))

const setup = setupTest({
  Component: OrderStatusPanel,
  defaultProps: {
    retrievalOrders: []
  }
})

describe('OrderStatusPanel', () => {
  test('renders the intro and OrderProgressList component', () => {
    const { props } = setup()

    expect(OrderProgressList).toHaveBeenCalledTimes(1)
    expect(OrderProgressList).toHaveBeenCalledWith({
      retrievalOrders: props.retrievalOrders
    }, {})
  })

  describe('when there is more than one retrievalOrder', () => {
    test('renders a intro message', () => {
      setup({
        overrideProps: {
          retrievalOrders: [{ id: 1 }, { id: 2 }]
        }
      })

      expect(screen.getByText('Due to the number of granules included in the request, it has been split into multiple orders. The data for each order will become available as they are processed.')).toBeInTheDocument()
    })
  })

  describe('when the component is rendered with a contactName and contactEmail', () => {
    test('renders a help link', () => {
      setup({
        overrideProps: {
          contactName: 'John Doe',
          contactEmail: 'john.doe@example.com'
        }
      })

      expect(screen.getByText('For assistance, please contact John Doe at')).toBeInTheDocument()
      expect(screen.getByRole('link', { name: 'john.doe@example.com' })).toHaveAttribute('href', 'mailto:john.doe@example.com')
    })
  })
})
