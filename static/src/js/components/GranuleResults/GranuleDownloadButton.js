import React from 'react'
import PropTypes from 'prop-types'
import { FaDownload } from 'react-icons/fa'

import { parse } from 'qs'
import { Tooltip, OverlayTrigger } from 'react-bootstrap'

import { commafy } from '../../util/commafy'
import { stringify } from '../../util/url/url'
import { locationPropType } from '../../util/propTypes/location'

import Button from '../Button/Button'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

export const GranuleDownloadButton = (props) => {
  const {
    badge,
    buttonText,
    focusedCollectionId,
    granuleCount,
    granuleLimit,
    initialLoading,
    isCollectionInProject,
    location,
    onAddProjectCollection,
    onChangePath,
    tooManyGranules
  } = props

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
            dataTestId="granule-results-actions__download-all-button"
            badge={badge}
            bootstrapVariant="secondary"
            icon={FaDownload}
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
    p = `${p}!${focusedCollectionId}`

    // While it won't yet be in the project, it will be the focused collection so we will grab that object
    const focusedCollection = pg[0]

    // We need to place the collection as the last collection in the project, get the number of collections in the project
    // so that we know what index to use
    let projectCollectionIndex = Object.keys(pg).length

    // If there are no pg parameters in the URL already, the index for the first collection needs to be 1, not 0
    if (projectCollectionIndex === 0) projectCollectionIndex = 1

    // Move the object at the 0 index (focused collection) into the project by adding it to the end of the pg array (resulting
    // in a non 0 index)
    pg = {
      ...pg,
      0: {},
      [projectCollectionIndex]: {
        ...focusedCollection,
        v: 't' // Set the new project collection visibility to true
      }
    }
  }

  return (
    <PortalLinkContainer
      className="granule-results-actions__download-all"
      onClick={() => {
        onAddProjectCollection(focusedCollectionId)
        onChangePath(`/projects${stringify({
          ...params,
          p,
          pg
        })}`)
      }}
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
        dataTestId="granule-results-actions__download-all-button"
        disabled={granuleCount === 0 || initialLoading}
        icon={FaDownload}
        label={buttonText}
        variant="full"
      >
        {buttonText}
      </Button>
    </PortalLinkContainer>
  )
}

GranuleDownloadButton.defaultProps = {
  badge: null,
  granuleCount: 0,
  granuleLimit: undefined
}

GranuleDownloadButton.propTypes = {
  badge: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node
  ]),
  buttonText: PropTypes.string.isRequired,
  focusedCollectionId: PropTypes.string.isRequired,
  granuleCount: PropTypes.number,
  granuleLimit: PropTypes.number,
  initialLoading: PropTypes.bool.isRequired,
  isCollectionInProject: PropTypes.bool.isRequired,
  location: locationPropType.isRequired,
  onAddProjectCollection: PropTypes.func.isRequired,
  onChangePath: PropTypes.func.isRequired,
  projectCollection: PropTypes.shape({}).isRequired,
  tooManyGranules: PropTypes.bool.isRequired
}

export default GranuleDownloadButton
