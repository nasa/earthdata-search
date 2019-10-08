import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Button from '../Button/Button'
import ConnectedSpatialDisplayContainer
  from '../../containers/SpatialDisplayContainer/SpatialDisplayContainer'
import ConnectedTemporalDisplayContainer
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

  render() {
    const {
      keywordSearch,
      showFilterStack
    } = this.state

    return (
      <section className="search-form">
        <div className="search-form__primary">
          <form className="search-form__form" onSubmit={this.onFormSubmit}>
            <TextField
              name="keywordSearch"
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
          <TemporalSelectionDropdownContainer />
          <SpatialSelectionDropdownContainer />
          <Button
            bootstrapVariant="inline-block"
            className="search-form__button search-form__button--clear"
            label="Clear search"
            onClick={this.onSearchClear}
          >
            <i className="fa fa-eraser" />
          </Button>
          <Button
            bootstrapVariant="inline-block"
            className="search-form__button search-form__button--dark search-form__button--toggle"
            onClick={this.onToggleFilterStack}
            title="Toggle Filter Stack"
            label="Toggle Filter Stack"
          >
            <i className="fa fa-bars" />
          </Button>
        </div>
        <div className="search-form__secondary">
          <FilterStack isOpen={showFilterStack}>
            <ConnectedSpatialDisplayContainer />
            <ConnectedTemporalDisplayContainer />
          </FilterStack>
        </div>
      </section>
    )
  }
}

SearchForm.propTypes = {
  keywordSearch: PropTypes.string.isRequired,
  onChangeQuery: PropTypes.func.isRequired,
  onChangeFocusedCollection: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired
}

export default SearchForm
