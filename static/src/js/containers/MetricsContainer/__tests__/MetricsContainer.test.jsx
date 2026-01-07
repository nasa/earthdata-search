import React from 'react'
import { screen } from '@testing-library/react'

import MetricsContainer from '../MetricsContainer'
import setupTest from '../../../../../../jestConfigs/setupTest'

import { metricsDefaultClick } from '../../../util/metrics/metricsDefaultClick'
import { metricsVirtualPageview } from '../../../util/metrics/metricsVirtualPageview'

jest.mock('../../../util/metrics/metricsDefaultClick', () => ({
  metricsDefaultClick: jest.fn()
}))

jest.mock('../../../util/metrics/metricsVirtualPageview', () => ({
  metricsVirtualPageview: jest.fn()
}))

const WrappingComponent = (props) => (
  <>
    <MetricsContainer {...props} />
    <a href="/">Test Link</a>
    <a href="/" title="Link With Title">Test Link with Title</a>
    <button type="button">
      <span>
        Test Button
      </span>
    </button>
  </>
)

const setup = setupTest({
  Component: WrappingComponent,
  withRouter: true
})

describe('MetricsContainer component', () => {
  test('calls virtualPageView', async () => {
    setup()

    expect(metricsVirtualPageview).toHaveBeenCalledTimes(1)
    expect(metricsVirtualPageview).toHaveBeenCalledWith('POP')
  })

  describe('clicking fires metricsDefaultClick correctly', () => {
    test('when no title is provided', async () => {
      const { user } = setup()

      const button = screen.getByText('Test Link')
      await user.click(button)

      expect(metricsDefaultClick).toHaveBeenCalledTimes(1)
      expect(metricsDefaultClick).toHaveBeenCalledWith('Test Link')
    })

    test('when a title is provided', async () => {
      const { user } = setup()

      const button = screen.getByText('Test Link with Title')
      await user.click(button)

      expect(metricsDefaultClick).toHaveBeenCalledTimes(1)
      expect(metricsDefaultClick).toHaveBeenCalledWith('Link With Title')
    })

    test('when a title prop is not but, can be derived from other element props', async () => {
      const { user } = setup()

      const button = screen.getByText('Test Button')
      await user.click(button)

      expect(metricsDefaultClick).toHaveBeenCalledTimes(1)
      expect(metricsDefaultClick).toHaveBeenCalledWith('Test Button')
    })
  })
})
