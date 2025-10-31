import React from 'react'
import ReactDOM from 'react-dom/client'
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
  collectionId: string

  imageryLayers: ImageryLayers

  layerPickerRoot: ReactDOM.Root

  constructor(options: LegendControlOptions) {
    const element = document.createElement('div')
    element.className = 'legend-control'

    super({
      element,
      target: options.target
    })

    this.collectionId = options.collectionId
    this.imageryLayers = options.imageryLayers

    this.layerPickerRoot = ReactDOM.createRoot(this.element)

    this.render()
  }

  public render() {
    const isEmpty = this.imageryLayers.layerData.length === 0
    if (isEmpty) {
      return
    }

    this.layerPickerRoot.render(
      <Legend
        collectionId={this.collectionId}
        imageryLayers={this.imageryLayers}
      />
    )
  }

  // Update the legend control
  // to persist a reference to it for the layer picker when we update the imagery layers using it
  update(options: Partial<LegendControlOptions>) {
    if (options.collectionId !== undefined) {
      this.collectionId = options.collectionId
    }

    if (options.imageryLayers !== undefined) {
      this.imageryLayers = options.imageryLayers
    }

    this.render()
  }
}

export default LegendControl
