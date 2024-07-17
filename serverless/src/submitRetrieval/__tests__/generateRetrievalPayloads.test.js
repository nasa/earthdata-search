import { generateRetrievalPayloads } from '../generateRetrievalPayloads'

beforeEach(() => {
  jest.clearAllMocks()
})

describe('generateRetrievalPayloads', () => {
  describe('when maxItemsPerOrder is set', () => {
    test('returns the correct payload for a single page', async () => {
      const orderPayloads = await generateRetrievalPayloads(
        {
          id: 19,
          access_method: {
            type: 'ECHO ORDERS',
            id: 'S10000001-EDSC',
            url: 'https://n5eil09e.ecs.edsc.org/egi/request'
          },
          collection_metadata: {},
          granule_count: 25,
          granule_params: {
            echo_collection_id: 'C10000005-EDSC',
            bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
          }
        },
        {
          type: 'ECHO ORDERS',
          maxItemsPerOrder: 1000
        }
      )

      expect(orderPayloads).toEqual([{
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
        page_num: 1,
        page_size: 1000
      }])
    })

    test('returns the correct payload for multiple pages', async () => {
      const orderPayloads = await generateRetrievalPayloads(
        {
          id: 19,
          access_method: {
            type: 'ECHO ORDERS',
            id: 'S10000001-EDSC',
            url: 'https://n5eil09e.ecs.edsc.org/egi/request'
          },
          collection_metadata: {},
          granule_count: 2500,
          granule_params: {
            echo_collection_id: 'C10000005-EDSC',
            bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
          }
        },
        {
          type: 'ECHO ORDERS',
          maxItemsPerOrder: 1000
        }
      )

      expect(orderPayloads).toEqual([{
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
        page_num: 1,
        page_size: 1000
      }, {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
        page_num: 2,
        page_size: 1000
      }, {
        echo_collection_id: 'C10000005-EDSC',
        bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
        page_num: 3,
        page_size: 1000
      }])
    })
  })

  describe('when the access method is a swodlr order', () => {
    test('the max granules per order is 1', async () => {
      const orderPayloads = await generateRetrievalPayloads(
        {
          id: 19,
          access_method: {
            type: 'SWODLR',
            id: 'S10000001-EDSC',
            url: 'https://swodlr.podaac.earthdatacloud.nasa.gov'
          },
          collection_metadata: {},
          granule_count: 4,
          granule_params: {
            concept_id: ['G10000000-EDSC', 'G10000001-EDSC', 'G10000002-EDSC', 'G10000003-EDSC'],
            echo_collection_id: 'C10000005-EDSC'
          }
        },
        {
          type: 'SWODLR'
        }
      )

      expect(orderPayloads).toEqual([
        {
          concept_id: ['G10000000-EDSC'],
          echo_collection_id: 'C10000005-EDSC',
          page_num: 1,
          page_size: 1
        },
        {
          concept_id: ['G10000001-EDSC'],
          echo_collection_id: 'C10000005-EDSC',
          page_num: 2,
          page_size: 1
        },
        {
          concept_id: ['G10000002-EDSC'],
          echo_collection_id: 'C10000005-EDSC',
          page_num: 3,
          page_size: 1
        },
        {
          concept_id: ['G10000003-EDSC'],
          echo_collection_id: 'C10000005-EDSC',
          page_num: 4,
          page_size: 1
        }
      ])
    })
  })

  test('returns the correct payload for a single page', async () => {
    const orderPayloads = await generateRetrievalPayloads(
      {
        id: 19,
        access_method: {
          type: 'ECHO ORDERS',
          id: 'S10000001-EDSC',
          url: 'https://n5eil09e.ecs.edsc.org/egi/request'
        },
        collection_metadata: {},
        granule_count: 25,
        granule_params: {
          echo_collection_id: 'C10000005-EDSC',
          bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
        }
      },
      {
        type: 'ESI',
        maxItemsPerOrder: null
      }
    )

    expect(orderPayloads).toEqual([{
      echo_collection_id: 'C10000005-EDSC',
      bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
      page_num: 1,
      page_size: 2000
    }])
  })

  test('returns the correct payload for multiple pages', async () => {
    const orderPayloads = await generateRetrievalPayloads(
      {
        id: 19,
        access_method: {
          type: 'ECHO ORDERS',
          id: 'S10000001-EDSC',
          url: 'https://n5eil09e.ecs.edsc.org/egi/request'
        },
        collection_metadata: {},
        granule_count: 2500,
        granule_params: {
          echo_collection_id: 'C10000005-EDSC',
          bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502'
        }
      },
      {
        type: 'ESI',
        maxItemsPerOrder: null
      }
    )

    expect(orderPayloads).toEqual([{
      echo_collection_id: 'C10000005-EDSC',
      bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
      page_num: 1,
      page_size: 2000
    }, {
      echo_collection_id: 'C10000005-EDSC',
      bounding_box: '23.607421875,5.381262277997806,27.7965087890625,14.973184553280502',
      page_num: 2,
      page_size: 2000
    }])
  })
})
