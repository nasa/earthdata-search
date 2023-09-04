import React from 'react'

import './VariableInstanceInformation.scss'

export const VariableInstanceInformation = ({
  instanceInformation
//   url,
//   format,
//   description,
//   directDistributionInformation
}) => {
  const {
    url, format, description, directDistributionInformation
  } = instanceInformation

  const {
    region,
    s3BucketAndObjectPrefixNames,
    s3CredentialsApiEndpoint,
    s3CredentialsApiDocumentationUrl
  } = directDistributionInformation
  // TODO we need to handle if there are > 1 s3BucketAndObjectPrefixNames
  return (
    <div>
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
      </ul>
    </div>
  )
}

export default VariableInstanceInformation

// import React from 'react'
// import PropTypes from 'prop-types'

// import './VariableInstanceInformation.scss'
// import DirectDistributionInformation from './DirectDistributionInformation'

// export const VariableInstanceInformation = ({
//   instanceInformation
// }) => {
//   const {
//     url, format, description, directDistributionInformation
//   } = instanceInformation

//   return (
//     <div>
//       <div className="variable-instance-information__instance-field">
//         <p className="variable-instance-information__instance-field-title">URL:</p>
//         <a href={url}>
//           {' '}
//           {url}
//         </a>
//       </div>

//       <div className="variable-instance-information__instance-field">
//         <p className="variable-instance-information__instance-field-title">Format:</p>
//         {' '}
//         {format}
//       </div>

//       <div className="variable-instance-information__instance-field">
//         <p className="variable-instance-information__instance-field-title">Description:</p>
//         {' '}
//         {description}
//       </div>

//       <DirectDistributionInformation
//         directDistributionInformation={directDistributionInformation}
//       />

//     </div>
//   )
// }

// VariableInstanceInformation.propTypes = {
//   instanceInformation: PropTypes.shape({
//     url: PropTypes.string,
//     format: PropTypes.string,
//     description: PropTypes.string,
//     directDistributionInformation: PropTypes.shape({})
//   }).isRequired
// }

// export default VariableInstanceInformation
