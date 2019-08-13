import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'

import {
  Alert,
  Col,
  Form,
  Row
} from 'react-bootstrap'

import Datepicker from '../Datepicker/Datepicker'

import './TemporalSelection.scss'

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

  componentWillReceiveProps(nextProps) {
    const {
      onValid,
      onInvalid
    } = this.props
    const {
      temporal
    } = nextProps

    const validation = this.checkTemporal(temporal)

    this.setState({
      validation
    })

    if (Object.values(validation).some(value => value) && onInvalid) {
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
    const { format } = this.props
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

  render() {
    const {
      controlId,
      temporal,
      onSubmitStart,
      onSubmitEnd,
      validate
    } = this.props

    const {
      validation
    } = this.state

    const classes = {
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
      <div className="temporal-selection">
        <div className="temporal-selection__inputs">
          <Row>
            <Col sm={12} md={6}>
              <Form.Group controlId={`${controlId}__start-date`} className={classes.inputStart}>
                <Form.Label className="temporal-selection__label">
                  Start
                </Form.Label>
                <Datepicker
                  id="temporal-form__start-date"
                  onSubmit={value => onSubmitStart(value)}
                  type="start"
                  value={temporal.startDate}
                />
              </Form.Group>
            </Col>
            <Col sm={12} md={6}>
              <Form.Group controlId={`${controlId}__end-date`} className={classes.inputEnd}>
                <Form.Label className="temporal-selection__label">
                  End
                </Form.Label>
                <Datepicker
                  id="temporal-form__end-date"
                  onSubmit={value => onSubmitEnd(value)}
                  type="end"
                  value={temporal.endDate}
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
        <Form.Group
          className="mb-0"
          controlId={`${controlId}__recurring`}
        >
          <Form.Check>
            <Form.Check.Input type="checkbox" />
            <Form.Check.Label className="temporal-selection__label">
              Recurring?
            </Form.Check.Label>
          </Form.Check>
        </Form.Group>
      </div>
    )
  }
}

TemporalSelection.defaultProps = {
  format: 'YYYY-MM-DDTHH:m:s.SSSZ',
  onValid: null,
  onInvalid: null,
  validate: true
}

TemporalSelection.propTypes = {
  controlId: PropTypes.string.isRequired,
  format: PropTypes.string,
  onSubmitStart: PropTypes.func.isRequired,
  onSubmitEnd: PropTypes.func.isRequired,
  temporal: PropTypes.shape({}).isRequired,
  onValid: PropTypes.func,
  onInvalid: PropTypes.func,
  validate: PropTypes.bool
}

export default TemporalSelection
