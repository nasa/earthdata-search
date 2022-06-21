import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form } from 'react-bootstrap'

import EDSCModalContainer from '../../containers/EDSCModalContainer/EDSCModalContainer'

export class EditSubscriptionModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      subscription: {
        name: '',
        nativeId: '',
        conceptId: ''
      },
      shouldUpdateQuery: false,
      isSubmitting: false
    }
    this.onModalClose = this.onModalClose.bind(this)
    this.onSubscriptionNameChange = this.onSubscriptionNameChange.bind(this)
    this.onUpdateQueryToggleChange = this.onUpdateQueryToggleChange.bind(this)
    this.onSubscriptionEditSubmit = this.onSubscriptionEditSubmit.bind(this)
  }

  static getDerivedStateFromProps(props, state) {
    const {
      granuleSubscriptions,
      subscriptions,
      subscriptionConceptId: subscriptionConceptIdFromProps,
      subscriptionType
    } = props

    const { subscription: subscriptionFromState = {} } = state
    const { conceptId: subscriptionConceptIdFromState } = subscriptionFromState

    // Check to see if a new subscription has been loaded
    if (subscriptionConceptIdFromState === subscriptionConceptIdFromProps) return null

    let subscription = {}

    if (subscriptionType === 'granule') {
      subscription = granuleSubscriptions.find(
        (subscription) => subscription.conceptId === subscriptionConceptIdFromProps
      )
    } else {
      const { byId: subscriptionsById } = subscriptions
      subscription = subscriptionsById[subscriptionConceptIdFromProps] || {}
    }

    return {
      ...state,
      subscription
    }
  }

  async onSubscriptionEditSubmit() {
    const { onUpdateSubscription } = this.props
    const { subscription, shouldUpdateQuery } = this.state

    this.setState({
      isSubmitting: true
    })
    await onUpdateSubscription({
      subscription,
      shouldUpdateQuery
    })
    this.setState({
      isSubmitting: false
    })
    this.onModalClose()
  }

  onSubscriptionNameChange(e) {
    const { target } = e
    const { value } = target

    this.setState((state) => (
      {
        ...state,
        subscription: {
          ...state.subscription,
          name: value
        }
      }
    ))
  }

  onUpdateQueryToggleChange(e) {
    const { target } = e
    const { checked } = target
    this.setState({
      shouldUpdateQuery: checked
    })
  }

  onModalClose() {
    const { onToggleEditSubscriptionModal } = this.props
    onToggleEditSubscriptionModal({
      isOpen: false,
      subscriptionConceptId: '',
      type: ''
    })
  }

  render() {
    const {
      isOpen
    } = this.props

    const {
      isSubmitting,
      subscription = {},
      shouldUpdateQuery
    } = this.state

    const {
      name
    } = subscription

    const body = (
      <>
        <Form.Group>
          <Form.Label>Name</Form.Label>
          <Form.Control
            id="update-subscription-name"
            type="text"
            value={name}
            onChange={(e) => {
              this.onSubscriptionNameChange(e)
            }}
            onBlur={this.onSubscriptionNameChange}
            onKeyUp={this.onSubscriptionNameChange}
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
              onChange={this.onUpdateQueryToggleChange}
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
        onClose={this.onModalClose}
        size="lg"
        title="Edit Subscription"
        body={body}
        primaryAction="Save"
        onPrimaryAction={this.onSubscriptionEditSubmit}
        primaryActionLoading={isSubmitting}
        secondaryAction="Cancel"
        onSecondaryAction={() => this.onModalClose()}
      />
    )
  }
}

EditSubscriptionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggleEditSubscriptionModal: PropTypes.func.isRequired,
  onUpdateSubscription: PropTypes.func.isRequired,
  granuleSubscriptions: PropTypes.arrayOf(
    PropTypes.shape({
      byId: PropTypes.shape({})
    })
  ).isRequired,
  subscriptions: PropTypes.shape({
    byId: PropTypes.shape({})
  }).isRequired,
  subscriptionConceptId: PropTypes.string.isRequired,
  subscriptionType: PropTypes.string.isRequired
}

export default EditSubscriptionModal
