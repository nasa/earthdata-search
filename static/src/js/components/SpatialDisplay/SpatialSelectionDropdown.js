import React, { PureComponent } from 'react'
// import PropTypes from 'prop-types'

import Dropdown from 'react-bootstrap/Dropdown'

import './SpatialSelectionDropdown.scss'

export default class SpatialSelectionDropdown extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      open: false
    }

    this.onToggleClick = this.onToggleClick.bind(this)
  }

  /**
   * Opens or closes the dropdown depending on the current state
   */
  onToggleClick() {
    const { open } = this.state

    this.setState({
      open: !open
    })
  }

  render() {
    const {
      open
      // temporal
    } = this.state

    return (
      <Dropdown show={open} className="spatial-selection-dropdown">
        <Dropdown.Toggle
          variant="inline-block"
          id="spatial-selection-dropdown"
          className="search-form__button"
          onClick={this.onToggleClick}
        >
          <i className="fa fa-crop" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="spatial-selection-dropdown__menu">
          <Dropdown.Item className="spatial-selection-dropdown__button">
            <i className="edsc-icon-poly-open edsc-icon-fw spatial-selection-dropdown__icon" />
            Polygon
          </Dropdown.Item>
          <Dropdown.Item className="spatial-selection-dropdown__button">
            <i className="edsc-icon-rect-open edsc-icon-fw spatial-selection-dropdown__icon" />
            Rectangle
          </Dropdown.Item>
          <Dropdown.Item className="spatial-selection-dropdown__button">
            <i className="fa fa-map-marker spatial-selection-dropdown__icon" />
            Point
          </Dropdown.Item>
          <Dropdown.Item className="spatial-selection-dropdown__button">
            <i className="fa fa-file-o spatial-selection-dropdown__icon" />
            File
          </Dropdown.Item>
          <Dropdown.Item className="spatial-selection-dropdown__button">
            <i className="edsc-icon-globe-grid edsc-icon-fw spatial-selection-dropdown__icon" />
            Grid Coordinates
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}
