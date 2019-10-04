import React from 'react'
import PropTypes from 'prop-types'

import { granuleTitle } from './skeleton'

import Skeleton from '../Skeleton/Skeleton'

import './GranuleDetailsHeader.scss'

/**
 * Renders GranuleDetailsHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.Granule - The focused granule information.
 */
const GranuleDetailsHeader = ({ json }) => {
  const { Granule: granule = {} } = json
  const { GranuleUR } = granule

  return (
    <div className="row granule-details-header">
      <div className="col-auto">
        <div className="granule-details-header__title-wrap">
          {
            GranuleUR
              ? (
                <h2 className="granule-details-header__title">{GranuleUR}</h2>
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
  json: PropTypes.shape({}).isRequired
}

export default GranuleDetailsHeader
