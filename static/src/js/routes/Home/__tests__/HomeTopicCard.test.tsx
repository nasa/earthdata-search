import React from 'react'
import { screen } from '@testing-library/react'
import { Link } from 'react-router-dom'

import HomeTopicCard from '../HomeTopicCard'
import useEdscStore from '../../../zustand/useEdscStore'
import setupTest from '../../../../../../jestConfigs/setupTest'

jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn(({ children, to, onClick }) => (<Link to={to} onClick={onClick}>{ children }</Link>)))

const setup = setupTest({
  ComponentsByRoute: {
    '/': HomeTopicCard,
    '/search': <div>Search</div>
  },
  defaultPropsByRoute: {
    '/': {
      title: 'Test Topic',
      image: 'mock-image-src',
      url: '/search?fst0=Test+Topic',
      color: '#123456'
    }
  },
  defaultReduxState: {
    router: {
      location: {
        pathname: '/'
      }
    }
  },
  withRedux: true,
  withRouter: true
})

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
    const { user } = setup({
      overrideZustandState: {
        home: {
          setOpenKeywordFacet: jest.fn()
        }
      }
    })

    const portalLinkContainer = screen.getByRole('link')

    await user.click(portalLinkContainer)

    const state = useEdscStore.getState()
    const { home } = state
    const { setOpenKeywordFacet } = home

    expect(setOpenKeywordFacet).toHaveBeenCalledTimes(1)
    expect(setOpenKeywordFacet).toHaveBeenCalledWith(true)
  })
})
