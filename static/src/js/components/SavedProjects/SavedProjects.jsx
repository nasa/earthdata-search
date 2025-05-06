import React from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import TimeAgo from 'react-timeago'
import { parse } from 'qs'
import { XCircled, Share } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { pluralize } from '../../util/pluralize'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import './SavedProjects.scss'

export const SavedProjects = (props) => {
  const {
    onDeleteSavedProject,
    savedProjects,
    savedProjectsIsLoading,
    savedProjectsIsLoaded,
    onChangePath
  } = props

  const handleDeleteSavedProject = (projectId) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this project? This action cannot be undone.')) {
      onDeleteSavedProject(projectId)
    }
  }

  /**
   * Determines the number of collections saved in the project path
   * @param {String} path Project path
   */
  const projectContents = (path) => {
    const search = path.split('?')[1]
    const { p = '' } = parse(search)

    // Subtract 1 for the focusedCollection
    const count = p.split('!').length - 1

    return `${count} ${pluralize('Collection', count)}`
  }

  /**
   * Returns the URL for a project
   * @param {String} path Path field saved in the project
   * @param {String} id The project Id
   */
  const projectTo = (path, id) => {
    const [pathname] = path.split('?')

    return `${pathname}?projectId=${id}`
  }

  const { edscHost } = getEnvironmentConfig()

  return (
    <div className="saved-projects">
      <h2 className="route-wrapper__page-heading">
        Saved Projects
      </h2>
      {
        (savedProjectsIsLoading && !savedProjectsIsLoaded) && (
          <Spinner
            className="saved-projects__spinner"
            type="dots"
            color="gray"
            size="small"
          />
        )
      }
      {
        savedProjectsIsLoaded && (
          savedProjects.length > 0 ? (
            <Table className="saved-projects-table">
              <thead>
                <tr>
                  <th className="saved-projects-table__project-name-heading">Project Name</th>
                  <th className="saved-projects-table__contents-heading">Contents</th>
                  <th className="saved-projects-table__created-heading">Created</th>
                  <th className="saved-projects-table__actions-heading">Actions</th>
                </tr>
              </thead>
              <tbody>
                {
                  savedProjects.map((project) => {
                    const {
                      created_at: createdAt,
                      id,
                      name,
                      path: projectPathValue
                    } = project

                    const projectName = !name ? 'Untitled Project' : name

                    const [pathname] = projectPathValue.split('?')
                    const sharePath = `${edscHost}${pathname}?projectId=${id}`
                    const finalProjectPath = projectTo(projectPathValue, id)

                    return (
                      <tr key={id}>
                        <td className="saved-projects-table__project-name">
                          <PortalLinkContainer
                            to={finalProjectPath}
                            onClick={() => { onChangePath(finalProjectPath) }}
                          >
                            {projectName}
                          </PortalLinkContainer>
                        </td>
                        <td className="saved-projects-table__contents">
                          {projectContents(projectPathValue)}
                        </td>
                        <td className="saved-projects-table__ago">
                          <TimeAgo date={createdAt} />
                        </td>
                        <td className="saved-projects-table__actions">
                          <div>
                            <OverlayTrigger
                              trigger="click"
                              placement="top"
                              overlay={
                                (
                                  <Popover
                                    id={`popover-basic-${id}`}
                                    className="saved-projects__share-popover"
                                  >
                                    <Popover.Header>
                                      Share Project
                                    </Popover.Header>
                                    <Popover.Body>
                                      <p>
                                        Share your project by copying the URL
                                        below and sending it to others.
                                      </p>
                                      <Form>
                                        <Form.Group className="mb-0">
                                          <Form.Control
                                            className="saved-projects__share-input"
                                            readOnly
                                            value={sharePath}
                                          />
                                        </Form.Group>
                                      </Form>
                                    </Popover.Body>
                                  </Popover>
                                )
                              }
                              rootClose
                            >
                              <Button
                                className="saved-projects__button saved-projects__button--share"
                                type="button"
                                label="Share project"
                                variant="naked"
                                icon={Share}
                              />
                            </OverlayTrigger>
                            <Button
                              type="button"
                              className="saved-projects__button saved-projects__button--remove"
                              label="Remove project"
                              variant="naked"
                              icon={XCircled}
                              onClick={() => handleDeleteSavedProject(id)}
                            />
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
          ) : (
            <p>No saved projects to display.</p>
          )
        )
      }
    </div>
  )
}

SavedProjects.defaultProps = {
  savedProjects: []
}

SavedProjects.propTypes = {
  savedProjects: PropTypes.arrayOf(
    PropTypes.shape({})
  ),
  savedProjectsIsLoading: PropTypes.bool.isRequired,
  savedProjectsIsLoaded: PropTypes.bool.isRequired,
  onChangePath: PropTypes.func.isRequired,
  onDeleteSavedProject: PropTypes.func.isRequired
}

export default SavedProjects
