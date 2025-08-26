import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import RelatedUrlsModal from '../../components/CollectionDetails/RelatedUrlsModal'

export const mapStateToProps = (state) => ({
  isOpen: state.ui.relatedUrlsModal.isOpen
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleRelatedUrlsModal:
    (state) => dispatch(actions.toggleRelatedUrlsModal(state))
})

export const RelatedUrlsModalContainer = ({
  isOpen,
  onToggleRelatedUrlsModal
}) => (
  <RelatedUrlsModal
    isOpen={isOpen}
    onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
  />
)

RelatedUrlsModalContainer.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(RelatedUrlsModalContainer)
