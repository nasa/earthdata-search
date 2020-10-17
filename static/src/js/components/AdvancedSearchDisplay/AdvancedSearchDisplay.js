import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isObject } from 'lodash'
import { FaSlidersH } from 'react-icons/fa'

import AdvancedSearchDisplayEntry from './AdvancedSearchDisplayEntry'
import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'

import './AdvancedSearchDisplay.scss'

class AdvancedSearchDisplay extends PureComponent {
  render() {
    const {
      advancedSearch,
      onUpdateAdvancedSearch,
      onChangeQuery
    } = this.props

    const advancedSearchFiltersApplied = Object.values(advancedSearch).filter((value) => {
      if (isObject(value)) {
        return !isEmpty(value)
      }
      return !!value
    }).length

    if (advancedSearchFiltersApplied === 0) return null

    const valueToDisplay = `(${advancedSearchFiltersApplied} applied)`

    return (
      <FilterStackItem
        icon={FaSlidersH}
        title="Advanced Search"
        onRemove={() => {
          onUpdateAdvancedSearch({})
          onChangeQuery({
            collection: {
              spatial: {}
            }
          })
        }}
      >
        <FilterStackContents
          body={(
            <AdvancedSearchDisplayEntry>
              <span className="advanced-search-display__text">
                {valueToDisplay}
              </span>
            </AdvancedSearchDisplayEntry>
          )}
          title="Advanced Search"
        />
      </FilterStackItem>
    )
  }
}

AdvancedSearchDisplay.defaultProps = {
  advancedSearch: {}
}

AdvancedSearchDisplay.propTypes = {
  advancedSearch: PropTypes.shape({}),
  onUpdateAdvancedSearch: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired
}

export default AdvancedSearchDisplay
