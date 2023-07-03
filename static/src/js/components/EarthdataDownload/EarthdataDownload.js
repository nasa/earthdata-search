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

const FeatureWithLinkList = ({
  osTitle,
  osIcon,
  links
}) => (
  <div className="col-md align-items-center d-flex flex-column">
    <h3 className="h5 align-items-center d-flex flex-column text-center feature-with-link-list">
      <EDSCIcon className="mb-2 d-block feature-with-link-list__icon" icon={osIcon} size="1.5rem" />
      {`Download for ${osTitle}`}
    </h3>
    <ul className="list-unstyled text-center">
      {
        links.map(({
          href: linkHref,
          format: linkFormat
        }) => (
          <li key={linkFormat}>
            <a className="feature-with-link-list__download-link link link--external" data-testid={`earthdata-download-link-${linkFormat}`} download href={linkHref}>
              {`Download the .${linkFormat} installer`}
            </a>
          </li>
        ))
      }
    </ul>
    {
      osTitle === 'Apple Silicon' && (
        <p className="text-center text-black-50">
          {'See '}
          <a className="link link--external" href="https://support.apple.com/en-us/HT211814" target="_blank" rel="noopener noreferrer">
            Apple documentation
          </a>
          {' for more information about Apple vs. Intel processors.'}
        </p>
      )
    }
  </div>
)

export const EarthdataDownload = () => {
  const { userAgent } = navigator
  const operatingSystem = getOperatingSystem(userAgent)

  const windowsDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.exe'
  const macDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x64.dmg'
  const macSiliconDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-arm64.dmg'

  // AppImage extension made the principal download since it allows for auto-updates
  const linuxDownloadLink = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x86_64.AppImage'
  const linuxDownloadLinkRpm = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-x86_64.rpm'
  const linuxDownloadLinkDeb = 'https://github.com/nasa/earthdata-download/releases/latest/download/Earthdata-Download-amd64.deb'

  const {
    macOSEddDownloadSize,
    windowsEddDownloadSize,
    linuxEddDownloadSize
  } = getApplicationConfig()

  const primaryDownloadLinkMap = {
    macOS: {
      href: macDownloadLink,
      size: macOSEddDownloadSize
    },
    Windows: {
      href: windowsDownloadLink,
      size: windowsEddDownloadSize
    },
    Linux: {
      href: linuxDownloadLink,
      size: linuxEddDownloadSize
    }
  }

  const primaryDownloadLinkInfo = primaryDownloadLinkMap[operatingSystem] || {}
  const { href: primaryDownloadHref = '', size: primaryDownloadSize = '' } = primaryDownloadLinkInfo
  const downloaderSize = `${primaryDownloadSize}mb`
  const osLinkFileExt = `(.${primaryDownloadHref.split('.').pop()})`

  const additionalOSList = [
    // macOS
    {
      show: operatingSystem !== 'macOS',
      title: 'macOS',
      icon: FaApple,
      links: [
        {
          href: macDownloadLink,
          format: 'dmg'
        }
      ]
    },
    // macOS Extras
    {
      show: operatingSystem === 'macOS',
      title: 'Apple Silicon',
      icon: FaApple,
      links: [
        {
          href: macSiliconDownloadLink,
          format: 'dmg'
        }
      ]
    },
    // Windows
    {
      show: operatingSystem !== 'Windows',
      title: 'Windows',
      icon: FaWindows,
      links: [
        {
          href: windowsDownloadLink,
          format: 'exe'
        }
      ]
    },
    // Linux
    {
      show: operatingSystem !== 'Linux',
      title: 'Linux',
      icon: FaLinux,
      links: [
        {
          href: linuxDownloadLink,
          format: 'AppImage'
        }
      ]
    },
    // Linux Extras
    {
      show: operatingSystem === 'Linux',
      title: 'Linux',
      icon: FaLinux,
      links: [
        {
          href: linuxDownloadLinkDeb,
          format: 'deb'
        },
        {
          href: linuxDownloadLinkRpm,
          format: 'rpm'
        }
      ]
    }
  ]

  return (
    <div className="earthdata-download container">
      <section className="mb-5 mt-4">
        <h2 className="font-weight-bolder text-center">Earthdata Download</h2>
        <span className="h3 d-block font-weight-light text-black-50 text-center">
          Download your Earth science data from Earthdata Search with only one click
        </span>
      </section>
      {
        primaryDownloadHref && (
          <section className="d-flex flex-column align-items-center mt-4">
            <Button
              dataTestId="eddDownloadButton"
              className="earthdata-download__install-button"
              type="button"
              icon={FaDownload}
              bootstrapVariant="success"
              bootstrapSize="lg"
              href={primaryDownloadHref}
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
                  <em className="font-italic"> for Intel-based Macs</em>
                )
              }
            </div>
          </section>
        )
      }
      <section className="row my-5">
        {
          additionalOSList.map(({
            icon,
            links,
            show,
            title
          }) => show && (
            <FeatureWithLinkList
              key={title}
              osTitle={title}
              osIcon={icon}
              links={links}
            />
          ))
        }
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
