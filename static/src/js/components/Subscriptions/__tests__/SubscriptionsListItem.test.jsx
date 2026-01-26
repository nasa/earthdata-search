import ReactDOM from 'react-dom'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import SubscriptionsListItem from '../SubscriptionsListItem'
import { MODAL_NAMES } from '../../../constants/modalNames'

const mockUseDeleteSubscription = vi.fn().mockReturnValue({
  deleteSubscription: vi.fn(),
  loading: false
})
vi.mock('../../../hooks/useDeleteSubscription', () => ({
  useDeleteSubscription: () => mockUseDeleteSubscription()
}))

const defaultSubscription = {
  collectionConceptId: 'COLL-ID-1',
  conceptId: 'SUB1',
  nativeId: 'SUB1-NATIVE-ID',
  name: 'Subscription 1',
  query: 'point[]=-76.37726,38.95159',
  creationDate: '2022-06-14 12:00:00',
  revisionDate: '2022-06-14 12:00:00'
}

const setup = setupTest({
  Component: SubscriptionsListItem,
  defaultProps: {
    exactlyMatchingSubscriptions: [],
    hasNullCmrQuery: false,
    newQuery: 'point[]=-76.37726,38.95159',
    subscription: defaultSubscription,
    subscriptionType: 'granule'
  },
  defaultZustandState: {
    ui: {
      modals: {
        setOpenModal: vi.fn()
      }
    }
  }
})

beforeEach(() => {
  ReactDOM.createPortal = vi.fn((dropdown) => dropdown)
})

describe('SubscriptionsBody component', () => {
  test('should render the name', () => {
    setup()

    expect(screen.getByText('Subscription 1')).toBeInTheDocument()
  })

  test('should render the created date', () => {
    setup()

    expect(screen.getByText('Created: 2022-06-14 12:00:00')).toBeInTheDocument()
  })

  describe('when the collection has been revised', () => {
    test('displays the revision date', () => {
      setup({
        overrideProps: {
          subscription: {
            ...defaultSubscription,
            revisionDate: '2022-06-15 12:00:00'
          }
        }
      })

      expect(screen.getByText('Updated: 2022-06-15 12:00:00')).toBeInTheDocument()
    })
  })

  describe('when hovering over the button', () => {
    test('displays the query', async () => {
      const { user } = setup()

      const button = screen.getByRole('button', { name: 'Details' })
      await user.hover(button)

      expect(await screen.findByText('Point')).toBeInTheDocument()
      expect(screen.getByText('[38.95159, -76.37726]')).toBeInTheDocument()
    })
  })

  describe('when clicking the edit button', () => {
    test('should call setOpenModal', async () => {
      const { user, zustandState } = setup()

      const button = screen.getByRole('button', { name: 'Edit Subscription' })
      await user.click(button)

      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledTimes(1)
      expect(zustandState.ui.modals.setOpenModal).toHaveBeenCalledWith(
        MODAL_NAMES.EDIT_SUBSCRIPTION,
        {
          newQuery: 'point[]=-76.37726,38.95159',
          subscription: {
            collectionConceptId: 'COLL-ID-1',
            conceptId: 'SUB1',
            creationDate: '2022-06-14 12:00:00',
            name: 'Subscription 1',
            nativeId: 'SUB1-NATIVE-ID',
            query: 'point[]=-76.37726,38.95159',
            revisionDate: '2022-06-14 12:00:00'
          }
        }
      )
    })

    describe('when viewing a matching subscription', () => {
      test('allows editing', () => {
        setup({
          overrideProps: {
            exactlyMatchingSubscriptions: [{
              conceptId: 'SUB1'
            }]
          }
        })

        const button = screen.getByRole('button', { name: 'Edit Subscription' })
        expect(button).not.toBeDisabled()
      })
    })

    describe('when viewing a non-matching subscription', () => {
      test('disabled editing', () => {
        setup({
          overrideProps: {
            exactlyMatchingSubscriptions: [{
              conceptId: 'SUB2'
            }]
          }
        })

        const button = screen.getByRole('button', { name: 'Edit Subscription' })
        expect(button).toBeDisabled()
      })
    })
  })

  describe('when clicking the delete button', () => {
    describe('if the user denies the action', () => {
      test('should do nothing', async () => {
        const confirmMock = vi.fn(() => false)
        window.confirm = confirmMock

        const { user } = setup()

        const button = screen.getByRole('button', { name: 'Delete Subscription' })
        await user.click(button)

        expect(mockUseDeleteSubscription().deleteSubscription).toHaveBeenCalledTimes(0)
      })
    })

    describe('if the user allows the action', () => {
      test('should call deleteSubscription', async () => {
        const confirmMock = vi.fn(() => true)
        window.confirm = confirmMock

        const { user } = setup()

        const button = screen.getByRole('button', { name: 'Delete Subscription' })
        await user.click(button)

        expect(mockUseDeleteSubscription().deleteSubscription).toHaveBeenCalledTimes(1)
        expect(mockUseDeleteSubscription().deleteSubscription).toHaveBeenCalledWith({
          variables: {
            params: {
              conceptId: 'SUB1',
              nativeId: 'SUB1-NATIVE-ID'
            }
          }
        })
      })
    })
  })
})
