import React from 'react'
import PropTypes from 'prop-types'
import { sortBy } from 'lodash'
import {
  Row,
  Col
} from 'react-bootstrap'

import { locationPropType } from '../../util/propTypes/location'
import { availablePortals } from '../../../../../portals'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './PortalList.scss'

/**
 * Renders a list of portals.
 * @param {Object} props - The props passed into the component.
 * @param {Object} props.portals - The props passed into the component.
 */
export const PortalList = ({
  location,
  onModalClose
}) => {
  const sortedPortals = sortBy(availablePortals, (portal) => portal.title.primary)

  return (
    <Row className="portal-list">
      {
        sortedPortals.map((portal) => {
          const {
            // description,
            hasLogo,
            moreInfoUrl,
            portalBrowser = false,
            portalId,
            title
          } = portal

          if (!portalBrowser) return null

          const { primary, secondary } = title

          let imageSrc
          if (hasLogo) {
            // eslint-disable-next-line import/no-dynamic-require, global-require
            imageSrc = require(`../../../../../portals/${portalId}/images/logo.png`)
          }

          const newPathname = '/search'

          return (
            <Col className="d-flex" xs={6} key={portalId}>
              <PortalLinkContainer
                variant="naked"
                className="portal-list__item-link"
                type="button"
                label={`Visit ${primary} Portal`}
                newPortal={portal}
                to={{
                  pathname: newPathname,
                  search: location.search
                }}
                onClick={onModalClose}
                updatePath
                dataTestId={`portal-list-item-${portalId}`}
              >
                <div className="portal-list__item">
                  {
                    imageSrc && (
                      <div className="portal-list__item-logo">
                        <img
                          alt="portal"
                          src={imageSrc}
                          width="75"
                        />
                      </div>
                    )
                  }
                  <div className="portal-list__item-primary">
                    <div
                      className="portal-list__item-title"
                      data-testid={`portal-title-${portalId}`}
                    >
                      <span className="portal-list__item-title-primary">{primary}</span>
                      {
                        secondary && (
                          <span className="portal-list__item-title-secondary">
                            <span className="visually-hidden"> (</span>
                            {secondary}
                            <span className="visually-hidden">)</span>
                          </span>
                        )
                      }
                    </div>
                    {/* <div
                      className="portal-list__item-description"
                      data-testid={`portal-description-${portalId}`}
                    >
                      {description}
                    </div> */}
                    <div
                      className="portal-list__item-details-link"
                      data-testid={`portal-link-${portalId}`}
                    >
                      {
                        moreInfoUrl && (
                          <a
                            className="link link--external"
                            href={moreInfoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => {
                              event.stopPropagation()
                            }}
                          >
                            More Info
                          </a>
                        )
                      }
                    </div>
                  </div>
                </div>
              </PortalLinkContainer>
            </Col>
          )
        })
      }
    </Row>
  )
}

PortalList.propTypes = {
  location: locationPropType.isRequired,
  onModalClose: PropTypes.func.isRequired
}
