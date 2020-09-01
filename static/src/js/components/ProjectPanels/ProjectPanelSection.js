import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './ProjectPanelSection.scss'

/**
 * Renders ProjectPanelSection.
 * @param {object} props - The props passed into the component.
 * @param {node} props.children - The section children.
 * @param {object} props.heading - The text to be used for the section heading.
 * @param {object} props.headingLevel - A custom heading level. Defaults to 'h3'
 * @param {object} props.intro - A custom heading level. Defaults to 'h3'
 * @param {object} props.nested - Displays the component as a nested section.
 * @param {object} props.step - Adds a step to the heading of the component.
 */
export const ProjectPanelSection = ({
  children,
  faded,
  heading,
  headingLevel,
  intro,
  nested,
  step
}) => {
  const panelSectionClasses = classNames([
    'project-panel-section',
    {
      'project-panel-section--is-faded': faded,
      'project-panel-section--is-step': step,
      'project-panel-section--is-nested': nested
    }
  ])

  const CustomHeadingTag = `${headingLevel}`

  return (
    <div className={panelSectionClasses}>
      {
        heading && (
          <CustomHeadingTag className="project-panel-section__heading">
            {
              step && (
                <span className="project-panel-section__step">
                  {
                    step.toString()
                  }
                </span>
              )
            }
            {heading}
          </CustomHeadingTag>
        )
      }
      {
        intro && (
          <p className="project-panel-section__intro">{intro}</p>
        )
      }
      {children}
    </div>
  )
}

ProjectPanelSection.defaultProps = {
  children: null,
  faded: false,
  heading: null,
  headingLevel: 'h3',
  intro: null,
  nested: false,
  step: null
}

ProjectPanelSection.propTypes = {
  children: PropTypes.node,
  faded: PropTypes.bool,
  heading: PropTypes.string,
  headingLevel: PropTypes.string,
  intro: PropTypes.string,
  nested: PropTypes.bool,
  step: PropTypes.number
}

export default ProjectPanelSection
