import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import EDSCModalOverlay from '../EDSCModalOverlay'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    ...overrideProps
  }

  const enzymeWrapper = shallow(<EDSCModalOverlay {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EDSCModalOverlay component', () => {
  describe('when no children are provided', () => {
    test('should render nothing', () => {
      const { enzymeWrapper } = setup()

      expect(enzymeWrapper.type()).toEqual(null)
    })
  })

  describe('when children are provided', () => {
    test('should render the overlay', () => {
      const { enzymeWrapper } = setup({
        children: <>Test</>
      })

      expect(enzymeWrapper.type()).toEqual('div')
      expect(enzymeWrapper.prop('className')).toEqual('edsc-modal-overlay')
    })
  })
})
