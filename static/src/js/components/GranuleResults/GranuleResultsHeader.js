import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import Button from '../Button/Button'
import Skeleton from '../Skeleton/Skeleton'

import { collectionTitle } from './skeleton'

import './GranuleResultsHeader.scss'

/**
 * Renders GranuleResultsHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.focusedCollectionMetadata - Focused collection passed from redux store.
 * @param {function} props.onToggleSecondaryOverlayPanel - Function to open the secondary overlay panel.
 * @param {function} props.onUpdateSortOrder - Function to call when the sort order is changed.
 * @param {function} props.onUpdateSearchValue - Function to call when the granule search value is changed.
 * @param {string} props.sortOrder - The current granule sort order from the state.
 * @param {string} props.searchValue - The current granule search value from the state.
 * @param {object} props.secondaryOverlayPanel - The current state of the secondaryOverlayPanel.
 */
class GranuleResultsHeader extends Component {
  constructor(props) {
    super(props)

    this.state = {
      sortOrder: props.sortOrder,
      searchValue: props.searchValue
    }

    this.handleUpdateSortOrder = this.handleUpdateSortOrder.bind(this)
    this.handleUpdateSearchValue = this.handleUpdateSearchValue.bind(this)
    this.handleUndoExcludeGranule = this.handleUndoExcludeGranule.bind(this)
  }

  handleUpdateSortOrder(e) {
    const { onUpdateSortOrder } = this.props
    const { value } = e.target
    this.setState({
      sortOrder: value
    })
    onUpdateSortOrder(value)
  }

  handleUpdateSearchValue(e) {
    const { onUpdateSearchValue } = this.props
    const { value } = e.target
    this.setState({
      searchValue: value
    })
    onUpdateSearchValue(value)
  }

  handleUndoExcludeGranule() {
    const { focusedCollectionMetadata, onUndoExcludeGranule } = this.props
    const [collectionId] = Object.keys(focusedCollectionMetadata)

    onUndoExcludeGranule(collectionId)
  }

