import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'

import { Table } from 'react-bootstrap'

import Spinner from '../Spinner/Spinner'

import './AdminPreferencesMetricsList.scss'

/**
 * Creates the tables for all the preferences counts
 * @param {Object} preferences Object with the preferences with an array of the field value pairs
 * @returns preference tables
 */
const createPreferencesTable = (preferences) => {
  const tables = Object.keys(preferences).map((key) => {
    const header = (
      <thead key={`${key}_header`}>
        <tr className="admin-preferences-metrics-list__table-row" key={`${preferences[key]}_header`}>
          {
            // Pulling out the values (not the count)
            Object.values(preferences[key]).map(([field, count]) => (
              <th aria-label={`${field} ${count} Header`} key={`${field}}`}>{field}</th>
            ))
          }
        </tr>
      </thead>
    )
    const body = (
      <tbody>
        <tr className="admin-preferences-metrics-list__table-body" key={`${preferences[key]}_body`}>
          {
            // Pulling out the counts/percentages of each value
            // value[0] is the field and value[1] is the count
            Object.values(preferences[key]).map(([field, count]) => (
              <td aria-label={`${field} ${count} Body`} key={`${field}_${count}`}>{count}</td>
            ))
          }
        </tr>
      </tbody>
    )

    return (
      <div key={key}>
        <h3 className="admin-preferences-metrics-list__table-title">
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

export const AdminPreferencesMetricsList = ({
  preferencesMetrics
}) => {
  const { preferences, isLoading, isLoaded } = preferencesMetrics

  console.log(isLoading)
  console.log(isLoaded)

  return (
    <div>
      {
        isLoading && (
          <div>
            abc
            <Spinner className="admin-preferences-metrics-list__spinner" type="dots" />
          </div>
        )
      }
      {isLoaded && createPreferencesTable(preferences)}
    </div>
  )
}

AdminPreferencesMetricsList.defaultProps = {
  preferencesMetrics: {
    preferences: {},
    isLoaded: false,
    isLoading: false
  }
}

AdminPreferencesMetricsList.propTypes = {
  preferencesMetrics: PropTypes.shape({
    preferences: PropTypes.shape({}),
    isLoaded: PropTypes.bool,
    isLoading: PropTypes.bool
  })
}

export default AdminPreferencesMetricsList
