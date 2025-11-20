import { useMutation } from '@apollo/client'
import { useNavigate } from 'react-router-dom'

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
// @ts-expect-error This file does not have types
import { metricsDataAccess } from '../middleware/metrics/actions'
// @ts-expect-error This file does not have types
import configureStore from '../store/configureStore'

import type {
  EchoOrderAccessMethod,
  EsiAccessMethod,
  HarmonyAccessMethod
} from '../zustand/types'

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
    const {
      dispatch: reduxDispatch
    } = configureStore()

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
      } else if (type === ACCESS_METHOD_TYPES.ECHO_ORDERS) {
        const { optionDefinition } = selectedMethod as EchoOrderAccessMethod
        const { name: serviceName } = optionDefinition

        selectedService = serviceName
        selectedType = 'order'
      } else if (type === ACCESS_METHOD_TYPES.ESI) {
        const { optionDefinition } = selectedMethod as EsiAccessMethod
        const { name: serviceName } = optionDefinition
        selectedService = serviceName
        selectedType = 'esi'
      } else if (type === ACCESS_METHOD_TYPES.OPENDAP) {
        selectedService = 'OPeNDAP'
        selectedType = 'opendap'
      } else if (type === ACCESS_METHOD_TYPES.HARMONY) {
        const { name } = selectedMethod as HarmonyAccessMethod
        selectedService = name
        selectedType = 'harmony'
      } else if (type === ACCESS_METHOD_TYPES.SWODLR) {
        selectedService = 'SWODLR'
        selectedType = 'swodlr'
      }

      return {
        collectionId: id,
        type: selectedType,
        service: selectedService
      }
    })

    reduxDispatch(metricsDataAccess({
      type: 'data_access_completion',
      collections: metricsCollections
    }))

    const orderParams = prepareRetrievalParams()

    doCreateRetrieval({ variables: orderParams })
  }

  return {
    createRetrieval,
    loading
  }
}
