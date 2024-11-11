import FormData from 'formdata-node'
import GeoJSON from 'geojson'
import axios from 'axios'

import { createReadStream, writeFileSync } from 'fs'
import { stringify } from 'qs'

import { bboxToPolygon } from './bboxToPolygon'
import { ccwShapefile } from './ccwShapefile'
import { getApplicationConfig, getEarthdataConfig } from '../../../sharedUtils/config'
import { getClientId } from '../../../sharedUtils/getClientId'
import { obfuscateId } from '../util/obfuscation/obfuscateId'
import { parseError } from '../../../sharedUtils/parseError'
import { pointStringToLatLng } from './pointStringToLatLng'
import { readCmrResults } from '../util/cmr/readCmrResults'

/**
 * Construct the payload that we'll send to Harmony to create this order
 */
export const constructOrderPayload = async ({
  accessMethod,
  accessToken,
  environment,
  granuleParams,
  retrievalId,
  shapefile
}) => {
  // Request granules from CMR
  const granuleResponse = await axios({
    url: `${getEarthdataConfig(environment).cmrHost}/search/granules.json`,
    params: granuleParams,
    paramsSerializer: (params) => stringify(
      params,
      {
        indices: false,
        arrayFormat: 'brackets'
      }
    ),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Client-Id': getClientId().background
    }
  })

  const granuleResponseBody = readCmrResults('search/granules.json', granuleResponse)

  const granuleIds = granuleResponseBody.map((granuleMetadata) => granuleMetadata.id).join(',')

  const {
    enableTemporalSubsetting,
    enableSpatialSubsetting,
    enableConcatenateDownload,
    mbr,
    selectedOutputFormat,
    selectedOutputProjection,
    selectedVariableNames = [],
    supportsBoundingBoxSubsetting,
    supportsShapefileSubsetting,
    supportsConcatenation
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

  if (supportsShapefileSubsetting && enableSpatialSubsetting) {
    if (shapefile) {
      try {
        // GeoJSON polygon points must be in CCW order, so we need to make sure that is true before sending the shapefile
        writeFileSync('/tmp/shapefile.geojson', JSON.stringify(ccwShapefile(shapefile)))

        orderPayload.append('shapefile', createReadStream('/tmp/shapefile.geojson'), {
          filename: 'shapefile.geojson',
          contentType: 'application/geo+json'
        })
      } catch (error) {
        parseError(error, { reThrowError: true })
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
        } catch (error) {
          parseError(error, { reThrowError: true })
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
        } catch (error) {
          parseError(error, { reThrowError: true })
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
        } catch (error) {
          parseError(error, { reThrowError: true })
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
        } catch (error) {
          parseError(error, { reThrowError: true })
        }
      }
    }
  }

  if (supportsBoundingBoxSubsetting && enableSpatialSubsetting) {
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

  if (temporal && enableTemporalSubsetting) {
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

  // Adds supportsConcatenation to the payload and it's value
  if (supportsConcatenation) {
    orderPayload.append('concatenate', enableConcatenateDownload)
  }

  // Adds the selectedVariableNames if they were included in the access method
  if (selectedVariableNames.length > 0) {
    const selectedVariableNameFormElement = selectedVariableNames.join(',')
    orderPayload.append('variable', selectedVariableNameFormElement)
  }

  // EDSC-3440: Add skipPreview=true to all Harmony orders
  orderPayload.append('skipPreview', true)

  // Add label to identify EDSC orders in Harmony
  orderPayload.append('label', `eed-edsc-${getApplicationConfig().env},edsc-id=${obfuscateId(retrievalId)}`)

  return orderPayload
}
