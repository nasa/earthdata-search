import React from 'react'
import PropTypes from 'prop-types'
import queryString from 'query-string'

import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
import { stringify } from '../../util/url/url'

import Button from '../Button/Button'

import './GranuleResultsActions.scss'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

const GranuleResultsActions = ({
  collectionId,
  granuleCount,
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
    const params = queryString.parse(location.search)
    let { p = '' } = params
    if (p.split('!').indexOf(collectionId) < 1) p = `${p}!${collectionId}`

    return (
      <PortalLinkContainer
        className="granule-results-actions__download-all"
        onClick={() => onAddProjectCollection(collectionId)}
        to={{
          pathname: '/projects',
          search: stringify({
            ...params,
            p
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
        <span className="granule-results-actions__granule-count">
          <span className="granule-results-actions__granule-num">
            {`${commafy(granuleCount)} `}
          </span>
          {`${pluralize('Granule', granuleCount)}`}
        </span>
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
  isCollectionInProject: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onRemoveCollectionFromProject: PropTypes.func.isRequired
}

export default GranuleResultsActions
