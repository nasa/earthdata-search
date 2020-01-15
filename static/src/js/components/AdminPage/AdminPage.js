import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

import './AdminPage.scss'

export const AdminPage = ({
  children,
  pageTitle,
  breadcrumbs
}) => (
  <div className="admin-page">
    <header className="admin-page__header">
      {
          breadcrumbs.length > 0 && (
            <ol className="breadcrumb admin-page__breadcrumbs">
              {
                breadcrumbs.map(({
                  active,
                  name,
                  href
                }) => (
                  <li
                    className={`breadcrumb-item ${active ? 'active' : ''}`}
                    key={name}
                  >
                    {
                        href
                          ? (
                            <Link to={href}>
                              {name}
                            </Link>
                          )
                          : name
                      }

                  </li>
                ))
              }
            </ol>
          )
        }
      <h2 className="admin-page__page-title">{pageTitle}</h2>
    </header>
    <div className="admin-page__body">
      {children}
    </div>
  </div>
)

AdminPage.defaultProps = {
  children: null,
  breadcrumbs: []
}

AdminPage.propTypes = {
  children: PropTypes.node,
  pageTitle: PropTypes.string.isRequired,
  breadcrumbs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      href: PropTypes.string,
      active: PropTypes.bool
    })
  )
}

export default AdminPage
