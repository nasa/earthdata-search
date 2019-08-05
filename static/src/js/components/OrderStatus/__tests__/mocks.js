export const orderStatusProps = {
  authToken: 'testToken',
  onFetchOrder: jest.fn(),
  match: {
    search: {
      id: 7
    },
    params: {
      id: 7
    }
  },
  onChangePath: jest.fn(),
  order: {
    id: 7,
    collections: {
      download: [
        {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            dataset_id: 'Test Dataset ID'
          },
          access_method: {
            order: {
              order_status: 'in progress'
            }
          }
        }
      ],
      echoOrder: [],
      order: []
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

export const orderStatusPropsTwo = {
  authToken: 'testToken2',
  order: {
    id: 7,
    collections: {
      download: [
        {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            dataset_id: 'Test Dataset ID 2'
          },
          access_method: {
            order: {
              order_status: 'complete'
            }
          }
        }
      ],
      echoOrder: [],
      order: []
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

export const orderStatusPropsEsi = {
  authToken: 'testToken2',
  order: {
    id: 7,
    collections: {
      esi: [
        {
          collection_id: 'TEST_COLLECTION_123',
          collection_metadata: {
            dataset_id: 'Test Dataset ID 2'
          },
          access_method: {
            order: {
              order_status: 'in progress',
              order_id: [
                '5000000333461',
                '5000000333462'
              ],
              service_options: {
                total_orders: 2,
                total_number: 181,
                total_complete: 1,
                total_processed: 81,
                download_urls: [
                  'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html',
                  'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip'
                ],
                orders: [
                  {
                    download_urls: [
                      'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.html',
                      'https://n5eil02u.ecs.nsidc.org/esir/5000000333461.zip'
                    ],
                    order_id: '5000000333461',
                    order_status: 'complete',
                    total_number: 81,
                    total_processed: 81,
                    contact: {
                      name: 'NSIDC User Services',
                      email: 'nsidc@nsidc.org'
                    }
                  },
                  {
                    download_urls: [
                      'https://n5eil02u.ecs.nsidc.org/esir/5000000333462.html',
                      'https://n5eil02u.ecs.nsidc.org/esir/5000000333462.zip'
                    ],
                    order_id: '5000000333462',
                    order_status: 'in progress',
                    total_number: 100,
                    total_processed: 13,
                    contact: {
                      name: 'NSIDC User Services',
                      email: 'nsidc@nsidc.org'
                    }
                  }
                ]
              }
            }
          }
        }
      ],
      echoOrder: [],
      order: []
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
