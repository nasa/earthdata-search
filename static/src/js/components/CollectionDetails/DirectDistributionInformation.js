import React from 'react'

import './DirectDistributionInformation.scss'

const DirectDistributionInformation = ({
  directDistributionInformation
}) => {
  const {
    region,
    s3BucketAndObjectPrefixNames,
    s3CredentialsApiEndpoint,
    s3CredentialsApiDocumentationUrl
  } = directDistributionInformation
  return (
    <div>
      <p className="direct-distribution-information__instance-field-title">Direct Distribution Information:</p>
      <div className="direct-distribution-information__definition-list-container">
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
    </div>
  )
}
export default DirectDistributionInformation
