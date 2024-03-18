import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'

import GranuleResultsFocusedMeta from '../../components/GranuleResults/GranuleResultsFocusedMeta'

export const mapStateToProps = (state) => ({
  focusedGranuleMetadata: getFocusedGranuleMetadata(state),
  focusedGranuleId: getFocusedGranuleId(state)
})

export const GranuleResultsFocusedMetaContainer = (props) => {
  const {
    focusedGranuleMetadata,
    focusedGranuleId
  } = props

  return (
    <GranuleResultsFocusedMeta
      focusedGranuleMetadata={focusedGranuleMetadata}
      focusedGranuleId={focusedGranuleId}
    />
  )
}

GranuleResultsFocusedMetaContainer.propTypes = {
  focusedGranuleMetadata: PropTypes.shape({}).isRequired,
  focusedGranuleId: PropTypes.string.isRequired
}

export default withRouter(
  connect(mapStateToProps, null)(GranuleResultsFocusedMetaContainer)
)
