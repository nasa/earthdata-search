import React from 'react'
import { screen, waitFor } from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../vitestConfigs/setupTest'

import {
  useGetRetrievalGranuleLinks,
  UseGetRetrievalGranuleLinksProps
} from '../useGetRetrievalGranuleLinks'
import GET_RETRIEVAL_GRANULE_LINKS from '../../operations/queries/getRetrievalGranuleLinks'

// @ts-expect-error This file does not have types
import * as getApplicationConfig from '../../../../../sharedUtils/config'

const TestComponent = ({
  collectionMetadata,
  granuleCount
}: UseGetRetrievalGranuleLinksProps) => {
  const {
    granuleLinks,
    loading,
    percentDone
  } = useGetRetrievalGranuleLinks({
    collectionMetadata,
    granuleCount,
    linkTypes: ['data'],
    obfuscatedId: '123456'
  })

  return (
    <div>
      <span>
        Loading:
        {' '}
        {loading.toString()}
      </span>

      <span>
        Percent Done:
        {' '}
        {percentDone}
      </span>

      <span>
        Granule Links:
        {' '}
        {JSON.stringify(granuleLinks)}
      </span>
    </div>
  )
}

const setup = setupTest({
  Component: TestComponent,
  defaultProps: {
    collectionMetadata: {
      isOpenSearch: false
    },
    granuleCount: 5
  },
  withApolloClient: true,
  withRouter: true
})

beforeEach(() => {
  vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    granuleLinksPageSize: '5',
    openSearchGranuleLinksPageSize: '5'
  }))
})

