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

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {}),
  createControlComponent: jest.fn().mockImplementation(() => {})
}))

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom')
}))

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({
    edscHost: 'https://search.earthdata.nasa.gov',
    apiHost: 'http://localhost:3000'
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
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      const store = mockStore({
        project: {
          collections: {
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
    })
  })

  describe('Projects page', () => {
    test('displays the ProjectCollectionsContainer', async () => {
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      const store = mockStore({
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
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      const store = mockStore({
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
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 7
        })

      const store = mockStore({
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
      expect(onToggleChunkedOrderModal).toHaveBeenCalledWith(true)
      expect(onSubmitRetrieval).toBeCalledTimes(0)
    })
  })

  // RTL Lazy loading issue with mocks between https://github.com/testing-library/react-testing-library/issues/716
  describe('render self', () => {
    test('should render self', async () => {
      nock(/localhost/)
        .post(/retrievals/)
        .reply(200, {
          id: 1
        })

      const store = mockStore({
        project: {
          collections: {
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

      setup()

      await waitFor(() => {
        // Document title
        expect(document.title).toEqual('Test Project')

        // Document meta elements
        const metaTitleElement = document.querySelector('[name="title"]')

        expect(metaTitleElement).toHaveAttribute('content', 'Test Project')

        const metaBotsElement = document.querySelector('[name="robots"]')

        expect(metaBotsElement).toHaveAttribute('content', 'noindex, nofollow')

        const metaLinkElement = document.querySelector('link[rel="canonical"]')

        expect(metaLinkElement).toHaveAttribute('href', 'https://search.earthdata.nasa.gov')
      })
    })
  })
})
