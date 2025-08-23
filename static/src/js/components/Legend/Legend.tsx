import React, { useEffect, useState } from 'react'

import LayerGroup from 'ol/layer/Group'
import TileLayer from 'ol/layer/Tile'
import {
  FaEye,
  FaEyeSlash,
  FaTimes
} from 'react-icons/fa'
import { Settings } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../Button/Button'
import ColorMap, { Colormap } from './ColorMap'
import './Legend.scss'

interface LegendProps {
  /** The colormap information */
  colorMap: Colormap
  granules: Array<{ gibsData?: Array<{ product: string }> }> | undefined
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
  console.log('🚀 ~ file: Legend.tsx:36 ~ colorMap:', colorMap)
  console.log('🚀 ~ file: Legend.tsx:90 ~ granules:', granules)
  const layers = granules && granules[0] && granules[0].gibsData ? granules[0].gibsData : null

  console.log('🚀 ~ file: Legend.tsx:90 ~ layers:', layers)

  // TODO this is an array of objects
  const [visibleLayers, setVisibleLayers] = useState<string[]>([])
  const [layerOpacities, setLayerOpacities] = useState<Record<string, number>>({})
  const [showOpacitySlider, setShowOpacitySlider] = useState<string | null>(null)
  console.log('🚀 ~ file: Legend.tsx:107 ~ visibleLayers:', visibleLayers)

  // Initialize visible layers when layers prop changes
  useEffect(() => {
    console.log('🚀 ~ file: Legend.tsx:112 ~ layers:', layers)
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
  }, [granules])

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

  /**
   * Toggles the opacity slider for a specific layer
   */
  const toggleOpacitySlider = (productName: string) => {
    setShowOpacitySlider((prev) => (prev === productName ? null : productName))
  }

  return (
    <div className="legend">
      {
        granuleImageryLayerGroup && layers && layers.length > 0 && (
          <div className="legend__layers">
            {
              layers.map((layer: { product: string }) => (
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
                      <div className="legend__layer-name">{layer.title}</div>
                    </Button>
                    <Button
                      type="button"
                      className="legend__layer-settings"
                      icon={Settings}
                      aria-label={`Adjust opacity for ${layer.product}`}
                      onClick={() => toggleOpacitySlider(layer.product)}
                    />
                  </div>
                  {
                    showOpacitySlider === layer.product && (
                      <div className="legend__opacity-slider">
                        <div className="legend__opacity-header">
                          <span>Opacity</span>
                          <Button
                            icon={FaTimes}
                            type="button"
                            className="legend__opacity-close"
                            aria-label="Close opacity slider"
                            onClick={() => toggleOpacitySlider(layer.product)}
                          />
                        </div>
                        <input
                          id={`opacity-${layer.product}`}
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          // TOdO || 1 || 0 bad things could happen if this isn't defaulted right
                          value={layerOpacities[layer.product]}
                          onChange={
                            (e) => {
                              console.log('🚀 ~ file: Legend.tsx:171 ~ e:', e)
                              updateLayerOpacity(layer.product, parseFloat(e.target.value))
                            }
                          }
                          className="legend__opacity-range"
                        />
                        {`${Math.round(layerOpacities[layer.product] * 100)} %` }
                      </div>
                    )
                  }
                  {colorMap && colorMap[layer.product] && <ColorMap colorMap={colorMap[layer.product]} />}
                </div>
              ))
            }
          </div>
        )
      }
    </div>
  )
}

export default Legend
