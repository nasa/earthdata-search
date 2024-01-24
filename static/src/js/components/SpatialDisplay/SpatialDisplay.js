import React, { useState, useEffect } from 'react'

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
  const [manuallyEnteringVal, setManuallyEnteringVal] = useState(manuallyEntering)

  const [sPointSearch, setSPointSearch] = useState(pointSearch)
  const [sBoundingBoxSearch, setSBoundingBoxSearch] = useState(
    transformBoundingBoxCoordinates(boundingBoxSearch[0])
  )
  const [sCircleSearch, setSCircleSearch] = useState(transformCircleCoordinates(circleSearch[0]))
  const [sPolygonSearch, setSPolygonSearch] = useState(polygonSearch)
  const [sLineSearch, setSLineSearch] = useState(lineSearch)
  const [sShapefile, setSShapefile] = useState(shapefile)

  // Const prevPointSearch = useRef(pointSearch[0])
  // const prevBoundingBoxSearch = useRef(transformBoundingBoxCoordinates(boundingBoxSearch[0]))
  // const prevPolygonSearch = useRef(polygonSearch[0])
  // const prevLineSearch = useRef(lineSearch[0])
  // const prevCircleSearch = useRef(transformCircleCoordinates(circleSearch[0]))
  // const prevShapefile = useRef(shapefile)

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
      console.log('error message')
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

    console.log(`center: ${center}`)
    console.log(`validating center: ${validateCoordinate(center)}`)

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
      if (sBoundingBoxSearch[0] && sBoundingBoxSearch[1]) {
        eventEmitter.emit('map.drawCancel')

        if (error === '') {
          setManuallyEnteringVal(false)

          onChangeQuery({
            collection: {
              spatial: {
                boundingBox: [transformBoundingBoxCoordinates(sBoundingBoxSearch.join(',')).join(',')]
              }
            }
          })
        }
      }
    }

    event.preventDefault()
  }

  const onChangeCircleCenter = (event) => {
    const [, radius] = sCircleSearch

    const { value = '' } = event.target
    console.log(`onCircleCenter: event.target: ${event.target}`)

    const trimmedValue = trimCoordinate(value)
    const newSearch = [trimmedValue, radius]

    setSCircleSearch(newSearch)
    setError(validateCircleCoordinates(newSearch))
    console.log(`validating newSearch: ${validateCircleCoordinates(newSearch)}`)
  }

  const onChangeCircleRadius = (event) => {
    const [center] = sCircleSearch

    const { value = '' } = event.target

    if (isValidRadius(value)) {
      const newSearch = [center, value]

      setSCircleSearch(newSearch)
      setError(validateCircleCoordinates(newSearch))
      console.log(`validating newSearch: ${validateCircleCoordinates(newSearch)}`)
    }
  }

  const onSubmitCircleSearch = (event) => {
    if (event.type === 'blur' || event.key === 'Enter') {
      const [center, radius] = sCircleSearch

      if (center && radius) {
        eventEmitter.emit('map.drawCancel')

        if (error === '') {
          setManuallyEnteringVal(false)

          const circle = [transformCircleCoordinates(sCircleSearch.join(','))].join(',')

          onChangeQuery({
            collection: {
              spatial: {
                circle: [circle]
              }
            }
          })
        }
      }
    }

    event.preventDefault()
  }

  // UseEffect(() => {
  //   console.log(polygonSearch)
  //   setSBoundingBoxSearch(transformBoundingBoxCoordinates(boundingBoxSearch[0]))
  //   setSCircleSearch(transformCircleCoordinates(circleSearch[0]))
  //   setSPointSearch(pointSearch)
  //   setSPolygonSearch(polygonSearch)
  // }, [])

  useEffect(() => {
    console.log(manuallyEnteringVal)
    if (sPointSearch[0] !== pointSearch[0]) {
      console.log('in useEffect prevPointSearch')
      setSPointSearch(pointSearch)

      setError(validateCoordinate(
        transformSingleCoordinate(sPointSearch[0])
      ))
    }

    if (sBoundingBoxSearch.join(',') !== boundingBoxSearch[0]) {
      const tempPoints = transformBoundingBoxCoordinates(boundingBoxSearch[0])

      setSBoundingBoxSearch(tempPoints)

      if (tempPoints.filter(Boolean).length > 0) {
        tempPoints.forEach((point) => {
          console.log(`validating coordinate point: ${point}`)
          console.log(`Error message: ${validateCoordinate(point)}`)
          setError(validateCoordinate(point))
        })
      }
    }

    if (sPolygonSearch[0] !== polygonSearch[0]) {
      setSPolygonSearch(polygonSearch)
    }

    if (sLineSearch[0] !== lineSearch[0]) {
      setSLineSearch(lineSearch)
    }

    if (sCircleSearch.join(',') !== transformCircleCoordinates(circleSearch[0])) {
      console.log(`circleSearch: ${circleSearch}`)
      const tempPoints = transformCircleCoordinates(circleSearch[0])
      setSCircleSearch(tempPoints)
    }

    if (!isEqual(sShapefile, shapefile)) {
      setSShapefile(shapefile)
    }
  }, [pointSearch, boundingBoxSearch, polygonSearch, lineSearch, circleSearch, shapefile])

  const onSpatialRemove = () => {
    setManuallyEnteringVal(false)

    onRemoveSpatialFilter()
  }

  const onChangePointSearch = (event) => {
    const { value = '' } = event.target

    const trimmedValue = trimCoordinate(value)
    const point = transformSingleCoordinate(trimmedValue)
    setSPointSearch(point)
    setError(validateCoordinate(trimmedValue))
  }

  const onSubmitPointSearch = (event) => {
    if (event.type === 'blur' || event.key === 'Enter') {
      eventEmitter.emit('map.drawCancel')

      if (error === '') {
        setManuallyEnteringVal(false)

        const point = sPointSearch.length ? [sPointSearch.replace(/\s/g, '')] : []
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
    const [swPoint, nePoint] = sBoundingBoxSearch

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

    setSBoundingBoxSearch(newSearch)
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
  } = sShapefile

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
  } else if (((sPointSearch && sPointSearch.length) && !drawingNewLayer) || drawingNewLayer === 'marker' || manuallyEnteringVal === 'marker') {
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
                value={transformSingleCoordinate(sPointSearch[0])}
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
  } else if (((sBoundingBoxSearch && sBoundingBoxSearch.length) && (sBoundingBoxSearch[0] || sBoundingBoxSearch[1]) && !drawingNewLayer) || drawingNewLayer === 'rectangle' || manuallyEnteringVal === 'rectangle') {
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
                value={sBoundingBoxSearch[0]}
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
                value={sBoundingBoxSearch[1]}
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
  } else if (((sCircleSearch && sCircleSearch.length) && (sCircleSearch[0] || sCircleSearch[1]) && !drawingNewLayer) || drawingNewLayer === 'circle' || manuallyEnteringVal === 'circle') {
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
                value={sCircleSearch[0]}
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
  } else if (((sPolygonSearch && sPolygonSearch.length) && !drawingNewLayer) || drawingNewLayer === 'polygon') {
    const pointArray = sPolygonSearch.length ? sPolygonSearch[0].split(',') : []
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
  } else if (((sLineSearch && sLineSearch.length) && !drawingNewLayer) || drawingNewLayer === 'polyline') {
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
  manuallyEntering: PropTypes.string,
  onChangeQuery: PropTypes.func.isRequired,
  onRemoveSpatialFilter: PropTypes.func.isRequired,
  pointSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  polygonSearch: PropTypes.arrayOf(PropTypes.string).isRequired,
  shapefile: PropTypes.shape({}).isRequired
}

SpatialDisplay.defaultProps = {
  defaultError: '',
  manuallyEntering: ''
}

export default SpatialDisplay
