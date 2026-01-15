import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import InputRange from 'react-input-range'

import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'

import DatepickerContainer from '../../containers/DatepickerContainer/DatepickerContainer'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

import './TemporalSelection.scss'
import 'react-input-range/lib/css/index.css'

/**
 * Check the start and end dates and return an object containing any applicable errors
 * @param {object} temporal - An object containing temporal values
 */
const checkTemporal = (temporal) => {
  const format = moment.ISO_8601
  const start = moment.utc(temporal.startDate, format, true)

  const end = moment.utc(temporal.endDate, format, true)
  const value = {
    invalidEndDate: false,
    invalidStartDate: false,
    startAfterEnd: false
  }

  if (temporal && temporal.startDate && temporal.endDate) {
    if (end.isBefore(start)) {
      value.startAfterEnd = true
    }
  }

  if (temporal && temporal.startDate) {
    value.invalidStartDate = !start.isValid()
  }

  if (temporal && temporal.endDate) {
    value.invalidEndDate = !end.isValid()
  }

  return value
}

/**
 * Renders TemporalSelection component
 * @param {Object} props - The props passed into the component.
 * @param {Boolean} props.allowRecurring - Flag to designate the whether recurring dates are supported
 * @param {String} props.controlId - A unique id
 * @param {String} props.displayEndDate - A string representing the end date to display
 * @param {String} props.displayStartDate - A string representing the start date to display
 * @param {String} props.filterType - A string indicating if the filter is for collections or granules
 * @param {String} props.format - A string temporal format
 * @param {Function} props.onChangeRecurring - Callback function to call when recurring range is changed
 * @param {Function} props.onInvalid - Callback function to call when entry is invalid
 * @param {Function} props.onRecurringToggle - Callback function to call when recurring is toggled
 * @param {Function} props.onSliderChange - Callback function when year range slider is moved
 * @param {Function} props.onSubmitEnd - Callback function to call when a submission ends
 * @param {Function} props.onSubmitStart - Callback function to call when a submission starts
 * @param {Function} props.onValid - Callback function to call when the entry is valid
 * @param {String} props.size - String representing the bootstrap size
 * @param {Object} props.temporal - Object configuring the temporal information
 * @param {Boolean} props.validate - Flag to designate the whether or not entry should be validated
 */
