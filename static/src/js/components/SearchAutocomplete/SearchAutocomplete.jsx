import React, {
  useState,
  useRef,
  useCallback,
  useEffect
} from 'react'
import PropTypes from 'prop-types'
import { isCancel } from 'axios'
import { isEqual } from 'lodash-es'
import Autosuggest from 'react-autosuggest'
import { Search } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import AutocompleteSuggestion from '../AutocompleteSuggestion/AutocompleteSuggestion'
import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import Spinner from '../Spinner/Spinner'

import AutocompleteRequest from '../../util/request/autocompleteRequest'
import NlpSearchRequest from '../../util/request/nlpSearchRequest'
import { triggerKeyboardShortcut } from '../../util/triggerKeyboardShortcut'
import { mapAutocompleteToFacets } from '../../util/mapAutocompleteToFacets'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'

import './SearchAutocomplete.scss'

const SearchAutocomplete = ({
  authToken,
  handleError
}) => {
  const collectionQuery = useEdscStore(getCollectionsQuery)
  const { keyword: initialKeyword } = collectionQuery

  const [keywordSearch, setKeywordSearch] = useState(initialKeyword || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [selectedSuggestion, setSelectedSuggestion] = useState(null)

  const inputRef = useRef(null)
  const cancelTokenRef = useRef(null)

  const {
    addCmrFacetFromAutocomplete,
    setCollectionId,
    changeQuery,
    earthdataEnvironment,
    setOpenFacetGroup
  } = useEdscStore((state) => ({
    addCmrFacetFromAutocomplete: state.facetParams.addCmrFacetFromAutocomplete,
    setCollectionId: state.collection.setCollectionId,
    changeQuery: state.query.changeQuery,
    earthdataEnvironment: getEarthdataEnvironment(state),
    setOpenFacetGroup: state.home.setOpenFacetGroup
  }))

  // Update local state when initial keyword changes
  useEffect(() => {
    setKeywordSearch(initialKeyword || '')
  }, [initialKeyword])

  // Cancel any pending requests on unmount
  useEffect(() => () => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel()
    }
  }, [])

  // Add keyboard shortcut listener
  useEffect(() => {
    const handleWindowKeyUp = (event) => {
      const focusElement = () => {
        if (inputRef.current && inputRef.current.input) {
          inputRef.current.input.focus()
        }
      }

      triggerKeyboardShortcut({
        event,
        shortcutKey: '/',
        shortcutCallback: focusElement
      })
    }

    window.addEventListener('keyup', handleWindowKeyUp)

    return () => window.removeEventListener('keyup', handleWindowKeyUp)
  }, [])

  /**
   * When a user submits the search form before an autocomplete response comes back
   * this action is called to cancel any requests that are in flight and update the
   * store to inform the ui that we're no longer loading suggestions
   */
  const cancelAutocomplete = useCallback(() => {
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel()
    }

    setIsLoaded(true)
    setIsLoading(false)
  }, [])

  /**
   * Log NLP search response for comparison (search page)
   */
  const logNlpSearchResponse = useCallback(async (query) => {
    const timestamp = new Date().toISOString()

    console.log(`🔍 [${timestamp}] Search Page: Making NLP request via backend for query:`, query)

    try {
      const startTime = performance.now()

      // Use our backend NLP request class
      const nlpRequest = new NlpSearchRequest('', 'sit')
      console.log(`🔍 [${timestamp}] NLP Request URL: ${nlpRequest.baseUrl}/${nlpRequest.searchPath}`)
      console.log(`🔍 [${timestamp}] NLP Request config:`, {
        baseUrl: nlpRequest.baseUrl,
        searchPath: nlpRequest.searchPath,
        lambda: nlpRequest.lambda,
        authenticated: nlpRequest.authenticated,
        optionallyAuthenticated: nlpRequest.optionallyAuthenticated
      })

      const response = await nlpRequest.search({ q: query })

      const endTime = performance.now()
      const duration = Math.round(endTime - startTime)

      console.log(`🔍 [${new Date().toISOString()}] Search Page: NLP Response (${duration}ms):`, response)

      // Parse the response to get the actual data
      const data = response.data || response

      // Log key parts of the response for easy viewing
      if (data.queryInfo) {
        console.log('🔍 Query Info:', data.queryInfo)
      }

      if (data.metadata?.feed?.entry) {
        console.log(
          `🔍 Found ${data.metadata.feed.entry.length} collections:`,
          data.metadata.feed.entry.map((entry) => entry.title)
        )
      }

      // Store in sessionStorage for reference
      const logEntry = {
        timestamp,
        query,
        response: data,
        duration,
        source: 'search-page'
      }

      const existingLogs = JSON.parse(sessionStorage.getItem('nlpSearchLogs') || '[]')
      existingLogs.push(logEntry)
      sessionStorage.setItem('nlpSearchLogs', JSON.stringify(existingLogs.slice(-10))) // Keep last 10
    } catch (error) {
      console.error(`🔍 [${new Date().toISOString()}] Search Page: NLP request failed:`, error)

      // Still store the failed attempt
      const logEntry = {
        timestamp,
        query,
        error: error.message,
        source: 'search-page'
      }

      const existingLogs = JSON.parse(sessionStorage.getItem('nlpSearchLogs') || '[]')
      existingLogs.push(logEntry)
      sessionStorage.setItem('nlpSearchLogs', JSON.stringify(existingLogs.slice(-10)))
    }
  }, [])

  const clearAutocompleteSuggestions = useCallback(() => {
    setIsLoaded(false)
    setSuggestions([])
  }, [])

  const fetchAutocomplete = useCallback(async (data) => {
    if (!data) return

    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel()
    }

    const { value } = data

    setIsLoading(true)
    setIsLoaded(false)

    const requestObject = new AutocompleteRequest(authToken, earthdataEnvironment)

    cancelTokenRef.current = requestObject.getCancelToken()

    const params = {
      q: value
    }

    try {
      const response = await requestObject.search(params)
      const { data: dataObject } = response
      const { feed } = dataObject
      const { entry } = feed

      setIsLoaded(true)
      setIsLoading(false)

      setSuggestions(entry)
    } catch (error) {
      if (isCancel(error)) return

      setIsLoaded(false)
      setIsLoading(false)

      handleError({
        error,
        action: 'fetchAutocomplete',
        resource: 'suggestions',
        requestObject
      })
    }
  }, [])

  /**
   * Action for selecting an autocomplete suggestion
   * @param {Object} event Event object
   * @param {Object} data Autocomplete suggestion
   */
  const selectAutocompleteSuggestion = useCallback((event, data) => {
    const cmrFacet = mapAutocompleteToFacets(data)

    if (cmrFacet) {
      addCmrFacetFromAutocomplete(cmrFacet)

      const { suggestion } = data
      const { type } = suggestion
      setOpenFacetGroup(type)
    }

    changeQuery({
      collection: {
        pageNum: 1,
        keyword: ''
      }
    })

    // Clear the local keyword state
    setKeywordSearch('')
  }, [])

  const onFormSubmit = useCallback((event) => {
    event.preventDefault()

    if (initialKeyword !== keywordSearch) {
      // Cancel any in-flight autocomplete requests
      cancelAutocomplete()

      setCollectionId(null)
      changeQuery({
        collection: {
          keyword: keywordSearch
        }
      })

      // Make NLP request and log response
      if (keywordSearch && keywordSearch.trim()) {
        logNlpSearchResponse(keywordSearch.trim())
      }
    }
  }, [
    cancelAutocomplete,
    changeFocusedCollection,
    changeQuery,
    initialKeyword,
    keywordSearch,
    logNlpSearchResponse
  ])

  /**
   * AutoSuggest callback when the input value is changed
   * @param {Object} event event object
   * @param {Object} data object with the new value of the input
   */
  const onAutoSuggestChange = useCallback((event, { newValue }) => {
    setKeywordSearch(newValue)
  }, [])

  /**
   * AutoSuggest callback when a suggestion is selected
   * @param {Object} data object with info about the selected suggestion. Value
   * is null when no suggestion is highlighted
   */
  const onSuggestionHighlighted = useCallback((data) => {
    const { suggestion: newSuggestion } = data

    if (!isEqual(selectedSuggestion, newSuggestion)) {
      setSelectedSuggestion(newSuggestion)
    }
  }, [selectedSuggestion])

  /**
   * AutoSuggest callback to retrieve the suggestion value, used when scrolling through suggestions with keyboard arrows
   * @param {Object} suggestion
   */
  const getSuggestionValue = useCallback((suggestion) => suggestion.value, [])

  /**
   * AutoSuggest callback to determine if suggestions should be rendered
   * @param {String} value text entered
   */
  const shouldRenderSuggestions = useCallback((value) => value.trim().length > 2, [])

  /**
   * AutoSuggest method to render the input component
   */
  const renderInputComponent = useCallback((inputProps) => (
    <div className="position-relative">
      <EDSCIcon className="search-autocomplete__search-icon position-absolute" icon={Search} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <input {...inputProps} />
    </div>
  ), [])

  /**
   * AutoSuggest method to render each suggestion
   * @param {Object} suggestion
   */
  const renderSuggestion = useCallback((data) => (
    <AutocompleteSuggestion
      suggestion={data}
    />
  ), [])

  /**
   * AutoSuggest method to render the suggestions container
   */
  const renderSuggestionsContainer = useCallback((opts) => {
    const {
      containerProps,
      children,
      query
    } = opts

    return (
      // eslint-disable-next-line react/jsx-props-no-spreading
      <div {...containerProps} className="search-autocomplete__suggestions-container">
        {
          query && query.length > 2 && (
            <>
              {
                (isLoading && !isLoaded) && (
                  <div className="search-autocomplete__loading-suggestions">
                    <Spinner className="search-autocomplete__spinner" type="dots" size="tiny" inline />
                    <span className="visually-hidden">
                      Loading suggestions...
                    </span>
                  </div>
                )
              }
              { children }
              {
                (isLoading || (children && Object.keys(children).length)) && (
                  <div className="search-autocomplete__query-hint">
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
  }, [isLoading, isLoaded, selectedSuggestion])

  return (
    <>
      <form className="search-autocomplete__form" onSubmit={onFormSubmit}>
        <Autosuggest
          ref={inputRef}
          className="search-autocomplete__autocomplete"
          suggestions={suggestions}
          onSuggestionsFetchRequested={fetchAutocomplete}
          onSuggestionsClearRequested={clearAutocompleteSuggestions}
          getSuggestionValue={getSuggestionValue}
          renderSuggestionsContainer={renderSuggestionsContainer}
          renderSuggestion={renderSuggestion}
          renderInputComponent={renderInputComponent}
          onSuggestionSelected={selectAutocompleteSuggestion}
          onSuggestionHighlighted={onSuggestionHighlighted}
          shouldRenderSuggestions={shouldRenderSuggestions}
          inputProps={
            {
              name: 'keywordSearch',
              className: 'search-autocomplete__input form-control',
              placeholder: 'Type to search for data',
              value: keywordSearch,
              onChange: onAutoSuggestChange
            }
          }
        />
      </form>
      <Button
        bootstrapVariant="inline-block"
        className="search-autocomplete__button search-autocomplete__button--submit"
        label="Search"
        onClick={onFormSubmit}
      >
        Search
      </Button>
    </>
  )
}

SearchAutocomplete.propTypes = {
  authToken: PropTypes.string.isRequired,
  handleError: PropTypes.func.isRequired
}

export default SearchAutocomplete
