import ExportSearchRequest from './exportSearchRequest'

export default class ExportCollectionSearchRequest extends ExportSearchRequest {
  constructor(authToken, earthdataEnvironment) {
    super(authToken, earthdataEnvironment)

    this.searchPath = 'collections/export'
  }
}
