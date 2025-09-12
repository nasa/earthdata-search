import React from 'react'
import { startCase } from 'lodash-es'
import { gql, useQuery } from '@apollo/client'

import Table from 'react-bootstrap/Table'

import ADMIN_PREFERENCES_METRICS from '../../operations/queries/adminPreferencesMetrics'

import Spinner from '../Spinner/Spinner'

import './AdminPreferencesMetricsList.scss'

/**
 * Creates the tables for all the preferences counts
 * @param {Object} preferences Object with the preferences with an array of the field value pairs
 * @returns preference tables
 */
const createPreferencesTable = (preferences) => {
  // TODO We should not have to filter out the typename here if we do not map on the keys
  const tables = Object.keys(preferences).filter((key) => key !== '__typename').map((key) => {
    const header = (
      <thead key={`${key}_header`}>
        <tr key={`${preferences[key]}_header`}>
          {

            Object.values(preferences[key]).map(({ value }) => (
              <th key={`${value}}`}>{value}</th>
            ))
          }
        </tr>
      </thead>
    )
    const body = (
      <tbody>
        <tr key={`${preferences[key]}_body`}>
          {
            // Pulling out the counts/percentages of each value
            // value[0] is the field and value[1] is the count
            Object.values(preferences[key]).map(({ count, percentage, value }) => (
              <td key={`${value}_${count}`}>
                {count}
                {' '}
                (
                {percentage}
                %)
              </td>
            ))
          }
        </tr>
      </tbody>
    )

    return (
      <div key={key}>
        <h3>
          Top
          {' '}
          <b>{startCase(key)}</b>
          {' '}
          Values
        </h3>
        <Table striped bordered>
          {header}
          {body}
        </Table>
      </div>
    )
  })

  return (
    <div>
      {tables}
    </div>
  )
}

const AdminPreferencesMetricsList = () => {
  const { data, error, loading } = useQuery(gql(ADMIN_PREFERENCES_METRICS))

  return (
    <div>
      {
        loading && (
          <Spinner
            dataTestId="admin-preferences-metric-list-spinner"
            className="position-absolute admin-preferences-metrics-list__spinner"
            type="dots"
          />
        )
      }
      {!loading && !error && createPreferencesTable(data.adminPreferencesMetrics)}
    </div>
  )
}

export default AdminPreferencesMetricsList
