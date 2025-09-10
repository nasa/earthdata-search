import React from 'react'
import { screen } from '@testing-library/react'

import { mapDispatchToProps, MetricsContainer } from '../MetricsContainer'
import * as metricsClick from '../../../middleware/metrics/actions'
import setupTest from '../../../../../../jestConfigs/setupTest'
import * as metricsEvents from '../../../middleware/metrics/events'

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
  defaultProps: {
    onMetricsClick: jest.fn()
  },
  withRouter: true
})

describe('mapDispatchToProps', () => {
  test('onMetricsClick calls metricsClick', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsClick, 'metricsClick')

    mapDispatchToProps(dispatch).onMetricsClick({ mock: 'data' })

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ mock: 'data' })
  })
})

describe('MetricsContainer component', () => {
  test('calls virtualPageView', async () => {
    const spy = jest.spyOn(metricsEvents, 'virtualPageview')

    setup()

    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith('POP')
  })

  describe('metricsClick fires onMetricsClick correctly', () => {
    test('when no title is provided', async () => {
      const { props, user } = setup()

      const button = screen.getByText('Test Link')
      await user.click(button)

      expect(props.onMetricsClick).toHaveBeenCalledTimes(1)
      expect(props.onMetricsClick).toHaveBeenCalledWith({
        elementLabel: 'Test Link'
      })
    })

    test('when a title is provided', async () => {
      const { props, user } = setup()

      const button = screen.getByText('Test Link with Title')
      await user.click(button)

      expect(props.onMetricsClick).toHaveBeenCalledTimes(1)
      expect(props.onMetricsClick).toHaveBeenCalledWith({
        elementLabel: 'Link With Title'
      })
    })

    test('when a title prop is not but, can be derived from other element props', async () => {
      const { props, user } = setup()

      const button = screen.getByText('Test Button')
      await user.click(button)

      expect(props.onMetricsClick).toHaveBeenCalledTimes(1)
      expect(props.onMetricsClick).toHaveBeenCalledWith({
        elementLabel: 'Test Button'
      })
    })
  })
})
