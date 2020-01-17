import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

import { AdminPage } from '../AdminPage/AdminPage'
import { AdminRetrievalsList } from './AdminRetrievalsList'
import { AdminRetrievalsForm } from './AdminRetrievalsForm'

export const AdminRetrievals = ({
  historyPush,
  onAdminViewRetrieval,
  onUpdateAdminRetrievalsSortKey,
  onUpdateAdminRetrievalsPageNum,
  retrievals
}) => (
  <AdminPage
    pageTitle="Retrievals"
    breadcrumbs={[
      {
        name: 'Admin',
        href: '/admin'
      },
      {
        name: 'Retrievals',
        active: true
      }
    ]}
  >
    <Row className="justify-content-end mb-2">
      <Col sm="auto">
        <AdminRetrievalsForm
          onAdminViewRetrieval={onAdminViewRetrieval}
        />
      </Col>
    </Row>
    <Row>
      <Col>
        <AdminRetrievalsList
          historyPush={historyPush}
          onUpdateAdminRetrievalsSortKey={onUpdateAdminRetrievalsSortKey}
          onUpdateAdminRetrievalsPageNum={onUpdateAdminRetrievalsPageNum}
          retrievals={retrievals}
        />
      </Col>
    </Row>
  </AdminPage>
)

AdminRetrievals.defaultProps = {
  retrievals: {}
}

AdminRetrievals.propTypes = {
  historyPush: PropTypes.func.isRequired,
  onAdminViewRetrieval: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsPageNum: PropTypes.func.isRequired,
  retrievals: PropTypes.shape({})
}

export default AdminRetrievals
