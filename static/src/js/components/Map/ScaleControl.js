import Control from 'ol/control/Control'
import ScaleLine from 'ol/control/ScaleLine'

import './ScaleControl.scss'

// This class adds the metric and imperial scale controls to the map
class ScaleControl extends Control {
  constructor(options) {
    const element = document.createElement('div')

    super({
      ...options,
      element
    })

    this.className = 'scale-control'
    element.className = `${this.className} d-flex align-items-end flex-column`

    const { map } = options

    // Create the scale control
    const scaleMetric = new ScaleLine({
      className: `${this.className}__scale--metric ${this.className}__scale`,
      units: 'metric'
    })
    scaleMetric.setMap(map)

    const scaleImperial = new ScaleLine({
      className: `${this.className}__scale--imperial ${this.className}__scale`,
      units: 'imperial'
    })
    scaleImperial.setMap(map)

    // Add the scale controls to the element
    this.element.appendChild(scaleMetric.element)
    this.element.appendChild(scaleImperial.element)
  }
}

export default ScaleControl
