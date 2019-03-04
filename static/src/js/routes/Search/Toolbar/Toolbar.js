import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query'

import actions from '../../../actions/index'

import './Toolbar.scss'

const urlPropsQueryConfig = {
  query: { type: UrlQueryParamTypes.string, queryParam: 'q' }
}

const mapDispatchToProps = dispatch => ({
  getCollections: (query) => {
    dispatch(actions.getCollections(query))
  }
})

class Toolbar extends Component {
  constructor(props) {
    super(props)
    const { query } = this.props
    const initialVal = query || ''
    this.state = { inputValue: initialVal }
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleSearchBlur = this.handleSearchBlur.bind(this)
    this.handleSearchKeypress = this.handleSearchKeypress.bind(this)
  }

  componentDidMount() {
    const { query } = this.props
    this.setState({ inputValue: query })
  }

  handleSearchKeypress(event) {
    const { inputValue } = this.state

    // Disable the form action on 'enter' key
    if (event.which === 13) {
      event.preventDefault()
      this.updateQuery({ query: inputValue })
    }
  }

  handleSearchBlur() {
    const { inputValue } = this.state
    this.updateQuery({ query: inputValue })
  }

  handleSearchChange(event) {
    this.setState({ inputValue: event.target.value })
  }

  updateQuery(obj) {
    const { onChangeUrlQueryParams } = this.props
    onChangeUrlQueryParams(obj)
  }

  render() {
    const { inputValue } = this.state
    return (
      <section className="toolbar">
        <form
          className="toolbar__form"
          action="/"
        >
          <label htmlFor="input__search-bar">
            <span className="visually-hidden">Search</span>
            <input
              id="input__search-bar"
              className="toolbar__input"
              type="text"
              placeholder="Search"
              value={inputValue}
              onBlur={this.handleSearchBlur}
              onChange={this.handleSearchChange}
              onKeyPress={this.handleSearchKeypress}
            />
          </label>
        </form>
      </section>
    )
  }
}

Toolbar.defaultProps = {
  query: ''
}

Toolbar.propTypes = {
  query: PropTypes.string,
  onChangeUrlQueryParams: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired
}

export default addUrlProps({ urlPropsQueryConfig })(
  withRouter(
    connect(null, mapDispatchToProps)(Toolbar)
  )
)
