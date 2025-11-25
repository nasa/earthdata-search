import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import moment from 'moment'
import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'

import { useLazyQuery } from '@apollo/client'

import useEdscStore from '../../zustand/useEdscStore'

import { routes } from '../../constants/routes'

import ADMIN_RETRIEVALS_METRICS from '../../operations/queries/adminRetrievalsMetrics'

import AdminPage from '../AdminPage/AdminPage'
import AdminRetrievalsMetricsList from './AdminRetrievalsMetricsList'

const AdminRetrievalsMetrics = () => {
  const [endDate, setEndDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [hasFetched, setHasFetched] = useState(false)

  const handleError = useEdscStore((state) => state.errors.handleError)

  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

  const [fetchMetrics, { data }] = useLazyQuery(ADMIN_RETRIEVALS_METRICS, {
    onError: (error) => {
      handleError({
        error,
        action: 'getAdminRetrievalsMetrics',
        resource: 'adminRetrievalMetrics',
        verb: 'retrieving'
      })
    }
  })

  // Ensure the date entered is valid
  const validateDate = (date) => {
    const momentDate = moment(date, DATE_FORMAT, true)
    if (date && !momentDate.isValid()) {
      const invalidDate = 'Invalid date format'
      setDateError(invalidDate)

      return invalidDate
    }

    setDateError('')

    return null
  }

  // Check the dates are valid and if so, useLazyQuery to fetchMetrics on Apply Click
  const onApplyClick = (event) => {
    event.preventDefault()
    const newDateError = validateDate(startDate) || validateDate(endDate)

    if (!newDateError) {
      fetchMetrics({
        variables: {
          startDate,
          endDate
        }
      })

      setHasFetched(true)
    }
  }

  const onClearClick = () => {
    setStartDate('')
    setEndDate('')
    setDateError('')
    setHasFetched(false)
  }

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value)
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value)
  }

  const renderError = (dateError && endDate)
  const renderTable = (data && endDate && !dateError && hasFetched)

  return (
    <AdminPage
      pageTitle="Retrieval Metrics"
      breadcrumbs={
        [
          {
            name: 'Admin',
            href: routes.ADMIN
          },
          {
            name: 'Retrievals Metrics',
            active: true
          }
        ]
      }
    >
      <Row className="justify-content-end mb-5">
        <Col>
          <Form>
            <Form.Group as={Row} className="mb-3" controlId="formStartDate">
              <Form.Label column sm="2">
                Start Date:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder={DATE_FORMAT}
                  value={startDate}
                  onChange={handleStartDateChange}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="mb-3" controlId="formEndDate">
              <Form.Label column sm="2">
                End Date:
              </Form.Label>
              <Col sm="10">
                <Form.Control
                  type="text"
                  placeholder={DATE_FORMAT}
                  value={endDate}
                  onChange={handleEndDateChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Col sm={
                {
                  span: 10,
                  offset: 2
                }
              }
              >
                <Button onClick={onApplyClick} type="submit" disabled={!endDate} className="me-2">
                  Apply
                </Button>
                <Button onClick={onClearClick} variant="secondary" className="btn-light">
                  Clear
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      {
        renderError && (
          <Row className="mt-3">
            <Col sm={
              {
                span: 10,
                offset: 2
              }
            }
            >
              {dateError}
            </Col>
          </Row>
        )
      }
      {
        renderTable && (
          <Row>
            <Col>
              <AdminRetrievalsMetricsList retrievalsMetrics={data} />
            </Col>
          </Row>
        )
      }
    </AdminPage>
  )
}

export default AdminRetrievalsMetrics
