import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { locationPropType } from '../../util/propTypes/location'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import CollectionDetailsHeader from '../../components/CollectionDetails/CollectionDetailsHeader'

const mapStateToProps = state => ({
  collectionQuery: state.query.collection,
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionsSearch: state.searchResults.collections,
  mapProjection: state.map.projection
})

export const CollectionDetailsHeaderContainer = ({
  collectionQuery,
  collectionMetadata,
  collectionsSearch,
  location,
  mapProjection
}) => (
  <CollectionDetailsHeader
    collectionQuery={collectionQuery}
    collectionsSearch={collectionsSearch}
    collectionMetadata={collectionMetadata}
    location={location}
    mapProjection={mapProjection}
  />
)

CollectionDetailsHeaderContainer.propTypes = {
  collectionQuery: PropTypes.shape({}).isRequired,
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  mapProjection: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(CollectionDetailsHeaderContainer)
)
