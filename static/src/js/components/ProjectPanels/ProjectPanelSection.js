import React from 'react'
import PropTypes from 'prop-types'

import './ProjectPanelSection.scss'

export const ProjectPanelSection = ({ children }) => (
  <div className="project-panel-section">
    {children}
  </div>
)

ProjectPanelSection.propTypes = {
  children: PropTypes.node.isRequired
}

export default ProjectPanelSection
