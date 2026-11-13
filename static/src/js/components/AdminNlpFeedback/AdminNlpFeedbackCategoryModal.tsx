import React, { useState } from 'react'
import { useQuery } from '@apollo/client'
import Pagination from 'rc-pagination'
import localeInfo from 'rc-pagination/lib/locale/en_US'
// @ts-expect-error This file does not have types
import { Copy } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'

import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Table from 'react-bootstrap/Table'

import { commafy } from '../../util/commafy'
// @ts-expect-error This file does not have types
import addToast from '../../util/addToast'

import ADMIN_NLP_FEEDBACK_CATEGORY from '../../operations/queries/adminNlpFeedbackCategory'

import Button from '../Button/Button'
import Spinner from '../Spinner/Spinner'

import useEdscStore from '../../zustand/useEdscStore'

import {
  NLP_FEEDBACK_CATEGORIES,
  type NlpFeedbackCategoryEnum,
  type NlpFeedbackReasonField
} from '../../constants/nlpFeedbackCategories'

import 'rc-pagination/assets/index.css'
import './AdminNlpFeedbackCategoryModal.scss'

/** A single NLP feedback entry returned by the AdminNlpFeedbackCategory query */
interface NlpFeedbackEntry extends Record<NlpFeedbackReasonField, boolean | null> {
  /** The ID of the NLP request associated with this feedback entry */
  nlpRequestId: string
  /** The NLP query associated with this feedback entry */
  nlpQuery: string
  /** The feedback text associated with this entry, if any */
  comment: string | null
}

interface AdminNlpFeedbackCategoryQueryData {
  /** The category to query for */
  adminNlpFeedbackCategory: {
    /** The list of NLP feedback entries for this category */
    adminNlpFeedback: NlpFeedbackEntry[]
    /** The total count of NLP feedback entries for this category */
    count: number
  }
}

/** The category the modal is displaying entries for */
export interface SelectedNlpFeedbackCategory {
  /** The NlpFeedbackCategory enum value to query */
  category: NlpFeedbackCategoryEnum
  /** The modal title */
  title: string
  /** Optional supporting text, e.g. the option text users selected */
  description?: string
}

interface AdminNlpFeedbackCategoryModalProps {
  /** The category to display entries for */
  category: SelectedNlpFeedbackCategory | null
  /** Human readable date range, displayed in the modal subtitle */
  displayRange: string
  /** End of the range, matching the report query */
  endDate: string
  /** Called when the modal is closed */
  onHide: () => void
  /** Whether the modal is visible */
  show: boolean
  /** Start of the range, matching the report query */
  startDate: string
}

const pageSize = 20

const copyRequestId = async (nlpRequestId: string) => {
  try {
    await navigator.clipboard.writeText(nlpRequestId)

    addToast('Copied the NLP Request ID', {
      appearance: 'success',
      autoDismiss: true
    })
  } catch {
    addToast('Could not copy the NLP Request ID', {
      appearance: 'error',
      autoDismiss: true
    })
  }
}

