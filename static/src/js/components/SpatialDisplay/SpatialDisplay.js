import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEqual } from 'lodash'
import { FaCrop } from 'react-icons/fa'

import {
  Col,
  Form,
  Row,
  Spinner
} from 'react-bootstrap'

import { eventEmitter } from '../../events/events'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { pluralize } from '../../util/pluralize'

import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'
import SpatialDisplayEntry from './SpatialDisplayEntry'

import './SpatialDisplay.scss'

const { defaultSpatialDecimalSize } = getApplicationConfig()

class SpatialDisplay extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: '',
      boundingBoxSearch: '',
      circleSearch: '',
      lineSearch: '',
      manuallyEntering: false,
      pointSearch: '',
      polygonSearch: '',
      shapefile: {}
    }

    this.onSpatialRemove = this.onSpatialRemove.bind(this)
    this.onChangePointSearch = this.onChangePointSearch.bind(this)
    this.onSubmitPointSearch = this.onSubmitPointSearch.bind(this)
    this.onChangeBoundingBoxSearch = this.onChangeBoundingBoxSearch.bind(this)
    this.onSubmitBoundingBoxSearch = this.onSubmitBoundingBoxSearch.bind(this)
    this.onChangeCircleCenter = this.onChangeCircleCenter.bind(this)
    this.onChangeCircleRadius = this.onChangeCircleRadius.bind(this)
    this.onSubmitCircleSearch = this.onSubmitCircleSearch.bind(this)
    this.onFocusSpatialSearch = this.onFocusSpatialSearch.bind(this)
  }

  componentDidMount() {
    const {
      boundingBoxSearch,
      circleSearch,
      pointSearch,
      polygonSearch,
      shapefile
    } = this.props

    this.setState({
      error: '',
      boundingBoxSearch: this.transformBoundingBoxCoordinates(boundingBoxSearch[0]),
      circleSearch: this.transformCircleCoordinates(circleSearch[0]),
      pointSearch: pointSearch[0],
      polygonSearch: polygonSearch[0],
      shapefile
    })
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      boundingBoxSearch,
      circleSearch,
      lineSearch,
      pointSearch,
      polygonSearch,
      shapefile
    } = this.props

    let shouldUpdateState = false

    const state = {
      error: ''
    }

    if (pointSearch[0] !== nextProps.pointSearch[0]) {
      shouldUpdateState = true;

      ([state.pointSearch] = nextProps.pointSearch)
      state.error = this.validateCoordinate(
        this.transformSingleCoordinate(nextProps.pointSearch[0])
      )
    }

    if (boundingBoxSearch[0] !== nextProps.boundingBoxSearch[0]) {
      shouldUpdateState = true

      const points = this.transformBoundingBoxCoordinates(nextProps.boundingBoxSearch[0])

      state.boundingBoxSearch = points

      if (points.filter(Boolean).length > 0) {
        points.forEach((point) => {
          state.error = this.validateCoordinate(point)
        })
      }
    }

    if (polygonSearch[0] !== nextProps.polygonSearch[0]) {
      shouldUpdateState = true;

      ([state.polygonSearch] = nextProps.polygonSearch)
    }

    if (lineSearch[0] !== nextProps.lineSearch[0]) {
      shouldUpdateState = true;

      ([state.lineSearch] = nextProps.lineSearch)
    }

    if (circleSearch[0] !== nextProps.circleSearch[0]) {
      shouldUpdateState = true

      const points = this.transformCircleCoordinates(nextProps.circleSearch[0])
      state.circleSearch = points
    }

    if (!isEqual(shapefile, nextProps.shapefile)) {
      shouldUpdateState = true

      state.shapefile = nextProps.shapefile
    }

    // Only update the state if a prop we care about was provided and updated
    if (shouldUpdateState) this.setState(state)
  }

  onSpatialRemove() {
    const {
      onRemoveSpatialFilter
    } = this.props

    this.setState({
      manuallyEntering: false
    })

    onRemoveSpatialFilter()
  }

  onChangePointSearch(e) {
    const { value = '' } = e.target

    const trimmedValue = this.trimCoordinate(value)
    const point = this.transformSingleCoordinate(trimmedValue)

    this.setState({
      pointSearch: point,
      error: this.validateCoordinate(trimmedValue)
    })
  }

  onSubmitPointSearch(e) {
    if (e.type === 'blur' || e.key === 'Enter') {
      eventEmitter.emit('map.drawCancel')

      const { pointSearch, error } = this.state
      const { onChangeQuery } = this.props

      if (error === '') {
        this.setState({
          manuallyEntering: false
        })

        const point = pointSearch.length ? [pointSearch.replace(/\s/g, '')] : []
        onChangeQuery({
          collection: {
            spatial: {
              point
            }
          }
        })
      }
    }

    e.preventDefault()
  }

  onChangeBoundingBoxSearch(e) {
    const { boundingBoxSearch } = this.state
    const [swPoint, nePoint] = boundingBoxSearch

    const {
      name,
      value = ''
    } = e.target

    const trimmedValue = this.trimCoordinate(value)
    let newSearch

    if (name === 'swPoint') {
      newSearch = [trimmedValue, nePoint]
    }

    if (name === 'nePoint') {
      newSearch = [swPoint, trimmedValue]
    }

    this.setState({
      boundingBoxSearch: newSearch,
      error: this.validateBoundingBoxCoordinates(newSearch)
    })
  }

  onFocusSpatialSearch(spatialType) {
    this.setState({
      manuallyEntering: spatialType
    })
  }

  onSubmitBoundingBoxSearch(e) {
    if (e.type === 'blur' || e.key === 'Enter') {
      const { boundingBoxSearch, error } = this.state
      const { onChangeQuery } = this.props

      if (boundingBoxSearch[0] && boundingBoxSearch[1]) {
        eventEmitter.emit('map.drawCancel')

        if (error === '') {
          this.setState({
            manuallyEntering: false
          })

          onChangeQuery({
            collection: {
              spatial: {
                boundingBox: [this.transformBoundingBoxCoordinates(boundingBoxSearch.join(',')).join(',')]
              }
            }
          })
        }
      }
    }

    e.preventDefault()
  }

  onChangeCircleCenter(e) {
    const { circleSearch } = this.state
    const [, radius] = circleSearch

    const { value = '' } = e.target

    const trimmedValue = this.trimCoordinate(value)
    const newSearch = [trimmedValue, radius]

    this.setState({
      circleSearch: newSearch,
      error: this.validateCircleCoordinates(newSearch)
    })
  }

  onChangeCircleRadius(e) {
    const { circleSearch } = this.state
    const [center] = circleSearch

    const { value = '' } = e.target

    if (this.isValidRadius(value)) {
      const newSearch = [center, value]

      this.setState({
        circleSearch: newSearch,
        error: this.validateCircleCoordinates(newSearch)
      })
    }
  }

  onSubmitCircleSearch(e) {
    if (e.type === 'blur' || e.key === 'Enter') {
      const { circleSearch, error } = this.state
      const [center, radius] = circleSearch
      const { onChangeQuery } = this.props

      if (center && radius) {
        eventEmitter.emit('map.drawCancel')

        if (error === '') {
          this.setState({
            manuallyEntering: false
          })

          onChangeQuery({
            collection: {
              spatial: {
                circle: [[this.transformCircleCoordinates(circleSearch.join(','))].join(',')]
              }
            }
          })
        }
      }
    }

    e.preventDefault()
  }

  /**
   * Validates a radius is limited to an integer
   * @param {String} value
   */
  isValidRadius(value) {
    const regex = /^\d*$/

    return !!(value.match(regex))
  }

  /**
   * Validate the provided point setting any errors to the component state
   * @param {String} coordinates Value provided by an input field containing a single point of 'lat,lon'
   */
  validateCoordinate(coordinates) {
    if (coordinates === '') return ''

    let errorMessage = ''

    // Checks if the coordinates are two positive or negitive numbers separated by a comma,
    // each number optionally followed by up to defaultSpatialDecimalSize decimal points
    const regex = new RegExp(`^(-?\\d*\\.?\\d{0,${defaultSpatialDecimalSize}}),\\s?(-?\\d*\\.?\\d{0,${defaultSpatialDecimalSize}})$`)
    const validCoordinates = coordinates.trim().match(regex)

    if (validCoordinates == null) {
      errorMessage = `Coordinates (${coordinates}) must use 'lat,lon' format with up to ${defaultSpatialDecimalSize} decimal place(s)`
    }

    if (validCoordinates) {
      // Ignores the first match which will be the entire result, the second two values are
      // the groups we're looking for
      const [, lat, lon] = validCoordinates

      if (lat < -90 || lat > 90) {
        errorMessage = `Latitude (${lat}) must be between -90 and 90.`
      }

      if (lon < -180 || lon > 180) {
        errorMessage = `Longitude (${lon}) must be between -180 and 180.`
      }
    }

    return errorMessage
  }

  /**
   * Validate the provided bounding box points
   * @param {Array} boundingBox Array with [swPoint, nePoint] values
   */
  validateBoundingBoxCoordinates(boundingBox) {
    const [swPoint, nePoint] = boundingBox
    return this.validateCoordinate(swPoint) + this.validateCoordinate(nePoint)
  }

  /**
   * Validate the provided center point of a circle
   * @param {Array} circle Array with [point, radius] values
   */
  validateCircleCoordinates(circle) {
    const [center] = circle
    return this.validateCoordinate(center)
  }

  /**
   * Turns '1,2' into '2,1' for leaflet
   * @param {String} coordinateString A single coordinate representing a point on a map
   */
  transformSingleCoordinate(coordinateString) {
    if (!coordinateString) return ''

    return coordinateString.split(',').reverse().join(',').replace(/\s/g, '')
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
        .map((pointStr) => this.transformSingleCoordinate(pointStr))
      : ['', '']
  }

  /**
   * Turns '1,2,3' into ['2,1', '3'] for leaflet
   * @param {String} circleCoordinates A center point and radius
   */
  transformCircleCoordinates(circleCoordinates) {
    if (!circleCoordinates) return ['', '']

    const points = circleCoordinates.split(',')

    const [
      lat = '',
      lng = '',
      radius = ''
    ] = points

    if (lat && lng) {
      const coordinate = [lat, lng]
      return [this.transformSingleCoordinate(coordinate.join(',')), radius]
    }

    return ['', '']
  }

  /**
   * Trims the latitude and longitude to defaultSpatialDecimalSize
   * @param {String} coordinateString A single coordinate representing a point on a map
   */
  trimCoordinate(coordinateString) {
    const coordinates = coordinateString.replace(/\s/g, '').split(',').map((coordinate) => {
      // Checks if the coordinate is a positive or negitive number,
      // optionally followed by up to defaultSpatialDecimalSize decimal points
      const regex = new RegExp(`^(-?\\d*\\.?\\d{0,${defaultSpatialDecimalSize}})`)

      const matchedCoordinate = coordinate.match(regex)
      if (matchedCoordinate[0]) {
        return matchedCoordinate[0]
      }

      // If a matching coordinate wasn't found, return the input exactly
      return coordinate
    })

    return coordinates.join(',')
  }

  render() {
    const {
      displaySpatialPolygonWarning,
      drawingNewLayer
    } = this.props

    const {
      error,
      boundingBoxSearch,
      circleSearch,
      lineSearch,
      manuallyEntering,
      pointSearch = '',
      polygonSearch = '',
      shapefile
    } = this.state

    const contents = []
    const items = []

    let entry
    let secondaryTitle = ''
    let spatialError = error

    const {
      isErrored: shapefileError,
      isLoading: shapefileLoading,
      isLoaded: shapefileLoaded,
      selectedFeatures = [],
      shapefileName,
      shapefileId,
      shapefileSize
    } = shapefile

    let hint = ''

    if (((shapefileError || shapefileLoading || shapefileLoaded || shapefileId)
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
                  <span
                    className="spatial-display__text-primary"
                    data-test-id="spatial-display_shapefile-name"
                  >
                    {shapefileName}
                  </span>
                  {
                    shapefileSize && (
                      <span className="spatial-display__text-secondary">
                        {`(${shapefileSize})`}
                      </span>
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

      if (shapefileLoaded && !selectedFeatures.length) {
        hint = 'Select a shape to filter results'
      }

      if (selectedFeatures.length) {
        hint = `${selectedFeatures.length} ${pluralize('shape', selectedFeatures.length)} selected`
      }

      if (shapefileError) {
        const { type } = shapefileError

        if (type === 'upload_shape') {
          spatialError = 'To use a shapefile, please upload a zip file that includes its .shp, .shx, and .dbf files.'
        }
      }

      secondaryTitle = 'Shape File'

      contents.push((
        <FilterStackContents
          key="filter__shapefile"
          body={entry}
          title="Shape File"
          hint={hint}
        />
      ))
    } else if ((pointSearch && !drawingNewLayer) || drawingNewLayer === 'marker' || manuallyEntering === 'marker') {
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
                  data-test-id="spatial-display_point"
                  type="text"
                  placeholder="lat, lon (e.g. 44.2, 130)"
                  sm="auto"
                  size="sm"
                  value={this.transformSingleCoordinate(pointSearch)}
                  onChange={this.onChangePointSearch}
                  onBlur={this.onSubmitPointSearch}
                  onKeyUp={this.onSubmitPointSearch}
                  onFocus={() => this.onFocusSpatialSearch('marker')}
                />
              </Col>
            </Form.Group>
          </Form.Row>
        </SpatialDisplayEntry>
      )

      secondaryTitle = 'Point'

      contents.push((
        <FilterStackContents
          key="filter__point"
          body={entry}
          title="Point"
        />
      ))
    } else if ((boundingBoxSearch && (boundingBoxSearch[0] || boundingBoxSearch[1]) && !drawingNewLayer) || drawingNewLayer === 'rectangle' || manuallyEntering === 'rectangle') {
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
                  data-test-id="spatial-display_southwest-point"
                  sm="auto"
                  type="text"
                  placeholder="lat, lon (e.g. 44.2, 130)"
                  size="sm"
                  name="swPoint"
                  value={boundingBoxSearch[0]}
                  onChange={this.onChangeBoundingBoxSearch}
                  onBlur={this.onSubmitBoundingBoxSearch}
                  onKeyUp={this.onSubmitBoundingBoxSearch}
                  onFocus={() => this.onFocusSpatialSearch('rectangle')}
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
                  data-test-id="spatial-display_northeast-point"
                  sm="auto"
                  type="text"
                  placeholder="lat, lon (e.g. 50, 133.24)"
                  size="sm"
                  name="nePoint"
                  value={boundingBoxSearch[1]}
                  onChange={this.onChangeBoundingBoxSearch}
                  onBlur={this.onSubmitBoundingBoxSearch}
                  onKeyUp={this.onSubmitBoundingBoxSearch}
                  onFocus={() => this.onFocusSpatialSearch('rectangle')}
                />
              </Col>
            </Form.Group>
          </Form.Row>
        </SpatialDisplayEntry>
      )

      secondaryTitle = 'Rectangle'

      contents.push((
        <FilterStackContents
          key="filter__rectangle"
          body={entry}
          title="Rectangle"
          variant="block"
        />
      ))
    } else if ((circleSearch && (circleSearch[0] || circleSearch[1]) && !drawingNewLayer) || drawingNewLayer === 'circle' || manuallyEntering === 'circle') {
      entry = (
        <SpatialDisplayEntry>
          <Form.Row className="spatial-display__form-row">
            <Form.Group as={Row} className="spatial-display__form-group spatial-display__form-group--coords">
              <Form.Label
                className="spatial-display__form-label"
                column
                sm="auto"
              >
                Center:
              </Form.Label>
              <Col className="spatial-display__form-column">
                <Form.Control
                  className="spatial-display__text-input"
                  data-test-id="spatial-display_circle-center"
                  sm="auto"
                  type="text"
                  placeholder="lat, lon (e.g. 44.2, 130)"
                  size="sm"
                  name="center"
                  value={circleSearch[0]}
                  onChange={this.onChangeCircleCenter}
                  onBlur={this.onSubmitCircleSearch}
                  onKeyUp={this.onSubmitCircleSearch}
                  onFocus={() => this.onFocusSpatialSearch('circle')}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="spatial-display__form-group spatial-display__form-group--coords">
              <Form.Label
                className="spatial-display__form-label"
                column
                sm="auto"
              >
                Radius (m):
              </Form.Label>
              <Col className="spatial-display__form-column">
                <Form.Control
                  className="spatial-display__text-input"
                  data-test-id="spatial-display_circle-radius"
                  sm="auto"
                  type="text"
                  placeholder="meters (e.g. 200)"
                  size="sm"
                  name="radius"
                  value={circleSearch[1]}
                  onChange={this.onChangeCircleRadius}
                  onBlur={this.onSubmitCircleSearch}
                  onKeyUp={this.onSubmitCircleSearch}
                  onFocus={() => this.onFocusSpatialSearch('circle')}
                />
              </Col>
            </Form.Group>
          </Form.Row>
        </SpatialDisplayEntry>
      )

      secondaryTitle = 'Circle'

      contents.push((
        <FilterStackContents
          key="filter__circle"
          body={entry}
          title="Circle"
          variant="block"
        />
      ))
    } else if ((polygonSearch && !drawingNewLayer) || drawingNewLayer === 'polygon') {
      const pointArray = polygonSearch.split(',')
      const pointCount = (pointArray.length / 2) - 1

      entry = (
        <SpatialDisplayEntry>
          {
            pointCount > 2 && (
              <Row className="spatial-display__form-row">
                <span
                  className="spatial-display__text-primary"
                  data-test-id="spatial-display_polygon"
                >
                  {`${pointCount} ${pluralize('Point', pointCount)}`}
                </span>
              </Row>
            )
          }
        </SpatialDisplayEntry>
      )

      if (pointArray.length < 2) {
        hint = 'Draw a polygon on the map to filter results'
      }

      secondaryTitle = 'Polygon'

      if (displaySpatialPolygonWarning) {
        spatialError = 'This collection does not support polygon search. Your polygon has been converted to a bounding box.'
      }

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
          dataTestId="filter-stack__spatial"
          icon={FaCrop}
          title="Spatial"
          secondaryTitle={secondaryTitle}
          error={drawingNewLayer && !manuallyEntering ? '' : spatialError}
          onRemove={this.onSpatialRemove}
          hint={hint}
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
  boundingBoxSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  circleSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  displaySpatialPolygonWarning: PropTypes.bool.isRequired,
  drawingNewLayer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  lineSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  polygonSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  shapefile: PropTypes.shape({}).isRequired
}

export default SpatialDisplay
