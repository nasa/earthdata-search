import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash'
import { facetCategoryAbbreviationsMap } from '../../util/facetCategoryAbbreviationsMap'

import Button from '../Button/Button'
import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'

import './AutocompleteDisplay.scss'

const AutocompleteDisplay = ({ selected, onRemoveAutocompleteValue }) => {
  if (!selected.length) return null

  const filterStackBody = (
    <div className="autocomplete-display">
      {
        selected.map((item) => {
          const { type, value, fields = '' } = item

          const label = facetCategoryAbbreviationsMap[type]

          let parents = []
          let titleHierarchy = ''

          if (fields.indexOf(':')) {
            parents = fields.split(':')
            parents.pop()
          }

          parents.forEach((parent) => {
            titleHierarchy += `${parent} > `
          })

          const title = `${startCase(type)}: \n${titleHierarchy}${value}`

          return (
            <span
              className="autocomplete-display__item"
              key={`${type}-${value}`}
              title={title}
            >
              <span className="autocomplete-display__item-body">
                <span className="autocomplete-display__type">
                  {label}
                </span>
                <span className="autocomplete-display__value">
                  {value}
                </span>
              </span>
              <Button
                className="autocomplete-display__button"
                label={`Remove ${value}`}
                icon="times"
                onClick={() => { onRemoveAutocompleteValue(item) }}
              />
            </span>
          )
        })
      }
    </div>
  )

  return (
    <FilterStackItem variant="naked" title="Keyword filters">
      <FilterStackContents
        key="filter__autocomplete"
        body={filterStackBody}
        title="Autocomplete"
      />
    </FilterStackItem>
  )
}

AutocompleteDisplay.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onRemoveAutocompleteValue: PropTypes.func.isRequired
}

export default AutocompleteDisplay
