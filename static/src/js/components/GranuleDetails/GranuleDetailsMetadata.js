import React from 'react'
import PropTypes from 'prop-types'

import './GranuleDetailsMetadata.scss'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'

export const GranuleDetailsMetadata = ({ authToken, metadataUrls }) => {
  const metdataUrlKeys = [
    'native',
    'umm_json',
    'atom',
    'echo10',
    'iso19115'
  ]

  const { apiHost } = getEnvironmentConfig()

  return (
    <div className="granule-details-metadata">
      <div className="granule-details-metadata__content">
        <h4 className="granule-details-metadata__heading">Download Metadata:</h4>
        <ul className="granule-details-metadata__list">
          {
            metdataUrlKeys.length && metdataUrlKeys.map((key) => {
              const metadataUrl = metadataUrls[key]

              let url = metadataUrl.href
              if (authToken !== '') url = `${apiHost}/concepts/metadata?url=${encodeURIComponent(metadataUrl.href)}&token=${authToken}`

              return (
                <li
                  key={`metadata_url_${metadataUrl.title}`}
                  className="granule-details-metadata__list"
                >
                  <a href={url}>
                    {metadataUrl.title}
                  </a>
                </li>
              )
            })
          }
        </ul>
      </div>
    </div>
  )
}

GranuleDetailsMetadata.propTypes = {
  authToken: PropTypes.string.isRequired,
  metadataUrls: PropTypes.shape({}).isRequired
}

export default GranuleDetailsMetadata
