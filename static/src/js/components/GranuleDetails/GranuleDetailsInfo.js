import React from 'react'
import PropTypes from 'prop-types'

import './GranuleDetailsInfo.scss'

import Spinner from '../Spinner/Spinner'

export const GranuleDetailsInfo = ({ ummJson }) => (
  <div className="granule-details-info">
    <div className="granule-details-info__content">
      {
        ummJson && JSON.stringify(ummJson, null, 2)
      }
      {
        !ummJson && (
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

GranuleDetailsInfo.defaultProps = {
  ummJson: null
}

GranuleDetailsInfo.propTypes = {
  ummJson: PropTypes.shape({})
}

export default GranuleDetailsInfo
