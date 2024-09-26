import React from 'react'
import PropTypes from 'prop-types'
import { startCase } from 'lodash-es'

import {
  Col,
  Container,
  Row,
  Table
} from 'react-bootstrap'

import Spinner from '../Spinner/Spinner'

import './AdminPreferencesMetricsList.scss'

/**
 * Creates the tables for all the preferences counts
 * @param {Object} preferences Object with the preferences with an array of the field value pairs
 * @returns preference tables
 */
const createPreferencesTable = (preferences) => {
  const wrapper = (children) => {
    const result = (
      <Container>
        <Row>
          {children.map((child) => (<Col key={child}>{child}</Col>))}
        </Row>
      </Container>
    )

    console.log(result)

    return result
  }

  const devideTables = (tables) => {
    const tableRows = [
      tables.slice(0, 3),
      tables.slice(3, 6),
      tables.slice(6, 9),
      tables.slice(9)
    ]

    return tableRows
  }

  const tables = Object.keys(preferences).map((key) => {
    const table = (
      <div key={key}>
        <h3 className="admin-preferences-metrics-list__table-title">
          Top
          {' '}
          <b>{startCase(key)}</b>
          {' '}
          Values
        </h3>
        <Table striped bordered>
          <thead key={`${key}_header`}>
            <tr className="admin-preferences-metrics-list__table-row" key={`${preferences[key]}_header`}>
              <th>Field</th>
              <th>Percent (Count)</th>
            </tr>
          </thead>
          <tbody>
            {
              // Pulling out the counts/percentages of each value
              // value[0] is the field and value[1] is the count
              Object.values(preferences[key]).map(([field, count]) => (
                <tr className="admin-preferences-metrics-list__table-body" key={`${preferences[key]}_body`}>
                  <td key={`${field}`}>{field}</td>
                  <td key={`${count}`}>{count}</td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    )

    return table
  })

  const devidedTables = devideTables(tables)

  const results = devidedTables.map((tablesList) => (wrapper(tablesList)))

  console.log(results)

  return (
    <div>
      {results}
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
          <Spinner dataTestId="admin-preferences-metric-list-spinner" className="admin-preferences-metrics-list__spinner" type="dots" />
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
