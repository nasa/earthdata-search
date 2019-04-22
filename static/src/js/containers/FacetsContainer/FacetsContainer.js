import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import Facets from '../../components/Facets/Facets'

const mapDispatchToProps = dispatch => ({
  onChangeCmrFacet: (e, facetLinkInfo) => dispatch(actions.changeCmrFacet(e, facetLinkInfo)),
  onChangeFeatureFacet: (e, facetLinkInfo) => dispatch(actions.changeFeatureFacet(e, facetLinkInfo))
})

const mapStateToProps = state => ({
  facets: state.entities.facets,
  featureFacets: state.facetsParams.feature
})

const FacetsContainer = (props) => {
  const {
    facets,
    featureFacets,
    onChangeCmrFacet,
    onChangeFeatureFacet
  } = props

  return (
    <Facets
      facets={facets}
      featureFacets={featureFacets}
      onChangeCmrFacet={onChangeCmrFacet}
      onChangeFeatureFacet={onChangeFeatureFacet}
    />
  )
}

FacetsContainer.propTypes = {
  facets: PropTypes.shape({}).isRequired,
  featureFacets: PropTypes.shape({}).isRequired,
  onChangeCmrFacet: PropTypes.func.isRequired,
  onChangeFeatureFacet: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(FacetsContainer)
