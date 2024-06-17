import React from 'react'
import nock from 'nock'

import {
  render,
  waitFor,
  screen
} from '@testing-library/react'
import '@testing-library/jest-dom'

import * as AppConfig from '../../../../sharedUtils/config'
import App from '../App'

// Mock react-leaflet because it causes errors
jest.mock('react-leaflet', () => ({
  createLayerComponent: jest.fn().mockImplementation(() => {}),
  createControlComponent: jest.fn().mockImplementation(() => {})
}))

// Mock App components routes and containers
jest.mock('../routes/Admin/Admin', () => () => {
  const MockedAdmin = () => <div data-testid="mocked-admin" />

  return MockedAdmin
})

jest.mock('../routes/ContactInfo/ContactInfo', () => {
  const MockedContactInfo = () => <div data-testid="mocked-contact-info" />

  return MockedContactInfo
})

jest.mock('../routes/Downloads/Downloads', () => {
  const MockedDownloads = () => <div data-testid="mocked-downloads" />

  return MockedDownloads
})

jest.mock('../routes/EarthdataDownloadRedirect/EarthdataDownloadRedirect', () => {
  const MockedEarthdataDownloadRedirect = () => <div data-testid="mocked-earthdata-download-redirect" />

  return MockedEarthdataDownloadRedirect
})

jest.mock('../containers/FooterContainer/FooterContainer', () => {
  const MockedFooterContainer = () => <div data-testid="mocked-footer-container" />

  return MockedFooterContainer
})

jest.mock('../routes/Preferences/Preferences', () => {
  const MockedPreferences = () => <div data-testid="mocked-preferences" />

  return MockedPreferences
})

jest.mock('../routes/Project/Project', () => {
  const MockedProject = () => <div data-testid="mocked-project" />

  return MockedProject
})

jest.mock('../routes/Search/Search', () => {
  const MockedSearch = () => <div data-testid="mocked-search" />

  return MockedSearch
})

jest.mock('../routes/Subscriptions/Subscriptions', () => {
  const MockedSubscriptions = () => <div data-testid="mocked-subscriptions" />

  return MockedSubscriptions
})

jest.mock('../containers/AboutCSDAModalContainer/AboutCSDAModalContainer', () => {
  const MockedAboutCSDAModalContainer = () => <div data-testid="mocked-about-csda-modal-container" />

  return MockedAboutCSDAModalContainer
})

jest.mock('../containers/AboutCwicModalContainer/AboutCwicModalContainer', () => {
  const MockedAboutCwicModalContainer = () => <div data-testid="mocked-about-cwic-modal-container" />

  return MockedAboutCwicModalContainer
})

jest.mock('../components/AppHeader/AppHeader', () => {
  const MockedAppHeader = () => <div data-testid="mocked-app-header" />

  return MockedAppHeader
})

jest.mock('../containers/AuthCallbackContainer/AuthCallbackContainer', () => {
  const MockedAuthCallbackContainer = () => <div data-testid="mocked-auth-callback-container" />

  return MockedAuthCallbackContainer
})

jest.mock('../containers/AuthRequiredContainer/AuthRequiredContainer', () => {
  const MockedAuthRequiredContainer = () => <div data-testid="mocked-auth-required-container" />

  return MockedAuthRequiredContainer
})

jest.mock('../containers/ChunkedOrderModalContainer/ChunkedOrderModalContainer', () => {
  const MockedChunkedOrderModalContainer = () => <div data-testid="mocked-chunked-order-modal-container" />

  return MockedChunkedOrderModalContainer
})

jest.mock('../containers/DeprecatedParameterModalContainer/DeprecatedParameterModalContainer', () => {
  const MockedDeprecatedParameterModalContainer = () => <div data-testid="mocked-deprecated-parameter-modal-container" />

  return MockedDeprecatedParameterModalContainer
})

jest.mock('../containers/ErrorBannerContainer/ErrorBannerContainer', () => {
  const MockedErrorBannerContainer = () => <div data-testid="mocked-error-banner-container" />

  return MockedErrorBannerContainer
})

jest.mock('../containers/KeyboardShortcutsModalContainer/KeyboardShortcutsModalContainer', () => {
  const MockedKeyboardShortcutsModalContainer = () => <div data-testid="mocked-keyboard-shortcuts-modal-container" />

  return MockedKeyboardShortcutsModalContainer
})

jest.mock('../containers/MapContainer/MapContainer', () => {
  const MockedMapContainer = () => <div data-testid="mocked-map-container" />

  return MockedMapContainer
})

jest.mock('../containers/MetricsEventsContainer/MetricsEventsContainer', () => {
  const MockedMetricsEventsContainer = () => <div data-testid="mocked-metrics-events-container" />

  return MockedMetricsEventsContainer
})

jest.mock('../components/Errors/NotFound', () => {
  const MockedNotFound = () => <div data-testid="mocked-not-found" />

  return MockedNotFound
})

jest.mock('../containers/PortalContainer/PortalContainer', () => {
  const MockedPortalContainer = () => <div data-testid="mocked-portal-container" />

  return MockedPortalContainer
})

jest.mock('../containers/ShapefileDropzoneContainer/ShapefileDropzoneContainer', () => {
  const MockedShapefileDropzoneContainer = () => <div data-testid="mocked-shapefile-dropzone-container" />

  return MockedShapefileDropzoneContainer
})

