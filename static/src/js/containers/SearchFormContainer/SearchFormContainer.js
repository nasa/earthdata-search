import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query'
import actions from '../../actions/index'

// Form Fields
import TextField from '../../components/form_fields/TextField/TextField'

import './SearchFormContainer.scss'

const urlPropsQueryConfig = {
  keywordSearch: { type: UrlQueryParamTypes.string, queryParam: 'q' }
}

const mapDispatchToProps = dispatch => ({
  getCollections: (query) => {
    dispatch(actions.getCollections(query))
  },
  onChangeKeywordSearch: query => dispatch(actions.changeKeywordSearch(query))
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
  }

  componentDidMount() {
    const { getCollections } = this.props
    const { keywordSearch } = this.state
    getCollections(keywordSearch)
  }

  onFormSubmit(e) {
    e.preventDefault()
  }

  onInputChange(field, value) {
    this.setState({ [field]: value })
  }

  onKeywordBlur() {
    const { onChangeKeywordSearch, getCollections } = this.props
    const { keywordSearch } = this.state
    onChangeKeywordSearch(keywordSearch)
    getCollections(keywordSearch)
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
      </section>
    )
  }
}

SearchFormContainer.defaultProps = {
  keywordSearch: ''
}

SearchFormContainer.propTypes = {
  keywordSearch: PropTypes.string,
  getCollections: PropTypes.func.isRequired,
  onChangeKeywordSearch: PropTypes.func.isRequired
}

// Export redux-connected component for use in application
// Import this class as `import ConnectedSearchFormContainer from './SearchFormContainer'`
export default addUrlProps({ urlPropsQueryConfig })(
  connect(null, mapDispatchToProps)(SearchFormContainer)
)
