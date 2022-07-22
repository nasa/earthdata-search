import nock from 'nock'
import knex from 'knex'
import mockKnex from 'mock-knex'
import MockDate from 'mockdate'

import { getSystemToken } from '../getSystemToken'

import * as deleteSystemToken from '../deleteSystemToken'
import * as getDbConnection from '../../database/getDbConnection'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'
import * as getUrsSystemCredentials from '../getUrsSystemCredentials'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()
  jest.resetAllMocks()

  jest.spyOn(getDbConnection, 'getDbConnection').mockImplementationOnce(() => {
    const dbCon = knex({
      client: 'pg',
      debug: false
    })

    // Mock the db connection
    mockKnex.mock(dbCon)

    return dbCon
  })

  dbTracker = mockKnex.getTracker()
  dbTracker.install()

  // MockDate is used here to overwrite the js Date object. This allows us to
  // mock changes needed to test the moment functions
  MockDate.set('2022-01-05T12:00:00.000Z')
})

afterEach(() => {
  dbTracker.uninstall()
  MockDate.reset()
})

describe('getSystemToken', () => {
  describe('when a valid token exists', () => {
    test('returns the token', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 1,
            token: 'new-mock-token',
            created_at: new Date('2022-01-05T11:00:00.000Z')
          })
        } else {
          query.response([])
        }
      })

      const tokenResponse = await getSystemToken()

      expect(tokenResponse).toEqual('new-mock-token')

      const { queries } = dbTracker.queries
      expect(queries.length).toBe(1)
      expect(queries[0].method).toContain('first')
    })
  })

  describe('when a token older than a day exists', () => {
    test('fetches a new token', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 1,
            token: 'old-mock-token',
            created_at: new Date('2022-01-03T11:00:00.000Z')
          })
        } else if (step === 2) {
          query.response({
            id: 1,
            token: 'new-mock-token',
            created_at: new Date()
          })
        } else {
          query.response([])
        }
      })

      jest.spyOn(getUrsSystemCredentials, 'getUrsSystemCredentials').mockImplementation(() => ({
        username: 'edsc',
        password: 'mocked-password'
      }))
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://example.com' }))
      const deleteSystemTokenMock = jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => {})

      nock('http://example.com')
        .matchHeader('Authorization', 'Basic ZWRzYzptb2NrZWQtcGFzc3dvcmQ=')
        .post('/api/users/token')
        .reply(200, {
          access_token: 'new-mock-token'
        })

      const tokenResponse = await getSystemToken()

      expect(tokenResponse).toEqual('new-mock-token')
      expect(deleteSystemTokenMock).toHaveBeenCalledTimes(1)
      expect(deleteSystemTokenMock).toHaveBeenCalledWith('old-mock-token')

      const { queries } = dbTracker.queries
      expect(queries.length).toBe(2)
      expect(queries[0].method).toContain('first')
      expect(queries[1].method).toContain('insert')
    })

    test('logs an error', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 1,
            token: 'old-mock-token',
            created_at: new Date('2022-01-03T11:00:00.000Z')
          })
        } else {
          query.response([])
        }
      })

      jest.spyOn(getUrsSystemCredentials, 'getUrsSystemCredentials').mockImplementation(() => ({
        username: 'edsc',
        password: 'mocked-password'
      }))
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://example.com' }))
      const deleteSystemTokenMock = jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => {})
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock('http://example.com')
        .matchHeader('Authorization', 'Basic ZWRzYzptb2NrZWQtcGFzc3dvcmQ=')
        .post('/api/users/token')
        .reply(403, {
          mock: 'error'
        })

      const tokenResponse = await getSystemToken()

      expect(tokenResponse).toEqual(null)
      expect(deleteSystemTokenMock).toHaveBeenCalledTimes(1)
      expect(deleteSystemTokenMock).toHaveBeenCalledWith('old-mock-token')

      const { queries } = dbTracker.queries
      expect(queries.length).toBe(1)
      expect(queries[0].method).toContain('first')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Error retrieving token', new Error('Request failed with status code 403'))
    })
  })

  describe('when no token exists', () => {
    test('fetches a new token', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response(undefined)
        } else if (step === 2) {
          query.response({
            id: 1,
            token: 'new-mock-token',
            created_at: new Date()
          })
        } else {
          query.response([])
        }
      })

      jest.spyOn(getUrsSystemCredentials, 'getUrsSystemCredentials').mockImplementation(() => ({
        username: 'edsc',
        password: 'mocked-password'
      }))
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://example.com' }))
      const deleteSystemTokenMock = jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => {})

      nock('http://example.com')
        .matchHeader('Authorization', 'Basic ZWRzYzptb2NrZWQtcGFzc3dvcmQ=')
        .post('/api/users/token')
        .reply(200, {
          access_token: 'new-mock-token'
        })

      const tokenResponse = await getSystemToken()

      expect(tokenResponse).toEqual('new-mock-token')
      expect(deleteSystemTokenMock).toHaveBeenCalledTimes(0)

      const { queries } = dbTracker.queries
      expect(queries.length).toBe(2)
      expect(queries[0].method).toContain('first')
      expect(queries[1].method).toContain('insert')
    })

    test('logs an error', async () => {
      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response(undefined)
        } else {
          query.response([])
        }
      })

      jest.spyOn(getUrsSystemCredentials, 'getUrsSystemCredentials').mockImplementation(() => ({
        username: 'edsc',
        password: 'mocked-password'
      }))
      jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ edlHost: 'http://example.com' }))
      const deleteSystemTokenMock = jest.spyOn(deleteSystemToken, 'deleteSystemToken').mockImplementation(() => {})
      const consoleMock = jest.spyOn(console, 'log').mockImplementation(() => jest.fn())

      nock('http://example.com')
        .matchHeader('Authorization', 'Basic ZWRzYzptb2NrZWQtcGFzc3dvcmQ=')
        .post('/api/users/token')
        .reply(403, {
          mock: 'error'
        })

      const tokenResponse = await getSystemToken()

      expect(tokenResponse).toEqual(null)
      expect(deleteSystemTokenMock).toHaveBeenCalledTimes(0)

      const { queries } = dbTracker.queries
      expect(queries.length).toBe(1)
      expect(queries[0].method).toContain('first')

      expect(consoleMock).toHaveBeenCalledTimes(1)
      expect(consoleMock).toHaveBeenCalledWith('Error retrieving token', new Error('Request failed with status code 403'))
    })
  })
})
