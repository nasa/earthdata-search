import React, { useState } from 'react'
import { isEmpty } from 'lodash-es'
import { FaRegTrashAlt } from 'react-icons/fa'
import { Filter } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../Button/Button'
import SearchAutocomplete from '../SearchAutocomplete/SearchAutocomplete'
import NlpSearchStatus from '../NlpSearchStatus/NlpSearchStatus'
import FilterStack from '../FilterStack/FilterStack'
import TemporalDisplay from '../TemporalDisplay/TemporalDisplay'
import TemporalSelectionDropdown from '../TemporalDisplay/TemporalSelectionDropdown'

import AdvancedSearchDisplay from '../AdvancedSearchDisplay/AdvancedSearchDisplay'
import SpatialDisplay from '../SpatialDisplay/SpatialDisplay'
import SpatialSelectionDropdown from '../SpatialDisplay/SpatialSelectionDropdown'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

import useEdscStore from '../../zustand/useEdscStore'
import { getSelectedRegionQuery } from '../../zustand/selectors/query'
import { setOpenModalFunction } from '../../zustand/selectors/ui'

import { MODAL_NAMES } from '../../constants/modalNames'

import { getApplicationConfig } from '../../../../../sharedUtils/config'

import './SearchForm.scss'

const SearchForm = () => {
  const clearFilters = useEdscStore((state) => state.query.clearFilters)
  const selectedRegion = useEdscStore(getSelectedRegionQuery)
  const setOpenModal = useEdscStore(setOpenModalFunction)
  const { nlpSearch } = getApplicationConfig()

  const [isNlpMode, setIsNlpMode] = useState(false)
  const isNlpEnabled = nlpSearch === 'true'

  let spatialDisplayIsVisible = true

  if (!isEmpty(selectedRegion)) spatialDisplayIsVisible = false

  return (
    <section className="search-form">
      <div className="search-form__primary">
        {
          isNlpEnabled && isNlpMode ? (
            <NlpSearchStatus />
          ) : (
            <SearchAutocomplete />
          )
        }
      </div>
      <div className="search-form__secondary">
        <div className="search-form__secondary-actions d-flex justify-content-between flex-row">
          <div className="d-flex gap-1">
            {
              isNlpEnabled && (
                <label className="search-form__nlp-toggle" htmlFor="search-form__nlp-toggle-input">
                  <input
                    id="search-form__nlp-toggle-input"
                    type="checkbox"
                    checked={isNlpMode}
                    onChange={(event) => setIsNlpMode(event.target.checked)}
                  />
                </label>
              )
            }
            <TemporalSelectionDropdown />
            <SpatialSelectionDropdown />
            <PortalFeatureContainer advancedSearch>
              <Button
                bootstrapVariant="light"
                className="search-form__button search-form__button--secondary search-form__button--advanced-search"
                tooltip="Show advanced search options"
                tooltipId="search-form--advanced-search"
                onClick={() => setOpenModal(MODAL_NAMES.ADVANCED_SEARCH)}
                icon={Filter}
                iconSize="14"
                ariaLabel="Show advanced search options"
              />
            </PortalFeatureContainer>
          </div>
          <Button
            bootstrapVariant="inline-block"
            className="search-form__button search-form__button--secondary search-form__button--clear"
            tooltip="Clear all search filters"
            tooltipId="search-form--clear-filters"
            onClick={clearFilters}
            icon={FaRegTrashAlt}
            iconSize="14"
            ariaLabel="Clear all search filters"
          />
        </div>
        <FilterStack isOpen>
          <PortalFeatureContainer advancedSearch>
            <AdvancedSearchDisplay />
          </PortalFeatureContainer>
          {
            spatialDisplayIsVisible && (
              <SpatialDisplay />
            )
          }
          <TemporalDisplay />
        </FilterStack>
      </div>
    </section>
  )
}

export default SearchForm
