import { useQuery } from '@apollo/client'
import { useLocation, useParams } from 'react-router-dom'

import GET_RETRIEVAL from '../operations/queries/getRetrieval'
import isPath from '../util/isPath'
import { routes } from '../constants/routes'

/**
 * Custom hook to fetch retrieval data based on the current route and parameters.
 * @returns {Object} An object containing the loading state and retrieval data.
 */
export const useGetRetrieval = () => {
  const location = useLocation()
  const params = useParams()

  const { pathname } = location
  const { id: retrievalId } = params

  const { data = {}, loading } = useQuery(GET_RETRIEVAL, {
    skip: isPath(pathname, [routes.DOWNLOADS]) || !retrievalId,
    variables: {
      obfuscatedId: retrievalId
    }
  })

  const { retrieval = {} } = data

  return {
    loading,
    retrieval
  }
}
