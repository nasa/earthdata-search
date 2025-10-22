import React from 'react'

import setupTest from '../../../../../../jestConfigs/setupTest'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import { ErrorBanner } from '../ErrorBanner'
import { Banner } from '../../Banner/Banner'
import { displayNotificationType } from '../../../constants/enums'

jest.mock('../../Banner/Banner', () => ({
  Banner: jest.fn(() => <div data-testid="banner" />)
}))

const setup = setupTest({
  Component: ErrorBanner,
  defaultZustandState: {
    errors: {
      errorsList: [{
        id: 1,
        title: 'title',
        message: 'message',
        notificationType: displayNotificationType.banner
      }],
      removeError: jest.fn()
    }
  }
})

beforeEach(() => {
  jest.clearAllMocks()
})

describe('When the database is disabled', () => {
  test('ensure that error messages for database connections refusals do not render', async () => {
    jest.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
      disableDatabaseComponents: 'true'
    }))

    setup({
      overrideZustandState: {
        errors: {
          errorsList: [{
            id: 1,
            title: 'example of database refusal error',
            message: 'connect ECONNREFUSED port 12212 this error',
            notificationType: displayNotificationType.banner
          }]
        }
      }
    })

    expect(Banner).toHaveBeenCalledTimes(0)
  })
})

describe('ErrorBanner component', () => {
  test('passes its props and renders a single ErrorBanner component', () => {
    setup()

    expect(Banner).toHaveBeenCalledTimes(1)
    expect(Banner).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'title',
        message: 'message',
        onClose: expect.any(Function)
      }),
      {}
    )
  })

  test('does not render an ErrorBanner with no errors', () => {
    setup({
      overrideZustandState: {
        errors: {
          errorsList: []
        }
      }
    })

    expect(Banner).toHaveBeenCalledTimes(0)
  })

  test('removeError is called when onClose is triggered', () => {
    const mockRemoveError = jest.fn()

    setup({
      overrideZustandState: {
        errors: {
          removeError: mockRemoveError
        }
      }
    })

    expect(Banner).toHaveBeenCalledTimes(1)

    // Get the onClose function from the Banner mock call
    const bannerProps = Banner.mock.calls[0][0]
    const { onClose } = bannerProps

    // Trigger the onClose callback
    onClose()

    expect(mockRemoveError).toHaveBeenCalledTimes(1)
    expect(mockRemoveError).toHaveBeenCalledWith(1)
  })
})
