import { projectionConfigs } from '../../../../static/src/js/util/map/crs'
import projectionCodes from '../../../../static/src/js/constants/projectionCodes'
import mapLayers from '../../../../static/src/js/constants/mapLayers'

/**
 * Sort the values for each key and pull out the top 5 values. A lot of the logic here
 * could be moved to the database layer to avoid pulling all the data into memory and doing
 * the analysis.
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

const formatAdminPreferencesMetrics = (data) => {
  const totalResponses = data.length

  const formattedPreferences = data.map((entry) => {
    const { site_preferences: sitePreferences } = entry

    const {
      mapView = {},
      panelState = 'not set (open)',
      collectionListView = 'not set (default)',
      collectionSort = 'not set (-score)',
      granuleSort = 'not set (-start_date)',
      granuleListView = 'not set (default)'
    } = sitePreferences

    const {
      zoom = `not set (${projectionConfigs[projectionCodes.geographic].zoom})`,
      latitude = 'not set (0)',
      longitude = 'not set (0)',
      projection = `not set (${projectionCodes.geographic})`,
      overlayLayers = [`not set (${mapLayers.bordersRoads} & ${mapLayers.placeLabels})`],
      baseLayer = `not set (${mapLayers.worldImagery})`
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

  // TODO Its probably not ideal to have this list hardcoded here
  const preferencesMap = {
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

  formattedPreferences.forEach((preference) => {
    Object.entries(preference).forEach(([preferenceKey, preferenceValue]) => {
      // This is to specifically account for Overlay Layers being a list of strings
      if (preferenceKey === 'overlayLayers') {
        preferenceValue.forEach((overlayLayer) => {
          if (overlayLayer in preferencesMap[preferenceKey]) {
            preferencesMap[preferenceKey][overlayLayer] += 1
          } else {
            preferencesMap[preferenceKey][overlayLayer] = 1
          }
        })
      } else {
        const valStr = String(preferenceValue)

        if (valStr in preferencesMap[preferenceKey]) {
          preferencesMap[preferenceKey][valStr] += 1
        } else {
          preferencesMap[preferenceKey][valStr] = 1
        }
      }
    })
  })

  const top5PreferencesValues = {}

  Object.keys(preferencesMap).forEach((preferenceKey) => {
    const top5Preferences = retrieveTop5Values(preferencesMap[preferenceKey])

    top5PreferencesValues[preferenceKey] = top5Preferences.map(([value, count]) => ({
      count: count.toString(),
      value: String(value),
      percentage: Number(100 * (count / totalResponses)).toPrecision(3)
    }))
  })

  return top5PreferencesValues
}

export default formatAdminPreferencesMetrics
