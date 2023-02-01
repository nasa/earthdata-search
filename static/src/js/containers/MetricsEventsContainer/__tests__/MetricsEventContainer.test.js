import React from 'react'
import Enzyme, { mount } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { mapDispatchToProps, MetricsEventsContainer } from '../MetricsEventsContainer'
import * as metricsClick from '../../../middleware/metrics/actions'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onMetricsClick: jest.fn()
  }

  const enzymeWrapper = mount(<MetricsEventsContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('mapDispatchToProps', () => {
  test('onMetricsClick calls metricsClick', () => {
    const dispatch = jest.fn()
    const spy = jest.spyOn(metricsClick, 'metricsClick')

    mapDispatchToProps(dispatch).onMetricsClick({ mock: 'data' })

    expect(spy).toBeCalledTimes(1)
    expect(spy).toBeCalledWith({ mock: 'data' })
  })
})

describe('MetricsEventsContainer component', () => {
  describe('metricsClick fires onMetricsClick correctly', () => {
    test('when no title is provided', () => {
      const { enzymeWrapper } = setup()

      const el = document.createElement('a')
      el.href = '/test/href'
      el.label = 'test-label'
      el.innerHTML = 'some test html'

      enzymeWrapper.instance().metricsClick({
        currentTarget: el
      })

      expect(enzymeWrapper.props().onMetricsClick).toHaveBeenCalledTimes(1)
      expect(enzymeWrapper.props().onMetricsClick).toHaveBeenCalledWith({
        elementLabel: 'some test html'
      })
    })

    test('when a title is provided', () => {
      const { enzymeWrapper } = setup()

      const el = document.createElement('a')
      el.title = 'test-title'
      el.href = '/test/href'
      el.label = 'test-label'
      el.innerHTML = 'some test html'

      enzymeWrapper.instance().metricsClick({
        currentTarget: el
      })

      expect(enzymeWrapper.props().onMetricsClick).toHaveBeenCalledTimes(1)
      expect(enzymeWrapper.props().onMetricsClick).toHaveBeenCalledWith({
        elementLabel: 'test-title'
      })
    })
  })
})
