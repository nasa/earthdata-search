import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'

import { FaCompressAlt, FaExpandAlt } from 'react-icons/fa'
import { Colormap } from '../ColorMap/ColorMap'
import useEdscStore from '../../zustand/useEdscStore'
import DraggableLayerItem from './DraggableLayerItem'
import './LayerPicker.scss'
import Button from '../Button/Button'
import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'

interface LayerPickerProps {
  /** The collection ID to manage layers for */
  collectionId: string
  /** The OpenLayers Layer Group containing granule imagery layers */
  /** The colormap information for each layer */
  colorMap?: Record<string, Colormap>
}

/**
 * Component for managing layer visibility and opacity controls, and rendering colormaps
 */
export const LayerPicker: React.FC<LayerPickerProps> = ({
  collectionId,
  colorMap
}) => {
  const [layersHidden, setLayersHidden] = useState(false)

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  // Get map layers and functions from Zustand store
  const mapLayers = useEdscStore((state) => state.map.mapLayers[collectionId] || [])
  const {
    toggleLayerVisibility,
    setMapLayersOrder,
    updateLayerOpacity
  } = useEdscStore((state) => state.map)

  /**
   * Handles keyup events for keyboard shortcuts
   */
  const onWindowKeyup = (event: KeyboardEvent) => {
    const toggleLayers = () => setLayersHidden(!layersHidden)

    triggerKeyboardShortcut({
      event,
      shortcutKey: 'l',
      shortcutCallback: toggleLayers
    })
  }

  // Sets up event listener for keyup event
  useEffect(() => {
    window.addEventListener('keyup', onWindowKeyup)

    return () => {
      window.removeEventListener('keyup', onWindowKeyup)
    }
  }, [layersHidden])

  /**
   * Toggles the visibility of a layer using the Zustand store
   */
  const handleToggleLayerVisibility = (productName: string) => {
    // Update the Zustand store
    toggleLayerVisibility(collectionId, productName)
  }

  /**
   * Handles the end of a drag operation
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // Get the current layers
      const currentLayers = [...mapLayers]

      // Find the indices
      const oldIndex = currentLayers.findIndex((layer) => layer.product === active.id)
      const newIndex = currentLayers.findIndex((layer) => layer.product === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        // Create new array with reordered layers
        const [movedLayer] = currentLayers.splice(oldIndex, 1)
        currentLayers.splice(newIndex, 0, movedLayer)

        // Update the entire state with the new order
        setMapLayersOrder(collectionId, currentLayers)
      }
    }
  }

  /**
   * Updates the opacity of a layer
   */
  const updateMapLayerOpacity = (
    collectionConceptId: string,
    productName: string,
    opacity: number
  ) => {
    // Updates the Zustand store
    updateLayerOpacity(collectionConceptId, productName, opacity)
  }

  if (layersHidden) {
    return (
      <Button
        className="map-button"
        variant="naked"
        onClick={
          () => {
            setLayersHidden(false)
          }
        }
        icon={FaExpandAlt}
        iconOnly
        iconSize="14px"
        ariaLabel="Show layers"
        tooltipId="minimize-layers-tooltip"
        tooltip="Show visualization layers"
        tooltipPlacement="left"
      />
    )
  }

  return (
    <div>
      <header className="d-flex gap-2 align-items-center justify-content-between p-2 border-0 border-bottom border-muted">
        <h2 className="h6 mb-0">Visualization Layers</h2>
        <Button
          variant="naked"
          onClick={
            () => {
              setLayersHidden(true)
            }
          }
          icon={FaCompressAlt}
          iconOnly
          ariaLabel="Hide layers"
          tooltipId="hide-layers-tooltip"
          tooltip="Hide visualization layers"
          tooltipPlacement="left"
        />
      </header>
      <div className="layer-picker__layers overflow-auto">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          modifiers={[restrictToParentElement, restrictToVerticalAxis]}
        >
          <SortableContext
            items={mapLayers.map((layer) => layer.product)}
            strategy={verticalListSortingStrategy}
          >
            <div className="layer-picker__layers overflow-auto">
              {
                mapLayers.map((layer) => (
                  <DraggableLayerItem
                    key={layer.product}
                    layer={layer}
                    collectionId={collectionId}
                    colorMap={colorMap}
                    updateMapLayerOpacity={updateMapLayerOpacity}
                    handleToggleLayerVisibility={handleToggleLayerVisibility}
                    showDragHandle={mapLayers.length > 1}
                  />
                ))
              }
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  )
}

export default LayerPicker
