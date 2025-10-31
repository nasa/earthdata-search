import knex from 'knex'
import mockKnex from 'mock-knex'

import * as getDbConnection from '../../util/database/getDbConnection'

import edlOptionalAuthorizer from '../handler'

import { getEnvironmentConfig } from '../../../../sharedUtils/config'
import { validateToken } from '../../util/authorizer/validateToken'

jest.mock('../../util/authorizer/validateToken', () => ({
  validateToken: jest.fn()
}))

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    dbConnectionToMock = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbConnectionToMock)

    return dbConnectionToMock
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('edlOptionalAuthorizer', () => {
  describe('when the logged in user is an admin', () => {
    test('returns a valid policy', async () => {
      validateToken.mockResolvedValueOnce({
        username: 'testuser'
      })

      dbTracker.on('query', (query) => {
        query.response([{
          id: 1,
          username: 'testuser'
        }])
      })

      const { jwtToken } = getEnvironmentConfig('test')

      const event = {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      }

      const response = await edlOptionalAuthorizer(event, {})

      expect(response).toEqual({
        context: {
          earthdataEnvironment: 'prod',
          jwtToken,
          userId: 1,
          username: 'testuser'
        },
        principalId: 'testuser'
      })
    })
  })

  describe('when the supplied jwtToken is empty', () => {
    describe('when the resource path requires authentication', () => {
      test('returns an anonymous policy', async () => {
        validateToken.mockResolvedValueOnce(false)

        const event = {
          headers: {
            Authorization: ''
          },
          requestContext: {
            resourcePath: '/authRequiredEndpoint'
          }
        }

        await expect(
          edlOptionalAuthorizer(event, {})
        ).rejects.toThrow('Unauthorized')
      })
    })

    test('returns an anonymous policy', async () => {
      validateToken.mockResolvedValueOnce(false)

      const event = {
        headers: {
          Authorization: ''
        },
        requestContext: {
          resourcePath: '/autocomplete'
        }
      }

      const response = await edlOptionalAuthorizer(event)

      expect(response).toEqual({
        principalId: 'anonymous'
      })
    })
  })

  describe('when the supplied jwtToken is invalid', () => {
    test('returns unauthorized', async () => {
      validateToken.mockResolvedValueOnce(false)

      const { jwtToken } = getEnvironmentConfig('test')

      const event = {
        headers: {
          Authorization: `Bearer ${jwtToken}`
        }
      }

      await expect(
        edlOptionalAuthorizer(event, {})
      ).rejects.toThrow('Unauthorized')
    })
  })
})
