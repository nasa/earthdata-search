import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import PropTypes from 'prop-types'
import Form from 'react-bootstrap/Form'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'
import useEdscStore from '../../zustand/useEdscStore'
import { getFocusedCollectionSubscriptions } from '../../zustand/selectors/collection'
import {
  isModalOpen,
  openModalData,
  setOpenModalFunction
} from '../../zustand/selectors/ui'
import { MODAL_NAMES } from '../../constants/modalNames'

const EditSubscriptionModal = ({
  onUpdateSubscription,
  subscriptions
}) => {
  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.EDIT_SUBSCRIPTION))
  const setOpenModal = useEdscStore(setOpenModalFunction)
  const modalData = useEdscStore(openModalData)
  const granuleSubscriptions = useEdscStore(getFocusedCollectionSubscriptions)

  const {
    subscriptionConceptId,
    subscriptionType
  } = modalData

  const [subscription, setSubscription] = useState({
    name: '',
    nativeId: '',
    conceptId: ''
  })
  const [shouldUpdateQuery, setShouldUpdateQuery] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Memoize the currently selected subscription based on props
  const selectedSubscriptionFromProps = useMemo(() => {
    if (!subscriptionConceptId) return {}

    if (subscriptionType === 'granule') {
      return (
        granuleSubscriptions.find(
          (subscriptionObject) => subscriptionObject.conceptId === subscriptionConceptId
        ) || {}
      )
    }

    const { byId: subscriptionsById = {} } = subscriptions || {}

    return subscriptionsById[subscriptionConceptId] || {}
  }, [
    granuleSubscriptions,
    subscriptionConceptId,
    subscriptionType,
    subscriptions
  ])

  // Mirror getDerivedStateFromProps: only update when the conceptId changes
  useEffect(() => {
    const currentConceptId = subscription?.conceptId
    const nextConceptId = selectedSubscriptionFromProps?.conceptId

    if (currentConceptId !== nextConceptId) {
      setSubscription(selectedSubscriptionFromProps || {})
    }
  }, [
    selectedSubscriptionFromProps,
    subscription?.conceptId
  ])

  const onModalClose = useCallback(() => {
    setOpenModal(null)
  }, [])

  const onSubscriptionNameChange = useCallback((event) => {
    const { value } = event.target

    setSubscription((prev) => ({
      ...prev,
      name: value
    }))
  }, [])

  const onUpdateQueryToggleChange = useCallback((event) => {
    const { checked } = event.target

    setShouldUpdateQuery(checked)
  }, [])

  const onSubscriptionEditSubmit = useCallback(async () => {
    setIsSubmitting(true)

    try {
      await onUpdateSubscription({
        subscription,
        shouldUpdateQuery
      })
    } finally {
      setIsSubmitting(false)
    }

    onModalClose()
  }, [
    onUpdateSubscription,
    onModalClose,
    shouldUpdateQuery,
    subscription
  ])

  if (!isOpen) return null

  const { name = '' } = subscription || {}

  const body = (
    <>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          id="update-subscription-name"
          type="text"
          value={name}
          onChange={onSubscriptionNameChange}
          onBlur={onSubscriptionNameChange}
          onKeyUp={onSubscriptionNameChange}
        />
      </Form.Group>
      <Form.Group>
        <label
          className="d-flex"
          htmlFor="update-subscription-query-checkbox"
        >
          <Form.Check
            id="update-subscription-query-checkbox"
            type="checkbox"
            checked={shouldUpdateQuery}
            onChange={onUpdateQueryToggleChange}
          />
          Update this subscription to match my current search query
        </label>
      </Form.Group>
    </>
  )

  return (
    <EDSCModalContainer
      className="edit-subscription"
      id="edit-subscription"
      isOpen={isOpen}
      onClose={onModalClose}
      size="lg"
      title="Edit Subscription"
      body={body}
      primaryAction="Save"
      onPrimaryAction={onSubscriptionEditSubmit}
      primaryActionLoading={isSubmitting}
      secondaryAction="Cancel"
      onSecondaryAction={onModalClose}
    />
  )
}

EditSubscriptionModal.propTypes = {
  onUpdateSubscription: PropTypes.func.isRequired,
  subscriptions: PropTypes.shape({
    byId: PropTypes.shape({})
  }).isRequired
}

export default EditSubscriptionModal
