import React, { useState } from 'react'
import {
  FaEye,
  FaEyeSlash,
  FaGripVertical
} from 'react-icons/fa'
// @ts-expect-error: This file does not have types
import { Settings } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import Popover from 'react-bootstrap/Popover'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import classNames from 'classnames'
import {
  Form,
  FormGroup,
  FormLabel,
  Tooltip
} from 'react-bootstrap'
import ColorMap, { Colormap } from '../ColorMap/ColorMap'
import Button from '../Button/Button'

interface DraggableLayerItemProps {
  layer: {
    product: string
    title?: string
    colormap: Colormap
    opacity: number
    isVisible: boolean
  }
  collectionId: string
  colorMap?: Colormap
  updateMapLayerOpacity: (collectionId: string, productName: string, opacity: number) => void
  handleToggleLayerVisibility: (productName: string) => void
  showDragHandle?: boolean
}

/**
 * Draggable layer item component
 */
export const DraggableLayerItem: React.FC<DraggableLayerItemProps> = ({
  layer,
  collectionId,
  updateMapLayerOpacity,
  handleToggleLayerVisibility,
  showDragHandle = true
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: layer.product })

  // Style for the draggable layer item update while dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const {
    colormap,
    opacity: layerOpacity,
    isVisible
  } = layer

  const [tempOpacity, setTempOpacity] = useState(layerOpacity)

  const itemClassNames = classNames([
    'layer-picker__layer-item',
    {
      'layer-picker__layer-item--dragging': isDragging,
      'layer-picker__layer-item--hidden': !isVisible
    }
  ])

  return (
    <div
      ref={setNodeRef}
      aria-label="Drag to reorder layer"
      role="button"
      style={style}
      className={itemClassNames}
    >
      <div className="layer-picker__layer-content d-flex justify-content-center align-items-stretch flex-grow-1">
        <div className="d-flex justify-content-center flex-shrink-0 align-items-center border-muted border-0 border-end">
          {
            showDragHandle && (
              <OverlayTrigger
                placement="top"
                overlay={
                  (
                    <Tooltip id={`drag-handle-tooltip-${layer.product}`}>
                      Drag to reorder layer
                    </Tooltip>
                  )
                }
              >
                <div
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...attributes}
                  // eslint-disable-next-line react/jsx-props-no-spreading
                  {...listeners}
                  className="d-flex p-1"
                  aria-label="Drag to reorder layer"
                  role="button"
                >
                  <FaGripVertical className="align-self-center" />
                </div>
              </OverlayTrigger>
            )
          }
          <Button
            type="button"
            className="p-1 me-1"
            icon={isVisible ? FaEye : FaEyeSlash}
            aria-pressed={isVisible}
            ariaLabel={`${isVisible ? 'Hide' : 'Show'} ${layer.title}`}
            onClick={() => handleToggleLayerVisibility(layer.product)}
            tooltipId={`layer-visibility-toggle-tooltip-${layer.product}`}
            tooltip={`${isVisible ? 'Hide' : 'Show'} layer`}
          />
        </div>
        <div className="flex-grow-1 p-2">
          <div className="d-flex flex-grow-1 flex-row  justify-content-between align-items-start mb-1 gap-2 pt-1">
            <h3 className="fs-7 fw-normal d-inline mb-0 flex-grow-1">
              {layer.title || layer.product}
            </h3>
            <OverlayTrigger
              trigger="click"
              rootClose
              placement="left"
              overlay={
                (
                  <Popover id={`opacity-popover-${layer.product}`}>
                    <Popover.Header as="h4" className="h6">
                      {layer.title || layer.product}
                    </Popover.Header>
                    <Popover.Body>
                      <FormGroup>
                        <FormLabel>Opacity</FormLabel>
                        <Form.Range
                          id={`opacity-${layer.product}`}
                          min="0"
                          max="1"
                          step="0.01"
                          value={tempOpacity}
                          onChange={
                            (e) => {
                              setTempOpacity(parseFloat((e.target as HTMLInputElement).value))
                            }
                          }
                          onMouseUp={
                            (e) => {
                              updateMapLayerOpacity(
                                collectionId,
                                layer.product,
                                parseFloat((e.target as HTMLInputElement).value)
                              )
                            }
                          }
                          className="layer-picker__opacity-range"
                        />
                        <div className="d-flex justify-content-end mt-2">
                          <span>
                            {`${Math.round(tempOpacity * 100)} %`}
                          </span>
                        </div>
                      </FormGroup>
                    </Popover.Body>
                  </Popover>
                )
              }
            >
              <Button
                type="button"
                className="draggable-layer-item__settings-button d-inline-flex p-1"
                icon={Settings}
                ariaLabel={`Adjust settings for ${layer.title}`}
                tooltipId={`layer-settings-tooltip-${layer.product}`}
                tooltip="Adjust layer settings"
              />
            </OverlayTrigger>
          </div>
          {/* Render colormap for this layer if available */}
          {
            colormap && (
              <ColorMap colorMap={colormap} />
            )
          }
        </div>
      </div>
    </div>
  )
}

export default DraggableLayerItem
