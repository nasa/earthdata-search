import React from 'react'
import { useParams } from 'react-router-dom'
import { gql, useQuery } from '@apollo/client'
import { isEmpty } from 'lodash-es'
import { parse } from 'qs'

import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

import ADMIN_PROJECT from '../../operations/queries/adminProject'

import Spinner from '../Spinner/Spinner'
import DefinitionList from '../DefinitionList/DefinitionList'

import { type Project } from '../../types/sharedTypes'

/**
 * Admin Project GraphQL query result type
 */
interface AdminProjectQueryData {
  /** Admin project details returned from the API */
  adminProject: Project
}

export const AdminProjectDetails = () => {
  const { obfuscatedId } = useParams<{ obfuscatedId: string }>()
  const { data, loading } = useQuery<AdminProjectQueryData>(gql(ADMIN_PROJECT), {
    variables: {
      params: {
        obfuscatedId
      }
    }
  })

  if (loading || !data) {
    return (
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

  const { adminProject } = data
  const {
    name,
    path,
    user
  } = adminProject

  const { ursId } = user

  // Parse the query parameters from the path
  const [, queryParams] = path.split('?')
  const parsedPath = parse(queryParams)

  return (
    <div className="admin-project-details">
      <Row>
        <DefinitionList
          items={
            [
              [
                {
                  label: 'Name',
                  value: name || <span className="text-muted">Not provided</span>
                },
                {
                  label: 'Owner',
                  value: ursId
                },
                {
                  label: 'Obfuscated ID',
                  value: obfuscatedId
                }
              ],
              [
                {
                  label: 'Source Path',
                  value: <a className="text-wrap text-break" href={path} target="_blank" rel="noopener noreferrer">{path}</a>
                }
              ],
              [
                {
                  label: 'Parsed Path',
                  value: !isEmpty(parsedPath) ? <pre>{JSON.stringify(parsedPath, null, 2)}</pre> : 'N/A'
                }
              ]
            ]
          }
        />
      </Row>
    </div>
  )
}

export default AdminProjectDetails
