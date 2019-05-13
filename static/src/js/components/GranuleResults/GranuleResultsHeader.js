import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

import Skeleton from '../Skeleton/Skeleton'

import { collectionTitle } from './skeleton'

import './GranuleResultsHeader.scss'

/**
 * Renders GranuleResultsHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.focusedCollectionMetadata - Focused collection passed from redux store.
 * @param {function} props.onUpdateSortOrder - Function to call when the sort order is changed.
 * @param {function} props.onUpdateSearchValue - Function to call when the granule search value is changed.
 * @param {string} props.sortOrder - The current granule sort order from the state.
 * @param {string} props.searchValue - The current granule search value from the state.
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

  render() {
    const { focusedCollectionMetadata } = this.props
    const { sortOrder, searchValue } = this.state
    const [collectionId = ''] = Object.keys(focusedCollectionMetadata)
    const metadata = focusedCollectionMetadata[collectionId]
    const { title } = metadata

    return (
      <>
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
              <a
                className="granule-results-header__link"
                href="/"
              >
                <i className="fa fa-info-circle" />
                {' View Details'}
              </a>
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
                <a
                  className="granule-results-header__link"
                  href="/"
                >
                  <i className="fa fa-filter" />
                  {' Granule Filters'}
                </a>
              </>
            )}
            {!metadata.is_cwic && (
              <form className="form-inline mb-1" action="/">
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
                    <a
                      className="granule-results-header__link"
                      href="/"
                    >
                      <i className="fa fa-filter" />
                      {' Granule Filters'}
                    </a>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </>
    )
  }
}

GranuleResultsHeader.propTypes = {
  focusedCollectionMetadata: PropTypes.shape({}).isRequired,
  onUpdateSortOrder: PropTypes.func.isRequired,
  onUpdateSearchValue: PropTypes.func.isRequired,
  sortOrder: PropTypes.string.isRequired,
  searchValue: PropTypes.string.isRequired
}

export default GranuleResultsHeader
