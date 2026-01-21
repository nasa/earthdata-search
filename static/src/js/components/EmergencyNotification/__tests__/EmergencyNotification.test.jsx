import React from 'react'
import { act, screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

import EmergencyNotification from '../EmergencyNotification'
import Banner from '../../Banner/Banner'

import * as getApplicationConfig from '../../../../../../sharedUtils/config'

vi.mock('../../Banner/Banner', () => ({
  default: vi.fn(({ title }) => <div>{title}</div>)
}))

const setup = setupTest({
  Component: EmergencyNotification
})

describe('EmergencyNotification', () => {
  describe('when no notification exists', () => {
    beforeEach(() => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        emergencyNotification: 'false',
        emergencyNotificationType: 'false'
      }))
    })

    test('should not render the banner', () => {
      setup()

      expect(Banner).toHaveBeenCalledTimes(0)
    })
  })

  describe('when a notification exists', () => {
    beforeEach(() => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        emergencyNotification: 'Don\'t Panic',
        emergencyNotificationType: 'info'
      }))
    })

    test('should render the banner', () => {
      setup()

      expect(screen.getByText("Don't Panic")).toBeInTheDocument()

      expect(Banner).toHaveBeenCalledTimes(1)
      expect(Banner).toHaveBeenCalledWith({
        title: "Don't Panic",
        type: 'info',
        onClose: expect.any(Function)
      }, {})
    })

    describe('when dismissing the banner', () => {
      test('should no longer render the banner', async () => {
        setup()

        expect(screen.getByText("Don't Panic")).toBeInTheDocument()

        // Mock calling the onClose function
        await act(() => {
          Banner.mock.calls[0][0].onClose()
        })

        expect(screen.queryByText("Don't Panic")).not.toBeInTheDocument()
      })
    })
  })
})
