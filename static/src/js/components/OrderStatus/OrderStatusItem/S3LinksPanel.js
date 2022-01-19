import React from 'react'
import PropTypes from 'prop-types'

import { getFilenameFromPath } from '../../../util/getFilenameFromPath'
import { pluralize } from '../../../util/pluralize'
import { commafy } from '../../../util/commafy'

import TextWindowActions from '../../TextWindowActions/TextWindowActions'
import CopyableText from '../../CopyableText/CopyableText'

/**
 * Renders S3LinksPanel.
 * @param {Object} arg0 - The props passed into the component.
 * @param {String} arg0.accessMethodType - The retrieval collection access method.
 * @param {Object} arg0.directDistributionInformation - The collection direct distribution information.
 * @param {Array} arg0.s3Links - The s3 links.
 * @param {String} arg0.retrievalId - The retrieval id.
 * @param {Number} arg0.granuleCount - The retrieval collection granule count.
 * @param {Boolean} arg0.granuleLinksIsLoading - A flag set when the granule links are loading.
 * @param {Boolean} arg0.showTextWindowActions - A flag set when the text window actions should be set.
*/
export const S3LinksPanel = ({
  accessMethodType,
  directDistributionInformation,
  s3Links,
  retrievalId,
  granuleCount,
  granuleLinksIsLoading,
  showTextWindowActions
}) => {
  const downloadFileName = `${retrievalId}-${accessMethodType}-s3.txt`

  const {
    region,
    s3BucketAndObjectPrefixNames = [],
    s3CredentialsApiDocumentationUrl,
    s3CredentialsApiEndpoint
  } = directDistributionInformation

  return s3Links.length > 0 ? (
    <>
      <div className="order-status-item__tab-intro">
        {
          region && (
            <>
              <p>{`Direct cloud access for this collection is available in the ${region} region in AWS S3.`}</p>
              <div className="order-status-item__direct-distribution-information">
                <div className="order-status-item__direct-distribution-item">
                  Region
                  <CopyableText
                    className="order-status-item__direct-distribution-item-value"
                    text={region}
                    label="Copy to clipboard"
                    successMessage="Copied the AWS S3 region"
                    failureMessage="Could not copy the AWS S3 region"
                  />
                </div>
                <div className="order-status-item__direct-distribution-item">
                  Bucket/Object Prefix
                  {s3BucketAndObjectPrefixNames.map((bucketAndObjPrefix, i) => (
                    <React.Fragment key={`${region}_${bucketAndObjPrefix}`}>
                      <CopyableText
                        className="order-status-item__direct-distribution-item-value"
                        text={bucketAndObjPrefix}
                        label="Copy to clipboard"
                        successMessage="Copied the AWS S3 Bucket/Object Prefix"
                        failureMessage="Could not copy the AWS S3 Bucket/Object Prefix"
                      />
                      {i !== s3BucketAndObjectPrefixNames.length - 1 && ', '}
                    </React.Fragment>
                  ))}
                </div>
                <div className="order-status-item__direct-distribution-item">
                  AWS S3 Credentials
                  <span className="order-status-item__direct-distribution-item-value">
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
              </div>
              <span className="order-status-item__status-text">
                {
                  granuleLinksIsLoading
                    ? `Retrieving objects for ${commafy(granuleCount)} ${pluralize('granule', granuleCount)}...`
                    : `Retrieved ${s3Links.length} ${pluralize('object', s3Links.length)} for ${commafy(granuleCount)} ${pluralize('granule', granuleCount)}`
                }
              </span>
            </>
          )
        }
      </div>
      <TextWindowActions
        id={`links-${retrievalId}`}
        fileContents={s3Links.join('\n')}
        fileName={downloadFileName}
        clipboardContents={s3Links.join('\n')}
        modalTitle="AWS S3 Access"
        disableCopy={!showTextWindowActions}
        disableSave={!showTextWindowActions}
      >
        <ul className="download-links-panel__list">
          {
            s3Links.map((path, i) => {
              const key = `link_${i}`
              const s3LinkTitle = getFilenameFromPath(path)

              return (
                <li key={key}>
                  <CopyableText
                    text={path}
                    label="Copy AWS S3 path to clipboard"
                    successMessage={() => `Copied AWS S3 path for: ${s3LinkTitle}`}
                    failureMessage={() => `Could not copy AWS S3 path for: ${s3LinkTitle}`}
                  />
                </li>
              )
            })
          }
        </ul>
      </TextWindowActions>
    </>
  )
    : (
      <div className="order-status-item__tab-intro">
        The AWS S3 objects will become available once the order has finished processing
      </div>
    )
}

S3LinksPanel.defaultProps = {
  showTextWindowActions: true
}

S3LinksPanel.propTypes = {
  accessMethodType: PropTypes.string.isRequired,
  directDistributionInformation: PropTypes.shape({
    region: PropTypes.string,
    s3BucketAndObjectPrefixNames: PropTypes.string,
    s3CredentialsApiEndpoint: PropTypes.string,
    s3CredentialsApiDocumentationUrl: PropTypes.string
  }).isRequired,
  s3Links: PropTypes.arrayOf(
    PropTypes.string
  ).isRequired,
  retrievalId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number.isRequired,
  granuleLinksIsLoading: PropTypes.bool.isRequired,
  showTextWindowActions: PropTypes.bool
}

export default S3LinksPanel
