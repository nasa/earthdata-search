import FormData from 'formdata-node'
import GeoJSON from 'geojson'
import request from 'request-promise'

import { createReadStream, writeFileSync } from 'fs'

import { cmrUrl } from '../util/cmr/cmrUrl'
import { getClientId } from '../../../sharedUtils/getClientId'
import { parseError } from '../../../sharedUtils/parseError'
import { pointStringToLatLng } from './pointStringToLatLng'
import { bboxToPolygon } from './bboxToPolygon'
import { readCmrResults } from '../util/cmr/readCmrResults'
import { ccwShapefile } from './ccwShapefile'

/**
 * Construct the payload that we'll send to Harmony to create this order
 */
export const constructOrderPayload = async ({
  accessMethod,
  granuleParams,
  accessTokenWithClient,
  shapefile
}) => {
  // Request granules from CMR
  const granuleResponse = await request.get({
    uri: cmrUrl('search/granules.json', granuleParams),
    headers: {
      'Echo-Token': accessTokenWithClient,
      'Client-Id': getClientId().background
    },
    json: true,
    resolveWithFullResponse: true
  })

  const granuleResponseBody = readCmrResults('search/granules.json', granuleResponse)

  const granuleIds = granuleResponseBody.map(granuleMetadata => granuleMetadata.id).join(',')

  const {
    mbr,
    selectedOutputFormat,
    selectedOutputProjection,
    supportsBoundingBoxSubsetting,
    supportsShapefileSubsetting
  } = accessMethod

  // OGC uses duplicate parameter names for subsetting and the
  // standard javascript object will not support that so we need to use
  // the FormData object to avoid any language specific restrictions on
  // duplicate keys
  const orderPayload = new FormData()

  orderPayload.append('forceAsync', 'true')
  orderPayload.append('granuleId', granuleIds)

  const {
    bounding_box: boundingBox = [],
    circle = [],
    point = [],
    polygon = [],
    temporal
  } = granuleParams

  if (supportsShapefileSubsetting) {
    if (shapefile) {
      try {
        // GeoJSON polygon points must be in CCW order, so we need to make sure that is true before sending the shapefile
        writeFileSync('/tmp/shapefile.geojson', JSON.stringify(ccwShapefile(shapefile)))

        orderPayload.append('shapefile', createReadStream('/tmp/shapefile.geojson'), {
          filename: 'shapefile.geojson',
          contentType: 'application/geo+json'
        })
      } catch (e) {
        parseError(e, { reThrowError: true })
      }
    } else if (
      boundingBox.length > 0
      || circle.length > 0
      || point.length > 0
      || polygon.length > 0
    ) {
      // Append a summary to our shapefile to inform the recipient of the files origin
      const globalProperties = {
        summary: 'Shapefile created by Earthdata Search to support spatial subsetting when requesting data from Harmony.'
      }

      if (point.length > 0) {
        const constructedShapefile = GeoJSON.parse([pointStringToLatLng(point[0])], {
          Point: ['lat', 'lng'],
          extraGlobal: globalProperties
        })

        try {
          writeFileSync('/tmp/shapefile.geojson', JSON.stringify(constructedShapefile))

          orderPayload.append('shapefile', createReadStream('/tmp/shapefile.geojson'), {
            filename: 'point.geojson',
            contentType: 'application/geo+json'
          })
        } catch (e) {
          parseError(e, { reThrowError: true })
        }
      }

      // Only create a shapefile for bounding box if bounding box subsetting is not supported. Subsetting by bounding
      // should be more efficient all around and should be favored over a shapefile
      if (boundingBox.length > 0 && !supportsBoundingBoxSubsetting) {
        const constructedShapefile = GeoJSON.parse([{
          bbox: bboxToPolygon(pointStringToLatLng(boundingBox[0]))
        }], {
          Polygon: 'bbox',
          extraGlobal: globalProperties
        })

        try {
          writeFileSync('/tmp/shapefile.geojson', JSON.stringify(constructedShapefile))

          orderPayload.append('shapefile', createReadStream('/tmp/shapefile.geojson'), {
            filename: 'bbox.geojson',
            contentType: 'application/geo+json'
          })
        } catch (e) {
          parseError(e, { reThrowError: true })
        }
      }

      if (circle.length > 0) {
        const constructedShapefile = GeoJSON.parse([pointStringToLatLng(circle[0])], {
          Point: ['lat', 'lng'],
          include: ['radius'],
          extraGlobal: globalProperties
        })

        try {
          writeFileSync('/tmp/shapefile.geojson', JSON.stringify(constructedShapefile))

          orderPayload.append('shapefile', createReadStream('/tmp/shapefile.geojson'), {
            filename: 'circle.geojson',
            contentType: 'application/geo+json'
          })
        } catch (e) {
          parseError(e, { reThrowError: true })
        }
      }

      if (polygon.length > 0) {
        const constructedShapefile = GeoJSON.parse([{
          polygon: [pointStringToLatLng(polygon[0])]
        }], {
          Polygon: 'polygon',
          extraGlobal: globalProperties
        })

        try {
          writeFileSync('/tmp/shapefile.geojson', JSON.stringify(constructedShapefile))

          orderPayload.append('shapefile', createReadStream('/tmp/shapefile.geojson'), {
            filename: 'polygon.geojson',
            contentType: 'application/geo+json'
          })
        } catch (e) {
          parseError(e, { reThrowError: true })
        }
      }
    }
  }

  if (supportsBoundingBoxSubsetting) {
    if (boundingBox.length > 0) {
      const [swCoord, neCoord] = pointStringToLatLng(boundingBox[0])

      const [swLng, swLat] = swCoord
      const [neLng, neLat] = neCoord

      orderPayload.append('subset', `lat(${parseFloat(swLat)}:${parseFloat(neLat)})`)
      orderPayload.append('subset', `lon(${parseFloat(swLng)}:${parseFloat(neLng)})`)
    } else if (mbr) {
      const {
        swLat,
        swLng,
        neLat,
        neLng
      } = mbr

      orderPayload.append('subset', `lat(${parseFloat(swLat)}:${parseFloat(neLat)})`)
      orderPayload.append('subset', `lon(${parseFloat(swLng)}:${parseFloat(neLng)})`)
    }
  }

  if (temporal) {
    const [
      timeStart,
      timeEnd
    ] = temporal.split(',')

    orderPayload.append('subset', `time("${timeStart || '*'}":"${timeEnd || '*'}")`)
  }

  if (selectedOutputFormat) {
    orderPayload.append('format', selectedOutputFormat)
  }

  if (selectedOutputProjection) {
    orderPayload.append('outputCrs', selectedOutputProjection)
  }

  return orderPayload
}
