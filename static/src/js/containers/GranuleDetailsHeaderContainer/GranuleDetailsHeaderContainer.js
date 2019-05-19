import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  withRouter
} from 'react-router-dom'

import getFocusedGranuleMetadata from '../../util/focusedGranule'

import GranuleDetailsHeader from '../../components/GranuleDetails/GranuleDetailsHeader'

const mapStateToProps = state => ({
  focusedGranule: state.focusedGranule,
  granules: state.metadata.granules
})

export const GranuleDetailsHeaderContainer = ({
  focusedGranule,
  granules
}) => {
  const focusedGranuleMetadata = getFocusedGranuleMetadata(focusedGranule, granules)

  if (Object.keys(focusedGranuleMetadata).length === 0) return null

  const { json } = granules.byId[focusedGranule]

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
