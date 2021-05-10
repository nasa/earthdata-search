/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { Dropdown, Tab } from 'react-bootstrap'
import { PropTypes } from 'prop-types'
import { FaDownload, FaCloud, FaRegCopy } from 'react-icons/fa'

import Button from '../Button/Button'
import EDSCTabs from '../EDSCTabs/EDSCTabs'

import { addToast } from '../../util/addToast'
import { getFilenameFromPath } from '../../util/getFilenameFromPath'

import './GranuleResultsDataLinksButton.scss'

/**
 * Renders CustomDataLinksToggle.
 * @param {Object} props - The props passed into the component.
 * @param {Function} props.onClick - The click callback.null
 */
// eslint-disable-next-line react/display-name
export const CustomDataLinksToggle = React.forwardRef(({
  onClick
}, ref) => {
  const handleClick = (e) => {
    onClick(e)

    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Button
      className="button granule-results-data-links-button__button"
      type="button"
      icon={FaDownload}
      ref={ref}
      label="Download single granule data"
      onClick={handleClick}
    />
  )
})

CustomDataLinksToggle.propTypes = {
  onClick: PropTypes.func.isRequired
}

/**
 * Renders GranuleResultsDataLinksButton.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.collectionId - The collection ID.
 * @param {String} props.buttonVariant - The button variant.
 * @param {Array} props.dataLinks - An array of data links.
 * @param {Function} props.onMetricsDataAccess - The metrics callback.
 */
