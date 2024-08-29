import Request from './request'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export default class SavedAccessConfigsRequest extends Request {
  constructor(authToken, earthdataEnvironment, href) {
    super(getEnvironmentConfig().apiHost, earthdataEnvironment)

    this.authenticated = true
    this.authToken = authToken
    this.href = href
    this.searchPath = 'saved_access_configs'
  }

  handleUnauthorized(data) {
    if (data.statusCode === 401 || data.message === 'Unauthorized') {
      const { pathname } = window.location
      // Determine the path to redirect to for logging in
      const returnPath = this.href

      if (pathname.startsWith('/admin')) {
        window.location.href = getEnvironmentConfig().edscHost

        return
      }

      const redirectPath = `${getEnvironmentConfig().apiHost}/login?ee=${this.earthdataEnvironment}&state=${encodeURIComponent(returnPath)}`

      window.location.href = redirectPath
    }
  }

  get(params) {
    super.get(this.searchPath, params)
  }
}
