import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import moment from 'moment'

import TemporalDisplayEntry from '../TemporalDisplayEntry'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    startDate: moment('2019-03-30T00:00:00Z').utc(),
    isRecurring: false,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<TemporalDisplayEntry {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('TemporalDisplayEntry component', () => {
  test('with valid startDate renders correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.text()).toEqual('2019-03-30 00:00:00')
  })

  test('with valid endDate renders correctly', () => {
    const { enzymeWrapper } = setup({
      startDate: undefined,
      endDate: moment('2019-03-30T00:00:00Z').utc()
    })

    expect(enzymeWrapper.text()).toEqual('2019-03-30 00:00:00')
  })

  test('with valid startDate and endDate renders endDate when isRecurring is false', () => {
    const { enzymeWrapper } = setup({
      startDate: moment('2017-01-03T00:00:00Z').utc(),
      endDate: moment('2019-03-30T00:00:00Z').utc()
    })

    expect(enzymeWrapper.text()).toEqual('2019-03-30 00:00:00')
  })

  test('with valid startDate and endDate renders correctly when isRecurring is true', () => {
    const { enzymeWrapper } = setup({
      startDate: moment('2017-01-03T00:00:00Z').utc(),
      endDate: moment('2019-03-30T00:00:00Z').utc(),
      isRecurring: true
    })

    expect(enzymeWrapper.text()).toEqual('2017 - 2019')
  })
})
