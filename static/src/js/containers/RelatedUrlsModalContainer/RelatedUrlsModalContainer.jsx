import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import RelatedUrlsModal from '../../components/CollectionDetails/RelatedUrlsModal'

import { getFocusedCollectionMetadata } from '../../selectors/collectionMetadata'

export const mapStateToProps = (state) => ({
  collectionMetadata: getFocusedCollectionMetadata(state),
  isOpen: state.ui.relatedUrlsModal.isOpen
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleRelatedUrlsModal:
    (state) => dispatch(actions.toggleRelatedUrlsModal(state))
})

export const RelatedUrlsModalContainer = ({
  collectionMetadata,
  isOpen,
  onToggleRelatedUrlsModal
}) => (
  <RelatedUrlsModal
    collectionMetadata={collectionMetadata}
    isOpen={isOpen}
    onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
  />
)

RelatedUrlsModalContainer.propTypes = {
  collectionMetadata: PropTypes.shape({}).isRequired,
  isOpen: PropTypes.bool.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(RelatedUrlsModalContainer)
