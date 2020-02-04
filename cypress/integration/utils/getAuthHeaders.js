import { getEnvironmentConfig } from '../../../sharedUtils/config'

/**
 * Returns common authentication headers for integration tests
 */
export const getAuthHeaders = () => {
  const { jwtToken } = getEnvironmentConfig('test')
  return {
    'jwt-token': jwtToken
  }
}
