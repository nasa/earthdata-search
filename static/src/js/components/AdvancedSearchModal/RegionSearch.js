/* eslint-disable no-unused-vars */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Formik } from 'formik'
import {
  Col,
  Form,
  Row
} from 'react-bootstrap'
import { isEmpty } from 'lodash'

import Button from '../Button/Button'
import EDSCAlert from '../EDSCAlert/EDSCAlert'

import './RegionSearch.scss'

// Temporary placeholder values
// const SEARCH_RESULTS = [{
//   type: 'huc',
//   id: '12341231235',
//   name: 'Upper Coyote Creek',
//   polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
// },
// {
//   type: 'huc',
//   id: '12341231236',
//   name: 'Lower Coyote Creek',
//   polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
// }]

/**
 * Renders RegionSearch.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.field - The advanced search field for the.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Object} props.regionSearchResults - The current region search results.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
 * @param {Function} props.onChangeRegionQuery - Callback function to update the region search results.
 */
export class RegionSearch extends Component {
  constructor(props) {
    super(props)
    const {
      values
    } = props

    const {
      regionSearch: regionSearchValues = {}
    } = values

    const {
      selectedRegion: selectedRegionValues
    } = regionSearchValues

    this.state = {
      selectedRegionType: 'huc',
      regionTypes: [
        {
          type: 'huc',
          label: 'HUC ID',
          value: 'huc',
          placeholder: 'ex. 14010003'
        },
        {
          type: 'region',
          label: 'HUC Region',
          value: 'region',
          placeholder: 'ex. Colorado Mine'
        }
      ]
    }
  }

  onSearchSubmit(values) {
    const {
      onChangeRegionQuery
    } = this.props

    const {
      keyword,
      endpoint,
      exact = false
    } = values

    onChangeRegionQuery({
      exact,
      endpoint,
      keyword
    }, this.renderSearchResults())
  }

  onRemoveSelected() {
    const {
      setFieldValue,
      setModalOverlay
    } = this.props

    setFieldValue('regionSearch.selectedRegion')
    setModalOverlay(null)
  }

  getSelectedRegionType() {
    const {
      selectedRegionType,
      regionTypes
    } = this.state

    return regionTypes.find(({
      value
    }) => value === selectedRegionType)
  }

  renderSearchResults() {
    const {
      setModalOverlay,
      regionSearchResults
    } = this.props

    setModalOverlay('regionSearchResults')
  }

  render() {
    const {
      field,
      values
    } = this.props

    const {
      regionSearch: regionSearchValues = {}
    } = values

    const {
      selectedRegion
    } = regionSearchValues

    const {
      regionTypes,
      selectedRegionType
    } = this.state

    const {
      name: fieldName
    } = field

    return (
      <Formik
        initialValues={regionSearchValues}
        onSubmit={(values, props) => this.onSearchSubmit(values, props)}
      >
        {
          // eslint-disable-next-line arrow-body-style
          (regionSearchForm) => {
            const {
              errors,
              field,
              handleBlur,
              handleChange,
              handleSubmit,
              values
            } = regionSearchForm

            const {
              searchValue: searchValueErrors
            } = errors

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
                                  regionTypes.map(({
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
                                name="keyword"
                                as="input"
                                placeholder={this.getSelectedRegionType().placeholder}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={keyword}
                                isInvalid={searchValueErrors}
                              />
                              {
                                searchValueErrors && (
                                  <Form.Control.Feedback type="invalid">
                                    {searchValueErrors}
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
                                    disabled={searchValueErrors}
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
                            (selectedRegionType === 'huc' || selectedRegionType === 'region') && (
                              <EDSCAlert
                                variant="small"
                                bootstrapVariant="light"
                                icon="question-circle"
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
                          onClick={() => this.onRemoveSelected()}
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
      </Formik>
    )
  }
}

RegionSearch.defaultProps = {
  setModalOverlay: null
}

RegionSearch.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  field: PropTypes.shape({}).isRequired,
  regionSearchResults: PropTypes.shape({}).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setModalOverlay: PropTypes.func,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired,
  onChangeRegionQuery: PropTypes.func.isRequired
}

export default RegionSearch
