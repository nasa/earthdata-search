import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import Form from 'react-bootstrap/Form'
import {
  FaRegThumbsDown,
  FaRegThumbsUp,
  FaThumbsDown
} from 'react-icons/fa'

import Button from '../Button/Button'

import {
  NLP_FEEDBACK_CATEGORIES,
  type NlpFeedbackReasonField
} from '../../constants/nlpFeedbackCategories'

import CREATE_NLP_FEEDBACK from '../../operations/mutations/createNlpFeedback'
import UPDATE_NLP_FEEDBACK from '../../operations/mutations/updateNlpFeedback'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionsQuery } from '../../zustand/selectors/query'

import './SearchFormFeedback.scss'

const COMMENT_MAX_LENGTH = 500

const THANKS_MESSAGE_DURATION_MS = 5000

/**
 * Renders a "Did we understand your search?" prompt with thumbs up and thumbs down buttons.
 * Clicking thumbs down asks the user what went wrong, in two steps: first selectable reasons,
 * then an optional comment.
 */
const SearchFormFeedback: React.FC = () => {
  const collectionsQuery = useEdscStore(getCollectionsQuery)

  const {
    nlpRequestId,
    nlpQuery
  } = collectionsQuery

  // Kept separate from `isNegativeFormOpen` so the thumbs stay disabled even if the form is closed
  const [hasVotedNegative, setHasVotedNegative] = useState(false)
  const [isNegativeFormOpen, setIsNegativeFormOpen] = useState(false)
  const [selectedReasons, setSelectedReasons] = useState<NlpFeedbackReasonField[]>([])
  const [comment, setComment] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const [createNlpFeedback] = useMutation(CREATE_NLP_FEEDBACK)
  const [updateNlpFeedback] = useMutation(UPDATE_NLP_FEEDBACK)

  // Automatically hide the feedback component after a thank-you message is shown
  useEffect(() => {
    if (!isSubmitted) return undefined

    const hideTimeout = setTimeout(() => setIsHidden(true), THANKS_MESSAGE_DURATION_MS)

    return () => clearTimeout(hideTimeout)
  }, [isSubmitted])

  // Handle the skip button by marking the feedback as submitted without sending any data
  const onSkipFeedback = () => {
    setIsSubmitted(true)
  }

  // Handle the thumbs up button click by sending positive feedback
  const handleThumbsUpClick = () => {
    createNlpFeedback({
      variables: {
        nlpRequestId,
        nlpQuery,
        positive: true
      },
      onCompleted: () => {
        setIsSubmitted(true)
      }
    })
  }

  // Handle the thumbs down button click by sending negative feedback and opening the negative feedback form
  const handleThumbsDownClick = () => {
    createNlpFeedback({
      variables: {
        nlpRequestId,
        nlpQuery,
        positive: false
      },
      onCompleted: () => {
        setHasVotedNegative(true)
      }
    })

    setIsNegativeFormOpen(true)
  }

  // Handle the click on a reason by toggling its selection in the list of selected reasons
  const handleReasonClick = (reasonId: NlpFeedbackReasonField) => {
    setSelectedReasons((previousReasons) => (
      previousReasons.includes(reasonId)
        ? previousReasons.filter((id) => id !== reasonId)
        : [...previousReasons, reasonId]
    ))
  }

  // Handle the submission of the negative feedback form
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    updateNlpFeedback({
      variables: {
        comment,
        nlpRequestId,
        ...Object.fromEntries(
          NLP_FEEDBACK_CATEGORIES.map(({ field }) => [field, selectedReasons.includes(field)])
        )
      },
      onCompleted: () => {
        setIsSubmitted(true)
      }
    })
  }

  // Determine if the feedback form can be submitted based on selected reasons or comment content
  const canSubmit = selectedReasons.length > 0 || comment.trim().length > 0

  if (isHidden) return null

  // Once feedback is sent, the thank-you message replaces the prompt so the user can't vote again
  if (isSubmitted) {
    return (
      <div className="search-form-feedback">
        <p className="search-form-feedback__thanks" role="status">
          Thanks for your feedback!
        </p>
      </div>
    )
  }

  return (
    <div className="search-form-feedback">
      <div className="search-form-feedback__header">
        <span className="search-form-feedback__label">Did we understand your search?</span>
        <Button
          variant="naked"
          className="search-form-feedback__button search-form-feedback__button--up"
          icon={FaRegThumbsUp}
          iconSize="14"
          ariaLabel="Yes"
          tooltip="Yes"
          tooltipId="search-form-feedback--thumbs-up"
          onClick={handleThumbsUpClick}
          disabled={hasVotedNegative}
        />
        <Button
          variant="naked"
          className="search-form-feedback__button search-form-feedback__button--down"
          icon={hasVotedNegative ? FaThumbsDown : FaRegThumbsDown}
          iconSize="14"
          ariaLabel={hasVotedNegative ? 'No selected' : 'No'}
          tooltip="No"
          tooltipId="search-form-feedback--thumbs-down"
          onClick={handleThumbsDownClick}
          disabled={hasVotedNegative}
        />
      </div>

      {
        isNegativeFormOpen && (
          <Form className="search-form-feedback__form" onSubmit={handleSubmit}>
            <fieldset className="search-form-feedback__fieldset">
              <legend className="search-form-feedback__legend">What went wrong?</legend>
              <div className="search-form-feedback__reasons">
                {
                  NLP_FEEDBACK_CATEGORIES.map(({ field, option }) => {
                    const isSelected = selectedReasons.includes(field)

                    return (
                      <button
                        key={field}
                        type="button"
                        className={`search-form-feedback__reason${isSelected ? ' search-form-feedback__reason--selected' : ''}`}
                        aria-pressed={isSelected}
                        onClick={() => handleReasonClick(field)}
                      >
                        {option}
                      </button>
                    )
                  })
                }
              </div>
            </fieldset>

            <Form.Group controlId="search-form-feedback-comment">
              <Form.Label className="search-form-feedback__comment-label">
                Tell us more (optional)
              </Form.Label>
              <Form.Control
                as="textarea"
                className="search-form-feedback__comment"
                rows={3}
                maxLength={COMMENT_MAX_LENGTH}
                placeholder="What did you expect to find?"
                value={comment}
                onChange={
                  (event) => {
                    event.stopPropagation()
                    setComment(event.target.value)
                  }
                }
              />
              <Form.Text className="search-form-feedback__comment-count">
                {`${comment.length}/${COMMENT_MAX_LENGTH}`}
              </Form.Text>
            </Form.Group>
            <div className="search-form-feedback__actions">
              <Button
                bootstrapVariant="light"
                bootstrapSize="sm"
                label="Skip feedback"
                onClick={onSkipFeedback}
              >
                Skip
              </Button>
              <Button
                type="submit"
                bootstrapVariant="primary"
                bootstrapSize="sm"
                label="Submit feedback"
                disabled={!canSubmit}
              >
                Submit
              </Button>
            </div>
          </Form>
        )
      }
    </div>
  )
}

export default SearchFormFeedback
