import { Feature, Overlay } from 'ol'
import { getCenter } from 'ol/extent'

// Overlay content for the focused granule
const overlayContent = ({
  formattedTemporal,
  granuleId,
  isProjectPage,
  timesIconSvg
}) => {
  let temporalLabel = ''

  if (formattedTemporal[0] && formattedTemporal[1]) {
    temporalLabel = `<p class="m-0">${formattedTemporal[0]}</p><p class="m-0">${formattedTemporal[1]}</p>`
  } else if (formattedTemporal[0]) {
    temporalLabel = `<p class="m-0">${formattedTemporal[0]}</p>`
  } else if (formattedTemporal[1]) {
    temporalLabel = `<p class="m-0">${formattedTemporal[1]}</p>`
  }

  let excludeHtml = ''
  if (!isProjectPage) {
    excludeHtml = `
      <button
        id="remove-focused-granule"
        class="mt-2 edsc-map__focused-granule-overlay__granule-label__remove" data-granule-id="${granuleId}"
        title="Filter granule"
      >
        ${timesIconSvg}
      </button>
    `
  }

  return `
    <div class="edsc-map__focused-granule-overlay__granule-label">
      <span class="edsc-map__focused-granule-overlay__granule-label-temporal">${temporalLabel}</span>
      ${excludeHtml}
    </div>
  `
}

/**
 *
 */
const drawFocusedGranule = ({
  collectionId,
  focusedGranuleSource,
  granuleBackgroundsSource,
  granuleId,
  isProjectPage,
  map,
  onChangeFocusedGranule,
  onExcludeGranule,
  shouldMoveMap = true,
  timesIconSvg
}) => {
  focusedGranuleSource.clear()

  let focusedGranuleOverlay = map.getOverlayById('focused-granule-overlay')

  if (focusedGranuleOverlay) {
    map.removeOverlay(focusedGranuleOverlay)
  }

  // If no granuleId is provided, return
  if (!granuleId) return

  // Get the features from the granuleBackgroundsSource
  const features = granuleBackgroundsSource.getFeatures()

  // Find the feature with the provided granuleId
  const foundFeature = features.find(
    (feature) => feature.get('granuleId') === granuleId
  )

  // If no feature is found, return
  if (!foundFeature) return

  const granuleFeature = foundFeature.clone()

  const {
    formattedTemporal,
    highlightedStyle
  } = granuleFeature.getProperties()

  // Create a new feature with the geometry of the found feature
  const geometry = granuleFeature.getGeometry()
  const geometryCenter = getCenter(geometry.getExtent())

  const focusedGranuleFeature = new Feature({
    geometry
  })

  // Create a new style for the focused granule based on the highlightedStyle
  const focusedStyle = highlightedStyle.clone()

  // Remove the fill from the highlightedStyle
  focusedStyle.setFill()

  // Set the style for the focused granule
  focusedGranuleFeature.setStyle(focusedStyle)

  // Draw the focused granule on the focusedGranuleSource
  focusedGranuleSource.addFeature(focusedGranuleFeature)

  // Fit the focused granule in the view
  if (shouldMoveMap) {
    map.getView().fit(geometry, {
      duration: 250,
      padding: [50, 50, 50, 50]
    })
  }

  // Create the overlay for the focused granule
  const element = document.createElement('div')
  element.className = 'edsc-map__focused-granule-overlay'
  element.innerHTML = overlayContent({
    formattedTemporal,
    granuleId,
    isProjectPage,
    timesIconSvg
  })

  focusedGranuleOverlay = new Overlay({
    element,
    id: 'focused-granule-overlay',
    position: geometryCenter,
    positioning: 'center-center'
  })

  // Add the overlay to the map
  map.addOverlay(focusedGranuleOverlay)

  // Add event listener to the exclude button
  const excludeButton = element.querySelector('#remove-focused-granule')
  excludeButton.addEventListener('click', () => {
    // Remove the overlay
    map.removeOverlay(focusedGranuleOverlay)

    // Clear the focusedGranuleSource
    focusedGranuleSource.clear()

    // Clear the focusedGranuleId
    onChangeFocusedGranule('')

    // Call the onExcludeGranule function
    onExcludeGranule({
      collectionId,
      granuleId
    })
  })
}

export default drawFocusedGranule
