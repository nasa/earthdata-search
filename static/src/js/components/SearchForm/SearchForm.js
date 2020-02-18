import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'

import Button from '../Button/Button'
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
import FilterStack
  from '../FilterStack/FilterStack'
// Form Fields
import TextField from '../FormFields/TextField/TextField'

import './SearchForm.scss'

class SearchForm extends Component {
  constructor(props) {
    super(props)

    this.state = {
      keywordSearch: props.keywordSearch ? props.keywordSearch : '',
      showFilterStack: true
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onKeywordBlur = this.onKeywordBlur.bind(this)
    this.onSearchClear = this.onSearchClear.bind(this)
    this.onToggleAdvancedSearch = this.onToggleAdvancedSearch.bind(this)
    this.onToggleFilterStack = this.onToggleFilterStack.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { keywordSearch } = this.props

    if (keywordSearch !== nextProps.keywordSearch) {
      this.setState({ keywordSearch: nextProps.keywordSearch })
    }
  }

  onFormSubmit(e) {
    e.preventDefault()

    document.getElementsByClassName('search-form__input').keywordSearch.blur()
  }

  onInputChange(field, value) {
    this.setState({ [field]: value })
  }

  onKeywordBlur() {
    const {
      keywordSearch: propsKeyword,
      onChangeQuery,
      onChangeFocusedCollection
    } = this.props
    const { keywordSearch } = this.state

    if (propsKeyword !== keywordSearch) {
      onChangeFocusedCollection('')
      onChangeQuery({
        collection: {
          keyword: keywordSearch
        }
      })
    }
  }

  onSearchClear() {
    const { onClearFilters } = this.props
    this.setState({ keywordSearch: '' })
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
      showFilterStackToggle
    } = this.props

    const {
      keywordSearch,
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
          <form className="search-form__form" onSubmit={this.onFormSubmit}>
            <TextField
              name="keywordSearch"
              dataTestId="keywordSearchInput"
              classNames={{
                label: 'search-form__label',
                labelSpan: 'search-form__assistive',
                input: 'search-form__input'
              }}
              placeholder="Search for collections or topics"
              value={keywordSearch}
              onChange={this.onInputChange}
              onBlur={this.onKeywordBlur}
            />
          </form>
          <Button
            bootstrapVariant="inline-block"
            className="search-form__button search-form__button--clear"
            label="Clear search"
            onClick={this.onSearchClear}
            icon="eraser"
          />
          {
            showFilterStackToggle && (
              <>
                {
                  showFilterStack
                    ? (
                      <Button
                        bootstrapVariant="inline-block"
                        className="search-form__button search-form__button--dark search-form__button--toggle"
                        onClick={this.onToggleFilterStack}
                        title="Close filter stack"
                        label="Close filter stack"
                        icon="chevron-up"
                      />
                    )
                    : (
                      <Button
                        bootstrapVariant="inline-block"
                        className="search-form__button search-form__button--dark search-form__button--toggle"
                        onClick={this.onToggleFilterStack}
                        title="Open filter stack"
                        label="Open filter stack"
                        icon="bars"
                      />
                    )
                }
              </>
            )
          }
        </div>
        <div className="search-form__secondary">
          <div className="search-form__secondary-actions">
            <TemporalSelectionDropdownContainer />
            <SpatialSelectionDropdownContainer />
            <Button
              bootstrapVariant="inline-block"
              className="search-form__button search-form__button--dark search-form__button--advanced-search"
              label="Advanced search"
              onClick={this.onToggleAdvancedSearch}
              icon="sliders"
            />
          </div>
          <FilterStack isOpen={showFilterStack}>
            <AdvancedSearchDisplayContainer />
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
  advancedSearch: PropTypes.shape({}).isRequired,
  keywordSearch: PropTypes.string.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
  onToggleAdvancedSearchModal: PropTypes.func.isRequired,
  showFilterStackToggle: PropTypes.bool.isRequired
}

export default SearchForm
