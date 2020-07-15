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
      jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJhY2Nlc3NfdG9rZW4iOiIyZThlOTk1ZTc1MTFjMmM2NjIwMzM2Nzk3YiIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJleHBpcmVzX2luIjozNjAwLCJyZWZyZXNoX3Rva2VuIjoiNWExMDg2NWVlYjNmNDRhODBhYjk1IiwiZW5kcG9pbnQiOiIvYXBpL3VzZXJzL2Vkc2MiLCJleHBpcmVzX2F0IjoiMjAxOS0wNi0xNlQwMTowMTo0OS41NDVaIn0sImlhdCI6MTU2MDY0MzMwOX0.Xn0SuAMdEcU8amhZM0YunyRQN-e3cVzjoo7qJBr-EwI'
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
      jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJhY2Nlc3NfdG9rZW4iOiIyZThlOTk1ZTc1MTFjMmM2NjIwMzM2Nzk3YiIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJleHBpcmVzX2luIjozNjAwLCJyZWZyZXNoX3Rva2VuIjoiNWExMDg2NWVlYjNmNDRhODBhYjk1IiwiZW5kcG9pbnQiOiIvYXBpL3VzZXJzL2Vkc2MiLCJleHBpcmVzX2F0IjoiMjAxOS0wNi0xNlQwMTowMTo0OS41NDVaIn0sImlhdCI6MTU2MDY0MzMwOX0.Xn0SuAMdEcU8amhZM0YunyRQN-e3cVzjoo7qJBr-EwI'
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
      jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJhY2Nlc3NfdG9rZW4iOiIyZThlOTk1ZTc1MTFjMmM2NjIwMzM2Nzk3YiIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJleHBpcmVzX2luIjozNjAwLCJyZWZyZXNoX3Rva2VuIjoiNWExMDg2NWVlYjNmNDRhODBhYjk1IiwiZW5kcG9pbnQiOiIvYXBpL3VzZXJzL2Vkc2MiLCJleHBpcmVzX2F0IjoiMjAxOS0wNi0xNlQwMTowMTo0OS41NDVaIn0sImlhdCI6MTU2MDY0MzMwOX0.Xn0SuAMdEcU8amhZM0YunyRQN-e3cVzjoo7qJBr-EwI'
    }
  }
}
