import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { remove } from 'tiny-cookie'
import { Dropdown } from 'react-bootstrap'

import Button from '../Button/Button'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'

import './SecondaryToolbar.scss'
import { portalPath } from '../../../../../sharedUtils/portalPath'

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
      location,
      portal
    } = this.props
    const loggedIn = authToken !== ''
    const returnPath = window.location.href

    const { apiHost } = getEnvironmentConfig()
    const cmrEnvironment = cmrEnv()

    const backLink = (
      <PortalLinkContainer
        className="collection-results__item-title-link"
        to={{
          pathname: '/search',
          search: window.location.search
        }}
      >
        <Button
          className="secondary-toolbar__back"
          bootstrapVariant="light"
          icon="arrow-circle-o-left"
          label="Back to Search"
        >
          Back to Search
        </Button>
      </PortalLinkContainer>
    )

    const buildProjectLink = (loggedIn) => {
      if (!loggedIn) {
        const projectPath = `${window.location.protocol}//${window.location.host}/projects${window.location.search}`
        return (
          <Button
            className="secondary-toolbar__project"
            bootstrapVariant="light"
            href={`${apiHost}/login?cmr_env=${cmrEnvironment}&state=${encodeURIComponent(projectPath)}`}
            label="View Project"
          >
            My Project
          </Button>
        )
      }
      return (
        <PortalLinkContainer
          className="collection-results__item-title-link"
          to={{
            pathname: '/projects',
            search: window.location.search
          }}
        >
          <Button
            className="secondary-toolbar__project"
            bootstrapVariant="light"
            label="View Project"
          >
            My Project
          </Button>
        </PortalLinkContainer>
      )
    }

    const projectLink = buildProjectLink(loggedIn)

    const loginLink = (
      <Button
        className="secondary-toolbar__login"
        bootstrapVariant="light"
        href={`${apiHost}/login?cmr_env=${cmrEnvironment}&state=${encodeURIComponent(returnPath)}`}
        icon="lock"
        label="Login"
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
            href={`${portalPath(portal)}/`}
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
  location: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default SecondaryToolbar
