export const retrievalStatusProps = {
  authToken: 'testToken',
  earthdataEnvironment: 'prod',
  granuleDownload: {},
  onFetchRetrieval: jest.fn(),
  onFetchRetrievalCollection: jest.fn(),
  onFetchRetrievalCollectionGranuleLinks: jest.fn(),
  onToggleAboutCSDAModal: jest.fn(),
  match: {
    search: {
      id: 7
    },
    params: {
      id: '7'
    }
  },
  onChangePath: jest.fn(),
  portal: {
    portalId: 'edsc'
  },
  retrieval: {
    id: 7,
    isLoading: false,
    isLoaded: true,
    collections: {
      download: {
        1: {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            id: 'TEST_COLLECTION_111',
            dataset_id: 'Test Dataset ID'
          },
          access_method: {
            type: 'download'
          },
          isLoaded: true
        }
      }
    },
    jsondata: {
      source: '?test=source_link'
    },
    links: [
      {
        dataset_id: 'Test Dataset ID',
        links: [
          {
            href: 'http://linkurl.com/test'
          }
        ]
      }
    ]
  }
}

export const retrievalStatusPropsTwo = {
  authToken: 'testToken2',
  retrieval: {
    id: 7,
    collections: {
      download: {
        1: {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            dataset_id: 'Test Dataset ID 2'
          },
          access_method: {}
        }
      }
    },
    jsondata: {
      source: '?test=source_link'
    },
    links: [
      {
        dataset_id: 'Test Dataset ID',
        links: [
          {
            href: 'http://linkurl.com/test'
          }
        ]
      }
    ]
  }
}

export const retrievalStatusPropsEsi = {
  authToken: 'testToken2',
  retrieval: {
    id: 7,
    collections: {
      esi: {
        1: {
          collection_id: 'TEST_COLLECTION_123',
          collection_metadata: {
            dataset_id: 'Test Dataset ID 2'
          },
          access_method: {
            type: 'ESI'
          },
          orders: [
            {
              type: 'ESI',
              order_number: '5000000333461',
              state: 'complete',
              order_information: {
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
              order_number: '5000000333462',
              state: 'processing',
              order_information: {
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
          ]
        }
      }
    },
    jsondata: {
      source: '?test=source_link'
    },
    links: [
      {
        dataset_id: 'Test Dataset ID',
        links: [
          {
            href: 'http://linkurl.com/test'
          }
        ]
      }
    ]
  }
}

export const retrievalStatusPropsEchoOrder = {
  authToken: 'testToken2',
  retrieval: {
    id: 7,
    collections: {
      echo_orders: {
        1: {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            id: 'C10000001-EDSC',
            dataset_id: 'Test Dataset ID'
          },
          access_method: {
            type: 'ECHO ORDERS'
          },
          orders: [
            {
              type: 'ECHO ORDERS',
              order_number: '92567A0B-D146-B396-583B-D8C3487CE087',
              state: 'PROCESSING',
              order_information: {
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
          ]
        }
      }
    },
    jsondata: {
      source: '?test=source_link'
    },
    links: [
      {
        dataset_id: 'Test Dataset ID',
        links: [
          {
            href: 'http://linkurl.com/test'
          }
        ]
      }
    ]
  }
}
