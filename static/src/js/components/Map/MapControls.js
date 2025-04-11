import Control from 'ol/control/Control'
import Attribution from 'ol/control/Attribution'

import { Tooltip } from 'bootstrap'

import { projectionConfigs } from '../../util/map/crs'

import LayerSwitcherControl from './LayerSwitcherControl'
import ProjectionSwitcherControl from './ProjectionSwitcherControl'
import ScaleControl from './ScaleControl'
import SpatialDrawingControl from './SpatialDrawingControl'
import ZoomControl from './ZoomControl'

import './MapControls.scss'

/**
 * This class adds our custom map controls to the map. It wraps them in a container div which makes
 * them easier to position, and gives the site tour a container to highlight.
 */
class MapControls extends Control {
  constructor(options) {
    const element = document.createElement('div')
    element.className = 'map-controls d-flex flex-column align-items-end'

    super({
      ...options,
      element
    })

    this.options = options
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

    // Create the zoom control
    const zoomControl = new ZoomControl({
      duration: 250,
      HomeIcon,
      homeLocation: {
        center: projectionConfigs[projectionCode].center,
        rotation: 0,
        zoom: projectionConfigs[projectionCode].zoom
      },
      map,
      MinusIcon,
      PlusIcon,
      target: options.map.targetElement
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

    const attribution = new Attribution({
      className: 'map-controls__attribution ol-attribution'
    })
    attribution.setMap(map)

    // Add the controls to the container
    // The order here matters, the first element is the top-most element
    if (showDrawingControls) this.element.appendChild(spatialDrawingControl.element)
    this.element.appendChild(projectionSwitcher.element)
    this.element.appendChild(zoomControl.element)
    this.element.appendChild(layerSwitcher.element)
    this.element.appendChild(attribution.element)
    this.element.appendChild(scaleControl.element)

    // Enable Bootstrap tooltips on each button
    const tooltipTriggerList = [].slice.call(element.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
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
