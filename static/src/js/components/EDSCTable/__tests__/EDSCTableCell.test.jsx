import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import EDSCTableCell from '../EDSCTableCell'

Enzyme.configure({ adapter: new Adapter() })

function setup(overrideProps) {
  const props = {
    cell: {
      value: 'test value'
    },
    ...overrideProps
  }

  const enzymeWrapper = shallow(<EDSCTableCell {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('EDSCTableCell component', () => {
  test('renders correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find('.edsc-table-cell').props().title).toEqual('test value')
    expect(enzymeWrapper.find('.edsc-table-cell__content').text()).toEqual('test value')
  })
})
