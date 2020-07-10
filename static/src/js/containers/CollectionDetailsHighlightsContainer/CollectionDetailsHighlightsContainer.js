import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import actions from '../../actions'

import CollectionDetailsHighlights from '../../components/CollectionDetailsHighlights/CollectionDetailsHighlights'
import { getFocusedCollectionObject } from '../../util/focusedCollection'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  collectionSearch: state.searchResults.collections
})

const mapDispatchToProps = dispatch => ({
  onToggleRelatedUrlsModal:
    state => dispatch(actions.toggleRelatedUrlsModal(state))
})

export const CollectionDetailsHighlightsContainer = ({
  collections,
  collectionSearch,
  focusedCollection,
  location,
  onToggleRelatedUrlsModal
}) => {
  const collectionObject = getFocusedCollectionObject(focusedCollection, collections)

  const {
    isLoaded,
    isLoading
  } = collectionSearch

  return (
    <CollectionDetailsHighlights
      collection={collectionObject}
      isLoading={isLoading}
      isLoaded={isLoaded}
      location={location}
      onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
    />
  )
}

CollectionDetailsHighlightsContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  collectionSearch: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  location: PropTypes.shape({}).isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CollectionDetailsHighlightsContainer)
)
