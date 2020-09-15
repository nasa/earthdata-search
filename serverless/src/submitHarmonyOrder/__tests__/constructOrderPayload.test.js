import nock from 'nock'
import { ReadStream } from 'fs'

import { constructOrderPayload } from '../constructOrderPayload'

describe('constructOrderPayload', () => {
  describe('format', () => {
    describe('with a known format', () => {
      test('constructs a payload with a format', async () => {
        nock(/cmr/)
          .get(/search\/granules/)
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
        const accessTokenWithClient = ''

        const response = await constructOrderPayload({
          accessMethod,
          granuleParams,
          accessTokenWithClient
        })

        expect(response.get('format')).toEqual('image/png')
      })
    })

    describe('with an unknown format', () => {
      test('constructs a payload without a format', async () => {
        nock(/cmr/)
          .get(/search\/granules/)
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
        const accessTokenWithClient = ''

        const response = await constructOrderPayload({
          accessMethod,
          granuleParams,
          accessTokenWithClient
        })

        expect(response.get('format')).toEqual(null)
      })
    })
  })

  describe('projection', () => {
    describe('with a known projection', () => {
      test('constructs a payload with a projection', async () => {
        nock(/cmr/)
          .get(/search\/granules/)
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
        const accessTokenWithClient = ''

        const response = await constructOrderPayload({
          accessMethod,
          granuleParams,
          accessTokenWithClient
        })

        expect(response.get('outputCrs')).toEqual('EPSG:4326')
      })
    })
  })

  describe('temporal', () => {
    describe('with a start and end date', () => {
      test('constructs a payload with a start and end subsetting', async () => {
        nock(/cmr/)
          .get(/search\/granules/)
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
        const granuleParams = {
          temporal: '2020-01-01T01:36:52.273Z,2020-01-01T06:18:19.482Z'
        }
        const accessTokenWithClient = ''

        const response = await constructOrderPayload({
          accessMethod,
          granuleParams,
          accessTokenWithClient
        })

        expect(response.getAll('subset')).toEqual(['time("2020-01-01T01:36:52.273Z":"2020-01-01T06:18:19.482Z")'])
      })
    })

    describe('with only a start date', () => {
      test('constructs a payload with an open ended start date', async () => {
        nock(/cmr/)
          .get(/search\/granules/)
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
        const granuleParams = {
          temporal: '2020-01-01T01:36:52.273Z,'
        }
        const accessTokenWithClient = ''

        const response = await constructOrderPayload({
          accessMethod,
          granuleParams,
          accessTokenWithClient
        })

        expect(response.getAll('subset')).toEqual(['time("2020-01-01T01:36:52.273Z":"*")'])
      })
    })

    describe('with only a end date', () => {
      test('constructs a payload with an open ended end date', async () => {
        nock(/cmr/)
          .get(/search\/granules/)
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
        const granuleParams = {
          temporal: ',2020-01-01T06:18:19.482Z'
        }
        const accessTokenWithClient = ''

        const response = await constructOrderPayload({
          accessMethod,
          granuleParams,
          accessTokenWithClient
        })

        expect(response.getAll('subset')).toEqual(['time("*":"2020-01-01T06:18:19.482Z")'])
      })
    })
  })

  describe('spatial', () => {
    describe('when shapefile subsetting is supported', () => {
      describe('with a shapefile', () => {
        test('constructs a payload with a shapefile', async () => {
          nock(/cmr/)
            .get(/search\/granules/)
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
          const accessTokenWithClient = ''
          const shapefile = '{}'

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessTokenWithClient,
            shapefile
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })

      describe('with a point', () => {
        test('constructs a payload containing a shapefile representing the point', async () => {
          nock(/cmr/)
            .get(/search\/granules/)
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
          const accessTokenWithClient = ''

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessTokenWithClient
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })

      describe('with a bounding box', () => {
        test('constructs a payload containing the bounding box', async () => {
          nock(/cmr/)
            .get(/search\/granules/)
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
          const accessTokenWithClient = ''

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessTokenWithClient
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })

      describe('with a circle', () => {
        test('constructs a payload containing a shapefile representing the circle', async () => {
          nock(/cmr/)
            .get(/search\/granules/)
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
          const accessTokenWithClient = ''

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessTokenWithClient
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })

      describe('with a polygon', () => {
        test('constructs a payload containing a shapefile representing the polygon', async () => {
          nock(/cmr/)
            .get(/search\/granules/)
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
          const accessTokenWithClient = ''

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessTokenWithClient
          })

          expect(response.get('shapefile')).toBeInstanceOf(ReadStream)
        })
      })
    })

    describe('when only bounding subsetting is supported', () => {
      describe('with a point', () => {
        test('constructs a payload containing a bounding box representing the minimum bounding rectangle of the point', async () => {
          nock(/cmr/)
            .get(/search\/granules/)
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
          const accessTokenWithClient = ''

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessTokenWithClient
          })

          expect(response.getAll('subset')).toEqual([
            'lat(33.99999999:34.00000001)',
            'lon(-76.99999999:-77.00000001)'
          ])
        })
      })

      describe('with a bounding box', () => {
        test('constructs a payload containing the bounding box', async () => {
          nock(/cmr/)
            .get(/search\/granules/)
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
            bounding_box: ['0,5,10,15']
          }
          const accessTokenWithClient = ''

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessTokenWithClient
          })

          expect(response.getAll('subset')).toEqual([
            'lat(15:5)',
            'lon(0:10)'
          ])
        })
      })

      describe('with a circle', () => {
        test('constructs a payload containing a bounding box representing the minimum bounding rectangle of the circle', async () => {
          nock(/cmr/)
            .get(/search\/granules/)
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
          const accessTokenWithClient = ''

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessTokenWithClient
          })

          expect(response.getAll('subset')).toEqual([
            'lat(33.8203369445857:34.1796630554143)',
            'lon(-76.78328719787622:-77.21671280212378)'
          ])
        })
      })

      describe('with a polygon', () => {
        test('constructs a payload containing a bounding box representing the minimum bounding rectangle of the polygon', async () => {
          nock(/cmr/)
            .get(/search\/granules/)
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
          const accessTokenWithClient = ''

          const response = await constructOrderPayload({
            accessMethod,
            granuleParams,
            accessTokenWithClient
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