jest.mock('../containers/ShapefileUploadModalContainer/ShapefileUploadModalContainer', () => {
  const MockedShapefileUploadModalContainer = () => <div data-testid="mocked-shapefile-upload-modal-container" />

  return MockedShapefileUploadModalContainer
})

jest.mock('../containers/TooManyPointsModalContainer/TooManyPointsModalContainer', () => {
  const MockedTooManyPointsModalContainer = () => <div data-testid="mocked-too-many-points-modal-container" />

  return MockedTooManyPointsModalContainer
})

jest.mock('../containers/EditSubscriptionModalContainer/EditSubscriptionModalContainer', () => {
  const MockedEditSubscriptionModalContainer = () => <div data-testid="mocked-edit-subscription-modal-container" />

  return MockedEditSubscriptionModalContainer
})

jest.mock('../containers/HistoryContainer/HistoryContainer', () => {
  const MockedHistoryContainer = () => <div data-testid="mocked-history-container" />

  return MockedHistoryContainer
})

// Only mock `UrlQueryContainer` not its children which are the routes
jest.mock('../containers/UrlQueryContainer/UrlQueryContainer', () => (
  jest.fn(({ children }) => (
    <mock-UrlQueryContainer data-testid="UrlQueryContainer">
      {children}
    </mock-UrlQueryContainer>
  ))
))

beforeEach(() => {
  jest.clearAllMocks()
  jest.spyOn(AppConfig, 'getApplicationConfig').mockImplementation(() => ({ env: 'dev' }))
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

const setup = () => {
  nock(/cmr/)
    .post(/collections/)
    .reply(200, {
      feed: {
        updated: '2019-03-27T20:21:14.705Z',
        id: 'https://cmr.sit.earthdata.nasa.gov:443/search/collections.json?has_granules_or_cwic=true&include_facets=v2&include_granule_counts=true&include_has_granules=true&include_tags=edsc.%2A%2Corg.ceos.wgiss.cwic.granules.prod&keyword=&options[temporal][limit_to_granules]=true&page_num=1&page_size=20&sort_key=has_granules_or_cwic',
        title: 'ECHO dataset metadata',
        entry: [{
          mockCollectionData: 'goes here',
          id: 'mock-id',
          summary: 'mock summary data'
        }],
        facets: {}
      }
    }, {
      'cmr-hits': '1'
    })

  const props = {}

  render(<App {...props} />)

  return {
    props
  }
}

describe('App component', () => {
  test('sets the correct default title', async () => {
    setup()
    await waitFor(() => expect(document.title).toEqual('Earthdata Search'))
  })

  test('sets the correct meta description', async () => {
    setup()
    await waitFor(() => {
      const metaElement = document.querySelector('meta[name="description"]')

      expect(metaElement).toBeInTheDocument()
      expect(metaElement).toHaveAttribute('content', 'Search, discover, visualize, refine, and access NASA Earth Observation data in your browser with Earthdata Search')
    })
  })

  test('sets the correct meta og:type', async () => {
    setup()
    await waitFor(() => {
      const metaElement = document.querySelector('meta[property="og:type"]')

      expect(metaElement).toBeInTheDocument()
      expect(metaElement).toHaveAttribute('content', 'website')
    })
  })

  test('sets the correct meta og:title', async () => {
    setup()
    await waitFor(() => {
      const metaElement = document.querySelector('meta[property="og:title"]')

      expect(metaElement).toBeInTheDocument()
      expect(metaElement).toHaveAttribute('content', 'Earthdata Search')
    })
  })

  test('sets the correct meta og:description', async () => {
    setup()
    await waitFor(() => {
      const metaElement = document.querySelector('meta[property="og:description"]')

      expect(metaElement).toBeInTheDocument()
      expect(metaElement).toHaveAttribute('content', 'Search, discover, visualize, refine, and access NASA Earth Observation data in your browser with Earthdata Search')
    })
  })

  test('sets the correct meta og:url', async () => {
    setup()
    await waitFor(() => {
      const metaElement = document.querySelector('meta[property="og:url"]')

      expect(metaElement).toBeInTheDocument()
      expect(metaElement).toHaveAttribute('content', 'https://search.earthdata.nasa.gov/search')
    })
  })

  test('sets the correct meta og:image', async () => {
    setup()
    await waitFor(() => {
      const metaElement = document.querySelector('meta[property="og:image"]')

      expect(metaElement).toHaveAttribute('content', 'test-file-stub')
    })
  })

  test('sets the correct meta theme-color', async () => {
    setup()
    await waitFor(() => {
      const metaElement = document.querySelector('meta[name="theme-color"]')

      expect(metaElement).toBeInTheDocument()
      expect(metaElement).toHaveAttribute('content', '#191a1b')
    })
  })

  test('sets the correct meta canonical url', async () => {
    setup()
    await waitFor(() => {
      const metaElement = document.querySelector('link[rel="canonical"]')

      expect(metaElement).toBeInTheDocument()
      expect(metaElement).toHaveAttribute('href', 'https://search.earthdata.nasa.gov/search')
    })
  })

  // https://stackoverflow.com/questions/66667827/react-testing-library-to-cover-the-lazy-load/66690463
  test('renders loaded lazy components', async () => {
    setup()

    waitFor(() => {
      expect(screen.getByTestId('mocked-map-container')).toBeInTheDocument()
    })
  })
})
