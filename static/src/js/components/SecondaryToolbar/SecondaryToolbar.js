import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { remove } from 'tiny-cookie'
import { Link } from 'react-router-dom'
import { Dropdown } from 'react-bootstrap'

import Button from '../Button/Button'

import './SecondaryToolbar.scss'
import { getEarthdataConfig } from '../../../../../sharedUtils/config'

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
    const {
      authToken,
      projectIds,
      location
    } = this.props
    const loggedIn = authToken !== ''
    const returnPath = window.location.href

    const backLink = (
      <Link
        className="collection-results__item-title-link"
        to={{
          pathname: '/search',
          search: window.location.search
        }}
      >
        <Button className="secondary-toolbar__back" bootstrapVariant="light">
          Back
        </Button>
      </Link>
    )

    const buildProjectLink = (loggedIn) => {
      if (!loggedIn) {
        const projectPath = `${window.location.protocol}//${window.location.host}/projects${window.location.search}`
        return (
          <Button
            className="secondary-toolbar__project"
            bootstrapVariant="light"
            href={`${getEarthdataConfig('prod').apiHost}/login?cmr_env=${'prod'}&state=${encodeURIComponent(projectPath)}`}
          >
            My Project
          </Button>
        )
      }
      return (
        <Link
          className="collection-results__item-title-link"
          to={{
            pathname: '/projects',
            search: window.location.search
          }}
        >
          <Button
            className="secondary-toolbar__project"
            bootstrapVariant="light"
          >
            My Project
          </Button>
        </Link>
      )
    }

    const projectLink = buildProjectLink(loggedIn)

    const loginLink = (
      <Button
        className="secondary-toolbar__login"
        bootstrapVariant="light"
        href={`${getEarthdataConfig('prod').apiHost}/login?cmr_env=${'prod'}&state=${encodeURIComponent(returnPath)}`}
        icon="lock"
      >
        Earthdata Login
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
            href="/"
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )

    return (
      <section className="secondary-toolbar">
        {
          location.pathname === '/projects' && backLink
        }
        {
          (location.pathname !== '/projects' && projectIds.length > 0) && projectLink
        }
        {
          !loggedIn ? loginLink : loggedInDropdown
        }
      </section>
    )
  }
}

SecondaryToolbar.propTypes = {
  authToken: PropTypes.string.isRequired,
  projectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.shape({}).isRequired
}

export default SecondaryToolbar
