import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import Facets from '../../components/Facets/Facets'

export const mapStateToProps = (state) => ({
  facetsById: state.searchResults.facets.byId
})

export const FacetsContainer = (props) => {
  const {
    facetsById
  } = props

  return (
    <Facets
      facetsById={facetsById}
    />
  )
}

FacetsContainer.propTypes = {
  facetsById: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps)(FacetsContainer)
