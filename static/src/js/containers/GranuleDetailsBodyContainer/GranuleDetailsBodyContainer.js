import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import getFocusedGranuleObject from '../../util/focusedGranule'

import GranuleDetailsBody from '../../components/GranuleDetails/GranuleDetailsBody'

const mapStateToProps = state => ({
  authToken: state.authToken,
  focusedGranule: state.focusedGranule,
  granules: state.metadata.granules
})

export const GranuleDetailsBodyContainer = ({
  authToken,
  focusedGranule,
  granules
}) => {
  const focusedGranuleMetadata = getFocusedGranuleObject(focusedGranule, granules)

  const {
    ummJson,
    metadataUrls
  } = focusedGranuleMetadata

  return (
    <GranuleDetailsBody
      authToken={authToken}
      metadataUrls={metadataUrls}
      ummJson={ummJson}
    />
  )
}

GranuleDetailsBodyContainer.propTypes = {
  authToken: PropTypes.string.isRequired,
  granules: PropTypes.shape({}).isRequired,
  focusedGranule: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(GranuleDetailsBodyContainer)
)
