import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Col,
  Dropdown,
  Form,
  FormControl,
  InputGroup
} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import { parse } from 'qs'
import {
  FaArrowCircleLeft,
  FaFolder,
  FaLock,
  FaSave,
  FaUser
} from 'react-icons/fa'

import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { isDownloadPathWithId } from '../../util/isDownloadPathWithId'
import { isPath } from '../../util/isPath'
import { locationPropType } from '../../util/propTypes/location'
import { pathStartsWith } from '../../util/pathStartsWith'
import { portalPath } from '../../../../../sharedUtils/portalPath'
import { stringify } from '../../util/url/url'

import Button from '../Button/Button'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './SecondaryToolbar.scss'

class SecondaryToolbar extends Component {
  constructor(props) {
    super(props)

    const { savedProject } = props
    const { name = '' } = savedProject

    this.state = {
      projectDropdownOpen: false,
      projectName: name
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

  /**
   * Log the user out by calling the onLogout action
   */
  handleLogout() {
    const { onLogout } = this.props
    onLogout()
  }

  handleNameSubmit() {
    const { onUpdateProjectName } = this.props
    const { newProjectName } = this.state

    const newName = newProjectName || 'Untitled Project'

    this.setState({
      projectDropdownOpen: false,
      projectName: newName
    })

    onUpdateProjectName(newProjectName)
  }

  handleKeypress(event) {
    if (event.key === 'Enter') {
      this.handleNameSubmit()
      event.stopPropagation()
      event.preventDefault()
    }
  }

  onInputChange(event) {
    this.setState({ newProjectName: event.target.value })
  }

  onToggleProjectDropdown() {
    const { projectDropdownOpen } = this.state

    this.setState({
      projectDropdownOpen: !projectDropdownOpen
    })
  }

  render() {
    const {
      projectDropdownOpen,
      projectName,
      newProjectName
    } = this.state

    const {
      authToken,
      earthdataEnvironment,
      projectCollectionIds,
      location,
      portal,
      retrieval = {},
      onChangePath,
      ursProfile
    } = this.props

    const { first_name: firstName = '' } = ursProfile

    const loggedIn = authToken !== ''
    const returnPath = window.location.href

    const { apiHost } = getEnvironmentConfig()

    // remove focused collection from back button params
    const params = parse(location.search, { parseArrays: false, ignoreQueryPrefix: true })
    let { p = '' } = params
    p = p.replace(/^[^!]*/, '')

    const newSearch = stringify({
      ...params,
      p
    })
    const backToSearchLink = (
      <PortalLinkContainer
        type="button"
        className="secondary-toolbar__back"
        bootstrapVariant="light"
        icon={FaArrowCircleLeft}
        label="Back to Search"
        dataTestId="back-to-search-button"
        to={{
          pathname: '/search',
          search: newSearch
        }}
        onClick={() => { onChangePath(`/search${newSearch}`) }}
      >
        Back to Search
      </PortalLinkContainer>
    )

    const { jsondata = {} } = retrieval
    const { source } = jsondata
    const backToProjectLink = (
      <PortalLinkContainer
        type="button"
        className="secondary-toolbar__back"
        bootstrapVariant="light"
        icon={FaArrowCircleLeft}
        label="Back to Search"
        to={{
          pathname: '/projects',
          search: source
        }}
        onClick={() => { onChangePath(`/projects${source}`) }}
      >
        Back to Project
      </PortalLinkContainer>
    )

    const buildProjectLink = (loggedIn) => {
      if (!loggedIn) {
        const projectPath = `${window.location.protocol}//${window.location.host}${portalPath(portal)}/projects${window.location.search}`
        return (
          <Button
            className="secondary-toolbar__project"
            bootstrapVariant="light"
            href={`${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(projectPath)}`}
            label="View Project"
          >
            My Project
          </Button>
        )
      }
      return (
        <PortalLinkContainer
          type="button"
          onClick={() => {
            onChangePath(`/projects${location.search}`)
          }}
          to={{
            pathname: '/projects',
            search: location.search
          }}
          className="secondary-toolbar__project"
          bootstrapVariant="light"
          label="View Project"
          icon={FaFolder}
        >
          My Project
        </PortalLinkContainer>
      )
    }

    const projectLink = buildProjectLink(loggedIn)

    const loginLink = (
      <Button
        className="secondary-toolbar__login"
        bootstrapVariant="light"
        href={`${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(returnPath)}`}
        icon={FaLock}
        label="Login"
      >
        Earthdata Login
      </Button>
    )

    const loggedInDropdown = (
      <Dropdown className="secondary-toolbar__user-dropdown">
        <Dropdown.Toggle
          label="User menu"
          className="secondary-toolbar__user-dropdown-toggle"
          variant="light"
          as={Button}
        >
          {
            firstName && (
              <span className="secondary-toolbar__username">
                {firstName}
              </span>
            )
          }
          <EDSCIcon size="0.825rem" icon={FaUser} />
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
            to={{
              pathname: `${portalPath(portal)}/downloads`,
              search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
            }}
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
          <LinkContainer
            to={`${portalPath(portal)}/subscriptions`}
          >
            <Dropdown.Item
              className="secondary-toolbar__saved-subscriptions"
              active={false}
            >
              Subscriptions
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
        onToggle={this.onToggleProjectDropdown}
        alignRight
      >
        <Dropdown.Toggle
          className="secondary-toolbar__project-name-dropdown-toggle"
          as={Button}
          onClick={this.onToggleProjectDropdown}
          icon={FaSave}
          iconSize="0.825rem"
          label="Create a project with your current search"
        />
        <Dropdown.Menu>
          <Form inline className="flex-nowrap secondary-toolbar__project-name-form">
            <Form.Row>
              <Col>
                <InputGroup>
                  <FormControl
                    className="secondary-toolbar__project-name-input"
                    name="projectName"
                    value={newProjectName}
                    placeholder="Untitled Project"
                    onChange={this.onInputChange}
                    onKeyPress={this.handleKeypress}
                  />
                  <InputGroup.Append>
                    <Button
                      className="secondary-toolbar__button secondary-toolbar__button--submit"
                      bootstrapVariant="primary"
                      label="Save project name"
                      onClick={this.handleNameSubmit}
                    >
                      Save
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
            </Form.Row>
          </Form>
        </Dropdown.Menu>
      </Dropdown>
    )

    const showSaveProjectDropdown = pathStartsWith(location.pathname, ['/search']) && loggedIn
    const showViewProjectLink = (!pathStartsWith(location.pathname, ['/projects', '/downloads']) && (projectCollectionIds.length > 0 || projectName))

    return (
      <nav className="secondary-toolbar">
        {
          isPath(location.pathname, ['/projects']) && backToSearchLink
        }
        {
          isDownloadPathWithId(location.pathname) && backToProjectLink
        }
        <PortalFeatureContainer authentication>
          <>
            {
              showViewProjectLink && projectLink
            }
            {
              showSaveProjectDropdown && saveProjectDropdown
            }
            {
              !loggedIn ? loginLink : loggedInDropdown
            }
          </>
        </PortalFeatureContainer>
      </nav>
    )
  }
}

SecondaryToolbar.propTypes = {
  authToken: PropTypes.string.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired,
  location: locationPropType.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  portal: PropTypes.shape({}).isRequired,
  projectCollectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  retrieval: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  ursProfile: PropTypes.shape({
    first_name: PropTypes.string
  }).isRequired
}

export default SecondaryToolbar
