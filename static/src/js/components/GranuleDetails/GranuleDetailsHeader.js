import React from 'react'
import PropTypes from 'prop-types'

import { granuleTitle } from './skeleton'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Skeleton from '../Skeleton/Skeleton'

import './GranuleDetailsHeader.scss'

/**
 * Renders GranuleDetailsHeader.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.ummJson - The focused granule metadata.
 */
const GranuleDetailsHeader = ({ ummJson, location }) => {
  const { GranuleUR: granuleUr } = ummJson

  return (
    <div className="granule-details-header">
      <div className="granule-details-header__primary">
        <div className="row">
          <div className="col align-self-start">
            <div className="granule-details-header__title-wrap">
              {
                granuleUr
                  ? (
                    <>
                      <h2 className="granule-details-header__title">{granuleUr}</h2>
                      <PortalLinkContainer
                        className="collection-details-header__title-link"
                        to={{
                          pathname: '/search/granules',
                          search: location.search
                        }}
                      >
                        <i className="fa fa-map" />
                        {' View Granules'}
                      </PortalLinkContainer>
                    </>
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
      </div>
    </div>
  )
}

GranuleDetailsHeader.propTypes = {
  location: PropTypes.shape({}).isRequired,
  ummJson: PropTypes.shape({}).isRequired
}

export default GranuleDetailsHeader
