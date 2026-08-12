import React from 'react'
import { screen } from '@testing-library/react'

import setupTest from '../../../../../../vitestConfigs/setupTest'

// @ts-expect-error: Types do not exist for this file
import * as getApplicationConfig from '../../../../../../sharedUtils/config'

import GrowthBookWrapper from '../GrowthBookWrapper'
import GrowthBookLoader from '../../GrowthBookLoader/GrowthBookLoader'

vi.mock('../../GrowthBookLoader/GrowthBookLoader', () => ({ default: vi.fn(() => null) }))

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

      vi.spyOn(getApplicationConfig, 'getEnvironmentConfig').mockImplementation(() => ({
        growthbookClientKey: 'mock-client-key'
      }))

      setup()

      expect(screen.getByText('Test Children')).toBeInTheDocument()

      expect(GrowthBookLoader).toHaveBeenCalledTimes(0)
    })
  })

  describe('when growthbookEnabled is true', () => {
    test('renders child components', () => {
      vi.spyOn(getApplicationConfig, 'getApplicationConfig').mockImplementation(() => ({
        growthbookEnabled: 'true'
      }))

      setup()

      expect(GrowthBookLoader).toHaveBeenCalledTimes(1)
      expect(GrowthBookLoader).toHaveBeenCalledWith(expect.objectContaining({
        children: <div>Test Children</div>
      }), {})
    })
  })
})
