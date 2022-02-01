import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'
import InputRange from 'react-input-range'
import 'react-input-range/lib/css/index.css'

import {
  Alert,
  Col,
  Form,
  Row
} from 'react-bootstrap'

import './TemporalSelection.scss'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import DatepickerContainer from '../../containers/DatepickerContainer/DatepickerContainer'

/**
 * Renders TemporalSelection component
 * @param {Object} props - The props passed into the component.
 * @param {Boolean} props.allowRecurring - Flag to designate the whether recurring dates are supported
 * @param {String} props.controlId - A unique id
 * @param {String} props.format - A string temporal format
 * @param {Function} props.onChangeRecurring - Callback function to call when recurring range is changed
 * @param {Function} props.onInvalid - Callback function to call when entry is invalid
 * @param {Function} props.onRecurringToggle - Callback function to call when recurring is toggled
 * @param {Function} props.onSubmitEnd - Callback function to call when a submission ends
 * @param {Function} props.onSubmitStart - Callback function to call when a submission starts
 * @param {Function} props.onValid - Callback function to call when the entry is valid
 * @param {String} props.size - String representing the bootstrap size
 * @param {Object} props.temporal - Object configuring the temporal information
 * @param {Boolean} props.validate - Flag to designate the whether or not entry should be validated
 */

export class TemporalSelection extends Component {
  constructor(props) {
    super(props)
    const { temporal } = props
    this.state = {
      validation: {
        ...this.checkTemporal(temporal)
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const {
      onValid,
      onInvalid
    } = this.props

    const {
      temporal: nextTemporal
    } = nextProps

    const validation = this.checkTemporal(nextTemporal)

    this.setState({
      validation
    })

    if (Object.values(validation).some((value) => value) && onInvalid) {
      onInvalid()
    } else if (onValid) {
      onValid()
    }
  }

  /**
   * Check the start and end dates and return an object containing any applicable errors
   * @param {object} temporal - An object containing temporal values
   */
  checkTemporal(temporal) {
    const format = 'YYYY-MM-DDTHH:m:s.SSSZ'
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

  recurringSliderValues() {
    const { temporal } = this.props

    const {
      startDate,
      endDate
    } = temporal

    const { minimumTemporalDate } = getApplicationConfig()

    try {
      return {
        min: startDate.getFullYear(),
        max: endDate.getFullYear()
      }
    } catch (e) {
      console.log(e)

      return {
        min: moment(minimumTemporalDate).year(),
        max: new Date().getFullYear()
      }
    }
  }

  render() {
    const {
      allowRecurring,
      controlId,
      format,
      onChangeRecurring,
      onRecurringToggle,
      onSubmitEnd,
      onSubmitStart,
      size,
      temporal,
      validate
    } = this.props

    let { isRecurring } = temporal

    const {
      validation
    } = this.state

    const enableRecurring = Object.values(validation).some((isInvalid) => isInvalid === true)
    if (enableRecurring) {
      isRecurring = false
    }

    const { minimumTemporalDateString, temporalDateFormatFull } = getApplicationConfig()
    const minimumTemporalDate = moment(minimumTemporalDateString, temporalDateFormatFull)

    let sliderStartDate = moment(temporal.startDate)
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
        'temporal-selection__input-group--start'
      ),
      inputEnd: classNames(
        'temporal-selection__input-group',
        'temporal-selection__input-group--end'
      )
    }

    return (
      <div className={classes.temporalSelection}>
        <div className="temporal-selection__inputs">
          <Row>
            <Col>
              <Form.Group controlId={`${controlId}__start-date`} className={classes.inputStart}>
                <Form.Label className="temporal-selection__label">
                  Start
                </Form.Label>
                <DatepickerContainer
                  id={`${controlId}__temporal-form__start-date`}
                  onSubmit={(value) => onSubmitStart(value)}
                  type="start"
                  size={size}
                  format={format}
                  value={temporal.startDate}
                  minDate={minimumTemporalDateString}
                  maxDate={moment().utc().toISOString()}
                  shouldValidate={!isRecurring}
                  viewMode={isRecurring ? 'months' : 'years'}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={`${controlId}__end-date`} className={classes.inputEnd}>
                <Form.Label className="temporal-selection__label">
                  End
                </Form.Label>
                <DatepickerContainer
                  id={`${controlId}__temporal-form__end-date`}
                  onSubmit={(value) => onSubmitEnd(value)}
                  type="end"
                  size={size}
                  format={format}
                  value={temporal.endDate}
                  minDate={minimumTemporalDateString}
                  maxDate={moment().utc().toISOString()}
                  shouldValidate={!isRecurring}
                  viewMode={isRecurring ? 'months' : 'years'}
                />
              </Form.Group>
            </Col>
          </Row>
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
                show={
                  validation.invalidStartDate || validation.invalidEndDate
                }
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
              className="mb-0"
              controlId={`${controlId}__recurring`}
            >
              <Form.Check>
                <Form.Check.Input disabled={enableRecurring} type="checkbox" onChange={onRecurringToggle} checked={isRecurring} />
                <Form.Check.Label className="temporal-selection__label">
                  Recurring?
                </Form.Check.Label>
              </Form.Check>
            </Form.Group>
          )
        }
        {
          (allowRecurring && onChangeRecurring && isRecurring) && (
            <Form.Group className="mb-1">
              <Form.Label className="temporal-selection__label">
                Year Range:
              </Form.Label>

              <span className="temporal-selection__range-label">
                {sliderStartDate.year()}
                {' - '}
                {moment(temporal.endDate || undefined).year()}
              </span>

              <InputRange
                minValue={minimumTemporalDate.year()}
                maxValue={parseInt(new Date().getFullYear(), 10)}
                formatLabel={() => null}
                value={{
                  min: sliderStartDate.year(),
                  max: moment(temporal.endDate || undefined).year()
                }}
                onChange={(value) => onChangeRecurring(value)}
              />
            </Form.Group>
          )
        }
      </div>
    )
  }
}

TemporalSelection.defaultProps = {
  allowRecurring: true,
  format: 'YYYY-MM-DD HH:mm:ss',
  onChangeRecurring: null,
  onInvalid: null,
  onRecurringToggle: null,
  onValid: null,
  size: '',
  validate: true
}

TemporalSelection.propTypes = {
  allowRecurring: PropTypes.bool,
  controlId: PropTypes.string.isRequired,
  format: PropTypes.string,
  onChangeRecurring: PropTypes.func,
  onInvalid: PropTypes.func,
  onRecurringToggle: PropTypes.func,
  onSubmitEnd: PropTypes.func.isRequired,
  onSubmitStart: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  size: PropTypes.string,
  temporal: PropTypes.shape({
    endDate: PropTypes.instanceOf(Date),
    isRecurring: PropTypes.bool,
    startDate: PropTypes.instanceOf(Date)
  }).isRequired,
  validate: PropTypes.bool
}

export default TemporalSelection
