import React from 'react'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Stack from 'react-bootstrap/Stack'
import AdminPage from '../AdminPage/AdminPage'
// @ts-expect-error: Types do not exist for this file
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import { routes } from '../../constants/routes'

const Admin = () => (
  <AdminPage
    pageTitle="Admin"
    breadcrumbs={
      [
        {
          name: 'Admin',
          active: true
        }
      ]
    }
  >
    <Row>
      <Col>
        <Stack direction="horizontal" gap={3}>
          <PortalLinkContainer
            type="button"
            bootstrapVariant="primary"
            to={routes.ADMIN_RETRIEVALS}
          >
            Retrievals
          </PortalLinkContainer>
          <PortalLinkContainer
            type="button"
            bootstrapVariant="primary"
            to={routes.ADMIN_PROJECTS}
          >
            Projects
          </PortalLinkContainer>
          <PortalLinkContainer
            type="button"
            bootstrapVariant="primary"
            to={routes.ADMIN_RETRIEVAL_METRICS}
          >
            Retrieval Metrics
          </PortalLinkContainer>
          <PortalLinkContainer
            type="button"
            bootstrapVariant="primary"
            to={routes.ADMIN_PREFERENCES_METRICS}
          >
            Preferences Metrics
          </PortalLinkContainer>
        </Stack>
      </Col>
    </Row>
  </AdminPage>
)

export default Admin
