import { getDbConnection } from '../util/database/getDbConnection'
import { getApplicationConfig } from '../../../sharedUtils/config'
import { parseError } from '../../../sharedUtils/parseError'

/**
 * Sort the values for each key and pull out the top 5 values
 * @param {Object} entries Object containing all preference values for a key
 * @returns Returns the top 5 values with their counts
 */
const retrieveTop5Values = (entries) => {
  const sortedEntries = Object.entries(entries).sort((a, b) => b[1] - a[1])

  if (sortedEntries.length <= 5) {
    return sortedEntries
  }

  return sortedEntries.slice(0, 6)
}

/**
 * Retrieve all the preferences metrics for the authenticated user
 * @param {Object} event Details about the HTTP request that it received
 * @param {Object} context Methods and properties that provide information about the invocation, function, and execution environment
 */
const adminGetPreferencesMetrics = async (event, context) => {
  // https://stackoverflow.com/questions/49347210/why-aws-lambda-keeps-timing-out-when-using-knex-js
  context.callbackWaitsForEmptyEventLoop = false
  const { defaultResponseHeaders, env } = getApplicationConfig()

  try {
    // Retrieve a connection to the database
    const dbConnection = await getDbConnection()

    // `jsonExtract` parses fields in `jsonb` columns
    // https://knexjs.org/guide/query-builder.html#jsonextract
    // Fetch metrics on `retrieval_collections`
    const preferencesResponse = await dbConnection('users')
      .select('users.site_preferences')
      .where({ 'users.environment': env })

    const totalResponses = preferencesResponse.length

    const formattedPreferences = preferencesResponse.map((entry) => {
      const { site_preferences: sitePreferences } = entry

      if (Object.keys(sitePreferences).length === 0) {
        return {
          panelState: 'not set (open)',
          collectionListView: 'not set (default)',
          collectionSort: 'not set (-score)',
          granuleSort: 'not set (-start_date)',
          granuleListView: 'not set (default)',
          zoom: 'not set (2)',
          latitude: 'not set (0)',
          longitude: 'not set (0)',
          projection: 'not set (epsg4326)',
          overlayLayers: ['not set (referenceFeatures & referenceLabels)'],
          baseLayer: 'not set (blueMarble)'
        }
      }

      const {
        mapView,
        panelState,
        collectionListView,
        collectionSort,
        granuleSort,
        granuleListView
      } = sitePreferences

      const {
        zoom,
        latitude,
        longitude,
        projection,
        overlayLayers,
        baseLayer
      } = mapView

      return {
        panelState,
        collectionListView,
        collectionSort,
        granuleSort,
        granuleListView,
        zoom,
        latitude,
        longitude,
        projection,
        overlayLayers,
        baseLayer
      }
    })

    const valueDict = {
      panelState: {},
      granuleSort: {},
      granuleListView: {},
      collectionSort: {},
      collectionListView: {},
      zoom: {},
      latitude: {},
      longitude: {},
      projection: {},
      overlayLayers: {},
      baseLayer: {}
    }

    formattedPreferences.forEach((entry) => {
      Object.entries(entry).forEach(([key, value]) => {
        // This is to specifically account for Overlay Layers being a list of strings
        if (key === 'overlayLayers') {
          value.forEach((layer) => {
            if (layer in valueDict[key]) {
              valueDict[key][layer] += 1
            } else {
              valueDict[key][layer] = 1
            }
          })
        } else {
          const valStr = String(value)

          if (valStr in valueDict[key]) {
            valueDict[key][valStr] += 1
          } else {
            valueDict[key][valStr] = 1
          }
        }
      })
    })

    const top5PreferencesValues = {}

    Object.keys(valueDict).forEach((key) => {
      const top5Preferences = retrieveTop5Values(valueDict[key])

      top5PreferencesValues[key] = {}

      top5Preferences.forEach(([value, count]) => {
        top5PreferencesValues[key][value] = `${100 * (count / totalResponses)}%`
      })
    })

    return {
      isBase64Encoded: false,
      statusCode: 200,
      headers: defaultResponseHeaders,
      body: JSON.stringify({
        results: {
          preferences: top5PreferencesValues
        }
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

export default adminGetPreferencesMetrics
