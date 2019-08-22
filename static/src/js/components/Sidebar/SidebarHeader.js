import React from 'react'
import PropTypes from 'prop-types'

import './SidebarHeader.scss'

const Header = ({ portal }) => {
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
        className="header__portal-logo"
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
    <header className="header">
      <h1 className="header__site-logo">
        <a
          className="header__site-meatball"
          href="/"
          title="Earthdata Search Home"
        >
          <span className="visually-hidden">
            Earthdata Search Home
          </span>
        </a>

        {portalLogo()}

        <a
          className="header__site-name"
          href={portalLink}
        >
          <span className="header__site-name-ent header__site-name-ent--e">{org}</span>
          <span className="header__site-name-ent header__site-name-ent--s">{title}</span>
        </a>
        <span className="header__site-env">
          <i className="fa fa-bolt" />
          {' '}
          Serverless
        </span>
      </h1>
    </header>
  )
}

Header.propTypes = {
  portal: PropTypes.shape({}).isRequired
}

export default Header
