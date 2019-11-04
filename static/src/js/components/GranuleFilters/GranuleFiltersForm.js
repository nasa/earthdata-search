import React from 'react'
import PropTypes from 'prop-types'
import { Form as FormikForm } from 'formik'
import { Col, Form, Row } from 'react-bootstrap'
import moment from 'moment'

import { getValueForTag } from '../../../../../sharedUtils/tags'

import GranuleFiltersList from './GranuleFiltersList'
import GranuleFiltersItem from './GranuleFiltersItem'
import TemporalSelection from '../TemporalSelection/TemporalSelection'
import { getTemporalDateFormat } from '../../util/edscDate'

/**
 * Renders GranuleFiltersForm.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Object} props.metadata - The focused collection metadata.
 * @param {Object} props.values - Form values provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 */
export const GranuleFiltersForm = (props) => {
  const {
    errors,
    handleBlur,
    handleChange,
    metadata,
    values,
    setFieldValue,
    setFieldTouched,
    touched
  } = props

  const {
    temporal = {},
    browseOnly = false,
    onlineOnly = false,
    dayNightFlag = '',
    cloudCover = {}
  } = values

  const { isRecurring } = temporal

  // For recurring dates we don't show the year, it's displayed on the slider
  const temporalDateFormat = getTemporalDateFormat(isRecurring)

  const {
    min: cloudCoverMin = '',
    max: cloudCoverMax = ''
  } = cloudCover

  const {
    is_cwic: isCwic,
    tags
  } = metadata

  const capabilities = getValueForTag('collection_capabilities', tags)

  let dayNightCapable
  let cloudCoverCapable

  if (capabilities) {
    dayNightCapable = capabilities.day_night_flag
    cloudCoverCapable = capabilities.cloud_cover
  }

  const {
    cloudCover: cloudCoverError = {},
    temporal: temporalError = {}
  } = errors

  const {
    cloudCover: cloudCoverTouched = {},
    temporal: temporalTouched = {}
  } = touched

  return (
    <FormikForm className="granule-filters-body">
      <Row>
        <Col sm={9}>
          <GranuleFiltersList>
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
                    temporal={temporal}
                    validate={false}
                    format={temporalDateFormat}
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
  metadata: PropTypes.shape({}).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired
}

export default GranuleFiltersForm
