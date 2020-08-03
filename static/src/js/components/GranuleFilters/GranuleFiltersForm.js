import React from 'react'
import PropTypes from 'prop-types'
import { Form as FormikForm } from 'formik'
import { Col, Form, Row } from 'react-bootstrap'

import moment from 'moment'

import { getValueForTag } from '../../../../../sharedUtils/tags'
import { getTemporalDateFormat } from '../../util/edscDate'
import { findGridByName } from '../../util/grid'

import GranuleFiltersItem from './GranuleFiltersItem'
import GranuleFiltersList from './GranuleFiltersList'
import TemporalSelection from '../TemporalSelection/TemporalSelection'

/**
 * Renders GranuleFiltersForm.
 * @param {Object} props - The props passed into the component.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Object} props.collectionMetadata - The focused collection metadata.
 * @param {Object} props.collectionQuery - The collection query.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 */
export const GranuleFiltersForm = (props) => {
  const {
    collectionMetadata,
    collectionQuery,
    errors,
    handleBlur,
    handleChange,
    setFieldTouched,
    setFieldValue,
    touched,
    values
  } = props

  const {
    browseOnly = false,
    cloudCover = {},
    dayNightFlag = '',
    equatorCrossingDate = {},
    equatorCrossingLongitude = {},
    gridCoords = '',
    onlineOnly = false,
    orbitNumber = {},
    temporal = {}
  } = values

  const { gridName = '' } = collectionQuery
  let gridHint
  if (gridName) {
    const selectedGrid = findGridByName(gridName)
    const {
      axis0label,
      axis1label
    } = selectedGrid

    gridHint = `Enter ${axis0label} and ${axis1label} coordinates separated by spaces, e.g. "2,3 5,7 8,8"`
  }

  const { isRecurring } = temporal

  // For recurring dates we don't show the year, it's displayed on the slider
  const temporalDateFormat = getTemporalDateFormat(isRecurring)

  const {
    min: cloudCoverMin = '',
    max: cloudCoverMax = ''
  } = cloudCover

  const {
    min: orbitNumberMin = '',
    max: orbintNumberMax = ''
  } = orbitNumber

  const {
    min: equatorCrossingLongitudeMin = '',
    max: equatorCrossingLongitudeMax = ''
  } = equatorCrossingLongitude

  const {
    isCwic,
    tags
  } = collectionMetadata

  const capabilities = getValueForTag('collection_capabilities', tags)

  let dayNightCapable
  let cloudCoverCapable
  let orbitCalculatedSpatialDomainsCapable

  if (capabilities) {
    dayNightCapable = capabilities.day_night_flag
    cloudCoverCapable = capabilities.cloud_cover
    orbitCalculatedSpatialDomainsCapable = capabilities.orbit_calculated_spatial_domains
  }

  const {
    cloudCover: cloudCoverError = {},
    orbitNumber: orbitNumberError = {},
    equatorCrossingLongitude: equatorCrossingLongitudeError = {},
    equatorCrossingDate: equatorCrossingDateError = {},
    temporal: temporalError = {}
  } = errors

  const {
    cloudCover: cloudCoverTouched = {},
    orbitNumber: orbitNumberTouched = {},
    equatorCrossingLongitude: equatorCrossingLongitudeTouched = {},
    equatorCrossingDate: equatorCrossingDateTouched = {},
    temporal: temporalTouched = {}
  } = touched

  return (
    <FormikForm className="granule-filters-body">
      <Row>
        <Col sm={9}>
          <GranuleFiltersList>
            {
              gridName && (
                <GranuleFiltersItem heading="Grid Coordinates">
                  <Form.Group controlId="granule-filters_grid-coordinates">
                    <Form.Label column sm={3}>
                      {gridName}
                      {' '}
                      Coordinates
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Control
                        name="gridCoords"
                        type="text"
                        placeholder="Coordinates..."
                        value={gridCoords}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Form.Text muted>
                        {gridHint}
                      </Form.Text>
                    </Col>
                  </Form.Group>
                </GranuleFiltersItem>
              )
            }
            <GranuleFiltersItem
              heading="Temporal"
            >
              <Form.Group controlId="granule-filters__temporal">
                <Form.Control
                  as="div"
                  className="form-control-basic"
                  isInvalid={
                    (temporalTouched.startDate && !!temporalError.startDate)
                    || (temporalTouched.endDate && !!temporalError.endDate)
                  }
                >
                  <TemporalSelection
                    controlId="granule-filters__temporal-selection"
                    format={temporalDateFormat}
                    temporal={temporal}
                    validate={false}
                    onRecurringToggle={(e) => {
                      const isChecked = e.target.checked

                      setFieldValue('temporal.isRecurring', isChecked)
                      setFieldTouched('temporal.isRecurring', isChecked)
                    }}
                    onChangeRecurring={(value) => {
                      const { temporal } = values

                      const newStartDate = moment(temporal.startDate || undefined).utc()
                      newStartDate.set({
                        year: value.min,
                        hour: '00',
                        minute: '00',
                        second: '00'
                      })

                      const newEndDate = moment(temporal.endDate || undefined).utc()
                      newEndDate.set({
                        year: value.max,
                        hour: '23',
                        minute: '59',
                        second: '59'
                      })

                      setFieldValue('temporal.startDate', newStartDate.toISOString())
                      setFieldTouched('temporal.startDate')

                      setFieldValue('temporal.endDate', newEndDate.toISOString())
                      setFieldTouched('temporal.endDate')

                      setFieldValue('temporal.recurringDayStart', newStartDate.dayOfYear())
                      setFieldValue('temporal.recurringDayEnd', newEndDate.dayOfYear())
                    }}
                    onSubmitStart={(startDate) => {
                      // eslint-disable-next-line no-underscore-dangle
                      const value = startDate.isValid() ? startDate.toISOString() : startDate._i
                      setFieldValue('temporal.startDate', value)
                      setFieldTouched('temporal.startDate')

                      const { temporal } = values
                      if (temporal.isRecurring) {
                        setFieldValue('temporal.recurringDayStart', startDate.dayOfYear())
                      }
                    }}
                    onSubmitEnd={(endDate) => {
                      // eslint-disable-next-line no-underscore-dangle
                      const value = endDate.isValid() ? endDate.toISOString() : endDate._i
                      setFieldValue('temporal.endDate', value)
                      setFieldTouched('temporal.endDate')

                      const { temporal } = values
                      if (temporal.isRecurring) {
                        setFieldValue('temporal.recurringDayEnd', endDate.dayOfYear())
                      }
                    }}
                  />
                </Form.Control>
                {
                  temporalTouched.startDate && (
                    <>
                      <Form.Control.Feedback type="invalid">
                        {temporalError.startDate}
                      </Form.Control.Feedback>
                    </>
                  )
                }
                {
                  temporalTouched.endDate && (
                    <>
                      <Form.Control.Feedback type="invalid">
                        {temporalError.endDate}
                      </Form.Control.Feedback>
                    </>
                  )
                }
              </Form.Group>
            </GranuleFiltersItem>
            {
              !isCwic && (
                <>
                  {
                    dayNightCapable && (
                      <GranuleFiltersItem
                        heading="Day/Night"
                        description="Find granules captured during the day, night or anytime."
                      >
                        <Row>
                          <Col sm="auto">
                            <Form.Group controlId="granule-filters__day-night-flag">
                              <Form.Control
                                name="dayNightFlag"
                                as="select"
                                value={dayNightFlag}
                                onChange={handleChange}
                              >
                                <option value="">Anytime</option>
                                <option value="DAY">Day</option>
                                <option value="NIGHT">Night</option>
                                <option value="BOTH">Both</option>
                              </Form.Control>
                            </Form.Group>
                          </Col>
                        </Row>
                      </GranuleFiltersItem>
                    )
                  }
                  <GranuleFiltersItem
                    heading="Data Access"
                  >
                    <Form.Group controlId="granule-filters__data-access">
                      <Form.Check
                        id="input__browse-only"
                        name="browseOnly"
                        label="Find only granules that have browse images"
                        checked={browseOnly}
                        value={browseOnly}
                        onChange={handleChange}
                      />
                      <Form.Check
                        id="input__online-only"
                        name="onlineOnly"
                        label="Find only granules that are available online"
                        checked={onlineOnly}
                        value={onlineOnly}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </GranuleFiltersItem>
                  {
                    cloudCoverCapable && (
                      <GranuleFiltersItem
                        heading="Cloud Cover"
                        description="Find granules by cloud cover percentage."
                      >
                        <Form.Group as={Row} controlId="granule-filters__cloud-cover-min">
                          <Form.Label column sm={3}>
                            Minimum
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              name="cloudCover.min"
                              type="text"
                              placeholder="Example: 10"
                              value={cloudCoverMin}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={cloudCoverTouched.min && !!cloudCoverError.min}
                            />
                            {
                              cloudCoverTouched.min && (
                                <Form.Control.Feedback type="invalid">
                                  {cloudCoverError.min}
                                </Form.Control.Feedback>
                              )
                            }
                          </Col>
                        </Form.Group>
                        <Form.Group as={Row} controlId="granule-filters__cloud-cover-max">
                          <Form.Label column sm={3}>
                            Maximum
                          </Form.Label>
                          <Col sm={9}>
                            <Form.Control
                              name="cloudCover.max"
                              type="text"
                              placeholder="Example: 50"
                              value={cloudCoverMax}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              isInvalid={cloudCoverTouched.max && !!cloudCoverError.max}
                            />
                            {
                              cloudCoverTouched.max && (
                                <Form.Control.Feedback type="invalid">
                                  {cloudCoverError.max}
                                </Form.Control.Feedback>
                              )
                            }
                          </Col>
                        </Form.Group>
                      </GranuleFiltersItem>
                    )
                  }
                  {
                    (!isCwic && orbitCalculatedSpatialDomainsCapable) && (
                      <>
                        <GranuleFiltersItem
                          heading="Orbit Number"
                        >
                          <Form.Group as={Row} controlId="granule-filters__orbit-number-min">
                            <Form.Label column sm={3}>
                              Minimum
                            </Form.Label>
                            <Col sm={9}>
                              <Form.Control
                                name="orbitNumber.min"
                                type="text"
                                placeholder="Example: 30000"
                                value={orbitNumberMin}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={orbitNumberTouched.min && !!orbitNumberError.min}

                              />
                              {
                                orbitNumberTouched.min && (
                                  <Form.Control.Feedback type="invalid">
                                    {orbitNumberError.min}
                                  </Form.Control.Feedback>
                                )
                              }
                            </Col>
                          </Form.Group>
                          <Form.Group as={Row} controlId="granule-filters__orbit-number-max">
                            <Form.Label column sm={3}>
                              Maximum
                            </Form.Label>
                            <Col sm={9}>
                              <Form.Control
                                name="orbitNumber.max"
                                type="text"
                                placeholder="Example: 30009"
                                value={orbintNumberMax}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={orbitNumberTouched.max && !!orbitNumberError.max}
                              />
                              {
                                orbitNumberTouched.min && (
                                  <Form.Control.Feedback type="invalid">
                                    {orbitNumberError.max}
                                  </Form.Control.Feedback>
                                )
                              }
                            </Col>
                          </Form.Group>
                        </GranuleFiltersItem>

                        <GranuleFiltersItem
                          heading="Equatorial Crossing Longitude"
                        >
                          <Form.Group as={Row} controlId="granule-filters__equatorial-crossing-longitude-min">
                            <Form.Label column sm={3}>
                               Minimum
                            </Form.Label>
                            <Col sm={9}>
                              <Form.Control
                                name="equatorCrossingLongitude.min"
                                type="text"
                                placeholder="Example: -45"
                                value={equatorCrossingLongitudeMin}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={equatorCrossingLongitudeTouched.min
                                  && !!equatorCrossingLongitudeError.min}
                              />
                              {
                                equatorCrossingLongitudeTouched.min && (
                                  <Form.Control.Feedback type="invalid">
                                    {equatorCrossingLongitudeError.min}
                                  </Form.Control.Feedback>
                                )
                              }
                            </Col>
                          </Form.Group>
                          <Form.Group as={Row} controlId="granule-filters__equatorial-crossing-longitude-max">
                            <Form.Label column sm={3}>
                              Maximum
                            </Form.Label>
                            <Col sm={9}>
                              <Form.Control
                                name="equatorCrossingLongitude.max"
                                type="text"
                                placeholder="Example: 45"
                                value={equatorCrossingLongitudeMax}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                isInvalid={equatorCrossingLongitudeTouched.max
                                  && !!equatorCrossingLongitudeError.max}
                              />
                              {
                                equatorCrossingLongitudeTouched.max && (
                                  <Form.Control.Feedback type="invalid">
                                    {equatorCrossingLongitudeError.max}
                                  </Form.Control.Feedback>
                                )
                              }
                            </Col>
                          </Form.Group>
                        </GranuleFiltersItem>

                        <GranuleFiltersItem
                          heading="Equatorial Crossing Date"
                        >
                          <Form.Group controlId="granule-filters__equatorial-crossing-date">
                            <Form.Control
                              as="div"
                              className="form-control-basic"
                              isInvalid={
                                (equatorCrossingDateTouched.startDate
                                  && !!equatorCrossingDateError.startDate)
                                || (equatorCrossingDateTouched.endDate
                                  && !!equatorCrossingDateError.endDate)
                              }
                            >
                              <TemporalSelection
                                allowRecurring={false}
                                controlId="granule-filters__equatorial-crossing-date-selection"
                                format={temporalDateFormat}
                                temporal={equatorCrossingDate}
                                validate={false}
                                onSubmitStart={(startDate) => {
                                  const value = startDate.isValid()
                                    // eslint-disable-next-line no-underscore-dangle
                                    ? startDate.toISOString() : startDate._i
                                  setFieldValue('equatorCrossingDate.startDate', value)
                                  setFieldTouched('equatorCrossingDate.startDate')
                                }}
                                onSubmitEnd={(endDate) => {
                                  const value = endDate.isValid()
                                  // eslint-disable-next-line no-underscore-dangle
                                    ? endDate.toISOString() : endDate._i
                                  setFieldValue('equatorCrossingDate.endDate', value)
                                  setFieldTouched('equatorCrossingDate.endDate')
                                }}
                              />
                            </Form.Control>
                            {
                              equatorCrossingDateTouched.startDate && (
                                <>
                                  <Form.Control.Feedback type="invalid">
                                    {equatorCrossingDateError.startDate}
                                  </Form.Control.Feedback>
                                </>
                              )
                            }
                            {
                              equatorCrossingDateTouched.endDate && (
                                <>
                                  <Form.Control.Feedback type="invalid">
                                    {equatorCrossingDateError.endDate}
                                  </Form.Control.Feedback>
                                </>
                              )
                            }
                          </Form.Group>
                        </GranuleFiltersItem>
                      </>
                    )
                  }
                </>
              )
            }
          </GranuleFiltersList>
        </Col>
      </Row>
    </FormikForm>
  )
}

GranuleFiltersForm.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionQuery: PropTypes.shape({}).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired
}

export default GranuleFiltersForm
