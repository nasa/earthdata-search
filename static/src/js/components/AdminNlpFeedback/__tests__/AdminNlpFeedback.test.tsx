import { screen, within } from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AdminNlpFeedback from '../AdminNlpFeedback'
import ADMIN_NLP_FEEDBACK_REPORT from '../../../operations/queries/adminNlpFeedbackReport'
import ADMIN_NLP_FEEDBACK_CATEGORY from '../../../operations/queries/adminNlpFeedbackCategory'

const setup = setupTest({
  Component: AdminNlpFeedback,
  defaultZustandState: {
    errors: {
      handleError: vi.fn()
    }
  },
  withRouter: true,
  withApolloClient: true
})

const reportVariables = {
  startDate: '2026-01-01',
  endDate: '2026-01-31'
}

const buildReportMock = (overrides = {}) => ({
  request: {
    query: ADMIN_NLP_FEEDBACK_REPORT,
    variables: reportVariables
  },
  result: {
    data: {
      adminNlpFeedbackReport: {
        totalCount: 1250,
        positiveCount: 1000,
        negativeCount: 250,
        keywordCount: 100,
        spatialCount: 50,
        temporalCount: 25,
        incompleteCount: 10,
        relevancyCount: 75,
        otherCount: 5,
        freeTextCount: 40,
        ...overrides
      }
    }
  }
})

const buildCategoryMock = (category: string) => ({
  request: {
    query: ADMIN_NLP_FEEDBACK_CATEGORY,
    variables: {
      ...reportVariables,
      category,
      limit: 20,
      offset: 0
    }
  },
  result: {
    data: {
      adminNlpFeedbackCategory: {
        pageInfo: {
          currentPage: 1,
          hasNextPage: false,
          hasPreviousPage: false,
          pageCount: 1
        },
        count: 1,
        adminNlpFeedback: [{
          nlpRequestId: 'request-1',
          nlpQuery: 'rainfall in Brazil last summer',
          keyword: true,
          spatial: false,
          temporal: false,
          incomplete: false,
          relevancy: false,
          other: false,
          feedback: 'Wrong keyword was used'
        }]
      }
    }
  }
})

const fillDates = async (
  user: ReturnType<typeof setup>['user'],
  startDate = '2026-01-01',
  endDate = '2026-01-31'
) => {
  await user.type(screen.getByRole('textbox', { name: 'Start Date' }), startDate)
  await user.type(screen.getByRole('textbox', { name: 'End Date' }), endDate)
}

