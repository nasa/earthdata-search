import { act, waitFor } from '@testing-library/react'
import { useLocation } from 'react-router-dom'

import UrlQueryContainer from '../UrlQueryContainer'
import * as encodeUrlQuery from '../../../util/url/url'
import { collectionSortKeys } from '../../../constants/collectionSortKeys'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import useEdscStore from '../../../zustand/useEdscStore'
import setupTest from '../../../../../../jestConfigs/setupTest'
import UPDATE_PROJECT from '../../../operations/mutations/updateProject'
import CREATE_PROJECT from '../../../operations/mutations/createProject'
import { changeUrl } from '../../../util/url/changeUrl'
import { changePath } from '../../../util/url/changePath'

jest.mock('../../../util/url/changePath', () => ({
  changePath: jest.fn()
}))

jest.mock('../../../util/url/changeUrl', () => ({
  changeUrl: jest.fn()
}))

const mockUseNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Preserve other exports
  useLocation: jest.fn().mockReturnValue({
    pathname: '/search/granules',
    search: '?p=C00001-EDSC',
    hash: '',
    state: null,
    key: 'testKey'
  }),
  useNavigate: () => mockUseNavigate
}))

const encodeUrlQuerySpy = jest.spyOn(encodeUrlQuery, 'encodeUrlQuery')

const setup = setupTest({
  Component: UrlQueryContainer,
  defaultProps: {
    children: 'stuff'
  },
  defaultZustandState: {
    earthdataEnvironment: {
      currentEnvironment: 'prod'
    },
    preferences: {
      preferences: {
        collectionSort: 'default'
      }
    },
    savedProject: {
      setProject: jest.fn()
    }
  },
  withApolloClient: true,
  withRouter: true
})

beforeEach(() => {
  jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
    collectionSearchResultsSortKey: collectionSortKeys.usageDescending
  }))
})

