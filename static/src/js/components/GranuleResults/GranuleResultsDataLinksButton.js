import React, { useRef } from 'react'
import ReactDOM from 'react-dom'
import { Dropdown, Tab } from 'react-bootstrap'
import { PropTypes } from 'prop-types'
import { FaDownload, FaCloud } from 'react-icons/fa'

import Button from '../Button/Button'
import CopyableText from '../CopyableText/CopyableText'
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
 * @param {String} props.buttonVariant - The button variant.
 * @param {String} props.collectionId - The collection ID.
 * @param {Object} props.directDistributionInformation - The collection direct distribution information.
 * @param {Array} props.dataLinks - An array of data links.
 * @param {Array} props.s3Links - An array of AWS S3 links.
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

  // If only one datalink is provided and s3 links are not provided, a button is shown rather
  // than a dropdown list. Otherwise, use a dropdown for the links.
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
                  <span className="granule-results-data-links-button__menu-panel-label granule-results-data-links-button__menu-panel-label--align">
                    {'Region: '}
                  </span>
                  <CopyableText
                    className="granule-results-data-links-button__menu-panel-value"
                    text={region}
                    label="Copy to clipboard"
                    successMessage="Copied the AWS S3 region"
                    failureMessage="Could not copy the AWS S3 region"
                  />
                </div>
                <div className="granule-results-data-links-button__menu-panel-heading-row">
                  <span className="granule-results-data-links-button__menu-panel-label granule-results-data-links-button__menu-panel-label--align">
                    {'Bucket/Object Prefix: '}
                  </span>
                  {s3BucketAndObjectPrefixNames.map((bucketAndObjPrefix, i) => (
                    <React.Fragment key={`${region}_${bucketAndObjPrefix}`}>
                      <CopyableText
                        className="granule-results-data-links-button__menu-panel-value"
                        text={bucketAndObjPrefix}
                        label="Copy to clipboard"
                        successMessage="Copied the AWS S3 Bucket/Object Prefix"
                        failureMessage="Could not copy the AWS S3 Bucket/Object Prefix"
                      />
                      {i !== s3BucketAndObjectPrefixNames.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </div>
                <div className="granule-results-data-links-button__menu-panel-heading-row">
                  <span className="granule-results-data-links-button__menu-panel-label">
                    {'AWS S3 Credentials: '}
                  </span>
                  <span className="granule-results-data-links-button__menu-panel-value">
                    <a
                      className="link link--external"
                      href={s3CredentialsApiEndpoint}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Get AWS S3 Credentials
                    </a>
                    <a
                      className="link link--separated link--external"
                      href={s3CredentialsApiDocumentationUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      View Documentation
                    </a>
                  </span>
                </div>
              </header>
            )
          }
          {
            s3Links.map(({ href }, i) => {
              const key = `s3_link_${i}`
              const s3LinkTitle = getFilenameFromPath(href)

              return (
                <Dropdown.Item
                  key={key}
                  as={CopyableText}
                  className="granule-results-data-links-button__dropdown-item"
                  label="Copy AWS S3 path to clipboard"
                  textToCopy={href}
                  text={s3LinkTitle}
                  successMessage={() => `Copied AWS S3 path for: ${s3LinkTitle}`}
                  failureMessage={() => `Could not copy AWS S3 path for: ${s3LinkTitle}`}
                  onClick={() => {
                    onMetricsDataAccess({
                      type: 'single_granule_s3_access',
                      collections: [{
                        collectionId
                      }]
                    })
                  }}
                />
              )
            })
          }
        </div>
      )
    }

    return (
      <Dropdown onClick={(e) => { e.stopPropagation() }} drop="right">
        <Dropdown.Toggle as={CustomDataLinksToggle} />
        {
          ReactDOM.createPortal(
            <Dropdown.Menu
              ref={dropdownMenuRef}
              className="granule-results-data-links-button__menu"
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
                              {s3LinksList()}
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
      onClick={(e) => e.preventDefault()}
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
  directDistributionInformation: PropTypes.shape({
    region: PropTypes.string,
    s3BucketAndObjectPrefixNames: PropTypes.arrayOf(PropTypes.string),
    s3CredentialsApiDocumentationUrl: PropTypes.string,
    s3CredentialsApiEndpoint: PropTypes.string
  }).isRequired,
  dataLinks: PropTypes.arrayOf(PropTypes.shape({
    href: PropTypes.string
  })).isRequired,
  s3Links: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onMetricsDataAccess: PropTypes.func.isRequired
}

export default GranuleResultsDataLinksButton
