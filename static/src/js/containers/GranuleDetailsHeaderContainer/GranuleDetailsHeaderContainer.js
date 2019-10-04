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
  granules
}) => {
  const focusedGranuleMetadata = getFocusedGranuleObject(focusedGranule, granules)
  const { json = {} } = focusedGranuleMetadata

  return (
    <GranuleDetailsHeader json={json} />
  )
}

GranuleDetailsHeaderContainer.propTypes = {
  granules: PropTypes.shape({}).isRequired,
  focusedGranule: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(GranuleDetailsHeaderContainer)
)
