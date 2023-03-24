import React from 'react'
import PropTypes from 'prop-types'
import { sortBy } from 'lodash'
import {
  Row,
  Col
} from 'react-bootstrap'
import { FaExternalLinkAlt } from 'react-icons/fa'

import { locationPropType } from '../../util/propTypes/location'

import EDSCIcon from '../EDSCIcon/EDSCIcon'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import { availablePortals } from '../../../../../portals'

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
            description,
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
            <Col xs={6} key={portalId}>
              <PortalLinkContainer
                variant="naked"
                className="portal-list__item"
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
                <div className="portal-list__item-contents">
                  {
                    imageSrc && (
                      <div className="portal-list__item-contents__logo">
                        <img
                          alt="portal"
                          src={imageSrc}
                          width="75"
                        />
                      </div>
                    )
                  }
                  <div className="portal-list__item-contents__details">
                    <div
                      className="portal-list__item-contents__details--title"
                      data-testid={`portal-title-${portalId}`}
                    >
                      <span className="primary-title">{primary}</span>
                      {
                        secondary && (
                          <span className="secondary-title">
                            (
                            {secondary}
                            )
                          </span>
                        )
                      }
                    </div>
                    <div
                      className="portal-list__item-contents__details--description"
                      data-testid={`portal-description-${portalId}`}
                    >
                      {description}
                    </div>
                    <div
                      className="portal-list__item-contents__details--link"
                      data-testid={`portal-link-${portalId}`}
                    >
                      {
                        moreInfoUrl && (
                          <a
                            href={moreInfoUrl}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(event) => {
                              event.stopPropagation()
                            }}
                          >
                            More Info
                            {' '}
                            <EDSCIcon icon={FaExternalLinkAlt} size="0.725rem" />
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
