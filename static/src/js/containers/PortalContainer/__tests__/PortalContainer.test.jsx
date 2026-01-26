import { waitFor } from '@testing-library/react'
import { useLocation, useParams } from 'react-router-dom'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import PortalContainer from '../PortalContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'
import { changePath } from '../../../util/url/changePath'
import { changeUrl } from '../../../util/url/changeUrl'

vi.mock('../../../util/url/changePath', () => ({
  changePath: vi.fn()
}))

vi.mock('../../../util/url/changeUrl', () => ({
  changeUrl: vi.fn()
}))

vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')), // Preserve other exports
  useLocation: vi.fn().mockReturnValue({
    pathname: '/search',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  }),
  useParams: vi.fn().mockReturnValue({
    portalId: 'edsc'
  })
}))

const setup = setupTest({
  Component: PortalContainer,
  defaultZustandState: {
    portal: {
      portalId: 'edsc'
    }
  }
})

describe('PortalContainer component', () => {
  test('renders the page title without a portal', async () => {
    vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    setup()

    await waitFor(() => expect(document.title).toEqual('Earthdata Search'))
  })

  test('renders the page title with a portal', async () => {
    vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    setup({
      overrideZustandState: {
        portal: {
          portalId: 'example',
          title: {
            primary: 'example'
          }
        }
      }
    })

    await waitFor(() => expect(document.title).toEqual('Earthdata Search - example Portal'))
  })

  test('updates the url if the url is using a portal path', async () => {
    vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    useLocation.mockReturnValue({
      pathname: '/portal/example/search',
      search: '?q=modis',
      hash: '',
      state: null,
      key: 'testKey'
    })

    useParams.mockReturnValue({
      portalId: 'example'
    })

    setup()

    await waitFor(() => {
      expect(changeUrl).toHaveBeenCalledTimes(1)
    })

    expect(changeUrl).toHaveBeenCalledWith({
      pathname: '/search',
      search: '?q=modis&portal=example'
    })

    expect(changePath).toHaveBeenCalledTimes(1)
    expect(changePath).toHaveBeenCalledWith('/search?q=modis&portal=example')
  })

  test('updates the url if the url is using a portal path without /search', async () => {
    vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    useLocation.mockReturnValue({
      pathname: '/portal/example',
      search: '?q=modis',
      hash: '',
      state: null,
      key: 'testKey'
    })

    useParams.mockReturnValue({
      portalId: 'example'
    })

    setup()

    await waitFor(() => {
      expect(changeUrl).toHaveBeenCalledTimes(1)
    })

    expect(changeUrl).toHaveBeenCalledWith({
      pathname: '/search',
      search: '?q=modis&portal=example'
    })

    expect(changePath).toHaveBeenCalledTimes(1)
    expect(changePath).toHaveBeenCalledWith('/search?q=modis&portal=example')
  })
})
