import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { granuleResultsBodyProps } from './mocks'

import GranuleDetailsInfo from '../GranuleDetailsInfo'
import Spinner from '../../Spinner/Spinner'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    granuleMetadata: null,
    ...overrideProps
  }

  const enzymeWrapper = shallow(<GranuleDetailsInfo {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('GranuleDetailsInfo component', () => {
  describe('when the metadata is not provided', () => {
    test('renders a loading state', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.find(Spinner).length).toEqual(1)
    })
  })

  describe('when the metadata has been provided', () => {
    test('renders the info', () => {
      const { enzymeWrapper } = setup({
        granuleMetadata: granuleResultsBodyProps.granuleMetadata
      })

      expect(enzymeWrapper.type()).toBe('div')
      expect(enzymeWrapper.prop('className')).toBe('granule-details-info')
      expect(enzymeWrapper.find('.granule-details-info__content').length).toEqual(1)
    })

    test('renders formatted granule details correctly', () => {
      const { enzymeWrapper } = setup({
        granuleMetadata: granuleResultsBodyProps.granuleMetadata
      })

      expect(enzymeWrapper.find('.granule-details-info__content').text())
        .toEqual(JSON.stringify(granuleResultsBodyProps.granuleMetadata, null, 2))
    })
  })
})
