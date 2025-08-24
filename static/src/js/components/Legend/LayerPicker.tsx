import React, { useEffect, useState } from 'react'
import LayerGroup from 'ol/layer/Group'
import TileLayer from 'ol/layer/Tile'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Settings } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import Button from '../Button/Button'
import ColorMap, { Colormap } from './ColorMap'
import './Legend.scss'

interface LayerPickerProps {
  /** Array of layer data with product information */
  layers: Array<{ product: string; title?: string }> | null
  /** The OpenLayers Layer Group containing granule imagery layers */
  granuleImageryLayerGroup?: LayerGroup
  /** The colormap information for each layer */
  colorMap?: Record<string, Colormap>
}

/**
 * Component for managing layer visibility and opacity controls, and rendering colormaps
 */
export const LayerPicker: React.FC<LayerPickerProps> = ({
  layers,
  granuleImageryLayerGroup,
  colorMap
}) => {
  const [visibleLayers, setVisibleLayers] = useState<string[]>([])
  const [layerOpacities, setLayerOpacities] = useState<Record<string, number>>({})

  // Initialize visible layers when layers prop changes
  useEffect(() => {
    if (layers && Array.isArray(layers)) {
      // Extract product names from layers and set them as initially visible
      const productNames = layers.map((layer: { product: string }) => layer.product)
      setVisibleLayers(productNames)

      // Initialize opacities to 1.0 (fully opaque)
      const initialOpacities: Record<string, number> = {}
      productNames.forEach((product) => {
        initialOpacities[product] = 1.0
      })

      setLayerOpacities(initialOpacities)
    }
  }, [layers])

  /**
   * Toggles the visibility of a layer
   */
  const toggleLayerVisibility = (productName: string) => {
    setVisibleLayers((prev) => {
      const newVisibleLayers = prev.includes(productName)
        ? prev.filter((name) => name !== productName)
        : [...prev, productName]

      // Update the actual OpenLayers layer visibility
      if (granuleImageryLayerGroup) {
        const groupLayers = granuleImageryLayerGroup.getLayers()
        groupLayers.forEach((layer) => {
          if (layer instanceof TileLayer) {
            // Check if this layer belongs to the toggled product using the stored product property
            const layerProduct = layer.get('product')
            if (layerProduct === productName) {
              layer.setVisible(newVisibleLayers.includes(productName))
            }
          }
        })
      }

      return newVisibleLayers
    })
  }

  /**
   * Updates the opacity of a layer
   */
  const updateLayerOpacity = (productName: string, opacity: number) => {
    setLayerOpacities((prev) => ({
      ...prev,
      [productName]: opacity
    }))

    // Update the actual OpenLayers layer opacity
    if (granuleImageryLayerGroup) {
      const groupLayers = granuleImageryLayerGroup.getLayers()
      groupLayers.forEach((layer) => {
        if (layer instanceof TileLayer) {
          const layerProduct = layer.get('product')
          if (layerProduct === productName) {
            layer.setOpacity(opacity)
          }
        }
      })
    }
  }

  if (!layers || layers.length === 0) {
    return null
  }

  return (
    <div className="legend__layers">
      {
        layers.map((layer: { product: string; title?: string }) => (
          <div key={layer.product} className="legend__layer-item">
            <div className="legend__layer-controls">
              <Button
                type="button"
                className="legend__layer-toggle"
                icon={visibleLayers.includes(layer.product) ? FaEye : FaEyeSlash}
                aria-pressed={visibleLayers.includes(layer.product)}
                aria-label={`${visibleLayers.includes(layer.product) ? 'Hide' : 'Show'} ${layer.product}`}
                onClick={() => toggleLayerVisibility(layer.product)}
              >
                <div className="legend__layer-name">
                  {layer.title || layer.product}
                </div>
              </Button>
              <OverlayTrigger
                trigger="click"
                placement="left"
                overlay={
                  (
                    <Popover id={`opacity-popover-${layer.product}`}>
                      <Popover.Header as="h3">
                        {layer.title || layer.product}
                      </Popover.Header>
                      <Popover.Body>
                        <div className="legend__opacity-content">
                          <div className="legend__opacity-label">Opacity</div>
                          <input
                            id={`opacity-${layer.product}`}
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={layerOpacities[layer.product]}
                            onChange={
                              (e) => {
                                updateLayerOpacity(layer.product, parseFloat(e.target.value))
                              }
                            }
                            className="legend__opacity-range"
                          />
                          <div className="legend__opacity-value">
                            {`${Math.round((layerOpacities[layer.product]) * 100)} %`}
                          </div>
                        </div>
                      </Popover.Body>
                    </Popover>
                  )
                }
              >
                <Button
                  type="button"
                  className="legend__layer-settings"
                  icon={Settings}
                  aria-label={`Adjust opacity for ${layer.product}`}
                />
              </OverlayTrigger>
            </div>
            {/* Render colormap for this layer if available */}
            {
              colorMap && colorMap[layer.product] && (
                <ColorMap colorMap={colorMap[layer.product]} />
              )
            }
          </div>
        ))
      }
    </div>
  )
}

export default LayerPicker
