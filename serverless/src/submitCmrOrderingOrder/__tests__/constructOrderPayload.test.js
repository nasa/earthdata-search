import nock from 'nock'

import * as getEarthdataConfig from '../../../../sharedUtils/config'

import { constructOrderPayload } from '../constructOrderPayload'

describe('constructOrderPayload', () => {
  beforeEach(() => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov'
    }))
  })

  test('constructs an order payload', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post('/search/granules.json')
      .reply(200, {
        feed: {
          entry: [{
            id: 'G10000005-EDSC',
            producer_granule_id: 'mock-producer-granule-id',
            title: 'mock-title'
          }]
        }
      })

    const collectionConceptId = 'C1000000-EDSC'

    const accessMethod = {
      model: '<mock>model</mock>',
      optionDefinition: {
        conceptId: 'OO100000-EDSC',
        name: 'EDSC_FTPPULL'
      }
    }

    const granuleParams = {
      collection_concept_id: 'C100000-EDSC'
    }

    const accessToken = 'access-token'
    const earthdataEnvironment = 'prod'

    const response = await constructOrderPayload({
      accessMethod,
      accessToken,
      collectionConceptId,
      earthdataEnvironment,
      granuleParams
    })

    expect(response).toEqual({
      collectionConceptId,
      optionSelection: {
        conceptId: 'OO100000-EDSC',
        content: '<mock>model</mock>',
        name: 'EDSC_FTPPULL'
      },
      orderItems: [{
        granuleConceptId: 'G10000005-EDSC',
        granuleUr: 'mock-title',
        producerGranuleId: 'mock-producer-granule-id'
      }],
      providerId: 'EDSC'
    })
  })

  test('constructs an order payload with added granule params', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post('/search/granules.json')
      .reply(200, {
        feed: {
          entry: [{
            id: 'G10000005-EDSC',
            producer_granule_id: 'mock-producer-granule-id',
            title: 'mock-title'
          }]
        }
      })

    const collectionConceptId = 'C1000000-EDSC'

    const accessMethod = {
      model: '<mock>model</mock>',
      optionDefinition: {
        conceptId: 'OO100000-EDSC',
        name: 'EDSC_FTPPULL'
      }
    }

    const granuleParams = {
      concept_id: ['G10000005-EDSC']
    }

    const accessToken = 'access-token'
    const earthdataEnvironment = 'prod'

    const response = await constructOrderPayload({
      accessMethod,
      accessToken,
      collectionConceptId,
      earthdataEnvironment,
      granuleParams
    })

    expect(response).toEqual({
      collectionConceptId,
      optionSelection: {
        conceptId: 'OO100000-EDSC',
        content: '<mock>model</mock>',
        name: 'EDSC_FTPPULL'
      },
      orderItems: [{
        granuleConceptId: 'G10000005-EDSC',
        granuleUr: 'mock-title',
        producerGranuleId: 'mock-producer-granule-id'
      }],
      providerId: 'EDSC'
    })
  })
})
