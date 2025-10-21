import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
// @ts-expect-error This file does not have types
import TimeAgo from 'react-timeago'
import { parse } from 'qs'
// @ts-expect-error This file does not have types
import { XCircled, Share } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import {
  gql,
  useMutation,
  useQuery
} from '@apollo/client'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Pagination from 'rc-pagination'

// @ts-expect-error This file does not have types
import { getEnvironmentConfig } from '../../../../../sharedUtils/config'
// @ts-expect-error This file does not have types
import { pluralize } from '../../util/pluralize'
// @ts-expect-error This file does not have types
import addToast from '../../util/addToast'

// @ts-expect-error This file does not have types
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'
import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import DELETE_PROJECT from '../../operations/mutations/deleteProject'
import GET_PROJECTS from '../../operations/queries/getProjects'

import { type Project } from '../../types/sharedTypes'
import useEdscStore from '../../zustand/useEdscStore'

import 'rc-pagination/assets/index.css'
import './SavedProjects.scss'

const { edscHost } = getEnvironmentConfig()

/**
 * Determines the number of collections saved in the project path
 * @param {String} path Project path
 */
const projectContents = (path: string) => {
  const search = path.split('?')[1]
  const { p = '' } = parse(search)
  const collectionCount = (p as string).split('!').length - 1

  return `${collectionCount} ${pluralize('Collection', collectionCount)}`
}

interface ProjectsQueryData {
  projects: {
    /** Array of projects returned from the API */
    projects: Project[]
    /** Total count of projects matching the query */
    count: number
  }
}

/**
 * Renders a list of saved projects with pagination
 */
const SavedProjects: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const pageSize = 20

  const {
    data,
    error,
    loading,
    refetch
  } = useQuery<ProjectsQueryData>(gql(GET_PROJECTS), {
    variables: {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize
    }
  })

  const { projects: projectsList } = data || {}
  const { projects = [], count = 0 } = projectsList || {}

  const [deleteProjectMutation] = useMutation(gql(DELETE_PROJECT))

  const handleDeleteProject = (obfuscatedId: string) => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Are you sure you want to remove this project? This action cannot be undone.')) {
      deleteProjectMutation({
        variables: {
          obfuscatedId
        },
        onCompleted: () => {
          addToast('Project removed', {
            appearance: 'success',
            autoDismiss: true
          })

          refetch()
        },
        onError: (mutationError) => {
          useEdscStore.getState().errors.handleError({
            error: mutationError,
            action: 'handleDeleteSavedProject',
            resource: 'project',
            verb: 'deleting',
            notificationType: 'banner'
          })
        }
      })
    }
  }

  return (
    <div className="saved-projects">
      <h2 className="route-wrapper__page-heading">
        Saved Projects
      </h2>
      {
        loading && (
          <Spinner
            className="saved-projects__spinner"
            type="dots"
            color="gray"
            size="small"
          />
        )
      }
      {
        !loading && !error && (
          projects.length > 0 ? (
            <>
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
                        createdAt,
                        obfuscatedId,
                        name,
                        path: projectPathValue
                      } = project

                      const projectName = !name ? 'Untitled Project' : name

                      const [pathname] = projectPathValue.split('?')
                      const sharePath = `${edscHost}${pathname}?projectId=${obfuscatedId}`
                      const finalProjectPath = `${pathname}?projectId=${obfuscatedId}`

                      return (
                        <tr key={obfuscatedId}>
                          <td className="saved-projects-table__project-name">
                            <PortalLinkContainer
                              to={finalProjectPath}
                              updatePath
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
                                      id={`popover-basic-${obfuscatedId}`}
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
                                onClick={() => handleDeleteProject(obfuscatedId)}
                              />
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </Table>
              <div className="saved-projects__pagination-wrapper">
                <Pagination
                  className="saved-projects__pagination"
                  current={currentPage}
                  total={count}
                  pageSize={pageSize}
                  onChange={setCurrentPage}
                  locale={localeInfo}
                />
              </div>
            </>
          ) : (
            <p>No saved projects to display.</p>
          )
        )
      }
    </div>
  )
}

export default SavedProjects
