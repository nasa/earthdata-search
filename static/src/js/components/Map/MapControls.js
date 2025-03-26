import Control from 'ol/control/Control'

import { projectionConfigs } from '../../util/map/crs'
import ZoomControl from './ZoomControl'
import ProjectionSwitcherControl from './ProjectionSwitcherControl'

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
      HomeIcon,
      map,
      MinusIcon,
      onChangeProjection,
      PlusIcon,
      projectionCode
    } = options

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
    const projectionSwitcher = new ProjectionSwitcherControl({
      onChangeProjection
    })

    // The order here matters, the first element is the top-most element
    this.element.appendChild(projectionSwitcher.element)
    this.element.appendChild(zoomControl.element)
  }
}

export default MapControls
