
import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import AdvancedSearchDisplay from '../../../components/AdvancedSearchDisplay/AdvancedSearchDisplay'
import { AdvancedSearchDisplayContainer } from '../AdvancedSearchDisplayContainer'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    advancedSearch: {},
    onUpdateAdvancedSearch: jest.fn(),
    onChangeQuery: jest.fn()
  }

  const enzymeWrapper = shallow(<AdvancedSearchDisplayContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdvancedSearchDisplayContainer component', () => {
  test('render AdvancedSearchDisplay with the correct props', () => {
    const { enzymeWrapper, props } = setup()

    expect(enzymeWrapper.find(AdvancedSearchDisplay).props())
      .toEqual(props)
  })
})
