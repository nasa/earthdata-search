import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'

import {
  Col,
  Form,
  Row,
  Spinner
} from 'react-bootstrap'

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
      gridName: '',
      gridCoords: '',
      pointSearch: '',
      polygonSearch: '',
      shapefile: {}
    }

    this.onChangeGridType = this.onChangeGridType.bind(this)
    this.onChangeGridCoords = this.onChangeGridCoords.bind(this)
    this.onGridRemove = this.onGridRemove.bind(this)
    this.onSpatialRemove = this.onSpatialRemove.bind(this)
    this.onSubmitGridCoords = this.onSubmitGridCoords.bind(this)
  }

  componentDidMount() {
    const {
      boundingBoxSearch,
      gridName,
      gridCoords,
      pointSearch,
      polygonSearch,
      shapefile
    } = this.props

    this.setState({
      boundingBoxSearch,
      gridName,
      gridCoords,
      pointSearch,
      polygonSearch,
      shapefile
    })
  }

  componentWillReceiveProps(nextProps) {
    const {
      boundingBoxSearch,
      gridName,
      gridCoords,
      pointSearch,
      polygonSearch,
      shapefile
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
    if (gridName !== nextProps.gridName) {
      this.setState({ gridName: nextProps.gridName })
    }
    if (gridCoords !== nextProps.gridCoords) {
      this.setState({ gridCoords: nextProps.gridCoords })
    }

    if (!isEqual(shapefile, nextProps.shapefile)) {
      this.setState({ shapefile: nextProps.shapefile })
    }
  }

  onChangeGridType(e) {
    const { onChangeQuery } = this.props
    onChangeQuery({
      collection: {
        gridName: e.target.value
      }
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
      gridName,
      gridCoords,
      pointSearch,
      polygonSearch,
      shapefile
    } = this.state

    const contents = []
    const items = []
    let entry
    let spatialError

    const {
      isErrored: shapefileError,
      isLoading: shapefileLoading,
      isLoaded: shapefileLoaded,
      shapefileName,
      shapefileId,
      shapefileSize
    } = shapefile

    if (selectingNewGrid || gridName) {
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
                value={gridName}
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

      if (gridName) {
        const selectedGrid = findGridByName(gridName)
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
                  onChange={e => console.warn(e.target.value)}
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
                  onChange={e => console.warn(e.target.value)}
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
    } else if (((shapefileError || shapefileLoading || shapefileLoaded || shapefileId)
      && !drawingNewLayer)
      || drawingNewLayer === 'shapefile') {
      // if (shapefile data or error exists and not currently drawing a new layer) or (the drawingNewLayer === 'shapefile')
      // render the shapefile display
      entry = (
        <SpatialDisplayEntry>
          <Row className="spatial-display__form-row">
            {
              shapefileName && (
                <>
                  <span className="spatial-display__text-primary">{shapefileName}</span>
                  {
                    shapefileSize && (
                      <span className="spatial-display__text-secondary">{`(${shapefileSize})`}</span>
                    )
                  }
                  {
                    shapefileLoading && (
                      <span className="spatial-display__loading">
                        <Spinner
                          className="spatial-display__loading-icon"
                          animation="border"
                          variant="light"
                          size="sm"
                        />
                        Loading...
                      </span>
                    )
                  }
                </>
              )
            }
          </Row>
        </SpatialDisplayEntry>
      )

      if (shapefileError) {
        const { type } = shapefileError

        if (type === 'upload_esri') {
          spatialError = 'To use an ESRI Shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
        }
      }

      contents.push((
        <FilterStackContents
          key="filter__shapefile"
          body={entry}
          title="Shape File"
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
          error={spatialError}
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
  gridName: PropTypes.string.isRequired,
  gridCoords: PropTypes.string.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onGranuleGridCoords: PropTypes.func.isRequired,
  onRemoveGridFilter: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  pointSearch: PropTypes.string.isRequired,
  polygonSearch: PropTypes.string.isRequired,
  selectingNewGrid: PropTypes.bool.isRequired,
  shapefile: PropTypes.shape({}).isRequired
}

export default SpatialDisplay