describe('AdminNlpFeedback component', () => {
  describe('when the component renders', () => {
    test('displays the date inputs and a disabled submit button', () => {
      setup()

      expect(screen.getByRole('heading', { name: 'NLP Feedback' })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: 'Start Date' })).toHaveAttribute('placeholder', 'YYYY-MM-DD')
      expect(screen.getByRole('textbox', { name: 'End Date' })).toHaveAttribute('placeholder', 'YYYY-MM-DD')
      expect(screen.getByRole('button', { name: 'Generate Report' })).toBeDisabled()
      expect(screen.queryByRole('article')).not.toBeInTheDocument()
    })
  })

  describe('when the user submits valid dates', () => {
    test('requests the full days in UTC and displays the report', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [buildReportMock()]
      })

      await fillDates(user)
      await user.click(screen.getByRole('button', { name: 'Generate Report' }))

      const report = await screen.findByRole('article', { name: 'Natural Language Search Feedback Report' })

      expect(within(report).getByText('January 1, 2026 – January 31, 2026 (UTC)')).toBeInTheDocument()

      // Summary counts
      expect(within(report).getByText('1,250')).toBeInTheDocument()
      expect(within(report).getByText('1,000')).toBeInTheDocument()
      expect(within(report).getByText('80% of total')).toBeInTheDocument()
      expect(within(report).getByText('20% of total')).toBeInTheDocument()

      // Category percentages are relative to negative feedback
      const keywordRow = within(report).getByRole('row', { name: /Keyword/ })
      expect(within(keywordRow).getByText('40%')).toBeInTheDocument()
      expect(within(keywordRow).getByText('100')).toBeInTheDocument()

      const otherRow = within(report).getByRole('row', { name: /^Other/ })
      expect(within(otherRow).getByText('2%')).toBeInTheDocument()

      // Free text count lives in the footer
      const footer = within(report).getByRole('contentinfo')
      expect(within(footer).getByText('40')).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Print / Save as PDF' })).toBeInTheDocument()
    })

    test('prints the page when the print button is clicked', async () => {
      const printSpy = vi.spyOn(window, 'print').mockImplementation(() => {})

      const { user } = setup({
        overrideApolloClientMocks: [buildReportMock()]
      })

      await fillDates(user)
      await user.click(screen.getByRole('button', { name: 'Generate Report' }))
      await user.click(await screen.findByRole('button', { name: 'Print / Save as PDF' }))

      expect(printSpy).toHaveBeenCalledTimes(1)
    })

    test('displays an empty message when there is no feedback', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [buildReportMock({
          totalCount: 0,
          positiveCount: 0,
          negativeCount: 0,
          keywordCount: 0,
          spatialCount: 0,
          temporalCount: 0,
          incompleteCount: 0,
          relevancyCount: 0,
          otherCount: 0,
          freeTextCount: 0
        })]
      })

      await fillDates(user)
      await user.click(screen.getByRole('button', { name: 'Generate Report' }))

      expect(await screen.findByText('No feedback was submitted during this date range.')).toBeInTheDocument()
      expect(screen.queryByRole('table')).not.toBeInTheDocument()
    })
  })

  describe('when the user clicks a category', () => {
    test('opens the category modal using the report date range', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [buildReportMock(), buildCategoryMock('KEYWORD')]
      })

      await fillDates(user)
      await user.click(screen.getByRole('button', { name: 'Generate Report' }))
      await user.click(await screen.findByRole('button', { name: 'Keyword' }))

      const dialog = await screen.findByRole('dialog', { name: 'Keyword Feedback' })

      expect(await within(dialog).findByText('rainfall in Brazil last summer')).toBeInTheDocument()
      expect(within(dialog).getByText('Wrong keyword was used')).toBeInTheDocument()
    })

    test('opens the written comments modal from the footer', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [buildReportMock(), buildCategoryMock('FEEDBACK')]
      })

      await fillDates(user)
      await user.click(screen.getByRole('button', { name: 'Generate Report' }))
      await user.click(await screen.findByRole('button', { name: 'View 40 written comments' }))

      const dialog = await screen.findByRole('dialog', { name: 'Written Comments' })

      expect(await within(dialog).findByText('Wrong keyword was used')).toBeInTheDocument()
    })

    test('disables categories with no feedback', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [buildReportMock({ spatialCount: 0 })]
      })

      await fillDates(user)
      await user.click(screen.getByRole('button', { name: 'Generate Report' }))

      expect(await screen.findByRole('button', { name: 'Spatial' })).toBeDisabled()
      expect(screen.getByRole('button', { name: 'Keyword' })).toBeEnabled()
    })
  })

  describe('when the user submits invalid dates', () => {
    test('shows an error for a malformed date', async () => {
      const { user } = setup()

      await fillDates(user, '2026-1-1', '2026-01-31')
      await user.click(screen.getByRole('button', { name: 'Generate Report' }))

      expect(screen.getByRole('alert')).toHaveTextContent('Dates must be valid and in the format YYYY-MM-DD')
      expect(screen.queryByRole('article')).not.toBeInTheDocument()
    })

    test('shows an error when the end date is before the start date', async () => {
      const { user } = setup()

      await fillDates(user, '2026-02-01', '2026-01-31')
      await user.click(screen.getByRole('button', { name: 'Generate Report' }))

      expect(screen.getByRole('alert')).toHaveTextContent('End date must be on or after the start date')
    })
  })

  describe('when the query fails', () => {
    test('calls handleError', async () => {
      const error = new ApolloError({ errorMessage: 'Failed to retrieve NLP feedback report' })

      const { user, zustandState } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: ADMIN_NLP_FEEDBACK_REPORT,
            variables: reportVariables
          },
          error
        }]
      })

      await fillDates(user)
      await user.click(screen.getByRole('button', { name: 'Generate Report' }))

      await vi.waitFor(() => {
        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
      })

      expect(zustandState.errors.handleError).toHaveBeenCalledWith({
        action: 'getAdminNlpFeedbackReport',
        error,
        resource: 'adminNlpFeedbackReport',
        verb: 'retrieving'
      })
    })
  })
})
