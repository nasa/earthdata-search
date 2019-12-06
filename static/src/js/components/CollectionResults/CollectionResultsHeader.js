import React from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Row } from 'react-bootstrap'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import Button from '../Button/Button'

import './CollectionResultsHeader.scss'

const CollectionResultsHeader = ({
  collectionQuery,
  portal,
  onChangeQuery,
  onMetricsCollectionSortChange,
  onToggleAdvancedSearchModal
}) => {
  const { hideCollectionFilters } = portal

  const handleSortSelect = (event) => {
    const { target } = event
    const { value } = target
    const sortKey = value === 'relevance' ? undefined : [value]

    onChangeQuery({
      collection: {
        sortKey
      }
    })

    onMetricsCollectionSortChange({ value })
  }

  const handleCheckboxCheck = (event) => {
    const { target } = event
    const { checked, id } = target

    const collection = {}
    if (id === 'input__non-eosdis') {
      if (checked) collection.tagKey = undefined
      if (!checked) collection.tagKey = getApplicationConfig().eosdisTagKey
    }

    if (id === 'input__only-granules') {
      if (checked) collection.hasGranulesOrCwic = true
      if (!checked) collection.hasGranulesOrCwic = undefined
    }

    onChangeQuery({
      collection
    })
  }

  const { hasGranulesOrCwic = false, tagKey } = collectionQuery
  const isHasGranulesChecked = hasGranulesOrCwic
  const isNonEosdisChecked = tagKey !== getApplicationConfig().eosdisTagKey

  return (
    <div className="collection-results-header">
      <Row>
        <Form.Group
          className="collection-results-header__form-group"
          as={Row}
          sm="auto"
        >
          <Form.Label
            className="collection-results-header__label-dropdown"
            htmlFor="input__sort-relevance"
            column
            sm="auto"
          >
            Sort by:
          </Form.Label>
          <Col
            className="collection-results-header__form-column"
            sm="auto"
          >
            <Form.Control
              as="select"
              size="sm"
              onChange={e => handleSortSelect(e)}
            >
              <option value="relevance">Relevance</option>
              <option value="-usage_score">Usage</option>
              <option value="-ongoing">End Date</option>
            </Form.Control>
          </Col>
          {
            !hideCollectionFilters && (
              <>
                <Col
                  className="collection-results-header__form-column"
                  sm="auto"
                >
                  <Form.Check
                    checked={isHasGranulesChecked}
                    id="input__only-granules"
                    label="Only include collections with granules"
                    onChange={event => handleCheckboxCheck(event)}
                  />
                </Col>
                <Col
                  className="collection-results-header__form-column"
                  sm="auto"
                >
                  <Form.Check
                    checked={isNonEosdisChecked}
                    id="input__non-eosdis"
                    label="Include non-EOSDIS collections"
                    onChange={event => handleCheckboxCheck(event)}
                  />
                </Col>
              </>
            )
          }
          <Col sm="auto">
            <Button
              className="collection-results-header__adv-search-btn"
              bootstrapVariant="link"
              variant="link"
              icon="sliders"
              label="Advanced search"
              onClick={() => onToggleAdvancedSearchModal(true)}
            >
              Advanced Search
            </Button>
          </Col>
        </Form.Group>
      </Row>
      <div className="row">
        <div className="col">
          <span className="collection-results-header__tip">
            <strong className="collection-results-header__tip-label">Tip:</strong>
            Add
            <i className="collection-results-header__tip-icon fa fa-plus" />
            collections to your project to compare and download their data.
          </span>
        </div>
      </div>
    </div>
  )
}

CollectionResultsHeader.propTypes = {
  collectionQuery: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default CollectionResultsHeader
