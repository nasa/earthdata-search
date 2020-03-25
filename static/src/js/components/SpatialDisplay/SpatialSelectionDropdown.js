import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import { Dropdown } from 'react-bootstrap'

import { eventEmitter } from '../../events/events'

import Button from '../Button/Button'

import './SpatialSelectionDropdown.scss'

export class SpatialSelectionDropdown extends PureComponent {
  constructor(props) {
    super(props)
    this.onItemClick = this.onItemClick.bind(this)
  }

  onItemClick(item) {
    const {
      onToggleSelectingNewGrid,
      onToggleShapefileUploadModal
    } = this.props

    if (item === 'point') {
      eventEmitter.emit('map.drawStart', {
        type: 'marker'
      })
    }

    if (item === 'rectangle') {
      eventEmitter.emit('map.drawStart', {
        type: 'rectangle'
      })
    }

    if (item === 'polygon') {
      eventEmitter.emit('map.drawStart', {
        type: 'polygon'
      })
    }

    if (item === 'file') {
      onToggleShapefileUploadModal(true)
    }

    if (item === 'grid') {
      onToggleSelectingNewGrid(true)
    }
  }

  render() {
    return (
      <Dropdown className="spatial-selection-dropdown dropdown-dark">
        <Dropdown.Toggle
          variant="inline-block"
          id="spatial-selection-dropdown"
          className="search-form__button search-form__button--dark"
        >
          <i className="fa fa-crop" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="spatial-selection-dropdown__menu">
          <Dropdown.Item
            className="spatial-selection-dropdown__button"
            as={Button}
            icon="edsc-icon-poly-open edsc-icon-fw"
            onClick={() => this.onItemClick('polygon')}
            label="Select Polygon"
          >
            <span>Polygon</span>
          </Dropdown.Item>
          <Dropdown.Item
            className="spatial-selection-dropdown__button"
            as={Button}
            icon="edsc-icon-rect-open edsc-icon-fw"
            onClick={() => this.onItemClick('rectangle')}
            label="Select Rectangle"
          >
            <span>Rectangle</span>
          </Dropdown.Item>
          <Dropdown.Item
            className="spatial-selection-dropdown__button"
            as={Button}
            icon="map-marker"
            onClick={() => this.onItemClick('point')}
            label="Select Point"
          >
            <span>Point</span>
          </Dropdown.Item>
          <Dropdown.Item
            className="spatial-selection-dropdown__button"
            as={Button}
            icon="file-o"
            onClick={() => this.onItemClick('file')}
            label="Select Shapefile"
          >
            <span>
              File
              <span className="spatial-selection-dropdown__small">(KML, KMZ, ESRI, …)</span>
            </span>
          </Dropdown.Item>
          <Dropdown.Item
            className="spatial-selection-dropdown__button"
            as={Button}
            icon="edsc-icon-globe-grid edsc-icon-fw"
            onClick={() => this.onItemClick('grid')}
            label="Select Grid Coordinates"
          >
            <span>Grid Coordinates</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

SpatialSelectionDropdown.propTypes = {
  onToggleSelectingNewGrid: PropTypes.func.isRequired,
  onToggleShapefileUploadModal: PropTypes.func.isRequired
}

export default SpatialSelectionDropdown
