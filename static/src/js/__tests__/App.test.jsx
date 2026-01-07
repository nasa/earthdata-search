import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { waitFor } from '@testing-library/react'

import { getApplicationConfig } from '../../../../sharedUtils/config'
import setupTest from '../../../../jestConfigs/setupTest'

import App from '../App'
import GraphQlProvider from '../providers/GraphQlProvider'
import { routes } from '../constants/routes'
import RouterErrorBoundary from '../components/Errors/RouterErrorBoundary'
import AppLayout from '../layouts/AppLayout/AppLayout'

jest.mock('../../../../sharedUtils/config', () => ({
  getEnvironmentConfig: jest.fn().mockReturnValue({
    edscHost: 'https://search.earthdata.nasa.gov'
  }),
  getApplicationConfig: jest.fn().mockReturnValue({
    env: 'dev'
  })
}))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  RouterProvider: jest.fn(() => <div />)
}))

jest.mock('../routes/Home/Home', () => jest.fn(() => <div />))

jest.mock('../providers/GraphQlProvider', () => jest.fn(({ children }) => (
  <div>{children}</div>
)))

const setup = setupTest({
  Component: App
})

const HelmetWrapper = () => (
  <>
    <Helmet>
      <title>Earthdata Search</title>
    </Helmet>
    <App />
  </>
)

const setupWithHelmet = setupTest({
  Component: HelmetWrapper
})

const removeMock = jest.fn()

beforeEach(() => {
  jest.spyOn(document, 'getElementById').mockImplementation((id) => {
    if (id === 'root') {
      return {
        classList: {
          remove: removeMock
        }
      }
    }

    return null
  })
})

describe('App component', () => {
  test('renders the router', () => {
    setup()

    expect(RouterProvider).toHaveBeenCalledTimes(1)
    // This isn't testing which components are lazy loaded, just that the routes are set up correctly
    expect(RouterProvider).toHaveBeenCalledWith({
      router: expect.objectContaining({
        routes: [
          expect.objectContaining({
            path: routes.HOME,
            element: <AppLayout />,
            errorElement: <RouterErrorBoundary />,
            children: [
              expect.objectContaining({
                index: true
              }),
              expect.objectContaining({
                path: '/portal/:portalId/*'
              }),
              expect.objectContaining({
                path: `${routes.SEARCH}/*`
              }),
              expect.objectContaining({
                path: routes.PROJECT
              }),
              expect.objectContaining({
                path: routes.PROJECTS
              }),
              expect.objectContaining({
                path: routes.DOWNLOADS,
                children: [
                  expect.objectContaining({
                    index: true,
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: `${routes.DOWNLOADS}/:id`,
                    lazy: expect.any(Function)
                  })
                ]
              }),
              expect.objectContaining({
                path: routes.CONTACT_INFO
              }),
              expect.objectContaining({
                path: routes.PREFERENCES
              }),
              expect.objectContaining({
                path: routes.SUBSCRIPTIONS
              }),
              expect.objectContaining({
                path: routes.ADMIN,
                children: [
                  expect.objectContaining({
                    index: true,
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: routes.ADMIN_RETRIEVALS,
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: `${routes.ADMIN_RETRIEVALS}/:obfuscatedId`,
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: routes.ADMIN_PROJECTS,
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: `${routes.ADMIN_PROJECTS}/:obfuscatedId`,
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: routes.ADMIN_RETRIEVAL_METRICS,
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: routes.ADMIN_PREFERENCES_METRICS,
                    lazy: expect.any(Function)
                  })
                ]
              })
            ]
          }),
          expect.objectContaining({
            path: routes.AUTH_CALLBACK
          }),
          expect.objectContaining({
            path: routes.EARTHDATA_DOWNLOAD_CALLBACK
          }),
          expect.objectContaining({
            path: '*'
          })
        ]
      })
    }, {})
  })

  test('sets the correct default title', async () => {
    getApplicationConfig.mockReturnValueOnce({
      env: 'prod'
    })

    setupWithHelmet()

    await waitFor(() => expect(document.title).toEqual('Earthdata Search - Earthdata Search'))
  })

  test('prefixes the title in SIT', async () => {
    getApplicationConfig.mockReturnValueOnce({
      env: 'sit'
    })

    setupWithHelmet()

    await waitFor(() => expect(document.title).toEqual('[SIT] Earthdata Search - Earthdata Search'))
  })

  test('prefixes the title in UAT', async () => {
    getApplicationConfig.mockReturnValueOnce({
      env: 'uat'
    })

    setupWithHelmet()

    await waitFor(() => expect(document.title).toEqual('[UAT] Earthdata Search - Earthdata Search'))
  })

  test('sets the correct meta description', async () => {
    setup()

    const helmet = Helmet.peek()
    const description = helmet.metaTags.find((tag) => tag.name === 'description')

    expect(description).toBeDefined()
    expect(description.content).toBe('Search, discover, visualize, refine, and access NASA Earth Observation data in your browser with Earthdata Search')
  })

  test('sets the correct meta og:type', async () => {
    setup()

    const helmet = Helmet.peek()
    const ogType = helmet.metaTags.find((tag) => tag.property === 'og:type')

    expect(ogType).toBeDefined()
    expect(ogType.content).toBe('website')
  })

  test('sets the correct meta og:title', async () => {
    setup()

    const helmet = Helmet.peek()
    const ogTitle = helmet.metaTags.find((tag) => tag.property === 'og:title')

    expect(ogTitle).toBeDefined()
    expect(ogTitle.content).toBe('Earthdata Search')
  })

  test('sets the correct meta og:description', async () => {
    setup()

    const helmet = Helmet.peek()
    const ogDescription = helmet.metaTags.find((tag) => tag.property === 'og:description')

    expect(ogDescription).toBeDefined()
    expect(ogDescription.content).toBe('Search, discover, visualize, refine, and access NASA Earth Observation data in your browser with Earthdata Search')
  })

  test('sets the correct meta og:url', async () => {
    setup()

    const helmet = Helmet.peek()
    const ogUrl = helmet.metaTags.find((tag) => tag.property === 'og:url')

    expect(ogUrl).toBeDefined()
    expect(ogUrl.content).toBe('https://search.earthdata.nasa.gov/search')
  })

  test('sets the correct meta og:image', async () => {
    setup()

    const helmet = Helmet.peek()
    const ogImage = helmet.metaTags.find((tag) => tag.property === 'og:image')

    expect(ogImage.content).toBe('test-file-stub')
  })

  test('sets the correct meta theme-color', async () => {
    setup()

    const helmet = Helmet.peek()
    const themeColor = helmet.metaTags.find((tag) => tag.name === 'theme-color')

    expect(themeColor).toBeDefined()
    expect(themeColor.content).toBe('#191a1b')
  })

  test('sets the correct meta canonical url', async () => {
    setup()

    const helmet = Helmet.peek()
    const canonical = helmet.linkTags.find((tag) => tag.rel === 'canonical')

    expect(canonical).toBeDefined()
    expect(canonical.href).toBe('https://search.earthdata.nasa.gov/search')
  })

  test('removes the loading class from the root element', () => {
    setup()

    expect(removeMock).toHaveBeenCalledTimes(1)
    expect(removeMock).toHaveBeenCalledWith('root--loading')
  })

  test('renders the GraphQlProvider component', async () => {
    setup()
    expect(GraphQlProvider).toHaveBeenCalledTimes(1)
  })
})
