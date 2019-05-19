import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import getFocusedGranuleMetadata from '../../util/focusedGranule'

import GranuleDetailsBody from '../../components/GranuleDetails/GranuleDetailsBody'

const mapStateToProps = state => ({
  focusedGranule: state.focusedGranule,
  granules: state.metadata.granules
})

export const GranuleDetailsBodyContainer = ({
  focusedGranule,
  granules
}) => {
  const focusedGranuleMetadata = getFocusedGranuleMetadata(focusedGranule, granules)

  if (Object.keys(focusedGranuleMetadata).length === 0) return null

  const { json, metadataUrls, xml } = granules.byId[focusedGranule]

  return (
    <GranuleDetailsBody
      json={json}
      metadataUrls={metadataUrls}
      xml={xml}
    />
  )
}

GranuleDetailsBodyContainer.propTypes = {
  granules: PropTypes.shape({}).isRequired,
  focusedGranule: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(GranuleDetailsBodyContainer)
)
