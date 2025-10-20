import React, {
  memo,
  useEffect,
  useRef,
  useState
} from 'react'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import abbreviate from 'number-abbreviate'
import classNames from 'classnames'
import { FaEdit } from 'react-icons/fa'
import { AlertInformation } from '@edsc/earthdata-react-icons/horizon-design-system/earthdata/ui'
import { Check } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { commafy } from '../../util/commafy'
import { convertSizeToMB, convertSize } from '../../util/project'
import { pluralize } from '../../util/pluralize'
import renderTooltip from '../../util/renderTooltip'

import { projectHeader } from './skeleton'

import Skeleton from '../Skeleton/Skeleton'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import useEdscStore from '../../zustand/useEdscStore'
import { getSavedProjectName } from '../../zustand/selectors/savedProject'

import './ProjectHeader.scss'

/**
 * Renders ProjectHeader.
 */

export const ProjectHeader = memo(() => {
  const setProjectName = useEdscStore((state) => state.savedProject.setProjectName)
  const projectName = useEdscStore(getSavedProjectName)

  const projectCollections = useEdscStore((state) => state.project.collections)
  const projectTitleInput = useRef()
  const projectTitleText = useRef()

  const [isEditingName, setIsEditingName] = useState(false)
  const [name, setName] = useState(projectName || 'Untitled Project')

  // Update projectName when name changes
  // This can happen when loading a project from the URL, after the response comes back from the API
  useEffect(() => {
    setName(projectName || 'Untitled Project')

    return () => {
      setTimeout(() => {}, 0)
    }
  }, [projectName])

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
    const newName = name || 'Untitled Project'
    setName(newName)
    setIsEditingName(false)
    renderInput()

    setProjectName(newName)
  })

  const handleKeypress = ((event) => {
    if (event.key === 'Enter') {
      handleNameSubmit()
      event.stopPropagation()
      event.preventDefault()
    }
  })

  const handleNameKeyPress = ((event) => {
    if (event.key === 'Enter') {
      handleEditClick()
      event.stopPropagation()
      event.preventDefault()
    }
  })

  const handleOnFocus = (() => {
    setIsEditingName(true)
  })

  const onInputChange = ((event) => {
    setName(event.target.value)
    renderInput()
  })

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
      count: granulesCount,
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
                onKeyDown={handleNameKeyPress}
              >
                {name}
              </span>
            </h2>
          </div>
          <div className="project-header__name-editing">
            <input
              className="project-header__title"
              name="projectName"
              value={name}
              onFocus={handleOnFocus}
              onChange={onInputChange}
              onKeyDown={handleKeypress}
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
              <EDSCIcon icon={Check} />
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
                overlay={
                  (tooltipProps) => renderTooltip({
                    children: 'This is the estimated overall size of your project. If no size information exists in a granule&apos;s metadata, it will not be included in this number. The size is estimated based upon the first 20 granules added to your project from each collection.',
                    className: 'tooltip--large tooltip--ta-left tooltip--wide',
                    ...tooltipProps
                  })
                }
              >
                <EDSCIcon icon={AlertInformation} className="project-header__stats-icon" />
              </OverlayTrigger>
            </li>
          </ul>
        ) : (
          <Skeleton
            containerStyle={
              {
                height: '21px',
                width: '100%'
              }
            }
            shapes={projectHeader}
          />
        )
      }

    </header>
  )
})

ProjectHeader.displayName = 'ProjectHeader'

export default ProjectHeader
