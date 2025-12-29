const { dataLayer = [] } = window

type MetricsDataAccessParams = {
  /** The type of data access event */
  type: string
  /** The collections involved in the data access event */
  collections: Array<{
    /** The collection ID */
    collectionId: string
    /** The service used for data access */
    service?: string
    /** The type of data access */
    type?: string
  }>
}

/**
* Pushes a dataAccess event on the dataLayer.
* @param {Object} action - The action.
*
* type should be a string matching one of:
* - data_access_init
* - data_access_completion
* - single_granule_download
* - single_granule_s3_access
*
* collections should have shape:
* [{
*  collectionId,
*  method,
*  type
* }]
*/
export const metricsDataAccess = ({
  type: accessType,
  collections = []
}: MetricsDataAccessParams) => {
  if (collections && collections.length) {
    collections.forEach((collection) => {
      const {
        collectionId,
        service,
        type
      } = collection

      if (accessType === 'data_access_init') {
        dataLayer.push({
          event: 'dataAccess',
          dimension17: collectionId,
          dimension18: null,
          dimension19: null,
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Initiation',
          dataAccessLabel: 'Data Access Initiation',
          dataAccessValue: 1
        })
      }

      if (accessType === 'data_access_completion') {
        dataLayer.push({
          event: 'dataAccess',
          dimension17: collectionId,
          dimension18: service,
          dimension19: type,
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Completion',
          dataAccessLabel: 'Data Access Completion',
          dataAccessValue: 1
        })
      }

      if (accessType === 'single_granule_download') {
        dataLayer.push({
          event: 'dataAccess',
          dimension17: collectionId,
          dimension18: 'Single Granule',
          dimension19: 'single_granule',
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Completion',
          dataAccessLabel: 'Data Access Completion',
          dataAccessValue: 1
        })
      }

      if (accessType === 'single_granule_s3_access') {
        dataLayer.push({
          event: 'dataAccess',
          dimension17: collectionId,
          dimension18: 'S3 Single Granule',
          dimension19: 's3_single_granule',
          dataAccessCategory: 'Data Access',
          dataAccessAction: 'Completion',
          dataAccessLabel: 'Data Access Completion',
          dataAccessValue: 1
        })
      }
    })
  }

  dataLayer.push({
    dimension17: null,
    dimension18: null,
    dimension19: null,
    dataAccessCategory: null,
    dataAccessAction: null,
    dataAccessLabel: null,
    dataAccessValue: null
  })
}
