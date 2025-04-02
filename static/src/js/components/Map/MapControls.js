import Control from 'ol/control/Control'

import { Tooltip } from 'bootstrap'

import { projectionConfigs } from '../../util/map/crs'
import ZoomControl from './ZoomControl'
import ProjectionSwitcherControl from './ProjectionSwitcherControl'
import SpatialDrawingControl from './SpatialDrawingControl'
import LayerSwitcherControl from './LayerSwitcherControl'

/**
 * This class adds our custom map controls to the map. It wraps them in a container div which makes
 * them easier to position, and gives the site tour a container to highlight.
 */
class MapControls extends Control {
  constructor(options) {
    const element = document.createElement('div')
    element.className = 'edsc-map-controls ol-control'

    super({
      ...options,
      element
    })

    this.options = options
    const {
      CircleIcon,
      HomeIcon,
      map,
      MinusIcon,
      onChangeProjection,
      onToggleShapefileUploadModal,
      PlusIcon,
      PointIcon,
      projectionCode,
      ShapefileIcon,
      LayersIcon,
      base,
      overlays,
      mapLayers,
      onChangeLayer
    } = options

    // Create the zoom control
    const zoomControl = new ZoomControl({
      className: 'edsc-map-zoom',
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
      className: 'edsc-map-layer-switcher',
      LayersIcon,
      onChangeLayer,
      layerOptions: [
        {
          id: mapLayers.worldImagery,
          label: 'World Imagery',
          checked: base.worldImagery
        },
        {
          id: mapLayers.correctedReflectance,
          label: 'Corrected Reflectance (True Color)',
          checked: base.trueColor
        },
        {
          id: mapLayers.landWaterMap,
          label: 'Land / Water Map *',
          checked: base.landWaterMap
        },
        {
          id: mapLayers.bordersRoads,
          label: 'Borders and Roads *',
          checked: overlays.referenceFeatures
        },
        {
          id: mapLayers.coastlines,
          label: 'Coastlines *',
          checked: overlays.coastlines
        },
        {
          id: mapLayers.placeLabels,
          label: 'Place Labels *',
          checked: overlays.referenceLabels
        }
      ]
    })

    // Add the controls to the container
    // The order here matters, the first element is the top-most element
    this.element.appendChild(spatialDrawingControl.element)
    this.element.appendChild(projectionSwitcher.element)
    this.element.appendChild(zoomControl.element)
    this.element.appendChild(layerSwitcher.element)

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
