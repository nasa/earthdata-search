import { metricsDataAccess } from '../metricsDataAccess'

describe('metricsDataAccess', () => {
  test('pushes data_access_init event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsDataAccess({
      type: 'data_access_init',
      collections: [
        {
          collectionId: 'C1234567890-EDSC'
        }
      ]
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(2)
    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(1, {
      event: 'dataAccess',
      dimension17: 'C1234567890-EDSC',
      dimension18: null,
      dimension19: null,
      dataAccessCategory: 'Data Access',
      dataAccessAction: 'Initiation',
      dataAccessLabel: 'Data Access Initiation',
      dataAccessValue: 1
    })

    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(2, {
      dataAccessAction: null,
      dataAccessCategory: null,
      dataAccessLabel: null,
      dataAccessValue: null,
      dimension17: null,
      dimension18: null,
      dimension19: null
    })
  })

  test('pushes data_access_completion event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsDataAccess({
      type: 'data_access_completion',
      collections: [
        {
          collectionId: 'C1234567890-EDSC',
          service: 'OPeNDAP',
          type: 'service'
        }
      ]
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(2)
    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(1, {
      event: 'dataAccess',
      dimension17: 'C1234567890-EDSC',
      dimension18: 'OPeNDAP',
      dimension19: 'service',
      dataAccessCategory: 'Data Access',
      dataAccessAction: 'Completion',
      dataAccessLabel: 'Data Access Completion',
      dataAccessValue: 1
    })

    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(2, {
      dataAccessAction: null,
      dataAccessCategory: null,
      dataAccessLabel: null,
      dataAccessValue: null,
      dimension17: null,
      dimension18: null,
      dimension19: null
    })
  })

  test('pushes single_granule_download event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsDataAccess({
      type: 'single_granule_download',
      collections: [
        {
          collectionId: 'C1234567890-EDSC'
        }
      ]
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(2)
    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(1, {
      event: 'dataAccess',
      dimension17: 'C1234567890-EDSC',
      dimension18: 'Single Granule',
      dimension19: 'single_granule',
      dataAccessCategory: 'Data Access',
      dataAccessAction: 'Completion',
      dataAccessLabel: 'Data Access Completion',
      dataAccessValue: 1
    })

    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(2, {
      dataAccessAction: null,
      dataAccessCategory: null,
      dataAccessLabel: null,
      dataAccessValue: null,
      dimension17: null,
      dimension18: null,
      dimension19: null
    })
  })

  test('pushes single_granule_s3_access event to the dataLayer', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsDataAccess({
      type: 'single_granule_s3_access',
      collections: [
        {
          collectionId: 'C1234567890-EDSC'
        }
      ]
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(2)
    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(1, {
      event: 'dataAccess',
      dimension17: 'C1234567890-EDSC',
      dimension18: 'S3 Single Granule',
      dimension19: 's3_single_granule',
      dataAccessCategory: 'Data Access',
      dataAccessAction: 'Completion',
      dataAccessLabel: 'Data Access Completion',
      dataAccessValue: 1
    })

    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(2, {
      dataAccessAction: null,
      dataAccessCategory: null,
      dataAccessLabel: null,
      dataAccessValue: null,
      dimension17: null,
      dimension18: null,
      dimension19: null
    })
  })

  test('handles multiple collections', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsDataAccess({
      type: 'data_access_init',
      collections: [
        {
          collectionId: 'C1111111111-EDSC'
        },
        {
          collectionId: 'C2222222222-EDSC'
        }
      ]
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(3)
    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(1, {
      event: 'dataAccess',
      dimension17: 'C1111111111-EDSC',
      dimension18: null,
      dimension19: null,
      dataAccessCategory: 'Data Access',
      dataAccessAction: 'Initiation',
      dataAccessLabel: 'Data Access Initiation',
      dataAccessValue: 1
    })

    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(2, {
      event: 'dataAccess',
      dimension17: 'C2222222222-EDSC',
      dimension18: null,
      dimension19: null,
      dataAccessCategory: 'Data Access',
      dataAccessAction: 'Initiation',
      dataAccessLabel: 'Data Access Initiation',
      dataAccessValue: 1
    })

    expect(dataLayerPushSpy).toHaveBeenNthCalledWith(3, {
      dataAccessAction: null,
      dataAccessCategory: null,
      dataAccessLabel: null,
      dataAccessValue: null,
      dimension17: null,
      dimension18: null,
      dimension19: null
    })
  })

  test('handles empty collections array', () => {
    const dataLayerPushSpy = jest.spyOn(window.dataLayer, 'push')

    metricsDataAccess({
      type: 'data_access_init',
      collections: []
    })

    expect(dataLayerPushSpy).toHaveBeenCalledTimes(1)
    expect(dataLayerPushSpy).toHaveBeenCalledWith({
      dataAccessAction: null,
      dataAccessCategory: null,
      dataAccessLabel: null,
      dataAccessValue: null,
      dimension17: null,
      dimension18: null,
      dimension19: null
    })
  })
})
