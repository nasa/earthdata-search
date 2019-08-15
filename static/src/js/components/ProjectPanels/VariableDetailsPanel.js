import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

export const VariableDetailsPanel = (props) => {
  const {
    panelHeader,
    variable
  } = props

  if (!variable) return null

  const { umm } = variable
  const {
    Definition: definition = 'No definition available for this variable.',
    LongName: longName,
    Name: name
  } = umm

  return (
    <div>
      {panelHeader}
      <section className="master-overlay-panel-item-overlay">
        <div className="panel-item-section panel-item-section-has-back-button variable-details">
          <header>
            <h2 className="collection-variable-heading">
              <span className="collection-variable-name">
                {name}
              </span>
            </h2>
          </header>
          <p className="collection-variable-longname text-info">
            {longName}
          </p>
          <p className="collection-variable-description">
            {definition}
          </p>
        </div>
      </section>
    </div>
  )
}

VariableDetailsPanel.defaultProps = {
  variable: undefined
}

VariableDetailsPanel.propTypes = {
  panelHeader: PropTypes.node.isRequired,
  variable: PropTypes.shape({})
}

export default pure(VariableDetailsPanel)
