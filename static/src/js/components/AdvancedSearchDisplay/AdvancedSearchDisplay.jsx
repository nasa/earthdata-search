import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty, isObject } from 'lodash-es'
import { Filter } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import AdvancedSearchDisplayEntry from './AdvancedSearchDisplayEntry'
import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'

import useEdscStore from '../../zustand/useEdscStore'

import './AdvancedSearchDisplay.scss'

const AdvancedSearchDisplay = ({
  advancedSearch,
  onUpdateAdvancedSearch
}) => {
  const changeQuery = useEdscStore((state) => state.query.changeQuery)

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
      icon={Filter}
      title="Advanced Search"
      onRemove={
        () => {
          onUpdateAdvancedSearch({})
          changeQuery({
            collection: {
              spatial: {}
            }
          })
        }
      }
    >
      <FilterStackContents
        body={
          (
            <AdvancedSearchDisplayEntry>
              <span className="advanced-search-display__text">
                {valueToDisplay}
              </span>
            </AdvancedSearchDisplayEntry>
          )
        }
        title="Advanced Search"
      />
    </FilterStackItem>
  )
}

AdvancedSearchDisplay.defaultProps = {
  advancedSearch: {}
}

AdvancedSearchDisplay.propTypes = {
  advancedSearch: PropTypes.shape({}),
  onUpdateAdvancedSearch: PropTypes.func.isRequired
}

export default AdvancedSearchDisplay
