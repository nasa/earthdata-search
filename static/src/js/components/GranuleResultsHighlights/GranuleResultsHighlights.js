import React from 'react'
import PropTypes from 'prop-types'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import commafy from '../../util/commafy'
import pluralize from '../../util/pluralize'

import './GranuleResultsHighlights.scss'

export const GranuleResultsHighlights = ({
  granules,
  hits,
  limit,
  location
}) => (
  <div className="granule-results-highlights">
    <p>Matching Granules</p>
    <p>
      {`Showing ${commafy(limit)} of ${commafy(
        hits
      )} matching ${pluralize('granule', hits)}`}
    </p>
    <ul className="granule-results-highlights__list">
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
            <li key={key} className="granule-results-highlights__item-time">
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
    </ul>
    <PortalLinkContainer
      className="granule-results-header__title-link"
      to={{
        pathname: '/search/granules',
        search: location.search
      }}
    >
      {'View Granules'}
    </PortalLinkContainer>
  </div>
)

GranuleResultsHighlights.propTypes = {
  granules: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  hits: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  location: PropTypes.shape({}).isRequired
}

export default GranuleResultsHighlights
