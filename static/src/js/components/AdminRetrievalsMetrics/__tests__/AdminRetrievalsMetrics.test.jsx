import { screen, waitFor } from '@testing-library/react'

import { act } from 'react'
import setupTest from '../../../../../../jestConfigs/setupTest'
import AdminRetrievalsMetrics from '../AdminRetrievalsMetrics'
import ADMIN_RETRIEVALS_METRICS from '../../../operations/queries/adminRetrievalsMetrics'

const setup = setupTest({
  Component: AdminRetrievalsMetrics,
  defaultProps: {},
  withRouter: true,
  withApolloClient: true
})

const mockRetrievalsMetrics = {
  adminRetrievalsMetrics: {
    retrievalResponse: [
      {
        accessMethodType: 'Harmony',
        totalTimesAccessMethodUsed: '1',
        averageGranuleCount: '2',
        averageGranuleLinkCount: '50',
        totalGranulesRetrieved: '2',
        maxGranuleLinkCount: 50,
        minGranuleLinkCount: 50
      },
      {
        accessMethodType: 'download',
        totalTimesAccessMethodUsed: '3',
        averageGranuleCount: '5375',
        averageGranuleLinkCount: '207',
        totalGranulesRetrieved: '16124',
        maxGranuleLinkCount: 240,
        minGranuleLinkCount: 160
      }
    ],
    multCollectionResponse: [
      {
        collectionCount: 2,
        retrievalId: 6
      }
    ]
  }
}

describe('AdminRetrievalsMetrics component', () => {
  describe('when the component renders', () => {
    test('it should display the page title and date pickers, but not table', () => {
      setup()

      expect(screen.getByText('Retrieval Metrics')).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: 'Start Date:' })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: 'End Date:' })).toBeInTheDocument()
      expect(screen.queryByText('Data Access Type')).not.toBeInTheDocument()
    })

    test('it should display Apply and Clear buttons', () => {
      setup()

      expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Clear' })).toBeInTheDocument()
    })
  })

  describe('when a user enters dates', () => {
    test('it should enable the Apply button when an end date is entered', async () => {
      const { user } = setup()

      const endDateInput = screen.getByLabelText('End Date:')
      const applyButton = screen.getByRole('button', { name: 'Apply' })

      expect(applyButton).toBeDisabled()

      await act(async () => {
        await user.type(endDateInput, '2023-05-15 12:00:00')
      })

      expect(applyButton).toBeEnabled()
    })
  })

  describe('when a user clicks the Apply button', () => {
    test('it should fetch the retrieval metrics', async () => {
      const mocks = [
        {
          request: {
            query: ADMIN_RETRIEVALS_METRICS,
            variables: {
              params: {
                startDate: '2025-11-14 00:00:00',
                endDate: '2025-11-14 23:59:59'
              }
            }
          },
          result: {
            data: mockRetrievalsMetrics
          }
        }
      ]

      const { user } = setup({
        overrideApolloClientMocks: mocks
      })

      const startDateInput = screen.getByLabelText('Start Date:')
      const endDateInput = screen.getByLabelText('End Date:')
      const applyButton = screen.getByRole('button', { name: 'Apply' })

      await user.type(startDateInput, '2025-11-14 00:00:00')
      await user.type(endDateInput, '2025-11-14 23:59:59')

      expect(screen.queryByText('Data Access Type')).not.toBeInTheDocument()

      await user.click(applyButton)

      await waitFor(() => {
        expect(screen.getByText('Data Access Type')).toBeInTheDocument()
      })

      expect(screen.getByText('Harmony')).toBeInTheDocument()
      expect(screen.getByText('download')).toBeInTheDocument()
    })
  })

  describe('when a user clicks the Clear button', () => {
    test('it should clear the selected dates', async () => {
      const { user } = setup()

      const startDateInput = screen.getByLabelText('Start Date:')
      const endDateInput = screen.getByLabelText('End Date:')
      const clearButton = screen.getByRole('button', { name: 'Clear' })

      await user.type(startDateInput, '2025-11-14 00:00:00')
      await user.type(endDateInput, '2025-11-14 23:59:59')

      await user.click(clearButton)

      expect(startDateInput).toHaveValue('')
      expect(endDateInput).toHaveValue('')
    })
  })

  describe('when an error occurs during data fetching', () => {
    test('it should display an error message', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

      const mocks = [
        {
          request: {
            query: ADMIN_RETRIEVALS_METRICS,
            variables: {
              params: {
                startDate: '',
                endDate: '2025-11-14 23:59:59'
              }
            }
          },
          error: new Error('An error occurred')
        }
      ]

      const { user } = setup({
        overrideApolloClientMocks: mocks
      })

      const endDateInput = screen.getByRole('textbox', { name: 'End Date:' })
      const applyButton = screen.getByRole('button', { name: 'Apply' })

      await user.type(endDateInput, '2025-11-14 23:59:59')

      await user.click(applyButton)

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching Retrieval Metrics:',
          expect.any(Error)
        )
      })

      expect(screen.queryByText('Data Access Type')).not.toBeInTheDocument()

      consoleErrorSpy.mockRestore()
    })
  })

  describe('when an invalid date has been passed in', () => {
    test('it should display an error message', async () => {
      const { user } = setup()

      const endDateInput = screen.getByRole('textbox', { name: 'End Date:' })
      const applyButton = screen.getByRole('button', { name: 'Apply' })

      await user.type(endDateInput, '2025-11-1 23:59:59')

      user.click(applyButton)

      await waitFor(() => {
        expect(screen.getByText('Invalid date format')).toBeInTheDocument()
      })

      // Ensure that the AdminRetrievalsMetricsList is not rendered
      expect(screen.queryByText('Data Access Type')).not.toBeInTheDocument()
    })
  })
})
