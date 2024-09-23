import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'

import { Table } from 'react-bootstrap'
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
  metricsPreferences
}) => {
  const { preferences } = metricsPreferences

  return (
    <div>{createPreferencesTable(preferences)}</div>
  )
}

AdminPreferencesMetricsList.defaultProps = {
  metricsPreferences: {}
}

AdminPreferencesMetricsList.propTypes = {
  metricsPreferences: PropTypes.shape({
    preferences: PropTypes.shape({})
  })
}

export default AdminPreferencesMetricsList
