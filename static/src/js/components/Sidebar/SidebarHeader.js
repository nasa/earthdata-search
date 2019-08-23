import React from 'react'
import PropTypes from 'prop-types'

import './SidebarHeader.scss'

const Header = ({
  edscEnv,
  portal
}) => {
  const {
    portalId,
    logo,
    org = 'Earthdata',
    title = 'Search'
  } = portal

  let portalLink = '/'
  if (portalId.length > 0) portalLink = `/portal/${portalId}/search`

  const portalLogo = () => {
    if (!logo) return null

    const {
      id,
      image,
      link = portalLink,
      title: logoTitle
    } = logo

    return (
      <a
        id={id}
        className="sidebar-header__portal-logo"
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
    <header className="sidebar-header">
      <h1 className="sidebar-header__site-logo">
        <a
          className="sidebar-header__site-meatball"
          href="/"
          title="Earthdata Search Home"
        >
          <span className="visually-hidden">
            Earthdata Search Home
          </span>
        </a>

        {portalLogo()}

        <a
          className="sidebar-header__site-name"
          href={portalLink}
        >
          <span className="sidebar-header__site-name-ent sidebar-header__site-name-ent--e">{org}</span>
          <span className="sidebar-header__site-name-ent sidebar-header__site-name-ent--s">{title}</span>
        </a>
        <span className="sidebar-header__site-env">
          {edscEnv.toUpperCase()}
        </span>
      </h1>
    </header>
  )
}

Header.propTypes = {
  edscEnv: PropTypes.string.isRequired,
  portal: PropTypes.shape({}).isRequired
}

export default Header
