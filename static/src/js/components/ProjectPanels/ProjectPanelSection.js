import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FaExclamationCircle } from 'react-icons/fa'

import EDSCAlert from '../EDSCAlert/EDSCAlert'

import './ProjectPanelSection.scss'

/**
 * Renders ProjectPanelSection.
 * @param {Objectf} props - The props passed into the component.
 * @param {Node} props.children - The section children.
 * @param {String} props.heading - The text to be used for the section heading.
 * @param {String} props.headingLevel - A custom heading level. Defaults to 'h3'
 * @param {String} props.intro - Custom intro text.
 * @param {Boolean} props.nested - Displays the component as a nested section.
 * @param {Number} props.step - Adds a step to the heading of the component.
 */
export const ProjectPanelSection = ({
  children,
  faded,
  heading,
  headingLevel,
  intro,
  nested,
  step,
  warning
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
                  {step.toString()}
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
      {
        warning && (
          <EDSCAlert
            className="project-panel-section__warning"
            bootstrapVariant="warning"
            icon={FaExclamationCircle}
          >
            {warning}
          </EDSCAlert>
        )
      }
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
  step: null,
  warning: ''
}

ProjectPanelSection.propTypes = {
  children: PropTypes.node,
  faded: PropTypes.bool,
  heading: PropTypes.string,
  headingLevel: PropTypes.string,
  intro: PropTypes.string,
  nested: PropTypes.bool,
  step: PropTypes.number,
  warning: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string
  ])
}

export default ProjectPanelSection
