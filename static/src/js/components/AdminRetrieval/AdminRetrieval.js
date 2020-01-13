import React from 'react'
import PropTypes from 'prop-types'

import { Col, Container, Row } from 'react-bootstrap'
import { AdminRetrievalDetails } from '../AdminRetrievalDetails/AdminRetrievalDetails'


export const AdminRetrieval = ({
  retrieval
}) => (
  <Container>
    <Row>
      <Col>
        <AdminRetrievalDetails
          retrieval={retrieval}
        />
      </Col>
    </Row>
  </Container>
)

AdminRetrieval.defaultProps = {
  retrieval: {}
}

AdminRetrieval.propTypes = {
  retrieval: PropTypes.shape({})
}

export default AdminRetrieval
