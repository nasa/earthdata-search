import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
import { stringify } from '../../util/url/url'
import { granuleTotalCount } from './skeleton'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'
import Skeleton from '../Skeleton/Skeleton'

import './GranuleResultsActions.scss'

const GranuleResultsActions = ({
  collectionId,
  granuleCount,
  initialLoading,
  isCollectionInProject,
  location,
  onAddProjectCollection,
  onRemoveCollectionFromProject
}) => {
  const addToProjectButton = (
    <Button
      className="granule-results-actions__proj-action granule-results-actions__proj-action--add"
      onClick={() => onAddProjectCollection(collectionId)}
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
      onClick={() => onRemoveCollectionFromProject(collectionId)}
      variant="link"
      bootstrapVariant="link"
      icon="times-circle"
      label="Remove collection from the current project"
      title="Remove collection from the current project"
    >
      Remove from project
    </Button>
  )

  const downloadAllButton = () => {
    const params = qs.parse(location.search, { ignoreQueryPrefix: true, parseArrays: false })
    let { p = '', pg = {} } = params

    // If the collection is not already in the project we need to add it to the project and update the url to represent that
    if (!isCollectionInProject) {
      // Append the p parameter that stores the collections in the project
      p = `${p}!${collectionId}`

      // While it won't yet be in the project, it will be the focused collection so we will grab that object
      const focusedCollection = pg[0]

      // We need to place the collection as the last collection in the project, get the number of collections in the project
      // so that we know what index to use
      const projectCollectionCount = Object.keys(pg).length

      // Move the object at the 0 index (focused collection) into the project by adding it to the end of the pg array (resulting
      // in a non 0 index)
      pg = {
        ...pg,
        0: {},
        [projectCollectionCount]: focusedCollection
      }
    }

    return (
      <PortalLinkContainer
        className="granule-results-actions__download-all"
        onClick={() => onAddProjectCollection(collectionId)}
        to={{
          pathname: '/projects',
          search: stringify({
            ...params,
            p,
            pg
          })
        }}
      >
        <Button
          className="granule-results-actions__download-all-button"
          badge={`${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`}
          bootstrapVariant="success"
          icon="download"
          variant="full"
          label="Download All"
          disabled={granuleCount === 0 || initialLoading}
        >
          Download All
        </Button>
      </PortalLinkContainer>
    )
  }

  // TODO: Implement maxOrderSizeReached modal that currently exists in master @critical

  const downloadButton = downloadAllButton()

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
              <span className="granule-results-actions__granule-count">
                <span className="granule-results-actions__granule-num">
                  {`${commafy(granuleCount)} `}
                </span>
                {`${pluralize('Granule', granuleCount)}`}
              </span>
            )
        }
        {
          isCollectionInProject && removeFromProjectButton
        }
        {
          !isCollectionInProject && addToProjectButton
        }
      </div>
      {downloadButton}
    </div>
  )
}

GranuleResultsActions.defaultProps = {
  granuleCount: 0
}

GranuleResultsActions.propTypes = {
  collectionId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number,
  initialLoading: PropTypes.bool.isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default GranuleResultsActions
