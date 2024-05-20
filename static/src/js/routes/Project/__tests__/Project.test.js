import React from 'react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'

import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'

// TODO Memory router is supposed to be more lightweight?
import { BrowserRouter as Router } from 'react-router-dom'
import * as AppConfig from '../../../../../../sharedUtils/config'
import actions from '../../../actions'
import '@testing-library/jest-dom'
import { Project } from '../Project'

// Import SavedProjectsContainer
//   from '../../../containers/SavedProjectsContainer/SavedProjectsContainer'
// import ProjectCollectionsContainer
//   from '../../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {}),
  createControlComponent: jest.fn().mockImplementation(() => {})
}))

// Mock App components routes and containers
jest.mock('../../../containers/SidebarContainer/SidebarContainer', () => {
  const MockedSidebarContainer = () => <div data-testid="mocked-sidebarContainer" />

  return MockedSidebarContainer
})

jest.mock('../../../containers/ProjectCollectionsContainer/ProjectCollectionsContainer', () => {
  const MockedProjectCollectionsContainer = () => <div data-testid="mocked-projectCollectionsContainer" />

  return MockedProjectCollectionsContainer
})

jest.mock('../../../containers/SavedProjectsContainer/SavedProjectsContainer', () => {
  const MockedSavedProjectsContainer = () => <div data-testid="mocked-savedProjectsContainer" />

  return MockedSavedProjectsContainer
})

jest.mock('../../../containers/OverrideTemporalModalContainer/OverrideTemporalModalContainer', () => {
  const MockedOverrideTemporalModalContainer = () => <div data-testid="mocked-overrideTemporalModalContainer" />

  return MockedOverrideTemporalModalContainer
})

jest.mock('../../../containers/MapContainer/MapContainer', () => {
  const MockedMapContainer = () => <div data-testid="mocked-mapContainer" />

  return MockedMapContainer
})

jest.mock('../../../containers/MapContainer/MapContainer', () => {
  const MockedMapContainer = () => <div data-testid="mocked-mapContainer" />

  return MockedMapContainer
})

jest.mock('../../../components/Spinner/Spinner', () => {
  const MockedSpinner = () => <div data-testid="mocked-spinner" />

  return MockedSpinner
})

// Jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom')
// }))

// Define a MockRouter component
// eslint-disable-next-line react/prop-types
// const MockRouter = ({ children }) => (
//   <MemoryRouter initialEntries={['/']}>
//     {children}
//   </MemoryRouter>
// )

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom')
}))

const mockStore = configureMockStore([thunk])
// Const store = configureStore()

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({
    edscHost: 'https://search.earthdata.nasa.gov',
    apiHost: 'https://cmr.earthdata.nasa.gov'
  }))
})

const setup = (overrideProps) => {
  const props = {
    location: {},
    name: 'Test Project',
    onSubmitRetrieval: jest.fn(),
    onToggleChunkedOrderModal: jest.fn(),
    portal: {},
    projectCollectionsRequiringChunking: {},
    ...overrideProps
  }

  render(
    <Router>
      <Project {...props} />
    </Router>
  )

  return {
    onSubmitRetrieval: props.onSubmitRetrieval,
    onToggleChunkedOrderModal: props.onToggleChunkedOrderModal
  }
}

