import Request from './request'
import type { PreferencesData } from '../../zustand/types'
import type { PreferencesRequestParams } from '../../types/sharedTypes'

// @ts-expect-error Types are not defined for this module
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export interface PreferencesResponse {
  data: {
    preferences: PreferencesData
  }
  headers: Record<string, string>
}

/**
 * Request class for user preferences operations
 */
export default class PreferencesRequest extends Request {
  constructor(authToken: string, earthdataEnvironment: string) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
  }

  /**
   * Update user preferences
   * @param params - The preferences data to update
   * @returns Promise resolving to the updated preferences response
   */
  update(params: PreferencesRequestParams): Promise<PreferencesResponse> {
    return this.post('preferences', params) as Promise<PreferencesResponse>
  }
}
