import React from 'react'
import {
  Card,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap'

import { type Portal } from './Home'
// @ts-expect-error: Types do not exist for this file
import { usePortalLogo } from '../../hooks/usePortalLogo'
// @ts-expect-error: Types do not exist for this file
import ExternalLink from '../../components/ExternalLink/ExternalLink'
// @ts-expect-error: Types do not exist for this file
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import './HomePortalCard.scss'

const HomePortalCard: React.FC<Portal> = (portal) => {
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
    <Card
      className="text-decoration-none"
      as={PortalLinkContainer}
      to="/search"
      newPortal={portal}
      updatePath
      naked
    >
      <Card.Body className="d-flex flex-column align-items-start justify-content-between gap-2">
        <header className="d-flex flex-column align-items-start gap-2">
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
        </header>
        {
          moreInfoUrl && (
            <footer>
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
                  >
                    More Info
                  </ExternalLink>
                </div>
              </OverlayTrigger>
            </footer>
          )
        }
      </Card.Body>
    </Card>
  )
}

export default HomePortalCard
