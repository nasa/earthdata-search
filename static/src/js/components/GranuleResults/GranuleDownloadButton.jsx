import React from 'react'
import PropTypes from 'prop-types'
import { Download } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import { useLocation } from 'react-router-dom'
import { parse } from 'qs'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

import { getApplicationConfig, getEnvironmentConfig } from '../../../../../sharedUtils/config'

import { changePath } from '../../util/url/changePath'
import { commafy } from '../../util/commafy'
import { stringify } from '../../util/url/url'
import renderTooltip from '../../util/renderTooltip'

import Button from '../Button/Button'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import useEdscStore from '../../zustand/useEdscStore'
import { getEarthdataEnvironment } from '../../zustand/selectors/earthdataEnvironment'
import { getEdlToken } from '../../zustand/selectors/user'

import { routes } from '../../constants/routes'

export const GranuleDownloadButton = ({
  badge = null,
  buttonText,
  focusedCollectionId,
  granuleCount = 0,
  granuleLimit = undefined,
  initialLoading,
  isCollectionInProject,
  tooManyGranules
}) => {
  const location = useLocation()

  const edlToken = useEdscStore(getEdlToken)
  const addProjectCollection = useEdscStore((state) => state.project.addProjectCollection)
  const earthdataEnvironment = useEdscStore(getEarthdataEnvironment)

  const { disableDatabaseComponents } = getApplicationConfig()
  const { apiHost } = getEnvironmentConfig()

  if (tooManyGranules) {
    return (
      <OverlayTrigger
        placement="top"
        overlay={
          (tooltipProps) => renderTooltip({
            children: `Due to significant processing times, orders for this collection are limited to ${commafy(granuleLimit)} granules. Please narrow your search before downloading. Contact the data provider with questions. You can find contact information by clicking on the information icon.`,
            className: 'granule-results-actions__download-all-tooltip',
            id: 'tooltip__granule-results-actions__download-all-button',
            ...tooltipProps
          })
        }
      >
        <div>
          <Button
            className="granule-results-actions__download-all-button"
            dataTestId="granule-results-actions__download-all-button"
            badge={badge}
            bootstrapVariant="primary"
            icon={Download}
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

  const params = parse(location.search, {
    ignoreQueryPrefix: true,
    parseArrays: false
  })
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

  const stringifiedProjectParams = stringify({
    ...params,
    p,
    pg
  })

  const downloadButtonProps = {
    badge,
    bootstrapVariant: 'primary',
    className: 'granule-results-actions__download-all',
    dataTestId: 'granule-results-actions__download-all-button',
    disabled: granuleCount === 0 || initialLoading || disableDatabaseComponents === 'true',
    icon: Download,
    label: buttonText,
    type: 'button',
    variant: 'full'
  }

  if (!edlToken) {
    const projectPath = `${window.location.protocol}//${window.location.host}${routes.PROJECTS}${stringifiedProjectParams}`

    return (
      <PortalLinkContainer
        {...downloadButtonProps}
        onClick={
          () => {
            window.location.href = `${apiHost}/login?ee=${earthdataEnvironment}&state=${encodeURIComponent(projectPath)}`
          }
        }
      >
        {buttonText}
      </PortalLinkContainer>
    )
  }

  return (
    <PortalLinkContainer
      {...downloadButtonProps}
      onClick={
        () => {
          addProjectCollection(focusedCollectionId)
          changePath(`${routes.PROJECT}${stringifiedProjectParams}`)
        }
      }
      to={
        {
          pathname: routes.PROJECT,
          search: stringifiedProjectParams
        }
      }
    >
      {buttonText}
    </PortalLinkContainer>
  )
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
  projectCollection: PropTypes.shape({}).isRequired,
  tooManyGranules: PropTypes.bool.isRequired
}

export default GranuleDownloadButton
