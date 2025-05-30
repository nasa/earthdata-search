import { Feature } from 'ol'
import VectorSource from 'ol/source/Vector'

import { eventEmitter } from '../../../events/events'

let highlightedGranuleFeature: Feature | null

// Remove the highlighted granule from the vector source
export const unhighlightGranule = (granuleHighlightsSource: VectorSource) => {
  // Reset the cursor
  document.body.style.cursor = 'auto'

  if (!highlightedGranuleFeature) return

  const { collectionId } = highlightedGranuleFeature.getProperties()

  // Remove the highlighted granule from the vector source
  granuleHighlightsSource.removeFeature(highlightedGranuleFeature)
  highlightedGranuleFeature = null

  // Fire the event to unhighlight the granule in the granule list
  eventEmitter.emit(`map.layer.${collectionId}.hoverGranule`, { granule: null })
}

// Highlighted granules are shown when a user hovers over the granule in the results list, or
// when a user hovers over the granule outline on the map
export const highlightGranule = ({
  coordinate,
  granuleBackgroundsSource,
  granuleHighlightsSource,
  granuleId
}: {
  /** The coordinate to search for a feature */
  coordinate?: number[] | null
  /** The granule backgrounds source */
  granuleBackgroundsSource: VectorSource
  /** The granule highlights source */
  granuleHighlightsSource: VectorSource
  /** The granule ID to highlight */
  granuleId?: string
}) => {
  let featureToHighlight

  if (coordinate) {
    // Find the first feature at the coordinate, this will be the top granule
    const features = granuleBackgroundsSource.getFeaturesAtCoordinate(coordinate)

    // Make sure the features are sorted by index
    const sortedFeatures = features.sort((a, b) => a.get('index') - b.get('index'));

    // The first feature will be the one that was drawn first
    [featureToHighlight] = sortedFeatures
  } else if (granuleId) {
    // Find the feature with the granuleId
    const features = granuleBackgroundsSource.getFeatures()
    featureToHighlight = features.find((feature) => feature.get('granuleId') === granuleId)
  }

  // If we haven't found any features and we have a hightlited
  if (!featureToHighlight && highlightedGranuleFeature) {
    unhighlightGranule(granuleHighlightsSource)
  }

  // If we found a feature to highlight, highlight it
  if (featureToHighlight) {
    // Set the cursor to a pointer
    document.body.style.cursor = 'pointer'

    const {
      collectionId,
      granuleId: toHighlightGranuleId,
      highlightedStyle
    } = featureToHighlight.getProperties()

    if (highlightedGranuleFeature) {
      const { granuleId: highlightedGranuleId } = highlightedGranuleFeature.getProperties()

      // If the feature to highlight is the same as the highlighted feature, don't do anything
      if (toHighlightGranuleId === highlightedGranuleId) {
        return true
      }
    }

    // Remove the previous highlight
    if (highlightedGranuleFeature) unhighlightGranule(granuleHighlightsSource)

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

  return !!featureToHighlight
}
