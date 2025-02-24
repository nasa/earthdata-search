import React, {
  useState,
  useCallback,
  useLayoutEffect
} from 'react'
import PropTypes from 'prop-types'
import { useMap, useMapEvents } from 'react-leaflet'
import { Overlay, Tooltip } from 'react-bootstrap'

const MapEvents = (props) => {
  const map = useMap()
  const {
    overlays = {},
    onChangeMap,
    onMetricsMap
  } = props

  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipTarget, setTooltipTarget] = useState(null)

  const handleMouseOver = useCallback((event) => {
    setShowTooltip(true)
    setTooltipTarget(event.currentTarget)
  }, [])

  const handleMouseOut = useCallback(() => {
    setShowTooltip(false)
    setTooltipTarget(null)
  }, [])

  useLayoutEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    const controlContainer = map._controlContainer

    const overlaysContainer = controlContainer.querySelector('.leaflet-control-layers-overlays')
    let placeLabelsControls = []

    if (overlaysContainer) {
      const overlayControls = overlaysContainer.querySelectorAll('label')
      placeLabelsControls = Array.from(overlayControls).filter((control) => control.textContent.includes('Place Labels'))

      placeLabelsControls.forEach((control) => {
        const checkbox = control.querySelector('input')
        if (checkbox) {
          checkbox.disabled = true

          const { style } = control
          style.opacity = '0.5'
          style.cursor = 'not-allowed'

          control.addEventListener('mouseover', handleMouseOver)
          control.addEventListener('mouseout', handleMouseOut)
        }
      })
    }

    const layersControl = controlContainer.querySelector('.leaflet-control-layers-list')
    const layersControlElement = controlContainer.querySelector('.leaflet-control-layers-attribution')

    // Only add if it hasn't been added before
    if (layersControl && !layersControlElement) {
      const attributionElement = document.createElement('footer')
      attributionElement.classList.add('leaflet-control-layers-attribution')
      attributionElement.innerHTML = '* © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      layersControl.appendChild(attributionElement)
    }

    // Return cleanup function to remove event listeners when component unmounts
    return () => {
      placeLabelsControls.forEach((control) => {
        control.removeEventListener('mouseover', handleMouseOver)
        control.removeEventListener('mouseout', handleMouseOut)
      })
    }
  })

  const handleOverlayChange = (event) => {
    const enabled = event.type === 'overlayadd'
    switch (event.name) {
      case 'Borders and Roads *':
        overlays.referenceFeatures = enabled
        break
      case 'Coastlines':
        overlays.coastlines = enabled
        break
      case 'Place Labels *':
        overlays.referenceLabels = enabled
        break
      default:
        break
    }

    onChangeMap({ overlays })
  }

  useMapEvents({
    moveend: () => {
      const center = map.getCenter()
      const { lat, lng } = center
      const zoom = map.getZoom()

      onChangeMap({
        latitude: lat,
        longitude: lng,
        zoom
      })
    },
    baselayerchange: (event) => {
      const base = {
        blueMarble: false,
        trueColor: false,
        landWaterMap: false
      }

      if (event.name === 'Blue Marble') base.blueMarble = true
      if (event.name === 'Corrected Reflectance (True Color)') base.trueColor = true
      if (event.name === 'Land / Water Map *') base.landWaterMap = true

      onMetricsMap(`Set Base Map: ${event.name}`)

      onChangeMap({ base })
    },
    overlayadd: handleOverlayChange,
    overlayremove: handleOverlayChange
  })

  return (
    <Overlay target={tooltipTarget} show={showTooltip} placement="left">
      {
        (tooltipProps) => (
          <Tooltip id="disabled-tooltip" {...tooltipProps}>
            The Place Labels layer is temporarily unavailable for maintenance.
            We expect it to be restored by April and appreciate your patience!
          </Tooltip>
        )
      }
    </Overlay>
  )
}

MapEvents.defaultProps = {
  onChangeMap: null,
  onMetricsMap: null
}

MapEvents.propTypes = {
  overlays: PropTypes.shape({}).isRequired,
  onChangeMap: PropTypes.func,
  onMetricsMap: PropTypes.func
}

export default MapEvents
