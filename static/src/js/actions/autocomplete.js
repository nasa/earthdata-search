import { isCancel } from 'axios'

import AutocompleteRequest from '../util/request/autocompleteRequest'
import {
  CLEAR_AUTOCOMPLETE_SUGGESTIONS,
  LOADED_AUTOCOMPLETE,
  LOADING_AUTOCOMPLETE,
  UPDATE_AUTOCOMPLETE_SUGGESTIONS,
  UPDATE_AUTOCOMPLETE_SELECTED,
  DELETE_AUTOCOMPLETE_VALUE,
  CLEAR_AUTOCOMPLETE_SELECTED
} from '../constants/actionTypes'
import { handleError } from './errors'
import actions from '.'

export const onAutocompleteLoaded = payload => ({
  type: LOADED_AUTOCOMPLETE,
  payload
})

export const onAutocompleteLoading = () => ({
  type: LOADING_AUTOCOMPLETE
})

export const clearAutocompleteSelected = () => ({
  type: CLEAR_AUTOCOMPLETE_SELECTED
})

export const clearAutocompleteSuggestions = () => ({
  type: CLEAR_AUTOCOMPLETE_SUGGESTIONS
})

export const updateAutocompleteSuggestions = payload => ({
  type: UPDATE_AUTOCOMPLETE_SUGGESTIONS,
  payload
})

export const updateAutocompleteSelected = payload => ({
  type: UPDATE_AUTOCOMPLETE_SELECTED,
  payload
})

export const deleteAutocompleteValue = payload => ({
  type: DELETE_AUTOCOMPLETE_VALUE,
  payload
})

let cancelToken

export const fetchAutocomplete = data => (dispatch, getState) => {
  if (!data) return null

  if (cancelToken) {
    cancelToken.cancel()
  }

  const { value } = data

  const { authToken } = getState()

  dispatch(onAutocompleteLoading())

  const requestObject = new AutocompleteRequest(authToken)
  cancelToken = requestObject.getCancelToken()

  const params = {
    q: value
  }

  const response = requestObject.search(params)
    .then((response) => {
      const { data } = response
      const { feed } = data
      const { entry } = feed

      dispatch(onAutocompleteLoaded({ loaded: true }))
      dispatch(updateAutocompleteSuggestions({ suggestions: entry }))
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

export const selectAutocompleteSuggestion = data => (dispatch) => {
  dispatch(updateAutocompleteSelected(data))
  dispatch(actions.changeQuery({ collection: { keyword: '' } }))
}

export const removeAutocompleteValue = data => (dispatch) => {
  dispatch(deleteAutocompleteValue(data))
  dispatch(actions.getCollections())
}
