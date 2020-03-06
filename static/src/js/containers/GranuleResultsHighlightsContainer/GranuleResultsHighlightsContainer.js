import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { min } from 'lodash'

import GranuleResultsHighlights from '../../components/GranuleResultsHighlights/GranuleResultsHighlights'
import { getGranuleIds } from '../../util/getGranuleIds'
import { getFocusedCollectionObject } from '../../util/focusedCollection'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  granules: state.searchResults.granules
})

export const GranuleResultsHighlightsContainer = ({
  collections,
  focusedCollection,
  granules,
  location
}) => {
  const {
    byId,
    hits,
    isLoading,
    isLoaded
  } = granules

  const collectionObject = getFocusedCollectionObject(focusedCollection, collections)

  const {
    excludedGranuleIds = [],
    isCwic
  } = collectionObject

  // Limit the number of granules shown
  const limit = min([5, hits])

  const granuleIds = getGranuleIds({
    granules,
    excludedGranuleIds,
    isCwic,
    limit
  })

  const granuleList = granuleIds.map(granuleId => (
    byId[granuleId]
  ))

  const visibleGranules = granuleIds.length ? granuleIds.length : 0
  const granuleCount = hits - excludedGranuleIds.length

  return (
    <GranuleResultsHighlights
      granules={granuleList}
      granuleCount={granuleCount}
      visibleGranules={visibleGranules}
      location={location}
      isLoading={isLoading}
      isLoaded={isLoaded}
    />
  )
}

GranuleResultsHighlightsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps)(GranuleResultsHighlightsContainer)
)
