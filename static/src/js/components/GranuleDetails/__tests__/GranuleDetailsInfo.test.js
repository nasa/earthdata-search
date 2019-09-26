import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { granuleResultsBodyProps, formattedGranuleInformation } from './mocks'
import GranuleDetailsInfo from '../GranuleDetailsInfo'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    xml: granuleResultsBodyProps.xml
  }

  const enzymeWrapper = shallow(<GranuleDetailsInfo {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleDetailsInfo component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.prop('className')).toBe('granule-details-info')
    expect(enzymeWrapper.find('.granule-details-info__content').length).toEqual(1)
  })

  test('renders formatted granule details correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.granule-details-info__content').text()).toEqual(formattedGranuleInformation)
  })
})
