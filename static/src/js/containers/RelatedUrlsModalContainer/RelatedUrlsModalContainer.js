import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'
import { getFocusedCollectionMetadata } from '../../util/focusedCollection'

import RelatedUrlsModal from '../../components/CollectionDetails/RelatedUrlsModal'

const mapStateToProps = state => ({
  collections: state.metadata.collections,
  focusedCollection: state.focusedCollection,
  isOpen: state.ui.relatedUrlsModal.isOpen
})

const mapDispatchToProps = dispatch => ({
  onToggleRelatedUrlsModal:
    state => dispatch(actions.toggleRelatedUrlsModal(state))
})

export const RelatedUrlsModalContainer = ({
  collections,
  focusedCollection,
  isOpen,
  onToggleRelatedUrlsModal
}) => {
  const focusedCollectionMetadata = getFocusedCollectionMetadata(focusedCollection, collections)

  if (Object.keys(focusedCollectionMetadata).length === 0) return null

  return (
    <RelatedUrlsModal
      focusedCollectionMetadata={focusedCollectionMetadata}
      isOpen={isOpen}
      onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
    />
  )
}

RelatedUrlsModalContainer.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  focusedCollection: PropTypes.string.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(RelatedUrlsModalContainer)