describe('Project component', () => {
  describe('Saved projects page', () => {
    test('displays the SavedProjectsContainer', async () => {
      nock(/cmr/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      const store = mockStore({
        retrieval: {
          id: null,
          collections: {},
          isLoading: false,
          isLoaded: false
        },
        project: {
          collections:
        {
          allIds: [],
          byId: {},
          isSubmitted: false,
          isSubmitting: false
        }
        },
        portal: { portalId: 'edsc' },
        router: {
          location: {
            search: ''
          }
        },
        shapefile: {
          shapefileId: '',
          selectedFeatures: null
        }
      })

      await store.dispatch(actions.submitRetrieval())

      setup({
        location: {
          search: ''
        }
      })

      expect(screen.getByTestId('mocked-savedProjectsContainer')).toBeInTheDocument()
      await waitFor(() => {
        // Title
        expect(document.title).toEqual('Saved Projects')

        // Meta elements
        const metaTitleElement = document.querySelector('[name="title"]')

        expect(metaTitleElement).toHaveAttribute('content', 'Saved Projects')

        const metaBotsElement = document.querySelector('[name="robots"]')

        expect(metaBotsElement).toHaveAttribute('content', 'noindex, nofollow')

        const metaLinkElement = document.querySelector('link[rel="canonical"]')
        // TODO why was this updated to `/projects`
        expect(metaLinkElement).toHaveAttribute('href', 'https://search.earthdata.nasa.gov/projects')

        expect(metaLinkElement).toBeInTheDocument()
      })
    })
  })

  describe('Projects page', () => {
    test('displays the ProjectCollectionsContainer', async () => {
      nock(/cmr/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      const store = mockStore({
        retrieval: {
          id: null,
          collections: {},
          isLoading: false,
          isLoaded: false
        },
        project: {
          collections:
        {
          allIds: [],
          byId: {},
          isSubmitted: false,
          isSubmitting: false
        }
        },
        portal: { portalId: 'edsc' },
        router: {
          location: {
            search: ''
          }
        },
        shapefile: {
          shapefileId: '',
          selectedFeatures: null
        }
      })

      await store.dispatch(actions.submitRetrieval())

      setup({
        location: {
          search: '?p=!C123456-EDSC'
        }
      })

      // Ensure that the map is being lazy loaded; spinner during load
      expect(screen.getByTestId('mocked-spinner')).toBeInTheDocument()

      await waitFor(() => {
        expect(document.title).toEqual('Test Project')
        expect(screen.getByTestId('mocked-overrideTemporalModalContainer')).toBeInTheDocument()
        expect(screen.getByTestId('mocked-sidebarContainer')).toBeInTheDocument()
        expect(screen.getByTestId('mocked-mapContainer')).toBeInTheDocument()
      })
    })
  })

  describe('handleSubmit', () => {
    test('calls onSubmitRetrieval', async () => {
      nock(/cmr/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      const store = mockStore({
        retrieval: {
          id: null,
          collections: {},
          isLoading: false,
          isLoaded: false
        },
        project: {
          collections:
      {
        allIds: [],
        byId: {},
        isSubmitted: false,
        isSubmitting: false
      }
        },
        portal: { portalId: 'edsc' },
        router: {
          location: {
            search: ''
          }
        },
        shapefile: {
          shapefileId: '',
          selectedFeatures: null
        }
      })

      store.dispatch(actions.submitRetrieval())

      const { onSubmitRetrieval } = setup({
        location: {
          search: '?p=!C123456-EDSC'
        }
      })

      // TODO RTL Does not seem to be able to find by form without the `name` prop on the form element
      // https://github.com/testing-library/dom-testing-library/issues/937
      const formSubmit = screen.getByRole('form')

      // TODO: `UserEvent` does not have submit func and `click` not recognized as submit
      fireEvent.submit(formSubmit)
      expect(onSubmitRetrieval).toBeCalledTimes(1)
    })

    test('calls onToggleChunkedOrderModal when any collections require chunking', async () => {
      nock(/cmr/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      const store = mockStore({
        retrieval: {
          id: null,
          collections: {},
          isLoading: false,
          isLoaded: false
        },
        project: {
          collections:
      {
        allIds: [],
        byId: {},
        isSubmitted: false,
        isSubmitting: false
      }
        },
        portal: { portalId: 'edsc' },
        router: {
          location: {
            search: ''
          }
        },
        shapefile: {
          shapefileId: '',
          selectedFeatures: null
        }
      })

      store.dispatch(actions.submitRetrieval())

      const { onSubmitRetrieval, onToggleChunkedOrderModal } = setup({
        location: {
          search: '?p=!C123456-EDSC'
        },
        projectCollectionsRequiringChunking: {
          collectionId: {}
        }
      })

      // TODO RTL Does not seem to be able to find by form without the `name` prop on the form element
      // https://github.com/testing-library/dom-testing-library/issues/937
      const formSubmit = screen.getByRole('form')

      // TODO: `UserEvent` does not have submit func and `click` not recognized as submit
      fireEvent.submit(formSubmit)
      expect(onToggleChunkedOrderModal).toBeCalledTimes(1)
      expect(onSubmitRetrieval).toBeCalledTimes(0)
    })
  })

  // Test.skip('sets the correct Helmet meta information', () => {
  //   const { enzymeWrapper } = setup()

  //   const helmet = enzymeWrapper.find(Helmet)

  //   expect(helmet.childAt(0).type()).toEqual('title')
  //   expect(helmet.childAt(0).text()).toEqual('Test Project')
  //   expect(helmet.childAt(1).props().name).toEqual('title')
  //   expect(helmet.childAt(1).props().content).toEqual('Test Project')
  //   expect(helmet.childAt(2).props().name).toEqual('robots')
  //   expect(helmet.childAt(2).props().content).toEqual('noindex, nofollow')
  //   expect(helmet.childAt(3).props().rel).toEqual('canonical')
  //   expect(helmet.childAt(3).props().href).toEqual('https://search.earthdata.nasa.gov')
  // })
})

// Describe('Project component', () => {
//   test('should render self', () => {
//     const { enzymeWrapper } = setup()

//     expect(enzymeWrapper.exists()).toBeTruthy()
//   })

//   test('sets the correct Helmet meta information', () => {
//     const { enzymeWrapper } = setup()

//     const helmet = enzymeWrapper.find(Helmet)

//     expect(helmet.childAt(0).type()).toEqual('title')
//     expect(helmet.childAt(0).text()).toEqual('Test Project')
//     expect(helmet.childAt(1).props().name).toEqual('title')
//     expect(helmet.childAt(1).props().content).toEqual('Test Project')
//     expect(helmet.childAt(2).props().name).toEqual('robots')
//     expect(helmet.childAt(2).props().content).toEqual('noindex, nofollow')
//     expect(helmet.childAt(3).props().rel).toEqual('canonical')
//     expect(helmet.childAt(3).props().href).toEqual('https://search.earthdata.nasa.gov')
//   })
