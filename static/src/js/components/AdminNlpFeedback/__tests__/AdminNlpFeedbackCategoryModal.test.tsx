import { screen, within } from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import AdminNlpFeedbackCategoryModal from '../AdminNlpFeedbackCategoryModal'
import ADMIN_NLP_FEEDBACK_CATEGORY from '../../../operations/queries/adminNlpFeedbackCategory'

// @ts-expect-error This file does not have types
import addToast from '../../../util/addToast'

vi.mock('../../../util/addToast', () => ({
  __esModule: true,
  default: vi.fn()
}))

const baseVariables = {
  startDate: '2026-01-01T00:00:00.000Z',
  endDate: '2026-01-31T23:59:59.999Z',
  category: 'KEYWORD',
  limit: 20
}

const buildEntry = (index: number, overrides = {}) => ({
  nlpRequestId: `request-${index}`,
  nlpQuery: `query ${index}`,
  keyword: true,
  spatial: false,
  temporal: false,
  incomplete: false,
  relevancy: false,
  other: false,
  feedback: null,
  ...overrides
})

const buildCategoryMock = ({
  offset = 0,
  entries = [buildEntry(1)],
  count = entries.length,
  currentPage = 1
}: {
  offset?: number
  entries?: ReturnType<typeof buildEntry>[]
  count?: number
  currentPage?: number
} = {}) => ({
  request: {
    query: ADMIN_NLP_FEEDBACK_CATEGORY,
    variables: {
      ...baseVariables,
      offset
    }
  },
  result: {
    data: {
      adminNlpFeedbackCategory: {
        __typename: 'AdminNlpFeedbackCategory',
        pageInfo: {
          __typename: 'PageInfo',
          currentPage,
          hasNextPage: offset + 20 < count,
          hasPreviousPage: offset > 0,
          pageCount: Math.ceil(count / 20)
        },
        count,
        adminNlpFeedback: entries.map((entry) => ({
          __typename: 'NlpFeedback',
          ...entry
        }))
      }
    }
  }
})

const setup = setupTest({
  Component: AdminNlpFeedbackCategoryModal,
  defaultProps: {
    category: {
      category: 'KEYWORD',
      title: 'Keyword Feedback',
      description: '“Wrong keyword”'
    },
    displayRange: 'January 1, 2026 – January 31, 2026 (UTC)',
    startDate: '2026-01-01T00:00:00.000Z',
    endDate: '2026-01-31T23:59:59.999Z',
    onHide: vi.fn(),
    show: true
  },
  defaultZustandState: {
    errors: {
      handleError: vi.fn()
    }
  },
  withApolloClient: true
})

describe('AdminNlpFeedbackCategoryModal component', () => {
  describe('when the modal is not shown', () => {
    test('does not render the modal', () => {
      setup({
        overrideProps: {
          show: false
        }
      })

      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })

  describe('when entries are returned', () => {
    test('displays the title, subtitle and entries', async () => {
      setup({
        overrideApolloClientMocks: [buildCategoryMock({
          entries: [
            buildEntry(1, {
              spatial: true,
              feedback: 'Should have searched for precipitation'
            }),
            buildEntry(2, {
              keyword: true
            })
          ]
        })]
      })

      const dialog = await screen.findByRole('dialog', { name: 'Keyword Feedback' })

      expect(await within(dialog).findByText('query 1')).toBeInTheDocument()
      expect(within(dialog).getByText('“Wrong keyword” · January 1, 2026 – January 31, 2026 (UTC) · 2 entries')).toBeInTheDocument()

      expect(within(dialog).getByRole('columnheader', { name: 'Request ID' })).toBeInTheDocument()

      const firstRow = within(dialog).getByRole('row', { name: /query 1/ })
      expect(within(firstRow).getByText('request-1')).toBeInTheDocument()
      expect(within(firstRow).getByText('Keyword')).toBeInTheDocument()
      expect(within(firstRow).getByText('Spatial')).toBeInTheDocument()
      expect(within(firstRow).getByText('Should have searched for precipitation')).toBeInTheDocument()

      const secondRow = within(dialog).getByRole('row', { name: /query 2/ })
      expect(within(secondRow).getByText('No comment')).toBeInTheDocument()
    })

    test('requests the next page when paging', async () => {
      const firstPage = Array.from({ length: 20 }, (_, index) => buildEntry(index + 1))

      const { user } = setup({
        overrideApolloClientMocks: [
          buildCategoryMock({
            entries: firstPage,
            count: 21
          }),
          buildCategoryMock({
            offset: 20,
            entries: [buildEntry(21)],
            count: 21,
            currentPage: 2
          })
        ]
      })

      expect(await screen.findByText('query 1')).toBeInTheDocument()

      await user.click(screen.getByRole('listitem', { name: '2' }))

      expect(await screen.findByText('query 21')).toBeInTheDocument()
      expect(screen.queryByText('query 1')).not.toBeInTheDocument()
    })
  })

  describe('when the copy button is clicked', () => {
    test('copies the NLP Request ID and displays a toast', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [buildCategoryMock()]
      })

      const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText')

      await user.click(await screen.findByRole('button', { name: 'Copy NLP Request ID request-1' }))

      expect(writeTextSpy).toHaveBeenCalledTimes(1)
      expect(writeTextSpy).toHaveBeenCalledWith('request-1')

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Copied the NLP Request ID', {
        appearance: 'success',
        autoDismiss: true
      })
    })

    test('displays an error toast when copying fails', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [buildCategoryMock()]
      })

      vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('Not supported'))

      await user.click(await screen.findByRole('button', { name: 'Copy NLP Request ID request-1' }))

      await vi.waitFor(() => {
        expect(addToast).toHaveBeenCalledWith('Could not copy the NLP Request ID', {
          appearance: 'error',
          autoDismiss: true
        })
      })
    })
  })

  describe('when no entries are returned', () => {
    test('displays an empty message', async () => {
      setup({
        overrideApolloClientMocks: [buildCategoryMock({ entries: [] })]
      })

      expect(await screen.findByText('No feedback matched this category during this date range.')).toBeInTheDocument()
    })
  })

  describe('when the query fails', () => {
    test('calls handleError', async () => {
      const error = new ApolloError({ errorMessage: 'Failed to retrieve NLP feedback entries' })

      const { zustandState } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: ADMIN_NLP_FEEDBACK_CATEGORY,
            variables: {
              ...baseVariables,
              offset: 0
            }
          },
          error
        }]
      })

      expect(await screen.findByRole('dialog', { name: 'Keyword Feedback' })).toBeInTheDocument()

      await vi.waitFor(() => {
        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
      })

      expect(zustandState.errors.handleError).toHaveBeenCalledWith({
        action: 'getAdminNlpFeedbackCategory',
        error,
        resource: 'adminNlpFeedbackCategory',
        verb: 'retrieving'
      })
    })
  })
})
