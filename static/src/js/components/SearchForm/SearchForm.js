import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button } from 'react-bootstrap'

import ConnectedSpatialDisplayContainer
  from '../../containers/SpatialDisplayContainer/SpatialDisplayContainer'
import ConnectedTemporalDisplayContainer
  from '../../containers/TemporalDisplayContainer/TemporalDisplayContainer'
import ConnectedTemporalSelectionDropdownContainer
  from '../../containers/TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer'
import FilterStack
  from '../FilterStack/FilterStack'
// Form Fields
import TextField from '../FormFields/TextField/TextField'
import SpatialSelectionDropdown from '../SpatialDisplay/SpatialSelectionDropdown'

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
    const { onChangeNlpSearch } = this.props
    const { keywordSearch } = this.state

    onChangeNlpSearch(keywordSearch)
    e.preventDefault()
  }

  onInputChange(field, value) {
    this.setState({ [field]: value })
  }

  onKeywordBlur() {
    const { onChangeNlpSearch } = this.props
    const { keywordSearch } = this.state

    onChangeNlpSearch(keywordSearch)
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

    const { auth } = this.props
    const loggedIn = auth !== ''
    const returnPath = window.location.href
    const edlHost = 'https://urs.earthdata.nasa.gov'
    // TODO get these config values saved somewhere
    const clientId = 'fill this in with a real client id'

    const loginLink = <a href={`${edlHost}/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=http%3A%2F%2Flocalhost%3A3001%2Furs_callback&state=${encodeURIComponent(returnPath)}`}>Login</a>
    const logoutLink = <a href={`http://localhost:3001/logout?redirect=${encodeURIComponent('http://localhost:8080')}`}>Logout</a>

    return (
      <section className="search-form">
        {
          loggedIn && (logoutLink)
        }
        {
          !loggedIn && (loginLink)
        }

        <form className="search-form__form" onSubmit={this.onFormSubmit}>
          <TextField
            name="keywordSearch"
            classNames={{
              label: 'search-form__label',
              labelSpan: 'search-form__assistive',
              input: 'search-form__input'
            }}
            placeholder="Type any topic, collection, or place name"
            value={keywordSearch}
            onChange={this.onInputChange}
            onBlur={this.onKeywordBlur}
          />
        </form>
        <ConnectedTemporalSelectionDropdownContainer />
        <SpatialSelectionDropdown />
        <Button
          variant="inline-block"
          className="search-form__button search-form__button--clear"
          onClick={this.onSearchClear}
        >
          <i className="fa fa-eraser" />
        </Button>
        <Button
          variant="inline-block"
          className="search-form__button search-form__button--dark search-form__button--toggle"
          onClick={this.onToggleFilterStack}
          title="Toggle Filter Stack"
        >
          <i className="fa fa-bars" />
        </Button>
        <FilterStack isOpen={showFilterStack}>
          <ConnectedSpatialDisplayContainer />
          <ConnectedTemporalDisplayContainer />
        </FilterStack>
      </section>
    )
  }
}

SearchForm.propTypes = {
  auth: PropTypes.string.isRequired,
  keywordSearch: PropTypes.string.isRequired,
  onChangeNlpSearch: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired
}

export default SearchForm
