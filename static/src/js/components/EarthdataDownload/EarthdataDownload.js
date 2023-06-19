import React from 'react'
import { FaDownload } from 'react-icons/fa'
import { upperFirst } from 'lodash'
import Button from '../Button/Button'

import eddLogo from '../../../assets/images/earthdata-download-logo.png'
import unavailableImg from '../../../assets/images/image-unavailable.svg'
import { getOperatingSystem } from '../../util/files/parseUserAgent'

import './EarthdataDownload.scss'

export const EarthdataDownload = () => {
  const { userAgent } = navigator
  const operatingSystem = upperFirst(getOperatingSystem(userAgent))
  let downloadLink

  let executableSize
  const windowsDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.exe'
  const macDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.dmg'
  const macSiliconDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-arm64.dmg'
  const linuxDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata.Download-amd64.deb'

  let isMacOs = false
  let isLinux = false
  let isWindows = false
  // operatingSystem = 'MacOs'
  switch (operatingSystem) {
    case 'MacOs': {
      console.log('I am macIOS')
      downloadLink = macDownloadLink
      isMacOs = true
      executableSize = 130
      break
    }
    case 'Windows': {
      console.log('I am windows')
      downloadLink = windowsDownloadLink
      executableSize = 100
      isWindows = true
      break
    }
    case 'Linux': {
      console.log('I am linux')
      downloadLink = linuxDownloadLink
      executableSize = 90
      isLinux = true
      break
    }
    default:
    {
      // arbitrary default all links still possible user agents access page
      console.log('Defaulting to macOs')
      downloadLink = macDownloadLink
      isMacOs = true
      executableSize = 130
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

      <div className="earthdataDownload__appContent">
        <h2 className="earthdataDownload__header-primary">
          Download your files from Earthdata Search
          <br />
          with only one click!
        </h2>
        <br />
        <div className="earthdataDownload__container">
          <h3 className="earthdataDownload__header">Earthdata Downloader Features</h3>
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
      <br />
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
      <a className="earthdataDownload__repo" href="https://github.com/nasa/earthdata-download">
        Source Code Repository
      </a>
    </div>
  )
}

export default EarthdataDownload
