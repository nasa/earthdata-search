import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import { EarthdataDownloadRedirectContainer, mapStateToProps } from '../EarthdataDownloadRedirectContainer'

describe('mapStateToProps', () => {
  test('returns the correct state', () => {
    const store = {
      earthdataDownloadRedirect: {
        redirect: 'earthdata-download://authCallback'
      }
    }

    const expectedState = {
      earthdataDownloadRedirect: {
        redirect: 'earthdata-download://authCallback'
      }
    }

    expect(mapStateToProps(store)).toEqual(expectedState)
  })
})

describe('EarthdataDownloadRedirectContainer', () => {
  test('informs the user about the redirect', () => {
    delete window.location
    window.location = { replace: jest.fn() }

    render(
      <EarthdataDownloadRedirectContainer
        earthdataDownloadRedirect={{
          redirect: 'earthdata-download://authCallback'
        }}
      />
    )

    expect(screen.getByText('Opening Earthdata Download to download your files...')).toBeDefined()
    expect(screen.getByTestId('earthdata-download-redirect-button')).toHaveAttribute('href', 'earthdata-download://authCallback')

    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith('earthdata-download://authCallback')
  })
})
