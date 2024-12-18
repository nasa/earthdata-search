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
import classNames from 'classnames'
import {
  FaArrowCircleLeft,
  FaFolder,
  FaQuestion,
  FaSave,
  FaUser,
  FaSignInAlt
} from 'react-icons/fa'
import TourContext from '../../contexts/TourContext'
import { getApplicationConfig, getEnvironmentConfig } from '../../../../../sharedUtils/config'

import { deployedEnvironment } from '../../../../../sharedUtils/deployedEnvironment'
import { isDownloadPathWithId } from '../../util/isDownloadPathWithId'
import { isPath } from '../../util/isPath'
import { locationPropType } from '../../util/propTypes/location'
import { pathStartsWith } from '../../util/pathStartsWith'
import { stringify } from '../../util/url/url'

import Button from '../Button/Button'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './SecondaryToolbar.scss'

class SecondaryToolbar extends Component {
  // eslint-disable-next-line react/static-property-placement
  static contextType = TourContext

  constructor(props) {
    super(props)

    const { savedProject } = props
    const { name = '' } = savedProject

    this.state = {
      projectDropdownOpen: false,
      projectName: name,
      newProjectName: ''
    }

    this.handleLogout = this.handleLogout.bind(this)
    this.onToggleProjectDropdown = this.onToggleProjectDropdown.bind(this)
    this.onInputChange = this.onInputChange.bind(this)
    this.handleNameSubmit = this.handleNameSubmit.bind(this)
    this.handleKeypress = this.handleKeypress.bind(this)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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

  // Needed for Save Project so when the url updates with a project-id we don't refresh the page
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
      retrieval = {},
      secondaryToolbarEnabled,
      ursProfile
    } = this.props

    const { disableSiteTour } = getApplicationConfig()
    const { first_name: firstName = '' } = ursProfile

    const loggedIn = authToken !== ''
    const returnPath = window.location.href
    const { pathname, search } = location
    let isMapOverlay = false
    let needsOverlayPaths = ['/search']

    // Currently saved projects and a project page share a route as such we must determine if we are on the saved projects page
    // If we are on the project page i.e. a specific project we will have the map included in the DOM and need to adjust the classname
    if (pathname === '/projects' && search) {
      needsOverlayPaths = [...needsOverlayPaths, '/projects']
    }

    // Determine if the current page is a route that displays the map so the correct className can be set
    if (pathStartsWith(pathname, needsOverlayPaths)) {
      isMapOverlay = true
    }

    const mapButtonClass = isMapOverlay ? 'secondary-toolbar__map-page' : ''
    const secondaryToolbarClassnames = classNames(['secondary-toolbar', { 'secondary-toolbar--map-overlay': isMapOverlay }])

    const { apiHost } = getEnvironmentConfig()

