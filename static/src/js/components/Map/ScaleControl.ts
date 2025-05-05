import { Map } from 'ol'
import Control from 'ol/control/Control'

import CustomScaleLine from './CustomScaleLine'

import './ScaleControl.scss'

export type ScaleControlOptions = {
  /** The map to attach the control to */
  map: Map
}

// This class adds the metric and imperial scale controls to the map
class ScaleControl extends Control {
  /** The class name for the control */
  className: string

  constructor(options: ScaleControlOptions) {
    const element = document.createElement('div')

    super({
      ...options,
      element
    })

    this.className = 'scale-control'
    element.className = `${this.className} d-flex align-items-end flex-column`

    const { map } = options

    // Create the scale control
    const scaleMetric = new CustomScaleLine({
      className: `${this.className}__scale--metric ${this.className}__scale`,
      units: 'metric'
    })
    scaleMetric.setMap(map)

    const scaleImperial = new CustomScaleLine({
      className: `${this.className}__scale--imperial ${this.className}__scale`,
      units: 'imperial'
    })
    scaleImperial.setMap(map)

    // Add the scale controls to the element
    this.element.appendChild(scaleMetric.getElement())
    this.element.appendChild(scaleImperial.getElement())
  }

  /**
   * Get the element for this control
   * @returns {HTMLElement} The element for this control
   */
  getElement() {
    return this.element
  }
}

export default ScaleControl
