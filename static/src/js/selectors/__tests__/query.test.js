import { getCollectionSubscriptionQueryString, getFocusedCollectionGranuleQuery, getGranuleSubscriptionQueryString } from '../query'

describe('getFocusedCollectionGranuleQuery selector', () => {
  test('returns the granule query', () => {
    const state = {
      focusedCollection: 'collectionId',
      query: {
        collection: {
          byId: {
            collectionId: {
              granules: {
                mock: 'data'
              }
            }
          }
        }
      }
    }

    expect(getFocusedCollectionGranuleQuery(state)).toEqual({ mock: 'data' })
  })

  test('returns an empty object when there is no focusedCollection', () => {
    const state = {
      focusedCollection: '',
      query: {}
    }

    expect(getFocusedCollectionGranuleQuery(state)).toEqual({})
  })
})

describe('getGranuleSubscriptionQueryString selector', () => {
  test('returns the granule query string', () => {
    const state = {
      focusedCollection: 'collectionId',
      metadata: {
        collections: {
          collectionId: {
            id: 'collectionId'
          }
        }
      },
      query: {
        collection: {
          byId: {
            collectionId: {
              granules: {
                browseOnly: true,
                pageNum: 2,
                sortKey: '-start_date'
              }
            }
          },
          spatial: {
            point: '0,0'
          }
        }
      },
      subscriptions: {
        disabledFields: {
          granule: {}
        }
      }
    }

    expect(getGranuleSubscriptionQueryString(state)).toEqual('browse_only=true&point=0,0')
  })

  test('returns the granule query string with disabledFields removed', () => {
    const state = {
      focusedCollection: 'collectionId',
      metadata: {
        collections: {
          collectionId: {
            id: 'collectionId'
          }
        }
      },
      query: {
        collection: {
          byId: {
            collectionId: {
              granules: {
                browseOnly: true,
                pageNum: 2,
                sortKey: '-start_date'
              }
            }
          },
          spatial: {
            point: '0,0'
          }
        }
      },
      subscriptions: {
        disabledFields: {
          granule: {
            browseOnly: true
          }
        }
      }
    }

    expect(getGranuleSubscriptionQueryString(state)).toEqual('point=0,0')
  })
})

describe('getCollectionSubscriptionQueryString selector', () => {
  test('returns the collection query string', () => {
    const state = {
      facetsParams: {
        feature: {
          availableInEarthdataCloud: true,
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        },
        cmr: {
          data_center_h: [
            'National Snow and Ice Data Center (NSIDC)'
          ]
        },
        viewAll: {}
      },
      query: {
        collection: {
          hasGranulesOrCwic: true,
          keyword: 'modis',
          spatial: {
            point: '0,0'
          }
        }
      },
      subscriptions: {
        disabledFields: {
          collection: {}
        }
      }
    }

    expect(getCollectionSubscriptionQueryString(state)).toEqual('cloud_hosted=true&has_granules_or_cwic=true&keyword=modis*&data_center_h[]=National Snow and Ice Data Center (NSIDC)&point=0,0')
  })

  test('returns the collection query string with disabledFields removed', () => {
    const state = {
      facetsParams: {
        feature: {
          availableInEarthdataCloud: true,
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        },
        cmr: {
          data_center_h: [
            'National Snow and Ice Data Center (NSIDC)'
          ]
        },
        viewAll: {}
      },
      query: {
        collection: {
          hasGranulesOrCwic: true,
          keyword: 'modis',
          spatial: {
            point: '0,0'
          }
        }
      },
      subscriptions: {
        disabledFields: {
          collection: {
            keyword: true
          }
        }
      }
    }

    expect(getCollectionSubscriptionQueryString(state)).toEqual('cloud_hosted=true&has_granules_or_cwic=true&data_center_h[]=National Snow and Ice Data Center (NSIDC)&point=0,0')
  })
})
