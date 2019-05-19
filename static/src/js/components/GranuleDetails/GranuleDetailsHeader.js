// import React, { Component } from 'react'
import React from 'react'
import PropTypes from 'prop-types'

import './GranuleDetailsHeader.scss'

/**
 * Renders GranuleDetailsHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.Granule - The focused granule information.
 */

const GranuleDetailsHeader = ({ json }) => {
  const { GranuleUR } = json.Granule
  return (
    <div className="row granule-details-header">
      <div className="col-auto">
        <div className="granule-details-header__title-wrap">
          {
            GranuleUR && (
              <h2 className="granule-details-header__title">{GranuleUR}</h2>
            )
          }
        </div>
      </div>
    </div>
  )
}

GranuleDetailsHeader.propTypes = {
  json: PropTypes.shape({}).isRequired
}

export default GranuleDetailsHeader
