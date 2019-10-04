import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import CollectionDetailsHeader from '../../components/CollectionDetails/CollectionDetailsHeader'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  collectionSearch: state.query.collection
})

export const CollectionDetailsHeaderContainer = ({
  collections,
  focusedCollection,
  collectionSearch = {}
}) => {
  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  return (
    <CollectionDetailsHeader
      focusedCollectionMetadata={focusedCollectionMetadata}
      collectionSearch={collectionSearch}
    />
  )
}

CollectionDetailsHeaderContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  collectionSearch: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(CollectionDetailsHeaderContainer)
)
