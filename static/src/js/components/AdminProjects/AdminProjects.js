import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col } from 'react-bootstrap'

import { AdminPage } from '../AdminPage/AdminPage'
import { AdminProjectsList } from './AdminProjectsList'
import { AdminProjectsForm } from './AdminProjectsForm'

export const AdminProjects = ({
  historyPush,
  onAdminViewProject,
  onUpdateAdminProjectsSortKey,
  onUpdateAdminProjectsPageNum,
  projects
}) => (
  <AdminPage
    pageTitle="Projects"
    breadcrumbs={[
      {
        name: 'Admin',
        href: '/admin'
      },
      {
        name: 'Projects',
        active: true
      }
    ]}
  >
    <Row className="justify-content-end mb-2">
      <Col sm="auto">
        <AdminProjectsForm
          onAdminViewProject={onAdminViewProject}
        />
      </Col>
    </Row>
    <Row>
      <Col>
        <AdminProjectsList
          historyPush={historyPush}
          onUpdateAdminProjectsSortKey={onUpdateAdminProjectsSortKey}
          onUpdateAdminProjectsPageNum={onUpdateAdminProjectsPageNum}
          projects={projects}
        />
      </Col>
    </Row>
  </AdminPage>
)

AdminProjects.defaultProps = {
  projects: {}
}

AdminProjects.propTypes = {
  historyPush: PropTypes.func.isRequired,
  onAdminViewProject: PropTypes.func.isRequired,
  onUpdateAdminProjectsSortKey: PropTypes.func.isRequired,
  onUpdateAdminProjectsPageNum: PropTypes.func.isRequired,
  projects: PropTypes.shape({})
}

export default AdminProjects
