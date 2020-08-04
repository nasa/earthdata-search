import React from 'react'
import PropTypes from 'prop-types'

import { commafy } from '../../util/commafy'
import { granuleTotalCount } from './skeleton'
import { pluralize } from '../../util/pluralize'

import Button from '../Button/Button'
import GranuleDownloadButton from './GranuleDownloadButton'
import ProjectCollectionContents from '../ProjectCollectionContents/ProjectCollectionContents'
import Skeleton from '../Skeleton/Skeleton'
import PortalFeatureContainer from '../../containers/PortalFeatureContainer/PortalFeatureContainer'

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
  focusedCollectionId,
  granuleCount,
  granuleLimit,
  initialLoading,
  isCollectionInProject,
  location,
  onAddProjectCollection,
  onChangePath,
  onRemoveCollectionFromProject,
  onSetActivePanelSection,
  focusedProjectCollection
}) => {
  const addToProjectButton = (
    <Button
      className="granule-results-actions__proj-action granule-results-actions__proj-action--add"
      onClick={() => onAddProjectCollection(focusedCollectionId)}
      variant="link"
      bootstrapVariant="link"
      icon="plus-circle"
      label="Add collection to the current project"
      title="Add collection to the current project"
    >
      Add to project
    </Button>
  )

  const removeFromProjectButton = (
    <Button
      className="granule-results-actions__proj-action granule-results-actions__proj-action--remove"
      onClick={() => onRemoveCollectionFromProject(focusedCollectionId)}
      variant="link"
      bootstrapVariant="link"
      icon="times-circle"
      label="Remove collection from the current project"
      title="Remove collection from the current project"
    >
      Remove from project
    </Button>
  )

  const tooManyGranules = granuleLimit && granuleCount > granuleLimit

  // TODO: Implement maxOrderSizeReached modal that currently exists in master @critical

  const downloadButton = (
    <GranuleDownloadButton
      focusedCollectionId={focusedCollectionId}
      projectCollection={focusedProjectCollection}
      granuleCount={granuleCount}
      granuleLimit={granuleLimit}
      initialLoading={initialLoading}
      isCollectionInProject={isCollectionInProject}
      location={location}
      onAddProjectCollection={onAddProjectCollection}
      tooManyGranules={tooManyGranules}
    />
  )

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
                    {`${commafy(granuleCount)} `}
                  </span>
                  {`${pluralize('Granule', granuleCount)}`}
                </span>
                <PortalFeatureContainer authentication>
                  {
                    isCollectionInProject && (
                      <ProjectCollectionContents
                        projectCollection={focusedProjectCollection}
                        onChangePath={onChangePath}
                        onSetActivePanelSection={onSetActivePanelSection}
                        location={location}
                      />
                    )
                  }
                </PortalFeatureContainer>
              </div>
            )
        }
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
      <PortalFeatureContainer authentication>
        {downloadButton}
      </PortalFeatureContainer>
    </div>
  )
}

GranuleResultsActions.defaultProps = {
  granuleCount: 0,
  granuleLimit: undefined
}

GranuleResultsActions.propTypes = {
  focusedCollectionId: PropTypes.string.isRequired,
  focusedProjectCollection: PropTypes.shape({}).isRequired,
  granuleCount: PropTypes.number,
  granuleLimit: PropTypes.number,
  initialLoading: PropTypes.bool.isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired,
  onSetActivePanelSection: PropTypes.func.isRequired
}

export default GranuleResultsActions
