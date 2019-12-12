import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Form,
  Row
} from 'react-bootstrap'

import Button from '../Button/Button'
import EDSCAlert from '../EDSCAlert/EDSCAlert'

import './RegionSearch.scss'

// Temporary placeholder values
const SEARCH_RESULTS = [{
  type: 'huc',
  id: '12341231235',
  name: 'Upper Cayote Creek',
  polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
},
{
  type: 'huc',
  id: '12341231236',
  name: 'Lower Cayote Creek',
  polygon: '30.57275390625,61.4593006372525,24.90106201171875,56.06661507755054,36.52569580078125,51.63698756452315,30.57275390625,61.4593006372525'
}]

/**
 * Renders RegionSearch.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.field - The advanced search field for the.
 * @param {Object} props.errors - Form errors provided by Formik.
 * @param {Function} props.handleBlur - Callback function provided by Formik.
 * @param {Function} props.handleChange - Callback function provided by Formik.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setFieldTouched - Callback function provided by Formik.
 * @param {Object} props.touched - Form state provided by Formik.
 * @param {Object} props.values - Form values provided by Formik.
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
      hasSearched: !!selectedRegionValues,
      hasSelected: !!selectedRegionValues,
      selectedRegionType: 'huc',
      results: [],
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

  onSetResults() {
    this.setState({
      hasSearched: true,
      hasSelected: false,
      results: SEARCH_RESULTS
    }, () => {
      this.renderSearchResults()
    })
  }

  onRemoveSelected() {
    const {
      setFieldValue,
      setModalOverlay
    } = this.props

    setFieldValue('regionSearch.selectedRegion')

    this.setState({
      hasSearched: false,
      hasSelected: false,
      results: []
    }, () => {
      setModalOverlay(null)
    })
  }

  onSetSelected(result) {
    const {
      setFieldValue,
      setModalOverlay
    } = this.props

    setFieldValue('regionSearch.selectedRegion', result)

    this.setState({
      hasSelected: true,
      results: []
    }, () => {
      setModalOverlay(null)
    })
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
      setModalOverlay
    } = this.props

    const {
      hasSelected,
      hasSearched,
      results
    } = this.state

    const searchResults = (
      <div className="region-search__results-overlay">
        <Row>
          <Col>
            <Button
              className="region-search__back-button"
              variant="naked"
              icon="chevron-left"
              label="Back to Region Search"
              onClick={() => {
                this.onRemoveSelected()
              }}
            >
              Back to Region Search
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 className="region-search__results-list-meta">{`${results.length} results for "122323"`}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            {
              (!hasSelected && hasSearched && results.length > 0) && (
                <ul className="region-search__results-list">
                  {
                    results.map((result) => {
                      const { name, id } = result
                      return (
                        <Button
                          key={id}
                          className="region-search__results-item"
                          variant="naked"
                          onClick={() => this.onSetSelected(result)}
                          as="li"
                          label={id}
                        >
                          <span className="region-search__selected-region-id">{id}</span>
                          <span className="region-search__selected-region-name">
                          (
                            {name}
                          )
                          </span>
                        </Button>
                      )
                    })
                  }
                </ul>
              )
            }
          </Col>
        </Row>
      </div>
    )
    setModalOverlay(searchResults)
  }

  render() {
    const {
      errors,
      field,
      handleBlur,
      handleChange,
      // eslint-disable-next-line no-unused-vars
      touched,
      values
    } = this.props

    const {
      regionSearch = {}
    } = values

    const {
      regionSearch: regionSearchErrors = {}
    } = errors

    const {
      regionType,
      searchValue = '',
      exactMatch = false,
      selectedRegion = {}
    } = regionSearch

    const {
      searchValue: searchValueErrors
    } = regionSearchErrors

    const {
      hasSearched,
      hasSelected,
      regionTypes,
      selectedRegionType
    } = this.state

    const {
      name: fieldName
    } = field

    return (
      <Row className="region-search">
        <Col>
          {
              (!hasSearched && !hasSelected) && (
                <Row>
                  <Col sm="6">
                    <Form.Group
                      as={Row}
                      controlId={`${fieldName}.regionType`}
                    >
                      <Col>
                        <Form.Control
                          name={`${fieldName}.regionType`}
                          as="select"
                          onChange={handleChange}
                          value={regionType}
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
                      controlId={`${fieldName}.searchValue`}
                    >
                      <Col>
                        <Form.Control
                          name={`${fieldName}.searchValue`}
                          as="input"
                          placeholder={this.getSelectedRegionType().placeholder}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={searchValue}
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
                            <Form.Group controlId={`${fieldName}.exactMatch`} className="mb-0">
                              <Form.Check
                                name={`${fieldName}.exactMatch`}
                                type="checkbox"
                                label="Exact match"
                                onChange={handleChange}
                                value={exactMatch}
                              />
                            </Form.Group>
                          </Col>
                          <Col sm="auto">
                            <Button
                              label="Search"
                              variant="full"
                              bootstrapVariant="light"
                              disabled={searchValueErrors}
                              onClick={() => {
                                this.onSetResults()
                              }}
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
              (hasSearched && hasSelected) && (
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

RegionSearch.defaultProps = {
  setModalOverlay: null
}

RegionSearch.propTypes = {
  errors: PropTypes.shape({}).isRequired,
  field: PropTypes.shape({}).isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setModalOverlay: PropTypes.func,
  touched: PropTypes.shape({}).isRequired,
  values: PropTypes.shape({}).isRequired
}

export default RegionSearch
