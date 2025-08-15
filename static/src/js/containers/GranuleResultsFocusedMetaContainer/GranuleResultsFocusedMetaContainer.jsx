import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { getFocusedGranuleMetadata } from '../../selectors/granuleMetadata'
import { metricsBrowseGranuleImage } from '../../middleware/metrics/actions'

import GranuleResultsFocusedMeta from '../../components/GranuleResults/GranuleResultsFocusedMeta'

export const mapStateToProps = (state) => ({
  focusedGranuleMetadata: getFocusedGranuleMetadata(state)
})

export const mapDispatchToProps = (dispatch) => ({
  onMetricsBrowseGranuleImage:
    (data) => dispatch(metricsBrowseGranuleImage(data))
})

/**
 * Renders GranuleResultsFocusedMeta.
 * @param {Object} props - The props passed into the component.
 * @param {String} props.focusedGranuleMetadata - The metadata for any currently focused granule.
 * @param {String} props.onMetricsBrowseGranuleImage - Callback function passed from actions to track metrics.
 */
export const GranuleResultsFocusedMetaContainer = (props) => {
  const {
    focusedGranuleMetadata,
    onMetricsBrowseGranuleImage
  } = props

  return (
    <GranuleResultsFocusedMeta
      focusedGranuleMetadata={focusedGranuleMetadata}
      onMetricsBrowseGranuleImage={onMetricsBrowseGranuleImage}
    />
  )
}

GranuleResultsFocusedMetaContainer.propTypes = {
  focusedGranuleMetadata: PropTypes.shape({}).isRequired,
  onMetricsBrowseGranuleImage: PropTypes.func.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(GranuleResultsFocusedMetaContainer)
