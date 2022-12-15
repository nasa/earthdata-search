import React from 'react'
import PropTypes from 'prop-types'
import {
  Route,
  Switch
} from 'react-router-dom'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import { isDefaultPortal } from '../../util/portals'

import './AppLogo.scss'

const AppLogo = ({
  portal
}) => {
  const {
    portalId,
    logo = {},
    org,
    title
  } = portal

  let portalLink = '/'
  if (!isDefaultPortal(portalId)) {
    portalLink = `/portal/${portalId}/search`
  }

  const portalLogo = () => {
    if (!Object.keys(logo).length) return null

    const {
      id,
      image,
      link = portalLink,
      title: logoTitle
    } = logo

    return (
      <a
        id={id}
        className="app-logo__portal-logo"
        href={link}
        title={logoTitle}
      >
        {
          image && (
            <img src={image} alt={logoTitle} />
          )
        }
        <span className="visually-hidden">
          {logoTitle}
        </span>
      </a>
    )
  }

  return (
    <nav className="app-logo">
      <span className="app-logo__site-logo">
        <h1 className="mb-0">
          <a
            className="app-logo__site-meatball"
            href="/"
            title="Earthdata Search Home"
          >
            <span className="visually-hidden">
              Earthdata Search
            </span>
          </a>
        </h1>
        {portalLogo()}
        <a
          className="app-logo__site-name"
          href={portalLink}
        >
          <span className="app-logo__site-name-ent app-logo__site-name-ent--e">{org}</span>
          <span className="app-logo__site-name-ent app-logo__site-name-ent--s">{title}</span>
        </a>
      </span>
      <Switch>
        <Route path="/admin">
          <PortalLinkContainer
            className="app-logo__header-site-area-link"
            to="/admin"
          >
            <h2 className="app-logo__header-site-area-title">Admin</h2>
          </PortalLinkContainer>
        </Route>
      </Switch>
    </nav>
  )
}

AppLogo.propTypes = {
  portal: PropTypes.shape({
    logo: PropTypes.shape({}),
    org: PropTypes.string,
    portalId: PropTypes.string,
    title: PropTypes.string
  }).isRequired
}

export default AppLogo
