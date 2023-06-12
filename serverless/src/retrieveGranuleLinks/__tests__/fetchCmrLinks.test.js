import nock from 'nock'
import { fetchCmrLinks } from '../fetchCmrLinks'

describe('fetchCmrLinks', () => {
  test('returns a list of links from CMR', async () => {
    nock(/graphql/)
      .post(/api/)
      .reply(200, {
        data: {
          granules: {
            cursor: 'mock-cursor',
            items: [
              {
                links: [
                  {
                    rel: 'http://esipfed.org/ns/fedsearch/1.1/data#',
                    type: 'application/x-hdfeos',
                    title: 'This file may be downloaded directly from this link',
                    hreflang: 'en-US',
                    href: 'https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
                  },
                  {
                    rel: 'http://esipfed.org/ns/fedsearch/1.1/documentation#',
                    type: 'text/html',
                    title: 'This file may be accessed using OPeNDAP directly from this link (OPENDAP DATA)',
                    hreflang: 'en-US',
                    href: 'https://opendap.cr.usgs.gov/opendap/hyrax//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'
                  }
                ]
              }
            ]
          }
        }
      })

    const result = await fetchCmrLinks({
      collectionId: 'C1214470488-ASF',
      earthdataEnvironment: 'prod',
      granuleParams: {
        exclude: {},
        options: {},
        page_num: 1,
        temporal: '2023-03-26T15:05:48.871Z,2023-03-27T10:48:39.230Z',
        page_size: 20,
        concept_id: [],
        echo_collection_id: 'C1214470488-ASF',
        two_d_coordinate_system: {}
      },
      linkTypes: 'data,s3',
      requestId: '1234',
      token: 'mock-token'
    })

    expect(result).toEqual({
      cursor: 'mock-cursor',
      links: {
        browse: [],
        download: ['https://e4ftl01.cr.usgs.gov//MODV6_Dal_E/MOLT/MOD11A1.006/2000.02.24/MOD11A1.A2000055.h20v06.006.2015057071542.hdf'],
        s3: []
      }
    })
  })
})
