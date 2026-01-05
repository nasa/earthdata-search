import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import { FaCircle, FaFile } from 'react-icons/fa'

// @ts-expect-error: This file does not have types
import { ArrowFilledDown, Map } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

// @ts-expect-error: This file does not have types
import SpatialOutline from '~Images/icons/spatial-outline.svg?react'

import { eventEmitter } from '../../events/events'

// @ts-expect-error: This file does not have types
import { getApplicationConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import spatialTypes from '../../constants/spatialTypes'
import { mapEventTypes } from '../../constants/eventTypes'
import { MODAL_NAMES } from '../../constants/modalNames'

import useEdscStore from '../../zustand/useEdscStore'
import { setOpenModalFunction } from '../../zustand/selectors/ui'

import './SpatialSelectionDropdown.scss'

type SpatialSelectionDropdownProps = {
  onMetricsSpatialSelection: (data: { item: string }) => void
}

const SpatialSelectionDropdown = (props: SpatialSelectionDropdownProps) => {
  const {
    onMetricsSpatialSelection
  } = props

  const setOpenModal = useEdscStore(setOpenModalFunction)

  const onItemClick = (spatialType: string) => {
    // Sends metrics for spatial selection usage
    onMetricsSpatialSelection({
      item: spatialType === spatialTypes.BOUNDING_BOX ? 'rectangle' : spatialType.toLowerCase()
    })

    if (spatialType === 'file') {
      setOpenModal(MODAL_NAMES.SHAPEFILE_UPLOAD)

      return
    }

    eventEmitter.emit(mapEventTypes.DRAWSTART, spatialType)
  }

  const { disableDatabaseComponents } = getApplicationConfig()

  // Parse string field `disableDatabaseComponents` disable shapefile search if true
  const disableShapefileSearch = disableDatabaseComponents === 'true'

  const spatialSelectionFileSpan = (
    <span>
      File
      <span className="spatial-selection-dropdown__small">(KML, KMZ, ESRI, …)</span>
    </span>
  )

  return (
    <Dropdown
      className="spatial-selection-dropdown"
      placement="bottom-start"
    >
      <Dropdown.Toggle
        variant="light"
        id="spatial-selection-dropdown"
        aria-label="spatial-selection-dropdown"
        data-testid="spatial-selection-dropdown"
        className="search-form__button search-form__button--secondary btn-sm gap-1"
      >
        <EDSCIcon className="spatial-selection-dropdown__icon button__icon" icon={SpatialOutline} size="14" />
        Spatial
        <EDSCIcon className="spatial-selection-dropdown__icon button__icon" icon={ArrowFilledDown} size="12" />
      </Dropdown.Toggle>
      <Dropdown.Menu className="spatial-selection-dropdown__menu">
        <Dropdown.Item
          className="spatial-selection-dropdown__button"
          as={Button}
          icon="edsc-icon-poly edsc-icon-fw"
          onClick={() => onItemClick(spatialTypes.POLYGON)}
        >
          <span>Polygon</span>
        </Dropdown.Item>
        <Dropdown.Item
          className="spatial-selection-dropdown__button"
          as={Button}
          icon="edsc-icon-rect edsc-icon-fw"
          onClick={() => onItemClick(spatialTypes.BOUNDING_BOX)}
        >
          <span>Rectangle</span>
        </Dropdown.Item>
        <Dropdown.Item
          className="spatial-selection-dropdown__button"
          as={Button}
          icon={FaCircle}
          onClick={() => onItemClick(spatialTypes.CIRCLE)}
        >
          <span>Circle</span>
        </Dropdown.Item>
        <Dropdown.Item
          className="spatial-selection-dropdown__button"
          as={Button}
          icon={Map}
          onClick={() => onItemClick(spatialTypes.POINT)}
        >
          <span>Point</span>
        </Dropdown.Item>
        <Dropdown.Item
          className="spatial-selection-dropdown__button"
          as={Button}
          icon={FaFile}
          onClick={() => onItemClick('file')}
          disabled={disableShapefileSearch}
        >
          {
            disableShapefileSearch ? (
              <OverlayTrigger
                placement="right"
                overlay={
                  (
                    <Tooltip>
                      Shapefile subsetting is currently disabled
                    </Tooltip>
                  )
                }
              >
                <div>
                  {spatialSelectionFileSpan}
                </div>
              </OverlayTrigger>
            )
              : (spatialSelectionFileSpan)

          }
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default SpatialSelectionDropdown
