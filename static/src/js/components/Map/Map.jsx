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
import { defaults as defaultInteractions, DragRotate } from 'ol/interaction'
import { altKeyOnly } from 'ol/events/condition'

// TODO EDSC-4422: Don't actually need this until EDSC-4422
// import { Feature } from 'ol'
import MapEventType from 'ol/MapEventType'
// TODO EDSC-4422: Don't actually need this until EDSC-4422
// import PointerEventType from 'ol/pointer/EventType'
import RenderEventType from 'ol/render/EventType'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import { FaHome } from 'react-icons/fa'
import { Plus, Minus } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import { LegendControl } from '../Legend/LegendControl'
import ProjectionSwitcherControl from './ProjectionSwitcherControl'
import ZoomControl from './ZoomControl'

import PanelWidthContext from '../../contexts/PanelWidthContext'

import { crsProjections, projectionConfigs } from '../../util/map/crs'
import { drawGranuleOutlines } from '../../util/map/drawGranuleOutlines'
// TODO EDSC-4422: Don't actually need this until EDSC-4422
// import { highlightedGranuleStyle } from '../../util/map/styles'
import drawGranuleBackgrounds from '../../util/map/drawGranuleBackgrounds'
import labelsLayer from '../../util/map/layers/placeLabels'
import projections from '../../util/map/projections'
import worldImagery from '../../util/map/layers/worldImagery'

import 'ol/ol.css'
import './Map.scss'

// TODO Data attributions

let previousGranulesKey
let previousProjectionCode
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

// Layer for granule backgrounds
const granuleBackgroundsSource = new VectorSource({
  overlaps: true,
  wrapX: false
})
const granuleBackgroundsLayer = new VectorLayer({
  source: granuleBackgroundsSource,
  className: 'edsc-granules-vector-layer'
})

// Layer for granule outlines
const granuleOutlinesSource = new VectorSource({
  overlaps: true,
  wrapX: false
})
const granuleOutlinesLayer = new VectorLayer({
  source: granuleOutlinesSource,
  className: 'edsc-granules-outlines-layer'
})

// Layer for granule highlights
const granuleHighlightsSource = new VectorSource({
  overlaps: true,
  wrapX: false
})
const granuleHighlightsLayer = new VectorLayer({
  source: granuleHighlightsSource,
  className: 'edsc-granules-highlights-layer'
})

