import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  FaBell,
  FaFolder,
  FaFolderPlus,
  FaFolderMinus
} from 'react-icons/fa'
import { IoShare } from 'react-icons/io5'
import { Dropdown } from 'react-bootstrap'

import { commafy } from '../../util/commafy'
import { locationPropType } from '../../util/propTypes/location'

import AuthRequiredContainer from '../../containers/AuthRequiredContainer/AuthRequiredContainer'
import Button from '../Button/Button'
import GranuleDownloadButton from './GranuleDownloadButton'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import EDSCIcon from '../EDSCIcon/EDSCIcon'

import './GranuleResultsActions.scss'

/**
 * Renders GranuleResultsActions.
 * @param {String} focusedCollectionId - The collection ID.
 * @param {Number} granuleCount - The granule count.
 * @param {Number} granuleLimit - The granule limit.
 * @param {Boolean} initialLoading - Flag designating the inital loading state.
 * @param {Boolean} isCollectionInProject - Flag designating if the collection is in the project.
 * @param {Object} location - The location from the store.
 * @param {Function} onAddProjectCollection - Callback to add the collection from the project.
 * @param {Function} onChangePath - Callback to change the path.
 * @param {Function} onRemoveCollectionFromProject - Callback to remove the collection from the project.
 */
const GranuleResultsActions = ({
  addedGranuleIds,
  focusedCollectionId,
  focusedProjectCollection,
  granuleLimit,
  handoffLinks,
  initialLoading,
  isCollectionInProject,
  location,
  onAddProjectCollection,
  onChangePath,
  onRemoveCollectionFromProject,
  projectGranuleCount,
  removedGranuleIds,
  searchGranuleCount,
  subscriptions
}) => {
  const granuleResultsActionsContainer = useRef(null)

  const addToProjectButton = (
    <Button
      className="granule-results-actions__action granule-results-actions__action--add"
      onClick={() => onAddProjectCollection(focusedCollectionId)}
      icon={FaFolderPlus}
      label="Add collection to the current project"
      title="Add collection to the current project"
    >
      Add
    </Button>
  )

  const removeFromProjectButton = (
    <Button
      className="granule-results-actions__action granule-results-actions__action--remove"
      dataTestId="granule-results-actions__proj-action--remove"
      onClick={() => onRemoveCollectionFromProject(focusedCollectionId)}
      icon={FaFolderMinus}
      label="Remove collection from the current project"
      title="Remove collection from the current project"
    >
      Remove
    </Button>
  )

  // When the collection has yet to be added to a project the granule count
  // should reflect the search results
  const granuleCount = projectGranuleCount || searchGranuleCount

  const tooManyGranules = granuleLimit && granuleCount > granuleLimit

  // TODO: Implement maxOrderSizeReached modal that currently exists in master @critical
  let buttonText = 'Download All'

  if (
    isCollectionInProject
    && (addedGranuleIds.length || removedGranuleIds.length)
    && granuleCount > 0
  ) {
    buttonText = 'Download'
  }

  const badge = granuleCount === null
    ? undefined
    : (
      <>
        {
          projectGranuleCount > 0 && isCollectionInProject && (
            <EDSCIcon icon={FaFolder} className="granule-results-actions__project-pill-icon" />
          )
        }
        { commafy(granuleCount) }
      </>
    )

  const dropdownMenuClasses = classNames(
    'dropdown-menu--carat-bottom-left',
    'dropdown-menu--condensed'
  )

  const downloadButton = (
    <GranuleDownloadButton
      badge={badge}
      buttonText={buttonText}
      focusedCollectionId={focusedCollectionId}
      granuleCount={granuleCount}
      granuleLimit={granuleLimit}
      initialLoading={initialLoading}
      isCollectionInProject={isCollectionInProject}
      location={location}
      onAddProjectCollection={onAddProjectCollection}
      onChangePath={onChangePath}
      projectCollection={focusedProjectCollection}
      tooManyGranules={tooManyGranules}
    />
  )

  const subscriptionButtonClassnames = classNames([
    'granule-results-actions__action',
    'granule-results-actions__action--subscriptions',
    {
      'granule-results-actions__action--is-active': subscriptions.length > 0
    }
  ])

  return (
    <div ref={granuleResultsActionsContainer} className="granule-results-actions">
      <div className="granule-results-actions__secondary-actions">
        <div className="granule-results-actions__collection-actions">
          <PortalFeatureContainer authentication>
            <AuthRequiredContainer noRedirect>
              <PortalLinkContainer
                type="button"
                icon={FaBell}
                className={subscriptionButtonClassnames}
                dataTestId="granule-results-actions__subscriptions-button"
                label={subscriptions.length ? 'View or edit subscriptions' : 'Create subscription'}
                title={subscriptions.length ? 'View or edit subscriptions' : 'Create subscription'}
                badge={subscriptions.length ? `${subscriptions.length}` : false}
                naked
                to={{
                  pathname: '/search/granules/subscriptions',
                  search: location.search
                }}
              >
                Subscriptions
              </PortalLinkContainer>
            </AuthRequiredContainer>
          </PortalFeatureContainer>
          {
            handoffLinks.length > 0 && (
              <Dropdown
                drop="up"
                className="granule-results-actions__action granule-results-actions__action--explore"
              >
                <Dropdown.Toggle
                  as={Button}
                  type="button"
                  naked
                  icon={IoShare}
                  className="granule-results-actions__explore-button"
                  dataTestId="granule-results-actions__explore-button"
                  label="Explore"
                  title="Explore"
                >
                  Explore
                </Dropdown.Toggle>
                <Dropdown.Menu
                  className={dropdownMenuClasses}
                >
                  <Dropdown.Header>Open search in:</Dropdown.Header>
                  {
                    handoffLinks.map((link) => (
                      <Dropdown.Item
                        key={link.title}
                        className="link link--external more-actions-dropdown__item more-actions-dropdown__vis analytics__smart-handoff-link"
                        href={link.href}
                        target="_blank"
                      >
                        {link.title}
                      </Dropdown.Item>
                    ))
                  }
                </Dropdown.Menu>
              </Dropdown>
            )
          }
        </div>
        <PortalFeatureContainer authentication>
          <>
            {
              isCollectionInProject && !tooManyGranules && removeFromProjectButton
            }
            {
              !isCollectionInProject && !tooManyGranules && addToProjectButton
            }
          </>
        </PortalFeatureContainer>
      </div>
      <div className="granule-results-actions__primary-actions">
        <PortalFeatureContainer authentication>
          {downloadButton}
        </PortalFeatureContainer>
      </div>
    </div>
  )
}

GranuleResultsActions.defaultProps = {
  granuleLimit: undefined,
  handoffLinks: [],
  projectGranuleCount: 0,
  searchGranuleCount: 0
}

GranuleResultsActions.propTypes = {
  addedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedProjectCollection: PropTypes.shape({}).isRequired,
  granuleLimit: PropTypes.number,
  handoffLinks: PropTypes.arrayOf(PropTypes.shape({})),
  initialLoading: PropTypes.bool.isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  location: locationPropType.isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  projectGranuleCount: PropTypes.number,
  removedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchGranuleCount: PropTypes.number,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default GranuleResultsActions
