import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isCancel } from 'axios'
import { differenceWith } from 'lodash-es'
import Autosuggest from 'react-autosuggest'

import AutocompleteRequest from '../../util/request/autocompleteRequest'
import { autocompleteFacetsMap } from '../../util/autocompleteFacetsMap'
import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { handleError } from '../../actions/errors'
import { scienceKeywordTypes } from '../../util/scienceKeywordTypes'
import { platformTypes } from '../../util/platformTypes'
import Spinner from '../Spinner/Spinner'

import configureStore from '../../store/configureStore'
import useEdscStore from '../../zustand/useEdscStore'
import Button from '../Button/Button'

let cancelToken

/**
 * Maps a science keyword string into individual parts
 * @param {String} value Colon-separated string of a science keyword
 */
const mapScienceKeywords = (value) => {
  const values = value.split(':')
  const returnValue = {}

  values.forEach((keywordValue, index) => {
    if (keywordValue) {
      returnValue[scienceKeywordTypes[index]] = keywordValue
    }
  })

  return returnValue
}

/**
 * Maps a platform string into individual parts
 * @param {String} value Colon-separated string of a science keyword
 */
const mapPlatforms = (value) => {
  const values = value.split(':')
  const returnValue = {}

  values.forEach((keywordValue, index) => {
    if (keywordValue) {
      returnValue[platformTypes[index]] = keywordValue
    }
  })

  return returnValue
}

/**
 * Map an autocomplete suggestion into a CMR Facet
 * @param {Object} autocomplete autocomplete suggestion
 */
export const mapAutocompleteToFacets = (autocomplete) => {
  const { suggestion } = autocomplete
  const { fields, type } = suggestion

  const mappedType = autocompleteFacetsMap[type]

  if (!mappedType) return null

  const facets = {
    [mappedType]: fields
  }

  if (mappedType === 'science_keywords_h') {
    facets.science_keywords_h = mapScienceKeywords(fields)
  }

  if (mappedType === 'platforms_h') {
    facets.platforms_h = mapPlatforms(fields)
  }

  return facets
}

