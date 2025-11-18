export const retrievalStatus = {
  retrieval: {
    id: '7',
    obfuscatedId: '7',
    retrievalCollections: [{
      obfuscatedId: '12345',
      collectionId: 'TEST_COLLECTION_111',
      collectionMetadata: {
        id: 'TEST_COLLECTION_111',
        datasetId: 'Test Dataset ID',
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
          title: 'Test Dataset ID',
          links: [
            {
              url: 'http://linkurl.com/test',
              type: 'HOME PAGE'
            }
          ]
        }
      ]
    }, {
      obfuscatedId: '98765',
      collectionId: 'TEST_COLLECTION_222',
      collectionMetadata: {
        id: 'TEST_COLLECTION_222',
        datasetId: 'Test Dataset ID',
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
      links: null
    }],
    jsondata: {
      source: '?test=source_link'
    }
  }
}

export const retrievalStatusPropsTwo = {
  retrieval: {
    id: '7',
    obfuscatedId: '7',
    retrievalCollections: [{
      obfuscatedId: '12345',
      collectionId: 'TEST_COLLECTION_111',
      collectionMetadata: {
        datasetId: 'Test Dataset ID 2'
      },
      links: [
        {
          title: 'Test Dataset ID',
          links: [
            {
              url: 'http://linkurl.com/test',
              type: 'HOME PAGE'
            }
          ]
        }
      ]
    }],
    jsondata: {
      source: '?test=source_link'
    }
  }
}

export const retrievalStatusPropsEsi = {
  retrieval: {
    id: '7',
    obfuscatedId: '7',
    retrievalCollections: [{
      collectionId: 'TEST_COLLECTION_123',
      collectionMetadata: {
        datasetId: 'Test Dataset ID 2'
      },
      accessMethod: {
        type: 'ESI'
      },
      retrievalOrders: [
        {
          type: 'ESI',
          orderNumber: '5000000333461',
          state: 'complete',
          orderInformation: {
            downloadUrls: {
              downloadUrl: [
                'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html',
                'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip'
              ]
            },
            requestStatus: {
              status: 'complete',
              totalNumber: 81,
              numberProcessed: 81
            },
            contactInformation: {
              contactName: 'NSIDC User Services',
              contactEmail: 'nsidc@nsidc.org'
            }
          }
        },
        {
          type: 'ESI',
          orderNumber: '5000000333462',
          state: 'processing',
          orderInformation: {
            downloadUrls: {
              downloadUrl: [
                'https://n5eil02u.ecs.nsidc.org/esir/5000000333462.html',
                'https://n5eil02u.ecs.nsidc.org/esir/5000000333462.zip'
              ]
            },
            requestStatus: {
              status: 'processing',
              totalNumber: 100,
              numberProcessed: 13
            },
            contactInformation: {
              contactName: 'NSIDC User Services',
              contactEmail: 'nsidc@nsidc.org'
            }
          }
        }
      ],
      links: [
        {
          datasetId: 'Test Dataset ID',
          links: [
            {
              href: 'http://linkurl.com/test'
            }
          ]
        }
      ]
    }],
    jsondata: {
      source: '?test=source_link'
    }
  }
}

export const retrievalStatusPropsEchoOrder = {
  retrieval: {
    id: '7',
    obfuscatedId: '7',
    retrievalCollections: [{
      collectionId: 'TEST_COLLECTION_111',
      collectionMetadata: {
        id: 'C10000001-EDSC',
        datasetId: 'Test Dataset ID'
      },
      retrievalOrders: [
        {
          type: 'ECHO ORDERS',
          orderNumber: '92567A0B-D146-B396-583B-D8C3487CE087',
          state: 'PROCESSING',
          orderInformation: {
            client_identity: 'kzAY1v0kVjQ7QVpwBw-kLQ',
            created_at: '2019-08-14T12:26:37Z',
            id: '92567A0B-D146-B396-583B-D8C3487CE087',
            notification_level: 'INFO',
            order_price: 0,
            owner_id: 'CF8F45-8138-232E-7C36-5D023FEF8',
            provider_orders: [
              {
                reference: {
                  id: 'EDF_DEV06',
                  location: 'https://cmr.sit.earthdata.nasa.gov:/legacy-services/rest/orders/92567A0B-D146-B396-583B-D8C3487CE087/provider_orders/EDF_DEV06',
                  name: 'EDF_DEV06'
                }
              }
            ],
            state: 'PROCESSING',
            submitted_at: '2019-08-14T12:26:42Z',
            updated_at: '2019-08-14T12:27:13Z',
            user_domain: 'OTHER',
            user_region: 'USA'
          }
        }
      ],
      links: [
        {
          title: 'Test Dataset ID',
          links: [
            {
              url: 'http://linkurl.com/test',
              type: 'HOME PAGE'
            }
          ]
        }
      ]
    }],
    jsondata: {
      source: '?test=source_link'
    }
  }
}
