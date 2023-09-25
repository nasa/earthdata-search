import React from 'react'
import Enzyme, { shallow } from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import { Form } from 'react-bootstrap'
import { AdminRetrievalsForm } from '../AdminRetrievalsForm'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    onAdminViewRetrieval: jest.fn()
  }

  const enzymeWrapper = shallow(<AdminRetrievalsForm {...props} />)

  return {
    enzymeWrapper,
    props
  }
}

describe('AdminRetrievals component', () => {
  test('renders itself correctly', () => {
    const { enzymeWrapper } = setup()

    expect(enzymeWrapper.find(Form).length).toBe(1)
  })
})
