import { getHandoffLinks } from '../getHandoffLinks'

describe('getHandoffLinks', () => {
  test('returns a UMM-T handoff object', () => {
    const collectionMetadata = {
      shortName: 'mockCollection',
      tools: {
        items: [{
          name: 'Giovanni',
          longName: 'Giovanni',
          potentialAction: {
            type: 'SearchAction',
            target: {
              type: 'EntryPoint',
              urlTemplate: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp{?dataKeyword,starttime,endtime,bbox}',
              httpMethod: ['GET']
            },
            queryInput: [
              {
                valueName: 'dataKeyword',
                valueRequired: true,
                valueType: 'shortName'
              },
              {
                valueName: 'starttime',
                valueRequired: true,
                valueType: 'https://schema.org/startDate'
              },
              {
                valueName: 'endtime',
                valueRequired: false,
                valueType: 'https://schema.org/endDate'
              },
              {
                valueName: 'bbox',
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

    const response = getHandoffLinks({
      collectionMetadata,
      collectionQuery
    })

    expect(response).toEqual([
      {
        title: 'Giovanni',
        href: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp?dataKeyword=mockCollection&starttime=2021-07-22T00%3A55%3A39.384Z&bbox=-77.60234%2C37.00428%2C-75.15486%2C40.06987'
      }
    ])
  })

  test('does not return a handoff object if all required fields are not present', () => {
    const collectionMetadata = {
      shortName: 'mockCollection',
      tools: {
        items: [{
          name: 'Giovanni',
          longName: 'Giovanni',
          potentialAction: {
            type: 'SearchAction',
            target: {
              type: 'EntryPoint',
              urlTemplate: 'https://giovanni.gsfc.nasa.gov/giovanni/#service=TmAvMp{?dataKeyword,starttime,endtime,bbox}',
              httpMethod: ['GET']
            },
            queryInput: [
              {
                valueName: 'dataKeyword',
                valueRequired: true,
                valueType: 'shortName'
              },
              {
                valueName: 'starttime',
                valueRequired: true,
                valueType: 'https://schema.org/startDate'
              },
              {
                valueName: 'endtime',
                valueRequired: false,
                valueType: 'https://schema.org/endDate'
              },
              {
                valueName: 'bbox',
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
      }
    }

    const response = getHandoffLinks({
      collectionMetadata,
      collectionQuery
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

    const response = getHandoffLinks({
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

    const response = getHandoffLinks({
      collectionMetadata,
      collectionQuery
    })

    expect(response).toEqual([])
  })
})
