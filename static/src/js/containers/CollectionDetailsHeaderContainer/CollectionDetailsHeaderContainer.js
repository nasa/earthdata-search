import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import CollectionDetailsHeader from '../../components/CollectionDetails/CollectionDetailsHeader'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  collectionSearch: state.query.collection
})

export const CollectionDetailsHeaderContainer = ({
  collections,
  collectionSearch = {},
  focusedCollection,
  location
}) => {
  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  return (
    <CollectionDetailsHeader
      collectionSearch={collectionSearch}
      focusedCollectionMetadata={focusedCollectionMetadata}
      location={location}
    />
  )
}

CollectionDetailsHeaderContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(CollectionDetailsHeaderContainer)
)
