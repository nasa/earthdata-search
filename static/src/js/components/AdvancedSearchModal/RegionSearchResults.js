import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Row
} from 'react-bootstrap'

import Button from '../Button/Button'

import './RegionSearchResults.scss'

/**
 * Renders RegionSearchResults.
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
  onSetSelected(result) {
    const {
      setFieldValue,
      setModalOverlay
    } = this.props

    setFieldValue('regionSearch.selectedRegion', result)
    setModalOverlay(null)
  }

  render() {
    const {
      regionSearchResults,
      setModalOverlay
    } = this.props

    const {
      keyword: regionResultsKeyword,
      allIds: regionResultIds,
      byId: regionResultsById
    } = regionSearchResults

    return (
      <div className="region-search-results">
        <Row>
          <Col>
            <Button
              className="region-search-results__back-button"
              variant="naked"
              icon="chevron-left"
              label="Back to Region Search"
              onClick={() => {
                setModalOverlay(null)
              }}
            >
                Back to Region Search
            </Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2 className="region-search-results__list-meta">{`${regionResultIds.length} results for "${regionResultsKeyword}"`}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            {
              regionResultIds.length > 0 && (
                <ul className="region-search-results__list">
                  {
                    regionResultIds.map((resId) => {
                      const result = regionResultsById[resId]
                      const { name, id } = result
                      return (
                        <Button
                          key={id}
                          className="region-search-results__results-item"
                          variant="naked"
                          onClick={() => this.onSetSelected(result)}
                          as="li"
                          label={id}
                        >
                          <span className="region-search-results__selected-region-id">{id}</span>
                          <span className="region-search-results__selected-region-name">
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
  }
}

RegionSearch.defaultProps = {
  setModalOverlay: null
}

RegionSearch.propTypes = {
  regionSearchResults: PropTypes.shape({}).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setModalOverlay: PropTypes.func
}

export default RegionSearch