describe('UrlQueryContainer', () => {
  const { replace } = window.location

  beforeEach(() => {
    delete window.location
    window.location = { replace: jest.fn() }
  })

  afterEach(() => {
    window.location.replace = replace
  })

  describe('when the component mounts', () => {
    test('calls changePath', async () => {
      jest.spyOn(encodeUrlQuery, 'encodeUrlQuery').mockImplementationOnce(() => '?p=C00001-EDSC')

      setup()

      await waitFor(async () => {
        expect(changePath).toHaveBeenCalledTimes(1)
      })

      expect(changePath).toHaveBeenCalledWith('/search/granules?p=C00001-EDSC')
    })

    describe('when the pathname is /projects and there is search params', () => {
      test('calls window.location.replace with /project path', async () => {
        useLocation.mockReturnValueOnce({
          pathname: '/projects',
          search: '?p=C00001-EDSC'
        })

        setup()

        expect(window.location.replace).toHaveBeenCalledTimes(1)
        expect(window.location.replace).toHaveBeenCalledWith('/project?p=C00001-EDSC')

        expect(changePath).toHaveBeenCalledTimes(0)
      })
    })
  })

  describe('when the zustand values change', () => {
    describe('when there is a saved project id', () => {
      test('updates the saved project and does not call onChangeUrl', async () => {
        const { zustandState } = setup({
          overrideZustandState: {
            collection: {
              collectionId: 'C00001-EDSC'
            },
            savedProject: {
              project: {
                id: '2057964173',
                name: 'Test Project',
                path: '/search/granules?p=C00001-EDSC&ee=prod'
              }
            }
          },
          overrideApolloClientMocks: [{
            request: {
              query: UPDATE_PROJECT,
              variables: {
                obfuscatedId: '2057964173',
                path: '/search/granules?p=C00001-EDSC&ee=prod&zoom=8'
              }
            },
            result: {
              data: {
                updateProject: {
                  createdAt: '2025-09-16T20:59:44.874Z',
                  name: 'Test Project',
                  obfuscatedId: '2057964173',
                  path: '/search/granules?p=C00001-EDSC&ee=prod&zoom=8',
                  updatedAt: '2025-09-16T20:59:44.874Z'
                }
              }
            }
          }]
        })

        // Wait for changePath to be called on initial render
        await waitFor(async () => {
          expect(changePath).toHaveBeenCalledTimes(1)
        })

        // Clear the mocks from the initial render
        jest.clearAllMocks()

        await act(() => {
          useEdscStore.setState((state) => {
            // eslint-disable-next-line no-param-reassign
            state.map.mapView.zoom = 8
          })
        })

        expect(encodeUrlQuerySpy).toHaveBeenCalledTimes(1)
        expect(encodeUrlQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining({
          focusedCollection: 'C00001-EDSC',
          mapView: expect.objectContaining({
            zoom: 8
          })
        }))

        await waitFor(() => {
          expect(zustandState.savedProject.setProject).toHaveBeenCalledWith({
            id: '2057964173',
            name: 'Test Project',
            path: '/search/granules?p=C00001-EDSC&ee=prod&zoom=8'
          })
        })

        expect(zustandState.savedProject.setProject).toHaveBeenCalledTimes(1)

        expect(mockUseNavigate).toHaveBeenCalledTimes(1)
        expect(mockUseNavigate).toHaveBeenCalledWith('/search/granules?projectId=2057964173', { replace: true })

        expect(changeUrl).toHaveBeenCalledTimes(0)
      })

      describe('when the path has not changed', () => {
        test('does not update the saved project', async () => {
          const { zustandState } = setup({
            overrideZustandState: {
              collection: {
                collectionId: 'C00001-EDSC'
              },
              savedProject: {
                project: {
                  id: '2057964173',
                  name: 'Test Project',
                  path: '/search/granules?p=C00001-EDSC&ee=prod'
                }
              }
            }
          })

          // Clear the mocks from the initial render
          jest.clearAllMocks()

          await act(() => {
            useEdscStore.setState((state) => {
              // eslint-disable-next-line no-param-reassign
              state.collection.collectionId = 'C00001-EDSC'
            })
          })

          expect(encodeUrlQuerySpy).toHaveBeenCalledTimes(0)
          expect(mockUseNavigate).toHaveBeenCalledTimes(0)
          expect(zustandState.savedProject.setProject).toHaveBeenCalledTimes(0)
          expect(changeUrl).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('when there is not a saved project id', () => {
      test('calls onChangeUrl', async () => {
        setup()

        // Clear the mocks from the initial render
        jest.clearAllMocks()

        await act(() => {
          useEdscStore.setState((state) => {
            // eslint-disable-next-line no-param-reassign
            state.collection.collectionId = 'C00001-EDSC'
            // eslint-disable-next-line no-param-reassign
            state.map.mapView.zoom = 8
          })
        })

        expect(encodeUrlQuerySpy).toHaveBeenCalledTimes(1)
        expect(encodeUrlQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining({
          focusedCollection: 'C00001-EDSC',
          mapView: expect.objectContaining({
            zoom: 8
          })
        }))

        expect(changeUrl).toHaveBeenCalledTimes(1)
        expect(changeUrl).toHaveBeenCalledWith('/search/granules?p=C00001-EDSC&ee=prod&zoom=8')
      })

      describe('when the url needs to be shortened', () => {
        test('creates a new project, does not call onChangeUrl, and navigates to the new projectId path', async () => {
          const hugePolygon = '-124.03728,49.71044,-124.03009,47.76597,-124.16352,46.21184,-124.20338,44.56691,-124.28256,42.33454,-124.42153,40.35907,-123.05896,40.28266,-121.73238,40.15172,-121.6247,41.54695,-121.71799,43.04046,-121.61169,44.04203,-120.06088,44.00328,-118.37663,43.95013,-118.46854,42.85332,-118.52225,41.5655,-118.59201,40.50524,-117.00549,40.4352,-115.81622,40.4543,-115.77719,42.10643,-115.81373,43.41944,-115.83172,44.93066,-115.74839,46.35081,-115.61302,47.75019,-115.61026,48.88908,-116.84133,48.90818,-117.22086,47.3917,-117.59182,46.01418,-119.23564,45.726,-120.66797,45.90428,-121.4406,46.62958,-121.38441,47.94564,-121.53196,49.17421,-122.89646,49.60275,-122.16037,50.325,-120.3211,50.07059,-118.42425,49.82698,-116.88562,49.70878,-115.46824,49.61244,-114.16658,49.41838,-111.8495,49.22349,-111.97823,47.84985,-112.18281,46.68328,-112.12356,45.5754,-112.141,44.33409,-112.18031,43.03243,-112.2534,41.93009,-112.21962,40.98775,-110.21924,40.94014,-108.9065,40.99301,-107.37729,40.99301,-106.24339,40.90664,-106.34443,42.13522,-107.89911,42.25786,-109.30597,42.38824,-110.35323,42.40734,-110.38672,43.43854,-110.40444,44.38946,-109.50363,44.27679,-108.22245,44.23942,-108.09567,45.24653,-109.0499,45.60419,-110.12373,45.58703,-110.15003,46.9471,-110.13287,47.90549,-108.10369,47.76265,-106.38623,47.56416,-104.69091,47.45177,-104.95252,48.84645,-105.39158,49.78435,-107.01381,49.35388,-108.62026,49.19027,-110.10574,49.36827,-111.6153,50.19544,-103.91855,50.0526,-103.73778,48.32794,-103.61681,46.22568,-103.39008,44.48939,-103.20876,43.4546,-103.20876,42.04719,-103.26108,41.10042,-101.77394,41.04727,-100.13814,41.01128,-98.83095,40.97087,-97.74577,40.93654,-97.83297,42.82259,-99.02667,42.78688,-100.55478,42.85055,-101.45116,42.83367,-101.64134,44.56691,-101.58653,45.61527,-101.65684,46.90973,-101.74017,48.07658,-101.74044,49.15345,-101.73934,50.17579,-94.66878,50.00139,-94.77703,47.60513,-94.70671,46.37157,-94.78145,45.35117,-94.71474,44.04231,-94.73246,43.18524,-94.76817,41.25185,-92.92225,41.18624,-91.25573,41.21614,-89.60194,41.00768,-88.5915,41.20396,-88.73324,42.51974,-89.90368,42.77359,-91.29172,42.85747,-92.33676,42.90841,-93.2359,42.7711,-93.27826,43.8477,-93.22511,45.08264,-93.26359,46.31731,-93.11687,47.40305,-92.99811,48.393,-93.0687,49.2711,-93.04434,50.25524,-91.20396,50.14921,-88.62777,49.93329,-86.5997,49.89591,-84.71946,49.77632,-82.84863,49.5579,-84.16995,49.11442,-85.48961,48.22136,-85.79717,47.27626,-85.91233,45.93086,-85.89544,44.75543,-85.51618,43.7533,-84.83352,42.86301,-83.66916,42.32651,-82.4129,42.23266,-81.28011,42.61441,-80.72257,43.65862,-80.41916,44.72166,-80.71288,45.89514,-81.24107,47.06144,-81.64552,47.86978,-82.17372,48.66374,-80.38677,49.2592,-80.81254,51.07106,-84.89027,51.97492,-88.41488,53.47756,-90.09996,56.10026,-94.59681,57.85205,-98.98569,58.92809,-103.20516,58.40156,-108.45305,57.78644,-111.4456,58.72988,-114.63553,58.76061,-118.42203,57.62892,-121.66235,57.81385,-124.12559,57.7607,-126.87896,56.58804,-128.81318,54.46668,-129.08807,51.90211,-128.60556,50.66108,-127.56938,49.49561,-126.18826,49.86269,-124.03728,49.71044'
          const hugePolygonEncoded = '-124.03728%2C49.71044%2C-124.03009%2C47.76597%2C-124.16352%2C46.21184%2C-124.20338%2C44.56691%2C-124.28256%2C42.33454%2C-124.42153%2C40.35907%2C-123.05896%2C40.28266%2C-121.73238%2C40.15172%2C-121.6247%2C41.54695%2C-121.71799%2C43.04046%2C-121.61169%2C44.04203%2C-120.06088%2C44.00328%2C-118.37663%2C43.95013%2C-118.46854%2C42.85332%2C-118.52225%2C41.5655%2C-118.59201%2C40.50524%2C-117.00549%2C40.4352%2C-115.81622%2C40.4543%2C-115.77719%2C42.10643%2C-115.81373%2C43.41944%2C-115.83172%2C44.93066%2C-115.74839%2C46.35081%2C-115.61302%2C47.75019%2C-115.61026%2C48.88908%2C-116.84133%2C48.90818%2C-117.22086%2C47.3917%2C-117.59182%2C46.01418%2C-119.23564%2C45.726%2C-120.66797%2C45.90428%2C-121.4406%2C46.62958%2C-121.38441%2C47.94564%2C-121.53196%2C49.17421%2C-122.89646%2C49.60275%2C-122.16037%2C50.325%2C-120.3211%2C50.07059%2C-118.42425%2C49.82698%2C-116.88562%2C49.70878%2C-115.46824%2C49.61244%2C-114.16658%2C49.41838%2C-111.8495%2C49.22349%2C-111.97823%2C47.84985%2C-112.18281%2C46.68328%2C-112.12356%2C45.5754%2C-112.141%2C44.33409%2C-112.18031%2C43.03243%2C-112.2534%2C41.93009%2C-112.21962%2C40.98775%2C-110.21924%2C40.94014%2C-108.9065%2C40.99301%2C-107.37729%2C40.99301%2C-106.24339%2C40.90664%2C-106.34443%2C42.13522%2C-107.89911%2C42.25786%2C-109.30597%2C42.38824%2C-110.35323%2C42.40734%2C-110.38672%2C43.43854%2C-110.40444%2C44.38946%2C-109.50363%2C44.27679%2C-108.22245%2C44.23942%2C-108.09567%2C45.24653%2C-109.0499%2C45.60419%2C-110.12373%2C45.58703%2C-110.15003%2C46.9471%2C-110.13287%2C47.90549%2C-108.10369%2C47.76265%2C-106.38623%2C47.56416%2C-104.69091%2C47.45177%2C-104.95252%2C48.84645%2C-105.39158%2C49.78435%2C-107.01381%2C49.35388%2C-108.62026%2C49.19027%2C-110.10574%2C49.36827%2C-111.6153%2C50.19544%2C-103.91855%2C50.0526%2C-103.73778%2C48.32794%2C-103.61681%2C46.22568%2C-103.39008%2C44.48939%2C-103.20876%2C43.4546%2C-103.20876%2C42.04719%2C-103.26108%2C41.10042%2C-101.77394%2C41.04727%2C-100.13814%2C41.01128%2C-98.83095%2C40.97087%2C-97.74577%2C40.93654%2C-97.83297%2C42.82259%2C-99.02667%2C42.78688%2C-100.55478%2C42.85055%2C-101.45116%2C42.83367%2C-101.64134%2C44.56691%2C-101.58653%2C45.61527%2C-101.65684%2C46.90973%2C-101.74017%2C48.07658%2C-101.74044%2C49.15345%2C-101.73934%2C50.17579%2C-94.66878%2C50.00139%2C-94.77703%2C47.60513%2C-94.70671%2C46.37157%2C-94.78145%2C45.35117%2C-94.71474%2C44.04231%2C-94.73246%2C43.18524%2C-94.76817%2C41.25185%2C-92.92225%2C41.18624%2C-91.25573%2C41.21614%2C-89.60194%2C41.00768%2C-88.5915%2C41.20396%2C-88.73324%2C42.51974%2C-89.90368%2C42.77359%2C-91.29172%2C42.85747%2C-92.33676%2C42.90841%2C-93.2359%2C42.7711%2C-93.27826%2C43.8477%2C-93.22511%2C45.08264%2C-93.26359%2C46.31731%2C-93.11687%2C47.40305%2C-92.99811%2C48.393%2C-93.0687%2C49.2711%2C-93.04434%2C50.25524%2C-91.20396%2C50.14921%2C-88.62777%2C49.93329%2C-86.5997%2C49.89591%2C-84.71946%2C49.77632%2C-82.84863%2C49.5579%2C-84.16995%2C49.11442%2C-85.48961%2C48.22136%2C-85.79717%2C47.27626%2C-85.91233%2C45.93086%2C-85.89544%2C44.75543%2C-85.51618%2C43.7533%2C-84.83352%2C42.86301%2C-83.66916%2C42.32651%2C-82.4129%2C42.23266%2C-81.28011%2C42.61441%2C-80.72257%2C43.65862%2C-80.41916%2C44.72166%2C-80.71288%2C45.89514%2C-81.24107%2C47.06144%2C-81.64552%2C47.86978%2C-82.17372%2C48.66374%2C-80.38677%2C49.2592%2C-80.81254%2C51.07106%2C-84.89027%2C51.97492%2C-88.41488%2C53.47756%2C-90.09996%2C56.10026%2C-94.59681%2C57.85205%2C-98.98569%2C58.92809%2C-103.20516%2C58.40156%2C-108.45305%2C57.78644%2C-111.4456%2C58.72988%2C-114.63553%2C58.76061%2C-118.42203%2C57.62892%2C-121.66235%2C57.81385%2C-124.12559%2C57.7607%2C-126.87896%2C56.58804%2C-128.81318%2C54.46668%2C-129.08807%2C51.90211%2C-128.60556%2C50.66108%2C-127.56938%2C49.49561%2C-126.18826%2C49.86269%2C-124.03728%2C49.71044'

          const { zustandState } = setup({
            overrideZustandState: {
              collection: {
                collectionId: 'C00001-EDSC'
              }
            },
            overrideApolloClientMocks: [{
              request: {
                query: CREATE_PROJECT,
                variables: {
                  path: `/search/granules?p=C00001-EDSC&ee=prod&polygon[0]=${hugePolygonEncoded}`
                }
              },
              result: {
                data: {
                  createProject: {
                    createdAt: '2024-10-01T12:00:00.000Z',
                    name: null,
                    obfuscatedId: '2057964173',
                    path: `/search/granules?p=C00001-EDSC&ee=prod&polygon[0]=${hugePolygonEncoded}`,
                    updatedAt: '2024-10-01T12:00:00.000Z'
                  }
                }
              }
            }]
          })

          // Clear the mocks from the initial render
          jest.clearAllMocks()

          await act(() => {
            useEdscStore.setState((state) => {
              // eslint-disable-next-line no-param-reassign
              state.query.collection.spatial.polygon = [hugePolygon]
            })
          })

          expect(encodeUrlQuerySpy).toHaveBeenCalledTimes(1)
          expect(encodeUrlQuerySpy).toHaveBeenLastCalledWith(expect.objectContaining({
            focusedCollection: 'C00001-EDSC',
            collectionsQuery: expect.objectContaining({
              spatial: {
                polygon: [hugePolygon]
              }
            })
          }))

          await waitFor(() => {
            expect(zustandState.savedProject.setProject).toHaveBeenCalledWith({
              id: '2057964173',
              name: null,
              path: `/search/granules?p=C00001-EDSC&ee=prod&polygon[0]=${hugePolygonEncoded}`
            })
          })

          expect(zustandState.savedProject.setProject).toHaveBeenCalledTimes(1)

          expect(changeUrl).toHaveBeenCalledTimes(0)

          expect(mockUseNavigate).toHaveBeenCalledTimes(1)
          expect(mockUseNavigate).toHaveBeenCalledWith('/search/granules?projectId=2057964173', { replace: true })
        })
      })
    })
  })
})
