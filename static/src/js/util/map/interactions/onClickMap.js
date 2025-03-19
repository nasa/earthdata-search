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
  onChangeFocusedGranule,
  onExcludeGranule,
  timesIconSvg
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
      onChangeFocusedGranule('')
    }

    return
  }

  // Get the granuleId of the featureToFocus
  const { granuleId: newFocusedGranuleId } = featureToFocus.getProperties()

  // If the featureToFocus is the same as the focusedGranuleId, unfocus it
  if (focusedGranuleId === newFocusedGranuleId) {
    onChangeFocusedGranule('')
    clearFocusedGranuleSource(map)

    return
  }

  // Focus the new granule
  onChangeFocusedGranule(newFocusedGranuleId)
  drawFocusedGranule({
    collectionId: focusedCollectionId,
    focusedGranuleSource,
    granuleBackgroundsSource,
    granuleId: newFocusedGranuleId,
    isProjectPage,
    map,
    onChangeFocusedGranule,
    onExcludeGranule,
    timesIconSvg
  })
}

export default onClickMap
