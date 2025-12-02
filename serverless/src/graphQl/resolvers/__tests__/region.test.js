import nock from 'nock'

import setupServer from './__mocks__/setupServer'

import REGIONS from '../../../../../static/src/js/operations/queries/regions'
import * as getEarthdataConfig from '../../../../../sharedUtils/config'

jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({ regionHost: 'http://region.com' }))

describe('Region Resolver', () => {
  describe('Query', () => {
    describe('regions', () => {
      describe('when the endpoint is region', () => {
        test('returns results', async () => {
          nock(/region/)
            .get(/region/)
            .reply(200, {
              status: '200 OK',
              hits: 1,
              time: '5.128 ms.',
              'search on': {
                parameter: 'region',
                exact: true
              },
              results: [{
                'Region Name': 'California Region',
                HUC: '18',
                'Visvalingam Polygon': '-121.63690052163548,43.34028642543558,-121.71937759754917,43.23098080164692'
              }]
            })

          const { contextValue, server } = setupServer({})

          const response = await server.executeOperation({
            query: REGIONS,
            variables: {
              endpoint: 'region',
              exact: true,
              keyword: 'California Region'
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            regions: {
              count: 1,
              keyword: 'California Region',
              regions: [{
                id: '18',
                name: 'California Region',
                spatial: '-121.63690052163548,43.34028642543558,-121.71937759754917,43.23098080164692',
                type: 'huc'
              }]
            }
          })
        })
      })

      describe('when the endpoint is river reach', () => {
        test('returns results', async () => {
          nock(/region/)
            .get(/rivers\/reach/)
            .reply(200, {
              status: '200 OK',
              time: '3.076 ms.',
              hits: 1,
              search_on: {
                parameter: 'reach',
                exact: true,
                page_number: 1,
                page_size: 100
              },
              results: [{
                reach_id: '11410000013',
                reach_len: 12342.2,
                n_nodes: 62,
                wse: 1.5,
                wse_var: 0.165342,
                width: 150,
                width_var: 3965.85,
                facc: 740597,
                n_chan_max: 1,
                n_chan_mod: 1,
                grod_id: 0,
                slope: 0.103454,
                dist_out: 12517.4,
                lakeflag: 2,
                type: 3,
                n_rch_up: '1',
                n_rch_dn: '1',
                river_name: 'Jubba River',
                geometry: 'LINESTRING (42.60693780875592 -0.2485374466218157, ',
                geojson: {
                  type: 'LineString',
                  coordinates: [[42.60693780875592, -0.2485374466218157]],
                  shp_origin: 'af_apriori_rivers_reaches_hb11_v08.shp',
                  netcdf_origin: 'af_apriori_rivers_v08.nc'
                }
              }]
            })

          const { contextValue, server } = setupServer({})

          const response = await server.executeOperation({
            query: REGIONS,
            variables: {
              endpoint: 'rivers/reach',
              exact: true,
              keyword: '11410000013'
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            regions: {
              count: 1,
              keyword: '11410000013',
              regions: [{
                id: '11410000013',
                name: 'Jubba River',
                spatial: '42.60693780875592,-0.2485374466218157',
                type: 'reach'
              }]
            }
          })
        })
      })

      describe('when the endpoint is huc', () => {
        test('returns results', async () => {
          nock(/region/)
            .get(/huc/)
            .reply(200, {
              status: '200 OK',
              hits: 1,
              time: '3.133 ms.',
              'search on': {
                parameter: 'HUC',
                exact: true
              },
              results: [{
                HUC: '1805000301',
                'Region Name': 'Upper Coyote Creek',
                'Visvalingam Polygon': '-121.71876769859176,37.348544156610956,-121.72219968921144,37.35039130244144'
              }]
            })

          const { contextValue, server } = setupServer({})

          const response = await server.executeOperation({
            query: REGIONS,
            variables: {
              endpoint: 'huc',
              exact: true,
              keyword: '1805000301'
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toBeUndefined()

          expect(data).toEqual({
            regions: {
              count: 1,
              keyword: '1805000301',
              regions: [{
                id: '1805000301',
                name: 'Upper Coyote Creek',
                spatial: '-121.71876769859176,37.348544156610956,-121.72219968921144,37.35039130244144',
                type: 'huc'
              }]
            }
          })
        })
      })

      describe('when the request returns a 404', () => {
        test('returns an error', async () => {
          nock(/region/)
            .get(/huc/)
            .reply(200, '<!doctype html><html><head><title>Page not found</title></head></html>', {
              'Content-Type': 'text/html'
            })

          const { contextValue, server } = setupServer({})

          const response = await server.executeOperation({
            query: REGIONS,
            variables: {
              endpoint: 'huc',
              exact: true,
              keyword: 'two'
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toEqual([{
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
            locations: expect.anything(),
            message: 'Error: 404: Results with the query two were not found.',
            path: ['regions']
          }])

          expect(data).toEqual({ regions: null })
        })
      })

      describe('when the request fails', () => {
        test('returns an error', async () => {
          nock(/region/)
            .get(/huc/)
            .reply(500)

          const { contextValue, server } = setupServer({})

          const response = await server.executeOperation({
            query: REGIONS,
            variables: {
              endpoint: 'huc',
              exact: true,
              keyword: 'two'
            }
          }, {
            contextValue
          })

          const { data, errors } = response.body.singleResult

          expect(errors).toEqual([{
            extensions: { code: 'INTERNAL_SERVER_ERROR' },
            locations: expect.anything(),
            message: 'AxiosError: Request failed with status code 500',
            path: ['regions']
          }])

          expect(data).toEqual({ regions: null })
        })
      })
    })
  })
})
