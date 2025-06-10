import React from 'react'
import {
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'

// @ts-expect-error: Types do not exist for this file
import { usePortalLogo } from '../../hooks/usePortalLogo'
// @ts-expect-error: Types do not exist for this file
import ExternalLink from '../../components/ExternalLink/ExternalLink'
// @ts-expect-error: Types do not exist for this file
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import { type PortalConfig } from '../../types/sharedTypes'

import './HomePortalCard.scss'

const HomePortalCard: React.FC<PortalConfig> = (portal) => {
  const {
    portalId,
    title: {
      primary: title,
      secondary: subtitle
    },
    moreInfoUrl
  } = portal

  const portalLogoSrc = usePortalLogo(portalId)

  const displayTitle = `${title}${subtitle && ` (${subtitle})`}`

  return (
    <div className="d-flex position-relative">
      <Card
        className="w-100 text-decoration-none"
        as={PortalLinkContainer}
        to="/search"
        newPortal={portal}
        updatePath
        naked
      >
        <Card.Body className="d-flex flex-column align-items-start justify-content-between gap-2">
          <div className="home-portal-card__body-wrapper d-flex flex-column align-items-start gap-2">
            {
              portalLogoSrc && (
                <div className="home-portal-card__image-wrapper d-flex align-items-center justify-content-center flex-shrink-0 flex-grow-0 rounded-circle">
                  <img
                    className="home-portal-card__image flex-shrink-0 flex-grow-0 w-100 h-auto"
                    alt={`A logo for ${displayTitle}`}
                    src={portalLogoSrc}
                    width="56"
                    height="56"
                  />
                </div>
              )
            }
            <Card.Title as="h3" className="home-portal-card__title mb-0 h5">{title}</Card.Title>
            <Card.Subtitle className="home-portal-card__subtitle small">{subtitle}</Card.Subtitle>
          </div>
        </Card.Body>
      </Card>
      {
        moreInfoUrl && (
          <div className="position-absolute home-portal-card__footer">
            <OverlayTrigger
              overlay={<Tooltip id="more-info-tooltip">{`Find more information about ${title}`}</Tooltip>}
            >
              <div>
                <ExternalLink
                  className="small"
                  href={moreInfoUrl}
                  onClick={
                    (event: React.MouseEvent<HTMLAnchorElement>) => {
                      event.stopPropagation()
                    }
                  }
                  aria-label={`Find more information about ${title}${subtitle && ` (${subtitle})`}`}
                >
                  More Info
                </ExternalLink>
              </div>
            </OverlayTrigger>
          </div>
        )
      }
    </div>
  )
}

export default HomePortalCard
