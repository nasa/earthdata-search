import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import actions from '../../actions/index'

import ConnectedSpatialDisplayContainer from '../SpatialDisplayContainer/SpatialDisplayContainer'
import ConnectedTemporalDisplayContainer from '../TemporalDisplayContainer/TemporalDisplayContainer'
import ConnectedTemporalSelectionDropdownContainer
  from '../TemporalSelectionDropdownContainer/TemporalSelectionDropdownContainer'

// Form Fields
import TextField from '../../components/form_fields/TextField/TextField'
import Button from '../../components/form_fields/Button/Button'

import './SearchFormContainer.scss'

const mapDispatchToProps = dispatch => ({
  onChangeQuery: query => dispatch(actions.changeQuery(query)),
  onClearFilters: () => dispatch(actions.clearFilters()),
  onChangeNlpSearch: query => dispatch(actions.searchNlp(query))
})

const mapStateToProps = state => ({
  keywordSearch: state.query.keyword
})

// Export non-redux-connected component for use in tests
// Import this class as `import { SearchFormContainer } from '../SearchFormContainer'`
export class SearchFormContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      keywordSearch: props.keywordSearch ? props.keywordSearch : ''
    }

    this.onFormSubmit = this.onFormSubmit.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.onKeywordBlur = this.onKeywordBlur.bind(this)
    this.onSearchClear = this.onSearchClear.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { keywordSearch } = this.props

    if (keywordSearch !== nextProps.keywordSearch) {
      this.setState({ keywordSearch: nextProps.keywordSearch })
    }
  }

  onFormSubmit(e) {
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

  render() {
    const { keywordSearch } = this.state

    return (
      <section className="search-form">
        <form onSubmit={this.onFormSubmit}>
          <TextField
            name="keywordSearch"
            value={keywordSearch}
            onChange={this.onInputChange}
            onBlur={this.onKeywordBlur}
          />
        </form>

        <ConnectedTemporalSelectionDropdownContainer />

        <Button
          text="Clear Filters"
          onClick={this.onSearchClear}
        />

        <ConnectedSpatialDisplayContainer />
        <ConnectedTemporalDisplayContainer />
      </section>
    )
  }
}

SearchFormContainer.defaultProps = {
  keywordSearch: ''
}

SearchFormContainer.propTypes = {
  keywordSearch: PropTypes.string,
  onClearFilters: PropTypes.func.isRequired,
  onChangeNlpSearch: PropTypes.func.isRequired
}

// Export redux-connected component for use in application
// Import this class as `import ConnectedSearchFormContainer from './SearchFormContainer'`
export default connect(mapStateToProps, mapDispatchToProps)(SearchFormContainer)
