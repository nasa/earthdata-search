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
import { Helmet } from 'react-helmet'

import { MemoryRouter } from 'react-router-dom'
import * as AppConfig from '../../../../../../sharedUtils/config'
import actions from '../../../actions'
import { Project } from '../Project'

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

const mockClassListAdd = jest.fn()
const mockClassListRemove = jest.fn()

jest.spyOn(document, 'querySelector').mockImplementation(() => ({
  classList: {
    add: mockClassListAdd,
    remove: mockClassListRemove
  }
}))

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

  const { unmount } = render(
    <MemoryRouter>
      <Project {...props} />
    </MemoryRouter>
  )

  return {
    onSubmitRetrieval: props.onSubmitRetrieval,
    onToggleChunkedOrderModal: props.onToggleChunkedOrderModal,
    unmount
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

      screen.debug()

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
      })

      expect(screen.getByTestId('mocked-overrideTemporalModalContainer')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-sidebarContainer')).toBeInTheDocument()
      expect(screen.getByTestId('mocked-mapContainer')).toBeInTheDocument()
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

      let helmet
      await waitFor(() => {
        helmet = Helmet.peek()
      })

      expect(helmet.title).toBe('Test Project')
      expect(helmet.metaTags.find((tag) => tag.name === 'title').content).toBe('Test Project')
      expect(helmet.metaTags.find((tag) => tag.name === 'robots').content).toBe('noindex, nofollow')
      expect(helmet.linkTags.find((tag) => tag.rel === 'canonical').href).toContain('https://search.earthdata.nasa.gov')
    })
  })

  describe('when mounting the component', () => {
    test('adds the root__app--fixed-footer class to the root', () => {
      setup()

      expect(mockClassListAdd).toHaveBeenCalledTimes(1)
      expect(mockClassListAdd).toHaveBeenCalledWith('root__app--fixed-footer')

      expect(mockClassListRemove).toHaveBeenCalledTimes(0)
    })
  })

  describe('when unmounting the component', () => {
    test('removes the root__app--fixed-footer class to the root', () => {
      const { unmount } = setup()

      expect(mockClassListAdd).toHaveBeenCalledTimes(1)
      expect(mockClassListAdd).toHaveBeenCalledWith('root__app--fixed-footer')

      unmount()

      expect(mockClassListRemove).toHaveBeenCalledTimes(1)
      expect(mockClassListRemove).toHaveBeenCalledWith('root__app--fixed-footer')
    })
  })
})
