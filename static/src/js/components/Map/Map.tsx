import React, {
  useEffect,
  useRef,
  useState
} from 'react'
import { renderToString } from 'react-dom/server'

import { altKeyOnly, never } from 'ol/events/condition'

import { createEditingStyle } from 'ol/style/Style'
import {
  defaults as defaultInteractions,
  DragRotate,
  Draw
} from 'ol/interaction'
import { Coordinate } from 'ol/coordinate'
import { Fill } from 'ol/style'
import { Geometry } from 'ol/geom'
import { GeometryFunction } from 'ol/interaction/Draw'
import {
  MapBrowserEvent,
  MapEvent,
  View
} from 'ol'
import { transform } from 'ol/proj'
import { Type as GeometryType } from 'ol/geom/Geometry'
import LayerGroup from 'ol/layer/Group'
import OlMap from 'ol/Map'
import RenderEventType, { LayerRenderEventTypes } from 'ol/render/EventType'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import VectorSource from 'ol/source/Vector'
import VectorTileLayer from 'ol/layer/VectorTile'

import {
  FaCircle,
  FaFile,
  FaHome,
  FaMap
} from 'react-icons/fa'
import {
  Close,
  Minus,
  Plus,
  Map as MapIcon
  // @ts-expect-error The file does not have types
} from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import LegendControl from './LegendControl/LegendControl'
import MapControls from './MapControls'

import useEdscStore from '../../zustand/useEdscStore'

import { mapEventTypes, shapefileEventTypes } from '../../constants/eventTypes'
import mapDuration from '../../constants/mapDuration'
import mapLayers, { baseLayerIds } from '../../constants/mapLayers'
import spatialTypes from '../../constants/spatialTypes'

import { crsProjections, projectionConfigs } from '../../util/map/crs'
import { highlightGranule, unhighlightGranule } from '../../util/map/interactions/highlightGranule'
import {
  highlightShapefile,
  unhighlightShapefile
} from '../../util/map/interactions/highlightShapefile'
import { spatialSearchMarkerDrawingStyle } from '../../util/map/styles'
import boundingBoxGeometryFunction from '../../util/map/geometryFunctions/boundingBoxGeometryFunction'
import circleGeometryFunction from '../../util/map/geometryFunctions/circleGeometryFunction'
import drawFocusedGranule from '../../util/map/drawFocusedGranule'
import drawGranuleBackgroundsAndImagery from '../../util/map/drawGranuleBackgroundsAndImagery'
import drawGranuleOutlines from '../../util/map/drawGranuleOutlines'
import drawShapefile from '../../util/map/drawShapefile'
import drawSpatialSearch from '../../util/map/drawSpatialSearch'
import handleDrawEnd from '../../util/map/interactions/handleDrawEnd'
import labelsLayer from '../../util/map/layers/placeLabels'
import onClickMap from '../../util/map/interactions/onClickMap'
import onClickShapefile from '../../util/map/interactions/onClickShapefile'
import projectionCodes from '../../constants/projectionCodes'
import worldImagery from '../../util/map/layers/worldImagery'
import bordersRoads from '../../util/map/layers/bordersRoads'
import coastlines from '../../util/map/layers/coastlines'
import trueColor from '../../util/map/layers/trueColor'
import landWaterMap from '../../util/map/layers/landWaterMap'

import { eventEmitter } from '../../events/events'

import 'ol/ol.css'
import './Map.scss'
import {
  GibsLayersByCollection,
  GranuleMetadata,
  ImageryLayers,
  MapGranule,
  ProjectionCode,
  Query,
  ShapefileFile,
  SpatialSearch
} from '../../types/sharedTypes'
import { MapView, ShapefileSlice } from '../../zustand/types'

let previousGranulesKey: string
let previousProjectionCode: ProjectionCode
let layersAdded = false

// Render the times icon to an SVG string for use in the focused granule overlay
// Disable a testing-library rule because this isn't a test
// eslint-disable-next-line testing-library/render-result-naming-convention
const timesIconSvg = renderToString(<EDSCIcon icon={Close} />)

