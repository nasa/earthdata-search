import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import CollectionDetailsHighlights from '../../components/CollectionDetailsHighlights/CollectionDetailsHighlights'

export const mapDispatchToProps = (dispatch) => ({
  onToggleRelatedUrlsModal:
    (state) => dispatch(actions.toggleRelatedUrlsModal(state))
})

export const CollectionDetailsHighlightsContainer = ({
  onToggleRelatedUrlsModal
}) => (
  <CollectionDetailsHighlights
    onToggleRelatedUrlsModal={onToggleRelatedUrlsModal}
  />
)

CollectionDetailsHighlightsContainer.propTypes = {
  onToggleRelatedUrlsModal: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(CollectionDetailsHighlightsContainer)
