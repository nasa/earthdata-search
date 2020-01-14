import React from 'react'
import PropTypes from 'prop-types'

import { Col, Container, Row } from 'react-bootstrap'

import { AdminRetrievalsList } from './AdminRetrievalsList'
import { AdminRetrievalsForm } from './AdminRetrievalsForm'

export const AdminRetrievals = ({
  onAdminViewRetrieval,
  onUpdateAdminRetrievalsSortKey,
  onUpdateAdminRetrievalsPageNum,
  retrievals
}) => (
  <Container>
    <Row className="justify-content-end">
      <Col sm="auto">
        <AdminRetrievalsForm
          onAdminViewRetrieval={onAdminViewRetrieval}
        />
      </Col>
    </Row>
    <Row>
      <Col>
        <AdminRetrievalsList
          onUpdateAdminRetrievalsSortKey={onUpdateAdminRetrievalsSortKey}
          onUpdateAdminRetrievalsPageNum={onUpdateAdminRetrievalsPageNum}
          retrievals={retrievals}
        />
      </Col>
    </Row>
  </Container>
)

AdminRetrievals.defaultProps = {
  retrievals: []
}

AdminRetrievals.propTypes = {
  onAdminViewRetrieval: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsSortKey: PropTypes.func.isRequired,
  onUpdateAdminRetrievalsPageNum: PropTypes.func.isRequired,
  retrievals: PropTypes.shape({})
}

export default AdminRetrievals
