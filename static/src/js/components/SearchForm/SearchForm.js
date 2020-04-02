import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, startCase } from 'lodash'
import Autosuggest from 'react-autosuggest'

import Button from '../Button/Button'
import AdvancedSearchDisplayContainer
  from '../../containers/AdvancedSearchDisplayContainer/AdvancedSearchDisplayContainer'
import SpatialDisplayContainer
  from '../../containers/SpatialDisplayContainer/SpatialDisplayContainer'
import TemporalDisplayContainer
  from '../../containers/TemporalDisplayContainer/TemporalDisplayContainer'
import SpatialSelectionDropdownContainer
  from '../../containers/SpatialSelectionDropdownContainer/SpatialSelectionDropdownContainer'
import TemporalSelectionDropdownContainer
  from '../../containers/TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer'
import AutocompleteDisplayContainer
  from '../../containers/AutocompleteDisplayContainer/AutocompleteDisplayContainer'
import FilterStack
  from '../FilterStack/FilterStack'
import Spinner from '../Spinner/Spinner'

import './SearchForm.scss'

class SearchForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      keywordSearch: props.keywordSearch ? props.keywordSearch : '',
      showFilterStack: true,
      selectedSuggestion: null
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onAutoSuggestChange = this.onAutoSuggestChange.bind(this)
    this.onSearchClear = this.onSearchClear.bind(this)
    this.onToggleAdvancedSearch = this.onToggleAdvancedSearch.bind(this)
    this.onToggleFilterStack = this.onToggleFilterStack.bind(this)
    this.onSuggestionHighlighted = this.onSuggestionHighlighted.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.selectSuggestion = this.selectSuggestion.bind(this)
    this.shouldRenderSuggestions = this.shouldRenderSuggestions.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { keywordSearch } = this.props

    if (keywordSearch !== nextProps.keywordSearch) {
      this.setState({ keywordSearch: nextProps.keywordSearch })
    }
  }

  onFormSubmit(e) {
    e.preventDefault()
    // document.getElementsByClassName('search-form__input').keywordSearch.blur()

    const {
      keywordSearch: propsKeyword,
      onChangeQuery,
      onChangeFocusedCollection
    } = this.props
    const { keywordSearch } = this.state

    if (propsKeyword !== keywordSearch) {
      onChangeFocusedCollection('')
      onChangeQuery({
        collection: {
          keyword: keywordSearch
        }
      })
    }
  }

  /**
   * AutoSuggest callback when the input value is changed
   * @param {Object} event event object
   * @param {Object} data object with the new value of the input
   */
  onAutoSuggestChange(event, { newValue }) {
    this.setState({ keywordSearch: newValue })
  }

  /**
   * AutoSuggest callback when a suggestion is selected
   * @param {Object} data object with info about the selected suggestion. Value
   * is null when no suggestion is highligted
   */
  onSuggestionHighlighted(data) {
    const { suggestion: newSuggestion } = data
    const { selectedSuggestion } = this.state

    if (newSuggestion === null || selectedSuggestion === null) {
      this.setState({ selectedSuggestion: newSuggestion })
      return
    }

    const { value = '', type = '' } = selectedSuggestion

    // This check prevents updating when the new selection matches the current selection.
    // This prevents errors that happen when the list is repopulated from the api while
    // the user has a suggestion highlighted.
    if (value !== newSuggestion.value && type !== newSuggestion.type) {
      this.setState({ selectedSuggestion: newSuggestion })
    }
  }

  onSearchClear() {
    const { onClearFilters } = this.props
    this.setState({ keywordSearch: '' })
    onClearFilters()
  }

  onToggleFilterStack() {
    const {
      showFilterStack
    } = this.state

    this.setState({
      showFilterStack: !showFilterStack
    })
  }

  onToggleAdvancedSearch() {
    const {
      onToggleAdvancedSearchModal
    } = this.props

    onToggleAdvancedSearchModal(true)
  }

  /**
   * AutoSuggest callback to retrieve the suggestion value, used when scrolling through suggestions with keyboard arrows
   * @param {Object} suggestion
   */
  getSuggestionValue(suggestion) {
    return suggestion.value
  }

  /**
   * AutoSuggest callback when a suggestion is selected
   * @param {Object} event event object
   * @param {Object} data selected suggestion
   */
  selectSuggestion(event, data) {
    const { onSelectAutocompleteSuggestion } = this.props
    const { suggestion } = data

    onSelectAutocompleteSuggestion({ suggestion })
    this.setState({ keywordSearch: '' })
  }

  /**
   * AutoSuggest callback to determine if suggustions should be rendered
   * @param {String} value text entered
   */
  shouldRenderSuggestions(value) {
    return value.trim().length > 2
  }

  /**
   * AutoSuggest method to render each suggestion
   * @param {Object} suggestion
   */
  renderSuggestion(data) {
    const { type, value, field } = data

    let displayHierarchy = ''
    let hierarchy = []

    if (field && field.indexOf(':')) {
      hierarchy = field.split(':')
      hierarchy.pop()
    }

    let displayValue = value

    if (displayValue.indexOf(':')) {
      displayValue = displayValue.split(':')
      displayValue = displayValue.pop()
    }

    hierarchy.forEach((parent) => {
      displayHierarchy += `${parent} > `
    })

    const displayTitle = `${startCase(type)}: \n${displayHierarchy}${displayValue}`

    return (
      <div title={displayTitle}>
        <div className="search-form__suggestions-primary">
          <div className="search-form__suggestions-type">
            {startCase(type)}
            {':'}
          </div>
          {
            (hierarchy && hierarchy.length > 0) && (
              <div className="search-form__suggestions-hierarchy">
                <span>
                  {
                    hierarchy.map(parent => (
                      <>
                        {parent}
                        <i className="fa fa-chevron-right" />
                        {' '}
                      </>
                    ))
                  }
                </span>
              </div>
            )
          }
        </div>
        <div className="search-form__suggestions-value">
          {displayValue}
        </div>
      </div>
    )
  }

  /**
   * AutoSuggest method to render the suggestions container
   */
  renderSuggestionsContainer(opts) {
    const {
      containerProps,
      children,
      isLoading,
      isLoaded,
      selectedSuggestion,
      query
    } = opts
    return (
      <div {...containerProps} className="search-form__suggestions-container">
        {
          query && query.length > 2 && (
            <>
              {
                (isLoading && !isLoaded) && (
                  <div className="search-form__loading-suggestions">
                    <Spinner className="search-form__spinner" type="dots" size="tiny" inline />
                    <span className="visually-hidden">
                      Loading collections...
                    </span>
                  </div>
                )
              }
              { children }
              {
                (isLoading || (children && Object.keys(children).length)) && (
                  <div className="search-form__query-hint">
                    {
                      selectedSuggestion
                        ? (
                          <>
                            Press
                            {' '}
                            <strong>Enter</strong>
                            {' to filter by '}
                            <strong>
                              &quot;
                              {selectedSuggestion.value}
                              &quot;
                            </strong>
                          </>
                        )
                        : (
                          <>
                            Press
                            {' '}
                            <strong>Enter</strong>
                            {' to search for '}
                            <strong>
                              &quot;
                              {query}
                              &quot;
                            </strong>
                          </>
                        )
                    }
                  </div>
                )
              }
            </>
          )
        }
      </div>
    )
  }

  render() {
    const {
      advancedSearch,
      autocomplete,
      showFilterStackToggle,
      onClearAutocompleteSuggestions,
      onFetchAutocomplete
    } = this.props

    const {
      isLoading,
      isLoaded,
      suggestions
    } = autocomplete

    const {
      keywordSearch,
      showFilterStack,
      selectedSuggestion
    } = this.state

    let spatialDisplayIsVisible = true

    if (!isEmpty(advancedSearch)) {
      const { regionSearch = {} } = advancedSearch
      if (!isEmpty(regionSearch)) {
        const { selectedRegion = {} } = regionSearch
        if (!isEmpty(selectedRegion)) spatialDisplayIsVisible = false
      }
    }

    return (
      <section className="search-form">
        <div className="search-form__primary">
          <form className="search-form__form" onSubmit={this.onFormSubmit}>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onFetchAutocomplete}
              onSuggestionsClearRequested={onClearAutocompleteSuggestions}
              getSuggestionValue={this.getSuggestionValue}
              // eslint-disable-next-line arrow-body-style
              renderSuggestionsContainer={(opts) => {
                return this.renderSuggestionsContainer({
                  ...opts,
                  isLoading,
                  isLoaded,
                  selectedSuggestion
                })
              }}
              renderSuggestion={this.renderSuggestion}
              onSuggestionSelected={this.selectSuggestion}
              onSuggestionHighlighted={this.onSuggestionHighlighted}
              shouldRenderSuggestions={this.shouldRenderSuggestions}
              inputProps={{
                name: 'keywordSearch',
                'data-test-id': 'keywordSearchInput',
                className: 'search-form__input',
                placeholder: 'Search for collections or topics',
                value: keywordSearch,
                onChange: this.onAutoSuggestChange
              }}
            />
          </form>
          <Button
            bootstrapVariant="inline-block"
            className="search-form__button search-form__button--clear"
            label="Clear search"
            onClick={this.onSearchClear}
            icon="eraser"
          />
          {
            showFilterStackToggle && (
              <>
                {
                  showFilterStack
                    ? (
                      <Button
                        bootstrapVariant="inline-block"
                        className="search-form__button search-form__button--dark search-form__button--toggle"
                        onClick={this.onToggleFilterStack}
                        title="Close filter stack"
                        label="Close filter stack"
                        icon="chevron-up"
                      />
                    )
                    : (
                      <Button
                        bootstrapVariant="inline-block"
                        className="search-form__button search-form__button--dark search-form__button--toggle"
                        onClick={this.onToggleFilterStack}
                        title="Open filter stack"
                        label="Open filter stack"
                        icon="bars"
                      />
                    )
                }
              </>
            )
          }
        </div>
        <div className="search-form__secondary">
          <div className="search-form__secondary-actions">
            <TemporalSelectionDropdownContainer />
            <SpatialSelectionDropdownContainer />
            <Button
              bootstrapVariant="inline-block"
              className="search-form__button search-form__button--dark search-form__button--advanced-search"
              label="Advanced search"
              onClick={this.onToggleAdvancedSearch}
              icon="sliders"
            />
          </div>
          <FilterStack isOpen={showFilterStack}>
            <AutocompleteDisplayContainer />
            <AdvancedSearchDisplayContainer />
            {
              spatialDisplayIsVisible && (
                <SpatialDisplayContainer />
              )
            }
            <TemporalDisplayContainer />
          </FilterStack>
        </div>
      </section>
    )
  }
}

SearchForm.propTypes = {
  advancedSearch: PropTypes.shape({}).isRequired,
  keywordSearch: PropTypes.string.isRequired,
  autocomplete: PropTypes.shape({}).isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired,
  onClearAutocompleteSuggestions: PropTypes.func.isRequired,
  onFetchAutocomplete: PropTypes.func.isRequired,
  onSelectAutocompleteSuggestion: PropTypes.func.isRequired,
  showFilterStackToggle: PropTypes.bool.isRequired
}

export default SearchForm
