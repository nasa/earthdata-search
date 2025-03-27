import spatialTypes from '../../../constants/spatialTypes'
import getQueryFromShapefileFeature from '../getQueryFromShapefileFeature'
import {
  spatialSearchMarkerStyle,
  spatialSearchStyle,
  unselectedShapefileMarkerStyle,
  unselectedShapefileStyle
} from '../styles'
import findShapefileFeature from './findShapefileFeature'

/**
 * Handle the click event on a shapefile feature
 * @param {Object} params
 * @param {Array} params.coordinate - The coordinate of the click
 * @param {Object} params.map - The OpenLayers map object
 * @param {Function} params.onChangeQuery - Callback to update the query
 * @param {Function} params.onUpdateShapefile - Callback to update the shapefile
 * @param {Object} params.shapefile - The current shapefile state
 * @param {Object} params.spatialDrawingSource - The source of the spatial drawing layer
 * @param {Object} params.spatialSearch - The current spatial search state
 */
const onClickShapefile = ({
  coordinate,
  map,
  onChangeQuery,
  onUpdateShapefile,
  shapefile,
  spatialDrawingSource,
  spatialSearch
}) => {
  const feature = findShapefileFeature({
    coordinate,
    map,
    source: spatialDrawingSource
  })

  if (!feature) return

  // Toggle the selected state of the feature
  const { geometryType, selected } = feature.getProperties()
  const newSelected = !selected
  feature.set('selected', newSelected)

  // Set the style of the feature
  let style
  if (geometryType === spatialTypes.POINT) {
    style = newSelected ? spatialSearchMarkerStyle : unselectedShapefileMarkerStyle
  } else {
    style = newSelected ? spatialSearchStyle : unselectedShapefileStyle
  }

  feature.setStyle(style)

  // Add the feature's geometry as the spatial query

  const edscId = feature.get('edscId')
  let query
  let selectedFeatures

  const { selectedFeatures: currentSelectedFeatures = [] } = shapefile

  const currentQuery = {
    boundingBox: spatialSearch.boundingBoxSearch,
    circle: spatialSearch.circleSearch,
    line: spatialSearch.lineSearch,
    point: spatialSearch.pointSearch,
    polygon: spatialSearch.polygonSearch
  }

  const newQuery = getQueryFromShapefileFeature(feature)
  const [queryType] = Object.keys(newQuery)
  const [queryValue] = newQuery[queryType]

  // If newSelected is true, add the spatial, else remove it
  if (newSelected) {
    // Add the queryValue to the existing spatial query
    const currentQueryValue = currentQuery[queryType]
    const updatedQueryValue = currentQueryValue
      ? currentQueryValue.concat(queryValue)
      : [queryValue]

    query = {
      ...currentQuery,
      [queryType]: updatedQueryValue
    }

    // Add the feature to the selectedFeatures
    selectedFeatures = currentSelectedFeatures.concat(edscId)
  } else {
    // Remove the feature from the existing spatial query
    const queryIndex = currentQuery[queryType].indexOf(queryValue)
    currentQuery[queryType].splice(queryIndex, 1)
    query = currentQuery

    // Remove the feature from the selectedFeatures
    const featuresIndex = currentSelectedFeatures.indexOf(edscId)
    currentSelectedFeatures.splice(featuresIndex, 1)
    selectedFeatures = currentSelectedFeatures
  }

  onChangeQuery({
    collection: {
      spatial: query
    }
  })

  onUpdateShapefile({ selectedFeatures })
}

export default onClickShapefile
