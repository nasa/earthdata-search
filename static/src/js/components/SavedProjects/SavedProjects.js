import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Table,
  OverlayTrigger,
  Popover
} from 'react-bootstrap'
import TimeAgo from 'react-timeago'
import { parse } from 'qs'
import { FaShareSquare, FaTimesCircle } from 'react-icons/fa'

import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
import { pluralize } from '../../util/pluralize'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import './SavedProjects.scss'

export class SavedProjects extends Component {
  constructor() {
    super()

    this.handleDeleteSavedProject = this.handleDeleteSavedProject.bind(this)
  }

  handleDeleteSavedProject(projectId) {
    const { onDeleteSavedProject } = this.props
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this project? This action cannot be undone.')) {
      onDeleteSavedProject(projectId)
    }
  }

  /**
 * Determines the number of collections saved in the project path
 * @param {String} path Project path
 */
  projectContents(path) {
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
  projectTo(path, id) {
    const [pathname] = path.split('?')
    return `${pathname}?projectId=${id}`
  }

  render() {
    const {
      savedProjects,
      savedProjectsIsLoading,
      savedProjectsIsLoaded,
      onChangePath
    } = this.props

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
                        path
                      } = project

                      const projectName = !name ? 'Untitled Project' : name

                      const [pathname] = path.split('?')
                      const sharePath = `${edscHost}${pathname}?projectId=${id}`
                      const projectPath = this.projectTo(path, id)

                      return (
                        <tr key={id}>
                          <td className="saved-projects-table__project-name">
                            <PortalLinkContainer
                              to={projectPath}
                              onClick={() => { onChangePath(projectPath) }}
                            >
                              {projectName}
                            </PortalLinkContainer>
                          </td>
                          <td className="saved-projects-table__contents">
                            {this.projectContents(path)}
                          </td>
                          <td className="saved-projects-table__ago">
                            <TimeAgo date={createdAt} />
                          </td>
                          <td className="saved-projects-table__actions">
                            <div>
                              <OverlayTrigger
                                trigger="click"
                                placement="top"
                                overlay={(
                                  <Popover
                                    id={`popover-basic-${id}`}
                                    className="saved-projects__share-popover"
                                  >
                                    <Popover.Title>
                                      Share Project
                                    </Popover.Title>
                                    <Popover.Content>
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
                                    </Popover.Content>
                                  </Popover>
                                )}
                              >
                                <Button
                                  className="saved-projects__button saved-projects__button--share"
                                  type="button"
                                  label="Share project"
                                  variant="naked"
                                  icon={FaShareSquare}
                                />
                              </OverlayTrigger>
                              <Button
                                type="button"
                                className="saved-projects__button saved-projects__button--remove"
                                label="Remove project"
                                variant="naked"
                                icon={FaTimesCircle}
                                onClick={() => this.handleDeleteSavedProject(id)}
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
