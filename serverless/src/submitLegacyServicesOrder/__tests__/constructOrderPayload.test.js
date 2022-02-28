import nock from 'nock'

import * as getEarthdataConfig from '../../../../sharedUtils/config'

import { constructOrderPayload } from '../constructOrderPayload'

describe('constructOrderPayload', () => {
  beforeEach(() => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov',
      echoRestRoot: 'http://echorest.example.com'
    }))
  })

  test('constructs an order payload', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post('/search/granules.json')
      .reply(200, {
        feed: {
          entry: [{
            id: 'G10000005-EDSC'
          }]
        }
      })

    nock(/echorest/)
      .post(/order_information/)
      .reply(200, [{
        order_information: {
          catalog_item_ref: {
            id: 'G10000001-EDSC',
            location: 'http://cmr-search-prod.ngap.earthdata.nasa.gov:8080/search/concepts/G10000001-EDSC',
            name: 'G10000001-EDSC'
          },
          option_definition_refs: [{
            id: '2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
            location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/option_definitions/2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
            name: 'EDSC_FTPPULL'
          }],
          orderable: true,
          price: 0
        }
      }])

    const accessMethod = {
      option_definition: {
        id: '2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
        location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/option_definitions/2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
        name: 'EDSC_FTPPULL'
      }
    }

    const granuleParams = {
      collection_concept_id: 'C100000-EDSC'
    }

    const accessToken = 'access-token'
    const earthdataEnvironment = 'prod'

    const response = await constructOrderPayload(
      accessMethod,
      granuleParams,
      accessToken,
      earthdataEnvironment
    )

    expect(response).toEqual([{
      order_item: {
        catalog_item_id: 'G10000001-EDSC',
        option_selection: {
          content: undefined,
          id: '2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
          option_definition_name: 'EDSC_FTPPULL'
        },
        quantity: 1
      }
    }])
  })

  test('constructs an order payload with added granule params', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post('/search/granules.json')
      .reply(200, {
        feed: {
          entry: [{
            id: 'G10000005-EDSC'
          }]
        }
      })

    nock(/echorest/)
      .post(/order_information/)
      .reply(200, [{
        order_information: {
          catalog_item_ref: {
            id: 'G10000001-EDSC',
            location: 'http://cmr-search-prod.ngap.earthdata.nasa.gov:8080/search/concepts/G10000001-EDSC',
            name: 'G10000001-EDSC'
          },
          option_definition_refs: [{
            id: '2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
            location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/option_definitions/2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
            name: 'EDSC_FTPPULL'
          }],
          orderable: true,
          price: 0
        }
      }])

    const accessMethod = {
      option_definition: {
        id: '2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
        location: 'https://cmr.earthdata.nasa.gov:/legacy-services/rest/option_definitions/2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
        name: 'EDSC_FTPPULL'
      }
    }

    const granuleParams = {
      concept_id: ['G10000005-EDSC']
    }

    const accessToken = 'access-token'
    const earthdataEnvironment = 'prod'

    const response = await constructOrderPayload(
      accessMethod,
      granuleParams,
      accessToken,
      earthdataEnvironment
    )

    expect(response).toEqual([{
      order_item: {
        catalog_item_id: 'G10000001-EDSC',
        option_selection: {
          content: undefined,
          id: '2D86BAD0-9709-8CB9-CB0B-6A5ED894417A',
          option_definition_name: 'EDSC_FTPPULL'
        },
        quantity: 1
      }
    }])
  })
})
