import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import GraphQlRequest from './graphQlRequest'

export default class ExportSearchRequest extends GraphQlRequest {
  constructor(authToken, earthdataEnvironment) {
    super(authToken, earthdataEnvironment)

    // The call to super above will set this.baseURL based on if the authToken exists, but
    // this call always needs to go to the apiHost, so we overwrite it here
    this.baseUrl = getEnvironmentConfig().apiHost

    // The GraphQlRequest constructor will set this.authenticated and this.authToken if available.
    // Setting this.optionallyAuthenticated ensures the correct headers get set if authToken is not available
    this.optionallyAuthenticated = true

    this.lambda = true
    this.searchPath = 'collections/export'
  }
}