describe('useGetRetrievalGranuleLinks', () => {
  test('should return loading and retrieval data', async () => {
    setup({
      overrideApolloClientMocks: [{
        request: {
          query: GET_RETRIEVAL_GRANULE_LINKS,
          variables: {
            cursor: null,
            obfuscatedRetrievalCollectionId: '123456',
            linkTypes: ['data'],
            flattenLinks: false
          }
        },
        result: {
          data: {
            retrieveGranuleLinks: {
              cursor: 'new-cursor',
              done: null,
              links: {
                browse: [],
                download: [
                  'http://example.com/data1',
                  'http://example.com/data2',
                  'http://example.com/data3',
                  'http://example.com/data4',
                  'http://example.com/data5'
                ],
                s3: []
              }
            }
          }
        }
      }, {
        request: {
          query: GET_RETRIEVAL_GRANULE_LINKS,
          variables: {
            cursor: 'new-cursor',
            obfuscatedRetrievalCollectionId: '123456',
            linkTypes: ['data'],
            flattenLinks: false
          }
        },
        result: {
          data: {
            retrieveGranuleLinks: {
              cursor: 'new-cursor',
              done: null,
              links: {
                browse: [],
                download: [],
                s3: []
              }
            }
          }
        }
      }]
    })

    // Loading state
    expect(screen.getByText('Loading: true')).toBeInTheDocument()
    expect(screen.getByText('Percent Done: 0')).toBeInTheDocument()
    expect(screen.getByText('Granule Links: {"browse":[],"data":[],"s3":[]}')).toBeInTheDocument()

    // Wait till the loading is finished
    expect(await screen.findByText('Loading: false')).toBeInTheDocument()
    expect(screen.getByText('Percent Done: 100')).toBeInTheDocument()
    expect(screen.getByText('Granule Links: {"browse":[],"data":["http://example.com/data1","http://example.com/data2","http://example.com/data3","http://example.com/data4","http://example.com/data5"],"s3":[]}')).toBeInTheDocument()
  })

  describe('when the collection is OpenSearch', () => {
    test('should return loading and retrieval data', async () => {
      setup({
        overrideProps: {
          collectionMetadata: {
            isOpenSearch: true
          }
        },
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_GRANULE_LINKS,
            variables: {
              cursor: null,
              obfuscatedRetrievalCollectionId: '123456',
              linkTypes: ['data'],
              flattenLinks: false
            }
          },
          result: {
            data: {
              retrieveGranuleLinks: {
                cursor: 'new-cursor',
                done: null,
                links: {
                  browse: [],
                  download: [
                    'http://example.com/data1',
                    'http://example.com/data2',
                    'http://example.com/data3',
                    'http://example.com/data4',
                    'http://example.com/data5'
                  ],
                  s3: []
                }
              }
            }
          }
        }, {
          request: {
            query: GET_RETRIEVAL_GRANULE_LINKS,
            variables: {
              cursor: 'new-cursor',
              obfuscatedRetrievalCollectionId: '123456',
              linkTypes: ['data'],
              flattenLinks: false
            }
          },
          result: {
            data: {
              retrieveGranuleLinks: {
                cursor: 'new-cursor',
                done: null,
                links: {
                  browse: [],
                  download: [],
                  s3: []
                }
              }
            }
          }
        }]
      })

      // Loading state
      expect(screen.getByText('Loading: true')).toBeInTheDocument()
      expect(screen.getByText('Percent Done: 0')).toBeInTheDocument()
      expect(screen.getByText('Granule Links: {"browse":[],"data":[],"s3":[]}')).toBeInTheDocument()

      // Wait till the loading is finished
      expect(await screen.findByText('Loading: false')).toBeInTheDocument()
      expect(screen.getByText('Percent Done: 100')).toBeInTheDocument()
      expect(screen.getByText('Granule Links: {"browse":[],"data":["http://example.com/data1","http://example.com/data2","http://example.com/data3","http://example.com/data4","http://example.com/data5"],"s3":[]}')).toBeInTheDocument()
    })
  })

  describe('when there are multiple pages of granules to fetch', () => {
    test('should return loading and retrieval data', async () => {
      setup({
        overrideProps: {
          granuleCount: 10
        },
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_GRANULE_LINKS,
            variables: {
              cursor: null,
              obfuscatedRetrievalCollectionId: '123456',
              linkTypes: ['data'],
              flattenLinks: false
            }
          },
          result: {
            data: {
              retrieveGranuleLinks: {
                cursor: 'new-cursor',
                done: null,
                links: {
                  browse: [],
                  download: [
                    'http://example.com/data1',
                    'http://example.com/data2',
                    'http://example.com/data3',
                    'http://example.com/data4',
                    'http://example.com/data5'
                  ],
                  s3: []
                }
              }
            }
          }
        }, {
          request: {
            query: GET_RETRIEVAL_GRANULE_LINKS,
            variables: {
              cursor: 'new-cursor',
              obfuscatedRetrievalCollectionId: '123456',
              linkTypes: ['data'],
              flattenLinks: false
            }
          },
          result: {
            data: {
              retrieveGranuleLinks: {
                cursor: 'new-cursor',
                done: null,
                links: {
                  browse: [],
                  download: [
                    'http://example.com/data6',
                    'http://example.com/data7',
                    'http://example.com/data8',
                    'http://example.com/data9',
                    'http://example.com/data10'
                  ],
                  s3: []
                }
              }
            }
          }
        }, {
          request: {
            query: GET_RETRIEVAL_GRANULE_LINKS,
            variables: {
              cursor: 'new-cursor',
              obfuscatedRetrievalCollectionId: '123456',
              linkTypes: ['data'],
              flattenLinks: false
            }
          },
          result: {
            data: {
              retrieveGranuleLinks: {
                cursor: 'new-cursor',
                done: null,
                links: {
                  browse: [],
                  download: [],
                  s3: []
                }
              }
            }
          }
        }]
      })

      // Loading state
      expect(screen.getByText('Loading: true')).toBeInTheDocument()
      expect(screen.getByText('Percent Done: 0')).toBeInTheDocument()
      expect(screen.getByText('Granule Links: {"browse":[],"data":[],"s3":[]}')).toBeInTheDocument()

      // Wait till the loading is finished
      expect(await screen.findByText('Loading: false')).toBeInTheDocument()
      expect(screen.getByText('Percent Done: 100')).toBeInTheDocument()
      expect(await screen.findByText('Granule Links: {"browse":[],"data":["http://example.com/data1","http://example.com/data2","http://example.com/data3","http://example.com/data4","http://example.com/data5","http://example.com/data6","http://example.com/data7","http://example.com/data8","http://example.com/data9","http://example.com/data10"],"s3":[]}')).toBeInTheDocument()
    })
  })

  describe('when there is an error', () => {
    test('calls handleError', async () => {
      const { zustandState } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_RETRIEVAL_GRANULE_LINKS,
            variables: {
              cursor: null,
              obfuscatedRetrievalCollectionId: '123456',
              linkTypes: ['data'],
              flattenLinks: false
            }
          },
          error: new ApolloError({ errorMessage: 'An error occurred' })
        }],
        overrideZustandState: {
          errors: {
            handleError: vi.fn()
          }
        }
      })

      // Wait for the error to be handled
      await waitFor(() => {
        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
      })

      expect(zustandState.errors.handleError).toHaveBeenCalledWith({
        action: 'getRetrievalGranuleLinks',
        error: new ApolloError({ errorMessage: 'An error occurred' }),
        resource: 'granule links'
      })
    })
  })
})
