import nock from 'nock'

import {
  // cwicGranuleErrorResponse,
  cwicGranuleResponse,
  cwicOsddErrorResponse,
  cwicOsddResponse
} from './mocks'

// import * as getOpenSearchGranulesUrl from '../getOpenSearchGranulesUrl'
// import * as renderOpenSearchTemplate from '../renderOpenSearchTemplate'

import cwicGranuleSearch from '../handler'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('handler', () => {
  describe('when retrieving the collection url fails', () => {
    test('returns the error', async () => {
      // jest.spyOn(getOpenSearchGranulesUrl, 'getOpenSearchGranulesUrl').mockImplementationOnce(() => (
      //   new Promise(resolve => resolve({
      //     statusCode: 400,
      //     errors: ['Error (400): REQUEST_EXCEPTION: INVALID_DATASET - Unrecognized dataset']
      //   }))
      // ))

      nock(/cwic/)
        .get(/opensearch/)
        .reply(400, cwicOsddErrorResponse, {
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

      const response = await cwicGranuleSearch(event)

      expect(response).toEqual({
        body: [
          'REQUEST_EXCEPTION: INVALID_DATASET - Unrecognized dataset'
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

  describe('when retrieving the collection url succeeds', () => {
    describe('when retrieving the granule url succeeds', () => {
      test('returns the granules', async () => {
        nock(/cwic/)
          .get(/opensearch\/datasets/)
          .reply(200, cwicOsddResponse, {
            'Content-Type': 'application/opensearchdescription+xml'
          })

        nock(/cwic/)
          .get(/opensearch\/granules/)
          .reply(200, cwicGranuleResponse, {
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

        const response = await cwicGranuleSearch(event)

        const {
          statusCode,
          body
        } = response

        expect(statusCode).toEqual(200)
        expect(body).toEqual(cwicGranuleResponse)
      })
    })

    // describe('when retrieving the granule url fails', () => {
    //   test('returns an error', async () => {
    //     nock(/cwic/)
    //       .get(/opensearch\/datasets/)
    //       .reply(200, cwicOsddResponse, {
    //         'Content-Type': 'application/opensearchdescription+xml'
    //       })

    //     nock(/cwic/)
    //       .get(/opensearch\/granules/)
    //       .reply(400, cwicGranuleErrorResponse, {
    //         'Content-Type': 'application/opensearchdescription+xml'
    //       })

    //     const event = {
    //       body: JSON.stringify({
    //         params: {
    //           echoCollectionId: 'C1597928934-NOAA_NCEI',
    //           openSearchOsdd: 'https://cwic.wgiss.ceos.org/opensearch/datasets/C1597928934-NOAA_NCEI/osdd.xml?clientId=eed-edsc-dev'
    //         }
    //       })
    //     }

    //     const response = await cwicGranuleSearch(event)

    //     const {
    //       statusCode,
    //       body
    //     } = response

    //     expect(statusCode).toEqual(200)
    //     expect(body).toEqual(cwicGranuleResponse)
    //   })
    // })
  })
})
