import GeoJSON from 'ol/format/GeoJSON'

import { crsProjections } from './crs'
import projections from './projections'

/**
 * Draws the outlines of the granules on the map with the `background` style applied
 * @param {Array} granulesMetadata Granule metadata to draw
 * @param {Object} vectorSource OL Vector Source to draw the granules on
 * @param {String} projectionCode Projection Code for the current map projection
 */
const drawGranuleBackgrounds = (granulesMetadata, vectorSource, projectionCode) => {
  if (!granulesMetadata.length) return

  granulesMetadata.forEach((granule, index) => {
    const {
      backgroundStyle,
      collectionId,
      formattedTemporal,
      granuleId,
      granuleStyle,
      highlightedStyle,
      spatial
    } = granule

    // If the granule has no spatial, return
    if (!spatial) return

    // Create a feature for the current granule based on the granule spatial
    const backgroundFeatures = new GeoJSON({
      dataProjection: crsProjections[projections.geographic],
      featureProjection: crsProjections[projectionCode]
    }).readFeatures(spatial)

    backgroundFeatures.forEach((backgroundFeature) => {
      // Set the index for the feature. This will be used to sort the features by the order we drew them
      backgroundFeature.set('index', index)

      // Save the collectionId and granuleId to the properties
      backgroundFeature.set('collectionId', collectionId)
      backgroundFeature.set('granuleId', granuleId)

      // Set the style for the granule in the properties. This will be read in the postrender event handler
      // to style the outline of the granule correctly.
      backgroundFeature.set('granuleStyle', granuleStyle)
      backgroundFeature.set('highlightedStyle', highlightedStyle)

      backgroundFeature.set('formattedTemporal', formattedTemporal)

      // Set the style for the feature
      backgroundFeature.setStyle(backgroundStyle)

      // Add the feature to the vector source
      vectorSource.addFeature(backgroundFeature)
    })
  })
}

export default drawGranuleBackgrounds
