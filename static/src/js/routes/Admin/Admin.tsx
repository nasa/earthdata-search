// @ts-expect-error This file does not have types
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

/**
 * The Admin route component
*/
const Admin = () => {
  return (
    <>
      <h2>Admin</h2>
      <PortalLinkContainer
        to="/admin/retrievals"
      >
        View Retrievals
      </PortalLinkContainer>
      {' '}
      |
      {' '}
      <PortalLinkContainer
        to="/admin/projects"
      >
        View Projects
      </PortalLinkContainer>
      |
      {' '}
      <PortalLinkContainer
        to="/admin/retrievals-metrics"
      >
        View Retrieval Metrics
      </PortalLinkContainer>
      |
      {' '}
      <PortalLinkContainer
        to="/admin/preferences-metrics"
      >
        View Preferences Metrics
      </PortalLinkContainer>
    </>
  )
}

export default Admin
