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

/**
 * Renders GranuleResultsFocusedMeta.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.focusedGranuleMetadata - The metadata for any currently focused granule.
 * @param {String} props.focusedGranuleId - The id for the focused granule.
 * @param {String} props.onMetricsBrowseGranuleImage - Callback function passed from actions to track metrics.
 */
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
