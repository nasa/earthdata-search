import { screen } from '@testing-library/react'

import { EarthdataDownloadRedirectComponent } from '../EarthdataDownloadRedirect'
import setupTest from '../../../../../../vitestConfigs/setupTest'

const setup = setupTest({
  Component: EarthdataDownloadRedirectComponent,
  defaultZustandState: {
    earthdataDownloadRedirect: {
      redirectUrl: 'earthdata-download://authCallback'
    }
  }
})

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('EarthdataDownloadRedirectComponent', () => {
  test('informs the user about the redirect', () => {
    delete window.location
    window.location = { replace: vi.fn() }

    setup()

    expect(screen.getByText('Opening Earthdata Download to download your files...')).toBeDefined()
    expect(screen.getByTestId('earthdata-download-redirect-button')).toHaveAttribute('href', 'earthdata-download://authCallback')

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('earthdata-download://authCallback')
  })
})
