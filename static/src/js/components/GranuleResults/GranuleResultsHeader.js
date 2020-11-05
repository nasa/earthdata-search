import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import classNames from 'classnames'

import { collectionTitle, granuleListTotal } from './skeleton'
import { commafy } from '../../util/commafy'
import { generateHandoffs } from '../../util/handoffs/generateHandoffs'
import { pluralize } from '../../util/pluralize'
import { locationPropType } from '../../util/propTypes/location'
import { pathStartsWith } from '../../util/pathStartsWith'
import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'

import Button from '../Button/Button'
import GranuleResultsActionsContainer from '../../containers/GranuleResultsActionsContainer/GranuleResultsActionsContainer'
import MoreActionsDropdown from '../MoreActionsDropdown/MoreActionsDropdown'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Skeleton from '../Skeleton/Skeleton'

import './GranuleResultsHeader.scss'

/**
 * Renders GranuleResultsHeader.
  * @param {Object} props.collectionsSearch - The collection search object.
  * @param {String} props.focusedCollectionId - The focused collection ID.
  * @param {Object} props.collectionMetadata - Focused collection passed from redux storee.
  * @param {Object} props.location - Location passed from react router.
  * @param {Object} props.mapProjection - Map projection passed from redux store.
  * @param {Object} props.secondaryOverlayPanel - Secondary overlay panel state passed from redux store.
  * @param {Function} props.onApplyGranuleFilters - Callback to apply granule filters.
  * @param {Function} props.onChangePanelView - Callback to change panel view.
  * @param {Function} props.onToggleAboutCwicModal - Callback to toggle the CWIC modal.
  * @param {Function} props.onToggleSecondaryOverlayPanel - Callback to toggle the secondary overlay panel.
  * @param {Function} props.onUndoExcludeGranule - Callback to exclude a granule.
  * @param {String} props.pageNum - The granule pageNum view state.
  * @param {String} props.panelView - The current panel view state.
 */
