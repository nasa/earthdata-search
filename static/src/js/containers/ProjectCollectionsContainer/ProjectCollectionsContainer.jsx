import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import { metricsDataAccess } from '../../middleware/metrics/actions'

import ProjectCollections from '../../components/ProjectCollections/ProjectCollections'

export const mapDispatchToProps = (dispatch) => ({
  onUpdateProjectName:
    (name) => dispatch(actions.updateProjectName(name)),
  onMetricsDataAccess:
    (data) => dispatch(metricsDataAccess(data))
})

export const mapStateToProps = (state) => ({
  savedProject: state.savedProject
})

export const ProjectCollectionsContainer = (props) => {
  const {
    onMetricsDataAccess,
    onUpdateProjectName,
    savedProject
  } = props

  return (
    <ProjectCollections
      onMetricsDataAccess={onMetricsDataAccess}
      onUpdateProjectName={onUpdateProjectName}
      savedProject={savedProject}
    />
  )
}

ProjectCollectionsContainer.propTypes = {
  onMetricsDataAccess: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  savedProject: PropTypes.shape({}).isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ProjectCollectionsContainer)
