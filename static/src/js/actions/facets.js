import { find, isEqual, remove } from 'lodash'

import {
  UPDATE_SELECTED_FEATURE_FACET,
  UPDATE_SELECTED_CMR_FACET,
  ADD_CMR_FACET,
  REMOVE_CMR_FACET
} from '../constants/actionTypes'

import { prepareCMRFacetPayload } from '../util/facets'
import actions from './index'

import { updateCollectionQuery } from './search'
import { scienceKeywordTypes } from '../util/scienceKeywordTypes'

export const updateFeatureFacet = (facetInfo) => ({
  type: UPDATE_SELECTED_FEATURE_FACET,
  payload: { ...facetInfo }
})

/**
 * Sets the desired feature facet and performs a collections request.
 * @param {object} facetInfo - An object containing information about the selected facet.
 * @param {function} dispatch - A dispatch function provided by redux.
 */
export const changeFeatureFacet = (facetInfo) => (dispatch) => {
  // Reset collection pageNum to 1 when facets are changing
  dispatch(updateCollectionQuery({ pageNum: 1 }))
  dispatch(updateFeatureFacet(facetInfo))
  dispatch(actions.getCollections())
}

export const updateCmrFacet = (newParams) => ({
  type: UPDATE_SELECTED_CMR_FACET,
  payload: prepareCMRFacetPayload(newParams)
})

/**
 * Sets the desired facet and performs a collections request.
 * @param {object} newParams - An object containing the params from the apply/remove link
 * @param {function} dispatch - A dispatch function provided by redux.
 */
export const changeCmrFacet = (newParams, facet, applied) => (dispatch, getState) => {
  // If the facet is being removed (applied === false), remove an autocomplete value
  if (applied === false) {
    const { autocomplete } = getState()
    const { selected } = autocomplete

    const {
      level,
      type: facetType,
      value: facetValue
    } = facet

    if (facetType === 'science_keywords' && level > 0) {
      // Create a science keyword facet based on the facet param, up to one level below facet param
      // If the facet param is { level: 1, type: 'science_keywords', value: 'Atmospheric Temperature' }
      // We need to build { topic: Atmosphere } in order to delete the parent facet

      // Find a selected autocomplete that matches the facet that was removed
      const autocompleteItem = find(selected, (item) => {
        const {
          fields,
          type: itemType
        } = item
        const parts = fields.split(':')

        // If the autocompleteType is science_keywords, check the correct level of keyword for the autocomplete
        return itemType === 'science_keywords' && parts[level] === facetValue
      })

      if (autocompleteItem) {
        // Translate autocompleteItem into a science keyword facet, stopping one level below the facet level
        const { fields } = autocompleteItem
        const fieldParts = fields.split(':')

        const facetToRemove = {}
        fieldParts.forEach((keywordValue, i) => {
          if (i < level) facetToRemove[scienceKeywordTypes[i]] = keywordValue
        })

        // Remove the facetToRemove from newParams, so the facet gets removed on the next getCollections
        const { science_keywords_h: scienceKeywordsH } = newParams
        remove(scienceKeywordsH, (item) => (isEqual(item, facetToRemove)))
      }
    }

    dispatch(actions.deleteAutocompleteValue(facet))
  }

  // Reset collection pageNum to 1 when facets are changing
  dispatch(updateCollectionQuery({ pageNum: 1 }))
  dispatch(updateCmrFacet(newParams))
  dispatch(actions.getCollections())
}

/**
 * Used when an autocomplete suggestion is selected to add the matching CMR Facet
 */
export const addCmrFacet = (payload) => ({
  type: ADD_CMR_FACET,
  payload
})

/**
 * Used when an autocomplete suggestion is removed to remove the matching CMR Facet
 */
export const removeCmrFacet = (payload) => ({
  type: REMOVE_CMR_FACET,
  payload
})
