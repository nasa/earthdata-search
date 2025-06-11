import React from 'react'
import { act, screen } from '@testing-library/react'
import { type Dispatch } from 'redux'
import { useHistory } from 'react-router-dom'

import HomeTopicCard from '../HomeTopicCard'
import HomePortalCard from '../HomePortalCard'

import { Home } from '../Home'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: jest.fn().mockReturnValue({
    push: jest.fn()
  })
}))

jest.mock('../../../containers/SpatialSelectionDropdownContainer/SpatialSelectionDropdownContainer', () => {
  const MockSpatialSelectionDropdown = () => <div data-testid="spatial-selection-dropdown">Spatial Selection Dropdown</div>
  MockSpatialSelectionDropdown.displayName = 'MockSpatialSelectionDropdown'

  return MockSpatialSelectionDropdown
})

jest.mock('../../../containers/TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer', () => {
  const MockTemporalSelectionDropdown = () => <div data-testid="temporal-selection-dropdown">Temporal Selection Dropdown</div>
  MockTemporalSelectionDropdown.displayName = 'MockTemporalSelectionDropdown'

  return MockTemporalSelectionDropdown
})

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => {
  const mockPortalLinkContainer = jest.fn(({ children }) => (
    <div data-testid="mockPortalLinkContainer">
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

jest.mock('../../../actions', () => ({
  ...jest.requireActual('../../../actions'),
  changePath: jest.fn(() => (dispatch: Dispatch) => {
    dispatch({ type: 'CHANGE_PATH' })
  })
}))

jest.mock('../../../containers/MapContainer/MapContainer', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: Home,
  defaultProps: {
    onChangePath: jest.fn()
  },
  withRedux: true,
  withRouter: true
})

// TODO: Add tests for the spatial and temporal dropdowns

describe('Home', () => {
  test('renders the hero section with the correct text', () => {
    setup()

    expect(screen.getByText("Search NASA's 1.8 billion+ Earth observations")).toBeInTheDocument()
    expect(screen.getByText("Use keywords and filter by time and spatial area to search NASA's Earth science data")).toBeInTheDocument()
  })

  test('renders the search input and allows typing', async () => {
    const { user } = setup()

    const searchInput = screen.getByPlaceholderText('Type to search for data')
    expect(searchInput).toBeInTheDocument()

    await user.type(searchInput, 'test keyword')
    expect(searchInput).toHaveValue('test keyword')
  })

  test('calls onChangePath and history.push when the search form is submitted', async () => {
    const { props, user } = setup()

    const searchInput = screen.getByPlaceholderText('Type to search for data')

    await act(async () => {
      await user.type(searchInput, 'test')
      await user.click(screen.getByRole('button', { name: /search/i }))
    })

    expect(props.onChangePath).toHaveBeenCalledTimes(1)
    expect(props.onChangePath).toHaveBeenCalledWith('/search?q=test')

    expect(useHistory().push).toHaveBeenCalledTimes(1)
    expect(useHistory().push).toHaveBeenCalledWith('/search?q=test')
  })

  test('calls onChangePath and history.push when the enter key is pressed', async () => {
    const { props, user } = setup()

    const searchInput = screen.getByPlaceholderText('Type to search for data')

    await act(async () => {
      await user.type(searchInput, 'test')
      await user.click(screen.getByRole('button', { name: /search/i }))
    })

    expect(props.onChangePath).toHaveBeenCalledTimes(1)
    expect(props.onChangePath).toHaveBeenCalledWith('/search?q=test')
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

    await act(async () => {
      await user.click(showAllButton)
    })

    const portalCards = screen.getAllByRole('link', { name: 'Home portal card' })

    expect(portalCards.length).toBe(12)

    const showFewerButton = screen.getByText('Show fewer portals')
    expect(showFewerButton).toBeInTheDocument()
  })

  test('renders the spatial and temporal dropdowns', () => {
    setup()

    expect(screen.getByTestId('spatial-selection-dropdown')).toBeInTheDocument()
    expect(screen.getByTestId('temporal-selection-dropdown')).toBeInTheDocument()
  })
})
