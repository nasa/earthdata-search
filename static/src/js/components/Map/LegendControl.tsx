import React from 'react'
import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'
import LayerGroup from 'ol/layer/Group'

import Legend from '../Legend/Legend'
import { Colormap } from '../ColorMap/ColorMap'

import './LegendControl.scss'

export type LegendControlOptions = {
  /** The collection ID to manage layers for */
  collectionId: string
  /** The colormap information by product name */
  colorMap: Record<string, Colormap>
  /** The OpenLayers Layer Group containing granule imagery layers */
  granuleImageryLayerGroup?: LayerGroup
  /** The target element to render the control into */
  target?: HTMLElement | string
}

/**
 * OpenLayers control for displaying the Legend component
 * @param {Object} options - The options to configure the LegendControl
 * @param {string} options.collectionId - The collection ID to manage layers for.
 * @param {Object} options.colorMap - The colormap data to display in the legend
 * @param {Object} [options.granuleImageryLayerGroup] - The OL Layer Group containing granule imagery layers
 * @param {HTMLElement|string} [options.target] - The DOM element or element ID where this control should be rendered instead of the default map controls container
 */
class LegendControl extends Control {
  collectionId: string

  imageryLayers: any

  granuleImageryLayerGroup?: LayerGroup

  constructor(options: LegendControlOptions) {
    const element = document.createElement('div')
    element.className = 'legend-control'

    super({
      element,
      target: options.target
    })

    this.collectionId = options.collectionId
    this.imageryLayers = options.imageryLayers
    this.granuleImageryLayerGroup = options.granuleImageryLayerGroup

    this.render()
  }

  // TODO this should probably be private
  public render() {
    const isEmpty = this.granuleImageryLayerGroup?.getLayers().getLength() === 0
    if (isEmpty) {
      // Don't render the legend if the granule imagery layer group is empty
      console.log('granule imagery layer group is empty')

      return
    }

    // @ts-expect-error We are still on React 17
    console.log('🚀 ~ file: LegendControl.tsx:68 ~ LegendControl ~ imageryLayers:', this.imageryLayers)
    ReactDOM.render(
      <Legend
        collectionId={this.collectionId}
        imageryLayers={this.imageryLayers}
        granuleImageryLayerGroup={this.granuleImageryLayerGroup}
      />,
      this.element
    )
  }

  update(options: Partial<LegendControlOptions>) {
    console.log('running update in legend control')
    if (options.collectionId !== undefined) {
      this.collectionId = options.collectionId
    }

    if (options.colorMap !== undefined) {
      this.colorMap = options.colorMap
    }

    if (options.granuleImageryLayerGroup !== undefined) {
      this.granuleImageryLayerGroup = options.granuleImageryLayerGroup
    }

    this.render()
  }
}

export default LegendControl
