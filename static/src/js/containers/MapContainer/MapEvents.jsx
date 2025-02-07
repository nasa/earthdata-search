import { useLayoutEffect, useEffect } from 'react'
import PropTypes from 'prop-types'
import { useMap, useMapEvents } from 'react-leaflet'

const MapEvents = (props) => {
  const map = useMap()
  const {
    overlays = {},
    onChangeMap,
    onMetricsMap
  } = props

  useLayoutEffect(() => {
    // eslint-disable-next-line no-underscore-dangle
    const controlContainer = map._controlContainer
    const layersControl = controlContainer.querySelector('.leaflet-control-layers-list')
    const layersControlElement = controlContainer.querySelector('.leaflet-control-layers-attribution')

    // Only add if it hasn't been added before
    if (layersControl && !layersControlElement) {
      const attributionElement = document.createElement('footer')
      attributionElement.classList.add('leaflet-control-layers-attribution')
      attributionElement.innerHTML = '* © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      layersControl.appendChild(attributionElement)
    }
  })

  useEffect(() => {
    const handleMapOffsetChange = () => {
      map.invalidateSize()
    }

    window.addEventListener('mapOffsetChanged', handleMapOffsetChange)

    return () => {
      window.removeEventListener('mapOffsetChanged', handleMapOffsetChange)
    }
  }, [map])

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

  return null
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
