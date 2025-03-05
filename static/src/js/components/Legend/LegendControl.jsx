import React from 'react'
import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'
import Legend from './Legend'

/**
 * OpenLayers control for displaying the Legend component
 * @param {Object} options - The options to configure the LegendControl
 * @param {Object} options.colorMap - The colormap data to display in the legend
 * @param {Boolean} options.isFocusedCollectionPage - Whether the current page is a focused collection page
 * @param {HTMLElement} options.target - The target element for the control
 */
export class LegendControl extends Control {
  constructor(options) {
    const element = document.createElement('div')
    element.className = 'ol-control edsc-map-legend'

    super({
      element,
      target: options.target
    })

    this.colorMap = options.colorMap
    this.isFocusedCollectionPage = options.isFocusedCollectionPage
    this.render()
  }

  render() {
    if (this.isFocusedCollectionPage && this.colorMap && Object.keys(this.colorMap).length > 0) {
      console.log('rendering legend')
      ReactDOM.render(
        <Legend colorMap={this.colorMap} />,
        this.element
      )
    } else {
      console.log('unmounting legend')
      ReactDOM.render(null, this.element)
    }
  }
}
