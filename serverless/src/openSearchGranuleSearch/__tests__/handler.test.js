import nock from 'nock'

import {
  openSearchGranuleErrorResponse,
  openSearchGranuleResponse,
  openSearchOsddErrorResponse,
  openSearchOsddResponse
} from './mocks'

import openSearchGranuleSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('handler', () => {
  describe('when retrieving the collection url fails', () => {
    test('returns the error', async () => {
      nock(/cwic/)
        .get(/opensearch/)
        .reply(400, openSearchOsddErrorResponse, {
          'Content-Type': 'application/opensearchdescription+xml'
        })

      const event = {
        body: JSON.stringify({
          params: {
            echoCollectionId: 'C1597928934-NOAA_NCEI',
            openSearchOsdd: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
          }
        })
      }

      const response = await openSearchGranuleSearch(event)

      expect(response).toEqual({
        body: JSON.stringify({
          errors: ['REQUEST_EXCEPTION: INVALID_DATASET - Unrecognized dataset']
        }),
        headers: {
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/xml'
        },
        isBase64Encoded: false,
        statusCode: 400
      })
    })
  })

  describe('when retrieving the collection url succeeds', () => {
    describe('when retrieving the granules succeeds', () => {
      test('returns the granules', async () => {
        nock(/cwic/)
          .get(/opensearch\/datasets/)
          .reply(200, openSearchOsddResponse, {
            'Content-Type': 'application/opensearchdescription+xml'
          })

        nock(/cwic/)
          .get(/opensearch\/granules/)
          .reply(200, openSearchGranuleResponse, {
            'Content-Type': 'application/opensearchdescription+xml'
          })

        const event = {
          body: JSON.stringify({
            params: {
              echoCollectionId: 'C1597928934-NOAA_NCEI',
              openSearchOsdd: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
            }
          })
        }

        const response = await openSearchGranuleSearch(event)

        const {
          statusCode,
          body
        } = response

        expect(statusCode).toEqual(200)
        expect(body).toEqual(openSearchGranuleResponse)
      })
    })

    describe('when retrieving the granules fails', () => {
      test('returns an error', async () => {
        nock(/cwic/)
          .get(/opensearch\/datasets/)
          .reply(200, openSearchOsddResponse, {
            'Content-Type': 'application/opensearchdescription+xml'
          })

        nock(/cwic/)
          .get(/opensearch\/granules/)
          .reply(400, openSearchGranuleErrorResponse, {
            'Content-Type': 'application/opensearchdescription+xml'
          })

        const event = {
          body: JSON.stringify({
            params: {
              echoCollectionId: 'C1597928934-NOAA_NCEI',
              openSearchOsdd: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
            }
          })
        }

        const response = await openSearchGranuleSearch(event)

        const {
          statusCode,
          body
        } = response

        expect(statusCode).toEqual(400)
        expect(body).toEqual(JSON.stringify({
          statusCode: 400,
          errors: ['An error occurred searching granules: datasetName is required']
        }))
      })
    })
  })
})
