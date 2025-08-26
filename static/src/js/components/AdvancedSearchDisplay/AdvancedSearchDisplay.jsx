import React from 'react'
import { isEmpty } from 'lodash-es'
import { Filter } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import AdvancedSearchDisplayEntry from './AdvancedSearchDisplayEntry'
import FilterStackItem from '../FilterStack/FilterStackItem'
import FilterStackContents from '../FilterStack/FilterStackContents'

import useEdscStore from '../../zustand/useEdscStore'

import './AdvancedSearchDisplay.scss'

const AdvancedSearchDisplay = () => {
  const changeQuery = useEdscStore((state) => state.query.changeQuery)
  const selectedRegion = useEdscStore((state) => state.query.selectedRegion)

  const selectedRegionApplied = !isEmpty(selectedRegion)

  if (!selectedRegionApplied) return null

  const valueToDisplay = '(1 applied)'

  return (
    <FilterStackItem
      icon={Filter}
      title="Advanced Search"
      onRemove={
        () => {
          changeQuery({
            collection: {
              spatial: {}
            },
            selectedRegion: {}
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

export default AdvancedSearchDisplay
