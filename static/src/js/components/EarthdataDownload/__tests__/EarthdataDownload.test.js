import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

import EarthdataDownload from '../EarthdataDownload'

import { getOperatingSystem } from '../../../util/files/parseUserAgent'

const windowsDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.exe'
const macDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.dmg'
const linuxDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata.Download-amd64.deb'

jest.mock('../../../util/files/parseUserAgent', () => ({
  getOperatingSystem: jest.fn()
}))

// mock the result coming out of the OS user-agent function
const setup = () => {
  render(
    <EarthdataDownload> </EarthdataDownload>
  )
}

describe('EarthdataDownload component', () => {
  test('render the download link for windows', () => {
    getOperatingSystem.mockImplementation(() => 'windows')
    setup()
    expect(screen.getByTestId('eddDownloadButton')).toBeInTheDocument()
    expect(screen.getByTestId('eddDownloadButton')).toHaveAttribute('href', windowsDownloadLink)
  })
  test('should render the download link for macOs', () => {
    getOperatingSystem.mockImplementation(() => 'macOs')
    setup()
    expect(screen.getByTestId('eddDownloadButton')).toBeInTheDocument()
    expect(screen.getByTestId('eddDownloadButton')).toHaveAttribute('href', macDownloadLink)
  })

  test('should render the download link for linux', () => {
    getOperatingSystem.mockImplementation(() => 'linux')
    setup()
    expect(screen.getByTestId('eddDownloadButton')).toBeInTheDocument()
    expect(screen.getByTestId('eddDownloadButton')).toHaveAttribute('href', linuxDownloadLink)
  })
})