export const GranuleResultsDataLinksButton = ({
  collectionId,
  buttonVariant,
  dataLinks,
  directDistributionInformation,
  s3Links,
  onMetricsDataAccess
}) => {
  const dropdownMenuRef = useRef(null)
  // const [widestTabWidth, setWidestTabWidth] = useState(null)

  // useEffect(() => {
  //   if (dropdownMenuRef.current) {
  //     const tabs = dropdownMenuRef.current.getElementsByClassName('granule-results-data-links-button__menu-panel')
  //     const tabWidthReducer = (acc, currVal) => {
  //       const isActive = currVal.classList.contains('active')
  //       currVal.classList.add('active')
  //       const tabWidth = currVal.getBoundingClientRect().width
  //       if (!isActive) currVal.classList.remove('active')
  //       return (tabWidth > acc) ? tabWidth : acc
  //     }

  //     const widestTabWidth = Array.from(tabs).reduce(tabWidthReducer, tabs[0].getBoundingClientRect().width)
  //     setWidestTabWidth(widestTabWidth)
  //   }
  // }, [dropdownMenuRef.current])

  const copyStringToClipBoard = async (string, name) => {
    try {
      await navigator.clipboard.writeText(string)
      addToast(`Copied the ${name}`, {
        appearance: 'success',
        autoDismiss: true
      })
    } catch (err) {
      addToast(`Failed to copy the ${name}`, {
        appearance: 'error',
        autoDismiss: true
      })
    }
  }

  const copyS3PathToClipBoard = async (path, filename) => {
    try {
      await navigator.clipboard.writeText(path)
      addToast(`Copied AWS S3 path for: ${filename}`, {
        appearance: 'success',
        autoDismiss: true
      })
    } catch (err) {
      addToast(`Failed to copy AWS S3 path for: ${filename}`, {
        appearance: 'error',
        autoDismiss: true
      })
    }
  }

  if (dataLinks.length > 1 || s3Links.length > 0) {
    const dataLinksList = dataLinks.map((dataLink, i) => {
      const key = `data_link_${i}`
      const dataLinkTitle = getFilenameFromPath(dataLink.href)

      return (
        <Dropdown.Item
          className="granule-results-data-links-button__dropdown-item"
          key={key}
          href={dataLink.href}
          target="_blank"
          title="Download file"
          onClick={(e) => {
            e.stopPropagation()
            onMetricsDataAccess({
              type: 'single_granule_download',
              collections: [{
                collectionId
              }]
            })
            addToast(`Initiated download of file: ${dataLinkTitle}`, {
              appearance: 'success',
              autoDismiss: true
            })
          }}
        >
          {dataLinkTitle}
          <FaDownload className="granule-results-data-links-button__icon granule-results-data-links-button__icon--download" />
        </Dropdown.Item>
      )
    })

    const s3LinksList = () => {
      if (s3Links.length > 0) {
        const {
          region,
          s3BucketAndObjectPrefixNames = [],
          s3CredentialsApiDocumentationUrl,
          s3CredentialsApiEndpoint
        } = directDistributionInformation

        return (
          <div>
            {
              region && (
                <header className="granule-results-data-links-button__menu-panel-heading">
                  <div className="granule-results-data-links-button__menu-panel-heading-row">
                    {'Region: '}
                    <Button
                      variant="naked"
                      className="granule-results-data-links-button__menu-panel-value"
                      onClick={() => {
                        copyStringToClipBoard(region, 'AWS S3 Region')
                      }}
                      label="Copy the AWS S3 Region"
                      icon={FaRegCopy}
                      iconPosition="right"
                    >
                      {region}
                    </Button>
                  </div>
                  <div className="granule-results-data-links-button__menu-panel-heading-row">
                    {'Bucket/Object Prefix: '}
                    {s3BucketAndObjectPrefixNames.map((bucketAndObjPrefix, i) => (
                      <React.Fragment key={`${region}_${bucketAndObjPrefix}`}>
                        <Button
                          variant="naked"
                          className="granule-results-data-links-button__menu-panel-value"
                          onClick={() => {
                            copyStringToClipBoard(bucketAndObjPrefix, 'AWS S3 Bucket/Object Prefix')
                          }}
                          icon={FaRegCopy}
                          iconPosition="right"
                          label="Copy the AWS S3 Bucket/Object Prefix"
                        >
                          {bucketAndObjPrefix}
                        </Button>
                        {i !== s3BucketAndObjectPrefixNames.length - 1 && ', '}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="granule-results-data-links-button__menu-panel-heading-row">
                    {'Credentials API: '}
                    <span className="granule-results-data-links-button__menu-panel-value">
                      <a
                        className="link link--external"
                        href={s3CredentialsApiEndpoint}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        S3 Credentials API
                      </a>
                      <a
                        className="link link--separated link--external"
                        href={s3CredentialsApiDocumentationUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Documentation
                      </a>
                    </span>
                  </div>
                </header>
              )
            }
            {
              s3Links.map((s3Link, i) => {
                const key = `s3_link_${i}`
                const s3LinkTitle = getFilenameFromPath(s3Link.href)

                return (
                  <Dropdown.Item
                    as={Button}
                    className="granule-results-data-links-button__dropdown-item"
                    key={key}
                    label="Copy path to file in AWS S3"
                    onClick={(e) => {
                      e.stopPropagation()
                      copyS3PathToClipBoard(s3Link.href, s3LinkTitle)
                      onMetricsDataAccess({
                        type: 'single_granule_s3_access',
                        collections: [{
                          collectionId
                        }]
                      })
                    }}
                  >
                    {s3LinkTitle}
                    <FaRegCopy className="granule-results-data-links-button__icon" />
                  </Dropdown.Item>
                )
              })
            }
          </div>
        )
      }

      return null
    }

    // const menuProps = {}

    // if (widestTabWidth) menuProps.style = { width: widestTabWidth }

    return (
      <Dropdown onClick={(e) => { e.stopPropagation() }} drop="right">
        <Dropdown.Toggle as={CustomDataLinksToggle} />
        {
          ReactDOM.createPortal(
            <Dropdown.Menu
              ref={dropdownMenuRef}
              className="granule-results-data-links-button__menu"
              // {...menuProps}
            >
              {
                s3Links.length > 0 && dataLinks.length > 0
                  ? (
                    <EDSCTabs padding={false}>
                      <Tab
                        className="granule-results-data-links-button__menu-panel"
                        title={(
                          <span className="granule-results-data-links-button__tab-text">
                            <FaDownload className="granule-results-data-links-button__tab-icon" />
                            Download Files
                          </span>
                        )}
                        eventKey="download-files"
                        tabIndex={0}
                      >
                        <div className="granule-results-data-links-button__list">
                          {dataLinksList}
                        </div>
                      </Tab>
                      <Tab
                        className="granule-results-data-links-button__menu-panel"
                        title={(
                          <span className="granule-results-data-links-button__tab-text">
                            <FaCloud className="granule-results-data-links-button__tab-icon" />
                            AWS S3 Access
                          </span>
                        )}
                        eventKey="aws-s3-access"
                        tabIndex={0}
                      >
                        <div className="granule-results-data-links-button__list">
                          {s3LinksList()}
                        </div>
                      </Tab>
                    </EDSCTabs>
                  )
                  : (
                    <>
                      {
                        dataLinks.length > 0 && (
                          <div className="granule-results-data-links-button__menu-panel">
                            <div className="tab-content">
                              {dataLinksList}
                            </div>
                          </div>
                        )
                      }
                      {
                        s3Links.length > 0 && (
                          <div className="granule-results-data-links-button__menu-panel">
                            <div className="tab-content">
                              {s3LinksList}
                            </div>
                          </div>
                        )
                      }
                    </>
                  )
              }
            </Dropdown.Menu>,
            document.querySelector('#root')
          )
        }
      </Dropdown>
    )
  }

  if (dataLinks.length === 1) {
    return (
      <Button
        className="button granule-results-data-links-button__button"
        icon={FaDownload}
        variant={buttonVariant}
        href={dataLinks[0].href}
        onClick={() => onMetricsDataAccess({
          type: 'single_granule_download',
          collections: [{
            collectionId
          }]
        })}
        rel="noopener noreferrer"
        label="Download single granule data"
        target="_blank"
      />
    )
  }

  return (
    <Button
      className="button granule-results-data-links-button__button"
      variant={buttonVariant}
      type="button"
      icon={FaDownload}
      label="No download link available"
      disabled
      onClick={e => e.preventDefault()}
    />
  )
}

GranuleResultsDataLinksButton.displayName = 'GranuleResultsDataLinksButton'

GranuleResultsDataLinksButton.defaultProps = {
  buttonVariant: ''
}

GranuleResultsDataLinksButton.propTypes = {
  buttonVariant: PropTypes.string,
  collectionId: PropTypes.string.isRequired,
  directDistributionInformation: PropTypes.shape({}).isRequired,
  dataLinks: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  s3Links: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired
}

export default GranuleResultsDataLinksButton
