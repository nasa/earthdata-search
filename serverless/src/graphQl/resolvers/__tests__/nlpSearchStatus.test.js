import setupServer from './__mocks__/setupServer'

import * as isNlpSearchDisabled from '../../../util/isNlpSearchDisabled'

import NLP_SEARCH_STATUS from '../../../../../static/src/js/operations/queries/nlpSearchStatus'

describe('NlpSearchStatus Resolver', () => {
  describe('Query', () => {
    describe('nlpSearchStatus', () => {
      test('returns disabled: true when NLP search has been disabled', async () => {
        vi.spyOn(isNlpSearchDisabled, 'isNlpSearchDisabled').mockResolvedValueOnce(true)

        const { contextValue, server } = setupServer({
          databaseClient: {},
          loggedOut: true
        })

        const response = await server.executeOperation({
          query: NLP_SEARCH_STATUS
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(isNlpSearchDisabled.isNlpSearchDisabled).toHaveBeenCalledTimes(1)
        expect(data).toEqual({
          nlpSearchStatus: {
            disabled: true
          }
        })
      })

      test('returns disabled: false when NLP search is enabled', async () => {
        vi.spyOn(isNlpSearchDisabled, 'isNlpSearchDisabled').mockResolvedValueOnce(false)

        const { contextValue, server } = setupServer({
          databaseClient: {},
          loggedOut: true
        })

        const response = await server.executeOperation({
          query: NLP_SEARCH_STATUS
        }, {
          contextValue
        })

        const { data } = response.body.singleResult

        expect(data).toEqual({
          nlpSearchStatus: {
            disabled: false
          }
        })
      })
    })
  })
})
