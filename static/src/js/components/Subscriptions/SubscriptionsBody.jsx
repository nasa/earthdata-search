import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { parse } from 'qs'
import { isEmpty, isEqual } from 'lodash-es'
import { Plus, Subscribe } from '@edsc/earthdata-react-icons/horizon-design-system/hds/ui'
import Form from 'react-bootstrap/Form'
import snakecaseKeys from 'snakecase-keys'
import { useMutation, useQuery } from '@apollo/client'

import { apolloClientNames } from '../../constants/apolloClientNames'
import {
  collectionRequestNonIndexedCmrKeys,
  granuleRequestNonIndexedCmrKeys
} from '../../../../../sharedConstants/nonIndexedCmrKeys'
import { DISPLAY_NOTIFICATION_TYPE } from '../../constants/displayNotificationType'
import { routes } from '../../constants/routes'

import { prepKeysForCmr } from '../../../../../sharedUtils/prepKeysForCmr'
import { queryToHumanizedList } from '../../util/queryToHumanizedList'
import pluralize from '../../util/pluralize'
import { removeDisabledFieldsFromQuery } from '../../util/subscriptions'
import { formatDefaultSubscriptionName } from '../../util/formatDefaultSubscriptionName'

import Button from '../Button/Button'
import SubscriptionsListItem from './SubscriptionsListItem'
import EDSCIcon from '../EDSCIcon/EDSCIcon'
import EmptyListItem from '../EmptyListItem/EmptyListItem'
import SubscriptionsQueryList from '../SubscriptionsList/SubscriptionsQueryList'
import PortalLinkContainer from '../../containers/PortalLinkContainer/PortalLinkContainer'

import useEdscStore from '../../zustand/useEdscStore'
import { getCollectionId } from '../../zustand/selectors/collection'
import { getUsername } from '../../zustand/selectors/user'
import {
  getCollectionSubscriptionQueryObj,
  getCollectionSubscriptionQueryString,
  getGranuleSubscriptionQueryObj,
  getGranuleSubscriptionQueryString
} from '../../zustand/selectors/query'

import SUBSCRIPTIONS from '../../operations/queries/subscriptions'
import CREATE_SUBSCRIPTION from '../../operations/mutations/createSubscription'

import addToast from '../../util/addToast'

import './SubscriptionsBody.scss'

/**
 * Renders SubscriptionsBody.
 * @param {Function} setSubscriptionCount - Optional setter to set the subscription count in the parent component.
 * @param {String} subscriptionType - The type of subscriptions to display, collection or granule.
 */
