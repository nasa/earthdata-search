import request from 'request-promise'

import { Client } from '@googlemaps/google-maps-services-js'

import { buildParams } from '../util/cmr/buildParams'
import { doSearchRequest } from '../util/cmr/doSearchRequest'
import { getApplicationConfig, getEnvironmentConfig } from '../../../sharedUtils/config'
import { getJwtToken } from '../util/getJwtToken'
import { parseError } from '../util/parseError'

/**
 * Search the Google Maps API endpoint
 * @param {query} query The spatial query provided from the user
 */
const googleGeocode = async (query) => {
  const client = new Client({})

  const geocodeResult = await client
    .geocode({
      params: {
        address: query,
        key: process.env.GOOGLE_MAPS_API_KEY
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
  const { edscHost } = getEnvironmentConfig()
  const geocodeResult = await request.get({
    uri: 'https://nominatim.openstreetmap.org/search.php',
    qs: {
      format: 'json',
      polygon_geojson: 1,
      extratags: 1,
      dedupe: 1,
      q: query
    },
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

    return {
      name: displayName,
      point: [
        lat,
        lon
      ],
      bounding_box: boundingBox,
      polygon: geojson
    }
  })

  return formattedResult
}

/**
 * Geocode the user query based on the configured geocoding service
 * @param {query} query The spatial query provided from the user
 */
const geocode = (query) => {
  const geocodingService = process.env.GEOCODING_SERVICE

  console.log(`Geocoding '${query}' with ${geocodingService}`)

  if (geocodingService === 'google') {
    return googleGeocode(query)
  }

  if (geocodingService === 'nominatim') {
    return nominatimGeocode(query)
  }

  // Not setting a geocoding service should result in an
  // empty response by default
  throw new Error('Geocoder not supported')
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

    return doSearchRequest({
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
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default autocomplete
