import React from 'react'

import { render, screen } from '@testing-library/react'

import { OrderProgressItem } from '../OrderProgressItem'

import {
  retrievalStatusPropsEsi,
  retrievalStatusPropsSwodlrOrder,
  retrievalStatusPropsHarmonyOrder
} from './mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = (overrideProps) => {
  let props = {}

  props = {
    ...overrideProps
  }

  render(<OrderProgressItem {...props} />)

  return {
    props
  }
}

describe('OrderProgressItem component', () => {
  describe('Complete Swodlr Order', () => {
    test('shows the correct order metadata', () => {
      setup({
        order: retrievalStatusPropsSwodlrOrder
      })

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: e7efe743-f253-43e3-b017-74faa8bdfcf1'
      })).toBeInTheDocument()

      expect(screen.queryAllByRole('status')[0]).toHaveTextContent('Complete')
      expect(screen.queryAllByRole('status')[1]).toHaveTextContent('(100%)')
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    })
  })

  describe('Complete ESI Order', () => {
    test('shows the correct order metadata', () => {
      const { orders } = retrievalStatusPropsEsi
      const esiOrder = orders[0]

      setup(
        {
          order: esiOrder
        }
      )

      const orderHeading = screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: 5000000333461'
      })

      expect(orderHeading).toBeInTheDocument()
      expect(screen.queryAllByRole('status')[0]).toHaveTextContent('Complete')
      expect(screen.queryAllByRole('status')[1]).toHaveTextContent('81 of 81 granule(s) processed (100%)')

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    })
  })

  describe('Complete Harmony Order', () => {
    test('shows the correct order metadata', () => {
      setup(
        {
          order: retrievalStatusPropsHarmonyOrder
        }
      )

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: 9f6fc038-0966-4a27-8220-2a0c7eff6078'
      })).toBeInTheDocument()

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
      expect(screen.queryAllByRole('status')[0]).toHaveTextContent('Successful')
      expect(screen.queryAllByRole('status')[1]).toHaveTextContent('(100%)')
    })
  })

  describe('when order information is not defined', () => {
    test('displays the correct progress', () => {
      const { orders } = retrievalStatusPropsEsi
      const esiOrder = orders[0]

      setup({
        order: {
          ...esiOrder,
          state: 'creating',
          order_information: {}
        }
      })

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: 5000000333461'
      })).toBeInTheDocument()

      expect(screen.queryAllByRole('status')[0]).toHaveTextContent('Creating')
      expect(screen.queryAllByRole('status')[1]).toHaveTextContent('(0%)')
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
    })
  })
})
