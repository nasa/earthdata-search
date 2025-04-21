import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import '@testing-library/jest-dom'
import {
  MemoryRouter,
  Switch,
  Route,
  Link
} from 'react-router-dom'

import userEvent from '@testing-library/user-event'

import HomeTopicCard from '../HomeTopicCard'
import useEdscStore from '../../../zustand/useEdscStore'

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(({ children, to, onClick }) => (<Link to={to} onClick={onClick}>{ children }</Link>)))

const mockStore = configureMockStore([thunk])

const store = mockStore({
  router: {
    location: {
      pathname: ''
    }
  }
})

const setup = () => {
  const user = userEvent.setup()

  const mockSetOpenKeywordFacet = jest.fn()
  const state = useEdscStore.getState()
  useEdscStore.setState({
    ...state,
    home: {
      ...state.home,
      setOpenKeywordFacet: mockSetOpenKeywordFacet,
      openKeywordFacet: true
    }
  })

  const mockProps = {
    title: 'Test Topic',
    image: 'mock-image-src',
    url: '/search?fst0=Test+Topic',
    color: '#123456'
  }

  render(
    <Provider store={store}>
      <MemoryRouter>
        <Switch>
          <Route exact path="/">
            <HomeTopicCard {...mockProps} />
          </Route>
          <Route path="/search">
            <div>Search</div>
          </Route>
        </Switch>
      </MemoryRouter>
    </Provider>
  )

  return {
    mockSetOpenKeywordFacet,
    user
  }
}

describe('HomeTopicCard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders the topic card with the correct title', () => {
    setup()

    expect(screen.getByText('Test Topic')).toBeInTheDocument()
  })

  test('renders the topic card with the correct image and alt text', () => {
    setup()

    const image = screen.getByRole('img')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'mock-image-src')
    expect(image).toHaveAttribute('alt', 'Test Topic')
  })

  test('navigates to the correct URL when clicked', async () => {
    const { user } = setup()

    const portalLinkContainer = screen.getByRole('link')

    await user.click(portalLinkContainer)

    expect(await screen.findByText('Search')).toBeDefined()
  })

  test('calls setOpenKeywordFacet when clicked', async () => {
    const { mockSetOpenKeywordFacet, user } = setup()

    const portalLinkContainer = screen.getByRole('link')

    await user.click(portalLinkContainer)

    expect(mockSetOpenKeywordFacet).toHaveBeenCalledTimes(1)
    expect(mockSetOpenKeywordFacet).toHaveBeenCalledWith(true)
  })
})
