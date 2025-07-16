import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isEqual } from 'lodash-es'
import { FaRegTrashAlt } from 'react-icons/fa'
import { Filter, Search } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../Button/Button'
import SearchAutocomplete from './SearchAutocomplete'
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
import FilterStack from '../FilterStack/FilterStack'
import AutocompleteSuggestion from '../AutocompleteSuggestion/AutocompleteSuggestion'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './SearchForm.scss'

class SearchForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      keywordSearch: props.keywordSearch ? props.keywordSearch : '',
      showFilterStack: true,
      selectedSuggestion: null
    }

    this.inputRef = React.createRef()
    this.autocompleteRef = React.createRef()
    this.keyboardShortcuts = {
      focusSearchInput: '/'
    }

    this.onAutoSuggestChange = this.onAutoSuggestChange.bind(this)
    this.onSearchClear = this.onSearchClear.bind(this)
    this.onToggleAdvancedSearch = this.onToggleAdvancedSearch.bind(this)
    this.onToggleFilterStack = this.onToggleFilterStack.bind(this)
    this.onSuggestionHighlighted = this.onSuggestionHighlighted.bind(this)
    this.onWindowKeyUp = this.onWindowKeyUp.bind(this)
    this.getSuggestionValue = this.getSuggestionValue.bind(this)
    this.renderInputComponent = this.renderInputComponent.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.shouldRenderSuggestions = this.shouldRenderSuggestions.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keyup', this.onWindowKeyUp)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { keywordSearch } = this.props

    if (keywordSearch !== nextProps.keywordSearch) {
      this.setState({ keywordSearch: nextProps.keywordSearch })
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keyup', this.onWindowKeyUp)
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
   * is null when no suggestion is highlighted
   */
  onSuggestionHighlighted(data) {
    const { suggestion: newSuggestion } = data
    const { selectedSuggestion } = this.state

    if (!isEqual(selectedSuggestion, newSuggestion)) {
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

  onWindowKeyUp(event) {
    const { inputRef, keyboardShortcuts } = this

    const focusElement = () => inputRef.current.input.focus()

    triggerKeyboardShortcut({
      event,
      shortcutKey: keyboardShortcuts.focusSearchInput,
      shortcutCallback: focusElement
    })
  }

  /**
   * AutoSuggest callback to retrieve the suggestion value, used when scrolling through suggestions with keyboard arrows
   * @param {Object} suggestion
   */
  getSuggestionValue(suggestion) {
    return suggestion.value
  }

  /**
   * AutoSuggest callback to determine if suggestions should be rendered
   * @param {String} value text entered
   */
  shouldRenderSuggestions(value) {
    return value.trim().length > 2
  }

  /**
 * AutoSuggest method to render each suggestion
 * @param {Object} suggestion
 */
  renderInputComponent(inputProps) {
    return (
      <div className="position-relative">
        <EDSCIcon className="search-form__search-icon position-absolute" icon={Search} />
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <input {...inputProps} />
      </div>
    )
  }

  /**
   * AutoSuggest method to render each suggestion
   * @param {Object} suggestion
   */
  renderSuggestion(data) {
    return (
      <AutocompleteSuggestion
        suggestion={data}
      />
    )
  }

  render() {
    const {
      advancedSearch,
      onChangeQuery,
      onChangeFocusedCollection
    } = this.props

    const {
      keywordSearch,
      showFilterStack,
      selectedSuggestion
    } = this.state

    const { keywordSearch: keywordSearchFromProps } = this.props

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
          <SearchAutocomplete
            ref={this.autocompleteRef}
            keywordSearch={keywordSearch}
            keywordSearchFromProps={keywordSearchFromProps}
            selectedSuggestion={selectedSuggestion}
            onAutoSuggestChange={this.onAutoSuggestChange}
            onChangeQuery={onChangeQuery}
            onChangeFocusedCollection={onChangeFocusedCollection}
            getSuggestionValue={this.getSuggestionValue}
            renderInputComponent={this.renderInputComponent}
            renderSuggestion={this.renderSuggestion}
            shouldRenderSuggestions={this.shouldRenderSuggestions}
            onSuggestionHighlighted={this.onSuggestionHighlighted}
            onSuggestionSelected={() => this.setState({ keywordSearch: '' })}
          />
        </div>
        <div className="search-form__secondary">
          <div className="search-form__secondary-actions d-flex justify-content-between flex-row">
            <div className="d-flex gap-1">
              <TemporalSelectionDropdownContainer />
              <SpatialSelectionDropdownContainer />
              <PortalFeatureContainer advancedSearch>
                <Button
                  bootstrapVariant="light"
                  className="search-form__button search-form__button--secondary search-form__button--advanced-search"
                  tooltip="Show advanced search options"
                  tooltipId="search-form--advanced-search"
                  onClick={this.onToggleAdvancedSearch}
                  icon={Filter}
                  iconSize="14"
                  ariaLabel="Show advanced search options"
                />
              </PortalFeatureContainer>
            </div>
            <Button
              bootstrapVariant="inline-block"
              className="search-form__button search-form__button--secondary search-form__button--clear"
              tooltip="Clear all search filters"
              tooltipId="search-form--clear-filters"
              onClick={this.onSearchClear}
              icon={FaRegTrashAlt}
              iconSize="14"
              ariaLabel="Clear all search filters"
            />
          </div>
          <FilterStack isOpen={showFilterStack}>
            <PortalFeatureContainer advancedSearch>
              <AdvancedSearchDisplayContainer />
            </PortalFeatureContainer>
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
  advancedSearch: PropTypes.shape({
    regionSearch: PropTypes.shape({})
  }).isRequired,
  keywordSearch: PropTypes.string.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default SearchForm
