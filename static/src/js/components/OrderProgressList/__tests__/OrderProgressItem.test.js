import React from 'react'

import { render, screen } from '@testing-library/react'

import { OrderProgressItem } from '../OrderProgressItem'

import {
  retrievalStatusPropsEsi,
  retrievalStatusPropsSwotOrder,
  retrievalStatusPropsHarmonyOrder
} from '../../OrderStatus/__tests__/mocks'

beforeEach(() => {
  jest.clearAllMocks()
})

const setup = (type, overrideProps) => {
  let orderOrigin = null
  let props = {}

  switch (type) {
    case 'SWODLR':
      orderOrigin = retrievalStatusPropsSwotOrder
      break
    case 'ESI':
      orderOrigin = retrievalStatusPropsEsi
      break
    case 'Harmony':
      orderOrigin = retrievalStatusPropsHarmonyOrder
      break
    default:
      orderOrigin = retrievalStatusPropsEsi
      break
  }

  const { retrieval } = orderOrigin
  const { collections } = retrieval
  const { byId } = collections
  const { orders } = byId[1]

  const order = orders[0]

  props = {
    order,
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
      setup('SWODLR')

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: e7efe743-f253-43e3-b017-74faa8bdfcf1'
      })).toBeInTheDocument()

      expect(screen.getByText('Complete')).toBeInTheDocument()
      expect(screen.getByText('(100%)')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    })
  })

  describe('Complete ESI Order', () => {
    test('shows the correct order metadata', () => {
      setup('ESI')

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: 5000000333461'
      })).toBeInTheDocument()

      expect(screen.getByText('Complete')).toBeInTheDocument()
      expect(screen.getByText('81 of 81 granule(s) processed (100%)')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
    })
  })

  describe('Complete Harmony Order', () => {
    test('shows the correct order metadata', () => {
      setup('Harmony')

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: 9f6fc038-0966-4a27-8220-2a0c7eff6078'
      })).toBeInTheDocument()

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
      expect(screen.getByText('Successful')).toBeInTheDocument()
      expect(screen.getByText('(100%)')).toBeInTheDocument()
    })
  })

  describe('when order information is not defined', () => {
    test('displays the correct progress', () => {
      setup('other', {
        order: {
          ...retrievalStatusPropsEsi.retrieval.collections.byId[1].orders[0],
          state: 'creating',
          order_information: {}
        }
      })

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: 5000000333461'
      })).toBeInTheDocument()

      expect(screen.getByText('(0%)')).toBeInTheDocument()
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
      expect(screen.getByText('Creating')).toBeInTheDocument()
    })
  })
})
