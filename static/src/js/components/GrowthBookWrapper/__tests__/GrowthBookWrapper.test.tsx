import React from 'react'
import { screen, waitFor } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

// @ts-expect-error: Types do not exist for this file
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import GrowthBookWrapper from '../GrowthBookWrapper'
import GrowthBookLoader from '../../GrowthBookLoader/GrowthBookLoader'
import Spinner from '../../Spinner/Spinner'

vi.mock('../../GrowthBookLoader/GrowthBookLoader', () => ({ default: vi.fn(() => null) }))
vi.mock('../../Spinner/Spinner', () => ({ default: vi.fn(() => null) }))

const setup = setupTest({
  Component: GrowthBookWrapper,
  defaultProps: {
    children: <div>Test Children</div>
  }
})

describe('GrowthBookWrapper', () => {
  describe('when growthbookEnabled is false', () => {
    test('renders child components', () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        growthbookEnabled: 'false'
      }))

      setup()

      expect(screen.getByText('Test Children')).toBeInTheDocument()

      expect(GrowthBookLoader).toHaveBeenCalledTimes(0)
    })
  })

  describe('when growthbookEnabled is true', () => {
    test('renders the spinner then the children', async () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        growthbookEnabled: 'true'
      }))

      vi.spyOn(getApplicationConfig, 'getEnvironmentConfig').mockImplementation(() => ({
        apiHost: 'http://localhost:4100',
        growthbookClientKey: 'mock-client-key'
      }))

      setup()

      expect(Spinner).toHaveBeenCalledTimes(1)
      expect(Spinner).toHaveBeenCalledWith({
        type: 'dots',
        className: 'root__spinner spinner spinner--dots spinner--small'
      }, {})

      await waitFor(() => expect(GrowthBookLoader).toHaveBeenCalledTimes(1))

      expect(GrowthBookLoader).toHaveBeenCalledWith(expect.objectContaining({
        children: <div>Test Children</div>
      }), {})
    })
  })
})
