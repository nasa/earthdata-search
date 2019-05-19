import React from 'react'
import PropTypes from 'prop-types'

import './GranuleDetailsMetadata.scss'

export const GranuleDetailsMetadata = ({ metadataUrls }) => {
  const metdataUrlKeys = [
    'native',
    'umm_json',
    'atom',
    'echo10',
    'iso19115'
  ]
  return (
    <div className="granule-details-metadata">
      <div className="granule-details-metadata__content">
        <h4 className="granule-details-metadata__heading">Download Metadata:</h4>
        <ul className="granule-details-metadata__list">
          {
            metdataUrlKeys.length && metdataUrlKeys.map((key) => {
              const metadataUrl = metadataUrls[key]
              return (
                <li
                  key={`metadata_url_${metadataUrl.title}`}
                  className="granule-details-metadata__list"
                >
                  <a href={metadataUrl.href}>
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
  metadataUrls: PropTypes.shape({}).isRequired
}

export default GranuleDetailsMetadata
