import { screen } from '@testing-library/react'

import { OrderProgressItem } from '../OrderProgressItem'

import {
  retrievalStatusPropsHarmonyOrder,
  retrievalStatusPropsHarmonyOrderInProgress,
  retrievalStatusPropsUponRequestOrder
} from './mocks'
import setupTest from '../../../../../../vitestConfigs/setupTest'

const setup = setupTest({
  Component: OrderProgressItem,
  defaultProps: {
    retrievalOrder: [retrievalStatusPropsHarmonyOrder]
  }
})

describe('OrderProgressItem component', () => {
  describe('Harmony Order in progress', () => {
    test('shows the correct order metadata upon initial request of order', () => {
      setup({
        overrideProps: {
          retrievalOrder: retrievalStatusPropsUponRequestOrder
        }
      })

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: Not provided'
      })).toBeInTheDocument()

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
      expect(screen.queryAllByRole('status')[0]).toHaveTextContent('Running')
      expect(screen.queryAllByRole('status')[1]).toHaveTextContent('(0%)')

      // Check that the Harmony Job Information link is not present
      const harmonyLink = screen.queryByText('View Harmony Job Information')
      expect(harmonyLink).not.toBeInTheDocument()
    })

    test('shows the correct order metadata and Harmony workflows link', () => {
      setup({
        overrideProps: {
          retrievalOrder: retrievalStatusPropsHarmonyOrderInProgress
        }
      })

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: 1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p'
      })).toBeInTheDocument()

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
      expect(screen.queryAllByRole('status')[0]).toHaveTextContent('Running')
      expect(screen.queryAllByRole('status')[1]).toHaveTextContent('(0%)')

      const harmonyLink = screen.getByText('View Harmony Job Information')
      expect(harmonyLink).toBeInTheDocument()
      expect(harmonyLink).toHaveAttribute('href', 'https://harmony.earthdata.nasa.gov/workflow-ui/1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p')
    })
  })

  describe('Complete Harmony Order', () => {
    test('shows the correct order metadata', () => {
      setup({
        overrideProps: {
          retrievalOrder: retrievalStatusPropsHarmonyOrder
        }
      })

      expect(screen.getByRole('heading', {
        level: 5,
        name: 'Order ID: 9f6fc038-0966-4a27-8220-2a0c7eff6078'
      })).toBeInTheDocument()

      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
      expect(screen.queryAllByRole('status')[0]).toHaveTextContent('Successful')
      expect(screen.queryAllByRole('status')[1]).toHaveTextContent('(100%)')
    })
  })
})
