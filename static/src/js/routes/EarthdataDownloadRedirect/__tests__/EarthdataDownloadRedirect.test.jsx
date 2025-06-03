import React from 'react'
import Helmet from 'react-helmet'

import setupTest from '../../../../../../jestConfigs/setupTest'

import EarthdataDownloadRedirect from '../EarthdataDownloadRedirect'
import * as AppConfig from '../../../../../../sharedUtils/config'
import EarthdataDownloadRedirectComponent from '../../../components/EarthdataDownloadRedirect/EarthdataDownloadRedirect'

jest.mock('../../../components/EarthdataDownloadRedirect/EarthdataDownloadRedirect', () => jest.fn(() => <div />))

beforeEach(() => {
  jest.spyOn(AppConfig, 'getEnvironmentConfig').mockImplementation(() => ({ edscHost: 'https://search.earthdata.nasa.gov' }))
})

const setup = setupTest({
  Component: EarthdataDownloadRedirect
})

describe('EarthdataDownloadRedirect component', () => {
  test('sets the correct Helmet meta information', () => {
    setup()

    const helmet = Helmet.peek()
    expect(helmet.title).toEqual('Earthdata Download Redirect')
    expect(helmet.metaTags).toEqual([
      {
        name: 'title',
        content: 'Earthdata Download Redirect'
      },
      {
        name: 'robots',
        content: 'noindex, nofollow'
      }
    ])

    expect(helmet.linkTags).toEqual([
      {
        rel: 'canonical',
        href: 'https://search.earthdata.nasa.gov/earthdata-download-redirect'
      }
    ])

    expect(EarthdataDownloadRedirectComponent).toHaveBeenCalledTimes(1)
    expect(EarthdataDownloadRedirectComponent).toHaveBeenCalledWith({}, {})
  })
})
