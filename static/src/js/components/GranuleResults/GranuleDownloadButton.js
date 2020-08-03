import React from 'react'
import PropTypes from 'prop-types'

import { parse } from 'qs'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import { commafy } from '../../util/commafy'
import { pluralize } from '../../util/pluralize'
import { stringify } from '../../util/url/url'

import Button from '../Button/Button'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

export const GranuleDownloadButton = (props) => {
  const {
    collectionId,
    granuleCount: searchGranuleCount,
    granuleLimit,
    initialLoading,
    isCollectionInProject,
    location,
    onAddProjectCollection,
    projectCollection,
    tooManyGranules
  } = props

  const { granules: projectCollectionGranules = {} } = projectCollection
  const {
    hits: projectGranuleCount,
    addedGranuleIds,
    removedGranuleIds
  } = projectCollectionGranules

  // When the collection has yet to be added to a project the granule count
  // should reflect the search results
  const granuleCount = projectGranuleCount || searchGranuleCount

  let buttonText = 'Download All'

  const badge = granuleCount === null ? undefined : `${commafy(granuleCount)} ${pluralize('Granule', granuleCount)}`

  if (
    isCollectionInProject
    && (!addedGranuleIds.length && !removedGranuleIds.length)
    && granuleCount > 0
  ) {
    buttonText = 'Download'
  }

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
            label={buttonText}
            disabled
            style={{ pointerEvents: 'none' }}
          >
            {buttonText}
          </Button>
        </div>
      </OverlayTrigger>
    )
  }

  const params = parse(location.search, { ignoreQueryPrefix: true, parseArrays: false })
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
        badge={badge}
        bootstrapVariant="success"
        className="granule-results-actions__download-all-button"
        disabled={granuleCount === 0 || initialLoading}
        icon="download"
        label={buttonText}
        variant="full"
      >
        {buttonText}
      </Button>
    </PortalLinkContainer>
  )
}

GranuleDownloadButton.defaultProps = {
  granuleCount: 0,
  granuleLimit: undefined
}

GranuleDownloadButton.propTypes = {
  collectionId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number,
  granuleLimit: PropTypes.number,
  initialLoading: PropTypes.bool.isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  location: PropTypes.shape({}).isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  projectCollection: PropTypes.shape({}).isRequired,
  tooManyGranules: PropTypes.bool.isRequired
}

export default GranuleDownloadButton
