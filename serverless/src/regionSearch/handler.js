import axios from 'axios'

import { uniq } from 'lodash'

import { determineEarthdataEnvironment } from '../util/determineEarthdataEnvironment'
import { getEarthdataConfig, getApplicationConfig } from '../../../sharedUtils/config'
import { requestTimeout } from '../util/requestTimeout'
import { parseError } from '../../../sharedUtils/parseError'
import { wrapAxios } from '../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

const regionSearch = async (event) => {
  const { defaultResponseHeaders } = getApplicationConfig()

  const { headers, queryStringParameters } = event

  const earthdataEnvironment = determineEarthdataEnvironment(headers)

  const { endpoint, exact, query } = queryStringParameters

  const { regionHost } = getEarthdataConfig(earthdataEnvironment)

  let regionResponse
  try {
    regionResponse = await wrappedAxios({
      method: 'get',
      url: `${regionHost}/${endpoint}/${query}`,
      params: {
        exact
      },
      timeout: requestTimeout()
    })

    const { config, data } = regionResponse
    const { elapsedTime } = config

    const {
      hits,
      time,
      results = []
    } = data

    console.log(`Request for '${endpoint}' (exact: ${exact}) successfully completed in [reported: ${time}, observed: ${elapsedTime} ms]`)

    const filteredResponse = []

    results.forEach((result) => {
      let formattedResponseObject = {}

      const {
        HUC: huc,
        reach_id: reachId,
        'Region Name': name,
        river_name: riverName,
        'Visvalingam Polygon': visvalingamPolygon
      } = result

      let id = huc

      if (endpoint === 'region' || endpoint === 'huc') {
        formattedResponseObject = {
          id: huc,
          name,
          spatial: visvalingamPolygon,
          type: 'huc'
        }
      }

      if (endpoint === 'rivers/reach') {
        id = reachId

        const { geojson = {} } = result
        const { coordinates } = geojson

        formattedResponseObject = {
          id,
          name: riverName === 'NODATA' ? reachId : riverName,
          spatial: uniq(coordinates.map((point) => point.join(','))).join(','),
          type: 'reach'
        }
      }

      filteredResponse.push({
        id,
        ...formattedResponseObject
      })
    })

    // Convert the string provided to a float
    const [, responseTime] = time.match(/(\d+\.\d+) ms\./)

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        hits,
        time: parseFloat(responseTime),
        results: filteredResponse
      })
    }
  } catch (e) {
    return {
      isBase64Encoded: false,
      headers: defaultResponseHeaders,
      ...parseError(e)
    }
  }
}

export default regionSearch
