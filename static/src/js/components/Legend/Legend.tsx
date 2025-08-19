import React from 'react'

import LayerGroup from 'ol/layer/Group'
import { Colormap } from '../ColorMap/ColorMap'
import LayerPicker from '../LayerPicker/LayerPicker'
import './Legend.scss'

// TODO feels like we should maybe just get rid of the component its essentially a container now
interface LegendProps {
  /** The collection ID to manage layers for */
  collectionId: string
  /** The colormap information */
  colorMap: Record<string, Colormap>
  /** The OpenLayers Layer Group containing granule imagery layers */
  granuleImageryLayerGroup?: LayerGroup
}

/**
 * Renders a legend on the map when a colormap is present
 * @param {Object} props - The props passed into the component.
 * @param {string} props.collectionId - The collection ID to manage layers for.
 * @param {Object} props.colorMap - The colormap information.
 * @param {Object} props.granuleImageryLayerGroup - The OL Layer Group containing granule imagery layers.
 */
export const Legend: React.FC<LegendProps> = ({
  collectionId,
  colorMap,
  granuleImageryLayerGroup
}) => (
  <div className="legend" data-testid="legend">
    {
      granuleImageryLayerGroup && (
        <LayerPicker
          collectionId={collectionId}
          granuleImageryLayerGroup={granuleImageryLayerGroup}
          colorMap={colorMap}
        />
      )
    }
  </div>
)

export default Legend
