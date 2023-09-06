import React from 'react'
import PropTypes from 'prop-types'

import './VariableInstanceInformation.scss'

export const VariableInstanceInformation = ({
  instanceInformation
}) => {
  const {
    url, format, description, directDistributionInformation
  } = instanceInformation

  const {
    region,
    s3BucketAndObjectPrefixNames = [],
    s3CredentialsApiEndpoint,
    s3CredentialsApiDocumentationUrl
  } = directDistributionInformation

  return (
    <>
      <div className="variable-instance-information__instance-field">
        <p className="variable-instance-information__instance-field-title">URL:</p>
        {' '}
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

      <p className="variable-instance-information__instance-field-title">Direct Distribution Information:</p>
      <ul className="variable-instance-information__direct-distribution-information-list">
        <li className="variable-instance-information__list-item">
          <p className="variable-instance-information__instance-field-list-title">Region:</p>
          {' '}
          {region}
        </li>
        { s3BucketAndObjectPrefixNames.length > 0 && (
        <li className="variable-instance-information__list-item">
          <p className="variable-instance-information__instance-field-list-title">S3 Bucket And Object Prefix Names:</p>
          {' '}
          {
              s3BucketAndObjectPrefixNames.map((name, i) => {
                const key = `${name}-${i}`
                return (
                  <a className="variable-instance-information__bucket-name" href={name} key={key}>
                    {name}
                    <br />
                  </a>
                )
              })
          }
        </li>
        )}

        <li className="variable-instance-information__list-item">
          <p className="variable-instance-information__instance-field-list-title">S3 Credentials API Endpoint:</p>
          {' '}
          <a href={s3CredentialsApiEndpoint}>{s3CredentialsApiEndpoint}</a>
        </li>

        <li className="variable-instance-information__list-item">
          <p className="variable-instance-information__instance-field-list-title">S3 Credentials API Documentation URL:</p>
          {' '}
          <a href={s3CredentialsApiDocumentationUrl}>{s3CredentialsApiDocumentationUrl}</a>
        </li>
      </ul>
    </>
  )
}

VariableInstanceInformation.propTypes = {
  instanceInformation: PropTypes.shape({
    url: PropTypes.string,
    format: PropTypes.string,
    description: PropTypes.string,
    directDistributionInformation: PropTypes.shape({
      region: PropTypes.string,
      s3BucketAndObjectPrefixNames: PropTypes.arrayOf(PropTypes.string),
      s3CredentialsApiEndpoint: PropTypes.string,
      s3CredentialsApiDocumentationUrl: PropTypes.string
    })
  }).isRequired
}

export default VariableInstanceInformation
