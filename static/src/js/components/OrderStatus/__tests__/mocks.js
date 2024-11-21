export const retrievalStatusProps = {
  authToken: 'testToken',
  earthdataEnvironment: 'prod',
  granuleDownload: {},
  onFetchRetrieval: jest.fn(),
  onFetchRetrievalCollection: jest.fn(),
  onFetchRetrievalCollectionGranuleLinks: jest.fn(),
  onFetchRetrievalCollectionGranuleBrowseLinks: jest.fn(),
  onFocusedCollectionChange: jest.fn(),
  onMetricsRelatedCollection: jest.fn(),
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
      byId: {
        1: {
          collection_id: 'TEST_COLLECTION_111',
          collection_metadata: {
            id: 'TEST_COLLECTION_111',
            dataset_id: 'Test Dataset ID',
            relatedCollections: {
              count: 3,
              items: [
                {
                  doi: '1.TEST.DOI',
                  id: 'TEST_COLLECTION_1_111',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 1'
                },
                {
                  doi: '2.TEST.DOI',
                  id: 'TEST_COLLECTION_2_111',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 2'
                },
                {
                  doi: '3.TEST.DOI',
                  id: 'TEST_COLLECTION_3_111',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 3'
                }
              ]
            }
          },
          access_method: {
            type: 'download'
          },
          isLoaded: true
        },
        2: {
          collection_id: 'TEST_COLLECTION_222',
          collection_metadata: {
            id: 'TEST_COLLECTION_222',
            dataset_id: 'Test Dataset ID',
            relatedCollections: {
              count: 2,
              items: [
                {
                  doi: '1.TEST.DOI',
                  id: 'TEST_COLLECTION_1_222',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 1'
                },
                {
                  doi: '2.TEST.DOI',
                  id: 'TEST_COLLECTION_2_222',
                  relationships: [
                    {
                      relationshipType: 'relatedUrl'
                    }
                  ],
                  title: 'Test Title 2'
                }
              ]
            }
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
  },
  location: {
    search: ''
  }
}

export const retrievalStatusPropsTwo = {
  authToken: 'testToken2',
  retrieval: {
    id: 7,
    collections: {
      byId: {
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
  },
  location: {
    search: ''
  }
}

export const retrievalStatusPropsEsi = {
  authToken: 'testToken2',
  retrieval: {
    id: 7,
    collections: {
      byId: {
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
  },
  location: {
    search: ''
  }
}

export const retrievalStatusPropsEchoOrder = {
  authToken: 'testToken2',
  retrieval: {
    id: 7,
    collections: {
      byId: {
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
  },
  location: {
    search: ''
  }
}

export const retrievalStatusPropsSwotOrder = {
  authToken: 'testToken3',
  retrieval: {
    id: 8,
    collections: {
      byId: {
        1: {
          collection_id: 'C2799438271-POCLOUD',
          collection_metadata: {
            id: 1,
            dataset_id: 'Test Dataset ID'
          },
          access_method: {
            urlƒ: 'https://swodlr.podaac.earthdatacloud.nasa.gov',
            type: 'SWODLR',
            swodlrData: {
              params: {
                rasterResolution: 5000,
                outputSamplingGridType: 'UTM',
                outputGranuleExtentFlag: false
              },
              custom_params: {
                'G3297306042-POCLOUD': {
                  utmZoneAdjust: 0,
                  mgrsBandAdjust: 1
                }
              }
            }
          },
          orders: [
            {
              id: 1,
              type: 'SWODLR',
              order_number: 'e7efe743-f253-43e3-b017-74faa8bdfcf1',
              order_information: {
                jobId: '318f172c-3faa-4ad4-ad5e-ac9f8ec8572f',
                reason: null,
                status: 'complete',
                granules: [
                  {
                    id: 'f27cff93-c22c-4c76-9347-b174065c14cc',
                    uri: 'https://archive.swot.podaac.earthdata.nasa.gov/podaac-swot-ops-swodlr-protected/L2_HR_Raster/e7efe743-f253-43e3-b017-74faa8bdfcf1/1732032596/SWOT_L2_HR_Raster_5000m_UTM07V_N_x_x_x_024_080_023F_20241114T224218_20241114T224239_DIC0_01.nc',
                    timestamp: '2024-11-19T16:10:02.949'
                  }
                ],
                createdAt: '2024-11-19T15:14:14.604168',
                productId: 'e7efe743-f253-43e3-b017-74faa8bdfcf1',
                updatedAt: '2024-11-19T15:14:14.583756'
              },
              state: 'complete',
              error: null
            }
          ]
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
    },
    location: {
      search: ''
    }
  }
}

export const retrievalStatusPropsHarmonyOrder = {
  authToken: 'testToken3',
  retrieval: {
    id: 8,
    collections: {
      byId: {
        1: {
          collection_id: 'HARMONY_TEST_COLLECTION',
          collection_metadata: {
            id: 1,
            dataset_id: 'Test Dataset ID'
          },
          access_method: {
            urlƒ: 'https://harmony.earthdata.nasa.gov',
            type: 'Harmony',
            defaultConcatenation: false,
            supportsConcatenation: false,
            enableSpatialSubsetting: true,
            enableTemporalSubsetting: true,
            enableConcatenateDownload: false,
            supportsShapefileSubsetting: true,
            supportsBoundingBoxSubsetting: true
          },
          orders: [
            {
              id: 1,
              type: 'Harmony',
              order_number: '9f6fc038-0966-4a27-8220-2a0c7eff6078',
              order_information: {
                createdAt: '2024-11-21T17:54:51.995Z',
                dataExpiration: '2024-12-21T17:54:51.995Z',
                jobID: '9f6fc038-0966-4a27-8220-2a0c7eff6078',
                message: 'The job has completed successfully',
                numInputGranules: 3,
                progress: 100,
                request: 'https://harmony.earthdata.nasa.gov/C1595422627-ASF/ogc-api-coverages/1.0.0/collections/all/coverage/rangeset?forceAsync=true&granuleId=G2736530662-ASF%2CG2736533197-ASF%2CG2736534372-ASF&skipPreview=true&label=eed-edsc-dev%2Cedsc-id%3D4140933204',
                status: 'successful',
                updatedAt: '2024-11-21T17:54:54.177Z',
                username: 'bporeh'
              },
              state: 'successful',
              error: null
            }
          ]
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
    },
    location: {
      search: ''
    }
  }
}
