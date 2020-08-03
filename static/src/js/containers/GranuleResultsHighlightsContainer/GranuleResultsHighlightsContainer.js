import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { isEmpty, min } from 'lodash'

import { getFocusedCollectionGranuleMetadata } from '../../selectors/collectionResults'
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'
import { getGranuleIds } from '../../util/getGranuleIds'

import GranuleResultsHighlights from '../../components/GranuleResultsHighlights/GranuleResultsHighlights'

const mapStateToProps = state => ({
  collectionsQuery: state.query.collection,
  collectionsSearch: state.searchResults.collections,
  focusedCollection: state.focusedCollection,
  focusedCollectionMetadata: getFocusedCollectionMetadata(state),
  focusedCollectionGranuleMetadata: getFocusedCollectionGranuleMetadata(state)
})

export const GranuleResultsHighlightsContainer = ({
  collectionsQuery,
  collectionsSearch,
  focusedCollection,
  focusedCollectionGranuleMetadata,
  focusedCollectionMetadata,
  location
}) => {
  const {
    isCwic
  } = focusedCollectionMetadata

  const { byId: collectionSearchById = {} } = collectionsSearch
  const { [focusedCollection]: collectionSearchResults = {} } = collectionSearchById
  const { granules: collectionGranuleSearch = {} } = collectionSearchResults

  const { [focusedCollection]: collectionQueryResults = {} } = collectionsQuery
  const { granules: collectionGranuleQuery = {} } = collectionQueryResults
  const { excludedGranuleIds = [] } = collectionGranuleQuery

  const {
    allIds,
    hits,
    isLoading,
    isLoaded
  } = collectionGranuleSearch

  if (isEmpty(allIds) || allIds == null) return null

  // Limit the number of granules shown
  const limit = min([5, hits])

  const granuleIds = getGranuleIds({
    allIds,
    excludedGranuleIds,
    isCwic,
    limit
  })

  const granuleList = granuleIds.map(granuleId => (
    focusedCollectionGranuleMetadata[granuleId]
  ))

  const visibleGranules = granuleIds.length ? granuleIds.length : 0
  const granuleCount = hits - excludedGranuleIds.length

  return (
    <GranuleResultsHighlights
      granuleCount={granuleCount}
      granules={granuleList}
      isLoaded={isLoaded}
      isLoading={isLoading}
      location={location}
      visibleGranules={visibleGranules}
    />
  )
}

GranuleResultsHighlightsContainer.propTypes = {
  collectionsQuery: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  focusedCollectionGranuleMetadata: PropTypes.shape({}).isRequired,
  focusedCollectionMetadata: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps)(GranuleResultsHighlightsContainer)
)
