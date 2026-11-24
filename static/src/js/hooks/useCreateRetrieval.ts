import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router'

import { routes } from '../constants/routes'
import CREATE_RETRIEVAL from '../operations/mutations/createRetrieval'

import useEdscStore from '../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../zustand/selectors/earthdataEnvironment'

// @ts-expect-error This file does not have types
import { ACCESS_METHOD_TYPES } from '../../../../sharedConstants/accessMethodTypes'

// @ts-expect-error This file does not have types
import { prepareRetrievalParams } from '../util/retrievals'
// @ts-expect-error This file does not have types
import deployedEnvironment from '../../../../sharedUtils/deployedEnvironment'
import { metricsDataAccess } from '../util/metrics/metricsDataAccess'

import logEvent from '../util/metrics/experiments/logEvent'

export const useCreateRetrieval = () => {
  const navigate = useNavigate()

  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)
  const handleError = useEdscStore((state) => state.errors.handleError)
  const projectCollections = useEdscStore((state) => state.project.collections)
  const {
    allIds: projectCollectionsIds,
    byId: projectCollectionsById
  } = projectCollections

  const [doCreateRetrieval, { loading }] = useMutation(CREATE_RETRIEVAL, {
    onCompleted: (data) => {
      const { createRetrieval } = data
      const { environment, obfuscatedId } = createRetrieval

      const eeLink = environment === deployedEnvironment() ? '' : `?ee=${earthdataEnvironment}`

      if (obfuscatedId) navigate(`${routes.DOWNLOADS}/${obfuscatedId}${eeLink}`)
    },
    onError: (error) => {
      handleError({
        error,
        action: 'createRetrieval',
        resource: 'retrieval',
        verb: 'creating'
      })
    }
  })

  const createRetrieval = () => {
    // Aggregate metrics for retrievals by service
    const metricsCollections = projectCollectionsIds.map((id) => {
      const { [id]: projectCollection } = projectCollectionsById
      const { accessMethods, selectedAccessMethod = '' } = projectCollection

      if (!accessMethods
        || !selectedAccessMethod
        || !accessMethods[selectedAccessMethod]
      ) return null

      const selectedMethod = accessMethods[selectedAccessMethod]

      const { type } = selectedMethod

      let selectedService
      let selectedType

      if (type === ACCESS_METHOD_TYPES.DOWNLOAD) {
        selectedService = 'Download'
        selectedType = 'download'
      } else if (type === ACCESS_METHOD_TYPES.HARMONY) {
        selectedService = 'Harmony'
        selectedType = 'harmony'
      }

      return {
        collectionId: id,
        service: selectedService,
        type: selectedType
      }
    })
      .filter((collection) => collection !== null)

    metricsDataAccess({
      type: 'data_access_completion',
      collections: metricsCollections
    })

    // Log the data access event for GrowthBook
    logEvent({
      eventType: 'data_access',
      eventData: JSON.stringify({
        service_type: metricsCollections.map((collection) => collection?.type)
      })
    })

    const orderParams = prepareRetrievalParams()

    doCreateRetrieval({ variables: orderParams })
  }

  return {
    createRetrieval,
    loading
  }
}
