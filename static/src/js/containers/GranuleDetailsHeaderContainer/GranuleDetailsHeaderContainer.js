import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import getFocusedGranuleObject from '../../util/focusedGranule'

import GranuleDetailsHeader from '../../components/GranuleDetails/GranuleDetailsHeader'

const mapStateToProps = state => ({
  focusedGranule: state.focusedGranule,
  granules: state.metadata.granules
})

export const GranuleDetailsHeaderContainer = ({
  focusedGranule,
  granules,
  location
}) => {
  const focusedGranuleMetadata = getFocusedGranuleObject(focusedGranule, granules)
  const { ummJson = {} } = focusedGranuleMetadata

  return (
    <GranuleDetailsHeader ummJson={ummJson} location={location} />
  )
}

GranuleDetailsHeaderContainer.propTypes = {
  granules: PropTypes.shape({}).isRequired,
  focusedGranule: PropTypes.string.isRequired,
  location: PropTypes.shape({}).isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(GranuleDetailsHeaderContainer)
)
