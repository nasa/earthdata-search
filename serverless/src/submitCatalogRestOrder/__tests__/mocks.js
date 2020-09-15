export const mockCatalogRestOrder = {
  Records: [{
    body: JSON.stringify({
      accessToken: 'access-token',
      id: 12,
      granule_params: {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
        page_num: 1,
        page_size: 2000
      },
      url: 'https://n5eil09e.ecs.edsc.org/egi/request'
    }),
    requestContext: {
      authorizer: {
        jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJhY2Nlc3NfdG9rZW4iOiIyZThlOTk1ZTc1MTFjMmM2NjIwMzM2Nzk3YiIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJleHBpcmVzX2luIjozNjAwLCJyZWZyZXNoX3Rva2VuIjoiNWExMDg2NWVlYjNmNDRhODBhYjk1IiwiZW5kcG9pbnQiOiIvYXBpL3VzZXJzL2Vkc2MiLCJleHBpcmVzX2F0IjoiMjAxOS0wNi0xNlQwMTowMTo0OS41NDVaIn0sImlhdCI6MTU2MDY0MzMwOX0.Xn0SuAMdEcU8amhZM0YunyRQN-e3cVzjoo7qJBr-EwI'
      }
    }
  }]
}
