import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import ContactInfo from '../ContactInfo'
import Spinner from '../../Spinner/Spinner'
import GET_CMR_ORDERING_USER from '../../../operations/queries/getCmrOrderingUser'
import UPDATE_CMR_ORDERING_USER from '../../../operations/mutations/updateCmrOrderingUser'
import addToast from '../../../util/addToast'

jest.mock('../../Spinner/Spinner', () => jest.fn(() => <div />))

jest.mock('../../../util/addToast', () => ({
  __esModule: true,
  default: jest.fn()
}))

const setup = setupTest({
  Component: ContactInfo,
  defaultZustandState: {
    errors: {
      handleError: jest.fn()
    },
    user: {
      ursProfile: {
        affiliation: 'Mock Affiliation',
        country: 'Mock Country',
        emailAddress: 'mock@example.com',
        firstName: 'Mock',
        lastName: 'User',
        organization: 'Mock Organization',
        studyArea: 'Mock Study Area',
        uid: 'mock-uid',
        userType: 'Mock User Type'
      }
    }
  },
  defaultApolloClientMocks: [{
    request: {
      query: GET_CMR_ORDERING_USER,
      variables: {
        ursId: 'mock-uid'
      }
    },
    result: {
      data: {
        user: {
          notificationLevel: 'VERBOSE',
          ursId: 'mock-uid'
        }
      }
    }
  }],
  withApolloClient: true
})

describe('ContactInfo component', () => {
  test('displays the ursProfile information', () => {
    setup()

    expect(screen.getByText('First Name')).toBeInTheDocument()
    expect(screen.getByText('Last Name')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Organization Name')).toBeInTheDocument()
    expect(screen.getByText('Country')).toBeInTheDocument()
    expect(screen.getByText('Affiliation')).toBeInTheDocument()
    expect(screen.getByText('Study Area')).toBeInTheDocument()
    expect(screen.getByText('User Type')).toBeInTheDocument()
  })

  test('displays a spinner while preferences are loading', () => {
    setup({
      overrideProps: {
        contactInfo: {
          cmrPreferences: {},
          ursProfile: { mock: 'urs' }
        }
      }
    })

    expect(Spinner).toHaveBeenCalledTimes(1)
    expect(Spinner).toHaveBeenCalledWith({
      className: 'contact-info-form__preferences-spinner',
      inline: true,
      size: 'x-tiny',
      type: 'dots'
    }, {})
  })

  test('displays the users current notification level', async () => {
    setup()

    expect(await screen.findByRole('combobox')).toHaveValue('VERBOSE')
  })

  describe('when updating the notification level', () => {
    test('calls onUpdateNotificationLevel', async () => {
      const { user } = setup({
        overrideApolloClientMocks: [{
          request: {
            query: GET_CMR_ORDERING_USER,
            variables: {
              ursId: 'mock-uid'
            }
          },
          result: {
            data: {
              user: {
                notificationLevel: 'VERBOSE',
                ursId: 'mock-uid'
              }
            }
          }
        }, {
          request: {
            query: UPDATE_CMR_ORDERING_USER,
            variables: {
              notificationLevel: 'INFO',
              ursId: 'mock-uid'
            }
          },
          result: {
            data: {
              updateUser: {
                notificationLevel: 'VERBOSE',
                ursId: 'mock-uid'
              }
            }
          }
        }]
      })

      const select = await screen.findByRole('combobox')
      await user.selectOptions(select, 'INFO')

      const button = screen.getByRole('button', { name: 'Update Notification Preference' })
      await user.click(button)

      expect(addToast).toHaveBeenCalledTimes(1)
      expect(addToast).toHaveBeenCalledWith('Notification Preference Level updated', {
        appearance: 'success',
        autoDismiss: true
      })
    })

    describe('when an error occurs', () => {
      test('calls handleError', async () => {
        const { user, zustandState } = setup({
          overrideApolloClientMocks: [{
            request: {
              query: GET_CMR_ORDERING_USER,
              variables: {
                ursId: 'mock-uid'
              }
            },
            result: {
              data: {
                user: {
                  notificationLevel: 'VERBOSE',
                  ursId: 'mock-uid'
                }
              }
            }
          }, {
            request: {
              query: UPDATE_CMR_ORDERING_USER,
              variables: {
                notificationLevel: 'INFO',
                ursId: 'mock-uid'
              }
            },
            error: new Error('An error occurred')
          }]
        })

        const select = await screen.findByRole('combobox')
        await user.selectOptions(select, 'INFO')

        const button = screen.getByRole('button', { name: 'Update Notification Preference' })
        await user.click(button)

        expect(zustandState.errors.handleError).toHaveBeenCalledTimes(1)
        expect(zustandState.errors.handleError).toHaveBeenCalledWith({
          action: 'updateNotificationLevel',
          error: new Error('An error occurred'),
          resource: 'contactInfo',
          verb: 'updating'
        })
      })
    })
  })
})
