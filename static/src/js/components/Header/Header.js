import React from 'react'
import {
  Link,
  withRouter
} from 'react-router-dom'

import './Header.scss'

const Header = () => (
  <header className="header">
    <ul className="header__menu">
      <li className="header__menu-item">
        <h1 className="header__menu-title">
          <Link
            className="header__menu-link"
            to="/search"
          >
              CSW User Interface
          </Link>
        </h1>
      </li>
      <li className="header__menu-item">
        <Link
          className="header__menu-link"
          to="/additional-page"
        >
            Additional Page
        </Link>
      </li>
    </ul>
  </header>
)

export default withRouter(Header)