class SearchAutocomplete extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoaded: false,
      isLoading: false,
      suggestions: [],
      selected: []
    }

    this.inputRef = React.createRef()

    // Bind methods
    this.fetchAutocomplete = this.fetchAutocomplete.bind(this)
    this.clearAutocompleteSuggestions = this.clearAutocompleteSuggestions.bind(this)
    this.cancelAutocomplete = this.cancelAutocomplete.bind(this)
    this.selectAutocompleteSuggestion = this.selectAutocompleteSuggestion.bind(this)
    this.renderSuggestionsContainer = this.renderSuggestionsContainer.bind(this)
    this.updateAutocompleteSuggestions = this.updateAutocompleteSuggestions.bind(this)
    this.onFormSubmit = this.onFormSubmit.bind(this)
  }

  componentWillUnmount() {
    this.cancelAutocomplete()
  }

  onFormSubmit(event) {
    event.preventDefault()

    const {
      keywordSearchFromProps,
      keywordSearch,
      onChangeQuery,
      onChangeFocusedCollection
    } = this.props

    if (keywordSearchFromProps !== keywordSearch) {
      // Cancel any in-flight autocomplete requests
      this.cancelAutocomplete()

      onChangeFocusedCollection('')
      onChangeQuery({
        collection: {
          keyword: keywordSearch
        }
      })
    }
  }

  /**
   * When a user submits the search form before an autocomplete response comes back
   * this action is called to cancel any requests that are in flight and update the
   * store to inform the ui that we're no longer loading suggestions
   */
  cancelAutocomplete() {
    if (cancelToken) {
      cancelToken.cancel()
    }

    this.setState({
      isLoaded: true,
      isLoading: false
    })
  }

  /**
   * Clears autocomplete suggestions
   */
  clearAutocompleteSuggestions() {
    this.setState({
      isLoaded: false,
      suggestions: []
    })
  }

  /**
   * Updates autocomplete suggestions with filtering
   * @param {Object} payload Contains params and suggestions
   */
  updateAutocompleteSuggestions(payload) {
    const { suggestions } = payload
    const { selected } = this.state

    // Removes any selected values from the list of selections
    const nonSelectedSuggestions = differenceWith(
      suggestions,
      selected,
      (a, b) => a.type === b.type && a.value === b.value
    )

    this.setState({
      suggestions: nonSelectedSuggestions
    })
  }

  /**
   * Fetches autocomplete suggestions
   * @param {Object} data Object with 'value' property
   */
  async fetchAutocomplete(data) {
    if (!data) return

    if (cancelToken) {
      cancelToken.cancel()
    }

    const { value } = data

    // Get earthdataEnvironment from Redux
    const {
      dispatch: reduxDispatch,
      getState: reduxGetState
    } = configureStore()
    const reduxState = reduxGetState()
    const earthdataEnvironment = getEarthdataEnvironment(reduxState)

    const { authToken } = reduxState

    this.setState({
      isLoading: true,
      isLoaded: false
    })

    const requestObject = new AutocompleteRequest(authToken, earthdataEnvironment)

    cancelToken = requestObject.getCancelToken()

    const params = {
      q: value
    }

    try {
      const response = await requestObject.search(params)
      const { data: dataObject } = response
      const { feed } = dataObject
      const { entry } = feed

      this.setState({
        isLoaded: true,
        isLoading: false
      })

      this.updateAutocompleteSuggestions({
        suggestions: entry
      })
    } catch (error) {
      if (isCancel(error)) return

      this.setState({
        isLoaded: false,
        isLoading: false
      })

      reduxDispatch(handleError({
        error,
        action: 'fetchAutocomplete',
        resource: 'suggestions',
        requestObject
      }))
    }
  }

  /**
   * Action for selecting an autocomplete suggestion
   * @param {Object} event Event object
   * @param {Object} data Autocomplete suggestion
   */
  selectAutocompleteSuggestion(event, data) {
    const { onChangeQuery, onSuggestionSelected } = this.props
    const cmrFacet = mapAutocompleteToFacets(data)

    if (cmrFacet) {
      const { home, facetParams } = useEdscStore.getState()
      const { setOpenFacetGroup } = home
      const { addCmrFacetFromAutocomplete } = facetParams
      addCmrFacetFromAutocomplete(cmrFacet)

      const { suggestion } = data
      const { type } = suggestion
      setOpenFacetGroup(type)
    }

    onChangeQuery({
      collection: {
        pageNum: 1,
        keyword: ''
      }
    })

    // Call the parent's callback to clear the local state (this does not exist) create it
    if (onSuggestionSelected) {
      onSuggestionSelected()
    }
  }

  /**
   * AutoSuggest method to render the suggestions container
   */
  renderSuggestionsContainer(opts) {
    const {
      containerProps,
      children,
      query
    } = opts

    const {
      selectedSuggestion
    } = this.props

    const {
      isLoading,
      isLoaded
    } = this.state

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
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
      keywordSearch,
      onAutoSuggestChange,
      getSuggestionValue,
      renderInputComponent,
      renderSuggestion,
      shouldRenderSuggestions,
      onSuggestionHighlighted
    } = this.props

    const {
      suggestions
    } = this.state

    return (
      <>
        <form className="search-form__form" onSubmit={this.onFormSubmit}>
          <Autosuggest
            ref={this.inputRef}
            className="search-form__autocomplete"
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.fetchAutocomplete}
            onSuggestionsClearRequested={this.clearAutocompleteSuggestions}
            getSuggestionValue={getSuggestionValue}
            renderSuggestionsContainer={this.renderSuggestionsContainer}
            renderSuggestion={renderSuggestion}
            renderInputComponent={renderInputComponent}
            onSuggestionSelected={this.selectAutocompleteSuggestion}
            onSuggestionHighlighted={onSuggestionHighlighted}
            shouldRenderSuggestions={shouldRenderSuggestions}
            inputProps={
              {
                name: 'keywordSearch',
                'data-testid': 'keyword-search-input',
                className: 'search-form__input form-control',
                placeholder: 'Type to search for data',
                value: keywordSearch,
                onChange: onAutoSuggestChange
              }
            }
          />
        </form>
        <Button
          bootstrapVariant="inline-block"
          className="search-form__button search-form__button--submit"
          label="Search"
          onClick={this.onFormSubmit}
        >
          Search
        </Button>
      </>
    )
  }
}

SearchAutocomplete.propTypes = {
  keywordSearch: PropTypes.string.isRequired,
  keywordSearchFromProps: PropTypes.string.isRequired,
  selectedSuggestion: PropTypes.shape({
    value: PropTypes.string
  }),
  onAutoSuggestChange: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  getSuggestionValue: PropTypes.func.isRequired,
  renderInputComponent: PropTypes.func.isRequired,
  renderSuggestion: PropTypes.func.isRequired,
  shouldRenderSuggestions: PropTypes.func.isRequired,
  onSuggestionHighlighted: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func
}

SearchAutocomplete.defaultProps = {
  selectedSuggestion: null,
  onSuggestionSelected: null
}

export default SearchAutocomplete
