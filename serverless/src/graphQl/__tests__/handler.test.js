import nock from 'nock'

import * as getJwtToken from '../../util/getJwtToken'
import * as getEarthdataConfig from '../../../../sharedUtils/config'
import * as getEchoToken from '../../util/urs/getEchoToken'

import graphQl from '../handler'

beforeEach(() => {
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getEchoToken, 'getEchoToken').mockImplementation(() => '1234-abcd-5678-efgh')

  jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementationOnce(() => ({
    graphQlHost: 'http://graphql.example.com'
  }))
})

describe('graphQl', () => {
  describe('when graphQl returns a successful 200', () => {
    test('returns the result', async () => {
      nock(/graphql/)
        .post(/api/)
        .reply(200, {
          collection: {
            conceptId: 'C100000-EDSC',
            title: 'Donec ullamcorper nulla non metus auctor fringilla.'
          }
        })

      const event = {
        body: JSON.stringify({
          data: {
            variables: {
              id: 'C100000-EDSC'
            },
            query: `
            query GetCollection($id: String!) {
              collection(
                conceptId: $id
              ) {
                conceptId
                title
              }
            }
          `
          },
          requestId: 'asdf-1234-qwer-5678'
        })
      }

      const response = await graphQl(event, {})

      expect(response.statusCode).toEqual(200)
    })
  })

  describe('when graphQl returns a 200 containing an error', () => {
    test('returns the errors', async () => {
      nock(/graphql/)
        .post(/api/)
        .reply(200, {
          errors: [
            {
              message: 'Concept-id [asdf] is not valid.',
              locations: [
                {
                  line: 2,
                  column: 3
                }
              ],
              path: [
                'collection'
              ],
              extensions: {
                code: 'CMR_ERROR',
                exception: {
                  stacktrace: [
                    'Error: Concept-id [asdf] is not valid.',
                    '    at /var/task/src/graphql/handler.js:1:116219',
                    '    at /var/task/src/graphql/handler.js:1:116295',
                    '    at Generator.throw (<anonymous>)',
                    '    at ge (/var/task/src/graphql/handler.js:1:111620)',
                    '    at s (/var/task/src/graphql/handler.js:1:111861)',
                    '    at processTicksAndRejections (internal/process/task_queues.js:97:5)'
                  ]
                }
              }
            }
          ],
          data: {
            collection: null
          }
        })

      const event = {
        body: JSON.stringify({
          data: {
            variables: {
              id: 'asdf'
            },
            query: `
            query GetCollection($id: String!) {
              collection(
                conceptId: $id
              ) {
                conceptId
                title
              }
            }
          `
          },
          requestId: 'asdf-1234-qwer-5678'
        })
      }

      const response = await graphQl(event, {})

      expect(response.statusCode).toEqual(200)

      const { body } = response
      const { data, errors } = JSON.parse(body)

      expect(data).toEqual({ collection: null })
      expect(errors).toEqual([
        {
          message: 'Concept-id [asdf] is not valid.',
          locations: [
            {
              line: 2,
              column: 3
            }
          ],
          path: [
            'collection'
          ],
          extensions: {
            code: 'CMR_ERROR',
            exception: {
              stacktrace: [
                'Error: Concept-id [asdf] is not valid.',
                '    at /var/task/src/graphql/handler.js:1:116219',
                '    at /var/task/src/graphql/handler.js:1:116295',
                '    at Generator.throw (<anonymous>)',
                '    at ge (/var/task/src/graphql/handler.js:1:111620)',
                '    at s (/var/task/src/graphql/handler.js:1:111861)',
                '    at processTicksAndRejections (internal/process/task_queues.js:97:5)'
              ]
            }
          }
        }
      ])
    })
  })

  test('responds correctly on http error', async () => {
    nock(/graphql/)
      .post(/api/)
      .reply(500, {
        errors: [
          'Test error message'
        ]
      })

    const event = {
      body: JSON.stringify({
        data: {
          variables: {},
          query: {}
        },
        requestId: 'asdf-1234-qwer-5678'
      })
    }

    const response = await graphQl(event, {})

    expect(response.statusCode).toEqual(500)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Test error message')
  })
})
