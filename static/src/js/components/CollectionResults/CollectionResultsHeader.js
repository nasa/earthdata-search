import React from 'react'
import PropTypes from 'prop-types'
import { Col, Form, Row } from 'react-bootstrap'
import classNames from 'classnames'

import { collectionResultsTotal } from './skeleton'
import { commafy } from '../../util/commafy'
import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { pluralize } from '../../util/pluralize'

import Button from '../Button/Button'
import Skeleton from '../Skeleton/Skeleton'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './CollectionResultsHeader.scss'

const CollectionResultsHeader = ({
  collections,
  collectionQuery,
  panelView,
  onChangeQuery,
  onMetricsCollectionSortChange,
  onToggleAdvancedSearchModal,
  onChangePanelView
}) => {
  const {
    allIds,
    hits: collectionHits,
    isLoaded,
    isLoading
  } = collections
  const { pageNum } = collectionQuery

  const collectionResultCount = allIds.length

  const initialLoading = ((pageNum === 1 && isLoading) || (!isLoaded && !isLoading))

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

  const { eosdisTagKey } = getApplicationConfig()
  const isNonEosdisChecked = tagKey !== eosdisTagKey

  const viewButtonListClasses = classNames([
    'collection-results-header__view-button',
    {
      'collection-results-header__view-button--is-active': panelView === 'list'
    }
  ])

  const viewButtonTableClasses = classNames([
    'collection-results-header__view-button',
    {
      'collection-results-header__view-button--is-active': panelView === 'table'
    }
  ])

  return (
    <div className="collection-results-header">
      <div className="collection-results-header__primary">
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
            <PortalFeatureContainer onlyGranulesCheckbox>
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
            </PortalFeatureContainer>
            <PortalFeatureContainer nonEosdisCheckbox>
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
            </PortalFeatureContainer>
            <PortalFeatureContainer advancedSearch>
              <Col sm="auto">
                <Button
                  className="collection-results-header__adv-search-btn"
                  bootstrapVariant="link"
                  variant="link"
                  icon="FaSlidersH"
                  label="Advanced search"
                  onClick={() => onToggleAdvancedSearchModal(true)}
                >
                  Advanced Search
                </Button>
              </Col>
            </PortalFeatureContainer>
          </Form.Group>
        </Row>
        <PortalFeatureContainer authentication>
          <div className="row mt-1">
            <div className="col">
              <span className="collection-results-header__tip">
                <strong className="collection-results-header__tip-label">Tip:</strong>
                Add
                <EDSCIcon library="fa" icon="FaPlus" className="collection-results-header__tip-icon" />
                collections to your project to compare and download their data.
              </span>
            </div>
          </div>
        </PortalFeatureContainer>
      </div>
      <div className="collection-results-header__meta">
        <span className="collection-results-header__collection-count">
          {
            initialLoading && (
              <Skeleton
                containerStyle={{ height: '18px', width: '213px' }}
                shapes={collectionResultsTotal}
              />
            )
          }
          {!initialLoading && `Showing ${commafy(collectionResultCount)} of ${commafy(collectionHits)} matching ${pluralize('collection', collectionHits)}`}
        </span>
        <span className="collection-results-header__view">
          <Button
            className={viewButtonListClasses}
            dataTestId="collection-results-header__view-button--list"
            variant="naked"
            icon="FaList"
            label="Switch to list view"
            onClick={() => { onChangePanelView('list') }}
          />
          <Button
            className={viewButtonTableClasses}
            dataTestId="collection-results-header__view-button--table"
            variant="naked"
            icon="FaTable"
            label="Switch to table view"
            onClick={() => { onChangePanelView('table') }}
          />
        </span>
      </div>
    </div>
  )
}

CollectionResultsHeader.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionQuery: PropTypes.shape({}).isRequired,
  panelView: PropTypes.string.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onMetricsCollectionSortChange: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired,
  onChangePanelView: PropTypes.func.isRequired
}

export default CollectionResultsHeader
