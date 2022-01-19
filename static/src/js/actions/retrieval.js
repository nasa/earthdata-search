import { push } from 'connected-react-router'

import {
  SET_RETRIEVAL_LOADING,
  UPDATE_RETRIEVAL
} from '../constants/actionTypes'

import { addToast } from '../util/addToast'
import RetrievalRequest from '../util/request/retrievalRequest'

import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'
import { getEarthdataEnvironment } from '../selectors/earthdataEnvironment'
import { handleError } from './errors'
import { metricsDataAccess } from '../middleware/metrics/actions'
import { portalPathFromState } from '../../../../sharedUtils/portalPath'
import { prepareRetrievalParams } from '../util/retrievals'
import { removeRetrievalHistory } from './retrievalHistory'
import { submittingProject, submittedProject } from './project'

export const setRetrievalLoading = () => ({
  type: SET_RETRIEVAL_LOADING
})

export const updateRetrieval = (retrievalData) => ({
  type: UPDATE_RETRIEVAL,
  payload: retrievalData
})

/**
 * Submit data representing a Retrieval to be stored in the database
 */
export const submitRetrieval = () => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken, project } = state

  const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)

  const { collections: projectCollections } = project
  const {
    allIds: projectCollectionsIds,
    byId: projectCollectionsById
  } = projectCollections

  const metricsCollections = projectCollectionsIds.map((id) => {
    const { [id]: projectCollection } = projectCollectionsById
    const { accessMethods, selectedAccessMethod = '' } = projectCollection
    const { [selectedAccessMethod]: selectedMethod } = accessMethods
    const { type } = selectedMethod

    let selectedService
    let selectedType

    if (type === 'download') {
      selectedService = 'Download'
      selectedType = 'download'
    } else if (type === 'ECHO ORDERS') {
      const { option_definition: optionDefinition } = selectedMethod
      const { name } = optionDefinition
      selectedService = name
      selectedType = 'order'
    } else if (type === 'ESI') {
      const { service_option_definition: optionDefinition } = selectedMethod
      const { name } = optionDefinition
      selectedService = name
      selectedType = 'esi'
    } else if (type === 'OPeNDAP') {
      selectedService = 'OPeNDAP'
      selectedType = 'opendap'
    }

    return {
      collectionId: id,
      type: selectedType,
      service: selectedService
    }
  })

  dispatch(metricsDataAccess({
    type: 'data_access_completion',
    collections: metricsCollections
  }))

  dispatch(submittingProject())

  const orderParams = prepareRetrievalParams(state)

  const response = requestObject.submit(orderParams)
    .then((response) => {
      const { id: retrievalId } = response.data

      dispatch(submittedProject())

      const eeLink = earthdataEnvironment === deployedEnvironment() ? '' : `?ee=${earthdataEnvironment}`

      dispatch(push(`${portalPathFromState(state)}/downloads/${retrievalId}${eeLink}`))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'submitRetrieval',
        resource: 'retrieval',
        verb: 'submitting',
        requestObject
      }))
    })

  return response
}

/**
 * Fetch a retrieval from the database
 * @param {Integer} id Database ID of the retrieval to lookup
 */
export const fetchRetrieval = (id) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  dispatch(setRetrievalLoading())

  const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)

  const response = requestObject.fetch(id)
    .then((response) => {
      const { data } = response
      const { collections } = data

      const updatedCollections = {
        ...collections
      }

      Object.keys(collections.byId).forEach((collectionId) => {
        const currentCollection = collections.byId[collectionId]

        const { access_method: accessMethod } = currentCollection
        const { type } = accessMethod

        updatedCollections.byId[collectionId] = {
          ...currentCollection,
          isLoading: false,
          // Downloadable orders do not need to be loaded, default them to true
          isLoaded: ['download', 'OPeNDAP'].includes(type)
        }
      })

      dispatch(updateRetrieval({
        ...data,
        collections: updatedCollections
      }))
    })
    .catch((error) => {
      dispatch(handleError({
        error,
        action: 'fetchRetrieval',
        resource: 'retrieval',
        requestObject
      }))
    })

  return response
}

/**
 * Delete a retrieval from the database
 * @param {Integer} id Database ID of the retrieval to lookup
 */
export const deleteRetrieval = (id) => (dispatch, getState) => {
  const state = getState()

  // Retrieve data from Redux using selectors
  const earthdataEnvironment = getEarthdataEnvironment(state)

  const { authToken } = state

  try {
    const requestObject = new RetrievalRequest(authToken, earthdataEnvironment)
    const response = requestObject.remove(id)
      .then(() => {
        dispatch(removeRetrievalHistory(id))
        addToast('Retrieval removed', {
          appearance: 'success',
          autoDismiss: true
        })
      })
      .catch((error) => {
        dispatch(handleError({
          error,
          action: 'deleteRetrieval',
          resource: 'retrieval',
          verb: 'deleting',
          requestObject
        }))
      })

    return response
  } catch (e) {
    return null
  }
}
