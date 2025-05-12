import Control from 'ol/control/Control'

import { Tooltip } from 'bootstrap'

import { projectionConfigs } from '../../util/map/crs'

import CustomAttribution from './CustomAttribution'
import LayerSwitcherControl, { LayerSwitcherControlOptions } from './LayerSwitcherControl'
import ProjectionSwitcherControl, {
  ProjectionSwitcherControlOptions
} from './ProjectionSwitcherControl'
import ScaleControl, { ScaleControlOptions } from './ScaleControl'
import SpatialDrawingControl, { SpatialDrawingControlOptions } from './SpatialDrawingControl'
import ZoomControl, { ZoomControlOptions } from './ZoomControl'

import mapDuration from '../../constants/mapDuration'

import { ProjectionCode } from '../../types/sharedTypes'

import './MapControls.scss'

type MapControlsOptions =
  LayerSwitcherControlOptions
  & ProjectionSwitcherControlOptions
  & ScaleControlOptions
  & SpatialDrawingControlOptions
  & ZoomControlOptions
  & {
    /** The base layers */
    base: {
      /** Is the World Imagery base layer applied */
      worldImagery: boolean
      /** Is the True Color base layer applied */
      trueColor: boolean
      /** Is the Land Water Map base layer applied */
      landWaterMap: boolean
    }
    /** The map layer IDs */
    mapLayers: {
      /** The world imagery layer */
      worldImagery: string
      /** The true color layer */
      trueColor: string
      /** The land water map layer */
      landWaterMap: string
      /** The borders and roads layer */
      bordersRoads: string
      /** The coastlines layer */
      coastlines: string
      /** The place labels layer */
      placeLabels: string
    }
    /** The overlay layers */
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
    /** Should the drawing controls be visible */
    showDrawingControls: boolean
  }

/**
 * This class adds our custom map controls to the map. It wraps them in a container div which makes
 * them easier to position, and gives the site tour a container to highlight.
 */
class MapControls extends Control {
  constructor(options: MapControlsOptions) {
    const element = document.createElement('div')
    element.className = 'map-controls d-flex flex-column align-items-end'

    // OpenLayers adds pointerEvents: 'auto' to the element unless we override it here
    // This ensures the user can still interact with the map under this map-controls div
    element.style.pointerEvents = 'none'

    super({
      ...options,
      element
    })

    const {
      base,
      CircleIcon,
      HomeIcon,
      isLayerSwitcherOpen,
      LayersIcon,
      map,
      mapLayers,
      MinusIcon,
      onChangeLayer,
      onChangeProjection,
      onToggleShapefileUploadModal,
      overlays,
      PlusIcon,
      PointIcon,
      projectionCode,
      setIsLayerSwitcherOpen,
      ShapefileIcon,
      showDrawingControls
    } = options

    const projectionConfig = projectionConfigs[projectionCode as keyof typeof projectionConfigs]

    // Create the zoom control
    const zoomControl = new ZoomControl({
      duration: mapDuration,
      HomeIcon,
      homeLocation: {
        center: projectionConfig.center,
        rotation: 0,
        zoom: projectionConfig.zoom
      },
      map,
      MinusIcon,
      PlusIcon
    })

    // Create the projection switcher control
    const projectionSwitcher = new ProjectionSwitcherControl({
      onChangeProjection
    })

    // Create the spatial drawing control
    const spatialDrawingControl = new SpatialDrawingControl({
      CircleIcon,
      onToggleShapefileUploadModal,
      PointIcon,
      ShapefileIcon
    })

    // Create the layer switcher control
    const layerSwitcher = new LayerSwitcherControl({
      isLayerSwitcherOpen,
      layerOptions: [{
        checked: base.worldImagery,
        id: mapLayers.worldImagery,
        label: 'World Imagery'
      }, {
        checked: base.trueColor,
        id: mapLayers.trueColor,
        label: 'Corrected Reflectance (True Color)'
      }, {
        checked: base.landWaterMap,
        id: mapLayers.landWaterMap,
        label: 'Land / Water Map *'
      }, {
        checked: overlays.bordersRoads,
        id: mapLayers.bordersRoads,
        label: 'Borders and Roads *'
      }, {
        checked: overlays.coastlines,
        id: mapLayers.coastlines,
        label: 'Coastlines *'
      }, {
        checked: overlays.placeLabels,
        id: mapLayers.placeLabels,
        label: 'Place Labels *'
      }],
      LayersIcon,
      onChangeLayer,
      setIsLayerSwitcherOpen
    })

    const scaleControl = new ScaleControl({
      map
    })

    const attribution = new CustomAttribution({
      className: 'map-controls__attribution ol-attribution'
    })
    attribution.setMap(map)

    // Add the controls to the container
    // The order here matters, the first element is the top-most element
    if (showDrawingControls) this.element.appendChild(spatialDrawingControl.getElement())
    this.element.appendChild(projectionSwitcher.getElement())
    this.element.appendChild(zoomControl.getElement())
    this.element.appendChild(layerSwitcher.getElement())
    this.element.appendChild(attribution.getElement())
    this.element.appendChild(scaleControl.getElement())

    // Enable Bootstrap tooltips on each button
    const tooltipTriggerList = [].slice.call(element.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach((tooltipTriggerEl: HTMLElement) => {
      const tooltip = new Tooltip(tooltipTriggerEl)

      // When a button is clicked, hide the tooltip.
      // This is important because these controls get recreated when the projection changes.
      // When the user switches projections and the controls are recreated, the tooltips
      // are not removed from the DOM, so they need to be manually hidden.
      tooltipTriggerEl.addEventListener('click', () => {
        tooltip.hide()
      })
    })
  }
}

export default MapControls
