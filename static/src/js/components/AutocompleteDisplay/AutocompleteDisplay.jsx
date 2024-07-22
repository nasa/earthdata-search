import React from 'react'
import PropTypes from 'prop-types'
import { FaTimes } from 'react-icons/fa'

import { facetCategoryAbbreviationsMap } from '../../util/facetCategoryAbbreviationsMap'
import { buildHierarchicalAutocompleteTitle } from '../../util/autocompleteResults'

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
          const { type, value } = item

          const label = facetCategoryAbbreviationsMap[type]
          const title = buildHierarchicalAutocompleteTitle(item)

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
                icon={FaTimes}
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
