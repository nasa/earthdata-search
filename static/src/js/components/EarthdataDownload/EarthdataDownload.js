import React from 'react'
import {
  FaApple,
  FaDownload,
  FaGithub,
  FaLinux,
  FaWindows
} from 'react-icons/fa'

import { getApplicationConfig } from '../../../../../sharedUtils/config'
import { getOperatingSystem } from '../../util/files/parseUserAgent'
import eddScreen from '../../../assets/images/edd-screen.png'
import eddScreen2x from '../../../assets/images/edd-screen@2x.png'

import Button from '../Button/Button'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './EarthdataDownload.scss'

export const EarthdataDownload = () => {
  const { userAgent } = navigator
  let operatingSystem = getOperatingSystem(userAgent)
  let downloadLink

  let executableSize
  const windowsDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.exe'
  const macDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.dmg'
  const macSiliconDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-arm64.dmg'

  // AppImage extension made the principal as it allows for auto-updates
  const linuxDownloadLink = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x86_64.AppImage'
  const linuxDownloadLinkRpm = '//github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x86_64.rpm'
  const linuxDownloadLinkDeb = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-amd64.deb'

  const {
    macOSEddDownloadSize,
    windowsEddDownloadSize,
    linuxEddDownloadSize
  } = getApplicationConfig()

  let isMacOS = false
  let isLinux = false
  let isWindows = false

  switch (operatingSystem) {
    case 'macOS': {
      // Apple standard is not to capitalize macOS
      isMacOS = true
      downloadLink = macDownloadLink
      executableSize = macOSEddDownloadSize
      break
    }
    case 'Windows': {
      isWindows = true
      downloadLink = windowsDownloadLink
      executableSize = windowsEddDownloadSize
      break
    }
    case 'Linux': {
      isLinux = true
      downloadLink = linuxDownloadLink
      executableSize = linuxEddDownloadSize
      break
    }
    default: {
      operatingSystem = 'macOS'
      isMacOS = true
      downloadLink = macDownloadLink
      executableSize = macOSEddDownloadSize
      break
    }
  }
  const downloaderSize = `${executableSize}mb`
  const osLinkFileExt = `.${downloadLink.split('.').pop()}`

  const macOSElement = isMacOS ? (
    <div className="col-md align-items-center d-flex flex-column">
      <a className="h5 align-items-center d-flex flex-column text-center earthdata-download__download-link" data-testid="earthdata-download-link-macOsSilicone" download href={macSiliconDownloadLink}>
        <EDSCIcon className="earthdata-download__other-links-item-icon" icon={FaApple} size="1.5rem" />
        Download for Apple Silicon
      </a>
      <p className="text-center text-black-50">
        {'Download the installer for Apple silicon (.dmg). See '}
        <a className="link link--external" href="https://support.apple.com/en-us/HT211814" target="_blank" rel="noopener noreferrer">
          Apple documentation
        </a>
        {' for more information about Apple vs. Intel processors.'}
      </p>
    </div>
  ) : (
    <div className="col-md align-items-center d-flex flex-column">
      <a className="h5 align-items-center d-flex flex-column text-center earthdata-download__download-link" data-testid="earthdata-download-link-macosx64" download href={macDownloadLink}>
        <EDSCIcon className="earthdata-download__other-links-item-icon" icon={FaApple} size="1.5rem" />
        Download for macOS
      </a>
      <p className="text-center text-black-50">Download the installer for macOS (.dmg).</p>
    </div>
  )

  const linuxElement = isLinux ? (
    <div>
      <a className="h5 align-items-center d-flex flex-column text-center earthdata-download__download-link" data-testid="earthdata-download-link-linux" download href={linuxDownloadLinkDeb}>
        <EDSCIcon className="earthdata-download__other-links-item-icon" icon={FaLinux} size="1.5rem" />
        Download for Linux (.deb)
      </a>
      <a className="h5 align-items-center d-flex flex-column text-center earthdata-download__download-link" data-testid="earthdata-download-link-linux" download href={linuxDownloadLinkRpm}>
        Download for Linux (.rpm)
      </a>
    </div>
  ) : (
    <div className="col-md align-items-center d-flex flex-column">
      <a className="h5 align-items-center d-flex flex-column text-center earthdata-download__download-link" data-testid="earthdata-download-link-linux" download href={linuxDownloadLink}>
        <EDSCIcon className="earthdata-download__other-links-item-icon" icon={FaLinux} size="1.5rem" />
        Download for Linux
      </a>
      <p className="text-center text-black-50">Download the installer for Linux (.AppImage).</p>
    </div>
  )

  const windowsElement = !isWindows && (
    <div className="col-md align-items-center d-flex flex-column">
      <a className="h5 align-items-center d-flex flex-column text-center earthdata-download__download-link" data-testid="earthdata-download-link-windows" download href={windowsDownloadLink}>
        <EDSCIcon className="earthdata-download__other-links-item-icon" icon={FaWindows} size="1.5rem" />
        Download for Windows
      </a>
      <p className="text-center text-black-50">Download the installer for Windows (.exe).</p>
    </div>
  )

  return (
    <div className="earthdata-download container">
      <section className="mb-5 mt-4">
        <h2 className="font-weight-bolder text-center">Earthdata Download</h2>
        <span className="h3 d-block font-weight-light text-black-50 text-center">
          Download your Earth science data from Earthdata Search with only one click
        </span>
      </section>
      <section className="d-flex flex-column align-items-center mt-4">
        <Button
          dataTestId="eddDownloadButton"
          className="earthdata-download__install-button"
          type="button"
          icon={FaDownload}
          bootstrapVariant="success"
          bootstrapSize="lg"
          href={downloadLink}
          download
        >
          Download for
          {' '}
          {operatingSystem}
        </Button>
        <div className="mt-2 text-black-50">
          <span className="earthdata-download__download-size">
            {downloaderSize}
          </span>
          {' '}
          <span className="earthdata-download__os-link-file-ext">
            {osLinkFileExt}
          </span>
          {
            operatingSystem === 'macOS' && (
              <span>{' (for Intel-based Macs)'}</span>
            )
          }
        </div>
      </section>
      <section className="row my-5">
        { macOSElement }
        { windowsElement}
        { linuxElement}
      </section>
      <section className="row my-5 justify-content-center">
        <div className="col-auto d-flex">
          <img
            width="342px"
            height="207px"
            src={eddScreen}
            srcSet={`${eddScreen} 1x, ${eddScreen2x} 2x`}
            alt="Earthdata Download application displaying two downloads, one of which is complete, and another still processing"
          />
        </div>
        <div className="col-auto d-flex align-items-center">
          <ul className="earthdata-download__feature-list mb-0 mt-5 mt-md-0">
            <li className="earthdata-download__feature-list-item">
              <span className="earthdata-download__feature-list-item-text">
                Easily Authenticate with Earthdata login
              </span>
            </li>
            <li className="earthdata-download__feature-list-item">
              <span className="earthdata-download__feature-list-item-text">
                Manage your downloads and preferences
              </span>
            </li>
            <li className="earthdata-download__feature-list-item">
              <span className="earthdata-download__feature-list-item-text">
                Works on macOS, Windows, and Linux
              </span>
            </li>
          </ul>
        </div>
      </section>
      <section className="row mt-5">
        <div className="col align-self-center d-flex flex-column align-items-center">
          <Button
            className="earthdata-download__repo-link d-flex align-self-center"
            icon={FaGithub}
            href="https://github.com/nasa/earthdata-download"
            bootstrapVariant="light"
            target="_blank"
            rel="noopener nofollow"
          >
            See Earthdata Download on GitHub
          </Button>
        </div>
      </section>
    </div>
  )
}

export default EarthdataDownload
