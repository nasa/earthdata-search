import {
  ADD_SELECTED_FACET,
  REMOVE_SELECTED_FACET
} from '../constants/actionTypes'

import actions from './index'

/**
 * Sets the desired facet link and performs a collections request.
 * @param {object} e - An event object triggered by the onChange event on the selected facet.
 * @param {object} facetActions - An object containing the apply/remove links from the selected facet.
 * @param {function} dispatch - A dispatch function provided by redux.
 */

const toggleFacet = (e, facetActions) => (dispatch) => {
  if (e.target.checked) {
    dispatch({
      type: ADD_SELECTED_FACET,
      payload: facetActions.facetApplyLink
    })
  } else {
    dispatch({
      type: REMOVE_SELECTED_FACET,
      payload: facetActions.facetRemoveLink
    })
  }
  dispatch(actions.getCollections())
}

export default toggleFacet
