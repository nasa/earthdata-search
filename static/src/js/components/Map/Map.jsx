import React, {
  useContext,
  useEffect,
  useRef
} from 'react'
import PropTypes from 'prop-types'

import OlMap from 'ol/Map'
import View from 'ol/View'
import ScaleLine from 'ol/control/ScaleLine'
import Attribution from 'ol/control/Attribution'
import { transform } from 'ol/proj'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import { Plus, Minus } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { FaHome } from 'react-icons/fa'

import ZoomControl from './ZoomControl'

import PanelWidthContext from '../../contexts/PanelWidthContext'

import { crsProjections, projectionConfigs } from '../../util/map/crs'
import worldImagery from '../../util/map/layers/worldImagery'
import labelsLayer from '../../util/map/layers/placeLabels'
import projections from '../../util/map/projections'

import 'ol/ol.css'
import './Map.scss'

// TODO Data attributions

const esriAttribution = 'Powered by <a href="https://www.esri.com/" target="_blank">ESRI</a>'

// Build the worldImagery layer
const worldImageryLayer = worldImagery({
  attributions: esriAttribution,
  projectionCode: projections.geographic
})

// Build the placeLabels layer
const placeLabelsLayer = await labelsLayer({
  attributions: esriAttribution,
  projectionCode: projections.geographic
})

// Create a view for the map. This will change when the padding needs to be updated
const createView = ({
  center,
  padding,
  projectionCode,
  zoom
}) => {
  // Pull default config values from the projectionConfigs
  const projectionConfig = projectionConfigs[projectionCode]

  const view = new View({
    center: center || projectionConfig.center,
    constrainOnlyCenter: true,
    enableRotation: projectionConfig.enableRotation,
    extent: projectionConfig.extent,
    maxZoom: projectionConfig.maxZoom,
    minZoom: projectionConfig.minZoom,
    padding,
    projection: crsProjections[projectionCode],
    zoom: zoom || projectionConfig.zoom
  })

  return view
}

// TODO Might want to move these out of this file at some point
const scaleMetric = new ScaleLine({
  className: 'edsc-map-scale-metric',
  units: 'metric'
})
const scaleImperial = new ScaleLine({
  className: 'edsc-map-scale-imperial',
  units: 'imperial'
})
const attribution = new Attribution({
  collapsible: false
})

const zoomControl = (projectionCode) => new ZoomControl({
  className: 'edsc-map-zoom',
  homeLocation: {
    center: projectionConfigs[projectionCode].center,
    zoom: projectionConfigs[projectionCode].zoom,
    rotation: 0
  },
  PlusIcon: <EDSCIcon size="0.75rem" icon={Plus} />,
  MinusIcon: <EDSCIcon size="0.75rem" icon={Minus} />,
  HomeIcon: <EDSCIcon size="0.75rem" icon={FaHome} />,
  duration: 250
})

/**
 * Uses OpenLayers to render a map
 * @param {Object} params
 * @param {Object} params.center Center latitude and longitude of the map
 * @param {String} params.projectionCode Projection code of the map
 * @param {Number} params.zoom Zoom level of the map
 * @param {Function} params.onChangeMap Function to call when the map is updated
 */
const Map = ({
  center,
  projectionCode,
  zoom,
  onChangeMap
}) => {
  // This is the width of the side panels. We need to know this so we can adjust the padding
  // on the map view when the panels are resized.
  // We adjust the padding so that centering the map on a point will center the point in the
  // viewable area of the map and not behind a panel.
  const { panelsWidth } = useContext(PanelWidthContext)

  // Create a ref for the map and the map dome element
  const mapRef = useRef()
  const mapElRef = useRef()

  const { latitude, longitude } = center

  useEffect(() => {
    const map = new OlMap({
      controls: [
        attribution,
        scaleMetric,
        scaleImperial,
        zoomControl(projectionCode)
      ],
      layers: [
        worldImageryLayer,
        placeLabelsLayer
      ],
      target: mapElRef.current,
      view: createView({
        center: [longitude, latitude],
        padding: [0, 0, 0, panelsWidth],
        projectionCode,
        zoom
      })
    })
    mapRef.current = map

    map.on('moveend', (event) => {
      // When the map is moved we need to call onChangeMap to update Redux
      // with the new values
      const eventMap = event.map
      const view = eventMap.getView()

      // Get the new center of the map
      const newCenter = view.getCenter()

      // Reproject the center to EPSG:4326 so we can store lat/lon in Redux
      const reprojectedCenter = transform(newCenter, crsProjections[projectionCode], 'EPSG:4326')
      const [newLongitude, newLatitude] = reprojectedCenter

      const newZoom = view.getZoom()

      // Update Redux with the new values
      onChangeMap({
        latitude: newLatitude,
        longitude: newLongitude,
        zoom: newZoom
      })
    })

    return () => map.setTarget(null)
  }, [])

  useEffect(() => {
    // When the panelsWidth changes, update the padding on the map view.
    // This will ensure when we want to center something on the map it is
    // centered in the viewable area of the map and not hidden behind a panel.

    const map = mapRef.current
    const view = map.getView()

    // Get the previousPanelsWidth from the previousPadding value from the map
    const properties = view.getProperties()
    const { padding: previousPadding } = properties
    const previousPanelsWidth = previousPadding[3]

    // Set the new padding value with the new panelsWidth
    const newPadding = [0, 0, 0, panelsWidth]

    // In order to keep the map from moving when we change the padding we need to adjust
    // the center longitude of the map. We can calculate the difference in pixels between
    // the previousPanelsWidth and the panelsWidth and adjust the center longitude by that
    // difference.

    // Find longitude difference between the previousPanelsWidth and the panelsWidth
    const diffInPixels = panelsWidth - previousPanelsWidth
    // Find the longitude difference in degrees
    const diff = (view.getResolution() * diffInPixels) / 2

    // Get the current center longitude
    const [currentLongitude, currentLatitude] = view.getCenter()
    // Generate the new center longitude
    const newCenter = [currentLongitude + diff, currentLatitude]

    // Create a new view for the map based on the new center, zoom, and padding
    const newView = createView({
      center: newCenter,
      padding: newPadding,
      projectionCode,
      zoom
    })

    // Update the map with the new view
    map.setView(newView)
  }, [panelsWidth])

  return (
    <div ref={mapElRef} id="map" className="map" />
  )
}

Map.propTypes = {
  center: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number
  }).isRequired,
  projectionCode: PropTypes.string.isRequired,
  zoom: PropTypes.number.isRequired,
  onChangeMap: PropTypes.func.isRequired
}

export default Map
