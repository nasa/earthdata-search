import React from 'react'
import { screen } from '@testing-library/react'
import { ApolloError } from '@apollo/client'

import setupTest from '../../../../../vitestConfigs/setupTest'

import { useDeleteSubscription } from '../useDeleteSubscription'

import DELETE_SUBSCRIPTION from '../../operations/mutations/deleteSubscription'

// @ts-expect-error This file does not have types
import addToast from '../../util/addToast'

vi.mock('../../util/addToast', () => ({ default: vi.fn() }))

const TestComponent = () => {
  const { deleteSubscription, loading } = useDeleteSubscription()

  return (
    <div>
      <span>
        Loading:
        {' '}
        {loading.toString()}
      </span>

      <button
        type="button"
        onClick={
          () => deleteSubscription({
            variables: {
              conceptId: 'subscriptionId'
            }
          })
        }
      >
        Delete
      </button>
    </div>
  )
}

const setup = setupTest({
  Component: TestComponent,
  defaultZustandState: {
    errors: {
      handleError: vi.fn()
    }
  },
  withApolloClient: true
})

describe('useDeleteSubscription', () => {
  describe('when calling deleteSubscription', () => {
    describe('when the mutation is successful', () => {
      test('calls addToast', async () => {
        const { user } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: DELETE_SUBSCRIPTION,
              variables: {
                conceptId: 'subscriptionId'
              }
            },
            result: {
              data: {
                deleteSubscription: {
                  conceptId: 'subscriptionId'
                }
              }
            }
          }]
        })

        const button = screen.getByRole('button', { name: 'Delete' })
        await user.click(button)

        expect(addToast).toHaveBeenCalledTimes(1)
        expect(addToast).toHaveBeenCalledWith('Subscription removed', {
          appearance: 'success',
          autoDismiss: true
        })
      })
    })

    describe('when the mutation errors', () => {
      test('calls handleError', async () => {
        const { user, zustandState } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: DELETE_SUBSCRIPTION,
              variables: {
                conceptId: 'subscriptionId'
              }
            },
            error: new ApolloError({ errorMessage: 'An error occurred' })
          }]
        })

        const button = screen.getByRole('button', { name: 'Delete' })
        await user.click(button)

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith({
          action: 'deleteSubscription',
          error: new ApolloError({ errorMessage: 'An error occurred' }),
          resource: 'subscription',
          verb: 'deleting',
          showAlertButton: true,
          title: 'Something went wrong deleting your subscription'
        })
      })
    })
  })
})
