import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

import CollectionDetailsHighlights from '../../components/CollectionDetailsHighlights/CollectionDetailsHighlights'

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  collectionsSearch: state.searchResults.collections
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleRelatedUrlsModal:
    (state) => dispatch(actions.toggleRelatedUrlsModal(state))
})

export const CollectionDetailsHighlightsContainer = ({
  collectionMetadata,
  collectionsSearch,
  onToggleRelatedUrlsModal
}) => (
  <CollectionDetailsHighlights
    collectionMetadata={collectionMetadata}
    collectionsSearch={collectionsSearch}
    onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
  />
)

CollectionDetailsHighlightsContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionDetailsHighlightsContainer)
