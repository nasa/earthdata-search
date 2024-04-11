import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, startCase } from 'lodash'
import { FaChevronRight } from 'react-icons/fa'

import { buildHierarchy, buildHierarchicalAutocompleteTitle } from '../../util/autocompleteResults'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './AutocompleteSuggestion.scss'

const AutocompleteSuggestion = ({ suggestion }) => {
  if (isEmpty(suggestion)) return null

  const {
    type,
    value,
    fields = ''
  } = suggestion

  const title = buildHierarchicalAutocompleteTitle(suggestion)
  const hierarchy = buildHierarchy({ fields })

  return (
    <div title={title}>
      <div className="autocomplete-suggestion__suggestions-primary">
        <div className="autocomplete-suggestion__suggestions-type">
          {startCase(type)}
          :
        </div>
        {
          (hierarchy && hierarchy.length > 0) && (
            <div className="autocomplete-suggestion__suggestions-hierarchy">
              <span>
                {
                  hierarchy.map((parent) => (
                    <React.Fragment key={`${value}-${parent}`}>
                      {parent}
                      <EDSCIcon icon={FaChevronRight} />
                      {' '}
                    </React.Fragment>
                  ))
                }
              </span>
            </div>
          )
        }
      </div>
      <div className="autocomplete-suggestion__suggestions-value">
        {value}
      </div>
    </div>
  )
}

AutocompleteSuggestion.propTypes = {
  suggestion: PropTypes.shape({
    fields: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string
  }).isRequired
}

export default AutocompleteSuggestion
