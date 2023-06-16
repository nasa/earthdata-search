import React from 'react'
import { FaDownload } from 'react-icons/fa'
import Button from '../Button/Button'

import eddLogo from '../../../assets/images/earthdata-download-logo.png'
import unavailableImg from '../../../assets/images/image-unavailable.svg'
import { getOperatingSystem } from '../../util/files/parseUserAgent'

import './EddLandingPage.scss'

export const EddLandingPage = () => {
  const { userAgent } = navigator
  // todo change to a const when pr review time comes
  const operatingSystem = getOperatingSystem(userAgent)
  let downloadLink

  let executableSize
  const windowsDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.exe'
  const macDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.dmg'
  const macSiliconDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-arm64.dmg'
  const linuxDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata.Download-amd64.deb'

  // operatingSystem = 'linux'
  switch (operatingSystem) {
    case 'macOs': {
      console.log('I am macIOS')
      downloadLink = macDownloadLink
      executableSize = 130
      break
    }
    case 'windows': {
      console.log('I am windows')
      downloadLink = windowsDownloadLink
      executableSize = 100
      break
    }
    case 'linux': {
      console.log('I am linux')
      downloadLink = linuxDownloadLink
      executableSize = 90
      break
    }
    default:
    {
      // arbitrary default all links still possible user agents access page
      downloadLink = macDownloadLink
      break
    }
  }
  const downloaderSize = `${executableSize}mb`
  const osLinkFileExt = `(.${downloadLink.split('.').pop()})`

  return (
    <div className="eddLandingPage">
      <img className="eddLandingPage__screenshot" src={eddLogo} alt={unavailableImg} />

      <h2 className="eddLandingPage__header-primary">
        Download your files from Earthdata Search with only one click!
      </h2>

      <div className="eddLandingPage__container">
        <h3>Earthdata Downloader Features</h3>
        <br />
        <br />
        <ul className="eddLandingPage__list-group">
          <li className="list-group-item">Easily Authenticate with Earthdata login</li>
          <li className="list-group-item">Manage your downloads and preferences</li>
          <li className="list-group-item">Works on Mac, Windows, and Linux</li>
        </ul>
      </div>

      <Button dataTestId="eddDownloadButton" className="eddLandingPage__install-button" type="button" icon={FaDownload} bootstrapVariant="primary" href={downloadLink}>
        Download for
        {' '}
        {operatingSystem}
      </Button>
      {' '}
      {downloaderSize}
      {' '}
      {osLinkFileExt}
      <br />
      Download for
      {' '}
      <a data-testid="eddLandingPage-link-macosm1" download href={macSiliconDownloadLink}>
        silicon Macs
      </a>
      <br />
      <a href="https://github.com/nasa/earthdata-download">
        Source Code Repository
      </a>
    </div>
  )
}

export default EddLandingPage
