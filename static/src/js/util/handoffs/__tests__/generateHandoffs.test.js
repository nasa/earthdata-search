import { generateHandoffs } from '../generateHandoffs'

describe('handoffs', () => {
  test('returns an empty array when the collection is not tagged with a handoff tag', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.serverless.something_unrelated': {}
      }
    }

    const response = generateHandoffs({
      collectionMetadata
    })

    expect(response).toEqual([])
  })

  test('returns a giovanni handoff object with the default root and collection shortname when no subsetting is provided', () => {
    const collectionMetadata = {
      short_name: 'earthdata_search',
      tags: {
        'edsc.extra.handoff.giovanni': {}
      }
    }

    const response = generateHandoffs({
      collectionMetadata
    })

    expect(response).toEqual([
      {
        title: 'Giovanni',
        href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp&dataKeyword=earthdata_search'
      }
    ])
  })

  test('returns a open altimetry handoff object', () => {
    const collectionMetadata = {
      short_name: 'ATL08',
      tags: {
        'edsc.extra.handoff.open_altimetry': {}
      }
    }

    const response = generateHandoffs({
      collectionMetadata
    })

    expect(response).toEqual([
      {
        title: 'Open Altimetry',
        href: 'https://openaltimetry.org/data/icesat2/?product=ATL08&mapType=geographic'
      }
    ])
  })
})

