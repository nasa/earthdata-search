import nock from 'nock'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import actions from '../index'

import { UPDATE_SAVED_PROJECT, RESTORE_FROM_URL } from '../../constants/actionTypes'

import * as urlQuery from '../urlQuery'

const mockStore = configureMockStore([thunk])

jest.mock('../../../../../portals/availablePortals.json', () => ({
  above: {
    moreInfoUrl: 'https://above.nasa.gov/',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      project: 'ABoVE'
    },
    title: {
      primary: 'ABoVE',
      secondary: 'Arctic-Boreal Vulnerability Experiment'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'above'
  },
  'ai-ml': {
    moreInfoUrl: 'https://www.earthdata.nasa.gov/esds/ai-ml',
    pageTitle: 'Artificial intelligence / Machine Learning Portal',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null,
      tagKey: 'machine.learning'
    },
    title: {
      primary: 'AI/ML',
      secondary: 'Artificial Intelligence / Machine Learning'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'ai-ml'
  },
  airmoss: {
    moreInfoUrl: 'https://airmoss.ornl.gov',
    pageTitle: 'AirMOSS',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null,
      project: 'AirMOSS'
    },
    title: {
      primary: 'AirMOSS',
      secondary: 'Airborne Microwave Observatory of Subcanopy and Subsurface '
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'airmoss'
  },
  amd: {
    moreInfoUrl: 'https://www.scar.org/resources/amd/',
    pageTitle: 'Antarctic Metadata Directory (AMD)',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null,
      tagKey: [
        'org.scar.amd'
      ]
    },
    title: {
      primary: 'AMD',
      secondary: 'Antarctic Metadata Directory'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'amd'
  },
  carve: {
    moreInfoUrl: 'https://carve.ornl.gov',
    pageTitle: 'CARVE',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null,
      project: 'CARVE'
    },
    title: {
      primary: 'CARVE',
      secondary: 'Carbon in Arctic Reservoirs Vulnerability Experiment'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'carve'
  },
  casei: {
    moreInfoUrl: 'https://impact.earthdata.nasa.gov/casei/',
    pageTitle: 'CASEI',
    parentConfig: 'edsc',
    portalBrowser: true,
    title: {
      primary: 'CASEI',
      secondary: 'Catalog of Archived Suborbital Earth Science Investigations'
    },
    query: {
      project: [
        'AAOE',
        'AASE',
        'ABLE',
        'ABoVE',
        'ACCLIP',
        'ACEPOL',
        'ACES',
        'ACT-America',
        'ACTIVATE',
        'Aeolus',
        'AfriSAR',
        'AirMOSS',
        'AMISA',
        'ARCTAS',
        'ARESE',
        'ARISE',
        'ASCENDS',
        'ASHOE',
        'ATom',
        'ATTREX',
        'BigFoot',
        'BOREAS',
        'BROMEX',
        'C3',
        'CALIPSO-NVF',
        'CalWater',
        'CAMEX',
        'CAMP2',
        'CARAFE',
        'CARVE',
        'CASIE',
        'CC-VEx',
        'CITE',
        'CLAMS',
        'CLASIC07',
        'COAST',
        'COMEX',
        'CORAL',
        'CPEX-AW',
        'CPEX-CV',
        'CPEX',
        'CR-AVE',
        'CRYSTAL-FACE',
        'DC3',
        'DCOTSS',
        'Delta-X',
        'DEVOTE',
        'DISCOVER-AQ',
        'ECO-3',
        'EPOCH',
        'EXPORTS',
        'FIFE',
        'FIRE',
        'FIREX-AQ',
        'GCPEx',
        'GOES-R',
        'GRIP',
        'HS3',
        'HyMeX',
        'HyspIRI',
        'ICE-POP',
        'ICESCAPE',
        'IFloodS',
        'IMPACTS',
        'INTEX-NA',
        'IPHEx',
        'KORUS-AQ',
        'KORUS-OC',
        'LISTOS',
        'LMOS',
        'LPVEx',
        'MACPEX',
        'MC3',
        'MIZOPEX',
        'MOOSE',
        'NAAMES',
        'NAMMA',
        'OLYMPEX',
        'OMG',
        'ORACLES',
        'OTTER',
        'OWLETS',
        'PAC2001',
        'PEM',
        'PODEX',
        'Polar',
        'POLARIS',
        'POSIDON',
        'PROVE',
        'RADEX',
        'S-MODE',
        'SABOR',
        'SAFARI',
        'SASSIE',
        'SCOAPE',
        'SEAC4',
        'SNF',
        'SnowEx',
        'SPADE',
        'SPURS',
        'TARFOX',
        'TC4',
        'TCSP',
        'TEFLUN',
        'TRACE',
        'TRACER-AQ',
        'VIRGAS'
      ]
    },
    portalId: 'casei'
  },
  cwic: {
    moreInfoUrl: 'http://ceos.org/ourwork/workinggroups/wgiss/access/cwic/',
    pageTitle: 'CWIC',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      consortium: [
        'EOSDIS',
        'CWIC'
      ],
      hasGranulesOrCwic: null
    },
    title: {
      primary: 'CWIC',
      secondary: 'CEOS WGISS Integrated Catalog'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'cwic'
  },
  default: {
    features: {
      advancedSearch: false,
      authentication: false,
      featureFacets: {
        showAvailableInEarthdataCloud: false,
        showCustomizable: false,
        showMapImagery: false
      }
    },
    footer: {
      attributionText: '',
      displayVersion: false,
      primaryLinks: [],
      secondaryLinks: []
    },
    pageTitle: '',
    portalBrowser: false,
    query: {},
    title: {
      primary: 'Default'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false,
      showTophat: false
    },
    portalId: 'default'
  },
  edsc: {
    features: {
      advancedSearch: true,
      authentication: true,
      featureFacets: {
        showAvailableInEarthdataCloud: true,
        showCustomizable: true,
        showMapImagery: true
      }
    },
    footer: {
      attributionText: 'NASA Official: Test Official',
      displayVersion: true,
      primaryLinks: [
        {
          href: 'http://www.nasa.gov/FOIA/index.html',
          title: 'FOIA'
        },
        {
          href: 'http://www.nasa.gov/about/highlights/HP_Privacy.html',
          title: 'NASA Privacy Policy'
        },
        {
          href: 'http://www.usa.gov',
          title: 'USA.gov'
        }
      ],
      secondaryLinks: [
        {
          href: 'https://access.earthdata.nasa.gov/',
          title: 'Earthdata Access: A Section 508 accessible alternative'
        }
      ]
    },
    pageTitle: 'Earthdata Search',
    portalBrowser: false,
    title: {
      primary: 'Earthdata Search'
    },
    ui: {
      showNonEosdisCheckbox: true,
      showOnlyGranulesCheckbox: true,
      showTophat: true
    },
    portalId: 'edsc'
  },
  example: {
    pageTitle: 'Example',
    parentConfig: 'edsc',
    portalBrowser: false,
    query: {
      echoCollectionId: 'C203234523-LAADS'
    },
    title: {
      primary: 'Example'
    },
    portalId: 'example'
  },
  ghrc: {
    moreInfoUrl: 'https://ghrc.nsstc.nasa.gov/home',
    pageTitle: 'GHRC',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      dataCenter: 'NASA/MSFC/GHRC',
      hasGranulesOrCwic: null
    },
    title: {
      primary: 'GHRC',
      secondary: 'Global Hydrometeorology Resource Center'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'ghrc'
  },
  idn: {
    moreInfoUrl: 'https://ceos.org/ourwork/workinggroups/wgiss/access/international-directory-network/',
    pageTitle: 'IDN',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null
    },
    title: {
      primary: 'IDN',
      secondary: 'CEOS International Directory Network'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'idn'
  },
  obdaac: {
    features: {
      advancedSearch: true,
      featureFacets: {
        showAvailableInEarthdataCloud: false,
        showCustomizable: false,
        showMapImagery: false
      }
    },
    footer: {
      displayVersion: false,
      primaryLinks: [
        {
          href: 'https://oceancolor.gsfc.nasa.gov/',
          title: 'Ocean Color'
        },
        {
          href: 'https://oceandata.sci.gsfc.nasa.gov/',
          title: 'Ocean Data'
        }
      ],
      secondaryLinks: []
    },
    moreInfoUrl: 'https://oceancolor.gsfc.nasa.gov/',
    pageTitle: 'OBDAAC',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      dataCenter: 'NASA/GSFC/SED/ESD/GCDC/OB.DAAC'
    },
    title: {
      primary: 'OBDAAC',
      secondary: 'Ocean Biology Distributed Active Archive Center'
    },
    ui: {
      showNonEosdisCheckbox: true,
      showOnlyGranulesCheckbox: true
    },
    portalId: 'obdaac'
  },
  ornldaac: {
    moreInfoUrl: 'https://daac.ornl.gov',
    pageTitle: 'ORNL DAAC',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      dataCenter: 'ORNL_DAAC',
      hasGranulesOrCwic: null
    },
    title: {
      primary: 'ORNL DAAC',
      secondary: 'Oak Ridge National Laboratory Distributed Active Archive Center'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'ornldaac'
  },
  podaac: {
    moreInfoUrl: 'https://podaac.jpl.nasa.gov',
    pageTitle: 'PO.DAAC',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      dataCenter: 'NASA/JPL/PODAAC',
      hasGranulesOrCwic: null
    },
    title: {
      primary: 'PO.DAAC',
      secondary: 'Physical Oceanography Distributed Active Archive Center'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'podaac'
  },
  'podaac-cloud': {
    moreInfoUrl: 'https://podaac.jpl.nasa.gov',
    pageTitle: 'PO.DAAC Cloud',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null,
      provider: 'POCLOUD'
    },
    title: {
      primary: 'PO.DAAC Cloud',
      secondary: 'Physical Oceanography Distributed Active Archive Center'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'podaac-cloud'
  },
  seabass: {
    features: {
      advancedSearch: true,
      featureFacets: {
        showAvailableInEarthdataCloud: false,
        showCustomizable: false,
        showMapImagery: false
      }
    },
    footer: {
      displayVersion: false,
      primaryLinks: [
        {
          href: 'https://seabass.gsfc.nasa.gov/',
          title: 'SeaBASS'
        }
      ],
      secondaryLinks: []
    },
    moreInfoUrl: 'https://seabass.gsfc.nasa.gov/',
    pageTitle: 'SeaBASS',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      dataCenter: 'NASA/GSFC/SED/ESD/GCDC/SeaBASS'
    },
    title: {
      primary: 'SeaBASS',
      secondary: 'SeaWiFS Bio-optical Archive and Storage System'
    },
    ui: {
      showNonEosdisCheckbox: true,
      showOnlyGranulesCheckbox: true
    },
    portalId: 'seabass'
  },
  snwg: {
    moreInfoUrl: 'https://www.earthdata.nasa.gov/esds/impact/snwg',
    pageTitle: 'SNWG',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null,
      tagKey: 'org.snwg'
    },
    title: {
      primary: 'SNWG',
      secondary: 'Satellite Needs Working Group'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'snwg'
  },
  soos: {
    moreInfoUrl: 'http://www.soos.aq',
    pageTitle: 'Southern Ocean Observing System',
    parentConfig: 'edsc',
    portalBrowser: true,
    query: {
      hasGranulesOrCwic: null,
      tagKey: [
        'aq.soos'
      ]
    },
    title: {
      primary: 'SOOS',
      secondary: 'Southern Ocean Observing System'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'soos'
  },
  standardproducts: {
    pageTitle: 'Standard Data Products',
    parentConfig: 'edsc',
    portalBrowser: true,
    moreInfoUrl: 'https://www.earthdata.nasa.gov/learn/earth-observation-data-basics/standard-data-products',
    query: {
      hasGranulesOrCwic: null,
      standardProduct: true
    },
    title: {
      primary: 'Standard Data Products',
      secondary: 'NASA ESDIS Earth Science Standard Data Products'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'standardproducts'
  },
  suborbital: {
    moreInfoUrl: 'https://earthdata.nasa.gov/esds/impact/admg/the-airborne-inventory',
    pageTitle: 'NASA Sub-Orbital Catalog',
    parentConfig: 'edsc',
    portalBrowser: false,
    query: {
      hasGranulesOrCwic: null,
      tagKey: [
        'gov.nasa.impact.*'
      ]
    },
    title: {
      primary: 'CASEI',
      secondary: 'Catalog of Archived Suborbital Earth Science Investigations'
    },
    ui: {
      showNonEosdisCheckbox: false,
      showOnlyGranulesCheckbox: false
    },
    portalId: 'suborbital'
  }
}))

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('updateStore', () => {
  test('calls restoreFromUrl and gets new search results', async () => {
    const params = {
      cmrFacets: {},
      earthdataEnvironment: 'prod',
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false,
        nearRealTime: false
      },
      focusedCollection: 'C00001-EDSC',
      map: {},
      portal: {},
      project: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      query: {
        collection: {
          overrideTemporal: {},
          pageNum: 1,
          spatial: {},
          temporal: {}
        }
      },
      shapefile: {}
    }

    const store = mockStore({
      preferences: {
        preferences: {
          collectionSort: 'default'
        }
      },
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    await store.dispatch(urlQuery.updateStore(params))

    const storeActions = store.getActions()
    expect(storeActions[0]).toEqual({
      payload: {
        ...params,
        query: {
          ...params.query,
          collectionSortPreference: 'default'
        }
      },
      type: RESTORE_FROM_URL
    })
  })

  describe('on the projects page', () => {
    test('calls restoreFromUrl and gets new search results', async () => {
      const params = {
        cmrFacets: {},
        earthdataEnvironment: 'prod',
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        },
        focusedCollection: 'C00001-EDSC',
        map: {},
        portal: {},
        project: {
          collections: {
            allIds: ['C00001-EDSC'],
            byId: {}
          }
        },
        query: {
          collection: {
            overrideTemporal: {},
            pageNum: 1,
            spatial: {},
            temporal: {}
          },
          granule: { pageNum: 1 }
        },
        shapefile: {}
      }

      jest.spyOn(actions, 'getProjectCollections').mockImplementation(() => jest.fn())
      jest.spyOn(actions, 'getTimeline').mockImplementation(() => jest.fn())

      const store = mockStore({
        preferences: {
          preferences: {
            collectionSort: 'default'
          }
        },
        router: {
          location: {
            pathname: '/projects'
          }
        }
      })
      await store.dispatch(urlQuery.updateStore(params, '/projects'))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          ...params,
          query: {
            ...params.query,
            collectionSortPreference: 'default'
          }
        },
        type: RESTORE_FROM_URL
      })
    })
  })

  describe('when a portal parameter is provided', () => {
    test('loads the included styles', async () => {
      jest.mock('../../../../../portals/airmoss/styles.scss', () => ({
        unuse: jest.fn(),
        use: jest.fn()
      }))

      const params = {
        cmrFacets: {},
        earthdataEnvironment: 'prod',
        featureFacets: {
          availableInEarthdataCloud: false,
          customizable: false,
          mapImagery: false,
          nearRealTime: false
        },
        focusedCollection: '',
        map: {},
        portalId: 'airmoss',
        project: {},
        query: {
          collection: {
            overrideTemporal: {},
            pageNum: 1,
            spatial: {},
            temporal: {}
          },
          granule: { pageNum: 1 }
        },
        shapefile: {}
      }

      jest.spyOn(actions, 'getProjectCollections').mockImplementation(() => jest.fn())
      jest.spyOn(actions, 'getTimeline').mockImplementation(() => jest.fn())

      const store = mockStore({
        preferences: {
          preferences: {
            collectionSort: 'default'
          }
        },
        router: {
          location: {
            pathname: '/projects'
          }
        }
      })
      await store.dispatch(urlQuery.updateStore(params, '/projects'))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          ...params,
          query: {
            ...params.query,
            collectionSortPreference: 'default'
          },
          portalId: undefined,
          portal: {
            features: {
              advancedSearch: true,
              authentication: true,
              featureFacets: {
                showAvailableInEarthdataCloud: true,
                showCustomizable: true,
                showMapImagery: true
              }
            },
            footer: {
              attributionText: 'NASA Official: Test Official',
              displayVersion: true,
              primaryLinks: [
                {
                  href: 'http://www.nasa.gov/FOIA/index.html',
                  title: 'FOIA'
                },
                {
                  href: 'http://www.nasa.gov/about/highlights/HP_Privacy.html',
                  title: 'NASA Privacy Policy'
                },
                {
                  href: 'http://www.usa.gov',
                  title: 'USA.gov'
                }
              ],
              secondaryLinks: [
                {
                  href: 'https://access.earthdata.nasa.gov/',
                  title: 'Earthdata Access: A Section 508 accessible alternative'
                }
              ]
            },
            moreInfoUrl: 'https://airmoss.ornl.gov',
            pageTitle: 'AirMOSS',
            parentConfig: 'edsc',
            portalBrowser: true,
            portalId: 'airmoss',
            query: {
              hasGranulesOrCwic: null,
              project: 'AirMOSS'
            },
            title: {
              primary: 'AirMOSS',
              secondary: 'Airborne Microwave Observatory of Subcanopy and Subsurface '
            },
            ui: {
              showNonEosdisCheckbox: false,
              showOnlyGranulesCheckbox: false,
              showTophat: true
            }
          }
        },
        type: RESTORE_FROM_URL
      })
    })
  })
})

