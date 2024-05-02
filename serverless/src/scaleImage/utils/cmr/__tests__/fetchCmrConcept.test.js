import nock from 'nock'

import { fetchCmrConcept } from '../fetchCmrConcept'
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'
import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'
import * as getSystemToken from '../../../../util/urs/getSystemToken'

describe('fetchCmrConcept', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    process.env.cmrRootUrl = 'http://example.com'
    process.env.cmrHost = 'http://example.com'

    process.env.IS_OFFLINE = false

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'http://example.com'
    }))
  })

  afterEach(() => {
    jest.clearAllMocks()
    process.env = OLD_ENV
  })

  describe('fetchCmrConcept', () => {
    test('returns collection', async () => {
      jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

      const getSystemTokenMock = jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
      nock(/example/)
        .get(/search\/concepts/)
        .reply(200, {
          id: 'C100000-EDSC'
        })

      const response = await fetchCmrConcept('C100000-EDSC', 'prod')
      expect(getSystemTokenMock).toHaveBeenCalledTimes(1)

      expect(response).toEqual({
        id: 'C100000-EDSC'
      })
    })

    test('returns correctly when concept is not found', async () => {
      nock(/example/)
        .get(/search\/concepts/)
        .reply(404, {
          errors: [
            'C100000-EDSC not found.'
          ]
        })

      const response = await fetchCmrConcept('C100000-EDSC', 'prod')

      // Axios errors become wrapped
      expect(response).toEqual(
        { errors: ['C100000-EDSC not found.'] }
      )
    })

    test('returns correctly when an error occurs retrieving the concept', async () => {
      nock(/example/)
        .get(/search\/concepts/)
        .reply(500, {
          errors: [
            'Unknown error.'
          ]
        })

      const response = await fetchCmrConcept('C100000-EDSC', 'prod')

      expect(response).toEqual(
        { errors: ['Unknown error.'] }
      )
    })

    describe('when using the ee param to query cmr in a different environment', () => {
      test('does not get the system token', async () => {
        jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')

        const getSystemTokenMock = jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')

        nock(/example/)
          .get(/search\/concepts/)
          .reply(200, {
            id: 'C100000-EDSC'
          })

        // `ee` param is `sit`
        const response = await fetchCmrConcept('C100000-EDSC', 'sit')

        expect(getSystemTokenMock).toHaveBeenCalledTimes(0)
        expect(response).toEqual({
          id: 'C100000-EDSC'
        })
      })
    })
  })
})
