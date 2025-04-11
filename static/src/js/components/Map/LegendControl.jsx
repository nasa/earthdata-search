import React from 'react'
import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'
import Legend from '../Legend/Legend'

import './LegendControl.scss'

/**
 * OpenLayers control for displaying the Legend component
 * @param {Object} options - The options to configure the LegendControl
 * @param {Object} options.colorMap - The colormap data to display in the legend
 * @param {HTMLElement|string} [options.target] - The DOM element or element ID where this control should be rendered instead of the default map controls container
 */
class LegendControl extends Control {
  constructor(options) {
    const element = document.createElement('div')
    element.className = 'legend-control'

    super({
      element,
      target: options.target
    })

    this.colorMap = options.colorMap
    ReactDOM.render(
      <Legend colorMap={this.colorMap} />,
      this.element
    )
  }
}

export default LegendControl
