import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash-es'

import Spinner from '../Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'

import './GranuleDetailsMetadata.scss'
import { getEdlToken } from '../../zustand/selectors/user'

export const GranuleDetailsMetadata = ({
  metadataUrls = null
}) => {
  const edlToken = useEdscStore(getEdlToken)

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
                      if (edlToken) {
                        cmrGranulesUrl = `${href}?token=Bearer%20${edlToken}`
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

GranuleDetailsMetadata.propTypes = {
  metadataUrls: PropTypes.shape({})
}

export default GranuleDetailsMetadata
