import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from 'react-bootstrap'

import { Button } from '../Button/Button'

import './AutocompleteDisplay.scss'

const AutocompleteDisplay = ({ selected, onRemoveAutocompleteValue }) => {
  if (!selected.length) return null

  return (
    <li className="filter-stack-item">
      {
        selected.map((item) => {
          const { type, value } = item
          return (
            <Badge
              className="autocomplete-display__badge"
              pill
              variant="primary"
              key={type}
            >
              <span className="autocomplete-display__type">
                {type}
              </span>
              <span className="autocomplete-display__value">
                {value}
              </span>
              <Button
                className="autocomplete-display__button"
                label={`Remove ${value.toLowerCase()} filter`}
                icon="times"
                onClick={() => { onRemoveAutocompleteValue(item) }}
              />
            </Badge>
          )
        })
      }
    </li>
  )
}

AutocompleteDisplay.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  onRemoveAutocompleteValue: PropTypes.func.isRequired
}

export default AutocompleteDisplay