describe('changePath', () => {
  test('retrieves path from database if there is a projectId', async () => {
    nock(/localhost/)
      .get(/projects/)
      .reply(200, {
        name: null,
        path: '/search?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
      })

    const updateStoreMock = jest.spyOn(actions, 'updateStore').mockImplementation(() => jest.fn())
    const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
    const getProjectCollectionsMock = jest.spyOn(actions, 'getProjectCollections').mockImplementation(() => jest.fn())
    const getProjectGranulesMock = jest.spyOn(actions, 'getProjectGranules').mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline').mockImplementation(() => jest.fn())

    const newPath = '/search?projectId=1'

    const store = mockStore({
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          'C00001-EDSC': {
            services: [],
            variables: []
          }
        },
        granules: {}
      },
      project: {
        collections: {
          allIds: ['C00001-EDSC'],
          byId: {}
        }
      },
      query: {},
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    await store.dispatch(urlQuery.changePath(newPath)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          name: null,
          projectId: '1',
          path: '/search?p=C00001-EDSC!C00001-EDSC&pg[1][v]=t'
        },
        type: UPDATE_SAVED_PROJECT
      })

      expect(updateStoreMock).toBeCalledTimes(1)
      expect(updateStoreMock).toBeCalledWith(
        expect.objectContaining({
          featureFacets: {
            availableInEarthdataCloud: false,
            customizable: false,
            mapImagery: false,
            nearRealTime: false
          },
          deprecatedUrlParams: [],
          focusedCollection: 'C00001-EDSC',
          map: {},
          project: {
            collections: {
              allIds: ['C00001-EDSC'],
              byId: {
                'C00001-EDSC': {
                  granules: {},
                  isVisible: true
                }
              }
            }
          },
          query: {
            collection: {
              byId: {
                'C00001-EDSC': {
                  granules: {
                    pageNum: 1
                  }
                }
              },
              hasGranulesOrCwic: true,
              overrideTemporal: {},
              pageNum: 1,
              spatial: {},
              temporal: {}
            }
          },
          shapefile: {
            shapefileId: ''
          }
        })
      )

      expect(getCollectionsMock).toBeCalledTimes(1)
      expect(getProjectCollectionsMock).toBeCalledTimes(1)
      expect(getProjectGranulesMock).toBeCalledTimes(1)
      expect(getTimelineMock).toBeCalledTimes(1)
    })
  })

  test('updates the store if there is not a projectId', async () => {
    const updateStoreMock = jest.spyOn(actions, 'updateStore').mockImplementation(() => jest.fn())
    const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline').mockImplementation(() => jest.fn())

    const newPath = '/search?p=C00001-EDSC'

    const store = mockStore({
      earthdataEnvironment: 'prod',
      project: {
        collections: {
          allIds: [],
          byId: {}
        }
      },
      query: {
        collection: {
          spatial: {}
        }
      },
      router: {
        location: {
          pathname: '/search'
        }
      },
      timeline: {
        query: {}
      }
    })

    await store.dispatch(urlQuery.changePath(newPath))

    expect(updateStoreMock).toBeCalledTimes(1)
    expect(updateStoreMock).toBeCalledWith(expect.objectContaining({
      featureFacets: {
        availableInEarthdataCloud: false,
        customizable: false,
        mapImagery: false,
        nearRealTime: false
      },
      focusedCollection: 'C00001-EDSC',
      map: {},
      query: {
        collection: {
          byId: {
            'C00001-EDSC': {
              granules: {
                pageNum: 1
              }
            }
          },
          hasGranulesOrCwic: true,
          overrideTemporal: {},
          pageNum: 1,
          spatial: {},
          temporal: {}
        }
      },
      shapefile: {
        shapefileId: ''
      }
    }), '/search')

    expect(getCollectionsMock).toBeCalledTimes(1)
    expect(getTimelineMock).toBeCalledTimes(1)
  })

  test('handles an error fetching the project', async () => {
    nock(/localhost/)
      .get(/projects/)
      .reply(500, { mock: 'error' })

    const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
    const getTimelineMock = jest.spyOn(actions, 'getTimeline').mockImplementation(() => jest.fn())
    const handleErrorMock = jest.spyOn(actions, 'handleError').mockImplementation(() => jest.fn())

    const newPath = '/search?projectId=1'

    const store = mockStore({
      earthdataEnvironment: 'prod',
      metadata: {
        collections: {
          'C00001-EDSC': {
            services: [],
            variables: []
          }
        },
        granules: {}
      },
      project: {
        collections: {
          allIds: ['C00001-EDSC'],
          byId: {}
        }
      },
      providers: [],
      query: {},
      router: {
        location: {
          pathname: '/search'
        }
      }
    })

    await store.dispatch(urlQuery.changePath(newPath)).then(() => {
      const storeActions = store.getActions()
      expect(storeActions.length).toEqual(0)

      expect(getCollectionsMock).toBeCalledTimes(1)
      expect(getTimelineMock).toBeCalledTimes(1)

      expect(handleErrorMock).toBeCalledTimes(1)
      expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
        action: 'changePath',
        error: new Error('Request failed with status code 500'),
        resource: 'project',
        verb: 'updating'
      }))
    })
  })

  describe('when a path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getFocusedCollection action', async () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/search/granules?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getFocusedCollection action', async () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/search/granules/collection-details?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getFocusedCollection action', async () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/search/granules/subscriptions?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getFocusedCollection action', async () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())
        const getFocusedGranuleMock = jest.spyOn(actions, 'getFocusedGranule').mockImplementation(() => jest.fn())

        const newPath = '/search/granules/granule-details?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          focusedGranule: 'G00001-EDSC',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
        expect(getFocusedGranuleMock).toBeCalledTimes(1)
      })
    })
  })

  describe('when a portal path is provided', () => {
    describe('when the path matches granule search', () => {
      test('calls getFocusedCollection action', async () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/portal/fakeportal/search/granules?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches collection details', () => {
      test('calls getFocusedCollection action', async () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/portal/fakeportal/search/granules/collection-details?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches subscription list', () => {
      test('calls getFocusedCollection action', async () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())

        const newPath = '/portal/fakeportal/search/granules/subscriptions?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
      })
    })

    describe('when the path matches granule details', () => {
      test('calls getFocusedCollection action', async () => {
        const getCollectionsMock = jest.spyOn(actions, 'getCollections').mockImplementation(() => jest.fn())
        const getFocusedCollectionMock = jest.spyOn(actions, 'getFocusedCollection').mockImplementation(() => jest.fn())
        const getFocusedGranuleMock = jest.spyOn(actions, 'getFocusedGranule').mockImplementation(() => jest.fn())

        const newPath = '/portal/fakeportal/search/granules/granule-details?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          focusedGranule: 'G00001-EDSC',
          project: {
            collections: {
              allIds: [],
              byId: {}
            }
          },
          query: {
            collection: {
              spatial: {}
            }
          },
          router: {
            location: {
              pathname: '/search'
            }
          },
          timeline: {
            query: {}
          }
        })

        await store.dispatch(urlQuery.changePath(newPath))

        expect(getCollectionsMock).toBeCalledTimes(1)
        expect(getFocusedCollectionMock).toBeCalledTimes(1)
        expect(getFocusedGranuleMock).toBeCalledTimes(1)
      })
    })
  })
})

