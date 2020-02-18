import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { isEqual } from 'lodash'
import moment from 'moment'

import Dropdown from 'react-bootstrap/Dropdown'

import Button from '../Button/Button'
import TemporalSelection from '../TemporalSelection/TemporalSelection'

import './TemporalSelectionDropdown.scss'
import { getTemporalDateFormat } from '../../util/edscDate'
import { getApplicationConfig } from '../../../../../sharedUtils/config'

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

    const {
      temporalSearch
    } = this.props

    const {
      startDate = '',
      endDate = '',
      recurringDayStart = '',
      recurringDayEnd = '',
      isRecurring = false
    } = temporalSearch

    this.state = {
      open: false,
      disabled: false,
      temporal: {
        endDate,
        startDate,
        recurringDayStart,
        recurringDayEnd,
        isRecurring
      }
    }

    this.onApplyClick = this.onApplyClick.bind(this)
    this.onClearClick = this.onClearClick.bind(this)
    this.onRecurringToggle = this.onRecurringToggle.bind(this)
    this.onChangeRecurring = this.onChangeRecurring.bind(this)
    this.onToggleClick = this.onToggleClick.bind(this)
    this.onDropdownToggle = this.onDropdownToggle.bind(this)
    this.setEndDate = this.setEndDate.bind(this)
    this.setStartDate = this.setStartDate.bind(this)
    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const {
      temporalSearch
    } = this.props

    const {
      startDate,
      endDate,
      recurringDayStart,
      recurringDayEnd,
      isRecurring
    } = nextProps.temporalSearch

    if (!isEqual(temporalSearch, nextProps.temporalSearch)) {
      this.setState({
        temporal: {
          startDate,
          endDate,
          recurringDayStart,
          recurringDayEnd,
          isRecurring
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
    const {
      startDate,
      endDate,
      isRecurring
    } = temporal

    const newTemporal = {
      startDate,
      endDate,
      isRecurring
    }

    if (isRecurring) {
      newTemporal.recurringDayStart = moment(startDate).utc().dayOfYear()
      newTemporal.recurringDayEnd = moment(endDate).utc().dayOfYear()
    }

    onChangeQuery({
      collection: {
        temporal: newTemporal
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
        endDate: '',
        recurringDayStart: '',
        recurringDayEnd: '',
        isRecurring: false
      },
      open: false
    })

    const { onChangeQuery } = this.props

    onChangeQuery({
      collection: {
        temporal: {}
      }
    })
  }

  /**
   * Shows or hides the recurring temporal slider depending on the current state
   */
  onRecurringToggle(e) {
    const {
      temporal
    } = this.state

    const isChecked = e.target.checked

    this.setState({
      temporal: {
        ...temporal,
        isRecurring: isChecked
      }
    })
  }

  /**
   * Shows or hides the recurring temporal slider depending on the current state
   */
  onChangeRecurring(value) {
    const {
      temporal
    } = this.state

    const { startDate, endDate } = temporal

    const newStartDate = moment(startDate || undefined).utc()
    newStartDate.set({
      year: value.min,
      hour: '00',
      minute: '00',
      second: '00'
    })

    const newEndDate = moment(endDate || undefined).utc()
    newEndDate.set({
      year: value.max,
      hour: '23',
      minute: '59',
      second: '59'
    })

    this.setState({
      temporal: {
        ...temporal,
        startDate: newStartDate.toISOString(),
        endDate: newEndDate.toISOString()
      }
    })
  }

  /**
   * Disables the submit button
   */
  onInvalid() {
    this.setState({
      disabled: true
    })
  }

  /**
   * Disables the submit button
   */
  onValid() {
    this.setState({
      disabled: false
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

    const { isRecurring } = temporal

    if (isRecurring) {
      const applicationConfig = getApplicationConfig()
      const { temporalDateFormatFull } = applicationConfig

      const startDateObject = moment(temporal.startDate, temporalDateFormatFull)

      startDate.year(startDateObject.year())
    }

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

    const { isRecurring } = temporal

    if (isRecurring) {
      const applicationConfig = getApplicationConfig()
      const { temporalDateFormatFull } = applicationConfig

      const endDateObject = moment(temporal.endDate, temporalDateFormatFull)

      endDate.year(endDateObject.year())
    }

    this.setState({
      temporal: {
        ...temporal,
        // eslint-disable-next-line no-underscore-dangle
        endDate: endDate.isValid() ? endDate.toISOString() : endDate._i
      }
    })
  }

  render() {
    const {
      disabled,
      open,
      temporal
    } = this.state

    const {
      isRecurring = false
    } = temporal

    const {
      onChangeQuery
    } = this.props

    const classes = {
      btnApply: classNames(
        'temporal-selection-dropdown__button',
        'temporal-selection-dropdown__button--apply'
      ),
      btnCancel: classNames(
        'temporal-selection-dropdown__button',
        'temporal-selection-dropdown__button--cancel'
      )
    }

    // For recurring dates we don't show the year, it's displayed on the slider
    const temporalDateFormat = getTemporalDateFormat(isRecurring)

    return (
      <Dropdown show={open} className="temporal-selection-dropdown" onToggle={this.onDropdownToggle}>
        <Dropdown.Toggle
          variant="inline-block"
          id="temporal-selection-dropdown"
          className="search-form__button search-form__button--dark"
          onClick={this.onToggleClick}
        >
          <i className="fa fa-calendar" />
        </Dropdown.Toggle>
        <Dropdown.Menu className="temporal-selection-dropdown__menu">
          <TemporalSelection
            controlId="temporal-selection-dropdown"
            temporal={temporal}
            format={temporalDateFormat}
            onRecurringToggle={this.onRecurringToggle}
            onChangeRecurring={this.onChangeRecurring}
            onChangeQuery={onChangeQuery}
            onSubmitStart={value => this.setStartDate(value)}
            onSubmitEnd={value => this.setEndDate(value)}
            onValid={this.onValid}
            onInvalid={this.onInvalid}
          />
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
