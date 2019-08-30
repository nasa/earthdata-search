/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import abbreviate from 'number-abbreviate'

import { convertSizeToMB, convertSize } from '../../util/project'
import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
// import Button from '../Button/Button'

import './ProjectHeader.scss'

/**
 * Renders ProjectHeader.
 * @param {object} props - The props passed into the component.
 * @param {object} props.collections - Collections passed from redux store.
 * @param {object} props.project - Project collections passed from redux store.
 * @param {object} props.savedProject - Saved Project information (name) passed from redux store
 * @param {function} props.onUpdateProjectName - Function to updated the saved project name
 */

export class ProjectHeader extends Component {
  constructor(props) {
    super(props)
    this.component = this

    const { savedProject } = props
    const { name = '' } = savedProject

    this.state = {
      isEditingName: false,
      projectName: name
    }

    this.textInput = React.createRef()

    this.onInputChange = this.onInputChange.bind(this)
    this.handleNameSubmit = this.handleNameSubmit.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleKeypress = this.handleKeypress.bind(this)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.focusTextField = this.focusTextField.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { savedProject } = this.props
    const { name = '' } = savedProject

    const { savedProject: nextSavedProject } = nextProps
    const { name: nextName } = nextSavedProject
    if (name !== nextName) {
      this.setState({ projectName: nextName })
    }
  }

  onInputChange(event) {
    this.setState({ projectName: event.target.value })
  }

  handleNameSubmit() {
    const { onUpdateProjectName } = this.props
    const { projectName } = this.state

    this.setState({ isEditingName: false })
    onUpdateProjectName(projectName)
  }

  handleKeypress(event) {
    if (event.key === 'Enter') {
      this.handleNameSubmit()
      event.stopPropagation()
      event.preventDefault()
    }
  }

  handleEditClick() {
    this.setState({ isEditingName: true })
    this.focusTextField()
  }

  handleOnFocus() {
    this.setState({ isEditingName: true })
  }

  focusTextField() {
    this.textInput.current.focus()
  }

  render() {
    const { isEditingName, projectName } = this.state
    const { collections, project } = this.props
    const { byId } = collections
    const { collectionIds: projectIds } = project

    let totalGranules = 0
    let size = 0
    projectIds.forEach((collectionId) => {
      const collection = byId[collectionId]
      if (!collection) return

      const { excludedGranuleIds = [], granules } = collection
      const { hits, totalSize: granuleSize } = granules

      totalGranules += (hits - excludedGranuleIds.length)
      const convertedSize = convertSizeToMB(granuleSize)
      size += convertedSize
    })

    const totalSize = convertSize(size)
    const {
      size: totalProjectSize,
      unit: totalUnit
    } = totalSize

    return (
      <header className="project-header">
        <h2 className="project-header__title">
          <input
            name="projectName"
            placeholder="Untitled Project"
            value={projectName}
            onFocus={this.handleOnFocus}
            onChange={this.onInputChange}
            onKeyPress={this.handleKeypress}
            ref={this.textInput}
          />
          {
            isEditingName && (
              <button
                type="button"
                className="project-name__submit-button"
                label="Submit project name"
                onClick={this.handleNameSubmit}
              >
                <i className="fa fa-check" />
              </button>
              // <Button
              //   className="project-name__submit-button"
              //   label="Submit project name"
              //   onClick={this.handleNameSubmit}
              // >
              //   <i className="fa fa-check" />
              // </Button>
            )
          }
          {
            !isEditingName && (
              <button
                type="button"
                className="project-name__edit-button"
                label="Edit project name"
                onClick={this.handleEditClick}
              >
                <i className="fa fa-pencil" />
              </button>
              // <Button
              //   className="project-name__edit-button"
              //   label="Edit project name"
              //   onClick={this.handleEditClick}
              // >
              //   <i className="fa fa-pencil" />
              // </Button>
            )
          }
        </h2>
        <ul className="project-header__stats-list">
          {!Number.isNaN(totalGranules) && (
            <>
              <li
                className="project-header__stats-item project-header__stats-item--granules"
              >
                <span className="project-header__stats-val">
                  {`${abbreviate(totalGranules, 1)} `}
                </span>
                {pluralize('Granule', totalGranules)}
              </li>
              <li
                className="project-header__stats-item project-header__stats-item--collections"
              >
                <span className="project-header__stats-val">
                  {`${commafy(projectIds.length)} `}
                </span>
                {pluralize('Collection', projectIds.length)}
              </li>
              <li
                className="project-header__stats-item project-header__stats-item--size"
              >
                <span className="project-header__stats-val">
                  {`${totalProjectSize} `}
                </span>
                {totalUnit}

                <OverlayTrigger
                  container={this.component}
                  placement="right"
                  overlay={(
                    <Tooltip
                      className="tooltip--large tooltip--ta-left tooltip--wide"
                    >
                      This is the estimated overall size of your project. If no size
                      information exists in a granule&apos;s metadata, it will not be
                      included in this number. The size is estimated based upon the
                      first 20 granules added to your project from each collection.
                    </Tooltip>
                  )}
                >
                  <i className="fa fa-info-circle project-header__stats-icon" />
                </OverlayTrigger>
              </li>
            </>
          )}
        </ul>
      </header>
    )
  }
}

ProjectHeader.propTypes = {
  collections: PropTypes.shape({}).isRequired,
  project: PropTypes.shape({}).isRequired,
  savedProject: PropTypes.shape({}).isRequired,
  onUpdateProjectName: PropTypes.func.isRequired
}

export default ProjectHeader
