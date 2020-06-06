import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

import { allVariablesSelected } from '../../util/variables'

import Button from '../Button/Button'
import ProjectPanelSection from './ProjectPanelSection'

import './VariablesPanel.scss'

export const VariablesPanel = (props) => {
  const {
    index,
    collectionId,
    selectedKeyword,
    selectedVariables,
    variables,
    onCheckboxChange,
    onClearSelectedKeyword,
    onViewDetails
  } = props

  if (!selectedKeyword || !variables) return null

  return (
    <div className="variables-panel">
      <ProjectPanelSection heading="Variable Selection" />
      <section className="variables-panel__list-wrapper">
        <header className="variables-panel__header">
          <Button
            className="variables-panel__header-button"
            type="button"
            label="All Leafnodes"
            variant="link"
            bootstrapVariant="link"
            onClick={() => onClearSelectedKeyword(`0.${index}.1`)}
          >
            All Leafnodes
          </Button>
          <i className="variables-panel__header-spacer fa fa-chevron-circle-right" />
          <span className="variables-panel__selected-keyword">
            {selectedKeyword}
          </span>
        </header>
        <ul className="variables-panel__list">
          <li className="variables-panel__list-item">
            <label className="variables-panel__list-item-label">
              <input
                className="variables-panel__list-item-input"
                type="checkbox"
                onChange={e => onCheckboxChange(e, 'all', collectionId)}
                checked={allVariablesSelected(Object.keys(variables), selectedVariables)}
              />
              <div className="variables-panel__list-item-info">
                Select All Variables
              </div>
            </label>
          </li>
          {
            Object.keys(variables).map((variableId) => {
              const variable = variables[variableId]
              const selected = selectedVariables.indexOf(variableId) > -1

              const {
                conceptId,
                longName,
                name
              } = variable

              return (
                <li
                  key={conceptId}
                  className="variables-panel__list-item"
                >
                  <label className="variables-panel__list-item-label">
                    <input
                      className="variables-panel__list-item-input"
                      type="checkbox"
                      checked={selected}
                      onChange={e => onCheckboxChange(e, variableId, collectionId)}
                    />
                    <div className="variables-panel__list-item-info">
                      <h4 className="variables-panel__list-item-heading">
                        <span className="variables-panel__list-item-name">
                          {name}
                        </span>
                      </h4>
                      <ul className="variables-panel__list-item-details">
                        <li className="variables-panel__list-item-longname">
                          {longName}
                        </li>
                        <li>
                          <Button
                            className="variables-panel__list-item-details-link"
                            bootstrapVariant="link"
                            variant="link"
                            label="View Details"
                            onClick={() => onViewDetails(variable, index)}
                          >
                            View Details
                          </Button>
                        </li>
                      </ul>
                    </div>
                  </label>
                </li>
              )
            })
          }
        </ul>
      </section>
    </div>
  )
}

VariablesPanel.defaultProps = {
  selectedVariables: [],
  selectedKeyword: undefined,
  variables: undefined
}

VariablesPanel.propTypes = {
  index: PropTypes.number.isRequired,
  collectionId: PropTypes.string.isRequired,
  selectedKeyword: PropTypes.string,
  selectedVariables: PropTypes.arrayOf(PropTypes.string),
  variables: PropTypes.shape({}),
  onCheckboxChange: PropTypes.func.isRequired,
  onClearSelectedKeyword: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
}

export default pure(VariablesPanel)
