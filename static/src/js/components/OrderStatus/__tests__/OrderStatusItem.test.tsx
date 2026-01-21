import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import OrderStatusItem from '../OrderStatusItem'

// @ts-expect-error This file does not have types
import ProgressRing from '../../ProgressRing/ProgressRing'
import { MODAL_NAMES } from '../../../constants/modalNames'

vi.mock('../../ProgressRing/ProgressRing', () => ({ default: vi.fn(() => <div />) }))

vi.mock('../../OrderProgressList/OrderProgressList', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: OrderStatusItem,
  defaultProps: {
    accessMethodType: 'download',
    className: '',
    collectionIsCSDA: false,
    granuleCount: 1,
    hasStatus: false,
    messageIsError: false,
    messages: [],
    opened: true,
    orderInfo: '',
    orderStatus: 'complete',
    progressPercentage: 100,
    setOpened: vi.fn(),
    tabs: [<div key="mock-tab">Mock Tab</div>],
    title: 'Mock Title',
    totalCompleteOrders: 0,
    totalOrders: 0,
    updatedAt: '2025-01-24T02:34:33.340Z'
  },
  defaultZustandState: {
    ui: {
      modals: {
        setOpenModal: vi.fn()
      }
    }
  }
})

describe('OrderStatusItem', () => {
  describe('when the item is closed', () => {
    test('renders the minimized header correctly', () => {
      setup({
        overrideProps: {
          opened: false
        }
      })

      // Progress ring is 100%
      expect(ProgressRing).toHaveBeenCalledTimes(1)
      expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
        progress: 100
      }), {})

      // Status is 'Complete'
      expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
      expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

      // Access method is Download
      expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Download')

      // Granules is 1
      expect(screen.getByLabelText('Granule Count')).toHaveTextContent('1 Granule')
    })

    describe('when the order has a status', () => {
      test('renders the status message', () => {
        setup({
          overrideProps: {
            accessMethodType: 'Harmony',
            hasStatus: true,
            opened: false,
            orderStatus: 'in_progress',
            progressPercentage: 50
          }
        })

        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In Progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('50%')
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Harmony')
      })
    })

    describe('when clicking on the open button', () => {
      test('calls setOpened', async () => {
        const { props, user } = setup({
          overrideProps: {
            opened: false
          }
        })

        const button = screen.getByRole('button', { name: 'Show details' })
        await user.click(button)

        expect(props.setOpened).toHaveBeenCalledTimes(1)
        expect(props.setOpened).toHaveBeenCalledWith(true)
      })
    })
  })

  describe('when the item is opened', () => {
    test('renders the order correctly', () => {
      setup({
        overrideProps: {
          opened: true
        }
      })

      // Progress ring is 100%
      expect(ProgressRing).toHaveBeenCalledTimes(1)
      expect(ProgressRing).toHaveBeenCalledWith(expect.objectContaining({
        progress: 100
      }), {})

      // Status is 'Complete'
      expect(screen.getByLabelText('Order Status')).toHaveTextContent('Complete')
      expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('100%')

      // Access method is Download
      expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Download')

      // Granules is 1
      expect(screen.getByLabelText('Granule Count')).toHaveTextContent('1 Granule')

      // Tabs
      expect(screen.getByText('Mock Tab')).toBeInTheDocument()
    })

    describe('when the order has a status', () => {
      test('renders the status message', () => {
        setup({
          overrideProps: {
            accessMethodType: 'Harmony',
            hasStatus: true,
            orderInfo: 'Mock order information',
            orderStatus: 'in_progress',
            progressPercentage: 50,
            totalCompleteOrders: 0,
            totalOrders: 1
          }
        })

        expect(screen.getByLabelText('Order Status')).toHaveTextContent('In Progress')
        expect(screen.getByLabelText('Order Progress Percentage')).toHaveTextContent('50%')
        expect(screen.getByLabelText('Orders Processed Count')).toHaveTextContent('0/1 orders complete')
        expect(screen.getByLabelText('Order Last Updated Time')).toHaveTextContent('Updated: 01-23-2025 09:34:33 pm')
        expect(screen.getByLabelText('Access Method Type')).toHaveTextContent('Harmony')
        expect(screen.getByLabelText('Order Information')).toHaveTextContent('Mock order information')
      })
    })

    describe('when the collection is CSDA', () => {
      test('renders the note', () => {
        setup({
          overrideProps: {
            collectionIsCSDA: true
          }
        })

        expect(screen.getByLabelText('CSDA Note')).toHaveTextContent('This collection is made available through the NASA Commercial Smallsat Data Acquisition (CSDA) Program for NASA funded researchers. Access to the data will require additional authentication. More Details')
      })

      describe('when clicking on the More Details link', () => {
        test('calls setOpenModal', async () => {
          const { user, zustandState } = setup({
            overrideProps: {
              collectionIsCSDA: true
            }
          })

          const button = screen.getByRole('button', { name: 'More details' })
          await user.click(button)

          expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
          expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(MODAL_NAMES.ABOUT_CSDA)
        })
      })
    })

    describe('when the order has messages', () => {
      test('renders the messages', () => {
        setup({
          overrideProps: {
            messages: ['Mock Message']
          }
        })

        expect(screen.getByText('Service has responded with message:')).toBeInTheDocument()
        expect(screen.getByText('Mock Message')).toBeInTheDocument()
      })
    })

    describe('when clicking on the close button', () => {
      test('calls setOpened', async () => {
        const { props, user } = setup({
          overrideProps: {
            opened: true
          }
        })

        const button = screen.getByRole('button', { name: 'Close details' })
        await user.click(button)

        expect(props.setOpened).toHaveBeenCalledTimes(1)
        expect(props.setOpened).toHaveBeenCalledWith(false)
      })
    })
  })
})