describe('UMM-T handoffs', () => {
  test('returns a UMM-T handoff object', () => {
    const collectionMetadata = {
      tags: {
        'edsc.extra.serverless.gibs': {
          data: [
            {
              format: 'png',
              antarctic: false,
              geographic: true,
              group: 'overlays',
              geographic_resolution: '1km',
              arctic_resolution: null,
              source: 'Multi-mission / GHRSST',
              arctic: false,
              title: 'Sea Surface Temperature (L4, MUR)',
              updated_at: '2021-08-30T12:00:15.498Z',
              antarctic_resolution: null,
              product: 'GHRSST_L4_MUR_Sea_Surface_Temperature',
              match: {
                time_start: '>=2002-06-01T00:00:00Z'
              },
              resolution: '1km'
            },
            {
              format: 'png',
              antarctic: false,
              geographic: true,
              group: 'overlays',
              geographic_resolution: '1km',
              arctic_resolution: null,
              source: 'Multi-mission / GHRSST',
              arctic: false,
              title: 'Sea Ice Concentration (L4, MUR)',
              updated_at: '2021-08-30T12:00:15.498Z',
              antarctic_resolution: null,
              product: 'GHRSST_L4_MUR_Sea_Ice_Concentration',
              match: {
                time_start: '>=2002-06-01T00:00:00Z'
              },
              resolution: '1km'
            },
            {
              format: 'png',
              antarctic: false,
              geographic: true,
              group: 'overlays',
              geographic_resolution: '1km',
              arctic_resolution: null,
              source: 'Multi-mission / GHRSST',
              arctic: false,
              title: 'Sea Surface Temperature Anomalies (L4, MUR)',
              updated_at: '2021-08-30T12:00:15.498Z',
              antarctic_resolution: null,
              product: 'GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies',
              match: {
                time_start: '>=2019-07-23T00:00:00Z'
              },
              resolution: '1km'
            }
          ]
        }
      },
      tools: {
        items: [{
          longName: 'State of the Ocean',
          name: 'SOTO',
          potentialAction: {
            target: {
              urlTemplate: 'https://podaac-tools.jpl.nasa.gov/soto/#b=BlueMarble_ShadedRelief_Bathymetry&l={+layers}&ve={+bbox}&d={+date}'
            },
            queryInput: [
              {
                valueName: 'layers',
                description: 'A comma-separated list of visualization layer ids, as defined by GIBS. These layers will be portrayed on the web application',
                valueRequired: true,
                valueType: 'https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers#GIBSAPIforDevelopers-LayerNaming'
              },
              {
                valueName: 'date',
                description: 'A UTC ISO DateTime. The layers portrayed will correspond to this date.',
                valueRequired: false,
                valueType: 'https://schema.org/startDate'
              },
              {
                valueName: 'bbox',
                description: 'A spatial bounding box that will set the spatial extent of the portrayed layers. The first point is the lower corner, the second point is the upper corner. A box is expressed as two points separated by a space character.',
                valueRequired: false,
                valueType: 'https://schema.org/box'
              }
            ]
          }
        }]
      }
    }

    const collectionQuery = {
      spatial: {
        boundingBox: ['-77.60234,37.00428,-75.15486,40.06987']
      },
      temporal: {
        startDate: '2021-07-22T00:55:39.384Z'
      }
    }

    const handoffs = {
      sotoLayers: ['GHRSST_L4_MUR_Sea_Surface_Temperature', 'GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies']
    }

    const response = generateHandoffs({
      collectionMetadata,
      collectionQuery,
      handoffs
    })

    expect(response).toEqual([
      {
        title: 'State of the Ocean',
        href: 'https://podaac-tools.jpl.nasa.gov/soto/#b=BlueMarble_ShadedRelief_Bathymetry&l=GHRSST_L4_MUR_Sea_Surface_Temperature(la=true),GHRSST_L4_MUR_Sea_Surface_Temperature_Anomalies(la=true)&ve=-77.60234,37.00428,-75.15486,40.06987&d=2021-07-22T00:55:39.384Z'
      }
    ])
  })

  test('does not return a handoff object if all required fields are not present', () => {
    const collectionMetadata = {
      tags: {},
      tools: {
        items: [{
          name: 'SOTO',
          potentialAction: {
            target: {
              urlTemplate: 'https://podaac-tools.jpl.nasa.gov/soto/#b=BlueMarble_ShadedRelief_Bathymetry&l={layers}&ve={bbox}&d={date}'
            },
            queryInput: [
              {
                valueName: 'layers',
                description: 'A comma-separated list of visualization layer ids, as defined by GIBS. These layers will be portrayed on the web application',
                valueRequired: true,
                valueType: 'https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+API+for+Developers#GIBSAPIforDevelopers-LayerNaming'
              },
              {
                valueName: 'date',
                description: 'A UTC ISO DateTime. The layers portrayed will correspond to this date.',
                valueRequired: false,
                valueType: 'https://schema.org/startDate'
              },
              {
                valueName: 'bbox',
                description: 'A spatial bounding box that will set the spatial extent of the portrayed layers. The first point is the lower corner, the second point is the upper corner. A box is expressed as two points separated by a space character.',
                valueRequired: false,
                valueType: 'https://schema.org/box'
              }
            ]
          }
        }]
      }
    }

    const collectionQuery = {
      spatial: {
        boundingBox: ['-77.60234,37.00428,-75.15486,40.06987']
      },
      temporal: {
        startDate: '2021-07-22T00:55:39.384Z'
      }
    }

    const handoffs = {
      sotoLayers: []
    }

    const response = generateHandoffs({
      collectionMetadata,
      collectionQuery,
      handoffs
    })

    expect(response).toEqual([])
  })

  test('does not return a handoff object if no tools exist', () => {
    const collectionMetadata = {
      tags: {},
      tools: {
        items: null
      }
    }

    const collectionQuery = {
      spatial: {
        boundingBox: ['-77.60234,37.00428,-75.15486,40.06987']
      },
      temporal: {
        startDate: '2021-07-22T00:55:39.384Z'
      }
    }

    const response = generateHandoffs({
      collectionMetadata,
      collectionQuery
    })

    expect(response).toEqual([])
  })

  test('does not return a handoff object if no potentialActions exist', () => {
    const collectionMetadata = {
      tags: {},
      tools: {
        items: [{
          name: 'Mock tool'
        }]
      }
    }

    const collectionQuery = {
      spatial: {
        boundingBox: ['-77.60234,37.00428,-75.15486,40.06987']
      },
      temporal: {
        startDate: '2021-07-22T00:55:39.384Z'
      }
    }

    const response = generateHandoffs({
      collectionMetadata,
      collectionQuery
    })

    expect(response).toEqual([])
  })
})
