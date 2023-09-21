import React from 'react'
import { render, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'

import actions from '../../../actions'
import {
  mapDispatchToProps,
  mapStateToProps,
  PortalContainer
} from '../PortalContainer'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

function setup(overrideProps) {
  const props = {
    match: {
      params: {}
    },
    location: {},
    portal: {
      portalId: 'edsc'
    },
    onChangePath: jest.fn(),
    onChangeUrl: jest.fn(),
    ...overrideProps
  }

  render(<PortalContainer {...props} />)

  return { props }
}

beforeEach(() => {
  jest.clearAllMocks()
  jest.restoreAllMocks()
})

describe('mapDispatchToProps', () => {
  test('onChangePath calls actions.changePath', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changePath')

    mapDispatchToProps(dispatch).onChangePath('portalId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('portalId')
  })

  test('onChangeUrl calls actions.changeUrl', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(actions, 'changeUrl')

    mapDispatchToProps(dispatch).onChangeUrl('portalId')

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith('portalId')
  })
})

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      portal: {}
    }

    const expectedState = {
      portal: {}
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('PortalContainer component', () => {
  test('renders the page title without a portal', async () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    setup()

    await waitFor(() => expect(document.title).toEqual('Earthdata Search'))
  })

  test('renders the page title with a portal', async () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    setup({
      portal: {
        portalId: 'example',
        title: {
          primary: 'example'
        }
      }
    })

    await waitFor(() => expect(document.title).toEqual('Earthdata Search :: example Portal'))
  })

  test('updates the url if the url is using a portal path', async () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    const { props } = setup({
      match: {
        params: {
          portalId: 'example'
        }
      },
      location: {
        pathname: '/portal/example/search',
        search: '?q=modis'
      }
    })

    expect(props.onChangeUrl).toHaveBeenCalledTimes(1)
    expect(props.onChangeUrl).toHaveBeenCalledWith({
      pathname: '/search',
      search: '?q=modis&portal=example'
    })

    expect(props.onChangePath).toHaveBeenCalledTimes(1)
    expect(props.onChangePath).toHaveBeenCalledWith('/search?q=modis&portal=example')
  })

  test('updates the url if the url is using a portal path without /search', async () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
      env: 'dev',
      defaultPortal: 'edsc'
    }))

    const { props } = setup({
      match: {
        params: {
          portalId: 'example'
        }
      },
      location: {
        pathname: '/portal/example',
        search: '?q=modis'
      }
    })

    expect(props.onChangeUrl).toHaveBeenCalledTimes(1)
    expect(props.onChangeUrl).toHaveBeenCalledWith({
      pathname: '/search',
      search: '?q=modis&portal=example'
    })

    expect(props.onChangePath).toHaveBeenCalledTimes(1)
    expect(props.onChangePath).toHaveBeenCalledWith('/search?q=modis&portal=example')
  })
})
