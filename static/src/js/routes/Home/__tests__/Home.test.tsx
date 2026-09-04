import React from 'react'
import {
  act,
  screen,
  waitFor
} from '@testing-library/react'

import HomeTopicCard from '../HomeTopicCard'
import HomePortalCard from '../HomePortalCard'

import { Home } from '../Home'
// @ts-expect-error: Types do not exist for this file
import { getApplicationConfig } from '../../../../../../sharedUtils/config'
import Spinner from '../../../components/Spinner/Spinner'
import { routes } from '../../../constants/routes'
import { localStorageKeys } from '../../../constants/localStorageKeys'

import setupTest from '../../../../../../vitestConfigs/setupTest'

vi.mock('../../../components/Spinner/Spinner', () => ({ default: vi.fn(() => <div />) }))

/**
 * Props captured from the mocked NlpSearchStatus component.
 */
type NlpSearhStatusMockProps = {
  /** Called when NLP flow completes successfully. */
  onNlpSearchComplete?: (options: { hasSpatial: boolean }) => void
  /** Called when NLP flow fails and UI should reset. */
  onNlpSearchFailed?: () => void
  /** Called when NLP stream starts or stops. */
  onStreamingChange?: (isStreaming: boolean) => void
}

const mockNlpSearchStatus = vi.fn<(props: NlpSearhStatusMockProps) => React.JSX.Element>(() => <div data-testid="nlp-search-status"> NLP Search Status</div>)

vi.mock('../../../components/NlpSearchStatus/NlpSearchStatus', () => ({
  default: (props: NlpSearhStatusMockProps) => {
    mockNlpSearchStatus(props)

    return <div data-testid="nlp-search-status"> NLP Search Status</div>
  }
}))

vi.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => {
  const mockPortalLinkContainer = vi.fn(({ children }) => (
    <div>
      {children}
    </div>
  ))

  return { default: mockPortalLinkContainer }
})

vi.mock('../HomeTopicCard', () => {
  const MockHomeTopicCard = vi.fn(() => <a href="/" data-testid="mock-topic-card">Home topic card</a>)

  return { default: MockHomeTopicCard }
})

vi.mock('../HomePortalCard', () => {
  const MockHomePortalCard = vi.fn(() => <a href="/" data-testid="mock-portal-card">Home portal card</a>)

  return { default: MockHomePortalCard }
})

vi.mock('../../../containers/MapContainer/MapContainer', () => ({ default: vi.fn(() => <div />) }))

vi.mock('../../../../../../sharedUtils/config', async () => ({
  ...(await vi.importActual('../../../../../../sharedUtils/config')),
  getApplicationConfig: vi.fn(() => ({
    numberOfGranules: '42',
    nlpSearch: 'true'
  }))
}))

const mockUseNavigate = vi.fn()

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockUseNavigate
}))

const mockRouterNavigate = vi.hoisted(() => vi.fn())

vi.mock('../../../router/router', () => ({
  default: {
    router: {
      navigate: mockRouterNavigate
    }
  }
}))

const setup = setupTest({
  Component: Home,
  defaultZustandState: {
    collections: {
      getCollections: vi.fn().mockResolvedValue(undefined)
    }
  },
  withRouter: true
})

// TODO: Add tests for the spatial and temporal dropdowns

const OLD_ENV = process.env

