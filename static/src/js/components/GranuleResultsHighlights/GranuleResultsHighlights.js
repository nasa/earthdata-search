import React from 'react'
import PropTypes from 'prop-types'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import commafy from '../../util/commafy'
import pluralize from '../../util/pluralize'
import Skeleton from '../Skeleton/Skeleton'

import { granuleListItem, granuleListTotal } from './skeleton'

import './GranuleResultsHighlights.scss'

const granuleListItemSkeletonStyle = {
  height: '99px'
}

const granuleListTotalStyle = {
  height: '18px'
}

export const GranuleResultsHighlights = ({
  granules,
  granuleCount,
  visibleGranules,
  location,
  isLoading,
  isLoaded
}) => (
  <div className="granule-results-highlights">
    <div className="granule-results-highlights__count">
      {
        (isLoading && !isLoaded) && (
          <Skeleton
            shapes={granuleListTotal}
            containerStyle={granuleListTotalStyle}
            variant="dark"
          />
        )
      }
      {
        (isLoaded) && (
          `Showing ${commafy(visibleGranules)} of ${commafy(
            granuleCount
          )} matching ${pluralize('granule', granuleCount)}`
        )
      }
    </div>
    <ul className="granule-results-highlights__list">
      {
        (isLoading && !isLoaded) && (
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
        (isLoaded) && (
          <>
            {
              granules.map((granule, i) => {
                const {
                  id,
                  producer_granule_id: granuleId,
                  title: granuleTitle,
                  formatted_temporal: formattedTemporal
                } = granule

                const timeStart = formattedTemporal[0]
                const timeEnd = formattedTemporal[1]

                const title = granuleId || granuleTitle

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
            }
          </>
        )
      }
    </ul>
    <div className="granule-results-highlights__footer">
      <PortalLinkContainer
        className="granule-results-header__title-link"
        to={{
          pathname: '/search/granules',
          search: location.search
        }}
      >
        <i className="fa fa-map" />
        {' View Granules'}
      </PortalLinkContainer>
    </div>
  </div>
)

GranuleResultsHighlights.propTypes = {
  granules: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  granuleCount: PropTypes.number.isRequired,
  visibleGranules: PropTypes.number.isRequired,
  location: PropTypes.shape({}).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isLoaded: PropTypes.bool.isRequired
}

export default GranuleResultsHighlights
