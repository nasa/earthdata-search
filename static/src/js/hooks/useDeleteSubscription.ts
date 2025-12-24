import { useMutation } from '@apollo/client'

import { apolloClientNames } from '../constants/apolloClientNames'

import DELETE_SUBSCRIPTION from '../operations/mutations/deleteSubscription'

// @ts-expect-error This file does not have types
import addToast from '../util/addToast'

import useEdscStore from '../zustand/useEdscStore'

export const useDeleteSubscription = () => {
  const handleError = useEdscStore((state) => state.errors.handleError)

  const [deleteSubscription, { loading }] = useMutation(DELETE_SUBSCRIPTION, {
    context: {
      clientName: apolloClientNames.CMR_GRAPHQL
    },
    onCompleted: () => {
      addToast('Subscription removed', {
        appearance: 'success',
        autoDismiss: true
      })
    },
    update: (cache, { data: { deleteSubscription: deletedSubscription } }) => {
      cache.modify({
        fields: {
          // Remove the deleted subscription from the cached list
          subscriptions(existingSubscriptions = {}) {
            const { items = [] } = existingSubscriptions

            const newItems = items.filter(
              (subscription: {
                conceptId: string
              }) => subscription.conceptId !== deletedSubscription.conceptId
            )

            return {
              ...existingSubscriptions,
              items: newItems
            }
          }
        }
      })
    },
    onError: (error) => {
      handleError({
        error,
        action: 'deleteSubscription',
        resource: 'subscription',
        verb: 'deleting',
        showAlertButton: true,
        title: 'Something went wrong deleting your subscription'
      })
    }
  })

  return {
    deleteSubscription,
    loading
  }
}
