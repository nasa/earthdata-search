import React, { useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import moment from 'moment'

import Button from 'react-bootstrap/Button'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'

import { routes } from '../../constants/routes'
import { commafy } from '../../util/commafy'

import ADMIN_NLP_FEEDBACK_REPORT from '../../operations/queries/adminNlpFeedbackReport'

import AdminPage from '../AdminPage/AdminPage'
import Spinner from '../Spinner/Spinner'
import AdminNlpFeedbackCategoryModal, {
  type SelectedNlpFeedbackCategory
} from './AdminNlpFeedbackCategoryModal'

import useEdscStore from '../../zustand/useEdscStore'

import { NLP_FEEDBACK_CATEGORIES } from '../../constants/nlpFeedbackCategories'

import './AdminNlpFeedback.scss'

const DATE_FORMAT = 'YYYY-MM-DD'
const DISPLAY_DATE_FORMAT = 'MMMM D, YYYY'

/** Counts returned by the AdminNlpFeedbackReport query */
interface NlpFeedbackReport {
  /** Total count of NLP feedback entries */
  totalCount: number
  /** Count of positive NLP feedback entries */
  positiveCount: number
  /** Count of negative NLP feedback entries */
  negativeCount: number
  /** Count of keyword NLP feedback entries */
  keywordCount: number
  /** Count of spatial NLP feedback entries */
  spatialCount: number
  /** Count of temporal NLP feedback entries */
  temporalCount: number
  /** Count of incomplete NLP feedback entries */
  incompleteCount: number
  /** Count of relevancy NLP feedback entries */
  relevancyCount: number
  /** Count of other NLP feedback entries */
  otherCount: number
  /** Count of free text NLP feedback entries */
  commentCount: number
}

interface AdminNlpFeedbackReportQueryData {
  /** Admin NLP feedback report data */
  adminNlpFeedbackReport: NlpFeedbackReport
}

/** The date range a report was generated for, captured at submit time */
interface ReportRange {
  /** The start date as entered, in YYYY-MM-DD format */
  startDate: string
  /** The end date as entered, in YYYY-MM-DD format */
  endDate: string
}

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 1
})

/** Returns `count` as a fraction of `total`, or 0 when there is nothing to divide by */
const ratio = (count: number, total: number) => (total > 0 ? count / total : 0)

const formatPercent = (count: number, total: number) => percentFormatter.format(ratio(count, total))

const formatDate = (date: string) => moment.utc(date, DATE_FORMAT, true).format(DISPLAY_DATE_FORMAT)

const isValidDate = (date: string) => moment(date, DATE_FORMAT, true).isValid()

