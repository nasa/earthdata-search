import knex from 'knex'
import mockKnex from 'mock-knex'

import * as getDbConnection from '../../util/database/getDbConnection'

import edlAuthorizer from '../handler'
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

describe('edlAuthorizer', () => {
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
          'Earthdata-ENV': 'test',
          Authorization: `Bearer ${jwtToken}`
        }
      }

      const response = await edlAuthorizer(event, {})

      expect(response).toEqual({
        context: {
          earthdataEnvironment: 'test',
          jwtToken,
          userId: 1,
          username: 'testuser'
        },
        principalId: 'testuser'
      })

      expect(validateToken).toHaveBeenCalledTimes(1)
      expect(validateToken).toHaveBeenCalledWith(jwtToken, 'test')
    })
  })

  describe('when the supplied jwtToken is invalid', () => {
    test('returns unauthorized', async () => {
      validateToken.mockResolvedValueOnce(false)

      await expect(
        edlAuthorizer({}, {})
      ).rejects.toThrow('Unauthorized')

      expect(validateToken).toHaveBeenCalledTimes(1)
      expect(validateToken).toHaveBeenCalledWith(undefined, 'prod')
    })
  })
})
