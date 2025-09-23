import React, { useState } from 'react'
import classNames from 'classnames'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { FaEye, FaEyeSlash } from 'react-icons/fa'

import Form from 'react-bootstrap/Form'
import FormGroup from 'react-bootstrap/FormGroup'
import FormLabel from 'react-bootstrap/FormLabel'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'

// @ts-expect-error: This file does not have types
import { Settings } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../../Button/Button'
import ColorMap from '../../ColorMap/ColorMap'

import { Colormap } from '../../../types/sharedTypes'

import './LayerPickerItem.scss'

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
}

/**
 * Draggable layer item component
 */
export const DraggableLayerItem: React.FC<DraggableLayerItemProps> = ({
  layer,
  collectionId,
  updateMapLayerOpacity,
  handleToggleLayerVisibility
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
    'layer-picker-item',
    {
      'layer-picker-item--dragging': isDragging,
      'layer-picker-item--hidden': !isVisible
    }
  ])

  // https://github.com/clauderic/dnd-kit/issues/827
  // Since the parent is a button, we need to stop the propagation of the pointer down event on child containers
  return (
    <div
      ref={setNodeRef}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...attributes}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...listeners}
      aria-label="Drag to reorder layer"
      role="button"
      style={style}
      className={itemClassNames}
    >
      <div className="layer-picker-item__layer-content d-flex justify-content-center align-items-stretch flex-grow-1">
        <div className="d-flex justify-content-center flex-shrink-0 align-items-center border-muted border-0 border-end">
          <span
            onPointerDown={
              (event: React.PointerEvent) => {
                event.stopPropagation()
              }
            }
          >
            <Button
              type="button"
              className="p-2"
              icon={isVisible ? FaEye : FaEyeSlash}
              aria-pressed={isVisible}
              ariaLabel={`${isVisible ? 'Hide' : 'Show'} ${layer.title}`}
              onClick={
                () => {
                  handleToggleLayerVisibility(layer.product)
                }
              }
              tooltipId={`layer-visibility-toggle-tooltip-${layer.product}`}
              tooltip={`${isVisible ? 'Hide' : 'Show'} layer`}
            />
          </span>
        </div>
        <div className="flex-grow-1 p-2">
          <div
            className="d-flex flex-grow-1 flex-row justify-content-between align-items-start mb-1 gap-2 pt-1"
          >
            <h3
              className="fs-6 fw-normal d-inline mb-0 flex-grow-1"
            >
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
                          className="layer-picker-item__opacity-range"
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
              <span
                className="d-flex align-items-center"
                onPointerDown={
                  (event: React.PointerEvent) => {
                    event.stopPropagation()
                  }
                }
              >
                <Button
                  className="layer-picker-item__settings-button d-inline-flex p-0"
                  icon={Settings}
                  ariaLabel={`Adjust settings for ${layer.title}`}
                  tooltipId={`layer-settings-tooltip-${layer.product}`}
                  tooltip="Adjust layer settings"
                />
              </span>
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
