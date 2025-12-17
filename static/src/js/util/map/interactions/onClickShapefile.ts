import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'

import spatialTypes from '../../../constants/spatialTypes'
import {
  spatialSearchMarkerStyle,
  spatialSearchStyle,
  unselectedShapefileMarkerStyle,
  unselectedShapefileStyle
} from '../styles'
import findShapefileFeature from './findShapefileFeature'
import { Query } from '../../../types/sharedTypes'
import { ShapefileSlice } from '../../../zustand/types'

/**
 * Handle the click event on a shapefile feature
 * @param {Object} params
 * @param {Array} params.coordinate - The coordinate of the click
 * @param {Object} params.map - The OpenLayers map object
 * @param {Function} params.onChangeQuery - Callback to update the query
 * @param {Function} params.onUpdateShapefile - Callback to update the shapefile
 * @param {Object} params.shapefile - The current shapefile state
 * @param {Object} params.spatialDrawingSource - The source of the spatial drawing layer
 */
const onClickShapefile = ({
  coordinate,
  map,
  onChangeQuery,
  onUpdateShapefile,
  shapefile,
  spatialDrawingSource
}: {
  /** The coordinate of the click */
  coordinate: number[]
  /** The map */
  map: Map
  /** Function to update the query */
  onChangeQuery: (query: Query) => void
  /** Function to update the shapefile */
  onUpdateShapefile: ShapefileSlice['shapefile']['updateShapefile']
  /** The current shapefile state */
  shapefile: ShapefileSlice['shapefile']
  /** The source of the spatial drawing layer */
  spatialDrawingSource: VectorSource
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
  if (geometryType === spatialTypes.POINT || geometryType === spatialTypes.MULTI_POINT) {
    style = newSelected ? spatialSearchMarkerStyle : unselectedShapefileMarkerStyle
  } else {
    style = newSelected ? spatialSearchStyle : unselectedShapefileStyle
  }

  feature.setStyle(style)

  const edscId = feature.get('edscId')
  let selectedFeatures

  const { selectedFeatures: currentSelectedFeatures = [] } = shapefile
  const updatedSelectedFeatures = [...currentSelectedFeatures]

  // If newSelected is true, add the feature to the selectedFeatures array
  if (newSelected) {
    selectedFeatures = updatedSelectedFeatures.concat(edscId)
  } else {
    // If newSelected is false, remove the feature from the selectedFeatures array
    const featuresIndex = updatedSelectedFeatures.indexOf(edscId)
    updatedSelectedFeatures.splice(featuresIndex, 1)
    selectedFeatures = updatedSelectedFeatures
  }

  // Create a new FeatureCollection from the selectedFeatures
  const features = spatialDrawingSource.getFeatures()
  const selectedFeaturesList = features.filter((featureItem) => {
    const featureEdscId = featureItem.get('edscId')

    return selectedFeatures.includes(featureEdscId)
  })

  const selectedFeatureCollection = new GeoJSON().writeFeaturesObject(selectedFeaturesList, {
    rightHanded: true
  })

  // Update the query with the new spatial
  onChangeQuery({
    collection: {
      spatial: {
        shapefile: selectedFeaturesList.length > 0 ? selectedFeatureCollection : undefined
      }
    }
  })

  onUpdateShapefile({ selectedFeatures })
}

export default onClickShapefile
