import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { difference } from 'lodash'

import Button from '../Button/Button'
import Skeleton from '../Skeleton/Skeleton'

import { collectionTitle, granuleListTotal, granuleTimeTotal } from './skeleton'

import murmurhash3 from '../../util/murmurhash3'
import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
import generateHandoffs from '../../util/handoffs/generateHandoffs'
import { MoreActionsDropdown } from '../MoreActionsDropdown/MoreActionsDropdown'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import GranuleResultsActionsContainer from '../../containers/GranuleResultsActionsContainer/GranuleResultsActionsContainer'

import './GranuleResultsHeader.scss'

/**
 * Renders GranuleResultsHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.focusedCollectionObject - Focused collection passed from redux store.
 * @param {function} props.onApplyGranuleFilters - Function to apply sort and granule id filters.
 * @param {function} props.onToggleSecondaryOverlayPanel - Function to open the secondary overlay panel.
 * @param {object} props.secondaryOverlayPanel - The current state of the secondaryOverlayPanel.
 */
class GranuleResultsHeader extends Component {
  constructor(props) {
    super(props)

    const { focusedCollectionObject } = props
    const { granuleFilters = {} } = focusedCollectionObject

    this.state = {
      sortOrder: granuleFilters.sortKey,
      searchValue: granuleFilters.readableGranuleName || '',
      prevSearchValue: granuleFilters.readableGranuleName
    }

    this.handleUpdateSortOrder = this.handleUpdateSortOrder.bind(this)
    this.handleUpdateSearchValue = this.handleUpdateSearchValue.bind(this)
    this.handleBlurSearchValue = this.handleBlurSearchValue.bind(this)
    this.handleUndoExcludeGranule = this.handleUndoExcludeGranule.bind(this)
    this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this)
  }

  handleUpdateSortOrder(e) {
    const {
      focusedCollectionId,
      onApplyGranuleFilters
    } = this.props

    const { value } = e.target
    this.setState({
      sortOrder: value
    })

    onApplyGranuleFilters(focusedCollectionId, { sortKey: value })
  }

  handleUpdateSearchValue(e) {
    const { value } = e.target

    this.setState({
      searchValue: value.split(/[,\s\n]\s*/g).join(',')
    })
  }

  handleSearch() {
    const {
      focusedCollectionId,
      onApplyGranuleFilters
    } = this.props

    const { searchValue, prevSearchValue } = this.state

    if (searchValue !== prevSearchValue) {
      let readableGranuleName = null

      if (searchValue) {
        readableGranuleName = searchValue.split(',')
      }

      onApplyGranuleFilters(focusedCollectionId, { readableGranuleName })

      this.setState({
        prevSearchValue: searchValue
      })
    }
  }

  handleBlurSearchValue() {
    this.handleSearch()
  }

  handleSearchKeyUp(e) {
    if (e.key === 'Enter') {
      this.handleSearch()
    }
  }

  handleUndoExcludeGranule() {
    const {
      focusedCollectionId,
      onUndoExcludeGranule
    } = this.props

    onUndoExcludeGranule(focusedCollectionId)
  }

  render() {
    const { sortOrder, searchValue } = this.state

    const {
      collectionSearch,
      focusedCollectionObject,
      location,
      mapProjection,
      onToggleSecondaryOverlayPanel,
      pageNum,
      secondaryOverlayPanel,
      onToggleAboutCwicModal
    } = this.props

    const { isOpen: granuleFiltersOpen } = secondaryOverlayPanel

    const { metadata = {}, excludedGranuleIds = [], granules = {} } = focusedCollectionObject

    const {
      hits,
      loadTime,
      isLoading,
      isLoaded
    } = granules

    const { dataset_id: title, isCwic } = metadata

    const showUndoExcludedGranules = excludedGranuleIds.length > 0

    const handoffLinks = generateHandoffs(metadata, collectionSearch, mapProjection)

    const initialLoading = ((pageNum === 1 && isLoading) || (!isLoaded && !isLoading))
    const loadTimeInSeconds = (loadTime / 1000).toFixed(1)

    const allGranuleIds = granules.allIds
    let granuleIds
    if (isCwic) {
      granuleIds = allGranuleIds.filter((id) => {
        const hashedId = murmurhash3(id).toString()
        return excludedGranuleIds.indexOf(hashedId) === -1
      })
    } else {
      granuleIds = difference(allGranuleIds, excludedGranuleIds)
    }

    const visibleGranules = granuleIds.length ? granuleIds.length : 0

    // Determine the correct granule count based on granules that have been removed
    const granuleCount = hits - excludedGranuleIds.length

    return (
      <div className="granule-results-header">
        <div className="granule-results-header__primary">
          <div className="row">
            <div className="col">
              <div className="granule-results-header__title-wrap">
                {// TODO: Create isLoading state in reducer so we can use that rather than the title
                  !title && (
                    <Skeleton
                      className="granule-results-header__title"
                      containerStyle={{
                        display: 'inline-block',
                        height: '1.375rem',
                        width: '17.5rem'
                      }}
                      shapes={collectionTitle}
                    />
                  )
                }
                {
                  title && (
                    <h2 className="granule-results-header__title">{title}</h2>
                  )
                }
                <PortalLinkContainer
                  className="granule-results-header__title-link"
                  to={{
                    pathname: '/search/granules/collection-details',
                    search: location.search
                  }}
                >
                  <i className="fa fa-info-circle" />
                  {' View Details'}
                </PortalLinkContainer>
              </div>
            </div>
            <MoreActionsDropdown
              className="col-auto"
              handoffLinks={handoffLinks}
            />
          </div>

          <GranuleResultsActionsContainer />
          <div className="row">
            <div className="col">
              {
                metadata.is_cwic && (
                  <>
                    <div>
                      <span className="granule-results-header__cwic-note">
                        {'This is '}
                        <span className="granule-results-header__cwic-emph">Int&apos;l / Interagency Data</span>
                        {' data. Searches will be performed by external services which may vary in performance and available features. '}
                        <Button
                          className="granule-results-header__link"
                          onClick={() => onToggleAboutCwicModal(true)}
                          variant="link"
                          bootstrapVariant="link"
                          icon="question-circle"
                          label="More details"
                        >
                          More Details
                        </Button>
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
                        ) : (
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
                )
              }
              {
                !metadata.is_cwic && (
                  <div className="form-inline">
                    <div className="form-row align-items-center">
                      <div className="col-auto mb-1">
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
                            <option value="-start_date">
                              Start Date, Newest First
                            </option>
                            <option value="start_date">
                              Start Date, Oldest First
                            </option>
                            <option value="-end_date">
                              End Date, Newest First
                            </option>
                            <option value="end_date">End Date, Oldest First</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-auto mb-1">
                        <div className="form-group">
                          <label
                            className="col-form-label col-form-label-sm mr-1"
                            htmlFor="input__granule-search"
                          >
                            Granule Search:
                          </label>
                          <OverlayTrigger
                            placement="bottom"
                            overlay={(
                              <Tooltip
                                id="tooltip__granule-search"
                                className="tooltip--large tooltip--ta-left tooltip--wide"
                              >
                                <strong>Wildcards:</strong>
                                {' '}
                                <ul className="m-0">
                                  <li>
                                    * (asterisk) matches any number of characters
                                  </li>
                                  <li>
                                    ? (question mark) matches exactly one character.
                                  </li>
                                </ul>
                                <br />
                                <strong>Delimiters:</strong>
                                {' '}
                                Separate multiple granule IDs by commas.
                              </Tooltip>
                            )}
                          >
                            <span>
                              <input
                                id="input__granule-search"
                                className="form-control form-control-sm granule-results-header__granule-search-input"
                                type="text"
                                placeholder="Search Single or Multiple Granule IDs..."
                                onBlur={this.handleBlurSearchValue}
                                onChange={this.handleUpdateSearchValue}
                                onKeyUp={this.handleSearchKeyUp}
                                value={searchValue}
                              />
                            </span>
                          </OverlayTrigger>
                        </div>
                      </div>
                      <div className="col-auto">
                        {granuleFiltersOpen ? (
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
                        ) : (
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
                        )}
                      </div>
                      {showUndoExcludedGranules && (
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
                      )}
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="granule-results-header__meta">
          <span className="granule-results-header__header-item">
            {
              initialLoading && (
                <Skeleton
                  containerStyle={{ height: '18px', width: '213px' }}
                  shapes={granuleListTotal}
                />
              )
            }
            {
              !initialLoading && (
                `Showing ${commafy(visibleGranules)} of ${commafy(
                  granuleCount
                )} matching ${pluralize('granule', granuleCount)}`
              )
            }
          </span>
          <span className="granule-results-header__header-item">
            {
              initialLoading && (
                <Skeleton
                  containerStyle={{ height: '18px', width: '110px' }}
                  shapes={granuleTimeTotal}
                />
              )
            }
            {!initialLoading && `Search Time: ${loadTimeInSeconds}s`}
          </span>
        </div>
      </div>
    )
  }
}

GranuleResultsHeader.propTypes = {
  collectionSearch: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedCollectionObject: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired,
  mapProjection: PropTypes.string.isRequired,
  secondaryOverlayPanel: PropTypes.shape({}).isRequired,
  onApplyGranuleFilters: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired,
  onUndoExcludeGranule: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired
}

export default GranuleResultsHeader