/** Modal that pages through the NLP feedback entries matching a single category */
const AdminNlpFeedbackCategoryModal: React.FC<AdminNlpFeedbackCategoryModalProps> = ({
  category,
  displayRange,
  endDate,
  onHide,
  show,
  startDate
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1)

  const handleError = useEdscStore((state) => state.errors.handleError)

  const { data, error, loading } = useQuery<AdminNlpFeedbackCategoryQueryData>(
    ADMIN_NLP_FEEDBACK_CATEGORY,
    {
      skip: !show || !category,
      variables: {
        startDate,
        endDate,
        category: category?.category,
        limit: pageSize,
        offset: (currentPage - 1) * pageSize
      },
      onError: (queryError) => {
        handleError({
          error: queryError,
          action: 'getAdminNlpFeedbackCategory',
          resource: 'adminNlpFeedbackCategory',
          verb: 'retrieving'
        })
      }
    }
  )

  const { adminNlpFeedback = [], count = 0 } = data?.adminNlpFeedbackCategory || {}

  const renderBody = () => {
    if (loading) {
      return (
        <Row>
          <Col xs="auto" className="mx-auto m-5">
            <Spinner
              dataTestId="admin-nlp-feedback-category-modal-spinner"
              type="dots"
            />
          </Col>
        </Row>
      )
    }

    if (error) return null

    if (adminNlpFeedback.length === 0) {
      return (
        <p className="admin-nlp-feedback-category-modal__empty">
          No feedback matched this category during this date range.
        </p>
      )
    }

    return (
      <>
        <Table className="admin-nlp-feedback-category-modal__table" striped bordered responsive>
          <thead>
            <tr>
              <th scope="col">Request ID</th>
              <th scope="col">Search Query</th>
              <th scope="col">Reasons</th>
              <th scope="col">Comment</th>
            </tr>
          </thead>
          <tbody>
            {
              adminNlpFeedback.map((entry) => {
                const { comment, nlpQuery, nlpRequestId } = entry

                const reasons = NLP_FEEDBACK_CATEGORIES.filter(({ field }) => entry[field])

                return (
                  <tr key={nlpRequestId}>
                    <td className="admin-nlp-feedback-category-modal__request-id">
                      <div className="admin-nlp-feedback-category-modal__request-id-content">
                        <span className="admin-nlp-feedback-category-modal__request-id-value">
                          {nlpRequestId}
                        </span>
                        <Button
                          className="admin-nlp-feedback-category-modal__copy"
                          variant="naked"
                          icon={Copy}
                          iconSize="14"
                          ariaLabel={`Copy NLP Request ID ${nlpRequestId}`}
                          tooltip="Copy to clipboard"
                          tooltipId={`admin-nlp-feedback-copy-${nlpRequestId}`}
                          onClick={() => copyRequestId(nlpRequestId)}
                        />
                      </div>
                    </td>
                    <td className="admin-nlp-feedback-category-modal__query">
                      {nlpQuery}
                    </td>
                    <td className="admin-nlp-feedback-category-modal__reasons">
                      {
                        reasons.length > 0
                          ? reasons.map(({ category: reasonCategory, name }) => (
                            <span
                              key={reasonCategory}
                              className="admin-nlp-feedback-category-modal__reason"
                            >
                              {name}
                            </span>
                          ))
                          : <span className="admin-nlp-feedback-category-modal__none">None</span>
                      }
                    </td>
                    <td className="admin-nlp-feedback-category-modal__comment">
                      {
                        comment?.trim()
                          ? comment
                          : <span className="admin-nlp-feedback-category-modal__none">No comment</span>
                      }
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </Table>
        <div className="admin-nlp-feedback-category-modal__pagination-wrapper">
          <Pagination
            className="admin-nlp-feedback-category-modal__pagination"
            current={currentPage}
            total={count}
            pageSize={pageSize}
            onChange={setCurrentPage}
            locale={localeInfo}
          />
        </div>
      </>
    )
  }

  return (
    <Modal
      dialogClassName="admin-nlp-feedback-category-modal"
      show={show}
      onHide={onHide}
      // Start back on the first page the next time the modal is opened
      onExited={() => setCurrentPage(1)}
      size="xl"
      scrollable
      aria-labelledby="admin-nlp-feedback-category-modal-title"
    >
      <Modal.Header closeButton>
        <div>
          <Modal.Title id="admin-nlp-feedback-category-modal-title">
            {category?.title}
          </Modal.Title>
          <p className="admin-nlp-feedback-category-modal__subtitle">
            {
              [
                category?.description,
                displayRange,
                data ? `${commafy(count)} ${count === 1 ? 'entry' : 'entries'}` : null
              ].filter(Boolean).join(' · ')
            }
          </p>
        </div>
      </Modal.Header>
      <Modal.Body>
        {renderBody()}
      </Modal.Body>
    </Modal>
  )
}

export default AdminNlpFeedbackCategoryModal
