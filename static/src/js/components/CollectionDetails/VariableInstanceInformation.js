import React from 'react'

import './VariableInstanceInformation.scss'
// import '../CollectionDetails/CollectionDetailsBody.scss'
// import DirectDistributionInformation from './DirectDistributionInformation/DirectDistributionInformation'
import DirectDistributionInformation from './DirectDistributionInformation'

export const VariableInstanceInformation = ({
  instanceInformation
}) => {
  const {
    url, format, description, directDistributionInformation
  } = instanceInformation

  //   const {
  //     region,
  //     s3BucketAndObjectPrefixNames,
  //     s3CredentialsApiEndpoint,
  //     s3CredentialsApiDocumentationUrl
  //   } = directDistributionInformation

  return (
    <div>
      <div className="variable-instance-information__instance-field">
        <p className="variable-instance-information__instance-field-title">URL:</p>
        <a href={url}>
          {' '}
          {url}
        </a>
      </div>

      <div className="variable-instance-information__instance-field">
        <p className="variable-instance-information__instance-field-title">Format:</p>
        {' '}
        {format}
      </div>

      <div className="variable-instance-information__instance-field">
        <p className="variable-instance-information__instance-field-title">Description:</p>
        {' '}
        {description}
      </div>

      {/* <div className="variable-instance-information__definition-list-container">
        <dl className="collection-details-body__info">
          <dt>Region</dt>
          <dd
            className="collection-details-body__cloud-access__region"
            data-testid="collection-details-body__cloud-access__region"
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
                                      className="collection-details-body__cloud-access__bucket-name"
                                      data-testid="collection-details-body__cloud-access__bucket-name"
                                    >
                                      {name}
                                    </dd>
                                  )
                                })
                              )
                            }
          <dt>AWS S3 Credentials</dt>
          <dd className="collection-details-body__links collection-details-body__links--horizontal">
            <a
              className="link link--external collection-details-body__link collection-details-body__cloud-access__api-link"
              data-testid="collection-details-body__cloud-access__api-link"
              href={s3CredentialsApiEndpoint}
              rel="noopener noreferrer"
              target="_blank"
            >
              Get AWS S3 Credentials
            </a>
            <a
              className="link link--separated link--external collection-details-body__link collection-details-body__cloud-access__documentation-link"
              data-testid="collection-details-body__cloud-access__documentation-link"
              href={s3CredentialsApiDocumentationUrl}
              rel="noopener noreferrer"
              target="_blank"
            >
              Documentation
            </a>
          </dd>
        </dl>
      </div> */}
      {/* <ul className="variable-instance-information__direct-distribution-information-list">
        <li className="variable-instance-information__list-item">
          <p className="variable-instance-information__instance-field-title">Region:</p>
          {' '}
          {region}
        </li>
        <li className="variable-instance-information__list-item">
          <p className="variable-instance-information__instance-field-title">S3 Bucket And Object Prefix Names:</p>
          {' '}
          <a href={s3BucketAndObjectPrefixNames}>{s3BucketAndObjectPrefixNames}</a>
        </li>

        <li className="variable-instance-information__list-item">
          <p className="variable-instance-information__instance-field-title">S3 Credentials API Endpoint:</p>
          {' '}
          <a href={s3CredentialsApiEndpoint}>{s3CredentialsApiEndpoint}</a>
        </li>

        <li className="variable-instance-information__list-item">
          <p className="variable-instance-information__instance-field-title">S3 Credentials API Documentation URL:</p>
          {' '}
          <a href={s3CredentialsApiDocumentationUrl}>{s3CredentialsApiDocumentationUrl}</a>
        </li>
      </ul> */}
      <DirectDistributionInformation
        directDistributionInformation={directDistributionInformation}
      />

    </div>
  )
}

export default VariableInstanceInformation
