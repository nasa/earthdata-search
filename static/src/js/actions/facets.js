import { camelCase } from 'lodash'

import {
  ADD_SELECTED_FEATURE_FACET,
  REMOVE_SELECTED_FEATURE_FACET,
  ADD_SELECTED_CMR_FACET,
  REMOVE_SELECTED_CMR_FACET
} from '../constants/actionTypes'

import actions from './index'


/**
 * Sets the desired feature facet and performs a collections request.
 * @param {object} e - An event object triggered by the onChange event on the selected facet.
 * @param {object} facetInfo - An object containing information about the selected facet.
 * @param {function} dispatch - A dispatch function provided by redux.
 */
export const changeFeatureFacet = (e, facetInfo) => (dispatch) => {
  if (e.target.checked) {
    dispatch({
      type: ADD_SELECTED_FEATURE_FACET,
      payload: { [camelCase(facetInfo.title)]: true }
    })
  } else {
    dispatch({
      type: REMOVE_SELECTED_FEATURE_FACET,
      payload: { [camelCase(facetInfo.title)]: false }
    })
  }
  dispatch(actions.getCollections())
}


/**
 * Sets the desired facet and performs a collections request.
 * @param {object} e - An event object triggered by the onChange event on the selected facet.
 * @param {object} newParams - An object containing the params from the apply/remove link
 * @param {function} dispatch - A dispatch function provided by redux.
 */
export const changeCmrFacet = (e, newParams) => (dispatch) => {
  if (e.target.checked) {
    dispatch({
      type: ADD_SELECTED_CMR_FACET,
      payload: {
        data_center_h: newParams.data_center_h ? newParams.data_center_h : undefined,
        instrument_h: newParams.instrument_h ? newParams.instrument_h : undefined,
        platform_h: newParams.platform_h ? newParams.platform_h : undefined,
        processing_level_id_h: newParams.processing_level_id_h ? newParams.processing_level_id_h : undefined,
        project_h: newParams.project_h ? newParams.project_h : undefined,
        science_keywords_h: newParams.science_keywords_h ? newParams.science_keywords_h : undefined
      }
    })
  } else {
    dispatch({
      type: REMOVE_SELECTED_CMR_FACET,
      payload: {
        data_center_h: newParams.data_center_h ? newParams.data_center_h : undefined,
        instrument_h: newParams.instrument_h ? newParams.instrument_h : undefined,
        platform_h: newParams.platform_h ? newParams.platform_h : undefined,
        processing_level_id_h: newParams.processing_level_id_h ? newParams.processing_level_id_h : undefined,
        project_h: newParams.project_h ? newParams.project_h : undefined,
        science_keywords_h: newParams.science_keywords_h ? newParams.science_keywords_h : undefined
      }
    })
  }
  dispatch(actions.getCollections())
}
