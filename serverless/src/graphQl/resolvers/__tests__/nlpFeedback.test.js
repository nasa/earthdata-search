import setupServer from './__mocks__/setupServer'

import CREATE_NLP_FEEDBACK from '../../../../../static/src/js/operations/mutations/createNlpFeedback'
import UPDATE_NLP_FEEDBACK from '../../../../../static/src/js/operations/mutations/updateNlpFeedback'

describe('NLP Feedback Resolver', () => {
  describe('Mutation', () => {
    describe('createNlpFeedback', () => {
      test('should call databaseClient.createNlpFeedback with correct arguments', async () => {
        const databaseClient = {
          createNlpFeedback: vi.fn().mockResolvedValue(true)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: CREATE_NLP_FEEDBACK,
          variables: {
            nlpRequestId: '123',
            positive: true
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(databaseClient.createNlpFeedback).toHaveBeenCalledWith({
          id: '123',
          positive: true
        })

        expect(databaseClient.createNlpFeedback).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          createNlpFeedback: true
        })
      })
    })

    describe('updateNlpFeedback', () => {
      test('should call databaseClient.updateNlpFeedback with correct arguments', async () => {
        const databaseClient = {
          updateNlpFeedback: vi.fn().mockResolvedValue(true)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: UPDATE_NLP_FEEDBACK,
          variables: {
            feedback: 'feedback',
            incomplete: false,
            keyword: false,
            nlpRequestId: '123',
            other: false,
            relevancy: false,
            spatial: false,
            temporal: false
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors).toBeUndefined()

        expect(databaseClient.updateNlpFeedback).toHaveBeenCalledWith({
          feedback: 'feedback',
          id: '123',
          incomplete: false,
          keyword: false,
          other: false,
          relevancy: false,
          spatial: false,
          temporal: false
        })

        expect(databaseClient.updateNlpFeedback).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          updateNlpFeedback: true
        })
      })
    })
  })
})
