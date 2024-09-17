/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'

import { Table } from 'react-bootstrap'
import './AdminPreferencesMetricsList.scss'

/**
 * Retrieve the count from the passed value
 * @param {String} value String of percentage% (count)
 * @return {Integer} count
 */
const getCountValue = (value) => {
  const countRegex = /\((\d+)\)/g
  const count = countRegex.exec(value)

  // Pull out the count from the results of the regex query
  return count[1]
}

/**
 * Creates the tables for all the preferences counts
 * @param {Object} preferences Object with the preferences with an array of the field value pairs
 * @returns preference tables
 */
const createPreferencesTable = (preferences) => {
  const prefKeys = Object.keys(preferences)

  const tables = prefKeys.map((key) => {
    const prefEntries = Object.entries(preferences[key])
    // Sorts the entries by the counts/percentages not by fields
    prefEntries.sort((a, b) => (Number(getCountValue(b[1])) - Number(getCountValue(a[1]))))
    console.log(prefEntries)

    const header = (
      <thead key={`${key}_header`}>
        <tr className="admin-preferences-metrics-list__table-row" key={`${preferences[key]}_header`}>
          {
            // Pulling out the values (not the count)
            prefEntries.map((value) => (
              <th key={`${value[0]}}`}>{value[0]}</th>
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
            prefEntries.map(([field, count]) => (
              <td key={`${field}_${count}`}>{count}</td>
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
