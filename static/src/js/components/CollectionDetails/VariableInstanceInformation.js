import React from 'react'

import './VariableInstanceInformation.scss'
import DirectDistributionInformation from './DirectDistributionInformation'

export const VariableInstanceInformation = ({
  instanceInformation
}) => {
  const {
    url, format, description, directDistributionInformation
  } = instanceInformation

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

      <DirectDistributionInformation
        directDistributionInformation={directDistributionInformation}
      />

    </div>
  )
}

export default VariableInstanceInformation
