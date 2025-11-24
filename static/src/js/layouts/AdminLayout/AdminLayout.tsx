import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useQuery } from '@apollo/client'

import ADMIN_IS_AUTHORIZED from '../../operations/queries/adminIsAuthorized'

/** A layout component for admin pages */
const AdminLayout = () => {
  const { data, error } = useQuery(ADMIN_IS_AUTHORIZED)

  if (error) {
    return (
      <Navigate to="/" replace />
    )
  }

  const isAuthorized = data?.adminIsAuthorized

  if (!isAuthorized) return null

  return (
    <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
      <div className="route-wrapper__content">
        <div className="route-wrapper__content-inner">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
