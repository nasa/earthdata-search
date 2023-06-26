import React from 'react'
import {
  fireEvent,
  render,
  screen,
  waitFor
} from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'

import { PortalList } from '../PortalList'

import configureStore from '../../../store/configureStore'

import actions from '../../../actions'

import * as availablePortals from '../../../../../../portals'

jest.mock('../../../../../../portals/above/images/logo.png', () => ('above_logo_path'))

const store = configureStore()

const setup = () => {
  const props = {
    location: {
      pathname: '/search'
    },
    onModalClose: jest.fn()
  }

  const history = createMemoryHistory({
    initialEntries: ['/search']
  })

  act(() => {
    render(
      <Provider store={store}>
        <Router history={history} location={props.location}>
          <PortalList {...props} />
        </Router>
      </Provider>
    )
  })

  return { history, props }
}

describe('PortalList component', () => {
  test('renders a list of portals', async () => {
    setup()

    await waitFor(() => {
      expect(screen.getByTestId('portal-title-above')).toHaveTextContent('ABoVE (Arctic-Boreal Vulnerability Experiment)')
      expect(screen.getByTestId('portal-link-above').querySelector('a')).toHaveAttribute('href', 'https://above.nasa.gov/')
    })
  })

  test('does not render a portal that is excluded from the browser', async () => {
    setup()

    await waitFor(() => {
      expect(screen.queryByTestId('portal-title-example')).toBeNull()
      expect(screen.queryByTestId('portal-link-example')).toBeNull()
    })
  })

  test('clicking on the portal opens the portal', async () => {
    jest.spyOn(actions, 'changePath').mockImplementation(() => jest.fn())
    const user = userEvent.setup()

    const { history, props } = setup()

    const portalTitle = screen.queryByTestId('portal-list-item-standardproducts')

    await waitFor(async () => {
      await user.click(portalTitle)

      expect(history.location).toEqual(expect.objectContaining({
        pathname: '/search',
        search: '?portal=standardproducts'
      }))
    })

    expect(props.onModalClose).toHaveBeenCalledTimes(1)
  })

  test('clicking on the `More Info` does not open the portal', async () => {
    const user = await userEvent.setup()
    const { history, props } = setup()

    const moreInfoLink = screen.getByTestId('portal-link-above').querySelector('a')

    await waitFor(async () => {
      await user.click(moreInfoLink)

      expect(history.location).toEqual(expect.objectContaining({
        pathname: '/search'
      }))

      expect(props.onModalClose).toHaveBeenCalledTimes(0)
    })
  })

  test('displays a title attribute for the `More Info` link', async () => {
    setup()

    const moreInfoLink = screen.getByTestId('portal-link-above').querySelector('a')

    await waitFor(() => {
      expect(moreInfoLink).toHaveAttribute('title', 'Find more information about ABoVE (Arctic-Boreal Vulnerability Experiment)')
    })
  })

  test('Clicking the `More Info` link opens a new window', async () => {
    setup()

    const moreInfoLink = screen.getByTestId('portal-link-above').querySelector('a')

    await waitFor(() => {
      expect(moreInfoLink).toHaveAttribute('target', '_blank')
    })
  })

  describe('When loading a portal thumbnail', () => {
    test('displays a spinner', async () => {
      setup()

      await waitFor(() => {
        const spinner = screen.getByTestId('portal-thumbnail-spinner')
        expect(spinner).toBeInTheDocument()
      })
    })

    test('does not display an image', async () => {
      setup()

      await waitFor(() => {
        const thumbnail = screen.queryByTestId('portal-thumbnail')
        expect(thumbnail.classList).not.toContain('portal-list__thumbnail--is-loaded')
      })
    })
  })

  describe('When a portal thumbnail has finished loading', () => {
    test('does not display a spinner', async () => {
      setup()

      await waitFor(() => {
        const thumbnail = screen.getByTestId('portal-thumbnail')

        fireEvent.load(thumbnail)

        const spinner = screen.queryByTestId('portal-thumbnail-spinner')
        expect(spinner).not.toBeInTheDocument()
      })
    })

    test('displays an image', async () => {
      setup()

      await waitFor(() => {
        const thumbnail = screen.getByTestId('portal-thumbnail')

        fireEvent.load(thumbnail)

        expect(thumbnail.classList).toContain('portal-list__thumbnail--is-loaded')
      })
    })
  })

  describe('When loading a portal without the portalBrowser flag', () => {
    test('does not display the portal', async () => {
      // eslint-disable-next-line no-import-assign
      availablePortals.availablePortals = {
        included: {
          portalId: 'included',
          portalBrowser: true,
          title: {
            primary: 'Included'
          }
        },
        excluded: {
          portalId: 'excluded',
          title: {
            primary: 'Excluded'
          }
        }
      }

      setup()

      await waitFor(() => {
        const portalList = screen.getByTestId('portal-list')
        const portalItems = portalList.getElementsByTagName('button')

        expect(portalList).toBeInTheDocument()
        expect(portalItems.length).toEqual(1)
        expect(portalItems[0].textContent).toEqual('Included')
      })
    })
  })
})
