import React from 'react'
import PropTypes from 'prop-types'

import './ProjectPanelSection.scss'

/**
 * Renders ProjectPanelSection.
 * @param {object} props - The props passed into the component.
 * @param {node} props.children - The section children.
 * @param {object} props.heading - The text to be used for the section heading.
 */
export const ProjectPanelSection = ({ children, heading }) => (
  <div className="project-panel-section">
    {
      heading && (
        <h3 className="project-panel-section__heading">{heading}</h3>
      )
    }
    {children}
  </div>
)

ProjectPanelSection.defaultProps = {
  children: null,
  heading: null
}

ProjectPanelSection.propTypes = {
  children: PropTypes.node,
  heading: PropTypes.string
}

export default ProjectPanelSection
