import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import { metricsDataAccess } from '../../middleware/metrics/actions'

import ProjectCollections from '../../components/ProjectCollections/ProjectCollections'

export const mapDispatchToProps = (dispatch) => ({
  onMetricsDataAccess:
    (data) => dispatch(metricsDataAccess(data))
})

export const ProjectCollectionsContainer = (props) => {
  const {
    onMetricsDataAccess
  } = props

  return (
    <ProjectCollections
      onMetricsDataAccess={onMetricsDataAccess}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  onMetricsDataAccess: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(ProjectCollectionsContainer)
