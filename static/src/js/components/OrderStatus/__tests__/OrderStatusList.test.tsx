import React from 'react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

// @ts-expect-error The file does not have types
import { retrievalStatus } from './mocks'

import OrderStatusList from '../OrderStatusList'
import OrderStatusCollection from '../OrderStatusCollection'

vi.mock('../OrderStatusCollection', () => ({ default: vi.fn(() => <div />) }))

const setup = setupTest({
  Component: OrderStatusList,
  defaultProps: {
    retrievalCollections: Object.values(
      retrievalStatus.retrieval.retrievalCollections
    ),
    retrievalId: '1'
  }
})

describe('OrderStatus component', () => {
  test('renders a list of OrderStatusItem components', () => {
    setup()

    expect(OrderStatusCollection).toHaveBeenCalledTimes(2)
    expect(OrderStatusCollection).toHaveBeenNthCalledWith(
      1,
      {
        collection: {
          collectionId: 'TEST_COLLECTION_111',
          collectionMetadata: {
            datasetId: 'Test Dataset ID',
            id: 'TEST_COLLECTION_111',
            relatedCollections: {
              count: 3,
              items: [
                {
                  doi: '1.TEST.DOI',
                  id: 'TEST_COLLECTION_1_1',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 1_1'
                },
                {
                  doi: '2.TEST.DOI',
                  id: 'TEST_COLLECTION_2_1',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 2_1'
                },
                {
                  doi: '3.TEST.DOI',
                  id: 'TEST_COLLECTION_3_1',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 3_1'
                }
              ]
            }
          },
          links: [
            {
              links: [
                {
                  type: 'HOME PAGE',
                  url: 'http://linkurl.com/test'
                }
              ],
              title: 'Test Dataset ID'
            }
          ],
          obfuscatedId: '12345'
        },
        defaultOpen: false,
        retrievalId: '1'
      },
      {}
    )

    expect(OrderStatusCollection).toHaveBeenNthCalledWith(
      2,
      {
        collection: {
          collectionId: 'TEST_COLLECTION_222',
          collectionMetadata: {
            datasetId: 'Test Dataset ID',
            id: 'TEST_COLLECTION_222',
            relatedCollections: {
              count: 2,
              items: [
                {
                  doi: '1.TEST.DOI',
                  id: 'TEST_COLLECTION_1_2',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 1_2'
                },
                {
                  doi: '2.TEST.DOI',
                  id: 'TEST_COLLECTION_2_2',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 2_2'
                }
              ]
            }
          },
          links: null,
          obfuscatedId: '98765'
        },
        defaultOpen: false,
        retrievalId: '1'
      },
      {}
    )
  })
})
