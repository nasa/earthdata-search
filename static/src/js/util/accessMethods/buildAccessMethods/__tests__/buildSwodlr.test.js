import { buildSwodlr } from '../buildSwodlr'

describe('buildSwodlr', () => {
  test('returns an swodlr access method', () => {
    const collectionMetadata = {
      services: {
        items: [
          {
            conceptId: 'S100000-EDSC',
            longName: 'Mock PODAAC SWOT On-Demand Level 2 Raster Generation (SWODLR)',
            name: 'Mock PODAAC_SWODLR',
            type: 'SWODLR',
            url: {
              description: 'Service top-level URL',
              urlValue: 'https://swodlr.podaac.earthdatacloud.nasa.gov'
            },
            serviceOptions: {
              supportedOutputProjections: [
                {
                  projectionName: 'Universal Transverse Mercator'
                },
                {
                  projectionName: 'WGS84 - World Geodetic System 1984'
                }
              ]
            },
            supportedOutputProjections: [
              {
                projectionName: 'Universal Transverse Mercator'
              },
              {
                projectionName: 'WGS84 - World Geodetic System 1984'
              }
            ],
            supportedReformattings: null,
            supportedInputProjections: null,
            orderOptions: {
              items: []
            },
            variables: {
              items: []
            }
          }
        ]
      }
    }

    const { services } = collectionMetadata
    const serviceItem = services.items[0]

    const disableSwodlr = false

    const methods = buildSwodlr(serviceItem, disableSwodlr)

    expect(methods).toEqual({
      swodlr: {
        id: 'S100000-EDSC',
        isValid: true,
        longName: 'Mock PODAAC SWOT On-Demand Level 2 Raster Generation (SWODLR)',
        name: 'Mock PODAAC_SWODLR',
        supportsSwodlr: true,
        type: 'SWODLR',
        url: 'https://swodlr.podaac.earthdatacloud.nasa.gov'
      }
    })
  })

  describe('when swodlr is disabled', () => {
    test('no swodlr access method is returned', () => {
      const collectionMetadata = {
        services: {
          items: [
            {
              conceptId: 'S100000-EDSC',
              longName: 'Mock PODAAC SWOT On-Demand Level 2 Raster Generation (SWODLR)',
              name: 'Mock PODAAC_SWODLR',
              type: 'SWODLR',
              url: {
                description: 'Service top-level URL',
                urlValue: 'https://swodlr.podaac.earthdatacloud.nasa.gov'
              },
              serviceOptions: {
                supportedOutputProjections: [
                  {
                    projectionName: 'Universal Transverse Mercator'
                  },
                  {
                    projectionName: 'WGS84 - World Geodetic System 1984'
                  }
                ]
              },
              supportedOutputProjections: [
                {
                  projectionName: 'Universal Transverse Mercator'
                },
                {
                  projectionName: 'WGS84 - World Geodetic System 1984'
                }
              ],
              supportedReformattings: null,
              supportedInputProjections: null,
              orderOptions: {
                items: []
              },
              variables: {
                items: []
              }
            }
          ]
        }
      }

      const { services } = collectionMetadata
      const serviceItem = services.items[0]

      const disableSwodlr = 'true'

      const methods = buildSwodlr(serviceItem, disableSwodlr)

      expect(methods).toEqual({})
    })
  })
})
