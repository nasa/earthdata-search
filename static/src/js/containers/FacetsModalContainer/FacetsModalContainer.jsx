import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions'

import FacetsModal from '../../components/Facets/FacetsModal'

export const mapStateToProps = (state) => ({
  collectionHits: state.searchResults.viewAllFacets.hits,
  viewAllFacets: state.searchResults.viewAllFacets
})

export const mapDispatchToProps = (dispatch) => ({
  onToggleFacetsModal:
    (state) => dispatch(actions.toggleFacetsModal(state))
})

export const FacetsModalContainer = ({
  collectionHits = null,
  onToggleFacetsModal,
  viewAllFacets
}) => (
  <FacetsModal
    collectionHits={collectionHits}
    onToggleFacetsModal={onToggleFacetsModal}
    viewAllFacets={viewAllFacets}
  />
)

FacetsModalContainer.propTypes = {
  collectionHits: PropTypes.number,
  onToggleFacetsModal: PropTypes.func.isRequired,
  viewAllFacets: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FacetsModalContainer)
