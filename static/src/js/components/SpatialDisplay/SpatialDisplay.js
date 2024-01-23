import React, {
  useState,
  useEffect,
  useRef
} from 'react'

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

import {
  transformCircleCoordinates,
  transformBoundingBoxCoordinates,
  transformSingleCoordinate
} from '../../util/createSpatialDisplay'

import './SpatialDisplay.scss'

const { defaultSpatialDecimalSize } = getApplicationConfig()

const SpatialDisplay = ({
  defaultError,
  boundingBoxSearch,
  circleSearch,
  displaySpatialPolygonWarning,
  drawingNewLayer,
  lineSearch,
  manuallyEntering,
  pointSearch,
  polygonSearch,
  shapefile,
  onRemoveSpatialFilter,
  onChangeQuery
}) => {
  const [error, setError] = useState(defaultError)
  const [points, setPoints] = useState([])
  const [manuallyEnteringVal, setManuallyEnteringVal] = useState(manuallyEntering)

  const prevPointSearch = useRef(pointSearch[0])
  const prevBoundingBoxSearch = useRef(transformBoundingBoxCoordinates(boundingBoxSearch[0]))
  const prevPolygonSearch = useRef(polygonSearch[0])
  const prevLineSearch = useRef(lineSearch[0])
  const prevCircleSearch = useRef(transformCircleCoordinates(circleSearch[0]))
  const prevShapefile = useRef(shapefile)

  const onFocusSpatialSearch = (spatialType) => {
    setManuallyEnteringVal(spatialType)
  }

  /**
   * Trims the latitude and longitude to defaultSpatialDecimalSize
   * @param {String} coordinateString A single coordinate representing a point on a map
   */
  const trimCoordinate = (coordinateString) => {
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

  /**
   * Validate the provided point setting any errors to the component state
   * @param {String} coordinates Value provided by an input field containing a single point of 'lat,lon'
   */
  const validateCoordinate = (coordinates) => {
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
  const validateBoundingBoxCoordinates = (boundingBox) => {
    let errorMessage = ''
    const [swPoint, nePoint] = boundingBox

    errorMessage += validateCoordinate(swPoint)
    if (errorMessage === '') { errorMessage += validateCoordinate(nePoint) }

    if (swPoint === nePoint) {
      const message = 'SW and NE points contain matching coordinates. Please use point selection instead.'
      errorMessage += errorMessage !== '' ? ` ${message}` : message
    }

    return errorMessage
  }

  /**
   * Validate the provided center point of a circle
   * @param {Array} circle Array with [point, radius] values
   */
  const validateCircleCoordinates = (circle) => {
    const [center] = circle

    return validateCoordinate(center)
  }

  /**
   * Validates a radius is limited to an integer
   * @param {String} value
   */
  const isValidRadius = (value) => {
    const regex = /^\d*$/

    return !!(value.match(regex))
  }

  const onSubmitBoundingBoxSearch = (event) => {
    if (event.type === 'blur' || event.key === 'Enter') {
      if (prevBoundingBoxSearch.current[0] && prevBoundingBoxSearch.current[1]) {
        eventEmitter.emit('map.drawCancel')

        if (error === '') {
          setManuallyEnteringVal(false)

          onChangeQuery({
            collection: {
              spatial: {
                boundingBox: [transformBoundingBoxCoordinates(prevBoundingBoxSearch.current.join(',')).join(',')]
              }
            }
          })
        }
      }
    }

    event.preventDefault()
  }

  const onChangeCircleCenter = (event) => {
    const [, radius] = prevCircleSearch.current

    const { value = '' } = event.target
    console.log(`onCircleCenter: event.target: ${event.target}`)

    const trimmedValue = trimCoordinate(value)
    const newSearch = [trimmedValue, radius]

    prevCircleSearch.current = newSearch
    setError(validateCircleCoordinates(newSearch))
  }

  const onChangeCircleRadius = (event) => {
    const [center] = circleSearch

    const { value = '' } = event.target

    if (isValidRadius(value)) {
      const newSearch = [center, value]

      prevCircleSearch.current = newSearch
      setError(validateCircleCoordinates(newSearch))
    }
  }

  const onSubmitCircleSearch = (event) => {
    if (event.type === 'blur' || event.key === 'Enter') {
      const [center, radius] = prevCircleSearch.current

      if (center && radius) {
        eventEmitter.emit('map.drawCancel')

        if (error === '') {
          setManuallyEnteringVal(false)

          onChangeQuery({
            collection: {
              spatial: {
                circle: [[transformCircleCoordinates(prevCircleSearch.current.join(','))].join(',')]
              }
            }
          })
        }
      }
    }

    event.preventDefault()
  }

  useEffect(() => {
    console.log(manuallyEnteringVal)
    if (prevPointSearch.current !== pointSearch[0]) {
      console.log('in useEffect prevPointSearch')
      prevPointSearch.current = pointSearch

      setError(validateCoordinate(
        transformSingleCoordinate(prevPointSearch.current[0])
      ))
    }

    if (prevBoundingBoxSearch.current !== boundingBoxSearch[0]) {
      setPoints(transformBoundingBoxCoordinates(boundingBoxSearch[0]))
      prevBoundingBoxSearch.current = boundingBoxSearch

      if (points.filter(Boolean).length > 0) {
        points.forEach((point) => {
          setError(validateCoordinate(point))
        })
      }
    }

    if (prevPolygonSearch.current !== polygonSearch[0]) {
      prevPolygonSearch.current = polygonSearch
    }

    if (prevLineSearch.current !== lineSearch[0]) {
      prevLineSearch.current = lineSearch
    }

    if (prevCircleSearch.current !== circleSearch[0]) {
      console.log(prevCircleSearch)
      console.log(circleSearch)
      setPoints(transformCircleCoordinates(circleSearch[0]))
      prevCircleSearch.current = points
    }

    if (!isEqual(prevShapefile.current, shapefile)) {
      prevShapefile.current = shapefile
    }
  }, [pointSearch, boundingBoxSearch, polygonSearch, lineSearch, circleSearch, shapefile])

  const onSpatialRemove = () => {
    setManuallyEnteringVal(false)

    onRemoveSpatialFilter()
  }

  const onChangePointSearch = (event) => {
    const { value = '' } = event.target

    console.log(`value: ${value}`)
    const trimmedValue = trimCoordinate(value)
    console.log(trimmedValue)
    const point = transformSingleCoordinate(trimmedValue)
    console.log(`point: ${point}`)
    prevPointSearch.current = point
    setError(validateCoordinate(trimmedValue))
  }

  const onSubmitPointSearch = (event) => {
    if (event.type === 'blur' || event.key === 'Enter') {
      eventEmitter.emit('map.drawCancel')

      if (error === '') {
        setManuallyEnteringVal(false)

        const point = prevPointSearch.current.length ? [prevPointSearch.current.replace(/\s/g, '')] : []
        onChangeQuery({
          collection: {
            spatial: {
              point
            }
          }
        })
      }
    }

    event.preventDefault()
  }

  const onChangeBoundingBoxSearch = (event) => {
    const [swPoint, nePoint] = boundingBoxSearch

    const {
      name,
      value = ''
    } = event.target

    const trimmedValue = trimCoordinate(value)
    let newSearch

    if (name === 'swPoint') {
      newSearch = [trimmedValue, nePoint]
    }

    if (name === 'nePoint') {
      newSearch = [swPoint, trimmedValue]
    }

    prevBoundingBoxSearch.current = newSearch
    setError(validateBoundingBoxCoordinates(newSearch))
  }

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
  } = prevShapefile.current

  let hint = ''

  if (((shapefileError || shapefileLoading || shapefileLoaded || shapefileId)
    && !drawingNewLayer)
    || drawingNewLayer === 'shapefile') {
    // If (shapefile data or error exists and not currently drawing a new layer) or (the drawingNewLayer === 'shapefile')
    // render the shapefile display
    entry = (
      <SpatialDisplayEntry>
        <Row className="spatial-display__form-row">
          {
            shapefileName && (
              <>
                <span
                  className="spatial-display__text-primary"
                  data-testid="spatial-display_shapefile-name"
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
                    <span className="spatial-display__loading" data-testid="spatial-display__loading">
                      <Spinner
                        className="spatial-display__loading-icon"
                        data-testid="spatial-display__loading-icon"
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
  } else if (((prevPointSearch.current && prevPointSearch.current.length) && !drawingNewLayer) || drawingNewLayer === 'marker' || manuallyEnteringVal === 'marker') {
    entry = (
      <SpatialDisplayEntry>
        <Form.Row className="spatial-display__form-row">
          <Form.Group as={Row} className="spatial-display__form-group spatial-display__form-group--coords">
            <Form.Label
              className="spatial-display__form-label"
              column
              sm="auto"
            >
              Point:
            </Form.Label>
            <Col
              className="spatial-display__form-column"
            >
              <Form.Control
                className="spatial-display__text-input"
                data-testid="spatial-display_point"
                type="text"
                placeholder="lat, lon (e.g. 44.2, 130)"
                sm="auto"
                size="sm"
                value={transformSingleCoordinate(prevPointSearch.current)}
                onChange={onChangePointSearch}
                onBlur={onSubmitPointSearch}
                onKeyUp={onSubmitPointSearch}
                onFocus={() => onFocusSpatialSearch('marker')}
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
  } else if (((prevBoundingBoxSearch.current && prevBoundingBoxSearch.current.length) && (prevBoundingBoxSearch.current[0] || prevBoundingBoxSearch.current[1]) && !drawingNewLayer) || drawingNewLayer === 'rectangle' || manuallyEnteringVal === 'rectangle') {
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
                data-testid="spatial-display_southwest-point"
                sm="auto"
                type="text"
                placeholder="lat, lon (e.g. 44.2, 130)"
                size="sm"
                name="swPoint"
                value={prevBoundingBoxSearch.current[0]}
                onChange={onChangeBoundingBoxSearch}
                onBlur={onSubmitBoundingBoxSearch}
                onKeyUp={onSubmitBoundingBoxSearch}
                onFocus={() => onFocusSpatialSearch('rectangle')}
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
                data-testid="spatial-display_northeast-point"
                sm="auto"
                type="text"
                placeholder="lat, lon (e.g. 50, 133.24)"
                size="sm"
                name="nePoint"
                value={prevBoundingBoxSearch.current[1]}
                onChange={onChangeBoundingBoxSearch}
                onBlur={onSubmitBoundingBoxSearch}
                onKeyUp={onSubmitBoundingBoxSearch}
                onFocus={() => onFocusSpatialSearch('rectangle')}
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
  } else if (((prevCircleSearch.current && prevCircleSearch.current.length) && (prevCircleSearch.current[0] || prevCircleSearch.current[1]) && !drawingNewLayer) || drawingNewLayer === 'circle' || manuallyEnteringVal === 'circle') {
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
                data-testid="spatial-display_circle-center"
                sm="auto"
                type="text"
                placeholder="lat, lon (e.g. 44.2, 130)"
                size="sm"
                name="center"
                value={prevCircleSearch.current[0]}
                onChange={onChangeCircleCenter}
                onBlur={onSubmitCircleSearch}
                onKeyUp={onSubmitCircleSearch}
                onFocus={() => onFocusSpatialSearch('circle')}
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
                data-testid="spatial-display_circle-radius"
                sm="auto"
                type="text"
                placeholder="meters (e.g. 200)"
                size="sm"
                name="radius"
                value={circleSearch[1]}
                onChange={onChangeCircleRadius}
                onBlur={onSubmitCircleSearch}
                onKeyUp={onSubmitCircleSearch}
                onFocus={() => onFocusSpatialSearch('circle')}
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
  } else if (((prevPolygonSearch.current && prevPolygonSearch.current.length) && !drawingNewLayer) || drawingNewLayer === 'polygon') {
    const pointArray = prevPolygonSearch.current.split(',')
    const pointCount = (pointArray.length / 2) - 1

    entry = (
      <SpatialDisplayEntry>
        {
          pointCount > 2 && (
            <Row className="spatial-display__form-row">
              <span
                className="spatial-display__text-primary"
                data-testid="spatial-display_polygon"
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
  } else if (((prevLineSearch.current && prevLineSearch.current.length) && !drawingNewLayer) || drawingNewLayer === 'polyline') {
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
        error={drawingNewLayer && !manuallyEnteringVal ? '' : spatialError}
        onRemove={onSpatialRemove}
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
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      {items}
    </>
  )
}

SpatialDisplay.propTypes = {
  boundingBoxSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  circleSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultError: PropTypes.string,
  displaySpatialPolygonWarning: PropTypes.bool.isRequired,
  drawingNewLayer: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.bool
  ]).isRequired,
  lineSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  manuallyEntering: PropTypes.bool,
  onChangeQuery: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  polygonSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  shapefile: PropTypes.shape({}).isRequired
}

SpatialDisplay.defaultProps = {
  defaultError: '',
  manuallyEntering: false
}

export default SpatialDisplay
