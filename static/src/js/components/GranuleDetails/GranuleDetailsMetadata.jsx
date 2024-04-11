import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Spinner from '../Spinner/Spinner'

import './GranuleDetailsMetadata.scss'
import { buildAuthenticatedRedirectUrl } from '../../util/url/buildAuthenticatedRedirectUrl'

export const GranuleDetailsMetadata = ({
  authToken,
  earthdataEnvironment,
  metadataUrls
}) => {
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
        {
          !isEmpty(metadataUrls)
            ? (
              <>
                <h4 className="granule-details-metadata__heading">Download Metadata:</h4>
                <ul
                  className="granule-details-metadata__list"
                  data-testid="granule-details-metadata__list"
                >
                  {
                    metdataUrlKeys.length && metdataUrlKeys.map((key) => {
                      const metadataUrl = metadataUrls[key]
                      const { title, href } = metadataUrl

                      let cmrGranulesUrl = href
                      if (authToken !== '') {
                        // If an auth token is provided route the request through Lambda
                        cmrGranulesUrl = buildAuthenticatedRedirectUrl(
                          encodeURIComponent(href),
                          authToken,
                          earthdataEnvironment
                        )
                      }

                      return (
                        <li
                          key={`metadata_url_${title}`}
                          className="granule-details-metadata__list"
                        >
                          <a href={cmrGranulesUrl}>
                            {title}
                          </a>
                        </li>
                      )
                    })
                  }
                </ul>
              </>
            )
            : (
              <Spinner
                className="granule-details-info__spinner"
                type="dots"
                size="small"
              />
            )
        }
      </div>
    </div>
  )
}

GranuleDetailsMetadata.defaultProps = {
  authToken: PropTypes.string,
  metadataUrls: null
}

GranuleDetailsMetadata.propTypes = {
  authToken: PropTypes.string,
  earthdataEnvironment: PropTypes.string.isRequired,
  metadataUrls: PropTypes.shape({})
}

export default GranuleDetailsMetadata
