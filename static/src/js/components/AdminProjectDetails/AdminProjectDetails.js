import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { isEmpty } from 'lodash'
import { parse } from 'qs'
import {
  Row,
  Col
} from 'react-bootstrap'

import './AdminProjectDetails.scss'

export const AdminProjectDetails = ({ project }) => {
  const {
    name,
    obfuscated_id: obfuscatedId,
    path = '',
    username
  } = project

  const [, queryParams] = path.split('?')

  const parsedPath = parse(queryParams)

  return (
    <div className="admin-project-details">
      <Row>
        <Col sm="auto">
          <Row className="admin-project-details__metadata-display mb-2">
            <Col className="admin-project-details__metadata-display-item">
              <span className="admin-project-details__metadata-display-heading">Name</span>
              <span className="admin-project-details__metadata-display-content">{name}</span>
            </Col>
            <Col className="admin-project-details__metadata-display-item">
              <span className="admin-project-details__metadata-display-heading">Owner</span>
              <span className="admin-project-details__metadata-display-content">{username}</span>
            </Col>
            <Col className="admin-project-details__metadata-display-item">
              <span className="admin-project-details__metadata-display-heading">Obfuscated ID</span>
              <span className="admin-project-details__metadata-display-content">{obfuscatedId}</span>
            </Col>
          </Row>
          <Row className="admin-project-details__metadata-display mb-2">
            <Col className="admin-project-details__metadata-display-item">
              <span className="admin-project-details__metadata-display-heading">Source Path</span>
              <a className="admin-project-details__metadata-display-content" href={path} target="_blank" rel="noopener noreferrer">
                {path}
              </a>
            </Col>
          </Row>
          <Row>
            {
              !isEmpty(parsedPath) && (
                <Col sm="auto">
                  <p className="admin-project-details__metadata-display-item">
                    <span className="admin-project-details__metadata-display-heading">Parsed Path</span>
                    <span className="admin-project-details__metadata-display-content admin-project-details__metadata-display-content__json">{JSON.stringify(parsedPath, null, 2)}</span>
                  </p>
                </Col>
              )
            }
          </Row>
        </Col>
      </Row>
    </div>
  )
}

AdminProjectDetails.defaultProps = {
  project: {}
}

AdminProjectDetails.propTypes = {
  project: PropTypes.shape({
    name: PropTypes.string,
    obfuscated_id: PropTypes.string,
    path: PropTypes.string,
    username: PropTypes.string
  })
}

export default withRouter(
  connect(null, null)(AdminProjectDetails)
)
