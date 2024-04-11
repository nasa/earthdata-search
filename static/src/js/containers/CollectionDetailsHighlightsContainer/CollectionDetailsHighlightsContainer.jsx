import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'
import { locationPropType } from '../../util/propTypes/location'

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
  location,
  onToggleRelatedUrlsModal
}) => (
  <CollectionDetailsHighlights
    collectionMetadata={collectionMetadata}
    collectionsSearch={collectionsSearch}
    location={location}
    onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
  />
)

CollectionDetailsHighlightsContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  collectionsSearch: PropTypes.shape({}).isRequired,
  location: locationPropType.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionDetailsHighlightsContainer)
)
