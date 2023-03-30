import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { Router } from 'react-router'
import { Provider } from 'react-redux'
import { createMemoryHistory } from 'history'

import { PortalList } from '../PortalList'

import configureStore from '../../../store/configureStore'

import actions from '../../../actions'

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

  render(
    <Provider store={store}>
      <Router history={history} location={props.location}>
        <PortalList {...props} />
      </Router>
    </Provider>
  )

  return { history, props }
}

describe('PortalList component', () => {
  test('renders a list of portals', () => {
    setup()

    expect(screen.getByTestId('portal-title-above')).toHaveTextContent('ABoVE (Arctic-Boreal Vulnerability Experiment)')
    expect(screen.getByTestId('portal-link-above').querySelector('a')).toHaveAttribute('href', 'https://above.nasa.gov/')
  })

  test('does not render a portal that is excluded from the browser', () => {
    setup()

    expect(screen.queryByTestId('portal-title-example')).toBeNull()
    expect(screen.queryByTestId('portal-link-example')).toBeNull()
  })

  test('clicking on the portal opens the portal', async () => {
    jest.spyOn(actions, 'changePath').mockImplementation(() => jest.fn())
    const user = userEvent.setup()

    const { history, props } = setup()

    const portalTitle = screen.queryByTestId('portal-list-item-standardproducts')
    await user.click(portalTitle)

    expect(history.location).toEqual(expect.objectContaining({
      pathname: '/search',
      search: '?portal=standardproducts'
    }))

    expect(props.onModalClose).toHaveBeenCalledTimes(1)
  })

  test('clicking on the `More Info` does not open the portal', async () => {
    const user = userEvent.setup()

    const { history, props } = setup()

    const moreInfoLink = screen.getByTestId('portal-link-above').querySelector('a')
    await user.click(moreInfoLink)

    expect(history.location).toEqual(expect.objectContaining({
      pathname: '/search'
    }))

    expect(props.onModalClose).toHaveBeenCalledTimes(0)
  })
})
