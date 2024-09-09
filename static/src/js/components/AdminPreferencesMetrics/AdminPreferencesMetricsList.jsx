/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'

import { Table } from 'react-bootstrap'
import './AdminPreferencesMetricsList.scss'

const createPreferencesTable = (preferences) => {
  const tables = Object.keys(preferences).map((key) => {
    const header = (
      <thead key={`${key}_header`}>
        <tr className="admin-preferences-metrics-list__table-row" key={`${preferences[key]}_header`}>
          {
            Object.keys(preferences[key]).map((value) => (
              <th key={`${value}}`}>{value}</th>
            ))
          }
        </tr>
      </thead>
    )
    const body = (
      <tbody>
        <tr className="admin-preferences-metrics-list__table-body" key={`${preferences[key]}_body`}>
          {
            Object.keys(preferences[key]).map((value) => (
              <td key={`${value}_${preferences[key][value]}`}>{preferences[key][value]}</td>
            ))
          }
        </tr>
      </tbody>
    )

    return (
      <div key={key}>
        <h3 className="admin-preferences-metrics-list__table-title">
          Top 5
          {' '}
          {startCase(key)}
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
}) => (
  <div>{createPreferencesTable(metricsPreferences.preferences)}</div>
)

AdminPreferencesMetricsList.defaultProps = {
  metricsPreferences: {}
}

AdminPreferencesMetricsList.propTypes = {
  metricsPreferences: PropTypes.shape({})
}

export default AdminPreferencesMetricsList
