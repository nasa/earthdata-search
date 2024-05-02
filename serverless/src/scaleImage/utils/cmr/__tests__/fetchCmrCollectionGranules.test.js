import nock from 'nock'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'
import * as getSystemToken from '../../../../util/urs/getSystemToken'
import { fetchCmrCollectionGranules } from '../fetchCmrCollectionGranules'

describe('fetchCmrCollectionGranules', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }
    process.env.IS_OFFLINE = false

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ cmrHost: 'https://example.com' }))
    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
  })

  afterEach(() => {
    jest.clearAllMocks()
    process.env = OLD_ENV
  })

  describe('fetchCmrCollectionGranules', () => {
    test('returns collection', async () => {
      jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
      const getSystemTokenMock = jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

      nock(/example/)
        .get(/search\/granules/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'G100000-EDSC'
            }]
          }
        })

      const response = await fetchCmrCollectionGranules('G100000-EDSC', 'prod')

      expect(getSystemTokenMock).toHaveBeenCalledTimes(1)
      expect(response).toEqual([{
        id: 'G100000-EDSC'
      }])
    })

    test('returns correctly when concept is not found', async () => {
      nock(/example/)
        .get(/search\/granules/)
        .reply(404, {
          errors: [
            'G100000-EDSC not found.'
          ]
        })

      const response = await fetchCmrCollectionGranules('G100000-EDSC')

      expect(response).toEqual({
        errors: [
          'G100000-EDSC not found.'
        ]
      })
    })

    test('returns correctly when an error occurs retrieving the concept', async () => {
      nock(/example/)
        .get(/search\/granules/)
        .reply(500, {
          errors: [
            'Unknown error.'
          ]
        })

      const response = await fetchCmrCollectionGranules('G100000-EDSC')

      expect(response).toEqual({
        errors: [
          'Unknown error.'
        ]
      })
    })

    describe('when using the ee param to query cmr in a different environment', () => {
      test('does not get the system token', async () => {
        const getSystemTokenMock = jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

        nock(/example/)
          .get(/search\/granules/)
          .reply(200, {
            feed: {
              entry: [{
                id: 'G100000-EDSC'
              }]
            }
          })

        const response = await fetchCmrCollectionGranules('G100000-EDSC', 'prod')

        expect(getSystemTokenMock).toHaveBeenCalledTimes(1)
        expect(response).toEqual([{
          id: 'G100000-EDSC'
        }])
      })
    })
  })
})
