import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { waitFor } from '@testing-library/react'

import App from '../App'

import setupTest from '../../../../jestConfigs/setupTest'

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

const setup = setupTest({
  Component: App
})

describe('App component', () => {
  test('renders the router', () => {
    setup()

    expect(RouterProvider).toHaveBeenCalledTimes(1)
    // This isn't testing which components are lazy loaded, just that the routes are set up correctly
    expect(RouterProvider).toHaveBeenCalledWith({
      router: expect.objectContaining({
        routes: expect.arrayContaining([
          expect.objectContaining({
            path: '/',
            children: expect.arrayContaining([
              expect.objectContaining({
                index: true
              }),
              expect.objectContaining({
                path: '/portal/:portalId/*'
              }),
              expect.objectContaining({
                path: '/search/*'
              }),
              expect.objectContaining({
                path: '/projects'
              }),
              expect.objectContaining({
                path: '/downloads',
                children: expect.arrayContaining([
                  expect.objectContaining({
                    index: true,
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: '/downloads/:id',
                    lazy: expect.any(Function)
                  })
                ])
              }),
              expect.objectContaining({
                path: '/contact-info'
              }),
              expect.objectContaining({
                path: '/preferences'
              }),
              expect.objectContaining({
                path: '/subscriptions'
              }),
              expect.objectContaining({
                path: '/earthdata-download-callback'
              }),
              expect.objectContaining({
                path: '/auth_callback'
              }),
              expect.objectContaining({
                path: '/admin',
                children: expect.arrayContaining([
                  expect.objectContaining({
                    path: '/admin/retrievals',
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: '/admin/retrievals/:id',
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: '/admin/projects',
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: '/admin/projects/:id',
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: '/admin/retrievals-metrics',
                    lazy: expect.any(Function)
                  }),
                  expect.objectContaining({
                    path: '/admin/preferences-metrics',
                    lazy: expect.any(Function)
                  })
                ])
              })
            ])
          }),
          expect.objectContaining({
            path: '*'
          })
        ])
      })
    }, {})
  })

  test('sets the correct default title', async () => {
    setup()
    await waitFor(() => expect(document.title).toEqual('Earthdata Search'))
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
})