describe('changeUrl', () => {
  describe('when called with a string', () => {
    describe('when called without a projectId', () => {
      test('calls replace when the pathname has not changed', () => {
        const newPath = '/search?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          router: {
            location: {
              pathname: '/search'
            }
          },
          savedProject: {}
        })

        store.dispatch(urlQuery.changeUrl(newPath))

        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          payload: {
            args: [
              newPath
            ],
            method: 'replace'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        })
      })

      test('calls push when the pathname has changed', () => {
        const newPath = '/search/granules?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          router: {
            location: {
              pathname: '/search'
            }
          },
          savedProject: {}
        })

        store.dispatch(urlQuery.changeUrl(newPath))

        const storeActions = store.getActions()
        expect(storeActions[0]).toEqual({
          payload: {
            args: [
              newPath
            ],
            method: 'push'
          },
          type: '@@router/CALL_HISTORY_METHOD'
        })
      })
    })

    describe('when called with a projectId', () => {
      test('updates the stored path', async () => {
        nock(/localhost/)
          .post(/projects/)
          .reply(200, {
            project_id: 1,
            path: '/search?p=C00001-EDSC'
          })

        const newPath = '/search?p=C00001-EDSC&ff=Map%20Imagery'

        const store = mockStore({
          query: {},
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        await store.dispatch(urlQuery.changeUrl(newPath)).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            payload: {
              projectId: 1,
              path: '/search?p=C00001-EDSC'
            },
            type: UPDATE_SAVED_PROJECT
          })
        })
      })

      test('updates the url if a new projectId was created', async () => {
        nock(/localhost/)
          .post(/projects/)
          .reply(200, {
            project_id: 2,
            path: '/search?p=C00001-EDSC'
          })

        const newPath = '/search?p=C00001-EDSC&ff=Map%20Imagery'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        await store.dispatch(urlQuery.changeUrl(newPath)).then(() => {
          const storeActions = store.getActions()
          expect(storeActions[0]).toEqual({
            payload: {
              args: [
                '/search?projectId=2'
              ],
              method: 'replace'
            },
            type: '@@router/CALL_HISTORY_METHOD'
          })

          expect(storeActions[1]).toEqual({
            payload: {
              projectId: 2,
              path: '/search?p=C00001-EDSC'
            },
            type: UPDATE_SAVED_PROJECT
          })
        })
      })

      test('when the path has not changed', () => {
        const newPath = '/search?p=C00001-EDSC'

        const store = mockStore({
          earthdataEnvironment: 'prod',
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        store.dispatch(urlQuery.changeUrl(newPath))

        const storeActions = store.getActions()
        expect(storeActions.length).toBe(0)
      })

      test('handles an error updating the stored path', async () => {
        nock(/localhost/)
          .post(/projects/)
          .reply(500, { mock: 'error' })

        const handleErrorMock = jest.spyOn(actions, 'handleError').mockImplementation(() => jest.fn())

        const newPath = '/search?p=C00001-EDSC&ff=Map%20Imagery'

        const store = mockStore({
          query: {},
          router: {
            location: {
              pathname: '/projectId=1'
            }
          },
          savedProject: {
            projectId: 1,
            path: '/search?p=C00001-EDSC'
          }
        })

        await store.dispatch(urlQuery.changeUrl(newPath)).then(() => {
          const storeActions = store.getActions()
          expect(storeActions.length).toEqual(0)
        })

        expect(handleErrorMock).toBeCalledTimes(1)
        expect(handleErrorMock).toBeCalledWith(expect.objectContaining({
          action: 'changeUrl',
          error: new Error('Request failed with status code 500'),
          resource: 'project',
          verb: 'updating'
        }))
      })
    })
  })

  describe('when called with an object', () => {
    test('calls replace when the pathname has not changed', () => {
      const newPath = {
        pathname: '/search',
        search: '?p=C00001-EDSC'
      }

      const store = mockStore({
        earthdataEnvironment: 'prod',
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(urlQuery.changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'replace'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })

    test('calls push when the pathname has changed', () => {
      const newPath = {
        pathname: '/granules',
        search: '?p=C00001-EDSC'
      }

      const store = mockStore({
        earthdataEnvironment: 'prod',
        router: {
          location: {
            pathname: '/search'
          }
        }
      })

      store.dispatch(urlQuery.changeUrl(newPath))

      const storeActions = store.getActions()
      expect(storeActions[0]).toEqual({
        payload: {
          args: [
            newPath
          ],
          method: 'push'
        },
        type: '@@router/CALL_HISTORY_METHOD'
      })
    })
  })
})
