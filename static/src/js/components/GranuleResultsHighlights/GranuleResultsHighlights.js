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
    {
      granules.map((granule) => {
        const {
          producer_granule_id: producerGranuleId,
          formatted_temporal: formattedTemporal
        } = granule

        const timeStart = formattedTemporal[0]
        const timeEnd = formattedTemporal[1]

        return (
          <div key={producerGranuleId}>
            <p>{producerGranuleId}</p>
            <p>
              Start
              <span>{timeStart}</span>
            </p>
            <p>
              End
              <span>{timeEnd}</span>
            </p>
          </div>
        )
      })
    }
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
