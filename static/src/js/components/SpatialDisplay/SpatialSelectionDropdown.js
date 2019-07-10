import React, { PureComponent } from 'react'
import { PropTypes } from 'prop-types'
import { Dropdown } from 'react-bootstrap'

import { eventEmitter } from '../../events/events'

import './SpatialSelectionDropdown.scss'

export class SpatialSelectionDropdown extends PureComponent {
  constructor(props) {
    super(props)
    this.onItemClick = this.onItemClick.bind(this)
  }

  onItemClick(item) {
    const {
      onToggleSelectingNewGrid
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

    if (item === 'grid') {
      onToggleSelectingNewGrid(true)
    }
  }

  render() {
    return (
      <Dropdown className="spatial-selection-dropdown">
        <Dropdown.Toggle
          variant="inline-block"
          id="spatial-selection-dropdown"
          className="search-form__button"
        >
          <i className="fa fa-crop" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="spatial-selection-dropdown__menu">
          <Dropdown.Item
            className="spatial-selection-dropdown__button"
            onClick={() => this.onItemClick('polygon')}
          >
            <i className="edsc-icon-poly-open edsc-icon-fw spatial-selection-dropdown__icon" />
            Polygon
          </Dropdown.Item>
          <Dropdown.Item
            className="spatial-selection-dropdown__button"
            onClick={() => this.onItemClick('rectangle')}
          >
            <i className="edsc-icon-rect-open edsc-icon-fw spatial-selection-dropdown__icon" />
            Rectangle
          </Dropdown.Item>
          <Dropdown.Item
            className="spatial-selection-dropdown__button"
            onClick={() => this.onItemClick('point')}
          >
            <i className="fa fa-map-marker spatial-selection-dropdown__icon" />
            Point
          </Dropdown.Item>
          <Dropdown.Item className="spatial-selection-dropdown__button">
            <i className="fa fa-file-o spatial-selection-dropdown__icon" />
            File
          </Dropdown.Item>
          <Dropdown.Item
            className="spatial-selection-dropdown__button"
            onClick={() => this.onItemClick('grid')}
          >
            <i className="edsc-icon-globe-grid edsc-icon-fw spatial-selection-dropdown__icon" />
            Grid Coordinates
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

SpatialSelectionDropdown.propTypes = {
  onToggleSelectingNewGrid: PropTypes.func.isRequired
}

export default SpatialSelectionDropdown
