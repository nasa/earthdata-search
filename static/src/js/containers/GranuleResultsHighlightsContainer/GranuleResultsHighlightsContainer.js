import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { min } from 'lodash'

import { getFocusedCollectionGranuleMetadata } from '../../selectors/collectionResults'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'
import { getGranuleIds } from '../../util/getGranuleIds'
import { locationPropType } from '../../util/propTypes/location'

import GranuleResultsHighlights from '../../components/GranuleResultsHighlights/GranuleResultsHighlights'

export const mapStateToProps = (state) => ({
  collectionsQuery: state.query.collection,
  collectionsSearch: state.searchResults.collections,
  focusedCollectionGranuleMetadata: getFocusedCollectionGranuleMetadata(state),
  focusedCollectionId: getFocusedCollectionId(state),
  focusedCollectionMetadata: getFocusedCollectionMetadata(state)
})

export const GranuleResultsHighlightsContainer = ({
  collectionsQuery,
  collectionsSearch,
  focusedCollectionGranuleMetadata,
  focusedCollectionId,
  focusedCollectionMetadata,
  location
}) => {
  const {
    isOpenSearch
  } = focusedCollectionMetadata

  const { byId: collectionSearchById = {} } = collectionsSearch
  const { [focusedCollectionId]: collectionSearchResults = {} } = collectionSearchById
  const { granules: collectionGranuleSearch = {} } = collectionSearchResults

  console.log('collectionGranuleSearch', collectionGranuleSearch)

  const { [focusedCollectionId]: collectionQueryResults = {} } = collectionsQuery
  const { granules: collectionGranuleQuery = {} } = collectionQueryResults
  const { excludedGranuleIds = [] } = collectionGranuleQuery

  const {
    allIds,
    hits,
    isLoading,
    isLoaded
  } = collectionGranuleSearch

  // Limit the number of granules shown
  const limit = min([5, hits])

  const granuleIds = getGranuleIds({
    allIds,
    excludedGranuleIds,
    isOpenSearch,
    limit
  })

  const granuleList = granuleIds.map((granuleId) => (
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
  collectionsSearch: PropTypes.shape({
    byId: PropTypes.shape({})
  }).isRequired,
  focusedCollectionGranuleMetadata: PropTypes.shape({}).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedCollectionMetadata: PropTypes.shape({
    isOpenSearch: PropTypes.bool
  }).isRequired,
  location: locationPropType.isRequired
}

export default withRouter(
  connect(mapStateToProps)(GranuleResultsHighlightsContainer)
)
