import { isCancel } from 'axios'

import AutocompleteRequest from '../util/request/autocompleteRequest'
import {
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  LOADED_AUTOCOMPLETE,
  LOADING_AUTOCOMPLETE,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS
} from '../constants/actionTypes'

import actions from '.'

import { autocompleteFacetsMap } from '../util/autocompleteFacetsMap'
import { buildPromise } from '../util/buildPromise'
import { handleError } from './errors'
import { scienceKeywordTypes } from '../util/scienceKeywordTypes'
import { platformTypes } from '../util/platformTypes'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

export const onAutocompleteLoaded = (payload) => ({
  type: LOADED_AUTOCOMPLETE,
  payload
})

export const onAutocompleteLoading = () => ({
  type: LOADING_AUTOCOMPLETE
})

export const clearAutocompleteSuggestions = () => ({
  type: CLEAR_AUTOCOMPLETE_SUGGESTIONS
})

export const updateAutocompleteSuggestions = (payload) => ({
  type: UPDATE_AUTOCOMPLETE_SUGGESTIONS,
  payload
})

let cancelToken

/**
 * When a user submits the search form before an autocomplete response comes back
 * this action is called to cancel any requests that are in flight and update the
 * store to inform the ui that we're no longer loading suggestions
 */
export const cancelAutocomplete = () => (dispatch) => {
  if (cancelToken) {
    cancelToken.cancel()
  }

  dispatch(onAutocompleteLoaded({ loaded: true }))

  return buildPromise(null)
}

export const fetchAutocomplete = (data) => (dispatch, getState) => {
  if (!data) return null

  if (cancelToken) {
    cancelToken.cancel()
  }

  const { value } = data

  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(useEdscStore.getState())

  const { authToken } = state

  dispatch(onAutocompleteLoading())

  const requestObject = new AutocompleteRequest(authToken, earthdataEnvironment)

  cancelToken = requestObject.getCancelToken()

  const params = {
    q: value
  }

  const response = requestObject.search(params)
    .then((responseObject) => {
      const { data: dataObject } = responseObject
      const { feed } = dataObject
      const { entry } = feed

      dispatch(onAutocompleteLoaded({ loaded: true }))
      dispatch(updateAutocompleteSuggestions({
        params,
        suggestions: entry
      }))
    })
    .catch((error) => {
      if (isCancel(error)) return

      dispatch(onAutocompleteLoaded({ loaded: false }))

      dispatch(handleError({
        error,
        action: 'fetchAutocomplete',
        resource: 'suggestions',
        requestObject
      }))
    })

  return response
}

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

/**
 * Action for selecting an autocomplete suggestion
 * @param {Object} data Autocomplete suggestion
 */
export const selectAutocompleteSuggestion = (data) => (dispatch) => {
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

  dispatch(actions.changeQuery({
    collection: {
      pageNum: 1,
      keyword: ''
    }
  }))
}
