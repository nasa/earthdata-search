import React from 'react'
import { Link } from 'react-router-dom'

import './SidebarHeader.scss'

const Header = () => (
  <header className="header">
    <h1 className="header__site-logo">
      <Link
        className="header__site-name"
        to="/search"
      >
        <span className="header__site-name-ent header__site-name-ent--e">Earthdata</span>
        <span className="header__site-name-ent header__site-name-ent--s">Search</span>
      </Link>
      <span className="header__site-env">
        <i className="fa fa-bolt" />
        {' '}
        Serverless
      </span>
    </h1>
  </header>
)

export default Header
