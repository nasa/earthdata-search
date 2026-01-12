import React from 'react'

import { waitFor } from '@testing-library/react'
// @ts-expect-error This file does not have types
import { Helmet } from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import Downloads from '../Downloads'

import DownloadHistory from '../../../components/DownloadHistory/DownloadHistory'

jest.mock('../../../components/DownloadHistory/DownloadHistory', () => jest.fn(() => <div />))

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn().mockReturnValue({
    pathname: '/downloads',
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
  getApplicationConfig: jest.fn().mockReturnValue({})
}))

const setup = setupTest({
  Component: Downloads
})

describe('Downloads component', () => {
  test('displays the Downloads component', async () => {
    setup()

    expect(DownloadHistory).toHaveBeenCalledTimes(1)
    expect(DownloadHistory).toHaveBeenCalledWith({}, {})
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

      expect(title).toBe('Downloads')
      expect(metaTags?.find((tag) => tag.name === 'title')?.content).toBe('Downloads')
      expect(metaTags?.find((tag) => tag.name === 'robots')?.content).toBe('noindex, nofollow')
      expect(linkTags?.find((tag) => tag.rel === 'canonical')?.href).toContain('https://search.earthdata.nasa.gov')
    })
  })
})