  render() {
    const { sortOrder, searchValue } = this.state

    const {
      focusedCollectionMetadata,
      location,
      onToggleSecondaryOverlayPanel,
      secondaryOverlayPanel
    } = this.props

    const { isOpen: granuleFiltersOpen } = secondaryOverlayPanel
    const [collectionId] = Object.keys(focusedCollectionMetadata)
    const { metadata, excludedGranuleIds } = focusedCollectionMetadata[collectionId]
    const { dataset_id: title } = metadata

    const showUndoExcludedGranules = excludedGranuleIds.length > 0

    return (
      <div className="granule-results-header">
        <div className="row">
          <div className="col-auto">
            <div className="granule-results-header__title-wrap">
              {
                // TODO: Create isLoading state in reducer so we can use that rather than the title
                !title && (
                  <Skeleton
                    className="granule-results-header__title"
                    containerStyle={{ display: 'inline-block', height: '22px', width: '280px' }}
                    shapes={collectionTitle}
                  />
                )
              }
              {
                title && (
                  <h2 className="granule-results-header__title">{title}</h2>
                )
              }
              <Link
                className="granule-results-header__link"
                to={{
                  pathname: '/search/granules/collection-details',
                  search: location.search
                }}
              >
                <i className="fa fa-info-circle" />
                {' View Details'}
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            {metadata.is_cwic && (
              <>
                <div>
                  <span className="granule-results-header__cwic-note">
                    {'This is '}
                    <span className="granule-results-header__cwic-emph">Int&apos;l / Interagency Data</span>
                    {' data. Searches will be performed by external services which may vary in performance and available features. '}
                    <a
                      className="granule-results-header__link granule-results-header__link--cwic"
                      href="/"
                    >
                      <i className="fa fa-question-circle" />
                      {' More details'}
                    </a>
                  </span>
                </div>
                {
                  granuleFiltersOpen
                    ? (
                      <Button
                        className="granule-results-header__link"
                        onClick={() => onToggleSecondaryOverlayPanel(false)}
                        variant="link"
                        bootstrapVariant="link"
                        icon="times"
                        label="Close Granule Filters"
                      >
                        Granule Filters
                      </Button>
                    )
                    : (
                      <Button
                        className="granule-results-header__link"
                        onClick={() => onToggleSecondaryOverlayPanel(true)}
                        variant="link"
                        bootstrapVariant="link"
                        icon="filter"
                        label="Open Granule Filters"
                      >
                        Granule Filters
                      </Button>
                    )
                }
              </>
            )}
            {!metadata.is_cwic && (
              <form className="form-inline" action="/">
                <div className="form-row align-items-center">
                  <div className="col-auto">
                    <div className="form-group">
                      <label
                        className="col-form-label col-form-label-sm mr-1"
                        htmlFor="input__sort-granules"
                      >
                        Sort by:
                      </label>
                      <select
                        id="input__sort-granules"
                        className="form-control form-control-sm"
                        onChange={this.handleUpdateSortOrder}
                        value={sortOrder}
                      >
                        <option value="-start_date">Start Date, Newest First</option>
                        <option value="start_date">Start Date, Oldest First</option>
                        <option value="-end_date">End Date, Newest First</option>
                        <option value="end_date">End Date, Oldest First</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-auto">
                    <div className="form-group">
                      <label
                        className="col-form-label col-form-label-sm mr-1"
                        htmlFor="input__granule-search"
                      >
                        Granule Search:
                      </label>
                      <OverlayTrigger
                        placement="top"
                        overlay={(
                          <Tooltip
                            id="tooltip__granule-search"
                            className="tooltip--large tooltip--ta-left tooltip--wide"
                          >
                            <strong>Wildcards:</strong>
                            {' '}
                            <ul className="m-0">
                              <li>* (asterisk) matches any number of characters</li>
                              <li>? (question mark) matches exactly one character.</li>
                            </ul>
                            <br />
                            <strong>Delimiters:</strong>
                            {' '}
                            Separate multiple granule IDs by space, comma, or new line.
                          </Tooltip>
                        )}
                      >
                        <input
                          id="input__granule-search"
                          className="form-control form-control-sm granule-results-header__granule-search-input"
                          type="text"
                          placeholder="Search Single of Multiple Granule IDs..."
                          onChange={this.handleUpdateSearchValue}
                          value={searchValue}
                        />
                      </OverlayTrigger>
                    </div>
                  </div>
                  <div className="col-auto">
                    {
                      granuleFiltersOpen
                        ? (
                          <Button
                            className="granule-results-header__link"
                            onClick={() => onToggleSecondaryOverlayPanel(false)}
                            variant="link"
                            bootstrapVariant="link"
                            icon="times"
                            title="Close filters"
                            label="Close Granule Filters"
                          >
                            Granule Filters
                          </Button>
                        )
                        : (
                          <Button
                            className="granule-results-header__link"
                            onClick={() => onToggleSecondaryOverlayPanel(true)}
                            variant="link"
                            bootstrapVariant="link"
                            icon="filter"
                            title="Filter granules"
                            label="Open Granule Filters"
                          >
                            Granule Filters
                          </Button>
                        )
                    }
                  </div>
                  {
                    showUndoExcludedGranules && (
                      <div className="granule-results-header__granule-undo">
                        Granule excluded.
                        <button
                          className="granule-results-header__granule-undo-button"
                          onClick={this.handleUndoExcludeGranule}
                          type="button"
                        >
                          Undo
                        </button>
                      </div>
                    )
                  }
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    )
  }
}

GranuleResultsHeader.propTypes = {
  focusedCollectionMetadata: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired,
  onUpdateSortOrder: PropTypes.func.isRequired,
  onUpdateSearchValue: PropTypes.func.isRequired,
  onUndoExcludeGranule: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired,
  secondaryOverlayPanel: PropTypes.shape({}).isRequired
}

export default GranuleResultsHeader
