import React from 'react'
import { Col, Row, Stack } from 'react-bootstrap'
import AdminPage from '../../components/AdminPage/AdminPage'
// @ts-expect-error: Types do not exist for this file
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

const Admin = () => {
  return (
    <AdminPage
      pageTitle="Admin"
      breadcrumbs={[
        {
            name: 'Admin',
            active: true
          }
      ]}
    >
      <Row>
        <Col>
          <Stack direction="horizontal" gap={3}>
            <PortalLinkContainer
              type="button"
              bootstrapVariant="primary"
              to="/admin/retrievals"
            >
              Retrievals
            </PortalLinkContainer>
            <PortalLinkContainer
              type="button"
              bootstrapVariant="primary"
              to="/admin/projects"
            >
              Projects
            </PortalLinkContainer>
            <PortalLinkContainer
              type="button"
              bootstrapVariant="primary"
              to="/admin/retrievals-metrics"
            >
              Retrieval Metrics
            </PortalLinkContainer>
            <PortalLinkContainer
              type="button"
              bootstrapVariant="primary"
              to="/admin/preferences-metrics"
            >
              Preferences Metrics
            </PortalLinkContainer>
          </Stack>
        </Col>
      </Row>
    </AdminPage>
  )
}

export default Admin


