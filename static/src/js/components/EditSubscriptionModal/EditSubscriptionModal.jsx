import React, {
  useCallback,
  useEffect,
  useState
} from 'react'
import Form from 'react-bootstrap/Form'
import { useMutation } from '@apollo/client'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'

import useEdscStore from '../../zustand/useEdscStore'
import {
  isModalOpen,
  openModalData,
  setOpenModalFunction
} from '../../zustand/selectors/ui'

import { MODAL_NAMES } from '../../constants/modalNames'
import { apolloClientNames } from '../../constants/apolloClientNames'

import SUBSCRIPTIONS from '../../operations/queries/subscriptions'
import UPDATE_SUBSCRIPTION from '../../operations/mutations/updateSubscription'

import addToast from '../../util/addToast'

const EditSubscriptionModal = () => {
  const [name, setName] = useState('')
  const [shouldUpdateQuery, setShouldUpdateQuery] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOpen = useEdscStore((state) => isModalOpen(state, MODAL_NAMES.EDIT_SUBSCRIPTION))
  const setOpenModal = useEdscStore(setOpenModalFunction)
  const modalData = useEdscStore(openModalData)
  const handleError = useEdscStore((state) => state.errors.handleError)

  const [updateSubscription] = useMutation(UPDATE_SUBSCRIPTION, {
    context: {
      clientName: apolloClientNames.CMR_GRAPHQL
    },
    onCompleted: () => {
      setIsSubmitting(false)

      addToast('Subscription updated', {
        appearance: 'success',
        autoDismiss: true
      })
    },
    onError: (error) => {
      setIsSubmitting(false)

      handleError({
        error,
        action: 'updateSubscription',
        resource: 'subscription',
        verb: 'updating',
        showAlertButton: true,
        title: 'Something went wrong updating your subscription'
      })
    },
    refetchQueries: [SUBSCRIPTIONS]
  })

  const {
    subscription,
    newQuery
  } = modalData
  const { name: previousName } = subscription || {}

  useEffect(() => {
    setName(previousName || '')
  }, [previousName])

  const onModalClose = useCallback(() => {
    setOpenModal(null)
  }, [])

  const handleSubscriptionNameChange = useCallback((event) => {
    const { value } = event.target

    setName(value)
  }, [])

  const handleUpdateQueryToggleChange = useCallback((event) => {
    const { checked } = event.target

    setShouldUpdateQuery(checked)
  }, [])

  const onSubscriptionEditSubmit = useCallback(async () => {
    setIsSubmitting(true)

    const {
      collectionConceptId,
      nativeId,
      query: existingQuery,
      subscriberId,
      type
    } = subscription

    const query = shouldUpdateQuery ? newQuery : existingQuery

    const variables = {
      params: {
        collectionConceptId,
        name,
        nativeId,
        query,
        subscriberId,
        type
      }
    }

    updateSubscription({
      variables
    })

    onModalClose()
  }, [
    shouldUpdateQuery,
    subscription,
    name,
    newQuery
  ])

  if (!isOpen) return null

  const body = (
    <>
      <Form.Group>
        <Form.Label>Name</Form.Label>
        <Form.Control
          id="update-subscription-name"
          type="text"
          value={name}
          onChange={handleSubscriptionNameChange}
          onBlur={handleSubscriptionNameChange}
          onKeyUp={handleSubscriptionNameChange}
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
            onChange={handleUpdateQueryToggleChange}
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

export default EditSubscriptionModal
