import React from 'react'
import ReactDOM from 'react-dom'
import Control from 'ol/control/Control'
import LayerGroup from 'ol/layer/Group'

import Legend, { Colormap } from '../Legend/Legend'

import './LegendControl.scss'

export type LegendControlOptions = {
  /** The colormap to display */
  colorMap: Colormap
  // TODO I should probably make this type more defined
  granules: Array<{ gibsData?: Array<{ product: string }> }> | undefined
  /** The OpenLayers Layer Group containing granule imagery layers */
  granuleImageryLayerGroup?: LayerGroup
  /** The target element to render the control into */
  target?: HTMLElement | string
}

/**
 * OpenLayers control for displaying the Legend component
 * @param {Object} options - The options to configure the LegendControl
 * @param {Object} options.colorMap - The colormap data to display in the legend
 * @param {Object} [options.granuleImageryLayerGroup] - The OL Layer Group containing granule imagery layers
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

    if (Object.keys(options.colorMap).length === 0) return
    console.log('🚀 ~ file: LegendControl.tsx:37 ~ LegendControl ~ options.granules:', options.granules)
    // @ts-expect-error We are still on React 17
    ReactDOM.render(
      <Legend
        colorMap={options.colorMap}
        granules={options.granules}
        granuleImageryLayerGroup={options.granuleImageryLayerGroup}
      />,
      this.element
    )
  }
}

export default LegendControl
