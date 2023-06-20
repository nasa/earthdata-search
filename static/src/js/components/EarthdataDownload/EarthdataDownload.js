import React from 'react'
import { FaDownload } from 'react-icons/fa'
import { capitalize } from 'lodash'
import Button from '../Button/Button'

import eddLogo from '../../../assets/images/earthdataDownload-screenshot.png'
import unavailableImg from '../../../assets/images/image-unavailable.svg'
import { getOperatingSystem } from '../../util/files/parseUserAgent'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import './EarthdataDownload.scss'

export const EarthdataDownload = () => {
  const { userAgent } = navigator
  let operatingSystem = getOperatingSystem(userAgent)
  let downloadLink

  let executableSize
  const windowsDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.exe'
  const macDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.dmg'
  const macSiliconDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-arm64.dmg'
  const linuxDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata.Download-amd64.deb'
  const {
    macOsEDDExecutableSize,
    windowsEDDExecutableSize,
    linuxEDDExecutableSize
  } = getApplicationConfig()

  let isMacOs = false
  let isLinux = false
  let isWindows = false

  switch (operatingSystem) {
    case 'macOs': {
      // Apple standard is not to capitalize macOs
      isMacOs = true
      downloadLink = macDownloadLink
      executableSize = macOsEDDExecutableSize
      break
    }
    case 'windows': {
      operatingSystem = capitalize(operatingSystem)
      isWindows = true
      downloadLink = windowsDownloadLink
      executableSize = windowsEDDExecutableSize
      break
    }
    case 'linux': {
      operatingSystem = capitalize(operatingSystem)
      isLinux = true
      downloadLink = linuxDownloadLink
      executableSize = linuxEDDExecutableSize
      break
    }
    default:
    {
      operatingSystem = 'macOs'
      downloadLink = macDownloadLink
      isMacOs = true
      executableSize = macOsEDDExecutableSize
      break
    }
  }
  const downloaderSize = `${executableSize}mb`
  const osLinkFileExt = `(.${downloadLink.split('.').pop()})`

  return (
    <div className="earthdataDownload">

      <div className="earthdataDownload__imageContainer">
        <img className="earthdataDownload__screenshot" src={eddLogo} alt={unavailableImg} />
      </div>

      <div className="earthdataDownload__content">
        <h2 className="earthdataDownload__header-primary">
          Download your files from Earthdata Search
          <br />
          with only one click!
        </h2>
        <br />
        <div className="earthdataDownload__content-container">
          <h3 className="earthdataDownload__header-secondary">Earthdata Downloader Features</h3>
          <br />
          <br />
          <ul className="earthdataDownload__list-group">
            <li className="earthdataDownload__list-item">Easily Authenticate with Earthdata login</li>
            <li className="earthdataDownload__list-item">Manage your downloads and preferences</li>
            <li className="earthdataDownload__list-item">Works on Mac, Windows, and Linux</li>
          </ul>
        </div>
        <div className="earthdataDownload__install-content">
          <Button dataTestId="eddDownloadButton" className="earthdataDownload__install-button" type="button" icon={FaDownload} bootstrapVariant="primary" href={downloadLink}>
            Download for
            {' '}
            {operatingSystem}
          </Button>
          {' '}
          <span className="earthdataDownload__downloaderSize">
            {downloaderSize}
          </span>
          {' '}
          <span className="earthdataDownload__osLinkFileExt">
            {osLinkFileExt}
          </span>
        </div>
      </div>
      <div className="earthdataDownload__other-links">

        <div className="other-links__item">
          Apple silicon?
          <br />
          Download for
          {' '}
          <a data-testid="earthdataDownload-link-macOsSilicone" download href={macSiliconDownloadLink}>
            Apple silicon Mac
          </a>
          <br />
        </div>
        { !isWindows ? (
          <div className="other-links__item">
            Windows?
            <br />
            Download for
            {' '}
            <a data-testid="earthdataDownload-link-windows" download href={windowsDownloadLink}>
              Windows
            </a>
            <br />
          </div>
        ) : null}
        {' '}
        { !isLinux ? (
          <div className="other-links__item">
            Linux?
            <br />
            Download for
            {' '}
            <a className="eddLinuxLink" data-testid="earthdataDownload-link-linux" download href={linuxDownloadLink}>
              Linux
            </a>
            <br />
          </div>
        ) : null}
        {' '}
        { !isMacOs ? (
          <div className="other-links__item">
            MacOs?
            <br />
            Download for
            {' '}
            <a className="eddMacOsLink" data-testid="earthdataDownload-link-macosx64" download href={macDownloadLink}>
              Intel Macs
            </a>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default EarthdataDownload
