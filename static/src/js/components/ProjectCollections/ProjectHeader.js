/* eslint-disable jsx-a11y/img-redundant-alt */
import React, {
  memo,
  useEffect,
  useRef,
  useState
} from 'react'
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
 * @param {function} onUpdateProjectName - Function to updated the saved project name
 * @param {object} project - Project collections passed from redux store.
 * @param {object} savedProject - Saved Project information (name) passed from redux store
 */

export const ProjectHeader = memo(({
  onUpdateProjectName,
  project,
  savedProject
}) => {
  const projectTitleInput = useRef()
  const projectTitleText = useRef()

  const { name = '' } = savedProject
  const [isEditingName, setIsEditingName] = useState(false)
  const [projectName, setProjectName] = useState(name || 'Untitled Project')

  const renderInput = (() => {
    const input = projectTitleInput.current
    const text = projectTitleText.current

    input.style.width = `${text.getBoundingClientRect().width}px`
  })

  const focusTextField = (() => {
    projectTitleInput.current.focus()
  })

  const handleEditClick = (() => {
    setIsEditingName(true)
    focusTextField()
  })

  useEffect(() => {
    if (isEditingName) {
      focusTextField()
    }
    renderInput()
  }, [isEditingName])

  const handleNameSubmit = (() => {
    const newName = projectName || 'Untitled Project'
    setProjectName(newName)
    setIsEditingName(false)
    renderInput()
    onUpdateProjectName(projectName)
  })

  const handleKeypress = ((event) => {
    if (event.key === 'Enter') {
      handleNameSubmit()
      event.stopPropagation()
      event.preventDefault()
    }
  })

  const handleNameKeyPress = ((e) => {
    if (e.key === 'Enter') {
      handleEditClick()
    }
  })

  const handleOnFocus = (() => {
    setIsEditingName(true)
  })

  const onInputChange = ((event) => {
    setProjectName(event.target.value)
    renderInput()
  })

  const { collections: projectCollections } = project
  const {
    allIds: projectCollectionIds,
    byId: projectCollectionById
  } = projectCollections

  let totalGranules = 0
  let size = 0

  const granuleLoadingStates = []

  projectCollectionIds.forEach((collectionId) => {
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
                ref={projectTitleText}
                onClick={handleEditClick}
                role="button"
                tabIndex={0}
                data-testid="project-header__span"
                onKeyUp={handleNameKeyPress}
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
              onFocus={handleOnFocus}
              onChange={onInputChange}
              onKeyUp={handleKeypress}
              ref={projectTitleInput}
            />
          </div>
        </div>
        {
          isEditingName && (
            <button
              type="button"
              className="project-header__button project-header__button--submit"
              label="Submit project name"
              data-testid="submit_button"
              onClick={handleNameSubmit}
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
              data-testid="edit_button"
              onClick={handleEditClick}
            >
              <EDSCIcon icon={FaEdit} />
            </button>
          )
        }
      </div>
      {
        granuleLoadingStates.every((isLoaded) => isLoaded === true) ? (
          <ul className="project-header__stats-list">
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
          </ul>
        ) : (
          <Skeleton
            dataTestId="project-header__skeleton"
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
})

ProjectHeader.propTypes = {
  onUpdateProjectName: PropTypes.func.isRequired,
  project: PropTypes.shape({
    collections: PropTypes.shape({
      allIds: PropTypes.arrayOf(PropTypes.string),
      byId: PropTypes.shape({})
    })
  }).isRequired,
  savedProject: PropTypes.shape({
    name: PropTypes.string
  }).isRequired
}

export default ProjectHeader
