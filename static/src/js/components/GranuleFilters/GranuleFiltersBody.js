import React, { Component } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
// import PropTypes from 'prop-types'

import GranuleFiltersList from './GranuleFiltersList'
import GranuleFiltersItem from './GranuleFiltersItem'
import TemporalSelection from '../TemporalSelection/TemporalSelection'

export class GranuleFiltersBody extends Component {
  constructor(props) {
    super(props)

    this.state = {
      temporal: {
        endDate: '',
        startDate: ''
      }
    }

    // this.onApplyClick = this.onApplyClick.bind(this)
    // this.onClearClick = this.onClearClick.bind(this)
    this.setEndDate = this.setEndDate.bind(this)
    this.setStartDate = this.setStartDate.bind(this)
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
    const { temporal } = this.state

    return (
      <div className="granule-filters-body">
        <GranuleFiltersList>
          <GranuleFiltersItem
            heading="Temporal"
          >
            <TemporalSelection
              controlId="granule-filters__temporal-selection"
              temporal={temporal}
              onSubmitStart={value => this.setStartDate(value)}
              onSubmitEnd={value => this.setEndDate(value)}
              onValid={this.onValid}
              onInvalid={this.onInvalid}
            />
          </GranuleFiltersItem>
          <GranuleFiltersItem
            heading="Day/Night"
            description="Find granules captured during the day, night or anytime."
          >
            <Row>
              <Col sm="auto">
                <Form.Group controlId="granule-filters__day-night-flag">
                  <Form.Control
                    as="select"
                  >
                    <option value="">Anytime</option>
                    <option value="day">Day</option>
                    <option value="night">Night</option>
                    <option value="both">Both</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </GranuleFiltersItem>
          <GranuleFiltersItem
            heading="Data Access"
          >
            <Form.Group controlId="granule-filters__data-access">
              <Form.Check
                defaultChecked
                id="input__browse-only"
                label="Find only granules that have browse images"
              />
              <Form.Check
                defaultChecked
                id="input__online-only"
                label="Find only granules that are available online"
              />
            </Form.Group>
          </GranuleFiltersItem>
        </GranuleFiltersList>
      </div>
    )
  }
}

export default GranuleFiltersBody
