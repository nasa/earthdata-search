import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { useLocation } from 'react-router-dom'

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
import { routes } from '../../constants/routes'

import useEdscStore from '../../zustand/useEdscStore'
import { setOpenModalFunction } from '../../zustand/selectors/ui'

import './SpatialSelectionDropdown.scss'

type SpatialSelectionDropdownProps = {
  searchParams: {
    [key: string]: string
  }
  onChangeUrl: (url: string) => void
  onChangePath: (path: string) => void
  onMetricsSpatialSelection: (data: { item: string }) => void
}

const SpatialSelectionDropdown = (props: SpatialSelectionDropdownProps) => {
  const {
    searchParams,
    onChangeUrl,
    onChangePath,
    onMetricsSpatialSelection
  } = props

  const setStartDrawing = useEdscStore((state) => state.home.setStartDrawing)
  const setOpenModal = useEdscStore(setOpenModalFunction)

  const location = useLocation()
  const { pathname } = location
  const isHomePage = pathname === routes.HOME

  const onItemClick = (spatialType: string) => {
    // Sends metrics for spatial selection usage
    onMetricsSpatialSelection({
      item: spatialType === spatialTypes.BOUNDING_BOX ? 'rectangle' : spatialType.toLowerCase()
    })

    // If the user is on the home page, redirect to the search page with the spatial type as a query parameter
    if (isHomePage) {
      // Build a new URL object with the current origin and the search path
      const newUrl = new URL('/search', window.location.origin)
      const params = new URLSearchParams(searchParams)

      newUrl.search = params.toString()
      const urlString = `/search${newUrl.search}`

      // Change the URL to the new value
      onChangeUrl(urlString)

      // Update the store to the new URL values
      onChangePath(urlString)

      // Set the startDrawing context to the selected spatial type
      setStartDrawing(spatialType)
    } else {
      if (spatialType === 'file') {
        setOpenModal(MODAL_NAMES.SHAPEFILE_UPLOAD)

        return
      }

      eventEmitter.emit(mapEventTypes.DRAWSTART, spatialType)
    }
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
