import nock from 'nock'

import { fetchCmrCollectionGranules } from '../fetchCmrCollectionGranules'

describe('fetchCmrCollectionGranules', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    process.env = { ...OLD_ENV }

    delete process.env.NODE_ENV

    process.env.cmrRootUrl = 'http://example.com'
  })

  afterEach(() => {
    process.env = OLD_ENV
  })

  describe('fetchCmrCollectionGranules', () => {
    test('returns collection', async () => {
      nock(/example/)
        .get(/search\/granules/)
        .reply(200, {
          feed: {
            entry: [{
              id: 'C100000-EDSC'
            }]
          }
        })

      const response = await fetchCmrCollectionGranules('C100000-EDSC')

      expect(response).toEqual([{
        id: 'C100000-EDSC'
      }])
    })

    test('returns correctly when concept is not found', async () => {
      nock(/example/)
        .get(/search\/granules/)
        .reply(404, {
          errors: [
            'C100000-EDSC not found.'
          ]
        })

      const response = await fetchCmrCollectionGranules('C100000-EDSC')

      expect(response).toEqual({
        errors: [
          'Error: C100000-EDSC not found.'
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

      const response = await fetchCmrCollectionGranules('C100000-EDSC')

      expect(response).toEqual({
        errors: [
          'Error: Unknown error.'
        ]
      })
    })
  })
})
