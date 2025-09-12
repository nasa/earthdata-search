import { Map } from 'ol'
import VectorSource from 'ol/source/Vector'

import drawFocusedGranule from '../drawFocusedGranule'

// Focused granules are shown when a user clicks on a granule in the results list, or
// when a user clicks on a granule outline on the map
const onClickMap = ({
  clearFocusedGranuleSource,
  coordinate,
  focusedCollectionId,
  focusedGranuleId,
  focusedGranuleSource,
  granuleBackgroundsSource,
  isProjectPage,
  map,
  onExcludeGranule,
  onMetricsMap,
  setGranuleId,
  timesIconSvg
}: {
  /** Function to clear the focused granule source */
  // eslint-disable-next-line no-shadow
  clearFocusedGranuleSource: (map: Map) => void
  /** The coordinate that was clicked */
  coordinate: number[]
  /** The focused collection ID */
  focusedCollectionId: string
  /** The focused granule ID */
  focusedGranuleId: string
  /** The focused granule source */
  focusedGranuleSource: VectorSource
  /** The granule backgrounds source */
  granuleBackgroundsSource: VectorSource
  /** If current page is the project page */
  isProjectPage: boolean
  /** The map */
  map: Map
  /** Function to exclude the granule */
  onExcludeGranule: (params: { collectionId: string; granuleId: string }) => void
  /** Function to clear the focused granule source */
  onMetricsMap: (eventName: string) => void
  /** Function to change the focused granule */
  setGranuleId: (granuleId: string | null) => void
  /** The times icon SVG */
  timesIconSvg: string
}) => {
  // Find the first feature at the coordinate, this will be the top granule
  const features = granuleBackgroundsSource.getFeaturesAtCoordinate(coordinate)

  // Make sure the features are sorted by index
  const sortedFeatures = features.sort((a, b) => a.get('index') - b.get('index'))

  // The first feature will be the one that was drawn first
  const [featureToFocus] = sortedFeatures

  // If we haven't found any features, don't focus a granule
  if (!featureToFocus) {
    clearFocusedGranuleSource(map)

    // If we have a focused granule, unfocus it
    if (focusedGranuleId) {
      setGranuleId(null)
    }

    return false
  }

  // Get the granuleId of the featureToFocus
  const { granuleId: newFocusedGranuleId } = featureToFocus.getProperties()

  // If the featureToFocus is the same as the focusedGranuleId, unfocus it
  if (focusedGranuleId === newFocusedGranuleId) {
    setGranuleId(null)
    clearFocusedGranuleSource(map)

    return false
  }

  // Track the event
  onMetricsMap('Selected Granule')

  // Focus the new granule
  setGranuleId(newFocusedGranuleId)
  drawFocusedGranule({
    collectionId: focusedCollectionId,
    focusedGranuleSource,
    granuleBackgroundsSource,
    granuleId: newFocusedGranuleId,
    isProjectPage,
    map,
    onExcludeGranule,
    setGranuleId,
    timesIconSvg
  })

  return true
}

export default onClickMap
