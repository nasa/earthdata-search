import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { remove } from 'tiny-cookie'

import { Button, Dropdown } from 'react-bootstrap'

import './SecondaryToolbar.scss'

class SecondaryToolbar extends Component {
  constructor(props) {
    super(props)
    this.handleLogout = this.handleLogout.bind(this)
  }

  /**
   * Remove the authToken cookie
   */
  handleLogout() {
    remove('authToken')
  }

  render() {
    const { authToken } = this.props
    const loggedIn = authToken !== ''
    const returnPath = window.location.href

    const loginLink = (
      <Button className="secondary-toolbar__login" variant="light" href={`http://localhost:3001/login?cmr_env=${'prod'}&state=${encodeURIComponent(returnPath)}`}>
        <i className="fa fa-lock" />
        {' Earthdata Login'}
      </Button>
    )

    const loggedInDropdown = (
      <Dropdown className="secondary-toolbar__user-dropdown">
        <Dropdown.Toggle
          className="secondary-toolbar__user-dropdown-toggle"
          variant="light"
        >
          <i className="fa fa-user" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item
            className="secondary-toolbar__logout"
            onClick={this.handleLogout}
            href="http://localhost:8080"
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )

    return (
      <section className="secondary-toolbar">
        {
          !loggedIn ? loginLink : loggedInDropdown
        }
      </section>
    )
  }
}

SecondaryToolbar.propTypes = {
  authToken: PropTypes.string.isRequired
}

export default SecondaryToolbar