class GranuleResultsHeader extends Component {
  constructor(props) {
    super(props)

    const { granuleQuery } = props
    const {
      readableGranuleName = [],
      sortKey
    } = granuleQuery

    this.state = {
      sortOrder: sortKey,
      searchValue: readableGranuleName.join() || '',
      prevSearchValue: readableGranuleName.join()
    }
    this.keyboardShortcuts = {
      toggleGranuleFilters: 'g'
    }

    this.handleUpdateSortOrder = this.handleUpdateSortOrder.bind(this)
    this.handleUpdateSearchValue = this.handleUpdateSearchValue.bind(this)
    this.handleBlurSearchValue = this.handleBlurSearchValue.bind(this)
    this.handleUndoExcludeGranule = this.handleUndoExcludeGranule.bind(this)
    this.handleSearchKeyUp = this.handleSearchKeyUp.bind(this)
    this.onWindowKeyUp = this.onWindowKeyUp.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onWindowKeyUp)
  }

  componentWillReceiveProps(nextProps) {
    const { granuleQuery } = nextProps
    const { readableGranuleName = [], sortKey } = granuleQuery

    const { searchValue, sortOrder } = this.state

    const propsGranuleName = readableGranuleName.join(',')
    if (propsGranuleName !== searchValue) {
      this.setState({ searchValue: propsGranuleName, prevSearchValue: searchValue })
    }

    if (sortKey && sortKey !== sortOrder) {
      this.setState({ sortOrder: sortKey })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onWindowKeyUp)
  }

  onWindowKeyUp(e) {
    const { keyboardShortcuts } = this
    const { location, onToggleSecondaryOverlayPanel, secondaryOverlayPanel } = this.props

    const { isOpen: granuleFiltersOpen } = secondaryOverlayPanel

    const toggleModal = () => onToggleSecondaryOverlayPanel(!granuleFiltersOpen)

    if (pathStartsWith(location.pathname, ['/search/granules'])) {
      triggerKeyboardShortcut({
        event: e,
        shortcutKey: keyboardShortcuts.toggleGranuleFilters,
        shortcutCallback: toggleModal
      })
    }
  }

  handleUpdateSortOrder(e) {
    const {
      onApplyGranuleFilters
    } = this.props

    const { value } = e.target
    this.setState({
      sortOrder: value
    })

    onApplyGranuleFilters({ sortKey: value })
  }

  handleUpdateSearchValue(e) {
    const { value } = e.target

    this.setState({
      searchValue: value.split(/[,\s\n]\s*/g).join(',')
    })
  }

  handleSearch() {
    const {
      onApplyGranuleFilters
    } = this.props

    const { searchValue, prevSearchValue } = this.state

    if (searchValue !== prevSearchValue) {
      // empty array (truthy value) necessary
      // to override existing filter with empty input
      let readableGranuleName = []

      if (searchValue) {
        readableGranuleName = searchValue.split(',')
      }

      onApplyGranuleFilters({ readableGranuleName })

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
      collectionMetadata,
      collectionQuery,
      collectionsSearch,
      granuleQuery,
      granuleSearchResults,
      location,
      mapProjection,
      onChangePanelView,
      onToggleAboutCwicModal,
      pageNum,
      panelView
    } = this.props

    const {
      isLoaded: collectionSearchIsLoaded
    } = collectionsSearch

    const {
      excludedGranuleIds = []
    } = granuleQuery

    const {
      allIds: allGranuleIds,
      hits: granuleHits,
      isLoading,
      isLoaded
    } = granuleSearchResults

    const {
      hasAllMetadata = false,
      isCwic,
      title
    } = collectionMetadata

    const handoffLinks = generateHandoffs(collectionMetadata, collectionQuery, mapProjection)

    const initialLoading = ((pageNum === 1 && isLoading) || (!isLoaded && !isLoading))

    const viewButtonListClasses = classNames([
      'granule-results-header__view-button',
      {
        'granule-results-header__view-button--is-active': panelView === 'list'
      }
    ])

    const viewButtonTableClasses = classNames([
      'granule-results-header__view-button',
      {
        'granule-results-header__view-button--is-active': panelView === 'table'
      }
    ])

    return (
      <div className="granule-results-header">
        <div className="granule-results-header__primary">
          <div className="row">
            <div className="col">
              <div className="granule-results-header__title-wrap">
                {
                  (!collectionSearchIsLoaded && hasAllMetadata === false) && (
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
                isCwic && (
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
                  </>
                )
              }
              {
                !isCwic && (
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
                      {
                        excludedGranuleIds.length > 0 && (
                          <div className="granule-results-header__granule-undo">
                            { excludedGranuleIds.length }
                            {' '}
                            {
                              pluralize('Granule', excludedGranuleIds.length)
                            }
                            {' Filtered'}
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
                `Showing ${commafy(allGranuleIds.length)} of ${commafy(
                  granuleHits
                )} matching ${pluralize('granule', granuleHits)}`
              )
            }
          </span>
          <span className="granule-results-header__header-item">
            <span className="granule-results-header__view">
              <Button
                className={viewButtonListClasses}
                dataTestId="granule-results-header__view-button--list"
                variant="naked"
                icon="list"
                label="Switch to list view"
                onClick={() => { onChangePanelView('list') }}
              />
              <Button
                className={viewButtonTableClasses}
                dataTestId="granule-results-header__view-button--table"
                variant="naked"
                icon="table"
                label="Switch to table view"
                onClick={() => { onChangePanelView('table') }}
              />
            </span>
          </span>
        </div>
      </div>
    )
  }
}

GranuleResultsHeader.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionQuery: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  granuleQuery: PropTypes.shape({}).isRequired,
  granuleSearchResults: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  mapProjection: PropTypes.string.isRequired,
  onApplyGranuleFilters: PropTypes.func.isRequired,
  onChangePanelView: PropTypes.func.isRequired,
  onToggleAboutCwicModal: PropTypes.func.isRequired,
  onToggleSecondaryOverlayPanel: PropTypes.func.isRequired,
  onUndoExcludeGranule: PropTypes.func.isRequired,
  pageNum: PropTypes.number.isRequired,
  panelView: PropTypes.string.isRequired,
  secondaryOverlayPanel: PropTypes.shape({}).isRequired
}

export default GranuleResultsHeader
