import { screen } from '@testing-library/react'

import SearchFormFeedback from '../SearchFormFeedback'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import CREATE_NLP_FEEDBACK from '../../../operations/mutations/createNlpFeedback'
import UPDATE_NLP_FEEDBACK from '../../../operations/mutations/updateNlpFeedback'

const setup = setupTest({
  Component: SearchFormFeedback,
  defaultZustandState: {
    query: {
      collection: {
        nlpRequestId: 'b65c3f7b-91f1-4df3-a61f-13a887a0dbf0'
      }
    }
  },
  withApolloClient: true
})

describe('SearchFormFeedback component', () => {
  test('should render search form feedback', () => {
    setup()

    expect(screen.getByText('Did we understand your search?')).toBeInTheDocument()

    expect(screen.getByLabelText('Yes')).toBeInTheDocument()
    expect(screen.getByLabelText('No')).toBeInTheDocument()
  })

  describe('when clicking the thumbs up button', () => {
    test('calls the createNlpFeedback mutation and displays a success message', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [
          {
            request: {
              query: CREATE_NLP_FEEDBACK,
              variables: {
                nlpRequestId: 'b65c3f7b-91f1-4df3-a61f-13a887a0dbf0',
                positive: true
              }
            },
            result: {
              data: {
                createNlpFeedback: true
              }
            }
          }
        ]
      })

      const yesButton = screen.getByLabelText('Yes')
      await user.click(yesButton)

      expect(await screen.findByText('Thanks for your feedback!')).toBeInTheDocument()
    })
  })

  describe('when clicking the No button', () => {
    test('calls the createNlpFeedback mutation and displays the feedback form', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [
          {
            request: {
              query: CREATE_NLP_FEEDBACK,
              variables: {
                nlpRequestId: 'b65c3f7b-91f1-4df3-a61f-13a887a0dbf0',
                positive: false
              }
            },
            result: {
              data: {
                createNlpFeedback: true
              }
            }
          }
        ]
      })

      const noButton = screen.getByLabelText('No')
      await user.click(noButton)

      expect(screen.getByRole('button', { name: 'Wrong keyword' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Wrong location' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Wrong date range' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Missed part of my search' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Results aren\'t relevant' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Other' })).toBeInTheDocument()

      expect(screen.getByRole('textbox', { name: 'Tell us more (optional)' })).toBeInTheDocument()

      expect(screen.getByRole('button', { name: 'Skip feedback' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Submit feedback' })).toBeInTheDocument()
    })

    describe('when skipping the feedback form', () => {
      test('displays a success message', async () => {
        const { user } = setup({
          overrideApolloClientMocks: [
            {
              request: {
                query: CREATE_NLP_FEEDBACK,
                variables: {
                  nlpRequestId: 'b65c3f7b-91f1-4df3-a61f-13a887a0dbf0',
                  positive: false
                }
              },
              result: {
                data: {
                  createNlpFeedback: true
                }
              }
            }
          ]
        })

        const noButton = screen.getByLabelText('No')
        await user.click(noButton)

        const skipButton = screen.getByRole('button', { name: 'Skip feedback' })
        await user.click(skipButton)

        expect(await screen.findByText('Thanks for your feedback!')).toBeInTheDocument()
      })
    })

    describe('when submitting the feedback form', () => {
      test('displays a success message', async () => {
        const { user } = setup({
          overrideApolloClientMocks: [
            {
              request: {
                query: CREATE_NLP_FEEDBACK,
                variables: {
                  nlpRequestId: 'b65c3f7b-91f1-4df3-a61f-13a887a0dbf0',
                  positive: false
                }
              },
              result: {
                data: {
                  createNlpFeedback: true
                }
              }
            },
            {
              request: {
                query: UPDATE_NLP_FEEDBACK,
                variables: {
                  comment: 'This is my feedback.',
                  incomplete: false,
                  keyword: true,
                  nlpRequestId: 'b65c3f7b-91f1-4df3-a61f-13a887a0dbf0',
                  other: false,
                  relevancy: false,
                  spatial: false,
                  temporal: false
                }
              },
              result: {
                data: {
                  updateNlpFeedback: true
                }
              }
            }
          ]
        })

        const noButton = screen.getByLabelText('No')
        await user.click(noButton)

        const wrongKeywordButton = screen.getByRole('button', { name: 'Wrong keyword' })
        await user.click(wrongKeywordButton)

        const feedbackTextArea = screen.getByRole('textbox', { name: 'Tell us more (optional)' })
        await user.type(feedbackTextArea, 'This is my feedback.')

        const submitButton = screen.getByRole('button', { name: 'Submit feedback' })
        await user.click(submitButton)

        expect(await screen.findByText('Thanks for your feedback!')).toBeInTheDocument()
      })
    })
  })
})
