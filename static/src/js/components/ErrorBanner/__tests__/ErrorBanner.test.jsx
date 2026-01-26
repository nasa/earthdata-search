import React from 'react'

import setupTest from '../../../../../../vitestConfigs/setupTest'
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import ErrorBanner from '../ErrorBanner'
import { Banner } from '../../Banner/Banner'
import { DISPLAY_NOTIFICATION_TYPE } from '../../../constants/displayNotificationType'

vi.mock('../../Banner/Banner', () => ({
  Banner: vi.fn(() => <div />)
}))

const setup = setupTest({
  Component: ErrorBanner,
  defaultZustandState: {
    errors: {
      errorsList: [{
        id: 1,
        title: 'title',
        message: 'message',
        notificationType: DISPLAY_NOTIFICATION_TYPE.BANNER
      }],
      removeError: vi.fn()
    }
  }
})

describe('When the database is disabled', () => {
  test('ensure that error messages for database connections refusals do not render', async () => {
    vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementationOnce(() => ({
      disableDatabaseComponents: 'true'
    }))

    setup({
      overrideZustandState: {
        errors: {
          errorsList: [{
            id: 1,
            title: 'example of database refusal error',
            message: 'connect ECONNREFUSED port 12212 this error',
            notificationType: DISPLAY_NOTIFICATION_TYPE.BANNER
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
    const { zustandState } = setup({
      overrideZustandState: {
        errors: {
          removeError: vi.fn()
        }
      }
    })

    expect(Banner).toHaveBeenCalledTimes(1)

    // Get the onClose function from the Banner mock call
    const bannerProps = Banner.mock.calls[0][0]
    const { onClose } = bannerProps

    // Trigger the onClose callback
    onClose()

    expect(zustandState.errors.removeError).toHaveBeenCalledTimes(1)
    expect(zustandState.errors.removeError).toHaveBeenCalledWith(1)
  })
})