const TemporalSelection = ({
  allowRecurring = true,
  controlId,
  displayEndDate = '',
  displayStartDate = '',
  filterType = 'granule',
  format = 'YYYY-MM-DD HH:mm:ss',
  onChangeRecurring = null,
  onInvalid = null,
  onRecurringToggle = null,
  onSliderChange = null,
  onSubmitEnd,
  onSubmitStart,
  onValid = null,
  size = '',
  temporal,
  validate = true
}) => {
  const [validation, setValidation] = useState(checkTemporal(temporal))

  useEffect(() => {
    const newValidation = checkTemporal(temporal)

    setValidation(newValidation)

    if (Object.values(newValidation).some((value) => value) && onInvalid) {
      onInvalid()
    } else if (onValid) {
      onValid()
    }
  }, [temporal])

  let { isRecurring } = temporal

  const enableRecurring = Object.values(validation).some((isInvalid) => isInvalid === true)
  if (enableRecurring) {
    isRecurring = false
  }

  const { minimumTemporalDateString, temporalDateFormatFull } = getApplicationConfig()
  const minimumTemporalDate = moment(minimumTemporalDateString, temporalDateFormatFull)

  let sliderStartDate = moment(temporal.startDate).utc()
  const sliderEndDate = moment(temporal.endDate || undefined).utc()

  if (!sliderStartDate.isValid()) {
    sliderStartDate = moment()
    sliderStartDate.set({
      year: minimumTemporalDate.year(),
      hour: 0,
      minute: 0,
      second: 0
    })
  }

  const classes = {
    temporalSelection: classNames({
      'temporal-selection': true,
      'temporal-selection--is-recurring': isRecurring
    }),
    inputStart: classNames(
      'temporal-selection__input-group',
      'temporal-selection__input-group--start',
      'flex-grow-1'
    ),
    inputEnd: classNames(
      'temporal-selection__input-group',
      'temporal-selection__input-group--end',
      'flex-grow-1'
    )
  }

  return (
    <div className={classes.temporalSelection}>
      <div className="temporal-selection__inputs mb-1 d-flex gap-3">
        <Form.Group controlId={`${controlId}__start-date`} className={classes.inputStart}>
          <Form.Label className="temporal-selection__label">
            Start
          </Form.Label>
          <DatepickerContainer
            id={`${controlId}__temporal-form__start-date`}
            label="Start Date"
            onSubmit={onSubmitStart}
            filterType={filterType}
            type="start"
            size={size}
            format={format}
            value={displayStartDate}
            minDate={minimumTemporalDateString}
            maxDate={moment().utc().toISOString()}
            shouldValidate={!isRecurring}
            viewMode={isRecurring ? 'months' : 'years'}
          />
        </Form.Group>
        <Form.Group controlId={`${controlId}__end-date`} className={classes.inputEnd}>
          <Form.Label className="temporal-selection__label">
            End
          </Form.Label>
          <DatepickerContainer
            id={`${controlId}__temporal-form__end-date`}
            label="End Date"
            onSubmit={onSubmitEnd}
            filterType={filterType}
            type="end"
            size={size}
            format={format}
            value={displayEndDate}
            minDate={minimumTemporalDateString}
            maxDate={moment().utc().toISOString()}
            shouldValidate={!isRecurring}
            viewMode={isRecurring ? 'months' : 'years'}
          />
        </Form.Group>
      </div>
      {
        validate && (
          <>
            <Alert show={validation.startAfterEnd} variant="danger">
              <strong>Start</strong>
              {' '}
              must be no later than
              {' '}
              <strong>End</strong>
            </Alert>
            <Alert
              variant="danger"
              show={validation.invalidStartDate || validation.invalidEndDate}
            >
              Invalid
              {` ${validation.invalidStartDate ? 'start' : 'end'} `}
              date
            </Alert>
          </>
        )
      }
      {
        (allowRecurring && onRecurringToggle) && (
          <Form.Group
            className="mb-1"
            controlId={`${controlId}__recurring`}
          >
            <Form.Check>
              <Form.Check.Input
                disabled={enableRecurring}
                type="checkbox"
                onChange={onRecurringToggle}
                checked={isRecurring}
              />
              <Form.Check.Label className="temporal-selection__label">
                Use a recurring date range
              </Form.Check.Label>
            </Form.Check>
          </Form.Group>
        )
      }
      {
        (allowRecurring && onChangeRecurring && isRecurring) && (
          <Form.Group className="mb-3">
            <Form.Label className="temporal-selection__label">
              Year Range:
            </Form.Label>

            <span className="temporal-selection__range-label">
              {sliderStartDate.year()}
              {' - '}
              {sliderEndDate.year()}
            </span>

            <InputRange
              minValue={minimumTemporalDate.year()}
              maxValue={parseInt(new Date().getFullYear(), 10)}
              formatLabel={() => null}
              value={
                {
                  min: sliderStartDate.year(),
                  max: sliderEndDate.year()
                }
              }
              onChange={onSliderChange}
              onChangeComplete={(value) => onChangeRecurring && onChangeRecurring(value)}
            />
          </Form.Group>
        )
      }
    </div>
  )
}

TemporalSelection.propTypes = {
  allowRecurring: PropTypes.bool,
  controlId: PropTypes.string.isRequired,
  displayEndDate: PropTypes.string,
  displayStartDate: PropTypes.string,
  filterType: PropTypes.string,
  format: PropTypes.string,
  onChangeRecurring: PropTypes.func,
  onInvalid: PropTypes.func,
  onRecurringToggle: PropTypes.func,
  onSliderChange: PropTypes.func,
  onSubmitEnd: PropTypes.func.isRequired,
  onSubmitStart: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  size: PropTypes.string,
  temporal: PropTypes.shape({
    endDate: PropTypes.string,
    isRecurring: PropTypes.bool,
    startDate: PropTypes.string
  }).isRequired,
  validate: PropTypes.bool
}

export default TemporalSelection