// Layer for granule backgrounds
const granuleBackgroundsSource = new VectorSource({
  overlaps: true,
  wrapX: false
})
const granuleBackgroundsLayer = new VectorLayer({
  source: granuleBackgroundsSource,
  className: 'map__granules-backgrounds-layer',
  zIndex: 1
})

// Layer for granule outlines
const granuleOutlinesSource = new VectorSource({
  overlaps: true,
  wrapX: false
})
const granuleOutlinesLayer = new VectorLayer({
  source: granuleOutlinesSource,
  className: 'map__granules-outlines-layer',
  zIndex: 4
})

// Layer for granule highlights
const granuleHighlightsSource = new VectorSource({
  overlaps: true,
  wrapX: false
})
const granuleHighlightsLayer = new VectorLayer({
  source: granuleHighlightsSource,
  className: 'map__granules-highlights-layer',
  zIndex: 4
})

// Layer for focused granule
const focusedGranuleSource = new VectorSource({
  overlaps: true,
  wrapX: false
})
const focusedGranuleLayer = new VectorLayer({
  source: focusedGranuleSource,
  className: 'map__granules-focus-layer',
  zIndex: 4
})

// Layer for spatial drawing
const spatialDrawingSource = new VectorSource({
  wrapX: false
})
const spatialDrawingLayer = new VectorLayer({
  source: spatialDrawingSource,
  className: 'map__spatial-drawing-layer',
  zIndex: 4
})

// Layer for NLP spatial drawing
// This is separate from spatialDrawingLayer to avoid interference with spatialSearch clears
const nlpSpatialSource = new VectorSource({
  wrapX: false
})
const nlpSpatialLayer = new VectorLayer({
  source: nlpSpatialSource,
  className: 'map__nlp-spatial-layer',
  zIndex: 4
})

// Layer group for imagery layers
const granuleImageryLayerGroup = new LayerGroup()

const baseLayers: Record<string, TileLayer | VectorTileLayer | null> = {
  [mapLayers.worldImagery]: null,
  [mapLayers.trueColor]: null,
  [mapLayers.landWaterMap]: null
}

const overlayLayers: Record<string, TileLayer | VectorTileLayer | null> = {
  [mapLayers.bordersRoads]: null,
  [mapLayers.coastlines]: null,
  [mapLayers.placeLabels]: null
}

