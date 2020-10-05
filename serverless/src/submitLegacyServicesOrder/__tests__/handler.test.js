import knex from 'knex'
import mockKnex from 'mock-knex'
import nock from 'nock'
import * as getDbConnection from '../../util/database/getDbConnection'
import * as getEdlConfig from '../../util/getEdlConfig'
import * as startOrderStatusUpdateWorkflow from '../../util/startOrderStatusUpdateWorkflow'
import { mockLegacyServicesOrder } from './mocks'
import submitLegacyServicesOrder from '../handler'

let dbTracker

beforeEach(() => {
  jest.clearAllMocks()

  jest.spyOn(getEdlConfig, 'getEdlConfig').mockImplementation(() => ({
    client: {
      id: 'clientId'
    }
  }))

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

describe('submitLegacyServicesOrder', () => {
  test('correctly discovers the correct fields from the provided xml', async () => {
    const startOrderStatusUpdateWorkflowMock = jest.spyOn(startOrderStatusUpdateWorkflow, 'startOrderStatusUpdateWorkflow')
      .mockImplementation(() => (jest.fn()))

    const accessMethodModel = '<ecs:options xmlns:ecs="http://ecs.nasa.gov/options"><ecs:distribution xmlns="http://ecs.nasa.gov/options"><ecs:mediatype><ecs:value>HTTPS</ecs:value></ecs:mediatype><ecs:mediaformat><ecs:ftppull-format><ecs:value>FILEFORMAT</ecs:value></ecs:ftppull-format><ecs:ftppush-format><ecs:value>FILEFORMAT</ecs:value></ecs:ftppush-format></ecs:mediaformat></ecs:distribution><ecs:ancillary xmlns="http://ecs.nasa.gov/options"><ecs:orderPH>false</ecs:orderPH><ecs:orderQA>false</ecs:orderQA><ecs:orderHDF_MAP>false</ecs:orderHDF_MAP><ecs:orderBrowse>false</ecs:orderBrowse></ecs:ancillary><ecs:esi-xml><!--NOTE: elements in caps losely match the ESI API, those in lowercase are helper elements --><!--Dataset ID will be injected by Reverb--><ecs:CLIENT>ESI</ecs:CLIENT><!--First SubsetAgent in the input capabilities XML is used as the default.--><ecs:SUBAGENT_ID><ecs:value>HEG</ecs:value></ecs:SUBAGENT_ID><!-- hardcode to async for Reverb services --><ecs:REQUEST_MODE>async</ecs:REQUEST_MODE><ecs:SPATIAL_MSG>Click the checkbox to enable spatial subsetting.</ecs:SPATIAL_MSG><ecs:PROJ_MSG_1>CAUTION: Re-projection parameters may alter results.</ecs:PROJ_MSG_1><ecs:PROJ_MSG_2>Leave blank to choose default values for each re-projected granule.</ecs:PROJ_MSG_2><ecs:INTRPL_MSG_1>Used to calculate data of resampled and reprojected pixels.</ecs:INTRPL_MSG_1><ecs:HEG-request><!--Need to populate BBOX in final ESI request as follows: "&BBOX=ullon,lrlat,lrlon,ullat"--><ecs:spatial_subsetting><ecs:boundingbox><ecs:ullat>90</ecs:ullat><ecs:ullon>-180</ecs:ullon><ecs:lrlat>-90</ecs:lrlat><ecs:lrlon>180</ecs:lrlon></ecs:boundingbox></ecs:spatial_subsetting><ecs:band_subsetting><ecs:SUBSET_DATA_LAYERS style="tree"><ecs:MI1B2E><ecs:dataset>/MI1B2E/BlueBand</ecs:dataset><ecs:dataset>/MI1B2E/BRF Conversion Factors</ecs:dataset><ecs:dataset>/MI1B2E/GeometricParameters</ecs:dataset><ecs:dataset>/MI1B2E/NIRBand</ecs:dataset><ecs:dataset>/MI1B2E/RedBand</ecs:dataset></ecs:MI1B2E></ecs:SUBSET_DATA_LAYERS></ecs:band_subsetting><!--First Format in the input XML is used as the default.--><ecs:FORMAT><ecs:value>HDF-EOS</ecs:value></ecs:FORMAT><!-- OUTPUT_GRID is never used in ESI (but should be enabled for SSW)--><!-- FILE_IDS must be injected by Reverb --><!-- FILE_URLS is not used in requests from ECHO, Use FILE_IDS instead --><ecs:projection_options><ecs:PROJECTION><ecs:value>LAMBERT AZIMUTHAL</ecs:value></ecs:PROJECTION><!--In final ESI request, projection parameters should be included as follows: "&PROJECTION_PARAMETERS=param1:value1,param2:value2,...paramn:valuen"--><ecs:PROJECTION_PARAMETERS><ecs:LAMBERT_AZIMUTHAL_projection><ecs:Sphere>45</ecs:Sphere><ecs:FE>54</ecs:FE></ecs:LAMBERT_AZIMUTHAL_projection></ecs:PROJECTION_PARAMETERS></ecs:projection_options><ecs:advanced_file_options><!--In final ESI request, resample options should be formatted like: "&RESAMPLE=dimension:value"--><ecs:RESAMPLE><ecs:GEOGRAPHIC-dimension><ecs:value>PERCENT</ecs:value></ecs:GEOGRAPHIC-dimension><ecs:UNIVERSAL_TRANSVERSE_MERCATOR-dimension><ecs:value>PERCENT</ecs:value></ecs:UNIVERSAL_TRANSVERSE_MERCATOR-dimension><ecs:STATE_PLANE-dimension><ecs:value>PERCENT</ecs:value></ecs:STATE_PLANE-dimension><ecs:ALBERS-dimension><ecs:value>PERCENT</ecs:value></ecs:ALBERS-dimension><ecs:LAMBERT_CONFORMAL_CONIC-dimension><ecs:value>PERCENT</ecs:value></ecs:LAMBERT_CONFORMAL_CONIC-dimension><ecs:MERCATOR-dimension><ecs:value>PERCENT</ecs:value></ecs:MERCATOR-dimension><ecs:POLAR_STEREOGRAPHIC-dimension><ecs:value>PERCENT</ecs:value></ecs:POLAR_STEREOGRAPHIC-dimension><ecs:TRANSVERSE_MERCATOR-dimension><ecs:value>PERCENT</ecs:value></ecs:TRANSVERSE_MERCATOR-dimension><ecs:LAMBERT_AZIMUTHAL-dimension><ecs:value>PERCENT</ecs:value></ecs:LAMBERT_AZIMUTHAL-dimension><ecs:SINUSOIDAL-dimension><ecs:value>PERCENT</ecs:value></ecs:SINUSOIDAL-dimension><ecs:CYLINDRICAL_EQUAL_AREA-dimension><ecs:value>PERCENT</ecs:value></ecs:CYLINDRICAL_EQUAL_AREA-dimension><ecs:NO_CHANGE-dimension><ecs:value>PERCENT</ecs:value></ecs:NO_CHANGE-dimension><ecs:NORTH_POLAR_STEREOGRAPHIC-dimension><ecs:value>PERCENT</ecs:value></ecs:NORTH_POLAR_STEREOGRAPHIC-dimension><ecs:SOUTH_POLAR_STEREOGRAPHIC-dimension><ecs:value>PERCENT</ecs:value></ecs:SOUTH_POLAR_STEREOGRAPHIC-dimension><ecs:UTM_NORTHERN_HEMISPHERE-dimension><ecs:value>PERCENT</ecs:value></ecs:UTM_NORTHERN_HEMISPHERE-dimension><ecs:UTM_SOUTHERN_HEMISPHERE-dimension><ecs:value>PERCENT</ecs:value></ecs:UTM_SOUTHERN_HEMISPHERE-dimension><ecs:GEOGRAPHIC-PERCENT-value>100</ecs:GEOGRAPHIC-PERCENT-value><ecs:UNIVERSAL_TRANSVERSE_MERCATOR-PERCENT-value>100</ecs:UNIVERSAL_TRANSVERSE_MERCATOR-PERCENT-value><ecs:STATE_PLANE-PERCENT-value>100</ecs:STATE_PLANE-PERCENT-value><ecs:ALBERS-PERCENT-value>100</ecs:ALBERS-PERCENT-value><ecs:LAMBERT_CONFORMAL_CONIC-PERCENT-value>100</ecs:LAMBERT_CONFORMAL_CONIC-PERCENT-value><ecs:MERCATOR-PERCENT-value>100</ecs:MERCATOR-PERCENT-value><ecs:POLAR_STEREOGRAPHIC-PERCENT-value>100</ecs:POLAR_STEREOGRAPHIC-PERCENT-value><ecs:TRANSVERSE_MERCATOR-PERCENT-value>100</ecs:TRANSVERSE_MERCATOR-PERCENT-value><ecs:LAMBERT_AZIMUTHAL-PERCENT-value>100</ecs:LAMBERT_AZIMUTHAL-PERCENT-value><ecs:SINUSOIDAL-PERCENT-value>100</ecs:SINUSOIDAL-PERCENT-value><ecs:CYLINDRICAL_EQUAL_AREA-PERCENT-value>100</ecs:CYLINDRICAL_EQUAL_AREA-PERCENT-value><ecs:NO_CHANGE-PERCENT-value>100</ecs:NO_CHANGE-PERCENT-value><ecs:NORTH_POLAR_STEREOGRAPHIC-PERCENT-value>100</ecs:NORTH_POLAR_STEREOGRAPHIC-PERCENT-value><ecs:SOUTH_POLAR_STEREOGRAPHIC-PERCENT-value>100</ecs:SOUTH_POLAR_STEREOGRAPHIC-PERCENT-value><ecs:UTM_NORTHERN_HEMISPHERE-PERCENT-value>100</ecs:UTM_NORTHERN_HEMISPHERE-PERCENT-value><ecs:UTM_SOUTHERN_HEMISPHERE-PERCENT-value>100</ecs:UTM_SOUTHERN_HEMISPHERE-PERCENT-value></ecs:RESAMPLE><ecs:INTERPOLATION><ecs:value>CC</ecs:value></ecs:INTERPOLATION><!--INCLUDE_META needs to be converted from true/false here to Y/N in the request.--><ecs:INCLUDE_META>true</ecs:INCLUDE_META></ecs:advanced_file_options><ecs:spatial_subset_flag>true</ecs:spatial_subset_flag><ecs:band_subset_flag>true</ecs:band_subset_flag><ecs:temporal_subset_flag>false</ecs:temporal_subset_flag></ecs:HEG-request></ecs:esi-xml></ecs:options>'
    const accessMethod = {
      option_definition: {
        id: '1234-asdf-5678-hjkl',
        name: 'Delivery Option'
      },
      type: 'ECHO ORDERS',
      model: accessMethodModel,
      url: 'https://n5eil09e.ecs.edsc.org/egi/request'
    }

    const echoProfile = {
      user_domain: 'OTHER',
      user_region: 'USA'
    }

    const ursProfile = {
      uid: 'edsc-user',
      country: 'United States',
      last_name: 'User',
      first_name: 'EDSC',
      email_address: 'edsc@search.earthdata.nasa.gov',
      organization: 'Earthdadta Search'
    }

    const contactInformation = {
      email: ursProfile.email_address,
      first_name: ursProfile.first_name,
      last_name: ursProfile.last_name,
      organization: ursProfile.organization,
      address: {
        country: ursProfile.country
      },
      phones: {
        0: {
          number: '0000000000',
          phone_number_type: 'BUSINESS'
        }
      },
      role: 'Order Contact'
    }

    nock(/cmr/)
      .post(/orders\.json/)
      .reply(201, {
        order: {
          id: '100005'
        }
      })

    nock(/cmr/)
      .get(/granules/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'G10000005-EDSC'
          }]
        }
      })

    nock(/cmr/)
      .post(/order_information/)
      .reply(200, [
        {
          order_information: {
            catalog_item_ref: {
              id: 'G10000005-EDSC'
            },
            option_definition_refs: [{
              id: '1234-asdf-5678-hjkl',
              name: 'Delivery Option'
            }],
            orderable: true,
            price: 0.0
          }
        }
      ])

    nock(/cmr/)
      .post(/orders\/100005\/order_items\/bulk_action/, [{
        order_item: {
          quantity: 1,
          catalog_item_id: 'G10000005-EDSC',
          option_selection: {
            id: '1234-asdf-5678-hjkl',
            option_definition_name: 'Delivery Option',
            content: accessMethodModel
          }
        }
      }])
      .reply(201)

    nock(/cmr/)
      .put(/orders\/100005\/user_information/, {
        user_information: {
          shipping_contact: contactInformation,
          billing_contact: contactInformation,
          order_contact: contactInformation,
          user_domain: 'OTHER',
          user_region: 'USA'
        }
      })
      .reply(201)

    nock(/cmr/)
      .post(/orders\/100005\/submit/)
      .reply(201)

    dbTracker.on('query', (query, step) => {
      if (step === 1) {
        query.response({
          id: 2,
          access_method: accessMethod,
          granule_params: {},
          echo_profile: echoProfile,
          urs_profile: ursProfile
        })
      } else if (step === 2) {
        query.response([])
      }
    })

    const context = {}
    await submitLegacyServicesOrder(mockLegacyServicesOrder, context)

    const { queries } = dbTracker.queries

    expect(queries[0].method).toEqual('first')
    expect(queries[1].method).toEqual('update')
    expect(startOrderStatusUpdateWorkflowMock).toBeCalledWith(12, 'access-token:clientId', 'ECHO ORDERS')
  })
})
