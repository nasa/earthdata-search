import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { GranuleFiltersHeaderContainer } from '../GranuleFiltersHeaderContainer'
import GranuleFiltersHeader from '../../../components/GranuleFilters/GranuleFiltersHeader'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    collectionMetadata: {
      title: 'Test Collection'
    }
  }

  const enzymeWrapper = shallow(<GranuleFiltersHeaderContainer {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleFiltersHeaderContainer component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBeDefined()
  })

  test('renders GranuleFiltersHeader with the correct props', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(GranuleFiltersHeader).length).toEqual(1)
    expect(enzymeWrapper.find(GranuleFiltersHeader).prop('title')).toEqual('Test Collection')
  })
})