// Create a view for the map. This will change when the padding needs to be updated
const createView = ({
  center,
  padding,
  projectionCode,
  rotation,
  zoom
}: {
  /** The center latitude and longitude of the map */
  center: {
    /** The latitude of the center of the map */
    latitude: number
    /** The longitude of the center of the map */
    longitude: number
  }
  /** The padding for the map view */
  padding: number[]
  /** The projection code of the map */
  projectionCode: ProjectionCode
  /** The rotation of the map */
  rotation: number
  /** The zoom level of the map */
  zoom: number
}) => {
  // Pull default config values from the projectionConfigs
  const projectionConfig = projectionConfigs[projectionCode]
  const projection = crsProjections[projectionCode]

  // Ensure the center (saved in EPSG:4326) is reprojected to the current projection
  const { latitude, longitude } = center || projectionConfig.center
  const reprojectedCenter = transform(
    [longitude, latitude],
    crsProjections[projectionCodes.geographic],
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

// Clear the focused granule source
const clearFocusedGranuleSource = (map: OlMap) => {
  focusedGranuleSource.clear()

  // If a focused granule overlay exists, remove it
  const focusedGranuleOverlay = map.getOverlayById('focused-granule-overlay')
  if (focusedGranuleOverlay) map.removeOverlay(focusedGranuleOverlay)
}

// Remove the drawing interaction from the map
const removeDrawingInteraction = (map: OlMap) => {
  map.getInteractions().getArray().forEach((interaction) => {
    if (interaction.get('id') === 'spatial-drawing-interaction') {
      map.removeInteraction(interaction)
      interaction.dispose()
    }
  })
}

interface MapProps {
  /** The base layers of the map */
  base: {
    /** Is the World Imagery base layer applied */
    worldImagery: boolean
    /** Is the True Color base layer applied */
    trueColor: boolean
    /** Is the Land Water Map base layer applied */
    landWaterMap: boolean
  }
  /** The center latitude and longitude of the map */
  center: {
    /** The latitude of the center of the map */
    latitude: number
    /** The longitude of the center of the map */
    longitude: number
  }
  /** The color map for the focused collection */
  /** The ID of the focused collection */
  focusedCollectionId: string
  /** The ID of the focused granule */
  focusedGranuleId: string
  /** The GIBS layers keyed by collectionID */
  gibsLayersByCollection: GibsLayersByCollection
  /** The granules to render on the map */
  granules: MapGranule[]
  /** The key to determine if the granules have changed */
  granulesKey: string
  /** The imagery layers */
  imageryLayers: ImageryLayers
  /** Flag to show if this is a focused collection page */
  isFocusedCollectionPage: boolean
  /** Flag to show if this is a project page */
  isProjectPage: boolean
  /** Function to call when the map is updated */
  onChangeMap: (mapView: Partial<MapView>) => void
  /** Function to call when the projection is changed */
  // eslint-disable-next-line no-shadow
  onChangeProjection: (projectionCode: ProjectionCode) => void
  /** Function to call when the query is changed */
  onChangeQuery: (queryParams: Query) => void
  /** Function to call when the shapefile is cleared */
  onClearShapefile: () => void
  /** Function to call when the draw end event is triggered */
  onDrawEnd: (geometry: Geometry | undefined) => void
  /** Function to call when a granule is excluded */
  onExcludeGranule: (data: { collectionId: string, granuleId: string }) => void
  /** Function to call when the map is ready */
  onMapReady: (isReady: boolean) => void
  /** Function to call when a map metric is triggered */
  onMetricsMap: (type: string) => void
  /** Function to call when a new drawing layer is toggled */
  onToggleDrawingNewLayer: (state: string | boolean) => void
  /** Function to call when the shapefile upload modal is toggled */
  onToggleShapefileUploadModal: () => void
  /** Function to call when the too many points modal is toggled */
  onToggleTooManyPointsModal: () => void
  /** Function to call when the shapefile is updated */
  onUpdateShapefile: ShapefileSlice['shapefile']['updateShapefile']
  /** The overlays of the map */
  overlays: {
    /** Is the borders and roads overlay applied */
    bordersRoads: boolean
    /** Is the coastlines overlay applied */
    coastlines: boolean
    /** Is the place labels overlay applied */
    placeLabels: boolean
  }
  /** The projection code of the map */
  projectionCode: ProjectionCode
  /** The rotation of the map */
  rotation: number
  /** Function to call when the focused granule is changed */
  setGranuleId: (granuleId: string | null) => void
  /** The shapefile to render on the map */
  shapefile: ShapefileSlice['shapefile']
  /** The spatial search object */
  spatialSearch: SpatialSearch
  /** The zoom level of the map */
  zoom: number
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
 * @param {Object} params.gibsLayersByCollection Gibs layers object that is keyed by Collection Id and contains layers and projection info
 * @param {Function} params.onChangeMap Function to call when the map is updated
 * @param {Function} params.onChangeProjection Function to call when the projection is changed
 * @param {Function} params.onChangeQuery Function to call when the query is changed
 * @param {Function} params.onClearShapefile Function to call when the shapefile is cleared
 * @param {Function} params.onExcludeGranule Function to call when a granule is excluded
 * @param {Function} params.onMapReady Function to call when the map is ready
 * @param {Function} params.onMetricsMap Function to call when a map metric is triggered
 * @param {Function} params.onToggleDrawingNewLayer Function to call when a new drawing layer is toggled
 * @param {Function} params.onToggleShapefileUploadModal Function to call when the shapefile upload modal is toggled
 * @param {Function} params.onToggleTooManyPointsModal Function to call when the too many points modal is toggled
 * @param {Function} params.onUpdateShapefile Function to call when the shapefile is updated
 * @param {String} params.projectionCode Projection code of the map
 * @param {Number} params.rotation Rotation of the map
 * @param {Function} params.setGranuleId Function to call when the focused granule is changed
 * @param {Object} params.shapefile Shapefile to render on the map
 * @param {Object} params.spatialSearch Spatial search object
 * @param {Number} params.zoom Zoom level of the map
 */
const Map: React.FC<MapProps> = ({
  base,
  center,
  focusedCollectionId = '',
  focusedGranuleId = '',
  gibsLayersByCollection,
  granules = [],
  granulesKey,
  imageryLayers,
  isFocusedCollectionPage,
  isProjectPage,
  onChangeMap,
  onChangeProjection,
  onChangeQuery,
  onClearShapefile,
  onDrawEnd,
  onExcludeGranule,
  onMapReady,
  onMetricsMap,
  onToggleDrawingNewLayer,
  onToggleShapefileUploadModal,
  onToggleTooManyPointsModal,
  onUpdateShapefile,
  overlays,
  projectionCode,
  rotation,
  setGranuleId,
  shapefile,
  spatialSearch,
  zoom
}) => {
  // This is the width of the side panels. We need to know this so we can adjust the padding
  // on the map view when the panels are resized.
  // We adjust the padding so that centering the map on a point will center the point in the
  // viewable area of the map and not behind a panel.
  const {
    panelsWidth,
    sidebarWidth
  } = useEdscStore((state) => ({
    panelsWidth: state.ui.panels.panelsWidth,
    sidebarWidth: state.ui.panels.sidebarWidth
  }))

  // Create a ref for the map and the map dome element
  const mapRef = useRef<OlMap>(undefined)
  const mapElRef = useRef<HTMLDivElement>(null)

  const [isLayerSwitcherOpen, setIsLayerSwitcherOpen] = useState(false)

  useEffect(() => {
    const map = new OlMap({
      controls: [
        new LegendControl({
          collectionId: focusedCollectionId,
          imageryLayers
        })
      ],
      interactions: defaultInteractions().extend([
        new DragRotate({
          condition: altKeyOnly
        })
      ]),
      layers: [
        granuleBackgroundsLayer,
        granuleOutlinesLayer,
        granuleHighlightsLayer,
        focusedGranuleLayer,
        granuleImageryLayerGroup,
        spatialDrawingLayer,
        nlpSpatialLayer
      ],
      target: mapElRef.current as HTMLDivElement,
      view: createView({
        center,
        padding: [0, 0, 0, panelsWidth + sidebarWidth],
        projectionCode,
        rotation,
        zoom
      })
    })
    mapRef.current = map

    // Handle the map draw start event
    const handleDrawingStart = (spatialType: string) => {
      // Remove any existing drawing interaction
      removeDrawingInteraction(map)

      onToggleDrawingNewLayer(spatialType)
      spatialDrawingSource.clear()

      let geometryFunction
      let type = spatialType

      // Update the polygon fill style to be more transparent.
      // Bounding box, circle, and polygon all use the polygon style
      const updatedStyles = createEditingStyle()
      updatedStyles.Polygon[0].setFill(new Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }))

      if (spatialType === spatialTypes.BOUNDING_BOX) {
        // To draw a box use the circle type and a geometry function that creates a polygon
        // of the box
        // https://openlayers.org/en/latest/examples/draw-shapes.html
        type = spatialTypes.CIRCLE

        geometryFunction = boundingBoxGeometryFunction
      }

      if (spatialType === spatialTypes.CIRCLE && projectionCode === projectionCodes.geographic) {
        // We only need this special geometry function for circles in geographic projection
        geometryFunction = circleGeometryFunction
      }

      if (spatialType === spatialTypes.POINT) {
        // Draw the point spatial type as a marker
        updatedStyles.Point[0] = spatialSearchMarkerDrawingStyle
      }

      // Add the drawing interaction to the map
      const drawingInteraction = new Draw({
        freehandCondition: never,
        geometryFunction: geometryFunction as unknown as GeometryFunction,
        stopClick: true,
        type: type as GeometryType,
        style: (drawingFeature) => {
          const geometry = drawingFeature.getGeometry()

          return geometry ? updatedStyles[geometry.getType()] : null
        }
      })

      // This id is used to find the drawing interaction later to remove it
      drawingInteraction.set('id', 'spatial-drawing-interaction')
      map.addInteraction(drawingInteraction)

      drawingInteraction.on('drawend', handleDrawEnd.bind(null, {
        drawingInteraction,
        map,
        onChangeQuery,
        onClearShapefile,
        onDrawEnd,
        onToggleDrawingNewLayer,
        projectionCode,
        spatialType
      }))
    }

    // Handles canceling the drawing interaction
    const handleDrawingCancel = () => {
      onToggleDrawingNewLayer(false)

      removeDrawingInteraction(map)

      eventEmitter.emit(mapEventTypes.DRAWEND)
    }

    // Handle the map draw start event from the SpatialSelectionDropdown
    eventEmitter.on(mapEventTypes.DRAWSTART, handleDrawingStart)
    eventEmitter.on(mapEventTypes.DRAWCANCEL, handleDrawingCancel)

    const handleMoveEnd = (event: MapEvent) => {
      // When the map is moved we need to call onChangeMap to update Redux
      // with the new values
      const eventMap = event.map
      const view = eventMap.getView()

      // Get the new center of the map
      const newCenter = view.getCenter() as Coordinate

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
          crsProjections[projectionCodes.geographic]
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
    map.on('moveend', handleMoveEnd)

    // Handle the pointer move event
    const handlePointerMove = (event: MapBrowserEvent) => {
      // If the map is currently being dragged, don't highlight the feature
      if (event.dragging) {
        return
      }

      const coordinate = map.getEventCoordinate(event.originalEvent as MouseEvent)

      // Highlight the feature at the pointer's location
      const wasFeatureHighlighted = highlightGranule({
        coordinate,
        granuleBackgroundsSource,
        granuleHighlightsSource
      })

      // If there was no granule highlighted, check for a shapefile feature to highlight
      // If on the project page, don't interact with shapefiles
      if (!isProjectPage && !wasFeatureHighlighted) {
        highlightShapefile({
          coordinate,
          map,
          spatialDrawingSource
        })
      }
    }

    // When the pointer moves, highlight the feature
    map.on('pointermove', handlePointerMove)

    // Handle the move map event. This can be called from anywhere in the app and will move the map
    // to the provided extent.
    const handleMoveMap = ({
      shape,
      source
    }: {
      /** The shape to move the map to */
      shape?: Geometry
      /** The source to move the map to */
      source?: VectorSource
    }) => {
      let extent: import('ol/extent').Extent | undefined

      // If a shape was passed, use the extent of that shape
      if (shape) {
        const shapeInProjection = shape.transform(
          crsProjections[projectionCodes.geographic],
          crsProjections[projectionCode]
        )

        extent = shapeInProjection.getExtent()
      } else if (source) {
        // If a source was passed, use the extent of the source
        extent = source.getExtent()
      }

      // Fit the map to the extent
      if (extent) {
        map.getView().fit(extent, {
          duration: mapDuration,
          padding: [100, 125, 100, 100]
        })
      }
    }

    eventEmitter.on(mapEventTypes.MOVEMAP, handleMoveMap)

    // Handle the add shapefile event
    const handleAddShapefile = (_dzFile: unknown, file: ShapefileFile, updateQuery = true) => {
      const { showMbr, drawingNewLayer } = spatialSearch

      drawShapefile({
        drawingNewLayer,
        onChangeProjection,
        onChangeQuery,
        onMetricsMap,
        onToggleTooManyPointsModal,
        onUpdateShapefile,
        projectionCode,
        shapefile: file,
        shapefileAdded: true,
        showMbr,
        updateQuery,
        vectorSource: spatialDrawingSource
      })
    }

    eventEmitter.on(shapefileEventTypes.ADDSHAPEFILE, handleAddShapefile)

    // Handle the remove shapefile event
    const handleRemoveShapefile = () => {
      spatialDrawingSource.clear()
    }

    eventEmitter.on(shapefileEventTypes.REMOVESHAPEFILE, handleRemoveShapefile)

    onMapReady(true)

    layersAdded = false

    return () => {
      map.setTarget(undefined)
      map.un('moveend', handleMoveEnd)
      map.un('pointermove', handlePointerMove)

      eventEmitter.off(mapEventTypes.DRAWSTART, handleDrawingStart)
      eventEmitter.off(mapEventTypes.DRAWCANCEL, handleDrawingCancel)
      eventEmitter.off(mapEventTypes.MOVEMAP, handleMoveMap)
      eventEmitter.off(shapefileEventTypes.ADDSHAPEFILE, handleAddShapefile)
      eventEmitter.off(shapefileEventTypes.REMOVESHAPEFILE, handleRemoveShapefile)
    }
  }, [projectionCode])

  // Adds layers to the map
  useEffect(() => {
    const buildLayers = async () => {
      // Build the worldImagery layer
      const worldImageryLayer = worldImagery({
        projectionCode: projectionCodes.geographic,
        visible: base.worldImagery
      })

      // Build the trueColor Layer
      const trueColorLayer = trueColor({
        projectionCode,
        visible: base.trueColor
      })

      // Build the landWater Layer
      const landWaterMapLayer = await landWaterMap({
        projectionCode,
        visible: base.landWaterMap
      })

      // Build the bordersRoads Layer
      const bordersRoadsLayer = bordersRoads({
        projectionCode,
        visible: overlays.bordersRoads
      })

      // Build the coastlines Layer
      const coastlinesLayer = coastlines({
        projectionCode,
        visible: overlays.coastlines
      })

      // Build the placeLabels layer
      const placeLabelsLayer = await labelsLayer({
        projectionCode,
        visible: overlays.placeLabels
      })

      baseLayers[mapLayers.worldImagery] = worldImageryLayer
      baseLayers[mapLayers.trueColor] = trueColorLayer
      baseLayers[mapLayers.landWaterMap] = landWaterMapLayer

      overlayLayers[mapLayers.bordersRoads] = bordersRoadsLayer
      overlayLayers[mapLayers.coastlines] = coastlinesLayer
      overlayLayers[mapLayers.placeLabels] = placeLabelsLayer

      Object.keys(baseLayers).forEach((layerId) => {
        if (baseLayers[layerId]) {
          mapRef.current?.addLayer(baseLayers[layerId])
        }
      })

      Object.keys(overlayLayers).forEach((layerId) => {
        if (overlayLayers[layerId]) {
          mapRef.current?.addLayer(overlayLayers[layerId])
        }
      })
    }

    if (mapRef.current && !layersAdded) {
      buildLayers()
      layersAdded = true
    }
  }, [projectionCode, mapRef.current])

  // Add the controls to the map
  useEffect(() => {
    // If the mapRef is not set, return an empty cleanup function
    if (!mapRef.current) return () => {}

    const handleLayerChange = ({ id, checked }: {
      /** The ID of the layer to change */
      id: string
      /** Whether the layer is checked or not */
      checked: boolean
    }) => {
      // State objects to track changes for both layer types
      let newBase = { ...base }
      const newOverlays = { ...overlays }

      // Handle base layers
      if (baseLayerIds.includes(id)) {
        // Reset all base layer selections
        newBase = {
          worldImagery: false,
          trueColor: false,
          landWaterMap: false
        }

        // Set the selected base layer to true in the state
        newBase[id as keyof typeof newBase] = checked

        // Update all base layer visibility
        Object.keys(baseLayers).forEach((layerId) => {
          baseLayers[layerId]?.setVisible(newBase[layerId as keyof typeof newBase])
        })
      }

      // Handle overlay layers
      if (id in overlayLayers) {
        overlayLayers[id]?.setVisible(checked)

        // Update the corresponding property in overlays state
        newOverlays[id as keyof typeof newOverlays] = checked
      }

      // Single call to onChangeMap with all changes
      onChangeMap({
        base: newBase,
        overlays: newOverlays
      })
    }

    const mapControls = new MapControls({
      base,
      CircleIcon: (<EDSCIcon size="14" icon={FaCircle} />),
      HomeIcon: (<EDSCIcon size="14" icon={FaHome} />),
      isLayerSwitcherOpen,
      LayersIcon: (<EDSCIcon size="14" icon={FaMap} />),
      map: mapRef.current,
      mapLayers,
      MinusIcon: (<EDSCIcon size="13" icon={Minus} />),
      onChangeLayer: handleLayerChange,
      onChangeProjection,
      onToggleShapefileUploadModal,
      overlays,
      PlusIcon: (<EDSCIcon size="13" icon={Plus} />),
      PointIcon: (<EDSCIcon size="14" icon={MapIcon} />),
      projectionCode,
      setIsLayerSwitcherOpen,
      ShapefileIcon: (<EDSCIcon size="14" icon={FaFile} />),
      showDrawingControls: !isProjectPage
    })

    mapRef.current.addControl(mapControls)

    return () => {
      mapRef.current?.removeControl(mapControls)
    }
  }, [
    base,
    isLayerSwitcherOpen,
    mapRef.current,
    overlays
  ])

  // Handle the map click event
  const handleMapClick = (event: MapBrowserEvent) => {
    const { map } = event

    const coordinate = map.getEventCoordinate(event.originalEvent as MouseEvent)

    const granuleClicked = onClickMap({
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
    })

    // If a granule was not clicked, call onClickShapefile
    // If on the project page, don't interact with shapefiles
    if (!isProjectPage && !granuleClicked) {
      onClickShapefile({
        coordinate,
        map,
        onChangeQuery,
        onUpdateShapefile,
        shapefile,
        spatialDrawingSource,
        spatialSearch
      })
    }
  }

  // Update the map click event listeners when the focusedGranuleId changes
  useEffect(() => {
    const map = mapRef.current as OlMap

    // When the map is clicked, call handleMapClick
    map.on('click', handleMapClick)

    return () => {
      map.un('click', handleMapClick)
    }
  }, [focusedGranuleId, projectionCode, shapefile, spatialSearch])

  // Handle the map leave event
  const handleMouseLeave = () => {
    // When the mouse leaves the map element, unhighlight the feature
    unhighlightGranule(granuleHighlightsSource)
    unhighlightShapefile(spatialDrawingSource)
  }

  // Update the map element event listeners when the map element ref changes
  useEffect(() => {
    // When the mouse leaves the map element, unhighlight the feature
    mapElRef.current?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      mapElRef.current?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [mapElRef.current])

  // Handle the granule highlight event
  const handleHoverGranule = ({ granule }: { granule: GranuleMetadata }) => {
    highlightGranule({
      granuleBackgroundsSource,
      granuleHighlightsSource,
      granuleId: granule ? granule.id : null
    })
  }

  // Handle the granule focus event
  const handleFocusGranule = ({ granule }: { granule: GranuleMetadata }) => {
    drawFocusedGranule({
      collectionId: focusedCollectionId,
      focusedGranuleSource,
      granuleBackgroundsSource,
      granuleId: granule ? granule.id : null,
      isProjectPage,
      map: (mapRef.current as OlMap),
      onExcludeGranule,
      setGranuleId,
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

  useEffect(() => {
    const map = mapRef.current as OlMap
    const controls = map.getControls()
    const legendControl = controls.getArray().find(
      (control) => control instanceof LegendControl
    )

    // Remove the legend control if not on the collection focused page and it exists
    if (!isFocusedCollectionPage && legendControl) {
      controls.remove(legendControl)
    }

    // Add new legend control only if on focused collection page and it has layers
    // Update the legend control when the imagery layers change
    // This helps ensure we have a reference to the legend control when we need to update it
    // otherwise issues would occur where the scrollbar would go to the top of the layer picker
    if (legendControl) {
      legendControl.update({
        collectionId: focusedCollectionId,
        imageryLayers
      })
    } else if (isFocusedCollectionPage) {
      // Add new legend control if it doesn't exist
      controls.push(
        new LegendControl({
          collectionId: focusedCollectionId,
          imageryLayers
        })
      )
    }
  }, [isFocusedCollectionPage, imageryLayers, focusedCollectionId])

  // Update the map view when the panelsWidth changes
  useEffect(() => {
    // When the panelsWidth changes, update the padding on the map view.
    // This will ensure when we want to center something on the map it is
    // centered in the viewable area of the map and not hidden behind a panel.

    const map = mapRef.current as OlMap
    const view = map.getView()

    // Set the new padding value with the new panelsWidth
    view.padding = [0, 0, 0, panelsWidth + sidebarWidth]
  }, [panelsWidth, sidebarWidth])

  // When the granules change, draw the granule backgrounds
  useEffect(() => {
    // If the granules haven't changed and the projection hasn't changed, don't redraw the granule backgrounds
    // Redraw the granule backgrounds if the product layer from the gibs tag has changed
    if (granulesKey === previousGranulesKey && projectionCode === previousProjectionCode) return

    // Update the previous values
    previousGranulesKey = granulesKey
    previousProjectionCode = projectionCode

    // Clear the existing granule backgrounds
    granuleBackgroundsSource.clear()

    // Clear any existing granule highlights
    unhighlightGranule(granuleHighlightsSource)

    // Clear any existing focused granules
    clearFocusedGranuleSource(mapRef.current as OlMap)

    // Clear the granule imagery layers
    granuleImageryLayerGroup.getLayers().clear()

    // Draw the granule backgrounds
    drawGranuleBackgroundsAndImagery({
      gibsLayersByCollection,
      granuleImageryLayerGroup,
      granulesMetadata: granules,
      map: mapRef.current as OlMap,
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
        map: (mapRef.current as OlMap),
        onExcludeGranule,
        setGranuleId,
        shouldMoveMap: false,
        timesIconSvg
      })
    }
  }, [granules, granulesKey, projectionCode])

  // When the spatial search changes, draw the spatial search
  useEffect(() => {
    drawSpatialSearch({
      projectionCode,
      spatialSearch,
      vectorSource: spatialDrawingSource
    })
  }, [spatialSearch])

  // When the shapefile changes, draw the shapefile
  useEffect(() => {
    if (shapefile && shapefile.file) {
      const { file, selectedFeatures } = shapefile
      const { showMbr, drawingNewLayer } = spatialSearch

      drawShapefile({
        drawingNewLayer,
        selectedFeatures,
        onChangeQuery,
        onChangeProjection,
        onMetricsMap,
        onToggleTooManyPointsModal,
        onUpdateShapefile,
        projectionCode,
        shapefile: file,
        shapefileAdded: false,
        showMbr,
        vectorSource: spatialDrawingSource
      })
    }
  }, [
    shapefile,
    spatialSearch,
    projectionCode
  ])

  // Draw the granule outlines
  granuleOutlinesLayer.on(RenderEventType.POSTRENDER as LayerRenderEventTypes, (event) => {
    const ctx = event.context as CanvasRenderingContext2D

    drawGranuleOutlines({
      ctx,
      granuleBackgroundsSource,
      map: mapRef.current as OlMap
    })
  })

  return (
    <div ref={mapElRef} id="map" className="map" />
  )
}

export default Map
