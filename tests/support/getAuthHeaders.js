import { testJwtToken } from './getJwtToken'

/**
 * Returns common authentication headers for integration tests
 */
export const getAuthHeaders = () => ({
  'jwt-token': testJwtToken
})
