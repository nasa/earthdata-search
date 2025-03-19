import React, {
  useContext,
  useEffect,
  useRef
} from 'react'
import { renderToString } from 'react-dom/server'
import PropTypes from 'prop-types'

import { altKeyOnly, never } from 'ol/events/condition'

import {
  defaults as defaultInteractions,
  DragRotate,
  Draw
} from 'ol/interaction'
import { transform } from 'ol/proj'
import { View } from 'ol'
import Attribution from 'ol/control/Attribution'
import LayerGroup from 'ol/layer/Group'
import MapBrowserEventType from 'ol/MapBrowserEventType'
import MapEventType from 'ol/MapEventType'
import OlMap from 'ol/Map'
import PointerEventType from 'ol/pointer/EventType'
import RenderEventType from 'ol/render/EventType'
import ScaleLine from 'ol/control/ScaleLine'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'

import { FaCircle, FaHome } from 'react-icons/fa'
import {
  Close,
  Minus,
  Plus,
  Map as MapIcon
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import { LegendControl } from '../Legend/LegendControl'
import MapControls from './MapControls'

import PanelWidthContext from '../../contexts/PanelWidthContext'

import spatialTypes from '../../constants/spatialTypes'
import { mapEventTypes } from '../../constants/eventTypes'

import { crsProjections, projectionConfigs } from '../../util/map/crs'
import { highlightFeature, unhighlightFeature } from '../../util/map/interactions/highlightFeature'
import boundingBoxGeometryFunction from '../../util/map/geometryFunctions/boundingBoxGeometryFunction'
import circleGeometryFunction from '../../util/map/geometryFunctions/circleGeometryFunction'
import drawFocusedGranule from '../../util/map/drawFocusedGranule'
import drawGranuleBackgroundsAndImagery from '../../util/map/drawGranuleBackgroundsAndImagery'
import drawGranuleOutlines from '../../util/map/drawGranuleOutlines'
import drawSpatialSearch from '../../util/map/drawSpatialSearch'
import handleDrawEnd from '../../util/map/interactions/handleDrawEnd'
import labelsLayer from '../../util/map/layers/placeLabels'
import onClickMap from '../../util/map/interactions/onClickMap'
import projections from '../../util/map/projections'
import worldImagery from '../../util/map/layers/worldImagery'

import { eventEmitter } from '../../events/events'

import 'ol/ol.css'
import './Map.scss'

// TODO Data attributions

let previousGranulesKey
let previousProjectionCode

// Render the times icon to an SVG string for use in the focused granule overlay
const timesIconSvg = renderToString(<EDSCIcon icon={Close} />)

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
  className: 'edsc-granules-outlines-layer',
  zIndex: 4
})

// Layer for granule highlights
const granuleHighlightsSource = new VectorSource({
  overlaps: true,
  wrapX: false
})
const granuleHighlightsLayer = new VectorLayer({
  source: granuleHighlightsSource,
  className: 'edsc-granules-highlights-layer',
  zIndex: 4
})

// Layer for focused granule
const focusedGranuleSource = new VectorSource({
  overlaps: true,
  wrapX: false
})
const focusedGranuleLayer = new VectorLayer({
  source: focusedGranuleSource,
  className: 'edsc-granules-focus-layer',
  zIndex: 4
})

// Layer for spatial drawing
const spatialDrawingSource = new VectorSource({
  wrapX: false
})
const spatialDrawingLayer = new VectorLayer({
  source: spatialDrawingSource,
  className: 'edsc-spatial-drawing-layer',
  zIndex: 4
})

// Layer group for imagery layers
const granuleImageryLayerGroup = new LayerGroup()

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

// Clear the focused granule source
const clearFocusedGranuleSource = (map) => {
  focusedGranuleSource.clear()

  // If a focused granule overlay exists, remove it
  const focusedGranuleOverlay = map.getOverlayById('focused-granule-overlay')
  if (focusedGranuleOverlay) map.removeOverlay(focusedGranuleOverlay)
}

/**
 * Uses OpenLayers to render a map
 * @param {Object} params
 * @param {Object} params.center Center latitude and longitude of the map
 * @param {Object} params.colorMap Color map for the focused collection
 * @param {Object} params.granules Granules to render on the map
 * @param {String} params.granulesKey Key to determine if the granules have changed
 * @param {String} params.focusedCollectionId Collection ID of the focused collection
 * @param {String} params.focusedGranuleId Granule ID of the focused granule
 * @param {Function} params.onChangeFocusedGranule Function to call when the focused granule is changed
 * @param {Function} params.onChangeMap Function to call when the map is updated
 * @param {Function} params.onChangeProjection Function to call when the projection is changed
 * @param {Function} params.onChangeQuery Function to call when the query is changed
 * @param {Function} params.onExcludeGranule Function to call when a granule is excluded
 * @param {Function} params.onMetricsMap Function to call when a map metric is triggered
 * @param {Function} params.onToggleDrawingNewLayer Function to call when a new drawing layer is toggled
 * @param {String} params.projectionCode Projection code of the map
 * @param {Number} params.rotation Rotation of the map
 * @param {Object} params.spatialSearch Spatial search object
 * @param {Number} params.zoom Zoom level of the map
 */
