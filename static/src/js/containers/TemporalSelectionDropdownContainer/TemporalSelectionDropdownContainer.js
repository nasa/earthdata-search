import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Datetime from 'react-datetime'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Dropdown from 'react-bootstrap/Dropdown'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import actions from '../../actions'

import './TemporalSelectionDropdownContainer.scss'

const mapDispathToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query))
})

const mapStateToProps = state => ({
  temporalSearch: state.query.temporal
})

/**
 * Component representing the temporal selection dropdown
 * @extends Component
 */
export class TemporalSelectionDropdownContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      temporal: {
        startDate: '',
        endDate: ''
      }
    }

    this.onApplyClick = this.onApplyClick.bind(this)
    this.onClearClick = this.onClearClick.bind(this)
    this.setStartDate = this.setStartDate.bind(this)
    this.setEndDate = this.setEndDate.bind(this)
  }


  componentWillReceiveProps(nextProps) {
    const {
      temporalSearch
    } = this.props

    const [startDate, endDate] = nextProps.temporalSearch.split(',')

    if (temporalSearch !== nextProps.temporalSearch) {
      this.setState({
        temporal: {
          startDate,
          endDate
        }
      })
    }
  }

  /**
   * Sets the current start and end dates values in the Redux store
   */
  onApplyClick() {
    const { onChangeQuery } = this.props

    const { temporal } = this.state
    const { startDate, endDate } = temporal

    onChangeQuery({ temporal: [startDate, endDate].join(',') })
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
      temporal
    } = this.state

    return (
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
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

TemporalSelectionDropdownContainer.defaultProps = {
  temporalSearch: ''
}

TemporalSelectionDropdownContainer.propTypes = {
  temporalSearch: PropTypes.string,
  onChangeQuery: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispathToProps)(TemporalSelectionDropdownContainer)
