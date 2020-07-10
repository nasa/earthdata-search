import React from 'react'
import PropTypes from 'prop-types'

import './AppLogo.scss'

const AppLogo = ({
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
    <header className="app-logo">
      <h1 className="app-logo__site-logo">
        <a
          className="app-logo__site-meatball"
          href="/"
          title="Earthdata Search Home"
        >
          <span className="visually-hidden">
            Earthdata Search Home
          </span>
        </a>
        {portalLogo()}
        <a
          className="app-logo__site-name"
          href={portalLink}
        >
          <span className="app-logo__site-name-ent app-logo__site-name-ent--e">{org}</span>
          <span className="app-logo__site-name-ent app-logo__site-name-ent--s">{title}</span>
        </a>
      </h1>
    </header>
  )
}

AppLogo.propTypes = {
  portal: PropTypes.shape({}).isRequired
}

export default AppLogo
