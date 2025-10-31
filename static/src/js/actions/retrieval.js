import { SET_RETRIEVAL_LOADING, UPDATE_RETRIEVAL } from '../constants/actionTypes'

import RetrievalRequest from '../util/request/retrievalRequest'

import { deployedEnvironment } from '../../../../sharedUtils/deployedEnvironment'
import { metricsDataAccess } from '../middleware/metrics/actions'
import { prepareRetrievalParams } from '../util/retrievals'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'
import routerHelper from '../router/router'
import { routes } from '../constants/routes'
import { getEdlToken } from '../zustand/selectors/user'

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
export const submitRetrieval = () => (dispatch) => {
  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  const requestObject = new RetrievalRequest(edlToken, earthdataEnvironment)

  const {
    collections: projectCollections,
    submittedProject,
    submittingProject
  } = zustandState.project
  const {
    allIds: projectCollectionsIds,
    byId: projectCollectionsById
  } = projectCollections

  // Aggregate metrics for retrievals by service
  const metricsCollections = projectCollectionsIds.map((id) => {
    const { [id]: projectCollection } = projectCollectionsById
    const { accessMethods, selectedAccessMethod = '' } = projectCollection
    const { [selectedAccessMethod]: selectedMethod } = accessMethods
    const { name, type } = selectedMethod

    let selectedService
    let selectedType

    if (type === 'download') {
      selectedService = 'Download'
      selectedType = 'download'
    } else if (type === 'ECHO ORDERS') {
      const { optionDefinition } = selectedMethod
      const { name: serviceName } = optionDefinition

      selectedService = serviceName
      selectedType = 'order'
    } else if (type === 'ESI') {
      const { optionDefinition } = selectedMethod
      const { name: serviceName } = optionDefinition
      selectedService = serviceName
      selectedType = 'esi'
    } else if (type === 'OPeNDAP') {
      selectedService = 'OPeNDAP'
      selectedType = 'opendap'
    } else if (type === 'Harmony') {
      selectedService = name
      selectedType = 'harmony'
    } else if (type === 'SWODLR') {
      selectedService = 'SWODLR'
      selectedType = 'swodlr'
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

  submittingProject()

  const orderParams = prepareRetrievalParams()

  const response = requestObject.submit(orderParams)
    .then((responseObject) => {
      const { data } = responseObject
      const { id: retrievalId } = data

      submittedProject()

      const eeLink = earthdataEnvironment === deployedEnvironment() ? '' : `?ee=${earthdataEnvironment}`

      routerHelper.router.navigate(`${routes.DOWNLOADS}/${retrievalId}${eeLink}`)
    })
    .catch((error) => {
      zustandState.errors.handleError({
        error,
        action: 'submitRetrieval',
        resource: 'retrieval',
        verb: 'submitting',
        requestObject
      })
    })

  return response
}

/**
 * Fetch a retrieval from the database
 * @param {Integer} id Database ID of the retrieval to lookup
 */
export const fetchRetrieval = (id) => (dispatch) => {
  const zustandState = useEdscStore.getState()
  const edlToken = getEdlToken(zustandState)
  const earthdataEnvironment = getEarthdataEnvironment(zustandState)

  dispatch(setRetrievalLoading())

  const requestObject = new RetrievalRequest(edlToken, earthdataEnvironment)

  const response = requestObject.fetch(id)
    .then((responseObject) => {
      const { data } = responseObject
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
      zustandState.errors.handleError({
        error,
        action: 'fetchRetrieval',
        resource: 'retrieval',
        requestObject
      })
    })

  return response
}
