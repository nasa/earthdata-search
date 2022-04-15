import GranuleRequest from './granuleRequest'

export default class ExportGranuleSearchRequest extends GranuleRequest {
  constructor(authToken, earthdataEnvironment) {
    super(authToken, earthdataEnvironment)
    if (authToken && authToken !== '') {
      this.searchPath = 'granules/export'
    } else {
      this.searchPath = 'search/granules.stac'
    }
  }

  transformResponse(data) {
    super.transformResponse(data)
    return data
  }
}
