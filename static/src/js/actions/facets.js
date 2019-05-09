import {
  UPDATE_SELECTED_FEATURE_FACET,
  UPDATE_SELECTED_CMR_FACET
} from '../constants/actionTypes'

import { prepareCMRFacetPayload } from '../util/facets'
import actions from './index'

import { updateCollectionQuery } from './search'

export const updateFeatureFacet = facetInfo => ({
  type: UPDATE_SELECTED_FEATURE_FACET,
  payload: { ...facetInfo }
})


/**
 * Sets the desired feature facet and performs a collections request.
 * @param {object} facetInfo - An object containing information about the selected facet.
 * @param {function} dispatch - A dispatch function provided by redux.
 */
export const changeFeatureFacet = facetInfo => (dispatch) => {
  // Reset collection pageNum to 1 when facets are changing
  dispatch(updateCollectionQuery({ pageNum: 1 }))
  dispatch(updateFeatureFacet(facetInfo))
  dispatch(actions.getCollections())
}


export const updateCmrFacet = newParams => ({
  type: UPDATE_SELECTED_CMR_FACET,
  payload: prepareCMRFacetPayload(newParams)
})


/**
 * Sets the desired facet and performs a collections request.
 * @param {object} newParams - An object containing the params from the apply/remove link
 * @param {function} dispatch - A dispatch function provided by redux.
 */
export const changeCmrFacet = newParams => (dispatch) => {
  // Reset collection pageNum to 1 when facets are changing
  dispatch(updateCollectionQuery({ pageNum: 1 }))
  dispatch(updateCmrFacet(newParams))
  dispatch(actions.getCollections())
}
