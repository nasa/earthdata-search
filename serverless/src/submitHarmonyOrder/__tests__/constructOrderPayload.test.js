import nock from 'nock'
import { ReadStream } from 'fs'

import * as getEarthdataConfig from '../../../../sharedUtils/config'

import { constructOrderPayload } from '../constructOrderPayload'
import { mockCcwShapefile } from './mocks'

describe('constructOrderPayload', () => {
  beforeEach(() => {
    jest.spyOn(getEarthdataConfig, 'getEarthdataConfig').mockImplementation(() => ({
      cmrHost: 'https://cmr.earthdata.nasa.gov'
    }))
  })

  describe('skipPreview', () => {
    test('returns skipPreview=true', async () => {
      nock(/cmr/)
        .matchHeader('Authorization', 'Bearer access-token')
        .get('/search/granules.json')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G10000001-EDSC'
            }, {
              id: 'G10000005-EDSC'
            }]
          }
        })

      const accessMethod = {
        selectedOutputFormat: 'image/png'
      }
      const granuleParams = {}
      const accessToken = 'access-token'

      const response = await constructOrderPayload({
        accessMethod,
        granuleParams,
        accessToken
      })

      expect(response.get('skipPreview')).toEqual('true')
    })
  })

  describe('format', () => {
    describe('with a known format', () => {
      test('constructs a payload with a format', async () => {
        nock(/cmr/)
          .matchHeader('Authorization', 'Bearer access-token')
          .get('/search/granules.json')
          .reply(200, {
            feed: {
              entry: [{
                id: 'G10000001-EDSC'
              }, {
                id: 'G10000005-EDSC'
              }]
            }
          })

        const accessMethod = {
          selectedOutputFormat: 'image/png'
        }
        const granuleParams = {}
        const accessToken = 'access-token'

        const response = await constructOrderPayload({
          accessMethod,
          granuleParams,
          accessToken
        })

        expect(response.get('format')).toEqual('image/png')
      })
    })

    describe('with an unknown format', () => {
      test('constructs a payload without a format', async () => {
        nock(/cmr/)
          .matchHeader('Authorization', 'Bearer access-token')
          .get('/search/granules.json')
          .reply(200, {
            feed: {
              entry: [{
                id: 'G10000001-EDSC'
              }, {
                id: 'G10000005-EDSC'
              }]
            }
          })

        const accessMethod = {}
        const granuleParams = {}
        const accessToken = 'access-token'

        const response = await constructOrderPayload({
          accessMethod,
          granuleParams,
          accessToken
        })

        expect(response.get('format')).toEqual(null)
      })
    })
  })

  describe('projection', () => {
    describe('with a known projection', () => {
      test('constructs a payload with a projection', async () => {
        nock(/cmr/)
          .matchHeader('Authorization', 'Bearer access-token')
          .get('/search/granules.json')
          .reply(200, {
            feed: {
              entry: [{
                id: 'G10000001-EDSC'
              }, {
                id: 'G10000005-EDSC'
              }]
            }
          })

        const accessMethod = {
          selectedOutputProjection: 'EPSG:4326'
        }
        const granuleParams = {}
        const accessToken = 'access-token'

        const response = await constructOrderPayload({
          accessMethod,
          granuleParams,
          accessToken
        })

        expect(response.get('outputCrs')).toEqual('EPSG:4326')
      })
    })
  })

  describe('granules', () => {
    test('constructs a payload with granule ids', async () => {
      nock(/cmr/)
        .matchHeader('Authorization', 'Bearer access-token')
        .get('/search/granules.json')
        .reply(200, {
          feed: {
            entry: [{
              id: 'G10000001-EDSC'
            }, {
              id: 'G10000005-EDSC'
            }]
          }
        })

      const accessMethod = {}
      const granuleParams = {}
      const accessToken = 'access-token'

      const response = await constructOrderPayload({
        accessMethod,
        granuleParams,
        accessToken
      })

      expect(response.get('granuleId')).toEqual('G10000001-EDSC,G10000005-EDSC')
    })
  })

  describe('temporal', () => {
    describe('when temporal subsetting is enabled', () => {
      describe('with a start and end date', () => {
        test('constructs a payload with a start and end subsetting', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?temporal=2020-01-01T01%3A36%3A52.273Z%2C2020-01-01T06%3A18%3A19.482Z')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            enableTemporalSubsetting: true
          }
          const granuleParams = {
            temporal: '2020-01-01T01:36:52.273Z,2020-01-01T06:18:19.482Z'
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.getAll('subset')).toEqual(['time("2020-01-01T01:36:52.273Z":"2020-01-01T06:18:19.482Z")'])
        })
      })

      describe('with only a start date', () => {
        test('constructs a payload with an open ended start date', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?temporal=2020-01-01T01%3A36%3A52.273Z%2C')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            enableTemporalSubsetting: true
          }
          const granuleParams = {
            temporal: '2020-01-01T01:36:52.273Z,'
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.getAll('subset')).toEqual(['time("2020-01-01T01:36:52.273Z":"*")'])
        })
      })

      describe('with only a end date', () => {
        test('constructs a payload with an open ended end date', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?temporal=%2C2020-01-01T06%3A18%3A19.482Z')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            enableTemporalSubsetting: true
          }
          const granuleParams = {
            temporal: ',2020-01-01T06:18:19.482Z'
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.getAll('subset')).toEqual(['time("*":"2020-01-01T06:18:19.482Z")'])
        })
      })
    })

    describe('when temporal subsetting is disabled', () => {
      describe('with a start and end date', () => {
        test('does not apply the temporal subset', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?temporal=2020-01-01T01%3A36%3A52.273Z%2C2020-01-01T06%3A18%3A19.482Z')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            enableTemporalSubsetting: false
          }
          const granuleParams = {
            temporal: '2020-01-01T01:36:52.273Z,2020-01-01T06:18:19.482Z'
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.getAll('subset')).toEqual([])
        })
      })
    })
  })

  describe('spatial', () => {
    describe('when shapefile subsetting is supported', () => {
      describe('with a shapefile', () => {
        test('constructs a payload with a shapefile', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            supportsShapefileSubsetting: true
          }
          const granuleParams = {}
          const accessToken = 'access-token'
          const shapefile = mockCcwShapefile

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken,
            shapefile
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })

      describe('with a point', () => {
        test('constructs a payload containing a shapefile representing the point', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?point%5B%5D=-77%2C%2034')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            supportsShapefileSubsetting: true
          }
          const granuleParams = {
            point: ['-77, 34']
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })

      describe('with a bounding box', () => {
        test('constructs a payload containing the bounding box', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?bounding_box%5B%5D=0%2C5%2C10%2C15')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            supportsShapefileSubsetting: true
          }
          const granuleParams = {
            bounding_box: ['0,5,10,15']
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })

      describe('with a circle', () => {
        test('constructs a payload containing a shapefile representing the circle', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?circle%5B%5D=-77%2C%2034%2C%2020000')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            supportsShapefileSubsetting: true
          }
          const granuleParams = {
            circle: ['-77, 34, 20000']
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })

      describe('with a polygon', () => {
        test('constructs a payload containing a shapefile representing the polygon', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?polygon%5B%5D=-29.8125%2C39.86484%2C-23.0625%2C-19.74405%2C15.75%2C20.745%2C-29.8125%2C39.86484')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            supportsShapefileSubsetting: true
          }
          const granuleParams = {
            polygon: ['-29.8125,39.86484,-23.0625,-19.74405,15.75,20.745,-29.8125,39.86484']
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })
    })

    describe('when only bounding subsetting is supported', () => {
      describe('with a point', () => {
        test('constructs a payload containing a bounding box representing the minimum bounding rectangle of the point', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?point%5B%5D=-77%2C%2034')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            mbr: {
              swLat: 33.99999999,
              swLng: -77.00000001,
              neLat: 34.00000001,
              neLng: -76.99999999
            },
            supportsBoundingBoxSubsetting: true
          }
          const granuleParams = {
            point: ['-77, 34']
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.getAll('subset')).toEqual([
            'lat(33.99999999:34.00000001)',
            'lon(-77.00000001:-76.99999999)'
          ])
        })
      })

      describe('with a bounding box', () => {
        test('constructs a payload containing the bounding box', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?bounding_box%5B%5D=5%2C0%2C15%2C10')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            supportsBoundingBoxSubsetting: true
          }
          const granuleParams = {
            bounding_box: ['5,0,15,10']
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.getAll('subset')).toEqual([
            'lat(0:10)',
            'lon(5:15)'
          ])
        })
      })

      describe('with a circle', () => {
        test('constructs a payload containing a bounding box representing the minimum bounding rectangle of the circle', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?circle%5B%5D=-77%2C%2034%2C%2020000')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            mbr: {
              swLat: 33.8203369445857,
              swLng: -77.21671280212378,
              neLat: 34.1796630554143,
              neLng: -76.78328719787622
            },
            supportsBoundingBoxSubsetting: true
          }
          const granuleParams = {
            circle: ['-77, 34, 20000']
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.getAll('subset')).toEqual([
            'lat(33.8203369445857:34.1796630554143)',
            'lon(-77.21671280212378:-76.78328719787622)'
          ])
        })
      })

      describe('with a polygon', () => {
        test('constructs a payload containing a bounding box representing the minimum bounding rectangle of the polygon', async () => {
          nock(/cmr/)
            .matchHeader('Authorization', 'Bearer access-token')
            .get('/search/granules.json?polygon%5B%5D=-29.8125%2C39.86484%2C-23.0625%2C-19.74405%2C15.75%2C20.745%2C-29.8125%2C39.86484')
            .reply(200, {
              feed: {
                entry: [{
                  id: 'G10000001-EDSC'
                }, {
                  id: 'G10000005-EDSC'
                }]
              }
            })

          const accessMethod = {
            mbr: {
              swLat: -19.744049999999977,
              swLng: -29.81249999999999,
              neLat: 39.864840000000015,
              neLng: 15.749999999999988
            },
            supportsBoundingBoxSubsetting: true
          }
          const granuleParams = {
            polygon: ['-29.8125,39.86484,-23.0625,-19.74405,15.75,20.745,-29.8125,39.86484']
          }
          const accessToken = 'access-token'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessToken
          })

          expect(response.getAll('subset')).toEqual([
            'lat(-19.744049999999977:39.864840000000015)',
            'lon(-29.81249999999999:15.749999999999988)'
          ])
        })
      })
    })
  })
})
