import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import moment from 'moment'
import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'

import { useLazyQuery } from '@apollo/client'

import { routes } from '../../constants/routes'

import ADMIN_RETRIEVALS_METRICS from '../../operations/queries/adminRetrievalsMetrics'

import AdminPage from '../AdminPage/AdminPage'
import AdminRetrievalsMetricsList from './AdminRetrievalsMetricsList'

const AdminRetrievalsMetrics = () => {
  const [endDate, setEndDate] = useState('')
  const [startDate, setStartDate] = useState('')
  const [dateError, setDateError] = useState('')

  const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss'

  const [fetchMetrics, { error, data }] = useLazyQuery(ADMIN_RETRIEVALS_METRICS)

  if (error) {
    console.error('Error fetching Retrieval Metrics:', error)
  }

  const validateAndFormatDate = (date) => {
    const momentDate = moment(date, DATE_FORMAT, true)
    if (momentDate.isValid()) {
      return {
        formattedDate: momentDate.format(DATE_FORMAT),
        error: ''
      }
    }

    return {
      formattedDate: date,
      error: 'Invalid date format'
    }
  }

  const onApplyClick = () => {
    const startDateResult = startDate ? validateAndFormatDate(startDate) : ''
    const endDateResult = validateAndFormatDate(endDate)

    setStartDate(startDateResult.formattedDate)
    setEndDate(endDateResult.formattedDate)

    const newDateError = startDateResult.error || endDateResult.error
    setDateError(newDateError)

    if (!newDateError) {
      fetchMetrics({
        skip: newDateError,
        variables: {
          params: {
            startDate: startDateResult.formattedDate,
            endDate: endDateResult.formattedDate
          }
        }
      })
    }
  }

  const onClearClick = () => {
    setStartDate('')
    setEndDate('')
    setDateError('')
  }

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value)
  }

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value)
  }

  const disableButton = !endDate

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
                <Button onClick={onApplyClick} disabled={disableButton} className="me-2">
                  Apply
                </Button>
                <Button onClick={onClearClick} variant="secondary">
                  Clear
                </Button>
              </Col>
            </Form.Group>
          </Form>
        </Col>
      </Row>
      {
        (dateError && endDate) && (
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
        (data && endDate && !dateError) && (
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
