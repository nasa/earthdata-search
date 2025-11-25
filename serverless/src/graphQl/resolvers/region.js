import axios from 'axios'
import { uniq } from 'lodash-es'

import { getEarthdataConfig } from '../../../../sharedUtils/config'
import { requestTimeout } from '../../util/requestTimeout'
import { wrapAxios } from '../../util/wrapAxios'

const wrappedAxios = wrapAxios(axios)

export default {
  Query: {
    regions: async (parent, args, context) => {
      const { earthdataEnvironment } = context
      const {
        endpoint,
        exact,
        keyword
      } = args

      const { regionHost } = getEarthdataConfig(earthdataEnvironment)

      let regionResponse
      try {
        regionResponse = await wrappedAxios({
          method: 'get',
          url: `${regionHost}/${endpoint}/${keyword}`,
          params: {
            exact
          },
          timeout: requestTimeout()
        })

        const { config, data } = regionResponse
        const { elapsedTime } = config

        const contentType = regionResponse.headers?.['content-type'] || ''
        const responseBody = typeof regionResponse.data === 'string' ? regionResponse.data : ''
        if (
          regionResponse.status === 200
          && contentType.includes('text/html')
          && /page not found/i.test(responseBody)
        ) {
          throw new Error(`404: Results with the query ${keyword} were not found.`)
        }

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
          count: hits,
          keyword,
          regions: filteredResponse,
          time: parseFloat(responseTime)
        }
      } catch (error) {
        throw new Error(error)
      }
    }
  }
}
