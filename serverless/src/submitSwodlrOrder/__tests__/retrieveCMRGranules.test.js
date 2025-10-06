import nock from 'nock'
import { parse as parseQueryString } from 'qs'

import * as getEarthdataConfig from '../../../../sharedUtils/config'

import { retrieveCMRGranules } from '../retrieveCMRGranules'

describe('retrieveCMRGranules', () => {
  beforeAll(() => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov'
    }))
  })

  test('retrieve cmr granules', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post(/search\/granules.json/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'G2938391118-POCLOUD',
            title: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_087F_20240414T225546_20240414T225558_PIC0_01'
          }, {
            id: 'G2938390924-POCLOUD',
            title: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_086F_20240414T225526_20240414T225547_PIC0_01'
          }
          ]
        }
      })

    const collectionConceptId = 'C2799438271-POCLOUD'

    const granuleParams = {
      collection_concept_id: collectionConceptId
    }

    const accessToken = 'access-token'
    const earthdataEnvironment = 'prod'

    const response = await retrieveCMRGranules({
      collectionConceptId,
      earthdataEnvironment,
      accessToken,
      granuleParams
    })

    expect(response).toEqual({
      collectionConceptId,
      orderItems: [{
        granuleConceptId: 'G2938391118-POCLOUD',
        granuleUr: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_087F_20240414T225546_20240414T225558_PIC0_01'
      },
      {
        granuleConceptId: 'G2938390924-POCLOUD',
        granuleUr: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_086F_20240414T225526_20240414T225547_PIC0_01'
      }
      ]
    })
  })

  test('retrieves the granules with the added granule params', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post(/search\/granules.json/)
      .reply(200, {
        feed: {
          entry: [{
            id: 'G2938391118-POCLOUD',
            title: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_087F_20240414T225546_20240414T225558_PIC0_01'
          }, {
            id: 'G2938390924-POCLOUD',
            title: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_086F_20240414T225526_20240414T225547_PIC0_01'
          }
          ]
        }
      })

    const collectionConceptId = 'C2799438271-POCLOUD'

    const granuleParams = {
      exclude: {},
      options: {},
      page_num: 1,
      sort_key: '-start_date',
      swodlrData: {
        params: {
          rasterResolution: 6,
          outputSamplingGridType: 'GEO',
          outputGranuleExtentFlag: false
        },
        custom_params: {
          'G2938391118-POCLOUD': {
            utmZoneAdjust: null,
            mgrsBandAdjust: null
          },
          'G2938390924-POCLOUD': {
            utmZoneAdjust: null,
            mgrsBandAdjust: null
          }
        }
      },
      page_size: 2000,
      concept_id: [
        'G2938390910-POCLOUD',
        'G2938390924-POCLOUD'
      ],
      echo_collection_id: 'C2799438271-POCLOUD',
      two_d_coordinate_system: {}
    }

    const accessToken = 'access-token'
    const earthdataEnvironment = 'prod'

    const response = await retrieveCMRGranules({
      accessToken,
      collectionConceptId,
      earthdataEnvironment,
      granuleParams
    })

    expect(response).toEqual({
      collectionConceptId,
      orderItems: [{
        granuleConceptId: 'G2938391118-POCLOUD',
        granuleUr: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_087F_20240414T225546_20240414T225558_PIC0_01'
      },
      {
        granuleConceptId: 'G2938390924-POCLOUD',
        granuleUr: 'SWOT_L2_HR_Raster_250m_UTM34L_N_x_x_x_013_514_086F_20240414T225526_20240414T225547_PIC0_01'
      }
      ]
    })
  })

  test('sends all params to CMR', async () => {
    nock(/cmr/)
      .matchHeader('Authorization', 'Bearer access-token')
      .post('/search/granules.json', (body) => {
        const params = parseQueryString(body)

        // Verify params are sent
        expect(params.echo_collection_id).toBe('C2799438271-POCLOUD')
        expect(params.readable_granule_name).toEqual(['*_011_424_027*'])
        expect(params.page_num).toBe('1')

        return true
      })
      .reply(200, {
        feed: {
          entry: [{
            id: 'G1-EDSC',
            title: 'Granule 1'
          }]
        }
      })

    await retrieveCMRGranules({
      collectionConceptId: 'C2799438271-POCLOUD',
      earthdataEnvironment: 'prod',
      accessToken: 'access-token',
      granuleParams: {
        concept_id: [],
        echo_collection_id: 'C2799438271-POCLOUD',
        readable_granule_name: ['*_011_424_027*'],
        page_num: 1
      }
    })
  })
})
