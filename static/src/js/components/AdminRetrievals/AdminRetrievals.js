import React from 'react'
import PropTypes from 'prop-types'

import { Col, Container, Row } from 'react-bootstrap'

import { AdminRetrievalsList } from './AdminRetrievalsList'
import { AdminRetrievalsForm } from './AdminRetrievalsForm'

export const AdminRetrevals = ({
  onAdminViewRetrieval,
  onFetchAdminRetrievals,
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
          onFetchAdminRetrievals={onFetchAdminRetrievals}
          retrievals={retrievals}
        />
      </Col>
    </Row>
  </Container>
)

AdminRetrevals.defaultProps = {
  retrievals: []
}

AdminRetrevals.propTypes = {
  onAdminViewRetrieval: PropTypes.func.isRequired,
  onFetchAdminRetrievals: PropTypes.func.isRequired,
  retrievals: PropTypes.arrayOf(
    PropTypes.shape({})
  )
}

export default AdminRetrevals
