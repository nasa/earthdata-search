import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import actions from '../../actions'
import { getFocusedCollectionObject } from '../../util/focusedCollection'

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
  const focusedCollectionObject = getFocusedCollectionObject(focusedCollection, collections)

  if (isEmpty(focusedCollectionObject)) return null

  return (
    <RelatedUrlsModal
      focusedCollectionObject={focusedCollectionObject}
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
