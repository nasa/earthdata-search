import React from 'react'
import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'

import Legend from '../Legend/Legend'
import { ImageryLayers } from '../../../types/sharedTypes'

import './LegendControl.scss'

export type LegendControlOptions = {
  /** The collection ID to manage layers for */
  collectionId: string
  /** The imagery layers */
  imageryLayers: ImageryLayers
   /** The target element to render the control into */
   target?: HTMLElement | string
}

/**
 * OpenLayers control for displaying the Legend component
 * @param {Object} options - The options to configure the LegendControl
 * @param {string} options.collectionId - The collection ID to manage layers for.
 * @param {Object} options.imageryLayers - The imagery layers.
 * @param {HTMLElement|string} [options.target] - The DOM element or element ID where this control should be rendered instead of the default map controls container
 */
class LegendControl extends Control {
  constructor(options: LegendControlOptions) {
    const element = document.createElement('div')
    element.className = 'legend-control'

    super({
      element,
      target: options.target
    })

    // @ts-expect-error We are still on React 17
    ReactDOM.render(
      <Legend
        collectionId={options.collectionId}
        imageryLayers={options.imageryLayers}
      />,
      this.element
    )
  }
}

export default LegendControl
