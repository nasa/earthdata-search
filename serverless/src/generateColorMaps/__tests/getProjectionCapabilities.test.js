import AWS from 'aws-sdk'

import nock from 'nock'
import knex from 'knex'
import mockKnex from 'mock-knex'

import * as getDbConnection from '../../util/database/getDbConnection'

import { gibsError, gibsResponse } from './mocks'

import { getProjectionCapabilities } from '../getProjectionCapabilities'

let dbTracker

const sqsColorMap = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue()
})

AWS.SQS = jest.fn()
  .mockImplementationOnce(() => ({
    sendMessage: sqsColorMap
  }))

beforeEach(() => {
  jest.clearAllMocks()

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
})

afterEach(() => {
  dbTracker.uninstall()
})

describe('getProjectionCapabilities', () => {
  describe('when there is no existing record of the color map', () => {
    test('inserts a new record, adds it to the database and returns it', async () => {
      nock(/gibs/)
        .get(/epsg4236/)
        .reply(200, gibsResponse)

      dbTracker.on('query', (query, step) => {
        if (step === 3) {
          query.response([{
            id: 1,
            product: 'VIIRS_Angstrom_Exponent_Deep_Blue',
            url: 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/VIIRS_Angstrom_Exponent_Deep_Blue.xml'
          }])
        } else {
          query.response([])
        }
      })

      const response = await getProjectionCapabilities('epsg4236')

      expect(response.statusCode).toEqual(200)

      expect(sqsColorMap).toBeCalledTimes(1)
      expect(sqsColorMap.mock.calls[0]).toEqual([expect.objectContaining({
        MessageBody: JSON.stringify({
          id: 1,
          product: 'VIIRS_Angstrom_Exponent_Deep_Blue',
          url: 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/VIIRS_Angstrom_Exponent_Deep_Blue.xml'
        })
      })])

      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify(['VIIRS_Angstrom_Exponent_Deep_Blue'])
      })
    })
  })

  describe('when there is an existing record of the color map', () => {
    test('inserts a new record, adds it to the database and returns it', async () => {
      nock(/gibs/)
        .get(/epsg4236/)
        .reply(200, gibsResponse)

      dbTracker.on('query', (query, step) => {
        if (step === 2) {
          query.response({
            id: 1,
            product: 'VIIRS_Angstrom_Exponent_Deep_Blue',
            url: 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/VIIRS_Angstrom_Exponent_Deep_Blue.xml'
          })
        } else {
          query.response([])
        }
      })

      const response = await getProjectionCapabilities('epsg4236')

      expect(response.statusCode).toEqual(200)

      expect(sqsColorMap).toBeCalledTimes(1)
      expect(sqsColorMap.mock.calls[0]).toEqual([expect.objectContaining({
        MessageBody: JSON.stringify({
          id: 1,
          product: 'VIIRS_Angstrom_Exponent_Deep_Blue',
          url: 'https://gibs.earthdata.nasa.gov/colormaps/v1.3/VIIRS_Angstrom_Exponent_Deep_Blue.xml'
        })
      })])

      expect(response).toEqual({
        statusCode: 200,
        body: JSON.stringify(['VIIRS_Angstrom_Exponent_Deep_Blue'])
      })
    })
  })

  test('responds correctly on http error', async () => {
    nock(/gibs/)
      .get(/epsg4236/)
      .reply(500, gibsError, { 'content-type': 'text/xml' })

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([])
      }
    })

    const sqsColorMap = jest.fn().mockReturnValue({
      promise: jest.fn().mockResolvedValue()
    })

    AWS.SQS = jest.fn()
      .mockImplementationOnce(() => ({
        sendMessage: sqsColorMap
      }))

    const response = await getProjectionCapabilities('epsg4236')

    expect(response.statusCode).toEqual(500)

    expect(sqsColorMap).toBeCalledTimes(0)

    const { body } = response
    const parsedBody = JSON.parse(body)
    const { errors } = parsedBody
    const [errorMessage] = errors

    expect(errorMessage).toEqual('Unrecognized request')
  })
})
