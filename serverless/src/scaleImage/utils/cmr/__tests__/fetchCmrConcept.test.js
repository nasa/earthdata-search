import nock from 'nock'

import { fetchCmrConcept } from '../fetchCmrConcept'
import * as getEarthdataConfig from '../../../../../../sharedUtils/config'
import * as getSystemToken from '../../../../util/urs/getSystemToken'

describe('fetchCmrConcept', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.cmrRootUrl = 'http://example.com'
    process.env.cmrHost = 'http://example.com'

    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'http://example.com'
    }))

    jest.spyOn(getSystemToken, 'getSystemToken').mockImplementation(() => 'mocked-system-token')
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('fetchCmrConcept', () => {
    test('returns collection', async () => {
      nock(/example/)
        .get(/search\/concepts/)
        .reply(200, {
          id: 'C100000-EDSC'
        })

      const response = await fetchCmrConcept('C100000-EDSC')

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

      const response = await fetchCmrConcept('C100000-EDSC')

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

      const response = await fetchCmrConcept('C100000-EDSC')

      expect(response).toEqual(
        { errors: ['Unknown error.'] }
      )
    })
  })
})
