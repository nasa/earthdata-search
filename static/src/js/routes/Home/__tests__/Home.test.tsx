import React from 'react'
import { screen } from '@testing-library/react'

import HomeTopicCard from '../HomeTopicCard'
import HomePortalCard from '../HomePortalCard'

import { Home } from '../Home'
import setupTest from '../../../../../../vitestConfigs/setupTest'
import Spinner from '../../../components/Spinner/Spinner'

vi.mock('../../../components/Spinner/Spinner', () => ({ default: vi.fn(() => <div />) }))

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
    numberOfGranules: '42'
  }))
}))

const mockUseNavigate = vi.fn()
const placeholderText = 'Wildfires in California during summer 2023'

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => mockUseNavigate
}))

const setup = setupTest({
  Component: Home,
  defaultZustandState: {
    collections: {
      getCollections: vi.fn().mockResolvedValue(undefined),
      getNlpCollections: vi.fn().mockResolvedValue(undefined)
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
})

afterEach(() => {
  process.env = OLD_ENV
})

describe('Home', () => {
  test('renders the hero section with the correct text', () => {
    setup()

    expect(screen.getByText("Search NASA's 42 Earth observations")).toBeInTheDocument()
    expect(screen.getByText("Describe what you're looking for to start your search")).toBeInTheDocument()
  })

  test('renders the NEW badge for NLP feature', () => {
    setup()

    expect(screen.getByText('NEW')).toHaveClass('home__new-badge')
  })

  test('renders the search input and allows typing', async () => {
    const { user } = setup()

    const searchInput = screen.getByPlaceholderText(placeholderText)
    expect(searchInput).toBeInTheDocument()

    await user.type(searchInput, 'test keyword')

    expect(searchInput).toHaveValue('test keyword')
  })

  test('calls getCollections and navigate when the search form is submitted with no value', async () => {
    const { user, zustandState } = setup()

    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(zustandState.collections.getCollections).toHaveBeenCalledTimes(1)
    expect(zustandState.collections.getCollections).toHaveBeenCalledWith()

    expect(mockUseNavigate).toHaveBeenCalledTimes(1)
    expect(mockUseNavigate).toHaveBeenCalledWith('/search')
  })

  test('calls getNlpCollections and navigate when the search form is submitted', async () => {
    const { user, zustandState } = setup()

    const searchInput = screen.getByPlaceholderText(placeholderText)

    await user.type(searchInput, 'test')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(zustandState.collections.getNlpCollections).toHaveBeenCalledTimes(1)
    expect(zustandState.collections.getNlpCollections).toHaveBeenCalledWith('test')

    expect(mockUseNavigate).toHaveBeenCalledTimes(1)
    expect(mockUseNavigate).toHaveBeenCalledWith('/search')
  })

  test('calls getNlpCollections and navigate when the enter key is pressed', async () => {
    const { user, zustandState } = setup()

    const searchInput = screen.getByPlaceholderText(placeholderText)

    await user.type(searchInput, 'test')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(zustandState.collections.getNlpCollections).toHaveBeenCalledTimes(1)
    expect(zustandState.collections.getNlpCollections).toHaveBeenCalledWith('test')

    expect(mockUseNavigate).toHaveBeenCalledTimes(1)
    expect(mockUseNavigate).toHaveBeenCalledWith('/search')
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
