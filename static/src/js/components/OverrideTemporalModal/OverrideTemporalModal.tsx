import React from 'react'
import Modal from 'react-bootstrap/Modal'

import Button from '../Button/Button'

import useEdscStore from '../../zustand/useEdscStore'

import './OverrideTemporalModal.scss'

// @ts-expect-error: Types do not exist for this file
import focusedImage from '../../../assets/images/blue-bars-circle.png?format=webp'
// @ts-expect-error: Types do not exist for this file
import temporalImage from '../../../assets/images/orange-bars-circle.png?format=webp'
import { getCollectionsQueryTemporal } from '../../zustand/selectors/query'

interface OverrideTemporalModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Function to toggle the override temporal modal */
  onToggleOverrideTemporalModal: (open: boolean) => void
}

const OverrideTemporalModal: React.FC<OverrideTemporalModalProps> = ({
  isOpen,
  onToggleOverrideTemporalModal
}) => {
  const changeQuery = useEdscStore((state) => state.query.changeQuery)
  const temporalQuery = useEdscStore(getCollectionsQueryTemporal)
  const timelineQuery = useEdscStore((state) => state.timeline.query)

  /**
   * Called when the modal closes, sets the modal as closed in the store
   */
  const onModalClose = () => {
    onToggleOverrideTemporalModal(false)
  }

  /**
   * Called when the user selects the focused date
   */
  const onFocusedClick = () => {
    const { end, start } = timelineQuery

    changeQuery({
      collection: {
        overrideTemporal: {
          endDate: !end ? undefined : new Date(end).toISOString(),
          startDate: !start ? undefined : new Date(start).toISOString()
        }
      }
    })

    onModalClose()
  }

  /**
   * Called when the user selects the temporal search
   */
  const onTemporalClick = () => {
    const { endDate, startDate } = temporalQuery

    changeQuery({
      collection: {
        overrideTemporal: {
          endDate,
          startDate
        }
      }
    })

    onModalClose()
  }

  return (
    <Modal
      dialogClassName="override-temporal-modal modal--has-inner-header"
      show={isOpen}
      onHide={onModalClose}
      centered
      size="lg"
      aria-labelledby="modal__override-temporal-modal"
    >
      <Modal.Header
        className="override-temporal-modal__header"
        closeButton
      >
        <Modal.Title
          id="modal__override-temporal-modal"
          className="override-temporal-modal__title"
        >
          What temporal selection would you like to use?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="override-temporal-modal__body">
        <p>
          Would you like to filter your download by the focused time span (blue lines)
          or your selected temporal constraint (orange lines)?
        </p>
        <div>
          <div className="choice choice-1">
            <img src={focusedImage} alt="Focused Time Span" />
          </div>
          <div className="choice choice-2">
            <img src={temporalImage} alt="Temporal Constraint" />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="override-temporal-modal__footer">
        <div className="override-temporal-modal__footer-actions">
          <div className="choice choice-1">
            <Button
              className="override-temporal-modal__action override-temporal-modal__action--focused"
              bootstrapVariant="primary"
              label="Use Focused Time Span"
              onClick={onFocusedClick}
            >
              Use Focused Time Span
            </Button>
          </div>
          <div className="choice choice-2">
            <Button
              className="override-temporal-modal__action override-temporal-modal__action--temporal"
              bootstrapVariant="primary"
              label="Use Temporal Constraint"
              onClick={onTemporalClick}
            >
              Use Temporal Constraint
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default OverrideTemporalModal
