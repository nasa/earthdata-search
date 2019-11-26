import React from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

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
  granuleLimit,
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

  const tooManyGranules = granuleLimit && granuleCount > granuleLimit
  const downloadAllButton = () => {
    const badge = granuleCount === null ? undefined : `${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`

    if (tooManyGranules) {
      return (
        <OverlayTrigger
          placement="bottom"
          overlay={(
            <Tooltip
              id="tooltip__granule-results-actions__download-all-button"
              className="tooltip--large tooltip--ta-left tooltip--wide"
            >
              Due to significant processing times, orders for this collection are limited to
              {' '}
              {commafy(granuleLimit)}
              {' '}
              granules. Please narrow your search before downloading.
              Contact the data provider with questions.
              You can find contact information by clicking on the information icon.
            </Tooltip>
          )}
        >
          <div>
            <Button
              className="granule-results-actions__download-all-button"
              badge={badge}
              bootstrapVariant="secondary"
              icon="download"
              variant="full"
              label="Download All"
              disabled
              style={{ pointerEvents: 'none' }}
            >
              Download All
            </Button>
          </div>
        </OverlayTrigger>
      )
    }

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
          badge={badge}
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
          isCollectionInProject && !tooManyGranules && removeFromProjectButton
        }
        {
          !isCollectionInProject && !tooManyGranules && addToProjectButton
        }
      </div>
      {downloadButton}
    </div>
  )
}

GranuleResultsActions.defaultProps = {
  granuleCount: 0,
  granuleLimit: undefined
}

GranuleResultsActions.propTypes = {
  collectionId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number,
  granuleLimit: PropTypes.number,
  initialLoading: PropTypes.bool.isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default GranuleResultsActions
