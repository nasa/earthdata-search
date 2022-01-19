/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import abbreviate from 'number-abbreviate'
import classNames from 'classnames'
import { FaInfoCircle, FaCheck, FaEdit } from 'react-icons/fa'

import { commafy } from '../../util/commafy'
import { convertSizeToMB, convertSize } from '../../util/project'
import { pluralize } from '../../util/pluralize'
import { projectHeader } from './skeleton'

import Skeleton from '../Skeleton/Skeleton'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

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
      projectName: name || 'Untitled Project'
    }

    this.projectTitleInput = React.createRef()
    this.projectTitleText = React.createRef()

    this.onInputChange = this.onInputChange.bind(this)
    this.handleNameSubmit = this.handleNameSubmit.bind(this)
    this.handleEditClick = this.handleEditClick.bind(this)
    this.handleKeypress = this.handleKeypress.bind(this)
    this.handleOnFocus = this.handleOnFocus.bind(this)
    this.focusTextField = this.focusTextField.bind(this)
    this.handleNameKeyPress = this.handleNameKeyPress.bind(this)
  }

  componentDidMount() {
    this.renderInput()
  }

  componentWillReceiveProps(nextProps) {
    const { savedProject } = this.props
    const { name = '' } = savedProject

    const { savedProject: nextSavedProject } = nextProps
    const { name: nextName } = nextSavedProject
    if (name !== nextName) {
      this.setState({
        projectName: nextName
      },
      () => this.renderInput())
    }
  }

  handleNameSubmit() {
    const { onUpdateProjectName } = this.props
    const { projectName } = this.state

    const newName = projectName || 'Untitled Project'

    this.setState({
      projectName: newName,
      isEditingName: false
    },
    () => this.renderInput())

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
    this.setState({
      isEditingName: true
    }, () => this.focusTextField())
  }

  handleNameKeyPress(e) {
    if (e.key === 'Enter') {
      this.handleEditClick()
    }
  }

  handleOnFocus() {
    this.setState({ isEditingName: true })
  }

  onInputChange(event) {
    this.setState({
      projectName: event.target.value
    }, () => this.renderInput())
  }

  focusTextField() {
    this.projectTitleInput.current.focus()
  }

  renderInput() {
    const input = this.projectTitleInput.current
    const text = this.projectTitleText.current

    input.style.width = `${text.getBoundingClientRect().width}px`
  }

  render() {
    const { isEditingName, projectName } = this.state

    const {
      project
    } = this.props

    const { collections: projectCollections } = project

    const {
      allIds: projectCollectionIds,
      byId: projectCollectionById
    } = projectCollections

    let totalGranules = 0
    let size = 0

    const granuleLoadingStates = []

    projectCollectionIds.forEach((collectionId) => {
      // const collection = projectCollectionsMetadata[collectionId]
      // const { byId: collectionsQueryById } = collectionsQuery
      // const { [collectionId]: collectionQuery } = collectionsQueryById
      // const { granules: granuleQuery } = collectionQuery

      const { [collectionId]: projectCollection = {} } = projectCollectionById
      const { granules = {} } = projectCollection
      const {
        hits: granulesCount,
        isLoaded,
        singleGranuleSize
      } = granules

      granuleLoadingStates.push(isLoaded)

      totalGranules += granulesCount

      const granuleSize = granulesCount * singleGranuleSize

      const convertedSize = convertSizeToMB({
        size: granuleSize,
        unit: 'MB'
      })

      size += convertedSize
    })

    const totalSize = convertSize(size)

    const {
      size: totalProjectSize,
      unit: totalUnit
    } = totalSize

    const projectHeaderNameClasses = classNames([
      'project-header__name',
      {
        'project-header__name--is-editing': isEditingName
      }
    ])

    return (
      <header className="project-header">
        <div className={projectHeaderNameClasses}>
          <div className="project-header__name-wrap">
            <div className="project-header__name-saved">
              <h2 className="project-header__title">
                <span
                  className="project-header__text-wrap"
                  ref={this.projectTitleText}
                  onClick={this.handleEditClick}
                  role="button"
                  tabIndex={0}
                  onKeyPress={this.handleNameKeyPress}
                >
                  {projectName}
                </span>
              </h2>
            </div>
            <div className="project-header__name-editing">
              <input
                className="project-header__title"
                name="projectName"
                value={projectName}
                onFocus={this.handleOnFocus}
                onChange={this.onInputChange}
                onKeyPress={this.handleKeypress}
                ref={this.projectTitleInput}
              />
            </div>
          </div>
          {
            isEditingName && (
              <button
                type="button"
                className="project-header__button project-header__button--submit"
                label="Submit project name"
                onClick={this.handleNameSubmit}
              >
                <EDSCIcon icon={FaCheck} />
              </button>
            )
          }
          {
            !isEditingName && (
              <button
                type="button"
                className="project-header__button project-header__button--edit"
                label="Edit project name"
                onClick={this.handleEditClick}
              >
                <EDSCIcon icon={FaEdit} />
              </button>
            )
          }
        </div>
        {
          granuleLoadingStates.every((isLoaded) => isLoaded === true) ? (
            <ul className="project-header__stats-list">
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
                    {`${commafy(projectCollectionIds.length)} `}
                  </span>
                  {pluralize('Collection', projectCollectionIds.length)}
                </li>
                <li
                  className="project-header__stats-item project-header__stats-item--size"
                >
                  <span className="project-header__stats-val">
                    {`${totalProjectSize} `}
                  </span>
                  {totalUnit}

                  <OverlayTrigger
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
                    <EDSCIcon icon={FaInfoCircle} className="project-header__stats-icon" />
                  </OverlayTrigger>
                </li>
              </>
            </ul>
          ) : (
            <Skeleton
              containerStyle={{
                height: '21px',
                width: '100%'
              }}
              shapes={projectHeader}
            />
          )
        }

      </header>
    )
  }
}

ProjectHeader.propTypes = {
  collectionsQuery: PropTypes.shape({}).isRequired,
  onUpdateProjectName: PropTypes.func.isRequired,
  project: PropTypes.shape({
    collections: PropTypes.shape({})
  }).isRequired,
  savedProject: PropTypes.shape({
    name: PropTypes.string
  }).isRequired
}

export default ProjectHeader
