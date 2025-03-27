import React from 'react'
import { PropTypes } from 'prop-types'
import Dropdown from 'react-bootstrap/Dropdown'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

import {
  FaCrop,
  FaCircle,
  FaFile
} from 'react-icons/fa'

import { Map } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { eventEmitter } from '../../events/events'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import spatialTypes from '../../constants/spatialTypes'
import { mapEventTypes } from '../../constants/eventTypes'

import './SpatialSelectionDropdown.scss'

const SpatialSelectionDropdown = (props) => {
  const {
    onToggleShapefileUploadModal,
    onMetricsSpatialSelection
  } = props

  const onItemClick = (spatialType) => {
    // Sends metrics for spatial selection usage
    onMetricsSpatialSelection({
      item: spatialType === spatialTypes.BOUNDING_BOX ? 'rectangle' : spatialType.toLowerCase()
    })

    if (spatialType === 'file') {
      onToggleShapefileUploadModal(true)

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
    >
      <Dropdown.Toggle
        variant="light"
        id="spatial-selection-dropdown"
        aria-label="spatial-selection-dropdown"
        data-testid="spatial-selection-dropdown"
        className="search-form__button search-form__button--dark"
      >
        <EDSCIcon className="spatial-selection-dropdown__icon button__icon" icon={FaCrop} size="0.825rem" />
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

SpatialSelectionDropdown.propTypes = {
  onMetricsSpatialSelection: PropTypes.func.isRequired,
  onToggleShapefileUploadModal: PropTypes.func.isRequired
}

export default SpatialSelectionDropdown
