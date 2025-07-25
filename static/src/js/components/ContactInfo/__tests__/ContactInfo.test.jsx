import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../jestConfigs/setupTest'

import ContactInfo from '../ContactInfo'
import Spinner from '../../Spinner/Spinner'

jest.mock('../../Spinner/Spinner', () => jest.fn(() => <div />))

const setup = setupTest({
  Component: ContactInfo,
  defaultProps: {
    contactInfo: {
      cmrPreferences: {
        notificationLevel: 'VERBOSE'
      },
      ursProfile: {
        affiliation: 'Mock Affiliation',
        country: 'Mock Country',
        email_address: 'mock@example.com',
        first_name: 'Mock',
        last_name: 'User',
        organization: 'Mock Organization',
        study_area: 'Mock Study Area',
        user_type: 'Mock User Type'
      }
    },
    earthdataEnvironment: 'prod',
    onUpdateNotificationLevel: jest.fn()
  }
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

  test('displays the users current notification level', () => {
    setup()

    expect(screen.getByRole('combobox')).toHaveValue('VERBOSE')
  })

  describe('when updating the notification level', () => {
    test('calls onUpdateNotificationLevel', async () => {
      const { props, user } = setup()

      const select = screen.getByRole('combobox')
      await user.selectOptions(select, 'INFO')

      const button = screen.getByRole('button', { name: 'Update Notification Preference' })
      await user.click(button)

      expect(props.onUpdateNotificationLevel).toHaveBeenCalledTimes(1)
      expect(props.onUpdateNotificationLevel).toHaveBeenCalledWith('INFO')
    })
  })
})
