export const mockHarmonyOrder = {
  Records: [{
    body: JSON.stringify({
      accessToken: 'access-token',
      id: 12
    }),
    requestContext: {
      authorizer: {
        jwtToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbiI6eyJhY2Nlc3NfdG9rZW4iOiIyZThlOTk1ZTc1MTFjMmM2NjIwMzM2Nzk3YiIsInRva2VuX3R5cGUiOiJCZWFyZXIiLCJleHBpcmVzX2luIjozNjAwLCJyZWZyZXNoX3Rva2VuIjoiNWExMDg2NWVlYjNmNDRhODBhYjk1IiwiZW5kcG9pbnQiOiIvYXBpL3VzZXJzL2Vkc2MiLCJleHBpcmVzX2F0IjoiMjAxOS0wNi0xNlQwMTowMTo0OS41NDVaIn0sImlhdCI6MTU2MDY0MzMwOX0.Xn0SuAMdEcU8amhZM0YunyRQN-e3cVzjoo7qJBr-EwI'
      }
    }
  }]
}

export const mockCwShapefile = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      edscId: '0',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -126.51219507213682,
              46.750824517888304
            ],
            [
              -111.14634139928967,
              44.70204402817535
            ],
            [
              -102.95121944043785,
              29.3361903553282
            ],
            [
              -101.41463407315314,
              13.458141560052809
            ],
            [
              -118.82926823571324,
              11.409361070339855
            ],
            [
              -130.0975609291345,
              21.653263518904623
            ],
            [
              -131.12195117399096,
              37.53131231418001
            ],
            [
              -126.51219507213682,
              46.750824517888304
            ]
          ]
        ]
      },
      properties: {
        id: 1
      }
    }
  ]
}

export const mockCwShapefileConverted = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      edscId: '0',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -126.51219507213682,
              46.750824517888304
            ],
            [
              -131.12195117399096,
              37.53131231418001
            ],
            [
              -130.0975609291345,
              21.653263518904623
            ],
            [
              -118.82926823571324,
              11.409361070339855
            ],
            [
              -101.41463407315314,
              13.458141560052809
            ],
            [
              -102.95121944043785,
              29.3361903553282
            ],
            [
              -111.14634139928967,
              44.70204402817535
            ],
            [
              -126.51219507213682,
              46.750824517888304
            ]
          ]
        ]
      },
      properties: {
        id: 1
      }
    }
  ]
}

export const mockCcwShapefile = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      edscId: '0',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [
              -121.39024384785444,
              49.823995252457735
            ],
            [
              -133.17073166370392,
              44.70204402817535
            ],
            [
              -127.5365853169933,
              23.18984888618934
            ],
            [
              -110.12195115443319,
              11.409361070339855
            ],
            [
              -88.60975601244718,
              14.482531804909286
            ],
            [
              -83.99999991059303,
              28.311800110471722
            ],
            [
              -88.09756089001894,
              49.311800130029496
            ],
            [
              -104.48780480772257,
              58.53131233373779
            ],
            [
              -121.39024384785444,
              49.823995252457735
            ]
          ]
        ]
      },
      properties: {
        id: 1
      }
    }
  ]
}
