import React, { useState, useEffect } from 'react'
// https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
// Closest center collision detection algorithm is used to determine if the item is being dragged over another item
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

// Restricts the drag and drop to the parent element and moving on the vertical axis`
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'

import { FaCompressAlt, FaLayerGroup } from 'react-icons/fa'
import { triggerKeyboardShortcut } from '../../../util/triggerKeyboardShortcut'

import LayerPickerItem from './LayerPickerItem'
import Button from '../../Button/Button'
import { ImageryLayers } from '../../../types/sharedTypes'

import './LayerPicker.scss'

interface LayerPickerProps {
  /** The collection ID to manage layers for */
  collectionId: string
  /** The imagery layers */
  imageryLayers: ImageryLayers
}

/**
 * Component for managing layer visibility and opacity controls, and rendering colormaps
 */
export const LayerPicker: React.FC<LayerPickerProps> = ({
  collectionId,
  imageryLayers
}) => {
  // State for whether the layer-picker is open or hidden
  const [layersHidden, setLayersHidden] = useState(false)

  // Configure sensors for drag and drop
  // Pointer is for the mouse
  // Keyboard dragging can be used with `Enter` key first and then the arrow keys to move the item up and down and hit
  // `Enter` to confirm the move
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )
  const {
    layerData,
    setMapLayersOrder,
    toggleLayerVisibility,
    setLayerOpacity
  } = imageryLayers

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
    toggleLayerVisibility(collectionId, productName)
  }

  /**
   * Handles the end of a drag operation
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      // Get the current layers
      const currentLayers = [...layerData]

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
    setLayerOpacity(collectionConceptId, productName, opacity)
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
        icon={FaLayerGroup}
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
            items={imageryLayers.layerData.map((layer) => layer.product)}
            strategy={verticalListSortingStrategy}
          >
            <div className="layer-picker__layers overflow-auto">
              {
                layerData.map((layer) => (
                  <LayerPickerItem
                    key={layer.product}
                    layer={layer}
                    collectionId={collectionId}
                    updateMapLayerOpacity={updateMapLayerOpacity}
                    handleToggleLayerVisibility={handleToggleLayerVisibility}
                    showDragHandle={layerData.length > 1}
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
