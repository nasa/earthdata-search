import { Feature } from 'ol'

import { eventEmitter } from '../../../events/events'

let highlightedGranuleFeature

// Remove the highlighted feature from the vector source
export const unhighlightFeature = (granuleHighlightsSource) => {
  if (!highlightedGranuleFeature) return

  const { collectionId } = highlightedGranuleFeature.getProperties()

  // Remove the highlighted feature from the vector source
  granuleHighlightsSource.removeFeature(highlightedGranuleFeature)
  highlightedGranuleFeature = null

  // Fire the event to unhighlight the granule in the granule list
  eventEmitter.emit(`map.layer.${collectionId}.hoverGranule`, { granule: null })
}

// Highlighted granules are shown when a user hovers over the granule in the results list, or
// when a user hovers over the granule outline on the map
export const highlightFeature = ({
  coordinate,
  granuleBackgroundsSource,
  granuleHighlightsSource,
  granuleId
}) => {
  let featureToHighlight

  if (coordinate) {
    // Find the first feature at the coordinate, this will be the top granule
    const features = granuleBackgroundsSource.getFeaturesAtCoordinate(coordinate);
    [featureToHighlight] = features
  } else if (granuleId) {
    // Find the feature with the granuleId
    const features = granuleBackgroundsSource.getFeatures()
    featureToHighlight = features.find((feature) => feature.get('granuleId') === granuleId)
  }

  // If we haven't found any features and we have a hightlited
  if (!featureToHighlight && highlightedGranuleFeature) {
    unhighlightFeature(granuleHighlightsSource)
  }

  // If we found a feature to highlight, highlight it
  if (featureToHighlight) {
    const {
      collectionId,
      granuleId: toHighlightGranuleId,
      highlightedStyle
    } = featureToHighlight.getProperties()

    if (highlightedGranuleFeature) {
      const { granuleId: highlightedGranuleId } = highlightedGranuleFeature.getProperties()

      // If the feature to highlight is the same as the highlighted feature, don't do anything
      if (toHighlightGranuleId === highlightedGranuleId) {
        return
      }
    }

    // Remove the previous highlight
    if (highlightedGranuleFeature) unhighlightFeature(granuleHighlightsSource)

    // Create a new feature with the geometry of the feature to highlight
    highlightedGranuleFeature = new Feature({
      geometry: featureToHighlight.getGeometry()
    })

    // Set the collectionId and granuleId to the properties
    highlightedGranuleFeature.set('collectionId', collectionId)
    highlightedGranuleFeature.set('granuleId', toHighlightGranuleId)

    // Set the style for the highlighted feature
    highlightedGranuleFeature.setStyle(highlightedStyle)

    // Add the highlighted feature to the vector source
    granuleHighlightsSource.addFeature(highlightedGranuleFeature)

    // Fire the event to highlight the granule in the granule list
    if (coordinate) eventEmitter.emit(`map.layer.${collectionId}.hoverGranule`, { granule: { id: toHighlightGranuleId } })
  }
}
