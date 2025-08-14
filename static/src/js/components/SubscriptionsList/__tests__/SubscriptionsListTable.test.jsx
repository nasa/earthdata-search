import React from 'react'
import { screen, within } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import * as deployedEnvironment from '../../../../../../sharedUtils/deployedEnvironment'

import SubscriptionsListTable from '../SubscriptionsListTable'
import PortalLinkContainer from '../../../containers/PortalLinkContainer/PortalLinkContainer'

// In order to pass out of scope variables into `jest` they must be prefixed with `mock`
jest.mock('../../../containers/PortalLinkContainer/PortalLinkContainer', () => jest.fn((props) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <mock-PortalLinkContainer {...props} aria-label={props.label} />
)))

const setup = setupTest({
  Component: SubscriptionsListTable,
  defaultProps: {
    subscriptionsMetadata: [],
    subscriptionType: 'collection',
    onDeleteSubscription: jest.fn()
  },
  defaultZustandState: {
    focusedCollection: {
      changeFocusedCollection: jest.fn()
    }
  },
  withRedux: true
})

beforeEach(() => {
  jest.spyOn(deployedEnvironment, 'deployedEnvironment').mockImplementation(() => 'prod')
})

describe('SubscriptionsListTable component', () => {
  describe('when passed the correct props', () => {
    test('renders a message when no subscriptions exist', () => {
      setup()

      expect(screen.getByText('No subscriptions to display.')).toBeInTheDocument()
    })

    test('renders a table when subscriptions exist', () => {
      setup({
        overrideProps: {
          subscriptionsMetadata: [{
            collection: {
              conceptId: 'C100000-EDSC',
              title: 'Mattis Justo Vulputate Ullamcorper Amet.'
            },
            collectionConceptId: 'C100000-EDSC',
            creationDate: '2021-01-01',
            conceptId: 'SUB100000-EDSC',
            name: 'Test Subscription',
            nativeId: 'mock-guid',
            query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78',
            revisionDate: '2021-01-02'
          }],
          subscriptionType: 'granule'
        }
      })

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getAllByRole('row')).toHaveLength(2)

      const tableHeadings = screen.getAllByRole('columnheader')
      expect(tableHeadings[0]).toHaveTextContent('Name')
      expect(tableHeadings[1]).toHaveTextContent('Dataset')
      expect(tableHeadings[2]).toHaveTextContent('Created')
      expect(tableHeadings[3]).toHaveTextContent('Updated')
      expect(tableHeadings[4]).toHaveTextContent('Actions')

      const cells = screen.getAllByRole('cell')
      expect(cells[0]).toHaveTextContent('Test Subscription')
      expect(cells[1]).toHaveTextContent('Mattis Justo Vulputate Ullamcorper Amet.')
      expect(cells[2]).toHaveTextContent('2021-01-01 00:00:00')
      expect(cells[3]).toHaveTextContent('2021-01-02 00:00:00')
      expect(within(cells[4]).getByLabelText('Edit Subscription')).toBeInTheDocument()
      expect(within(cells[4]).getByRole('button', { name: 'Delete Subscription' })).toBeInTheDocument()
    })

    test('onHandleRemove calls onDeleteSubscription', async () => {
      const { props, user } = setup({
        overrideProps: {
          subscriptionsMetadata: [{
            collection: {
              conceptId: 'C100000-EDSC',
              title: 'Mattis Justo Vulputate Ullamcorper Amet.'
            },
            collectionConceptId: 'C100000-EDSC',
            conceptId: 'SUB100000-EDSC',
            name: 'Test Subscription',
            nativeId: 'mock-guid',
            query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
          }],
          subscriptionType: 'granule',
          onDeleteSubscription: jest.fn()
        }
      })

      window.confirm = jest.fn().mockImplementation(() => true)

      const removeButton = screen.getByRole('button', { name: 'Delete Subscription' })

      await user.click(removeButton)

      expect(props.onDeleteSubscription).toHaveBeenCalledTimes(1)
      expect(props.onDeleteSubscription).toHaveBeenCalledWith('SUB100000-EDSC', 'mock-guid', 'C100000-EDSC')
    })
  })

  describe('edit subscriptions button', () => {
    test('renders a PortalLinkContainer', () => {
      setup({
        overrideProps: {
          subscriptionsMetadata: [{
            collection: {
              conceptId: 'C100000-EDSC',
              title: 'Mattis Justo Vulputate Ullamcorper Amet.'
            },
            collectionConceptId: 'C100000-EDSC',
            conceptId: 'SUB100000-EDSC',
            name: 'Test Subscription',
            query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
          }],
          subscriptionType: 'granule',
          onDeleteSubscription: jest.fn()
        }
      })

      expect(PortalLinkContainer).toHaveBeenCalledTimes(1)
      expect(PortalLinkContainer).toHaveBeenCalledWith(expect.objectContaining({
        className: 'subscriptions-list__button subscriptions-list__button--edit',
        label: 'Edit Subscription',
        onClick: expect.any(Function),
        to: {
          pathname: '/search/granules/subscriptions',
          search: '?p=C100000-EDSC'
        },
        type: 'button',
        variant: 'naked'
      }), {})
    })

    describe('when clicking the edit button while the subscription type is granule', () => {
      test('calls changeFocusedCollection', async () => {
        const { user, zustandState } = setup({
          overrideProps: {
            subscriptionsMetadata: [{
              collection: {
                conceptId: 'C100000-EDSC',
                title: 'Mattis Justo Vulputate Ullamcorper Amet.'
              },
              collectionConceptId: 'C100000-EDSC',
              conceptId: 'SUB100000-EDSC',
              name: 'Test Subscription',
              query: 'polygon=-18,-78,-13,-74,-16,-73,-22,-77,-18,-78'
            }],
            subscriptionType: 'granule',
            onDeleteSubscription: jest.fn()
          }
        })

        const button = screen.getByLabelText('Edit Subscription')
        await user.click(button)

        expect(zustandState.focusedCollection.changeFocusedCollection).toHaveBeenCalledTimes(1)
        expect(zustandState.focusedCollection.changeFocusedCollection).toHaveBeenCalledWith('C100000-EDSC')
      })
    })
  })
})
