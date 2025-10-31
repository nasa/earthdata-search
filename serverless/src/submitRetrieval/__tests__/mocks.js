export const orderPayload = {
  body: JSON.stringify({
    params: {
      collections: [
        {
          id: 'C10000005-EDSC',
          access_method: {
            type: 'download'
          },
          granule_count: 139,
          granule_params: {
            echoCollectionId: 'C10000005-EDSC',
            boundingBox: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
          },
          collection_metadata: {}
        }
      ],
      environment: 'prod'
    }
  }),
  requestContext: {
    authorizer: {
      jwtToken: '2e8e995e7511c2c6620336797b',
      userId: 19
    }
  }
}

export const echoOrderPayload = {
  body: JSON.stringify({
    params: {
      collections: [
        {
          id: 'C10000005-EDSC',
          access_method: {
            type: 'ESI',
            id: 'S10000001-EDSC',
            url: 'https://n5eil09e.ecs.edsc.org/egi/request'
          },
          granule_count: 139,
          granule_params: {
            echoCollectionId: 'C10000005-EDSC',
            boundingBox: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
          },
          collection_metadata: {
            tags: [{
              'edsc.extra.serverless.subset_service.echo_orders': {
                data: {
                  id: 'S1568899363-NSIDC_ECS',
                  type: 'ECHO ORDERS',
                  url: 'https://n5eil09e.ecs.edsc.org/egi/request'
                }
              }
            }]
          }
        }
      ],
      environment: 'prod'
    }
  }),
  requestContext: {
    authorizer: {
      jwtToken: '2e8e995e7511c2c6620336797b',
      userId: 19
    }
  }
}

export const badOrderPayload = {
  body: JSON.stringify({
    params: {
      collections: [
        {
          id: 'C10000005-EDSC',
          access_method: {
            type: 'download'
          },
          granule_count: 139,
          granule_params: {
            echoCollectionId: 'C10000005-EDSC',
            boundingBox: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
          },
          collection_metadata: {}
        }
      ]
    }
  }),
  requestContext: {
    authorizer: {
      jwtToken: '2e8e995e7511c2c6620336797b',
      userId: 19
    }
  }
}
