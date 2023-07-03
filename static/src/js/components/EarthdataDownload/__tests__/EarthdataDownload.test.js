import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import EarthdataDownload from '../EarthdataDownload'

import { getOperatingSystem } from '../../../util/files/parseUserAgent'

const windowsDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.exe'
const macDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.dmg'
const linuxDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x86_64.AppImage'

jest.mock('../../../util/files/parseUserAgent', () => ({
  getOperatingSystem: jest.fn()
}))

const setup = () => {
  render(
    <EarthdataDownload> </EarthdataDownload>
  )
}

describe('EarthdataDownload component', () => {
  test('Render the download link for windows', () => {
    getOperatingSystem.mockImplementation(() => 'Windows')
    setup()
    expect(screen.getByTestId('eddDownloadButton')).toBeInTheDocument()
    expect(screen.getByTestId('eddDownloadButton')).toHaveAttribute('href', windowsDownloadLink)
  })

  test('Render the download link for macOs', () => {
    getOperatingSystem.mockImplementation(() => 'macOS')
    setup()
    expect(screen.getByTestId('eddDownloadButton')).toBeInTheDocument()
    expect(screen.getByTestId('eddDownloadButton')).toHaveAttribute('href', macDownloadLink)
  })

  test('Render the download link for linux', () => {
    getOperatingSystem.mockImplementation(() => 'Linux')
    setup()
    expect(screen.getByTestId('eddDownloadButton')).toBeInTheDocument()
    expect(screen.getByTestId('eddDownloadButton')).toHaveAttribute('href', linuxDownloadLink)
  })

  test('Do not render the main button download button if the userAgent was null still proving the links', () => {
    getOperatingSystem.mockImplementation(() => null)
    setup()
    expect(screen.queryByTestId('eddDownloadButton')).toBeNull()
    expect(screen.queryByText('Download for Linux')).toBeInTheDocument()
    expect(screen.queryByText('Download for macOS')).toBeInTheDocument()
    expect(screen.queryByText('Download for Windows')).toBeInTheDocument()
  })
})
