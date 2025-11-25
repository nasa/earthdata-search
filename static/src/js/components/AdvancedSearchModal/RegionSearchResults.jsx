import React from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import classNames from 'classnames'

import { ArrowChevronLeft } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import './RegionSearchResults.scss'

/**
 * Renders RegionSearchResults.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.regionResults - The current region search results.
 * @param {Function} props.setFieldValue - Callback function provided by Formik.
 * @param {Function} props.setModalOverlay - Callback function to set the modal overlay.
 */
const RegionSearchResults = ({
  regionResults,
  setFieldValue,
  setModalOverlay = null
}) => {
  const onSetSelected = (result) => {
    setFieldValue('regionSearch.selectedRegion', result)
    setModalOverlay(null)
  }

  const {
    count,
    error,
    keyword,
    loading,
    regions
  } = regionResults

  const containerClasses = classNames([
    'region-search-results',
    {
      'region-search-results--is-loading': loading
    }
  ])

  return (
    <div className={containerClasses}>
      <Row className="region-search-results__back">
        <Col>
          <Button
            className="region-search-results__back-button"
            variant="naked"
            icon={ArrowChevronLeft}
            label="Back to Feature"
            onClick={
              () => {
                setModalOverlay(null)
              }
            }
          >
            Back to Feature
          </Button>
        </Col>
      </Row>
      {
        loading && (
          <div className="region-search-results__full">
            <Spinner className="region-search-results__spinner" type="dots" />
          </div>
        )
      }
      {
        (!loading && !error && regions?.length === 0) && (
          <div className="region-search-results__full">
            <span className="region-search-results__status">
              Your search returned no results.
              {' '}
              <Button
                className="region-search-results__status-link"
                variant="link"
                bootstrapVariant="link"
                label="Try again"
                onClick={
                  () => {
                    setModalOverlay(null)
                  }
                }
              >
                Try again
              </Button>
              .
            </span>
          </div>
        )
      }
      {
        (!loading && error) && (
          <div className="region-search-results__full">
            <span className="region-search-results__status region-search-results__status--error">
              {error}
              {' '}
              <Button
                className="region-search-results__status-link"
                variant="link"
                bootstrapVariant="link"
                label="Try again"
                onClick={
                  () => {
                    setModalOverlay(null)
                  }
                }
              >
                Try again
              </Button>
              .
            </span>
          </div>
        )
      }
      {
        (!loading && regions?.length > 0) && (
          <>
            <Row>
              <Col>
                <h2 className="region-search-results__list-meta">{`${regions.length} of ${count} results for "${keyword}"`}</h2>
                <p className="region-search-results__list-intro">Select a region from the list below to filter your search results.</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <ul className="region-search-results__list">
                  {
                    regions.map((region) => {
                      const { name, id, type } = region

                      return (
                        <Button
                          key={id}
                          className="region-search-results__item"
                          variant="naked"
                          onClick={() => onSetSelected(region)}
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

RegionSearchResults.propTypes = {
  regionResults: PropTypes.shape({
    count: PropTypes.number,
    error: PropTypes.string,
    keyword: PropTypes.string,
    loading: PropTypes.bool,
    regions: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
      id: PropTypes.string,
      type: PropTypes.string
    }))
  }).isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setModalOverlay: PropTypes.func
}

export default RegionSearchResults