// Create a view for the map. This will change when the padding needs to be updated
const createView = ({
  center,
  padding,
  projectionCode,
  rotation,
  zoom
}) => {
  // Pull default config values from the projectionConfigs
  const projectionConfig = projectionConfigs[projectionCode]
  const projection = crsProjections[projectionCode]

  // Ensure the center (saved in EPSG:4326) is reprojected to the current projection
  const { latitude, longitude } = center || projectionConfig.center
  const reprojectedCenter = transform(
    [longitude, latitude],
    crsProjections[projections.geographic],
    projection
  )

  // `rotation` is in degrees, but OpenLayers expects it in radians
  const rotationInRad = rotation * (Math.PI / 180)

  const view = new View({
    center: reprojectedCenter,
    constrainOnlyCenter: true,
    enableRotation: projectionConfig.enableRotation,
    extent: projection.getExtent(),
    maxZoom: projectionConfig.maxZoom,
    minZoom: projectionConfig.minZoom,
    padding,
    projection,
    rotation: rotationInRad,
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

// TODO EDSC-4422: Don't actually need this until EDSC-4422
// let highlightedFeature
// const highlightFeature = (coordinate) => {
//   // Find the first feature at the coordinate, this will be the top granule
//   const features = granuleBackgroundsSource.getFeaturesAtCoordinate(coordinate)
//   // We only want the background feature, because it contains the full granule geometry
//   // const featureToHighlight = features.find((feature) => feature.get('background'))
//   const [featureToHighlight] = features

//   // If we haven't found any features and we have a hightlited
//   if (!featureToHighlight && highlightedFeature) {
//     highlightsSource.removeFeature(highlightedFeature)
//   }

//   if (featureToHighlight) {
//     // If we found a feature to highlight, remove the previous highlight
//     if (highlightedFeature) {
//       highlightsSource.removeFeature(highlightedFeature)
//     }

//     // Create a new feature with the geometry of the feature to highlight
//     highlightedFeature = new Feature({
//       geometry: featureToHighlight.getGeometry()
//     })

//     // Set the style for the highlighted feature
//     // const style = featureToHighlight.getStyle()
//     highlightedFeature.setStyle(highlightedGranuleStyle(0))

//     // Add the highlighted feature to the vector source
//     highlightsSource.addFeature(highlightedFeature)
//   }
// }

/**
 * Uses OpenLayers to render a map
 * @param {Object} params
 * @param {Object} params.center Center latitude and longitude of the map
 * @param {Object} params.granules Granules to render on the map
 * @param {String} params.granulesKey Key to determine if the granules have changed
 * @param {String} params.projectionCode Projection code of the map
 * @param {Number} params.rotation Rotation of the map
 * @param {Number} params.zoom Zoom level of the map
 * @param {Object} params.colorMap Color map for the focused collection
 * @param {Function} params.onChangeMap Function to call when the map is updated
 * @param {Function} params.onChangeProjection Function to call when the projection is changed
 */
const Map = ({
  center,
  colorMap,
  granules,
  granulesKey,
  isFocusedCollectionPage,
  onChangeMap,
  onChangeProjection,
  projectionCode,
  rotation,
  zoom
}) => {
  // This is the width of the side panels. We need to know this so we can adjust the padding
  // on the map view when the panels are resized.
  // We adjust the padding so that centering the map on a point will center the point in the
  // viewable area of the map and not behind a panel.
  const { panelsWidth } = useContext(PanelWidthContext)

  // Create a ref for the map and the map dome element
  const mapRef = useRef()
  const mapElRef = useRef()

  useEffect(() => {
    const map = new OlMap({
      controls: [
        attribution,
        scaleMetric,
        scaleImperial,
        zoomControl(projectionCode),
        new ProjectionSwitcherControl({
          onChangeProjection
        }),
        new LegendControl({
          colorMap,
          isFocusedCollectionPage
        })
      ],
      interactions: defaultInteractions().extend([
        new DragRotate({
          condition: altKeyOnly
        })
      ]),
      layers: [
        worldImageryLayer,
        placeLabelsLayer,
        granuleBackgroundsLayer,
        granuleOutlinesLayer,
        granuleHighlightsLayer
      ],
      target: mapElRef.current,
      view: createView({
        center,
        padding: [0, 0, 0, panelsWidth],
        projectionCode,
        rotation,
        zoom
      })
    })
    mapRef.current = map

    map.on(MapEventType.MOVEEND, (event) => {
      // When the map is moved we need to call onChangeMap to update Redux
      // with the new values
      const eventMap = event.map
      const view = eventMap.getView()

      // Get the new center of the map
      const newCenter = view.getCenter()

      let [newLongitude, newLatitude] = newCenter
      const newZoom = view.getZoom()
      let newRotationInDeg = 0

      // If the new center is 0,0 use the projection's default center
      if (newLongitude === 0 && newLatitude === 0) {
        const projectionConfig = projectionConfigs[projectionCode];
        [newLongitude, newLatitude] = projectionConfig.center
      } else {
        // Reproject the center to EPSG:4326 so we can store lat/lon in Redux
        const newReprojectedCenter = transform(
          newCenter,
          view.getProjection(),
          crsProjections[projections.geographic]
        );

        [newLongitude, newLatitude] = newReprojectedCenter
      }

      // Convert the rotation from radians to degrees within a range of -180 to 180
      const newRotationInRad = view.getRotation()
      newRotationInDeg = (((newRotationInRad * 180) / Math.PI - 180) % 360) + 180

      // Update Redux with the new values
      onChangeMap({
        latitude: newLatitude,
        longitude: newLongitude,
        rotation: newRotationInDeg,
        zoom: newZoom
      })
    })

    // TODO EDSC-4422: Don't actually need this until EDSC-4422
    // map.on(PointerEventType.POINTERMOVE, (event) => {
    //   if (event.dragging) {
    //     return
    //   }

    //   highlightFeature(map.getEventCoordinate(event.originalEvent))
    // })

    return () => {
      map.setTarget(null)
    }
  }, [projectionCode])

  useEffect(() => {
    // When colorMap or isFocusedCollectionPage changes, remove the existing legend control
    // and add a new one if necessary.
    const map = mapRef.current
    const controls = map.getControls()
    const legendControl = controls.getArray().find(
      (control) => control instanceof LegendControl
    )

    // Always remove existing legend control if present
    if (legendControl) {
      controls.remove(legendControl)
    }

    // Add new legend control only if on focused collection page and colorMap exists
    if (isFocusedCollectionPage && colorMap && Object.keys(colorMap).length > 0) {
      controls.push(
        new LegendControl({
          colorMap,
          isFocusedCollectionPage
        })
      )
    }
  }, [isFocusedCollectionPage, colorMap])

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

    // Get the current center longitude and latitude
    let [currentLongitude, currentLatitude] = view.getCenter()
    let newCenter = {
      longitude: currentLongitude,
      latitude: currentLatitude
    }

    // In order to keep the map from moving when we change the padding we need to adjust
    // the center of the map.

    // If the current center is 0,0 then use the projection's default center for calculations
    if (currentLongitude === 0 && currentLatitude === 0) {
      const projectionConfig = projectionConfigs[projectionCode];
      [currentLongitude, currentLatitude] = projectionConfig.center

      newCenter = {
        longitude: currentLongitude,
        latitude: currentLatitude
      }
    }

    // Adjust the center based on the difference in the panels

    // Find the pixel difference between the previousPanelsWidth and the panelsWidth
    const diffInPixels = panelsWidth - previousPanelsWidth

    // Find the coordinate difference based on the resolution of the view
    const diff = (view.getResolution() * diffInPixels) / 2

    // If the difference in pixels is not 0, adjust the center of the map
    if (diffInPixels !== 0) {
      if (projectionCode === projections.geographic) {
        // In the geographic projection adjust the longitude of the center

        // Generate the new center longitude
        newCenter = {
          longitude: currentLongitude + diff,
          latitude: currentLatitude
        }
      } else {
        // In polar projections adjust the x coordinate of the center

        // In the polar projections the coordinates are x,y instead of longitude,latitude
        const currentX = currentLongitude
        const currentY = currentLatitude

        // Generate the updated center x coordinate
        const updatedProjectionCenter = [
          currentX + diff,
          currentY
        ]

        // Convert the updated center back to geographic coordinates
        const [newLongitude, newLatitude] = transform(
          updatedProjectionCenter,
          crsProjections[projectionCode],
          crsProjections[projections.geographic]
        )

        newCenter = {
          longitude: newLongitude,
          latitude: newLatitude
        }
      }
    }

    // Create a new view for the map based on the new center, zoom, and padding
    const newView = createView({
      center: newCenter,
      padding: newPadding,
      projectionCode,
      rotation,
      zoom
    })

    // Update the map with the new view
    map.setView(newView)
  }, [panelsWidth])

  // When the granules change, draw the granule backgrounds
  useEffect(() => {
    // If the granules haven't changed and the projection hasn't changed, don't redraw the granule backgrounds
    if (granulesKey === previousGranulesKey && projectionCode === previousProjectionCode) return

    // Update the previous values
    previousGranulesKey = granulesKey
    previousProjectionCode = projectionCode

    // Clear the existing granule backgrounds
    granuleBackgroundsSource.clear()

    // Draw the granule backgrounds
    drawGranuleBackgrounds(granules, granuleBackgroundsSource, projectionCode)
  }, [granules, granulesKey, projectionCode])

  // Draw the granule outlines
  granuleOutlinesLayer.on(RenderEventType.POSTRENDER, (event) => {
    const ctx = event.context

    drawGranuleOutlines({
      ctx,
      granuleBackgroundsSource,
      map: mapRef.current,
      projectionCode
    })
  })

  return (
    <div ref={mapElRef} id="map" className="map" />
  )
}

Map.defaultProps = {
  granules: []
}

Map.propTypes = {
  center: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number
  }).isRequired,
  granules: PropTypes.arrayOf(PropTypes.shape({})),
  granulesKey: PropTypes.string.isRequired,
  projectionCode: PropTypes.string.isRequired,
  rotation: PropTypes.number.isRequired,
  zoom: PropTypes.number.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onChangeProjection: PropTypes.func.isRequired,
  isFocusedCollectionPage: PropTypes.bool.isRequired,
  colorMap: PropTypes.shape({}).isRequired
}

export default Map
