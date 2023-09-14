import React from 'react'
import PropTypes from 'prop-types'

import './CollectionDetailsCloudAccessInstance.scss'

export const CollectionDetailsCloudAccessInstance = ({
  type,
  instanceInformation
}) => {
  if (type === 'variable') {
    const {
      url,
      format,
      description,
      directDistributionInformation
    } = instanceInformation

    const {
      region,
      s3BucketAndObjectPrefixNames = [],
      s3CredentialsApiEndpoint,
      s3CredentialsApiDocumentationUrl
    } = directDistributionInformation

    return (
      <dl>
        <dt className="collection-details-cloud-access-variable__instance-field-title">URL</dt>
        <dd>
          <a className="collection-details-cloud-access-variable__instance-field-value" href={url}>
            {url}
          </a>
        </dd>

        <dt className="collection-details-cloud-access-variable__instance-field-title">Format</dt>
        <dd>
          {format}
        </dd>

        <dt className="collection-details-cloud-access-variable__instance-field-title">Description</dt>
        <dd>
          {description}
        </dd>

        <dt>Direct Distribution Information</dt>
        <dd>
          <dl className="collection-details-cloud-access-variable__direct-distribution-information-list">
            <dt className="collection-details-cloud-access-variable__instance-field-list-title">Region</dt>
            <dd>{region}</dd>
            {
                s3BucketAndObjectPrefixNames.length > 0 && (
                  <>
                    <dt className="collection-details-cloud-access-variable__instance-field-list-title">S3 Bucket And Object Prefix Names</dt>
                    <dd>
                      <ul>
                        {
                            s3BucketAndObjectPrefixNames.map((name, i) => {
                              const key = `${name}-${i}`
                              return (
                                <li className="collection-details-cloud-access-variable__instance-field-value text-break" href={name} key={key}>
                                  {name}
                                </li>
                              )
                            })
                          }
                      </ul>
                    </dd>
                  </>
                )
              }
            <dt className="collection-details-cloud-access-variable__instance-field-list-title">S3 Credentials API Endpoint</dt>
            <dd>
              <a className="collection-details-cloud-access-variable__instance-field-value text-break" href={s3CredentialsApiEndpoint}>{s3CredentialsApiEndpoint}</a>
            </dd>
            <dt className="collection-details-cloud-access-variable__instance-field-list-title">S3 Credentials API Documentation URL</dt>
            <dd>
              <a className="collection-details-cloud-access-variable__instance-field-value text-break" href={s3CredentialsApiDocumentationUrl}>{s3CredentialsApiDocumentationUrl}</a>
            </dd>
          </dl>
        </dd>
      </dl>
    )
  }

  const { directDistributionInformation } = instanceInformation
  const {
    region,
    s3BucketAndObjectPrefixNames = [],
    s3CredentialsApiEndpoint,
    s3CredentialsApiDocumentationUrl
  } = directDistributionInformation

  return (
    <div>
      <dl className="direct-distribution-information__info">
        <dt>Region</dt>
        <dd
          className="direct-distribution-information__cloud-access__region"
          data-testid="direct-distribution-information__cloud-access__region"
        >
          {region}
        </dd>
        <dt>Bucket/Object Prefix</dt>
        {
                              s3BucketAndObjectPrefixNames.length && (
                                s3BucketAndObjectPrefixNames.map((name, i) => {
                                  const key = `${name}-${i}`
                                  return (
                                    <dd
                                      key={key}
                                      className="direct-distribution-information__cloud-access__bucket-name"
                                      data-testid="direct-distribution-information__cloud-access__bucket-name"
                                    >
                                      {name}
                                    </dd>
                                  )
                                })
                              )
                            }
        <dt>AWS S3 Credentials</dt>
        <dd className="direct-distribution-information__links direct-distribution-information__links--horizontal">
          <a
            className="link link--external direct-distribution-information__link direct-distribution-information__cloud-access__api-link"
            data-testid="direct-distribution-information__cloud-access__api-link"
            href={s3CredentialsApiEndpoint}
            rel="noopener noreferrer"
            target="_blank"
          >
            Get AWS S3 Credentials
          </a>
          <a
            className="link link--separated link--external direct-distribution-information__link direct-distribution-information__cloud-access__documentation-link"
            data-testid="direct-distribution-information__cloud-access__documentation-link"
            href={s3CredentialsApiDocumentationUrl}
            rel="noopener noreferrer"
            target="_blank"
          >
            Documentation
          </a>
        </dd>
      </dl>
    </div>
  )
}

CollectionDetailsCloudAccessInstance.defaultProps = {
  type: null,
  instanceInformation: {
    url: '',
    format: '',
    description: ''
  }
}

CollectionDetailsCloudAccessInstance.propTypes = {
  type: PropTypes.string,
  instanceInformation: PropTypes.shape({
    url: PropTypes.string,
    format: PropTypes.string,
    description: PropTypes.string,
    directDistributionInformation: PropTypes.shape({
      region: PropTypes.string,
      s3BucketAndObjectPrefixNames: PropTypes.arrayOf(PropTypes.string),
      s3CredentialsApiEndpoint: PropTypes.string,
      s3CredentialsApiDocumentationUrl: PropTypes.string
    }).isRequired
  })
}

export default CollectionDetailsCloudAccessInstance
