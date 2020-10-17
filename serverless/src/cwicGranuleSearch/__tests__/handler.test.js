import nock from 'nock'

import { cwicGranuleResponse, cwicGranuleTemplate } from './mocks'

import * as getCwicGranulesUrl from '../getCwicGranulesUrl'
import * as renderOpenSearchTemplate from '../renderOpenSearchTemplate'

import cwicGranuleSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('handler', () => {
  describe('when retrieving the granule url fails', () => {
    test('returns the error', async () => {
      jest.spyOn(getCwicGranulesUrl, 'getCwicGranulesUrl').mockImplementationOnce(() => (
        new Promise(resolve => resolve({
          statusCode: 400,
          errors: ['StatusCodeError (400): REQUEST_EXCEPTION: INVALID_DATASET - Unrecognized dataset']
        }))
      ))

      const event = {
        body: JSON.stringify({
          params: {
            echoCollectionId: 'C1597928934-SNOAA_NCEI'
          }
        })
      }

      const response = await cwicGranuleSearch(event)

      expect(response).toEqual({
        body: [
          'StatusCodeError (400): REQUEST_EXCEPTION: INVALID_DATASET - Unrecognized dataset'
        ],
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

  describe('when retrieving the granule url succeeds', () => {
    describe('success', () => {
      test('returns the granules', async () => {
        jest.spyOn(getCwicGranulesUrl, 'getCwicGranulesUrl').mockImplementationOnce(() => (
          new Promise(resolve => resolve({
            statusCode: 200,
            body: cwicGranuleTemplate
          }))
        ))

        jest.spyOn(renderOpenSearchTemplate, 'renderOpenSearchTemplate').mockImplementationOnce(() => 'https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&count=20&clientId=eed-edsc-dev')

        nock(/wgiss/)
          .get(/granules/)
          .reply(200, cwicGranuleResponse)

        const event = {
          body: JSON.stringify({
            params: {
              echoCollectionId: 'C1597928934-NOAA_NCEI'
            }
          })
        }

        const response = await cwicGranuleSearch(event)

        const {
          statusCode,
          body
        } = response

        expect(statusCode).toEqual(200)
        expect(body).toEqual(cwicGranuleResponse)
      })
    })

    describe('failure', () => {
      test('returns an error', async () => {
        jest.spyOn(getCwicGranulesUrl, 'getCwicGranulesUrl').mockImplementationOnce(() => (
          new Promise(resolve => resolve({
            statusCode: 200,
            body: cwicGranuleTemplate
          }))
        ))

        jest.spyOn(renderOpenSearchTemplate, 'renderOpenSearchTemplate').mockImplementationOnce(() => 'https://cwic.wgiss.ceos.org/opensearch/granules.atom?datasetId=C1597928934-NOAA_NCEI&count=20&clientId=eed-edsc-dev')

        nock(/wgiss/)
          .get(/granules/)
          .reply(200, cwicGranuleResponse)

        const event = {
          body: JSON.stringify({
            params: {
              echoCollectionId: 'C1597928934-NOAA_NCEI'
            }
          })
        }

        const response = await cwicGranuleSearch(event)

        const {
          statusCode,
          body
        } = response

        expect(statusCode).toEqual(200)
        expect(body).toEqual(cwicGranuleResponse)
      })
    })
  })
})
