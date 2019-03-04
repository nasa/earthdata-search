import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  Link,
  withRouter
} from 'react-router-dom'
import { addUrlProps, UrlQueryParamTypes } from 'react-url-query'

import actions from '../../actions/index'

import './Header.scss'

const urlPropsQueryConfig = {
  query: { type: UrlQueryParamTypes.string, queryParam: 'q' }
}

const mapDispatchToProps = dispatch => ({
  getCollections: (query) => {
    dispatch(actions.getCollections(query))
  }
})

class Header extends Component {
  constructor(props) {
    super(props)
    const { query } = this.props
    this.state = { inputValue: query }
    this.handleSearchChange = this.handleSearchChange.bind(this)
    this.handleSearchBlur = this.handleSearchBlur.bind(this)
  }

  componentDidMount() {
    const { query } = this.props
    this.setState({ inputValue: query })
  }

  handleSearchBlur(event) {
    this.updateQuery({ query: event.target.value })
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
      <header className="header">
        <ul className="header__menu">
          <li className="header__menu-item">
            <h1 className="header__menu-title">
              <Link
                className="header__menu-link"
                to="/search"
              >
                  Earthdata Search
              </Link>
            </h1>
          </li>
          <li className="header__menu-item">
            <Link
              className="header__menu-link"
              to="/project"
            >
                Project
            </Link>
          </li>
        </ul>
        <input
          type="text"
          placeholder="Search"
          value={inputValue}
          onBlur={this.handleSearchBlur}
          onChange={this.handleSearchChange}
        />
      </header>
    )
  }
}

Header.defaultProps = {
  query: ''
}

Header.propTypes = {
  query: PropTypes.string,
  onChangeUrlQueryParams: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired
}

export default addUrlProps({ urlPropsQueryConfig })(
  withRouter(
    connect(null, mapDispatchToProps)(Header)
  )
)
