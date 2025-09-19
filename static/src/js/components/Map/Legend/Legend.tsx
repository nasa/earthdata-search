import React from 'react'

import LayerPicker from '../LayerPicker/LayerPicker'
import { ImageryLayers } from '../../../types/sharedTypes'

import './Legend.scss'

interface LegendProps {
  /** The collection ID to manage layers for */
  collectionId: string
  /** The imagery layers */
  imageryLayers: ImageryLayers
}

/**
 * Renders a legend on the map when imagery layers are present
 * @param {Object} props - The props passed into the component.
 * @param {string} props.collectionId - The collection ID to manage layers for.
 * @param {Object} props.imageryLayers - The imagery layers.
 */
export const Legend: React.FC<LegendProps> = ({
  collectionId,
  imageryLayers
}) => (
  <div className="legend" data-testid="legend">
    {
      imageryLayers.layerData.length > 0 && (
        <LayerPicker
          collectionId={collectionId}
          imageryLayers={imageryLayers}
        />
      )
    }
  </div>
)

export default Legend
