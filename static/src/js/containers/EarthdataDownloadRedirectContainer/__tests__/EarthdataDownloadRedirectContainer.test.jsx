import { screen } from '@testing-library/react'

import { EarthdataDownloadRedirectContainer } from '../EarthdataDownloadRedirectContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'

const setup = setupTest({
  Component: EarthdataDownloadRedirectContainer,
  defaultZustandState: {
    earthdataDownloadRedirect: {
      redirect: 'earthdata-download://authCallback'
    }
  }
})

describe('EarthdataDownloadRedirectContainer', () => {
  const { replace } = window.location

  afterEach(() => {
    window.location.replace = replace
  })

  test('informs the user about the redirect', () => {
    delete window.location
    window.location = { replace: jest.fn() }

    setup()

    expect(screen.getByText('Opening Earthdata Download to download your files...')).toBeDefined()
    expect(screen.getByTestId('earthdata-download-redirect-button')).toHaveAttribute('href', 'earthdata-download://authCallback')

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('earthdata-download://authCallback')
  })

  test('does not redirect if no redirect URL is provided', () => {
    delete window.location
    window.location = { replace: jest.fn() }

    setup({
      overrideZustandState: {
        earthdataDownloadRedirect: {
          redirect: ''
        }
      }
    })

    expect(screen.getByText('Opening Earthdata Download to download your files...')).toBeDefined()
    expect(screen.getByTestId('earthdata-download-redirect-button')).toHaveAttribute('href', '')

    expect(window.location.replace).toHaveBeenCalledTimes(0)
  })
})
