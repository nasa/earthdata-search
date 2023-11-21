import axios from 'axios'

import { buildParams } from '../util/cmr/buildParams'
import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig, getEnvironmentConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Search the Nominatim OpenStreetMaps API endpoint
 * @param {query} query The spatial query provided from the user
 */
const nominatimGeocode = async (query) => {
  // Nominatim terms require that we provide a referrer
  const { edscHost } = getEnvironmentConfig()

  const { geocodingIncludePolygons } = process.env

  // Default query parameters
  const queryParams = {
    format: 'json',
    extratags: 1,
    dedupe: 1,
    q: query
  }

  // Only request geojson if polygons are enabled
  if (geocodingIncludePolygons === 'true') {
    queryParams.polygon_geojson = 1
  }

  const geocodeResult = await axios.get('https://nominatim.openstreetmap.org/search.php', {
    params: queryParams,
    headers: {
      Referer: edscHost
    }
  })

  const { data } = geocodeResult

  const formattedResult = data.map((place) => {
    const {
      boundingbox,
      display_name: displayName,
      geojson,
      lat,
      lon
    } = place

    const boundingBox = [
      parseFloat(boundingbox[2]),
      parseFloat(boundingbox[0]),
      parseFloat(boundingbox[3]),
      parseFloat(boundingbox[1])
    ]

    const spatialResponse = {
      name: displayName,
      point: [
        lat,
        lon
      ],
      bounding_box: boundingBox
    }

    // If geojson was returned, return it as 'polygon'
    if (geojson) {
      spatialResponse.polygon = geojson
    }

    return spatialResponse
  })

  return formattedResult
}

/**
 * Geocode the user query based on the configured geocoding service
 * @param {query} query The spatial query provided from the user
 */
const geocode = (query, earthdataEnvironment) => {
  const { geocodingService } = process.env

  console.log(`Geocoding '${query}' with ${geocodingService}`)

  if (geocodingService === 'nominatim') {
    return nominatimGeocode(query, earthdataEnvironment)
  }

  // Not setting a geocoding service should result in an
  // empty response by default
  throw new Error(`Geocoder (${geocodingService}) not supported`)
}

/**
 * Perform a search across all endpoints for autocompletion
 * @param {Object} event Details about the HTTP request that it received
 */
const autocomplete = async (event) => {
  const { body, headers } = event

  const { params, requestId } = JSON.parse(body)

  const { defaultResponseHeaders } = getApplicationConfig()

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const permittedCmrKeys = [
    'q',
    'type'
  ]

  const nonIndexedKeys = [
    'type'
  ]

  try {
    const results = await doSearchRequest({
      jwtToken: getJwtToken(event),
      method: 'get',
      path: '/search/autocomplete',
      params: buildParams({
        body,
        permittedCmrKeys,
        nonIndexedKeys,
        stringifyResult: false
      }),
      requestId,
      earthdataEnvironment
    })

    console.log(`Autocomplete Params: ${JSON.stringify(params)}, Results: ${results.body}`)

    return results
  } catch (error) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(error)
    }
  }
}

export default autocomplete
