import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'

import Button from '../Button/Button'
import ProjectPanelSection from './ProjectPanelSection'

import './VariableKeywordPanel.scss'

const getKeywordVariables = (keywordMappings, keyword, variables) => {
  const variableIds = keywordMappings[keyword]

  const keywordVariables = {}
  variableIds.forEach((id) => {
    keywordVariables[id] = variables[id]
  })

  return keywordVariables
}

const getNumberVariablesSelected = (variables, selectedVariables) => {
  let total = 0
  variables.forEach((variable) => {
    if (selectedVariables.indexOf(variable) > -1) total += 1
  })
  return total
}

export const VariableKeywordPanel = (props) => {
  const {
    accessMethods,
    index,
    selectedAccessMethod,
    onSelectKeyword
  } = props

  if (!accessMethods || !selectedAccessMethod) return null

  const selectedMethod = accessMethods[selectedAccessMethod]
  const {
    keywordMappings,
    selectedVariables = [],
    variables
  } = selectedMethod
  if (!variables) return null

  return (
    <>
      <ProjectPanelSection heading="Variable Selection" />
      <ul className="variable-keyword-panel__list list__alternating">
        {
          Object.keys(keywordMappings).map((keyword) => {
            const keywordVariables = getKeywordVariables(keywordMappings, keyword, variables)
            const key = `keywords-${keyword}`
            const numberSelected = getNumberVariablesSelected(
              keywordMappings[keyword], selectedVariables
            )

            return (
              <li
                className="variable-keyword-panel__list-item"
                key={key}
              >
                <Button
                  className="variable-keyword-panel__button"
                  type="button"
                  label={keyword}
                  bootstrapVariant="link"
                  onClick={() => onSelectKeyword(keyword, keywordVariables, index)}
                >
                  {keyword}
                </Button>
                {
                  numberSelected > 0 && (
                    <span className="variable-keyword-panel__selected-count">
                      {`${numberSelected} selected`}
                    </span>
                  )
                }
              </li>
            )
          })
        }
      </ul>
    </>
  )
}

VariableKeywordPanel.defaultProps = {
  accessMethods: undefined,
  selectedAccessMethod: undefined
}

VariableKeywordPanel.propTypes = {
  accessMethods: PropTypes.shape({}),
  index: PropTypes.number.isRequired,
  selectedAccessMethod: PropTypes.string,
  onSelectKeyword: PropTypes.func.isRequired
}

export default pure(VariableKeywordPanel)
