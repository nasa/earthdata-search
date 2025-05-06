import React, { useState, useEffect } from 'react'
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
import ProjectRequest from '../../util/request/projectRequest'
import { addToast } from '../../util/addToast'

import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import './SavedProjects.scss'

export const SavedProjects = (props) => {
  const {
    onChangePath,
    authToken,
    earthdataEnvironment
  } = props

  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)

  const { edscHost } = getEnvironmentConfig()

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true)
      setIsLoaded(false)
      setError(null)

      if (!authToken) {
        setIsLoading(false)
        setProjects([])

        return
      }

      const requestObject = new ProjectRequest(authToken, earthdataEnvironment)

      try {
        const response = await requestObject.all()
        setProjects(response.data)
        setIsLoaded(true)
      } catch (e) {
        console.error('Error fetching saved projects: ', e)
        setError(e)
        addToast('Error fetching saved projects. Please try again.', {
          appearance: 'error',
          autoDismiss: true
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [authToken, earthdataEnvironment])

  const handleDeleteSavedProject = async (projectId) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this project? This action cannot be undone.')) {
      const requestObject = new ProjectRequest(authToken, earthdataEnvironment)
      try {
        await requestObject.remove(projectId)
        setProjects((prevProjects) => prevProjects.filter((p) => p.id !== projectId))
        addToast('Project removed', {
          appearance: 'success',
          autoDismiss: true
        })
      } catch (e) {
        console.error('Error deleting project: ', e)
        addToast('Error deleting project. Please try again.', {
          appearance: 'error',
          autoDismiss: true
        })
      }
    }
  }

  /**
   * Determines the number of collections saved in the project path
   * @param {String} path Project path
   */
  const projectContents = (path) => {
    const search = path.split('?')[1]
    const { p = '' } = parse(search)
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

  if (error && !isLoading) {
    return (
      <div className="saved-projects">
        <h2 className="route-wrapper__page-heading">Saved Projects</h2>
        <p>There was an error loading your projects. Please try refreshing the page.</p>
      </div>
    )
  }

  return (
    <div className="saved-projects">
      <h2 className="route-wrapper__page-heading">
        Saved Projects
      </h2>
      {
        (isLoading && !isLoaded) && (
          <Spinner
            className="saved-projects__spinner"
            type="dots"
            color="gray"
            size="small"
          />
        )
      }
      {
        isLoaded && (
          projects.length > 0 ? (
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
                  projects.map((project) => {
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

SavedProjects.propTypes = {
  onChangePath: PropTypes.func.isRequired,
  authToken: PropTypes.string,
  earthdataEnvironment: PropTypes.string.isRequired
}

SavedProjects.defaultProps = {
  authToken: null
}

export default SavedProjects
