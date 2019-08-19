import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
// import moment from 'moment'

// import Alert from 'react-bootstrap/Alert'
import Dropdown from 'react-bootstrap/Dropdown'
// import Form from 'react-bootstrap/Form'

import Button from '../Button/Button'
import TemporalSelection from '../TemporalSelection/TemporalSelection'

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
      disabled: false,
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
    this.onValid = this.onValid.bind(this)
    this.onInvalid = this.onInvalid.bind(this)
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
        temporal: {}
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

  render() {
    const {
      disabled,
      open,
      temporal
    } = this.state

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
          <TemporalSelection
            controlId="temporal-selection-dropdown"
            temporal={temporal}
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
