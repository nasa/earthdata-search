import React from 'react'
import PropTypes from 'prop-types'

import './GranuleDetailsInfo.scss'

import Spinner from '../Spinner/Spinner'

export const GranuleDetailsInfo = ({ granuleMetadata }) => (
  <div className="granule-details-info">
    <div className="granule-details-info__content">
      {
        granuleMetadata && JSON.stringify(granuleMetadata, null, 2)
      }
      {
        !granuleMetadata && (
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

GranuleDetailsInfo.propTypes = {
  granuleMetadata: PropTypes.shape({}).isRequired
}

export default GranuleDetailsInfo
