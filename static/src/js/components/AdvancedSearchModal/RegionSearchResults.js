import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Row
} from 'react-bootstrap'
import classNames from 'classnames'
import { FaChevronLeft } from 'react-icons/fa'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

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
      error: regionResultsError,
      byId: regionResultsById,
      isLoading: regionSearchIsLoading,
      isLoaded: regionSearchIsLoaded
    } = regionSearchResults

    const containerClasses = classNames([
      'region-search-results',
      {
        'region-search-results--is-loading': regionSearchIsLoading
      }
    ])

    return (
      <div className={containerClasses}>
        <Row className="region-search-results__back">
          <Col>
            <Button
              className="region-search-results__back-button"
              variant="naked"
              icon={FaChevronLeft}
              label="Back to Feature"
              onClick={() => {
                setModalOverlay(null)
              }}
            >
              Back to Feature
            </Button>
          </Col>
        </Row>
        {
          regionSearchIsLoading && (
            <div className="region-search-results__full">
              <Spinner className="region-search-results__spinner" type="dots" />
            </div>
          )
        }
        {
          (!regionSearchIsLoading && !regionResultsError
          && regionSearchIsLoaded && regionResultIds.length === 0) && (
            <div className="region-search-results__full">
              <span className="region-search-results__status">
                Your search returned no results.
                {' '}
                <Button
                  className="region-search-results__status-link"
                  variant="link"
                  bootstrapVariant="link"
                  label="Try again"
                  onClick={() => {
                    setModalOverlay(null)
                  }}
                >
                  Try again
                </Button>
                .
              </span>
            </div>
          )
        }
        {
          (!regionSearchIsLoading && regionResultsError) && (
            <div className="region-search-results__full">
              <span className="region-search-results__status region-search-results__status--error">
                {regionResultsError}
                {' '}
                <Button
                  className="region-search-results__status-link"
                  variant="link"
                  bootstrapVariant="link"
                  label="Try again"
                  onClick={() => {
                    setModalOverlay(null)
                  }}
                >
                  Try again
                </Button>
                .
              </span>
            </div>
          )
        }
        {
          (!regionSearchIsLoading && regionSearchIsLoaded && regionResultIds.length > 0) && (
            <>
              <Row>
                <Col>
                  <h2 className="region-search-results__list-meta">{`${regionResultIds.length} results for "${regionResultsKeyword}"`}</h2>
                  <p className="region-search-results__list-intro">Select a region from the list below to filter your search results.</p>
                </Col>
              </Row>
              <Row>
                <Col>
                  <ul className="region-search-results__list">
                    {
                      regionResultIds.map((resId) => {
                        const result = regionResultsById[resId]
                        const { name, id, type } = result
                        return (
                          <Button
                            key={id}
                            className="region-search-results__item"
                            variant="naked"
                            onClick={() => this.onSetSelected(result)}
                            as="li"
                            label={id}
                          >
                            <span className="region-search-results__selected-region-id">
                              {`${type.toUpperCase()} ${id}`}
                            </span>
                            <span className="region-search-results__selected-region-name">
                              {name}
                            </span>
                          </Button>
                        )
                      })
                    }
                  </ul>
                </Col>
              </Row>
            </>
          )
        }
      </div>
    )
  }
}

RegionSearch.defaultProps = {
  setModalOverlay: null
}

RegionSearch.propTypes = {
  regionSearchResults: PropTypes.shape({
    keyword: PropTypes.string,
    allIds: PropTypes.arrayOf(PropTypes.string),
    error: PropTypes.string,
    byId: PropTypes.shape({}),
    isLoading: PropTypes.bool,
    isLoaded: PropTypes.bool
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setModalOverlay: PropTypes.func
}

export default RegionSearch
