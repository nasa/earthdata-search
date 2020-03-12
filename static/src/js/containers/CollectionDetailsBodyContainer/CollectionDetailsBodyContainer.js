import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import actions from '../../actions/index'
import {
  getFocusedCollectionMetadata,
  getFocusedCollectionFormattedMetadata
} from '../../util/focusedCollection'

import CollectionDetailsBody from '../../components/CollectionDetails/CollectionDetailsBody'

const mapDispatchToProps = dispatch => ({
  onToggleRelatedUrlsModal:
    state => dispatch(actions.toggleRelatedUrlsModal(state))
})

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection
})

export const CollectionDetailsBodyContainer = ({
  collections,
  focusedCollection,
  isActive,
  onToggleRelatedUrlsModal
}) => {
  const collectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)
  const formattedCollectionMetadata = getFocusedCollectionFormattedMetadata(
    focusedCollection, collections
  )

  return (
    <CollectionDetailsBody
      collectionMetadata={collectionMetadata}
      formattedCollectionMetadata={formattedCollectionMetadata}
      isActive={isActive}
      onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
    />
  )
}

CollectionDetailsBodyContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionDetailsBodyContainer)
)
