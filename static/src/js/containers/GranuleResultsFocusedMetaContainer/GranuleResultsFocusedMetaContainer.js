import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { getEarthdataEnvironment } from '../../selectors/earthdataEnvironment'
import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'

import GranuleResultsFocusedMeta from '../../components/GranuleResults/GranuleResultsFocusedMeta'

export const mapStateToProps = (state) => ({
  earthdataEnvironment: getEarthdataEnvironment(state),
  focusedGranuleMetadata: getFocusedGranuleMetadata(state),
  focusedGranuleId: getFocusedGranuleId(state)
})

export const GranuleResultsFocusedMetaContainer = (props) => {
  const {
    earthdataEnvironment,
    focusedGranuleMetadata,
    focusedGranuleId
  } = props

  return (
    <GranuleResultsFocusedMeta
      earthdataEnvironment={earthdataEnvironment}
      focusedGranuleMetadata={focusedGranuleMetadata}
      focusedGranuleId={focusedGranuleId}
    />
  )
}

GranuleResultsFocusedMetaContainer.propTypes = {
  earthdataEnvironment: PropTypes.string.isRequired,
  focusedGranuleMetadata: PropTypes.shape({}).isRequired,
  focusedGranuleId: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(GranuleResultsFocusedMetaContainer)
)
