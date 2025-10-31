import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, startCase } from 'lodash-es'
import { ArrowChevronRight } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { buildHierarchy } from '../../util/autocompleteResults'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './AutocompleteSuggestion.scss'

const AutocompleteSuggestion = ({ suggestion }) => {
  if (isEmpty(suggestion)) return null

  const {
    type,
    value,
    fields = ''
  } = suggestion
  const hierarchy = buildHierarchy({ fields })

  return (
    <div>
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
                  hierarchy.map((parent, index) => {
                    // Build a key using the value, and elements of the hierarchy up to the current index
                    const currentHierarchy = hierarchy.slice(0, index + 1).join('-')
                    const key = `${value}-${currentHierarchy}`

                    return (
                      <React.Fragment key={key}>
                        {parent}
                        <EDSCIcon icon={ArrowChevronRight} size="10" />
                        {' '}
                      </React.Fragment>
                    )
                  })
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
