import setupServer from './__mocks__/setupServer'

import categorizeNlpFeedback from '../../utils/categorizeNlpFeedback'

import CREATE_NLP_FEEDBACK from '../../../../../static/src/js/operations/mutations/createNlpFeedback'
import UPDATE_NLP_FEEDBACK from '../../../../../static/src/js/operations/mutations/updateNlpFeedback'

vi.mock('../../utils/categorizeNlpFeedback', () => ({
  __esModule: true,
  default: vi.fn().mockResolvedValue({
    incomplete: false,
    keyword: false,
    other: true,
    relevancy: false,
    spatial: true,
    temporal: false
  })
}))

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
            nlpQuery: 'Test query',
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
          positive: true,
          query: 'Test query'
        })

        expect(databaseClient.createNlpFeedback).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          createNlpFeedback: true
        })
      })

      test('sanitizes the query before saving it', async () => {
        const databaseClient = {
          createNlpFeedback: vi.fn().mockResolvedValue(true)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        await server.executeOperation({
          query: CREATE_NLP_FEEDBACK,
          variables: {
            nlpQuery: '  rain\u0000fall\u202E  ',
            nlpRequestId: '123',
            positive: true
          }
        }, {
          contextValue
        })

        expect(databaseClient.createNlpFeedback).toHaveBeenCalledWith({
          id: '123',
          positive: true,
          query: 'rainfall'
        })
      })

      test('rejects a query that is too long', async () => {
        const databaseClient = {
          createNlpFeedback: vi.fn().mockResolvedValue(true)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: CREATE_NLP_FEEDBACK,
          variables: {
            nlpQuery: 'a'.repeat(501),
            nlpRequestId: '123',
            positive: true
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors[0].message).toEqual('nlpQuery must be 500 characters or fewer')
        expect(errors[0].extensions.code).toEqual('BAD_USER_INPUT')
        expect(data).toEqual({ createNlpFeedback: null })

        expect(databaseClient.createNlpFeedback).toHaveBeenCalledTimes(0)
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
            comment: 'the box was too large to be useful',
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
          comment: 'the box was too large to be useful',
          id: '123',
          incomplete: false,
          keyword: false,
          other: true, // Set from categorizeNlpFeedback mock
          relevancy: false,
          spatial: true, // Set from categorizeNlpFeedback mock
          temporal: false
        })

        expect(databaseClient.updateNlpFeedback).toHaveBeenCalledTimes(1)

        expect(data).toEqual({
          updateNlpFeedback: true
        })
      })

      test('sanitizes the feedback before categorizing and saving it', async () => {
        const databaseClient = {
          updateNlpFeedback: vi.fn().mockResolvedValue(true)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        await server.executeOperation({
          query: UPDATE_NLP_FEEDBACK,
          variables: {
            comment: '  wrong\u0000 location\r\n<script>alert(1)</script>  ',
            nlpRequestId: '123'
          }
        }, {
          contextValue
        })

        const expectedComment = 'wrong location\n<script>alert(1)</script>'

        expect(categorizeNlpFeedback).toHaveBeenCalledWith(expectedComment)
        expect(databaseClient.updateNlpFeedback).toHaveBeenCalledWith(
          expect.objectContaining({ comment: expectedComment })
        )
      })

      test('saves whitespace-only feedback as null without categorizing it', async () => {
        categorizeNlpFeedback.mockClear()
        categorizeNlpFeedback.mockResolvedValueOnce({})

        const databaseClient = {
          updateNlpFeedback: vi.fn().mockResolvedValue(true)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        await server.executeOperation({
          query: UPDATE_NLP_FEEDBACK,
          variables: {
            comment: '   \n  ',
            keyword: true,
            nlpRequestId: '123'
          }
        }, {
          contextValue
        })

        expect(categorizeNlpFeedback).toHaveBeenCalledWith('')
        expect(databaseClient.updateNlpFeedback).toHaveBeenCalledWith(
          expect.objectContaining({
            comment: null,
            keyword: true
          })
        )
      })

      test('rejects feedback that is too long without categorizing it', async () => {
        categorizeNlpFeedback.mockClear()

        const databaseClient = {
          updateNlpFeedback: vi.fn().mockResolvedValue(true)
        }

        const { contextValue, server } = setupServer({
          databaseClient
        })

        const response = await server.executeOperation({
          query: UPDATE_NLP_FEEDBACK,
          variables: {
            comment: 'a'.repeat(501),
            nlpRequestId: '123'
          }
        }, {
          contextValue
        })

        const { data, errors } = response.body.singleResult

        expect(errors[0].message).toEqual('comment must be 500 characters or fewer')
        expect(errors[0].extensions.code).toEqual('BAD_USER_INPUT')
        expect(data).toEqual({ updateNlpFeedback: null })

        expect(categorizeNlpFeedback).toHaveBeenCalledTimes(0)
        expect(databaseClient.updateNlpFeedback).toHaveBeenCalledTimes(0)
      })
    })
  })
})
