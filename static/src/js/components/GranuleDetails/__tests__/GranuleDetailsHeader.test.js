import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import { granuleResultsBodyProps } from './mocks'

import GranuleDetailsHeader from '../GranuleDetailsHeader'
import Skeleton from '../../Skeleton/Skeleton'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    ummJson: {},
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleDetailsHeader {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleDetailsHeader component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.type()).toBe('div')
    expect(enzymeWrapper.props().className).toEqual('row granule-details-header')
  })

  describe('when the metadata is not provided', () => {
    test('renders a loading state', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(Skeleton).length).toEqual(1)
    })
  })

  describe('when the metadata has been provided', () => {
    test('renders a title', () => {
      const { enzymeWrapper } = setup({
        ummJson: granuleResultsBodyProps.ummJson
      })
      const title = enzymeWrapper.find('.granule-details-header__title')

      expect(title.text()).toEqual('1860_1993_2050_NITROGEN.N-deposition1860.tfw')
    })
  })
})
