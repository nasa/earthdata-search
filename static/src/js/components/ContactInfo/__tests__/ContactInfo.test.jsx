import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import ContactInfo from '../ContactInfo'

const setup = setupTest({
  Component: ContactInfo,
  defaultZustandState: {
    errors: {
      handleError: vi.fn()
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
})
