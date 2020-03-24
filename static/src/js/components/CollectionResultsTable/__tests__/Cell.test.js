import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import Cell from '../Cell'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    cell: {
      value: 'test value'
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<Cell {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('Cell component', () => {
  test('renders correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('div').props().title).toEqual('test value')
    expect(enzymeWrapper.find('div').props().children).toEqual('test value')
  })
})
