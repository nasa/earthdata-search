import React from 'react'
import PropTypes from 'prop-types'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import AdminPage from '../AdminPage/AdminPage'
import AdminProjectsList from './AdminProjectsList'
import AdminProjectsForm from './AdminProjectsForm'

const AdminProjects = ({
  onAdminViewProject,
  onUpdateAdminProjectsSortKey,
  onUpdateAdminProjectsPageNum,
  projects = {}
}) => (
  <AdminPage
    pageTitle="Projects"
    breadcrumbs={
      [
        {
          name: 'Admin',
          href: '/admin'
        },
        {
          name: 'Projects',
          active: true
        }
      ]
    }
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
          onUpdateAdminProjectsSortKey={onUpdateAdminProjectsSortKey}
          onUpdateAdminProjectsPageNum={onUpdateAdminProjectsPageNum}
          projects={projects}
        />
      </Col>
    </Row>
  </AdminPage>
)

AdminProjects.propTypes = {
  onAdminViewProject: PropTypes.func.isRequired,
  onUpdateAdminProjectsSortKey: PropTypes.func.isRequired,
  onUpdateAdminProjectsPageNum: PropTypes.func.isRequired,
  projects: PropTypes.shape({})
}

export default AdminProjects