const Map = ({
  center,
  colorMap,
  focusedCollectionId,
  focusedGranuleId,
  granules,
  granulesKey,
  isFocusedCollectionPage,
  isProjectPage,
  onChangeFocusedGranule,
  onChangeMap,
  onChangeProjection,
  onChangeQuery,
  onExcludeGranule,
  onMetricsMap,
  onToggleDrawingNewLayer,
  projectionCode,
  rotation,
  spatialSearch,
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
        granuleHighlightsLayer,
        focusedGranuleLayer,
        granuleImageryLayerGroup,
        spatialDrawingLayer
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

    const handleDrawingStart = (spatialType) => {
      onToggleDrawingNewLayer(spatialType)
      spatialDrawingSource.clear()

      let geometryFunction
      let type = spatialType

      if (spatialType === spatialTypes.BOUNDING_BOX) {
        // To draw a box use the circle type and a geometry function that creates a polygon
        // of the box
        // https://openlayers.org/en/latest/examples/draw-shapes.html
        type = spatialTypes.CIRCLE

        geometryFunction = boundingBoxGeometryFunction
      }

      if (spatialType === spatialTypes.CIRCLE && projectionCode === projections.geographic) {
        // We only need this special geometry function for circles in geographic projection
        geometryFunction = circleGeometryFunction
      }

      // Add the drawing interaction to the map
      const drawingInteraction = new Draw({
        freehandCondition: never,
        geometryFunction,
        stopClick: true,
        type
      })

      // This id is used to find the drawing interaction later to remove it
      drawingInteraction.set('id', 'spatial-drawing-interaction')
      map.addInteraction(drawingInteraction)

      drawingInteraction.on('drawend', handleDrawEnd.bind(null, {
        drawingInteraction,
        map,
        onChangeQuery,
        onToggleDrawingNewLayer,
        projectionCode,
        spatialType
      }))
    }

    // Handles canceling the drawing interaction
    const handleDrawingCancel = () => {
      onToggleDrawingNewLayer(false)

      // Find the drawing interaction and remove it
      map.getInteractions().getArray().forEach((interaction) => {
        if (interaction.get('id') === 'spatial-drawing-interaction') {
          map.removeInteraction(interaction)
          interaction.dispose()
        }
      })
    }

    // Handle the map draw start event from the SpatialSelectionDropdown
    eventEmitter.on(mapEventTypes.DRAWSTART, handleDrawingStart)
    eventEmitter.on(mapEventTypes.DRAWCANCEL, handleDrawingCancel)

    const mapControls = new MapControls({
      CircleIcon: (<EDSCIcon size="0.75rem" icon={FaCircle} />),
      handleDrawingCancel,
      handleDrawingStart,
      HomeIcon: (<EDSCIcon size="0.75rem" icon={FaHome} />),
      map,
      MinusIcon: (<EDSCIcon size="0.75rem" icon={Minus} />),
      onChangeProjection,
      PlusIcon: (<EDSCIcon size="0.75rem" icon={Plus} />),
      PointIcon: (<EDSCIcon size="0.75rem" icon={MapIcon} />),
      projectionCode
    })

    map.addControl(mapControls)

    const handleMoveEnd = (event) => {
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
    }

    // When the map is moved, call handleMoveEnd
    map.on(MapEventType.MOVEEND, handleMoveEnd)

    // Handle the pointer move event
    const handlePointerMove = (event) => {
      // If the map is currently being dragged, don't highlight the feature
      if (event.dragging) {
        return
      }

      // Highlight the feature at the pointer's location
      highlightFeature({
        coordinate: map.getEventCoordinate(event.originalEvent),
        granuleBackgroundsSource,
        granuleHighlightsSource
      })
    }

    // When the pointer moves, highlight the feature
    map.on(PointerEventType.POINTERMOVE, handlePointerMove)

    // Handle the move map event. This can be called from anywhere in the app and will move the map
    // to the provided extent.
    const handleMoveMap = ({ shape }) => {
      const shapeInProjection = shape.transform(
        crsProjections[projections.geographic],
        crsProjections[projectionCode]
      )

      const extent = shapeInProjection.getExtent()

      map.getView().fit(extent, {
        duration: 250,
        padding: [50, 50, 50, 50]
      })
    }

    eventEmitter.on(mapEventTypes.MOVEMAP, handleMoveMap)

    return () => {
      map.setTarget(null)
      map.un(MapEventType.MOVEEND, handleMoveEnd)
      map.un(PointerEventType.POINTERMOVE, handlePointerMove)

      eventEmitter.off(mapEventTypes.DRAWSTART, handleDrawingStart)
      eventEmitter.off(mapEventTypes.DRAWCANCEL, handleDrawingCancel)
      eventEmitter.off(mapEventTypes.MOVEMAP, handleMoveMap)
    }
  }, [projectionCode])

  // Handle the map click event
  const handleMapClick = (event) => {
    const { map } = event

    onClickMap({
      clearFocusedGranuleSource,
      coordinate: map.getEventCoordinate(event.originalEvent),
      focusedCollectionId,
      focusedGranuleId,
      focusedGranuleSource,
      granuleBackgroundsSource,
      isProjectPage,
      map,
      onChangeFocusedGranule,
      onExcludeGranule,
      onMetricsMap,
      timesIconSvg
    })
  }

  // Update the map click event listeners when the focusedGranuleId changes
  useEffect(() => {
    const map = mapRef.current

    // When the map is clicked, call handleMapClick
    map.on(MapBrowserEventType.CLICK, handleMapClick)

    return () => {
      map.un(MapBrowserEventType.CLICK, handleMapClick)
    }
  }, [focusedGranuleId, projectionCode])

  // Handle the map leave event
  const handleMouseLeave = () => {
    // When the mouse leaves the map element, unhighlight the feature
    unhighlightFeature(granuleHighlightsSource)
  }

  // Update the map element event listeners when the map element ref changes
  useEffect(() => {
    // When the mouse leaves the map element, unhighlight the feature
    mapElRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      mapElRef.current.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mapElRef.current])

  // Handle the granule highlight event
  const handleHoverGranule = ({ granule }) => {
    highlightFeature({
      granuleBackgroundsSource,
      granuleHighlightsSource,
      granuleId: granule ? granule.id : null
    })
  }

  // Handle the granule focus event
  const handleFocusGranule = ({ granule }) => {
    drawFocusedGranule({
      collectionId: focusedCollectionId,
      focusedGranuleSource,
      granuleBackgroundsSource,
      granuleId: granule ? granule.id : null,
      isProjectPage,
      map: mapRef.current,
      onChangeFocusedGranule,
      onExcludeGranule,
      timesIconSvg
    })
  }

  // Update the event listeners when the focusedCollectionId changes
  useEffect(() => {
    // Call handleHoverGranule when the the event is fired
    eventEmitter.on(`map.layer.${focusedCollectionId}.hoverGranule`, handleHoverGranule)

    // Call handleFocusGranule when the the event is fired
    eventEmitter.on(`map.layer.${focusedCollectionId}.focusGranule`, handleFocusGranule)

    return () => {
      eventEmitter.off(`map.layer.${focusedCollectionId}.hoverGranule`, handleHoverGranule)
      eventEmitter.off(`map.layer.${focusedCollectionId}.focusGranule`, handleFocusGranule)
    }
  }, [focusedCollectionId])

  // Update the map view when the panelsWidth changes
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

    // Clear any existing granule highlights
    unhighlightFeature(granuleHighlightsSource)

    // Clear any existing focused granules
    clearFocusedGranuleSource(mapRef.current)

    // Clear the granule imagery layers
    granuleImageryLayerGroup.getLayers().clear()

    // Draw the granule backgrounds
    drawGranuleBackgroundsAndImagery({
      granuleImageryLayerGroup,
      granulesMetadata: granules,
      map: mapRef.current,
      projectionCode,
      vectorSource: granuleBackgroundsSource
    })

    // If there is a focused granule draw it
    if (focusedGranuleId) {
      drawFocusedGranule({
        collectionId: focusedCollectionId,
        focusedGranuleSource,
        granuleBackgroundsSource,
        granuleId: focusedGranuleId,
        isProjectPage,
        map: mapRef.current,
        onChangeFocusedGranule,
        onExcludeGranule,
        shouldMoveMap: false,
        timesIconSvg
      })
    }
  }, [granules, granulesKey, projectionCode])

  useEffect(() => {
    drawSpatialSearch({
      projectionCode,
      spatialSearch,
      vectorSource: spatialDrawingSource
    })
  }, [spatialSearch])

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
  granules: [],
  focusedCollectionId: '',
  focusedGranuleId: ''
}

Map.propTypes = {
  center: PropTypes.shape({
    latitude: PropTypes.number,
    longitude: PropTypes.number
  }).isRequired,
  colorMap: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string,
  focusedGranuleId: PropTypes.string,
  granules: PropTypes.arrayOf(PropTypes.shape({})),
  granulesKey: PropTypes.string.isRequired,
  isFocusedCollectionPage: PropTypes.bool.isRequired,
  isProjectPage: PropTypes.bool.isRequired,
  onChangeFocusedGranule: PropTypes.func.isRequired,
  onChangeMap: PropTypes.func.isRequired,
  onChangeProjection: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onExcludeGranule: PropTypes.func.isRequired,
  onMetricsMap: PropTypes.func.isRequired,
  onToggleDrawingNewLayer: PropTypes.func.isRequired,
  projectionCode: PropTypes.string.isRequired,
  rotation: PropTypes.number.isRequired,
  spatialSearch: PropTypes.shape({}).isRequired,
  zoom: PropTypes.number.isRequired
}

export default Map
