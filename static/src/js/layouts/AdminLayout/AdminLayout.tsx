import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { type Dispatch } from 'redux'
import { connect } from 'react-redux'

// @ts-expect-error The file does not have types
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

// @ts-expect-error The file does not have types
import actions from '../../actions'

const mapDispatchToProps = (dispatch: Dispatch) => ({
  onAdminIsAuthorized: () => dispatch(actions.adminIsAuthorized())
})

// @ts-expect-error Don't want to define types for all of Redux
const mapStateToProps = (state) => ({
  isAuthorized: state.admin.isAuthorized
})

/** An interface for the AdminLayout component props */
interface AdminLayoutProps {
  /** Whether the user is authorized to view the admin layout */
  isAuthorized: boolean
  /** Function to call when checking if the user is authorized */
  onAdminIsAuthorized: () => void
}

/** A layout component for admin pages */
export const AdminLayout: React.FC<AdminLayoutProps> = ({
  isAuthorized,
  onAdminIsAuthorized
}) => {
  useEffect(() => {
    onAdminIsAuthorized()
  }, [])

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

export default connect(mapStateToProps, mapDispatchToProps)(AdminLayout)
