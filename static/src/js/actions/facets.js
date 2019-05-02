import {
  UPDATE_SELECTED_FEATURE_FACET,
  UPDATE_SELECTED_CMR_FACET
} from '../constants/actionTypes'

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
  dispatch(updateCollectionQuery({ pageNum: 1 }))
  dispatch(updateFeatureFacet(facetInfo))
  dispatch(actions.getCollections())
}


export const updateCmrFacet = newParams => ({
  type: UPDATE_SELECTED_CMR_FACET,
  payload: {
    data_center_h: newParams.data_center_h
      ? newParams.data_center_h
      : undefined,
    instrument_h: newParams.instrument_h
      ? newParams.instrument_h
      : undefined,
    platform_h: newParams.platform_h
      ? newParams.platform_h
      : undefined,
    processing_level_id_h: newParams.processing_level_id_h
      ? newParams.processing_level_id_h
      : undefined,
    project_h: newParams.project_h
      ? newParams.project_h
      : undefined,
    science_keywords_h: newParams.science_keywords_h
      ? newParams.science_keywords_h
      : undefined
  }
})


/**
 * Sets the desired facet and performs a collections request.
 * @param {object} newParams - An object containing the params from the apply/remove link
 * @param {function} dispatch - A dispatch function provided by redux.
 */
export const changeCmrFacet = newParams => (dispatch) => {
  dispatch(updateCollectionQuery({ pageNum: 1 }))
  dispatch(updateCmrFacet(newParams))
  dispatch(actions.getCollections())
}