export const SubscriptionsBody = ({
  setSubscriptionCount = null,
  subscriptionType
}) => {
  const [disabledFields, setDisabledFields] = useState({})
  const [submittingNewSubscription, setSubmittingNewSubscription] = useState(false)
  const [name, setName] = useState('')

  const collectionId = useEdscStore(getCollectionId)
  const collectionQueryObj = useEdscStore(getCollectionSubscriptionQueryObj)
  const granuleQueryObj = useEdscStore(getGranuleSubscriptionQueryObj)
  const collectionQueryString = useEdscStore(
    () => getCollectionSubscriptionQueryString(disabledFields)
  )
  const granuleQueryString = useEdscStore(
    (state) => getGranuleSubscriptionQueryString(state, disabledFields)
  )
  const handleError = useEdscStore((state) => state.errors.handleError)
  const username = useEdscStore(getUsername)

  const query = subscriptionType === 'collection' ? collectionQueryObj : granuleQueryObj
  const queryString = subscriptionType === 'collection' ? collectionQueryString : granuleQueryString

  // Reset disabled fields when the query changes
  useEffect(() => {
    setDisabledFields({})
  }, [query])

  const [createSubscription] = useMutation(CREATE_SUBSCRIPTION, {
    context: {
      clientName: apolloClientNames.CMR_GRAPHQL
    },
    onCompleted: () => {
      setSubmittingNewSubscription(false)

      addToast('Subscription created', {
        appearance: 'success',
        autoDismiss: true
      })
    },
    onError: (error) => {
      setSubmittingNewSubscription(false)

      handleError({
        error,
        action: 'createSubscription',
        resource: 'subscription',
        notificationType: DISPLAY_NOTIFICATION_TYPE.TOAST,
        showAlertButton: true,
        title: 'Something went wrong creating your subscription'
      })
    },
    refetchQueries: [SUBSCRIPTIONS]
  })

  const handleCreateSubscription = (placeholderName) => {
    // If the user hasn't provided a name, use the default name from the placeholder
    let subscriptionName = name

    if (!subscriptionName) {
      subscriptionName = placeholderName
    }

    const variables = {
      params: {
        subscriberId: username,
        name: subscriptionName,
        type: subscriptionType,
        query: queryString
      }
    }

    if (subscriptionType === 'granule') {
      variables.params.collectionConceptId = collectionId
    }

    createSubscription({
      variables
    })
  }

  const variables = {
    params: {
      subscriberId: username,
      type: subscriptionType
    }
  }
  let skip = false

  if (subscriptionType === 'granule') {
    if (collectionId && collectionId !== '') {
      variables.params.collectionConceptId = collectionId
    } else {
      skip = true
    }
  }

  const { data } = useQuery(SUBSCRIPTIONS, {
    skip,
    variables,
    context: {
      clientName: apolloClientNames.CMR_GRAPHQL
    }
  })

  const { subscriptions } = data || {}
  const { items: subscriptionItems = [] } = subscriptions || {}

  // Set the subscription count in the parent component if the setter is provided
  useEffect(() => {
    if (setSubscriptionCount) setSubscriptionCount(subscriptionItems.length)
  }, [subscriptionItems.length])

  const onChangeName = (event) => {
    const { target } = event
    const { value = '' } = target

    setName(value)
  }

  const parsedQueryWithRemovedFields = removeDisabledFieldsFromQuery(query, disabledFields)

  const placeholderName = formatDefaultSubscriptionName(
    parsedQueryWithRemovedFields,
    subscriptionType
  )

  // Compare the subscriptions returned for the user to the current query to prevent submission
  // of duplicate subscriptions
  const exactlyMatchingSubscriptions = subscriptionItems.filter((subscription) => {
    let nonIndexedKeys
    const { query: subscriptionQuery } = subscription
    // The query returned for each subscription is returned as a string. To make a reliable comparison,
    // it is parsed into an object. Unneeded keys are trimmed from the current query with prepKeysForCmr,
    // which returns a string and is then parsed and snakecased to match the values returned by the CMR.

    if (subscriptionType === 'collection') nonIndexedKeys = collectionRequestNonIndexedCmrKeys
    if (subscriptionType === 'granule') nonIndexedKeys = granuleRequestNonIndexedCmrKeys

    return isEqual(
      parse(
        prepKeysForCmr(snakecaseKeys(parsedQueryWithRemovedFields), nonIndexedKeys)
      ),
      parse(subscriptionQuery)
    )
  })

  const hasNullCmrQuery = isEmpty(parsedQueryWithRemovedFields)
  const hasExactlyMatchingGranuleQuery = exactlyMatchingSubscriptions.length > 0
  const hasTooLongName = name && name.length > 80
  const displayWarning = hasExactlyMatchingGranuleQuery || hasNullCmrQuery || hasTooLongName

  const appliedFilterCount = queryToHumanizedList(
    parsedQueryWithRemovedFields,
    subscriptionType
  ).length

  return (
    <div className="subscriptions-body">
      <div className="subscriptions-body__content">
        <div className="row subscriptions-body__row subscriptions-body__row--intro">
          <div className="col col-12">
            <p className="subscriptions-body__intro-text">
              { /* eslint-disable-next-line max-len */}
              Subscribe to be notified by email when new data matching your search query becomes available.
            </p>
            <div className="subscriptions-body__query">
              <Form>
                <div className="subscriptions-body__query-primary">
                  <h4 className="subscriptions-body__query-primary-heading h6">Create a new subscription</h4>
                  <Form.Group className="subscriptions-body__form-group subscriptions-body__form-group--coords mb-3">
                    <Form.Label className="mb-1">
                      Name
                    </Form.Label>
                    <Form.Control
                      className="subscriptions-body__text-input"
                      data-testid="subscriptions-body_name-input"
                      type="text"
                      value={name}
                      placeholder={placeholderName}
                      onChange={onChangeName}
                      onBlur={onChangeName}
                      onKeyUp={onChangeName}
                    />
                  </Form.Group>
                  <h4 className="subscriptions-body__query-list-heading">{`${appliedFilterCount} ${pluralize('filter', appliedFilterCount)} applied`}</h4>
                  <SubscriptionsQueryList
                    displayEmptyMessage={false}
                    showCheckboxes
                    disabledFields={disabledFields}
                    query={query}
                    subscriptionType={subscriptionType}
                    setDisabledFields={setDisabledFields}
                  />
                  <div className="subscriptions-body__query-secondary">
                    {
                      displayWarning && (
                        <div className="subscriptions-body__warning">
                          <EDSCIcon className="subscriptions-body__warning-icon" icon={Subscribe} />
                          <div>
                            {
                              hasExactlyMatchingGranuleQuery
                              && exactlyMatchingSubscriptions.map((exactlyMatchingQuery) => {
                                const {
                                  conceptId,
                                  name: queryName
                                } = exactlyMatchingQuery

                                return (
                                  <div key={conceptId} className="subscriptions-body__warning-item">
                                    The subscription
                                    {' '}
                                    <strong>{queryName}</strong>
                                    {' '}
                                    matches the current search query.
                                    {' '}
                                    Choose a different search query to create a new subscription.
                                  </div>
                                )
                              })
                            }
                            {
                              hasNullCmrQuery && (
                                <div className="subscriptions-body__warning-item">
                                  The current query is not currently supported.
                                  {' '}
                                  Add additional filters to create a new subscription.
                                </div>
                              )
                            }
                            {
                              hasTooLongName && (
                                <div className="subscriptions-body__warning-item">
                                  The subscription name must be less than 80 characters long.
                                </div>
                              )
                            }
                          </div>
                        </div>
                      )
                    }
                  </div>
                  <Button
                    className="subscriptions-body__create-button"
                    disabled={hasExactlyMatchingGranuleQuery || hasNullCmrQuery}
                    bootstrapVariant="primary"
                    label="Create Subscription"
                    spinner={submittingNewSubscription}
                    icon={Plus}
                    onClick={
                      async () => {
                        setSubmittingNewSubscription(true)

                        handleCreateSubscription(placeholderName)
                      }
                    }
                  >
                    Create Subscription
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
        <div className="subscriptions-body__row  subscriptions-body__row--list">
          <ul className="subscriptions-body__list">
            {
              subscriptionItems.map((subscription) => {
                const {
                  conceptId
                } = subscription

                return (
                  <SubscriptionsListItem
                    key={conceptId}
                    exactlyMatchingSubscriptions={exactlyMatchingSubscriptions}
                    hasNullCmrQuery={hasNullCmrQuery}
                    newQuery={queryString}
                    subscription={subscription}
                    subscriptionType={subscriptionType}
                  />
                )
              })
            }
            {
              subscriptionItems.length === 0 && (
                <EmptyListItem>
                  {'No subscriptions exist for this collection. Use filters to define your query and '}
                  <Button
                    className="subscriptions-body__empty-list-item"
                    disabled={hasExactlyMatchingGranuleQuery || hasNullCmrQuery}
                    bootstrapVariant="link"
                    label="Create New Subscription"
                    variant="link"
                    onClick={() => handleCreateSubscription(placeholderName)}
                  >
                    create a new subscription
                  </Button>
                  {' to be notified when new data becomes available.'}
                </EmptyListItem>
              )
            }
          </ul>
          {
            subscriptionItems.length > 0 && (
              <div className="subscriptions-body__list-footer">
                <PortalLinkContainer
                  className="subscriptions-body__view-all-subscriptions"
                  to={routes.SUBSCRIPTIONS}
                  type="button"
                  bootstrapVariant="light"
                  label="View All Subscriptions"
                >
                  View All Subscriptions
                </PortalLinkContainer>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

SubscriptionsBody.propTypes = {
  setSubscriptionCount: PropTypes.func,
  subscriptionType: PropTypes.string.isRequired
}

export default SubscriptionsBody
