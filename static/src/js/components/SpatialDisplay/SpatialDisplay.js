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
import { eventEmitter } from '../../events/events'
import pluralize from '../../util/pluralize'

import './SpatialDisplay.scss'

class SpatialDisplay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: '',
      boundingBoxSearch: '',
      lineSearch: '',
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
    this.onChangePointSearch = this.onChangePointSearch.bind(this)
    this.onBlurPointSearch = this.onBlurPointSearch.bind(this)
    this.onChangeBoundingBoxSearch = this.onChangeBoundingBoxSearch.bind(this)
    this.onBlurBoundingBoxSearch = this.onBlurBoundingBoxSearch.bind(this)
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
      boundingBoxSearch: this.transformBoundingBoxCoordinates(boundingBoxSearch),
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
      lineSearch,
      gridName,
      gridCoords,
      pointSearch,
      polygonSearch,
      shapefile
    } = this.props

    this.setState({ error: '' })

    if (pointSearch !== nextProps.pointSearch) {
      this.setState({ pointSearch: nextProps.pointSearch })

      this.validateCoordinate(nextProps.pointSearch)
    }
    if (boundingBoxSearch !== nextProps.boundingBoxSearch) {
      const points = this.transformBoundingBoxCoordinates(nextProps.boundingBoxSearch)

      this.setState({ boundingBoxSearch: points })

      if (points.filter(Boolean).length > 0) {
        points.forEach(point => this.validateCoordinate(point))
      }
    }
    if (polygonSearch !== nextProps.polygonSearch) {
      this.setState({ polygonSearch: nextProps.polygonSearch })
    }
    if (lineSearch !== nextProps.lineSearch) {
      this.setState({ lineSearch: nextProps.lineSearch })
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

  onChangePointSearch(e) {
    const { value = '' } = e.target

    this.validateCoordinate(value)

    this.setState({
      pointSearch: value.split(',').reverse().join(',').replace(/\s/g, '')
    })
  }

  onBlurPointSearch() {
    eventEmitter.emit('map.drawCancel')

    const { pointSearch, error } = this.state
    const { onChangeQuery } = this.props

    if (error.length === '') {
      onChangeQuery({
        collection: {
          spatial: {
            point: pointSearch.replace(/\s/g, '')
          }
        }
      })
    }
  }

  onChangeBoundingBoxSearch(e) {
    const { boundingBoxSearch } = this.state
    const [swPoint, nePoint] = boundingBoxSearch

    const {
      name,
      value = ''
    } = e.target

    let newSearch

    if (name === 'swPoint') {
      newSearch = [value, nePoint]
    }

    if (name === 'nePoint') {
      newSearch = [swPoint, value]
    }

    this.validateCoordinate(value)

    this.setState({
      boundingBoxSearch: newSearch
    })
  }

  onBlurBoundingBoxSearch() {
    const { boundingBoxSearch, error } = this.state
    const { onChangeQuery } = this.props

    if (boundingBoxSearch[0] && boundingBoxSearch[1]) {
      eventEmitter.emit('map.drawCancel')

      if (error.length === '') {
        onChangeQuery({
          collection: {
            spatial: {
              boundingBox: boundingBoxSearch.map(point => point.split(',').reverse()).join(',').replace(/\s/g, '')
            }
          }
        })
      }
    }
  }

  /**
   * Validate the provided point setting any errors to the component state
   * @param {String} coordinates Value provided by an input field containing a single point of 'lat,lon'
   */
  validateCoordinate(coordinates) {
    let errorMessage

    const validCoordinates = coordinates.trim().match(/^(-?\d+\.?\d+)?,\s*(-?\d+\.?\d+)?$/)
    if (validCoordinates == null) {
      errorMessage = `Coordinates (${coordinates}) must use 'lat,lon' format.`
    }

    if (validCoordinates) {
      // Ignores the first match which will be the entire result, the second two values are
      // the groups we're looking for
      const [, lat, lon] = validCoordinates

      if (lat < -90 || lat > 90) {
        errorMessage = `Lattitude (${lat}) must be between -90 and 90.`
      }

      if (lon < -180 || lon > 180) {
        errorMessage = `Longitude (${lon}) must be between -90 and 90.`
      }
    }

    if (errorMessage != null) {
      this.setState({
        error: errorMessage
      })
    } else {
      this.setState({
        error: ''
      })
    }
  }

  /**
   * Turns '1,2,3,4' into ['2,1', '4,3'] for leaflet
   * @param {String} boundingBoxCoordinates A set of two points representing a bounding box
   */
  transformBoundingBoxCoordinates(boundingBoxCoordinates) {
    // Returns empty strings by default as input fields cannot be set to undefined
    return boundingBoxCoordinates
      ? boundingBoxCoordinates
        .match(/[^,]+,[^,]+/g)
        .map(pointStr => pointStr.split(',').reverse().join(','))
      : ['', '']
  }

  render() {
    const {
      drawingNewLayer,
      selectingNewGrid
    } = this.props

    const {
      error,
      boundingBoxSearch,
      lineSearch,
      gridName,
      gridCoords,
      pointSearch,
      polygonSearch,
      shapefile
    } = this.state

    const contents = []
    const items = []
    let entry

    let spatialError = error

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
                  value={pointSearch.split(',').reverse().join(',')}
                  onChange={this.onChangePointSearch}
                  onBlur={this.onBlurPointSearch}
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
    } else if ((boundingBoxSearch && (boundingBoxSearch[0] || boundingBoxSearch[1]) && !drawingNewLayer) || drawingNewLayer === 'rectangle') {
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
                  name="swPoint"
                  value={boundingBoxSearch[0]}
                  onChange={this.onChangeBoundingBoxSearch}
                  onBlur={this.onBlurBoundingBoxSearch}
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
                  name="nePoint"
                  value={boundingBoxSearch[1]}
                  onChange={this.onChangeBoundingBoxSearch}
                  onBlur={this.onBlurBoundingBoxSearch}
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

        if (type === 'upload_shape') {
          spatialError = 'To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
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
      const pointArray = polygonSearch.split(',')
      const pointCount = (pointArray.length / 2) - 1

      entry = (
        <SpatialDisplayEntry>
          <Row className="spatial-display__form-row">
            <span className="spatial-display__text-primary">{`${pointCount} ${pluralize('Point', pointCount)}`}</span>
          </Row>
        </SpatialDisplayEntry>
      )

      contents.push((
        <FilterStackContents
          key="filter__polygon"
          body={entry}
          title="Polygon"
        />
      ))
    } else if ((lineSearch && !drawingNewLayer) || drawingNewLayer === 'polyline') {
      entry = <SpatialDisplayEntry />

      contents.push((
        <FilterStackContents
          key="filter__polygon"
          body={entry}
          title="Line"
        />
      ))
    }

    if (contents.length) {
      items.push((
        <FilterStackItem
          key="item__spatial"
          icon="crop"
          title="Spatial"
          error={drawingNewLayer ? '' : spatialError}
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
  lineSearch: PropTypes.string.isRequired,
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
