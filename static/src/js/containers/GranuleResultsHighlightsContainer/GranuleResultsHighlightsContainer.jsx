import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { min } from 'lodash-es'

import {
  getFocusedCollectionGranuleMetadata,
  getFocusedCollectionGranuleResults
} from '../../selectors/collectionResults'
import { getFocusedCollectionId } from '../../selectors/focusedCollection'
import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'
import { getGranuleIds } from '../../util/getGranuleIds'

import GranuleResultsHighlights from '../../components/GranuleResultsHighlights/GranuleResultsHighlights'

import { getCollectionsQuery } from '../../zustand/selectors/query'
import useEdscStore from '../../zustand/useEdscStore'

export const mapStateToProps = (state) => ({
  focusedCollectionGranuleMetadata: getFocusedCollectionGranuleMetadata(state),
  focusedCollectionGranuleSearch: getFocusedCollectionGranuleResults(state),
  focusedCollectionId: getFocusedCollectionId(state),
  focusedCollectionMetadata: getFocusedCollectionMetadata(state)
})

export const GranuleResultsHighlightsContainer = ({
  focusedCollectionGranuleSearch,
  focusedCollectionGranuleMetadata,
  focusedCollectionId,
  focusedCollectionMetadata
}) => {
  const {
    isOpenSearch
  } = focusedCollectionMetadata

  const collectionsQuery = useEdscStore(getCollectionsQuery)
  const { [focusedCollectionId]: collectionQueryResults = {} } = collectionsQuery
  const { granules: collectionGranuleQuery = {} } = collectionQueryResults
  const { excludedGranuleIds = [] } = collectionGranuleQuery

  const {
    allIds = [],
    hits,
    isLoading = false,
    isLoaded = false
  } = focusedCollectionGranuleSearch

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
      visibleGranules={visibleGranules}
    />
  )
}

GranuleResultsHighlightsContainer.propTypes = {
  focusedCollectionGranuleMetadata: PropTypes.shape({}).isRequired,
  focusedCollectionGranuleSearch: PropTypes.shape({
    allIds: PropTypes.arrayOf(PropTypes.string),
    hits: PropTypes.number,
    isLoading: PropTypes.bool,
    isLoaded: PropTypes.bool
  }).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedCollectionMetadata: PropTypes.shape({
    isOpenSearch: PropTypes.bool
  }).isRequired
}

export default connect(mapStateToProps)(GranuleResultsHighlightsContainer)
