import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import moment from 'moment'

import Alert from 'react-bootstrap/Alert'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'

import Button from '../Button/Button'
import Datepicker from './Datepicker'

import './TemporalSelectionDropdown.scss'

/**
 * TODO:
 * - Find a way to prevent viewing sets of dates that do not have clickable items in the picker
 */

/**
 * Component representing the temporal selection dropdown
 * @extends PureComponent
 */
export default class TemporalSelectionDropdown extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      open: false,
      temporal: {
        endDate: '',
        startDate: ''
      }
    }

    this.onApplyClick = this.onApplyClick.bind(this)
    this.onClearClick = this.onClearClick.bind(this)
    this.onToggleClick = this.onToggleClick.bind(this)
    this.onDropdownToggle = this.onDropdownToggle.bind(this)
    this.setEndDate = this.setEndDate.bind(this)
    this.setStartDate = this.setStartDate.bind(this)
  }


  componentWillReceiveProps(nextProps) {
    const {
      temporalSearch
    } = this.props

    const { endDate, startDate } = nextProps.temporalSearch

    if (temporalSearch !== nextProps.temporalSearch) {
      this.setState({
        temporal: {
          endDate,
          startDate
        }
      })
    }
  }

  /**
   * Opens or closes the dropdown depending on the current state
   */
  onDropdownToggle() {
    const { open } = this.state

    this.setState({
      open: !open
    })
  }


  /**
   * Opens or closes the dropdown depending on the current state
   */
  onToggleClick() {
    const { open } = this.state

    this.setState({
      open: !open
    })
  }

  /**
   * Sets the current start and end dates values in the Redux store
   */
  onApplyClick() {
    const { onChangeQuery } = this.props

    const { temporal } = this.state
    const { startDate, endDate } = temporal

    onChangeQuery({
      collection: {
        temporal: {
          startDate,
          endDate
        }
      }
    })

    this.setState({
      open: false
    })
  }

  /**
   * Clears the current temporal values internally and within the Redux store
   */
  onClearClick() {
    this.setState({
      temporal: {
        startDate: '',
        endDate: ''
      },
      open: false
    })

    const { onChangeQuery } = this.props

    onChangeQuery({
      collection: {
        temporal: ''
      }
    })
  }

  /**
   * Set the startDate prop
   * @param {moment} startDate - The moment object representing the startDate
   */
  setStartDate(startDate) {
    const {
      temporal
    } = this.state

    this.setState({
      temporal: {
        ...temporal,
        // eslint-disable-next-line no-underscore-dangle
        startDate: startDate.isValid() ? startDate.toISOString() : startDate._i
      }
    })
  }

  /**
   * Set the endDate prop
   * @param {moment} endDate - The moment object representing the endDate
   */
  setEndDate(endDate) {
    const {
      temporal
    } = this.state

    this.setState({
      temporal: {
        ...temporal,
        // eslint-disable-next-line no-underscore-dangle
        endDate: endDate.isValid() ? endDate.toISOString() : endDate._i
      }
    })
  }

  /**
   * Check the start and end dates and return an object containing any applicable errors
   * @param {object} temporal - An object containing temporal values
   */
  checkTemporal(temporal) {
    const start = moment.utc(temporal.startDate, 'YYYY-MM-DDTHH:m:s.SSSZ', true)
    const end = moment.utc(temporal.endDate, 'YYYY-MM-DDTHH:m:s.SSSZ', true)
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
      open,
      temporal
    } = this.state

    const temporalState = this.checkTemporal(temporal)
    const disabled = (
      temporalState.startAfterEnd
      || temporalState.invalidStartDate
      || temporalState.invalidEndDate
    )

    const classes = {
      btnApply: classNames(
        'temporal-selection-dropdown__button',
        'temporal-selection-dropdown__button--apply'
      ),
      btnCancel: classNames(
        'temporal-selection-dropdown__button',
        'temporal-selection-dropdown__button--cancel'
      ),
      inputStart: classNames(
        'temporal-selection-dropdown__input-group',
        'temporal-selection-dropdown__input-group--start'
      ),
      inputEnd: classNames(
        'temporal-selection-dropdown__input-group',
        'temporal-selection-dropdown__input-group--end'
      )
    }

    return (
      <Dropdown show={open} className="temporal-selection-dropdown" onToggle={this.onDropdownToggle}>
        <Dropdown.Toggle
          variant="inline-block"
          id="temporal-selection-dropdown"
          className="search-form__button"
          onClick={this.onToggleClick}
        >
          <i className="fa fa-clock-o" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="temporal-selection-dropdown__menu">
          <div className="temporal-selection-dropdown__inputs">
            <Form.Group controlId="temporal-form__start-date" className={classes.inputStart}>
              <Form.Label className="temporal-selection-dropdown__label">
                Start
              </Form.Label>
              <Datepicker
                id="temporal-form__start-date"
                onSubmit={value => this.setStartDate(value)}
                type="start"
                value={temporal.startDate}
              />
            </Form.Group>
            <Form.Group controlId="temporal-form__end-date" className={classes.inputEnd}>
              <Form.Label className="temporal-selection-dropdown__label">
                End
              </Form.Label>
              <Datepicker
                id="temporal-form__end-date"
                onSubmit={value => this.setEndDate(value)}
                type="end"
                value={temporal.endDate}
              />
            </Form.Group>
          </div>
          <Alert show={temporalState.startAfterEnd} variant="danger">
            <strong>Start</strong>
            {' '}
            must be no later than
            {' '}
            <strong>End</strong>
          </Alert>
          <Alert
            variant="danger"
            show={
              temporalState.invalidStartDate || temporalState.invalidEndDate
            }
          >
            Invalid
            {` ${temporalState.invalidStartDate ? 'start' : 'end'} ` }
            date
          </Alert>
          <Form.Group controlId="temporal-form__recurring">
            <Form.Check>
              <Form.Check.Input type="checkbox" />
              <Form.Check.Label className="temporal-selection-dropdown__label">
                Recurring?
              </Form.Check.Label>
            </Form.Check>
          </Form.Group>
          <div>
            <Button
              className={classes.btnApply}
              bootstrapVariant="primary"
              label="Apply"
              onClick={this.onApplyClick}
              disabled={disabled}
            >
              Apply
            </Button>
            <Button
              className={classes.btnCancel}
              bootstrapVariant="link"
              label="Clear"
              onClick={this.onClearClick}
            >
              Clear
            </Button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

TemporalSelectionDropdown.defaultProps = {
  temporalSearch: {}
}

TemporalSelectionDropdown.propTypes = {
  onChangeQuery: PropTypes.func.isRequired,
  temporalSearch: PropTypes.shape({})
}
