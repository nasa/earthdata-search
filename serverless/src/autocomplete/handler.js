import request from 'request-promise'

import { Client } from '@googlemaps/google-maps-services-js'

import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig, getEnvironmentConfig } from '../../../sharedUtils/config'
import { getGoogleMapsApiKey } from '../util/google/getGoogleMapsApiKey'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Search the Google Maps API endpoint
 * @param {query} query The spatial query provided from the user
 */
const googleGeocode = async (query) => {
  const client = new Client({})

  // Retrieve the Google Maps API key
  const apiKey = await getGoogleMapsApiKey()

  const geocodeResult = await client
    .geocode({
      params: {
        address: query,
        key: apiKey
      }
    })

  const { data } = geocodeResult
  const { results } = data

  const formattedResult = results.map((place) => {
    const { geometry, formatted_address: formattedAddress } = place
    const { bounds, location } = geometry

    const { lat, lng } = location
    const spatialResponse = {
      point: [
        lat, lng
      ]
    }

    // If the results include a bounding box include it in the result
    if (bounds) {
      const { northeast, southwest } = bounds

      spatialResponse.bounding_box = [
        southwest.lng,
        southwest.lat,
        northeast.lng,
        northeast.lat
      ]
    }

    return {
      name: formattedAddress,
      ...spatialResponse
    }
  })

  return formattedResult
}

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

  const geocodeResult = await request.get({
    uri: 'https://nominatim.openstreetmap.org/search.php',
    qs: queryParams,
    headers: {
      Referer: edscHost
    },
    json: true,
    resolveWithFullResponse: true
  })

  const { body } = geocodeResult

  const formattedResult = body.map((place) => {
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
const geocode = (query) => {
  const { geocodingService } = process.env

  console.log(`Geocoding '${query}' with ${geocodingService}`)

  if (geocodingService === 'google') {
    return googleGeocode(query)
  }

  if (geocodingService === 'nominatim') {
    return nominatimGeocode(query)
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
  const { body } = event

  const { params, requestId } = JSON.parse(body)

  const { type, q } = params

  const { defaultResponseHeaders } = getApplicationConfig()

  const permittedCmrKeys = [
    'q',
    'type'
  ]

  const nonIndexedKeys = [
    'type'
  ]

  try {
    if (type === 'spatial') {
      const geocodeResult = await geocode(q, process.env.GEOCODE_SERVICE)

      return {
        isBase64Encoded: false,
        statusCode: 200,
        headers: defaultResponseHeaders,
        body: JSON.stringify(geocodeResult)
      }
    }

    const results = await doSearchRequest({
      jwtToken: getJwtToken(event),
      method: 'get',
      bodyType: 'json',
      path: '/search/autocomplete',
      params: buildParams({
        body,
        permittedCmrKeys,
        nonIndexedKeys,
        stringifyResult: false
      }),
      requestId
    })

    console.log(`Autocomplete Params: ${JSON.stringify(params)}, Results: ${results.body}`)

    return results
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default autocomplete
