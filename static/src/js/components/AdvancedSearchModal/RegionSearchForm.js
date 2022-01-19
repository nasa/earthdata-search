import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Form,
  Row
} from 'react-bootstrap'
import { isEmpty } from 'lodash'
import { FaQuestionCircle } from 'react-icons/fa'

import Button from '../Button/Button'
import EDSCAlert from '../EDSCAlert/EDSCAlert'

export class RegionSearchForm extends Component {
  constructor(props) {
    super(props)
    this.endpoints = [
      {
        type: 'huc',
        label: 'HUC ID',
        value: 'huc',
        placeholder: 'ex. 1805000301'
      },
      {
        type: 'region',
        label: 'HUC Region',
        value: 'region',
        placeholder: 'ex. Colorado Mine'
      },
      {
        type: 'reach',
        label: 'River Reach',
        value: 'rivers/reach',
        placeholder: 'ex. 11410000013'
      }
    ]

    this.handleKeypress = this.handleKeypress.bind(this)
  }

  componentDidMount() {
    const {
      regionSearchForm
    } = this.props

    const {
      validateForm
    } = regionSearchForm

    validateForm()
  }

  handleKeypress(event) {
    const {
      regionSearchForm
    } = this.props

    const {
      handleSubmit
    } = regionSearchForm

    if (event.key === 'Enter') {
      handleSubmit()

      event.stopPropagation()
      event.preventDefault()
    }
  }

  getEndpointData(endpoint) {
    return this.endpoints.find(({
      value
    }) => value === endpoint)
  }

  render() {
    const {
      regionSearchForm,
      selectedRegion,
      onRemoveSelected
    } = this.props

    const {
      errors,
      handleBlur,
      handleChange,
      handleSubmit,
      touched,
      values,
      isValid
    } = regionSearchForm

    const {
      keyword: keywordErrors
    } = errors

    const {
      keyword: keywordTouched
    } = touched

    const {
      endpoint,
      keyword = '',
      exact = false
    } = values

    return (
      <Row className="region-search">
        <Col>
          {
          isEmpty(selectedRegion) && (
            <Row>
              <Col sm="6">
                <Form.Group
                  as={Row}
                  controlId="endpoint"
                >
                  <Col>
                    <Form.Control
                      name="endpoint"
                      as="select"
                      onChange={handleChange}
                      value={endpoint}
                    >
                      {
                        this.endpoints.map(({
                          label,
                          value
                        }) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {label}
                          </option>
                        ))
                      }
                    </Form.Control>
                  </Col>
                </Form.Group>
                <Form.Group
                  as={Row}
                  controlId="keyword"
                >
                  <Col>
                    <Form.Control
                      autoComplete="off"
                      name="keyword"
                      as="input"
                      placeholder={this.getEndpointData(endpoint).placeholder}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={keyword}
                      onKeyPress={this.handleKeypress}
                      isInvalid={keywordErrors && keywordTouched}
                    />
                    {
                      (keywordErrors && keywordTouched) && (
                        <Form.Control.Feedback type="invalid">
                          {keywordErrors}
                        </Form.Control.Feedback>
                      )
                    }
                  </Col>
                </Form.Group>
                <Row>
                  <Col>
                    <Row className="align-items-center">
                      <Col>
                        <Form.Group controlId="exact" className="mb-0">
                          <Form.Check
                            name="exact"
                            type="checkbox"
                            label="Exact match"
                            onChange={handleChange}
                            value={exact}
                          />
                        </Form.Group>
                      </Col>
                      <Col sm="auto">
                        <Button
                          label="Search"
                          variant="full"
                          bootstrapVariant="light"
                          disabled={!isValid}
                          onClick={handleSubmit}
                          type="button"
                        >
                          Search
                        </Button>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col>
                {
                  (endpoint === 'huc' || endpoint === 'region') && (
                    <EDSCAlert
                      variant="small"
                      bootstrapVariant="light"
                      icon={FaQuestionCircle}
                    >
                      Find more information about Hydrological Units at
                      {' '}
                      <a
                        className="link--external"
                        target="_blank"
                        rel="noreferrer noopener"
                        href="https://water.usgs.gov/GIS/huc.html"
                      >
                        https://water.usgs.gov/GIS/huc.html
                      </a>
                    </EDSCAlert>
                  )
                }
              </Col>
            </Row>
          )
        }
          {
          !isEmpty(selectedRegion) && (
            <p className="region-search__selected-region">
              <span className="region-search__selected-region-id">{`${selectedRegion.type.toUpperCase()} ${selectedRegion.id}`}</span>
              <span className="region-search__selected-region-name">
                (
                {selectedRegion.name}
                )
              </span>
              <Button
                bootstrapVariant="light"
                bootstrapSize="sm"
                label="Remove"
                onClick={onRemoveSelected}
              >
                Remove
              </Button>
            </p>
          )
        }
        </Col>
      </Row>
    )
  }
}

RegionSearchForm.defaultProps = {
  selectedRegion: {}
}

RegionSearchForm.propTypes = {
  regionSearchForm: PropTypes.shape({
    errors: PropTypes.arrayOf(PropTypes.shape({})),
    handleBlur: PropTypes.func,
    handleChange: PropTypes.func,
    handleSubmit: PropTypes.func,
    touched: PropTypes.shape({
      keyword: PropTypes.string
    }).isRequired,
    values: PropTypes.shape({
      endpoint: PropTypes.string,
      keyword: PropTypes.string,
      exact: PropTypes.bool
    }).isRequired,
    isValid: PropTypes.bool,
    validateForm: PropTypes.func
  }).isRequired,
  selectedRegion: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    type: PropTypes.string
  }),
  onRemoveSelected: PropTypes.func.isRequired
}

export default RegionSearchForm
