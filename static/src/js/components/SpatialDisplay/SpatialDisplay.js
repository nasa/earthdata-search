import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Row } from 'react-bootstrap'

import { availableSystems, findGridByName } from '../../util/grid'

import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'
import SpatialDisplayEntry from './SpatialDisplayEntry'

import './SpatialDisplay.scss'

const trimSpatial = (values, decimalPlaces = 4) => {
  if (!values || values[0] === '') {
    return values
  }
  return values.map(value => parseFloat(value).toFixed(decimalPlaces))
}

class SpatialDisplay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      boundingBoxSearch: '',
      grid: '',
      gridCoords: '',
      pointSearch: '',
      polygonSearch: ''
    }

    this.onChangeGridType = this.onChangeGridType.bind(this)
    this.onChangeGridCoords = this.onChangeGridCoords.bind(this)
    this.onGridRemove = this.onGridRemove.bind(this)
    this.onSpatialRemove = this.onSpatialRemove.bind(this)
    this.onSubmitGridCoords = this.onSubmitGridCoords.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {
      boundingBoxSearch,
      grid,
      gridCoords,
      pointSearch,
      polygonSearch
    } = this.props

    if (pointSearch !== nextProps.pointSearch) {
      this.setState({ pointSearch: nextProps.pointSearch })
    }
    if (boundingBoxSearch !== nextProps.boundingBoxSearch) {
      this.setState({ boundingBoxSearch: nextProps.boundingBoxSearch })
    }
    if (polygonSearch !== nextProps.polygonSearch) {
      this.setState({ polygonSearch: nextProps.polygonSearch })
    }
    if (grid !== nextProps.grid) {
      this.setState({ grid: nextProps.grid })
    }
    if (gridCoords !== nextProps.gridCoords) {
      this.setState({ gridCoords: nextProps.gridCoords })
    }
  }

  onChangeGridType(e) {
    const { onChangeQuery } = this.props
    onChangeQuery({
      grid: e.target.value
    })
    e.preventDefault()
  }

  onChangeGridCoords(e) {
    this.setState({
      gridCoords: e.target.value
    })
  }

  onGridRemove() {
    const {
      onRemoveGridFilter
    } = this.props

    onRemoveGridFilter()
  }

  onSpatialRemove() {
    const {
      onRemoveSpatialFilter
    } = this.props

    onRemoveSpatialFilter()
  }

  onSubmitGridCoords(e) {
    const { onGranuleGridCoords } = this.props
    if (e.type === 'blur' || e.key === 'Enter') {
      onGranuleGridCoords(e.target.value)
    }
    e.preventDefault()
  }

  render() {
    const {
      drawingNewLayer,
      selectingNewGrid
    } = this.props

    const {
      boundingBoxSearch,
      grid,
      gridCoords,
      pointSearch,
      polygonSearch
    } = this.state

    const contents = []
    const items = []
    let entry

    if (selectingNewGrid || grid) {
      console.warn('getting here')
      const entry = (
        <SpatialDisplayEntry>
          <Form.Row className="spatial-display__form-row">
            <Form.Group className="spatial-display__form-group spatial-display__form-group--system">
              <Form.Label srOnly>
                Coordinate System
              </Form.Label>
              <Form.Control
                as="select"
                onChange={this.onChangeGridType}
                size="sm"
                value={grid}
              >
                <option value="">Coordinate System...</option>
                {
                  availableSystems.map(system => (
                    <option
                      key={system.name}
                      value={system.name}
                    >
                      {system.label}
                    </option>
                  ))
                }
              </Form.Control>
            </Form.Group>
            <Form.Group className="spatial-display__form-group spatial-display__form-group--coords">
              <Form.Label srOnly>
                Coordinates
              </Form.Label>
              <Form.Control
                className="spatial-display__text-input"
                type="text"
                placeholder="Coordinates..."
                size="sm"
                value={gridCoords}
                onChange={this.onChangeGridCoords}
                onBlur={this.onSubmitGridCoords}
                onKeyUp={this.onSubmitGridCoords}
              />
            </Form.Group>
          </Form.Row>
        </SpatialDisplayEntry>
      )
      const gridContents = (
        <FilterStackContents
          key="filter__grid"
          body={entry}
          title="Grid"
        />
      )

      let hint = 'Select a coordinate system'

      if (grid) {
        const selectedGrid = findGridByName(grid)
        const {
          axis0label,
          axis1label
        } = selectedGrid

        hint = `Enter ${axis0label} and ${axis1label} coordinates separated by spaces, e.g. "2,3 5,7 8,8"`
      }

      items.push((
        <FilterStackItem
          key="item__grid"
          icon="edsc-globe"
          title="Grid"
          hint={hint}
          onRemove={this.onGridRemove}
        >
          {gridContents}
        </FilterStackItem>
      ))
    }

    if ((pointSearch && !drawingNewLayer) || drawingNewLayer === 'marker') {
      entry = (
        <SpatialDisplayEntry>
          <Form.Row className="spatial-display__form-row">
            <Form.Group as={Row} className="spatial-display__form-group spatial-display__form-group--coords">
              <Form.Label srOnly>
                Coordinates:
              </Form.Label>
              <Col
                className="spatial-display__form-column"
              >
                <Form.Control
                  className="spatial-display__text-input"
                  type="text"
                  placeholder="lat, lon (e.g. 44.2, 130)"
                  sm="auto"
                  size="sm"
                  value={pointSearch.split(',').reverse().join(', ')}
                />
              </Col>
            </Form.Group>
          </Form.Row>
        </SpatialDisplayEntry>
      )

      contents.push((
        <FilterStackContents
          key="filter__point"
          body={entry}
          title="Point"
        />
      ))
    } else if ((boundingBoxSearch && !drawingNewLayer) || drawingNewLayer === 'rectangle') {
      // Arrange the points in the right order
      const points = boundingBoxSearch
        ? boundingBoxSearch
          .match(/[^,]+,[^,]+/g)
          .map(pointStr => trimSpatial(pointStr.split(','), 5).reverse().join(', '))
        : [undefined, undefined]

      entry = (
        <SpatialDisplayEntry>
          <Form.Row className="spatial-display__form-row">
            <Form.Group as={Row} className="spatial-display__form-group spatial-display__form-group--coords">
              <Form.Label
                className="spatial-display__form-label"
                column
                sm="auto"
              >
                SW:
              </Form.Label>
              <Col className="spatial-display__form-column">
                <Form.Control
                  className="spatial-display__text-input"
                  sm="auto"
                  type="text"
                  placeholder="lat, lon (e.g. 44.2, 130)"
                  size="sm"
                  value={points[0]}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="spatial-display__form-group spatial-display__form-group--coords">
              <Form.Label
                className="spatial-display__form-label"
                column
                sm="auto"
              >
                NE:
              </Form.Label>
              <Col className="spatial-display__form-column">
                <Form.Control
                  className="spatial-display__text-input"
                  sm="auto"
                  type="text"
                  placeholder="lat, lon (e.g. 50, 133.24)"
                  size="sm"
                  value={points[1]}
                  onChange={e => console.warn(e.target.value)}
                />
              </Col>
            </Form.Group>
          </Form.Row>
        </SpatialDisplayEntry>
      )

      contents.push((
        <FilterStackContents
          key="filter__rectangle"
          body={entry}
          title="Rectangle"
        />
      ))
    } else if ((polygonSearch && !drawingNewLayer) || drawingNewLayer === 'polygon') {
      entry = <SpatialDisplayEntry />

      contents.push((
        <FilterStackContents
          key="filter__polygon"
          body={entry}
          title="Polygon"
        />
      ))
    }

    if (contents.length) {
      items.push((
        <FilterStackItem
          key="item__spatial"
          icon="crop"
          title="Spatial"
          onRemove={this.onSpatialRemove}
        >
          {contents}
        </FilterStackItem>
      ))
    }

    if (!items.length) {
      return null
    }

    return (
      <>
        {items}
      </>
    )
  }
}

SpatialDisplay.propTypes = {
  boundingBoxSearch: PropTypes.string.isRequired,
  drawingNewLayer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  grid: PropTypes.string.isRequired,
  gridCoords: PropTypes.string.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onGranuleGridCoords: PropTypes.func.isRequired,
  onRemoveGridFilter: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  pointSearch: PropTypes.string.isRequired,
  polygonSearch: PropTypes.string.isRequired,
  selectingNewGrid: PropTypes.bool.isRequired
}

export default SpatialDisplay
