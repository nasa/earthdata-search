import React from 'react'
import PropTypes from 'prop-types'

import { Col, Container, Row } from 'react-bootstrap'

import AdminRetrievalDetails from './AdminRetrievalDetails'

export const AdminRetrieval = ({
  onFetchAdminRetrieval
}) => (
  <Container>
    <Row>
      <Col>
        <AdminRetrievalDetails
          onFetchAdminRetrieval={onFetchAdminRetrieval}
        />
      </Col>
    </Row>
  </Container>
)

AdminRetrieval.propTypes = {
  onFetchAdminRetrieval: PropTypes.func.isRequired
}

export default AdminRetrieval
