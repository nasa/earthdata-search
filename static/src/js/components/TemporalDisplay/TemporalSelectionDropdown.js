import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import './TemporalSelectionDropdown.scss'

/**
 * Component representing the temporal selection dropdown
 * @extends Component
 */
export default class TemporalSelectionDropdown extends Component {
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
    this.setEndDate = this.setEndDate.bind(this)
    this.setStartDate = this.setStartDate.bind(this)
  }


  componentWillReceiveProps(nextProps) {
    const {
      temporalSearch
    } = this.props

    const [startDate, endDate] = nextProps.temporalSearch.split(',')

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

    onChangeQuery({ temporal: [startDate, endDate].join(',') })

    this.setState({
      open: false
    })
  }

  /**
   * Clears the current temporal values internally and within the Redux store
   */
  onClearClick() {
    this.setState({
      temporal: {}
    })

    const { onChangeQuery } = this.props

    onChangeQuery({ temporal: '' })

    this.setState({
      open: false
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
        startDate: startDate ? startDate.toISOString() : ''
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
        endDate: endDate ? endDate.toISOString() : ''
      }
    })
  }

  render() {
    const {
      open,
      temporal
    } = this.state

    return (
      <Dropdown show={open} className="temporal-selection-dropdown">
        <Dropdown.Toggle
          variant="inline-block"
          id="dropdown-basic"
          className="search-form__button"
          onClick={this.onToggleClick}
        >
          <i className="fa fa-clock-o" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Row>
            <Col>
              <Form.Group controlId="startDate">
                <Form.Label>Start Date</Form.Label>
                <Datetime
                  closeOnSelect
                  dateFormat="YYYY-MM-DD HH:MM:SS"
                  onChange={value => this.setStartDate(value)}
                  value={temporal.startDate}
                  viewMode="years"
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId="endDate">
                <Form.Label>End Date</Form.Label>
                <Datetime
                  closeOnSelect
                  dateFormat="YYYY-MM-DD HH:MM:SS"
                  onChange={value => this.setEndDate(value)}
                  value={temporal.endDate}
                  viewMode="years"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button variant="primary" onClick={this.onApplyClick}>
                Apply
              </Button>
              <Button variant="light" onClick={this.onClearClick}>
                Clear
              </Button>
            </Col>
          </Row>
        </Dropdown.Menu>
      </Dropdown>
    )
  }
}

TemporalSelectionDropdown.defaultProps = {
  temporalSearch: ''
}

TemporalSelectionDropdown.propTypes = {
  onChangeQuery: PropTypes.func.isRequired,
  temporalSearch: PropTypes.string
}
