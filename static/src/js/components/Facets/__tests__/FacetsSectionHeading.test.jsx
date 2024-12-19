import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'
import FacetsSectionHeading from '../FacetsSectionHeading'

Enzyme.configure({ adapter: new Adapter() })

describe('FacetsSectionHeading component', () => {
  describe('renders correctly', () => {
    test('when rendering a number', () => {
      const enzymeWrapper = shallow(<FacetsSectionHeading id="facets-modal__number" letter="#" />)
      expect(enzymeWrapper).toBeDefined()
      expect(enzymeWrapper.find('#facets-modal__number').length).toEqual(1)
      expect(enzymeWrapper.text()).toEqual('#')
    })

    test('when rendering a letter', () => {
      const enzymeWrapper = shallow(<FacetsSectionHeading id="facets-modal__D" letter="D" />)
      expect(enzymeWrapper).toBeDefined()
      expect(enzymeWrapper.find('#facets-modal__D').length).toEqual(1)
      expect(enzymeWrapper.text()).toEqual('D')
    })
  })
})
