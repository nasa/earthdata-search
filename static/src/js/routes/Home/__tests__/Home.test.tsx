import React from 'react'
import { screen } from '@testing-library/react'

import HomeTopicCard from '../HomeTopicCard'
import HomePortalCard from '../HomePortalCard'

import { Home } from '../Home'
import setupTest from '../../../../../../jestConfigs/setupTest'
import Spinner from '../../../components/Spinner/Spinner'

jest.mock('../../../components/Spinner/Spinner', () => jest.fn(() => <div />))
jest.mock('../../../containers/SpatialSelectionDropdownContainer/SpatialSelectionDropdownContainer', () => jest.fn(() => <div />))

jest.mock('../../../containers/TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer', () => jest.fn(() => <div />))

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => {
  const mockPortalLinkContainer = jest.fn(({ children }) => (
    <div>
      {children}
    </div>
  ))

  return mockPortalLinkContainer
})

jest.mock('../HomeTopicCard', () => {
  const MockHomeTopicCard = jest.fn(() => <a href="/" data-testid="mock-topic-card">Home topic card</a>)

  return MockHomeTopicCard
})

jest.mock('../HomePortalCard', () => {
  const MockHomePortalCard = jest.fn(() => <a href="/" data-testid="mock-portal-card">Home portal card</a>)

  return MockHomePortalCard
})

jest.mock('../../../containers/MapContainer/MapContainer', () => jest.fn(() => <div />))

jest.mock('../../../../../../sharedUtils/config', () => ({
  ...jest.requireActual('../../../../../../sharedUtils/config'),
  getApplicationConfig: jest.fn(() => ({
    numberOfGranules: '42'
  }))
}))

const mockUseNavigate = jest.fn()

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockUseNavigate
}))

const setup = setupTest({
  Component: Home,
  defaultProps: {
    onChangePath: jest.fn()
  },
  defaultZustandState: {
    collections: {
      getCollections: jest.fn().mockResolvedValue(undefined),
      getNlpCollections: jest.fn().mockResolvedValue(undefined)
    }
  },
  withRedux: true,
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
    expect(screen.getByText("Use keywords and filter by time and spatial area to search NASA's Earth science data")).toBeInTheDocument()
  })

  test('renders the search input and allows typing', async () => {
    const { user } = setup()

    const searchInput = screen.getByPlaceholderText('Type to search for data')
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

    const searchInput = screen.getByPlaceholderText('Type to search for data')

    await user.type(searchInput, 'test')
    await user.click(screen.getByRole('button', { name: /search/i }))

    expect(zustandState.collections.getNlpCollections).toHaveBeenCalledTimes(1)
    expect(zustandState.collections.getNlpCollections).toHaveBeenCalledWith('test')

    expect(mockUseNavigate).toHaveBeenCalledTimes(1)
    expect(mockUseNavigate).toHaveBeenCalledWith('/search')
  })

  test('calls getNlpCollections and navigate when the enter key is pressed', async () => {
    const { user, zustandState } = setup()

    const searchInput = screen.getByPlaceholderText('Type to search for data')

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
      portalId: 'testPortal',
      title: {
        primary: 'test',
        secondary: 'test secondary title'
      },
      moreInfoUrl: 'https://test.gov'
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
