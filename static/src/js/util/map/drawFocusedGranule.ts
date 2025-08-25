import {
  Feature,
  Map,
  Overlay
} from 'ol'
import { Geometry } from 'ol/geom'
import { getCenter } from 'ol/extent'
import VectorSource from 'ol/source/Vector'
import mapDuration from '../../constants/mapDuration'

// Overlay content for the focused granule
const overlayContent = ({
  formattedTemporal,
  granuleId,
  isProjectPage,
  timesIconSvg
}: {
  /** The formatted temporal values */
  formattedTemporal: string[]
  /** The granule ID */
  granuleId: string
  /** If the focused granule is on the project page */
  isProjectPage: boolean
  /** The times icon SVG */
  timesIconSvg: string
}) => {
  let temporalLabel = ''

  // If there is no temporal on the granule, don't add the temporalLabel
  if (formattedTemporal) {
    if (formattedTemporal[0] && formattedTemporal[1]) {
      temporalLabel = `<p class="m-0">${formattedTemporal[0]}</p><p class="m-0">${formattedTemporal[1]}</p>`
    } else if (formattedTemporal[0]) {
      temporalLabel = `<p class="m-0">${formattedTemporal[0]}</p>`
    } else if (formattedTemporal[1]) {
      temporalLabel = `<p class="m-0">${formattedTemporal[1]}</p>`
    }
  }

  let excludeHtml = ''
  if (!isProjectPage) {
    excludeHtml = `
      <button
        id="remove-focused-granule"
        class="mt-2 map__focused-granule-overlay__granule-label__remove" data-granule-id="${granuleId}"
        title="Filter granule"
      >
        ${timesIconSvg}
      </button>
    `
  }

  return `
    <div class="map__focused-granule-overlay__granule-label">
      <span class="map__focused-granule-overlay__granule-label-temporal">${temporalLabel}</span>
      ${excludeHtml}
    </div>
  `
}

/**
 * Draws the focused granule on the map
 * @param {Object} params
 * @param {String} params.collectionId The collection ID of the focused granule
 * @param {Object} params.focusedGranuleSource The OL source for the focused granule
 * @param {Object} params.granuleBackgroundsSource The OL source for the granule backgrounds
 * @param {String} params.granuleId The granule ID of the focused granule
 * @param {Boolean} params.isProjectPage If the focused granule is on the project page
 * @param {Object} params.map The OL map
 * @param {Function} params.onExcludeGranule Callback to exclude the granule
 * @param {Function} params.setGranuleId Callback to change the focused granule
 * @param {Boolean} params.shouldMoveMap If the map should move to fit the focused granule
 * @param {String} params.timesIconSvg The SVG for the times icon
 */
const drawFocusedGranule = ({
  collectionId,
  focusedGranuleSource,
  granuleBackgroundsSource,
  granuleId,
  isProjectPage,
  map,
  onExcludeGranule,
  setGranuleId,
  shouldMoveMap = true,
  timesIconSvg
}: {
  /** The collection ID of the focused granule */
  collectionId: string
  /** The focused granule source */
  focusedGranuleSource: VectorSource
  /** The granule backgrounds source */
  granuleBackgroundsSource: VectorSource
  /** The granule ID of the focused granule */
  granuleId: string
  /** If the focused granule is on the project page */
  isProjectPage: boolean
  /** The OL map */
  map: Map
  /** Callback to change the focused granule */
  // eslint-disable-next-line no-shadow
  setGranuleId: (granuleId: string | null) => void
  /** Callback to exclude the granule */
  onExcludeGranule: (params: { collectionId: string; granuleId: string }) => void
  /** If the map should move to fit the focused granule */
  shouldMoveMap?: boolean
  /** The times icon SVG */
  timesIconSvg: string
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
  const geometry = granuleFeature.getGeometry() as Geometry
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
    map.getView().fit(geometry.getExtent(), {
      duration: mapDuration,
      padding: [100, 125, 100, 100]
    })
  }

  // Create the overlay for the focused granule
  const element = document.createElement('div')
  element.className = 'map__focused-granule-overlay'
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

  if (!isProjectPage) {
    // Add event listener to the exclude button
    const excludeButton = element.querySelector('#remove-focused-granule')
    excludeButton?.addEventListener('click', () => {
      // Remove the overlay
      map.removeOverlay(focusedGranuleOverlay)

      // Clear the focusedGranuleSource
      focusedGranuleSource.clear()

      // Clear the focusedGranuleId
      setGranuleId(null)

      // Call the onExcludeGranule function
      onExcludeGranule({
        collectionId,
        granuleId
      })
    })
  }
}

export default drawFocusedGranule