    // Remove focused collection from back button params
    const params = parse(search, {
      parseArrays: false,
      ignoreQueryPrefix: true
    })
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
        to={
          {
            pathname: '/search',
            search: newSearch
          }
        }
        updatePath
      >
        Back to Search
      </PortalLinkContainer>
    )

    const { jsondata = {} } = retrieval
    const { source } = jsondata
    const backToProjectLink = (
      <PortalLinkContainer
        type="button"
        className={classNames(['secondary-toolbar__back', { 'focus-light': isMapOverlay }])}
        bootstrapVariant="light"
        icon={FaArrowCircleLeft}
        label="Back to Project"
        to={
          {
            pathname: '/projects',
            search: source
          }
        }
        updatePath
      >
        Back to Project
      </PortalLinkContainer>
    )

    const buildProjectLink = (isLoggedIn) => {
      if (!isLoggedIn) {
        const projectPath = `${window.location.protocol}//${window.location.host}/projects${window.location.search}`

        return (
          <Button
            className={classNames(['secondary-toolbar__project', { 'focus-light': isMapOverlay }])}
            bootstrapVariant="light"
            href={`${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(projectPath)}`}
            tooltip="View your project"
            tooltipId="view-project-tooltip"
            tooltipPlacement="left"
            icon={FaFolder}
          >
            My Project
          </Button>
        )
      }

      return (
        <PortalLinkContainer
          type="button"
          to={
            {
              pathname: '/projects',
              search: location.search
            }
          }
          className={classNames(['secondary-toolbar__project', { 'focus-light': isMapOverlay }])}
          bootstrapVariant="light"
          icon={FaFolder}
          iconPosition="left"
          tooltip="View your project"
          tooltipId="view-project-tooltip"
          tooltipPlacement="left"
          updatePath
        >
          My Project
        </PortalLinkContainer>
      )
    }

    const projectLink = buildProjectLink(loggedIn)

    const loginLink = (
      <Button
        className={classNames({ 'focus-light': isMapOverlay })}
        bootstrapVariant="light"
        href={`${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(returnPath)}`}
        tooltip="Log In with Earthdata Login"
        tooltipId="login-tooltip"
        tooltipPlacement="left"
        icon={FaSignInAlt}
      >
        Log In
      </Button>
    )
    const loggedInDropdown = (
      <Dropdown>
        <Dropdown.Toggle
          className={classNames([`secondary-toolbar__user-dropdown-toggle ${mapButtonClass}`, { 'focus-light': isMapOverlay }])}
          bootstrapVariant="light"
          as={Button}
          icon={FaUser}
        >
          {
            firstName && (
              <span className="secondary-toolbar__username">
                {firstName}
              </span>
            )
          }
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <LinkContainer
            to="/preferences"
          >
            <Dropdown.Item
              className="secondary-toolbar__preferences"
              active={false}
            >
              Preferences
            </Dropdown.Item>
          </LinkContainer>
          <LinkContainer
            to="/contact-info"
          >
            <Dropdown.Item
              className="secondary-toolbar__contact-info"
              active={false}
            >
              Contact Information
            </Dropdown.Item>
          </LinkContainer>
          <LinkContainer
            to={
              {
                pathname: '/downloads',
                search: stringify({ ee: earthdataEnvironment === deployedEnvironment() ? '' : earthdataEnvironment })
              }
            }
          >
            <Dropdown.Item
              className="secondary-toolbar__downloads"
              active={false}
            >
              Download Status &amp; History
            </Dropdown.Item>
          </LinkContainer>
          <LinkContainer
            to="/projects"
          >
            <Dropdown.Item
              className="secondary-toolbar__saved-projects"
              active={false}
            >
              Saved Projects
            </Dropdown.Item>
          </LinkContainer>
          <LinkContainer
            to="/subscriptions"
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
        className={classNames(['secondary-toolbar__project-name-dropdown', { 'focus-light': isMapOverlay }])}
        onToggle={this.onToggleProjectDropdown}
        alignRight
      >
        <Dropdown.Toggle
          className="secondary-toolbar__project-dropdown-toggle focus-light"
          as={Button}
          onClick={this.onToggleProjectDropdown}
          icon={FaSave}
          iconSize="0.825rem"
          bootstrapVariant="light"
          tooltip="Create a project with your current search"
          tooltipId="create-project-tooltip"
          tooltipPlacement="left"
        >
          <span className="secondary-toolbar__dropdown-text sr-only">
            Save Project
          </span>
        </Dropdown.Toggle>
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

    const startTourButton = (
      <Dropdown
        show={projectDropdownOpen}
        className="secondary-toolbar__start-tour-name-dropdown focus-light"
        onToggle={this.onToggleProjectDropdown}
        alignRight
      >
        <TourContext.Consumer>
          {
            ({ setRunTour }) => (
              <Dropdown.Toggle
                className={classNames(['secondary-toolbar__start-tour-button', { 'focus-light': isMapOverlay }])}
                as={Button}
                icon={FaQuestion}
                iconSize="0.825rem"
                onClick={setRunTour}
                bootstrapVariant="light"
                tooltip="Take a tour to learn how to use Earthdata Search"
                tooltipId="start-tour-tooltip"
                tooltipPlacement="left"
                label="Start tour"
              />
            )
          }
        </TourContext.Consumer>
      </Dropdown>
    )

    const showSaveProjectDropdown = pathStartsWith(location.pathname, ['/search']) && loggedIn
    const showViewProjectLink = (!pathStartsWith(location.pathname, ['/projects', '/downloads']) && (projectCollectionIds.length > 0 || projectName))
    const showStartTourButton = location.pathname === '/search' && (disableSiteTour !== 'true')

    return (
      secondaryToolbarEnabled
      && (
        <nav
          className={secondaryToolbarClassnames}
          data-testid="secondary-toolbar"
        >
          {isPath(location.pathname, ['/projects']) && backToSearchLink}
          {isDownloadPathWithId(location.pathname) && backToProjectLink}
          <PortalFeatureContainer authentication>
            <>
              {showViewProjectLink && projectLink}
              {showSaveProjectDropdown && saveProjectDropdown}
              {showStartTourButton && startTourButton}
              {!loggedIn ? loginLink : loggedInDropdown}
            </>
          </PortalFeatureContainer>
        </nav>
      )
    )
  }
}

SecondaryToolbar.defaultProps = { secondaryToolbarEnabled: true }

SecondaryToolbar.propTypes = {
  authToken: PropTypes.string.isRequired,
  earthdataEnvironment: PropTypes.string.isRequired,
  location: locationPropType.isRequired,
  onLogout: PropTypes.func.isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  projectCollectionIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  retrieval: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({
    name: PropTypes.string
  }).isRequired,
  ursProfile: PropTypes.shape({
    first_name: PropTypes.string
  }).isRequired,
  secondaryToolbarEnabled: PropTypes.bool
}

export default SecondaryToolbar
