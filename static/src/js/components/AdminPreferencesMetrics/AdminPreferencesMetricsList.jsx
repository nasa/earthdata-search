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
        <tr key={`${preferences[key]}_header`}>
          {
            // Pulling out the values (not the count)
            Object.values(preferences[key]).map(([field]) => (
              <th key={`${field}}`}>{field}</th>
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
            Object.values(preferences[key]).map(([field, count]) => (
              <td key={`${field}_${count}`}>{count}</td>
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

export const AdminPreferencesMetricsList = ({
  preferencesMetrics
}) => {
  const { preferences, isLoading, isLoaded } = preferencesMetrics

  return (
    <div>
      {
        isLoading && (
          <Spinner
            dataTestId="admin-preferences-metric-list-spinner"
            className="position-absolute admin-preferences-metrics-list__spinner"
            type="dots"
          />
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
