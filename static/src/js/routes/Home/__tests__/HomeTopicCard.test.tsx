import React from 'react'
import { Provider } from 'react-redux'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import '@testing-library/jest-dom'
import {
  MemoryRouter,
  Switch,
  Route
} from 'react-router-dom'

import HomeTopicCard from '../HomeTopicCard'

const mockStore = configureMockStore([thunk])

const store = mockStore({
  router: {
    location: {
      pathname: ''
    }
  }
})

const setup = () => {
  const mockProps = {
    title: 'Test Topic',
    image: 'mock-image-src',
    url: '/search?fst0=Test+Topic',
    color: '#123456'
  }

  return render(
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
}

describe('HomeTopicCard', () => {
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

  // TODO: Figure out how to test the navigation on click
  // It('navigates to the correct URL when clicked', async () => {
  //   const user = userEvent.setup()

  //   setup()

  //   const portalLinkContainer = screen.getByRole('link')

  //   await user.click(portalLinkContainer)

  //   screen.debug()
  //   expect(screen.getByText('Search')).toBeInTheDocument()
  // })
})
