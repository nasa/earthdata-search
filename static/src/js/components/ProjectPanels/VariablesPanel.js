import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

import Button from '../Button/Button'

export const VariablesPanel = (props) => {
  const {
    index,
    panelHeader,
    selectedKeyword,
    selectedVariables,
    variables,
    onCheckboxChange,
    onClearSelectedKeyword,
    onViewDetails
  } = props

  if (!selectedKeyword || !variables) return null

  return (
    <div>
      {panelHeader}
      <section>
        <span className="selected-keyword">
          <Button
            type="button"
            label="All Leafnodes"
            bootstrapVariant="link"
            onClick={() => onClearSelectedKeyword(`0.${index}.1`)}
          >
            All Leafnodes
          </Button>
          <i className="child-spacer fa fa-chevron-circle-right" />
          <strong>
            {selectedKeyword}
          </strong>
        </span>
      </section>
      <section>
        <div className="variable-list">
          <div className="collection-variable-list-item">
            <label className="collection-variable-list-item-label">
              <input
                type="checkbox"
                className="select-all"
                onChange={onCheckboxChange.bind(this, 'all')}
              />
              <div className="collection-variable-info">
                <span>Select All Variables</span>
              </div>
            </label>
          </div>
          <div className="collection-variables">
            {
              Object.keys(variables).map((variableId) => {
                const variable = variables[variableId]
                const selected = selectedVariables.indexOf(variableId) > -1

                const { meta, umm } = variable
                const { 'concept-id': conceptId } = meta
                const { LongName, Name } = umm

                return (
                  <div
                    key={conceptId}
                    className="collection-variable-list-item"
                  >
                    <label className="collection-variable-list-item-label">
                      <input
                        className="collection-variable-list-item-input"
                        type="checkbox"
                        checked={selected}
                        onChange={onCheckboxChange.bind(this, variableId)}
                      />
                      <div className="collection-variable-info">
                        <h4 className="collection-variable-heading">
                          <span className="collection-variable-name">
                            {Name}
                          </span>
                        </h4>
                        <ul className="collection-variable-meta text-info">
                          <li className="collection-variable-longname">
                            {LongName}
                          </li>
                          <li>
                            <Button
                              className="collection-variable-details-link clean underline subtle"
                              label="View Details"
                              bootstrapVariant="primary"
                              onClick={() => onViewDetails(variable, index)}
                            >
                              View Details
                            </Button>
                          </li>
                        </ul>
                      </div>
                    </label>
                  </div>
                )
              })
            }
          </div>
        </div>
      </section>
    </div>
  )
}

VariablesPanel.defaultProps = {
  selectedKeyword: undefined,
  variables: undefined
}

VariablesPanel.propTypes = {
  index: PropTypes.number.isRequired,
  panelHeader: PropTypes.node.isRequired,
  selectedKeyword: PropTypes.string,
  selectedVariables: PropTypes.arrayOf(PropTypes.string).isRequired,
  variables: PropTypes.shape({}),
  onCheckboxChange: PropTypes.func.isRequired,
  onClearSelectedKeyword: PropTypes.func.isRequired,
  onViewDetails: PropTypes.func.isRequired
}

export default pure(VariablesPanel)
