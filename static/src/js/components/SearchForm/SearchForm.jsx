import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash-es'
import { FaRegTrashAlt } from 'react-icons/fa'
import { Filter } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Button from '../Button/Button'
import SearchAutocomplete from '../SearchAutocomplete/SearchAutocomplete'
import AdvancedSearchDisplayContainer
  from '../../containers/AdvancedSearchDisplayContainer/AdvancedSearchDisplayContainer'
import SpatialDisplayContainer
  from '../../containers/SpatialDisplayContainer/SpatialDisplayContainer'
import TemporalDisplayContainer
  from '../../containers/TemporalDisplayContainer/TemporalDisplayContainer'
import SpatialSelectionDropdownContainer
  from '../../containers/SpatialSelectionDropdownContainer/SpatialSelectionDropdownContainer'
import TemporalSelectionDropdownContainer
  from '../../containers/TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer'
import FilterStack from '../FilterStack/FilterStack'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

import './SearchForm.scss'

class SearchForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      showFilterStack: true
    }

    this.onSearchClear = this.onSearchClear.bind(this)
    this.onToggleAdvancedSearch = this.onToggleAdvancedSearch.bind(this)
    this.onToggleFilterStack = this.onToggleFilterStack.bind(this)
  }

  onSearchClear() {
    const { onClearFilters } = this.props
    onClearFilters()
  }

  onToggleFilterStack() {
    const {
      showFilterStack
    } = this.state

    this.setState({
      showFilterStack: !showFilterStack
    })
  }

  onToggleAdvancedSearch() {
    const {
      onToggleAdvancedSearchModal
    } = this.props

    onToggleAdvancedSearchModal(true)
  }

  render() {
    const {
      advancedSearch,
      keywordSearch,
      onChangeQuery,
      onChangeFocusedCollection
    } = this.props

    const {
      showFilterStack
    } = this.state

    let spatialDisplayIsVisible = true

    if (!isEmpty(advancedSearch)) {
      const { regionSearch = {} } = advancedSearch
      if (!isEmpty(regionSearch)) {
        const { selectedRegion = {} } = regionSearch
        if (!isEmpty(selectedRegion)) spatialDisplayIsVisible = false
      }
    }

    return (
      <section className="search-form">
        <div className="search-form__primary">
          <SearchAutocomplete
            initialKeyword={keywordSearch}
            onChangeQuery={onChangeQuery}
            onChangeFocusedCollection={onChangeFocusedCollection}
          />
        </div>
        <div className="search-form__secondary">
          <div className="search-form__secondary-actions d-flex justify-content-between flex-row">
            <div className="d-flex gap-1">
              <TemporalSelectionDropdownContainer />
              <SpatialSelectionDropdownContainer />
              <PortalFeatureContainer advancedSearch>
                <Button
                  bootstrapVariant="light"
                  className="search-form__button search-form__button--secondary search-form__button--advanced-search"
                  tooltip="Show advanced search options"
                  tooltipId="search-form--advanced-search"
                  onClick={this.onToggleAdvancedSearch}
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
              onClick={this.onSearchClear}
              icon={FaRegTrashAlt}
              iconSize="14"
              ariaLabel="Clear all search filters"
            />
          </div>
          <FilterStack isOpen={showFilterStack}>
            <PortalFeatureContainer advancedSearch>
              <AdvancedSearchDisplayContainer />
            </PortalFeatureContainer>
            {
              spatialDisplayIsVisible && (
                <SpatialDisplayContainer />
              )
            }
            <TemporalDisplayContainer />
          </FilterStack>
        </div>
      </section>
    )
  }
}

SearchForm.propTypes = {
  advancedSearch: PropTypes.shape({
    regionSearch: PropTypes.shape({})
  }).isRequired,
  keywordSearch: PropTypes.string.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired
}

export default SearchForm
