import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { metricsBrowseGranuleImage } from '../../middleware/metrics/actions'

import GranuleResultsFocusedMeta from '../../components/GranuleResults/GranuleResultsFocusedMeta'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsBrowseGranuleImage:
    (data) => dispatch(metricsBrowseGranuleImage(data))
})

/**
 * Renders GranuleResultsFocusedMeta.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.onMetricsBrowseGranuleImage - Callback function passed from actions to track metrics.
 */
export const GranuleResultsFocusedMetaContainer = (props) => {
  const {
    onMetricsBrowseGranuleImage
  } = props

  return (
    <GranuleResultsFocusedMeta
      onMetricsBrowseGranuleImage={onMetricsBrowseGranuleImage}
    />
  )
}

GranuleResultsFocusedMetaContainer.propTypes = {
  onMetricsBrowseGranuleImage: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(GranuleResultsFocusedMetaContainer)