/** Admin page that generates a printable summary of NLP search feedback */
const AdminNlpFeedback = () => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [dateError, setDateError] = useState('')
  const [reportRange, setReportRange] = useState<ReportRange | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<SelectedNlpFeedbackCategory | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const handleError = useEdscStore((state) => state.errors.handleError)

  const [fetchReport, { data, loading }] = useLazyQuery<AdminNlpFeedbackReportQueryData>(
    ADMIN_NLP_FEEDBACK_REPORT,
    {
      onError: (error) => {
        handleError({
          error,
          action: 'getAdminNlpFeedbackReport',
          resource: 'adminNlpFeedbackReport',
          verb: 'retrieving'
        })
      }
    }
  )

  const validateDates = () => {
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return `Dates must be valid and in the format ${DATE_FORMAT}`
    }

    if (moment(endDate, DATE_FORMAT).isBefore(moment(startDate, DATE_FORMAT))) {
      return 'End date must be on or after the start date'
    }

    return ''
  }

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const error = validateDates()
    setDateError(error)

    if (error) {
      setReportRange(null)

      return
    }

    setReportRange({
      startDate,
      endDate
    })

    fetchReport({
      variables: {
        startDate,
        endDate
      }
    })
  }

  const openCategoryModal = (category: SelectedNlpFeedbackCategory) => {
    setSelectedCategory(category)
    setShowCategoryModal(true)
  }

  const displayRange = reportRange
    ? `${formatDate(reportRange.startDate)} – ${formatDate(reportRange.endDate)} (UTC)`
    : ''

  const report = data?.adminNlpFeedbackReport

  const renderReport = () => {
    if (loading) {
      return (
        <Row>
          <Col xs="auto" className="mx-auto m-5">
            <Spinner
              dataTestId="admin-nlp-feedback-spinner"
              type="dots"
            />
          </Col>
        </Row>
      )
    }

    if (!report || !reportRange) return null

    const {
      totalCount,
      positiveCount,
      negativeCount,
      commentCount
    } = report

    return (
      <>
        <div className="admin-nlp-feedback__actions">
          <Button
            variant="light"
            onClick={
              () => {
                // Temporarily change the document title for printing
                const originalTitle = document.title
                document.title = `Earthdata Search NLP Report - ${reportRange.startDate} - ${reportRange.endDate}`

                window.print()

                document.title = originalTitle
              }
            }
          >
            Print / Save as PDF
          </Button>
        </div>

        <article className="admin-nlp-feedback__report" aria-labelledby="admin-nlp-feedback-report-title">
          <header className="admin-nlp-feedback__report-header">
            <p className="admin-nlp-feedback__report-eyebrow">Earthdata Search</p>
            <h3 id="admin-nlp-feedback-report-title" className="admin-nlp-feedback__report-title">
              Natural Language Search Feedback Report
            </h3>
            <p className="admin-nlp-feedback__report-range">
              {displayRange}
            </p>
          </header>

          {
            totalCount === 0
              ? (
                <p className="admin-nlp-feedback__empty">
                  No feedback was submitted during this date range.
                </p>
              )
              : (
                <>
                  <section className="admin-nlp-feedback__section" aria-label="Feedback summary">
                    <dl className="admin-nlp-feedback__stats">
                      <div className="admin-nlp-feedback__stat">
                        <dt className="admin-nlp-feedback__stat-label">Total feedback</dt>
                        <dd className="admin-nlp-feedback__stat-value">{commafy(totalCount)}</dd>
                        <dd className="admin-nlp-feedback__stat-meta">responses</dd>
                      </div>
                      <div className="admin-nlp-feedback__stat admin-nlp-feedback__stat--positive">
                        <dt className="admin-nlp-feedback__stat-label">Positive</dt>
                        <dd className="admin-nlp-feedback__stat-value">{commafy(positiveCount)}</dd>
                        <dd className="admin-nlp-feedback__stat-meta">
                          {`${formatPercent(positiveCount, totalCount)} of total`}
                        </dd>
                      </div>
                      <div className="admin-nlp-feedback__stat admin-nlp-feedback__stat--negative">
                        <dt className="admin-nlp-feedback__stat-label">Negative</dt>
                        <dd className="admin-nlp-feedback__stat-value">{commafy(negativeCount)}</dd>
                        <dd className="admin-nlp-feedback__stat-meta">
                          {`${formatPercent(negativeCount, totalCount)} of total`}
                        </dd>
                      </div>
                    </dl>
                  </section>

                  <section className="admin-nlp-feedback__section" aria-labelledby="admin-nlp-feedback-reasons-title">
                    <h4 id="admin-nlp-feedback-reasons-title" className="admin-nlp-feedback__section-title">
                      Reasons for negative feedback
                    </h4>
                    <p className="admin-nlp-feedback__section-description">
                      {`Share of the ${commafy(negativeCount)} negative responses that cited each reason.`}
                    </p>

                    <table className="admin-nlp-feedback__reasons">
                      <thead className="visually-hidden">
                        <tr>
                          <th scope="col">Reason</th>
                          <th scope="col">Chart</th>
                          <th scope="col">Percent of negative feedback</th>
                          <th scope="col">Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          NLP_FEEDBACK_CATEGORIES.map(({
                            category,
                            key,
                            name,
                            option
                          }) => {
                            const count = report[key]

                            return (
                              <tr key={key} className="admin-nlp-feedback__reason">
                                <th scope="row" className="admin-nlp-feedback__reason-label">
                                  <button
                                    type="button"
                                    className="admin-nlp-feedback__reason-name admin-nlp-feedback__drilldown"
                                    disabled={count === 0}
                                    title={count === 0 ? undefined : `View ${name.toLowerCase()} feedback`}
                                    onClick={
                                      () => openCategoryModal({
                                        category,
                                        title: `${name} Feedback`,
                                        description: `“${option}”`
                                      })
                                    }
                                  >
                                    {name}
                                  </button>
                                  <span className="admin-nlp-feedback__reason-option">{`“${option}”`}</span>
                                </th>
                                <td className="admin-nlp-feedback__reason-bar-cell" aria-hidden="true">
                                  <span className="admin-nlp-feedback__reason-bar">
                                    <span
                                      className="admin-nlp-feedback__reason-bar-fill"
                                      style={{ width: `${ratio(count, negativeCount) * 100}%` }}
                                    />
                                  </span>
                                </td>
                                <td className="admin-nlp-feedback__reason-percent">
                                  {formatPercent(count, negativeCount)}
                                </td>
                                <td className="admin-nlp-feedback__reason-count">
                                  {commafy(count)}
                                </td>
                              </tr>
                            )
                          })
                        }
                      </tbody>
                    </table>

                    <p className="admin-nlp-feedback__note">
                      Reasons are selected by users after giving negative feedback, and may
                      also be identified from their written comments. A single response can
                      cite no reasons, one reason, or multiple reasons, so percentages may
                      total less than or more than 100%.
                    </p>
                  </section>
                </>
              )
          }

          <footer className="admin-nlp-feedback__report-footer">
            <span>
              {'Written comments received: '}
              <button
                type="button"
                className="admin-nlp-feedback__drilldown admin-nlp-feedback__drilldown--count"
                disabled={commentCount === 0}
                aria-label={`View ${commafy(commentCount)} written comments`}
                title={commentCount === 0 ? undefined : 'View written comments'}
                onClick={
                  () => openCategoryModal({
                    category: 'COMMENT',
                    title: 'Written Comments'
                  })
                }
              >
                {commafy(commentCount)}
              </button>
            </span>
            <span>{`Generated ${moment().format(DISPLAY_DATE_FORMAT)}`}</span>
          </footer>
        </article>
      </>
    )
  }

  return (
    <AdminPage
      pageTitle="NLP Feedback"
      breadcrumbs={
        [
          {
            name: 'Admin',
            href: routes.ADMIN
          },
          {
            name: 'NLP Feedback',
            active: true
          }
        ]
      }
    >
      <Form className="admin-nlp-feedback__form" onSubmit={onSubmit} noValidate>
        <Row className="align-items-end g-3">
          <Form.Group as={Col} sm="auto" controlId="admin-nlp-feedback-start-date">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="text"
              placeholder={DATE_FORMAT}
              value={startDate}
              isInvalid={!!dateError}
              onChange={(event) => setStartDate(event.target.value)}
            />
          </Form.Group>
          <Form.Group as={Col} sm="auto" controlId="admin-nlp-feedback-end-date">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="text"
              placeholder={DATE_FORMAT}
              value={endDate}
              isInvalid={!!dateError}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </Form.Group>
          <Col sm="auto">
            <Button type="submit" disabled={!startDate || !endDate || loading}>
              Generate Report
            </Button>
          </Col>
        </Row>
        {
          dateError && (
            <Form.Text className="d-block text-danger mt-2" role="alert">
              {dateError}
            </Form.Text>
          )
        }
      </Form>

      {renderReport()}

      {
        reportRange && (
          <AdminNlpFeedbackCategoryModal
            show={showCategoryModal}
            onHide={() => setShowCategoryModal(false)}
            category={selectedCategory}
            displayRange={displayRange}
            startDate={reportRange.startDate}
            endDate={reportRange.endDate}
          />
        )
      }
    </AdminPage>
  )
}

export default AdminNlpFeedback
