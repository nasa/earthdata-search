import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import FacetsModal from '../../components/Facets/FacetsModal'

export const mapStateToProps = (state) => ({
  collectionHits: state.searchResults.viewAllFacets.hits,
  viewAllFacets: state.searchResults.viewAllFacets,
  isOpen: state.ui.facetsModal.isOpen
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleFacetsModal:
    (state) => dispatch(actions.toggleFacetsModal(state))
})

export const FacetsModalContainer = ({
  collectionHits = null,
  isOpen,
  onToggleFacetsModal,
  viewAllFacets
}) => (
  <FacetsModal
    collectionHits={collectionHits}
    isOpen={isOpen}
    onToggleFacetsModal={onToggleFacetsModal}
    viewAllFacets={viewAllFacets}
  />
)

FacetsModalContainer.propTypes = {
  collectionHits: PropTypes.number,
  isOpen: PropTypes.bool.isRequired,
  onToggleFacetsModal: PropTypes.func.isRequired,
  viewAllFacets: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FacetsModalContainer)
