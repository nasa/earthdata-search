import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
import Table from 'react-bootstrap/Table'
import {
  FaCaretUp,
  FaCaretDown,
  FaFilter
} from 'react-icons/fa'
import { gql, useQuery } from '@apollo/client'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'

import ADMIN_PROJECTS from '../../operations/queries/adminProjects'

import EDSCIcon from '../EDSCIcon/EDSCIcon'
import Spinner from '../Spinner/Spinner'

import 'rc-pagination/assets/index.css'
import './AdminProjectsList.scss'

/**
 * Interface defining the structure of a project user
 */
interface ProjectUser {
  /** Unique identifier for the user */
  id: string
  /** URS username of the user */
  ursId: string
}

/**
 * Interface defining the structure of an admin project
 */
interface AdminProject {
  /** Unique identifier for the project */
  id: string
  /** Human-readable project name */
  name: string
  /** Obfuscated unique identifier for the project */
  obfuscatedId: string
  /** Source path or query string for the project */
  path: string
  /** User who owns the project */
  user: ProjectUser
  /** ISO timestamp when the project was updated */
  updatedAt: string
  /** ISO timestamp when the project was created */
  createdAt: string
}

/**
 * Admin Projects GraphQL query result type
 */
interface AdminProjectsQueryData {
  adminProjects: {
    /** Array of admin projects returned from the API */
    adminProjects: AdminProject[]
    /** Total count of projects matching the query */
    count: number
  }
}

const AdminProjectsList = () => {
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState<number>(1)
  const [searchType, setSearchType] = useState<string | undefined>('obfuscatedId')
  const [searchValue, setSearchValue] = useState<string>('')
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('')
  const [sortKey, setSortKey] = useState<string | undefined>(undefined)

  // Debounce the search value to avoid rapid requests
  useEffect(() => {
    const debounceHandler = setTimeout(() => {
      setDebouncedSearchValue(searchValue)
    }, 300)

    return () => {
      clearTimeout(debounceHandler)
    }
  }, [searchValue])

  const pageSize = 20

  const { data, error, loading } = useQuery<AdminProjectsQueryData>(gql(ADMIN_PROJECTS), {
    variables: {
      params: {
        limit: pageSize,
        offset: (currentPage - 1) * pageSize,
        obfuscatedId: searchType === 'obfuscatedId' && debouncedSearchValue ? debouncedSearchValue : undefined,
        ursId: searchType === 'ursId' && debouncedSearchValue ? debouncedSearchValue : undefined,
        sortKey
      }
    }
  })

  // Clear the search value
  const onClearSearchValueClick = useCallback(() => {
    setSearchValue('')
  }, [])

  // Handle clicks to sort by urs_id
  const onUrsIdSortClick = useCallback(() => {
    const sortKeyString = sortKey || ''

    if (sortKeyString.indexOf('urs_id') < 0) {
      setSortKey('-urs_id')
    }

    if (sortKeyString === '-urs_id') {
      setSortKey('+urs_id')
    }

    if (sortKeyString === '+urs_id') {
      setSortKey('')
    }
  }, [sortKey])

  // Handle clicks to sort by created_at
  const onCreatedAtSortClick = useCallback(() => {
    const sortKeyString = sortKey || ''

    if (sortKeyString.indexOf('created_at') < 0) {
      setSortKey('-created_at')
    }

    if (sortKeyString === '-created_at') {
      setSortKey('+created_at')
    }

    if (sortKeyString === '+created_at') {
      setSortKey('')
    }
  }, [sortKey])

  // Handle changes to the search type dropdown
  const onSearchTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(event.target.value)
  }, [])

  // Handle changes to the search filter input
  const onSearchFilterValueChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value)
  }, [])

  const { adminProjects: adminProjectsList } = data || {}
  const { adminProjects = [], count = 0 } = adminProjectsList || {}

  return (
    <>
      <Form>
        <InputGroup className="mb-3">
          <Form.Label
            column
            sm="auto"
            className="me-3"
          >
            <FaFilter />
            {' '}
            Filter:
          </Form.Label>
          <Form.Select
            value={searchType}
            onChange={onSearchTypeChange}
            className="me-3"
          >
            <option value="obfuscatedId">Obfuscated ID</option>
            <option value="ursId">URS ID</option>
          </Form.Select>
          <Form.Control
            className="me-3"
            placeholder="Type to filter projects..."
            value={searchValue}
            onChange={onSearchFilterValueChange}
          />
          <Button
            variant="light"
            onClick={() => onClearSearchValueClick()}
          >
            Clear
          </Button>
        </InputGroup>
      </Form>
      {
        loading && (
          <Row>
            <Col xs="auto" className="mx-auto m-5">
              <Spinner
                dataTestId="admin-preferences-metric-list-spinner"
                className="position-absolute admin-preferences-metrics-list__spinner"
                type="dots"
              />
            </Col>
          </Row>
        )
      }
      {
        !loading && !error && (
          <>
            <Table className="admin-projects-list__table" striped bordered>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Obfuscated ID</th>
                  <th
                    className="admin-projects-list__interactive  admin-projects-list__table-head-cell--sortable"
                    onClick={() => onUrsIdSortClick()}
                    role="button"
                  >
                    URS ID
                    {
                      sortKey === '+urs_id' && (
                        <EDSCIcon icon={FaCaretUp} className="admin-projects-list__sortable-icon" />
                      )
                    }
                    {
                      sortKey === '-urs_id' && (
                        <EDSCIcon icon={FaCaretDown} className="admin-projects-list__sortable-icon" />
                      )
                    }
                  </th>
                  <th
                    className="admin-projects-list__interactive admin-projects-list__table-head-cell--sortable"
                    onClick={() => onCreatedAtSortClick()}
                    role="button"
                  >
                    Created
                    {
                      sortKey === '+created_at' && (
                        <EDSCIcon icon={FaCaretUp} className="admin-projects-list__sortable-icon" />
                      )
                    }
                    {
                      sortKey === '-created_at' && (
                        <EDSCIcon icon={FaCaretDown} className="admin-projects-list__sortable-icon" />
                      )
                    }
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  adminProjects.map((project: AdminProject) => {
                    const {
                      id, obfuscatedId, createdAt, user
                    } = project
                    const { ursId } = user

                    return (
                      <tr
                        className="admin-projects-list__interactive"
                        key={obfuscatedId}
                        onClick={
                          () => {
                            navigate(`/admin/projects/${obfuscatedId}`)
                          }
                        }
                        role="button"
                      >
                        <td>
                          {id}
                        </td>
                        <td>
                          {obfuscatedId}
                        </td>
                        <td>{ursId}</td>
                        <td>{createdAt}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </Table>
            <div className="admin-projects-list__pagination-wrapper">
              <Pagination
                className="admin-projects-list__pagination"
                current={currentPage}
                total={count}
                pageSize={pageSize}
                onChange={setCurrentPage}
                locale={localeInfo}
              />
            </div>
          </>
        )
      }

    </>
  )
}

export default AdminProjectsList
