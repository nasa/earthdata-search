import React from 'react'

import LayerGroup from 'ol/layer/Group'
import { Colormap } from './ColorMap'
import LayerPicker from './LayerPicker'
import './Legend.scss'

interface LegendProps {
  /** The colormap information */
  colorMap: Record<string, Colormap>
  granules: Array<{ gibsData?: Array<{ product: string; title?: string }> }> | undefined
  /** The OpenLayers Layer Group containing granule imagery layers */
  granuleImageryLayerGroup?: LayerGroup
}

/**
 * Renders a legend on the map when a colormap is present
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.colorMap - The colormap information.
 * @param {Array} props.granules - Array of granule metadata.
 * @param {Object} props.granuleImageryLayerGroup - The OL Layer Group containing granule imagery layers.
 */
export const Legend: React.FC<LegendProps> = ({
  colorMap,
  granules,
  granuleImageryLayerGroup
}) => {
  const layers = granules && granules[0] && granules[0].gibsData ? granules[0].gibsData : null

  return (
    <div className="legend">
      {
        granuleImageryLayerGroup && layers && layers.length > 0 && (
          <LayerPicker
            layers={layers}
            granuleImageryLayerGroup={granuleImageryLayerGroup}
            colorMap={colorMap}
          />
        )
      }
    </div>
  )
}

export default Legend
