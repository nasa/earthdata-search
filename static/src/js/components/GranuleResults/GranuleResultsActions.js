import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  FaBell,
  FaFolder,
  FaFolderPlus,
  FaFolderMinus
} from 'react-icons/fa'

import { commafy } from '../../util/commafy'
import { granuleTotalCount } from './skeleton'
import { pluralize } from '../../util/pluralize'
import { locationPropType } from '../../util/propTypes/location'

import AuthRequiredContainer from '../../containers/AuthRequiredContainer/AuthRequiredContainer'
import Button from '../Button/Button'
import GranuleDownloadButton from './GranuleDownloadButton'
import Skeleton from '../Skeleton/Skeleton'
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
 * @param {Function} onSetActivePanelSection - Callback to set the active panel section on the project page.
 */
const GranuleResultsActions = ({
  addedGranuleIds,
  focusedCollectionId,
  focusedProjectCollection,
  granuleLimit,
  initialLoading,
  isCollectionInProject,
  location,
  onAddProjectCollection,
  onChangePath,
  onRemoveCollectionFromProject,
  onSetActivePanelSection,
  projectGranuleCount,
  removedGranuleIds,
  searchGranuleCount,
  subscriptions
}) => {
  const addToProjectButton = (
    <Button
      className="granule-results-actions__proj-action granule-results-actions__proj-action--add"
      onClick={() => onAddProjectCollection(focusedCollectionId)}
      icon={FaFolderPlus}
      label="Add collection to the current project"
      title="Add collection to the current project"
    />
  )

  const removeFromProjectButton = (
    <Button
      className="granule-results-actions__proj-action granule-results-actions__proj-action--remove"
      onClick={() => onRemoveCollectionFromProject(focusedCollectionId)}
      icon={FaFolderMinus}
      label="Remove collection from the current project"
      title="Remove collection from the current project"
    />
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

  const badge = granuleCount === null ? undefined : `${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`

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
    'granule-results-actions__subscriptions-button',
    {
      'granule-results-actions__subscriptions-button--is-subscribed': subscriptions.length > 0
    }
  ])

  return (
    <div className="granule-results-actions">
      <div className="granule-results-actions__info">
        {
          initialLoading
            ? (
              <Skeleton
                className="granule-results-actions__granule-count"
                shapes={granuleTotalCount}
                containerStyle={{
                  height: 21,
                  width: 126
                }}
              />
            ) : (
              <div className="granule-results-actions__granule-count-wrapper">
                <span className="granule-results-actions__granule-count">
                  <span className="granule-results-actions__granule-num">
                    {`${commafy(searchGranuleCount)} `}
                  </span>
                  {`${pluralize('Granule', searchGranuleCount)}`}
                </span>
                <PortalFeatureContainer authentication>
                  {
                    projectGranuleCount > 0 && isCollectionInProject && (
                      <PortalLinkContainer
                        type="button"
                        className="granule-results-actions__project-pill"
                        label="View granules in project"
                        onClick={() => {
                          onSetActivePanelSection('1')
                          onChangePath(`/projects${location.search}`)
                        }}
                        to={{
                          pathname: '/projects',
                          search: location.search
                        }}
                      >
                        <EDSCIcon icon={FaFolder} className="granule-results-actions__project-pill-icon" />
                        {
                          (!addedGranuleIds.length && !removedGranuleIds.length) && <span title="All granules in project">All Granules</span>
                        }
                        {
                          (projectGranuleCount > 0
                            && (addedGranuleIds.length > 0 || removedGranuleIds.length > 0)) && (
                            <span
                              title={`${commafy(granuleCount)} ${pluralize('granule', granuleCount)} in project`}
                            >
                              {`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
                            </span>
                          )
                        }
                      </PortalLinkContainer>
                    )
                  }
                </PortalFeatureContainer>
              </div>
            )
        }
        <div className="granule-results-actions__primary-actions">
          <PortalFeatureContainer authentication>
            <AuthRequiredContainer noRedirect>
              <PortalLinkContainer
                type="button"
                icon={FaBell}
                className={subscriptionButtonClassnames}
                label="View subscriptions"
                to={{
                  pathname: '/search/granules/subscriptions',
                  search: location.search
                }}
              />
            </AuthRequiredContainer>
          </PortalFeatureContainer>
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
      </div>
      <PortalFeatureContainer authentication>
        {downloadButton}
      </PortalFeatureContainer>
    </div>
  )
}

GranuleResultsActions.defaultProps = {
  projectGranuleCount: 0,
  searchGranuleCount: 0,
  granuleLimit: undefined
}

GranuleResultsActions.propTypes = {
  addedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  focusedProjectCollection: PropTypes.shape({}).isRequired,
  granuleLimit: PropTypes.number,
  initialLoading: PropTypes.bool.isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  location: locationPropType.isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired,
  projectGranuleCount: PropTypes.number,
  removedGranuleIds: PropTypes.arrayOf(PropTypes.string).isRequired,
  searchGranuleCount: PropTypes.number,
  subscriptions: PropTypes.arrayOf(PropTypes.shape({})).isRequired
}

export default GranuleResultsActions
