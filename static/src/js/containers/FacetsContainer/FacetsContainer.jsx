import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import Facets from '../../components/Facets/Facets'

export const mapDispatchToProps = (dispatch) => ({
  onChangeCmrFacet:
    (e, facetLinkInfo, facet, applied) => dispatch(
      actions.changeCmrFacet(e, facetLinkInfo, facet, applied)
    ),
  onChangeFeatureFacet:
    (e, facetLinkInfo) => dispatch(actions.changeFeatureFacet(e, facetLinkInfo)),
  onTriggerViewAllFacets:
    (category) => dispatch(actions.triggerViewAllFacets(category))
})

export const mapStateToProps = (state) => ({
  facetsById: state.searchResults.facets.byId,
  featureFacets: state.facetsParams.feature,
  portal: state.portal
})

export const FacetsContainer = (props) => {
  const {
    facetsById,
    featureFacets,
    portal,
    onChangeCmrFacet,
    onChangeFeatureFacet,
    onTriggerViewAllFacets
  } = props

  return (
    <Facets
      facetsById={facetsById}
      featureFacets={featureFacets}
      portal={portal}
      onChangeCmrFacet={onChangeCmrFacet}
      onChangeFeatureFacet={onChangeFeatureFacet}
      onTriggerViewAllFacets={onTriggerViewAllFacets}
    />
  )
}

FacetsContainer.propTypes = {
  facetsById: PropTypes.shape({}).isRequired,
  featureFacets: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  onChangeCmrFacet: PropTypes.func.isRequired,
  onChangeFeatureFacet: PropTypes.func.isRequired,
  onTriggerViewAllFacets: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FacetsContainer)
