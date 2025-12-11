import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import actions from '../../actions/index'

import ProjectPanels from '../../components/ProjectPanels/ProjectPanels'

export const mapDispatchToProps = (dispatch) => ({
  onChangePath:
    (path) => dispatch(actions.changePath(path))
})

/**
 * Renders ProjectPanelsContainer.
 * @param {Function} onChangePath - Callback to change the path.
 */
export const ProjectPanelsContainer = ({
  onChangePath
}) => (
  <ProjectPanels
    onChangePath={onChangePath}
  />
)

ProjectPanelsContainer.propTypes = {
  onChangePath: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(ProjectPanelsContainer)
