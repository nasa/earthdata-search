import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Col, Dropdown, Form } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { parse } from 'qs'

import { isPath } from '../../util/isPath'
import { pathStartsWith } from '../../util/pathStartsWith'
import Button from '../Button/Button'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { cmrEnv } from '../../../../../sharedUtils/cmrEnv'
import { portalPath } from '../../../../../sharedUtils/portalPath'
import { stringify } from '../../util/url/url'
import { authenticationEnabled } from '../../util/portals'

import './SecondaryToolbar.scss'

class SecondaryToolbar extends Component {
  constructor(props) {
    super(props)

    const { savedProject } = props
    const { name = '' } = savedProject

    this.state = {
      projectDropdownOpen: false,
      projectName: name || 'Untitled Project'
    }

    this.handleLogout = this.handleLogout.bind(this)
    this.onToggleProjectDropdown = this.onToggleProjectDropdown.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.handleNameSubmit = this.handleNameSubmit.bind(this)
    this.handleKeypress = this.handleKeypress.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { savedProject } = this.props
    const { name } = savedProject

    const { savedProject: nextSavedProject } = nextProps
    const { name: nextName } = nextSavedProject

    if (name !== nextName) this.setState({ projectName: nextName })
  }

  onToggleProjectDropdown() {
    const { projectDropdownOpen } = this.state

    this.setState({
      projectDropdownOpen: !projectDropdownOpen
    })
  }

  onInputChange(event) {
    this.setState({ projectName: event.target.value })
  }

  /**
   * Log the user out by calling the onLogout action
   */
  handleLogout() {
    const { onLogout } = this.props
    onLogout()
  }

  handleNameSubmit() {
    const { onUpdateProjectName } = this.props
    const { projectName } = this.state

    const newName = projectName || 'Untitled Project'

    this.setState({
      projectDropdownOpen: false,
      projectName: newName
    })

    onUpdateProjectName(projectName)
  }

  handleKeypress(event) {
    if (event.key === 'Enter') {
      this.handleNameSubmit()
      event.stopPropagation()
      event.preventDefault()
    }
  }

  render() {
    const { projectDropdownOpen, projectName } = this.state
    const {
      authToken,
      projectIds,
      location,
      portal,
      onChangePath
    } = this.props

    const loggedIn = authToken !== ''
    const returnPath = window.location.href

    const { apiHost } = getEnvironmentConfig()
    const cmrEnvironment = cmrEnv()

    // remove focused collection from back button params
    const params = parse(location.search, { parseArrays: false, ignoreQueryPrefix: true })
    let { p = '' } = params
    p = p.replace(/^[^!]*/, '')

    const newSearch = stringify({
      ...params,
      p
    })
    const backLink = (
      <PortalLinkContainer
        className="collection-results__item-title-link"
        to={{
          pathname: '/search',
          search: newSearch
        }}
        onClick={() => { onChangePath(`/search${newSearch}`) }}
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
        const projectPath = `${window.location.protocol}//${window.location.host}${portalPath(portal)}/projects${window.location.search}`
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
          onClick={() => {
            onChangePath(`/projects${location.search}`)
          }}
          to={{
            pathname: '/projects',
            search: location.search
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
          <LinkContainer
            to={`${portalPath(portal)}/preferences`}
          >
            <Dropdown.Item
              className="secondary-toolbar__preferences"
              active={false}
            >
              Preferences
            </Dropdown.Item>
          </LinkContainer>
          <LinkContainer
            to={`${portalPath(portal)}/contact_info`}
          >
            <Dropdown.Item
              className="secondary-toolbar__contact-info"
              active={false}
            >
              Contact Information
            </Dropdown.Item>
          </LinkContainer>
          <LinkContainer
            to={`${portalPath(portal)}/downloads`}
          >
            <Dropdown.Item
              className="secondary-toolbar__downloads"
              active={false}
            >
              Download Status &amp; History
            </Dropdown.Item>
          </LinkContainer>
          <LinkContainer
            to={`${portalPath(portal)}/projects`}
          >
            <Dropdown.Item
              className="secondary-toolbar__saved-projects"
              active={false}
            >
              Saved Projects
            </Dropdown.Item>
          </LinkContainer>
          <Dropdown.Item
            className="secondary-toolbar__logout"
            onClick={this.handleLogout}
          >
            Logout
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    )

    const saveProjectDropdown = (
      <Dropdown
        show={projectDropdownOpen}
        className="secondary-toolbar__project-name-dropdown"
        alignRight
      >
        <Dropdown.Toggle
          className="secondary-toolbar__project-name-dropdown-toggle"
          variant="light"
          onClick={this.onToggleProjectDropdown}
        >
          <i className="fa fa-floppy-o" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Form inline className="flex-nowrap">
            <Form.Row>
              <Col>
                <Form.Control
                  className="secondary-toolbar__project-name-input"
                  name="projectName"
                  value={projectName}
                  onChange={this.onInputChange}
                  onKeyPress={this.handleKeypress}
                />
                <Button
                  className="secondary-toolbar__button secondary-toolbar__button--submit"
                  bootstrapVariant="primary"
                  label="Save project name"
                  onClick={this.handleNameSubmit}
                >
                  Save
                </Button>
              </Col>
            </Form.Row>
          </Form>
        </Dropdown.Menu>
      </Dropdown>
    )

    return (
      <section className="secondary-toolbar">
        {
          isPath(location.pathname, ['/projects']) && backLink
        }
        {
          authenticationEnabled(portal) && (
            <>
              {
                (!isPath(location.pathname, ['/projects', '/downloads']) && projectIds.length > 0) && projectLink
              }
              {
                pathStartsWith(location.pathname, ['/search']) && loggedIn && saveProjectDropdown
              }
              {
                !loggedIn ? loginLink : loggedInDropdown
              }
            </>
          )
        }
      </section>
    )
  }
}

SecondaryToolbar.propTypes = {
  authToken: PropTypes.string.isRequired,
  projectIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  location: PropTypes.shape({}).isRequired,
  portal: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired,
  onLogout: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired
}

export default SecondaryToolbar
