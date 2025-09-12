import React from 'react'
import { Link } from 'react-router-dom'

import './AdminPage.scss'

interface Breadcrumb {
  /** The text of the breadcrumb */
  name: string
  /** The href of the breadcrumb */
  href?: string
  /** Whether or not the breadcrumb should appear as active */
  active?: boolean
}

interface AdminPageProps {
  /** The content to display inside the admin page. */
  children: React.ReactNode
  /** The title of the admin page. */
  pageTitle: string
  /** The breadcrumbs to display for navigation. */
  breadcrumbs?: Breadcrumb[]
}

const AdminPage: React.FC<AdminPageProps> = ({
  children = null,
  pageTitle,
  breadcrumbs = []
}) => (
  <div className="admin-page">
    <header className="admin-page__header">
      <nav aria-label="Breadcrumb">
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
                    aria-current={active ? 'page' : undefined}
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
      </nav>
      <h2 className="admin-page__page-title">{pageTitle}</h2>
    </header>
    <div className="admin-page__body">
      {children}
    </div>
  </div>
)

export default AdminPage
