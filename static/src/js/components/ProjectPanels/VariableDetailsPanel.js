import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

import ProjectPanelSection from './ProjectPanelSection'

import './VariableDetailsPanel.scss'

export const VariableDetailsPanel = (props) => {
  const {
    variable
  } = props

  if (!variable) return null

  const {
    definition = 'No definition available for this variable.',
    longName,
    name
  } = variable

  const formattedName = name.split('/').pop()

  return (
    <div className="variable-details-panel">
      <ProjectPanelSection>
        <header className="variable-details-panel__header">
          <h2 className="variable-details-panel__heading">
            {formattedName}
          </h2>
        </header>
        <dl>
          <dt className="variable-details-panel__longname">
            {longName}
          </dt>
          <dd className="variable-details-panel__description">
            {definition}
          </dd>
        </dl>
      </ProjectPanelSection>
    </div>
  )
}

VariableDetailsPanel.defaultProps = {
  variable: undefined
}

VariableDetailsPanel.propTypes = {
  variable: PropTypes.shape({
    definition: PropTypes.string,
    longName: PropTypes.string,
    name: PropTypes.string
  })
}

export default pure(VariableDetailsPanel)
