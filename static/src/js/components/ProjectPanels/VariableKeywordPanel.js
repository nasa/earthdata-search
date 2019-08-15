import React from 'react'
import PropTypes from 'prop-types'
import { pure } from 'recompose'
import Button from '../Button/Button'

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
    panelHeader,
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
    <div>
      {panelHeader}
      <ul className="keyword-list list-alternating">
        {
          Object.keys(keywordMappings).map((keyword) => {
            const keywordVariables = getKeywordVariables(keywordMappings, keyword, variables)
            const key = `keywords-${keyword}`
            const numberSelected = getNumberVariablesSelected(keywordMappings[keyword], selectedVariables)

            return (
              <li
                className="keyword-list-item"
                key={key}
              >
                <Button
                  type="button"
                  label={keyword}
                  bootstrapVariant="link"
                  onClick={() => onSelectKeyword(keyword, keywordVariables, index)}
                >
                  {keyword}
                  {
                    numberSelected > 0 && (
                      <span className="keyword-variables-selected">
                        {numberSelected}
                      </span>
                    )
                  }
                </Button>
              </li>
            )
          })
        }
      </ul>
    </div>
  )
}

VariableKeywordPanel.defaultProps = {
  accessMethods: undefined,
  selectedAccessMethod: undefined
}

VariableKeywordPanel.propTypes = {
  accessMethods: PropTypes.shape({}),
  index: PropTypes.number.isRequired,
  panelHeader: PropTypes.node.isRequired,
  selectedAccessMethod: PropTypes.string,
  onSelectKeyword: PropTypes.func.isRequired
}

export default pure(VariableKeywordPanel)
