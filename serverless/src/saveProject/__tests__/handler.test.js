import knex from 'knex'
import mockKnex from 'mock-knex'

import saveProject from '../handler'
import * as getJwtToken from '../../util/getJwtToken'
import * as getVerifiedJwtToken from '../../util/getVerifiedJwtToken'
import * as getDbConnection from '../../util/database/getDbConnection'

let dbConnectionToMock
let dbTracker

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(getJwtToken, 'getJwtToken').mockImplementation(() => 'mockJwt')
  jest.spyOn(getVerifiedJwtToken, 'getVerifiedJwtToken').mockImplementation(() => ({ username: 'testuser' }))

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

describe('saveProject', () => {
  describe('as an unauthticated user', () => {
    test('saves an unnamed project into the database', async () => {
      const path = '/search?p=C123456-EDSC'

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response([{
            id: 12,
            path
          }])
        } else {
          query.response(undefined)
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            path
          }
        })
      }

      const result = await saveProject(event, {})

      const expectedBody = JSON.stringify({
        name: '',
        path,
        project_id: '6249150326'
      })

      const { queries } = dbTracker.queries

      expect(queries[0].method).toEqual('insert')

      expect(result.body).toEqual(expectedBody)
    })

    test('updates an existing project', async () => {
      const path = '/search?p=C123456-EDSC'

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response({
            id: 12
          })
        } else if (step === 2) {
          query.response({
            id: 12,
            path
          })
        } else {
          query.response([])
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            path,
            projectId: 6249150326
          }
        })
      }

      const result = await saveProject(event, {})

      const expectedBody = JSON.stringify({
        name: '',
        path,
        project_id: '6249150326'
      })

      const { queries } = dbTracker.queries

      expect(queries[0].method).toEqual('first')
      expect(queries[1].method).toEqual('update')

      expect(result.body).toEqual(expectedBody)
    })
  })

  describe('as an authticated user', () => {
    test('saves an unnamed project into the database', async () => {
      const path = '/search?p=C123456-EDSC'

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response([{ id: 1 }])
        } else if (step === 2) {
          query.response([{
            id: 12
          }])
        } else {
          query.response(undefined)
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            authToken: 'mock token',
            path
          }
        })
      }

      const result = await saveProject(event, {})

      const expectedBody = JSON.stringify({
        name: '',
        path,
        project_id: '6249150326'
      })

      const { queries } = dbTracker.queries

      expect(queries[0].method).toEqual('first')
      expect(queries[1].method).toEqual('insert')

      expect(result.body).toEqual(expectedBody)
    })

    test('updates an existing project', async () => {
      const path = '/search?p=C123456-EDSC'

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response([{ id: 1 }])
        } else if (step === 2) {
          query.response({
            id: 12
          })
        } else if (step === 3) {
          query.response({
            id: 12
          })
        } else {
          query.response([])
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            authToken: 'mock token',
            path,
            projectId: '6249150326'
          }
        })
      }

      const result = await saveProject(event, {})

      const expectedBody = JSON.stringify({
        name: '',
        path,
        project_id: '6249150326'
      })

      const { queries } = dbTracker.queries

      expect(queries[0].method).toEqual('first')
      expect(queries[1].method).toEqual('first')
      expect(queries[2].method).toEqual('update')

      expect(result.body).toEqual(expectedBody)
    })

    test('copies an existing project from a different user', async () => {
      const path = '/search?p=C123456-EDSC'

      dbTracker.on('query', (query, step) => {
        if (step === 1) {
          query.response([{ id: 1 }])
        } else if (step === 2) {
          // Find project by projectId and userId
          query.response(undefined)
        } else if (step === 3) {
          query.response([{
            id: 13
          }])
        } else {
          query.response([])
        }
      })

      const event = {
        body: JSON.stringify({
          params: {
            authToken: 'mock token',
            path,
            projectId: '6249150326'
          }
        })
      }

      const result = await saveProject(event, {})

      const expectedBody = JSON.stringify({
        name: '',
        path,
        project_id: '1723465690'
      })

      const { queries } = dbTracker.queries

      expect(queries[0].method).toEqual('first')
      expect(queries[1].method).toEqual('first')
      expect(queries[2].method).toEqual('insert')

      expect(result.body).toEqual(expectedBody)
    })
  })

  test('correctly returns an error when inserting a new project', async () => {
    const path = '/search?p=C123456-EDSC'

    dbTracker.on('query', (query) => {
      query.reject('Unknown Error')
    })

    const event = {
      body: JSON.stringify({
        params: {
          path
        }
      })
    }

    const result = await saveProject(event, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('insert')

    expect(result.statusCode).toEqual(500)
  })

  test('correctly returns an error when updating a project fails', async () => {
    const path = '/search?p=C123456-EDSC'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          id: 12
        })
      } else {
        query.reject('Unknown Error')
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          path,
          projectId: 6249150326
        }
      })
    }

    const result = await saveProject(event, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')

    expect(result.statusCode).toEqual(500)
  })

  test('correctly returns an error when copying a project fails', async () => {
    const path = '/search?p=C123456-EDSC'

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([{ id: 1 }])
      } else if (step === 2) {
        // Find project by projectId and userId
        query.response(undefined)
      } else {
        query.reject('Unknown Error')
      }
    })

    const event = {
      body: JSON.stringify({
        params: {
          authToken: 'mock token',
          path,
          projectId: '6249150326'
        }
      })
    }

    const result = await saveProject(event, {})

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('first')
    expect(queries[2].method).toEqual('insert')

    expect(result.statusCode).toEqual(500)
  })
})
