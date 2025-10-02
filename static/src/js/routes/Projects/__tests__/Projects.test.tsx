import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

import { waitFor } from '@testing-library/react'
import { Helmet } from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import Projects from '../Projects'

// @ts-expect-error This file does not have types
import SavedProjectsContainer from '../../../containers/SavedProjectsContainer/SavedProjectsContainer'

jest.mock('../../../containers/SavedProjectsContainer/SavedProjectsContainer', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Navigate: jest.fn(),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/projects',
    search: '',
    hash: '',
    state: null,
    key: 'testKey'
  })
}))

jest.mock('../../../../../../sharedUtils/config', () => ({
  getEnvironmentConfig: jest.fn().mockReturnValue({
    edscHost: 'https://search.earthdata.nasa.gov',
    apiHost: 'http://localhost:3000'
  }),
  getApplicationConfig: jest.fn().mockReturnValue({
    collectionSearchResultsSortKey: ''
  })
}))

const setup = setupTest({
  Component: Projects
})

describe('Projects component', () => {
  test('displays the SavedProjectsContainer', async () => {
    setup()

    expect(SavedProjectsContainer).toHaveBeenCalledTimes(1)
    expect(SavedProjectsContainer).toHaveBeenCalledWith({}, {})
  })

  describe('when loading the page with query parameters', () => {
    test('redirects to the /project route', () => {
      (useLocation as jest.Mock).mockReturnValueOnce({
        pathname: '/projects',
        search: '?p=!C1234-EDSC'
      })

      setup()

      expect(Navigate).toHaveBeenCalledTimes(1)
      expect(Navigate).toHaveBeenCalledWith({
        replace: true,
        to: '/project?p=!C1234-EDSC'
      }, {})
    })
  })

  // RTL Lazy loading issue with mocks between https://github.com/testing-library/react-testing-library/issues/716
  describe('when rendering', () => {
    test('should render helmet data', async () => {
      setup()

      let helmet: {
        title?: string
        metaTags?: Array<{ name: string, content: string }>
        linkTags?: Array<{ rel: string, href: string }>
      } = {}

      await waitFor(() => {
        helmet = Helmet.peek() as typeof helmet
      })

      const {
        title,
        metaTags,
        linkTags
      } = helmet || {}

      expect(title).toBe('Saved Projects')
      expect(metaTags?.find((tag) => tag.name === 'title')?.content).toBe('Saved Projects')
      expect(metaTags?.find((tag) => tag.name === 'robots')?.content).toBe('noindex, nofollow')
      expect(linkTags?.find((tag) => tag.rel === 'canonical')?.href).toContain('https://search.earthdata.nasa.gov')
    })
  })
})
