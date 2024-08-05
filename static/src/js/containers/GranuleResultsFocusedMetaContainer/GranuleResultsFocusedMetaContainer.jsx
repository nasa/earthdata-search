import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'

import { getFocusedGranuleId } from '../../selectors/focusedGranule'
import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'
import { metricsBrowseGranuleImage } from '../../middleware/metrics/actions'

import GranuleResultsFocusedMeta from '../../components/GranuleResults/GranuleResultsFocusedMeta'

export const mapStateToProps = (state) => ({
  focusedGranuleMetadata: getFocusedGranuleMetadata(state),
  focusedGranuleId: getFocusedGranuleId(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onMetricsBrowseGranuleImage:
    (data) => dispatch(metricsBrowseGranuleImage(data))
})

export const GranuleResultsFocusedMetaContainer = (props) => {
  const {
    focusedGranuleMetadata,
    focusedGranuleId,
    onMetricsBrowseGranuleImage
  } = props

  return (
    <GranuleResultsFocusedMeta
      focusedGranuleMetadata={focusedGranuleMetadata}
      focusedGranuleId={focusedGranuleId}
      onMetricsBrowseGranuleImage={onMetricsBrowseGranuleImage}
    />
  )
}

GranuleResultsFocusedMetaContainer.propTypes = {
  focusedGranuleMetadata: PropTypes.shape({}).isRequired,
  focusedGranuleId: PropTypes.string.isRequired,
  onMetricsBrowseGranuleImage: PropTypes.func.isRequired
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(GranuleResultsFocusedMetaContainer)
)
