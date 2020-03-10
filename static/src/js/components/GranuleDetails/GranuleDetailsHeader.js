import React from 'react'
import PropTypes from 'prop-types'

import { granuleTitle } from './skeleton'

import Skeleton from '../Skeleton/Skeleton'

import './GranuleDetailsHeader.scss'

/**
 * Renders GranuleDetailsHeader.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.ummJson - The focused granule metadata.
 */
const GranuleDetailsHeader = ({ ummJson }) => {
  const { GranuleUR: granuleUr } = ummJson

  return (
    <div className="row granule-details-header">
      <div className="col-auto">
        <div className="granule-details-header__title-wrap">
          {
            granuleUr
              ? (
                <h2 className="granule-details-header__title">{granuleUr}</h2>
              )
              : (
                <Skeleton
                  className="granule-details-header__title"
                  containerStyle={{ display: 'inline-block', height: '1.375rem', width: '17.5rem' }}
                  shapes={granuleTitle}
                />
              )
          }
        </div>
      </div>
    </div>
  )
}

GranuleDetailsHeader.propTypes = {
  ummJson: PropTypes.shape({}).isRequired
}

export default GranuleDetailsHeader
