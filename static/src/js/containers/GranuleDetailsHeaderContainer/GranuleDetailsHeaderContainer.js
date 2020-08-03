import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'

import GranuleDetailsHeader from '../../components/GranuleDetails/GranuleDetailsHeader'

const mapStateToProps = state => ({
  granuleMetadata: getFocusedGranuleMetadata(state)
})

export const GranuleDetailsHeaderContainer = ({
  granuleMetadata,
  location
}) => (
  <GranuleDetailsHeader granuleMetadata={granuleMetadata} location={location} />
)

GranuleDetailsHeaderContainer.propTypes = {
  granuleMetadata: PropTypes.shape({}).isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(GranuleDetailsHeaderContainer)
)