beforeEach(() => {
  process.env = { ...OLD_ENV }
  // Set the NODE_ENV to 'test' to avoid preloading routes in test mode
  // We want to avoid preloading routes in tests to avoid flaky tests
  process.env.NODE_ENV = 'test'
  localStorage.removeItem(localStorageKeys.homeSearchMode)
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('Home', () => {
  test('renders the hero section with the correct text', () => {
    setup()

    expect(screen.getByText("Search NASA's 42 Earth observations")).toBeInTheDocument()
    expect(screen.getByText('Describe your search, or use keywords, time, and place')).toBeInTheDocument()
  })

  test('renders the search input and allows typing', async () => {
    const { user } = setup()

    const searchInput = screen.getByPlaceholderText('Wildfires in California during summer 2023')
    expect(searchInput).toBeInTheDocument()

    await user.type(searchInput, 'test keyword')

    expect(searchInput).toHaveValue('test keyword')
  })

  describe('when nlpSearch is enabled', () => {
    test('defaults to NLP search mode when no preference is saved', () => {
      setup()

      expect(screen.getByRole('radio', { name: 'AI Enhanced Search' })).toBeChecked()
      expect(screen.getByRole('radio', { name: 'Traditional Search' })).not.toBeChecked()
      expect(screen.getByPlaceholderText('Wildfires in California during summer 2023')).toBeInTheDocument()
    })

    test('uses the saved traditional search preference', () => {
      localStorage.setItem(localStorageKeys.homeSearchMode, 'traditional')

      setup()

      expect(screen.getByRole('radio', { name: 'AI Enhanced Search' })).not.toBeChecked()
      expect(screen.getByRole('radio', { name: 'Traditional Search' })).toBeChecked()
      expect(screen.getByPlaceholderText('Type to search for data')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Open temporal filters' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'spatial-selection-dropdown' })).toBeInTheDocument()
      expect(screen.getByTestId('home-hero-status-region')).toHaveClass('home__hero-status-region--inactive')
    })

    test('saves the selected search mode preference', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('radio', { name: 'Traditional Search' }))

      expect(localStorage.getItem(localStorageKeys.homeSearchMode)).toEqual('traditional')
      expect(screen.getByPlaceholderText('Type to search for data')).toBeInTheDocument()

      await user.click(screen.getByRole('radio', { name: 'AI Enhanced Search' }))

      expect(localStorage.getItem(localStorageKeys.homeSearchMode)).toEqual('nlp')
      expect(screen.getByPlaceholderText('Wildfires in California during summer 2023')).toBeInTheDocument()
    })

    test('renders the NEW badge for NLP feature', () => {
      setup()

      expect(screen.getByText('NEW')).toHaveClass('home__new-badge')
    })

    test('reserves hidden NLP status space before submit to prevent hero layout shift', () => {
      setup()

      const statusRegion = screen.getByTestId('home-hero-status-region')

      // Keep an always-mounted inactive region so the input row does not jump when status appears.
      expect(statusRegion).toBeInTheDocument()
      expect(statusRegion).toHaveClass('home__hero-status-region--inactive')
      expect(statusRegion).toHaveAttribute('aria-hidden', 'true')
      expect(mockNlpSearchStatus).not.toHaveBeenCalled()
    })

    test('navigates directly to search when submitting an empty NLP query', async () => {
      const { user } = setup()

      await user.click(screen.getByRole('button', { name: /search/i }))

      expect(mockUseNavigate).toHaveBeenCalledTimes(1)
      expect(mockUseNavigate).toHaveBeenCalledWith(routes.SEARCH)
      expect(mockNlpSearchStatus).not.toHaveBeenCalled()
    })

    test('starts NLP chat stream after submit and does not navigate immediately', async () => {
      const { user } = setup()

      const searchInput = screen.getByPlaceholderText('Wildfires in California during summer 2023')

      await user.type(searchInput, 'test')
      await user.click(screen.getByRole('button', { name: /search/i }))

      expect(mockNlpSearchStatus).toHaveBeenCalledTimes(1)
      expect(mockNlpSearchStatus).toHaveBeenCalledWith(expect.objectContaining({
        activePrompt: 'test',
        requestId: 1
      }))

      expect(mockUseNavigate).not.toHaveBeenCalled()
    })

    test('locks search input while NLP streaming is active', (async () => {
      const { user } = setup()

      const searchInput = screen.getByPlaceholderText('Wildfires in California during summer 2023')

      await user.type(searchInput, 'fire events')
      await user.click(screen.getByRole('button', { name: /search/i }))

      const latestCallProps = mockNlpSearchStatus.mock.calls.at(-1)?.[0]
      await act(async () => {
        latestCallProps?.onStreamingChange?.(true)
      })

      await waitFor(() => {
        expect(searchInput).toBeDisabled()
      })

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeEnabled()
      expect(Spinner).not.toHaveBeenCalled()
    }))

    test('does not navigate when cancelling an in-progress NLP search', async () => {
      const { user } = setup()
      mockUseNavigate.mockClear()

      const searchInput = screen.getByPlaceholderText('Wildfires in California during summer 2023')

      await user.type(searchInput, 'fire events')
      await user.click(screen.getByRole('button', { name: /search/i }))

      const latestCallProps = mockNlpSearchStatus.mock.calls.at(-1)?.[0]
      await act(async () => {
        latestCallProps?.onStreamingChange?.(true)
      })

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      expect(mockUseNavigate).not.toHaveBeenCalled()
      expect(searchInput).toHaveValue('fire events')
    })

    test('does not navigate if NLP completes after cancel is clicked', async () => {
      const { user } = setup()
      mockUseNavigate.mockClear()
      mockRouterNavigate.mockClear()

      const searchInput = screen.getByPlaceholderText('Wildfires in California during summer 2023')
      const searchButton = screen.getByRole('button', { name: /search/i })

      await user.type(searchInput, 'test search')
      await user.click(searchButton)

      const latestCallProps = mockNlpSearchStatus.mock.calls.at(-1)?.[0]
      await act(async () => {
        latestCallProps?.onStreamingChange?.(true)
      })

      await user.click(screen.getByRole('button', { name: /cancel/i }))

      await act(async () => {
        latestCallProps?.onNlpSearchComplete?.({ hasSpatial: true })
      })

      expect(mockRouterNavigate).not.toHaveBeenCalled()
      expect(mockUseNavigate).not.toHaveBeenCalled()
    })

    test('resets UI when Nlp search fails', async () => {
      const { user } = setup()

      const searchInput = screen.getByPlaceholderText('Wildfires in California during summer 2023')
      const searchButton = screen.getByRole('button', { name: /search/i })

      await user.type(searchInput, 'test search')
      await user.click(searchButton)

      const latestCallProps = mockNlpSearchStatus.mock.calls.at(-1)?.[0]
      await act(async () => {
        latestCallProps?.onStreamingChange?.(true)
      })

      await waitFor(() => {
        expect(searchInput).toBeDisabled()
      })

      await act(async () => {
        latestCallProps?.onNlpSearchFailed?.()
      })

      await waitFor(() => {
        expect(searchInput).toBeEnabled()
      })

      expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument()
      expect(mockRouterNavigate).not.toHaveBeenCalled()
      expect(mockUseNavigate).not.toHaveBeenCalled()
      expect(searchInput).toHaveValue('test search')
    })

    test('navigates when NLP stream completes', async () => {
      const { user } = setup()

      const searchInput = screen.getByPlaceholderText('Wildfires in California during summer 2023')

      await user.type(searchInput, 'test')
      await user.click(screen.getByRole('button', { name: /search/i }))

      const latestCallProps = mockNlpSearchStatus.mock.calls.at(-1)?.[0]
      await act(async () => {
        latestCallProps?.onNlpSearchComplete?.({ hasSpatial: true })
      })

      await waitFor(() => {
        expect(mockRouterNavigate).toHaveBeenCalledTimes(1)
      })

      expect(mockRouterNavigate).toHaveBeenCalledWith(routes.SEARCH, {})
      expect(mockUseNavigate).not.toHaveBeenCalled()
    })

    test('does not request map auto-center when NLP completes without spatial', async () => {
      const setNlpAutoCenterPending = vi.fn()
      const { user } = setup({
        overrideZustandState: {
          map: {
            setNlpAutoCenterPending
          }
        }
      })

      const searchInput = screen.getByPlaceholderText('Wildfires in California during summer 2023')

      await user.type(searchInput, 'rainfall')
      await user.click(screen.getByRole('button', { name: /search/i }))

      const latestCallProps = mockNlpSearchStatus.mock.calls.at(-1)?.[0]
      await act(async () => {
        latestCallProps?.onNlpSearchComplete?.({ hasSpatial: false })
      })

      await waitFor(() => {
        expect(mockRouterNavigate).toHaveBeenCalledTimes(1)
      })

      expect(setNlpAutoCenterPending).toHaveBeenCalledWith(false)
    })
  })

  describe('when nlpSearch is disabled', () => {
    beforeEach(() => {
      getApplicationConfig.mockReturnValue({
        nlpSearch: 'false'
      })
    })

    test('renders temporal and spatial buttons', () => {
      setup()

      expect(screen.queryByRole('radio', { name: 'AI Enhanced Search' })).not.toBeInTheDocument()
      expect(screen.queryByRole('radio', { name: 'Traditional Search' })).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Open temporal filters' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'spatial-selection-dropdown' })).toBeInTheDocument()
    })

    test('calls getCollections and navigate when the search form is submitted with no value', async () => {
      const { user, zustandState } = setup()

      await user.click(screen.getByRole('button', { name: /search/i }))

      expect(zustandState.collections.getCollections).toHaveBeenCalledTimes(1)
      expect(zustandState.collections.getCollections).toHaveBeenCalledWith()

      expect(mockUseNavigate).toHaveBeenCalledTimes(1)
      expect(mockUseNavigate).toHaveBeenCalledWith(routes.SEARCH)
    })

    test('calls getCollections and navigate when the search form is submitted with values', async () => {
      const { user, zustandState } = setup()

      const searchInput = screen.getByPlaceholderText('Type to search for data')

      await user.type(searchInput, 'test')
      await user.click(screen.getByRole('button', { name: /search/i }))

      expect(zustandState.collections.getCollections).toHaveBeenCalledTimes(1)
      expect(zustandState.collections.getCollections).toHaveBeenCalledWith()

      expect(mockUseNavigate).toHaveBeenCalledTimes(1)
      expect(mockUseNavigate).toHaveBeenCalledWith(routes.SEARCH)
    })
  })

  test('displays a spinner in the search button when loading', async () => {
    setup({
      overrideZustandState: {
        collections: {
          collections: {
            isLoading: true
          }
        }
      }
    })

    expect(Spinner).toHaveBeenCalledTimes(1)
    expect(Spinner).toHaveBeenCalledWith({
      color: 'white',
      inline: true,
      size: 'tiny',
      type: 'dots'
    }, {})
  })

  test('renders the topic cards', () => {
    setup()

    const topicCards = screen.getAllByTestId('mock-topic-card')

    expect(topicCards.length).toBe(10)
    expect(HomeTopicCard).toHaveBeenCalledTimes(10)
    expect(HomeTopicCard).toHaveBeenNthCalledWith(1, {
      image: 'test-file-stub',
      title: 'Atmosphere',
      url: '/search?fst0=Atmosphere'
    }, {})
  })

  test('renders 10 portal cards', () => {
    setup()

    const portalCards = screen.getAllByRole('link', { name: 'Home portal card' })

    expect(portalCards.length).toBe(10)
    expect(HomePortalCard).toHaveBeenNthCalledWith(1, expect.objectContaining({
      portalId: 'above',
      title: {
        primary: 'test',
        secondary: 'test secondary title'
      },
      moreInfoUrl: 'https://test-above.gov'
    }), {})
  })

  test('toggles the visibility of hidden portals when "Show all portals" is clicked', async () => {
    const { user } = setup()

    const showAllButton = screen.getByText('Show all portals')
    expect(showAllButton).toBeInTheDocument()

    await user.click(showAllButton)

    const portalCards = screen.getAllByRole('link', { name: 'Home portal card' })

    expect(portalCards.length).toBe(12)

    const showFewerButton = screen.getByText('Show fewer portals')
    expect(showFewerButton).toBeInTheDocument()
  })
})
