import React from 'react'

import './SidebarHeader.scss'

const Header = () => (
  <header className="header">
    <h1 className="header__site-logo">
      <a
        className="header__site-name"
        href="/"
      >
        <span className="header__site-name-ent header__site-name-ent--e">Earthdata</span>
        <span className="header__site-name-ent header__site-name-ent--s">Search</span>
      </a>
      <span className="header__site-env">
        <i className="fa fa-bolt" />
        {' '}
        Serverless
      </span>
    </h1>
  </header>
)

export default Header
