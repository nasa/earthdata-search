import React from 'react'
import { Outlet } from 'react-router-dom'

const DownloadsLayout = () => (
  <div className="route-wrapper route-wrapper--light route-wrapper--content-page">
    <div className="route-wrapper__content">
      <div className="route-wrapper__content-inner">
        <Outlet />
      </div>
    </div>
  </div>
)

export default DownloadsLayout
