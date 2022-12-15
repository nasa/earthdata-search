import React from 'react'
import PropTypes from 'prop-types'
import { FaMap } from 'react-icons/fa'

import { commafy } from '../../util/commafy'
import { granuleListItem, granuleListTotal } from './skeleton'
import { pluralize } from '../../util/pluralize'
import { locationPropType } from '../../util/propTypes/location'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Skeleton from '../Skeleton/Skeleton'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './GranuleResultsHighlights.scss'

const granuleListItemSkeletonStyle = {
  height: '99px'
}

const granuleListTotalStyle = {
  height: '18px'
}

export const GranuleResultsHighlights = ({
  granuleCount,
  granules,
  isLoaded,
  isLoading,
  location,
  visibleGranules
}) => (
  <div className="granule-results-highlights">
    <div className="granule-results-highlights__count">
      {
        (isLoading) && (
          <Skeleton
            shapes={granuleListTotal}
            containerStyle={granuleListTotalStyle}
            variant="dark"
          />
        )
      }
      {
        (isLoaded && !isLoading) && (
          `Showing ${commafy(visibleGranules)} of ${commafy(
            granuleCount
          )} matching ${pluralize('granule', granuleCount)}`
        )
      }
    </div>
    <ul className="granule-results-highlights__list">
      {
        !isLoaded && (
          <>
            {
              [1, 2, 3].map((item, i) => {
                const key = `granule_loader_${i}`
                return (
                  <Skeleton
                    key={key}
                    className="granule-results-highlights__item"
                    containerStyle={granuleListItemSkeletonStyle}
                    shapes={granuleListItem}
                    variant="dark"
                  />
                )
              })
            }
          </>
        )
      }
      {
        (isLoaded && !isLoading) && (
          granuleCount > 0
            ? (
              granules.map((granule, i) => {
                const {
                  id,
                  title,
                  formattedTemporal = ['Not Provided', 'Not Provided']
                } = granule

                const [
                  timeStart,
                  timeEnd
                ] = formattedTemporal

                const key = `${id}_${i}`

                return (
                  <li key={key} className="granule-results-highlights__item">
                    <header className="granule-results-highlights__item-header">
                      <h4 className="granule-results-highlights__item-title">{title}</h4>
                    </header>
                    <div className="granule-results-highlights__item-body">
                      <div className="granule-results-highlights__temporal-row">
                        <h5 className="granule-results-highlights__temporal-label">
                          Start
                        </h5>
                        <p className="granule-results-highlights__temporal-value">{timeStart}</p>
                      </div>
                      <div className="granule-results-highlights__temporal-row">
                        <h5 className="granule-results-highlights__temporal-label">
                          End
                        </h5>
                        <p className="granule-results-highlights__temporal-value">{timeEnd}</p>
                      </div>
                    </div>
                  </li>
                )
              })
            ) : (
              <li className="granule-results-highlights__empty">
                No Granules
              </li>
            )
        )
      }
    </ul>
    {
      granuleCount > 0 && (
        <div className="granule-results-highlights__footer">
          <PortalLinkContainer
            className="granule-results-header__title-link granule-results-header__title-link-icon"
            to={{
              pathname: '/search/granules',
              search: location.search
            }}
          >
            <EDSCIcon icon={FaMap} />
            {' View Granules'}
          </PortalLinkContainer>
        </div>
      )
    }
  </div>
)

GranuleResultsHighlights.propTypes = {
  granuleCount: PropTypes.number.isRequired,
  granules: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  location: locationPropType.isRequired,
  visibleGranules: PropTypes.number.isRequired
}

export default GranuleResultsHighlights
